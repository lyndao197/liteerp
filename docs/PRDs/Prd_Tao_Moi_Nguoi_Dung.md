# Requirement Details

| Tiêu chí | Mô tả |
|---|---|
| **Mục Đích** | Cho phép người quản trị tạo mới tài khoản người dùng trong hệ thống ERP, gán vai trò và trạng thái hoạt động ngay khi khởi tạo. |
| **Tác Nhân** | Quản trị hệ thống, Nhân sự vận hành, Trưởng bộ phận được phân quyền. |
| **Điều Kiện Khởi Phát** | Người dùng truy cập màn hình Tạo mới người dùng từ danh sách User. |
| **Tiền Điều Kiện** | Người thao tác đã đăng nhập và có quyền quản lý người dùng. Hệ thống đã có danh sách vai trò để gán. |
| **Hậu Điều Kiện** | Tài khoản người dùng mới được lưu thành công, xuất hiện tại danh sách User, có thể chỉnh sửa ở các bước tiếp theo. |

# Sơ đồ tương tác

```mermaid
flowchart TD
  subgraph U[Người dùng (User)]
    U1[Mở màn hình UserList]
    U2[Click nút Thêm người dùng mới]
    U3[Nhập thông tin cơ bản]
    U4[Nhập bảo mật và chọn vai trò]
    U5[Click nút Thêm người dùng]
  end

  subgraph S[Hệ thống (System)]
    S1[Tải danh sách người dùng]
    S2[Điều hướng tới route /user/new]
    S3[Sinh ID user mới và render form trống]
    S4[Đồng bộ username theo email]
    S5[Validate dữ liệu bắt buộc]
    S6[Lưu dữ liệu user vào store]
    S7[Điều hướng về UserList và tải lại danh sách]
    S8[Hiển thị lỗi nếu thiếu dữ liệu bắt buộc]
  end

  U1 --> S1 --> U2 --> S2 --> S3 --> U3 --> U4 --> U5 --> S5
  S5 -->|Hợp lệ| S6 --> S7
  S5 -->|Không hợp lệ| S8 --> U3
  U3 --> S4
```

# Quy Tắc Nghiệp Vụ

| Bước | Mã Quy Tắc | Mô Tả |
|---|---|---|
| (3) | BR-USER-CREATE-01 | Hệ thống tự sinh ID user mới khi vào màn hình tạo mới. |
| (3) | BR-USER-CREATE-02 | Trường Email là bắt buộc. Username được đồng bộ theo giá trị Email. |
| (3) | BR-USER-CREATE-03 | Trường Vai trò hệ thống là bắt buộc, lấy dữ liệu từ danh sách Role hiện có. |
| (4) | BR-USER-CREATE-04 | Trường Mật khẩu là bắt buộc ở chế độ tạo mới. |
| (3) | BR-USER-CREATE-05 | Trường Lý do nghỉ chỉ cho phép nhập khi đã có Ngày hết hạn nghỉ. |
| (5) | BR-USER-CREATE-06 | Trạng thái mặc định của user mới là Active nếu người dùng không thay đổi. |
| (5) | BR-USER-CREATE-07 | Khi submit hợp lệ, hệ thống lưu dữ liệu và quay về danh sách User. |
| (5) | BR-USER-CREATE-08 | Khi thiếu dữ liệu bắt buộc, hệ thống chặn submit và giữ nguyên màn hình tạo mới. |

# Mô tả màn hình

### Màn hình Tạo mới người dùng

| # | Tên | Loại Control | Chỉnh Sửa | Bắt Buộc | Giá Trị Mặc Định | Mô Tả |
|---|---|---|---|---|---|---|
| 1 | Tên nhân viên | Input Text | Yes | No | Rỗng | Tên hiển thị của người dùng |
| 2 | Email liên hệ | Input Email | Yes | Yes | Rỗng | Dữ liệu liên hệ, đồng bộ thành Username |
| 3 | Số điện thoại | Input Text | Yes | No | Rỗng | Thông tin liên lạc |
| 4 | Phòng ban | Dropdown | Yes | No | Rỗng | Chọn phòng ban công tác |
| 5 | Chức danh | Dropdown | Yes | No | Rỗng | Chọn chức danh |
| 6 | Tên đăng nhập | Input Text (Readonly) | No | Yes | Theo Email | Không nhập trực tiếp |
| 7 | Chọn quản lý | Dropdown | Yes | No | Rỗng | Chọn người quản lý trực tiếp |
| 8 | Ngày hết hạn nghỉ | Date | Yes | No | Rỗng | Dùng cho trường hợp nghỉ tạm thời |
| 9 | Lý do nghỉ | Textarea | Yes (có điều kiện) | No | Rỗng | Disable nếu chưa có ngày hết hạn nghỉ |
| 10 | Mật khẩu | Password | Yes | Yes | Rỗng | Bắt buộc ở màn hình tạo mới |
| 11 | Vai trò hệ thống | Dropdown | Yes | Yes | Rỗng | Chọn role để phân quyền |
| 12 | Trạng thái tài khoản | Dropdown | Yes | Yes | Active | Giá trị: Active hoặc Inactive |
| 13 | Nút Thêm người dùng | Button | Yes | - | - | Submit form tạo mới user |
| 14 | Nút Quay lại danh sách | Button | Yes | - | - | Trở về UserList không lưu |

# Validation và phản hồi lỗi

| Mã | Điều kiện | Cách xử lý |
|---|---|---|
| VAL-USER-CREATE-01 | Email rỗng hoặc sai định dạng | Chặn submit theo validate Input Email |
| VAL-USER-CREATE-02 | Vai trò hệ thống chưa chọn | Chặn submit |
| VAL-USER-CREATE-03 | Mật khẩu rỗng | Chặn submit |
| VAL-USER-CREATE-04 | Thiếu dữ liệu bắt buộc bất kỳ | Giữ nguyên form để người dùng bổ sung |

# Dữ liệu đầu ra

Khi tạo thành công, user được lưu với các trường chính:
- id
- username
- fullName
- email
- phone
- department
- position
- managerId
- leaveEndDate
- leaveReason
- role
- status
- password

# Tiêu chí nghiệm thu

1. Từ UserList có thể mở đúng màn hình tạo mới user.
2. Hệ thống tự sinh ID cho user mới.
3. Username tự cập nhật theo Email.
4. Không thể lưu nếu thiếu Email, Vai trò, hoặc Mật khẩu.
5. Lưu thành công sẽ quay lại UserList và hiển thị bản ghi vừa tạo.
6. Trường Lý do nghỉ bị disable khi chưa có Ngày hết hạn nghỉ.
