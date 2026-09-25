// Data definitions for Biểu đồ 25 – 26 (Cơ cấu doanh thu nội bộ và doanh thu ngoài Tập đoàn: thực hiện và kế hoạch)
// Hàng trên: Biểu đồ 25 (Thực hiện)
// Hàng dưới: Biểu đồ 26 (Kế hoạch)
// 3 Cột: Tháng 8/2026 | Quý III/2026 | Năm 2026

export const INTERNAL_EXTERNAL_CATEGORIES = [
  { id: 'internal', name: 'DT nội bộ', color: '#64748b' },
  { id: 'external', name: 'DT ngoài Tập đoàn', color: '#EE0033' }
];

export const INTERNAL_EXTERNAL_DATA = {
  '2026': {
    // Hàng trên: Biểu đồ 25 (Thực hiện)
    thMonth: {
      title: 'TH – Tháng 8/2026',
      total: 389.9,
      formattedTotal: '389,9',
      unit: 'Triệu đồng',
      slices: [
        { name: 'DT ngoài Tập đoàn', percent: 67.4, formattedPercent: '67,4%', color: '#EE0033', value: 262.8 },
        { name: 'DT nội bộ', percent: 32.6, formattedPercent: '32,6%', color: '#64748b', value: 127.1 }
      ]
    },
    thQuarter: {
      title: 'TH – Quý III/2026 (lũy kế T7–T8)',
      total: 775.0,
      formattedTotal: '775,0',
      unit: 'Triệu đồng',
      slices: [
        { name: 'DT ngoài Tập đoàn', percent: 67.7, formattedPercent: '67,7%', color: '#EE0033', value: 524.7 },
        { name: 'DT nội bộ', percent: 32.3, formattedPercent: '32,3%', color: '#64748b', value: 250.3 }
      ]
    },
    thYear: {
      title: 'TH – Năm 2026 (lũy kế 8T)',
      total: 2976.3,
      formattedTotal: '2.976,3',
      unit: 'Triệu đồng',
      slices: [
        { name: 'DT ngoài Tập đoàn', percent: 68.0, formattedPercent: '68,0%', color: '#EE0033', value: 2023.9 },
        { name: 'DT nội bộ', percent: 32.0, formattedPercent: '32,0%', color: '#64748b', value: 952.4 }
      ]
    },

    // Hàng dưới: Biểu đồ 26 (Kế hoạch)
    khMonth: {
      title: 'KH – Tháng 8/2026',
      total: 414.0,
      formattedTotal: '414,0',
      unit: 'Triệu đồng',
      slices: [
        { name: 'DT ngoài Tập đoàn', percent: 70.0, formattedPercent: '70,0%', color: '#EE0033', value: 289.8 },
        { name: 'DT nội bộ', percent: 30.0, formattedPercent: '30,0%', color: '#64748b', value: 124.2 }
      ]
    },
    khQuarter: {
      title: 'KH – Quý III/2026',
      total: 1246.0,
      formattedTotal: '1.246,0',
      unit: 'Triệu đồng',
      slices: [
        { name: 'DT ngoài Tập đoàn', percent: 70.0, formattedPercent: '70,0%', color: '#EE0033', value: 872.2 },
        { name: 'DT nội bộ', percent: 30.0, formattedPercent: '30,0%', color: '#64748b', value: 373.8 }
      ]
    },
    khYear: {
      title: 'KH – Năm 2026',
      total: 4968.1,
      formattedTotal: '4.968,1',
      unit: 'Triệu đồng',
      slices: [
        { name: 'DT ngoài Tập đoàn', percent: 70.0, formattedPercent: '70,0%', color: '#EE0033', value: 3477.7 },
        { name: 'DT nội bộ', percent: 30.0, formattedPercent: '30,0%', color: '#64748b', value: 1490.4 }
      ]
    }
  },
  '2025': {
    thMonth: {
      title: 'TH – Tháng 8/2025',
      total: 364.4,
      formattedTotal: '364,4',
      unit: 'Triệu đồng',
      slices: [
        { name: 'DT ngoài Tập đoàn', percent: 66.5, formattedPercent: '66,5%', color: '#EE0033', value: 242.3 },
        { name: 'DT nội bộ', percent: 33.5, formattedPercent: '33,5%', color: '#64748b', value: 122.1 }
      ]
    },
    thQuarter: {
      title: 'TH – Quý III/2025 (lũy kế T7–T8)',
      total: 712.9,
      formattedTotal: '712,9',
      unit: 'Triệu đồng',
      slices: [
        { name: 'DT ngoài Tập đoàn', percent: 67.0, formattedPercent: '67,0%', color: '#EE0033', value: 477.6 },
        { name: 'DT nội bộ', percent: 33.0, formattedPercent: '33,0%', color: '#64748b', value: 235.3 }
      ]
    },
    thYear: {
      title: 'TH – Năm 2025 (lũy kế 8T)',
      total: 2674.5,
      formattedTotal: '2.674,5',
      unit: 'Triệu đồng',
      slices: [
        { name: 'DT ngoài Tập đoàn', percent: 67.5, formattedPercent: '67,5%', color: '#EE0033', value: 1805.3 },
        { name: 'DT nội bộ', percent: 32.5, formattedPercent: '32,5%', color: '#64748b', value: 869.2 }
      ]
    },
    khMonth: {
      title: 'KH – Tháng 8/2025',
      total: 380.0,
      formattedTotal: '380,0',
      unit: 'Triệu đồng',
      slices: [
        { name: 'DT ngoài Tập đoàn', percent: 70.0, formattedPercent: '70,0%', color: '#EE0033', value: 266.0 },
        { name: 'DT nội bộ', percent: 30.0, formattedPercent: '30,0%', color: '#64748b', value: 114.0 }
      ]
    },
    khQuarter: {
      title: 'KH – Quý III/2025',
      total: 1150.0,
      formattedTotal: '1.150,0',
      unit: 'Triệu đồng',
      slices: [
        { name: 'DT ngoài Tập đoàn', percent: 70.0, formattedPercent: '70,0%', color: '#EE0033', value: 805.0 },
        { name: 'DT nội bộ', percent: 30.0, formattedPercent: '30,0%', color: '#64748b', value: 345.0 }
      ]
    },
    khYear: {
      title: 'KH – Năm 2025',
      total: 4500.0,
      formattedTotal: '4.500,0',
      unit: 'Triệu đồng',
      slices: [
        { name: 'DT ngoài Tập đoàn', percent: 70.0, formattedPercent: '70,0%', color: '#EE0033', value: 3150.0 },
        { name: 'DT nội bộ', percent: 30.0, formattedPercent: '30,0%', color: '#64748b', value: 1350.0 }
      ]
    }
  }
};

