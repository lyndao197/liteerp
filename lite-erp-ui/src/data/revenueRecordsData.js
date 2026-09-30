// ==============================================================================
// MOCK DATASET: DANH SÁCH BẢN GHI DOANH THU LIÊN QUAN (TRANSACTION RECORDS)
// Cung cấp dữ liệu chi tiết từng hợp đồng/nghiệm thu/giao dịch ghi nhận doanh thu
// ==============================================================================

export const SPDV_LIST = [
  'Viễn thông & Hạ tầng số',
  'Giải pháp CNTT & Phần mềm',
  'Chuyển đổi số & Tự động hóa',
  'Tích hợp hệ thống & Mạng',
  'An toàn thông tin & Cloud',
  'Tư vấn & Dịch vụ số khác'
];

export const UNIT_LIST = [
  'Trung tâm Kinh doanh 1 (TTKD 1)',
  'Trung tâm Kinh doanh 2 (TTKD 2)',
  'Trung tâm Kinh doanh 3 (TTKD 3)',
  'Ban Giải pháp Doanh nghiệp',
  'Ban Dịch vụ Số & CNTT',
  'Chi nhánh Miền Nam'
];

export const REVENUE_TYPE_LIST = [
  'Bên ngoài tập đoàn',
  'Nội bộ tập đoàn',
  'Khách hàng Quốc tế'
];

