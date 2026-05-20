# LiteERP — Thiết lập sau khi clone

## Frontend (React)

```powershell
cd lite-erp-ui
npm install
npm run dev
```

→ http://localhost:5173 — dữ liệu mock có sẵn trong `mockStore.js`.

## Backend (Odoo + PostgreSQL)

**Lần đầu trên máy mới:**

```powershell
# Từ thư mục gốc odoo/
.\setup-database.bat
.\start_odoo.bat
```

→ http://localhost:8069 — `admin` / `admin`

`setup-database.bat` đọc `database/seed/demo.dump` trên Git và tạo lại database giống máy dev.

**Cập nhật bản seed lên Git (máy đang dev):**

```powershell
.\backup-database.bat
git add database/seed/demo.dump
git commit -m "Cap nhat database seed"
git push
```

## Lưu ý

- `pgdata/` không nằm trên Git (file runtime). Dùng `demo.dump` thay thế.
- Không commit `pgdata/` hay `pgsql.log`.
