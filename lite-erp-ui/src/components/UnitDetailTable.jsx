import React, { useMemo } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import {
  UNIT_CATEGORIES,
  UNIT_STRUCTURE_TABLE_DATA,
  UNIT_PLAN_COMPARISON_DATA,
  UNIT_PREV_PERIOD_COMPARISON_DATA
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
  const quarterRoman = `${quarterNum}`;
  const quarterStartMonth = (quarterNum - 1) * 3 + 1;
  const quarterCumText = quarterStartMonth === monthNum
    ? `T${quarterStartMonth}`
    : `T${quarterStartMonth}-T${monthNum}`;

  // Check if viewing structure table (Biểu đồ 21) or comparison table (Biểu đồ 22 / 23)
  const isStructure = useMemo(() => {
    const key = (activeChartKey || '').toLowerCase();
    const title = (chartTitle || '').toLowerCase();
    return (
      key === 'chart21' ||
      key.includes('struct') ||
      key.includes('cơ cấu') ||
      title.includes('cơ cấu')
    );
  }, [activeChartKey, chartTitle]);

  const isPrevPeriodComparison = useMemo(() => {
    const key = (activeChartKey || '').toLowerCase();
    const title = (chartTitle || '').toLowerCase();
    return (
      key === 'chart23' ||
      key.includes('prev') ||
      key.includes('23') ||
      title.includes('23') ||
      title.includes('kỳ trước') ||
      title.includes('tháng trước') ||
      title.includes('quý trước') ||
      title.includes('năm trước')
    );
  }, [activeChartKey, chartTitle]);

  const formatUnitNum = (val) => {
    if (val === null || val === undefined || val === '') return '-';
    if (typeof val === 'string') return val;
    return Number(val).toLocaleString('vi-VN', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    });
  };

  // Plan comparison data for Biểu đồ 22 (Month, Quarter, Year)
  const yearPlanData = UNIT_PLAN_COMPARISON_DATA[selectedYear] || UNIT_PLAN_COMPARISON_DATA['2026'];

  // 3-Period Integrated Data for Biểu đồ 22 (Tích hợp số liệu 3 hình: Tháng, Quý, Năm)
  const integratedUnitRows = useMemo(() => {
    const monthItems = yearPlanData?.month?.items || [];
    const quarterItems = yearPlanData?.quarter?.items || [];
    const yearItems = yearPlanData?.year?.items || [];

    return UNIT_CATEGORIES.map((cat, idx) => {
      const m = monthItems.find((it) => it.id === cat.id) || {};
      const q = quarterItems.find((it) => it.id === cat.id) || {};
      const y = yearItems.find((it) => it.id === cat.id) || {};

      const mTh = Number(m.th ?? 0);
      const mKh = Number(m.kh ?? 0);
      const mDiff = Number((mTh - mKh).toFixed(1));
      const mRate = m.rate || (mKh > 0 ? ((mTh / mKh) * 100).toFixed(1).replace('.', ',') + '%' : '0%');
      const mIsPass = m.isPositive !== undefined ? m.isPositive : (mKh > 0 && mTh >= mKh);

      const qTh = Number(q.th ?? 0);
      const qKh = Number(q.kh ?? 0);
      const qDiff = Number((qTh - qKh).toFixed(1));
      const qRate = q.rate || (qKh > 0 ? ((qTh / qKh) * 100).toFixed(1).replace('.', ',') + '%' : '0%');
      const qIsPass = q.isPositive !== undefined ? q.isPositive : (qKh > 0 && qTh >= qKh);

      const yTh = Number(y.th ?? 0);
      const yKh = Number(y.kh ?? 0);
      const yDiff = Number((yTh - yKh).toFixed(1));
      const yRate = y.rate || (yKh > 0 ? ((yTh / yKh) * 100).toFixed(1).replace('.', ',') + '%' : '0%');
      const yIsPass = y.isPositive !== undefined ? y.isPositive : (yKh > 0 && yTh >= yKh);

      return {
        id: cat.id,
        stt: idx + 1,
        name: cat.name,
        color: cat.color,
        month: { th: mTh, kh: mKh, diff: mDiff, rate: mRate, isPass: mIsPass },
        quarter: { th: qTh, kh: qKh, diff: qDiff, rate: qRate, isPass: qIsPass },
        year: { th: yTh, kh: yKh, diff: yDiff, rate: yRate, isPass: yIsPass }
      };
    });
  }, [yearPlanData]);

  // Filtering for integrated Biểu đồ 22
  const filteredIntegratedRows = useMemo(() => {
    return integratedUnitRows.filter((item) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase().trim();
        if (!item.name.toLowerCase().includes(q)) return false;
      }
      if (statusFilter === 'pass' && !item.year.isPass) return false;
      if (statusFilter === 'fail' && item.year.isPass) return false;
      return true;
    });
  }, [integratedUnitRows, searchQuery, statusFilter]);

  // Integrated totals for Biểu đồ 22
  const integratedTotals = useMemo(() => {
    const monthItems = yearPlanData?.month?.items || [];
    const quarterItems = yearPlanData?.quarter?.items || [];
    const yearItems = yearPlanData?.year?.items || [];

    const mTotalTh = monthItems.reduce((acc, it) => acc + (Number(it.th) || 0), 0);
    const mTotalKh = monthItems.reduce((acc, it) => acc + (Number(it.kh) || 0), 0);
    const mTotalDiff = Number((mTotalTh - mTotalKh).toFixed(1));
    const mTotalRate = mTotalKh > 0 ? (mTotalTh / mTotalKh) * 100 : 0;

    const qTotalTh = quarterItems.reduce((acc, it) => acc + (Number(it.th) || 0), 0);
    const qTotalKh = quarterItems.reduce((acc, it) => acc + (Number(it.kh) || 0), 0);
    const qTotalDiff = Number((qTotalTh - qTotalKh).toFixed(1));
    const qTotalRate = qTotalKh > 0 ? (qTotalTh / qTotalKh) * 100 : 0;

    const yTotalTh = yearItems.reduce((acc, it) => acc + (Number(it.th) || 0), 0);
    const yTotalKh = yearItems.reduce((acc, it) => acc + (Number(it.kh) || 0), 0);
    const yTotalDiff = Number((yTotalTh - yTotalKh).toFixed(1));
    const yTotalRate = yTotalKh > 0 ? (yTotalTh / yTotalKh) * 100 : 0;

    return {
      month: {
        th: mTotalTh,
        kh: mTotalKh,
        diff: mTotalDiff,
        rate: mTotalRate.toFixed(1).replace('.', ',') + '%',
        isPass: mTotalRate >= 100
      },
      quarter: {
        th: qTotalTh,
        kh: qTotalKh,
        diff: qTotalDiff,
        rate: qTotalRate.toFixed(1).replace('.', ',') + '%',
        isPass: qTotalRate >= 100
      },
      year: {
        th: yTotalTh,
        kh: yTotalKh,
        diff: yTotalDiff,
        rate: yTotalRate.toFixed(1).replace('.', ',') + '%',
        isPass: yTotalRate >= 100
      }
    };
  }, [yearPlanData]);

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

  const prevPeriodData = UNIT_PREV_PERIOD_COMPARISON_DATA[selectedYear] || UNIT_PREV_PERIOD_COMPARISON_DATA['2026'];
  const prevMonthNum = monthNum === 1 ? 12 : monthNum - 1;
  const prevMonthYear = monthNum === 1 ? (parseInt(selectedYear, 10) - 1).toString() : selectedYear;
  const prevQuarterNum = quarterNum === 1 ? 4 : quarterNum - 1;
  const prevQuarterYear = quarterNum === 1 ? (parseInt(selectedYear, 10) - 1).toString() : selectedYear;
  const lastYear = (parseInt(selectedYear, 10) - 1).toString();

  const integratedPrevRows = useMemo(() => {
    const mItems = prevPeriodData?.month?.items || [];
    const qItems = prevPeriodData?.quarter?.items || [];
    const yItems = prevPeriodData?.year?.items || [];

    return UNIT_CATEGORIES.map((cat, idx) => {
      const m = mItems.find((it) => it.id === cat.id) || {};
      const q = qItems.find((it) => it.id === cat.id) || {};
      const y = yItems.find((it) => it.id === cat.id) || {};

      const mCurr = Number(m.curr ?? 0);
      const mPrev = Number(m.prev ?? 0);
      const mDiff = Number((mCurr - mPrev).toFixed(1));
      const mRate = m.rate || (mPrev > 0 ? ((mCurr / mPrev) * 100).toFixed(1).replace('.', ',') + '%' : '0%');
      const mRateNum = parseFloat(mRate.replace('%', '').replace(',', '.') || '0');
      const mIsPass = mRateNum > 100;

      const qCurr = Number(q.curr ?? 0);
      const qPrev = Number(q.prev ?? 0);
      const qDiff = Number((qCurr - qPrev).toFixed(1));
      const qRate = q.rate || (qPrev > 0 ? ((qCurr / qPrev) * 100).toFixed(1).replace('.', ',') + '%' : '0%');
      const qRateNum = parseFloat(qRate.replace('%', '').replace(',', '.') || '0');
      const qIsPass = qRateNum > 100;

      const yCurr = Number(y.curr ?? 0);
      const yPrev = Number(y.prev ?? 0);
      const yDiff = Number((yCurr - yPrev).toFixed(1));
      const yRate = y.rate || (yPrev > 0 ? ((yCurr / yPrev) * 100).toFixed(1).replace('.', ',') + '%' : '0%');
      const yRateNum = parseFloat(yRate.replace('%', '').replace(',', '.') || '0');
      const yIsPass = yRateNum > 100;

      return {
        id: cat.id,
        stt: idx + 1,
        name: cat.name,
        color: cat.color,
        month: { curr: mCurr, prev: mPrev, diff: mDiff, rate: mRate, isPass: mIsPass },
        quarter: { curr: qCurr, prev: qPrev, diff: qDiff, rate: qRate, isPass: qIsPass },
        year: { curr: yCurr, prev: yPrev, diff: yDiff, rate: yRate, isPass: yIsPass }
      };
    });
  }, [prevPeriodData]);

  const prevPeriodTotals = useMemo(() => {
    let mCurrTotal = 0, mPrevTotal = 0;
    let qCurrTotal = 0, qPrevTotal = 0;
    let yCurrTotal = 0, yPrevTotal = 0;

    integratedPrevRows.forEach((r) => {
      mCurrTotal += r.month.curr;
      mPrevTotal += r.month.prev;
      qCurrTotal += r.quarter.curr;
      qPrevTotal += r.quarter.prev;
      yCurrTotal += r.year.curr;
      yPrevTotal += r.year.prev;
    });

    const mDiff = Number((mCurrTotal - mPrevTotal).toFixed(1));
    const mRate = mPrevTotal > 0 ? ((mCurrTotal / mPrevTotal) * 100).toFixed(1).replace('.', ',') + '%' : '0%';
    const qDiff = Number((qCurrTotal - qPrevTotal).toFixed(1));
    const qRate = qPrevTotal > 0 ? ((qCurrTotal / qPrevTotal) * 100).toFixed(1).replace('.', ',') + '%' : '0%';
    const yDiff = Number((yCurrTotal - yPrevTotal).toFixed(1));
    const yRate = yPrevTotal > 0 ? ((yCurrTotal / yPrevTotal) * 100).toFixed(1).replace('.', ',') + '%' : '0%';

    return {
      month: { curr: mCurrTotal, prev: mPrevTotal, diff: mDiff, rate: mRate },
      quarter: { curr: qCurrTotal, prev: qPrevTotal, diff: qDiff, rate: qRate },
      year: { curr: yCurrTotal, prev: yPrevTotal, diff: yDiff, rate: yRate }
    };
  }, [integratedPrevRows]);

  const filteredPrevRows = useMemo(() => {
    return integratedPrevRows.filter((item) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase().trim();
        if (!item.name.toLowerCase().includes(q)) return false;
      }
      if (statusFilter === 'pass' && !item.year.isPass) return false;
      if (statusFilter === 'fail' && item.year.isPass) return false;
      return true;
    });
  }, [integratedPrevRows, searchQuery, statusFilter]);

  return (
    <div className="spdv-detail-table-card">
      <div className="spdv-detail-header-wrap">
        <div className="spdv-header-title-box">
          <h3 className="spdv-detail-title">
            {chartTitle || (
              isStructure
                ? `Cơ cấu doanh thu TH theo từng đơn vị – Năm ${selectedYear}`
                : isPrevPeriodComparison
                ? `Doanh thu ước thực hiện theo đơn vị so với năm trước – Năm ${selectedYear}`
                : `Doanh thu ước thực hiện theo đơn vị so với kế hoạch – Năm ${selectedYear}`
            )}
          </h3>
          <span className="spdv-detail-unit">
            {isPrevPeriodComparison ? `(Đơn vị: Tỷ đồng)` : `(Đơn vị: Triệu đồng)`}
          </span>
        </div>
      </div>

      {isPrevPeriodComparison ? (
        /* ===================================================================== */
        /* BẢNG TỔNG HỢP BIỂU ĐỒ 23 TÍCH HỢP 3 HÌNH: THÁNG, QUÝ, NĂM             */
        /* ===================================================================== */
        <div className="spdv-detail-table-wrap">
          <table className="spdv-matrix-table">
            <thead>
              <tr className="spdv-th-top-row">
                <th rowSpan={2} style={{ width: '45px', textAlign: 'center' }}>STT</th>
                <th rowSpan={2} className="spdv-th-name">Đơn vị thực hiện</th>
                <th colSpan={4} className="spdv-th-period-group spdv-col-period-month">
                  Tháng (T{monthNum} vs T{prevMonthNum})
                </th>
                <th colSpan={4} className="spdv-th-period-group spdv-col-period-quarter">
                  Quý (Q{quarterRoman} vs Q{prevQuarterNum})
                </th>
                <th colSpan={4} className="spdv-th-period-group spdv-col-period-year">
                  Năm ({selectedYear} vs {lastYear})
                </th>
              </tr>
              <tr className="spdv-th-sub-row">
                {/* Tháng */}
                <th className="spdv-th-col spdv-th-th spdv-border-left">TH T{monthNum}</th>
                <th className="spdv-th-col spdv-th-kh">TH T{prevMonthNum}</th>
                <th className="spdv-th-col spdv-th-th">+/- Chênh lệch</th>
                <th className="spdv-th-col spdv-th-rate" style={{ textAlign: 'center' }}>% delta</th>

                {/* Quý */}
                <th className="spdv-th-col spdv-th-th spdv-border-left">Ước Q{quarterRoman}</th>
                <th className="spdv-th-col spdv-th-kh">TH Q{prevQuarterNum}</th>
                <th className="spdv-th-col spdv-th-th">+/- Chênh lệch</th>
                <th className="spdv-th-col spdv-th-rate" style={{ textAlign: 'center' }}>% delta</th>

                {/* Năm */}
                <th className="spdv-th-col spdv-th-th spdv-border-left">Ước {selectedYear}</th>
                <th className="spdv-th-col spdv-th-kh">TH {lastYear}</th>
                <th className="spdv-th-col spdv-th-th">+/- Chênh lệch</th>
                <th className="spdv-th-col spdv-th-rate" style={{ textAlign: 'center' }}>% delta</th>
              </tr>
            </thead>
            <tbody>
              {filteredPrevRows.length > 0 ? (
                filteredPrevRows.map((row) => (
                  <tr key={row.id} className="spdv-row">
                    <td style={{ textAlign: 'center', fontWeight: '600', color: '#64748b' }}>
                      {row.stt}
                    </td>
                    <td className="spdv-td-name">
                      <span className="spdv-dot" style={{ backgroundColor: row.color }} />
                      <span className="spdv-name-label">{row.name}</span>
                    </td>

                    {/* Tháng */}
                    <td className="spdv-td-num spdv-border-left">{formatUnitNum(row.month.curr)}</td>
                    <td className="spdv-td-num spdv-td-kh">{formatUnitNum(row.month.prev)}</td>
                    <td className={`spdv-td-num ${row.month.diff >= 0 ? 'text-green' : 'text-red'}`}>
                      {row.month.diff >= 0 ? `+${formatUnitNum(row.month.diff)}` : formatUnitNum(row.month.diff)}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`spdv-rate-pill ${row.month.isPass ? 'rate-pass' : 'rate-fail'}`}>
                        {row.month.rate}
                      </span>
                    </td>

                    {/* Quý */}
                    <td className="spdv-td-num spdv-border-left">{formatUnitNum(row.quarter.curr)}</td>
                    <td className="spdv-td-num spdv-td-kh">{formatUnitNum(row.quarter.prev)}</td>
                    <td className={`spdv-td-num ${row.quarter.diff >= 0 ? 'text-green' : 'text-red'}`}>
                      {row.quarter.diff >= 0 ? `+${formatUnitNum(row.quarter.diff)}` : formatUnitNum(row.quarter.diff)}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`spdv-rate-pill ${row.quarter.isPass ? 'rate-pass' : 'rate-fail'}`}>
                        {row.quarter.rate}
                      </span>
                    </td>

                    {/* Năm */}
                    <td className="spdv-td-num spdv-border-left">{formatUnitNum(row.year.curr)}</td>
                    <td className="spdv-td-num spdv-td-kh">{formatUnitNum(row.year.prev)}</td>
                    <td className={`spdv-td-num ${row.year.diff >= 0 ? 'text-green' : 'text-red'}`}>
                      {row.year.diff >= 0 ? `+${formatUnitNum(row.year.diff)}` : formatUnitNum(row.year.diff)}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`spdv-rate-pill ${row.year.isPass ? 'rate-pass' : 'rate-fail'}`}>
                        {row.year.rate}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={14} style={{ textAlign: 'center', padding: '24px', color: '#94a3b8' }}>
                    Không tìm thấy đơn vị nào phù hợp
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr className="spdv-tr-total">
                <td style={{ textAlign: 'center', fontWeight: '700' }}>Σ</td>
                <td className="spdv-td-name font-bold">Tổng doanh thu 6 đơn vị</td>

                {/* Tháng Total */}
                <td className="spdv-td-num font-bold spdv-border-left">{formatUnitNum(prevPeriodTotals.month.curr)}</td>
                <td className="spdv-td-num font-bold spdv-td-kh">{formatUnitNum(prevPeriodTotals.month.prev)}</td>
                <td className={`spdv-td-num font-bold ${prevPeriodTotals.month.diff >= 0 ? 'text-green' : 'text-red'}`}>
                  {prevPeriodTotals.month.diff >= 0 ? `+${formatUnitNum(prevPeriodTotals.month.diff)}` : formatUnitNum(prevPeriodTotals.month.diff)}
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span className="spdv-rate-pill spdv-rate-pill-total rate-pass font-bold">
                    {prevPeriodTotals.month.rate}
                  </span>
                </td>

                {/* Quý Total */}
                <td className="spdv-td-num font-bold spdv-border-left">{formatUnitNum(prevPeriodTotals.quarter.curr)}</td>
                <td className="spdv-td-num font-bold spdv-td-kh">{formatUnitNum(prevPeriodTotals.quarter.prev)}</td>
                <td className={`spdv-td-num font-bold ${prevPeriodTotals.quarter.diff >= 0 ? 'text-green' : 'text-red'}`}>
                  {prevPeriodTotals.quarter.diff >= 0 ? `+${formatUnitNum(prevPeriodTotals.quarter.diff)}` : formatUnitNum(prevPeriodTotals.quarter.diff)}
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span className="spdv-rate-pill spdv-rate-pill-total rate-pass font-bold">
                    {prevPeriodTotals.quarter.rate}
                  </span>
                </td>

                {/* Năm Total */}
                <td className="spdv-td-num font-bold spdv-border-left">{formatUnitNum(prevPeriodTotals.year.curr)}</td>
                <td className="spdv-td-num font-bold spdv-td-kh">{formatUnitNum(prevPeriodTotals.year.prev)}</td>
                <td className={`spdv-td-num font-bold ${prevPeriodTotals.year.diff >= 0 ? 'text-green' : 'text-red'}`}>
                  {prevPeriodTotals.year.diff >= 0 ? `+${formatUnitNum(prevPeriodTotals.year.diff)}` : formatUnitNum(prevPeriodTotals.year.diff)}
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span className="spdv-rate-pill spdv-rate-pill-total rate-pass font-bold">
                    {prevPeriodTotals.year.rate}
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      ) : !isStructure ? (
        /* ===================================================================== */
        /* BẢNG TỔNG HỢP BIỂU ĐỒ 22 TÍCH HỢP 3 HÌNH: THÁNG, QUÝ, NĂM             */
        /* ===================================================================== */
        <div className="spdv-detail-table-wrap">
          <table className="spdv-matrix-table">
            <thead>
              <tr className="spdv-th-top-row">
                <th rowSpan={2} style={{ width: '45px', textAlign: 'center' }}>STT</th>
                <th rowSpan={2} className="spdv-th-name">Đơn vị thực hiện</th>
                <th colSpan={4} className="spdv-th-period-group spdv-col-period-month">
                  {monthHeader}
                </th>
                <th colSpan={4} className="spdv-th-period-group spdv-col-period-quarter">
                  {quarterHeader}
                </th>
                <th colSpan={4} className="spdv-th-period-group spdv-col-period-year">
                  {yearHeader}
                </th>
              </tr>
              <tr className="spdv-th-sub-row">
                {/* Tháng */}
                <th className="spdv-th-col spdv-th-th spdv-border-left">TH T{monthNum}/{selectedYear}</th>
                <th className="spdv-th-col spdv-th-kh">KH T{monthNum}/{selectedYear}</th>
                <th className="spdv-th-col spdv-th-th">+/- so KH</th>
                <th className="spdv-th-col spdv-th-rate" style={{ textAlign: 'center' }}>% HTKH</th>

                {/* Quý */}
                <th className="spdv-th-col spdv-th-th spdv-border-left">Ước TH Q{quarterRoman}/{selectedYear}</th>
                <th className="spdv-th-col spdv-th-kh">KH Q{quarterRoman}/{selectedYear}</th>
                <th className="spdv-th-col spdv-th-th">+/- so KH</th>
                <th className="spdv-th-col spdv-th-rate" style={{ textAlign: 'center' }}>% HTKH</th>

                {/* Năm */}
                <th className="spdv-th-col spdv-th-th spdv-border-left">Ước TH Năm {selectedYear}</th>
                <th className="spdv-th-col spdv-th-kh">KH Năm {selectedYear}</th>
                <th className="spdv-th-col spdv-th-th">+/- so KH</th>
                <th className="spdv-th-col spdv-th-rate" style={{ textAlign: 'center' }}>% HTKH</th>
              </tr>
            </thead>
            <tbody>
              {filteredIntegratedRows.length > 0 ? (
                filteredIntegratedRows.map((row) => (
                  <tr key={row.id} className="spdv-row">
                    <td style={{ textAlign: 'center', fontWeight: '600', color: '#64748b' }}>
                      {row.stt}
                    </td>
                    <td className="spdv-td-name">
                      <span className="spdv-dot" style={{ backgroundColor: row.color }}></span>
                      <span className="spdv-name-label">{row.name}</span>
                    </td>

                    {/* Tháng */}
                    <td className="spdv-td-num spdv-border-left font-bold" style={{ color: '#0f172a' }}>
                      {formatUnitNum(row.month?.th)}
                    </td>
                    <td className="spdv-td-num font-semibold" style={{ color: '#334155' }}>
                      {formatUnitNum(row.month?.kh)}
                    </td>
                    <td className={`spdv-td-num font-bold ${row.month?.diff >= 0 ? 'text-green' : 'text-red'}`}>
                      {row.month?.diff >= 0 ? `+${formatUnitNum(row.month?.diff)}` : formatUnitNum(row.month?.diff)}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`spdv-rate-pill ${row.month?.isPass ? 'rate-pass' : 'rate-fail'}`}>
                        {row.month?.rate}
                      </span>
                    </td>

                    {/* Quý */}
                    <td className="spdv-td-num spdv-border-left font-bold" style={{ color: '#0f172a' }}>
                      {formatUnitNum(row.quarter?.th)}
                    </td>
                    <td className="spdv-td-num font-semibold" style={{ color: '#334155' }}>
                      {formatUnitNum(row.quarter?.kh)}
                    </td>
                    <td className={`spdv-td-num font-bold ${row.quarter?.diff >= 0 ? 'text-green' : 'text-red'}`}>
                      {row.quarter?.diff >= 0 ? `+${formatUnitNum(row.quarter?.diff)}` : formatUnitNum(row.quarter?.diff)}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`spdv-rate-pill ${row.quarter?.isPass ? 'rate-pass' : 'rate-fail'}`}>
                        {row.quarter?.rate}
                      </span>
                    </td>

                    {/* Năm */}
                    <td className="spdv-td-num spdv-border-left font-bold" style={{ color: '#0f172a' }}>
                      {formatUnitNum(row.year?.th)}
                    </td>
                    <td className="spdv-td-num font-semibold" style={{ color: '#334155' }}>
                      {formatUnitNum(row.year?.kh)}
                    </td>
                    <td className={`spdv-td-num font-bold ${row.year?.diff >= 0 ? 'text-green' : 'text-red'}`}>
                      {row.year?.diff >= 0 ? `+${formatUnitNum(row.year?.diff)}` : formatUnitNum(row.year?.diff)}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`spdv-rate-pill ${row.year?.isPass ? 'rate-pass' : 'rate-fail'}`}>
                        {row.year?.rate}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={14} className="spdv-no-data-cell">
                    Không tìm thấy dữ liệu đơn vị phù hợp với điều kiện lọc
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr className="spdv-tr-total">
                <td style={{ textAlign: 'center', fontWeight: '800' }}>Σ</td>
                <td className="spdv-td-name font-bold">
                  Tổng doanh thu
                </td>

                {/* Tháng */}
                <td className="spdv-td-num font-extrabold spdv-border-left" style={{ color: '#0f172a' }}>
                  {formatUnitNum(integratedTotals.month.th)}
                </td>
                <td className="spdv-td-num font-extrabold" style={{ color: '#1e293b' }}>
                  {formatUnitNum(integratedTotals.month.kh)}
                </td>
                <td className={`spdv-td-num font-extrabold ${integratedTotals.month.diff >= 0 ? 'text-green' : 'text-red'}`}>
                  {integratedTotals.month.diff >= 0 ? `+${formatUnitNum(integratedTotals.month.diff)}` : formatUnitNum(integratedTotals.month.diff)}
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span className={`spdv-rate-pill spdv-rate-pill-total ${integratedTotals.month.isPass ? 'rate-pass' : 'rate-fail'}`}>
                    {integratedTotals.month.rate}
                  </span>
                </td>

                {/* Quý */}
                <td className="spdv-td-num font-extrabold spdv-border-left" style={{ color: '#0f172a' }}>
                  {formatUnitNum(integratedTotals.quarter.th)}
                </td>
                <td className="spdv-td-num font-extrabold" style={{ color: '#1e293b' }}>
                  {formatUnitNum(integratedTotals.quarter.kh)}
                </td>
                <td className={`spdv-td-num font-extrabold ${integratedTotals.quarter.diff >= 0 ? 'text-green' : 'text-red'}`}>
                  {integratedTotals.quarter.diff >= 0 ? `+${formatUnitNum(integratedTotals.quarter.diff)}` : formatUnitNum(integratedTotals.quarter.diff)}
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span className={`spdv-rate-pill spdv-rate-pill-total ${integratedTotals.quarter.isPass ? 'rate-pass' : 'rate-fail'}`}>
                    {integratedTotals.quarter.rate}
                  </span>
                </td>

                {/* Năm */}
                <td className="spdv-td-num font-extrabold spdv-border-left" style={{ color: '#0f172a' }}>
                  {formatUnitNum(integratedTotals.year.th)}
                </td>
                <td className="spdv-td-num font-extrabold" style={{ color: '#1e293b' }}>
                  {formatUnitNum(integratedTotals.year.kh)}
                </td>
                <td className={`spdv-td-num font-extrabold ${integratedTotals.year.diff >= 0 ? 'text-green' : 'text-red'}`}>
                  {integratedTotals.year.diff >= 0 ? `+${formatUnitNum(integratedTotals.year.diff)}` : formatUnitNum(integratedTotals.year.diff)}
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span className={`spdv-rate-pill spdv-rate-pill-total ${integratedTotals.year.isPass ? 'rate-pass' : 'rate-fail'}`}>
                    {integratedTotals.year.rate}
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
                <th className="spdv-th-col spdv-border-left">TH T{monthNum}/{selectedYear}</th>
                <th className="spdv-th-col">Tỷ trọng TH</th>

                {/* Quý */}
                <th className="spdv-th-col spdv-border-left">TH Q{quarterRoman}/{selectedYear}</th>
                <th className="spdv-th-col">Tỷ trọng TH</th>

                {/* Năm */}
                <th className="spdv-th-col spdv-border-left">TH Năm {selectedYear}</th>
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
