// Data definitions for QuarterComparisonChart (Phân tích theo quý)
// Excludes Lợi nhuận trước thuế and Tỷ suất LNTT

export const QUARTER_OPTIONS = ['Quý I', 'Quý II', 'Quý III', 'Quý IV'];

export const QUARTER_CUMULATIVE_DATA = {
  'Quý I': {
    period: 'T1-T3',
    quarterCode: 'Q1',
    values: [
      { id: 'total', name: 'Tổng doanh thu', lines: ['Tổng doanh thu'], lk: 1026.1, kh: 1050.0, rate: '97,7%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'internal', name: 'DT nội bộ', lines: ['DT nội bộ'], lk: 335.5, kh: 329.0, rate: '102,0%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'external', name: 'DT ngoài Tập đoàn', lines: ['DT ngoài', 'Tập đoàn'], lk: 690.6, kh: 721.0, rate: '95,8%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'global', name: 'DT quốc tế', lines: ['DT quốc tế'], lk: 105.1, kh: 114.0, rate: '92,2%', isRatePositive: false, unit: 'Triệu đồng' }
    ],
    ratios: [
      { id: 'external_ratio', name: 'Tỷ trọng DT ngoài TĐ', lines: ['Tỷ trọng', 'DT ngoài TĐ'], lk: 67.3, kh: 68.7, diff: '-1,4 đ.%', isDiffPositive: false, unit: '%' },
      { id: 'global_ratio', name: 'Tỷ trọng DT quốc tế', lines: ['Tỷ trọng', 'DT quốc tế'], lk: 10.2, kh: 10.9, diff: '-0,7 đ.%', isDiffPositive: false, unit: '%' }
    ]
  },
  'Quý II': {
    period: 'T4-T6',
    quarterCode: 'Q2',
    values: [
      { id: 'total', name: 'Tổng doanh thu', lines: ['Tổng doanh thu'], lk: 1179.6, kh: 1185.0, rate: '99,5%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'internal', name: 'DT nội bộ', lines: ['DT nội bộ'], lk: 381.4, kh: 375.0, rate: '101,7%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'external', name: 'DT ngoài Tập đoàn', lines: ['DT ngoài', 'Tập đoàn'], lk: 798.2, kh: 810.0, rate: '98,5%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'global', name: 'DT quốc tế', lines: ['DT quốc tế'], lk: 120.7, kh: 126.0, rate: '95,8%', isRatePositive: false, unit: 'Triệu đồng' }
    ],
    ratios: [
      { id: 'external_ratio', name: 'Tỷ trọng DT ngoài TĐ', lines: ['Tỷ trọng', 'DT ngoài TĐ'], lk: 67.7, kh: 68.4, diff: '-0,7 đ.%', isDiffPositive: false, unit: '%' },
      { id: 'global_ratio', name: 'Tỷ trọng DT quốc tế', lines: ['Tỷ trọng', 'DT quốc tế'], lk: 10.2, kh: 10.6, diff: '-0,4 đ.%', isDiffPositive: false, unit: '%' }
    ]
  },
  'Quý III': {
    period: 'T7-T8',
    quarterCode: 'Q3',
    values: [
      { id: 'total', name: 'Tổng doanh thu', lines: ['Tổng doanh thu'], lk: 775.0, kh: 1246.0, rate: '62,2%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'internal', name: 'DT nội bộ', lines: ['DT nội bộ'], lk: 250.0, kh: 373.8, rate: '66,9%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'external', name: 'DT ngoài Tập đoàn', lines: ['DT ngoài', 'Tập đoàn'], lk: 525.0, kh: 872.2, rate: '60,2%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'global', name: 'DT quốc tế', lines: ['DT quốc tế'], lk: 81.9, kh: 149.6, rate: '54,7%', isRatePositive: false, unit: 'Triệu đồng' }
    ],
    ratios: [
      { id: 'external_ratio', name: 'Tỷ trọng DT ngoài TĐ', lines: ['Tỷ trọng', 'DT ngoài TĐ'], lk: 67.7, kh: 70.0, diff: '-2,3 đ.%', isDiffPositive: false, unit: '%' },
      { id: 'global_ratio', name: 'Tỷ trọng DT quốc tế', lines: ['Tỷ trọng', 'DT quốc tế'], lk: 10.6, kh: 12.0, diff: '-1,4 đ.%', isDiffPositive: false, unit: '%' }
    ]
  },
  'Quý IV': {
    period: 'T10-T11',
    quarterCode: 'Q4',
    values: [
      { id: 'total', name: 'Tổng doanh thu', lines: ['Tổng doanh thu'], lk: 884.1, kh: 1350.0, rate: '65,5%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'internal', name: 'DT nội bộ', lines: ['DT nội bộ'], lk: 284.4, kh: 424.0, rate: '67,1%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'external', name: 'DT ngoài Tập đoàn', lines: ['DT ngoài', 'Tập đoàn'], lk: 599.7, kh: 926.0, rate: '64,8%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'global', name: 'DT quốc tế', lines: ['DT quốc tế'], lk: 94.1, kh: 146.0, rate: '64,5%', isRatePositive: false, unit: 'Triệu đồng' }
    ],
    ratios: [
      { id: 'external_ratio', name: 'Tỷ trọng DT ngoài TĐ', lines: ['Tỷ trọng', 'DT ngoài TĐ'], lk: 67.8, kh: 68.6, diff: '-0,8 đ.%', isDiffPositive: false, unit: '%' },
      { id: 'global_ratio', name: 'Tỷ trọng DT quốc tế', lines: ['Tỷ trọng', 'DT quốc tế'], lk: 10.6, kh: 10.8, diff: '-0,2 đ.%', isDiffPositive: false, unit: '%' }
    ]
  }
};

// Data definitions for Biểu đồ 6. Ước kết quả Quý so với kế hoạch Quý
// Excludes Lợi nhuận trước thuế and Tỷ suất LNTT
export const QUARTER_ESTIMATE_DATA = {
  'Quý I': {
    period: 'T1-T3',
    quarterCode: 'Q1',
    values: [
      { id: 'total', name: 'Tổng doanh thu', lines: ['Tổng doanh thu'], uoc: 1026.1, kh: 1050.0, rate: '97,7%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'internal', name: 'DT nội bộ', lines: ['DT nội bộ'], uoc: 335.5, kh: 329.0, rate: '102,0%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'external', name: 'DT ngoài Tập đoàn', lines: ['DT ngoài', 'Tập đoàn'], uoc: 690.6, kh: 721.0, rate: '95,8%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'global', name: 'DT quốc tế', lines: ['DT quốc tế'], uoc: 105.1, kh: 114.0, rate: '92,2%', isRatePositive: false, unit: 'Triệu đồng' }
    ],
    ratios: [
      { id: 'external_ratio', name: 'Tỷ trọng DT ngoài TĐ', lines: ['Tỷ trọng', 'DT ngoài TĐ'], uoc: 67.3, kh: 68.7, diff: '-1,4 đ.%', isDiffPositive: false, unit: '%' },
      { id: 'global_ratio', name: 'Tỷ trọng DT quốc tế', lines: ['Tỷ trọng', 'DT quốc tế'], uoc: 10.2, kh: 10.9, diff: '-0,7 đ.%', isDiffPositive: false, unit: '%' }
    ]
  },
  'Quý II': {
    period: 'T4-T6',
    quarterCode: 'Q2',
    values: [
      { id: 'total', name: 'Tổng doanh thu', lines: ['Tổng doanh thu'], uoc: 1179.6, kh: 1185.0, rate: '99,5%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'internal', name: 'DT nội bộ', lines: ['DT nội bộ'], uoc: 381.4, kh: 375.0, rate: '101,7%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'external', name: 'DT ngoài Tập đoàn', lines: ['DT ngoài', 'Tập đoàn'], uoc: 798.2, kh: 810.0, rate: '98,5%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'global', name: 'DT quốc tế', lines: ['DT quốc tế'], uoc: 120.7, kh: 126.0, rate: '95,8%', isRatePositive: false, unit: 'Triệu đồng' }
    ],
    ratios: [
      { id: 'external_ratio', name: 'Tỷ trọng DT ngoài TĐ', lines: ['Tỷ trọng', 'DT ngoài TĐ'], uoc: 67.7, kh: 68.4, diff: '-0,7 đ.%', isDiffPositive: false, unit: '%' },
      { id: 'global_ratio', name: 'Tỷ trọng DT quốc tế', lines: ['Tỷ trọng', 'DT quốc tế'], uoc: 10.2, kh: 10.6, diff: '-0,4 đ.%', isDiffPositive: false, unit: '%' }
    ]
  },
  'Quý III': {
    period: 'T7-T8',
    quarterCode: 'Q3',
    values: [
      { id: 'total', name: 'Tổng doanh thu', lines: ['Tổng doanh thu'], uoc: 1162.5, kh: 1246.0, rate: '93,3%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'internal', name: 'DT nội bộ', lines: ['DT nội bộ'], uoc: 375.0, kh: 373.8, rate: '100,3%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'external', name: 'DT ngoài Tập đoàn', lines: ['DT ngoài', 'Tập đoàn'], uoc: 787.5, kh: 872.2, rate: '90,3%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'global', name: 'DT quốc tế', lines: ['DT quốc tế'], uoc: 122.9, kh: 149.6, rate: '82,1%', isRatePositive: false, unit: 'Triệu đồng' }
    ],
    ratios: [
      { id: 'external_ratio', name: 'Tỷ trọng DT ngoài TĐ', lines: ['Tỷ trọng', 'DT ngoài TĐ'], uoc: 67.7, kh: 70.0, diff: '-2,3 đ.%', isDiffPositive: false, unit: '%' },
      { id: 'global_ratio', name: 'Tỷ trọng DT quốc tế', lines: ['Tỷ trọng', 'DT quốc tế'], uoc: 10.6, kh: 12.0, diff: '-1,4 đ.%', isDiffPositive: false, unit: '%' }
    ]
  },
  'Quý IV': {
    period: 'T10-T11',
    quarterCode: 'Q4',
    values: [
      { id: 'total', name: 'Tổng doanh thu', lines: ['Tổng doanh thu'], uoc: 1326.2, kh: 1350.0, rate: '98,2%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'internal', name: 'DT nội bộ', lines: ['DT nội bộ'], uoc: 426.6, kh: 424.0, rate: '100,6%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'external', name: 'DT ngoài Tập đoàn', lines: ['DT ngoài', 'Tập đoàn'], uoc: 899.6, kh: 926.0, rate: '97,1%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'global', name: 'DT quốc tế', lines: ['DT quốc tế'], uoc: 141.2, kh: 146.0, rate: '96,7%', isRatePositive: false, unit: 'Triệu đồng' }
    ],
    ratios: [
      { id: 'external_ratio', name: 'Tỷ trọng DT ngoài TĐ', lines: ['Tỷ trọng', 'DT ngoài TĐ'], uoc: 67.8, kh: 68.6, diff: '-0,8 đ.%', isDiffPositive: false, unit: '%' },
      { id: 'global_ratio', name: 'Tỷ trọng DT quốc tế', lines: ['Tỷ trọng', 'DT quốc tế'], uoc: 10.6, kh: 10.8, diff: '-0,2 đ.%', isDiffPositive: false, unit: '%' }
    ]
  }
};

// Data definitions for Biểu đồ 7. Ước kết quả Quý so với kết quả Quý trước
// Excludes Lợi nhuận trước thuế and Tỷ suất LNTT
export const QUARTER_PREV_DATA = {
  'Quý I': {
    quarterCode: 'Q1',
    prevQuarterCode: 'Q4',
    prevQuarterName: 'Quý IV',
    values: [
      { id: 'total', name: 'Tổng doanh thu', lines: ['Tổng doanh thu'], uoc: 1026.1, thPrev: 1060.0, rate: '96,8%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'internal', name: 'DT nội bộ', lines: ['DT nội bộ'], uoc: 335.5, thPrev: 345.0, rate: '97,2%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'external', name: 'DT ngoài Tập đoàn', lines: ['DT ngoài', 'Tập đoàn'], uoc: 690.6, thPrev: 715.0, rate: '96,6%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'global', name: 'DT quốc tế', lines: ['DT quốc tế'], uoc: 105.1, thPrev: 108.5, rate: '96,9%', isRatePositive: false, unit: 'Triệu đồng' }
    ],
    ratios: [
      { id: 'external_ratio', name: 'Tỷ trọng DT ngoài TĐ', lines: ['Tỷ trọng', 'DT ngoài TĐ'], uoc: 67.3, thPrev: 67.5, diff: '-0,2 đ.%', isDiffPositive: false, unit: '%' },
      { id: 'global_ratio', name: 'Tỷ trọng DT quốc tế', lines: ['Tỷ trọng', 'DT quốc tế'], uoc: 10.2, thPrev: 10.2, diff: '+0,0 đ.%', isDiffPositive: true, unit: '%' }
    ]
  },
  'Quý II': {
    quarterCode: 'Q2',
    prevQuarterCode: 'Q1',
    prevQuarterName: 'Quý I',
    values: [
      { id: 'total', name: 'Tổng doanh thu', lines: ['Tổng doanh thu'], uoc: 1179.6, thPrev: 1026.1, rate: '115,0%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'internal', name: 'DT nội bộ', lines: ['DT nội bộ'], uoc: 381.4, thPrev: 335.5, rate: '113,7%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'external', name: 'DT ngoài Tập đoàn', lines: ['DT ngoài', 'Tập đoàn'], uoc: 798.2, thPrev: 690.6, rate: '115,6%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'global', name: 'DT quốc tế', lines: ['DT quốc tế'], uoc: 120.7, thPrev: 105.1, rate: '114,8%', isRatePositive: true, unit: 'Triệu đồng' }
    ],
    ratios: [
      { id: 'external_ratio', name: 'Tỷ trọng DT ngoài TĐ', lines: ['Tỷ trọng', 'DT ngoài TĐ'], uoc: 67.7, thPrev: 67.3, diff: '+0,4 đ.%', isDiffPositive: true, unit: '%' },
      { id: 'global_ratio', name: 'Tỷ trọng DT quốc tế', lines: ['Tỷ trọng', 'DT quốc tế'], uoc: 10.2, thPrev: 10.2, diff: '+0,0 đ.%', isDiffPositive: true, unit: '%' }
    ]
  },
  'Quý III': {
    quarterCode: 'Q3',
    prevQuarterCode: 'Q2',
    prevQuarterName: 'Quý II',
    values: [
      { id: 'total', name: 'Tổng doanh thu', lines: ['Tổng doanh thu'], uoc: 1162.5, thPrev: 1210.4, rate: '96,0%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'internal', name: 'DT nội bộ', lines: ['DT nội bộ'], uoc: 375.0, thPrev: 387.2, rate: '96,8%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'external', name: 'DT ngoài Tập đoàn', lines: ['DT ngoài', 'Tập đoàn'], uoc: 787.5, thPrev: 823.2, rate: '95,7%', isRatePositive: false, unit: 'Triệu đồng' },
      { id: 'global', name: 'DT quốc tế', lines: ['DT quốc tế'], uoc: 122.9, thPrev: 127.9, rate: '96,1%', isRatePositive: false, unit: 'Triệu đồng' }
    ],
    ratios: [
      { id: 'external_ratio', name: 'Tỷ trọng DT ngoài TĐ', lines: ['Tỷ trọng', 'DT ngoài TĐ'], uoc: 67.7, thPrev: 68.0, diff: '-0,3 đ.%', isDiffPositive: false, unit: '%' },
      { id: 'global_ratio', name: 'Tỷ trọng DT quốc tế', lines: ['Tỷ trọng', 'DT quốc tế'], uoc: 10.6, thPrev: 10.6, diff: '+0,0 đ.%', isDiffPositive: true, unit: '%' }
    ]
  },
  'Quý IV': {
    quarterCode: 'Q4',
    prevQuarterCode: 'Q3',
    prevQuarterName: 'Quý III',
    values: [
      { id: 'total', name: 'Tổng doanh thu', lines: ['Tổng doanh thu'], uoc: 1326.2, thPrev: 1210.4, rate: '109,6%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'internal', name: 'DT nội bộ', lines: ['DT nội bộ'], uoc: 426.6, thPrev: 387.2, rate: '110,2%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'external', name: 'DT ngoài Tập đoàn', lines: ['DT ngoài', 'Tập đoàn'], uoc: 899.6, thPrev: 823.2, rate: '109,3%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'global', name: 'DT quốc tế', lines: ['DT quốc tế'], uoc: 141.2, thPrev: 127.9, rate: '110,4%', isRatePositive: true, unit: 'Triệu đồng' }
    ],
    ratios: [
      { id: 'external_ratio', name: 'Tỷ trọng DT ngoài TĐ', lines: ['Tỷ trọng', 'DT ngoài TĐ'], uoc: 67.8, thPrev: 68.0, diff: '-0,2 đ.%', isDiffPositive: false, unit: '%' },
      { id: 'global_ratio', name: 'Tỷ trọng DT quốc tế', lines: ['Tỷ trọng', 'DT quốc tế'], uoc: 10.6, thPrev: 10.6, diff: '+0,0 đ.%', isDiffPositive: true, unit: '%' }
    ]
  }
};

// Data definitions for Biểu đồ 8. Ước kết quả Quý so với cùng kỳ năm trước
export const QUARTER_SAME_PERIOD_DATA = {
  'Quý I': {
    quarterCode: 'Q1',
    values: [
      { id: 'total', name: 'Tổng doanh thu', lines: ['Tổng doanh thu'], uoc: 1026.1, thSamePeriod: 945.8, rate: '108,5%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'internal', name: 'DT nội bộ', lines: ['DT nội bộ'], uoc: 335.5, thSamePeriod: 320.0, rate: '104,8%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'external', name: 'DT ngoài Tập đoàn', lines: ['DT ngoài', 'Tập đoàn'], uoc: 690.6, thSamePeriod: 625.8, rate: '110,4%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'global', name: 'DT quốc tế', lines: ['DT quốc tế'], uoc: 105.1, thSamePeriod: 78.4, rate: '134,1%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'lntt', name: 'Lợi nhuận trước thuế', lines: ['Lợi nhuận', 'trước thuế'], uoc: 95.4, thSamePeriod: 91.2, rate: '104,6%', isRatePositive: true, unit: 'Triệu đồng' }
    ],
    ratios: [
      { id: 'lntt_ratio', name: 'Tỷ suất LNTT/Tổng DT', lines: ['Tỷ suất', 'LNTT/Tổng DT'], uoc: 9.3, thSamePeriod: 9.6, diff: '-0,3 đ.%', isDiffPositive: false, unit: '%' },
      { id: 'external_ratio', name: 'Tỷ trọng DT ngoài TĐ', lines: ['Tỷ trọng', 'DT ngoài TĐ'], uoc: 67.3, thSamePeriod: 66.2, diff: '+1,1 đ.%', isDiffPositive: true, unit: '%' },
      { id: 'global_ratio', name: 'Tỷ trọng DT quốc tế', lines: ['Tỷ trọng', 'DT quốc tế'], uoc: 10.2, thSamePeriod: 8.3, diff: '+1,9 đ.%', isDiffPositive: true, unit: '%' }
    ]
  },
  'Quý II': {
    quarterCode: 'Q2',
    values: [
      { id: 'total', name: 'Tổng doanh thu', lines: ['Tổng doanh thu'], uoc: 1179.6, thSamePeriod: 1065.0, rate: '110,8%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'internal', name: 'DT nội bộ', lines: ['DT nội bộ'], uoc: 381.4, thSamePeriod: 360.5, rate: '105,8%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'external', name: 'DT ngoài Tập đoàn', lines: ['DT ngoài', 'Tập đoàn'], uoc: 798.2, thSamePeriod: 704.5, rate: '113,3%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'global', name: 'DT quốc tế', lines: ['DT quốc tế'], uoc: 120.7, thSamePeriod: 88.0, rate: '137,2%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'lntt', name: 'Lợi nhuận trước thuế', lines: ['Lợi nhuận', 'trước thuế'], uoc: 110.2, thSamePeriod: 102.5, rate: '107,5%', isRatePositive: true, unit: 'Triệu đồng' }
    ],
    ratios: [
      { id: 'lntt_ratio', name: 'Tỷ suất LNTT/Tổng DT', lines: ['Tỷ suất', 'LNTT/Tổng DT'], uoc: 9.3, thSamePeriod: 9.6, diff: '-0,3 đ.%', isDiffPositive: false, unit: '%' },
      { id: 'external_ratio', name: 'Tỷ trọng DT ngoài TĐ', lines: ['Tỷ trọng', 'DT ngoài TĐ'], uoc: 67.7, thSamePeriod: 66.2, diff: '+1,5 đ.%', isDiffPositive: true, unit: '%' },
      { id: 'global_ratio', name: 'Tỷ trọng DT quốc tế', lines: ['Tỷ trọng', 'DT quốc tế'], uoc: 10.2, thSamePeriod: 8.3, diff: '+1,9 đ.%', isDiffPositive: true, unit: '%' }
    ]
  },
  'Quý III': {
    quarterCode: 'Q3',
    values: [
      { id: 'total', name: 'Tổng doanh thu', lines: ['Tổng doanh thu'], uoc: 1162.5, thSamePeriod: 1079.5, rate: '107,7%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'internal', name: 'DT nội bộ', lines: ['DT nội bộ'], uoc: 375.0, thSamePeriod: 372.4, rate: '100,7%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'external', name: 'DT ngoài Tập đoàn', lines: ['DT ngoài', 'Tập đoàn'], uoc: 787.5, thSamePeriod: 707.1, rate: '111,4%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'global', name: 'DT quốc tế', lines: ['DT quốc tế'], uoc: 122.9, thSamePeriod: 85.7, rate: '143,3%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'lntt', name: 'Lợi nhuận trước thuế', lines: ['Lợi nhuận', 'trước thuế'], uoc: 108.1, thSamePeriod: 103.8, rate: '104,2%', isRatePositive: true, unit: 'Triệu đồng' }
    ],
    ratios: [
      { id: 'lntt_ratio', name: 'Tỷ suất LNTT/Tổng DT', lines: ['Tỷ suất', 'LNTT/Tổng DT'], uoc: 9.3, thSamePeriod: 9.6, diff: '-0,3 đ.%', isDiffPositive: false, unit: '%' },
      { id: 'external_ratio', name: 'Tỷ trọng DT ngoài TĐ', lines: ['Tỷ trọng', 'DT ngoài TĐ'], uoc: 67.7, thSamePeriod: 65.5, diff: '+2,2 đ.%', isDiffPositive: true, unit: '%' },
      { id: 'global_ratio', name: 'Tỷ trọng DT quốc tế', lines: ['Tỷ trọng', 'DT quốc tế'], uoc: 10.6, thSamePeriod: 7.9, diff: '+2,6 đ.%', isDiffPositive: true, unit: '%' }
    ]
  },
  'Quý IV': {
    quarterCode: 'Q4',
    values: [
      { id: 'total', name: 'Tổng doanh thu', lines: ['Tổng doanh thu'], uoc: 1326.2, thSamePeriod: 1215.0, rate: '109,2%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'internal', name: 'DT nội bộ', lines: ['DT nội bộ'], uoc: 426.6, thSamePeriod: 405.0, rate: '105,3%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'external', name: 'DT ngoài Tập đoàn', lines: ['DT ngoài', 'Tập đoàn'], uoc: 899.6, thSamePeriod: 810.0, rate: '111,1%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'global', name: 'DT quốc tế', lines: ['DT quốc tế'], uoc: 141.2, thSamePeriod: 102.5, rate: '137,8%', isRatePositive: true, unit: 'Triệu đồng' },
      { id: 'lntt', name: 'Lợi nhuận trước thuế', lines: ['Lợi nhuận', 'trước thuế'], uoc: 125.0, thSamePeriod: 118.0, rate: '105,9%', isRatePositive: true, unit: 'Triệu đồng' }
    ],
    ratios: [
      { id: 'lntt_ratio', name: 'Tỷ suất LNTT/Tổng DT', lines: ['Tỷ suất', 'LNTT/Tổng DT'], uoc: 9.4, thSamePeriod: 9.7, diff: '-0,3 đ.%', isDiffPositive: false, unit: '%' },
      { id: 'external_ratio', name: 'Tỷ trọng DT ngoài TĐ', lines: ['Tỷ trọng', 'DT ngoài TĐ'], uoc: 67.8, thSamePeriod: 66.7, diff: '+1,1 đ.%', isDiffPositive: true, unit: '%' },
      { id: 'global_ratio', name: 'Tỷ trọng DT quốc tế', lines: ['Tỷ trọng', 'DT quốc tế'], uoc: 10.6, thSamePeriod: 8.4, diff: '+2,2 đ.%', isDiffPositive: true, unit: '%' }
    ]
  }
};
