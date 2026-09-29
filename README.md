# Tablero Q10 — Colsubsidio

Tablero privado que muestra el progreso y las notas de los estudiantes de 3
cursos específicos de Q10, sin exponer la IP ni ningún dato fuera de lo
necesario. Se alimenta de los archivos `Listado_de_usuarios.xlsx` e
`Informe_de_progreso.xlsx` que exportas manualmente desde Q10 y subes a una
carpeta de Google Drive; el sistema los revisa automáticamente cada hora.

## Cómo funciona

```
Google Drive (una subcarpeta por curso)
        │  (revisado cada hora por un Cron Job de Vercel)
        ▼
  Procesamiento (lee los Excel, cruza los datos, quita lo que no quieres mostrar)
        ▼
  Vercel KV (base de datos donde queda guardado el resultado)
        ▼
  Tablero web protegido con clave (resumen por curso + detalle por estudiante)
```

## 1. Organiza tu carpeta de Google Drive

Crea una carpeta raíz en Drive, y dentro de ella **una subcarpeta por cada
curso** (el nombre de la subcarpeta es el que se mostrará en el tablero).
Dentro de cada subcarpeta de curso, sube los dos archivos que exportas de
Q10 — el sistema los reconoce por que su nombre contiene `listado_de_usuarios`
o `informe_de_progreso` (no importan mayúsculas/minúsculas ni el resto del
nombre):

```
📁 Cursos Colsubsidio                <- esta es tu DRIVE_FOLDER_ID
  📁 Servicio al Cliente Ventas Logística...
      📄 Listado_de_usuarios.xlsx
      📄 Informe_de_progreso.xlsx
  📁 Gestión Comercial Servicio y Herramientas Digitales MAYOR 50
      📄 Listado_de_usuarios.xlsx
      📄 Informe_de_progreso.xlsx
  📁 Habilidades para una nueva etapa de vida MAYOR 50
      📄 Listado_de_usuarios.xlsx
      📄 Informe_de_progreso.xlsx
```

Cada vez que quieras actualizar los datos, simplemente vuelve a exportar
esos dos archivos de Q10 y súbelos a la subcarpeta del curso correspondiente,
reemplazando los anteriores (o dejando los nuevos con el mismo patrón de
nombre — el sistema toma el primero que encuentre, así que es más simple
reemplazar el archivo existente en vez de acumular varios).

## 2. Crea el Service Account de Google (para que el sistema pueda leer Drive)

