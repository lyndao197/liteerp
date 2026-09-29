// Dữ liệu Báo cáo Công nợ (Nhánh số 8 - Revenue & Debt Report)
// Đơn vị tính chuẩn: Tỷ đồng

export const DEBT_SUMMARY_METRICS = {
  totalReceivable: 1248.5, // Tổng nợ phải thu
  inTermReceivable: 1085.2, // Nợ trong hạn (86.9%)
  overdueReceivable: 163.3, // Nợ quá hạn (13.1%)
  badDebt: 18.5, // Nợ khó đòi / dự phòng
  totalPayable: 842.6, // Tổng nợ phải trả
  dso: 48, // Số ngày thu hồi nợ bình quân (DSO)
  targetDso: 50,
  recoveryRate: 88.5, // Tỷ lệ thu hồi nợ trong kỳ (%)
  prevPeriodReceivable: 1186.0
};

// Phân tích cơ cấu nợ theo tuổi nợ (Aging Analysis)
export const DEBT_AGING_DATA = [
  {
    id: 'current',
    range: 'Chưa đến hạn',
    lines: ['Chưa đến', 'hạn'],
    amount: 1085.2,
    percent: 86.9,
    khAmount: 1120.0,
    rate: '96,9%',
    riskLevel: 'Thấp',
    color: '#10b981'
  },
  {
    id: 'overdue_1_30',
    range: 'Quá hạn 1-30 ngày',
    lines: ['Quá hạn', '1-30 ngày'],
    amount: 82.4,
    percent: 6.6,
    khAmount: 65.0,
    rate: '126,8%',
    riskLevel: 'Trung bình',
    color: '#3b82f6'
  },
  {
    id: 'overdue_31_60',
    range: 'Quá hạn 31-60 ngày',
    lines: ['Quá hạn', '31-60 ngày'],
    amount: 42.1,
    percent: 3.4,
    khAmount: 35.0,
    rate: '120,3%',
    riskLevel: 'Cần lưu ý',
    color: '#f59e0b'
  },
  {
    id: 'overdue_61_90',
    range: 'Quá hạn 61-90 ngày',
    lines: ['Quá hạn', '61-90 ngày'],
    amount: 20.3,
    percent: 1.6,
    khAmount: 15.0,
    rate: '135,3%',
    riskLevel: 'Cảnh báo',
    color: '#ea580c'
  },
  {
    id: 'overdue_90_plus',
    range: 'Quá hạn > 90 ngày',
    lines: ['Quá hạn', '> 90 ngày'],
    amount: 18.5,
    percent: 1.5,
    khAmount: 12.0,
    rate: '154,2%',
    riskLevel: 'Rủi ro cao',
    color: '#e11d48'
  }
];

// Phân tích nợ theo nhóm đối tượng khách hàng
export const DEBT_BY_CUSTOMER_GROUP = [
  {
    id: 'external',
    groupName: 'DT ngoài Tập đoàn',
    lines: ['DT ngoài', 'Tập đoàn'],
    receivable: 785.4,
    inTerm: 668.0,
    overdue: 117.4,
    overdueRatio: 14.9,
    khReceivable: 750.0
  },
  {
    id: 'internal',
    groupName: 'DT nội bộ Tập đoàn',
    lines: ['DT nội bộ', 'Tập đoàn'],
    receivable: 342.6,
    inTerm: 326.2,
    overdue: 16.4,
    overdueRatio: 4.8,
    khReceivable: 360.0
  },
  {
    id: 'global',
    groupName: 'Khách hàng Quốc tế',
    lines: ['Khách hàng', 'Quốc tế'],
    receivable: 120.5,
    inTerm: 91.0,
    overdue: 29.5,
    overdueRatio: 24.5,
    khReceivable: 110.0
  }
];

// Tiến độ thu hồi công nợ theo từng tháng (TH thu hồi vs Kế hoạch thu hồi)
export const DEBT_MONTHLY_RECOVERY = [
  { month: 'T1', actual: 95.2, plan: 90.0, rate: '105,8%', overdueRecovery: 12.4 },
  { month: 'T2', actual: 88.6, plan: 85.0, rate: '104,2%', overdueRecovery: 10.1 },
  { month: 'T3', actual: 124.0, plan: 120.0, rate: '103,3%', overdueRecovery: 18.6 },
  { month: 'T4', actual: 108.5, plan: 115.0, rate: '94,3%', overdueRecovery: 14.2 },
  { month: 'T5', actual: 118.2, plan: 115.0, rate: '102,8%', overdueRecovery: 15.8 },
  { month: 'T6', actual: 142.6, plan: 140.0, rate: '101,9%', overdueRecovery: 22.3 },
  { month: 'T7', actual: 130.4, plan: 135.0, rate: '96,6%', overdueRecovery: 16.5 },
  { month: 'T8', actual: 128.5, plan: 130.0, rate: '98,8%', overdueRecovery: 17.2 },
  { month: 'T9', actual: 145.0, plan: 140.0, rate: '103,6%', overdueRecovery: 21.0 },
  { month: 'T10', actual: 138.0, plan: 135.0, rate: '102,2%', overdueRecovery: 19.5 },
  { month: 'T11', actual: 155.0, plan: 150.0, rate: '103,3%', overdueRecovery: 24.0 },
  { month: 'T12', actual: 182.0, plan: 170.0, rate: '107,1%', overdueRecovery: 32.5 }
];

