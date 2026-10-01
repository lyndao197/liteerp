import React, { useMemo } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { SPDV_CATEGORIES, SPDV_STRUCTURE_TABLE_DATA, getSpdvBarComparisonData } from '../data/revenueSpdvData';
import './SpdvDetailTable.css';

const SPDV_COLOR_MAP = {
  gppm: '#1f3d6d',
  htcntt: '#2e6aa6',
  dvs: '#5993cd',
  tvth: '#e59a68',
  vhbt: '#98d593',
  dtk: '#b8c2cc'
};

export default function SpdvDetailTable({
  selectedYear = '2026',
  selectedMonth = 'Tháng 8',
  activeChartKey = 'spdv_bar_month',
  chartTitle = '',
  searchQuery = '',
  statusFilter = 'all'
}) {
  const monthNum = parseInt(selectedMonth?.match(/\d+/)?.[0] || '8', 10);
  const quarterNum = Math.ceil(monthNum / 3);
  const quarterRoman = ['I', 'II', 'III', 'IV'][quarterNum - 1] || 'III';
  const quarterStartMonth = (quarterNum - 1) * 3 + 1;
  const quarterCumText = quarterStartMonth === monthNum
    ? `T${quarterStartMonth}`
    : `T${quarterStartMonth}-T${monthNum}`;

  // Period: 'month' | 'quarter' | 'year' | 'all'
  const selectedPeriod = useMemo(() => {
    const key = (activeChartKey || '').toLowerCase();
    const title = (chartTitle || '').toLowerCase();
    if (
      key === 'spdv_structure' ||
      key === 'chart16' ||
      key === 'chart17' ||
      key.startsWith('spdv_th_') ||
      key.startsWith('spdv_kh_') ||
      title.includes('cơ cấu')
    ) {
      return 'all';
    }
    if (key === 'spdv_bar_quarter' || key === 'chart18_q' || title.includes('quý')) {
      return 'quarter';
    }
    if (key === 'spdv_bar_year' || key === 'chart18_y' || title.includes('năm')) {
      return 'year';
    }
    return 'month';
  }, [activeChartKey, chartTitle]);

  const formatSpdvNum = (val) => {
    if (val === null || val === undefined) return '—';
    if (typeof val === 'string') return val;
    return Number(val).toLocaleString('vi-VN', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    });
  };

  // Get bar comparison data for Biểu đồ 18
  const barData = getSpdvBarComparisonData(selectedYear, selectedMonth);

  // Active dataset for Biểu đồ 18 depending on period
  const {
    activeItems,
    periodTitle,
    colThLabel,
    colKhLabel,
    totalTh,
    totalKh,
    totalDiff,
    totalRateFormatted,
    totalIsPass
  } = useMemo(() => {
    let items = [];
    let title = '';
    let thLabel = '';
    let khLabel = '';

    if (selectedPeriod === 'quarter') {
      items = barData.quarterItems || [];
      title = barData.quarterTitle || `Quý ${quarterRoman}/${selectedYear}`;
      thLabel = `TH Quý ${quarterRoman}/${selectedYear}`;
      khLabel = `KH Quý ${quarterRoman}/${selectedYear}`;
    } else if (selectedPeriod === 'year') {
      items = barData.yearItems || [];
      title = barData.yearTitle || `Năm ${selectedYear}`;
      thLabel = `TH Năm ${selectedYear}`;
      khLabel = `KH Năm ${selectedYear}`;
    } else {
      // Default: Month
      items = barData.monthItems || [];
      title = barData.monthTitle || `Tháng ${monthNum}/${selectedYear}`;
      thLabel = `TH T${monthNum}/${selectedYear}`;
      khLabel = `KH T${monthNum}/${selectedYear}`;
    }

    const tTh = items.reduce((acc, it) => acc + (Number(it.th) || 0), 0);
    const tKh = items.reduce((acc, it) => acc + (Number(it.kh) || 0), 0);
    const tDiff = Number((tTh - tKh).toFixed(1));
    const tRate = tKh > 0 ? (tTh / tKh) * 100 : 0;
    const tIsPass = tRate >= 100;

    const enriched = items.map((it, idx) => {
      const diffVal = Number((it.th - it.kh).toFixed(1));
      const rateNum = it.kh > 0 ? (it.th / it.kh) * 100 : 0;
      const rateText = rateNum.toFixed(1).replace('.', ',') + '%';
      const isPass = it.isRatePositive !== undefined ? it.isRatePositive : (rateNum >= 100);
      const thShare = tTh > 0 ? ((it.th / tTh) * 100).toFixed(1).replace('.', ',') + '%' : '0%';
      const khShare = tKh > 0 ? ((it.kh / tKh) * 100).toFixed(1).replace('.', ',') + '%' : '0%';
      const color = SPDV_COLOR_MAP[it.id] || SPDV_CATEGORIES.find(c => c.id === it.id)?.color || '#1f3d6d';

      return {
        ...it,
        stt: idx + 1,
        diffVal,
        rateNum,
        rateText,
        isPass,
        thShare,
        khShare,
        color
      };
    });

    return {
      activeItems: enriched,
      periodTitle: title,
      colThLabel: thLabel,
      colKhLabel: khLabel,
      totalTh: tTh,
      totalKh: tKh,
      totalDiff: tDiff,
      totalRateNum: tRate,
      totalRateFormatted: tRate.toFixed(1).replace('.', ',') + '%',
      totalIsPass: tIsPass
    };
  }, [barData, selectedPeriod, selectedYear, selectedMonth, monthNum, quarterRoman]);

  // Filtering for Biểu đồ 18
  const filteredBarItems = useMemo(() => {
    return activeItems.filter((item) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase().trim();
        if (!item.name.toLowerCase().includes(q)) return false;
      }
      if (statusFilter === 'pass' && !item.isPass) return false;
      if (statusFilter === 'fail' && item.isPass) return false;
      return true;
    });
  }, [activeItems, searchQuery, statusFilter]);

  // 3-Period Structure Table Data
  const structureData = SPDV_STRUCTURE_TABLE_DATA[selectedYear] || SPDV_STRUCTURE_TABLE_DATA['2026'];
  const monthHeader = `Tháng ${monthNum}/${selectedYear}`;
  const quarterHeader = `Quý ${quarterRoman}/${selectedYear} (lũy kế ${quarterCumText})`;
  const yearHeader = `Năm ${selectedYear} (lũy kế ${monthNum}T)`;

  const filteredStructureRows = useMemo(() => {
    const rows = structureData.rows || [];
    return rows.filter((r) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase().trim();
        if (!r.name.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [structureData, searchQuery]);

  return (
    <div className="spdv-detail-table-card">
      {/* Top Header with title and controls */}
      <div className="spdv-detail-header-wrap">
        <div className="spdv-header-title-box">
          <h3 className="spdv-detail-title">
            {selectedPeriod === 'all'
              ? `Cơ cấu doanh thu theo nhóm SPDV`
              : `Biểu đồ 18. Doanh thu 6 nhóm SPDV so với KH – ${periodTitle}`}
          </h3>
          <span className="spdv-detail-unit">(Đơn vị: Triệu đồng)</span>
        </div>
      </div>

      {/* TABLE VIEW */}
      {selectedPeriod !== 'all' ? (
        /* ===================================================================== */
        /* BẢNG DỮ LIỆU CHI TIẾT BIỂU ĐỒ 18 (CÓ CỘT KH VÀ TỶ LỆ HTKH)             */
        /* ===================================================================== */
        <div className="spdv-detail-table-wrap">
          <table className="spdv-b18-table">
            <thead>
              <tr className="spdv-b18-thead-row">
                <th style={{ width: '50px', textAlign: 'center' }}>STT</th>
                <th style={{ textAlign: 'left', minWidth: '220px' }}>Nhóm SPDV</th>
                <th style={{ width: '85px', textAlign: 'center' }}>Đơn vị</th>
                <th style={{ width: '135px', textAlign: 'right', fontWeight: '700' }}>KH</th>
                <th style={{ width: '135px', textAlign: 'right', fontWeight: '700' }}>TH</th>
                <th style={{ width: '130px', textAlign: 'right' }}>
                  <div className="spdv-th-two-line">
                    <span className="spdv-th-main font-bold">+/-</span>
                    <span className="spdv-th-sub font-bold">so KH</span>
                  </div>
                </th>
                <th style={{ width: '135px', textAlign: 'center' }}>
                  <div className="spdv-th-two-line">
                    <span className="spdv-th-main font-bold">%</span>
                    <span className="spdv-th-sub font-bold">HTKH</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredBarItems.length > 0 ? (
                filteredBarItems.map((item) => (
                  <tr key={item.id} className="spdv-row">
                    <td style={{ textAlign: 'center', fontWeight: '600', color: '#64748b' }}>
                      {item.stt}
                    </td>
                    <td className="spdv-td-name">
                      <span className="spdv-dot" style={{ backgroundColor: item.color }}></span>
                      <span className="spdv-name-label">{item.name}</span>
                    </td>
                    <td style={{ textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
                      Triệu đồng
                    </td>
                    <td className="spdv-td-num font-semibold" style={{ color: '#334155' }}>
                      {formatSpdvNum(item.kh)}
                    </td>
                    <td className="spdv-td-num font-bold" style={{ color: '#0f172a' }}>
                      {formatSpdvNum(item.th)}
                    </td>
                    <td className={`spdv-td-num font-bold ${item.diffVal >= 0 ? 'text-green' : 'text-red'}`}>
                      {item.diffVal >= 0 ? `+${formatSpdvNum(item.diffVal)}` : formatSpdvNum(item.diffVal)}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`spdv-rate-pill ${item.isPass ? 'rate-pass' : 'rate-fail'}`}>
                        {item.rateText}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="spdv-no-data-cell">
                    Không tìm thấy dữ liệu nhóm SPDV phù hợp với điều kiện lọc
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr className="spdv-tr-total">
                <td style={{ textAlign: 'center', fontWeight: '800' }}>Σ</td>
                <td className="spdv-td-name font-bold">
                  Tổng doanh thu 6 nhóm SPDV
                </td>
                <td style={{ textAlign: 'center', color: '#64748b', fontWeight: '600' }}>
                  Triệu đồng
                </td>
                <td className="spdv-td-num font-extrabold" style={{ color: '#1e293b' }}>
                  {formatSpdvNum(totalKh)}
                </td>
                <td className="spdv-td-num font-extrabold" style={{ color: '#0f172a' }}>
                  {formatSpdvNum(totalTh)}
                </td>
                <td className={`spdv-td-num font-extrabold ${totalDiff >= 0 ? 'text-green' : 'text-red'}`}>
                  {totalDiff >= 0 ? `+${formatSpdvNum(totalDiff)}` : formatSpdvNum(totalDiff)}
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span className={`spdv-rate-pill spdv-rate-pill-total ${totalIsPass ? 'rate-pass' : 'rate-fail'}`}>
                    {totalRateFormatted}
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      ) : (
        /* ===================================================================== */
        /* BẢNG TỔNG HỢP CƠ CẤU 3 KỲ (CHỈ CÓ TH VÀ TỶ TRỌNG TH, KHÔNG CÓ CỘT KH)  */
        /* ===================================================================== */
        <div className="spdv-detail-table-wrap">
          <table className="spdv-matrix-table">
            <thead>
              <tr className="spdv-th-top-row">
                <th rowSpan={2} className="spdv-th-name">Nhóm SPDV</th>
                <th colSpan={2} className="spdv-th-period-group spdv-col-period-month">
                  {monthHeader}
                </th>
                <th colSpan={2} className="spdv-th-period-group spdv-col-period-quarter">
                  {quarterHeader}
                </th>
                <th colSpan={2} className="spdv-th-period-group spdv-col-period-year">
                  {yearHeader}
                </th>
              </tr>
              <tr className="spdv-th-sub-row">
                {/* Tháng */}
                <th className="spdv-th-col spdv-border-left">TH</th>
                <th className="spdv-th-col">Tỷ trọng TH</th>

                {/* Quý */}
                <th className="spdv-th-col spdv-border-left">TH</th>
                <th className="spdv-th-col">Tỷ trọng TH</th>

                {/* Năm */}
                <th className="spdv-th-col spdv-border-left">TH</th>
                <th className="spdv-th-col">Tỷ trọng TH</th>
              </tr>
            </thead>
            <tbody>
              {filteredStructureRows.map((row) => (
                <tr key={row.id} className="spdv-row">
                  <td className="spdv-td-name">
                    <span className="spdv-dot" style={{ backgroundColor: row.color }}></span>
                    <span className="spdv-name-label">{row.name}</span>
                  </td>

                  {/* Tháng */}
                  <td className="spdv-td-num spdv-border-left font-semibold">{formatSpdvNum(row.month?.th)}</td>
                  <td className="spdv-td-share">{row.month?.thShare}</td>

                  {/* Quý */}
                  <td className="spdv-td-num spdv-border-left font-semibold">{formatSpdvNum(row.quarter?.th)}</td>
                  <td className="spdv-td-share">{row.quarter?.thShare}</td>

                  {/* Năm */}
                  <td className="spdv-td-num spdv-border-left font-semibold">{formatSpdvNum(row.year?.th)}</td>
                  <td className="spdv-td-share">{row.year?.thShare}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="spdv-tr-total">
                <td className="spdv-td-name font-bold">
                  {structureData.total?.name || 'Tổng doanh thu'}
                </td>

                {/* Tháng */}
                <td className="spdv-td-num font-bold spdv-border-left">{formatSpdvNum(structureData.total?.month?.th)}</td>
                <td className="spdv-td-share font-bold">{structureData.total?.month?.thShare}</td>

                {/* Quý */}
                <td className="spdv-td-num font-bold spdv-border-left">{formatSpdvNum(structureData.total?.quarter?.th)}</td>
                <td className="spdv-td-share font-bold">{structureData.total?.quarter?.thShare}</td>

                {/* Năm */}
                <td className="spdv-td-num font-bold spdv-border-left">{formatSpdvNum(structureData.total?.year?.th)}</td>
                <td className="spdv-td-share font-bold">{structureData.total?.year?.thShare}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}