// Data definitions for Biểu đồ 27 – 28 (Cơ cấu doanh thu trong nước và doanh thu quốc tế: thực hiện và kế hoạch)
// Hàng trên: Biểu đồ 27 (Thực hiện)
// Hàng dưới: Biểu đồ 28 (Kế hoạch)
export const DOMESTIC_INTERNATIONAL_CATEGORIES = [
  { id: 'domestic', name: 'DT trong nước', color: '#0284c7' },
  { id: 'international', name: 'DT quốc tế', color: '#ea580c' }
];

export const DOMESTIC_INTERNATIONAL_DATA = {
  '2026': {
    // Biểu đồ 27 (Thực hiện)
    thMonth: {
      title: 'TH – Tháng 8/2026',
      total: 389.9,
      formattedTotal: '389,9',
      unit: 'tỷ đ',
      slices: [
        { name: 'DT trong nước', percent: 89.8, formattedPercent: '89,8%', color: '#0284c7', value: 350.1 },
        { name: 'DT quốc tế', percent: 10.2, formattedPercent: '10,2%', color: '#ea580c', value: 39.8 }
      ]
    },
    thQuarter: {
      title: 'TH – Quý III/2026 (lũy kế T7–T8)',
      total: 775.0,
      formattedTotal: '775,0',
      unit: 'tỷ đ',
      slices: [
        { name: 'DT trong nước', percent: 89.4, formattedPercent: '89,4%', color: '#0284c7', value: 692.9 },
        { name: 'DT quốc tế', percent: 10.6, formattedPercent: '10,6%', color: '#ea580c', value: 82.1 }
      ]
    },
    thYear: {
      title: 'TH – Năm 2026 (lũy kế 8T)',
      total: 2976.3,
      formattedTotal: '2.976,3',
      unit: 'tỷ đ',
      slices: [
        { name: 'DT trong nước', percent: 89.5, formattedPercent: '89,5%', color: '#0284c7', value: 2663.8 },
        { name: 'DT quốc tế', percent: 10.5, formattedPercent: '10,5%', color: '#ea580c', value: 312.5 }
      ]
    },

    // Biểu đồ 28 (Kế hoạch)
    khMonth: {
      title: 'KH – Tháng 8/2026',
      total: 414.0,
      formattedTotal: '414,0',
      unit: 'tỷ đ',
      slices: [
        { name: 'DT trong nước', percent: 88.0, formattedPercent: '88,0%', color: '#0284c7', value: 364.3 },
        { name: 'DT quốc tế', percent: 12.0, formattedPercent: '12,0%', color: '#ea580c', value: 49.7 }
      ]
    },
    khQuarter: {
      title: 'KH – Quý III/2026',
      total: 1246.0,
      formattedTotal: '1.246,0',
      unit: 'tỷ đ',
      slices: [
        { name: 'DT trong nước', percent: 88.0, formattedPercent: '88,0%', color: '#0284c7', value: 1096.5 },
        { name: 'DT quốc tế', percent: 12.0, formattedPercent: '12,0%', color: '#ea580c', value: 149.5 }
      ]
    },
    khYear: {
      title: 'KH – Năm 2026',
      total: 4968.1,
      formattedTotal: '4.968,1',
      unit: 'tỷ đ',
      slices: [
        { name: 'DT trong nước', percent: 88.0, formattedPercent: '88,0%', color: '#0284c7', value: 4371.9 },
        { name: 'DT quốc tế', percent: 12.0, formattedPercent: '12,0%', color: '#ea580c', value: 596.2 }
      ]
    }
  },
  '2025': {
    thMonth: {
      title: 'TH – Tháng 8/2025',
      total: 364.4,
      formattedTotal: '364,4',
      unit: 'tỷ đ',
      slices: [
        { name: 'DT trong nước', percent: 89.0, formattedPercent: '89,0%', color: '#0284c7', value: 324.3 },
        { name: 'DT quốc tế', percent: 11.0, formattedPercent: '11,0%', color: '#ea580c', value: 40.1 }
      ]
    },
    thQuarter: {
      title: 'TH – Quý III/2025 (lũy kế T7–T8)',
      total: 712.9,
      formattedTotal: '712,9',
      unit: 'tỷ đ',
      slices: [
        { name: 'DT trong nước', percent: 88.8, formattedPercent: '88,8%', color: '#0284c7', value: 633.1 },
        { name: 'DT quốc tế', percent: 11.2, formattedPercent: '11,2%', color: '#ea580c', value: 79.8 }
      ]
    },
    thYear: {
      title: 'TH – Năm 2025 (lũy kế 8T)',
      total: 2674.5,
      formattedTotal: '2.674,5',
      unit: 'tỷ đ',
      slices: [
        { name: 'DT trong nước', percent: 88.5, formattedPercent: '88,5%', color: '#0284c7', value: 2367.0 },
        { name: 'DT quốc tế', percent: 11.5, formattedPercent: '11,5%', color: '#ea580c', value: 307.5 }
      ]
    },
    khMonth: {
      title: 'KH – Tháng 8/2025',
      total: 380.0,
      formattedTotal: '380,0',
      unit: 'tỷ đ',
      slices: [
        { name: 'DT trong nước', percent: 87.5, formattedPercent: '87,5%', color: '#0284c7', value: 332.5 },
        { name: 'DT quốc tế', percent: 12.5, formattedPercent: '12,5%', color: '#ea580c', value: 47.5 }
      ]
    },
    khQuarter: {
      title: 'KH – Quý III/2025',
      total: 1150.0,
      formattedTotal: '1.150,0',
      unit: 'tỷ đ',
      slices: [
        { name: 'DT trong nước', percent: 87.5, formattedPercent: '87,5%', color: '#0284c7', value: 1006.3 },
        { name: 'DT quốc tế', percent: 12.5, formattedPercent: '12,5%', color: '#ea580c', value: 143.7 }
      ]
    },
    khYear: {
      title: 'KH – Năm 2025',
      total: 4500.0,
      formattedTotal: '4.500,0',
      unit: 'tỷ đ',
      slices: [
        { name: 'DT trong nước', percent: 87.5, formattedPercent: '87,5%', color: '#0284c7', value: 3937.5 },
        { name: 'DT quốc tế', percent: 12.5, formattedPercent: '12,5%', color: '#ea580c', value: 562.5 }
      ]
    }
  },
  '2024': {
    thMonth: {
      title: 'TH – Tháng 8/2024',
      total: 340.0,
      formattedTotal: '340,0',
      unit: 'tỷ đ',
      slices: [
        { name: 'DT trong nước', percent: 89.2, formattedPercent: '89,2%', color: '#0284c7', value: 303.3 },
        { name: 'DT quốc tế', percent: 10.8, formattedPercent: '10,8%', color: '#ea580c', value: 36.7 }
      ]
    },
    thQuarter: {
      title: 'TH – Quý III/2024',
      total: 680.0,
      formattedTotal: '680,0',
      unit: 'tỷ đ',
      slices: [
        { name: 'DT trong nước', percent: 89.0, formattedPercent: '89,0%', color: '#0284c7', value: 605.2 },
        { name: 'DT quốc tế', percent: 11.0, formattedPercent: '11,0%', color: '#ea580c', value: 74.8 }
      ]
    },
    thYear: {
      title: 'TH – Năm 2024',
      total: 2450.0,
      formattedTotal: '2.450,0',
      unit: 'tỷ đ',
      slices: [
        { name: 'DT trong nước', percent: 88.6, formattedPercent: '88,6%', color: '#0284c7', value: 2170.7 },
        { name: 'DT quốc tế', percent: 11.4, formattedPercent: '11,4%', color: '#ea580c', value: 279.3 }
      ]
    },
    khMonth: {
      title: 'KH – Tháng 8/2024',
      total: 350.0,
      formattedTotal: '350,0',
      unit: 'tỷ đ',
      slices: [
        { name: 'DT trong nước', percent: 88.0, formattedPercent: '88,0%', color: '#0284c7', value: 308.0 },
        { name: 'DT quốc tế', percent: 12.0, formattedPercent: '12,0%', color: '#ea580c', value: 42.0 }
      ]
    },
    khQuarter: {
      title: 'KH – Quý III/2024',
      total: 1050.0,
      formattedTotal: '1.050,0',
      unit: 'tỷ đ',
      slices: [
        { name: 'DT trong nước', percent: 88.0, formattedPercent: '88,0%', color: '#0284c7', value: 924.0 },
        { name: 'DT quốc tế', percent: 12.0, formattedPercent: '12,0%', color: '#ea580c', value: 126.0 }
      ]
    },
    khYear: {
      title: 'KH – Năm 2024',
      total: 4200.0,
      formattedTotal: '4.200,0',
      unit: 'tỷ đ',
      slices: [
        { name: 'DT trong nước', percent: 88.0, formattedPercent: '88,0%', color: '#0284c7', value: 3696.0 },
        { name: 'DT quốc tế', percent: 12.0, formattedPercent: '12,0%', color: '#ea580c', value: 504.0 }
      ]
    }
  }
};
