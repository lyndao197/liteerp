# Mapping SLA (Phụ lục III) → Trường dữ liệu Hợp đồng

> Nguồn: `PL III - Danh gia chat luong DV (SLA) - Kết quả nghiệm thu.xls`
> Mục tiêu: Khi **tạo mới hợp đồng**, thiết kế luôn phần cấu hình SLA. Tài liệu này map cấu trúc Excel sang các trường để thêm vào module hợp đồng (FE: `KpiSlaBlock.jsx`, dòng "Tài liệu đính kèm / Điều khoản" trong form `Tạo mới hợp đồng`).

---

## 1. Tổng quan cấu trúc Excel

File gồm 3 sheet SLA dùng **chung 1 bộ chỉ tiêu** (nhóm A/B/C + chỉ tiêu con), khác nhau ở loại dịch vụ và số kỳ đánh giá:

| Sheet | Loại SLA (dịch vụ) | Số kỳ đánh giá |
|-------|--------------------|-----------------|
| `SLA CSKH` | Chăm sóc khách hàng | 1 kỳ |
| `SLA GP&DVKT` | Giải pháp & Dịch vụ kỹ thuật | 2 kỳ (Tháng 1, Tháng 2) |
| `SLA XD` | Xây dựng | 2 kỳ (Tháng 1, Tháng 2) |

→ **Kết luận thiết kế:**
- Một hợp đồng có thể chứa **nhiều bộ SLA** (mỗi bộ ứng với 1 loại dịch vụ → `slaCategory`).
- Mỗi bộ SLA có **cây chỉ tiêu cố định** (cấu hình lấy từ hợp đồng) + **N kỳ đánh giá** (kết quả nghiệm thu theo tháng).

---

## 2. Mapping cấp HỢP ĐỒNG (SLA-level)

Các trường thêm vào hợp đồng để khai báo một bộ SLA:

| Trường (đề xuất) | Kiểu | Nguồn Excel | Bắt buộc | Ghi chú |
|------------------|------|-------------|----------|---------|
| `slaId` | UUID | (sinh tự động) | ✓ | Khóa bộ SLA |
| `contractId` | FK → hợp đồng | (ngữ cảnh form) | ✓ | Liên kết hợp đồng đang tạo |
| `slaCategory` | enum `CSKH \| GP_DVKT \| XD` | Tên sheet | ✓ | Loại dịch vụ áp dụng SLA |
| `appendixCode` | text | R0 c0 — "Phụ lục III" | | Mã phụ lục |
| `title` | text | R0 c0 — "CHỈ TIÊU SLA ĐÁNH GIÁ CHẤT LƯỢNG..." | | Tiêu đề |
| `acceptanceMinuteNo` | text | R0 c0 — "Biên bản nghiệm thu số: …" | | Số BB nghiệm thu (để trống khi tạo) |
| `acceptanceDate` | date | R0 c0 — "ngày … tháng … năm" | | Ngày nghiệm thu |
| `maxScore` | number = 100 | R2 c4 — "Điểm tối đa: 100" | ✓ | Điểm chuẩn |
| `feeThresholds[]` | list (xem §3) | R2 c4 — các mức trừ phí | ✓ | Ngưỡng điểm → mức trừ phí |
| `indicators[]` | list (xem §4) | R3–R11 | ✓ | Cây chỉ tiêu |
| `evaluations[]` | list (xem §5) | cột Tỷ trọng/Điểm đạt/Ghi chú theo kỳ | | Kết quả nghiệm thu theo kỳ |
| `partyALabel` | text = "ĐẠI DIỆN BÊN A" | R13 c1 | | Chữ ký |
| `partyBLabel` | text = "ĐẠI DIỆN BÊN B" | R13 c4 | | Chữ ký |

---

## 3. Block TỔNG ĐIỂM — Ngưỡng trừ phí (`feeThresholds[]`)

Nguồn: **R2 c4** (ô "Ngưỡng (đạt)" của dòng TỔNG ĐIỂM). Mỗi dòng text tách thành 1 bản ghi.
Khớp với `slaTotal.targets[]` đã có trong `KpiSlaBlock.jsx`.

| Trường | Kiểu | Ví dụ từ Excel |
|--------|------|----------------|
| `fromScore` | number | 95, 90, 80, 70, 65, 0 |
| `toScore` | number\|null | 100, 95, 90, 80, 70, 65 |
| `penaltyText` | text | "Không trừ phí" / "Trừ 0.2% phí thanh toán/01 điểm dưới ngưỡng 95" |
| `penaltyRate` | number (%) | 0, 0.2, 0.3, 0.5, 1, 8 |

Các mức từ Excel:
- Từ 95–100: Không trừ phí (0%)
- Từ 90–<95: Trừ 0.2%/điểm dưới 95
- Từ 80–<90: Trừ 0.3%/điểm dưới 95
- Từ 70–<80: Trừ 0.5%/điểm dưới 95
- Từ 65–<70: Trừ 1%/điểm dưới 95
- Dưới 65: Trừ 8% phí/hợp đồng

> Hiện FE lưu dạng text `targets[]`. Để tính tự động phần trừ phí, nên tách thành các trường số (`fromScore`/`toScore`/`penaltyRate`) như trên.

---

## 4. Cây CHỈ TIÊU (`indicators[]`) — cấu hình từ hợp đồng

Nguồn: **R3–R11**. Map trực tiếp sang model `slaData` đã có trong `KpiSlaBlock.jsx`.

