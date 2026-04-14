$ErrorActionPreference = "Stop"

Write-Host "Downloading Odoo 17 source..."
Invoke-WebRequest -Uri "https://github.com/odoo/odoo/archive/refs/heads/17.0.zip" -OutFile "odoo_17.0.zip"
Write-Host "Extracting Odoo 17..."
Expand-Archive -Path "odoo_17.0.zip" -DestinationPath "." -Force

Write-Host "Downloading PostgreSQL 14 Portable..."
Invoke-WebRequest -Uri "https://get.enterprisedb.com/postgresql/postgresql-14.11-1-windows-x64-binaries.zip" -OutFile "pgsql.zip"
Write-Host "Extracting PostgreSQL..."
Expand-Archive -Path "pgsql.zip" -DestinationPath "." -Force

Write-Host "Done!"
