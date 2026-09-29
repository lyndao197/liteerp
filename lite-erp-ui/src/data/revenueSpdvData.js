// Data definitions for Biểu đồ 16 & 17 (Cơ cấu doanh thu thực hiện và kế hoạch theo 6 nhóm SPDV)
// Hàng trên: Biểu đồ 16 (Thực hiện)
// Hàng dưới: Biểu đồ 17 (Kế hoạch)
// 3 Cột: Tháng 8/2026 | Quý III/2026 | Năm 2026

export const SPDV_CATEGORIES = [
  { id: 'gppm', name: 'Giải pháp phần mềm', color: '#1f3d6d' },
  { id: 'htcntt', name: 'Hạ tầng CNTT', color: '#2e6aa6' },
  { id: 'dvs', name: 'Dịch vụ số', color: '#5993cd' },
  { id: 'tvth', name: 'Tư vấn & tích hợp', color: '#e59a68' },
  { id: 'vhbt', name: 'Vận hành & bảo trì', color: '#98d593' },
  { id: 'dtk', name: 'Đào tạo & khác', color: '#b8c2cc' }
];

export const SPDV_STRUCTURE_DATA = {
  '2026': {
    // Hàng trên: Biểu đồ 16 (Thực hiện)
    thMonth: {
      title: 'TH – Tháng 8/2026',
      total: 389.9,
      formattedTotal: '389,9',
      unit: 'Triệu đồng',
      slices: [
        { name: 'Giải pháp phần mềm', percent: 26, color: '#1f3d6d', value: 101.4 },
        { name: 'Hạ tầng CNTT', percent: 22, color: '#2e6aa6', value: 85.8 },
        { name: 'Dịch vụ số', percent: 19, color: '#5993cd', value: 74.1 },
        { name: 'Tư vấn & tích hợp', percent: 15, color: '#e59a68', value: 58.5 },
        { name: 'Vận hành & bảo trì', percent: 11, color: '#98d593', value: 42.9 },
        { name: 'Đào tạo & khác', percent: 7, color: '#b8c2cc', value: 27.3 }
      ]
    },
    thQuarter: {
      title: 'TH – Quý III/2026 (lũy kế T7–T8)',
      total: 775.0,
      formattedTotal: '775,0',
      unit: 'Triệu đồng',
      slices: [
        { name: 'Giải pháp phần mềm', percent: 27, color: '#1f3d6d', value: 209.3 },
        { name: 'Hạ tầng CNTT', percent: 21, color: '#2e6aa6', value: 162.8 },
        { name: 'Dịch vụ số', percent: 19, color: '#5993cd', value: 147.3 },
        { name: 'Tư vấn & tích hợp', percent: 15, color: '#e59a68', value: 116.3 },
        { name: 'Vận hành & bảo trì', percent: 11, color: '#98d593', value: 85.3 },
        { name: 'Đào tạo & khác', percent: 7, color: '#b8c2cc', value: 54.3 }
      ]
    },
    thYear: {
      title: 'TH – Năm 2026 (lũy kế 8T)',
      total: 2976.3,
      formattedTotal: '2.976,3',
      unit: 'Triệu đồng',
      slices: [
        { name: 'Giải pháp phần mềm', percent: 27, color: '#1f3d6d', value: 803.6 },
        { name: 'Hạ tầng CNTT', percent: 21, color: '#2e6aa6', value: 625.0 },
        { name: 'Dịch vụ số', percent: 19, color: '#5993cd', value: 565.5 },
        { name: 'Tư vấn & tích hợp', percent: 15, color: '#e59a68', value: 446.4 },
        { name: 'Vận hành & bảo trì', percent: 11, color: '#98d593', value: 327.4 },
        { name: 'Đào tạo & khác', percent: 7, color: '#b8c2cc', value: 208.3 }
      ]
    },

    // Hàng dưới: Biểu đồ 17 (Kế hoạch)
    khMonth: {
      title: 'KH – Tháng 8/2026',
      total: 414.0,
      formattedTotal: '414,0',
      unit: 'Triệu đồng',
      slices: [
        { name: 'Giải pháp phần mềm', percent: 27, color: '#1f3d6d', value: 111.8 },
        { name: 'Hạ tầng CNTT', percent: 20, color: '#2e6aa6', value: 82.8 },
        { name: 'Dịch vụ số', percent: 20, color: '#5993cd', value: 82.8 },
        { name: 'Tư vấn & tích hợp', percent: 15, color: '#e59a68', value: 62.1 },
        { name: 'Vận hành & bảo trì', percent: 11, color: '#98d593', value: 45.5 },
        { name: 'Đào tạo & khác', percent: 7, color: '#b8c2cc', value: 29.0 }
      ]
    },
    khQuarter: {
      title: 'KH – Quý III/2026',
      total: 1246.0,
      formattedTotal: '1.246,0',
      unit: 'Triệu đồng',
      slices: [
        { name: 'Giải pháp phần mềm', percent: 27, color: '#1f3d6d', value: 336.4 },
        { name: 'Hạ tầng CNTT', percent: 20, color: '#2e6aa6', value: 249.2 },
        { name: 'Dịch vụ số', percent: 20, color: '#5993cd', value: 249.2 },
        { name: 'Tư vấn & tích hợp', percent: 15, color: '#e59a68', value: 186.9 },
        { name: 'Vận hành & bảo trì', percent: 11, color: '#98d593', value: 137.1 },
        { name: 'Đào tạo & khác', percent: 7, color: '#b8c2cc', value: 87.2 }
      ]
    },
    khYear: {
      title: 'KH – Năm 2026',
      total: 4968.1,
      formattedTotal: '4.968,1',
      unit: 'Triệu đồng',
      slices: [
        { name: 'Giải pháp phần mềm', percent: 27, color: '#1f3d6d', value: 1341.4 },
        { name: 'Hạ tầng CNTT', percent: 20, color: '#2e6aa6', value: 993.6 },
        { name: 'Dịch vụ số', percent: 20, color: '#5993cd', value: 993.6 },
        { name: 'Tư vấn & tích hợp', percent: 15, color: '#e59a68', value: 745.2 },
        { name: 'Vận hành & bảo trì', percent: 11, color: '#98d593', value: 546.5 },
        { name: 'Đào tạo & khác', percent: 7, color: '#b8c2cc', value: 347.8 }
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
        { name: 'Giải pháp phần mềm', percent: 26, color: '#1f3d6d', value: 94.7 },
        { name: 'Hạ tầng CNTT', percent: 22, color: '#2e6aa6', value: 80.2 },
        { name: 'Dịch vụ số', percent: 19, color: '#5993cd', value: 69.2 },
        { name: 'Tư vấn & tích hợp', percent: 15, color: '#e59a68', value: 54.7 },
        { name: 'Vận hành & bảo trì', percent: 11, color: '#98d593', value: 40.1 },
        { name: 'Đào tạo & khác', percent: 7, color: '#b8c2cc', value: 25.5 }
      ]
    },
    thQuarter: {
      title: 'TH – Quý III/2025 (lũy kế T7–T8)',
      total: 712.9,
      formattedTotal: '712,9',
      unit: 'Triệu đồng',
      slices: [
        { name: 'Giải pháp phần mềm', percent: 27, color: '#1f3d6d', value: 192.5 },
        { name: 'Hạ tầng CNTT', percent: 21, color: '#2e6aa6', value: 149.7 },
        { name: 'Dịch vụ số', percent: 19, color: '#5993cd', value: 135.5 },
        { name: 'Tư vấn & tích hợp', percent: 15, color: '#e59a68', value: 106.9 },
        { name: 'Vận hành & bảo trì', percent: 11, color: '#98d593', value: 78.4 },
        { name: 'Đào tạo & khác', percent: 7, color: '#b8c2cc', value: 49.9 }
      ]
    },
    thYear: {
      title: 'TH – Năm 2025 (lũy kế 8T)',
      total: 2674.5,
      formattedTotal: '2.674,5',
      unit: 'Triệu đồng',
      slices: [
        { name: 'Giải pháp phần mềm', percent: 27, color: '#1f3d6d', value: 722.1 },
        { name: 'Hạ tầng CNTT', percent: 21, color: '#2e6aa6', value: 561.6 },
        { name: 'Dịch vụ số', percent: 19, color: '#5993cd', value: 508.2 },
        { name: 'Tư vấn & tích hợp', percent: 15, color: '#e59a68', value: 401.2 },
        { name: 'Vận hành & bảo trì', percent: 11, color: '#98d593', value: 294.2 },
        { name: 'Đào tạo & khác', percent: 7, color: '#b8c2cc', value: 187.2 }
      ]
    },
    khMonth: {
      title: 'KH – Tháng 8/2025',
      total: 380.0,
      formattedTotal: '380,0',
      unit: 'Triệu đồng',
      slices: [
        { name: 'Giải pháp phần mềm', percent: 27, color: '#1f3d6d', value: 102.6 },
        { name: 'Hạ tầng CNTT', percent: 20, color: '#2e6aa6', value: 76.0 },
        { name: 'Dịch vụ số', percent: 20, color: '#5993cd', value: 76.0 },
        { name: 'Tư vấn & tích hợp', percent: 15, color: '#e59a68', value: 57.0 },
        { name: 'Vận hành & bảo trì', percent: 11, color: '#98d593', value: 41.8 },
        { name: 'Đào tạo & khác', percent: 7, color: '#b8c2cc', value: 26.6 }
      ]
    },
    khQuarter: {
      title: 'KH – Quý III/2025',
      total: 1150.0,
      formattedTotal: '1.150,0',
      unit: 'Triệu đồng',
      slices: [
        { name: 'Giải pháp phần mềm', percent: 27, color: '#1f3d6d', value: 310.5 },
        { name: 'Hạ tầng CNTT', percent: 20, color: '#2e6aa6', value: 230.0 },
        { name: 'Dịch vụ số', percent: 20, color: '#5993cd', value: 230.0 },
        { name: 'Tư vấn & tích hợp', percent: 15, color: '#e59a68', value: 172.5 },
        { name: 'Vận hành & bảo trì', percent: 11, color: '#98d593', value: 126.5 },
        { name: 'Đào tạo & khác', percent: 7, color: '#b8c2cc', value: 80.5 }
      ]
    },
    khYear: {
      title: 'KH – Năm 2025',
      total: 4500.0,
      formattedTotal: '4.500,0',
      unit: 'Triệu đồng',
      slices: [
        { name: 'Giải pháp phần mềm', percent: 27, color: '#1f3d6d', value: 1215.0 },
        { name: 'Hạ tầng CNTT', percent: 20, color: '#2e6aa6', value: 900.0 },
        { name: 'Dịch vụ số', percent: 20, color: '#5993cd', value: 900.0 },
        { name: 'Tư vấn & tích hợp', percent: 15, color: '#e59a68', value: 675.0 },
        { name: 'Vận hành & bảo trì', percent: 11, color: '#98d593', value: 495.0 },
        { name: 'Đào tạo & khác', percent: 7, color: '#b8c2cc', value: 315.0 }
      ]
    }
  }
};

