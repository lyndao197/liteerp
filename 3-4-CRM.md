# Meeting Note: 3-4-CRM

## 1. Quản lý khách hàng

### 1.1. Quản lý Lead & Cơ hội bán hàng (Opportunity)
**Lead Management**
- Hệ thống sử dụng ID Lead có prefix để định danh.
- Cho phép tạo Lead với thông tin khách hàng không bắt buộc đầy đủ tại thời điểm khởi tạo.
- Áp dụng cơ chế validation theo trạng thái:
  - Mỗi trạng thái sẽ có các trường bắt buộc khác nhau.
  - Ví dụ:
    - Trạng thái Lead: bắt buộc Tên khách hàng
    - Chuyển sang Cơ hội bán hàng: bắt buộc Sản phẩm
- Khi nhập thông tin Lead:
  - Hệ thống suggest Company dựa trên: Mã số thuế (MST) và tên.
  - Trường hợp không có MST → suggest theo tên khách hàng.
- Quy tắc kiểm tra trùng (Duplicate Check):
  - Dựa trên tổ hợp: Tên khách hàng + Sản phẩm.
  - Nếu trùng: Không cho phép tạo mới. Hiển thị link tới bản ghi đã tồn tại để người dùng kiểm tra.
- Loại bỏ chức năng:
  - Không hỗ trợ merge (gộp) Lead trùng.
  - Không cho phép xóa Lead.
- Thay thế bằng việc chuyển trạng thái: Thất bại / Hủy tại các giai đoạn: Lead / Cơ hội / Báo giá.

**Opportunity Management**
- Opportunity yêu cầu bổ sung đầy đủ thông tin khách hàng so với Lead.
- Luồng nghiệp vụ E2E:
  - Lead → Opportunity → (Activities + Báo giá) → Won (có hợp đồng) → Hồ sơ khách hàng.
- Pipeline trạng thái Opportunity:
  - Do BA định nghĩa dựa trên quy trình bán hàng thực tế.

### 1.2. Quản lý khách hàng (Customer Management)
**Điều kiện hình thành khách hàng:**
- Phải có Hợp đồng (Contract).

**Nguồn tạo khách hàng:**
- Từ Lead/Opportunity (flow chuẩn).
- Tạo mới trực tiếp (manual).

**Hệ thống cần:**
- Đánh dấu (flag) các khách hàng được tạo không đi từ Lead.
- Lưu trữ lịch sử tương tác sau khi trở thành khách hàng.

**Báo cáo:**
- Áp dụng từ giai đoạn Opportunity trở đi.
- Bao gồm: Khách hàng từ Lead, Khách hàng tạo manual.

**Chức năng:**
- Cho phép tạo khách hàng: Từ Lead, Tạo trực tiếp trong module khách hàng.

**Loại bỏ chức năng:**
- Không hỗ trợ: Nhân bản khách hàng, Chia khách hàng thủ công.

### 1.3. Quản lý liên hệ khách hàng (Contact Management)
- Không cho phép xóa liên hệ.
- Thay thế bằng cơ chế: Active / Inactive.

## 2. Quản lý báo giá (Quotation Management)
- Chức năng báo giá tự động và gửi email báo giá: Chưa triển khai trong Phase 1. Dự kiến nằm trong các phase tiếp theo.

## Ghi chú chung
- Tất cả rule validation và pipeline cần được cấu hình linh hoạt theo business rule.
- BA chịu trách nhiệm:
  - Define trạng thái.
  - Define điều kiện bắt buộc theo từng stage.
  - Align với Sales Process thực tế.
