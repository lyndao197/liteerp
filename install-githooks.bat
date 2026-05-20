@echo off
cd /d "%~dp0"
git config core.hooksPath githooks
echo [OK] Da bat Git hooks: sau pull/clone se tu chay setup-database neu chua co pgdata.
echo Chi can chay file nay MOT LAN tren moi may (hoac sau moi clone).
pause
