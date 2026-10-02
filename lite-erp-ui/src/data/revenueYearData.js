// Data definitions for YearComparisonChart (Phân tích theo năm)
// Excludes Lợi nhuận trước thuế and Tỷ suất LNTT

export const CUMULATIVE_MONTH_OPTIONS = [
  'Lũy kế 1 tháng',
  'Lũy kế 2 tháng',
  'Lũy kế 3 tháng',
  'Lũy kế 4 tháng',
  'Lũy kế 5 tháng',
  'Lũy kế 6 tháng',
  'Lũy kế 7 tháng',
  'Lũy kế 8 tháng',
  'Lũy kế 9 tháng',
  'Lũy kế 10 tháng',
  'Lũy kế 11 tháng',
  'Lũy kế cả năm (12T)'
];

export const YEAR_CUMULATIVE_DATA = {
  'Lũy kế 8 tháng': {
    monthCount: 8,
    shortCode: '8T',
    monthText: '8 tháng',
    values: [
      { id: 'total', name: 'Tổng doanh thu', lines: ['Tổng doanh thu'], lk: 2976.3, kh: 3043.1, rate: '97,8%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'internal', name: 'DT nội bộ', lines: ['DT nội bộ'], lk: 953.5, kh: 913.0, rate: '104,4%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'external', name: 'DT ngoài Tập đoàn', lines: ['DT ngoài', 'Tập đoàn'], lk: 2022.8, kh: 2130.1, rate: '95,0%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'global', name: 'DT quốc tế', lines: ['DT quốc tế'], lk: 313.9, kh: 365.2, rate: '86,0%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'profit', name: 'Lợi nhuận trước thuế', lines: ['Lợi nhuận', 'trước thuế'], lk: 298.5, kh: 312, rate: '95,7%', isRatePositive: false, unit: 'Triệu đồng' }
    ],
    ratios: [
      { id: 'profit_ratio', name: 'Tỷ suất LNTT/Tổng DT', lines: ['Tỷ suất', 'LNTT/Tổng DT'], lk: 10, kh: 10.3, diff: '-0,3 đ.%', isDiffPositive: false, unit: '%' },
      { id: 'external_ratio', name: 'Tỷ trọng DT ngoài TĐ', lines: ['Tỷ trọng', 'DT ngoài TĐ'], lk: 68.0, kh: 70.0, diff: '-2,0 đ.%', isDiffPositive: false, unit: '%' },
      { id: 'global_ratio', name: 'Tỷ trọng DT quốc tế', lines: ['Tỷ trọng', 'DT quốc tế'], lk: 10.5, kh: 12.0, diff: '-1,5 đ.%', isDiffPositive: false, unit: '%' }
    ]
  },
  'Lũy kế 6 tháng': {
    monthCount: 6,
    shortCode: '6T',
    monthText: '6 tháng',
    values: [
      { id: 'total', name: 'Tổng doanh thu', lines: ['Tổng doanh thu'], lk: 2205.7, kh: 2235.0, rate: '98,7%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'internal', name: 'DT nội bộ', lines: ['DT nội bộ'], lk: 716.9, kh: 704.0, rate: '101,8%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'external', name: 'DT ngoài Tập đoàn', lines: ['DT ngoài', 'Tập đoàn'], lk: 1488.8, kh: 1531.0, rate: '97,2%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'global', name: 'DT quốc tế', lines: ['DT quốc tế'], lk: 225.8, kh: 240.0, rate: '94,1%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'profit', name: 'Lợi nhuận trước thuế', lines: ['Lợi nhuận', 'trước thuế'], lk: 218.4, kh: 228, rate: '95,8%', isRatePositive: false, unit: 'Triệu đồng' }
    ],
    ratios: [
      { id: 'profit_ratio', name: 'Tỷ suất LNTT/Tổng DT', lines: ['Tỷ suất', 'LNTT/Tổng DT'], lk: 9.9, kh: 10.2, diff: '-0,3 đ.%', isDiffPositive: false, unit: '%' },
      { id: 'external_ratio', name: 'Tỷ trọng DT ngoài TĐ', lines: ['Tỷ trọng', 'DT ngoài TĐ'], lk: 67.5, kh: 68.5, diff: '-1,0 đ.%', isDiffPositive: false, unit: '%' },
      { id: 'global_ratio', name: 'Tỷ trọng DT quốc tế', lines: ['Tỷ trọng', 'DT quốc tế'], lk: 10.2, kh: 10.7, diff: '-0,5 đ.%', isDiffPositive: false, unit: '%' }
    ]
  },
  'Lũy kế 7 tháng': {
    monthCount: 7,
    shortCode: '7T',
    monthText: '7 tháng',
    values: [
      { id: 'total', name: 'Tổng doanh thu', lines: ['Tổng doanh thu'], lk: 2580.0, kh: 2630.0, rate: '98,1%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'internal', name: 'DT nội bộ', lines: ['DT nội bộ'], lk: 832.0, kh: 805.0, rate: '103,4%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'external', name: 'DT ngoài Tập đoàn', lines: ['DT ngoài', 'Tập đoàn'], lk: 1748.0, kh: 1825.0, rate: '95,8%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'global', name: 'DT quốc tế', lines: ['DT quốc tế'], lk: 268.0, kh: 298.0, rate: '89,9%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'profit', name: 'Lợi nhuận trước thuế', lines: ['Lợi nhuận', 'trước thuế'], lk: 258, kh: 270, rate: '95,6%', isRatePositive: false, unit: 'Triệu đồng' }
    ],
    ratios: [
      { id: 'profit_ratio', name: 'Tỷ suất LNTT/Tổng DT', lines: ['Tỷ suất', 'LNTT/Tổng DT'], lk: 10, kh: 10.3, diff: '-0,3 đ.%', isDiffPositive: false, unit: '%' },
      { id: 'external_ratio', name: 'Tỷ trọng DT ngoài TĐ', lines: ['Tỷ trọng', 'DT ngoài TĐ'], lk: 67.8, kh: 69.4, diff: '-1,6 đ.%', isDiffPositive: false, unit: '%' },
      { id: 'global_ratio', name: 'Tỷ trọng DT quốc tế', lines: ['Tỷ trọng', 'DT quốc tế'], lk: 10.4, kh: 11.3, diff: '-0,9 đ.%', isDiffPositive: false, unit: '%' }
    ]
  },
  'Lũy kế cả năm (12T)': {
    monthCount: 12,
    shortCode: '12T',
    monthText: '12 tháng',
    values: [
      { id: 'total', name: 'Tổng doanh thu', lines: ['Tổng doanh thu'], lk: 4620.0, kh: 4700.0, rate: '98,3%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'internal', name: 'DT nội bộ', lines: ['DT nội bộ'], lk: 1480.0, kh: 1450.0, rate: '102,1%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'external', name: 'DT ngoài Tập đoàn', lines: ['DT ngoài', 'Tập đoàn'], lk: 3140.0, kh: 3250.0, rate: '96,6%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'global', name: 'DT quốc tế', lines: ['DT quốc tế'], lk: 495.0, kh: 520.0, rate: '95,2%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'profit', name: 'Lợi nhuận trước thuế', lines: ['Lợi nhuận', 'trước thuế'], lk: 485, kh: 495, rate: '98,0%', isRatePositive: false, unit: 'Triệu đồng' }
    ],
    ratios: [
      { id: 'profit_ratio', name: 'Tỷ suất LNTT/Tổng DT', lines: ['Tỷ suất', 'LNTT/Tổng DT'], lk: 10.5, kh: 10.5, diff: '0,0 đ.%', isDiffPositive: true, unit: '%' },
      { id: 'external_ratio', name: 'Tỷ trọng DT ngoài TĐ', lines: ['Tỷ trọng', 'DT ngoài TĐ'], lk: 68.0, kh: 69.1, diff: '-1,1 đ.%', isDiffPositive: false, unit: '%' },
      { id: 'global_ratio', name: 'Tỷ trọng DT quốc tế', lines: ['Tỷ trọng', 'DT quốc tế'], lk: 10.7, kh: 11.1, diff: '-0,4 đ.%', isDiffPositive: false, unit: '%' }
    ]
  }
};

