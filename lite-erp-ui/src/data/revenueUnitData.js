// Data definitions for Biểu đồ 21 (Cơ cấu doanh thu theo đơn vị thực hiện)
// Cơ sở so sánh: Tháng 8 | Quý III (lũy kế) | Năm (lũy kế 8T)

export const UNIT_CATEGORIES = [
  { id: 'hanoi', name: 'Đơn vị Hà Nội', color: '#1b4474' },
  { id: 'hcm', name: 'Đơn vị TP.HCM', color: '#be5318' },
  { id: 'danang', name: 'Đơn vị Đà Nẵng', color: '#538234' },
  { id: 'ttgp', name: 'TT Giải pháp', color: '#70279e' },
  { id: 'quocte', name: 'Cty con Quốc tế', color: '#2b70c9' },
  { id: 'dvs', name: 'Khối Dịch vụ số', color: '#c58b09' }
];

export const UNIT_STRUCTURE_DATA = {
  '2026': {
    thMonth: {
      title: 'Tháng 8/2026',
      total: 389.9,
      formattedTotal: '389,9',
      unit: 'Triệu đồng',
      slices: [
        { name: 'Đơn vị Hà Nội', percent: 27, color: '#1b4474', value: 105.3 },
        { name: 'Đơn vị TP.HCM', percent: 24, color: '#be5318', value: 93.6 },
        { name: 'Đơn vị Đà Nẵng', percent: 13, color: '#538234', value: 50.7 },
        { name: 'TT Giải pháp', percent: 13, color: '#70279e', value: 50.7 },
        { name: 'Cty con Quốc tế', percent: 14, color: '#2b70c9', value: 54.6 },
        { name: 'Khối Dịch vụ số', percent: 10, color: '#c58b09', value: 39.0 }
      ]
    },
    thQuarter: {
      title: 'Quý III/2026 (lũy kế T7–T8)',
      total: 775.0,
      formattedTotal: '775,0',
      unit: 'Triệu đồng',
      slices: [
        { name: 'Đơn vị Hà Nội', percent: 27, color: '#1b4474', value: 209.3 },
        { name: 'Đơn vị TP.HCM', percent: 24, color: '#be5318', value: 186.0 },
        { name: 'Đơn vị Đà Nẵng', percent: 13, color: '#538234', value: 100.8 },
        { name: 'TT Giải pháp', percent: 12, color: '#70279e', value: 93.0 },
        { name: 'Cty con Quốc tế', percent: 13, color: '#2b70c9', value: 100.8 },
        { name: 'Khối Dịch vụ số', percent: 9, color: '#c58b09', value: 69.8 }
      ]
    },
    thYear: {
      title: 'Năm 2026 (lũy kế 8T)',
      total: 2976.3,
      formattedTotal: '2.976,3',
      unit: 'Triệu đồng',
      slices: [
        { name: 'Đơn vị Hà Nội', percent: 29, color: '#1b4474', value: 863.1 },
        { name: 'Đơn vị TP.HCM', percent: 24, color: '#be5318', value: 714.3 },
        { name: 'Đơn vị Đà Nẵng', percent: 13, color: '#538234', value: 386.9 },
        { name: 'TT Giải pháp', percent: 12, color: '#70279e', value: 357.2 },
        { name: 'Cty con Quốc tế', percent: 13, color: '#2b70c9', value: 386.9 },
        { name: 'Khối Dịch vụ số', percent: 9, color: '#c58b09', value: 267.9 }
      ]
    }
  },
  '2025': {
    thMonth: {
      title: 'Tháng 8/2025',
      total: 364.4,
      formattedTotal: '364,4',
      unit: 'Triệu đồng',
      slices: [
        { name: 'Đơn vị Hà Nội', percent: 27, color: '#1b4474', value: 98.4 },
        { name: 'Đơn vị TP.HCM', percent: 24, color: '#be5318', value: 87.5 },
        { name: 'Đơn vị Đà Nẵng', percent: 13, color: '#538234', value: 47.4 },
        { name: 'TT Giải pháp', percent: 13, color: '#70279e', value: 47.4 },
        { name: 'Cty con Quốc tế', percent: 14, color: '#2b70c9', value: 51.0 },
        { name: 'Khối Dịch vụ số', percent: 10, color: '#c58b09', value: 36.4 }
      ]
    },
    thQuarter: {
      title: 'Quý III/2025 (lũy kế T7–T8)',
      total: 712.9,
      formattedTotal: '712,9',
      unit: 'Triệu đồng',
      slices: [
        { name: 'Đơn vị Hà Nội', percent: 27, color: '#1b4474', value: 192.5 },
        { name: 'Đơn vị TP.HCM', percent: 24, color: '#be5318', value: 171.1 },
        { name: 'Đơn vị Đà Nẵng', percent: 13, color: '#538234', value: 92.7 },
        { name: 'TT Giải pháp', percent: 12, color: '#70279e', value: 85.5 },
        { name: 'Cty con Quốc tế', percent: 13, color: '#2b70c9', value: 92.7 },
        { name: 'Khối Dịch vụ số', percent: 9, color: '#c58b09', value: 64.2 }
      ]
    },
    thYear: {
      title: 'Năm 2025 (lũy kế 8T)',
      total: 2674.5,
      formattedTotal: '2.674,5',
      unit: 'Triệu đồng',
      slices: [
        { name: 'Đơn vị Hà Nội', percent: 29, color: '#1b4474', value: 775.6 },
        { name: 'Đơn vị TP.HCM', percent: 24, color: '#be5318', value: 641.9 },
        { name: 'Đơn vị Đà Nẵng', percent: 13, color: '#538234', value: 347.7 },
        { name: 'TT Giải pháp', percent: 12, color: '#70279e', value: 320.9 },
        { name: 'Cty con Quốc tế', percent: 13, color: '#2b70c9', value: 347.7 },
        { name: 'Khối Dịch vụ số', percent: 9, color: '#c58b09', value: 240.7 }
      ]
    }
  }
};

