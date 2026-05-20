@echo off
setlocal
cd /d "%~dp0"

if not exist "database\seed\demo.dump" (
  echo [ERROR] Khong tim thay database\seed\demo.dump
  echo Hay chay backup-database.bat tren may dev de tao ban seed.
  exit /b 1
)

if not exist "pgdata\PG_VERSION" (
  echo [1/3] Khoi tao PostgreSQL pgdata...
  .\pgsql\bin\initdb.exe -D .\pgdata -U postgres -E UTF8 -A trust
  if errorlevel 1 exit /b 1
)

echo [2/3] Khoi dong PostgreSQL...
.\pgsql\bin\pg_ctl.exe -D .\pgdata -l pgsql.log status >nul 2>&1
if errorlevel 1 (
  start /b .\pgsql\bin\pg_ctl.exe -D .\pgdata -l pgsql.log start
  timeout /t 4 /nobreak >nul
)

echo [3/3] Phuc hoi database demo tu seed...
.\pgsql\bin\dropdb.exe -U postgres --if-exists demo 2>nul
.\pgsql\bin\pg_restore.exe -U postgres -d postgres --create --no-owner --no-acl "database\seed\demo.dump"
if errorlevel 1 (
  echo [ERROR] Phuc hoi that bai. Kiem tra pgsql.log
  exit /b 1
)

powershell -NoProfile -Command "(Get-FileHash 'database\seed\demo.dump' -Algorithm SHA256).Hash | Set-Content 'pgdata\.seed-applied-hash' -NoNewline" 2>nul

echo.
echo [OK] Database demo da san sang. Chay start_odoo.bat hoac npm run dev trong lite-erp-ui.
endlocal
