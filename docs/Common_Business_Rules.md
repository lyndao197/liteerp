# Quy Tắc Nghiệp Vụ Chung (Common Business Rules)

Tài liệu này tổng hợp các quy tắc nghiệp vụ cơ bản (Business Rules) từ hệ thống, dùng làm tiêu chuẩn chung cho UI/UX, thao tác dữ liệu, và phản hồi người dùng trong quá trình phát triển CRM.

## 1. Quy Tắc xử Lý Trường Dữ Liệu (Fields)
- **Xóa khoảng trắng (Trim)**: Hệ thống tự động xóa khoảng trắng đầu và cuối chuỗi ký tự ở tất cả các trường trước khi validate dữ liệu.
- **Dropdown List (Single / Multiple)**:
  - Sắp xếp theo bảng chữ cái.
  - Tự động highlight giá trị đang chọn khi hover.
  - Nếu danh sách > 10 bản ghi, hệ thống hỗ trợ lọc (Instant search).
  - Có tùy chọn thêm mới nếu không tìm thấy (Single/Multiple choice with Fill in).
  - Mặc định thêm item "Chọn giá trị" (tương đương để trống trường dữ liệu).
- **Trường Dữ liệu Số (Numeric)**:
  - Hiển thị dấu `,` để phân cách hàng nghìn (ví dụ: `1,000,000`). Khi edit, dấu này sẽ bị ẩn.
  - Số thập phân cách nhau bằng dấu `.` và làm tròn đến 2 chữ số thập phân (Nửa lên, nửa xuống với giá trị làm tròn ở chữ số thứ 3).
- **Ngày tháng (Date/Time)**:
  - Định dạng hiển thị Date: `DD/MM/YYYY`. DateTime: `DD/MM/YYYY hh:mm` (chuẩn 24h).
  - Các ô nhập cho phép copy paste và tự động bổ sung dấu `/` khi gõ.
  - Bắt lỗi khi không tuân thủ định dạng.
  - Các giá trị chọn "Từ Ngày" và "Đến Ngày" sẽ giới hạn điều kiện chọn lẫn nhau (< và > tương ứng).
- **Thông tin liên lạc**:
  - **Điện thoại**: Tối đa 15 ký tự chữ số.
  - **Email**: Chuẩn định dạng `[tênmail]@[tênmiền]`, tối đa 318 ký tự, có giới hạn các ký tự đặc biệt theo chuẩn email.
- **Placeholder mặc định**:
  - Textbox: hiển thị `Nhập [Tên Trường]`
  - Dropdown: hiển thị `Chọn [Tên Trường]`

## 2. Quy Tắc Hiển Thị Bảng (Tables)
- **Phân trang (Pagination)**:
  - Mặc định hiển thị 10 bản ghi/trang. Cho phép thay đổi (5, 10, 30, 50, 100, 200).
- **Scroll Bar dọc**: Trường hợp bảng dùng trong các Form tạo mới/chi tiết có >5 dòng, sẽ hiển thị thanh trượt dọc.
- **Sắp xếp (Sorting)**: 
  - Lần 1: chiều tăng dần. Lần 2: chiều giảm dần theo Cột (hỗ trợ AlphaB, Số, Thời gian).
- **Bảng Danh Sách Có Chỉnh Sửa Trực Tiếp (Inline Editing)**:
  - Cập nhật tự động thông suốt khi sử dụng phím Tab để nhảy ô.
  - Focus vào ô nào, ô đó viền xanh. Dòng sửa bị lỗi thì viền đỏ highlight trọn dòng.
  - Validate theo dòng và out focus của ô. Xóa hoặc sửa không ảnh hưởng dòng trước khi ấn Save.
- **Tooltip**: Hover vào text bị khuất độ dài sẽ xuất hiện nội dung đầy đủ qua tooltip.

## 3. Quy Tắc Tìm Kiếm
- **Tìm kiếm Cơ Bản (HOẶC - OR)**:
  - Không phân biệt Hoa/Thường hay Tối âm. Chỉ cần 1 trường thỏa mãn từ khóa.
- **Tìm kiếm Nâng Cao (VÀ - AND)**:
  - Chỉ tìm bản ghi thỏa mãn tất cả các filter điền vào. 
  - Hỗ trợ tính năng "Lưu bộ lọc" và button Reset.

## 4. Quản Lý Thông Báo (System Messages)
- **Lỗi nội tuyến (Inline Error)**: Hiển thị ngay dưới trường dữ liệu, highlight đỏ. Text sửa đổi sẽ làm thông báo lỗi tự biến mất.
- **Popup Error**: Báo lỗi liên kết tới toàn form/hoạt động. Cần bấm "Đồng ý" để tắt.
- **Toast Message**: Dành cho Hành động thành công (Xanh) hoặc thất bại (Đỏ). Tự động ẩn sau 2 giây.
- **Thông báo tải hệ thống (Timeout)**: Hết 5s chưa tải xong, hiển thị thư giãn ("Hệ thống vẫn đang chạy, hãy thư giãn...").

## 5. Quy Tắc Upload File và Tài Liệu
- **Dung lượng**: Hiển thị đơn vị KB. Quy định upload chung 20MB (Import Excel là 10MB).
- **Định dạng**: Hỗ trợ word, pdf, image, excel, zip, rar, ppt, msg. File Excel xuất ra nếu > 5000 lines sẽ chặn.
- Quyền hạn Xóa/Tải file bám sát trạng thái hoạt động của đối tượng. 
- Tính năng Tải ZIP file dành cho danh sách nhiều file ("Download All").

## 6. Kiểm Soát Xung Đột Hệ Thống (Concurrency / Tiền điều kiện)
- Mọi chức năng Cập Nhật / Tạo / Hủy trước khi Trigger đều phải kiểm tra lại "Tiền điều kiện" từ DB.
- Trấn áp xung đột giữa các session bằng lỗi Popup: *"Bạn không thể thực hiện thao tác này do thông tin của bản ghi đã bị thay đổi"* và làm mới dữ liệu người dùng tại browser. Mọi thay đổi chậm hơn của User khác sẽ bị bãi bỏ để đảm bảo thống nhất.

## 7. Quy Tắc Trình Bày Tài Liệu (Documentation Rules)
- **Sơ đồ tương tác (Interaction Diagram):** Trong các tài liệu PRD/thiết kế, luôn sử dụng định dạng **Swimlane** (thông qua Mermaid `flowchart TD` kết hợp `subgraph` phân chia rõ luồng tác nhân như Người dùng, Hệ thống). Không sử dụng Sequence Diagram thông thường để đảm bảo tính đồng nhất trên toàn dự án.
