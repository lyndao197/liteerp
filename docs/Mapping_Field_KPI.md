| Mục | Nhãn | Field key | Kiểu | Giá trị mặc định / Gợi ý | Nguồn | Ánh xạ | Anchor |
|---|---|---|---|---|---|---|---|
| D.1 Thông tin chung | Tên phụ lục | kpi_title | text | CHỈ TIÊU ĐÁNH GIÁ CHẤT LƯỢNG CUNG ỨNG DỊCH VỤ | R1c0 | ✓ | {{kpi_title}} |
| D.1 Thông tin chung | Số biên bản thỏa thuận | kpi_agreement_no | text |  | R2c0 | ✓ | {{kpi_agreement_no}} |
| D.1 Thông tin chung | Tổng điểm chuẩn | kpi_max_score | number | 100 | R4c9 | ✓ | {{kpi_max_score}} |
| D.1 Thông tin chung | Tổng điểm đạt | kpi_total_score | number |  | R4-result | Nghiệm thu | {{kpi_total_score}} |
| D.2 Ngưỡng phí | 97 điểm – 100 điểm | kpi_fee_1 | text | 100% phí dịch vụ vận hành/tháng | R28c2 | ✓ |  |
| D.2 Ngưỡng phí | Từ 90 điểm đến dưới 97 điểm | kpi_fee_2 | text | Trừ 0,1% / tổng giá trị phí dịch vụ vận hành trong tháng /01 điểm trừ dưới ngưỡng 97 điểm | R29c2 | ✓ |  |
| D.2 Ngưỡng phí | Từ 75 điểm đến dưới 90 điểm | kpi_fee_3 | text | Trừ 0,2% / tổng giá trị phí dịch vụ vận hành trong tháng /01 điểm trừ dưới ngưỡng 90 điểm | R30c2 | ✓ |  |
| D.2 Ngưỡng phí | Từ dưới 75 điểm | kpi_fee_4 | text | 92% phí dịch vụ vận hành/tháng | R31c2 | ✓ |  |
| D.3 Nhóm 1 (TỔNG ĐÀI 18009000) | Tên nhóm 1 | kpi_g1_name | text | TỔNG ĐÀI 18009000 | R5c1 | ✓ | {{kpi_g1_name}} |
| D.3 Nhóm 1 (TỔNG ĐÀI 18009000) | Quỹ điểm nhóm 1 | kpi_g1_quota | number | 60 | R5c9 | ✓ | {{kpi_g1_quota}} |
| D.3 Nhóm 1 (TỔNG ĐÀI 18009000) | 1.1 – Tên chỉ tiêu | kpi_g1_i1_name | text | Tỷ lệ cuộc gọi kết nối thành công trong tháng | R6c1 | ✓ | {{kpi_g1_i1_name}} |
| D.3 Nhóm 1 (TỔNG ĐÀI 18009000) | 1.1 – Định nghĩa tiêu chí | kpi_g1_i1_definition | textarea | Là số cuộc gọi kết nối thành công đến Nhân công/ tổng cuộc gọi/tháng. | R6c2 | ✓ | {{kpi_g1_i1_definition}} |
| D.3 Nhóm 1 (TỔNG ĐÀI 18009000) | 1.1 – Tiêu chuẩn (KPIs) | kpi_g1_i1_standard | text | 0.95 | R6c8 | ✓ | {{kpi_g1_i1_standard}} |
| D.3 Nhóm 1 (TỔNG ĐÀI 18009000) | 1.1 – Tỷ trọng (Điểm) | kpi_g1_i1_weight | number | 12 | R6c9 | ✓ | {{kpi_g1_i1_weight}} |
| D.3 Nhóm 1 (TỔNG ĐÀI 18009000) | 1.1 – Phương pháp & cách tính điểm | kpi_g1_i1_method | textarea | = (Số cuộc gọi được trả lời bởi nhân công/Tổng Số cuộc gọi – cuộc gọi tự ngắt)*100%. / '- Đạt >=KPI: Điểm đạt = 12 điểm / - Đạt 94.50% đến dưới 95%: Điểm đạt = 9 điểm. / - Đạt 94% đến dưới 94.50%: Điểm đạt = 6 điểm / - Đạt 93.50% đến dưới 94%: Điểm đạt = 3 điểm. / - Đạt dưới 93.50%: Điểm đạt = 0 điểm. | R6c10 | ✓ | {{kpi_g1_i1_method}} |
| D.3 Nhóm 1 (TỔNG ĐÀI 18009000) | 1.1 – Điểm đạt | kpi_g1_i1_score | number |  | R6 result | Nghiệm thu | {{kpi_g1_i1_score}} |
| D.3 Nhóm 1 (TỔNG ĐÀI 18009000) | 1.1 – Ghi chú | kpi_g1_i1_note | text |  | R6c11 | Nghiệm thu | {{kpi_g1_i1_note}} |
| D.3 Nhóm 1 (TỔNG ĐÀI 18009000) | 1.2 – Tên chỉ tiêu | kpi_g1_i2_name | text | Số ngày đạt chỉ tiêu kết nối | R7c1 | ✓ | {{kpi_g1_i2_name}} |
| D.3 Nhóm 1 (TỔNG ĐÀI 18009000) | 1.2 – Định nghĩa tiêu chí | kpi_g1_i2_definition | textarea | Là số ngày đạt KPI chỉ tiêu kết nối 95%/tháng | R7c2 | ✓ | {{kpi_g1_i2_definition}} |
| D.3 Nhóm 1 (TỔNG ĐÀI 18009000) | 1.2 – Tiêu chuẩn (KPIs) | kpi_g1_i2_standard | text | 1 | R7c8 | ✓ | {{kpi_g1_i2_standard}} |
| D.3 Nhóm 1 (TỔNG ĐÀI 18009000) | 1.2 – Tỷ trọng (Điểm) | kpi_g1_i2_weight | number | 13 | R7c9 | ✓ | {{kpi_g1_i2_weight}} |
| D.3 Nhóm 1 (TỔNG ĐÀI 18009000) | 1.2 – Phương pháp & cách tính điểm | kpi_g1_i2_method | textarea | - Đạt >=KPI: Điểm đạt = 13 điểm / - 1 ngày không đạt KPI: Trừ 3 điểm. / - Từ ngày thứ 4 không đạt KPI: Điểm = 0. / Ghi chú: Không đánh giá về tỷ lệ kết nối với những ngày lưu lượng cuộc gọi vượt mức 125% lưu lượng trung bình trong tháng T-1. | R7c10 | ✓ | {{kpi_g1_i2_method}} |
| D.3 Nhóm 1 (TỔNG ĐÀI 18009000) | 1.2 – Điểm đạt | kpi_g1_i2_score | number |  | R7 result | Nghiệm thu | {{kpi_g1_i2_score}} |
| D.3 Nhóm 1 (TỔNG ĐÀI 18009000) | 1.2 – Ghi chú | kpi_g1_i2_note | text |  | R7c11 | Nghiệm thu | {{kpi_g1_i2_note}} |
| D.3 Nhóm 1 (TỔNG ĐÀI 18009000) | 1.3 – Tên chỉ tiêu | kpi_g1_i3_name | text | Tỷ lệ KH hài lòng tại kênh 18009000 | R8c1 | ✓ | {{kpi_g1_i3_name}} |
| D.3 Nhóm 1 (TỔNG ĐÀI 18009000) | 1.3 – Định nghĩa tiêu chí | kpi_g1_i3_definition | textarea | Là tỷ lệ Khách hàng đánh giá đồng ý (5-7 điểm) khi sau được hỗ trợ | R8c2 | ✓ | {{kpi_g1_i3_definition}} |
| D.3 Nhóm 1 (TỔNG ĐÀI 18009000) | 1.3 – Tiêu chuẩn (KPIs) | kpi_g1_i3_standard | text | 0.9 | R8c8 | ✓ | {{kpi_g1_i3_standard}} |
| D.3 Nhóm 1 (TỔNG ĐÀI 18009000) | 1.3 – Tỷ trọng (Điểm) | kpi_g1_i3_weight | number | 15 | R8c9 | ✓ | {{kpi_g1_i3_weight}} |
| D.3 Nhóm 1 (TỔNG ĐÀI 18009000) | 1.3 – Phương pháp & cách tính điểm | kpi_g1_i3_method | textarea | =(Số lượng KH hài lòng/Tổng trường hợp KH tham gia đánh giá)*100.  / - Đạt >= KPI: Điểm đạt = 15 điểm / - Đạt 89.50% đến dưới 90%: Điểm đạt = 13 điểm. / - Đạt 89% đến dưới 89.50%: Điểm đạt = 10 điểm / - Đạt 88.50% đến dưới 89%: Điểm đạt = 7 điểm. / - Đạt từ 88% đến dưới 88.50%: Điểm đạt = 4 điểm / - Đạt < 88%: Điểm đạt = 0 điểm | R8c10 | ✓ | {{kpi_g1_i3_method}} |
| D.3 Nhóm 1 (TỔNG ĐÀI 18009000) | 1.3 – Điểm đạt | kpi_g1_i3_score | number |  | R8 result | Nghiệm thu | {{kpi_g1_i3_score}} |
| D.3 Nhóm 1 (TỔNG ĐÀI 18009000) | 1.3 – Ghi chú | kpi_g1_i3_note | text |  | R8c11 | Nghiệm thu | {{kpi_g1_i3_note}} |
| D.3 Nhóm 1 (TỔNG ĐÀI 18009000) | 1.4 – Tên chỉ tiêu | kpi_g1_i4_name | text | Tỷ lệ đạt KPI hài lòng đối với phân lớp < 3 tháng | R9c1 | ✓ | {{kpi_g1_i4_name}} |
| D.3 Nhóm 1 (TỔNG ĐÀI 18009000) | 1.4 – Định nghĩa tiêu chí | kpi_g1_i4_definition | textarea | Là số nhân công đạt KPIs hài lòng theo quy định/Tổng nhân công giải đáp. | R9c2 | ✓ | {{kpi_g1_i4_definition}} |
| D.3 Nhóm 1 (TỔNG ĐÀI 18009000) | 1.4 – Tiêu chuẩn (KPIs) | kpi_g1_i4_standard | text | / 70.53% | R9c8 | ✓ | {{kpi_g1_i4_standard}} |
| D.3 Nhóm 1 (TỔNG ĐÀI 18009000) | 1.4 – Tỷ trọng (Điểm) | kpi_g1_i4_weight | number | 10 | R9c9 | ✓ | {{kpi_g1_i4_weight}} |
| D.3 Nhóm 1 (TỔNG ĐÀI 18009000) | 1.4 – Phương pháp & cách tính điểm | kpi_g1_i4_method | textarea | = (Số lượng nhân công phân lớp < 3 tháng đạt KPI hài lòng/tổng nhân công giải đáp trong tháng)*100. / - Đạt >=KPI: Điểm đạt = 10 điểm / - Mỗi 1% dưới ngưỡng KPI trừ 1 điểm. Trừ đến hết quỹ điểm. / Nếu trong tháng không có ĐTV < 3 tháng, điểm dồn hết mục 5. | R9c10 | ✓ | {{kpi_g1_i4_method}} |
| D.3 Nhóm 1 (TỔNG ĐÀI 18009000) | 1.4 – Điểm đạt | kpi_g1_i4_score | number |  | R9 result | Nghiệm thu | {{kpi_g1_i4_score}} |
| D.3 Nhóm 1 (TỔNG ĐÀI 18009000) | 1.4 – Ghi chú | kpi_g1_i4_note | text |  | R9c11 | Nghiệm thu | {{kpi_g1_i4_note}} |
| D.3 Nhóm 1 (TỔNG ĐÀI 18009000) | 1.5 – Tên chỉ tiêu | kpi_g1_i5_name | text | Tỷ lệ đạt KPI hài lòng đối với phân lớp > 3 tháng | R10c1 | ✓ | {{kpi_g1_i5_name}} |
| D.3 Nhóm 1 (TỔNG ĐÀI 18009000) | 1.5 – Định nghĩa tiêu chí | kpi_g1_i5_definition | textarea | Là số nhân công đạt KPIs hài lòng theo quy định/Tổng nhân công giải đáp. | R10c2 | ✓ | {{kpi_g1_i5_definition}} |
| D.3 Nhóm 1 (TỔNG ĐÀI 18009000) | 1.5 – Tiêu chuẩn (KPIs) | kpi_g1_i5_standard | text | 0.7545 | R10c8 | ✓ | {{kpi_g1_i5_standard}} |
| D.3 Nhóm 1 (TỔNG ĐÀI 18009000) | 1.5 – Tỷ trọng (Điểm) | kpi_g1_i5_weight | number | 10 | R10c9 | ✓ | {{kpi_g1_i5_weight}} |
| D.3 Nhóm 1 (TỔNG ĐÀI 18009000) | 1.5 – Phương pháp & cách tính điểm | kpi_g1_i5_method | textarea | = (Số lượng nhân công phân lớp > 3 tháng đạt KPI hài lòng/tổng nhân công giải đáp trong tháng)*100. / - Đạt >=KPI: Điểm đạt = 10 điểm / - Mỗi 1% dưới ngưỡng KPI trừ 1 điểm. Trừ đến hết quỹ điểm. | R10c10 | ✓ | {{kpi_g1_i5_method}} |
| D.3 Nhóm 1 (TỔNG ĐÀI 18009000) | 1.5 – Điểm đạt | kpi_g1_i5_score | number |  | R10 result | Nghiệm thu | {{kpi_g1_i5_score}} |
| D.3 Nhóm 1 (TỔNG ĐÀI 18009000) | 1.5 – Ghi chú | kpi_g1_i5_note | text |  | R10c11 | Nghiệm thu | {{kpi_g1_i5_note}} |
| D.4 Nhóm 2 (TỔNG ĐÀI 1789-5) | Tên nhóm 2 | kpi_g2_name | text | TỔNG ĐÀI 1789-5 | R11c1 | ✓ | {{kpi_g2_name}} |
| D.4 Nhóm 2 (TỔNG ĐÀI 1789-5) | Quỹ điểm nhóm 2 | kpi_g2_quota | number | 20 | R11c9 | ✓ | {{kpi_g2_quota}} |
| D.4 Nhóm 2 (TỔNG ĐÀI 1789-5) | 2.1 – Tên chỉ tiêu | kpi_g2_i1_name | text | Tỷ lệ cuộc gọi kết nối thành công trong tháng | R12c1 | ✓ | {{kpi_g2_i1_name}} |
| D.4 Nhóm 2 (TỔNG ĐÀI 1789-5) | 2.1 – Định nghĩa tiêu chí | kpi_g2_i1_definition | textarea | Là số cuộc gọi kết nối thành công đến Nhân công/ tổng cuộc gọi/tháng. | R12c2 | ✓ | {{kpi_g2_i1_definition}} |
| D.4 Nhóm 2 (TỔNG ĐÀI 1789-5) | 2.1 – Tiêu chuẩn (KPIs) | kpi_g2_i1_standard | text | 0.95 | R12c8 | ✓ | {{kpi_g2_i1_standard}} |
| D.4 Nhóm 2 (TỔNG ĐÀI 1789-5) | 2.1 – Tỷ trọng (Điểm) | kpi_g2_i1_weight | number | 3 | R12c9 | ✓ | {{kpi_g2_i1_weight}} |
| D.4 Nhóm 2 (TỔNG ĐÀI 1789-5) | 2.1 – Phương pháp & cách tính điểm | kpi_g2_i1_method | textarea | = (Số cuộc gọi được trả lời bởi nhân công/Tổng Số cuộc gọi – cuộc gọi tự ngắt)*100%. / - Đạt >=KPI: Điểm đạt = 3 điểm / - Đạt 94.50% đến dưới 95%: Điểm đạt = 2.6 điểm. / - Đạt 94% đến dưới 94.50%: Điểm đạt = 2.2 điểm / - Đạt 93.50% đến dưới 94%: Điểm đạt = 1.8 điểm. / - Đạt từ 93% đến dưới 93.50%: Điểm đạt = 1.4 điểm / - Đạt từ 92.5% đến dưới 93%: 1 điểm / - Đạt từ 92% đến dưới 92.5%: 0.6 điểm / - Đạt từ 91% đến dưới 92%: 0.2 điểm / - Đạt <91%: Điểm đạt = 0 điểm. | R12c10 | ✓ | {{kpi_g2_i1_method}} |
| D.4 Nhóm 2 (TỔNG ĐÀI 1789-5) | 2.1 – Điểm đạt | kpi_g2_i1_score | number |  | R12 result | Nghiệm thu | {{kpi_g2_i1_score}} |
| D.4 Nhóm 2 (TỔNG ĐÀI 1789-5) | 2.1 – Ghi chú | kpi_g2_i1_note | text |  | R12c11 | Nghiệm thu | {{kpi_g2_i1_note}} |
| D.4 Nhóm 2 (TỔNG ĐÀI 1789-5) | 2.2 – Tên chỉ tiêu | kpi_g2_i2_name | text | Số ngày đạt chỉ tiêu kết nối | R13c1 | ✓ | {{kpi_g2_i2_name}} |
| D.4 Nhóm 2 (TỔNG ĐÀI 1789-5) | 2.2 – Định nghĩa tiêu chí | kpi_g2_i2_definition | textarea | Là số ngày đạt KPI chỉ tiêu kết nối 95%/tháng | R13c2 | ✓ | {{kpi_g2_i2_definition}} |
| D.4 Nhóm 2 (TỔNG ĐÀI 1789-5) | 2.2 – Tiêu chuẩn (KPIs) | kpi_g2_i2_standard | text | 1 | R13c8 | ✓ | {{kpi_g2_i2_standard}} |
| D.4 Nhóm 2 (TỔNG ĐÀI 1789-5) | 2.2 – Tỷ trọng (Điểm) | kpi_g2_i2_weight | number | 4 | R13c9 | ✓ | {{kpi_g2_i2_weight}} |
| D.4 Nhóm 2 (TỔNG ĐÀI 1789-5) | 2.2 – Phương pháp & cách tính điểm | kpi_g2_i2_method | textarea | - Đạt >=KPI: Điểm đạt = 4 điểm / - 1 ngày không đạt KPI: Trừ 1 điểm. / - Từ ngày thứ 4 không đạt KPI: Điểm = 0. / Ghi chú: không đánh giá về tỷ lệ kết nối với những ngày đối tác đã phân bố đủ số lượng seats theo yêu cầu và đạt năng suất/thời gian available múi giờ lỗi phát sinh. | R13c10 | ✓ | {{kpi_g2_i2_method}} |
| D.4 Nhóm 2 (TỔNG ĐÀI 1789-5) | 2.2 – Điểm đạt | kpi_g2_i2_score | number |  | R13 result | Nghiệm thu | {{kpi_g2_i2_score}} |
| D.4 Nhóm 2 (TỔNG ĐÀI 1789-5) | 2.2 – Ghi chú | kpi_g2_i2_note | text |  | R13c11 | Nghiệm thu | {{kpi_g2_i2_note}} |
| D.4 Nhóm 2 (TỔNG ĐÀI 1789-5) | 2.3 – Tên chỉ tiêu | kpi_g2_i3_name | text | Tỷ lệ KH hài lòng tại kênh 1789 nhánh 5 5 | R14c1 | ✓ | {{kpi_g2_i3_name}} |
| D.4 Nhóm 2 (TỔNG ĐÀI 1789-5) | 2.3 – Định nghĩa tiêu chí | kpi_g2_i3_definition | textarea | Là tỷ lệ Khách hàng đánh giá đồng ý (5-7 điểm) khi sau được hỗ trợ | R14c2 | ✓ | {{kpi_g2_i3_definition}} |
| D.4 Nhóm 2 (TỔNG ĐÀI 1789-5) | 2.3 – Tiêu chuẩn (KPIs) | kpi_g2_i3_standard | text | 0.945 | R14c8 | ✓ | {{kpi_g2_i3_standard}} |
| D.4 Nhóm 2 (TỔNG ĐÀI 1789-5) | 2.3 – Tỷ trọng (Điểm) | kpi_g2_i3_weight | number | 4 | R14c9 | ✓ | {{kpi_g2_i3_weight}} |
| D.4 Nhóm 2 (TỔNG ĐÀI 1789-5) | 2.3 – Phương pháp & cách tính điểm | kpi_g2_i3_method | textarea | =(Số lượng KH hài lòng/Tổng trường hợp KH tham gia đánh giá)*100.  / - Đạt >= KPI: Điểm đạt = 4 điểm / - Đạt 94% đến dưới 94.50%: Điểm đạt = 3.2 điểm. / - Đạt 93% đến 94%: Điểm đạt = 2.4 điểm / - Đạt 92% đến dưới 93%: Điểm đạt = 1.6 điểm. / - Đạt từ 91% đến dưới 92%: Điểm đạt = 0.8 điểm / - Đạt dưới 91%: Điểm đạt =0 | R14c10 | ✓ | {{kpi_g2_i3_method}} |
| D.4 Nhóm 2 (TỔNG ĐÀI 1789-5) | 2.3 – Điểm đạt | kpi_g2_i3_score | number |  | R14 result | Nghiệm thu | {{kpi_g2_i3_score}} |
| D.4 Nhóm 2 (TỔNG ĐÀI 1789-5) | 2.3 – Ghi chú | kpi_g2_i3_note | text |  | R14c11 | Nghiệm thu | {{kpi_g2_i3_note}} |
| D.4 Nhóm 2 (TỔNG ĐÀI 1789-5) | 2.4 – Tên chỉ tiêu | kpi_g2_i4_name | text | Tỷ lệ đạt KPI hài lòng đối với nhân công | R15c1 | ✓ | {{kpi_g2_i4_name}} |
| D.4 Nhóm 2 (TỔNG ĐÀI 1789-5) | 2.4 – Định nghĩa tiêu chí | kpi_g2_i4_definition | textarea | Là số nhân công đạt KPIs hài lòng theo quy định 94.5%/Tổng nhân công giải đáp. | R15c2 | ✓ | {{kpi_g2_i4_definition}} |
| D.4 Nhóm 2 (TỔNG ĐÀI 1789-5) | 2.4 – Tiêu chuẩn (KPIs) | kpi_g2_i4_standard | text | 73.91% | R15c8 | ✓ | {{kpi_g2_i4_standard}} |
| D.4 Nhóm 2 (TỔNG ĐÀI 1789-5) | 2.4 – Tỷ trọng (Điểm) | kpi_g2_i4_weight | number | 9 | R15c9 | ✓ | {{kpi_g2_i4_weight}} |
| D.4 Nhóm 2 (TỔNG ĐÀI 1789-5) | 2.4 – Phương pháp & cách tính điểm | kpi_g2_i4_method | textarea | = (Số lượng Nhân công đạtKPI hài lòng/tổng nhân công giải đáp trong tháng)*100. / - Đạt >=KPI: Điểm đạt = 9 điểm / - Mỗi 1% dưới ngưỡng KPI trừ 0.9 điểm. Trừ đến hết quỹ điểm. | R15c10 | ✓ | {{kpi_g2_i4_method}} |
| D.4 Nhóm 2 (TỔNG ĐÀI 1789-5) | 2.4 – Điểm đạt | kpi_g2_i4_score | number |  | R15 result | Nghiệm thu | {{kpi_g2_i4_score}} |
| D.4 Nhóm 2 (TỔNG ĐÀI 1789-5) | 2.4 – Ghi chú | kpi_g2_i4_note | text |  | R15c11 | Nghiệm thu | {{kpi_g2_i4_note}} |
| D.5 Nhóm 3 (CHAT NHÂN CÔNG) | Tên nhóm 3 | kpi_g3_name | text | CHAT NHÂN CÔNG | R16c1 | ✓ | {{kpi_g3_name}} |
| D.5 Nhóm 3 (CHAT NHÂN CÔNG) | Quỹ điểm nhóm 3 | kpi_g3_quota | number | 18 | R16c9 | ✓ | {{kpi_g3_quota}} |
| D.5 Nhóm 3 (CHAT NHÂN CÔNG) | 3.1 – Tên chỉ tiêu | kpi_g3_i1_name | text | Tiến độ phản hồi trong hạn/tháng | R17c1 | ✓ | {{kpi_g3_i1_name}} |
| D.5 Nhóm 3 (CHAT NHÂN CÔNG) | 3.1 – Định nghĩa tiêu chí | kpi_g3_i1_definition | textarea | Là số phiên chat chuyển Tư vấn viên (TVV) giải đáp khách hàng trong hạn (<10 phút)/ tổng số phiên chat chuyển TVV/tháng. / Ghi chú: Thời gian trả lời trong hạn (10 phút) sẽ thay đổi tùy tình hình thực tế. | R17c2 | ✓ | {{kpi_g3_i1_definition}} |
| D.5 Nhóm 3 (CHAT NHÂN CÔNG) | 3.1 – Tiêu chuẩn (KPIs) | kpi_g3_i1_standard | text | 0.95 | R17c8 | ✓ | {{kpi_g3_i1_standard}} |
| D.5 Nhóm 3 (CHAT NHÂN CÔNG) | 3.1 – Tỷ trọng (Điểm) | kpi_g3_i1_weight | number | 6 | R17c9 | ✓ | {{kpi_g3_i1_weight}} |
| D.5 Nhóm 3 (CHAT NHÂN CÔNG) | 3.1 – Phương pháp & cách tính điểm | kpi_g3_i1_method | textarea | Tỷ lệ xử lý trong hạn = (Số lượng phiên Chat được Tư vấn viên phản hồi trong hạn/Tổng số phiên chat chuyển tới Tư vấn viên)*100%. / - Đạt >=KPI: Điểm đạt = 6 điểm / - Đạt 94.50% đến dưới 95%: Điểm đạt = 5.4 điểm. / - Đạt 94% đến 94.50%: Điểm đạt = 4.8 điểm / - Đạt 93.50% đến dưới 94%: Điểm đạt = 4.2 điểm. / - Đạt 93% đến dưới 93.50%: Điểm đạt = 3.6 điểm. / - Đạt 92.5% đến dưới 93%: Điểm đạt = 3.0 điểm. / - Đạt 92% đến dưới 92.5%: Điểm đạt = 2.4 điểm. / - Đạt từ 91.5% đến dưới 92%: Điểm đạt = 1.8 điểm. / - Đạt từ 91% đến dưới 91.5%: Điểm đạt = 1.2 điểm. / - Đạt từ 90% đến dưới 91%: Điểm đạt = 0.6 điểm / - Đạt dưới 90%: Điểm đạt = 0 điểm. | R17c10 | ✓ | {{kpi_g3_i1_method}} |
| D.5 Nhóm 3 (CHAT NHÂN CÔNG) | 3.1 – Điểm đạt | kpi_g3_i1_score | number |  | R17 result | Nghiệm thu | {{kpi_g3_i1_score}} |
| D.5 Nhóm 3 (CHAT NHÂN CÔNG) | 3.1 – Ghi chú | kpi_g3_i1_note | text |  | R17c11 | Nghiệm thu | {{kpi_g3_i1_note}} |
| D.5 Nhóm 3 (CHAT NHÂN CÔNG) | 3.2 – Tên chỉ tiêu | kpi_g3_i2_name | text | Số ngày không đạt chỉ tiêu tiến độ | R18c1 | ✓ | {{kpi_g3_i2_name}} |
| D.5 Nhóm 3 (CHAT NHÂN CÔNG) | 3.2 – Định nghĩa tiêu chí | kpi_g3_i2_definition | textarea | Là số ngày không đạt đạt KPI chỉ tiêu tiến độ/tổng tháng | R18c2 | ✓ | {{kpi_g3_i2_definition}} |
| D.5 Nhóm 3 (CHAT NHÂN CÔNG) | 3.2 – Tiêu chuẩn (KPIs) | kpi_g3_i2_standard | text | 1 | R18c8 | ✓ | {{kpi_g3_i2_standard}} |
| D.5 Nhóm 3 (CHAT NHÂN CÔNG) | 3.2 – Tỷ trọng (Điểm) | kpi_g3_i2_weight | number | 5 | R18c9 | ✓ | {{kpi_g3_i2_weight}} |
| D.5 Nhóm 3 (CHAT NHÂN CÔNG) | 3.2 – Phương pháp & cách tính điểm | kpi_g3_i2_method | textarea | - Đạt >=KPI: Điểm đạt = 5 điểm / - 1 ngày không đạt KPI: Trừ 1.25 điểm. / - Từ ngày thứ 4 không đạt KPI: Điểm = 0. / Ghi chú: không đánh giá về tiến độ xử lý với những ngày lưu lượng cuộc gọi vượt mức 125% lưu lượng trung bình trong tháng. | R18c10 | ✓ | {{kpi_g3_i2_method}} |
| D.5 Nhóm 3 (CHAT NHÂN CÔNG) | 3.2 – Điểm đạt | kpi_g3_i2_score | number |  | R18 result | Nghiệm thu | {{kpi_g3_i2_score}} |
| D.5 Nhóm 3 (CHAT NHÂN CÔNG) | 3.2 – Ghi chú | kpi_g3_i2_note | text |  | R18c11 | Nghiệm thu | {{kpi_g3_i2_note}} |
| D.5 Nhóm 3 (CHAT NHÂN CÔNG) | 3.3 – Tên chỉ tiêu | kpi_g3_i3_name | text | Tỷ lệ KH hài lòng tại kênh giải đáp trực tuyến | R19c1 | ✓ | {{kpi_g3_i3_name}} |
| D.5 Nhóm 3 (CHAT NHÂN CÔNG) | 3.3 – Định nghĩa tiêu chí | kpi_g3_i3_definition | textarea | Là các trường hợp KH đánh đồng ý (đạt từ 5-7 điểm) về chất lượng phục vụ của Nhân công/tổng phiên chat hệ thống gửi khảo sát | R19c2 | ✓ | {{kpi_g3_i3_definition}} |
| D.5 Nhóm 3 (CHAT NHÂN CÔNG) | 3.3 – Tiêu chuẩn (KPIs) | kpi_g3_i3_standard | text | 0.9 | R19c8 | ✓ | {{kpi_g3_i3_standard}} |
| D.5 Nhóm 3 (CHAT NHÂN CÔNG) | 3.3 – Tỷ trọng (Điểm) | kpi_g3_i3_weight | number | 7 | R19c9 | ✓ | {{kpi_g3_i3_weight}} |
| D.5 Nhóm 3 (CHAT NHÂN CÔNG) | 3.3 – Phương pháp & cách tính điểm | kpi_g3_i3_method | textarea | =(Số lượng KH hài lòng/Tổng trường hợp KH tham gia đánh giá)*100.  / - Đạt >= KPI: Điểm đạt = 7 điểm / - Đạt 89.50% đến dưới 90%: Điểm đạt = 6 điểm. / - Đạt 89% đến 89.50%: Điểm đạt = 5 điểm / - Đạt 88.50% đến dưới 89%: Điểm đạt = 4 điểm. / - Đạt từ 88% đến dưới 88.50%: Điểm đạt = 3 điểm / - Đạt từ 87.5% đến dưới 88%: Điểm đạt = 2 điểm. / - Đạt từ 87% đến dưới 87.5%: Điểm đạt = 1 / - Đạt < 87%: Điểm đạt = 0 điểm | R19c10 | ✓ | {{kpi_g3_i3_method}} |
| D.5 Nhóm 3 (CHAT NHÂN CÔNG) | 3.3 – Điểm đạt | kpi_g3_i3_score | number |  | R19 result | Nghiệm thu | {{kpi_g3_i3_score}} |
| D.5 Nhóm 3 (CHAT NHÂN CÔNG) | 3.3 – Ghi chú | kpi_g3_i3_note | text |  | R19c11 | Nghiệm thu | {{kpi_g3_i3_note}} |
| D.6 Nhóm 4 (CHẤT LƯỢNG XỬ LÝ ĐẦU MỤC CHUYỂN TIỀN MẶT NHẬN TẠI NHÀ) | Tên nhóm 4 | kpi_g4_name | text | CHẤT LƯỢNG XỬ LÝ ĐẦU MỤC CHUYỂN TIỀN MẶT NHẬN TẠI NHÀ | R20c1 | ✓ | {{kpi_g4_name}} |
| D.6 Nhóm 4 (CHẤT LƯỢNG XỬ LÝ ĐẦU MỤC CHUYỂN TIỀN MẶT NHẬN TẠI NHÀ) | Quỹ điểm nhóm 4 | kpi_g4_quota | number | 2 | R20c9 | ✓ | {{kpi_g4_quota}} |
| D.6 Nhóm 4 (CHẤT LƯỢNG XỬ LÝ ĐẦU MỤC CHUYỂN TIỀN MẶT NHẬN TẠI NHÀ) | 4.1 – Tên chỉ tiêu | kpi_g4_i1_name | text | Tiến độ xử lý | R21c1 | ✓ | {{kpi_g4_i1_name}} |
| D.6 Nhóm 4 (CHẤT LƯỢNG XỬ LÝ ĐẦU MỤC CHUYỂN TIỀN MẶT NHẬN TẠI NHÀ) | 4.1 – Định nghĩa tiêu chí | kpi_g4_i1_definition | textarea | Là tỷ lệ PAKN được xử lý đúng và trong hạn / tổng PAKN tiếp nhận trong tháng | R21c2 | ✓ | {{kpi_g4_i1_definition}} |
| D.6 Nhóm 4 (CHẤT LƯỢNG XỬ LÝ ĐẦU MỤC CHUYỂN TIỀN MẶT NHẬN TẠI NHÀ) | 4.1 – Tiêu chuẩn (KPIs) | kpi_g4_i1_standard | text | 0.9969 | R21c8 | ✓ | {{kpi_g4_i1_standard}} |
| D.6 Nhóm 4 (CHẤT LƯỢNG XỬ LÝ ĐẦU MỤC CHUYỂN TIỀN MẶT NHẬN TẠI NHÀ) | 4.1 – Tỷ trọng (Điểm) | kpi_g4_i1_weight | number | 1 | R21c9 | ✓ | {{kpi_g4_i1_weight}} |
| D.6 Nhóm 4 (CHẤT LƯỢNG XỬ LÝ ĐẦU MỤC CHUYỂN TIỀN MẶT NHẬN TẠI NHÀ) | 4.1 – Phương pháp & cách tính điểm | kpi_g4_i1_method | textarea | = (Số lượng phản ánh khiếu nại xử lý trong hạn/ tổng các trường hợp xử lý trong kỳ đánh giá)*100%. / - Đạt >= KPI: Điểm đạt = 1 điểm / - Đạt 99.50% đến dưới 99.69%: Đạt 0.8 điểm. / - Đạt 99% đến 99.50%: Đạt 0.6 điểm / - Đạt 98.50% đến dưới 99%: Đạt 0.4 điểm / - Đạt < 98.50%: 0 điểm | R21c10 | ✓ | {{kpi_g4_i1_method}} |
| D.6 Nhóm 4 (CHẤT LƯỢNG XỬ LÝ ĐẦU MỤC CHUYỂN TIỀN MẶT NHẬN TẠI NHÀ) | 4.1 – Điểm đạt | kpi_g4_i1_score | number |  | R21 result | Nghiệm thu | {{kpi_g4_i1_score}} |
| D.6 Nhóm 4 (CHẤT LƯỢNG XỬ LÝ ĐẦU MỤC CHUYỂN TIỀN MẶT NHẬN TẠI NHÀ) | 4.1 – Ghi chú | kpi_g4_i1_note | text |  | R21c11 | Nghiệm thu | {{kpi_g4_i1_note}} |
| D.6 Nhóm 4 (CHẤT LƯỢNG XỬ LÝ ĐẦU MỤC CHUYỂN TIỀN MẶT NHẬN TẠI NHÀ) | 4.2 – Tên chỉ tiêu | kpi_g4_i2_name | text | Tỷ lệ hài lòng của khách hàng | R22c1 | ✓ | {{kpi_g4_i2_name}} |
| D.6 Nhóm 4 (CHẤT LƯỢNG XỬ LÝ ĐẦU MỤC CHUYỂN TIỀN MẶT NHẬN TẠI NHÀ) | 4.2 – Định nghĩa tiêu chí | kpi_g4_i2_definition | textarea | Là các trường hợp KH đánh giá hài lòng (Hệ thống đo tự động cùng VTT từ đầu số 1715 ) về chất lượng xử lý sau khi PAKN được đóng và hệ thống gửi khảo sát. | R22c2 | ✓ | {{kpi_g4_i2_definition}} |
| D.6 Nhóm 4 (CHẤT LƯỢNG XỬ LÝ ĐẦU MỤC CHUYỂN TIỀN MẶT NHẬN TẠI NHÀ) | 4.2 – Tiêu chuẩn (KPIs) | kpi_g4_i2_standard | text | 0.929 | R22c8 | ✓ | {{kpi_g4_i2_standard}} |
| D.6 Nhóm 4 (CHẤT LƯỢNG XỬ LÝ ĐẦU MỤC CHUYỂN TIỀN MẶT NHẬN TẠI NHÀ) | 4.2 – Tỷ trọng (Điểm) | kpi_g4_i2_weight | number | 1 | R22c9 | ✓ | {{kpi_g4_i2_weight}} |
| D.6 Nhóm 4 (CHẤT LƯỢNG XỬ LÝ ĐẦU MỤC CHUYỂN TIỀN MẶT NHẬN TẠI NHÀ) | 4.2 – Phương pháp & cách tính điểm | kpi_g4_i2_method | textarea | = (Số lượng KH hài lòng đạt 5-7 điểm/ tổng các trường hợp KH tham gia đánh giá trong kỳ đánh giá)*100%. / - Đạt >= KPI: Điểm đạt = 1 điểm / - Đạt 92.40% đến dưới 92.90%: 0.8 điểm. / - Đạt 91.90% đến dưới 92.40%: 0.6 điểm. / - Đạt 91.40% đến dưới 91.90%: 0.4 điểm. / - Đạt 90.90% đến dưới 91.40%: / - Đạt 90.40% đến dưới 90.90% / - Đạt <91.50%: 0 điểm. | R22c10 | ✓ | {{kpi_g4_i2_method}} |
| D.6 Nhóm 4 (CHẤT LƯỢNG XỬ LÝ ĐẦU MỤC CHUYỂN TIỀN MẶT NHẬN TẠI NHÀ) | 4.2 – Điểm đạt | kpi_g4_i2_score | number |  | R22 result | Nghiệm thu | {{kpi_g4_i2_score}} |
| D.6 Nhóm 4 (CHẤT LƯỢNG XỬ LÝ ĐẦU MỤC CHUYỂN TIỀN MẶT NHẬN TẠI NHÀ) | 4.2 – Ghi chú | kpi_g4_i2_note | text |  | R22c11 | Nghiệm thu | {{kpi_g4_i2_note}} |
| D.7 Nhóm 5 (CÁC VI PHẠM TRỪ TRÊN TỔNG 100 ĐIỂM) | Tên nhóm 5 | kpi_g5_name | text | CÁC VI PHẠM TRỪ TRÊN TỔNG 100 ĐIỂM | R23c1 | ✓ | {{kpi_g5_name}} |
| D.7 Nhóm 5 (CÁC VI PHẠM TRỪ TRÊN TỔNG 100 ĐIỂM) | 5.1 – Tên chỉ tiêu | kpi_g5_i1_name | text | Gian dối trong công việc, phá hoại gây ảnh hưởng lợi ích KH và lợi ích Viettel | R24c1 | ✓ | {{kpi_g5_i1_name}} |
| D.7 Nhóm 5 (CÁC VI PHẠM TRỪ TRÊN TỔNG 100 ĐIỂM) | 5.1 – Định nghĩa tiêu chí | kpi_g5_i1_definition | textarea | Là các hành động lợi dụng kẽ hở của hệ thống để tác động vào thuê bao nhằm trục lợi cá nhân, bán cơ sở dữ liệu hoặc thông tin nội bộ tại tổng đài để trục lợi cá nhân, đưa thông tin Khách hàng trên các diễn đàn/báo chí...gây ảnh hưởng tới Khách hàng, các hành vi cố ý gọi lên tổng đài để tăng năng suất cuộc gọi, hành vi gian lận, quấy rối phá hoại tổng đài, vi phạm chỉ thị… | R24c2 | ✓ | {{kpi_g5_i1_definition}} |
| D.7 Nhóm 5 (CÁC VI PHẠM TRỪ TRÊN TỔNG 100 ĐIỂM) | 5.1 – Tiêu chuẩn (KPIs) | kpi_g5_i1_standard | text | 0TH | R24c8 | ✓ | {{kpi_g5_i1_standard}} |
| D.7 Nhóm 5 (CÁC VI PHẠM TRỪ TRÊN TỔNG 100 ĐIỂM) | 5.1 – Phương pháp & cách tính điểm | kpi_g5_i1_method | textarea | Trừ 10 điểm/vi phạm (Trừ trên điểm tổng) + Bồi thường thiệt hại (nếu có). | R24c10 | ✓ | {{kpi_g5_i1_method}} |
| D.7 Nhóm 5 (CÁC VI PHẠM TRỪ TRÊN TỔNG 100 ĐIỂM) | 5.1 – Điểm đạt | kpi_g5_i1_score | number |  | R24 result | Nghiệm thu | {{kpi_g5_i1_score}} |
| D.7 Nhóm 5 (CÁC VI PHẠM TRỪ TRÊN TỔNG 100 ĐIỂM) | 5.1 – Ghi chú | kpi_g5_i1_note | text |  | R24c11 | Nghiệm thu | {{kpi_g5_i1_note}} |
| D.7 Nhóm 5 (CÁC VI PHẠM TRỪ TRÊN TỔNG 100 ĐIỂM) | 5.2 – Tên chỉ tiêu | kpi_g5_i2_name | text | Vi phạm thái độ | R25c1 | ✓ | {{kpi_g5_i2_name}} |
| D.7 Nhóm 5 (CÁC VI PHẠM TRỪ TRÊN TỔNG 100 ĐIỂM) | 5.2 – Định nghĩa tiêu chí | kpi_g5_i2_definition | textarea | Là các trường hợp có thái độ không tôn trọng khách hàng, không giữ lời hứa làm ảnh hưởng đến quyền lợi, quá trình sử dụng dịch vụ …dẫn đến khiếu nại, VDS phát hiện trong quá trình xử lý, kiểm soát. | R25c2 | ✓ | {{kpi_g5_i2_definition}} |
| D.7 Nhóm 5 (CÁC VI PHẠM TRỪ TRÊN TỔNG 100 ĐIỂM) | 5.2 – Tiêu chuẩn (KPIs) | kpi_g5_i2_standard | text | 0TH | R25c8 | ✓ | {{kpi_g5_i2_standard}} |
| D.7 Nhóm 5 (CÁC VI PHẠM TRỪ TRÊN TỔNG 100 ĐIỂM) | 5.2 – Phương pháp & cách tính điểm | kpi_g5_i2_method | textarea | Thống kê theo số trường hợp vi phạm / Trừ 5 điểm/01 TH vi phạm - Trừ trên điểm tổng. | R25c10 | ✓ | {{kpi_g5_i2_method}} |
| D.7 Nhóm 5 (CÁC VI PHẠM TRỪ TRÊN TỔNG 100 ĐIỂM) | 5.2 – Điểm đạt | kpi_g5_i2_score | number |  | R25 result | Nghiệm thu | {{kpi_g5_i2_score}} |
| D.7 Nhóm 5 (CÁC VI PHẠM TRỪ TRÊN TỔNG 100 ĐIỂM) | 5.2 – Ghi chú | kpi_g5_i2_note | text |  | R25c11 | Nghiệm thu | {{kpi_g5_i2_note}} |
| D.7 Nhóm 5 (CÁC VI PHẠM TRỪ TRÊN TỔNG 100 ĐIỂM) | 5.3 – Tên chỉ tiêu | kpi_g5_i3_name | text | Vi phạm nghiệp vụ | R26c1 | ✓ | {{kpi_g5_i3_name}} |
| D.7 Nhóm 5 (CÁC VI PHẠM TRỪ TRÊN TỔNG 100 ĐIỂM) | 5.3 – Định nghĩa tiêu chí | kpi_g5_i3_definition | textarea | Là các trường hợp cung cấp sai, thiếu  thông tin làm ảnh hưởng đến quyền lợi, quá trình sử dụng của khách hàng dẫn đến khiếu nại. | R26c2 | ✓ | {{kpi_g5_i3_definition}} |
| D.7 Nhóm 5 (CÁC VI PHẠM TRỪ TRÊN TỔNG 100 ĐIỂM) | 5.3 – Tiêu chuẩn (KPIs) | kpi_g5_i3_standard | text | 0TH | R26c8 | ✓ | {{kpi_g5_i3_standard}} |
| D.7 Nhóm 5 (CÁC VI PHẠM TRỪ TRÊN TỔNG 100 ĐIỂM) | 5.3 – Phương pháp & cách tính điểm | kpi_g5_i3_method | textarea | Thống kê theo số trường hợp vi phạm / - ĐTV lấp line: Trừ 0.1đ/trường hợp +  Bồi thường thiệt hại (nếu có) / - ĐTV < 3 tháng: Trừ 0.25đ/trường hợp  +  Bồi thường thiệt hại (nếu có). / - ĐTV > 03 tháng: Trừ 0.5 điểm/1 trường hợp vi phạm - Trừ trên tổng điểm +  Bồi thường thiệt hại (nếu có). | R26c10 | ✓ | {{kpi_g5_i3_method}} |
| D.7 Nhóm 5 (CÁC VI PHẠM TRỪ TRÊN TỔNG 100 ĐIỂM) | 5.3 – Điểm đạt | kpi_g5_i3_score | number |  | R26 result | Nghiệm thu | {{kpi_g5_i3_score}} |
| D.7 Nhóm 5 (CÁC VI PHẠM TRỪ TRÊN TỔNG 100 ĐIỂM) | 5.3 – Ghi chú | kpi_g5_i3_note | text |  | R26c11 | Nghiệm thu | {{kpi_g5_i3_note}} |
