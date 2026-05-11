# LiteERP Project Context & AI Rules

> **Mục đích của file này:** Lưu trữ các quy tắc và định dạng chuẩn mực của dự án LiteERP. Bất kỳ AI Agent nào khi tham gia vào dự án này cũng phải đọc và tuân thủ các quy tắc dưới đây trước khi tạo tài liệu hoặc code.

## 1. Tiêu chuẩn viết tài liệu PRD (PRD Documentation Standards)

Mọi tài liệu PRD (System Requirements Specification / Kịch bản Use Case) được tạo trong dự án này phải tuân thủ nghiêm ngặt cấu trúc 4 phần sau:

- **Văn phong tài liệu (Tone & Style):** Bắt buộc sử dụng ngôn ngữ hệ thống chuyên môn, trang trọng, súc tích và chính xác (Formal & Technical System Language). Tuyệt đối không sử dụng ngôn ngữ giao tiếp phổ thông, văn nói hay từ lóng trong các tài liệu PRD, Specs hoặc tài liệu kỹ thuật.


### Phần 1: Requirement Details
- Sử dụng bảng (Markdown table) bao gồm các trường: Mục Đích, Tác Nhân, Điều Kiện Khởi Phát, Tiền Điều Kiện, Hậu Điều Kiện.

### Phần 2: Sơ đồ tương tác (Activity Diagram)
- **Bắt buộc** sử dụng ngôn ngữ `Mermaid` dạng Flowchart `TD`.
- **Bắt buộc** chia Swimlane (Subgraph) rõ ràng giữa `[User]` và `[System]`.
- Mọi node thao tác phải được đánh số thứ tự ở đầu, ví dụ: `"(1) Click nút Lưu"`, `"(2) Kiểm tra dữ liệu"`.
- Dùng màu nền trắng viền đen cho node mặc định để dễ nhìn.

### Phần 3: Quy Tắc Nghiệp Vụ (Business Rules)
- Sử dụng bảng (Markdown table) gồm 3 cột: `Bước trong Sơ đồ` | `Mã Quy Tắc` | `Mô Tả`.
- **Định dạng Mã Quy tắc:** Bắt buộc sử dụng format `RULE_01_NAME`, `RULE_02_NAME`... (Không dùng BR 1, BR 2).
- Các mã quy tắc phải map chính xác với con số của bước tương ứng trong sơ đồ tương tác.

### Phần 4: Mô tả màn hình (UI/UX Layout)
- Mô tả rõ ràng bố cục màn hình (Header, Toolbar, Bảng dữ liệu, Modal, Tabs).
- Chỉ rõ vị trí nút bấm, trạng thái của các Input/Dropdown, và mô tả trạng thái Empty (nếu có).

---

## 2. Quy ước thiết kế giao diện (Vibe Code Rules)

Khi AI tham gia viết code UI (React/Vite/Tailwind) cho dự án, phải tuân thủ:
- **Màu sắc & Trạng thái:** 
  - Màu nền cảnh báo: Vàng nhạt (yellow-100) chữ cam.
  - Trạng thái bị khóa/vô hiệu hóa (Inactive): Chữ màu xám nhạt (`#94a3b8`). Nếu do người dùng tự tắt -> Gạch ngang chữ. Nếu bị tắt do kế thừa cấp cha -> Không gạch ngang, hiển thị kèm icon `Lock` 🔒.
- **Tiền tệ:** Luôn format theo chuẩn VNĐ (VD: `500,000 ₫`).
- **Module Chatter (Lịch sử hoạt động):**
  - Trình bày dạng Timeline dọc có viền trái.
  - Phải có icon/avatar tác giả và thời gian.
  - Các dòng log thay đổi dữ liệu phải dùng mũi tên hướng dẫn (VD: `▶ Đơn giá: 0 → 500,000`). Mũi tên và giá trị mới phải được làm nổi bật (màu xanh dương).
- **Trải nghiệm người dùng (UX):** Không dùng `alert()` mặc định của trình duyệt. Mọi thông báo xóa/lỗi phải dùng Custom Modal Dialog với Overlay làm mờ (backdrop-blur).

---

## 3. Quy trình làm việc (Workflow Rules)

Khi bắt đầu phát triển một Module hoặc Tính năng mới, AI Agent phải tuân thủ nghiêm ngặt quy trình 3 bước sau:

1. **Phân tích Nghiệp vụ (BA Role):** Trước khi viết tài liệu hay code, AI phải đóng vai trò là một chuyên gia Business Analyst.
   - Khi người dùng đưa ra yêu cầu, AI cần chủ động **đối chiếu với các hệ thống CRM nổi tiếng** (như Salesforce, HubSpot, Odoo gốc...) để đưa ra phương án gợi ý giải quyết tối ưu nhất.
   - Phân tích và chỉ rõ các tác động chéo (Impact Analysis) đến các module khác hiện có trong hệ thống để tránh xung đột.
2. **Tự kiểm duyệt (Self-Verification):** Sau khi thực hiện viết code xong, AI bắt buộc phải đối chiếu lại với tài liệu PRD để đảm bảo đã làm đúng yêu cầu, không tự ý sửa sai thiết kế và tuyệt đối không để xảy ra các lỗi (bug) lặt vặt thiếu cẩn thận.
3. **Đồng bộ hóa liên tục (Auto-Git Push):** Ngay sau khi hoàn thành một chức năng, cập nhật tài liệu, hoặc kết thúc phiên làm việc, AI Agent có nhiệm vụ **tự động chạy lệnh hoặc cung cấp sẵn lệnh git** để đẩy toàn bộ mọi thứ lên: `https://github.com/Duc-Manh2303/ManhDND_CRM.git`. Mục tiêu tối thượng là không bao giờ bị mất context và code khi người dùng chuyển sang máy khác.
