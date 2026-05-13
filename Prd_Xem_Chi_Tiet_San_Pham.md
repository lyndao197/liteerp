# Requirement Details

| Tiêu chí | Mô tả |
|---|---|
| **Mục Đích** | Cho phép người dùng cập nhật thông tin của một Danh mục sản phẩm, Dòng sản phẩm, Sản phẩm / Gói dịch vụ hoặc chuyển đổi trạng thái hoạt động, đồng thời lưu lại lịch sử thay đổi (Audit trail). |
| **Tác Nhân** | Người quản trị hệ thống / Nhân viên kinh doanh. |
| **Điều Kiện Khởi Phát** | Người dùng click vào icon `[Sửa]` (Edit) trên một dòng Sản phẩm ở màn hình danh sách. |
| **Tiền Điều Kiện** | Người dùng được phân quyền chỉnh sửa sản phẩm. Sản phẩm đó phải tồn tại trong hệ thống. |
| **Hậu Điều Kiện** | Thông tin mới của sản phẩm được cập nhật vào cơ sở dữ liệu. Các thay đổi được ghi nhận vào tab "Lịch sử hoạt động" (Chatter log). Màn hình danh sách chính tự động làm mới để phản ánh dữ liệu mới. |

# Sơ đồ tương tác

```mermaid
flowchart TD
    subgraph User [Người dùng]
        A(1. Click icon Sửa trên 1 dòng)
        C(3. Người dùng thay đổi thông tin)
        I(5. Click nút Lưu cập nhật)
    end

    subgraph System [Hệ thống]
        B(2. Hiển thị Modal chi tiết 2 Tab: Thông tin & Lịch sử)
        D{4. Kiểm tra ràng buộc nghiệp vụ}
        E(4a. Khóa nút Trạng thái, hiện cảnh báo)
        F(4b. Khóa trường ĐVT, hiện cảnh báo)
        J{6. Kiểm tra tính hợp lệ}
        K(6a. Hiển thị thông báo lỗi)
        L(7. Cập nhật Database)
        M(8. So sánh thay đổi & Ghi Log Chatter)
        N(9. Cập nhật hiển thị danh sách & Đóng Modal)
    end

    A --> B
    B --> C
    C --> D
    D -->|Cha bị Ngừng hoạt động| E
    D -->|Đã phát sinh giao dịch| F
    E & F --> I
    D -->|Bình thường| I
    I --> J
    J -->|Lỗi| K
    K --> C
    J -->|Hợp lệ| L
    L --> M
    M --> N
```

# Quy Tắc Nghiệp Vụ

| Bước | Mã Quy Tắc | Mô Tả |
|---|---|---|
| (4b) | BR 1 | Khi mở bản ghi sản phẩm Level 3, hệ thống kiểm tra xem sản phẩm này đã phát sinh giao dịch chưa (VD: đã nằm trong Báo giá, Hóa đơn). Nếu đã có, hệ thống hiển thị dải cảnh báo (màu vàng) báo hiệu: *"Đang được dùng trong X (số lượng) Báo giá, Y (số lượng) Hóa đơn"*. Các module liên quan đến sản phẩm bao gồm: Báo giá, Hóa đơn. |
| (4b) | BR 2 | Nếu sản phẩm đã phát sinh giao dịch, trường **Đơn vị tính** sẽ bị khóa cứng (Disabled/Lock icon) không cho phép người dùng thay đổi, nhằm tránh sai lệch dữ liệu kế toán của các đơn cũ. |
| (3) | BR 3 | Trạng thái "Đang hoạt động / Ngừng hoạt động" sử dụng UI dạng Toggle switch. Có tooltip: *"Tắt trạng thái này để ngừng bán sản phẩm. Dữ liệu trên các đơn hàng cũ không bị ảnh hưởng."* |
| (6a) | BR 4 | Xác thực dữ liệu bắt buộc:<br>- Phải chọn Dòng sản phẩm (Cấp 2) nếu chỉnh sửa sản phẩm level 3<br>- Phải chọn Danh mục sản phẩm (Cấp 1) nếu chỉnh sửa sản phẩm level 2<br>- Phải nhập tên sản phẩm nếu chỉnh sửa mọi cấp độ<br>Nếu người dùng bỏ trống, hệ thống hiển thị hộp thoại cảnh báo lỗi và ngăn chặn việc lưu trữ. |
| (8) | BR 5 | Bất kỳ trường dữ liệu nào bị sửa đổi (Tên, Đơn giá, Trạng thái, ĐVT, Thuế...) đều được hệ thống so sánh tự động và ghi lại vào hệ thống (Tracking). Log này sẽ được hiển thị ở tab "Lịch sử hoạt động" kèm theo tên người sửa và thời gian thay đổi. |
| (4a) | BR 6 | Nếu cấp cha của sản phẩm đang ở trạng thái Ngừng hoạt động, khi mở bản ghi cấp con sẽ có cảnh báo và vô hiệu hóa hoàn toàn nút Toggle Trạng thái để ngăn người dùng thao tác. Cảnh báo: *"Danh mục cha đang Ngừng hoạt động. Bản ghi này hiện bị khóa."*<br>Khi cấp cha có trạng thái Ngừng hoạt động, các sản phẩm cấp con sẽ bị đánh dấu gạch ngang tên trên danh sách để nhận diện trực quan. |

# Mô tả màn hình

### Modal Chi tiết (Áp dụng chung cho cả 3 cấp độ)

| # | Tên | Loại Control | Chỉnh Sửa | Bắt Buộc | Giá Trị Mặc Định | Mô Tả |
|---|---|---|---|---|---|---|
| 1 | Tab Thông tin chung | Tab Item | - | - | Active mặc định | Chứa các trường thông tin của sản phẩm (Tên, Mô tả, Đơn giá...). |
| 2 | Tab Lịch sử hoạt động | Tab Item | - | - | - | Chứa danh sách timeline ghi nhận thay đổi dữ liệu (Chatter). |
| 3 | Cảnh báo trạng thái | Banner (Màu vàng) | No | - | Ẩn | Chỉ xuất hiện nếu vi phạm BR 1 hoặc BR 6. Hiển thị dòng chữ cảnh báo lý do khóa trường dữ liệu. |
| 4 | Trạng thái | Toggle Switch | Yes* | Yes | Theo DB | Chuyển đổi Đang hoạt động/Ngừng hoạt động. (*Bị khóa Disable nếu cấp cha đang Ngừng hoạt động theo BR 6). |
| 5 | Tên | Input Text | Yes | Yes | Theo DB | Tên sản phẩm. |
| 6 | Đơn vị tính | Combobox | Yes* | No | Theo DB | Chỉ xuất hiện ở Level 3. (*Bị khóa Disable nếu sản phẩm đã phát sinh giao dịch theo BR 2). |
| 7 | Hủy bỏ | Button | Yes | - | - | Đóng cửa sổ, không lưu dữ liệu. |
| 8 | Lưu cập nhật | Button (Primary) | Yes | - | - | Xác nhận lưu dữ liệu vào hệ thống. |
