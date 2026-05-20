@echo off
setlocal
cd /d "%~dp0"

if not exist "database\seed" mkdir "database\seed"

echo Dam bao PostgreSQL dang chay...
.\pgsql\bin\pg_ctl.exe -D .\pgdata -l pgsql.log status >nul 2>&1
if errorlevel 1 (
  start /b .\pgsql\bin\pg_ctl.exe -D .\pgdata -l pgsql.log start
  timeout /t 4 /nobreak >nul
)

echo Export database demo...
.\pgsql\bin\pg_dump.exe -U postgres -h localhost -p 5432 -d demo -F c -f "database\seed\demo.dump"
if errorlevel 1 (
  .\pgsql\bin\pg_dump.exe -U odoo -h localhost -p 5432 -d demo -F c -f "database\seed\demo.dump"
)
if errorlevel 1 (
  echo [ERROR] pg_dump that bai. Kiem tra PostgreSQL dang chay.
  exit /b 1
)

echo [OK] Da luu database\seed\demo.dump
echo Commit va push file nay len Git de may khac co cung du lieu Odoo.
endlocal
