import React, { useMemo } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import {
  UNIT_CATEGORIES,
  UNIT_STRUCTURE_TABLE_DATA,
  UNIT_PLAN_COMPARISON_DATA
} from '../data/revenueUnitData';
import './SpdvDetailTable.css';

export default function UnitDetailTable({
  selectedYear = '2026',
  selectedMonth = 'Tháng 8',
  activeChartKey = 'unit_plan_month',
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

  // Period: 'month' | 'quarter' | 'year' | 'structure'
  const selectedPeriod = useMemo(() => {
    const key = (activeChartKey || '').toLowerCase();
    const title = (chartTitle || '').toLowerCase();

    // If explicit structure chart
    if (
      key.includes('struct') ||
      key.includes('cơ cấu') ||
      title.includes('cơ cấu')
    ) {
      return 'structure';
    }

    if (key.includes('quarter') || key.includes('q3') || title.includes('quý')) {
      return 'quarter';
    }

    if (key.includes('year') || key.includes('năm') || title.includes('năm')) {
      return 'year';
    }

    return 'month';
  }, [activeChartKey, chartTitle]);

  const formatUnitNum = (val) => {
    if (val === null || val === undefined) return '—';
    if (typeof val === 'string') return val;
    return Number(val).toLocaleString('vi-VN', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    });
  };

  // Plan comparison data for Biểu đồ 22
  const yearPlanData = UNIT_PLAN_COMPARISON_DATA[selectedYear] || UNIT_PLAN_COMPARISON_DATA['2026'];
  const periodPlanData = yearPlanData ? (yearPlanData[selectedPeriod] || yearPlanData.month) : null;

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
      items = periodPlanData?.items || [];
      title = periodPlanData?.periodLabel || `Quý ${quarterRoman}/${selectedYear}`;
      thLabel = `TH Quý ${quarterRoman}/${selectedYear}`;
      khLabel = `KH Quý ${quarterRoman}/${selectedYear}`;
    } else if (selectedPeriod === 'year') {
      items = periodPlanData?.items || [];
      title = periodPlanData?.periodLabel || `Năm ${selectedYear}`;
      thLabel = `TH Năm ${selectedYear}`;
      khLabel = `KH Năm ${selectedYear}`;
    } else {
      // Default: Month
      items = periodPlanData?.items || [];
      title = periodPlanData?.periodLabel || `Tháng ${monthNum}/${selectedYear}`;
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
      const isPass = it.isPositive !== undefined ? it.isPositive : (rateNum >= 100);
      const thShare = tTh > 0 ? ((it.th / tTh) * 100).toFixed(1).replace('.', ',') + '%' : '0%';
      const khShare = tKh > 0 ? ((it.kh / tKh) * 100).toFixed(1).replace('.', ',') + '%' : '0%';
      const color = UNIT_CATEGORIES.find(c => c.id === it.id)?.color || '#1b4474';

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
  }, [periodPlanData, selectedPeriod, selectedYear, monthNum, quarterRoman]);

  // Filtering for Biểu đồ 22 (Plan comparison)
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

  // 3-Period Structure Table Data (Biểu đồ 21)
  const structureData = UNIT_STRUCTURE_TABLE_DATA[selectedYear] || UNIT_STRUCTURE_TABLE_DATA['2026'];
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
      <div className="spdv-detail-header-wrap">
        <div className="spdv-header-title-box">
          <h3 className="spdv-detail-title">
            {selectedPeriod === 'structure'
              ? `Cơ cấu doanh thu theo đơn vị thực hiện`
              : `Biểu đồ 22. Doanh thu theo đơn vị so với KH – ${periodTitle}`}
          </h3>
          <span className="spdv-detail-unit">(Đơn vị: Triệu đồng)</span>
        </div>
      </div>

      {selectedPeriod !== 'structure' ? (
        /* ===================================================================== */
        /* BẢNG DỮ LIỆU CHI TIẾT BIỂU ĐỒ 22 (CÓ CỘT KH VÀ TỶ LỆ HTKH)             */
        /* ===================================================================== */
        <div className="spdv-detail-table-wrap">
          <table className="spdv-b18-table">
            <thead>
              <tr className="spdv-b18-thead-row">
                <th style={{ width: '50px', textAlign: 'center' }}>STT</th>
                <th style={{ textAlign: 'left', minWidth: '220px' }}>Đơn vị thực hiện</th>
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
                    <td className="spdv-td-num font-semibold">{formatUnitNum(item.kh)}</td>
                    <td className="spdv-td-num font-semibold">{formatUnitNum(item.th)}</td>
                    <td className="spdv-td-num">
                      <span className={`spdv-diff-val ${item.diffVal >= 0 ? 'positive' : 'negative'}`}>
                        {item.diffVal >= 0 ? `+${formatUnitNum(item.diffVal)}` : formatUnitNum(item.diffVal)}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`spdv-rate-val ${item.isPass ? 'pass' : 'fail'}`}>
                        {item.rateText}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: '#64748b' }}>
                    Không có dữ liệu phù hợp với bộ lọc
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr className="spdv-tr-total">
                <td style={{ textAlign: 'center', fontWeight: '800' }}>Σ</td>
                <td style={{ textAlign: 'left', fontWeight: '800' }}>
                  Tổng doanh thu
                </td>
                <td style={{ textAlign: 'right', fontWeight: '800' }}>{formatUnitNum(totalKh)}</td>
                <td style={{ textAlign: 'right', fontWeight: '800' }}>{formatUnitNum(totalTh)}</td>
                <td style={{ textAlign: 'right', fontWeight: '800' }}>
                  <span className={`spdv-diff-val ${totalDiff >= 0 ? 'positive' : 'negative'}`}>
                    {totalDiff >= 0 ? `+${formatUnitNum(totalDiff)}` : formatUnitNum(totalDiff)}
                  </span>
                </td>
                <td style={{ textAlign: 'center', fontWeight: '800' }}>
                  <span className={`spdv-rate-val ${totalIsPass ? 'pass' : 'fail'}`}>
                    {totalRateFormatted}
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      ) : (
        /* ===================================================================== */
        /* BẢNG DỮ LIỆU CƠ CẤU 3 KỲ (BIỂU ĐỒ 21) - KHÔNG CÓ CỘT KH                */
        /* ===================================================================== */
        <div className="spdv-detail-table-wrap">
          <table className="spdv-matrix-table">
            <thead>
              <tr className="spdv-th-top-row">
                <th rowSpan={2} className="spdv-th-name">Đơn vị thực hiện</th>
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
                  <td className="spdv-td-num spdv-border-left font-semibold">{formatUnitNum(row.month?.th)}</td>
                  <td className="spdv-td-share">{row.month?.thShare}</td>

                  {/* Quý */}
                  <td className="spdv-td-num spdv-border-left font-semibold">{formatUnitNum(row.quarter?.th)}</td>
                  <td className="spdv-td-share">{row.quarter?.thShare}</td>

                  {/* Năm */}
                  <td className="spdv-td-num spdv-border-left font-semibold">{formatUnitNum(row.year?.th)}</td>
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
                <td className="spdv-td-num font-bold spdv-border-left">{formatUnitNum(structureData.total?.month?.th)}</td>
                <td className="spdv-td-share font-bold">{structureData.total?.month?.thShare}</td>

                {/* Quý */}
                <td className="spdv-td-num font-bold spdv-border-left">{formatUnitNum(structureData.total?.quarter?.th)}</td>
                <td className="spdv-td-share font-bold">{structureData.total?.quarter?.thShare}</td>

                {/* Năm */}
                <td className="spdv-td-num font-bold spdv-border-left">{formatUnitNum(structureData.total?.year?.th)}</td>
                <td className="spdv-td-share font-bold">{structureData.total?.year?.thShare}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}