export const RECORD_STATUS_LIST = [
  { id: 'invoiced', label: 'Đã xuất hóa đơn', color: '#15803d', bg: '#dcfce7', border: '#bbf7d0' },
  { id: 'accepted', label: 'Đã nghiệm thu BB', color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
  { id: 'auditing', label: 'Đang đối soát', color: '#b45309', bg: '#fef3c7', border: '#fde68a' },
  { id: 'accrued', label: 'Tạm tính kỳ này', color: '#6b21a8', bg: '#f3e8ff', border: '#e9d5ff' }
];

export const ALL_REVENUE_RECORDS = [
  {
    id: 'REC-2026-001',
    contractCode: 'HĐ-2026/VNPT-018',
    contractName: 'Hợp đồng Nâng cấp Trung tâm Dữ liệu & Cloud 2026',
    customer: 'Tập đoàn VNPT',
    customerShort: 'VNPT',
    customerType: 'Khách hàng lớn',
    spdv: 'An toàn thông tin & Cloud',
    unit: 'Trung tâm Kinh doanh 1 (TTKD 1)',
    revenueType: 'Nội bộ tập đoàn',
    year: '2026',
    month: 'Tháng 8',
    quarter: 'Quý III',
    date: '18/08/2026',
    kh: 1250.0,
    th: 1320.0,
    unitName: 'Triệu đ',
    rate: 105.6,
    status: 'invoiced',
    statusLabel: 'Đã xuất hóa đơn',
    am: 'Nguyễn Văn Hải',
    invoiceNumber: 'HD-VAT-89102',
    note: 'Đã đối soát đợt 2, thanh toán đúng hạn'
  },
  {
    id: 'REC-2026-002',
    contractCode: 'HĐ-2026/MB-0341',
    contractName: 'Triển khai Nền tảng Core Banking & Tích hợp API Microservices',
    customer: 'Ngân hàng TMCP Quân Đội (MB Bank)',
    customerShort: 'MB Bank',
    customerType: 'Ngân hàng - Tài chính',
    spdv: 'Giải pháp CNTT & Phần mềm',
    unit: 'Ban Giải pháp Doanh nghiệp',
    revenueType: 'Bên ngoài tập đoàn',
    year: '2026',
    month: 'Tháng 8',
    quarter: 'Quý III',
    date: '22/08/2026',
    kh: 2800.0,
    th: 2950.0,
    unitName: 'Triệu đ',
    rate: 105.4,
    status: 'invoiced',
    statusLabel: 'Đã xuất hóa đơn',
    am: 'Trần Thị Thu Trang',
    invoiceNumber: 'HD-VAT-89105',
    note: 'Nghiệm thu Giai đoạn 1 hoàn thành 100%'
  },
  {
    id: 'REC-2026-003',
    contractCode: 'HĐ-2026/VT-0512',
    contractName: 'Cho thuê Hạ tầng Kênh truyền & Cáp quang DWDM liên tỉnh',
    customer: 'Tổng công ty Viễn thông Viettel',
    customerShort: 'Viettel',
    customerType: 'Viễn thông',
    spdv: 'Viễn thông & Hạ tầng số',
    unit: 'Trung tâm Kinh doanh 2 (TTKD 2)',
    revenueType: 'Bên ngoài tập đoàn',
    year: '2026',
    month: 'Tháng 8',
    quarter: 'Quý III',
    date: '14/08/2026',
    kh: 3400.0,
    th: 3400.0,
    unitName: 'Triệu đ',
    rate: 100.0,
    status: 'invoiced',
    statusLabel: 'Đã xuất hóa đơn',
    am: 'Lê Hoàng Long',
    invoiceNumber: 'HD-VAT-89088',
    note: 'Cước cố định hàng tháng'
  },
  {
    id: 'REC-2026-004',
    contractCode: 'HĐ-2026/TCB-0089',
    contractName: 'Cung cấp Nền tảng Phân tích Dữ liệu Data Warehouse & AI',
    customer: 'Ngân hàng TMCP Kỹ Thương (Techcombank)',
    customerShort: 'Techcombank',
    customerType: 'Ngân hàng - Tài chính',
    spdv: 'Chuyển đổi số & Tự động hóa',
    unit: 'Ban Dịch vụ Số & CNTT',
    revenueType: 'Bên ngoài tập đoàn',
    year: '2026',
    month: 'Tháng 8',
    quarter: 'Quý III',
    date: '25/08/2026',
    kh: 1900.0,
    th: 1750.0,
    unitName: 'Triệu đ',
    rate: 92.1,
    status: 'accepted',
    statusLabel: 'Đã nghiệm thu BB',
    am: 'Phạm Đức Minh',
    invoiceNumber: 'HD-VAT-89140',
    note: 'Đang hoàn tất thủ tục xuất hóa đơn điện tử'
  },
  {
    id: 'REC-2026-005',
    contractCode: 'HĐ-2026/EVN-0419',
    contractName: 'Xây dựng Hệ thống Giám sát Điều độ Lưới điện SCADA/EMS',
    customer: 'Tập đoàn Điện lực Việt Nam (EVN)',
    customerShort: 'EVN',
    customerType: 'Năng lượng - Nhà nước',
    spdv: 'Tích hợp hệ thống & Mạng',
    unit: 'Trung tâm Kinh doanh 3 (TTKD 3)',
    revenueType: 'Bên ngoài tập đoàn',
    year: '2026',
    month: 'Tháng 8',
    quarter: 'Quý III',
    date: '10/08/2026',
    kh: 4500.0,
    th: 4620.0,
    unitName: 'Triệu đ',
    rate: 102.7,
    status: 'invoiced',
    statusLabel: 'Đã xuất hóa đơn',
    am: 'Vũ Quốc Toàn',
    invoiceNumber: 'HD-VAT-89045',
    note: 'Nghiệm thu bàn giao thiết bị trạm biến áp'
  },
  {
    id: 'REC-2026-006',
    contractCode: 'HĐ-2026/VNM-0112',
    contractName: 'Phần mềm Quản lý Chuỗi cung ứng và Phân phối DMS Vinamilk',
    customer: 'Công ty Cổ phần Sữa Việt Nam (Vinamilk)',
    customerShort: 'Vinamilk',
    customerType: 'FMCG - Bán lẻ',
    spdv: 'Giải pháp CNTT & Phần mềm',
    unit: 'Chi nhánh Miền Nam',
    revenueType: 'Bên ngoài tập đoàn',
    year: '2026',
    month: 'Tháng 8',
    quarter: 'Quý III',
    date: '28/08/2026',
    kh: 2100.0,
    th: 2150.0,
    unitName: 'Triệu đ',
    rate: 102.4,
    status: 'invoiced',
    statusLabel: 'Đã xuất hóa đơn',
    am: 'Ngô Thanh Vân',
    invoiceNumber: 'HD-VAT-89182',
    note: 'Nghiệm thu Sprint 4 triển khai 1.200 điểm bán'
  },
  {
    id: 'REC-2026-007',
    contractCode: 'HĐ-2026/INT-0021',
    contractName: 'Dịch vụ Cáp biển Quốc tế APG & Kết nối Băng rộng Singapore',
    customer: 'Singtel International Pte Ltd',
    customerShort: 'Singtel',
    customerType: 'Quốc tế',
    spdv: 'Viễn thông & Hạ tầng số',
    unit: 'Trung tâm Kinh doanh 1 (TTKD 1)',
    revenueType: 'Khách hàng Quốc tế',
    year: '2026',
    month: 'Tháng 8',
    quarter: 'Quý III',
    date: '05/08/2026',
    kh: 5100.0,
    th: 5350.0,
    unitName: 'Triệu đ',
    rate: 104.9,
    status: 'invoiced',
    statusLabel: 'Đã xuất hóa đơn',
    am: 'Đỗ Quỳnh Anh',
    invoiceNumber: 'HD-VAT-INT-092',
    note: 'Thanh toán bằng USD quy đổi tỷ giá thời điểm'
  },
  {
    id: 'REC-2026-008',
    contractCode: 'HĐ-2026/PVN-0761',
    contractName: 'Tư vấn Kiến trúc An ninh Mạng và Triển khai SOC Tập trung',
    customer: 'Tập đoàn Dầu khí Quốc gia (PVN)',
    customerShort: 'PVN',
    customerType: 'Dầu khí - Năng lượng',
    spdv: 'An toàn thông tin & Cloud',
    unit: 'Ban Giải pháp Doanh nghiệp',
    revenueType: 'Bên ngoài tập đoàn',
    year: '2026',
    month: 'Tháng 8',
    quarter: 'Quý III',
    date: '19/08/2026',
    kh: 1800.0,
    th: 1600.0,
    unitName: 'Triệu đ',
    rate: 88.9,
    status: 'auditing',
    statusLabel: 'Đang đối soát',
    am: 'Hoàng Minh Tuấn',
    invoiceNumber: 'Chưa xuất',
    note: 'Đang chờ ký phụ lục điều chỉnh khối lượng bảo mật'
  },
  {
    id: 'REC-2026-009',
    contractCode: 'HĐ-2026/BTC-0033',
    contractName: 'Bảo trì Hệ thống Cơ sở Dữ liệu Thuế Quốc gia',
    customer: 'Bộ Tài chính - Tổng cục Thuế',
    customerShort: 'Bộ Tài chính',
    customerType: 'Chính phủ - Cơ quan Nhà nước',
    spdv: 'Tư vấn & Dịch vụ số khác',
    unit: 'Trung tâm Kinh doanh 3 (TTKD 3)',
    revenueType: 'Bên ngoài tập đoàn',
    year: '2026',
    month: 'Tháng 8',
    quarter: 'Quý III',
    date: '12/08/2026',
    kh: 1650.0,
    th: 1700.0,
    unitName: 'Triệu đ',
    rate: 103.0,
    status: 'invoiced',
    statusLabel: 'Đã xuất hóa đơn',
    am: 'Bùi Đức Huy',
    invoiceNumber: 'HD-VAT-89060',
    note: 'Gói thầu bảo trì thường niên năm 2026'
  },
  {
    id: 'REC-2026-010',
    contractCode: 'HĐ-2026/INT-0085',
    contractName: 'Cung cấp Đường truyền IP Transit & Data Roaming Lào - Campuchia',
    customer: 'Star Telecom Laos (Unitel)',
    customerShort: 'Unitel Laos',
    customerType: 'Quốc tế',
    spdv: 'Viễn thông & Hạ tầng số',
    unit: 'Trung tâm Kinh doanh 2 (TTKD 2)',
    revenueType: 'Khách hàng Quốc tế',
    year: '2026',
    month: 'Tháng 8',
    quarter: 'Quý III',
    date: '26/08/2026',
    kh: 3200.0,
    th: 3310.0,
    unitName: 'Triệu đ',
    rate: 103.4,
    status: 'invoiced',
    statusLabel: 'Đã xuất hóa đơn',
    am: 'Lê Hoàng Long',
    invoiceNumber: 'HD-VAT-INT-104',
    note: 'Thanh toán chuyển khoản quốc tế'
  },
  {
    id: 'REC-2026-011',
    contractCode: 'HĐ-2026/VCB-0210',
    contractName: 'Triển khai Hệ thống Định danh Sinh trắc học eKYC & Video Banker',
    customer: 'Ngân hàng TMCP Ngoại thương (Vietcombank)',
    customerShort: 'Vietcombank',
    customerType: 'Ngân hàng - Tài chính',
    spdv: 'Chuyển đổi số & Tự động hóa',
    unit: 'Ban Dịch vụ Số & CNTT',
    revenueType: 'Bên ngoài tập đoàn',
    year: '2026',
    month: 'Tháng 8',
    quarter: 'Quý III',
    date: '29/08/2026',
    kh: 2400.0,
    th: 2450.0,
    unitName: 'Triệu đ',
    rate: 102.1,
    status: 'invoiced',
    statusLabel: 'Đã xuất hóa đơn',
    am: 'Nguyễn Văn Hải',
    invoiceNumber: 'HD-VAT-89190',
    note: 'Nghiệm thu khối lượng theo Quyết định 2345/QĐ-NHNN'
  },
  {
    id: 'REC-2026-012',
    contractCode: 'HĐ-2026/PLX-0911',
    contractName: 'Hệ thống Quản lý Bán hàng Cửa hàng Xăng dầu Thông minh & POS',
    customer: 'Tập đoàn Xăng dầu Việt Nam (Petrolimex)',
    customerShort: 'Petrolimex',
    customerType: 'Doanh nghiệp Lớn',
    spdv: 'Tích hợp hệ thống & Mạng',
    unit: 'Chi nhánh Miền Nam',
    revenueType: 'Bên ngoài tập đoàn',
    year: '2026',
    month: 'Tháng 8',
    quarter: 'Quý III',
    date: '31/08/2026',
    kh: 1500.0,
    th: 1350.0,
    unitName: 'Triệu đ',
    rate: 90.0,
    status: 'accrued',
    statusLabel: 'Tạm tính kỳ này',
    am: 'Ngô Thanh Vân',
    invoiceNumber: 'Chưa có',
    note: 'Đang nghiệm thu kỹ thuật tại 150 trạm miền Tây'
  },
  {
    id: 'REC-2026-013',
    contractCode: 'HĐ-2026/VNPT-029',
    contractName: 'Thuê Hạ tầng Trung tâm Vận hành Mạng NOC/SOC Dự phòng',
    customer: 'Tập đoàn VNPT',
    customerShort: 'VNPT',
    customerType: 'Nội bộ',
    spdv: 'Viễn thông & Hạ tầng số',
    unit: 'Trung tâm Kinh doanh 1 (TTKD 1)',
    revenueType: 'Nội bộ tập đoàn',
    year: '2026',
    month: 'Tháng 8',
    quarter: 'Quý III',
    date: '08/08/2026',
    kh: 980.0,
    th: 980.0,
    unitName: 'Triệu đ',
    rate: 100.0,
    status: 'invoiced',
    statusLabel: 'Đã xuất hóa đơn',
    am: 'Trần Thị Thu Trang',
    invoiceNumber: 'HD-VAT-89032',
    note: 'Hợp đồng nội bộ định kỳ'
  },
  {
    id: 'REC-2026-014',
    contractCode: 'HĐ-2026/SHB-0155',
    contractName: 'Xây dựng Nền tảng Open Banking & Kết nối Hệ sinh thái Đối tác',
    customer: 'Ngân hàng TMCP Sài Gòn - Hà Nội (SHB)',
    customerShort: 'SHB Bank',
    customerType: 'Ngân hàng - Tài chính',
    spdv: 'Giải pháp CNTT & Phần mềm',
    unit: 'Ban Giải pháp Doanh nghiệp',
    revenueType: 'Bên ngoài tập đoàn',
    year: '2026',
    month: 'Tháng 8',
    quarter: 'Quý III',
    date: '16/08/2026',
    kh: 1750.0,
    th: 1820.0,
    unitName: 'Triệu đ',
    rate: 104.0,
    status: 'invoiced',
    statusLabel: 'Đã xuất hóa đơn',
    am: 'Phạm Đức Minh',
    invoiceNumber: 'HD-VAT-89098',
    note: 'Bàn giao đúng tiến độ cam kết'
  },
  {
    id: 'REC-2026-015',
    contractCode: 'HĐ-2026/BYT-0420',
    contractName: 'Hệ thống Quản lý Bệnh viện Thông minh (HIS/LIS/PACS)',
    customer: 'Bệnh viện Bạch Mai - Bộ Y tế',
    customerShort: 'Bệnh viện Bạch Mai',
    customerType: 'Y tế - Công',
    spdv: 'Tư vấn & Dịch vụ số khác',
    unit: 'Trung tâm Kinh doanh 3 (TTKD 3)',
    revenueType: 'Bên ngoài tập đoàn',
    year: '2026',
    month: 'Tháng 8',
    quarter: 'Quý III',
    date: '21/08/2026',
    kh: 1200.0,
    th: 1250.0,
    unitName: 'Triệu đ',
    rate: 104.2,
    status: 'invoiced',
    statusLabel: 'Đã xuất hóa đơn',
    am: 'Bùi Đức Huy',
    invoiceNumber: 'HD-VAT-89133',
    note: 'Triển khai giai đoạn 2 phân hệ bệnh án điện tử'
  },
  {
    id: 'REC-2026-016',
    contractCode: 'HĐ-2026/VPB-0662',
    contractName: 'Giải pháp Bảo vệ Ứng dụng Web/API (WAF) & Chống tấn công DDoS',
    customer: 'Ngân hàng TMCP Việt Nam Thịnh Vượng (VPBank)',
    customerShort: 'VPBank',
    customerType: 'Ngân hàng - Tài chính',
    spdv: 'An toàn thông tin & Cloud',
    unit: 'Ban Dịch vụ Số & CNTT',
    revenueType: 'Bên ngoài tập đoàn',
    year: '2026',
    month: 'Tháng 8',
    quarter: 'Quý III',
    date: '27/08/2026',
    kh: 1400.0,
    th: 1400.0,
    unitName: 'Triệu đ',
    rate: 100.0,
    status: 'invoiced',
    statusLabel: 'Đã xuất hóa đơn',
    am: 'Vũ Quốc Toàn',
    invoiceNumber: 'HD-VAT-89170',
    note: 'Gói dịch vụ an ninh 24/7'
  },
  {
    id: 'REC-2026-017',
    contractCode: 'HĐ-2026/BIDV-0881',
    contractName: 'Thuê bao Kênh truyền số liệu MPLS VPN 63 Chi nhánh Toàn quốc',
    customer: 'Ngân hàng TMCP Đầu tư và Phát triển (BIDV)',
    customerShort: 'BIDV',
    customerType: 'Ngân hàng - Tài chính',
    spdv: 'Viễn thông & Hạ tầng số',
    unit: 'Trung tâm Kinh doanh 2 (TTKD 2)',
    revenueType: 'Bên ngoài tập đoàn',
    year: '2026',
    month: 'Tháng 8',
    quarter: 'Quý III',
    date: '02/08/2026',
    kh: 2900.0,
    th: 2900.0,
    unitName: 'Triệu đ',
    rate: 100.0,
    status: 'invoiced',
    statusLabel: 'Đã xuất hóa đơn',
    am: 'Lê Hoàng Long',
    invoiceNumber: 'HD-VAT-89010',
    note: 'Thực hiện thanh toán tự động định kỳ'
  },
  {
    id: 'REC-2026-018',
    contractCode: 'HĐ-2026/MAS-0104',
    contractName: 'Nền tảng Tự động hóa Quy trình Bán hàng & Tiếp thị Đa kênh',
    customer: 'Công ty Cổ phần Masan Group',
    customerShort: 'Masan Group',
    customerType: 'Tập đoàn Tư nhân',
    spdv: 'Chuyển đổi số & Tự động hóa',
    unit: 'Chi nhánh Miền Nam',
    revenueType: 'Bên ngoài tập đoàn',
    year: '2026',
    month: 'Tháng 8',
    quarter: 'Quý III',
    date: '17/08/2026',
    kh: 1600.0,
    th: 1680.0,
    unitName: 'Triệu đ',
    rate: 105.0,
    status: 'invoiced',
    statusLabel: 'Đã xuất hóa đơn',
    am: 'Ngô Thanh Vân',
    invoiceNumber: 'HD-VAT-89115',
    note: 'Tích hợp kết nối CRM'
  },
  {
    id: 'REC-2026-019',
    contractCode: 'HĐ-2026/MIC-0077',
    contractName: 'Xây dựng Nền tảng Giám sát Không gian mạng & Bóc gỡ Mã độc',
    customer: 'Cục An toàn Thông tin - Bộ TT&TT',
    customerShort: 'Bộ TT&TT',
    customerType: 'Chính phủ',
    spdv: 'An toàn thông tin & Cloud',
    unit: 'Ban Giải pháp Doanh nghiệp',
    revenueType: 'Bên ngoài tập đoàn',
    year: '2026',
    month: 'Tháng 8',
    quarter: 'Quý III',
    date: '23/08/2026',
    kh: 2200.0,
    th: 2300.0,
    unitName: 'Triệu đ',
    rate: 104.5,
    status: 'invoiced',
    statusLabel: 'Đã xuất hóa đơn',
    am: 'Hoàng Minh Tuấn',
    invoiceNumber: 'HD-VAT-89155',
    note: 'Bàn giao thiết bị và mã nguồn đợt 1'
  },
  {
    id: 'REC-2026-020',
    contractCode: 'HĐ-2026/INT-0119',
    contractName: 'Dịch vụ Thuê bao Server & Chỗ đặt Máy chủ Co-location tại Hà Nội',
    customer: 'Telkomsel Indonesia',
    customerShort: 'Telkomsel',
    customerType: 'Quốc tế',
    spdv: 'Viễn thông & Hạ tầng số',
    unit: 'Trung tâm Kinh doanh 1 (TTKD 1)',
    revenueType: 'Khách hàng Quốc tế',
    year: '2026',
    month: 'Tháng 8',
    quarter: 'Quý III',
    date: '11/08/2026',
    kh: 2700.0,
    th: 2850.0,
    unitName: 'Triệu đ',
    rate: 105.6,
    status: 'invoiced',
    statusLabel: 'Đã xuất hóa đơn',
    am: 'Đỗ Quỳnh Anh',
    invoiceNumber: 'HD-VAT-INT-118',
    note: 'Hợp đồng quốc tế kỳ hạn 2 năm'
  }
];

// Helper: Lọc danh sách bản ghi theo ngữ cảnh chi tiết
export function filterRevenueRecords({
  branchId,
  chartKey,
  selectedYear = '2026',
  selectedMonth = 'Tháng 8',
  selectedQuarter = 'Quý III',
  searchQuery = '',
  spdvFilter = 'all',
  unitFilter = 'all',
  revenueTypeFilter = 'all',
  statusFilter = 'all'
}) {
  let records = [...ALL_REVENUE_RECORDS];

  // Lọc theo ngữ cảnh thời gian nếu có
  if (selectedYear) {
    records = records.filter(r => r.year === selectedYear);
  }
  if (branchId === 'month' && selectedMonth) {
    records = records.filter(r => r.month === selectedMonth);
  } else if (branchId === 'quarter' && selectedQuarter) {
    records = records.filter(r => r.quarter === selectedQuarter);
  }

  // Lọc theo ngữ cảnh biểu đồ cụ thể (nếu click từ thẻ tương ứng)
  if (branchId === 'plan_progress') {
    if (chartKey === 'chart23') {
      records = records.filter(r => r.revenueType === 'Nội bộ tập đoàn' || r.revenueType === 'Bên ngoài tập đoàn');
    } else if (chartKey === 'chart24') {
      records = records.filter(r => r.revenueType === 'Khách hàng Quốc tế' || r.revenueType === 'Bên ngoài tập đoàn');
    }
  }

  // Lọc bộ lọc người dùng
  if (searchQuery && searchQuery.trim() !== '') {
    const q = searchQuery.toLowerCase().trim();
    records = records.filter(r =>
      r.contractCode.toLowerCase().includes(q) ||
      r.contractName.toLowerCase().includes(q) ||
      r.customer.toLowerCase().includes(q) ||
      r.am.toLowerCase().includes(q) ||
      (r.invoiceNumber && r.invoiceNumber.toLowerCase().includes(q))
    );
  }

  if (spdvFilter && spdvFilter !== 'all') {
    records = records.filter(r => r.spdv === spdvFilter);
  }

  if (unitFilter && unitFilter !== 'all') {
    records = records.filter(r => r.unit === unitFilter);
  }

  if (revenueTypeFilter && revenueTypeFilter !== 'all') {
    records = records.filter(r => r.revenueType === revenueTypeFilter);
  }

  if (statusFilter && statusFilter !== 'all') {
    if (statusFilter === 'pass') {
      records = records.filter(r => r.rate >= 100);
    } else if (statusFilter === 'fail') {
      records = records.filter(r => r.rate < 100);
    } else {
      records = records.filter(r => r.status === statusFilter);
    }
  }

  return records;
}

// Helper: Tính toán các chỉ số KPI tóm tắt cho danh sách bản ghi
export function computeRecordsSummary(records = []) {
  const totalCount = records.length;
  let totalKH = 0;
  let totalTH = 0;
  let passCount = 0;
  let invoicedCount = 0;

  records.forEach(r => {
    totalKH += r.kh || 0;
    totalTH += r.th || 0;
    if (r.rate >= 100) passCount += 1;
    if (r.status === 'invoiced') invoicedCount += 1;
  });

  const diff = Number((totalTH - totalKH).toFixed(1));
  const avgRate = totalKH > 0 ? Number(((totalTH / totalKH) * 100).toFixed(1)) : 100;

  return {
    totalCount,
    totalKH: Number(totalKH.toFixed(1)),
    totalTH: Number(totalTH.toFixed(1)),
    diff,
    avgRate,
    passCount,
    invoicedCount,
    invoicedRate: totalCount > 0 ? Math.round((invoicedCount / totalCount) * 100) : 0
  };
}
