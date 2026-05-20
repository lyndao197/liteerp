@echo off
cd /d "%~dp0"
git config core.hooksPath githooks
echo [OK] Git hooks da bat:
echo   - pre-commit: tu backup Odoo truoc moi commit
echo   - post-merge/pull: tu restore DB khi seed doi hoac chua co pgdata
echo Chi can chay file nay MOT LAN tren moi may.
echo Truoc push: sync-push.bat
pause