// Data definitions for Biểu đồ 22 (Doanh thu theo từng đơn vị so với kế hoạch)
export const UNIT_PLAN_COMPARISON_DATA = {
  '2026': {
    month: {
      periodLabel: 'Tháng 8/2026',
      primaryLegend: 'TH T8',
      secondaryLegend: 'KH T8',
      maxVal: 150,
      xTicks: [0, 25, 50, 75, 100, 125, 150],
      items: [
        { id: 'hanoi', name: 'Đơn vị Hà Nội', th: 105.6, kh: 120.0, rate: '88%', isPositive: false },
        { id: 'hcm', name: 'Đơn vị TP.HCM', th: 93.6, kh: 95.5, rate: '98%', isPositive: false },
        { id: 'danang', name: 'Đơn vị Đà Nẵng', th: 50.7, kh: 54.5, rate: '93%', isPositive: false },
        { id: 'ttgp', name: 'TT Giải pháp', th: 49.0, kh: 50.0, rate: '98%', isPositive: false },
        { id: 'quocte', name: 'Cty con Quốc tế', th: 54.6, kh: 58.0, rate: '94%', isPositive: false },
        { id: 'dvs', name: 'Khối Dịch vụ số', th: 38.0, kh: 37.3, rate: '102%', isPositive: true }
      ]
    },
    quarter: {
      periodLabel: 'Quý III/2026',
      primaryLegend: 'Ước Q3',
      secondaryLegend: 'KH Q3',
      maxVal: 400,
      xTicks: [0, 100, 200, 300, 400],
      items: [
        { id: 'hanoi', name: 'Đơn vị Hà Nội', th: 317.0, kh: 360.0, rate: '88%', isPositive: false },
        { id: 'hcm', name: 'Đơn vị TP.HCM', th: 280.8, kh: 286.5, rate: '98%', isPositive: false },
        { id: 'danang', name: 'Đơn vị Đà Nẵng', th: 153.7, kh: 163.5, rate: '94%', isPositive: false },
        { id: 'ttgp', name: 'TT Giải pháp', th: 145.5, kh: 150.0, rate: '97%', isPositive: false },
        { id: 'quocte', name: 'Cty con Quốc tế', th: 156.0, kh: 175.0, rate: '89%', isPositive: false },
        { id: 'dvs', name: 'Khối Dịch vụ số', th: 109.5, kh: 111.8, rate: '98%', isPositive: false }
      ]
    },
    year: {
      periodLabel: 'Năm 2026',
      primaryLegend: 'Ước 2026',
      secondaryLegend: 'KH 2026',
      maxVal: 1500,
      xTicks: [0, 500, 1000, 1500],
      items: [
        { id: 'hanoi', name: 'Đơn vị Hà Nội', th: 1300.0, kh: 1460.0, rate: '89%', isPositive: false },
        { id: 'hcm', name: 'Đơn vị TP.HCM', th: 1080.0, kh: 1150.0, rate: '94%', isPositive: false },
        { id: 'danang', name: 'Đơn vị Đà Nẵng', th: 578.5, kh: 650.0, rate: '89%', isPositive: false },
        { id: 'ttgp', name: 'TT Giải pháp', th: 540.0, kh: 600.0, rate: '90%', isPositive: false },
        { id: 'quocte', name: 'Cty con Quốc tế', th: 588.0, kh: 700.0, rate: '84%', isPositive: false },
        { id: 'dvs', name: 'Khối Dịch vụ số', th: 414.0, kh: 450.0, rate: '92%', isPositive: false }
      ]
    }
  },
  '2025': {
    month: {
      periodLabel: 'Tháng 8/2025',
      primaryLegend: 'TH T8',
      secondaryLegend: 'KH T8',
      maxVal: 150,
      xTicks: [0, 25, 50, 75, 100, 125, 150],
      items: [
        { id: 'hanoi', name: 'Đơn vị Hà Nội', th: 98.4, kh: 110.0, rate: '89%', isPositive: false },
        { id: 'hcm', name: 'Đơn vị TP.HCM', th: 87.5, kh: 90.0, rate: '97%', isPositive: false },
        { id: 'danang', name: 'Đơn vị Đà Nẵng', th: 47.4, kh: 50.0, rate: '95%', isPositive: false },
        { id: 'ttgp', name: 'TT Giải pháp', th: 47.4, kh: 48.0, rate: '99%', isPositive: false },
        { id: 'quocte', name: 'Cty con Quốc tế', th: 51.0, kh: 55.0, rate: '93%', isPositive: false },
        { id: 'dvs', name: 'Khối Dịch vụ số', th: 36.4, kh: 36.0, rate: '101%', isPositive: true }
      ]
    },
    quarter: {
      periodLabel: 'Quý III/2025',
      primaryLegend: 'Ước Q3',
      secondaryLegend: 'KH Q3',
      maxVal: 400,
      xTicks: [0, 100, 200, 300, 400],
      items: [
        { id: 'hanoi', name: 'Đơn vị Hà Nội', th: 290.0, kh: 330.0, rate: '88%', isPositive: false },
        { id: 'hcm', name: 'Đơn vị TP.HCM', th: 255.0, kh: 265.0, rate: '96%', isPositive: false },
        { id: 'danang', name: 'Đơn vị Đà Nẵng', th: 140.0, kh: 150.0, rate: '93%', isPositive: false },
        { id: 'ttgp', name: 'TT Giải pháp', th: 135.0, kh: 140.0, rate: '96%', isPositive: false },
        { id: 'quocte', name: 'Cty con Quốc tế', th: 142.0, kh: 160.0, rate: '89%', isPositive: false },
        { id: 'dvs', name: 'Khối Dịch vụ số', th: 100.0, kh: 102.0, rate: '98%', isPositive: false }
      ]
    },
    year: {
      periodLabel: 'Năm 2025',
      primaryLegend: 'Ước 2025',
      secondaryLegend: 'KH 2025',
      maxVal: 1500,
      xTicks: [0, 500, 1000, 1500],
      items: [
        { id: 'hanoi', name: 'Đơn vị Hà Nội', th: 1180.0, kh: 1320.0, rate: '89%', isPositive: false },
        { id: 'hcm', name: 'Đơn vị TP.HCM', th: 980.0, kh: 1050.0, rate: '93%', isPositive: false },
        { id: 'danang', name: 'Đơn vị Đà Nẵng', th: 520.0, kh: 580.0, rate: '90%', isPositive: false },
        { id: 'ttgp', name: 'TT Giải pháp', th: 490.0, kh: 540.0, rate: '91%', isPositive: false },
        { id: 'quocte', name: 'Cty con Quốc tế', th: 530.0, kh: 630.0, rate: '84%', isPositive: false },
        { id: 'dvs', name: 'Khối Dịch vụ số', th: 375.0, kh: 410.0, rate: '91%', isPositive: false }
      ]
    }
  }
};

