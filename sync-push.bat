@echo off
setlocal
cd /d "%~dp0"

echo [LiteERP] Dong bo truoc khi push len Git...
echo.

call backup-database.bat
if errorlevel 1 (
  echo [WARN] Backup DB that bai - van co the push code/SRS.
)

git add database/seed/demo.dump 2>nul
git add -A -- Prd_*.md lite-erp-ui/ .vscode/ .cursor/rules/ .agent/ SETUP.md githooks/ *.bat database/seed/README.md 2>nul

echo.
echo [OK] Da backup DB va stage file chinh.
echo Buoc tiep theo (hoac bao AI thuc hien):
echo   git status
echo   git commit -m "..."
echo   git push origin main
echo.
echo Luu y FE: neu sua data tren UI, can cap nhat mockStore.js INITIAL_DATA truoc push.
endlocal
