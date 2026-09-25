// Data definitions for Biểu đồ 14 (Xu hướng doanh thu từng tháng so với năm trước)
// Trục X: 12 tháng (T1 - T12), Trục Y: 0 - 600 Triệu đồng

export const MONTH_TREND_DATA = {
  '2026': [
    { month: 'T1', name: 'Tháng 1', th2026: 322.6, th2025: 272.0, growth: '+18,6%', isPositive: true },
    { month: 'T2', name: 'Tháng 2', th2026: 294.3, th2025: 254.4, growth: '+15,7%', isPositive: true },
    { month: 'T3', name: 'Tháng 3', th2026: 374.0, th2025: 306.1, growth: '+22,2%', isPositive: true },
    { month: 'T4', name: 'Tháng 4', th2026: 403.5, th2025: 360.9, growth: '+11,8%', isPositive: true },
    { month: 'T5', name: 'Tháng 5', th2026: 402.7, th2025: 369.4, growth: '+9,0%', isPositive: true },
    { month: 'T6', name: 'Tháng 6', th2026: 404.2, th2025: 363.2, growth: '+11,3%', isPositive: true },
    { month: 'T7', name: 'Tháng 7', th2026: 385.1, th2025: 348.5, growth: '+10,5%', isPositive: true },
    { month: 'T8', name: 'Tháng 8', th2026: 389.9, th2025: 364.4, growth: '+7,0%', isPositive: true },
    { month: 'T9', name: 'Tháng 9', th2026: null, th2025: 367.0, growth: null, isPositive: null },
    { month: 'T10', name: 'Tháng 10', th2026: null, th2025: 375.0, growth: null, isPositive: null },
    { month: 'T11', name: 'Tháng 11', th2026: null, th2025: 408.0, growth: null, isPositive: null },
    { month: 'T12', name: 'Tháng 12', th2026: null, th2025: 540.0, growth: null, isPositive: null }
  ],
  '2025': [
    { month: 'T1', name: 'Tháng 1', th2026: 272.0, th2025: 235.0, growth: '+15,7%', isPositive: true },
    { month: 'T2', name: 'Tháng 2', th2026: 254.4, th2025: 220.0, growth: '+15,6%', isPositive: true },
    { month: 'T3', name: 'Tháng 3', th2026: 306.1, th2025: 265.0, growth: '+15,5%', isPositive: true },
    { month: 'T4', name: 'Tháng 4', th2026: 360.9, th2025: 315.0, growth: '+14,6%', isPositive: true },
    { month: 'T5', name: 'Tháng 5', th2026: 369.4, th2025: 322.0, growth: '+14,7%', isPositive: true },
    { month: 'T6', name: 'Tháng 6', th2026: 363.2, th2025: 318.0, growth: '+14,2%', isPositive: true },
    { month: 'T7', name: 'Tháng 7', th2026: 348.5, th2025: 305.0, growth: '+14,3%', isPositive: true },
    { month: 'T8', name: 'Tháng 8', th2026: 364.4, th2025: 320.0, growth: '+13,9%', isPositive: true },
    { month: 'T9', name: 'Tháng 9', th2026: 367.0, th2025: 325.0, growth: '+12,9%', isPositive: true },
    { month: 'T10', name: 'Tháng 10', th2026: 375.0, th2025: 330.0, growth: '+13,6%', isPositive: true },
    { month: 'T11', name: 'Tháng 11', th2026: 408.0, th2025: 360.0, growth: '+13,3%', isPositive: true },
    { month: 'T12', name: 'Tháng 12', th2026: 540.0, th2025: 480.0, growth: '+12,5%', isPositive: true }
  ]
};

// Data definitions for Biểu đồ 15 (Xu hướng doanh thu từng tháng so với kế hoạch)
// Trục X: 12 tháng (T1 - T12), Trục Y: 0 - 700 Triệu đồng
export const MONTH_PLAN_TREND_DATA = {
  '2026': [
    { month: 'T1', name: 'Tháng 1', th: 322.6, kh: 322.6, rate: '100%', isPositive: false },
    { month: 'T2', name: 'Tháng 2', th: 294.3, kh: 288.5, rate: '102%', isPositive: true },
    { month: 'T3', name: 'Tháng 3', th: 374.0, kh: 381.6, rate: '98%', isPositive: false },
    { month: 'T4', name: 'Tháng 4', th: 403.5, kh: 391.7, rate: '103%', isPositive: true },
    { month: 'T5', name: 'Tháng 5', th: 402.7, kh: 415.2, rate: '97%', isPositive: false },
    { month: 'T6', name: 'Tháng 6', th: 404.2, kh: 421.0, rate: '96%', isPositive: false },
    { month: 'T7', name: 'Tháng 7', th: 385.1, kh: 405.4, rate: '95%', isPositive: false },
    { month: 'T8', name: 'Tháng 8', th: 389.9, kh: 414.8, rate: '94%', isPositive: false },
    { month: 'T9', name: 'Tháng 9', th: null, kh: 425.0, rate: null, isPositive: null },
    { month: 'T10', name: 'Tháng 10', th: null, kh: 435.0, rate: null, isPositive: null },
    { month: 'T11', name: 'Tháng 11', th: null, kh: 455.0, rate: null, isPositive: null },
    { month: 'T12', name: 'Tháng 12', th: null, kh: 608.0, rate: null, isPositive: null }
  ],
  '2025': [
    { month: 'T1', name: 'Tháng 1', th: 272.0, kh: 270.0, rate: '101%', isPositive: true },
    { month: 'T2', name: 'Tháng 2', th: 254.4, kh: 260.0, rate: '98%', isPositive: false },
    { month: 'T3', name: 'Tháng 3', th: 306.1, kh: 300.0, rate: '102%', isPositive: true },
    { month: 'T4', name: 'Tháng 4', th: 360.9, kh: 350.0, rate: '103%', isPositive: true },
    { month: 'T5', name: 'Tháng 5', th: 369.4, kh: 370.0, rate: '100%', isPositive: false },
    { month: 'T6', name: 'Tháng 6', th: 363.2, kh: 365.0, rate: '100%', isPositive: false },
    { month: 'T7', name: 'Tháng 7', th: 348.5, kh: 360.0, rate: '97%', isPositive: false },
    { month: 'T8', name: 'Tháng 8', th: 364.4, kh: 370.0, rate: '98%', isPositive: false },
    { month: 'T9', name: 'Tháng 9', th: 367.0, kh: 375.0, rate: '98%', isPositive: false },
    { month: 'T10', name: 'Tháng 10', th: 375.0, kh: 380.0, rate: '99%', isPositive: false },
    { month: 'T11', name: 'Tháng 11', th: 408.0, kh: 410.0, rate: '100%', isPositive: false },
    { month: 'T12', name: 'Tháng 12', th: 540.0, kh: 530.0, rate: '102%', isPositive: true }
  ]
};
