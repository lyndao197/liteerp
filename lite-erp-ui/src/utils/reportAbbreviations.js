// Utility to explain chart abbreviations across all Revenue Report views

export const ABBREVIATION_LIST = [
  { abbr: 'TH', full: 'Thực hiện', desc: 'Số liệu thực tế đạt được trong kỳ báo cáo', group: 'Chỉ số thực hiện & Kế hoạch' },
  { abbr: 'KH', full: 'Kế hoạch', desc: 'Chỉ tiêu kế hoạch được giao trong kỳ', group: 'Chỉ số thực hiện & Kế hoạch' },
  { abbr: 'LK', full: 'Lũy kế', desc: 'Số liệu cộng dồn từ đầu năm hoặc đầu chu kỳ đến kỳ báo cáo', group: 'Chỉ số thực hiện & Kế hoạch' },
  { abbr: 'TH LK', full: 'Thực hiện Lũy kế', desc: 'Tổng số liệu thực tế lũy kế đến kỳ hiện tại (VD: TH LK 8T/2026)', group: 'Chỉ số thực hiện & Kế hoạch' },
  { abbr: 'LK TH', full: 'Lũy kế Thực hiện', desc: 'Tổng số liệu thực tế lũy kế từ đầu năm đến nay', group: 'Chỉ số thực hiện & Kế hoạch' },
  { abbr: 'KH LK', full: 'Kế hoạch Lũy kế', desc: 'Tổng chỉ tiêu kế hoạch lũy kế đến kỳ hiện tại', group: 'Chỉ số thực hiện & Kế hoạch' },
  { abbr: 'Ước', full: 'Ước tính thực hiện', desc: 'Dự báo kết quả thực hiện đến hết kỳ (quý/năm)', group: 'Chỉ số thực hiện & Kế hoạch' },

  { abbr: 'DT', full: 'Doanh thu', desc: 'Doanh thu từ hoạt động sản xuất kinh doanh', group: 'Chỉ tiêu tài chính & Nghiệp vụ' },
  { abbr: 'TĐ', full: 'Tập đoàn', desc: 'Tập đoàn Viettel (DT ngoài TĐ: Doanh thu ngoài Tập đoàn)', group: 'Chỉ tiêu tài chính & Nghiệp vụ' },
  { abbr: 'SPDV', full: 'Sản phẩm - Dịch vụ', desc: 'Các nhóm sản phẩm và dịch vụ kinh doanh', group: 'Chỉ tiêu tài chính & Nghiệp vụ' },
  { abbr: 'LNTT', full: 'Lợi nhuận trước thuế', desc: 'Lợi nhuận thu được trước khi trừ thuế thu nhập doanh nghiệp', group: 'Chỉ tiêu tài chính & Nghiệp vụ' },
  { abbr: 'đ.%', full: 'Điểm phần trăm', desc: 'Độ chênh lệch giữa hai tỷ lệ phần trăm (VD: 70% - 68% = +2,0 đ.%)', group: 'Chỉ tiêu tài chính & Nghiệp vụ' },
  { abbr: 'ĐVT', full: 'Đơn vị tính', desc: 'Đơn vị đo lường (Triệu đồng, %, đ.%)', group: 'Chỉ tiêu tài chính & Nghiệp vụ' },

  { abbr: 'T1 - T12', full: 'Tháng 1 đến Tháng 12', desc: 'Kỳ phân tích theo tháng trong năm (VD: T8 = Tháng 8)', group: 'Kỳ thời gian' },
  { abbr: 'Q1 - Q4', full: 'Quý I đến Quý IV', desc: 'Kỳ phân tích theo quý trong năm (VD: Q3 = Quý III)', group: 'Kỳ thời gian' },
  { abbr: '8T, 6T, 12T', full: 'Lũy kế số tháng', desc: 'Số tháng tính lũy kế trong năm (VD: 8T = Lũy kế 8 tháng)', group: 'Kỳ thời gian' }
];

export function explainLegend(legend) {
  if (!legend) return '';
  const s = String(legend).trim();

  // Year patterns
  if (s.startsWith('TH LK') || s.startsWith('LK TH')) {
    const code = s.replace(/^(TH LK|LK TH)/, '').trim();
    return `Thực hiện Lũy kế ${code ? `(${code}: ${explainTimeCode(code)})` : ''}`.trim();
  }
  if (s.startsWith('KH LK')) {
    const code = s.replace('KH LK', '').trim();
    return `Kế hoạch Lũy kế ${code ? `(${code}: ${explainTimeCode(code)})` : ''}`.trim();
  }
  if (s === 'KH' || s === 'Kế hoạch') return 'Kế hoạch';
  if (s === 'KH năm') return 'Kế hoạch cả năm';

  // Month patterns
  if (s.startsWith('TH T')) {
    const part = s.replace('TH', '').trim();
    return `Thực hiện ${part.includes('/') ? `${part} (Cùng kỳ năm trước)` : `Tháng ${part.replace('T', '')}`}`;
  }
  if (s.startsWith('KH T')) {
    const part = s.replace('KH', '').trim();
    return `Kế hoạch ${part.includes('/') ? part : `Tháng ${part.replace('T', '')}`}`;
  }

  // Quarter patterns
  if (s.startsWith('LK Q') || s.startsWith('LK TH Q')) {
    const q = s.replace(/LK|TH/g, '').trim();
    return `Lũy kế Thực hiện Quý ${q.replace('Q', '')}`;
  }
  if (s.startsWith('KH LK Q')) {
    const q = s.replace('KH LK', '').trim();
    return `Kế hoạch Lũy kế Quý ${q.replace('Q', '')}`;
  }
  if (s.startsWith('Ước')) {
    const rest = s.replace('Ước', '').trim();
    if (rest.startsWith('Q')) {
      return `Ước tính thực hiện ${rest.includes('/') ? `Quý ${rest.replace('Q', '')}` : `Quý ${rest.replace('Q', '')}`}`;
    }
    return `Ước tính thực hiện ${rest ? `năm ${rest}` : 'cả năm'}`.trim();
  }
  if (s.startsWith('KH') && /^\d{4}$/.test(s.replace('KH', '').trim())) {
    const yr = s.replace('KH', '').trim();
    return `Kế hoạch năm ${yr}`;
  }

  return s;
}

export function explainTimeCode(code) {
  if (!code) return '';
  const c = String(code).trim();
  if (c.endsWith('T')) {
    const num = c.replace('T', '');
    return `${num} tháng`;
  }
  if (c.startsWith('Q')) {
    return `Quý ${c.replace('Q', '')}`;
  }
  return c;
}

export function explainCategory(name) {
  if (!name) return '';
  const n = String(name).trim();
  if (n.includes('ngoài TĐ') || n.includes('ngoài Tập đoàn')) {
    return `${n}: Doanh thu ngoài Tập đoàn (TĐ = Tập đoàn)`;
  }
  if (n.includes('nội bộ')) {
    return `${n}: Doanh thu nội bộ Tập đoàn`;
  }
  if (n.includes('quốc tế')) {
    return `${n}: Doanh thu thị trường quốc tế`;
  }
  if (n.includes('Tổng')) {
    return `${n}: Tổng doanh thu các mảng sản phẩm dịch vụ`;
  }
  if (n.includes('LNTT') || n.includes('Lợi nhuận')) {
    return `${n}: Lợi nhuận trước thuế`;
  }
  if (n.includes('đ.%') || n.includes('điểm %')) {
    return 'Điểm phần trăm (Độ chênh lệch giữa hai tỷ số phần trăm)';
  }
  return n;
}
