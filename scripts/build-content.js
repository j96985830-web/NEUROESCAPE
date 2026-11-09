#!/usr/bin/env node
/*
 * NEUROSCAPE · validación y ensamblado del contenido.
 *
 * Lee content/ (fichas, rutas, fuentes y ajustes editados desde /admin),
 * comprueba que todo sea coherente y genera data/knowledge-base.js, que es
 * el archivo que usa la aplicación. Netlify lo ejecuta en cada publicación:
 * si hay errores, la publicación se detiene y el sitio sigue mostrando la
 * última versión buena. No requiere instalar nada (solo Node.js).
 *
 * Uso local:  node scripts/build-content.js
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const errors = [];
const warnings = [];
const err = (m) => errors.push(m);
const warn = (m) => warnings.push(m);

function readJson(file) {
  try { return JSON.parse(fs.readFileSync(file, "utf8")); }
  catch (e) { err(`${path.relative(ROOT, file)}: no es un JSON válido (${e.message})`); return null; }
}
function readFolder(name) {
  const dir = path.join(ROOT, "content", name);
  if (!fs.existsSync(dir)) { err(`Falta la carpeta content/${name}`); return []; }
  return fs.readdirSync(dir).filter((f) => f.endsWith(".json")).sort().map((f) => {
    const data = readJson(path.join(dir, f));
    return data ? { file: `content/${name}/${f}`, slug: f.replace(/\.json$/, ""), data } : null;
  }).filter(Boolean);
}

const isText = (v) => typeof v === "string" && v.trim().length > 0;
const isTextList = (v) => Array.isArray(v) && v.length > 0 && v.every(isText);
const needText = (o, k, where) => { if (!isText(o[k])) err(`${where}: falta el campo «${k}» o está vacío.`); };
const needList = (o, k, where) => { if (!isTextList(o[k])) err(`${where}: «${k}» debe tener al menos un elemento y ninguno vacío.`); };
const optText = (o, k, where) => { if (o[k] !== undefined && o[k] !== null && typeof o[k] !== "string") err(`${where}: «${k}» debe ser texto.`); };

// ── Ajustes generales ────────────────────────────────────────────────────────
const settings = readJson(path.join(ROOT, "content", "settings.json")) || {};
["heroTitle", "heroLead", "globalWarning"].forEach((k) => needText(settings, k, "content/settings.json"));
needList(settings, "groupOrder", "content/settings.json");
if (typeof settings.forensicModule !== "boolean") err("content/settings.json: «forensicModule» debe ser verdadero o falso.");
const forensic = settings.forensicModule === true;

// ── Fuentes ──────────────────────────────────────────────────────────────────
const sourceFiles = readFolder("sources");
const sourceIds = new Set();
sourceFiles.forEach(({ file, slug, data }) => {
  if (data.id !== slug) err(`${file}: el id «${data.id}» debe coincidir con el nombre del archivo («${slug}»).`);
  sourceIds.add(data.id);
  ["short", "title", "authors", "edition", "use", "locator"].forEach((k) => needText(data, k, file));
  ["license", "attribution", "url"].forEach((k) => optText(data, k, file));
  if (data.url && !/^https?:\/\//.test(data.url)) err(`${file}: «url» debe empezar por http:// o https://`);
  if (typeof data.order !== "number") err(`${file}: falta «order» (número de posición).`);
});

// Protección del atlas: la atribución CC BY 4.0 no puede desaparecer.
const atlasSource = sourceFiles.find((s) => s.data.id === "nih3d");
if (!atlasSource) err("PROTEGIDO: falta la fuente «nih3d» (atribución del modelo 3D). No se puede eliminar.");
else {
  const a = atlasSource.data;
  if (a.license !== "CC BY 4.0") err("PROTEGIDO: la fuente «nih3d» debe conservar la licencia «CC BY 4.0».");
  if (!isText(a.attribution) || !/Browne/.test(a.attribution) || !/10\.48539\/HBM929\.XKCL\.339/.test(a.attribution)) err("PROTEGIDO: la fuente «nih3d» debe conservar la atribución completa (autoras y DOI).");
  if (!isText(a.url)) err("PROTEGIDO: la fuente «nih3d» debe conservar el enlace a la ficha oficial.");
}

// ── Mapeo 3D (solo lectura; lo gestiona administración técnica) ─────────────
let atlasMappings = {};
try {
  global.window = {};
  require(path.join(ROOT, "data", "atlas-mapping.js"));
  atlasMappings = global.window.NEUROSCAPE_ATLAS.mappings || {};
} catch (e) { err(`data/atlas-mapping.js no se pudo leer (${e.message}).`); }

// ── Estructuras ──────────────────────────────────────────────────────────────
const structureFiles = readFolder("structures");
const structureIds = new Set(structureFiles.map((s) => s.data.id));
structureFiles.forEach(({ file, slug, data }) => {
  if (data.id !== slug) err(`${file}: el id «${data.id}» debe coincidir con el nombre del archivo («${slug}»).`);
  ["name", "group", "location", "description", "function", "warning"].forEach((k) => needText(data, k, file));
  needList(data, "processes", file);
  needList(data, "sources", file);
  ["forensic", "interpretiveBridge"].forEach((k) => optText(data, k, file));
  if (forensic && !isText(data.forensic)) warn(`${file}: el módulo forense está activo pero esta ficha no tiene texto forense.`);
  if (!["directa", "contextual"].includes(data.evidence)) err(`${file}: «evidence» debe ser «directa» o «contextual».`);
  if (isTextList(settings.groupOrder) && !settings.groupOrder.includes(data.group)) err(`${file}: el grupo «${data.group}» no está en la lista de grupos de los ajustes.`);
  (data.connections || []).forEach((id) => { if (!structureIds.has(id)) err(`${file}: la conexión «${id}» no existe como ficha.`); if (id === data.id) err(`${file}: una ficha no puede conectarse consigo misma.`); });
  (data.sources || []).forEach((id) => { if (!sourceIds.has(id)) err(`${file}: la fuente «${id}» no existe.`); });
  const p = data.position;
  if (!p || typeof p.x !== "number" || typeof p.y !== "number" || !["surface", "deep"].includes(p.view)) err(`${file}: «position» debe tener x, y (números) y view («surface» o «deep»). Es un dato técnico: no lo cambie desde el editor.`);
  if (typeof data.order !== "number") err(`${file}: falta «order» (número de posición en el menú).`);
  if (!atlasMappings[data.id]) warn(`${file}: no tiene mapeo 3D en data/atlas-mapping.js; solo se verá en la vista didáctica (lo añade administración técnica).`);
});
Object.keys(atlasMappings).forEach((id) => { if (!structureIds.has(id)) err(`data/atlas-mapping.js: el mapeo «${id}» no tiene ficha en content/structures.`); });

// ── Rutas ────────────────────────────────────────────────────────────────────
const routeFiles = readFolder("routes");
routeFiles.forEach(({ file, slug, data }) => {
  if (data.id !== slug) err(`${file}: el id «${data.id}» debe coincidir con el nombre del archivo («${slug}»).`);
  ["number", "name", "warning"].forEach((k) => needText(data, k, file));
  optText(data, "forensic", file);
  if (!/^#[0-9a-fA-F]{6}$/.test(data.color || "")) err(`${file}: «color» debe tener formato #RRGGBB.`);
  needList(data, "structures", file);
  needList(data, "flow", file);
  needList(data, "sources", file);
  (data.structures || []).forEach((id) => { if (!structureIds.has(id)) err(`${file}: la estructura «${id}» no existe como ficha.`); });
  (data.sources || []).forEach((id) => { if (!sourceIds.has(id)) err(`${file}: la fuente «${id}» no existe.`); });
  if (forensic && !isText(data.forensic)) warn(`${file}: el módulo forense está activo pero esta ruta no tiene «puente hacia lo forense».`);
});

// ── Resultado ────────────────────────────────────────────────────────────────
warnings.forEach((m) => console.warn(`  aviso: ${m}`));
if (errors.length) {
  console.error(`\nNEUROSCAPE: el contenido tiene ${errors.length} error(es) y no se publicará:\n`);
  errors.forEach((m) => console.error(`  ✗ ${m}`));
  console.error("\nCorrija estos puntos en el editor (/admin) y vuelva a guardar.\n");
  process.exit(1);
}

const byOrder = (a, b) => (a.data.order - b.data.order) || a.slug.localeCompare(b.slug);
const data = {
  sources: sourceFiles.sort(byOrder).map((s) => s.data),
  structures: structureFiles.sort(byOrder).map((s) => s.data),
  routes: routeFiles.sort((a, b) => a.data.number.localeCompare(b.data.number, "es", { numeric: true })).map((r) => r.data),
  groupOrder: settings.groupOrder,
  globalWarning: settings.globalWarning,
  settings: { heroTitle: settings.heroTitle, heroLead: settings.heroLead, forensicModule: forensic }
};
// «order» solo sirve para ordenar; no hace falta en la interfaz.
data.sources.forEach((s) => delete s.order);
data.structures.forEach((s) => delete s.order);

const header = `/*
 * GENERADO AUTOMÁTICAMENTE por scripts/build-content.js a partir de content/.
 * No edite este archivo a mano: use el editor (/admin) o los JSON de content/.
 * Contenido educativo: no usar para diagnóstico ni dictamen.
 */
`;
fs.writeFileSync(path.join(ROOT, "data", "knowledge-base.js"), `${header}window.NEUROSCAPE_DATA = ${JSON.stringify(data, null, 2)};\n`);
console.log(`NEUROSCAPE: contenido válido · ${data.structures.length} fichas, ${data.routes.length} rutas, ${data.sources.length} fuentes · módulo forense ${forensic ? "activo" : "desactivado"}.`);