1. Ve a [Google Cloud Console](https://console.cloud.google.com/) y crea un
   proyecto (o usa uno existente).
2. Habilita la **Google Drive API** (menú "APIs y servicios" → "Habilitar
   APIs y servicios" → busca "Google Drive API" → Habilitar).
3. Ve a "IAM y administración" → "Cuentas de servicio" → "Crear cuenta de
   servicio". Dale cualquier nombre (ej. `tablero-q10-drive`).
4. Una vez creada, entra a la cuenta de servicio → pestaña "Claves" →
   "Agregar clave" → "Crear clave nueva" → tipo **JSON**. Se descargará un
   archivo `.json`.
5. Abre ese archivo y copia el valor del campo `"client_email"` (algo como
   `tablero-q10-drive@tu-proyecto.iam.gserviceaccount.com`).
6. En Google Drive, comparte tu carpeta raíz ("Cursos Colsubsidio") con ese
   correo, dándole permiso de **Lector**.
7. Convierte el archivo `.json` completo a base64 en una sola línea:

   - **Mac/Linux:**
     ```bash
     base64 -w 0 ruta/a/tu-archivo.json
     ```
   - **Windows (PowerShell):**
     ```powershell
     [Convert]::ToBase64String([IO.File]::ReadAllBytes("ruta\a\tu-archivo.json"))
     ```

   Copia el resultado — eso va en la variable `GOOGLE_SERVICE_ACCOUNT_BASE64`.

8. El ID de tu carpeta raíz (`DRIVE_FOLDER_ID`) es la parte final de la URL
   cuando la abres en el navegador:
   `https://drive.google.com/drive/folders/`**`ESTE_ES_EL_ID`**

## 3. Sube el proyecto a GitHub e impórtalo en Vercel

1. Sube esta carpeta a un repositorio nuevo en tu GitHub.
2. En [vercel.com](https://vercel.com), "Add New..." → "Project" → importa
   ese repositorio.

## 4. Activa la base de datos (Vercel KV / Upstash Redis)

En el proyecto ya importado en Vercel: pestaña **Storage** → "Create
Database". Según cuándo leas esto, Vercel te mostrará la opción como **KV**
o como **Redis (by Upstash)** desde el Marketplace — cualquiera de las dos
funciona igual para este proyecto. Al conectarla, Vercel agrega
automáticamente las variables `KV_REST_API_URL` y `KV_REST_API_TOKEN` (y a
veces `KV_URL` / `KV_REST_API_READ_ONLY_TOKEN`) que necesita el código — no
tienes que copiarlas a mano. Si en tu cuenta solo aparece la opción
"Upstash Redis" y **no** te agrega variables que empiecen con `KV_`, avísame
para ajustar dos líneas del código a los nombres `UPSTASH_REDIS_REST_URL` /
`UPSTASH_REDIS_REST_TOKEN` en su lugar.

## 5. Configura las variables de entorno

En el proyecto de Vercel: **Settings → Environment Variables**, agrega:

| Variable | Valor |
|---|---|
| `DASHBOARD_PASSWORD` | La clave que le darás a la persona de Colsubsidio |
| `SESSION_SECRET` | Una cadena aleatoria larga (ver `.env.example` para generarla) |
| `CRON_SECRET` | Otra cadena aleatoria larga |
| `DRIVE_FOLDER_ID` | El ID de tu carpeta raíz de Drive (paso 2.8) |
| `GOOGLE_SERVICE_ACCOUNT_BASE64` | El base64 que generaste en el paso 2.7 |

Redespliega el proyecto después de agregar las variables (Vercel lo pide
automáticamente).

## 6. Configura la actualización cada hora (cron externo — plan Hobby)

**En el plan gratuito (Hobby) de Vercel, un Cron Job no puede ejecutarse
más de una vez al día — si lo intentas declarar en `vercel.json`, Vercel
directamente rechaza el despliegue.** Por eso este proyecto NO trae un
cron interno: la actualización cada hora se dispara desde un servicio
externo gratuito, [cron-job.org](https://cron-job.org), que simplemente
llama a tu endpoint `/api/cron/sync` una vez por hora.

1. Crea una cuenta gratuita en [cron-job.org](https://console.cron-job.org/signup).
2. "Create cronjob" → completa:
   - **Title:** `Sync tablero Q10` (o el nombre que quieras)
   - **URL:** `https://tu-proyecto.vercel.app/api/cron/sync` (usa tu dominio real de Vercel)
   - **Schedule:** "Every hour" (o el patrón `0 * * * *`)
   - **Request method:** `POST`
3. Antes de guardar, abre la sección **"Advanced"** (o "Headers") del
   formulario y agrega un header personalizado:
   - **Nombre del header:** `Authorization`
   - **Valor:** `Bearer TU_CRON_SECRET` (el mismo valor exacto que pusiste
     en la variable de entorno `CRON_SECRET` en Vercel — respeta
     mayúsculas/minúsculas y el espacio después de `Bearer`)
4. Guarda. cron-job.org te deja "Test run" el cronjob manualmente para
   confirmar que responde `200 OK` antes de esperar a la primera
   ejecución automática.

Con esto, tu tablero se actualiza cada hora sin que tengas que pagar el
plan Pro de Vercel. Si en algún momento migras a Pro, puedes volver a
declarar el cron directamente en `vercel.json` y desactivar el de
cron-job.org — ambos caminos llaman al mismo endpoint, así que no hay
conflicto en tenerlos simultáneamente si alguna vez quieres los dos como
respaldo.

### Botón "Actualizar ahora"

Además del cron automático, la portada del dashboard tiene un botón
**"Actualizar ahora"** junto a "Última actualización". Cualquier usuario
ya logueado puede pulsarlo para forzar la sincronización con Drive en
ese momento (por ejemplo, justo después de subir un Excel nuevo), sin
esperar hasta la siguiente pasada horaria del cron. Llama al endpoint
`/api/sync-now`, protegido con la misma sesión del dashboard (no
necesita el `CRON_SECRET`).

## 7. Comparte el acceso

Una vez desplegado, la URL para el externo de Colsubsidio es la raíz de tu
proyecto, por ejemplo `https://tu-proyecto.vercel.app` — les pedirá la
clave (`DASHBOARD_PASSWORD`) antes de mostrar nada.

## Desarrollo local

```bash
npm install
cp .env.example .env.local   # y completa los valores
npm run dev
```

Para probar la sincronización localmente sin esperar al cron, puedes
llamarla a mano:

```bash
curl -X POST http://localhost:3000/api/cron/sync \
  -H "Authorization: Bearer TU_CRON_SECRET"
```

## Qué datos se muestran y cuáles no

- **Se muestran:** nombre completo, identificación, correo, celular,
  progreso %, promedio final, tiempo total, último acceso, y el detalle de
  cada recurso del curso (video, taller, foro, etc.) con su estado.
- **No se muestran:** dirección IP — no viene en ninguno de los dos
  archivos exportados por Q10, así que no hay que filtrarla — ni ningún
  otro dato fuera de estas columnas, porque el backend solo lee y guarda
  los campos listados arriba.
