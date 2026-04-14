import urllib.request
import zipfile
import os
import sys

def download_and_extract(url, zip_path, extract_to):
    print(f"Downloading {url} to {zip_path}...")
    urllib.request.urlretrieve(url, zip_path)
    print(f"Extracting {zip_path} to {extract_to}...")
    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        zip_ref.extractall(extract_to)
    print(f"Extraction of {zip_path} complete.")

if __name__ == "__main__":
    odoo_url = "https://github.com/odoo/odoo/archive/refs/heads/17.0.zip"
    pg_url = "https://get.enterprisedb.com/postgresql/postgresql-14.11-1-windows-x64-binaries.zip"
    
    download_and_extract(odoo_url, "odoo17.zip", ".")
    download_and_extract(pg_url, "pg14.zip", ".")
    
    print("All downloads and extractions completed successfully!")
