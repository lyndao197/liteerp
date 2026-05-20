# Database seed (Odoo `demo`)

File `demo.dump` là bản sao PostgreSQL (pg_dump) của database Odoo `demo`.

## Máy mới (sau khi clone)

1. Chạy `setup-database.bat` (tạo `pgdata` + restore dữ liệu).
2. Chạy `start_odoo.bat` → http://localhost:8069 (`admin` / `admin`).

## Cập nhật dữ liệu mẫu trên Git (máy dev)

1. Chỉnh dữ liệu trên Odoo như mong muốn.
2. Chạy `backup-database.bat`.
3. Commit và push `database/seed/demo.dump`.

## Frontend (React)

Dữ liệu mock nằm trong `lite-erp-ui/src/utils/mockStore.js` — có sẵn khi clone, không cần restore DB.
