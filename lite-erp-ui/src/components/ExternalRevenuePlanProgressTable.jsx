import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

/**
 * Bảng dữ liệu chi tiết cho Biểu đồ 31 – 32:
 * "Tỷ lệ hoàn thành kế hoạch doanh thu ngoài Tập đoàn (lũy kế Quý / lũy kế năm)"
 *
 * Cấu trúc:
 * - Chỉ tiêu
 * - Lũy kế Quý III/2026 (T7-T8) [TH | KH]
 * - Lũy kế năm 2026 (8T) [TH | KH]
 * - Mốc thời gian đã trôi qua [66,7%]
 */
export default function ExternalRevenuePlanProgressTable({
  selectedYear = '2026',
  selectedMonth = 'Tháng 8',
  unit = 'triệu đồng'
}) {
  const [copied, setCopied] = useState(false);

  // Phân tích kỳ
  const monthNum = parseInt(selectedMonth?.match(/\d+/)?.[0] || '8', 10);
  const quarterNum = Math.ceil(monthNum / 3);
  const quarterRoman = ['I', 'II', 'III', 'IV'][quarterNum - 1] || 'III';
  const quarterStartMonth = (quarterNum - 1) * 3 + 1;
  const quarterCumText = quarterStartMonth === monthNum
    ? `T${quarterStartMonth}`
    : `T${quarterStartMonth}-T${monthNum}`;

  // Mốc thời gian đã trôi qua
  const timeElapsedYearPercent = (monthNum / 12) * 100;
  const timeElapsedLabel = (selectedYear === '2026' && monthNum === 8)
    ? '66,7%'
    : `${timeElapsedYearPercent.toFixed(1).replace('.', ',')}%`;

  // Số liệu chuẩn cho 2026 (T8) đồng bộ với Biểu đồ 31 - 32
  const data = {
    quarter: {
      th: '525,0',
      kh: '872,2',
      rateTH: '60,2%',
      rateKH: '100%',
      remainingTH: '347,2',
      remainingKH: '-'
    },
    year: {
      th: '2.022,8',
      kh: '3.477,7',
      rateTH: '58,2%',
      rateKH: '100%',
      remainingTH: '1.454,9',
      remainingKH: '-'
    }
  };

  const handleCopy = () => {
    const headerRow1 = `Chỉ tiêu\tLũy kế Quý ${quarterRoman}/${selectedYear} (${quarterCumText})\t\tLũy kế năm ${selectedYear} (${monthNum}T)\t\tMốc thời gian đã trôi qua`;
    const headerRow2 = `\tTH\tKH\tTH\tKH\t${timeElapsedLabel}`;
    const row1 = `Doanh thu ngoài Tập đoàn KH\t${data.quarter.th}\t${data.quarter.kh}\t${data.year.th}\t${data.year.kh}\t`;
    const row2 = `Tỷ lệ hoàn thành kế hoạch\t${data.quarter.rateTH}\t${data.quarter.rateKH}\t${data.year.rateTH}\t${data.year.rateKH}\t`;
    const row3 = `Còn phải thực hiện để đạt KH (${unit})\t${data.quarter.remainingTH}\t${data.quarter.remainingKH}\t${data.year.remainingTH}\t${data.year.remainingKH}\t`;

    const fullText = [headerRow1, headerRow2, row1, row2, row3].join('\n');
    navigator.clipboard.writeText(fullText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  };

  return (
    <div
      className="external-revenue-plan-table-container"
      style={{
        marginTop: '16px',
        padding: '16px 20px',
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '10px',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
        overflowX: 'auto'
      }}
    >
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '13.5px',
          color: '#0f172a',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}
      >
        <thead>
          {/* Header Row 1 */}
          <tr style={{ borderBottom: '1px solid #cbd5e1' }}>
            <th
              rowSpan={2}
              style={{
                textAlign: 'left',
                padding: '10px 14px',
                fontWeight: '700',
                color: '#0f172a',
                verticalAlign: 'bottom',
                width: '32%',
                fontSize: '14px'
              }}
            >
              Chỉ tiêu
            </th>
            <th
              colSpan={2}
              style={{
                textAlign: 'center',
                padding: '8px 12px 4px',
                fontWeight: '700',
                color: '#0f172a',
                fontSize: '13.5px',
                lineHeight: '1.3'
              }}
            >
              <div>Lũy kế Quý {quarterRoman}/{selectedYear}</div>
              <div style={{ fontWeight: '600', fontSize: '12.5px', color: '#334155' }}>({quarterCumText})</div>
            </th>
            <th
              colSpan={2}
              style={{
                textAlign: 'center',
                padding: '8px 12px 4px',
                fontWeight: '700',
                color: '#0f172a',
                fontSize: '13.5px',
                lineHeight: '1.3'
              }}
            >
              <div>Lũy kế năm {selectedYear}</div>
              <div style={{ fontWeight: '600', fontSize: '12.5px', color: '#334155' }}>({monthNum}T)</div>
            </th>
            <th
              style={{
                textAlign: 'right',
                padding: '8px 14px 4px',
                fontWeight: '700',
                color: '#0f172a',
                fontSize: '13.5px',
                width: '20%'
              }}
            >
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
                <span style={{ lineHeight: '1.3' }}>Mốc thời gian đã trôi qua</span>
                <button
                  type="button"
                  onClick={handleCopy}
                  title="Sao chép bảng"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'none',
                    border: 'none',
                    padding: '3px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    color: copied ? '#16a34a' : '#64748b',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </th>
          </tr>

          {/* Header Row 2 */}
          <tr style={{ borderBottom: '1px solid #cbd5e1' }}>
            {/* TH Quý */}
            <th
              style={{
                textAlign: 'right',
                padding: '8px 14px',
                fontWeight: '700',
                color: '#0f172a',
                fontSize: '13px',
                width: '12%'
              }}
            >
              TH LK Q{quarterRoman}/{selectedYear}
            </th>
            {/* KH Quý */}
            <th
              style={{
                textAlign: 'right',
                padding: '8px 14px',
                fontWeight: '700',
                color: '#0f172a',
                fontSize: '13px',
                width: '12%'
              }}
            >
              KH Q{quarterRoman}/{selectedYear}
            </th>
            {/* TH Năm */}
            <th
              style={{
                textAlign: 'right',
                padding: '8px 14px',
                fontWeight: '700',
                color: '#0f172a',
                fontSize: '13px',
                width: '12%'
              }}
            >
              TH LK {monthNum}T/{selectedYear}
            </th>
            {/* KH Năm */}
            <th
              style={{
                textAlign: 'right',
                padding: '8px 14px',
                fontWeight: '700',
                color: '#0f172a',
                fontSize: '13px',
                width: '12%'
              }}
            >
              KH Cả năm {selectedYear}
            </th>
            {/* 66,7% Mốc thời gian */}
            <th
              style={{
                textAlign: 'right',
                padding: '8px 14px',
                fontWeight: '800',
                color: '#0f172a',
                fontSize: '14px'
              }}
            >
              {timeElapsedLabel}
            </th>
          </tr>
        </thead>

        <tbody>
          {/* Dòng 1: Doanh thu ngoài Tập đoàn KH */}
          <tr
            style={{
              borderBottom: '1px solid #f1f5f9',
              transition: 'background-color 0.15s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <td
              style={{
                padding: '12px 14px',
                fontWeight: '700',
                color: '#0f172a'
              }}
            >
              Doanh thu ngoài Tập đoàn KH
            </td>
            <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: '500', color: '#1e293b' }}>
              {data.quarter.th}
            </td>
            <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: '500', color: '#1e293b' }}>
              {data.quarter.kh}
            </td>
            <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: '500', color: '#1e293b' }}>
              {data.year.th}
            </td>
            <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: '500', color: '#1e293b' }}>
              {data.year.kh}
            </td>
            <td style={{ padding: '12px 14px', textAlign: 'right' }}></td>
          </tr>

          {/* Dòng 2: Tỷ lệ hoàn thành kế hoạch */}
          <tr
            style={{
              borderBottom: '1px solid #f1f5f9',
              transition: 'background-color 0.15s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <td
              style={{
                padding: '12px 14px',
                fontWeight: '700',
                color: '#0f172a'
              }}
            >
              Tỷ lệ hoàn thành kế hoạch
            </td>
            <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: '800', color: '#0f172a' }}>
              {data.quarter.rateTH}
            </td>
            <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: '500', color: '#1e293b' }}>
              {data.quarter.rateKH}
            </td>
            <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: '800', color: '#0f172a' }}>
              {data.year.rateTH}
            </td>
            <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: '500', color: '#1e293b' }}>
              {data.year.rateKH}
            </td>
            <td style={{ padding: '12px 14px', textAlign: 'right' }}></td>
          </tr>

          {/* Dòng 3: Còn phải thực hiện để đạt KH */}
          <tr
            style={{
              borderBottom: '1px solid #cbd5e1',
              transition: 'background-color 0.15s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <td
              style={{
                padding: '12px 14px',
                fontWeight: '700',
                color: '#0f172a'
              }}
            >
              Còn phải thực hiện để đạt KH ({unit})
            </td>
            <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: '500', color: '#1e293b' }}>
              {data.quarter.remainingTH}
            </td>
            <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: '500', color: '#64748b' }}>
              {data.quarter.remainingKH}
            </td>
            <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: '500', color: '#1e293b' }}>
              {data.year.remainingTH}
            </td>
            <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: '500', color: '#64748b' }}>
              {data.year.remainingKH}
            </td>
            <td style={{ padding: '12px 14px', textAlign: 'right' }}></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
