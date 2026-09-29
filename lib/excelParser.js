import * as XLSX from 'xlsx';

function normalizeId(raw) {
  if (raw === null || raw === undefined) return null;
  const digits = String(raw).replace(/[^0-9]/g, '');
  return digits || null;
}

function sheetToRows(buffer) {
  const wb = XLSX.read(buffer, { type: 'buffer' });
  const ws = wb.Sheets[wb.SheetNames[0]];
  return XLSX.utils.sheet_to_json(ws, { defval: '' });
}

// "Listado_de_usuarios.xlsx" -> resumen por estudiante
export function parseListadoUsuarios(buffer) {
  const rows = sheetToRows(buffer);

  return rows
    .map((r) => {
      const idRaw = r['Identificación del estudiante'] || '';
      const id = normalizeId(idRaw);
      if (!id) return null;

      return {
        id,
        idDisplay: String(idRaw).trim(),
        nombre: String(r['Nombre del estudiante'] || '').trim(),
        progreso: Number(r['Progreso']) || 0,
        tiempoTotal: r['Tiempo total'] || '',
        ultimoAcceso: r['Último acceso'] || '',
        promedioFinal: r['Promedio final'] || '',
        actividades: {
          tarea: r['Tarea'] || '',
          cuestionario: r['Cuestionario'] || '',
          foro: r['Foro'] || '',
          texto: r['Texto'] || '',
          video: r['Video'] || '',
          audio: r['Audio'] || '',
          archivo: r['Archivo'] || '',
          iframe: r['Iframe'] || '',
          scorm: r['Scorm'] || '',
        },
      };
    })
    .filter(Boolean);
}

// "Informe_de_progreso.xlsx" -> una fila por cada recurso de cada estudiante.
// Devuelve un Map<id, { datos personales, recursos: [...] }>
export function parseInformeProgreso(buffer) {
  const rows = sheetToRows(buffer);
  const byStudent = new Map();

  for (const r of rows) {
    const idRaw = r['Identificación estudiante'] || '';
    const id = normalizeId(idRaw);
    if (!id) continue;

    if (!byStudent.has(id)) {
      byStudent.set(id, {
        id,
        nombres: String(r['Nombres estudiante'] || '').trim(),
        apellidos: String(r['Apellidos estudiante'] || '')
          .replace(/\n/g, ' ')
          .replace(/\s+/g, ' ')
          .trim(),
        tipoIdentificacion: r['Tipo identificación estudiante'] || '',
        celular: r['Celular estudiante'] || '',
        correo: r['Correo electrónico estudiante'] || '',
        recursos: [],
      });
    }

    byStudent.get(id).recursos.push({
      tipo: r['Tipo recurso'] || '',
      nombre: String(r['Nombre recurso'] || '').trim(),
      estado: r['Estado recurso'] || '',
      fechaEntrega: r['Fecha de entrega del estudiante'] || '',
      evaluacion: r['Evaluación'] ?? '',
    });
  }

  return byStudent;
}

// Cruza el resumen (Listado_de_usuarios) con los datos personales
// (Informe_de_progreso: correo, celular, nombre completo)
export function mergeCourseData(summaryRows, detailMap) {
  return summaryRows.map((s) => {
    const detail = detailMap.get(s.id);
    const nombreCompleto = detail
      ? `${detail.nombres} ${detail.apellidos}`.trim()
      : s.nombre;

    return {
      ...s,
      nombreCompleto: nombreCompleto || s.nombre,
      celular: detail?.celular || '',
      correo: detail?.correo || '',
      tipoIdentificacion: detail?.tipoIdentificacion || '',
      totalRecursos: detail?.recursos?.length || 0,
    };
  });
}

export function slugify(name) {
  return String(name)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
