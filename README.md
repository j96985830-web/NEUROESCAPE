# NEUROSCAPE · guía de administración técnica

Explorador neuropsicológico interactivo (atlas 3D NIH/Allen + vista didáctica). El **contenido** (fichas, rutas, fuentes, textos) vive en `content/` y lo editan los docentes desde `/admin`, sin código. La **aplicación** (`js/`, `css/`, `data/atlas-mapping.js`, `assets/`) y el modelo 3D quedan para administración técnica.

## Estructura

| Carpeta / archivo | Qué es | ¿Quién lo toca? |
|---|---|---|
| `content/structures/*.json` | Una ficha por estructura | Docentes (editor) |
| `content/routes/*.json` | Una ruta por archivo | Docentes (editor) |
| `content/sources/*.json` | Una fuente por archivo | Docentes (editor) |
| `content/settings.json` | Portada, advertencia global, grupos, interruptor del módulo forense | Docentes (editor) |
| `admin/` | Editor de formularios (Decap CMS) | Administración |
| `scripts/build-content.js` | Valida `content/` y genera `data/knowledge-base.js` | Administración |
| `data/knowledge-base.js` | **Generado.** No editar a mano | Nadie |
| `data/atlas-mapping.js`, `assets/*.glb` | Mapeo 3D auditado y modelo NIH | Administración |
| `netlify.toml` | Ejecuta el validador en cada publicación | Administración |

## Puesta en marcha (una sola vez)

1. **Repositorio.** Cree una cuenta de GitHub y un repositorio (puede ser privado). Suba **el contenido** de esta carpeta (no la carpeta contenedora), conservando las subcarpetas.
2. **Dirección del repositorio en el editor.** En `admin/config.yml` cambie `repo: USUARIO/REPOSITORIO` y las dos líneas `REEMPLAZAR-CON-LA-DIRECCION-DEL-SITIO`.
3. **Enlazar Netlify.** En el proyecto existente: *Project configuration → Build & deploy → Continuous deployment → Repository → Link repository*, y elija el repositorio. Netlify leerá `netlify.toml`. Desde entonces cada cambio guardado en GitHub vuelve a publicar el sitio.
4. **Inicio de sesión del editor.**
   - En GitHub: *Settings → Developer settings → OAuth Apps → New OAuth App*. Use como *Authorization callback URL* `https://api.netlify.com/auth/done` y genere un *Client Secret*.
   - En Netlify: *Site configuration → Access & security → OAuth → Authentication Providers → Install Provider → GitHub*, y pegue el *Client ID* y el *Client Secret*.
5. **Docentes.** En GitHub: *Settings → Collaborators → Add people*, con permiso de **escritura**. Cada docente necesita su propia cuenta gratuita de GitHub.
6. **Prueba.** Entre a `https://SU-SITIO.netlify.app/admin/`, inicie sesión con GitHub, edite algo menor y siga el flujo hasta publicar.

> Se evitó a propósito *Netlify Identity + Git Gateway*: Netlify marca Git Gateway como obsoleto. El cambio futuro a otro método de inicio de sesión solo afecta la sección `backend` de `admin/config.yml`, no el contenido.

## Qué protege el validador

`scripts/build-content.js` se ejecuta en cada publicación. Si algo falla, **Netlify no publica** y el sitio conserva la última versión buena; el mensaje del error aparece en el registro del despliegue. Comprueba, entre otras cosas:

- campos obligatorios, textos no vacíos, nivel de evidencia válido, color `#RRGGBB`;
- que toda conexión, estructura y fuente referenciada exista;
- que cada ficha tenga al menos una fuente;
- **protegido:** la fuente `nih3d` debe existir con licencia `CC BY 4.0`, autoras, DOI y enlace (la atribución del atlas no puede perderse);
- que cada mapeo 3D tenga su ficha.

Los docentes **no pueden crear ni eliminar fichas** de estructuras (cada una exige un mapeo 3D auditado) ni ven los campos técnicos (`id`, `order`, `position`).

## Tareas de administración

- **Añadir una estructura nueva:** (1) añadir su mapeo auditado en `data/atlas-mapping.js`; (2) crear `content/structures/<id>.json` copiando una ficha existente (`id` = nombre del archivo, `order` y `position` incluidos); (3) subir. Sin mapeo 3D solo aparece en la vista didáctica (el validador lo avisa).
- **Cambiar los grupos del menú:** edite `groupOrder` en `content/settings.json` **y** la lista de opciones de «Grupo» en `admin/config.yml`.
- **Probar en su computador:** `INICIAR-NEUROSCAPE.cmd` (Windows, requiere Python) o `./iniciar-neuroscape.sh` (Mac/Linux). El atlas 3D no funciona abriendo `index.html` con doble clic.
- **Validar sin publicar:** `node scripts/build-content.js`.

## Límites actuales (honestos)

- El editor limita lo que ve un docente, pero con el backend de GitHub todo colaborador con escritura puede, técnicamente, modificar cualquier archivo desde GitHub. Para proteger `js/`, `css/`, `data/`, `assets/` y `admin/` de forma estricta se pueden añadir reglas del repositorio (`CODEOWNERS` y protección de rama); no se activó para no complicar el flujo de los docentes.
- El interruptor del módulo forense es **global**. Un ajuste por curso o grupo llegará con la fase de cursos.
- Todavía no hay cuentas propias de estudiantes ni analítica de uso (fase posterior; implica datos personales).