// ==============================================================================
// DỮ LIỆU BIỂU ĐỒ 18: DOANH THU 6 NHÓM SPDV SO VỚI KẾ HOẠCH
// 3 Cột: Tháng (TH vs KH) | Quý (Ước vs KH) | Năm (Ước vs KH)
// ==============================================================================
export const SPDV_BAR_COMPARISON_DATA = {
  '2026': {
    'Tháng 8': {
      monthTitle: 'Tháng 8/2026',
      monthLegendTh: 'TH T8',
      monthLegendKh: 'KH T8',
      monthMax: 120,
      monthTicks: [0, 20, 40, 60, 80, 100, 120],
      monthItems: [
        { id: 'gppm', name: 'Giải pháp phần mềm', th: 103.0, kh: 112.0, rate: '92%', isRatePositive: false },
        { id: 'htcntt', name: 'Hạ tầng CNTT', th: 84.5, kh: 82.8, rate: '102%', isRatePositive: true },
        { id: 'dvs', name: 'Dịch vụ số', th: 74.0, kh: 84.1, rate: '88%', isRatePositive: false },
        { id: 'tvth', name: 'Tư vấn & tích hợp', th: 57.1, kh: 62.1, rate: '92%', isRatePositive: false },
        { id: 'vhbt', name: 'Vận hành & bảo trì', th: 44.6, kh: 45.5, rate: '98%', isRatePositive: false },
        { id: 'dtk', name: 'Đào tạo & khác', th: 28.1, kh: 29.0, rate: '97%', isRatePositive: false }
      ],
      quarterTitle: 'Quý III/2026',
      quarterLegendTh: 'Ước Q3',
      quarterLegendKh: 'KH Q3',
      quarterMax: 400,
      quarterTicks: [0, 100, 200, 300, 400],
      quarterItems: [
        { id: 'gppm', name: 'Giải pháp phần mềm', th: 315.8, kh: 336.0, rate: '94%', isRatePositive: false },
        { id: 'htcntt', name: 'Hạ tầng CNTT', th: 245.0, kh: 250.0, rate: '98%', isRatePositive: false },
        { id: 'dvs', name: 'Dịch vụ số', th: 220.7, kh: 248.0, rate: '89%', isRatePositive: false },
        { id: 'tvth', name: 'Tư vấn & tích hợp', th: 169.3, kh: 186.0, rate: '91%', isRatePositive: false },
        { id: 'vhbt', name: 'Vận hành & bảo trì', th: 127.8, kh: 136.0, rate: '94%', isRatePositive: false },
        { id: 'dtk', name: 'Đào tạo & khác', th: 82.6, kh: 87.0, rate: '95%', isRatePositive: false }
      ],
      yearTitle: 'Năm 2026',
      yearLegendTh: 'Ước 2026',
      yearLegendKh: 'KH 2026',
      yearMax: 1500,
      yearTicks: [0, 250, 500, 750, 1000, 1250, 1500],
      yearItems: [
        { id: 'gppm', name: 'Giải pháp phần mềm', th: 1210.0, kh: 1344.0, rate: '90%', isRatePositive: false },
        { id: 'htcntt', name: 'Hạ tầng CNTT', th: 945.0, kh: 995.0, rate: '95%', isRatePositive: false },
        { id: 'dvs', name: 'Dịch vụ số', th: 846.0, kh: 995.0, rate: '85%', isRatePositive: false },
        { id: 'tvth', name: 'Tư vấn & tích hợp', th: 655.0, kh: 744.0, rate: '88%', isRatePositive: false },
        { id: 'vhbt', name: 'Vận hành & bảo trì', th: 490.0, kh: 544.0, rate: '90%', isRatePositive: false },
        { id: 'dtk', name: 'Đào tạo & khác', th: 315.0, kh: 346.0, rate: '91%', isRatePositive: false }
      ]
    }
  },
  '2025': {
    'Tháng 8': {
      monthTitle: 'Tháng 8/2025',
      monthLegendTh: 'TH T8',
      monthLegendKh: 'KH T8',
      monthMax: 120,
      monthTicks: [0, 20, 40, 60, 80, 100, 120],
      monthItems: [
        { id: 'gppm', name: 'Giải pháp phần mềm', th: 94.7, kh: 102.6, rate: '92%', isRatePositive: false },
        { id: 'htcntt', name: 'Hạ tầng CNTT', th: 80.2, kh: 76.0, rate: '106%', isRatePositive: true },
        { id: 'dvs', name: 'Dịch vụ số', th: 69.2, kh: 76.0, rate: '91%', isRatePositive: false },
        { id: 'tvth', name: 'Tư vấn & tích hợp', th: 54.7, kh: 57.0, rate: '96%', isRatePositive: false },
        { id: 'vhbt', name: 'Vận hành & bảo trì', th: 40.1, kh: 41.8, rate: '96%', isRatePositive: false },
        { id: 'dtk', name: 'Đào tạo & khác', th: 25.5, kh: 26.6, rate: '96%', isRatePositive: false }
      ],
      quarterTitle: 'Quý III/2025',
      quarterLegendTh: 'Ước Q3',
      quarterLegendKh: 'KH Q3',
      quarterMax: 400,
      quarterTicks: [0, 100, 200, 300, 400],
      quarterItems: [
        { id: 'gppm', name: 'Giải pháp phần mềm', th: 285.0, kh: 310.5, rate: '92%', isRatePositive: false },
        { id: 'htcntt', name: 'Hạ tầng CNTT', th: 228.0, kh: 230.0, rate: '99%', isRatePositive: false },
        { id: 'dvs', name: 'Dịch vụ số', th: 205.0, kh: 230.0, rate: '89%', isRatePositive: false },
        { id: 'tvth', name: 'Tư vấn & tích hợp', th: 156.0, kh: 172.5, rate: '90%', isRatePositive: false },
        { id: 'vhbt', name: 'Vận hành & bảo trì', th: 118.0, kh: 126.5, rate: '93%', isRatePositive: false },
        { id: 'dtk', name: 'Đào tạo & khác', th: 75.0, kh: 80.5, rate: '93%', isRatePositive: false }
      ],
      yearTitle: 'Năm 2025',
      yearLegendTh: 'Ước 2025',
      yearLegendKh: 'KH 2025',
      yearMax: 1500,
      yearTicks: [0, 250, 500, 750, 1000, 1250, 1500],
      yearItems: [
        { id: 'gppm', name: 'Giải pháp phần mềm', th: 1100.0, kh: 1215.0, rate: '91%', isRatePositive: false },
        { id: 'htcntt', name: 'Hạ tầng CNTT', th: 860.0, kh: 900.0, rate: '96%', isRatePositive: false },
        { id: 'dvs', name: 'Dịch vụ số', th: 770.0, kh: 900.0, rate: '86%', isRatePositive: false },
        { id: 'tvth', name: 'Tư vấn & tích hợp', th: 595.0, kh: 675.0, rate: '88%', isRatePositive: false },
        { id: 'vhbt', name: 'Vận hành & bảo trì', th: 445.0, kh: 495.0, rate: '90%', isRatePositive: false },
        { id: 'dtk', name: 'Đào tạo & khác', th: 285.0, kh: 315.0, rate: '90%', isRatePositive: false }
      ]
    }
  }
};

