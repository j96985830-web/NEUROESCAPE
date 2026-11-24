/*
 * Adaptador progresivo para el GLB oficial de NIH 3D.
 * Mantiene la vista didáctica 2D como respaldo: no sustituye el prototipo base.
 */
window.NEUROSCAPE_3D = (() => {
  const atlas = window.NEUROSCAPE_ATLAS;
  const MODEL_URL = atlas?.model?.localUrl;
  const HIGHLIGHT = 0xf8c75b;
  const ROUTE = 0x9d8cff;
  const nodePriority = ["hipocampo", "amigdala", "talamo", "hipotalamo", "calloso", "cerebelo", "temporal", "prefrontal", "frontal", "limbico"];
  const DEEP_STRUCTURE_IDS = new Set(
    (window.NEUROSCAPE_DATA?.structures || [])
      .filter((structure) => structure.position?.view === "deep")
      .map((structure) => structure.id)
  );
  let runtime = null;
  const REST_LAYER = "__resto";
  // Ejes del GLB (auditados en data/atlas-mapping.js): X izquierda(−)/derecha(+), Y abajo/arriba, Z posterior(−)/anterior(+).
  const CLIP_PLANES = [
    { id: "sagittal", axis: "x", label: "Plano sagital", hint: "izquierda ↔ derecha", sides: ["Conservar lado derecho", "Conservar lado izquierdo"] },
    { id: "coronal", axis: "z", label: "Plano coronal", hint: "posterior ↔ anterior", sides: ["Conservar parte anterior", "Conservar parte posterior"] },
    { id: "axial", axis: "y", label: "Plano axial", hint: "inferior ↔ superior", sides: ["Conservar parte superior", "Conservar parte inferior"] }
  ];
  const VIEW_PRESETS = {
    front: { yaw: 0, pitch: 0.08 }, back: { yaw: Math.PI, pitch: 0.08 },
    right: { yaw: Math.PI / 2, pitch: 0.08 }, left: { yaw: -Math.PI / 2, pitch: 0.08 },
    top: { yaw: 0, pitch: 1.45 }, bottom: { yaw: 0, pitch: -1.45 }
  };
  let loading = null;
  let latestOptions = null;

  function normalizeHemisphereOpacity(value = {}) {
    const normalize = (opacity) => Math.max(0.08, Math.min(1, Number.isFinite(opacity) ? opacity : 1));
    return { left: normalize(value.left), right: normalize(value.right) };
  }

  function render({ failed = false, hemisphereOpacity = { left: 1, right: 1 }, presentation = "normal", isDeepSelected = false, canIsolate = false, clip = null, hiddenGroups = [], hiddenStructures = [], selectedId = null, studioOpen = false } = {}) {
    const message = failed ? "No fue posible cargar la copia local del atlas." : "Preparando atlas anatómico oficial…";
    const opacity = normalizeHemisphereOpacity(hemisphereOpacity);
    const leftPercent = Math.round(opacity.left * 100);
    const rightPercent = Math.round(opacity.right * 100);
    const stateLabel = presentation === "isolate"
      ? "Aislamiento activo: se muestra únicamente la estructura seleccionada."
      : presentation === "internal"
        ? "Vista interna automática: atenúa los hemisferios que contienen la selección; la estructura profunda resaltada se conserva sólida."
        : "Atlas normal: cada control ajusta únicamente las estructuras de su hemisferio anatómico correspondiente.";
    return `<div class="atlas3d-stage" data-atlas3d-stage aria-label="Atlas tridimensional del encéfalo"><div class="atlas3d-grid" aria-hidden="true"></div><div class="atlas3d-status" data-atlas3d-status><span class="atlas3d-pulse"></span><p>${message}</p><small>El modelo se carga desde una copia local atribuida a NIH 3D.</small></div><div class="atlas3d-canvas" data-atlas3d-canvas></div><div class="atlas3d-toolbox"><div class="atlas3d-opacity-grid" aria-label="Opacidad por hemisferio"><label class="atlas3d-opacity"><span>Hemisferio izquierdo <output data-hemisphere-opacity-output="left">${leftPercent}%</output></span><input type="range" min="8" max="100" step="1" value="${leftPercent}" data-action="set-hemisphere-opacity" data-side="left" aria-label="Opacidad del hemisferio anatómico izquierdo" /></label><label class="atlas3d-opacity"><span>Hemisferio derecho <output data-hemisphere-opacity-output="right">${rightPercent}%</output></span><input type="range" min="8" max="100" step="1" value="${rightPercent}" data-action="set-hemisphere-opacity" data-side="right" aria-label="Opacidad del hemisferio anatómico derecho" /></label></div><p class="atlas3d-laterality-note">Lateralidad anatómica del cerebro, no de la pantalla.</p><div class="atlas3d-view-actions" role="group" aria-label="Visualización de estructuras internas"><button type="button" class="icon-button ${presentation === "internal" ? "is-selected" : ""}" data-action="use-internal-view" aria-pressed="${presentation === "internal"}" ${isDeepSelected ? "" : "disabled"}>Vista interna</button><button type="button" class="icon-button ${presentation === "isolate" ? "is-selected" : ""}" data-action="isolate-selection" aria-pressed="${presentation === "isolate"}" ${canIsolate ? "" : "disabled"}>Aislar selección</button><button type="button" class="icon-button" data-action="show-all">Mostrar todo</button></div><p class="atlas3d-view-state">${stateLabel}</p></div><div class="atlas3d-legend"><i></i> Selección · <b>violeta</b> ruta activa</div><div class="atlas3d-controls"><button type="button" class="icon-button" data-action="reset-view" title="Restablecer cámara">↺</button></div></div>${studioPanel({ clip, hiddenGroups, hiddenStructures, selectedId, studioOpen })}`;
  }

  function setStatus(host, message, isError = false) {
    const status = host?.querySelector("[data-atlas3d-status]");
    if (!status) return;
    status.classList.toggle("is-error", isError);
    status.innerHTML = `<span class="atlas3d-pulse"></span><p>${message}</p>${isError ? "" : "<small>Puede tardar un momento en una conexión lenta.</small>"}`;
  }

  function hideStatus(host) {
    host?.querySelector("[data-atlas3d-status]")?.classList.add("is-hidden");
  }

  function buildNodeIndex() {
    const index = new Map();
    const mappings = atlas?.mappings || {};
    [...nodePriority, ...Object.keys(mappings).filter((id) => !nodePriority.includes(id))].forEach((structureId) => {
      (mappings[structureId]?.nodes || []).forEach((node) => {
        if (!index.has(node)) index.set(node, structureId);
      });
    });
    return index;
  }

  function materialsOf(mesh) {
    return Array.isArray(mesh.material) ? mesh.material : [mesh.material];
  }

  function snapshotMaterial(material) {
    return {
      color: material.color?.clone(),
      emissive: material.emissive?.clone(),
      opacity: material.opacity,
      transparent: material.transparent,
      depthTest: material.depthTest,
      depthWrite: material.depthWrite,
      emissiveIntensity: material.emissiveIntensity,
      side: material.side
    };
  }

  function captureMaterials(scene) {
    const snapshots = new Map();
    scene.traverse((object) => {
      if (!object.isMesh || !object.material) return;
      object.material = Array.isArray(object.material) ? object.material.map((material) => material.clone()) : object.material.clone();
      snapshots.set(object, { visible: object.visible, materials: materialsOf(object).map(snapshotMaterial) });
    });
    return snapshots;
  }

  function resetMaterials() {
    if (!runtime) return;
    runtime.snapshots.forEach((snapshotState, mesh) => {
      mesh.renderOrder = 0;
      mesh.visible = snapshotState.visible;
      materialsOf(mesh).forEach((material, index) => {
        const snapshot = snapshotState.materials[index];
        if (!snapshot) return;
        if (snapshot.color && material.color) material.color.copy(snapshot.color);
        if (snapshot.emissive && material.emissive) material.emissive.copy(snapshot.emissive);
        material.opacity = snapshot.opacity;
        material.transparent = snapshot.transparent;
        material.depthTest = snapshot.depthTest;
        material.depthWrite = snapshot.depthWrite;
        if (snapshot.side !== undefined) material.side = snapshot.side;
        if ("emissiveIntensity" in material) material.emissiveIntensity = snapshot.emissiveIntensity;
        material.needsUpdate = true;
      });
    });
  }

  function objectsForNodes(nodeNames) {
    if (!runtime) return [];
    const result = new Set();
    nodeNames.forEach((name) => {
      const root = runtime.namedObjects.get(name);
      if (!root) return;
      root.traverse((object) => { if (object.isMesh) result.add(object); });
      if (root.isMesh) result.add(root);
    });
    return [...result];
  }

  function isDeepStructure(structureId) {
    return DEEP_STRUCTURE_IDS.has(structureId);
  }

  function namedHemisphereFor(object) {
    let current = object;
    while (current) {
      if (/_L$/.test(current.name || "")) return "left";
      if (/_R$/.test(current.name || "")) return "right";
      current = current.parent;
    }
    return null;
  }

  function hierarchyHemisphereFor(object) {
    let current = object;
    while (current) {
      if (current.name === "Allen_brain_Hemisphere_L") return "left";
      if (current.name === "Allen_brain_Hemisphere_R") return "right";
      current = current.parent;
    }
    return null;
  }

  function hemisphereForMesh(mesh) {
    // El sufijo lateral real del atlas tiene prioridad: seis nodos _L están
    // alojados bajo el contenedor _R en este GLB (ver HEMISPHERE-AUDIT.md).
    return namedHemisphereFor(mesh) || hierarchyHemisphereFor(mesh);
  }

  function applyHemisphereOpacity(values) {
    if (!runtime) return;
    const opacityBySide = normalizeHemisphereOpacity(values);
    ["left", "right"].forEach((side) => {
      const opacity = opacityBySide[side];
      runtime.hemisphereMeshes[side].forEach((mesh) => {
      if (!mesh.visible) return;
      materialsOf(mesh).forEach((material) => {
        material.transparent = opacity < 0.999 || material.transparent;
        material.opacity = Math.min(material.opacity, opacity);
        if (opacity < 0.999) material.depthWrite = false;
        material.needsUpdate = true;
      });
    });
    });
  }

  function hemispheresForStructure(structureId) {
    if (!runtime) return [];
    const sides = new Set();
    objectsForNodes(atlas?.mappings?.[structureId]?.nodes || []).forEach((mesh) => {
      const side = runtime.meshHemisphere.get(mesh);
      if (side) sides.add(side);
    });
    return [...sides];
  }

  function isolateSelection(structureId) {
    const selectedMeshes = new Set(objectsForNodes(atlas?.mappings?.[structureId]?.nodes || []));
    if (!selectedMeshes.size) return false;
    runtime.meshes.forEach((mesh) => { mesh.visible = selectedMeshes.has(mesh); });
    return true;
  }

  function tint(structureId, color, selected = false) {
    const mapping = atlas?.mappings?.[structureId];
    if (!mapping?.nodes?.length) return;
    objectsForNodes(mapping.nodes).forEach((mesh) => {
      if (selected) mesh.renderOrder = 2;
      materialsOf(mesh).forEach((material) => {
        if (material.color) material.color.setHex(color);
        if (material.emissive) {
          material.emissive.setHex(color);
          material.emissiveIntensity = selected ? 0.26 : 0.12;
        }
        material.transparent = true;
        material.opacity = selected ? 0.96 : 0.82;
        // Permite localizar estructuras profundas (hipocampo, amígdala,
        // tálamo) sin pretender que estén expuestas en la superficie cortical.
        // Solo se aplica al resaltado activo; el material original se restaura
        // en cada actualización.
        if (selected) {
          material.depthTest = false;
          material.depthWrite = false;
        }
        material.needsUpdate = true;
      });
    });
  }

  function normalizeClip(value) {
    const source = value || {};
    const out = {};
    CLIP_PLANES.forEach(({ id }) => {
      const v = source[id] || {};
      const pos = Number.isFinite(v.pos) ? Math.max(0, Math.min(100, v.pos)) : 50;
      out[id] = { on: Boolean(v.on), pos, flip: Boolean(v.flip) };
    });
    return out;
  }

  // Un punto se conserva si su distancia con signo al plano es >= 0.
  function buildClipPlanes(THREE, clip, bounds) {
    const planes = [];
    const normalized = normalizeClip(clip);
    CLIP_PLANES.forEach(({ id, axis }) => {
      if (!normalized[id].on || !bounds) return;
      const value = bounds.min[axis] + (bounds.max[axis] - bounds.min[axis]) * (normalized[id].pos / 100);
      const normal = new THREE.Vector3(axis === "x" ? 1 : 0, axis === "y" ? 1 : 0, axis === "z" ? 1 : 0);
      if (normalized[id].flip) { normal.negate(); planes.push(new THREE.Plane(normal, value)); }
      else planes.push(new THREE.Plane(normal, -value));
    });
    return planes;
  }

  function applyClipping(clip) {
    const planes = buildClipPlanes(runtime.THREE, clip, runtime.bounds);
    runtime.clipPlanes = planes;
    runtime.renderer.clippingPlanes = planes;
    // Sin tapas de corte: con DoubleSide se ve el interior de las superficies recortadas.
    if (planes.length) runtime.meshes.forEach((mesh) => materialsOf(mesh).forEach((material) => { material.side = runtime.THREE.DoubleSide; material.needsUpdate = true; }));
  }

  function buildLayers() {
    const groupOf = new Map((window.NEUROSCAPE_DATA?.structures || []).map((structure) => [structure.id, structure.group]));
    const byGroup = new Map();
    const byStructure = new Map();
    const mapped = new Set();
    Object.entries(atlas?.mappings || {}).forEach(([id, mapping]) => {
      const meshes = objectsForNodes(mapping.nodes || []);
      byStructure.set(id, meshes);
      const group = groupOf.get(id);
      if (!group) return;
      if (!byGroup.has(group)) byGroup.set(group, new Set());
      meshes.forEach((mesh) => { mapped.add(mesh); byGroup.get(group).add(mesh); });
    });
    return { byGroup, byStructure, rest: runtime.meshes.filter((mesh) => !mapped.has(mesh)) };
  }

  function applyHiddenLayers(hiddenGroups = [], hiddenStructures = [], selectedId = null) {
    if (!runtime?.layers || (!hiddenGroups.length && !hiddenStructures.length)) return;
    const { byGroup, byStructure, rest } = runtime.layers;
    hiddenGroups.forEach((group) => (group === REST_LAYER ? rest : [...(byGroup.get(group) || [])]).forEach((mesh) => { mesh.visible = false; }));
    hiddenStructures.forEach((id) => (byStructure.get(id) || []).forEach((mesh) => { mesh.visible = false; }));
    // La estructura seleccionada siempre permanece visible.
    if (selectedId) (byStructure.get(selectedId) || []).forEach((mesh) => { mesh.visible = true; });
  }

  function hitIsShown(hit) {
    if (!hit.object.visible) return false;
    return (runtime.clipPlanes || []).every((plane) => plane.distanceToPoint(hit.point) >= 0);
  }

  function setView(name) {
    if (!runtime || !VIEW_PRESETS[name]) return;
    runtime.orbit.yaw = VIEW_PRESETS[name].yaw;
    runtime.orbit.pitch = VIEW_PRESETS[name].pitch;
    lookAtTarget();
  }

  function studioPanel({ clip, hiddenGroups = [], hiddenStructures = [], selectedId = null, studioOpen = false } = {}) {
    const esc = (value) => window.NEUROSCAPE_UI.esc(value);
    const data = window.NEUROSCAPE_DATA || { groupOrder: [], structures: [] };
    const normalized = normalizeClip(clip);
    const planes = CLIP_PLANES.map((plane) => {
      const state = normalized[plane.id];
      const off = state.on ? "" : "disabled";
      return `<div class="studio-row"><label class="studio-check"><input type="checkbox" data-action="toggle-clip" data-plane="${plane.id}" ${state.on ? "checked" : ""} /><span>${plane.label} <small>${plane.hint}</small></span></label><input type="range" min="0" max="100" step="1" value="${Math.round(state.pos)}" data-action="set-clip" data-plane="${plane.id}" aria-label="Posición del ${plane.label.toLowerCase()}" ${off} /><select data-action="set-clip-side" data-plane="${plane.id}" aria-label="Lado que se conserva en el ${plane.label.toLowerCase()}" ${off}><option value="a" ${state.flip ? "" : "selected"}>${plane.sides[0]}</option><option value="b" ${state.flip ? "selected" : ""}>${plane.sides[1]}</option></select></div>`;
    }).join("");
    const views = [["front", "Frontal"], ["back", "Posterior"], ["left", "Izquierda"], ["right", "Derecha"], ["top", "Superior"], ["bottom", "Inferior"]]
      .map(([view, label]) => `<button type="button" class="icon-button" data-action="camera-view" data-view="${view}">${label}</button>`).join("");
    const layers = [...(data.groupOrder || []).map((group) => [group, group]), [REST_LAYER, "Resto del atlas (sin ficha)"]]
      .map(([key, label]) => `<label class="studio-check"><input type="checkbox" data-action="toggle-layer" data-group="${esc(key)}" ${hiddenGroups.includes(key) ? "" : "checked"} /><span>${esc(label)}</span></label>`).join("");
    const chips = hiddenStructures.map((id) => {
      const structure = (data.structures || []).find((item) => item.id === id);
      return structure ? `<button type="button" class="studio-chip" data-action="unhide-structure" data-id="${esc(id)}" title="Volver a mostrar">${esc(structure.name)} ×</button>` : "";
    }).join("");
    const canHide = Boolean(selectedId && atlas?.mappings?.[selectedId]?.nodes?.length);
    return `<details class="atlas3d-studio" data-studio ${studioOpen ? "open" : ""}><summary>Cortes, capas y cámara</summary><div class="studio-grid"><section aria-label="Planos de corte"><h4>Planos de corte</h4>${planes}<p class="studio-note">Los cortes no rellenan la superficie: dejan ver el interior del modelo. Para ver la cara del corte, gira la cámara hacia el lado recortado.</p></section><section aria-label="Cámara"><h4>Cámara</h4><div class="atlas3d-view-actions">${views}</div></section><section aria-label="Capas"><h4>Capas visibles</h4><div class="studio-layers">${layers}</div></section><section aria-label="Ocultar estructuras"><h4>Ocultar estructuras</h4><div class="atlas3d-view-actions"><button type="button" class="icon-button" data-action="hide-selection" ${canHide ? "" : "disabled"}>Ocultar selección</button><button type="button" class="icon-button" data-action="reset-studio">Restablecer cortes y capas</button></div><div class="studio-chips">${chips || "<span class=\"studio-empty\">Ninguna estructura oculta.</span>"}</div></section></div></details>`;
  }

  function update({ selectedId = null, routeStructureIds = [], hemisphereOpacity = { left: 1, right: 1 }, presentation = "normal", clip = null, hiddenGroups = [], hiddenStructures = [] } = {}) {
    if (!runtime) return;
    resetMaterials();
    const isolated = presentation === "isolate" && selectedId && isolateSelection(selectedId);
    if (!isolated) {
      applyHiddenLayers(hiddenGroups, hiddenStructures, selectedId);
      const effectiveOpacity = normalizeHemisphereOpacity(hemisphereOpacity);
      if (presentation === "internal" && isDeepStructure(selectedId)) {
        hemispheresForStructure(selectedId).forEach((side) => {
          effectiveOpacity[side] = Math.min(effectiveOpacity[side], 0.16);
        });
      }
      applyHemisphereOpacity(effectiveOpacity);
      routeStructureIds.forEach((id) => tint(id, ROUTE, false));
    }
    applyClipping(clip);
    if (selectedId) tint(selectedId, HIGHLIGHT, true);
  }

  function lookAtTarget() {
    if (!runtime) return;
    const { camera, orbit } = runtime;
    const polar = Math.max(-1.5, Math.min(1.5, orbit.pitch));
    camera.position.set(
      orbit.distance * Math.sin(orbit.yaw) * Math.cos(polar),
      orbit.distance * Math.sin(polar),
      orbit.distance * Math.cos(orbit.yaw) * Math.cos(polar)
    );
    camera.lookAt(0, 0, 0);
  }

  function reset() {
    if (!runtime) return;
    runtime.orbit.yaw = 0.34;
    runtime.orbit.pitch = 0.08;
    runtime.orbit.distance = 5.2;
    lookAtTarget();
  }

  function resize() {
    if (!runtime?.host) return;
    const stage = runtime.host.querySelector("[data-atlas3d-stage]") || runtime.host;
    const { width, height } = stage.getBoundingClientRect();
    if (!width || !height) return;
    runtime.camera.aspect = width / height;
    runtime.camera.updateProjectionMatrix();
    runtime.renderer.setSize(width, height, false);
  }

  function resolveStructure(object) {
    let current = object;
    while (current) {
      const matched = runtime.nodeIndex.get(current.name);
      if (matched) return matched;
      current = current.parent;
    }
    return null;
  }

  function bindInteraction(canvas) {
    const { raycaster, pointer, camera, orbit } = runtime;
    let pointerId = null;
    let previous = null;
    let moved = false;

    canvas.addEventListener("pointerdown", (event) => {
      pointerId = event.pointerId;
      previous = { x: event.clientX, y: event.clientY };
      moved = false;
      canvas.setPointerCapture?.(pointerId);
      canvas.classList.add("is-dragging");
    });
    canvas.addEventListener("pointermove", (event) => {
      if (event.pointerId !== pointerId || !previous) return;
      const dx = event.clientX - previous.x;
      const dy = event.clientY - previous.y;
      if (Math.abs(dx) + Math.abs(dy) > 2) moved = true;
      orbit.yaw -= dx * 0.009;
      orbit.pitch += dy * 0.008;
      previous = { x: event.clientX, y: event.clientY };
      lookAtTarget();
    });
    const stop = (event) => {
      if (event.pointerId !== pointerId) return;
      canvas.releasePointerCapture?.(pointerId);
      canvas.classList.remove("is-dragging");
      if (!moved) {
        const rect = canvas.getBoundingClientRect();
        pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);
        const hit = raycaster.intersectObject(runtime.model, true).find(hitIsShown);
        const structureId = hit && resolveStructure(hit.object);
        if (structureId) latestOptions?.select?.(structureId);
      }
      pointerId = null;
      previous = null;
    };
    canvas.addEventListener("pointerup", stop);
    canvas.addEventListener("pointercancel", stop);
    canvas.addEventListener("wheel", (event) => {
      event.preventDefault();
      orbit.distance = Math.max(3.2, Math.min(8.5, orbit.distance + event.deltaY * 0.004));
      lookAtTarget();
    }, { passive: false });
  }

  async function createRuntime(host) {
    if (!MODEL_URL) throw new Error("La ruta local del modelo oficial no está configurada.");
    if (window.location.protocol === "file:") {
      const error = new Error("El atlas 3D no puede leerse desde file://.");
      error.code = "LOCAL_FILE_PROTOCOL";
      throw error;
    }
    const [THREE, loaderModule] = await Promise.all([
      import("three"),
      import("three/addons/loaders/GLTFLoader.js")
    ]);
    const { GLTFLoader } = loaderModule;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.className = "atlas3d-renderer";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.01, 100);
    scene.add(new THREE.HemisphereLight(0xcbeaff, 0x10213a, 2.3));
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(4, 5, 5);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0x56c6fd, 1.25);
    rimLight.position.set(-4, 1, -3);
    scene.add(rimLight);

    const gltf = await new Promise((resolve, reject) => {
      new GLTFLoader().load(MODEL_URL, resolve, (event) => {
        if (event.total) setStatus(host, `Descargando atlas oficial: ${Math.round((event.loaded / event.total) * 100)} %`);
      }, reject);
    });
    const model = gltf.scene;
    const bounds = new THREE.Box3().setFromObject(model);
    const center = bounds.getCenter(new THREE.Vector3());
    const size = bounds.getSize(new THREE.Vector3());
    const maximum = Math.max(size.x, size.y, size.z) || 1;
    // El GLB usa coordenadas muy pequeñas y está desplazado en Y. La
    // traslación debe escalarse junto con el modelo; de otro modo el centro
    // geométrico queda fuera del encuadre aunque el GLB haya cargado bien.
    const scale = 3.25 / maximum;
    model.scale.setScalar(scale);
    model.position.copy(center).multiplyScalar(-scale);
    scene.add(model);

    runtime = {
      THREE, renderer, scene, camera, model,
      snapshots: captureMaterials(model),
      namedObjects: new Map(),
      meshes: [],
      hemisphereMeshes: { left: [], right: [] },
      unassignedMeshes: [],
      meshHemisphere: new Map(),
      nodeIndex: buildNodeIndex(),
      raycaster: new THREE.Raycaster(),
      pointer: new THREE.Vector2(),
      orbit: { yaw: 0.34, pitch: 0.08, distance: 5.2 },
      host: null,
      resizeObserver: null
    };
    model.traverse((object) => {
      if (object.name) runtime.namedObjects.set(object.name, object);
      if (!object.isMesh) return;
      runtime.meshes.push(object);
      const side = hemisphereForMesh(object);
      if (side) runtime.hemisphereMeshes[side].push(object);
      else runtime.unassignedMeshes.push(object);
      runtime.meshHemisphere.set(object, side);
    });
    model.updateMatrixWorld(true);
    runtime.bounds = new THREE.Box3().setFromObject(model);
    runtime.layers = buildLayers();
    runtime.clipPlanes = [];
    bindInteraction(renderer.domElement);
    reset();
    return runtime;
  }

  function attach(host) {
    if (!runtime || !host?.isConnected) return;
    runtime.host = host;
    const canvasHost = host.querySelector("[data-atlas3d-canvas]");
    if (!canvasHost) return;
    canvasHost.replaceChildren(runtime.renderer.domElement);
    runtime.resizeObserver?.disconnect();
    runtime.resizeObserver = new ResizeObserver(resize);
    runtime.resizeObserver.observe(host.querySelector("[data-atlas3d-stage]") || host);
    resize();
    runtime.renderer.setAnimationLoop(() => runtime.renderer.render(runtime.scene, runtime.camera));
    hideStatus(host);
  }

  async function mount(host, options) {
    latestOptions = options;
    try {
      if (!runtime) {
        if (!loading) loading = createRuntime(host).finally(() => { loading = null; });
        await loading;
      }
      attach(host);
      update(options);
    } catch (error) {
      console.warn("NEUROSCAPE: no se pudo cargar la copia local del atlas 3D oficial.", error);
      setStatus(host, "No se encontró o no se pudo leer assets/3d-vh-m-allen-brain.glb.", true);
      latestOptions?.fallback?.(error);
    }
  }

  function release() {
    if (!runtime) return;
    runtime.renderer.setAnimationLoop(null);
    runtime.resizeObserver?.disconnect();
    runtime.host = null;
  }

  function cancelPending() {
    latestOptions = null;
  }

  return { render, mount, release, cancelPending, reset, update, isDeepStructure, setView, _internals: { buildClipPlanes, normalizeClip, CLIP_PLANES, REST_LAYER } };
})();