| Cột Excel | Trường FE hiện có | Kiểu | Ghi chú |
|-----------|-------------------|------|---------|
| c0 — TT | `index` | text | "A"/"B"/"C" (nhóm) hoặc "1"/"2"… (chi tiết) |
| c1 — TÊN CHỈ TIÊU | `name` | text | |
| c2 — YÊU CẦU | `requirement` | text (nhiều dòng) | |
| c3 — PHƯƠNG PHÁP XÁC ĐỊNH | `method` | text | |
| c4 — Ngưỡng (đạt) | `target` | text (nhiều dòng) | Quy tắc tính điểm của chỉ tiêu |
| (dòng tô đậm A/B/C) | `level=1, isGroup=true` | | Nhóm |
| (dòng 1,2,3…) | `level=2, isGroup=false` | | Chỉ tiêu chi tiết (tối đa 2 level) |

**Quỹ điểm nhóm** (c4 của dòng nhóm A/B/C = 70/20/10) → map vào `target` hoặc thêm trường `quota` (number) cho dòng nhóm.

Bộ chỉ tiêu chuẩn từ Excel:
- **A. ĐẢM BẢO CÁC CHỈ TIÊU KPI VỀ CHẤT LƯỢNG PHỤC VỤ KH** — quỹ 70 điểm
  - A.1 Số lượng các chỉ tiêu KPI đạt trong kỳ đánh giá
- **B. CAM KẾT VỀ BẢO MẬT THÔNG TIN, CSDL KHÁCH HÀNG** — quỹ 20 điểm
  - B.1 Bảo mật thông tin, CSDL của VCC
- **C. CÔNG TÁC PHỐI HỢP GIỮA VCX VÀ VCC** — quỹ 10 điểm
  - C.1 Thông báo kịp thời khi có sự cố
  - C.2 Báo cáo chất lượng giải đáp Tổng đài theo tuần/tháng
  - C.3 Công tác đảm bảo seats cho CSKH
  - C.4 Các sự vụ/trường hợp khác

---

## 5. KẾT QUẢ NGHIỆM THU theo kỳ (`evaluations[]`)

Nguồn: cụm cột "Kết quả nghiệm thu" — lặp lại theo kỳ.
- `SLA CSKH`: 1 kỳ → cột c5/c6/c7
- `SLA GP&DVKT`, `SLA XD`: 2 kỳ → c5/c6/c7 (Tháng 1) và c8/c9/c10 (Tháng 2)

Mỗi kỳ là 1 bản ghi gắn với từng chỉ tiêu:

| Cột Excel | Trường FE hiện có (`evaluations`) | Kiểu | Ghi chú |
|-----------|-----------------------------------|------|---------|
| header — "Tháng 1"/"Tháng 2" | `period` | text/date | Kỳ đánh giá |
| c5 / c8 — Tỷ trọng | `weight` | number/% | Tỷ trọng nhóm (0.7/0.2/0.1) |
| c6 / c9 — Điểm đạt | `score` | number | Điểm đạt thực tế |
| c7 / c10 — GHI CHÚ | `note` | text | Diễn giải/kết quả |
| R2 c6/c9 — Điểm tổng | `totalScore` | number | Tổng điểm kỳ (vd 86) |

> Đề xuất chuẩn hóa: `evaluations[]` là mảng theo kỳ, mỗi phần tử `{ period, rows: [{ indicatorIndex, weight, score, note }], totalScore }`. Khi tạo mới hợp đồng → để trống phần kết quả (chỉ khai báo cấu hình §3, §4).

---

## 6. Đề xuất data model gộp (JSON)

```jsonc
{
  "slaId": "uuid",
  "contractId": "uuid",
  "slaCategory": "CSKH",              // CSKH | GP_DVKT | XD
  "appendixCode": "Phụ lục III",
  "maxScore": 100,
  "feeThresholds": [                  // §3 — Block tổng điểm
    { "fromScore": 95, "toScore": 100, "penaltyRate": 0,   "penaltyText": "Không trừ phí" },
    { "fromScore": 90, "toScore": 95,  "penaltyRate": 0.2, "penaltyText": "Trừ 0.2%/điểm dưới 95" }
    // ...
  ],
  "indicators": [                     // §4 — cây chỉ tiêu (tối đa 2 level)
    { "index": "A", "level": 1, "isGroup": true,  "name": "ĐẢM BẢO CÁC CHỈ TIÊU KPI...", "quota": 70 },
    { "index": "1", "level": 2, "isGroup": false, "name": "Số lượng các chỉ tiêu KPI đạt...",
      "requirement": "...", "method": "...", "target": "- KPI đạt ≥ 95% => 100% Quỹ điểm..." }
    // ...
  ],
  "evaluations": [                    // §5 — kết quả nghiệm thu theo kỳ (để trống khi tạo mới)
    { "period": "Tháng 1", "totalScore": 86,
      "rows": [ { "indicatorIndex": "1", "weight": 0.7, "score": 56, "note": "86.8" } ] }
  ]
}
```

---

## 7. Vị trí trên form "Tạo mới hợp đồng"

- Thêm 1 mục mới (ví dụ **mục "D. SLA / Cam kết chất lượng dịch vụ"**) trong form tạo hợp đồng, hoặc gắn vào tab "Điều khoản" (§5 trong ảnh).
- Cấu phần UI dùng lại `KpiSlaBlock` (tab SLA) — đã có sẵn cây 2 level + block tổng điểm với ngưỡng editable.
- Khi tạo mới: chỉ nhập **cấu hình** (§3 ngưỡng trừ phí + §4 cây chỉ tiêu). Phần **kết quả nghiệm thu** (§5) nhập ở bước nghiệm thu sau, không nhập khi tạo hợp đồng.
