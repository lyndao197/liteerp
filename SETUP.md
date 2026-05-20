# LiteERP — Đồng bộ giữa các máy

## Bạn chỉ cần nhớ 2 việc

| Máy đang làm việc | Lệnh |
|-------------------|------|
| **Trước khi push** | `sync-push.bat` → commit → push |
| **Máy mới (một lần)** | `install-githooks.bat` → sau đó chỉ `git pull` |

`git pull` trên máy B sẽ **tự** restore Odoo nếu database trên Git mới hơn.

## Giống y hệt máy dev?

| Có trên Git + tự sync | Cần lưu ý |
|------------------------|-----------|
| Code, SRS, Odoo (`demo.dump`) | `npm install`, `start_odoo.bat` |
| | Data sửa **trên UI** (localStorage) → phải cập nhật `mockStore.js` trước push |

---

## Thiết lập sau khi clone

```powershell
.\install-githooks.bat
git pull
cd lite-erp-ui
npm install
npm run dev
```

Odoo: `.\start_odoo.bat` → http://localhost:8069

---

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