// Data definitions for Biểu đồ 11: Lũy kế năm so với kế hoạch cả năm
// Excludes Lợi nhuận trước thuế and Tỷ suất LNTT
export const YEAR_PLAN_FULL_DATA = {
  'Lũy kế 8 tháng': {
    monthCount: 8,
    shortCode: '8T',
    monthText: '8 tháng',
    values: [
      { id: 'total', name: 'Tổng doanh thu', lines: ['Tổng doanh thu'], lk: 2976.3, khYear: 4968.1, rate: '59,9%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'internal', name: 'DT nội bộ', lines: ['DT nội bộ'], lk: 953.5, khYear: 1490.4, rate: '64,0%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'external', name: 'DT ngoài Tập đoàn', lines: ['DT ngoài', 'Tập đoàn'], lk: 2022.8, khYear: 3477.7, rate: '58,2%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'global', name: 'DT quốc tế', lines: ['DT quốc tế'], lk: 313.9, khYear: 596.3, rate: '52,6%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'profit', name: 'Lợi nhuận trước thuế', lines: ['Lợi nhuận', 'trước thuế'], lk: 298.5, khYear: 521.7, rate: '57,2%', isRatePositive: false, unit: 'Triệu đồng' }
    ],
    ratios: [
      { id: 'profit_ratio', name: 'Tỷ suất LNTT/Tổng DT', lines: ['Tỷ suất', 'LNTT/Tổng DT'], lk: 10, khYear: 10.5, diff: '-0,5 đ.%', isDiffPositive: false, unit: '%' },
      { id: 'external_ratio', name: 'Tỷ trọng DT ngoài TĐ', lines: ['Tỷ trọng', 'DT ngoài TĐ'], lk: 68.0, khYear: 70.0, diff: '-2,0 đ.%', isDiffPositive: false, unit: '%' },
      { id: 'global_ratio', name: 'Tỷ trọng DT quốc tế', lines: ['Tỷ trọng', 'DT quốc tế'], lk: 10.5, khYear: 12.0, diff: '-1,5 đ.%', isDiffPositive: false, unit: '%' }
    ]
  },
  'Lũy kế 6 tháng': {
    monthCount: 6,
    shortCode: '6T',
    monthText: '6 tháng',
    values: [
      { id: 'total', name: 'Tổng doanh thu', lines: ['Tổng doanh thu'], lk: 2205.7, khYear: 4968.1, rate: '44,4%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'internal', name: 'DT nội bộ', lines: ['DT nội bộ'], lk: 716.9, khYear: 1490.4, rate: '48,1%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'external', name: 'DT ngoài Tập đoàn', lines: ['DT ngoài', 'Tập đoàn'], lk: 1488.8, khYear: 3477.7, rate: '42,8%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'global', name: 'DT quốc tế', lines: ['DT quốc tế'], lk: 225.8, khYear: 596.3, rate: '37,9%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'profit', name: 'Lợi nhuận trước thuế', lines: ['Lợi nhuận', 'trước thuế'], lk: 218.4, khYear: 521.7, rate: '41,9%', isRatePositive: false, unit: 'Triệu đồng' }
    ],
    ratios: [
      { id: 'profit_ratio', name: 'Tỷ suất LNTT/Tổng DT', lines: ['Tỷ suất', 'LNTT/Tổng DT'], lk: 9.9, khYear: 10.5, diff: '-0,6 đ.%', isDiffPositive: false, unit: '%' },
      { id: 'external_ratio', name: 'Tỷ trọng DT ngoài TĐ', lines: ['Tỷ trọng', 'DT ngoài TĐ'], lk: 67.5, khYear: 70.0, diff: '-2,5 đ.%', isDiffPositive: false, unit: '%' },
      { id: 'global_ratio', name: 'Tỷ trọng DT quốc tế', lines: ['Tỷ trọng', 'DT quốc tế'], lk: 10.2, khYear: 12.0, diff: '-1,8 đ.%', isDiffPositive: false, unit: '%' }
    ]
  },
  'Lũy kế 7 tháng': {
    monthCount: 7,
    shortCode: '7T',
    monthText: '7 tháng',
    values: [
      { id: 'total', name: 'Tổng doanh thu', lines: ['Tổng doanh thu'], lk: 2580.0, khYear: 4968.1, rate: '51,9%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'internal', name: 'DT nội bộ', lines: ['DT nội bộ'], lk: 832.0, khYear: 1490.4, rate: '55,8%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'external', name: 'DT ngoài Tập đoàn', lines: ['DT ngoài', 'Tập đoàn'], lk: 1748.0, khYear: 3477.7, rate: '50,3%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'global', name: 'DT quốc tế', lines: ['DT quốc tế'], lk: 268.0, khYear: 596.3, rate: '44,9%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'profit', name: 'Lợi nhuận trước thuế', lines: ['Lợi nhuận', 'trước thuế'], lk: 258, khYear: 521.7, rate: '49,5%', isRatePositive: false, unit: 'Triệu đồng' }
    ],
    ratios: [
      { id: 'profit_ratio', name: 'Tỷ suất LNTT/Tổng DT', lines: ['Tỷ suất', 'LNTT/Tổng DT'], lk: 10, khYear: 10.5, diff: '-0,5 đ.%', isDiffPositive: false, unit: '%' },
      { id: 'external_ratio', name: 'Tỷ trọng DT ngoài TĐ', lines: ['Tỷ trọng', 'DT ngoài TĐ'], lk: 67.8, khYear: 70.0, diff: '-2,2 đ.%', isDiffPositive: false, unit: '%' },
      { id: 'global_ratio', name: 'Tỷ trọng DT quốc tế', lines: ['Tỷ trọng', 'DT quốc tế'], lk: 10.4, khYear: 12.0, diff: '-1,6 đ.%', isDiffPositive: false, unit: '%' }
    ]
  },
  'Lũy kế cả năm (12T)': {
    monthCount: 12,
    shortCode: '12T',
    monthText: '12 tháng',
    values: [
      { id: 'total', name: 'Tổng doanh thu', lines: ['Tổng doanh thu'], lk: 4620.0, khYear: 4968.1, rate: '93,0%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'internal', name: 'DT nội bộ', lines: ['DT nội bộ'], lk: 1480.0, khYear: 1490.4, rate: '99,3%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'external', name: 'DT ngoài Tập đoàn', lines: ['DT ngoài', 'Tập đoàn'], lk: 3140.0, khYear: 3477.7, rate: '90,3%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'global', name: 'DT quốc tế', lines: ['DT quốc tế'], lk: 495.0, khYear: 596.3, rate: '83,0%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'profit', name: 'Lợi nhuận trước thuế', lines: ['Lợi nhuận', 'trước thuế'], lk: 485, khYear: 521.7, rate: '93,0%', isRatePositive: false, unit: 'Triệu đồng' }
    ],
    ratios: [
      { id: 'profit_ratio', name: 'Tỷ suất LNTT/Tổng DT', lines: ['Tỷ suất', 'LNTT/Tổng DT'], lk: 10.5, khYear: 10.5, diff: '0,0 đ.%', isDiffPositive: true, unit: '%' },
      { id: 'external_ratio', name: 'Tỷ trọng DT ngoài TĐ', lines: ['Tỷ trọng', 'DT ngoài TĐ'], lk: 68.0, khYear: 70.0, diff: '-2,0 đ.%', isDiffPositive: false, unit: '%' },
      { id: 'global_ratio', name: 'Tỷ trọng DT quốc tế', lines: ['Tỷ trọng', 'DT quốc tế'], lk: 10.7, khYear: 12.0, diff: '-1,3 đ.%', isDiffPositive: false, unit: '%' }
    ]
  }
};

