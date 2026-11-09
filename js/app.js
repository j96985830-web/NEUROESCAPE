/* Coordinación de navegación e interacción de NEUROSCAPE. */
(() => {
  const data = window.NEUROSCAPE_DATA;
  const UI = window.NEUROSCAPE_UI;
  const Routes = window.NEUROSCAPE_ROUTES;
  const Brain = window.BrainView;
  const Atlas3D = window.NEUROSCAPE_3D;
  const app = document.querySelector("#app");
  // El atlas local es la vista principal del explorador. Si el archivo no está
  // disponible, el respaldo didáctico 2D se conserva sin perder navegación.
  const state = { screen: "home", selectedId: null, selectedRouteId: "cognicion", view: "surface", menuOpen: false, atlasMode: "3d", atlasFailed: false, atlasError: null, atlasHemisphereOpacity: { left: 1, right: 1 }, atlasPresentation: "normal" };
  let brainController;

  function selectedRoute() { return data.routes.find((route) => route.id === state.selectedRouteId); }
  function selectedStructure() { return data.structures.find((structure) => structure.id === state.selectedId); }
  function atlasHasNodes(id) { return Boolean(window.NEUROSCAPE_ATLAS?.mappings?.[id]?.nodes?.length); }
  function isDeepAtlasSelection(id = state.selectedId) { return Boolean(id && Atlas3D?.isDeepStructure?.(id)); }
  function atlasViewOptions() {
    return {
      hemisphereOpacity: { ...state.atlasHemisphereOpacity },
      presentation: state.atlasPresentation,
      isDeepSelected: isDeepAtlasSelection(),
      canIsolate: atlasHasNodes(state.selectedId)
    };
  }

  function home() {
    return `${UI.header("home", state.menuOpen)}<main class="home-page"><section class="home-hero"><div class="hero-copy"><div class="hero-eyebrow">EXPLORADOR INTERACTIVO · NEUROPSICOLOGÍA Y CONTEXTO</div><h1>${UI.esc(data.settings.heroTitle)}</h1><p class="hero-lead">${UI.esc(data.settings.heroLead)}</p><div class="hero-actions"><button type="button" class="button button--primary" data-action="screen" data-screen="explore">Explorar el encéfalo <span>→</span></button><button type="button" class="button button--quiet" data-action="screen" data-screen="routes">Ver las cinco rutas</button></div></div><div class="hero-art" aria-hidden="true"><div class="orbit orbit-one"></div><div class="orbit orbit-two"></div><div class="hero-brain">${Brain.render({ view: "surface" })}</div><div class="art-label label-one">MEMORIA</div><div class="art-label label-two">ATENCIÓN</div><div class="art-label label-three">CONTEXTO</div></div></section>${UI.warning(data.globalWarning)}<section class="principles"><article><span>01</span><h2>Explora</h2><p>Selecciona estructuras en vistas anatómicas de orientación didáctica.</p></article><article><span>02</span><h2>Conecta</h2><p>Recorre procesos como memoria, atención, emoción y juicio.</p></article><article><span>03</span><h2>Contextualiza</h2><p>Relaciona procesos con evaluación psicológica sin explicaciones reduccionistas.</p></article></section></main>`;
  }

  function explorer() {
    const route = selectedRoute();
    const routeStructureIds = state.selectedId ? [] : (state.activeRoutePreview ? route.structures : []);
    const isAtlas = state.atlasMode === "3d";
    const modelLabel = isAtlas ? "Atlas anatómico 3D" : (state.view === "deep" ? "Vista profunda / medial" : "Vista exterior / lateral");
    const model = isAtlas ? Atlas3D.render({ failed: state.atlasFailed, ...atlasViewOptions() }) : Brain.render({ view: state.view });
    const routePreview = state.activeRoutePreview ? `<p class="route-preview-note">Ruta activa: <b>${route.name}</b> · violeta = estructuras de la ruta</p>` : "";
    const atlasFallback = state.atlasError === "LOCAL_FILE_PROTOCOL"
      ? "El atlas 3D requiere abrir NEUROSCAPE desde su servidor local. Ejecuta INICIAR-NEUROSCAPE.cmd y usa la dirección que se abre automáticamente."
      : "El modelo anatómico 3D no se pudo cargar. La vista didáctica sigue disponible.";
    return `<main class="explorer-page">${UI.header("explore", state.menuOpen)}<section class="explorer-heading"><div><div class="eyebrow">EXPLORADOR ANATÓMICO</div><h1>Explora por capas, no por certezas.</h1></div><button class="reset-button" type="button" data-action="reset-view">↺ Restablecer vista</button></section><div class="explorer-layout">${UI.structureMenu(data, state.selectedId)}<section class="model-panel"><div class="model-meta"><span>${modelLabel}</span><span>${isAtlas ? "Gira · Acerca · Selecciona" : "Arrastra · Selecciona · Conecta"}</span></div><div class="atlas-switch" role="group" aria-label="Tipo de visualización"><button type="button" class="icon-button ${!isAtlas ? "is-selected" : ""}" data-action="use-2d">Vista didáctica</button><button type="button" class="icon-button ${isAtlas ? "is-selected" : ""}" data-action="use-atlas">Atlas 3D NIH</button></div>${routePreview}${state.atlasFailed ? `<p class="atlas-fallback-note">${atlasFallback}</p>` : ""}<div id="brain-root">${model}</div></section>${UI.informationPanel(data, state.selectedId, route)}</div><div class="bottom-warning">${UI.warning(data.globalWarning, true)}</div></main>`;
  }

  function routes() {
    const route = selectedRoute();
    const forensicOn = data.settings?.forensicModule !== false;
    return `<main class="routes-page">${UI.header("routes", state.menuOpen)}<section class="page-intro"><div class="eyebrow">CINCO RUTAS NEUROPSICOLÓGICAS</div><h1>De la estructura al proceso; del proceso al contexto.</h1><p>Estas rutas son mapas de aprendizaje. Organizan contenido respaldado por las fuentes y señalan con claridad los límites de sus interpretaciones${forensicOn ? " y del puente hacia la evaluación forense" : ""}.</p></section><div class="routes-layout"><aside>${Routes.routeCards(data, route.id)}</aside>${Routes.routeDetail(data, route.id)}</div>${UI.warning(data.globalWarning, true)}</main>`;
  }

  function sources() {
    const forensicOn = data.settings?.forensicModule !== false;
    return `<main class="sources-page">${UI.header("sources", state.menuOpen)}<section class="page-intro page-intro--sources"><div class="eyebrow">TRAZABILIDAD ACADÉMICA</div><h1>Fuentes y límites de uso.</h1><p>El contenido mostrado se basa únicamente en los materiales académicos proporcionados para el proyecto. Las fichas distinguen las funciones directamente apoyadas${forensicOn ? " de los puentes didácticos hacia el ámbito forense" : " de las relaciones contextuales"}.</p></section>${UI.warning(data.globalWarning)}${UI.sourceCards(data)}<section class="method-note"><h2>Cómo leer NEUROSCAPE</h2><ol><li>Las funciones neuroanatómicas se presentan mediante formulaciones prudentes: “participa en”, “se relaciona con” e “interviene en”.</li><li>La aplicación no diagnostica ni predice conducta${forensicOn ? " ni establece imputabilidad" : ""}.</li>${forensicOn ? "<li>La evaluación psicológica forense integra entrevistas, documentación, observación, antecedentes y técnicas psicodiagnósticas; una estructura cerebral no reemplaza ese proceso.</li>" : ""}</ol></section></main>`;
  }

  function render() {
    Atlas3D?.release();
    app.className = `app-shell screen-${state.screen}`;
    app.innerHTML = state.screen === "home" ? home() : state.screen === "explore" ? explorer() : state.screen === "routes" ? routes() : sources();
    bind();
  }

  function bind() {
    app.querySelectorAll("[data-action]").forEach((element) => {
      element.addEventListener("click", (event) => {
        const { action, screen, id, view } = event.currentTarget.dataset;
        if (action === "screen") { event.preventDefault(); state.screen = screen; state.menuOpen = false; if (screen === "explore") state.activeRoutePreview = false; else Atlas3D?.cancelPending(); render(); }
        if (action === "toggle-menu") { state.menuOpen = !state.menuOpen; render(); }
        if (action === "select-structure") selectStructure(id);
        if (action === "select-route") { state.selectedRouteId = id; render(); }
        if (action === "preview-route") { state.selectedRouteId = id; state.selectedId = null; state.activeRoutePreview = true; state.atlasPresentation = "normal"; state.screen = "explore"; render(); }
        if (action === "open-route-structure") { state.screen = "explore"; state.activeRoutePreview = true; selectStructure(id); }
        if (action === "clear-selection") { state.selectedId = null; state.activeRoutePreview = false; state.atlasPresentation = "normal"; render(); }
        if (action === "view") { state.view = view; render(); }
        if (action === "use-atlas") { state.atlasMode = "3d"; state.atlasFailed = false; state.atlasError = null; state.atlasPresentation = isDeepAtlasSelection() ? "internal" : "normal"; render(); }
        if (action === "use-2d") { state.atlasMode = "2d"; Atlas3D?.cancelPending(); render(); }
        if (action === "use-internal-view" && isDeepAtlasSelection()) { state.atlasPresentation = "internal"; render(); }
        if (action === "isolate-selection" && atlasHasNodes(state.selectedId)) { state.atlasPresentation = "isolate"; render(); }
        if (action === "show-all") { state.atlasPresentation = "normal"; state.atlasHemisphereOpacity = { left: 1, right: 1 }; render(); }
        if (action === "reset-view") { if (state.atlasMode === "3d") Atlas3D?.reset(); else brainController?.reset(); state.selectedId = null; state.activeRoutePreview = false; state.atlasPresentation = "normal"; render(); }
      });
    });
    app.querySelectorAll('[data-action="set-hemisphere-opacity"]').forEach((input) => {
      input.addEventListener("input", (event) => {
        const side = event.currentTarget.dataset.side;
        if (side !== "left" && side !== "right") return;
        state.atlasHemisphereOpacity[side] = Number(event.currentTarget.value) / 100;
        const output = app.querySelector(`[data-hemisphere-opacity-output="${side}"]`);
        if (output) output.textContent = `${event.currentTarget.value}%`;
        Atlas3D?.update({ selectedId: state.selectedId, routeStructureIds: state.activeRoutePreview ? selectedRoute().structures : [], ...atlasViewOptions() });
      });
    });
    const brainRoot = app.querySelector("#brain-root");
    if (brainRoot) {
      const selected = selectedStructure();
      const routeStructureIds = state.activeRoutePreview ? selectedRoute().structures : [];
      if (state.atlasMode === "3d") {
        Atlas3D?.mount(brainRoot, {
          selectedId: state.selectedId,
          routeStructureIds,
          ...atlasViewOptions(),
          select: selectStructure,
          fallback: (error) => { state.atlasMode = "2d"; state.atlasFailed = true; state.atlasError = error?.code || error?.message || null; render(); }
        });
      } else {
        brainController = Brain.initialise(brainRoot, { select: selectStructure });
        Brain.update(brainRoot, { selectedId: state.selectedId, routeStructureIds, view: selected?.position.view || state.view });
      }
    }
    // La visualización dentro de inicio es decorativa: elimina controles de teclado redundantes.
    app.querySelectorAll(".hero-brain .brain-controls, .hero-brain .brain-legend, .hero-brain .brain-rotation-hint").forEach((node) => node.remove());
  }

  function selectStructure(id) {
    const structure = data.structures.find((item) => item.id === id);
    if (!structure) return;
    state.selectedId = id;
    state.activeRoutePreview = false;
    if (state.atlasMode === "3d") state.atlasPresentation = isDeepAtlasSelection(id) ? "internal" : "normal";
    if (state.atlasMode !== "3d") state.view = structure.position.view;
    if (state.screen !== "explore") state.screen = "explore";
    render();
    requestAnimationFrame(() => app.querySelector("[data-info-panel]")?.focus?.());
  }

  render();
})();
