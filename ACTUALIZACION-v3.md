# Actualización v3 (atlas ampliado, cortes y capas)

Este paquete trae **solo los archivos nuevos o modificados**. No incluye `content/settings.json` ni las fichas, rutas y fuentes existentes, para no pisar lo que los docentes hayan editado desde el editor.

## Cómo aplicarla (con GitHub Desktop)
1. Abra GitHub Desktop, elija el repositorio y pulse **Fetch origin** y luego **Pull origin**, para traer los últimos cambios de los docentes.
2. Descomprima este zip y copie su contenido **encima** de la carpeta del repositorio, aceptando reemplazar los archivos repetidos.
3. En GitHub Desktop aparecerán los cambios. Escriba un mensaje («Atlas ampliado v3») y pulse **Commit to main** y luego **Push origin**.
4. Netlify publicará solo. Si el despliegue falla, abra su detalle y cópieme el mensaje en rojo.

## Qué cambia
- `content/structures/`: 14 fichas nuevas (en revisión).
- `data/atlas-mapping.js`: 14 mapeos nuevos y retirada de `frontal_pole` en Lóbulo frontal y Corteza prefrontal.
- `js/`, `css/style.css`: planos de corte, capas, ocultar, cámara, etiquetas «en revisión».
- `scripts/build-content.js`: valida que los nodos del mapeo existan en el GLB.
- `admin/config.yml`: añade «Estado de revisión» y deja ya escritos el repositorio y la dirección del sitio.
- `README.md`, `GUIA-DOCENTES.md`: instrucciones actualizadas.
