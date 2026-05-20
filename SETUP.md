# LiteERP — Đồng bộ giữa các máy

## Bạn không cần nhớ lệnh

**Nói với AI trong Cursor:**

| Việc | Bạn nói |
|------|---------|
| Lưu lên Git / sang máy khác | *"push lên git"* |
| Máy mới / vừa pull | *"setup project"* hoặc *"pull code"* |
| Chạy app | *"chạy FE BE"* |

AI tự chạy `sync-push`, hooks, restore DB, `npm install` theo rule `.cursor/rules/liteerp-cross-machine-sync.mdc`.

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
