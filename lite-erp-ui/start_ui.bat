@echo off
echo =========================================
echo Starting Lite ERP UI with Node.js 22.14.0
echo =========================================
set PATH=D:\odoo\node_env\node-v22.14.0-win-x64;%PATH%
cd /d "D:\odoo\lite-erp-ui"
if not exist node_modules (
    echo Installing dependencies...
    call npm install
)
echo Starting development server...
call npm run dev
pause
