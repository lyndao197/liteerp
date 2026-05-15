# PRD: Tạo mới yêu cầu bán hàng dự án

> **Mục đích:** Đặc tả luồng nghiệp vụ và giao diện cho tính năng tạo mới yêu cầu bán hàng từ một hợp đồng có hiệu lực.

## 1. Requirement Details

| Trường Thông Tin | Nội Dung |
| :--- | :--- |
| **Mục Đích** | Khởi tạo đơn hàng mới trên hệ thống dựa trên thông tin đã ký kết của hợp đồng gốc. |
| **Tác Nhân** | Chuyên viên AM (Sales) |
| **Điều Kiện Khởi Phát** | AM nhận được yêu cầu triển khai hoặc thanh toán từ khách hàng thuộc hợp đồng. |
| **Tiền Điều Kiện** | Hợp đồng gốc phải ở trạng thái "Hiệu lực" trên hệ thống. |
| **Hậu Điều Kiện** | Sinh ra một Record Đơn hàng (Yêu cầu bán hàng) ở trạng thái "Mới" hoặc "Nháp", liên kết trực tiếp tới hợp đồng. |

## 2. Sơ đồ tương tác (Activity Diagram)

```mermaid
flowchart TD
    subgraph User [Người dùng (AM)]
        A1("(1) Mở màn hình Tạo mới yêu cầu bán hàng")
        A2("(2) Chọn Số hợp đồng")
        A3("(3) Kiểm tra thông tin Bên mua tự điền")
        A4("(4) Điền các thông tin thanh toán (Loại thanh toán, Hình thức, Ngày công nợ)")
        A5("(5) Thêm/Xóa thông tin sản phẩm và điều chỉnh SL/Đơn giá")
        A6("(6) Upload file tài liệu liên quan")
        A7("(7) Click 'Gửi yêu cầu bán hàng'")
    end

    subgraph System [Hệ thống]
        S1("(8) Tự động load thông tin Khách hàng, Liên hệ theo Hợp đồng")
        S2("(9) Tự động tính toán Tổng tiền, VAT")
        S3("(10) Kiểm tra validation (các trường bắt buộc)")
        S4("(11) Lưu Record và chuyển trạng thái Mới")
    end

    A1 --> A2
    A2 --> S1
    S1 --> A3
    A3 --> A4
    A4 --> A5
    A5 --> S2
    S2 --> A6
    A6 --> A7
    A7 --> S3
    
    S3 -- "Lỗi" --> User
    S3 -- "Hợp lệ" --> S4
```

## 3. Quy Tắc Nghiệp Vụ (Business Rules)

| Bước | Mã Quy Tắc | Mô Tả |
| :--- | :--- | :--- |
| 2 | BR 1 | Dropdown "Số hợp đồng" chỉ hiển thị các hợp đồng có trạng thái `approvalStatus === 'Hiệu lực'`. |
| 8 | BR 2 | Khi chọn Số hợp đồng, hệ thống auto-fill: Khách hàng mua, Người liên hệ, Email, Điện thoại, Địa chỉ từ dữ liệu Khách hàng gắn với Hợp đồng đó. Các trường này mặc định là Read-only. |
| 4 | BR 3 | `Hình thức thanh toán`, `Người liên hệ`, `Loại thanh toán` là các trường bắt buộc. |
| 5 | BR 4 | Cho phép tùy ý thêm dòng, xóa dòng sản phẩm không bị giới hạn. Có thể thêm sản phẩm ngoài hợp đồng (nếu đơn bị tạo nhầm hoặc chưa phát sinh giao dịch). |
| 9 | BR 5 | `Tổng thành tiền` = Sum(SL * Đơn giá). `Tổng VAT` = 10% * Tổng thành tiền. `Tổng giá trị` = Tổng thành tiền + VAT. Phải format số sang chuẩn `VND`. |
| 10 | BR 6 | Quản lý trạng thái và Quota: Khi đơn hàng ở trạng thái "Chờ duyệt công nợ", nếu bị "Từ chối" thì sẽ chuyển sang trạng thái "Đã hủy" để giải phóng (release) hạn mức sản phẩm thay vì đưa về "Dự thảo". Trên đơn hàng "Đã hủy", có nút "Chuyển về Dự thảo" để có thể khôi phục lại khi cần sửa chữa. |

## 4. Mô tả màn hình (UI/UX Layout)

| # | Tên | Loại Control | Chỉnh Sửa | Bắt Buộc | Giá Trị Mặc Định | Mô Tả |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | Số hợp đồng | Dropdown | Yes | Yes | `DA_0504...` | Dạng text xanh link, chọn hợp đồng. |
| 2 | Salesteam | Dropdown | Yes | Yes | Nhóm của user hiện tại | Nhóm kinh doanh. |
| 3 | Khách hàng mua | Input Text | No | Yes | N/A | Tự fill theo Hợp đồng. Có background màu xám (`#f1f5f9`). |
| 4 | Số ngày công nợ | Input Text | Yes | No | 30 | Nhập số ngày. |
| 5 | Hình thức thanh toán | Dropdown | Yes | Yes | Chuyển khoản | Tùy chọn: Chuyển khoản / Tiền mặt. |
| 6 | Loại thanh toán | Radio Group | Yes | Yes | Phương thức 2 | Có 2 option: Phương thức 1 / Phương thức 2. |
| 7 | Bảng sản phẩm | Data Table | Yes | Yes | N/A | Có nút Thùng rác cuối dòng để xóa. Các ô Đơn giá/SL dạng input số. Load dữ liệu từ module Sản phẩm. |
| 8 | Thêm sản phẩm | Button (Link) | Yes | N/A | N/A | Click để thêm dòng mới vào bảng sản phẩm. |
| 9 | Upload Tài liệu | Drag/Drop Box | Yes | No | N/A | Cho phép kéo thả file hoặc click Browse. File thêm sẽ vào danh sách bên dưới. |
| 10 | Gửi yêu cầu | Button | Yes | N/A | N/A | Nút chính góc phải trên cùng để lưu dữ liệu. |
| 11 | Xem trước PDF | Button | Yes | N/A | N/A | (Advanced Action) Xem trước bản in báo giá/đơn hàng. Nằm phía trên khối Chatter. |
| 12 | Sinh file PDF | Button | Yes | N/A | N/A | (Advanced Action) Chuyển đổi dữ liệu form sang PDF và đính kèm vào hồ sơ. |
| 13 | Gửi Email | Button | Yes | N/A | N/A | (Advanced Action) Mở popup gửi email đính kèm đơn hàng/báo giá cho khách hàng. |
| 14 | Khung Chatter | Split Pane | Yes | N/A | N/A | Cột bên phải màn hình (30%). Gồm 2 tab: Lịch sử hoạt động (Timeline log) và Comment (Nhắn tin nội bộ). |
