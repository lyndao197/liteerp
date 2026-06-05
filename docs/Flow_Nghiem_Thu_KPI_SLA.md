# Luồng: Tạo nghiệm thu KPI/SLA (đồng bộ dữ liệu từ Hợp đồng)

## 1. Sơ đồ tương tác (Swimlane)

```mermaid
flowchart TD
    classDef default fill:#ffffff,stroke:#000000,color:#000000;

    subgraph NG [Người gửi]
        A1("(1) Chọn hợp đồng Nghiệm thu")
        A2("(2) Click button Tạo nghiệm thu")
        A4("(4) Gửi KH confirm")
        A9("(9) Click notification để truy cập màn KPI, SLA")
    end

    subgraph SYS [System]
        S3("(3) Lấy dữ liệu KPI, SLA từ hợp đồng để tạo nghiệm thu<br/>Trạng thái = Mới tạo")
        S5("(5) Gửi link Portal cho khách hàng<br/>Trạng thái = Chờ KH confirm")
        S7{"KH thao tác"}
        S8a("(8a) Bắn notification cho Người gửi<br/>Trạng thái = Chờ KH confirm")
        S8b("(8b) Cập nhật trạng thái KH đã Confirm")
    end

    subgraph KH [Khách hàng]
        K6("(6) Truy cập Portal")
        K7a("(7a) Nhập nội dung xem xét")
        K7b("(7b) Xác nhận nghiệm thu")
    end

    A1 --> A2 --> S3 --> A4 --> S5 --> K6 --> S7
    S7 -- "Xem xét" --> K7a --> S8a --> A9
    A9 -- "Thực hiện chỉnh sửa và Gửi lại" --> A4
    S7 -- "Xác nhận" --> K7b --> S8b --> END(["Kết thúc"])
```

## 2. State Diagram — Trạng thái bản nghiệm thu KPI/SLA

```mermaid
stateDiagram-v2
    [*] --> MoiTao: Tạo nghiệm thu + chọn HĐ<br/>(lấy dữ liệu từ hợp đồng)
    MoiTao --> ChoXacNhan: Gửi KH<br/>(gửi link Portal, pending_side=customer)
    ChoXacNhan --> ChoXacNhan: KH Xem xét → đẩy về<br/>(pending_side=internal: AM sửa số liệu + giải trình → Gửi lại KH)
    ChoXacNhan --> DaXacNhan: KH Xác nhận<br/>(khóa Read-only)
    DaXacNhan --> [*]

    MoiTao: MỚI TẠO (sửa được)
    ChoXacNhan: CHỜ KH CONFIRM (sửa được)
    DaXacNhan: KH ĐÃ CONFIRM (read-only)
```

## 3. Trạng thái

| Trạng thái | Sửa được? | Mô tả |
|------------|-----------|-------|
| MỚI TẠO | ✅ | Vừa tạo nghiệm thu, KPI/SLA lấy dữ liệu từ hợp đồng |
| CHỜ KH CONFIRM | ✅ | Đã gửi link Portal; giữ nguyên khi KH "Xem xét" đẩy về (AM sửa số liệu + giải trình rồi gửi lại) |
| KH ĐÃ CONFIRM | ❌ | Khách hàng đã xác nhận nghiệm thu, khóa Read-only |

> Chi tiết logic ẩn (cờ `pending_side` điều khiển nút "Gửi KH", `review_comment`, `am_response`, `review_round`, quy tắc Read-only) được mô tả trong Business Rules của PRD: `docs/PRDs/Prd_Tao_Nghiem_Thu_KPI_SLA.md`.
