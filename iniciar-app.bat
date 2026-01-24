@echo off
title Comercial Torres - Launcher

echo ==================================================
echo      COMERCIAL TORRES - INICIANDO SISTEMA
echo ==================================================
echo.

echo [1/2] Levantando Servidor Backend (Puerto 3000)...
start "Comercial Torres Backend" /D "%~dp0server" cmd /k "npm run dev"

echo [2/2] Levantando Cliente Frontend (Puerto 5173)...
echo       El navegador se abrira automaticamente.
start "Comercial Torres Frontend" /D "%~dp0client" cmd /k "npm run dev"

echo.
echo --------------------------------------------------
echo  !SISTEMA EN EJECUCION!
echo --------------------------------------------------
echo  - Backend: http://localhost:3000
echo  - Frontend: http://localhost:5173
echo.
echo  NOTA: No cierres las ventanas negras que se abrieron.
echo        Para detener la app, cierralas manualmente.
echo.
pause
