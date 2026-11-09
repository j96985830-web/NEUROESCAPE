window.NEUROSCAPE_ROUTES = (() => {
  function routeCards(data, selectedRouteId) {
    return `<div class="route-cards">${data.routes.map((route) => `<button type="button" class="route-card ${route.id === selectedRouteId ? "is-active" : ""}" data-action="select-route" data-id="${route.id}" style="--route-color:${route.color}"><span class="route-number">${route.number}</span><span><b>${route.name}</b><small>${route.structures.length} estructuras conectadas</small></span><span class="route-arrow">→</span></button>`).join("")}</div>`;
  }
  function routeDetail(data, routeId) {
    const route = data.routes.find((item) => item.id === routeId) || data.routes[0];
    const structures = route.structures.map((id) => data.structures.find((item) => item.id === id)).filter(Boolean);
    const sourceNames = route.sources.map((id) => data.sources.find((item) => item.id === id)?.short).filter(Boolean).join(" · ");
    return `<section class="route-detail" style="--route-color:${route.color}"><div class="route-detail-heading"><span class="route-number">${route.number}</span><div><div class="eyebrow">RUTA NEUROPSICOLÓGICA</div><h2>${route.name}</h2></div></div><div class="route-map" aria-label="Secuencia de la ruta">${structures.map((structure, index) => `<button type="button" data-action="open-route-structure" data-id="${structure.id}" class="route-node">${structure.name}</button>${index < structures.length - 1 ? "<span class=\"route-connector\">→</span>" : ""}`).join("")}</div><button type="button" class="route-preview-button" data-action="preview-route" data-id="${route.id}">Resaltar ruta en el explorador →</button><div class="route-flow">${route.flow.map((step, index) => `<div><span>${index + 1}</span><p>${step}</p></div>`).join("")}</div>${data.settings?.forensicModule !== false && route.forensic ? `<div class="route-forensic"><h3>Puente hacia lo forense</h3><p>${route.forensic}</p></div>` : ""}<aside class="card-warning"><b>Lectura responsable</b><p>${route.warning}</p></aside><button type="button" class="source-link" data-action="screen" data-screen="sources">Fuentes relacionadas: ${sourceNames} →</button></section>`;
  }
  return { routeCards, routeDetail };
})();
