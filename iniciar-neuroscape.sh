#!/usr/bin/env sh
# NEUROSCAPE · servidor local para ver el sitio en su computador (Mac/Linux).
cd "$(dirname "$0")" || exit 1
PORT=8080
command -v node >/dev/null 2>&1 && node scripts/build-content.js
URL="http://localhost:$PORT"
echo "NEUROSCAPE disponible en $URL (Ctrl+C para detener)"
( sleep 2; (command -v open >/dev/null 2>&1 && open "$URL") || (command -v xdg-open >/dev/null 2>&1 && xdg-open "$URL") ) &
exec python3 -m http.server "$PORT"
