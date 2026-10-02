import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { DOMESTIC_INTERNATIONAL_DATA } from '../data/revenueInternalExternalData';

/**
 * Bảng dữ liệu chi tiết của biểu đồ Cơ cấu doanh thu trong nước và doanh thu quốc tế (Biểu đồ 27 – 28)
 * Hiển thị số liệu 3 kỳ: Tháng, Quý, Năm (TH vs KH & Tỷ trọng)
 */
export default function DomesticInternationalDetailTable({
  selectedYear = '2026',
  selectedMonth = 'Tháng 8'
}) {
  const [copied, setCopied] = useState(false);

  const monthNum = parseInt(selectedMonth?.match(/\d+/)?.[0] || '8', 10);
  const quarterNum = Math.ceil(monthNum / 3);
  const quarterRoman = ['I', 'II', 'III', 'IV'][quarterNum - 1] || 'III';
  const quarterStartMonth = (quarterNum - 1) * 3 + 1;
  const quarterCumText = quarterStartMonth === monthNum
    ? `T${quarterStartMonth}`
    : `T${quarterStartMonth}-T${monthNum}`;

  // Chuẩn số liệu cố định cho 2026 đồng bộ chính xác với Biểu đồ 27 - 28
  const data2026 = {
    month: {
      total: { th: '389,9', kh: '414,0' },
      domestic: { th: '347,1', kh: '369,0', thRate: '89,0%', khRate: '89,1%' },
      international: { th: '42,8', kh: '45,0', thRate: '11,0%', khRate: '10,9%' }
    },
    quarter: {
      total: { th: '775,0', kh: '1.246,0' },
      domestic: { th: '692,9', kh: '1.096,5', thRate: '89,4%', khRate: '88,0%' },
      international: { th: '82,1', kh: '149,5', thRate: '10,6%', khRate: '12,0%' }
    },
    year: {
      total: { th: '2.976,3', kh: '4.968,1' },
      domestic: { th: '2.663,8', kh: '4.421,6', thRate: '89,5%', khRate: '89,0%' },
      international: { th: '312,5', kh: '546,5', thRate: '10,5%', khRate: '11,0%' }
    }
  };

  // Helper format cho các năm khác nếu chuyển đổi
  const formatNum = (v) => {
    if (v === undefined || v === null) return '—';
    return Number(v).toLocaleString('vi-VN', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    });
  };

  const getDynamicPeriodData = (periodKey) => {
    const yearObj = DOMESTIC_INTERNATIONAL_DATA[selectedYear] || DOMESTIC_INTERNATIONAL_DATA['2026'];
    const pUpper = periodKey.charAt(0).toUpperCase() + periodKey.slice(1);
    const th = yearObj[`th${pUpper}`];
    const kh = yearObj[`kh${pUpper}`];

    const domThSlice = th?.slices?.find(s => s.name.includes('trong nước')) || {};
    const domKhSlice = kh?.slices?.find(s => s.name.includes('trong nước')) || {};
    const intlThSlice = th?.slices?.find(s => s.name.includes('quốc tế')) || {};
    const intlKhSlice = kh?.slices?.find(s => s.name.includes('quốc tế')) || {};

    return {
      total: {
        th: th?.formattedTotal || formatNum(th?.total),
        kh: kh?.formattedTotal || formatNum(kh?.total)
      },
      domestic: {
        th: formatNum(domThSlice.value),
        kh: formatNum(domKhSlice.value),
        thRate: domThSlice.formattedPercent || '0,0%',
        khRate: domKhSlice.formattedPercent || '0,0%'
      },
      international: {
        th: formatNum(intlThSlice.value),
        kh: formatNum(intlKhSlice.value),
        thRate: intlThSlice.formattedPercent || '0,0%',
        khRate: intlKhSlice.formattedPercent || '0,0%'
      }
    };
  };

  const tableData = selectedYear === '2026' ? data2026 : {
    month: getDynamicPeriodData('month'),
    quarter: getDynamicPeriodData('quarter'),
    year: getDynamicPeriodData('year')
  };

  const handleCopyTable = () => {
    const textLines = [
      `Chỉ tiêu\tTháng ${monthNum}/${selectedYear} (TH)\tTháng ${monthNum}/${selectedYear} (KH)\tQuý ${quarterRoman}/${selectedYear} (TH)\tQuý ${quarterRoman}/${selectedYear} (KH)\tNăm ${selectedYear} (TH)\tNăm ${selectedYear} (KH)`,
      `Tổng doanh thu\t${tableData.month.total.th}\t${tableData.month.total.kh}\t${tableData.quarter.total.th}\t${tableData.quarter.total.kh}\t${tableData.year.total.th}\t${tableData.year.total.kh}`,
      `DT trong nước\t${tableData.month.domestic.th}\t${tableData.month.domestic.kh}\t${tableData.quarter.domestic.th}\t${tableData.quarter.domestic.kh}\t${tableData.year.domestic.th}\t${tableData.year.domestic.kh}`,
      `Tỷ trọng DT trong nước\t${tableData.month.domestic.thRate}\t${tableData.month.domestic.khRate}\t${tableData.quarter.domestic.thRate}\t${tableData.quarter.domestic.khRate}\t${tableData.year.domestic.thRate}\t${tableData.year.domestic.khRate}`,
      `DT quốc tế\t${tableData.month.international.th}\t${tableData.month.international.kh}\t${tableData.quarter.international.th}\t${tableData.quarter.international.kh}\t${tableData.year.international.th}\t${tableData.year.international.kh}`,
      `Tỷ trọng DT quốc tế\t${tableData.month.international.thRate}\t${tableData.month.international.khRate}\t${tableData.quarter.international.thRate}\t${tableData.quarter.international.khRate}\t${tableData.year.international.thRate}\t${tableData.year.international.khRate}`
    ];

    navigator.clipboard.writeText(textLines.join('\n')).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  };

  return (
    <div
      className="dom-intl-detail-table-card"
      style={{
        marginTop: '16px',
        padding: '16px 20px',
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '10px',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)'
      }}
    >
      {/* Header bar with title and copy button */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px',
          paddingBottom: '10px',
          borderBottom: '1px solid #f1f5f9'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              fontSize: '13.5px',
              fontWeight: '700',
              color: '#0f172a'
            }}
          >
            Bảng dữ liệu chi tiết – Cơ cấu doanh thu trong nước và doanh thu quốc tế
          </span>
          <span
            style={{
              fontSize: '12px',
              color: '#64748b',
              fontWeight: '500'
            }}
          >
            (Đơn vị: Triệu đồng)
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopyTable}
          title="Sao chép bảng dữ liệu"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 10px',
            backgroundColor: copied ? '#ecfdf5' : '#f8fafc',
            border: `1px solid ${copied ? '#a7f3d0' : '#cbd5e1'}`,
            borderRadius: '6px',
            color: copied ? '#059669' : '#475569',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          <span>{copied ? 'Đã chép' : 'Sao chép'}</span>
        </button>
      </div>

      {/* Main Table view */}
      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: '13px'
          }}
        >
          <thead>
            {/* Hàng 1 tiêu đề kỳ */}
            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
              <th
                rowSpan={2}
                style={{
                  textAlign: 'left',
                  padding: '12px 14px',
                  fontWeight: '700',
                  color: '#0f172a',
                  minWidth: '200px',
                  backgroundColor: '#ffffff'
                }}
              >
                Chỉ tiêu
              </th>

              {/* Tháng */}
              <th
                colSpan={2}
                style={{
                  textAlign: 'center',
                  padding: '10px 14px',
                  fontWeight: '700',
                  color: '#0f172a',
                  backgroundColor: '#ffffff',
                  borderLeft: '1px solid #f1f5f9'
                }}
              >
                Tháng {monthNum}/{selectedYear}
              </th>

              {/* Quý */}
              <th
                colSpan={2}
                style={{
                  textAlign: 'center',
                  padding: '10px 14px',
                  fontWeight: '700',
                  color: '#0f172a',
                  backgroundColor: '#ffffff',
                  borderLeft: '1px solid #f1f5f9'
                }}
              >
                <div>Quý {quarterRoman}/{selectedYear}</div>
                <div style={{ fontSize: '11.5px', fontWeight: '500', color: '#64748b' }}>
                  (lũy kế {quarterCumText})
                </div>
              </th>

              {/* Năm */}
              <th
                colSpan={2}
                style={{
                  textAlign: 'center',
                  padding: '10px 14px',
                  fontWeight: '700',
                  color: '#0f172a',
                  backgroundColor: '#ffffff',
                  borderLeft: '1px solid #f1f5f9'
                }}
              >
                <div>Năm {selectedYear}</div>
                <div style={{ fontSize: '11.5px', fontWeight: '500', color: '#64748b' }}>
                  (lũy kế {monthNum}T)
                </div>
              </th>
            </tr>

            {/* Hàng 2 tiêu đề TH / KH */}
            <tr style={{ borderBottom: '1.5px solid #cbd5e1' }}>
              <th style={{ textAlign: 'right', padding: '8px 14px', fontWeight: '700', color: '#0f172a', width: '105px', borderLeft: '1px solid #f1f5f9' }}>
                TH
              </th>
              <th style={{ textAlign: 'right', padding: '8px 14px', fontWeight: '700', color: '#0f172a', width: '105px' }}>
                KH
              </th>

              <th style={{ textAlign: 'right', padding: '8px 14px', fontWeight: '700', color: '#0f172a', width: '105px', borderLeft: '1px solid #f1f5f9' }}>
                TH
              </th>
              <th style={{ textAlign: 'right', padding: '8px 14px', fontWeight: '700', color: '#0f172a', width: '105px' }}>
                KH
              </th>

              <th style={{ textAlign: 'right', padding: '8px 14px', fontWeight: '700', color: '#0f172a', width: '115px', borderLeft: '1px solid #f1f5f9' }}>
                TH
              </th>
              <th style={{ textAlign: 'right', padding: '8px 14px', fontWeight: '700', color: '#0f172a', width: '115px' }}>
                KH
              </th>
            </tr>
          </thead>

          <tbody>
            {/* DÒNG 1: TỔNG DOANH THU */}
            <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={{ padding: '12px 14px', fontWeight: '800', color: '#0f172a' }}>
                Tổng doanh thu
              </td>
              {/* Tháng */}
              <td style={{ textAlign: 'right', padding: '12px 14px', fontWeight: '700', color: '#0f172a', borderLeft: '1px solid #f1f5f9' }}>
                {tableData.month.total.th}
              </td>
              <td style={{ textAlign: 'right', padding: '12px 14px', fontWeight: '700', color: '#1e293b' }}>
                {tableData.month.total.kh}
              </td>
              {/* Quý */}
              <td style={{ textAlign: 'right', padding: '12px 14px', fontWeight: '700', color: '#0f172a', borderLeft: '1px solid #f1f5f9' }}>
                {tableData.quarter.total.th}
              </td>
              <td style={{ textAlign: 'right', padding: '12px 14px', fontWeight: '700', color: '#1e293b' }}>
                {tableData.quarter.total.kh}
              </td>
              {/* Năm */}
              <td style={{ textAlign: 'right', padding: '12px 14px', fontWeight: '700', color: '#0f172a', borderLeft: '1px solid #f1f5f9' }}>
                {tableData.year.total.th}
              </td>
              <td style={{ textAlign: 'right', padding: '12px 14px', fontWeight: '700', color: '#1e293b' }}>
                {tableData.year.total.kh}
              </td>
            </tr>

            {/* DÒNG 2: DT TRONG NƯỚC */}
            <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={{ padding: '12px 14px', fontWeight: '700', color: '#0f172a' }}>
                DT trong nước
              </td>
              {/* Tháng */}
              <td style={{ textAlign: 'right', padding: '12px 14px', fontWeight: '600', color: '#0f172a', borderLeft: '1px solid #f1f5f9' }}>
                {tableData.month.domestic.th}
              </td>
              <td style={{ textAlign: 'right', padding: '12px 14px', fontWeight: '500', color: '#334155' }}>
                {tableData.month.domestic.kh}
              </td>
              {/* Quý */}
              <td style={{ textAlign: 'right', padding: '12px 14px', fontWeight: '600', color: '#0f172a', borderLeft: '1px solid #f1f5f9' }}>
                {tableData.quarter.domestic.th}
              </td>
              <td style={{ textAlign: 'right', padding: '12px 14px', fontWeight: '500', color: '#334155' }}>
                {tableData.quarter.domestic.kh}
              </td>
              {/* Năm */}
              <td style={{ textAlign: 'right', padding: '12px 14px', fontWeight: '600', color: '#0f172a', borderLeft: '1px solid #f1f5f9' }}>
                {tableData.year.domestic.th}
              </td>
              <td style={{ textAlign: 'right', padding: '12px 14px', fontWeight: '500', color: '#334155' }}>
                {tableData.year.domestic.kh}
              </td>
            </tr>

            {/* DÒNG 3: TỶ TRỌNG DT TRONG NƯỚC */}
            <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={{ padding: '12px 14px', color: '#334155', fontWeight: '500' }}>
                Tỷ trọng DT trong nước
              </td>
              {/* Tháng */}
              <td style={{ textAlign: 'right', padding: '12px 14px', fontWeight: '700', color: '#0f172a', borderLeft: '1px solid #f1f5f9' }}>
                {tableData.month.domestic.thRate}
              </td>
              <td style={{ textAlign: 'right', padding: '12px 14px', fontWeight: '700', color: '#0f172a' }}>
                {tableData.month.domestic.khRate}
              </td>
              {/* Quý */}
              <td style={{ textAlign: 'right', padding: '12px 14px', fontWeight: '700', color: '#0f172a', borderLeft: '1px solid #f1f5f9' }}>
                {tableData.quarter.domestic.thRate}
              </td>
              <td style={{ textAlign: 'right', padding: '12px 14px', fontWeight: '700', color: '#0f172a' }}>
                {tableData.quarter.domestic.khRate}
              </td>
              {/* Năm */}
              <td style={{ textAlign: 'right', padding: '12px 14px', fontWeight: '700', color: '#0f172a', borderLeft: '1px solid #f1f5f9' }}>
                {tableData.year.domestic.thRate}
              </td>
              <td style={{ textAlign: 'right', padding: '12px 14px', fontWeight: '700', color: '#0f172a' }}>
                {tableData.year.domestic.khRate}
              </td>
            </tr>

            {/* DÒNG 4: DT QUỐC TẾ */}
            <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={{ padding: '12px 14px', fontWeight: '700', color: '#0f172a' }}>
                DT quốc tế
              </td>
              {/* Tháng */}
              <td style={{ textAlign: 'right', padding: '12px 14px', fontWeight: '600', color: '#0f172a', borderLeft: '1px solid #f1f5f9' }}>
                {tableData.month.international.th}
              </td>
              <td style={{ textAlign: 'right', padding: '12px 14px', fontWeight: '500', color: '#334155' }}>
                {tableData.month.international.kh}
              </td>
              {/* Quý */}
              <td style={{ textAlign: 'right', padding: '12px 14px', fontWeight: '600', color: '#0f172a', borderLeft: '1px solid #f1f5f9' }}>
                {tableData.quarter.international.th}
              </td>
              <td style={{ textAlign: 'right', padding: '12px 14px', fontWeight: '500', color: '#334155' }}>
                {tableData.quarter.international.kh}
              </td>
              {/* Năm */}
              <td style={{ textAlign: 'right', padding: '12px 14px', fontWeight: '600', color: '#0f172a', borderLeft: '1px solid #f1f5f9' }}>
                {tableData.year.international.th}
              </td>
              <td style={{ textAlign: 'right', padding: '12px 14px', fontWeight: '500', color: '#334155' }}>
                {tableData.year.international.kh}
              </td>
            </tr>

            {/* DÒNG 5: TỶ TRỌNG DT QUỐC TẾ */}
            <tr>
              <td style={{ padding: '12px 14px', color: '#334155', fontWeight: '500' }}>
                Tỷ trọng DT quốc tế
              </td>
              {/* Tháng */}
              <td style={{ textAlign: 'right', padding: '12px 14px', fontWeight: '700', color: '#0f172a', borderLeft: '1px solid #f1f5f9' }}>
                {tableData.month.international.thRate}
              </td>
              <td style={{ textAlign: 'right', padding: '12px 14px', fontWeight: '700', color: '#0f172a' }}>
                {tableData.month.international.khRate}
              </td>
              {/* Quý */}
              <td style={{ textAlign: 'right', padding: '12px 14px', fontWeight: '700', color: '#0f172a', borderLeft: '1px solid #f1f5f9' }}>
                {tableData.quarter.international.thRate}
              </td>
              <td style={{ textAlign: 'right', padding: '12px 14px', fontWeight: '700', color: '#0f172a' }}>
                {tableData.quarter.international.khRate}
              </td>
              {/* Năm */}
              <td style={{ textAlign: 'right', padding: '12px 14px', fontWeight: '700', color: '#0f172a', borderLeft: '1px solid #f1f5f9' }}>
                {tableData.year.international.thRate}
              </td>
              <td style={{ textAlign: 'right', padding: '12px 14px', fontWeight: '700', color: '#0f172a' }}>
                {tableData.year.international.khRate}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
