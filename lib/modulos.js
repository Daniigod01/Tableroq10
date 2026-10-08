// ---------------------------------------------------------------
// Módulos de cada curso.
//
// Los archivos que se exportan de Q10 (Informe de progreso) NO traen la
// división por módulos, así que se define aquí a mano: por cada curso
// (clave = slug de la carpeta de Drive) se lista el nombre de cada módulo
// y los recursos que contiene, en el mismo orden que se ven en Q10.
//
// Los recursos se buscan por nombre (sin importar mayúsculas, tildes ni
// signos). Si en Q10 el nombre sale cortado con "…" o "...", se busca por
// el inicio del nombre. Los recursos que no estén en ningún módulo se
// muestran al final en "Otros recursos".
//
// Formato:
//   'slug-del-curso': [
//     {
//       nombre: 'Módulo 1. El cliente y la experiencia de servicio',
//       recursos: [
//         'Introducción al Servicio al Cliente',
//         'El nuevo consumidor: hiperconectado y exigente',
//         { t: 'Foro', n: 'Nombre repetido en dos tipos' },
//       ],
//     },
//   ],
//
// Slugs de los cursos actuales:
//   servicio-al-cliente-ventas-logistica-comercial-e-informatica-basica-para-la-insercion-laboral
//   habilidades-blandas-para-una-vida-productiva
//   gestion-comercial-servicio-y-herramientas-digitales-mayor-50
//   habilidades-para-una-nueva-etapa-de-vida-mayor-50
// ---------------------------------------------------------------
export const MODULOS = {
  'servicio-al-cliente-ventas-logistica-comercial-e-informatica-basica-para-la-insercion-laboral': [
    {
      "nombre": "Módulo 1. El cliente y la experiencia de servicio",
      "recursos": [
        "Introducción al Servicio al Cliente",
        "El nuevo consumidor: hiperconectado y exigente",
        "El nuevo cliente colombiano: entre el WhatsApp, el barrio y las redes sociales",
        "Decisiones de compra y emociones en juego",
        "Servicio al cliente: Claves para una atención de calidad",
        "El poder de la experiencia del cliente",
        "Actividad: Alfabeto del cliente y la experiencia",
        "Actividad: Conceptos clave del servicio al cliente",
        "El cliente como protagonista: co-creación y redes",
        "Tipos de cliente y cómo abordarlos",
        "La experiencia del cliente como modelo de negocio en la era digital",
        "Actividad: Cliente y experiencia de servicio",
        "La cultura del servicio en Colombia: atender personas, no solo clientes"
      ]
    },
    {
      "nombre": "Módulo 2. Proceso de ventas en contextos laborales I – Prospección y abordaje",
      "recursos": [
        {
          "t": "Foro",
          "n": "Proceso de ventas en contextos laborales"
        },
        {
          "t": "Video",
          "n": "Proceso de ventas en contextos laborales"
        },
        "¿Qué es un servicio al cliente excelente?",
        "Psicología básica del cliente en la venta",
        "Las 10 reglas de oro del servicio al cliente",
        "Cómo agregar valor desde la actitud y los detalles",
        "Actividad: Pilares del servicio al cliente",
        "Tipos de abordaje según el contexto laboral",
        "Errores comunes del “antiservicio” y cómo evitarlos",
        "Clientes difíciles: cómo escuchar y resolver conflictos",
        "Actividad: técnicas de ventas",
        "Actividad: Proceso de ventas",
        "¿Qué es el marketing Inbound?",
        "Equipos de ventas y su incidencia en el desempeño de las organizaciones",
        "La tecnología y el empleo: retos y aprendizajes"
      ]
    },
    {
      "nombre": "Módulo 3. Proceso de ventas en contextos laborales II – Presentación, objeciones y cierre",
      "recursos": [
        "Proceso de ventas en contextos laborales II",
        "El proceso de ventas en contextos laborales: presentar, escuchar y cerrar con profesionalismo",
        "El vendedor profesional: más allá de la transacción",
        "Etapas del proceso de venta centrado en la persona",
        "La escucha activa y las preguntas clave",
        "Actividad: Actitudes del vendedor",
        "Presentación efectiva del producto o servicio",
        "Manejo de objeciones en ventas",
        "Ventas cruzadas y complementarias (cross/up selling)",
        "Cuándo sí y cuándo no ofrecer ventas adicionales",
        "Cierre de ventas con confianza y respeto",
        "Actividad: Necesidades del cliente",
        "¿Qué significa para ti cerrar bien una venta?"
      ]
    },
    {
      "nombre": "Módulo 4. Técnicas de ventas aplicadas al empleo",
      "recursos": [
        "Técnicas de ventas Aplicadas al empleo",
        "Gestión de ventas: factores que aportan al éxito del vendedor",
        "Técnicas de venta más usadas en contextos laborales",
        "De la presión a la confianza",
        "El modelo universal para la persuación",
        "Marketing ganador en Whatsapp",
        "Rollplay: quintuplica tus ventas",
        "Cuándo aplicar una técnica de venta y cuándo no",
        "Conversando sobre técnicas de ventas",
        "Actividad: Situación laboral vs. técnica correcta",
        "Actividad: ¿Cómo enfocas tu estrategia de venta?",
        "Actividad: ¿Quién quiere ser millonario?",
        "Infografía: técnica de ventas",
        "Conversando sobre técnicas de ventas aplicadas al empleo"
      ]
    },
    {
      "nombre": "Módulo 5. Fundamentos de logística comercial y operación en el punto de trabajo",
      "recursos": [
        "¿Qué es logística y por qué es clave en un negocio?",
        "La logística en el punto de trabajo: orden, control y experiencia del cliente",
        "Recepción de productos e inventario básico",
        "Organización del punto de venta: orden y visibilidad",
        "Operación en el puesto de trabajo",
        "Atención omnicanal: presencial, telefónica y digital",
        "Seguimiento post-venta y fidelización del cliente",
        "Logística minorista",
        "Logística integral: de la operación a la ventaja competitiva",
        "Actividad: Ordena el proceso logístico en el punto de trabajo",
        "Actividad: Logística en el punto de trabajo",
        "Actividad: Fundamentos de la logística",
        "La logística también hace parte del servicio al cliente"
      ]
    },
    {
      "nombre": "Módulo 6. Informática básica para la inserción laboral",
      "recursos": [
        "Competencias Digitales Básicas para la Inserción Laboral",
        "Errores digitales que pueden afectar tu empleo",
        "La Informática como Herramienta para Conseguir y Mantener un Empleo",
        "Informática y Competencias Digitales",
        "¿Qué es la informática básica? PT. 1",
        "¿Qué es la informática básica? PT. 2",
        "PT. 1 | Conociendo el Computador",
        "PT. 2 | Conociendo el Computador",
        "PT 3 | Conociendo el Computador | Partes del PC y su Funcionamiento",
        "PT. 1 | Explorando Windows",
        "PT. 2 | Explorando Windows",
        "PT. 1 | Cómo Usar Bien tu Navegador Web",
        "PT. 2 | Cómo Usar Bien tu Navegador Web",
        "PT. 1 | Correo Electrónico",
        "PT. 2 | Correo Electrónico",
        "PT. 1 | Cómo redactar tu primer carta en Word",
        "PT. 2 | Cómo redactar tu primera carta en Word",
        "PT. 1 | Primeros pasos en Excel",
        "PT. 2 | Primeros pasos en Excel",
        "PT. 1 | Cómo usar Meet, Zoom y Google Calendar",
        "PT. 2 | Cómo usar Meet, Zoom y Google Calendar",
        "PT. 3 | Cómo usar Meet, Zoom y Google Calendar",
        "PT. 1 | Comunicación efectiva en la empresa",
        "PT. 2 | Comunicación efectiva en la empresa",
        "PT. 1 | Seguridad digital",
        "PT. 2 | Seguridad digital",
        "PT. 1 | Correo electrónico profesional y trato con el cliente",
        "PT. 2 | Correo electrónico profesional y trato con el cliente",
        "PT. 3 | Correo electrónico profesional y trato con el cliente",
        "PT. 1 | Usa lo aprendido",
        "PT. 2 | Usa lo aprendido",
        "Actividad: Uso básico de Windows en el trabajo",
        "Actividad: Comunicación Digital",
        "Acctividad: Seguridad Digital Básica",
        "Actividad: Ordena procesos digitales básicos"
      ]
    },
    {
      "nombre": "Talleres",
      "recursos": [
        "TALLER # 2 TECNICAS",
        "TALLER # 3 TECNICAS"
      ]
    }
  ],
  'habilidades-blandas-para-una-vida-productiva': [
    {
      "nombre": "Módulo 1. Autoconocimiento",
      "recursos": [
        "Introducción al curso",
        "Conocimientos previos",
        "Hablemos sobre autoconocimiento",
        "Autoevaluación de Autoconocimiento",
        "Creando tu historia profesional",
        "Habilidades blandas: qué son y cómo desarrollarlas",
        "Talentos y pasiones",
        "Mi historia sí cuenta",
        "Estudio de caso: Campesinos construyendo un nuevo futuro",
        "Fuerza interior: descubriendo la resiliencia",
        "Desarrolla tu resiliencia en el ámbito laboral",
        "Cuestionario de conocimiento: resiliencia",
        "Más allá del “No”: Por qué la resiliencia es tu ventaja competitiva invisible (y cómo dominarla)",
        "Estudio de caso: Humberto, una historia de resiliencia",
        "Actividad: Relaciona entre vida cotidiana y habilidades laborales"
      ]
    },
    {
      "nombre": "Módulo 2. Proyecto de vida laboral",
      "recursos": [
        "¿Qué es un proyecto de vida laboral?",
        "Mi punto de partida: Reconociendo mi realidad actual",
        "Actividad: Mapa personal de realidad laboral",
        "Actividad: Ordena las fases de un proyecto laboral",
        "El mapa hacia tu futuro",
        "Por qué tu próximo empleo no empieza con una entrevista, sino con un espejo: 5 verdades sobre el éxito laboral",
        "¿Dónde quiero estar?",
        "Actividad: ¿Es un sueño o es una meta?",
        "Guía de proyecto de vida laboral",
        "La realidad actual como base del proyecto laboral",
        "Crea tu mapa laboral",
        "Psicología del empleo",
        "Actividad: ¿Es racional o irracional? – Albert Ellis y la búsqueda de empleo"
      ]
    },
    {
      "nombre": "Módulo 3. Comunicación efectiva",
      "recursos": [
        "Decir y escuchar: la magia de la comunicación asertiva",
        "El super poder oculto",
        "Ejemplo videográfico: comunicación asertiva",
        "Cuestionario de conocimiento: comunicación asertiva",
        "Reto dinámico: estilos de comunicación",
        "Comunicación asertiva: expresa lo que sientes con respeto y confianza",
        "Psicología de la comunicación",
        "Comunicación e inclusión laboral",
        "Sopa de conceptos clave",
        "La Alquimia de mi Perfil: Traduciendo mi Talento"
      ]
    },
    {
      "nombre": "Módulo 4. Trabajo colaborativo",
      "recursos": [
        "El liderazgo empieza contigo: un camino para tu vida y tu trabajo",
        "El Camino del Líder: Transformando Equipos y Proyectos",
        "La Revolución Silenciosa: Por qué “Trabajar en Equipo” ya no es suficiente en la era digital",
        "Cartilla descargable: El camino del líder",
        "Evaluación: Cuestionario de Liderazgo"
      ]
    },
    {
      "nombre": "Módulo 5. Preparación laboral para la inserción al empleo",
      "recursos": [
        "Preparación Laboral | Cómo crear tu hoja de vida y brillar en entrevistas",
        "Autoconocimiento y Competencias Laborales: Primer Paso para Crear tu Hoja de Vida",
        "Partes de la Hoja de Vida",
        "Cómo escribir tu perfil profesional",
        "Experiencia laboral y logros",
        "Tips para presentar tu hoja de vida de forma profesional",
        "Cómo prepararte antes de una entrevista laboral",
        "Imagen personal en la entrevista de trabajo",
        "Preguntas más comunes en entrevistas de trabajo",
        "Guion de preguntas y respuestas",
        "Lenguaje corporal en entrevistas laborales",
        "Qué NO decir nunca en una entrevista laboral",
        "Cómo cerrar bien una entrevista laboral",
        "Cierre y próximos pasos: tu hoja de vida y entrevistas"
      ]
    },
    {
      "nombre": "Módulo 6. Tejiendo Verde – Competencias verdes para la sostenibilidad",
      "recursos": [
        "Tejiendo Verde: Habilidades para un mundo sostenible. | Módulo 1 - Video 1",
        "Manejo eficiente de los recursos | Módulo 1 - Video 2",
        "Fenómenos Ambientales en Colombia | Módulo 1 - Video 3",
        "¿Qué son los ODS? Objetivos de Desarrollo Sostenible | Módulo 1 - Video 4",
        "Conexión con el territorio | Módulo 2 - Video 1",
        "Mi Ecosistema Módulo | Módulo 2 - Video 2",
        "Fenómenos naturales | Módulo 2 - Video 3",
        "Huella de carbono | Módulo 3 - Video 1",
        "Huella hídrica | Módulo 3 - Video 2",
        "Economía circular | Módulo 3 - Video 3",
        "Consumo responsable | Módulo 3 - Video 4"
      ]
    },
    {
      "nombre": "Talleres",
      "recursos": [
        "TALLER # 1 Habilidades Blandas para una vida productiva"
      ]
    }
  ],
  'habilidades-para-una-nueva-etapa-de-vida-mayor-50': [
    {
      "nombre": "Inicio del curso",
      "recursos": [
        "Presentación Inicial"
      ]
    },
    {
      "nombre": "Módulo 1. Autoconocimiento y autoestima",
      "recursos": [
        "Video 1 — Identidad más allá del rol laboral",
        "Video 2 — Inventario de fortalezas y experiencia",
        "Video 3 — Autoestima y autocuidado emocional",
        "Lectura — Autoconocimiento y autoestima",
        "Cartilla — Autoconocimiento y autoestima",
        "Actividad interactiva — Explora: Autoconocimiento y autoestima",
        "Actividad interactiva — Repaso del módulo",
        "Juego — Glosario del módulo",
        "Actividad — Aplico lo aprendido",
        "Actividad — Reflexión final del módulo"
      ]
    },
    {
      "nombre": "Módulo 2. Comunicación asertiva",
      "recursos": [
        "Video — Escucha activa y empatía",
        "Video — Comunicación asertiva con respeto",
        "Video — Relaciones intergeneracionales",
        "Lectura — Comunicación asertiva",
        "Cartilla — Comunicación asertiva",
        "Actividad interactiva — Explora: Comunicación asertiva",
        "Actividad interactiva — Repaso del módulo",
        "Juego — Glosario del módulo",
        "Actividad — Aplico lo aprendido",
        "Actividad — Reflexión final del módulo"
      ]
    },
    {
      "nombre": "Módulo 3. Inteligencia emocional",
      "recursos": [
        "Video — Reconocer y nombrar las emociones",
        "Video — Manejo del estrés y la ansiedad",
        "Video — Resiliencia ante las pérdidas",
        "Cartilla — Inteligencia emocional",
        "Lectura — Inteligencia emocional",
        "Actividad interactiva — Explora: Inteligencia emocional",
        "Actividad interactiva — Repaso del módulo",
        "Juego — Glosario del módulo",
        "Actividad — Aplico lo aprendido",
        "Actividad — Reflexión final del módulo"
      ]
    },
    {
      "nombre": "Módulo 4. Adaptabilidad y aprendizaje",
      "recursos": [
        "Video — Mentalidad de crecimiento",
        "Video — Adaptación al cambio (incluye lo digital)",
        "Video — Resolución de problemas y decisiones",
        "Cartilla — Adaptabilidad y aprendizaje",
        "Lectura — Adaptabilidad y aprendizaje",
        "Actividad interactiva — Repaso del módulo",
        "Actividad interactiva — Explora: Adaptabilidad y aprendizaje",
        "Juego — Glosario del módulo",
        "Actividad — Aplico lo aprendido",
        "Actividad — Reflexión final del módulo"
      ]
    },
    {
      "nombre": "Módulo 5. Proyecto de vida y colaboración",
      "recursos": [
        "Video — Propósito y sentido de vida",
        "Video — Trabajo en equipo y redes de apoyo",
        "Video — Plan de acción personal",
        "Lectura — Proyecto de vida y colaboración",
        "Cartilla — Proyecto de vida y colaboración",
        "Actividad interactiva — Explora: Proyecto de vida y colaboración",
        "Actividad interactiva — Repaso del módulo",
        "Juego — Glosario del módulo",
        "Actividad — Aplico lo aprendido",
        "Actividad — Reflexión final del módulo"
      ]
    },
    {
      "nombre": "Talleres",
      "recursos": [
        "TALLER – HABILIDADES BLANDAS PARA UNA VIDA PRODUCTIVA"
      ]
    }
  ],
  'gestion-comercial-servicio-y-herramientas-digitales-mayor-50': [
    {
      "nombre": "Inicio del curso",
      "recursos": [
        "PRESENTACION INICIAL"
      ]
    },
    {
      "nombre": "Módulo 1: El cliente y la experiencia de servicio",
      "recursos": [
        "Conceptos de ventas y tipos de clientes",
        "Conceptos de ventas y tipos de clientes: en la práctica",
        "Perfil del vendedor y actitud de servicio",
        "Perfil del vendedor y actitud de servicio: en la práctica",
        "Protocolos básicos de atención",
        "Protocolos básicos de atención: en la práctica",
        "Lectura — El cliente y el servicio",
        "El cliente y el servicio",
        "Explora: El cliente y el servicio",
        "El cliente y el servicio",
        "Repaso del módulo",
        "Unir pares",
        "Glosario del módulo",
        "Aplico lo aprendido (parte A)",
        "Aplico lo aprendido (parte B)"
      ]
    },
    {
      "nombre": "Módulo 2: Proceso de ventas I - Prospección y abordaje",
      "recursos": [
        "Identificación de clientes potenciales",
        "Identificación de clientes potenciales: en la práctica",
        "Preparación para el contacto comercial",
        "Preparación para el contacto comercial: en la práctica",
        "Primer acercamiento y comunicación",
        "Primer acercamiento y comunicación: en la práctica",
        "Lectura — Prospección y abordaje",
        "Cartilla interactiva — Prospección y abordaje",
        "Actividad interactiva — Prospección y abordaje",
        "Actividad interactiva — Explora: Prospección y abordaje",
        "Actividad interactiva — Repaso del módulo",
        "Unir pares",
        "Glosario del módulo",
        "Aplico lo aprendido (parte A)",
        "Aplico lo aprendido (parte B)"
      ]
    },
    {
      "nombre": "Módulo 3: Proceso de ventas II - Presentación, objeciones y cierre",
      "recursos": [
        "Presentación de productos o servicios",
        "Presentación de productos o servicios: en la práctica",
        "Manejo de objeciones y cierre",
        "Manejo de objeciones y cierre: en la práctica",
        "Postventa y orientación a resultados",
        "Postventa y orientación a resultados: en la práctica",
        "Lectura — Presentación y cierre",
        "Cartilla interactiva — Presentación y cierre",
        "Actividad interactiva — Presentación y cierre",
        "Explora: Presentación y cierre",
        "Repaso del módulo",
        "Unir pares",
        "Glosario del módulo",
        "Aplico lo aprendido (parte A)",
        "Aplico lo aprendido (parte B)"
      ]
    },
    {
      "nombre": "Módulo 4: Técnicas de ventas aplicada al empleo",
      "recursos": [
        "Ventas cruzadas y complementarias",
        "Ventas cruzadas y complementarias: en la práctica",
        "Generación de valor para el cliente",
        "Generación de valor para el cliente: en la práctica",
        "Adaptación a distintos escenarios",
        "Adaptación a distintos escenarios: en la práctica",
        "Lectura — Técnicas de venta",
        "Cartilla interactiva — Técnicas de venta",
        "Actividad interactiva — Técnicas de venta",
        "Explora: Técnicas de venta",
        "Repaso del módulo",
        "Unir pares",
        "Glosario del módulo",
        "Aplico lo aprendido (parte A)",
        "Aplico lo aprendido (parte B)"
      ]
    },
    {
      "nombre": "Módulo 5: Fundamentos de logística comercial",
      "recursos": [
        "Organización del punto y manejo de inventarios",
        "Organización del punto y manejo de inventarios: en la práctica",
        "Control, registro y flujo de mercancía",
        "Control, registro y flujo de mercancía: en la práctica",
        "Seguimiento postventa y uso de recursos",
        "Seguimiento postventa y uso de recursos: en la práctica",
        "Lectura — Logística comercial",
        "Cartilla interactiva — Logística comercial",
        "Actividad interactiva — Logística comercial",
        "Explora: Logística comercial",
        "Repaso del módulo",
        "Unir pares",
        "Glosario del módulo",
        "Aplico lo aprendido (parte A)",
        "Aplico lo aprendido (parte B)"
      ]
    },
    {
      "nombre": "Módulo 6: Informática básica para la inserción laboral",
      "recursos": [
        "Computador, sistema operativo e internet seguro",
        "Computador, sistema operativo e internet seguro: en la práctica",
        "Correo, procesador de texto y hojas de cálculo",
        "Correo, procesador de texto y hojas de cálculo: en la práctica",
        "Nociones de seguridad digital",
        "Nociones de seguridad digital: en la práctica",
        "Lectura — Herramientas digitales",
        "Herramientas digitales",
        "Actividad interactiva — Herramientas digitales",
        "Explora: Herramientas digitales",
        "Unir pares",
        "Glosario del módulo",
        "Aplico lo aprendido (parte A)",
        "Aplico lo aprendido (parte B)"
      ]
    },
    {
      "nombre": "Talleres",
      "recursos": [
        "TALLER – GESTIÓN COMERCIAL, SERVICIO Y HERRAMIENTAS DIGITALES"
      ]
    }
  ],
};