// Top 10 khách hàng có số dư công nợ lớn nhất
export const DEBT_TOP_CUSTOMERS = [
  {
    stt: 1,
    code: 'KH-0012',
    name: 'Tổng Công ty Viễn thông Viettel (VTT)',
    group: 'Nội bộ Tập đoàn',
    totalDebt: 186.4,
    inTerm: 182.0,
    overdue: 4.4,
    dso: 32,
    status: 'Bình thường',
    action: 'Đối soát & thanh toán kỳ T8'
  },
  {
    stt: 2,
    code: 'KH-0845',
    name: 'Tập đoàn Điện lực Việt Nam (EVN)',
    group: 'Ngoài Tập đoàn',
    totalDebt: 92.5,
    inTerm: 78.0,
    overdue: 14.5,
    dso: 54,
    status: 'Nhắc nợ đợt 2',
    action: 'Gửi công văn đôn đốc thanh toán'
  },
  {
    stt: 3,
    code: 'KH-0319',
    name: 'Ngân hàng TMCP Quân đội (MBBank)',
    group: 'Ngoài Tập đoàn',
    totalDebt: 78.2,
    inTerm: 75.0,
    overdue: 3.2,
    dso: 38,
    status: 'Bình thường',
    action: 'Chờ nghiệm thu giai đoạn 2'
  },
  {
    stt: 4,
    code: 'KH-0921',
    name: 'Viettel Global (Thị trường Myanmar / Mytel)',
    group: 'Quốc tế',
    totalDebt: 65.8,
    inTerm: 46.2,
    overdue: 19.6,
    dso: 72,
    status: 'Cảnh báo',
    action: 'Làm việc kế hoạch chuyển ngoại tệ'
  },
  {
    stt: 5,
    code: 'KH-0158',
    name: 'Tổng Công ty Bưu chính Viettel (Viettel Post)',
    group: 'Nội bộ Tập đoàn',
    totalDebt: 58.6,
    inTerm: 56.5,
    overdue: 2.1,
    dso: 29,
    status: 'Tốt',
    action: 'Thanh toán đúng hạn theo hợp đồng'
  },
  {
    stt: 6,
    code: 'KH-1042',
    name: 'Bộ Tài chính - Cục Công nghệ thông tin',
    group: 'Ngoài Tập đoàn',
    totalDebt: 52.4,
    inTerm: 48.0,
    overdue: 4.4,
    dso: 46,
    status: 'Bình thường',
    action: 'Hoàn tất thủ tục kho bạc giải ngân'
  },
  {
    stt: 7,
    code: 'KH-0683',
    name: 'Tập đoàn Dầu khí Việt Nam (PVN)',
    group: 'Ngoài Tập đoàn',
    totalDebt: 45.1,
    inTerm: 36.5,
    overdue: 8.6,
    dso: 58,
    status: 'Theo dõi chặt',
    action: 'Họp rà soát tiến độ triển khai'
  },
  {
    stt: 8,
    code: 'KH-0417',
    name: 'Viettel Telecom Peru (Bitel)',
    group: 'Quốc tế',
    totalDebt: 38.2,
    inTerm: 29.8,
    overdue: 8.4,
    dso: 65,
    status: 'Cảnh báo',
    action: 'Thống nhất lộ trình bù trừ công nợ'
  },
  {
    stt: 9,
    code: 'KH-0556',
    name: 'Tổng Công ty Giải pháp Doanh nghiệp Viettel (VTS)',
    group: 'Nội bộ Tập đoàn',
    totalDebt: 34.8,
    inTerm: 34.0,
    overdue: 0.8,
    dso: 25,
    status: 'Tốt',
    action: 'Quyết toán hợp đồng dịch vụ Cloud'
  },
  {
    stt: 10,
    code: 'KH-1205',
    name: 'Công ty CP Chứng khoán VPS',
    group: 'Ngoài Tập đoàn',
    totalDebt: 28.5,
    inTerm: 26.0,
    overdue: 2.5,
    dso: 35,
    status: 'Bình thường',
    action: 'Gia hạn gói dịch vụ hạ tầng DC'
  }
];
