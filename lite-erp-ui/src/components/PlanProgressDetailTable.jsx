import React, { useState, useMemo } from 'react';
import { CheckCircle2, XCircle, TableProperties } from 'lucide-react';
import {
  INTERNAL_EXTERNAL_CATEGORIES,
  INTERNAL_EXTERNAL_DATA,
  DOMESTIC_INTERNATIONAL_CATEGORIES,
  DOMESTIC_INTERNATIONAL_DATA
} from '../data/revenueInternalExternalData';
import './SpdvDetailTable.css';

export default function PlanProgressDetailTable({
  selectedYear = '2026',
  selectedMonth = 'Tháng 8',
  initialPeriod = null,
  activeChartKey = null,
  chartTitle = ''
}) {
  const monthNum = parseInt(selectedMonth?.match(/\d+/)?.[0] || '8', 10);
  const quarterNum = Math.ceil(monthNum / 3);
  const quarterRoman = ['I', 'II', 'III', 'IV'][quarterNum - 1] || 'III';
  const quarterStartMonth = (quarterNum - 1) * 3 + 1;
  const quarterCumText = quarterStartMonth === monthNum
    ? `T${quarterStartMonth}`
    : `T${quarterStartMonth}-T${monthNum}`;

  // Default active tab based on activeChartKey or initialPeriod
  const defaultTab = useMemo(() => {
    if (initialPeriod) return initialPeriod;
    const key = (activeChartKey || '').toLowerCase();
    const title = (chartTitle || '').toLowerCase();
    if (key.includes('quarter') || title.includes('quý')) return 'quarter';
    if (key.includes('year') || title.includes('năm')) return 'year';
    return 'month';
  }, [initialPeriod, activeChartKey, chartTitle]);

  const [activeTab, setActiveTab] = useState(defaultTab);

  const formatNum = (val) => {
    if (val === null || val === undefined) return '—';
    if (typeof val === 'string') return val;
    return Number(val).toLocaleString('vi-VN', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    });
  };

  // Data sets for current year
  const inExYearData = INTERNAL_EXTERNAL_DATA[selectedYear] || INTERNAL_EXTERNAL_DATA['2026'];
  const domIntlYearData = DOMESTIC_INTERNATIONAL_DATA[selectedYear] || DOMESTIC_INTERNATIONAL_DATA['2026'];

  // Helper to build rows for a specific period
  const buildPeriodData = (periodKey) => {
    // 1. Internal - External data
    const inExTh = inExYearData[`th${periodKey.charAt(0).toUpperCase() + periodKey.slice(1)}`];
    const inExKh = inExYearData[`kh${periodKey.charAt(0).toUpperCase() + periodKey.slice(1)}`];

    // Find slices
    const extTh = inExTh?.slices?.find(s => s.name.includes('ngoài')) || { value: 0, formattedPercent: '0%' };
    const extKh = inExKh?.slices?.find(s => s.name.includes('ngoài')) || { value: 0, formattedPercent: '0%' };
    const intTh = inExTh?.slices?.find(s => s.name.includes('nội bộ')) || { value: 0, formattedPercent: '0%' };
    const intKh = inExKh?.slices?.find(s => s.name.includes('nội bộ')) || { value: 0, formattedPercent: '0%' };

    const inExRows = [
      {
        id: 'external',
        stt: 1,
        name: 'Doanh thu ngoài Tập đoàn',
        color: '#EE0033',
        kh: extKh.value,
        th: extTh.value,
        diff: Number((extTh.value - extKh.value).toFixed(1)),
        rate: extKh.value > 0 ? (extTh.value / extKh.value) * 100 : 0,
        khShare: extKh.formattedPercent,
        thShare: extTh.formattedPercent
      },
      {
        id: 'internal',
        stt: 2,
        name: 'Doanh thu nội bộ',
        color: '#64748b',
        kh: intKh.value,
        th: intTh.value,
        diff: Number((intTh.value - intKh.value).toFixed(1)),
        rate: intKh.value > 0 ? (intTh.value / intKh.value) * 100 : 0,
        khShare: intKh.formattedPercent,
        thShare: intTh.formattedPercent
      }
    ];

    const inExTotal = {
      kh: inExKh?.total || 0,
      th: inExTh?.total || 0,
      diff: Number(((inExTh?.total || 0) - (inExKh?.total || 0)).toFixed(1)),
      rate: (inExKh?.total || 0) > 0 ? ((inExTh?.total || 0) / (inExKh?.total || 1)) * 100 : 0,
      khShare: '100,0%',
      thShare: '100,0%'
    };

    // 2. Domestic - International data
    const domIntlTh = domIntlYearData[`th${periodKey.charAt(0).toUpperCase() + periodKey.slice(1)}`];
    const domIntlKh = domIntlYearData[`kh${periodKey.charAt(0).toUpperCase() + periodKey.slice(1)}`];

    const domTh = domIntlTh?.slices?.find(s => s.name.includes('trong nước')) || { value: 0, formattedPercent: '0%' };
    const domKh = domIntlKh?.slices?.find(s => s.name.includes('trong nước')) || { value: 0, formattedPercent: '0%' };
    const intlTh = domIntlTh?.slices?.find(s => s.name.includes('quốc tế')) || { value: 0, formattedPercent: '0%' };
    const intlKh = domIntlKh?.slices?.find(s => s.name.includes('quốc tế')) || { value: 0, formattedPercent: '0%' };

    const domIntlRows = [
      {
        id: 'domestic',
        stt: 1,
        name: 'Doanh thu trong nước',
        color: '#0284c7',
        kh: domKh.value,
        th: domTh.value,
        diff: Number((domTh.value - domKh.value).toFixed(1)),
        rate: domKh.value > 0 ? (domTh.value / domKh.value) * 100 : 0,
        khShare: domKh.formattedPercent,
        thShare: domTh.formattedPercent
      },
      {
        id: 'international',
        stt: 2,
        name: 'Doanh thu quốc tế',
        color: '#ea580c',
        kh: intlKh.value,
        th: intlTh.value,
        diff: Number((intlTh.value - intlKh.value).toFixed(1)),
        rate: intlKh.value > 0 ? (intlTh.value / intlKh.value) * 100 : 0,
        khShare: intlKh.formattedPercent,
        thShare: intlTh.formattedPercent
      }
    ];

    const domIntlTotal = {
      kh: domIntlKh?.total || 0,
      th: domIntlTh?.total || 0,
      diff: Number(((domIntlTh?.total || 0) - (domIntlKh?.total || 0)).toFixed(1)),
      rate: (domIntlKh?.total || 0) > 0 ? ((domIntlTh?.total || 0) / (domIntlKh?.total || 1)) * 100 : 0,
      khShare: '100,0%',
      thShare: '100,0%'
    };

    return {
      inExRows,
      inExTotal,
      domIntlRows,
      domIntlTotal
    };
  };

  const periodData = useMemo(() => {
    if (activeTab === 'summary') return null;
    return buildPeriodData(activeTab);
  }, [activeTab, inExYearData, domIntlYearData]);

  // Data for 3-period summary matrix
  const summary3PeriodsData = useMemo(() => {
    const month = buildPeriodData('month');
    const quarter = buildPeriodData('quarter');
    const year = buildPeriodData('year');

    return {
      month,
      quarter,
      year
    };
  }, [inExYearData, domIntlYearData]);

  const activePeriodTitle = useMemo(() => {
    if (activeTab === 'month') return `Tháng ${monthNum}/${selectedYear}`;
    if (activeTab === 'quarter') return `Quý ${quarterRoman}/${selectedYear} (lũy kế ${quarterCumText})`;
    if (activeTab === 'year') return `Năm ${selectedYear} (lũy kế ${monthNum}T)`;
    return `Tổng hợp 3 kỳ (Tháng, Quý, Năm ${selectedYear})`;
  }, [activeTab, monthNum, selectedYear, quarterRoman, quarterCumText]);

  return (
    <div className="spdv-detail-table-card" style={{ marginTop: '16px' }}>
      {/* Header bar with title and period switcher tabs */}
      <div className="spdv-detail-header-wrap">
        <div className="spdv-header-title-box">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="spdv-badge-chart-label" style={{ backgroundColor: '#fef2f2', color: '#dc2626', borderColor: '#fecaca' }}>
              Nhóm biểu đồ số 7
            </span>
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#64748b' }}>
              Biểu đồ 25 – 28
            </span>
          </div>
          <h3 className="spdv-detail-title">
            Bảng mô tả số liệu chuyển dịch doanh thu ngoài và doanh thu quốc tế
          </h3>
          <span className="spdv-detail-unit">
            Kỳ báo cáo: <strong style={{ color: '#0f172a' }}>{activePeriodTitle}</strong> (Đơn vị tính: Triệu đồng)
          </span>
        </div>

        {/* Period Switching Tabs */}
        <div className="spdv-header-actions">
          <div className="spdv-period-tab-group">
            <button
              type="button"
              className={`spdv-period-tab-btn ${activeTab === 'month' ? 'active' : ''}`}
              onClick={() => setActiveTab('month')}
            >
              Tháng {monthNum}/{selectedYear}
            </button>
            <button
              type="button"
              className={`spdv-period-tab-btn ${activeTab === 'quarter' ? 'active' : ''}`}
              onClick={() => setActiveTab('quarter')}
            >
              Quý {quarterRoman}/{selectedYear}
            </button>
            <button
              type="button"
              className={`spdv-period-tab-btn ${activeTab === 'year' ? 'active' : ''}`}
              onClick={() => setActiveTab('year')}
            >
              Năm {selectedYear}
            </button>
            <button
              type="button"
              className={`spdv-period-tab-btn ${activeTab === 'summary' ? 'active' : ''}`}
              onClick={() => setActiveTab('summary')}
            >
              <TableProperties size={14} />
              Tổng hợp 3 kỳ
            </button>
          </div>
        </div>
      </div>

      {activeTab !== 'summary' && periodData ? (
        /* ===================================================================== */
        /* 1. SINGLE PERIOD TABLE (THÁNG / QUÝ / NĂM)                             */
        /* Chuẩn cột: KH | TH | +/- so KH | % HTKH | Tỷ trọng KH | Tỷ trọng TH     */
        /* ===================================================================== */
        <div className="spdv-detail-table-wrap">
          <table className="spdv-b18-table">
            <thead>
              <tr className="spdv-b18-thead-row">
                <th style={{ width: '50px', textAlign: 'center' }}>STT</th>
                <th style={{ textAlign: 'left', minWidth: '240px' }}>Chỉ tiêu cơ cấu doanh thu</th>
                <th style={{ width: '85px', textAlign: 'center' }}>Đơn vị</th>
                <th style={{ width: '130px', textAlign: 'right', fontWeight: '700' }}>KH</th>
                <th style={{ width: '130px', textAlign: 'right', fontWeight: '700' }}>TH</th>
                <th style={{ width: '125px', textAlign: 'right' }}>
                  <div className="spdv-th-two-line">
                    <span className="spdv-th-main font-bold">+/-</span>
                    <span className="spdv-th-sub font-bold">so KH</span>
                  </div>
                </th>
                <th style={{ width: '125px', textAlign: 'center' }}>
                  <div className="spdv-th-two-line">
                    <span className="spdv-th-main font-bold">%</span>
                    <span className="spdv-th-sub font-bold">HTKH</span>
                  </div>
                </th>
                <th style={{ width: '110px', textAlign: 'center' }}>
                  <div className="spdv-th-two-line">
                    <span className="spdv-th-main">Tỷ trọng KH</span>
                    <span className="spdv-th-sub">% cơ cấu</span>
                  </div>
                </th>
                <th style={{ width: '110px', textAlign: 'center' }}>
                  <div className="spdv-th-two-line">
                    <span className="spdv-th-main">Tỷ trọng TH</span>
                    <span className="spdv-th-sub">% cơ cấu</span>
                  </div>
                </th>
                <th style={{ width: '110px', textAlign: 'center' }}>Đánh giá</th>
              </tr>
            </thead>
            <tbody>
              {/* SECTION 1: NỘI BỘ VÀ NGOÀI TẬP ĐOÀN */}
              <tr style={{ backgroundColor: '#f8fafc' }}>
                <td colSpan={10} style={{ padding: '10px 16px', fontWeight: '800', color: '#1e293b', fontSize: '13.5px', borderTop: '1px solid #cbd5e1', borderBottom: '1px solid #e2e8f0' }}>
                  I. Biểu đồ 25 & 26: Cơ cấu doanh thu nội bộ và ngoài Tập đoàn
                </td>
              </tr>
              {periodData.inExRows.map((row) => {
                const isPass = row.rate >= 100;
                return (
                  <tr key={`in-ex-${row.id}`} className="spdv-row">
                    <td style={{ textAlign: 'center', fontWeight: '600', color: '#64748b' }}>
                      {row.stt}
                    </td>
                    <td className="spdv-td-name">
                      <span className="spdv-dot" style={{ backgroundColor: row.color }}></span>
                      <span className="spdv-name-label font-medium">{row.name}</span>
                    </td>
                    <td style={{ textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
                      Triệu đồng
                    </td>
                    <td className="spdv-td-num font-semibold" style={{ color: '#334155' }}>
                      {formatNum(row.kh)}
                    </td>
                    <td className="spdv-td-num font-bold" style={{ color: '#0f172a' }}>
                      {formatNum(row.th)}
                    </td>
                    <td className="spdv-td-num">
                      <span className={`spdv-diff-val ${row.diff >= 0 ? 'positive' : 'negative'}`}>
                        {row.diff >= 0 ? `+${formatNum(row.diff)}` : formatNum(row.diff)}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`spdv-rate-val ${isPass ? 'pass' : 'fail'}`}>
                        {row.rate.toFixed(1).replace('.', ',')}%
                      </span>
                    </td>
                    <td style={{ textAlign: 'center', color: '#475569', fontWeight: '500' }}>
                      {row.khShare}
                    </td>
                    <td style={{ textAlign: 'center', color: '#0f172a', fontWeight: '600' }}>
                      {row.thShare}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`spdv-badge ${isPass ? 'pass' : 'fail'}`}>
                        {isPass ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                        <span>{isPass ? 'Đạt' : 'Chưa đạt'}</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
              {/* Subtotal Section 1 */}
              <tr style={{ backgroundColor: '#f1f5f9', fontWeight: '700' }}>
                <td style={{ textAlign: 'center', color: '#64748b' }}>Σ</td>
                <td style={{ color: '#0f172a', paddingLeft: '16px' }}>Tổng doanh thu (B25 & B26)</td>
                <td style={{ textAlign: 'center', color: '#64748b' }}>Triệu đồng</td>
                <td style={{ textAlign: 'right', color: '#1e293b' }}>{formatNum(periodData.inExTotal.kh)}</td>
                <td style={{ textAlign: 'right', color: '#0f172a' }}>{formatNum(periodData.inExTotal.th)}</td>
                <td style={{ textAlign: 'right' }}>
                  <span className={`spdv-diff-val ${periodData.inExTotal.diff >= 0 ? 'positive' : 'negative'}`}>
                    {periodData.inExTotal.diff >= 0 ? `+${formatNum(periodData.inExTotal.diff)}` : formatNum(periodData.inExTotal.diff)}
                  </span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span className={`spdv-rate-val ${periodData.inExTotal.rate >= 100 ? 'pass' : 'fail'}`}>
                    {periodData.inExTotal.rate.toFixed(1).replace('.', ',')}%
                  </span>
                </td>
                <td style={{ textAlign: 'center' }}>100,0%</td>
                <td style={{ textAlign: 'center' }}>100,0%</td>
                <td style={{ textAlign: 'center' }}>
                  <span className={`spdv-badge ${periodData.inExTotal.rate >= 100 ? 'pass' : 'fail'}`}>
                    {periodData.inExTotal.rate >= 100 ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                    <span>{periodData.inExTotal.rate >= 100 ? 'Đạt' : 'Chưa đạt'}</span>
                  </span>
                </td>
              </tr>

              {/* SECTION 2: TRONG NƯỚC VÀ QUỐC TẾ */}
              <tr style={{ backgroundColor: '#f8fafc' }}>
                <td colSpan={10} style={{ padding: '10px 16px', fontWeight: '800', color: '#1e293b', fontSize: '13.5px', borderTop: '2px solid #cbd5e1', borderBottom: '1px solid #e2e8f0' }}>
                  II. Biểu đồ 27 & 28: Cơ cấu doanh thu trong nước và quốc tế
                </td>
              </tr>
              {periodData.domIntlRows.map((row) => {
                const isPass = row.rate >= 100;
                return (
                  <tr key={`dom-intl-${row.id}`} className="spdv-row">
                    <td style={{ textAlign: 'center', fontWeight: '600', color: '#64748b' }}>
                      {row.stt}
                    </td>
                    <td className="spdv-td-name">
                      <span className="spdv-dot" style={{ backgroundColor: row.color }}></span>
                      <span className="spdv-name-label font-medium">{row.name}</span>
                    </td>
                    <td style={{ textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
                      Triệu đồng
                    </td>
                    <td className="spdv-td-num font-semibold" style={{ color: '#334155' }}>
                      {formatNum(row.kh)}
                    </td>
                    <td className="spdv-td-num font-bold" style={{ color: '#0f172a' }}>
                      {formatNum(row.th)}
                    </td>
                    <td className="spdv-td-num">
                      <span className={`spdv-diff-val ${row.diff >= 0 ? 'positive' : 'negative'}`}>
                        {row.diff >= 0 ? `+${formatNum(row.diff)}` : formatNum(row.diff)}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`spdv-rate-val ${isPass ? 'pass' : 'fail'}`}>
                        {row.rate.toFixed(1).replace('.', ',')}%
                      </span>
                    </td>
                    <td style={{ textAlign: 'center', color: '#475569', fontWeight: '500' }}>
                      {row.khShare}
                    </td>
                    <td style={{ textAlign: 'center', color: '#0f172a', fontWeight: '600' }}>
                      {row.thShare}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`spdv-badge ${isPass ? 'pass' : 'fail'}`}>
                        {isPass ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                        <span>{isPass ? 'Đạt' : 'Chưa đạt'}</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
              {/* Subtotal Section 2 */}
              <tr style={{ backgroundColor: '#f1f5f9', fontWeight: '700' }}>
                <td style={{ textAlign: 'center', color: '#64748b' }}>Σ</td>
                <td style={{ color: '#0f172a', paddingLeft: '16px' }}>Tổng doanh thu (B27 & B28)</td>
                <td style={{ textAlign: 'center', color: '#64748b' }}>Triệu đồng</td>
                <td style={{ textAlign: 'right', color: '#1e293b' }}>{formatNum(periodData.domIntlTotal.kh)}</td>
                <td style={{ textAlign: 'right', color: '#0f172a' }}>{formatNum(periodData.domIntlTotal.th)}</td>
                <td style={{ textAlign: 'right' }}>
                  <span className={`spdv-diff-val ${periodData.domIntlTotal.diff >= 0 ? 'positive' : 'negative'}`}>
                    {periodData.domIntlTotal.diff >= 0 ? `+${formatNum(periodData.domIntlTotal.diff)}` : formatNum(periodData.domIntlTotal.diff)}
                  </span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span className={`spdv-rate-val ${periodData.domIntlTotal.rate >= 100 ? 'pass' : 'fail'}`}>
                    {periodData.domIntlTotal.rate.toFixed(1).replace('.', ',')}%
                  </span>
                </td>
                <td style={{ textAlign: 'center' }}>100,0%</td>
                <td style={{ textAlign: 'center' }}>100,0%</td>
                <td style={{ textAlign: 'center' }}>
                  <span className={`spdv-badge ${periodData.domIntlTotal.rate >= 100 ? 'pass' : 'fail'}`}>
                    {periodData.domIntlTotal.rate >= 100 ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                    <span>{periodData.domIntlTotal.rate >= 100 ? 'Đạt' : 'Chưa đạt'}</span>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        /* ===================================================================== */
        /* 2. THREE-PERIOD SUMMARY MATRIX (THÁNG | QUÝ | NĂM)                      */
        /* ===================================================================== */
        <div className="spdv-detail-table-wrap">
          <table className="spdv-matrix-table">
            <thead>
              <tr className="spdv-th-top-row">
                <th rowSpan={2} className="spdv-th-name" style={{ minWidth: '220px' }}>Chỉ tiêu cơ cấu</th>
                <th colSpan={4} className="spdv-th-period-group spdv-col-period-month">
                  Tháng {monthNum}/{selectedYear}
                </th>
                <th colSpan={4} className="spdv-th-period-group spdv-col-period-quarter">
                  Quý {quarterRoman}/{selectedYear} (lũy kế {quarterCumText})
                </th>
                <th colSpan={4} className="spdv-th-period-group spdv-col-period-year">
                  Năm {selectedYear} (lũy kế {monthNum}T)
                </th>
              </tr>
              <tr className="spdv-th-sub-row">
                {/* Tháng */}
                <th className="spdv-th-col spdv-border-left">KH</th>
                <th className="spdv-th-col">TH</th>
                <th className="spdv-th-col">Tỷ trọng TH</th>
                <th className="spdv-th-col">% HTKH</th>

                {/* Quý */}
                <th className="spdv-th-col spdv-border-left">KH</th>
                <th className="spdv-th-col">TH</th>
                <th className="spdv-th-col">Tỷ trọng TH</th>
                <th className="spdv-th-col">% HTKH</th>

                {/* Năm */}
                <th className="spdv-th-col spdv-border-left">KH</th>
                <th className="spdv-th-col">TH</th>
                <th className="spdv-th-col">Tỷ trọng TH</th>
                <th className="spdv-th-col">% HTKH</th>
              </tr>
            </thead>
            <tbody>
              {/* PHẦN 1: B25 & B26 */}
              <tr style={{ backgroundColor: '#f8fafc' }}>
                <td colSpan={13} style={{ padding: '8px 16px', fontWeight: '800', color: '#1e293b', fontSize: '13px' }}>
                  I. Cơ cấu doanh thu nội bộ và ngoài Tập đoàn (Biểu đồ 25 & 26)
                </td>
              </tr>
              {summary3PeriodsData.month.inExRows.map((mRow, idx) => {
                const qRow = summary3PeriodsData.quarter.inExRows[idx];
                const yRow = summary3PeriodsData.year.inExRows[idx];
                return (
                  <tr key={`summary-in-ex-${mRow.id}`} className="spdv-row">
                    <td className="spdv-td-name">
                      <span className="spdv-dot" style={{ backgroundColor: mRow.color }}></span>
                      <span className="spdv-name-label">{mRow.name}</span>
                    </td>

                    {/* Tháng */}
                    <td className="spdv-td-num spdv-border-left">{formatNum(mRow.kh)}</td>
                    <td className="spdv-td-num font-semibold">{formatNum(mRow.th)}</td>
                    <td className="spdv-td-share">{mRow.thShare}</td>
                    <td className="spdv-td-share font-semibold">{mRow.rate.toFixed(1).replace('.', ',')}%</td>

                    {/* Quý */}
                    <td className="spdv-td-num spdv-border-left">{formatNum(qRow.kh)}</td>
                    <td className="spdv-td-num font-semibold">{formatNum(qRow.th)}</td>
                    <td className="spdv-td-share">{qRow.thShare}</td>
                    <td className="spdv-td-share font-semibold">{qRow.rate.toFixed(1).replace('.', ',')}%</td>

                    {/* Năm */}
                    <td className="spdv-td-num spdv-border-left">{formatNum(yRow.kh)}</td>
                    <td className="spdv-td-num font-semibold">{formatNum(yRow.th)}</td>
                    <td className="spdv-td-share">{yRow.thShare}</td>
                    <td className="spdv-td-share font-semibold">{yRow.rate.toFixed(1).replace('.', ',')}%</td>
                  </tr>
                );
              })}
              {/* Tổng B25 & B26 */}
              <tr style={{ backgroundColor: '#f1f5f9', fontWeight: '700' }}>
                <td style={{ color: '#0f172a', paddingLeft: '16px' }}>Tổng doanh thu B25 & B26</td>
                {/* Tháng */}
                <td className="spdv-td-num spdv-border-left">{formatNum(summary3PeriodsData.month.inExTotal.kh)}</td>
                <td className="spdv-td-num font-bold">{formatNum(summary3PeriodsData.month.inExTotal.th)}</td>
                <td className="spdv-td-share font-bold">100,0%</td>
                <td className="spdv-td-share font-bold">{summary3PeriodsData.month.inExTotal.rate.toFixed(1).replace('.', ',')}%</td>
                {/* Quý */}
                <td className="spdv-td-num spdv-border-left">{formatNum(summary3PeriodsData.quarter.inExTotal.kh)}</td>
                <td className="spdv-td-num font-bold">{formatNum(summary3PeriodsData.quarter.inExTotal.th)}</td>
                <td className="spdv-td-share font-bold">100,0%</td>
                <td className="spdv-td-share font-bold">{summary3PeriodsData.quarter.inExTotal.rate.toFixed(1).replace('.', ',')}%</td>
                {/* Năm */}
                <td className="spdv-td-num spdv-border-left">{formatNum(summary3PeriodsData.year.inExTotal.kh)}</td>
                <td className="spdv-td-num font-bold">{formatNum(summary3PeriodsData.year.inExTotal.th)}</td>
                <td className="spdv-td-share font-bold">100,0%</td>
                <td className="spdv-td-share font-bold">{summary3PeriodsData.year.inExTotal.rate.toFixed(1).replace('.', ',')}%</td>
              </tr>

              {/* PHẦN 2: B27 & B28 */}
              <tr style={{ backgroundColor: '#f8fafc' }}>
                <td colSpan={13} style={{ padding: '8px 16px', fontWeight: '800', color: '#1e293b', fontSize: '13px', borderTop: '2px solid #cbd5e1' }}>
                  II. Cơ cấu doanh thu trong nước và quốc tế (Biểu đồ 27 & 28)
                </td>
              </tr>
              {summary3PeriodsData.month.domIntlRows.map((mRow, idx) => {
                const qRow = summary3PeriodsData.quarter.domIntlRows[idx];
                const yRow = summary3PeriodsData.year.domIntlRows[idx];
                return (
                  <tr key={`summary-dom-intl-${mRow.id}`} className="spdv-row">
                    <td className="spdv-td-name">
                      <span className="spdv-dot" style={{ backgroundColor: mRow.color }}></span>
                      <span className="spdv-name-label">{mRow.name}</span>
                    </td>

                    {/* Tháng */}
                    <td className="spdv-td-num spdv-border-left">{formatNum(mRow.kh)}</td>
                    <td className="spdv-td-num font-semibold">{formatNum(mRow.th)}</td>
                    <td className="spdv-td-share">{mRow.thShare}</td>
                    <td className="spdv-td-share font-semibold">{mRow.rate.toFixed(1).replace('.', ',')}%</td>

                    {/* Quý */}
                    <td className="spdv-td-num spdv-border-left">{formatNum(qRow.kh)}</td>
                    <td className="spdv-td-num font-semibold">{formatNum(qRow.th)}</td>
                    <td className="spdv-td-share">{qRow.thShare}</td>
                    <td className="spdv-td-share font-semibold">{qRow.rate.toFixed(1).replace('.', ',')}%</td>

                    {/* Năm */}
                    <td className="spdv-td-num spdv-border-left">{formatNum(yRow.kh)}</td>
                    <td className="spdv-td-num font-semibold">{formatNum(yRow.th)}</td>
                    <td className="spdv-td-share">{yRow.thShare}</td>
                    <td className="spdv-td-share font-semibold">{yRow.rate.toFixed(1).replace('.', ',')}%</td>
                  </tr>
                );
              })}
              {/* Tổng B27 & B28 */}
              <tr style={{ backgroundColor: '#f1f5f9', fontWeight: '700' }}>
                <td style={{ color: '#0f172a', paddingLeft: '16px' }}>Tổng doanh thu B27 & B28</td>
                {/* Tháng */}
                <td className="spdv-td-num spdv-border-left">{formatNum(summary3PeriodsData.month.domIntlTotal.kh)}</td>
                <td className="spdv-td-num font-bold">{formatNum(summary3PeriodsData.month.domIntlTotal.th)}</td>
                <td className="spdv-td-share font-bold">100,0%</td>
                <td className="spdv-td-share font-bold">{summary3PeriodsData.month.domIntlTotal.rate.toFixed(1).replace('.', ',')}%</td>
                {/* Quý */}
                <td className="spdv-td-num spdv-border-left">{formatNum(summary3PeriodsData.quarter.domIntlTotal.kh)}</td>
                <td className="spdv-td-num font-bold">{formatNum(summary3PeriodsData.quarter.domIntlTotal.th)}</td>
                <td className="spdv-td-share font-bold">100,0%</td>
                <td className="spdv-td-share font-bold">{summary3PeriodsData.quarter.domIntlTotal.rate.toFixed(1).replace('.', ',')}%</td>
                {/* Năm */}
                <td className="spdv-td-num spdv-border-left">{formatNum(summary3PeriodsData.year.domIntlTotal.kh)}</td>
                <td className="spdv-td-num font-bold">{formatNum(summary3PeriodsData.year.domIntlTotal.th)}</td>
                <td className="spdv-td-share font-bold">100,0%</td>
                <td className="spdv-td-share font-bold">{summary3PeriodsData.year.domIntlTotal.rate.toFixed(1).replace('.', ',')}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