export function normName(s) {
  return String(s || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

// Devuelve [{ nombre, recursos: [...] }] con los recursos del estudiante
// agrupados por módulo. Sin configuración para el curso, devuelve un único
// grupo sin nombre con todos los recursos.
export function groupByModules(slug, recursos) {
  const config = MODULOS[slug];
  if (!config || config.length === 0) {
    return [{ nombre: null, recursos }];
  }

  const used = new Set();
  // Cada entrada es un texto con el nombre del recurso, o { t: 'Foro', n: 'nombre' }
  // cuando el mismo nombre existe en dos tipos distintos (ej. un Foro y un Video).
  const findResource = (entry) => {
    const rawName = typeof entry === 'string' ? entry : entry.n;
    const tipo = typeof entry === 'string' ? null : String(entry.t).toLowerCase();
    const truncated = /(…|\.\.\.)\s*$/.test(rawName);
    const target = normName(rawName);
    for (let i = 0; i < recursos.length; i++) {
      if (used.has(i)) continue;
      if (tipo && String(recursos[i].tipo).toLowerCase() !== tipo) continue;
      const n = normName(recursos[i].nombre);
      if (n === target || (truncated && n.startsWith(target))) {
        used.add(i);
        return recursos[i];
      }
    }
    return null;
  };

  const groups = config.map((m) => ({
    nombre: m.nombre,
    recursos: m.recursos.map(findResource).filter(Boolean),
  }));

  // Hay recursos que se llaman igual en varios módulos (p. ej. "Unir pares").
  // El informe de Q10 no dice a qué módulo pertenece cada uno, así que, si un
  // estudiante terminó solo algunos, se asume que avanzó en orden (los
  // terminados van en los primeros módulos) y se marcan como aproximados.
  const hecho = (r) =>
    ['finalizado', 'realizado', 'entregada'].includes(String(r.estado || '').toLowerCase());
  const slots = new Map();
  groups.forEach((g, gi) =>
    g.recursos.forEach((r, ri) => {
      const k = String(r.tipo).toLowerCase() + '|' + normName(r.nombre);
      if (!slots.has(k)) slots.set(k, []);
      slots.get(k).push([gi, ri]);
    })
  );
  for (const list of slots.values()) {
    if (list.length < 2) continue;
    if (new Set(list.map(([gi]) => gi)).size < 2) continue; // todos en el mismo módulo
    const items = list.map(([gi, ri]) => groups[gi].recursos[ri]);
    const nHechos = items.filter(hecho).length;
    if (nHechos === 0 || nHechos === items.length) continue; // sin ambigüedad
    const ordenados = [...items.filter(hecho), ...items.filter((r) => !hecho(r))];
    list.forEach(([gi, ri], i) => {
      groups[gi].recursos[ri] = { ...ordenados[i], aproximado: true };
    });
  }

  const rest = recursos.filter((_, i) => !used.has(i));
  if (rest.length > 0) groups.push({ nombre: 'Otros recursos', recursos: rest });

  return groups.filter((g) => g.recursos.length > 0);
}
