@echo off
cd /d "%~dp0"
git config core.hooksPath githooks
echo [OK] Git hooks da bat (pre-commit backup DB, post-merge restore DB).
if /i not "%~1"=="silent" pause
