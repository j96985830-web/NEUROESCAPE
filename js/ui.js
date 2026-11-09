window.NEUROSCAPE_UI = (() => {
  const esc = (value) => String(value).replace(/[&<>"]/g, (char) => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"})[char]);

  function header(screen, menuOpen = false) {
    const nav = [["home", "Inicio"], ["explore", "Explorador"], ["routes", "Rutas"], ["sources", "Fuentes"]];
    const links = nav.map(([id, label]) => `<button type="button" data-action="screen" data-screen="${id}" class="nav-link ${screen === id ? "is-active" : ""}">${label}</button>`).join("");
    return `<header class="topbar"><a href="#inicio" class="brand" data-action="screen" data-screen="home" aria-label="Ir al inicio"><span class="brand-mark">N</span><span>NEURO<span>SCAPE</span></span></a><nav class="primary-nav" aria-label="Navegación principal">${links}</nav><button class="mobile-nav" type="button" data-action="toggle-menu" aria-label="${menuOpen ? "Cerrar" : "Abrir"} navegación" aria-expanded="${menuOpen}">${menuOpen ? "×" : "☰"}</button>${menuOpen ? `<nav class="mobile-nav-menu" aria-label="Navegación móvil">${links}</nav>` : ""}</header>`;
  }

  function warning(text, compact = false) {
    return `<aside class="scientific-warning ${compact ? "scientific-warning--compact" : ""}" aria-label="Advertencia científica"><span class="warning-icon">!</span><div><strong>Advertencia científica</strong><p>${esc(text)}</p></div></aside>`;
  }

  function structureMenu(data, selectedId) {
    return `<aside class="explorer-menu"><div class="eyebrow">ANATOMÍA</div><h2>Estructuras</h2><p class="muted">Selecciona una región o explora el modelo.</p>${data.groupOrder.map((group) => {
      const entries = data.structures.filter((structure) => structure.group === group);
      return `<section class="menu-group"><h3>${esc(group)}</h3>${entries.map((s) => `<button type="button" data-action="select-structure" data-id="${s.id}" class="structure-button ${s.id === selectedId ? "is-active" : ""}"><span class="structure-dot"></span>${esc(s.name)}</button>`).join("")}</section>`;
    }).join("")}</aside>`;
  }

  function evidencePill(level) { return `<span class="evidence-pill"><i></i> Evidencia ${level === "directa" ? "directa" : "contextual"}</span>`; }

  function informationPanel(data, selectedId, route) {
    const selected = data.structures.find((s) => s.id === selectedId);
    if (!selected) {
      return `<aside class="info-panel info-panel--empty"><div class="select-orb">⌁</div><div class="eyebrow">EXPLORA</div><h2>Elige una estructura</h2><p>Haz clic sobre una región del modelo o utiliza el menú anatómico.</p><div class="info-divider"></div><p class="tiny">Las vistas exterior y profunda sirven como orientación didáctica. No sustituyen un atlas neuroanatómico.</p></aside>`;
    }
    const sources = selected.sources.map((id) => data.sources.find((source) => source.id === id)?.short).filter(Boolean).join(" · ");
    const related = selected.connections.map((id) => data.structures.find((s) => s.id === id)).filter(Boolean);
    const forensicOn = data.settings?.forensicModule !== false;
    const interpretiveBridge = forensicOn && selected.interpretiveBridge ? `<section class="interpretive-bridge"><h3>Límite interpretativo</h3><p>${esc(selected.interpretiveBridge)}</p></section>` : "";
    return `<aside class="info-panel" data-info-panel><button class="close-panel" data-action="clear-selection" aria-label="Cerrar ficha">×</button><div class="eyebrow">${esc(selected.group)}</div><h2>${esc(selected.name)}</h2>${evidencePill(selected.evidence)}<section><h3>Ubicación anatómica</h3><p>${esc(selected.location)}</p></section><section><h3>Funciones respaldadas</h3><p>${esc(selected.function)}</p></section><section><h3>Procesos psicológicos relacionados</h3><div class="tag-list">${selected.processes.map((process) => `<span>${esc(process)}</span>`).join("")}</div></section>${forensicOn && selected.forensic ? `<section><h3>Relevancia para psicología forense</h3><p>${esc(selected.forensic)}</p></section>` : ""}${interpretiveBridge}<aside class="card-warning"><b>Precaución científica</b><p>${esc(selected.warning)}</p></aside><section><h3>Conexiones pertinentes</h3><div class="connection-list">${related.map((structure) => `<button type="button" data-action="select-structure" data-id="${structure.id}">↗ ${esc(structure.name)}</button>`).join("")}</div></section><button class="source-link" type="button" data-action="screen" data-screen="sources">Ver fuentes: ${esc(sources)} →</button></aside>`;
  }

  function sourceCards(data) {
    return `<section class="sources-grid">${data.sources.map((source) => `<article class="source-card"><div class="source-index">${esc(source.short)}</div><h2>${esc(source.title)}</h2><p class="source-authors">${esc(source.authors)}</p><p>${esc(source.edition)}</p><div class="source-use"><b>Uso en NEUROSCAPE</b><p>${esc(source.use)}</p></div><p class="locator"><b>Sección consultada:</b> ${esc(source.locator)}</p>${source.license ? `<div class="source-license"><b>${esc(source.license)}</b><p>${esc(source.attribution || "")}</p></div>` : ""}${source.url ? `<a class="external-source" href="${esc(source.url)}" target="_blank" rel="noreferrer">Abrir ficha oficial ↗</a>` : ""}</article>`).join("")}</section>`;
  }
  return { esc, header, warning, structureMenu, informationPanel, sourceCards, evidencePill };
})();