// ==============================================================================
// BIỂU ĐỒ 12: ƯỚC KẾT QUẢ NĂM SO VỚI KẾ HOẠCH NĂM
// Cơ sở so sánh: Ước năm = TB(T1-T*) * 12 - KH năm
// Đơn vị: Tỷ đồng
// Bao gồm: 4 chỉ tiêu giá trị & 2 chỉ tiêu tỷ trọng (Excludes Lợi nhuận trước thuế and Tỷ suất LNTT)
// ==============================================================================
export const YEAR_ESTIMATE_DATA = {
  'Lũy kế 8 tháng': {
    monthCount: 8,
    shortCode: '8T',
    monthText: '8 tháng',
    values: [
      { id: 'total', name: 'Tổng doanh thu', lines: ['Tổng doanh thu'], lk: 4464.5, uoc: 4464.5, khYear: 4968.1, kh: 4968.1, rate: '89,9%', isRatePositive: false, unit: 'Tỷ đồng' },
      { id: 'internal', name: 'DT nội bộ', lines: ['DT nội bộ'], lk: 1430.2, uoc: 1430.2, khYear: 1490.4, kh: 1490.4, rate: '96,0%', isRatePositive: false, unit: 'Tỷ đồng' },
      { id: 'external', name: 'DT ngoài Tập đoàn', lines: ['DT ngoài', 'Tập đoàn'], lk: 3034.2, uoc: 3034.2, khYear: 3477.7, kh: 3477.7, rate: '87,2%', isRatePositive: false, unit: 'Tỷ đồng' },
      { id: 'global', name: 'DT quốc tế', lines: ['DT quốc tế'], lk: 470.8, uoc: 470.8, khYear: 596.3, kh: 596.3, rate: '79,0%', isRatePositive: false, unit: 'Tỷ đồng' },
      { id: 'profit', name: 'Lợi nhuận trước thuế', lines: ['Lợi nhuận', 'trước thuế'], lk: 444.1, uoc: 444.1, khYear: 521.7, kh: 521.7, rate: '85,1%', isRatePositive: false, unit: 'Tỷ đồng' }
    ],
    ratios: [
      { id: 'profit_ratio', name: 'Tỷ suất LNTT/Tổng DT', lines: ['Tỷ suất', 'LNTT/Tổng DT'], lk: 9.9, uoc: 9.9, khYear: 10.5, kh: 10.5, diff: '-0,6 đ.%', isDiffPositive: false, unit: '%' },
      { id: 'external_ratio', name: 'Tỷ trọng DT ngoài TĐ', lines: ['Tỷ trọng', 'DT ngoài TĐ'], lk: 68.0, uoc: 68.0, khYear: 70.0, kh: 70.0, diff: '-2,0 đ.%', isDiffPositive: false, unit: '%' },
      { id: 'global_ratio', name: 'Tỷ trọng DT quốc tế', lines: ['Tỷ trọng', 'DT quốc tế'], lk: 10.5, uoc: 10.5, khYear: 12.0, kh: 12.0, diff: '-1,5 đ.%', isDiffPositive: false, unit: '%' }
    ]
  },
  'Lũy kế 6 tháng': {
    monthCount: 6,
    shortCode: '6T',
    monthText: '6 tháng',
    values: [
      { id: 'total', name: 'Tổng doanh thu', lines: ['Tổng doanh thu'], lk: 4411.4, uoc: 4411.4, khYear: 4968.1, kh: 4968.1, rate: '88,8%', isRatePositive: false, unit: 'Tỷ đồng' },
      { id: 'internal', name: 'DT nội bộ', lines: ['DT nội bộ'], lk: 1433.8, uoc: 1433.8, khYear: 1490.4, kh: 1490.4, rate: '96,2%', isRatePositive: false, unit: 'Tỷ đồng' },
      { id: 'external', name: 'DT ngoài Tập đoàn', lines: ['DT ngoài', 'Tập đoàn'], lk: 2977.6, uoc: 2977.6, khYear: 3477.7, kh: 3477.7, rate: '85,6%', isRatePositive: false, unit: 'Tỷ đồng' },
      { id: 'global', name: 'DT quốc tế', lines: ['DT quốc tế'], lk: 451.6, uoc: 451.6, khYear: 596.3, kh: 596.3, rate: '75,7%', isRatePositive: false, unit: 'Tỷ đồng' },
      { id: 'profit', name: 'Lợi nhuận trước thuế', lines: ['Lợi nhuận', 'trước thuế'], lk: 432, uoc: 432, khYear: 521.7, kh: 521.7, rate: '82,8%', isRatePositive: false, unit: 'Tỷ đồng' }
    ],
    ratios: [
      { id: 'profit_ratio', name: 'Tỷ suất LNTT/Tổng DT', lines: ['Tỷ suất', 'LNTT/Tổng DT'], lk: 9.8, uoc: 9.8, khYear: 10.5, kh: 10.5, diff: '-0,7 đ.%', isDiffPositive: false, unit: '%' },
      { id: 'external_ratio', name: 'Tỷ trọng DT ngoài TĐ', lines: ['Tỷ trọng', 'DT ngoài TĐ'], lk: 67.5, uoc: 67.5, khYear: 70.0, kh: 70.0, diff: '-2,5 đ.%', isDiffPositive: false, unit: '%' },
      { id: 'global_ratio', name: 'Tỷ trọng DT quốc tế', lines: ['Tỷ trọng', 'DT quốc tế'], lk: 10.2, uoc: 10.2, khYear: 12.0, kh: 12.0, diff: '-1,8 đ.%', isDiffPositive: false, unit: '%' }
    ]
  },
  'Lũy kế 7 tháng': {
    monthCount: 7,
    shortCode: '7T',
    monthText: '7 tháng',
    values: [
      { id: 'total', name: 'Tổng doanh thu', lines: ['Tổng doanh thu'], lk: 4422.9, uoc: 4422.9, khYear: 4968.1, kh: 4968.1, rate: '89,0%', isRatePositive: false, unit: 'Tỷ đồng' },
      { id: 'internal', name: 'DT nội bộ', lines: ['DT nội bộ'], lk: 1426.3, uoc: 1426.3, khYear: 1490.4, kh: 1490.4, rate: '95,7%', isRatePositive: false, unit: 'Tỷ đồng' },
      { id: 'external', name: 'DT ngoài Tập đoàn', lines: ['DT ngoài', 'Tập đoàn'], lk: 2996.6, uoc: 2996.6, khYear: 3477.7, kh: 3477.7, rate: '86,2%', isRatePositive: false, unit: 'Tỷ đồng' },
      { id: 'global', name: 'DT quốc tế', lines: ['DT quốc tế'], lk: 459.4, uoc: 459.4, khYear: 596.3, kh: 596.3, rate: '77,0%', isRatePositive: false, unit: 'Tỷ đồng' },
      { id: 'profit', name: 'Lợi nhuận trước thuế', lines: ['Lợi nhuận', 'trước thuế'], lk: 438, uoc: 438, khYear: 521.7, kh: 521.7, rate: '84,0%', isRatePositive: false, unit: 'Tỷ đồng' }
    ],
    ratios: [
      { id: 'profit_ratio', name: 'Tỷ suất LNTT/Tổng DT', lines: ['Tỷ suất', 'LNTT/Tổng DT'], lk: 9.9, uoc: 9.9, khYear: 10.5, kh: 10.5, diff: '-0,6 đ.%', isDiffPositive: false, unit: '%' },
      { id: 'external_ratio', name: 'Tỷ trọng DT ngoài TĐ', lines: ['Tỷ trọng', 'DT ngoài TĐ'], lk: 67.8, uoc: 67.8, khYear: 70.0, kh: 70.0, diff: '-2,2 đ.%', isDiffPositive: false, unit: '%' },
      { id: 'global_ratio', name: 'Tỷ trọng DT quốc tế', lines: ['Tỷ trọng', 'DT quốc tế'], lk: 10.4, uoc: 10.4, khYear: 12.0, kh: 12.0, diff: '-1,6 đ.%', isDiffPositive: false, unit: '%' }
    ]
  },
  'Lũy kế cả năm (12T)': {
    monthCount: 12,
    shortCode: '12T',
    monthText: '12 tháng',
    values: [
      { id: 'total', name: 'Tổng doanh thu', lines: ['Tổng doanh thu'], lk: 4620.0, uoc: 4620.0, khYear: 4968.1, kh: 4968.1, rate: '93,0%', isRatePositive: false, unit: 'Tỷ đồng' },
      { id: 'internal', name: 'DT nội bộ', lines: ['DT nội bộ'], lk: 1480.0, uoc: 1480.0, khYear: 1490.4, kh: 1490.4, rate: '99,3%', isRatePositive: false, unit: 'Tỷ đồng' },
      { id: 'external', name: 'DT ngoài Tập đoàn', lines: ['DT ngoài', 'Tập đoàn'], lk: 3140.0, uoc: 3140.0, khYear: 3477.7, kh: 3477.7, rate: '90,3%', isRatePositive: false, unit: 'Tỷ đồng' },
      { id: 'global', name: 'DT quốc tế', lines: ['DT quốc tế'], lk: 495.0, uoc: 495.0, khYear: 596.3, kh: 596.3, rate: '83,0%', isRatePositive: false, unit: 'Tỷ đồng' },
      { id: 'profit', name: 'Lợi nhuận trước thuế', lines: ['Lợi nhuận', 'trước thuế'], lk: 485, uoc: 485, khYear: 521.7, kh: 521.7, rate: '93,0%', isRatePositive: false, unit: 'Tỷ đồng' }
    ],
    ratios: [
      { id: 'profit_ratio', name: 'Tỷ suất LNTT/Tổng DT', lines: ['Tỷ suất', 'LNTT/Tổng DT'], lk: 10.5, uoc: 10.5, khYear: 10.5, kh: 10.5, diff: '0,0 đ.%', isDiffPositive: true, unit: '%' },
      { id: 'external_ratio', name: 'Tỷ trọng DT ngoài TĐ', lines: ['Tỷ trọng', 'DT ngoài TĐ'], lk: 68.0, uoc: 68.0, khYear: 70.0, kh: 70.0, diff: '-2,0 đ.%', isDiffPositive: false, unit: '%' },
      { id: 'global_ratio', name: 'Tỷ trọng DT quốc tế', lines: ['Tỷ trọng', 'DT quốc tế'], lk: 10.7, uoc: 10.7, khYear: 12.0, kh: 12.0, diff: '-1,3 đ.%', isDiffPositive: false, unit: '%' }
    ]
  }
};

