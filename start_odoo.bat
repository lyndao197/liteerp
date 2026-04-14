@echo off
echo Starting PostgreSQL...
start /b .\pgsql\bin\pg_ctl.exe -D .\pgdata -l pgsql.log start
timeout /t 3 /nobreak >nul

echo Starting Odoo 17 Web Demo...
.\.venv\Scripts\python.exe .\odoo-17.0\odoo-bin -r odoo --db_host=localhost --db_port=5432 --addons-path=.\odoo-17.0\addons -d demo
