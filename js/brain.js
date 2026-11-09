/* Visualización anatómica interactiva. No sustituye un atlas anatómico. */
window.BrainView = (() => {
  const surfaceSvg = `
    <svg class="brain-svg brain-svg--surface" viewBox="0 0 820 560" role="img" aria-label="Vista lateral estilizada del encéfalo con regiones seleccionables">
      <defs>
        <linearGradient id="brainFill" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#c5d6ec"/><stop offset="1" stop-color="#718db3"/></linearGradient>
        <filter id="glow"><feGaussianBlur stdDeviation="6" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <path class="brain-base" d="M154 319 C114 280 116 213 160 175 C184 121 252 91 307 108 C354 68 436 74 477 107 C547 95 620 143 642 201 C685 239 665 316 621 343 C615 402 549 438 487 419 C440 463 352 459 303 426 C238 447 172 405 173 355 C158 347 150 334 154 319Z" />
      <path class="sulcus" d="M191 206 C256 177 330 190 372 223 M164 265 C237 242 292 259 333 286 M341 134 C390 167 414 205 397 252 M468 132 C494 176 536 199 601 205 M438 307 C495 290 560 305 609 337 M203 343 C271 321 311 356 345 388" />
      <path class="structure" data-structure="frontal" tabindex="0" d="M155 318 C120 279 121 214 161 176 C186 126 245 100 298 110 C321 131 334 172 324 217 C309 258 283 300 250 342 C210 358 174 346 155 318Z" />
      <path class="structure structure--small" data-structure="prefrontal" tabindex="0" d="M156 249 C142 220 151 188 177 166 C196 143 221 126 249 122 C269 144 277 181 264 212 C248 238 221 261 191 273Z" />
      <path class="structure" data-structure="cerebelo" tabindex="0" d="M531 352 C574 323 625 333 650 370 C668 403 640 441 594 445 C551 445 518 414 520 384Z" />
      <path class="outline-region" d="M324 116 C368 83 435 84 477 109 C557 96 626 152 642 204 C670 244 658 295 629 326 C569 302 489 282 417 302 C381 323 362 371 326 407 C291 416 263 402 249 381 C284 332 317 277 332 223 C340 185 334 145 324 116Z" />
      <path class="structure" data-structure="temporal" tabindex="0" d="M405 226 C458 190 548 203 607 239 C638 258 640 299 619 326 C560 305 490 283 426 300 C401 287 390 247 405 226Z" />
      <g class="anatomy-labels" aria-hidden="true"><text x="218" y="303">Frontal</text><text x="464" y="184">Temporal</text><text x="544" y="398">Cerebelo</text></g>
      <circle class="depth-orb" cx="719" cy="115" r="6"/><circle class="depth-orb" cx="742" cy="139" r="3"/>
    </svg>`;

  const deepSvg = `
    <svg class="brain-svg brain-svg--deep" viewBox="0 0 820 560" role="img" aria-label="Vista medial y profunda estilizada del encéfalo con estructuras seleccionables">
      <defs><linearGradient id="deepFill" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#c1d1e5"/><stop offset="1" stop-color="#627c9f"/></linearGradient></defs>
      <path class="brain-base" d="M143 311 C112 246 150 159 235 135 C304 86 405 93 464 135 C558 125 643 185 646 278 C648 333 610 380 552 397 C496 435 417 440 344 424 C254 439 159 395 143 311Z" />
      <path class="midline" d="M264 176 C334 141 427 154 479 205 C515 241 520 284 493 318 C468 347 421 363 365 359" />
      <path class="structure" data-structure="calloso" tabindex="0" d="M282 195 C334 153 425 163 459 208 C471 224 463 237 447 235 C408 211 357 210 309 227 C287 235 270 213 282 195Z" />
      <path class="structure" data-structure="limbico" tabindex="0" d="M301 251 C348 223 427 229 459 267 C470 283 461 303 443 303 C404 273 357 274 322 291 C300 302 284 273 301 251Z" />
      <ellipse class="structure" data-structure="talamo" tabindex="0" cx="427" cy="284" rx="40" ry="31" />
      <path class="structure" data-structure="hipotalamo" tabindex="0" d="M411 318 C428 303 457 307 467 327 C455 346 431 353 412 340Z" />
      <path class="structure" data-structure="hipocampo" tabindex="0" d="M326 315 C357 286 401 306 398 332 C394 357 348 366 324 346 C314 337 316 324 326 315Z" />
      <circle class="structure" data-structure="amigdala" tabindex="0" cx="388" cy="342" r="18" />
      <path class="structure" data-structure="reticular" tabindex="0" d="M436 354 C459 338 479 347 486 371 L496 442 C478 460 447 451 440 428Z" />
      <path class="structure structure--small" data-structure="cerebelo" tabindex="0" d="M527 331 C584 310 630 346 619 393 C609 431 564 451 528 427 C501 405 501 356 527 331Z" />
      <g class="anatomy-labels" aria-hidden="true"><text x="357" y="191">Cuerpo calloso</text><text x="404" y="288">Tálamo</text><text x="544" y="384">Cerebelo</text></g>
    </svg>`;

  function render({ view = "surface" }) {
    return `
      <div class="brain-stage" data-brain-stage>
        <div class="brain-grid" aria-hidden="true"></div>
        <div class="brain-rotation-hint"><span>↻</span> Arrastra para girar</div>
        <div class="brain-object" data-brain-object style="--yaw: 0deg; --pitch: 0deg">
          <div class="brain-views ${view === "deep" ? "is-deep" : ""}" data-brain-views>
            ${surfaceSvg}
            ${deepSvg}
          </div>
        </div>
        <div class="brain-controls" role="group" aria-label="Vista del modelo">
          <button class="icon-button ${view === "surface" ? "is-selected" : ""}" type="button" data-action="view" data-view="surface" title="Vista exterior">Exterior</button>
          <button class="icon-button ${view === "deep" ? "is-selected" : ""}" type="button" data-action="view" data-view="deep" title="Vista profunda">Profunda</button>
          <button class="icon-button" type="button" data-action="reset-view" title="Restablecer vista">↺</button>
        </div>
        <div class="brain-legend"><i></i> Estructura seleccionable</div>
      </div>`;
  }

  function initialise(root, actions) {
    const stage = root.querySelector("[data-brain-stage]");
    const object = root.querySelector("[data-brain-object]");
    if (!stage || !object) return;
    let active = false;
    let lastX = 0;
    let lastY = 0;
    let yaw = 0;
    let pitch = 0;

    const setRotation = () => {
      object.style.setProperty("--yaw", `${yaw}deg`);
      object.style.setProperty("--pitch", `${pitch}deg`);
    };
    stage.addEventListener("pointerdown", (event) => {
      if (event.target.closest(".structure, button")) return;
      active = true; lastX = event.clientX; lastY = event.clientY; stage.setPointerCapture?.(event.pointerId);
      stage.classList.add("is-dragging");
    });
    stage.addEventListener("pointermove", (event) => {
      if (!active) return;
      yaw = Math.max(-24, Math.min(24, yaw + (event.clientX - lastX) * 0.16));
      pitch = Math.max(-12, Math.min(12, pitch - (event.clientY - lastY) * 0.11));
      lastX = event.clientX; lastY = event.clientY; setRotation();
    });
    const stop = () => { active = false; stage.classList.remove("is-dragging"); };
    stage.addEventListener("pointerup", stop); stage.addEventListener("pointercancel", stop);
    stage.addEventListener("click", (event) => {
      const target = event.target.closest("[data-structure]");
      if (target) actions.select(target.dataset.structure);
    });
    stage.addEventListener("keydown", (event) => {
      if ((event.key === "Enter" || event.key === " ") && event.target.matches("[data-structure]")) {
        event.preventDefault(); actions.select(event.target.dataset.structure);
      }
    });
    return { reset() { yaw = 0; pitch = 0; setRotation(); } };
  }

  function update(root, { selectedId, routeStructureIds = [], view }) {
    root.querySelector("[data-brain-views]")?.classList.toggle("is-deep", view === "deep");
    root.querySelectorAll("[data-structure]").forEach((node) => {
      node.classList.toggle("is-active", node.dataset.structure === selectedId);
      node.classList.toggle("is-route", routeStructureIds.includes(node.dataset.structure));
    });
  }
  return { render, initialise, update };
})();