// ==============================================================================
// DỮ LIỆU BIỂU ĐỒ 13: ƯỚC KẾT QUẢ NĂM SO VỚI KẾT QUẢ NĂM TRƯỚC
// Cơ sở so sánh: Ước năm hiện tại (2026) – TH năm trước (2025)
// Excludes Lợi nhuận trước thuế and Tỷ suất LNTT
// ==============================================================================
export const YEAR_ESTIMATE_PREV_DATA = {
  'Lũy kế 8 tháng': {
    monthCount: 8,
    shortCode: '8T',
    monthText: '8 tháng',
    values: [
      { id: 'total', name: 'Tổng doanh thu', lines: ['Tổng doanh thu'], lk: 4464.5, uoc: 4464.5, prev: 4327.1, kh: 4327.1, rate: '103,2%', isRatePositive: true, unit: 'Tỷ đồng' },
      { id: 'internal', name: 'DT nội bộ', lines: ['DT nội bộ'], lk: 1430.2, uoc: 1430.2, prev: 1503.6, kh: 1503.6, rate: '95,1%', isRatePositive: false, unit: 'Tỷ đồng' },
      { id: 'external', name: 'DT ngoài Tập đoàn', lines: ['DT ngoài', 'Tập đoàn'], lk: 3034.2, uoc: 3034.2, prev: 2823.5, kh: 2823.5, rate: '107,5%', isRatePositive: true, unit: 'Tỷ đồng' },
      { id: 'global', name: 'DT quốc tế', lines: ['DT quốc tế'], lk: 470.8, uoc: 470.8, prev: 344.3, kh: 344.3, rate: '136,8%', isRatePositive: true, unit: 'Tỷ đồng' },
      { id: 'profit', name: 'Lợi nhuận trước thuế', lines: ['Lợi nhuận', 'trước thuế'], lk: 444.1, uoc: 444.1, prev: 401.9, kh: 401.9, rate: '110,5%', isRatePositive: true, unit: 'Tỷ đồng' }
    ],
    ratios: [
      { id: 'profit_ratio', name: 'Tỷ suất LNTT/Tổng DT', lines: ['Tỷ suất', 'LNTT/Tổng DT'], lk: 9.9, uoc: 9.9, prev: 9.3, kh: 9.3, diff: '+0,7 đ.%', isDiffPositive: true, unit: '%' },
      { id: 'external_ratio', name: 'Tỷ trọng DT ngoài TĐ', lines: ['Tỷ trọng', 'DT ngoài TĐ'], lk: 68.0, uoc: 68.0, prev: 65.3, kh: 65.3, diff: '+2,7 đ.%', isDiffPositive: true, unit: '%' },
      { id: 'global_ratio', name: 'Tỷ trọng DT quốc tế', lines: ['Tỷ trọng', 'DT quốc tế'], lk: 10.5, uoc: 10.5, prev: 8.0, kh: 8.0, diff: '+2,6 đ.%', isDiffPositive: true, unit: '%' }
    ]
  },
  'Lũy kế 6 tháng': {
    monthCount: 6,
    shortCode: '6T',
    monthText: '6 tháng',
    values: [
      { id: 'total', name: 'Tổng doanh thu', lines: ['Tổng doanh thu'], lk: 4411.4, uoc: 4411.4, prev: 4327.1, kh: 4327.1, rate: '101,9%', isRatePositive: true, unit: 'Tỷ đồng' },
      { id: 'internal', name: 'DT nội bộ', lines: ['DT nội bộ'], lk: 1433.8, uoc: 1433.8, prev: 1503.6, kh: 1503.6, rate: '95,4%', isRatePositive: false, unit: 'Tỷ đồng' },
      { id: 'external', name: 'DT ngoài Tập đoàn', lines: ['DT ngoài', 'Tập đoàn'], lk: 2977.6, uoc: 2977.6, prev: 2823.5, kh: 2823.5, rate: '105,5%', isRatePositive: true, unit: 'Tỷ đồng' },
      { id: 'global', name: 'DT quốc tế', lines: ['DT quốc tế'], lk: 451.6, uoc: 451.6, prev: 344.3, kh: 344.3, rate: '131,2%', isRatePositive: true, unit: 'Tỷ đồng' },
      { id: 'profit', name: 'Lợi nhuận trước thuế', lines: ['Lợi nhuận', 'trước thuế'], lk: 432, uoc: 432, prev: 401.9, kh: 401.9, rate: '107,5%', isRatePositive: true, unit: 'Tỷ đồng' }
    ],
    ratios: [
      { id: 'profit_ratio', name: 'Tỷ suất LNTT/Tổng DT', lines: ['Tỷ suất', 'LNTT/Tổng DT'], lk: 9.8, uoc: 9.8, prev: 9.3, kh: 9.3, diff: '+0,5 đ.%', isDiffPositive: true, unit: '%' },
      { id: 'external_ratio', name: 'Tỷ trọng DT ngoài TĐ', lines: ['Tỷ trọng', 'DT ngoài TĐ'], lk: 67.5, uoc: 67.5, prev: 65.3, kh: 65.3, diff: '+2,2 đ.%', isDiffPositive: true, unit: '%' },
      { id: 'global_ratio', name: 'Tỷ trọng DT quốc tế', lines: ['Tỷ trọng', 'DT quốc tế'], lk: 10.2, uoc: 10.2, prev: 8.0, kh: 8.0, diff: '+2,2 đ.%', isDiffPositive: true, unit: '%' }
    ]
  },
  'Lũy kế 7 tháng': {
    monthCount: 7,
    shortCode: '7T',
    monthText: '7 tháng',
    values: [
      { id: 'total', name: 'Tổng doanh thu', lines: ['Tổng doanh thu'], lk: 4422.9, uoc: 4422.9, prev: 4327.1, kh: 4327.1, rate: '102,2%', isRatePositive: true, unit: 'Tỷ đồng' },
      { id: 'internal', name: 'DT nội bộ', lines: ['DT nội bộ'], lk: 1426.3, uoc: 1426.3, prev: 1503.6, kh: 1503.6, rate: '94,9%', isRatePositive: false, unit: 'Tỷ đồng' },
      { id: 'external', name: 'DT ngoài Tập đoàn', lines: ['DT ngoài', 'Tập đoàn'], lk: 2996.6, uoc: 2996.6, prev: 2823.5, kh: 2823.5, rate: '106,1%', isRatePositive: true, unit: 'Tỷ đồng' },
      { id: 'global', name: 'DT quốc tế', lines: ['DT quốc tế'], lk: 459.4, uoc: 459.4, prev: 344.3, kh: 344.3, rate: '133,4%', isRatePositive: true, unit: 'Tỷ đồng' },
      { id: 'profit', name: 'Lợi nhuận trước thuế', lines: ['Lợi nhuận', 'trước thuế'], lk: 438, uoc: 438, prev: 401.9, kh: 401.9, rate: '109,0%', isRatePositive: true, unit: 'Tỷ đồng' }
    ],
    ratios: [
      { id: 'profit_ratio', name: 'Tỷ suất LNTT/Tổng DT', lines: ['Tỷ suất', 'LNTT/Tổng DT'], lk: 9.9, uoc: 9.9, prev: 9.3, kh: 9.3, diff: '+0,6 đ.%', isDiffPositive: true, unit: '%' },
      { id: 'external_ratio', name: 'Tỷ trọng DT ngoài TĐ', lines: ['Tỷ trọng', 'DT ngoài TĐ'], lk: 67.8, uoc: 67.8, prev: 65.3, kh: 65.3, diff: '+2,5 đ.%', isDiffPositive: true, unit: '%' },
      { id: 'global_ratio', name: 'Tỷ trọng DT quốc tế', lines: ['Tỷ trọng', 'DT quốc tế'], lk: 10.4, uoc: 10.4, prev: 8.0, kh: 8.0, diff: '+2,4 đ.%', isDiffPositive: true, unit: '%' }
    ]
  },
  'Lũy kế cả năm (12T)': {
    monthCount: 12,
    shortCode: '12T',
    monthText: '12 tháng',
    values: [
      { id: 'total', name: 'Tổng doanh thu', lines: ['Tổng doanh thu'], lk: 4620.0, uoc: 4620.0, prev: 4327.1, kh: 4327.1, rate: '106,8%', isRatePositive: true, unit: 'Tỷ đồng' },
      { id: 'internal', name: 'DT nội bộ', lines: ['DT nội bộ'], lk: 1480.0, uoc: 1480.0, prev: 1503.6, kh: 1503.6, rate: '98,4%', isRatePositive: false, unit: 'Tỷ đồng' },
      { id: 'external', name: 'DT ngoài Tập đoàn', lines: ['DT ngoài', 'Tập đoàn'], lk: 3140.0, uoc: 3140.0, prev: 2823.5, kh: 2823.5, rate: '111,2%', isRatePositive: true, unit: 'Tỷ đồng' },
      { id: 'global', name: 'DT quốc tế', lines: ['DT quốc tế'], lk: 495.0, uoc: 495.0, prev: 344.3, kh: 344.3, rate: '143,8%', isRatePositive: true, unit: 'Tỷ đồng' },
      { id: 'profit', name: 'Lợi nhuận trước thuế', lines: ['Lợi nhuận', 'trước thuế'], lk: 485, uoc: 485, prev: 401.9, kh: 401.9, rate: '120,7%', isRatePositive: true, unit: 'Tỷ đồng' }
    ],
    ratios: [
      { id: 'profit_ratio', name: 'Tỷ suất LNTT/Tổng DT', lines: ['Tỷ suất', 'LNTT/Tổng DT'], lk: 10.5, uoc: 10.5, prev: 9.3, kh: 9.3, diff: '+1,2 đ.%', isDiffPositive: true, unit: '%' },
      { id: 'external_ratio', name: 'Tỷ trọng DT ngoài TĐ', lines: ['Tỷ trọng', 'DT ngoài TĐ'], lk: 68.0, uoc: 68.0, prev: 65.3, kh: 65.3, diff: '+2,7 đ.%', isDiffPositive: true, unit: '%' },
      { id: 'global_ratio', name: 'Tỷ trọng DT quốc tế', lines: ['Tỷ trọng', 'DT quốc tế'], lk: 10.7, uoc: 10.7, prev: 8.0, kh: 8.0, diff: '+2,7 đ.%', isDiffPositive: true, unit: '%' }
    ]
  }
};


