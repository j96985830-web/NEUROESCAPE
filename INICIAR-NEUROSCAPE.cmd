@echo off
rem NEUROSCAPE · servidor local para ver el sitio en su computador (Windows).
rem Requiere Python (python.org). Deje esta ventana abierta mientras usa el sitio.
cd /d "%~dp0"
title NEUROSCAPE - servidor local
set PORT=8080
where node >nul 2>nul
if %errorlevel%==0 node scripts\build-content.js
where py >nul 2>nul
if %errorlevel%==0 (
  start "" cmd /c "timeout /t 2 >nul & start http://localhost:%PORT%"
  py -m http.server %PORT%
  goto :fin
)
where python >nul 2>nul
if %errorlevel%==0 (
  start "" cmd /c "timeout /t 2 >nul & start http://localhost:%PORT%"
  python -m http.server %PORT%
  goto :fin
)
echo No se encontro Python. Instalelo desde https://www.python.org y vuelva a abrir este archivo.
:fin
pause
