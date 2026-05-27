# Requirement Details

| Tiêu chí | Mô tả |
|---|---|
| **Mục Đích** | Cung cấp cái nhìn tổng quan về danh sách danh mục và sản phẩm/dịch vụ trong hệ thống dưới dạng sơ đồ cây phân cấp. Cho phép tìm kiếm nhanh, xem thống kê số lượng sản phẩm, và điều hướng đến các chức năng Thêm mới / Chỉnh sửa. |
| **Tác Nhân** | Người quản trị hệ thống (Admin), Nhân viên kinh doanh, BA. |
| **Điều Kiện Khởi Phát** | Người dùng truy cập vào phân hệ "Cấu hình Sản phẩm & Dịch vụ". |
| **Tiền Điều Kiện** | Người dùng có quyền truy cập hệ thống và phân hệ cấu hình sản phẩm. |
| **Hậu Điều Kiện** | Hiển thị chính xác danh sách các nhóm, danh mục con và sản phẩm. Cho phép thực hiện các thao tác mở rộng/thu gọn và điều hướng tương tác. |

# Sơ đồ tương tác

| Người dùng (User) | Hệ thống (System) |
| :--- | :--- |
| **1.** Tìm kiếm và Click icon **[Sửa]** trên dòng sản phẩm | |
| | **2.** Hiển thị Modal Chỉnh sửa với dữ liệu dòng tương ứng |
| **3.** Nhập/Cập nhật thông tin vào Form | |
| **4.** Click nút **[Lưu]** | |
| | **5.** Xác thực dữ liệu |
| | **5a.** *(Nếu lỗi)* Hiển thị thông báo lỗi & Giữ nguyên Modal |
| | **5b.** *(Nếu hợp lệ)* Cập nhật Database & Ghi Log Chatter |
| | **6.** Tải lại danh sách & Đóng Modal |

# Quy Tắc Nghiệp Vụ

| Bước | Mã Quy Tắc | Mô Tả |
|---|---|---|
| (2) | BR 1 | **Phân cấp 3 cấp độ:** Dữ liệu sản phẩm hiển thị theo thứ tự:<br>- **Cấp 1 - Danh mục sản phẩm (Group):** Cấp cao nhất.<br>- **Cấp 2 - Dòng sản phẩm (Category):** Thuộc Danh mục cấp 1.<br>- **Cấp 3 - Sản phẩm / Gói dịch vụ (Product):** Thuộc Dòng sản phẩm cấp 2. |
| (6) | BR 2 | **Trạng thái Mở rộng/Thu gọn (Expand/Collapse):**<br>- Mặc định khi tải trang, tất cả các dòng Cấp 1 (Group) đều ở trạng thái Thu gọn (Collapse), các Cấp 2 và Cấp 3 được ẩn đi.<br>- Click vào biểu tượng Chevron ở đầu dòng Cấp 1 hoặc Cấp 2 để ẩn/hiện các cấp con trực thuộc. |
| (2) | BR 3 | **Kế thừa Trạng thái Ngừng hoạt động (Inherited Inactive):**<br>- Nếu một Danh mục (Cấp 1) có trạng thái `Ngừng hoạt động` (`Inactive`), tất cả các Dòng sản phẩm (Cấp 2) và Sản phẩm (Cấp 3) trực thuộc đều bị coi là kế thừa ngừng hoạt động.<br>- Nếu Dòng sản phẩm (Cấp 2) bị `Ngừng hoạt động` (`Inactive`), các Sản phẩm (Cấp 3) trực thuộc cũng bị kế thừa ngừng hoạt động.<br>- Bản ghi bị kế thừa ngừng hoạt động sẽ hiển thị biểu tượng **Lock** (Khóa) và tên bị gạch ngang. |
| (4) | BR 4 | **Tìm kiếm thông minh (Instant Filter):**<br>- Tìm kiếm không phân biệt chữ hoa, chữ thường.<br>- Khi nhập từ khóa, hệ thống tự động lọc:<br>  - Nếu Cấp 3 khớp từ khóa: Hiển thị cả Dòng sản phẩm (Cấp 2) và Danh mục (Cấp 1) chứa nó.<br>  - Nếu Cấp 2 khớp từ khóa: Hiển thị Danh mục (Cấp 1) cha và các Cấp 3 con của nó.<br>  - Nếu Cấp 1 khớp từ khóa: Hiển thị toàn bộ cây con bên dưới.<br>- Khi có từ khóa tìm kiếm, hệ thống tự động mở rộng (`Expand`) tất cả các nút cha khớp điều kiện để hiển thị kết quả. |
| (2) | BR 5 | **Định dạng tiền tệ:** Giá sản phẩm ở Cấp 3 phải được định dạng theo chuẩn tiền tệ Việt Nam (VNĐ), ví dụ: `500,000 ₫`. |

# Mô tả màn hình

### Màn hình Cấu hình Sản phẩm & Dịch vụ

| # | Tên | Loại Control | Chỉnh Sửa | Bắt Buộc | Giá Trị Mặc Định | Mô Tả |
|---|---|---|---|---|---|---|
| 1 | + Thêm Danh mục sản phẩm | Button | Yes | - | - | Click để mở Modal thêm mới Danh mục cấp 1 |
| 2 | Tìm tên sản phẩm, nhóm... | Input Text (Search) | Yes | No | Rỗng | Ô tìm kiếm lọc dữ liệu tức thời |
| 3 | Thẻ thống kê sản phẩm | Card | No | - | Số lượng sản phẩm | Thẻ thống kê tổng số lượng sản phẩm, đang hoạt động, ngừng hoạt động |
| 4 | Chevron mở rộng/thu gọn | Button/Icon | Yes | - | - | Icon mũi tên ở đầu dòng Cấp 1 & 2 để ẩn/hiện con |
| 5 | Icon Layers / Folder / Package | Icon | No | - | - | Biểu tượng phân biệt Cấp 1 (Layers), Cấp 2 (Folder), Cấp 3 (Package) |
| 6 | Icon Lock | Icon | No | - | - | Hiển thị cạnh tên nếu dòng sản phẩm bị khóa do kế thừa Inactive |
| 7 | Nút [+] (Thêm cấp con) | Button/Icon | Yes | - | - | Chỉ hiển thị ở Cấp 1 và Cấp 2. Mở Modal thêm mới cấp con |
| 8 | Nút [Sửa] | Button/Icon | Yes | - | - | Hiển thị ở cả 3 cấp độ. Mở Modal chỉnh sửa tương ứng |
