// Data definitions for MonthComparisonChart (Phân tích theo tháng)
// Excludes Lợi nhuận trước thuế and Tỷ suất LNTT

export const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => `Tháng ${i + 1}`);

// 1. DATA FOR BIỂU ĐỒ 1: THÁNG SO VỚI KẾ HOẠCH
export const MONTHLY_PLAN_DATA = {
  'Tháng 1': {
    values: [
      { id: 'total', name: 'Tổng doanh thu', lines: ['Tổng doanh thu'], th: 315.4, kh: 335.0, rate: '94,1%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'internal', name: 'DT nội bộ', lines: ['DT nội bộ'], th: 102.1, kh: 105.0, rate: '97,2%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'external', name: 'DT ngoài Tập đoàn', lines: ['DT ngoài', 'Tập đoàn'], th: 213.3, kh: 230.0, rate: '92,7%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'global', name: 'DT quốc tế', lines: ['DT quốc tế'], th: 32.5, kh: 38.0, rate: '85,5%', isRatePositive: false, unit: 'Triệu đồng' }
    ],
    ratios: [
      { id: 'external_ratio', name: 'Tỷ trọng DT ngoài TĐ', lines: ['Tỷ trọng', 'DT ngoài TĐ'], th: 67.6, kh: 68.7, diff: '-1,1 đ.%', isDiffPositive: false, unit: '%' },
      { id: 'global_ratio', name: 'Tỷ trọng DT quốc tế', lines: ['Tỷ trọng', 'DT quốc tế'], th: 10.3, kh: 11.3, diff: '-1,0 đ.%', isDiffPositive: false, unit: '%' }
    ]
  },
  'Tháng 2': {
    values: [
      { id: 'total', name: 'Tổng doanh thu', lines: ['Tổng doanh thu'], th: 298.2, kh: 320.0, rate: '93,2%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'internal', name: 'DT nội bộ', lines: ['DT nội bộ'], th: 98.4, kh: 96.0, rate: '102,5%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'external', name: 'DT ngoài Tập đoàn', lines: ['DT ngoài', 'Tập đoàn'], th: 199.8, kh: 224.0, rate: '89,2%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'global', name: 'DT quốc tế', lines: ['DT quốc tế'], th: 29.8, kh: 35.0, rate: '85,1%', isRatePositive: false, unit: 'Triệu đồng' }
    ],
    ratios: [
      { id: 'external_ratio', name: 'Tỷ trọng DT ngoài TĐ', lines: ['Tỷ trọng', 'DT ngoài TĐ'], th: 67.0, kh: 70.0, diff: '-3,0 đ.%', isDiffPositive: false, unit: '%' },
      { id: 'global_ratio', name: 'Tỷ trọng DT quốc tế', lines: ['Tỷ trọng', 'DT quốc tế'], th: 10.0, kh: 10.9, diff: '-0,9 đ.%', isDiffPositive: false, unit: '%' }
    ]
  },
  'Tháng 3': {
    values: [
      { id: 'total', name: 'Tổng doanh thu', lines: ['Tổng doanh thu'], th: 412.5, kh: 395.0, rate: '104,4%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'internal', name: 'DT nội bộ', lines: ['DT nội bộ'], th: 135.0, kh: 128.0, rate: '105,5%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'external', name: 'DT ngoài Tập đoàn', lines: ['DT ngoài', 'Tập đoàn'], th: 277.5, kh: 267.0, rate: '103,9%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'global', name: 'DT quốc tế', lines: ['DT quốc tế'], th: 42.8, kh: 41.0, rate: '104,4%', isRatePositive: true, unit: 'Triệu đồng' }
    ],
    ratios: [
      { id: 'external_ratio', name: 'Tỷ trọng DT ngoài TĐ', lines: ['Tỷ trọng', 'DT ngoài TĐ'], th: 67.3, kh: 67.6, diff: '-0,3 đ.%', isDiffPositive: false, unit: '%' },
      { id: 'global_ratio', name: 'Tỷ trọng DT quốc tế', lines: ['Tỷ trọng', 'DT quốc tế'], th: 10.4, kh: 10.4, diff: '0,0 đ.%', isDiffPositive: true, unit: '%' }
    ]
  },
  'Tháng 4': {
    values: [
      { id: 'total', name: 'Tổng doanh thu', lines: ['Tổng doanh thu'], th: 362.8, kh: 375.0, rate: '96,7%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'internal', name: 'DT nội bộ', lines: ['DT nội bộ'], th: 118.5, kh: 120.0, rate: '98,8%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'external', name: 'DT ngoài Tập đoàn', lines: ['DT ngoài', 'Tập đoàn'], th: 244.3, kh: 255.0, rate: '95,8%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'global', name: 'DT quốc tế', lines: ['DT quốc tế'], th: 36.2, kh: 40.0, rate: '90,5%', isRatePositive: false, unit: 'Triệu đồng' }
    ],
    ratios: [
      { id: 'external_ratio', name: 'Tỷ trọng DT ngoài TĐ', lines: ['Tỷ trọng', 'DT ngoài TĐ'], th: 67.3, kh: 68.0, diff: '-0,7 đ.%', isDiffPositive: false, unit: '%' },
      { id: 'global_ratio', name: 'Tỷ trọng DT quốc tế', lines: ['Tỷ trọng', 'DT quốc tế'], th: 10.0, kh: 10.7, diff: '-0,7 đ.%', isDiffPositive: false, unit: '%' }
    ]
  },
  'Tháng 5': {
    values: [
      { id: 'total', name: 'Tổng doanh thu', lines: ['Tổng doanh thu'], th: 378.6, kh: 385.0, rate: '98,3%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'internal', name: 'DT nội bộ', lines: ['DT nội bộ'], th: 122.4, kh: 120.0, rate: '102,0%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'external', name: 'DT ngoài Tập đoàn', lines: ['DT ngoài', 'Tập đoàn'], th: 256.2, kh: 265.0, rate: '96,7%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'global', name: 'DT quốc tế', lines: ['DT quốc tế'], th: 38.0, kh: 42.0, rate: '90,5%', isRatePositive: false, unit: 'Triệu đồng' }
    ],
    ratios: [
      { id: 'external_ratio', name: 'Tỷ trọng DT ngoài TĐ', lines: ['Tỷ trọng', 'DT ngoài TĐ'], th: 67.7, kh: 68.8, diff: '-1,1 đ.%', isDiffPositive: false, unit: '%' },
      { id: 'global_ratio', name: 'Tỷ trọng DT quốc tế', lines: ['Tỷ trọng', 'DT quốc tế'], th: 10.0, kh: 10.9, diff: '-0,9 đ.%', isDiffPositive: false, unit: '%' }
    ]
  },
  'Tháng 6': {
    values: [
      { id: 'total', name: 'Tổng doanh thu', lines: ['Tổng doanh thu'], th: 438.2, kh: 425.0, rate: '103,1%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'internal', name: 'DT nội bộ', lines: ['DT nội bộ'], th: 140.5, kh: 135.0, rate: '104,1%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'external', name: 'DT ngoài Tập đoàn', lines: ['DT ngoài', 'Tập đoàn'], th: 297.7, kh: 290.0, rate: '102,7%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'global', name: 'DT quốc tế', lines: ['DT quốc tế'], th: 46.5, kh: 44.0, rate: '105,7%', isRatePositive: true, unit: 'Triệu đồng' }
    ],
    ratios: [
      { id: 'external_ratio', name: 'Tỷ trọng DT ngoài TĐ', lines: ['Tỷ trọng', 'DT ngoài TĐ'], th: 67.9, kh: 68.2, diff: '-0,3 đ.%', isDiffPositive: false, unit: '%' },
      { id: 'global_ratio', name: 'Tỷ trọng DT quốc tế', lines: ['Tỷ trọng', 'DT quốc tế'], th: 10.6, kh: 10.4, diff: '+0,2 đ.%', isDiffPositive: true, unit: '%' }
    ]
  },
  'Tháng 7': {
    values: [
      { id: 'total', name: 'Tổng doanh thu', lines: ['Tổng doanh thu'], th: 395.2, kh: 405.0, rate: '97,6%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'internal', name: 'DT nội bộ', lines: ['DT nội bộ'], th: 128.0, kh: 125.0, rate: '102,4%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'external', name: 'DT ngoài Tập đoàn', lines: ['DT ngoài', 'Tập đoàn'], th: 267.2, kh: 280.0, rate: '95,4%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'global', name: 'DT quốc tế', lines: ['DT quốc tế'], th: 40.5, kh: 45.0, rate: '90,0%', isRatePositive: false, unit: 'Triệu đồng' }
    ],
    ratios: [
      { id: 'external_ratio', name: 'Tỷ trọng DT ngoài TĐ', lines: ['Tỷ trọng', 'DT ngoài TĐ'], th: 67.6, kh: 69.1, diff: '-1,5 đ.%', isDiffPositive: false, unit: '%' },
      { id: 'global_ratio', name: 'Tỷ trọng DT quốc tế', lines: ['Tỷ trọng', 'DT quốc tế'], th: 10.2, kh: 11.1, diff: '-0,9 đ.%', isDiffPositive: false, unit: '%' }
    ]
  },
  'Tháng 8': {
    values: [
      { id: 'total', name: 'Tổng doanh thu', lines: ['Tổng doanh thu'], th: 389.9, kh: 414.0, rate: '94,2%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'internal', name: 'DT nội bộ', lines: ['DT nội bộ'], th: 127.2, kh: 124.2, rate: '102,4%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'external', name: 'DT ngoài Tập đoàn', lines: ['DT ngoài', 'Tập đoàn'], th: 262.7, kh: 289.8, rate: '90,6%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'global', name: 'DT quốc tế', lines: ['DT quốc tế'], th: 39.7, kh: 49.7, rate: '79,9%', isRatePositive: false, unit: 'Triệu đồng' }
    ],
    ratios: [
      { id: 'external_ratio', name: 'Tỷ trọng DT ngoài TĐ', lines: ['Tỷ trọng', 'DT ngoài TĐ'], th: 67.4, kh: 70.0, diff: '-2,6 đ.%', isDiffPositive: false, unit: '%' },
      { id: 'global_ratio', name: 'Tỷ trọng DT quốc tế', lines: ['Tỷ trọng', 'DT quốc tế'], th: 10.2, kh: 12.0, diff: '-1,8 đ.%', isDiffPositive: false, unit: '%' }
    ]
  },
  'Tháng 9': {
    values: [
      { id: 'total', name: 'Tổng doanh thu', lines: ['Tổng doanh thu'], th: 442.8, kh: 430.0, rate: '103,0%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'internal', name: 'DT nội bộ', lines: ['DT nội bộ'], th: 142.0, kh: 136.0, rate: '104,4%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'external', name: 'DT ngoài Tập đoàn', lines: ['DT ngoài', 'Tập đoàn'], th: 300.8, kh: 294.0, rate: '102,3%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'global', name: 'DT quốc tế', lines: ['DT quốc tế'], th: 47.2, kh: 45.0, rate: '104,9%', isRatePositive: true, unit: 'Triệu đồng' }
    ],
    ratios: [
      { id: 'external_ratio', name: 'Tỷ trọng DT ngoài TĐ', lines: ['Tỷ trọng', 'DT ngoài TĐ'], th: 67.9, kh: 68.4, diff: '-0,5 đ.%', isDiffPositive: false, unit: '%' },
      { id: 'global_ratio', name: 'Tỷ trọng DT quốc tế', lines: ['Tỷ trọng', 'DT quốc tế'], th: 10.7, kh: 10.5, diff: '+0,2 đ.%', isDiffPositive: true, unit: '%' }
    ]
  },
  'Tháng 10': {
    values: [
      { id: 'total', name: 'Tổng doanh thu', lines: ['Tổng doanh thu'], th: 415.6, kh: 420.0, rate: '99,0%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'internal', name: 'DT nội bộ', lines: ['DT nội bộ'], th: 134.2, kh: 132.0, rate: '101,7%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'external', name: 'DT ngoài Tập đoàn', lines: ['DT ngoài', 'Tập đoàn'], th: 281.4, kh: 288.0, rate: '97,7%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'global', name: 'DT quốc tế', lines: ['DT quốc tế'], th: 43.5, kh: 47.0, rate: '92,6%', isRatePositive: false, unit: 'Triệu đồng' }
    ],
    ratios: [
      { id: 'external_ratio', name: 'Tỷ trọng DT ngoài TĐ', lines: ['Tỷ trọng', 'DT ngoài TĐ'], th: 67.7, kh: 68.6, diff: '-0,9 đ.%', isDiffPositive: false, unit: '%' },
      { id: 'global_ratio', name: 'Tỷ trọng DT quốc tế', lines: ['Tỷ trọng', 'DT quốc tế'], th: 10.5, kh: 11.2, diff: '-0,7 đ.%', isDiffPositive: false, unit: '%' }
    ]
  },
  'Tháng 11': {
    values: [
      { id: 'total', name: 'Tổng doanh thu', lines: ['Tổng doanh thu'], th: null, kh: 450.0, rate: '-', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'internal', name: 'DT nội bộ', lines: ['DT nội bộ'], th: null, kh: 142.0, rate: '-', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'external', name: 'DT ngoài Tập đoàn', lines: ['DT ngoài', 'Tập đoàn'], th: null, kh: 308.0, rate: '-', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'global', name: 'DT quốc tế', lines: ['DT quốc tế'], th: null, kh: 48.0, rate: '-', isRatePositive: false, unit: 'Triệu đồng' }
    ],
    ratios: [
      { id: 'external_ratio', name: 'Tỷ trọng DT ngoài TĐ', lines: ['Tỷ trọng', 'DT ngoài TĐ'], th: null, kh: 68.4, diff: '-', isDiffPositive: false, unit: '%' },
      { id: 'global_ratio', name: 'Tỷ trọng DT quốc tế', lines: ['Tỷ trọng', 'DT quốc tế'], th: null, kh: 10.7, diff: '-', isDiffPositive: false, unit: '%' }
    ]
  },
  'Tháng 12': {
    isBlank: true,
    values: [
      { id: 'total', name: 'Tổng doanh thu', lines: ['Tổng doanh thu'], th: 0, kh: 0, rate: '-', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'internal', name: 'DT nội bộ', lines: ['DT nội bộ'], th: 0, kh: 0, rate: '-', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'external', name: 'DT ngoài Tập đoàn', lines: ['DT ngoài', 'Tập đoàn'], th: 0, kh: 0, rate: '-', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'global', name: 'DT quốc tế', lines: ['DT quốc tế'], th: 0, kh: 0, rate: '-', isRatePositive: false, unit: 'Triệu đồng' }
    ],
    ratios: [
      { id: 'external_ratio', name: 'Tỷ trọng DT ngoài TĐ', lines: ['Tỷ trọng', 'DT ngoài TĐ'], th: 0, kh: 0, diff: '-', isDiffPositive: false, unit: '%' },
      { id: 'global_ratio', name: 'Tỷ trọng DT quốc tế', lines: ['Tỷ trọng', 'DT quốc tế'], th: 0, kh: 0, diff: '-', isDiffPositive: false, unit: '%' }
    ]
  }
};

// 2. DATA FOR BIỂU ĐỒ 2: THÁNG SO VỚI THÁNG TRƯỚC
export const MONTH_PREV_DATA = {
  'Tháng 1': {
    values: [
      { id: 'total', name: 'Tổng doanh thu', lines: ['Tổng doanh thu'], thCurrent: 315.4, thPrev: 495.2, rate: '63,7%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'internal', name: 'DT nội bộ', lines: ['DT nội bộ'], thCurrent: 102.1, thPrev: 158.4, rate: '64,5%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'external', name: 'DT ngoài Tập đoàn', lines: ['DT ngoài', 'Tập đoàn'], thCurrent: 213.3, thPrev: 336.8, rate: '63,3%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'global', name: 'DT quốc tế', lines: ['DT quốc tế'], thCurrent: 32.5, thPrev: 54.0, rate: '60,2%', isRatePositive: false, unit: 'Triệu đồng' }
    ],
    ratios: [
      { id: 'external_ratio', name: 'Tỷ trọng DT ngoài TĐ', lines: ['Tỷ trọng', 'DT ngoài TĐ'], thCurrent: 67.6, thPrev: 68.0, diff: '-0,4 đ.%', isDiffPositive: false, unit: '%' },
      { id: 'global_ratio', name: 'Tỷ trọng DT quốc tế', lines: ['Tỷ trọng', 'DT quốc tế'], thCurrent: 10.3, thPrev: 10.9, diff: '-0,6 đ.%', isDiffPositive: false, unit: '%' }
    ]
  },
  'Tháng 2': {
    values: [
      { id: 'total', name: 'Tổng doanh thu', lines: ['Tổng doanh thu'], thCurrent: 298.2, thPrev: 315.4, rate: '94,5%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'internal', name: 'DT nội bộ', lines: ['DT nội bộ'], thCurrent: 98.4, thPrev: 102.1, rate: '96,4%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'external', name: 'DT ngoài Tập đoàn', lines: ['DT ngoài', 'Tập đoàn'], thCurrent: 199.8, thPrev: 213.3, rate: '93,7%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'global', name: 'DT quốc tế', lines: ['DT quốc tế'], thCurrent: 29.8, thPrev: 32.5, rate: '91,7%', isRatePositive: false, unit: 'Triệu đồng' }
    ],
    ratios: [
      { id: 'external_ratio', name: 'Tỷ trọng DT ngoài TĐ', lines: ['Tỷ trọng', 'DT ngoài TĐ'], thCurrent: 67.0, thPrev: 67.6, diff: '-0,6 đ.%', isDiffPositive: false, unit: '%' },
      { id: 'global_ratio', name: 'Tỷ trọng DT quốc tế', lines: ['Tỷ trọng', 'DT quốc tế'], thCurrent: 10.0, thPrev: 10.3, diff: '-0,3 đ.%', isDiffPositive: false, unit: '%' }
    ]
  },
  'Tháng 3': {
    values: [
      { id: 'total', name: 'Tổng doanh thu', lines: ['Tổng doanh thu'], thCurrent: 412.5, thPrev: 298.2, rate: '138,3%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'internal', name: 'DT nội bộ', lines: ['DT nội bộ'], thCurrent: 135.0, thPrev: 98.4, rate: '137,2%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'external', name: 'DT ngoài Tập đoàn', lines: ['DT ngoài', 'Tập đoàn'], thCurrent: 277.5, thPrev: 199.8, rate: '138,9%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'global', name: 'DT quốc tế', lines: ['DT quốc tế'], thCurrent: 42.8, thPrev: 29.8, rate: '143,6%', isRatePositive: true, unit: 'Triệu đồng' }
    ],
    ratios: [
      { id: 'external_ratio', name: 'Tỷ trọng DT ngoài TĐ', lines: ['Tỷ trọng', 'DT ngoài TĐ'], thCurrent: 67.3, thPrev: 67.0, diff: '+0,3 đ.%', isDiffPositive: true, unit: '%' },
      { id: 'global_ratio', name: 'Tỷ trọng DT quốc tế', lines: ['Tỷ trọng', 'DT quốc tế'], thCurrent: 10.4, thPrev: 10.0, diff: '+0,4 đ.%', isDiffPositive: true, unit: '%' }
    ]
  },
  'Tháng 4': {
    values: [
      { id: 'total', name: 'Tổng doanh thu', lines: ['Tổng doanh thu'], thCurrent: 362.8, thPrev: 412.5, rate: '87,9%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'internal', name: 'DT nội bộ', lines: ['DT nội bộ'], thCurrent: 118.5, thPrev: 135.0, rate: '87,8%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'external', name: 'DT ngoài Tập đoàn', lines: ['DT ngoài', 'Tập đoàn'], thCurrent: 244.3, thPrev: 277.5, rate: '88,0%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'global', name: 'DT quốc tế', lines: ['DT quốc tế'], thCurrent: 36.2, thPrev: 42.8, rate: '84,6%', isRatePositive: false, unit: 'Triệu đồng' }
    ],
    ratios: [
      { id: 'external_ratio', name: 'Tỷ trọng DT ngoài TĐ', lines: ['Tỷ trọng', 'DT ngoài TĐ'], thCurrent: 67.3, thPrev: 67.3, diff: '0,0 đ.%', isDiffPositive: true, unit: '%' },
      { id: 'global_ratio', name: 'Tỷ trọng DT quốc tế', lines: ['Tỷ trọng', 'DT quốc tế'], thCurrent: 10.0, thPrev: 10.4, diff: '-0,4 đ.%', isDiffPositive: false, unit: '%' }
    ]
  },
  'Tháng 5': {
    values: [
      { id: 'total', name: 'Tổng doanh thu', lines: ['Tổng doanh thu'], thCurrent: 378.6, thPrev: 362.8, rate: '104,4%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'internal', name: 'DT nội bộ', lines: ['DT nội bộ'], thCurrent: 122.4, thPrev: 118.5, rate: '103,3%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'external', name: 'DT ngoài Tập đoàn', lines: ['DT ngoài', 'Tập đoàn'], thCurrent: 256.2, thPrev: 244.3, rate: '104,9%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'global', name: 'DT quốc tế', lines: ['DT quốc tế'], thCurrent: 38.0, thPrev: 36.2, rate: '105,0%', isRatePositive: true, unit: 'Triệu đồng' }
    ],
    ratios: [
      { id: 'external_ratio', name: 'Tỷ trọng DT ngoài TĐ', lines: ['Tỷ trọng', 'DT ngoài TĐ'], thCurrent: 67.7, thPrev: 67.3, diff: '+0,4 đ.%', isDiffPositive: true, unit: '%' },
      { id: 'global_ratio', name: 'Tỷ trọng DT quốc tế', lines: ['Tỷ trọng', 'DT quốc tế'], thCurrent: 10.0, thPrev: 10.0, diff: '0,0 đ.%', isDiffPositive: true, unit: '%' }
    ]
  },
  'Tháng 6': {
    values: [
      { id: 'total', name: 'Tổng doanh thu', lines: ['Tổng doanh thu'], thCurrent: 438.2, thPrev: 378.6, rate: '115,7%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'internal', name: 'DT nội bộ', lines: ['DT nội bộ'], thCurrent: 140.5, thPrev: 122.4, rate: '114,8%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'external', name: 'DT ngoài Tập đoàn', lines: ['DT ngoài', 'Tập đoàn'], thCurrent: 297.7, thPrev: 256.2, rate: '116,2%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'global', name: 'DT quốc tế', lines: ['DT quốc tế'], thCurrent: 46.5, thPrev: 38.0, rate: '122,4%', isRatePositive: true, unit: 'Triệu đồng' }
    ],
    ratios: [
      { id: 'external_ratio', name: 'Tỷ trọng DT ngoài TĐ', lines: ['Tỷ trọng', 'DT ngoài TĐ'], thCurrent: 67.9, thPrev: 67.7, diff: '+0,2 đ.%', isDiffPositive: true, unit: '%' },
      { id: 'global_ratio', name: 'Tỷ trọng DT quốc tế', lines: ['Tỷ trọng', 'DT quốc tế'], thCurrent: 10.6, thPrev: 10.0, diff: '+0,6 đ.%', isDiffPositive: true, unit: '%' }
    ]
  },
  'Tháng 7': {
    values: [
      { id: 'total', name: 'Tổng doanh thu', lines: ['Tổng doanh thu'], thCurrent: 385.1, thPrev: 438.2, rate: '87,9%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'internal', name: 'DT nội bộ', lines: ['DT nội bộ'], thCurrent: 122.8, thPrev: 140.5, rate: '87,4%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'external', name: 'DT ngoài Tập đoàn', lines: ['DT ngoài', 'Tập đoàn'], thCurrent: 262.3, thPrev: 297.7, rate: '88,1%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'global', name: 'DT quốc tế', lines: ['DT quốc tế'], thCurrent: 42.2, thPrev: 46.5, rate: '90,8%', isRatePositive: false, unit: 'Triệu đồng' }
    ],
    ratios: [
      { id: 'external_ratio', name: 'Tỷ trọng DT ngoài TĐ', lines: ['Tỷ trọng', 'DT ngoài TĐ'], thCurrent: 68.1, thPrev: 67.9, diff: '+0,2 đ.%', isDiffPositive: true, unit: '%' },
      { id: 'global_ratio', name: 'Tỷ trọng DT quốc tế', lines: ['Tỷ trọng', 'DT quốc tế'], thCurrent: 11.0, thPrev: 10.6, diff: '+0,4 đ.%', isDiffPositive: true, unit: '%' }
    ]
  },
  'Tháng 8': {
    values: [
      { id: 'total', name: 'Tổng doanh thu', lines: ['Tổng doanh thu'], thCurrent: 389.9, thPrev: 385.1, rate: '101,2%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'internal', name: 'DT nội bộ', lines: ['DT nội bộ'], thCurrent: 127.2, thPrev: 122.8, rate: '103,6%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'external', name: 'DT ngoài Tập đoàn', lines: ['DT ngoài', 'Tập đoàn'], thCurrent: 262.7, thPrev: 262.3, rate: '100,2%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'global', name: 'DT quốc tế', lines: ['DT quốc tế'], thCurrent: 39.7, thPrev: 42.2, rate: '94,1%', isRatePositive: false, unit: 'Triệu đồng' }
    ],
    ratios: [
      { id: 'external_ratio', name: 'Tỷ trọng DT ngoài TĐ', lines: ['Tỷ trọng', 'DT ngoài TĐ'], thCurrent: 67.4, thPrev: 68.1, diff: '-0,7 đ.%', isDiffPositive: false, unit: '%' },
      { id: 'global_ratio', name: 'Tỷ trọng DT quốc tế', lines: ['Tỷ trọng', 'DT quốc tế'], thCurrent: 10.2, thPrev: 11.0, diff: '-0,8 đ.%', isDiffPositive: false, unit: '%' }
    ]
  },
  'Tháng 9': {
    values: [
      { id: 'total', name: 'Tổng doanh thu', lines: ['Tổng doanh thu'], thCurrent: 442.8, thPrev: 389.9, rate: '113,6%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'internal', name: 'DT nội bộ', lines: ['DT nội bộ'], thCurrent: 142.0, thPrev: 127.2, rate: '111,6%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'external', name: 'DT ngoài Tập đoàn', lines: ['DT ngoài', 'Tập đoàn'], thCurrent: 300.8, thPrev: 262.7, rate: '114,5%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'global', name: 'DT quốc tế', lines: ['DT quốc tế'], thCurrent: 47.2, thPrev: 39.7, rate: '118,9%', isRatePositive: true, unit: 'Triệu đồng' }
    ],
    ratios: [
      { id: 'external_ratio', name: 'Tỷ trọng DT ngoài TĐ', lines: ['Tỷ trọng', 'DT ngoài TĐ'], thCurrent: 67.9, thPrev: 67.4, diff: '+0,5 đ.%', isDiffPositive: true, unit: '%' },
      { id: 'global_ratio', name: 'Tỷ trọng DT quốc tế', lines: ['Tỷ trọng', 'DT quốc tế'], thCurrent: 10.7, thPrev: 10.2, diff: '+0,5 đ.%', isDiffPositive: true, unit: '%' }
    ]
  },
  'Tháng 10': {
    values: [
      { id: 'total', name: 'Tổng doanh thu', lines: ['Tổng doanh thu'], thCurrent: 415.6, thPrev: 442.8, rate: '93,9%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'internal', name: 'DT nội bộ', lines: ['DT nội bộ'], thCurrent: 134.2, thPrev: 142.0, rate: '94,5%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'external', name: 'DT ngoài Tập đoàn', lines: ['DT ngoài', 'Tập đoàn'], thCurrent: 281.4, thPrev: 300.8, rate: '93,6%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'global', name: 'DT quốc tế', lines: ['DT quốc tế'], thCurrent: 43.5, thPrev: 47.2, rate: '92,2%', isRatePositive: false, unit: 'Triệu đồng' }
    ],
    ratios: [
      { id: 'external_ratio', name: 'Tỷ trọng DT ngoài TĐ', lines: ['Tỷ trọng', 'DT ngoài TĐ'], thCurrent: 67.7, thPrev: 67.9, diff: '-0,2 đ.%', isDiffPositive: false, unit: '%' },
      { id: 'global_ratio', name: 'Tỷ trọng DT quốc tế', lines: ['Tỷ trọng', 'DT quốc tế'], thCurrent: 10.5, thPrev: 10.7, diff: '-0,2 đ.%', isDiffPositive: false, unit: '%' }
    ]
  },
  'Tháng 11': {
    values: [
      { id: 'total', name: 'Tổng doanh thu', lines: ['Tổng doanh thu'], thCurrent: null, thPrev: 415.6, rate: '-', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'internal', name: 'DT nội bộ', lines: ['DT nội bộ'], thCurrent: null, thPrev: 134.2, rate: '-', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'external', name: 'DT ngoài Tập đoàn', lines: ['DT ngoài', 'Tập đoàn'], thCurrent: null, thPrev: 281.4, rate: '-', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'global', name: 'DT quốc tế', lines: ['DT quốc tế'], thCurrent: null, thPrev: 43.5, rate: '-', isRatePositive: false, unit: 'Triệu đồng' }
    ],
    ratios: [
      { id: 'external_ratio', name: 'Tỷ trọng DT ngoài TĐ', lines: ['Tỷ trọng', 'DT ngoài TĐ'], thCurrent: null, thPrev: 67.7, diff: '-', isDiffPositive: false, unit: '%' },
      { id: 'global_ratio', name: 'Tỷ trọng DT quốc tế', lines: ['Tỷ trọng', 'DT quốc tế'], thCurrent: null, thPrev: 10.5, diff: '-', isDiffPositive: false, unit: '%' }
    ]
  },
  'Tháng 12': {
    isBlank: true,
    values: [
      { id: 'total', name: 'Tổng doanh thu', lines: ['Tổng doanh thu'], thCurrent: 0, thPrev: 0, rate: '-', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'internal', name: 'DT nội bộ', lines: ['DT nội bộ'], thCurrent: 0, thPrev: 0, rate: '-', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'external', name: 'DT ngoài Tập đoàn', lines: ['DT ngoài', 'Tập đoàn'], thCurrent: 0, thPrev: 0, rate: '-', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'global', name: 'DT quốc tế', lines: ['DT quốc tế'], thCurrent: 0, thPrev: 0, rate: '-', isRatePositive: false, unit: 'Triệu đồng' }
    ],
    ratios: [
      { id: 'external_ratio', name: 'Tỷ trọng DT ngoài TĐ', lines: ['Tỷ trọng', 'DT ngoài TĐ'], thCurrent: 0, thPrev: 0, diff: '-', isDiffPositive: false, unit: '%' },
      { id: 'global_ratio', name: 'Tỷ trọng DT quốc tế', lines: ['Tỷ trọng', 'DT quốc tế'], thCurrent: 0, thPrev: 0, diff: '-', isDiffPositive: false, unit: '%' }
    ]
  }
};

// 3. DATA FOR BIỂU ĐỒ 3: THÁNG SO VỚI CÙNG KỲ NĂM TRƯỚC (No Lợi nhuận trước thuế)
// Exact match with user's reference image for Tháng 8 (T8/2026 vs T8/2025)
export const MONTH_LAST_YEAR_DATA = {
  'Tháng 1': {
    values: [
      { id: 'total', name: 'Tổng doanh thu', lines: ['Tổng doanh thu'], thCurrent: 315.4, thLastYear: 285.2, rate: '110,6%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'internal', name: 'DT nội bộ', lines: ['DT nội bộ'], thCurrent: 102.1, thLastYear: 98.5, rate: '103,7%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'external', name: 'DT ngoài Tập đoàn', lines: ['DT ngoài', 'Tập đoàn'], thCurrent: 213.3, thLastYear: 186.7, rate: '114,2%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'global', name: 'DT quốc tế', lines: ['DT quốc tế'], thCurrent: 32.5, thLastYear: 24.8, rate: '131,0%', isRatePositive: true, unit: 'Triệu đồng' }
    ],
    ratios: [
      { id: 'external_ratio', name: 'Tỷ trọng DT ngoài TĐ', lines: ['Tỷ trọng', 'DT ngoài TĐ'], thCurrent: 67.6, thLastYear: 65.5, diff: '+2,1 đ.%', isDiffPositive: true, unit: '%' },
      { id: 'global_ratio', name: 'Tỷ trọng DT quốc tế', lines: ['Tỷ trọng', 'DT quốc tế'], thCurrent: 10.3, thLastYear: 8.7, diff: '+1,6 đ.%', isDiffPositive: true, unit: '%' }
    ]
  },
  'Tháng 2': {
    values: [
      { id: 'total', name: 'Tổng doanh thu', lines: ['Tổng doanh thu'], thCurrent: 298.2, thLastYear: 275.0, rate: '108,4%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'internal', name: 'DT nội bộ', lines: ['DT nội bộ'], thCurrent: 98.4, thLastYear: 95.0, rate: '103,6%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'external', name: 'DT ngoài Tập đoàn', lines: ['DT ngoài', 'Tập đoàn'], thCurrent: 199.8, thLastYear: 180.0, rate: '111,0%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'global', name: 'DT quốc tế', lines: ['DT quốc tế'], thCurrent: 29.8, thLastYear: 23.5, rate: '126,8%', isRatePositive: true, unit: 'Triệu đồng' }
    ],
    ratios: [
      { id: 'external_ratio', name: 'Tỷ trọng DT ngoài TĐ', lines: ['Tỷ trọng', 'DT ngoài TĐ'], thCurrent: 67.0, thLastYear: 65.5, diff: '+1,5 đ.%', isDiffPositive: true, unit: '%' },
      { id: 'global_ratio', name: 'Tỷ trọng DT quốc tế', lines: ['Tỷ trọng', 'DT quốc tế'], thCurrent: 10.0, thLastYear: 8.5, diff: '+1,5 đ.%', isDiffPositive: true, unit: '%' }
    ]
  },
  'Tháng 3': {
    values: [
      { id: 'total', name: 'Tổng doanh thu', lines: ['Tổng doanh thu'], thCurrent: 412.5, thLastYear: 375.0, rate: '110,0%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'internal', name: 'DT nội bộ', lines: ['DT nội bộ'], thCurrent: 135.0, thLastYear: 128.0, rate: '105,5%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'external', name: 'DT ngoài Tập đoàn', lines: ['DT ngoài', 'Tập đoàn'], thCurrent: 277.5, thLastYear: 247.0, rate: '112,3%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'global', name: 'DT quốc tế', lines: ['DT quốc tế'], thCurrent: 42.8, thLastYear: 32.0, rate: '133,8%', isRatePositive: true, unit: 'Triệu đồng' }
    ],
    ratios: [
      { id: 'external_ratio', name: 'Tỷ trọng DT ngoài TĐ', lines: ['Tỷ trọng', 'DT ngoài TĐ'], thCurrent: 67.3, thLastYear: 65.9, diff: '+1,4 đ.%', isDiffPositive: true, unit: '%' },
      { id: 'global_ratio', name: 'Tỷ trọng DT quốc tế', lines: ['Tỷ trọng', 'DT quốc tế'], thCurrent: 10.4, thLastYear: 8.5, diff: '+1,9 đ.%', isDiffPositive: true, unit: '%' }
    ]
  },
  'Tháng 4': {
    values: [
      { id: 'total', name: 'Tổng doanh thu', lines: ['Tổng doanh thu'], thCurrent: 362.8, thLastYear: 340.0, rate: '106,7%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'internal', name: 'DT nội bộ', lines: ['DT nội bộ'], thCurrent: 118.5, thLastYear: 115.0, rate: '103,0%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'external', name: 'DT ngoài Tập đoàn', lines: ['DT ngoài', 'Tập đoàn'], thCurrent: 244.3, thLastYear: 225.0, rate: '108,6%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'global', name: 'DT quốc tế', lines: ['DT quốc tế'], thCurrent: 36.2, thLastYear: 27.5, rate: '131,6%', isRatePositive: true, unit: 'Triệu đồng' }
    ],
    ratios: [
      { id: 'external_ratio', name: 'Tỷ trọng DT ngoài TĐ', lines: ['Tỷ trọng', 'DT ngoài TĐ'], thCurrent: 67.3, thLastYear: 66.2, diff: '+1,1 đ.%', isDiffPositive: true, unit: '%' },
      { id: 'global_ratio', name: 'Tỷ trọng DT quốc tế', lines: ['Tỷ trọng', 'DT quốc tế'], thCurrent: 10.0, thLastYear: 8.1, diff: '+1,9 đ.%', isDiffPositive: true, unit: '%' }
    ]
  },
  'Tháng 5': {
    values: [
      { id: 'total', name: 'Tổng doanh thu', lines: ['Tổng doanh thu'], thCurrent: 378.6, thLastYear: 350.0, rate: '108,2%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'internal', name: 'DT nội bộ', lines: ['DT nội bộ'], thCurrent: 122.4, thLastYear: 118.0, rate: '103,7%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'external', name: 'DT ngoài Tập đoàn', lines: ['DT ngoài', 'Tập đoàn'], thCurrent: 256.2, thLastYear: 232.0, rate: '110,4%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'global', name: 'DT quốc tế', lines: ['DT quốc tế'], thCurrent: 38.0, thLastYear: 28.5, rate: '133,3%', isRatePositive: true, unit: 'Triệu đồng' }
    ],
    ratios: [
      { id: 'external_ratio', name: 'Tỷ trọng DT ngoài TĐ', lines: ['Tỷ trọng', 'DT ngoài TĐ'], thCurrent: 67.7, thLastYear: 66.3, diff: '+1,4 đ.%', isDiffPositive: true, unit: '%' },
      { id: 'global_ratio', name: 'Tỷ trọng DT quốc tế', lines: ['Tỷ trọng', 'DT quốc tế'], thCurrent: 10.0, thLastYear: 8.1, diff: '+1,9 đ.%', isDiffPositive: true, unit: '%' }
    ]
  },
  'Tháng 6': {
    values: [
      { id: 'total', name: 'Tổng doanh thu', lines: ['Tổng doanh thu'], thCurrent: 438.2, thLastYear: 400.0, rate: '109,6%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'internal', name: 'DT nội bộ', lines: ['DT nội bộ'], thCurrent: 140.5, thLastYear: 135.0, rate: '104,1%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'external', name: 'DT ngoài Tập đoàn', lines: ['DT ngoài', 'Tập đoàn'], thCurrent: 297.7, thLastYear: 265.0, rate: '112,3%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'global', name: 'DT quốc tế', lines: ['DT quốc tế'], thCurrent: 46.5, thLastYear: 34.0, rate: '136,8%', isRatePositive: true, unit: 'Triệu đồng' }
    ],
    ratios: [
      { id: 'external_ratio', name: 'Tỷ trọng DT ngoài TĐ', lines: ['Tỷ trọng', 'DT ngoài TĐ'], thCurrent: 67.9, thLastYear: 66.3, diff: '+1,6 đ.%', isDiffPositive: true, unit: '%' },
      { id: 'global_ratio', name: 'Tỷ trọng DT quốc tế', lines: ['Tỷ trọng', 'DT quốc tế'], thCurrent: 10.6, thLastYear: 8.5, diff: '+2,1 đ.%', isDiffPositive: true, unit: '%' }
    ]
  },
  'Tháng 7': {
    values: [
      { id: 'total', name: 'Tổng doanh thu', lines: ['Tổng doanh thu'], thCurrent: 395.2, thLastYear: 370.0, rate: '106,8%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'internal', name: 'DT nội bộ', lines: ['DT nội bộ'], thCurrent: 128.0, thLastYear: 124.0, rate: '103,2%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'external', name: 'DT ngoài Tập đoàn', lines: ['DT ngoài', 'Tập đoàn'], thCurrent: 267.2, thLastYear: 246.0, rate: '108,6%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'global', name: 'DT quốc tế', lines: ['DT quốc tế'], thCurrent: 40.5, thLastYear: 30.5, rate: '132,8%', isRatePositive: true, unit: 'Triệu đồng' }
    ],
    ratios: [
      { id: 'external_ratio', name: 'Tỷ trọng DT ngoài TĐ', lines: ['Tỷ trọng', 'DT ngoài TĐ'], thCurrent: 67.6, thLastYear: 66.5, diff: '+1,1 đ.%', isDiffPositive: true, unit: '%' },
      { id: 'global_ratio', name: 'Tỷ trọng DT quốc tế', lines: ['Tỷ trọng', 'DT quốc tế'], thCurrent: 10.2, thLastYear: 8.2, diff: '+2,0 đ.%', isDiffPositive: true, unit: '%' }
    ]
  },
  'Tháng 8': {
    values: [
      { id: 'total', name: 'Tổng doanh thu', lines: ['Tổng doanh thu'], thCurrent: 389.9, thLastYear: 364.3, rate: '107,0%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'internal', name: 'DT nội bộ', lines: ['DT nội bộ'], thCurrent: 127.2, thLastYear: 122.9, rate: '103,5%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'external', name: 'DT ngoài Tập đoàn', lines: ['DT ngoài', 'Tập đoàn'], thCurrent: 262.7, thLastYear: 241.4, rate: '108,8%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'global', name: 'DT quốc tế', lines: ['DT quốc tế'], thCurrent: 39.7, thLastYear: 29.2, rate: '136,0%', isRatePositive: true, unit: 'Triệu đồng' }
    ],
    ratios: [
      { id: 'external_ratio', name: 'Tỷ trọng DT ngoài TĐ', lines: ['Tỷ trọng', 'DT ngoài TĐ'], thCurrent: 67.4, thLastYear: 66.3, diff: '+1,1 đ.%', isDiffPositive: true, unit: '%' },
      { id: 'global_ratio', name: 'Tỷ trọng DT quốc tế', lines: ['Tỷ trọng', 'DT quốc tế'], thCurrent: 10.2, thLastYear: 8.0, diff: '+2,2 đ.%', isDiffPositive: true, unit: '%' }
    ]
  },
  'Tháng 9': {
    values: [
      { id: 'total', name: 'Tổng doanh thu', lines: ['Tổng doanh thu'], thCurrent: 442.8, thLastYear: 405.0, rate: '109,3%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'internal', name: 'DT nội bộ', lines: ['DT nội bộ'], thCurrent: 142.0, thLastYear: 136.0, rate: '104,4%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'external', name: 'DT ngoài Tập đoàn', lines: ['DT ngoài', 'Tập đoàn'], thCurrent: 300.8, thLastYear: 269.0, rate: '111,8%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'global', name: 'DT quốc tế', lines: ['DT quốc tế'], thCurrent: 47.2, thLastYear: 35.0, rate: '134,9%', isRatePositive: true, unit: 'Triệu đồng' }
    ],
    ratios: [
      { id: 'external_ratio', name: 'Tỷ trọng DT ngoài TĐ', lines: ['Tỷ trọng', 'DT ngoài TĐ'], thCurrent: 67.9, thLastYear: 66.4, diff: '+1,5 đ.%', isDiffPositive: true, unit: '%' },
      { id: 'global_ratio', name: 'Tỷ trọng DT quốc tế', lines: ['Tỷ trọng', 'DT quốc tế'], thCurrent: 10.7, thLastYear: 8.6, diff: '+2,1 đ.%', isDiffPositive: true, unit: '%' }
    ]
  },
  'Tháng 10': {
    values: [
      { id: 'total', name: 'Tổng doanh thu', lines: ['Tổng doanh thu'], thCurrent: 415.6, thLastYear: 388.0, rate: '107,1%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'internal', name: 'DT nội bộ', lines: ['DT nội bộ'], thCurrent: 134.2, thLastYear: 130.0, rate: '103,2%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'external', name: 'DT ngoài Tập đoàn', lines: ['DT ngoài', 'Tập đoàn'], thCurrent: 281.4, thLastYear: 258.0, rate: '109,1%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'global', name: 'DT quốc tế', lines: ['DT quốc tế'], thCurrent: 43.5, thLastYear: 33.0, rate: '131,8%', isRatePositive: true, unit: 'Triệu đồng' }
    ],
    ratios: [
      { id: 'external_ratio', name: 'Tỷ trọng DT ngoài TĐ', lines: ['Tỷ trọng', 'DT ngoài TĐ'], thCurrent: 67.7, thLastYear: 66.5, diff: '+1,2 đ.%', isDiffPositive: true, unit: '%' },
      { id: 'global_ratio', name: 'Tỷ trọng DT quốc tế', lines: ['Tỷ trọng', 'DT quốc tế'], thCurrent: 10.5, thLastYear: 8.5, diff: '+2,0 đ.%', isDiffPositive: true, unit: '%' }
    ]
  },
  'Tháng 11': {
    values: [
      { id: 'total', name: 'Tổng doanh thu', lines: ['Tổng doanh thu'], thCurrent: null, thLastYear: 425.0, rate: '-', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'internal', name: 'DT nội bộ', lines: ['DT nội bộ'], thCurrent: null, thLastYear: 142.0, rate: '-', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'external', name: 'DT ngoài Tập đoàn', lines: ['DT ngoài', 'Tập đoàn'], thCurrent: null, thLastYear: 283.0, rate: '-', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'global', name: 'DT quốc tế', lines: ['DT quốc tế'], thCurrent: null, thLastYear: 38.0, rate: '-', isRatePositive: false, unit: 'Triệu đồng' }
    ],
    ratios: [
      { id: 'external_ratio', name: 'Tỷ trọng DT ngoài TĐ', lines: ['Tỷ trọng', 'DT ngoài TĐ'], thCurrent: null, thLastYear: 66.6, diff: '-', isDiffPositive: false, unit: '%' },
      { id: 'global_ratio', name: 'Tỷ trọng DT quốc tế', lines: ['Tỷ trọng', 'DT quốc tế'], thCurrent: null, thLastYear: 8.9, diff: '-', isDiffPositive: false, unit: '%' }
    ]
  },
  'Tháng 12': {
    isBlank: true,
    values: [
      { id: 'total', name: 'Tổng doanh thu', lines: ['Tổng doanh thu'], thCurrent: 0, thLastYear: 0, rate: '-', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'internal', name: 'DT nội bộ', lines: ['DT nội bộ'], thCurrent: 0, thLastYear: 0, rate: '-', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'external', name: 'DT ngoài Tập đoàn', lines: ['DT ngoài', 'Tập đoàn'], thCurrent: 0, thLastYear: 0, rate: '-', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'global', name: 'DT quốc tế', lines: ['DT quốc tế'], thCurrent: 0, thLastYear: 0, rate: '-', isRatePositive: false, unit: 'Triệu đồng' }
    ],
    ratios: [
      { id: 'external_ratio', name: 'Tỷ trọng DT ngoài TĐ', lines: ['Tỷ trọng', 'DT ngoài TĐ'], thCurrent: 0, thLastYear: 0, diff: '-', isDiffPositive: false, unit: '%' },
      { id: 'global_ratio', name: 'Tỷ trọng DT quốc tế', lines: ['Tỷ trọng', 'DT quốc tế'], thCurrent: 0, thLastYear: 0, diff: '-', isDiffPositive: false, unit: '%' }
    ]
  }
};

// 4. DATA FOR BIỂU ĐỒ 4: THÁNG SO VỚI KẾ HOẠCH THÁNG SAU (No Lợi nhuận trước thuế)
// Exact match with user's reference image for Tháng 8 (TH T8/2026 vs KH T9/2026)
export const MONTH_NEXT_PLAN_DATA = {
  'Tháng 1': {
    values: [
      { id: 'total', name: 'Tổng doanh thu', lines: ['Tổng doanh thu'], thCurrent: 315.4, khNext: 320.0, rate: '98,6%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'internal', name: 'DT nội bộ', lines: ['DT nội bộ'], thCurrent: 102.1, khNext: 96.0, rate: '106,4%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'external', name: 'DT ngoài Tập đoàn', lines: ['DT ngoài', 'Tập đoàn'], thCurrent: 213.3, khNext: 224.0, rate: '95,2%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'global', name: 'DT quốc tế', lines: ['DT quốc tế'], thCurrent: 32.5, khNext: 35.0, rate: '92,9%', isRatePositive: false, unit: 'Triệu đồng' }
    ],
    ratios: [
      { id: 'external_ratio', name: 'Tỷ trọng DT ngoài TĐ', lines: ['Tỷ trọng', 'DT ngoài TĐ'], thCurrent: 67.6, khNext: 70.0, diff: '-2,4 đ.%', isDiffPositive: false, unit: '%' },
      { id: 'global_ratio', name: 'Tỷ trọng DT quốc tế', lines: ['Tỷ trọng', 'DT quốc tế'], thCurrent: 10.3, khNext: 10.9, diff: '-0,6 đ.%', isDiffPositive: false, unit: '%' }
    ]
  },
  'Tháng 2': {
    values: [
      { id: 'total', name: 'Tổng doanh thu', lines: ['Tổng doanh thu'], thCurrent: 298.2, khNext: 395.0, rate: '75,5%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'internal', name: 'DT nội bộ', lines: ['DT nội bộ'], thCurrent: 98.4, khNext: 128.0, rate: '76,9%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'external', name: 'DT ngoài Tập đoàn', lines: ['DT ngoài', 'Tập đoàn'], thCurrent: 199.8, khNext: 267.0, rate: '74,8%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'global', name: 'DT quốc tế', lines: ['DT quốc tế'], thCurrent: 29.8, khNext: 41.0, rate: '72,7%', isRatePositive: false, unit: 'Triệu đồng' }
    ],
    ratios: [
      { id: 'external_ratio', name: 'Tỷ trọng DT ngoài TĐ', lines: ['Tỷ trọng', 'DT ngoài TĐ'], thCurrent: 67.0, khNext: 67.6, diff: '-0,6 đ.%', isDiffPositive: false, unit: '%' },
      { id: 'global_ratio', name: 'Tỷ trọng DT quốc tế', lines: ['Tỷ trọng', 'DT quốc tế'], thCurrent: 10.0, khNext: 10.4, diff: '-0,4 đ.%', isDiffPositive: false, unit: '%' }
    ]
  },
  'Tháng 3': {
    values: [
      { id: 'total', name: 'Tổng doanh thu', lines: ['Tổng doanh thu'], thCurrent: 412.5, khNext: 375.0, rate: '110,0%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'internal', name: 'DT nội bộ', lines: ['DT nội bộ'], thCurrent: 135.0, khNext: 120.0, rate: '112,5%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'external', name: 'DT ngoài Tập đoàn', lines: ['DT ngoài', 'Tập đoàn'], thCurrent: 277.5, khNext: 255.0, rate: '108,8%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'global', name: 'DT quốc tế', lines: ['DT quốc tế'], thCurrent: 42.8, khNext: 40.0, rate: '107,0%', isRatePositive: true, unit: 'Triệu đồng' }
    ],
    ratios: [
      { id: 'external_ratio', name: 'Tỷ trọng DT ngoài TĐ', lines: ['Tỷ trọng', 'DT ngoài TĐ'], thCurrent: 67.3, khNext: 68.0, diff: '-0,7 đ.%', isDiffPositive: false, unit: '%' },
      { id: 'global_ratio', name: 'Tỷ trọng DT quốc tế', lines: ['Tỷ trọng', 'DT quốc tế'], thCurrent: 10.4, khNext: 10.7, diff: '-0,3 đ.%', isDiffPositive: false, unit: '%' }
    ]
  },
  'Tháng 4': {
    values: [
      { id: 'total', name: 'Tổng doanh thu', lines: ['Tổng doanh thu'], thCurrent: 362.8, khNext: 385.0, rate: '94,2%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'internal', name: 'DT nội bộ', lines: ['DT nội bộ'], thCurrent: 118.5, khNext: 120.0, rate: '98,8%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'external', name: 'DT ngoài Tập đoàn', lines: ['DT ngoài', 'Tập đoàn'], thCurrent: 244.3, khNext: 265.0, rate: '92,2%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'global', name: 'DT quốc tế', lines: ['DT quốc tế'], thCurrent: 36.2, khNext: 42.0, rate: '86,2%', isRatePositive: false, unit: 'Triệu đồng' }
    ],
    ratios: [
      { id: 'external_ratio', name: 'Tỷ trọng DT ngoài TĐ', lines: ['Tỷ trọng', 'DT ngoài TĐ'], thCurrent: 67.3, khNext: 68.8, diff: '-1,5 đ.%', isDiffPositive: false, unit: '%' },
      { id: 'global_ratio', name: 'Tỷ trọng DT quốc tế', lines: ['Tỷ trọng', 'DT quốc tế'], thCurrent: 10.0, khNext: 10.9, diff: '-0,9 đ.%', isDiffPositive: false, unit: '%' }
    ]
  },
  'Tháng 5': {
    values: [
      { id: 'total', name: 'Tổng doanh thu', lines: ['Tổng doanh thu'], thCurrent: 378.6, khNext: 425.0, rate: '89,1%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'internal', name: 'DT nội bộ', lines: ['DT nội bộ'], thCurrent: 122.4, khNext: 135.0, rate: '90,7%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'external', name: 'DT ngoài Tập đoàn', lines: ['DT ngoài', 'Tập đoàn'], thCurrent: 256.2, khNext: 290.0, rate: '88,3%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'global', name: 'DT quốc tế', lines: ['DT quốc tế'], thCurrent: 38.0, khNext: 44.0, rate: '86,4%', isRatePositive: false, unit: 'Triệu đồng' }
    ],
    ratios: [
      { id: 'external_ratio', name: 'Tỷ trọng DT ngoài TĐ', lines: ['Tỷ trọng', 'DT ngoài TĐ'], thCurrent: 67.7, khNext: 68.2, diff: '-0,5 đ.%', isDiffPositive: false, unit: '%' },
      { id: 'global_ratio', name: 'Tỷ trọng DT quốc tế', lines: ['Tỷ trọng', 'DT quốc tế'], thCurrent: 10.0, khNext: 10.4, diff: '-0,4 đ.%', isDiffPositive: false, unit: '%' }
    ]
  },
  'Tháng 6': {
    values: [
      { id: 'total', name: 'Tổng doanh thu', lines: ['Tổng doanh thu'], thCurrent: 438.2, khNext: 405.0, rate: '108,2%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'internal', name: 'DT nội bộ', lines: ['DT nội bộ'], thCurrent: 140.5, khNext: 125.0, rate: '112,4%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'external', name: 'DT ngoài Tập đoàn', lines: ['DT ngoài', 'Tập đoàn'], thCurrent: 297.7, khNext: 280.0, rate: '106,3%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'global', name: 'DT quốc tế', lines: ['DT quốc tế'], thCurrent: 46.5, khNext: 45.0, rate: '103,3%', isRatePositive: true, unit: 'Triệu đồng' }
    ],
    ratios: [
      { id: 'external_ratio', name: 'Tỷ trọng DT ngoài TĐ', lines: ['Tỷ trọng', 'DT ngoài TĐ'], thCurrent: 67.9, khNext: 69.1, diff: '-1,2 đ.%', isDiffPositive: false, unit: '%' },
      { id: 'global_ratio', name: 'Tỷ trọng DT quốc tế', lines: ['Tỷ trọng', 'DT quốc tế'], thCurrent: 10.6, khNext: 11.1, diff: '-0,5 đ.%', isDiffPositive: false, unit: '%' }
    ]
  },
  'Tháng 7': {
    values: [
      { id: 'total', name: 'Tổng doanh thu', lines: ['Tổng doanh thu'], thCurrent: 395.2, khNext: 414.0, rate: '95,5%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'internal', name: 'DT nội bộ', lines: ['DT nội bộ'], thCurrent: 128.0, khNext: 124.2, rate: '103,1%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'external', name: 'DT ngoài Tập đoàn', lines: ['DT ngoài', 'Tập đoàn'], thCurrent: 267.2, khNext: 289.8, rate: '92,2%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'global', name: 'DT quốc tế', lines: ['DT quốc tế'], thCurrent: 40.5, khNext: 49.7, rate: '81,5%', isRatePositive: false, unit: 'Triệu đồng' }
    ],
    ratios: [
      { id: 'external_ratio', name: 'Tỷ trọng DT ngoài TĐ', lines: ['Tỷ trọng', 'DT ngoài TĐ'], thCurrent: 67.6, khNext: 70.0, diff: '-2,4 đ.%', isDiffPositive: false, unit: '%' },
      { id: 'global_ratio', name: 'Tỷ trọng DT quốc tế', lines: ['Tỷ trọng', 'DT quốc tế'], thCurrent: 10.2, khNext: 12.0, diff: '-1,8 đ.%', isDiffPositive: false, unit: '%' }
    ]
  },
  'Tháng 8': {
    values: [
      { id: 'total', name: 'Tổng doanh thu', lines: ['Tổng doanh thu'], thCurrent: 389.9, khNext: 426.4, rate: '91,4%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'internal', name: 'DT nội bộ', lines: ['DT nội bộ'], thCurrent: 127.2, khNext: 127.9, rate: '99,5%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'external', name: 'DT ngoài Tập đoàn', lines: ['DT ngoài', 'Tập đoàn'], thCurrent: 262.7, khNext: 298.5, rate: '88,0%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'global', name: 'DT quốc tế', lines: ['DT quốc tế'], thCurrent: 39.7, khNext: 51.2, rate: '77,5%', isRatePositive: false, unit: 'Triệu đồng' }
    ],
    ratios: [
      { id: 'external_ratio', name: 'Tỷ trọng DT ngoài TĐ', lines: ['Tỷ trọng', 'DT ngoài TĐ'], thCurrent: 67.4, khNext: 70.0, diff: '-2,6 đ.%', isDiffPositive: false, unit: '%' },
      { id: 'global_ratio', name: 'Tỷ trọng DT quốc tế', lines: ['Tỷ trọng', 'DT quốc tế'], thCurrent: 10.2, khNext: 12.0, diff: '-1,8 đ.%', isDiffPositive: false, unit: '%' }
    ]
  },
  'Tháng 9': {
    values: [
      { id: 'total', name: 'Tổng doanh thu', lines: ['Tổng doanh thu'], thCurrent: 442.8, khNext: 420.0, rate: '105,4%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'internal', name: 'DT nội bộ', lines: ['DT nội bộ'], thCurrent: 142.0, khNext: 132.0, rate: '107,6%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'external', name: 'DT ngoài Tập đoàn', lines: ['DT ngoài', 'Tập đoàn'], thCurrent: 300.8, khNext: 288.0, rate: '104,4%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'global', name: 'DT quốc tế', lines: ['DT quốc tế'], thCurrent: 47.2, khNext: 47.0, rate: '100,4%', isRatePositive: true, unit: 'Triệu đồng' }
    ],
    ratios: [
      { id: 'external_ratio', name: 'Tỷ trọng DT ngoài TĐ', lines: ['Tỷ trọng', 'DT ngoài TĐ'], thCurrent: 67.9, khNext: 68.6, diff: '-0,7 đ.%', isDiffPositive: false, unit: '%' },
      { id: 'global_ratio', name: 'Tỷ trọng DT quốc tế', lines: ['Tỷ trọng', 'DT quốc tế'], thCurrent: 10.7, khNext: 11.2, diff: '-0,5 đ.%', isDiffPositive: false, unit: '%' }
    ]
  },
  'Tháng 10': {
    values: [
      { id: 'total', name: 'Tổng doanh thu', lines: ['Tổng doanh thu'], thCurrent: 415.6, khNext: 450.0, rate: '92,4%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'internal', name: 'DT nội bộ', lines: ['DT nội bộ'], thCurrent: 134.2, khNext: 142.0, rate: '94,5%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'external', name: 'DT ngoài Tập đoàn', lines: ['DT ngoài', 'Tập đoàn'], thCurrent: 281.4, khNext: 308.0, rate: '91,4%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'global', name: 'DT quốc tế', lines: ['DT quốc tế'], thCurrent: 43.5, khNext: 48.0, rate: '90,6%', isRatePositive: false, unit: 'Triệu đồng' }
    ],
    ratios: [
      { id: 'external_ratio', name: 'Tỷ trọng DT ngoài TĐ', lines: ['Tỷ trọng', 'DT ngoài TĐ'], thCurrent: 67.7, khNext: 68.4, diff: '-0,7 đ.%', isDiffPositive: false, unit: '%' },
      { id: 'global_ratio', name: 'Tỷ trọng DT quốc tế', lines: ['Tỷ trọng', 'DT quốc tế'], thCurrent: 10.5, khNext: 10.7, diff: '-0,2 đ.%', isDiffPositive: false, unit: '%' }
    ]
  },
  'Tháng 11': {
    values: [
      { id: 'total', name: 'Tổng doanh thu', lines: ['Tổng doanh thu'], thCurrent: null, khNext: 480.0, rate: '-', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'internal', name: 'DT nội bộ', lines: ['DT nội bộ'], thCurrent: null, khNext: 150.0, rate: '-', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'external', name: 'DT ngoài Tập đoàn', lines: ['DT ngoài', 'Tập đoàn'], thCurrent: null, khNext: 330.0, rate: '-', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'global', name: 'DT quốc tế', lines: ['DT quốc tế'], thCurrent: null, khNext: 51.0, rate: '-', isRatePositive: false, unit: 'Triệu đồng' }
    ],
    ratios: [
      { id: 'external_ratio', name: 'Tỷ trọng DT ngoài TĐ', lines: ['Tỷ trọng', 'DT ngoài TĐ'], thCurrent: null, khNext: 68.8, diff: '-', isDiffPositive: false, unit: '%' },
      { id: 'global_ratio', name: 'Tỷ trọng DT quốc tế', lines: ['Tỷ trọng', 'DT quốc tế'], thCurrent: null, khNext: 10.6, diff: '-', isDiffPositive: false, unit: '%' }
    ]
  },
  'Tháng 12': {
    isBlank: true,
    values: [
      { id: 'total', name: 'Tổng doanh thu', lines: ['Tổng doanh thu'], thCurrent: 0, khNext: 0, rate: '-', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'internal', name: 'DT nội bộ', lines: ['DT nội bộ'], thCurrent: 0, khNext: 0, rate: '-', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'external', name: 'DT ngoài Tập đoàn', lines: ['DT ngoài', 'Tập đoàn'], thCurrent: 0, khNext: 0, rate: '-', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'global', name: 'DT quốc tế', lines: ['DT quốc tế'], thCurrent: 0, khNext: 0, rate: '-', isRatePositive: false, unit: 'Triệu đồng' }
    ],
    ratios: [
      { id: 'external_ratio', name: 'Tỷ trọng DT ngoài TĐ', lines: ['Tỷ trọng', 'DT ngoài TĐ'], thCurrent: 0, khNext: 0, diff: '-', isDiffPositive: false, unit: '%' },
      { id: 'global_ratio', name: 'Tỷ trọng DT quốc tế', lines: ['Tỷ trọng', 'DT quốc tế'], thCurrent: 0, khNext: 0, diff: '-', isDiffPositive: false, unit: '%' }
    ]
  }
};