export const getSpdvBarComparisonData = (year = '2026', month = 'Tháng 8') => {
  const defaultYear = '2026';
  const defaultMonth = 'Tháng 8';
  const yearData = SPDV_BAR_COMPARISON_DATA[year] || SPDV_BAR_COMPARISON_DATA[defaultYear];
  if (yearData && yearData[month]) {
    return yearData[month];
  }

  // Base fallback with dynamically adapted labels
  const base = (yearData && yearData[defaultMonth]) || SPDV_BAR_COMPARISON_DATA[defaultYear][defaultMonth];
  const mNum = parseInt(month?.match(/\d+/)?.[0] || '8', 10);
  const qNum = Math.ceil(mNum / 3);
  const qRoman = ['I', 'II', 'III', 'IV'][qNum - 1] || 'III';

  return {
    ...base,
    monthTitle: `Tháng ${mNum}/${year}`,
    monthLegendTh: `TH T${mNum}`,
    monthLegendKh: `KH T${mNum}`,
    quarterTitle: `Quý ${qRoman}/${year}`,
    quarterLegendTh: `Ước Q${qNum}`,
    quarterLegendKh: `KH Q${qNum}`,
    yearTitle: `Năm ${year}`,
    yearLegendTh: `Ước ${year}`,
    yearLegendKh: `KH ${year}`
  };
};
