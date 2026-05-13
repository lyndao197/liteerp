# Requirement Details

| Tiêu chí | Mô tả |
|---|---|
| **Mục Đích** | Cho phép người dùng nhanh chóng tạo một Lead mới dựa trên thông tin từ một Lead cũ đã kết thúc (Thành công hoặc Thất bại) để tiếp tục chăm sóc hoặc triển khai cơ hội mới cho cùng một khách hàng. |
| **Tác Nhân** | Nhân viên kinh doanh (Sales), Quản lý kinh doanh. |
| **Điều Kiện Khởi Phát** | Người dùng click vào nút `[Tạo bản sao]` tại màn hình chi tiết Lead. |
| **Tiền Điều Kiện** | Lead hiện tại phải ở trạng thái "Không thành công" hoặc "Đã ký hợp đồng". |
| **Hậu Điều Kiện** | Một bản ghi Lead mới được khởi tạo ở trạng thái "Mới" (đầu quy trình). Dữ liệu được sao chép chính xác theo quy tắc. |

# Sơ đồ tương tác

```mermaid
flowchart TD
    subgraph User [Người dùng]
        C(3. Click nút Tạo bản sao)
    end

    subgraph System [Hệ thống]
        A(1. Mở màn hình chi tiết Lead)
        B{2. Trạng thái Lead?}
        B1(2a. Ẩn nút Tạo bản sao)
        B2(2b. Hiển thị nút Tạo bản sao)
        D(4. Hệ thống khởi tạo bản ghi mới)
        E(5. Sao chép dữ liệu các khối)
        F(6. Giữ trống các khối: Tài liệu...)
        G(7. Thiết lập trạng thái mặc định: Mới)
        H(8. Ghi log Chatter cho bản sao)
        I(9. Chuyển hướng sang màn hình chỉnh sửa Lead mới)
    end

    A --> B
    B -->|Khác| B1
    B -->|Không thành công / Đã ký| B2
    B2 --> C
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
    H --> I
```

# Quy Tắc Nghiệp Vụ

| Bước | Mã Quy Tắc | Mô Tả |
|---|---|---|
| (2b) | BR 1 | Nút `[Tạo bản sao]` chỉ xuất hiện ở Header màn hình chi tiết khi bản ghi Lead có trạng thái thuộc tập hợp: "Không thành công", "Đã ký hợp đồng". |
| (7) | BR 2 | Lead được tạo ra từ bản sao luôn luôn bắt đầu ở trạng thái đầu tiên của Pipeline (Trạng thái "Mới"), bất kể Lead gốc đang ở trạng thái nào. |
| (5) | BR 3 | Hệ thống thực hiện sao chép toàn bộ dữ liệu (Deep Copy) của các khối sau:<br>- Thông tin khách hàng: Tên KH, MST, Phân loại, Lĩnh vực, Website, Địa chỉ, Danh sách Liên hệ khách hàng.<br>- Thông tin dự án: Danh sách dịch vụ, Doanh thu dự kiến, Cơ cấu vốn.<br>- Thông tin thêm: Các mốc thời gian, Nguồn, Đội ngũ sales, Đối tác. |
| (6) | BR 4 | Các khối thông tin sau sẽ được để trống hoàn toàn trên bản sao mới:<br>- Tài liệu: Không sao chép các file đính kèm.<br>- Khó khăn, đề xuất: Reset nội dung text.<br>- Ghi chú nội bộ: Reset nội dung text.<br>- Chatter (Log/Comment): Không sao chép lịch sử tương tác và thảo luận từ Lead cũ. |
| (4) | BR 5 | Tên Lead mới được khởi tạo tự động mặc định là: "[Copy] + Tên Lead gốc" để người dùng dễ dàng phân biệt. |
| (8) | BR 6 | Khi tạo mới thành công, hệ thống tự động ghi một log mặc định *"Đã tạo bản sao từ Lead [Tên Lead gốc]"* vào tab Lịch sử hoạt động của Lead mới. |

# Mô tả màn hình

### Màn hình Chi tiết Lead (Header)

| # | Tên | Loại Control | Chỉnh Sửa | Bắt Buộc | Giá Trị Mặc Định | Mô Tả |
|---|---|---|---|---|---|---|
| 1 | Tạo bản sao | Button (Secondary) | Yes | - | Ẩn | Nằm trên thanh Action bar (Header), bên trái nút `[Lưu]`. Chỉ hiển thị nếu thỏa mãn điều kiện BR 1. |

### Màn hình Chỉnh sửa Lead mới (Sau khi bấm Tạo bản sao)

| # | Tên | Loại Control | Chỉnh Sửa | Bắt Buộc | Giá Trị Mặc Định | Mô Tả |
|---|---|---|---|---|---|---|
| 1 | Tên Lead | Input Text | Yes | Yes | [Copy] + Tên Lead gốc | Trường tên Lead được tự động sinh thêm tiền tố "[Copy]". |
| 2 | Khối Thông tin khách hàng | Section | Yes | - | Từ bản gốc | Các trường dữ liệu bên trong được điền sẵn đầy đủ. |
| 3 | Khối Thông tin dự án | Section | Yes | - | Từ bản gốc | Các trường dữ liệu bên trong được điền sẵn đầy đủ. |
| 4 | Khối Thông tin thêm | Section | Yes | - | Từ bản gốc | Các trường dữ liệu bên trong được điền sẵn đầy đủ. |
| 5 | Khối Tài liệu / Khó khăn | Section | Yes | - | Trống (Empty) | Reset hoàn toàn, không lấy dữ liệu từ bản gốc. |
