import React, { useMemo, useState, useEffect } from 'react';
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
  statusFilter = 'all',
  onSelectChartKey
}) {
  const monthNum = parseInt(selectedMonth?.match(/\d+/)?.[0] || '8', 10);
  const quarterNum = Math.ceil(monthNum / 3);
  const quarterRoman = `${quarterNum}`;
  const quarterStartMonth = (quarterNum - 1) * 3 + 1;
  const quarterCumText = quarterStartMonth === monthNum
    ? `T${quarterStartMonth}`
    : `T${quarterStartMonth}–T${monthNum}`;

  const lastYear = (parseInt(selectedYear, 10) - 1).toString();
  const prevMonthNum = monthNum === 1 ? 12 : monthNum - 1;
  const prevMonthYear = monthNum === 1 ? lastYear : selectedYear;
  const prevQuarterNum = quarterNum === 1 ? 4 : quarterNum - 1;
  const prevQuarterYear = quarterNum === 1 ? lastYear : selectedYear;

  // Determine chart category
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
    if (isStructure) return false;
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
  }, [isStructure, activeChartKey, chartTitle]);

  // Initial period based on incoming chartKey or title
  const initialPeriod = useMemo(() => {
    const key = (activeChartKey || '').toLowerCase();
    const title = (chartTitle || '').toLowerCase();
    if (key.includes('quarter') || title.includes('quý')) return 'quarter';
    if (key.includes('year') || title.includes('năm')) return 'year';
    if (key.includes('month') || title.includes('tháng')) return 'month';
    return 'month';
  }, [activeChartKey, chartTitle]);

  const [selectedPeriod, setSelectedPeriod] = useState(initialPeriod);

  useEffect(() => {
    setSelectedPeriod(initialPeriod);
  }, [initialPeriod]);

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    if (!onSelectChartKey) return;
    if (isStructure) {
      if (period === 'month') onSelectChartKey('unit_struct_month');
      else if (period === 'quarter') onSelectChartKey('unit_struct_quarter');
      else if (period === 'year') onSelectChartKey('unit_struct_year');
    } else if (isPrevPeriodComparison) {
      if (period === 'month') onSelectChartKey('unit_prev_month');
      else if (period === 'quarter') onSelectChartKey('unit_prev_quarter');
      else if (period === 'year') onSelectChartKey('unit_prev_year');
    } else {
      if (period === 'month') onSelectChartKey('unit_plan_month');
      else if (period === 'quarter') onSelectChartKey('unit_plan_quarter');
      else if (period === 'year') onSelectChartKey('unit_plan_year');
    }
  };

  const formatUnitNum = (val) => {
    if (val === null || val === undefined || val === '') return '-';
    if (typeof val === 'string') return val;
    return Number(val).toLocaleString('vi-VN', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    });
  };

  // Plan comparison data for Biểu đồ 18 (Month, Quarter, Year)
  const yearPlanData = UNIT_PLAN_COMPARISON_DATA[selectedYear] || UNIT_PLAN_COMPARISON_DATA['2026'];

  // 3-Period Integrated Data for Biểu đồ 18
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
      const mRateNum = mKh > 0 ? (mTh / mKh) * 100 : 0;
      const mIsPass = mRateNum >= 100;

      const qTh = Number(q.th ?? 0);
      const qKh = Number(q.kh ?? 0);
      const qDiff = Number((qTh - qKh).toFixed(1));
      const qRate = q.rate || (qKh > 0 ? ((qTh / qKh) * 100).toFixed(1).replace('.', ',') + '%' : '0%');
      const qRateNum = qKh > 0 ? (qTh / qKh) * 100 : 0;
      const qIsPass = qRateNum >= 100;

      const yTh = Number(y.th ?? 0);
      const yKh = Number(y.kh ?? 0);
      const yDiff = Number((yTh - yKh).toFixed(1));
      const yRate = y.rate || (yKh > 0 ? ((yTh / yKh) * 100).toFixed(1).replace('.', ',') + '%' : '0%');
      const yRateNum = yKh > 0 ? (yTh / yKh) * 100 : 0;
      const yIsPass = yRateNum >= 100;

      return {
        id: cat.id,
        stt: idx + 1,
        name: cat.name,
        color: cat.color,
        month: { th: mTh, kh: mKh, diff: mDiff, rate: mRate, rateNum: mRateNum, isPass: mIsPass },
        quarter: { th: qTh, kh: qKh, diff: qDiff, rate: qRate, rateNum: qRateNum, isPass: qIsPass },
        year: { th: yTh, kh: yKh, diff: yDiff, rate: yRate, rateNum: yRateNum, isPass: yIsPass }
      };
    });
  }, [yearPlanData]);

  // Integrated totals for Biểu đồ 18
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

  // Prev Period Data (Biểu đồ 23)
  const prevPeriodData = UNIT_PREV_PERIOD_COMPARISON_DATA[selectedYear] || UNIT_PREV_PERIOD_COMPARISON_DATA['2026'];

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
      const mIsPass = mDiff >= 0;

      const qCurr = Number(q.curr ?? 0);
      const qPrev = Number(q.prev ?? 0);
      const qDiff = Number((qCurr - qPrev).toFixed(1));
      const qRate = q.rate || (qPrev > 0 ? ((qCurr / qPrev) * 100).toFixed(1).replace('.', ',') + '%' : '0%');
      const qRateNum = parseFloat(qRate.replace('%', '').replace(',', '.') || '0');
      const qIsPass = qDiff >= 0;

      const yCurr = Number(y.curr ?? 0);
      const yPrev = Number(y.prev ?? 0);
      const yDiff = Number((yCurr - yPrev).toFixed(1));
      const yRate = y.rate || (yPrev > 0 ? ((yCurr / yPrev) * 100).toFixed(1).replace('.', ',') + '%' : '0%');
      const yRateNum = parseFloat(yRate.replace('%', '').replace(',', '.') || '0');
      const yIsPass = yDiff >= 0;

      return {
        id: cat.id,
        stt: idx + 1,
        name: cat.name,
        color: cat.color,
        month: { curr: mCurr, prev: mPrev, diff: mDiff, rate: mRate, rateNum: mRateNum, isPass: mIsPass },
        quarter: { curr: qCurr, prev: qPrev, diff: qDiff, rate: qRate, rateNum: qRateNum, isPass: qIsPass },
        year: { curr: yCurr, prev: yPrev, diff: yDiff, rate: yRate, rateNum: yRateNum, isPass: yIsPass }
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
      month: { curr: mCurrTotal, prev: mPrevTotal, diff: mDiff, rate: mRate, isPass: mDiff >= 0 },
      quarter: { curr: qCurrTotal, prev: qPrevTotal, diff: qDiff, rate: qRate, isPass: qDiff >= 0 },
      year: { curr: yCurrTotal, prev: yPrevTotal, diff: yDiff, rate: yRate, isPass: yDiff >= 0 }
    };
  }, [integratedPrevRows]);

  // Active single-period configuration for Plan comparison (Biểu đồ 18)
  const singlePlanConfig = useMemo(() => {
    if (isStructure || isPrevPeriodComparison) return null;
    if (selectedPeriod === 'month') {
      return {
        badge: 'Biểu đồ 18 – Tháng',
        title: `Biểu đồ 18. Thực hiện Tháng ${monthNum}/${selectedYear} so với kế hoạch Tháng ${monthNum}/${selectedYear} theo đơn vị`,
        unit: 'Triệu đồng',
        obj1Label: `TH T${monthNum}/${selectedYear}`,
        obj2Label: `KH T${monthNum}/${selectedYear}`,
        diffLabel: `+/- so KH`,
        rateLabel: `% HTKH`,
        shareLabel: `Tỷ trọng TH`,
        note: `So sánh thực hiện và kế hoạch doanh thu của các đơn vị trong Tháng ${monthNum}/${selectedYear}.`
      };
    }
    if (selectedPeriod === 'quarter') {
      return {
        badge: 'Biểu đồ 18 – Quý',
        title: `Biểu đồ 18. Ước thực hiện Quý ${quarterRoman}/${selectedYear} so với kế hoạch Quý ${quarterRoman}/${selectedYear} theo đơn vị`,
        unit: 'Triệu đồng',
        obj1Label: `Ước TH Q${quarterRoman}/${selectedYear}`,
        obj2Label: `KH Q${quarterRoman}/${selectedYear}`,
        diffLabel: `+/- so KH`,
        rateLabel: `% HTKH`,
        shareLabel: `Tỷ trọng Ước TH`,
        note: `So sánh ước thực hiện và kế hoạch doanh thu của các đơn vị trong Quý ${quarterRoman}/${selectedYear}.`
      };
    }
    if (selectedPeriod === 'year') {
      return {
        badge: 'Biểu đồ 18 – Năm',
        title: `Biểu đồ 18. Ước thực hiện năm ${selectedYear} so với kế hoạch năm ${selectedYear} theo đơn vị`,
        unit: 'Triệu đồng',
        obj1Label: `Ước TH Năm ${selectedYear}`,
        obj2Label: `KH Năm ${selectedYear}`,
        diffLabel: `+/- so KH`,
        rateLabel: `% HTKH`,
        shareLabel: `Tỷ trọng Ước TH`,
        note: `So sánh ước thực hiện cả năm với kế hoạch doanh thu được giao năm ${selectedYear}.`
      };
    }
    return null;
  }, [isStructure, isPrevPeriodComparison, selectedPeriod, monthNum, quarterRoman, selectedYear]);

  // Active single-period configuration for Prev Period comparison (Biểu đồ 23)
  const singlePrevPeriodConfig = useMemo(() => {
    if (isStructure || !isPrevPeriodComparison) return null;
    if (selectedPeriod === 'month') {
      return {
        badge: 'Biểu đồ 23 – Tháng',
        title: `Biểu đồ 23. Thực hiện Tháng ${monthNum}/${selectedYear} so với thực hiện Tháng ${prevMonthNum}/${prevMonthYear} theo đơn vị (T${monthNum} vs T${prevMonthNum})`,
        unit: 'Tỷ đồng',
        obj1Label: `TH T${monthNum}/${selectedYear}`,
        obj2Label: `TH T${prevMonthNum}/${prevMonthYear}`,
        diffLabel: `+/- Chênh lệch`,
        rateLabel: `% delta`,
        shareLabel: `Tỷ trọng TH`,
        basis: `Tháng ${monthNum}/${selectedYear} so với Tháng ${prevMonthNum}/${prevMonthYear}`
      };
    }
    if (selectedPeriod === 'quarter') {
      return {
        badge: 'Biểu đồ 23 – Quý',
        title: `Biểu đồ 23. Ước thực hiện Quý ${quarterRoman}/${selectedYear} so với thực hiện Quý ${prevQuarterNum}/${prevQuarterYear} theo đơn vị (Q${quarterRoman} vs Q${prevQuarterNum})`,
        unit: 'Tỷ đồng',
        obj1Label: `Ước TH Q${quarterRoman}/${selectedYear}`,
        obj2Label: `TH Q${prevQuarterNum}/${prevQuarterYear}`,
        diffLabel: `+/- Chênh lệch`,
        rateLabel: `% delta`,
        shareLabel: `Tỷ trọng Ước TH`,
        basis: `Ước Quý ${quarterRoman}/${selectedYear} so với Thực hiện Quý ${prevQuarterNum}/${prevQuarterYear}`
      };
    }
    if (selectedPeriod === 'year') {
      return {
        badge: 'Biểu đồ 23 – Năm',
        title: `Biểu đồ 23. Ước thực hiện năm ${selectedYear} so với thực hiện năm ${lastYear} theo đơn vị (${selectedYear} vs ${lastYear})`,
        unit: 'Tỷ đồng',
        obj1Label: `Ước TH Năm ${selectedYear}`,
        obj2Label: `TH Năm ${lastYear}`,
        diffLabel: `+/- Chênh lệch`,
        rateLabel: `% delta`,
        shareLabel: `Tỷ trọng Ước TH`,
        basis: `Ước Năm ${selectedYear} so với Thực hiện Năm ${lastYear}`
      };
    }
    return null;
  }, [isStructure, isPrevPeriodComparison, selectedPeriod, monthNum, prevMonthNum, prevMonthYear, quarterRoman, prevQuarterNum, prevQuarterYear, lastYear, selectedYear]);

  // Active single-period configuration for Structure (Biểu đồ 21)
  const singleStructureConfig = useMemo(() => {
    if (!isStructure) return null;
    if (selectedPeriod === 'month') {
      return {
        badge: 'Biểu đồ 21 – Tháng',
        title: `Cơ cấu doanh thu TH theo từng đơn vị – Tháng ${monthNum}/${selectedYear}`,
        unit: 'Triệu đồng',
        obj1Label: `TH T${monthNum}/${selectedYear}`,
        shareLabel: `Tỷ trọng TH`
      };
    }
    if (selectedPeriod === 'quarter') {
      return {
        badge: 'Biểu đồ 21 – Quý',
        title: `Cơ cấu doanh thu TH theo từng đơn vị – Quý ${quarterRoman}/${selectedYear}`,
        unit: 'Triệu đồng',
        obj1Label: `TH Q${quarterRoman}/${selectedYear}`,
        shareLabel: `Tỷ trọng TH`
      };
    }
    if (selectedPeriod === 'year') {
      return {
        badge: 'Biểu đồ 21 – Năm',
        title: `Cơ cấu doanh thu TH theo từng đơn vị – Năm ${selectedYear}`,
        unit: 'Triệu đồng',
        obj1Label: `TH Năm ${selectedYear}`,
        shareLabel: `Tỷ trọng TH`
      };
    }
    return null;
  }, [isStructure, selectedPeriod, monthNum, quarterRoman, selectedYear]);

  // Filter single period plan rows
  const singlePlanRows = useMemo(() => {
    if (!singlePlanConfig) return [];
    const p = selectedPeriod;
    const totalTh = integratedTotals[p]?.th || 1;

    return integratedUnitRows
      .filter((item) => {
        if (searchQuery) {
          const q = searchQuery.toLowerCase().trim();
          if (!item.name.toLowerCase().includes(q)) return false;
        }
        if (statusFilter === 'pass' && !item[p].isPass) return false;
        if (statusFilter === 'fail' && item[p].isPass) return false;
        return true;
      })
      .map((item) => {
        const val1 = item[p].th;
        const val2 = item[p].kh;
        const diff = item[p].diff;
        const rate = item[p].rate;
        const isPass = item[p].isPass;
        const share = totalTh > 0 ? `${((val1 / totalTh) * 100).toFixed(1)}%` : '0%';
        return {
          id: item.id,
          stt: item.stt,
          name: item.name,
          color: item.color,
          val1,
          val2,
          diff,
          rate,
          isPass,
          share
        };
      });
  }, [singlePlanConfig, selectedPeriod, integratedUnitRows, integratedTotals, searchQuery, statusFilter]);

  // Filter single period prev rows
  const singlePrevRows = useMemo(() => {
    if (!singlePrevPeriodConfig) return [];
    const p = selectedPeriod;
    const totalCurr = prevPeriodTotals[p]?.curr || 1;

    return integratedPrevRows
      .filter((item) => {
        if (searchQuery) {
          const q = searchQuery.toLowerCase().trim();
          if (!item.name.toLowerCase().includes(q)) return false;
        }
        if (statusFilter === 'pass' && !item[p].isPass) return false;
        if (statusFilter === 'fail' && item[p].isPass) return false;
        return true;
      })
      .map((item) => {
        const val1 = item[p].curr;
        const val2 = item[p].prev;
        const diff = item[p].diff;
        const rate = item[p].rate;
        const isPass = item[p].isPass;
        const share = totalCurr > 0 ? `${((val1 / totalCurr) * 100).toFixed(1)}%` : '0%';
        return {
          id: item.id,
          stt: item.stt,
          name: item.name,
          color: item.color,
          val1,
          val2,
          diff,
          rate,
          isPass,
          share
        };
      });
  }, [singlePrevPeriodConfig, selectedPeriod, integratedPrevRows, prevPeriodTotals, searchQuery, statusFilter]);

  // Filter integrated rows for 3-period table
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

  // Resolve current card display title
  const currentDisplayTitle = useMemo(() => {
    if (isStructure) {
      if (singleStructureConfig) return singleStructureConfig.title;
      return `Cơ cấu doanh thu TH theo từng đơn vị (Bảng tổng hợp 3 kỳ)`;
    }
    if (isPrevPeriodComparison) {
      if (singlePrevPeriodConfig) return singlePrevPeriodConfig.title;
      return `Biểu đồ 23. Doanh thu theo từng đơn vị so với kỳ trước (Bảng tổng hợp 3 kỳ)`;
    }
    if (singlePlanConfig) return singlePlanConfig.title;
    return `Biểu đồ 18. Thực hiện so với kế hoạch theo đơn vị (Bảng tổng hợp 3 kỳ)`;
  }, [isStructure, isPrevPeriodComparison, singleStructureConfig, singlePrevPeriodConfig, singlePlanConfig]);

  const currentUnitLabel = isPrevPeriodComparison ? `(Đơn vị: Tỷ đồng)` : `(Đơn vị: Triệu đồng)`;

  return (
    <div className="spdv-detail-table-card">
      {/* Top Header with title and controls */}
      <div className="spdv-detail-header-wrap">
        <div className="spdv-header-title-box">
          {singlePlanConfig && (
            <span className="spdv-badge-chart-label">{singlePlanConfig.badge}</span>
          )}
          {singlePrevPeriodConfig && (
            <span className="spdv-badge-chart-label">{singlePrevPeriodConfig.badge}</span>
          )}
          {singleStructureConfig && (
            <span className="spdv-badge-chart-label">{singleStructureConfig.badge}</span>
          )}
          {selectedPeriod === 'all' && (
            <span className="spdv-badge-chart-label">
              {isStructure ? 'Biểu đồ 21 – 3 Kỳ' : isPrevPeriodComparison ? 'Biểu đồ 23 – 3 Kỳ' : 'Biểu đồ 18 – 3 Kỳ'}
            </span>
          )}

          <h3 className="spdv-detail-title">{currentDisplayTitle}</h3>
          <span className="spdv-detail-unit">{currentUnitLabel}</span>

          {singlePrevPeriodConfig && (
            <div style={{ width: '100%', fontSize: '13px', color: '#475569', marginTop: '2px' }}>
              <strong>Cơ sở so sánh:</strong> {singlePrevPeriodConfig.basis}
            </div>
          )}
          {isPrevPeriodComparison && selectedPeriod === 'all' && (
            <div style={{ width: '100%', fontSize: '13px', color: '#475569', marginTop: '2px' }}>
              <strong>Cơ sở so sánh:</strong> Tháng (T{monthNum} vs T{prevMonthNum}) | Quý (Q{quarterRoman} vs Q{prevQuarterNum}) | Năm ({selectedYear} vs {lastYear})
            </div>
          )}
        </div>

        {/* Period Switching Tabs (Tháng / Quý / Năm / Tất cả 3 kỳ) */}
        <div className="spdv-header-actions">
          <div className="spdv-period-tab-group">
            <button
              type="button"
              className={`spdv-period-tab-btn ${selectedPeriod === 'month' ? 'active' : ''}`}
              onClick={() => handlePeriodChange('month')}
            >
              Tháng {monthNum}/{selectedYear}
            </button>
            <button
              type="button"
              className={`spdv-period-tab-btn ${selectedPeriod === 'quarter' ? 'active' : ''}`}
              onClick={() => handlePeriodChange('quarter')}
            >
              Quý {quarterRoman}/{selectedYear}
            </button>
            <button
              type="button"
              className={`spdv-period-tab-btn ${selectedPeriod === 'year' ? 'active' : ''}`}
              onClick={() => handlePeriodChange('year')}
            >
              Năm {selectedYear}
            </button>
            <button
              type="button"
              className={`spdv-period-tab-btn ${selectedPeriod === 'all' ? 'active' : ''}`}
              onClick={() => handlePeriodChange('all')}
            >
              Tất cả 3 kỳ
            </button>
          </div>
        </div>
      </div>

      {/* TABLE VIEWS ROUTING */}
      {/* 1. SINGLE-PERIOD VIEW FOR PLAN COMPARISON (BIỂU ĐỒ 18) */}
      {!isStructure && !isPrevPeriodComparison && singlePlanConfig ? (
        <div className="spdv-detail-table-wrap">
          <table className="spdv-matrix-table">
            <thead>
              <tr className="spdv-th-top-row">
                <th style={{ width: '50px', textAlign: 'center' }}>STT</th>
                <th className="spdv-th-name" style={{ width: '280px' }}>Đơn vị thực hiện</th>
                <th style={{ textAlign: 'right', paddingRight: '20px', backgroundColor: '#f1f6fd', color: '#0f172a', fontWeight: '800' }}>
                  {singlePlanConfig.obj1Label} ({singlePlanConfig.unit})
                </th>
                <th style={{ textAlign: 'right', paddingRight: '20px', backgroundColor: '#f1f6fd', color: '#0f172a', fontWeight: '800' }}>
                  {singlePlanConfig.obj2Label} ({singlePlanConfig.unit})
                </th>
                <th style={{ textAlign: 'right', paddingRight: '20px', backgroundColor: '#f1f6fd', color: '#0f172a', fontWeight: '800' }}>
                  {singlePlanConfig.diffLabel} ({singlePlanConfig.unit})
                </th>
                <th style={{ textAlign: 'center', width: '130px', backgroundColor: '#f1f6fd', color: '#0f172a', fontWeight: '800' }}>
                  {singlePlanConfig.rateLabel}
                </th>
                <th style={{ textAlign: 'center', width: '110px', backgroundColor: '#f1f6fd', color: '#0f172a', fontWeight: '800' }}>
                  {singlePlanConfig.shareLabel}
                </th>
                <th style={{ textAlign: 'center', width: '120px', backgroundColor: '#f1f6fd', color: '#0f172a', fontWeight: '800' }}>
                  Đánh giá
                </th>
              </tr>
            </thead>
            <tbody>
              {singlePlanRows.length > 0 ? (
                singlePlanRows.map((row) => (
                  <tr key={row.id} className="spdv-row">
                    <td style={{ textAlign: 'center', fontWeight: '600', color: '#64748b' }}>
                      {row.stt}
                    </td>
                    <td className="spdv-td-name">
                      <span className="spdv-dot" style={{ backgroundColor: row.color }}></span>
                      <span className="spdv-name-label">{row.name}</span>
                    </td>
                    <td className="spdv-td-num font-bold" style={{ color: '#0f172a', paddingRight: '20px' }}>
                      {formatUnitNum(row.val1)}
                    </td>
                    <td className="spdv-td-num font-semibold" style={{ color: '#334155', paddingRight: '20px' }}>
                      {formatUnitNum(row.val2)}
                    </td>
                    <td className={`spdv-td-num font-bold ${row.diff >= 0 ? 'text-green' : 'text-red'}`} style={{ paddingRight: '20px' }}>
                      {row.diff >= 0 ? `+${formatUnitNum(row.diff)}` : formatUnitNum(row.diff)}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`spdv-rate-pill ${row.isPass ? 'rate-pass' : 'rate-fail'}`}>
                        {row.rate}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: '600', color: '#475569' }}>
                      {row.share}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`status-pill ${row.isPass ? 'pass' : 'fail'}`}>
                        {row.isPass ? 'Đạt KH' : 'Chưa đạt'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="spdv-no-data-cell">
                    Không tìm thấy dữ liệu đơn vị phù hợp với điều kiện lọc
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr className="spdv-tr-total">
                <td style={{ textAlign: 'center', fontWeight: '800' }}>Σ</td>
                <td className="spdv-td-name font-bold">Tổng doanh thu 6 đơn vị</td>
                <td className="spdv-td-num font-extrabold" style={{ color: '#0f172a', paddingRight: '20px' }}>
                  {formatUnitNum(integratedTotals[selectedPeriod]?.th)}
                </td>
                <td className="spdv-td-num font-extrabold" style={{ color: '#1e293b', paddingRight: '20px' }}>
                  {formatUnitNum(integratedTotals[selectedPeriod]?.kh)}
                </td>
                <td className={`spdv-td-num font-extrabold ${integratedTotals[selectedPeriod]?.diff >= 0 ? 'text-green' : 'text-red'}`} style={{ paddingRight: '20px' }}>
                  {integratedTotals[selectedPeriod]?.diff >= 0 ? `+${formatUnitNum(integratedTotals[selectedPeriod]?.diff)}` : formatUnitNum(integratedTotals[selectedPeriod]?.diff)}
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span className={`spdv-rate-pill spdv-rate-pill-total ${integratedTotals[selectedPeriod]?.isPass ? 'rate-pass' : 'rate-fail'}`}>
                    {integratedTotals[selectedPeriod]?.rate}
                  </span>
                </td>
                <td style={{ textAlign: 'center', fontWeight: '700', color: '#0f172a' }}>
                  100%
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span className={`status-pill ${integratedTotals[selectedPeriod]?.isPass ? 'pass' : 'fail'}`}>
                    {integratedTotals[selectedPeriod]?.isPass ? 'Đạt KH' : 'Chưa đạt'}
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      ) : null}

      {/* 2. SINGLE-PERIOD VIEW FOR PREV PERIOD COMPARISON (BIỂU ĐỒ 23) */}
      {!isStructure && isPrevPeriodComparison && singlePrevPeriodConfig ? (
        <div className="spdv-detail-table-wrap">
          <table className="spdv-matrix-table">
            <thead>
              <tr className="spdv-th-top-row">
                <th style={{ width: '50px', textAlign: 'center' }}>STT</th>
                <th className="spdv-th-name" style={{ width: '280px' }}>Đơn vị thực hiện</th>
                <th style={{ textAlign: 'right', paddingRight: '20px', backgroundColor: '#f1f6fd', color: '#0f172a', fontWeight: '800' }}>
                  {singlePrevPeriodConfig.obj1Label} ({singlePrevPeriodConfig.unit})
                </th>
                <th style={{ textAlign: 'right', paddingRight: '20px', backgroundColor: '#f1f6fd', color: '#0f172a', fontWeight: '800' }}>
                  {singlePrevPeriodConfig.obj2Label} ({singlePrevPeriodConfig.unit})
                </th>
                <th style={{ textAlign: 'right', paddingRight: '20px', backgroundColor: '#f1f6fd', color: '#0f172a', fontWeight: '800' }}>
                  {singlePrevPeriodConfig.diffLabel} ({singlePrevPeriodConfig.unit})
                </th>
                <th style={{ textAlign: 'center', width: '130px', backgroundColor: '#f1f6fd', color: '#0f172a', fontWeight: '800' }}>
                  {singlePrevPeriodConfig.rateLabel}
                </th>
                <th style={{ textAlign: 'center', width: '110px', backgroundColor: '#f1f6fd', color: '#0f172a', fontWeight: '800' }}>
                  {singlePrevPeriodConfig.shareLabel}
                </th>
                <th style={{ textAlign: 'center', width: '120px', backgroundColor: '#f1f6fd', color: '#0f172a', fontWeight: '800' }}>
                  Đánh giá
                </th>
              </tr>
            </thead>
            <tbody>
              {singlePrevRows.length > 0 ? (
                singlePrevRows.map((row) => (
                  <tr key={row.id} className="spdv-row">
                    <td style={{ textAlign: 'center', fontWeight: '600', color: '#64748b' }}>
                      {row.stt}
                    </td>
                    <td className="spdv-td-name">
                      <span className="spdv-dot" style={{ backgroundColor: row.color }}></span>
                      <span className="spdv-name-label">{row.name}</span>
                    </td>
                    <td className="spdv-td-num font-bold" style={{ color: '#0f172a', paddingRight: '20px' }}>
                      {formatUnitNum(row.val1)}
                    </td>
                    <td className="spdv-td-num font-semibold" style={{ color: '#334155', paddingRight: '20px' }}>
                      {formatUnitNum(row.val2)}
                    </td>
                    <td className={`spdv-td-num font-bold ${row.diff >= 0 ? 'text-green' : 'text-red'}`} style={{ paddingRight: '20px' }}>
                      {row.diff >= 0 ? `+${formatUnitNum(row.diff)}` : formatUnitNum(row.diff)}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`spdv-rate-pill ${row.isPass ? 'rate-pass' : 'rate-fail'}`}>
                        {row.rate}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: '600', color: '#475569' }}>
                      {row.share}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`status-pill ${row.isPass ? 'pass' : 'fail'}`}>
                        {row.isPass ? 'Tăng trưởng' : 'Suy giảm'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="spdv-no-data-cell">
                    Không tìm thấy dữ liệu đơn vị phù hợp với điều kiện lọc
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr className="spdv-tr-total">
                <td style={{ textAlign: 'center', fontWeight: '800' }}>Σ</td>
                <td className="spdv-td-name font-bold">Tổng doanh thu 6 đơn vị</td>
                <td className="spdv-td-num font-extrabold" style={{ color: '#0f172a', paddingRight: '20px' }}>
                  {formatUnitNum(prevPeriodTotals[selectedPeriod]?.curr)}
                </td>
                <td className="spdv-td-num font-extrabold" style={{ color: '#1e293b', paddingRight: '20px' }}>
                  {formatUnitNum(prevPeriodTotals[selectedPeriod]?.prev)}
                </td>
                <td className={`spdv-td-num font-extrabold ${prevPeriodTotals[selectedPeriod]?.diff >= 0 ? 'text-green' : 'text-red'}`} style={{ paddingRight: '20px' }}>
                  {prevPeriodTotals[selectedPeriod]?.diff >= 0 ? `+${formatUnitNum(prevPeriodTotals[selectedPeriod]?.diff)}` : formatUnitNum(prevPeriodTotals[selectedPeriod]?.diff)}
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span className={`spdv-rate-pill spdv-rate-pill-total ${prevPeriodTotals[selectedPeriod]?.isPass ? 'rate-pass' : 'rate-fail'}`}>
                    {prevPeriodTotals[selectedPeriod]?.rate}
                  </span>
                </td>
                <td style={{ textAlign: 'center', fontWeight: '700', color: '#0f172a' }}>
                  100%
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span className={`status-pill ${prevPeriodTotals[selectedPeriod]?.isPass ? 'pass' : 'fail'}`}>
                    {prevPeriodTotals[selectedPeriod]?.isPass ? 'Tăng trưởng' : 'Suy giảm'}
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      ) : null}

      {/* 3. SINGLE-PERIOD VIEW FOR STRUCTURE (BIỂU ĐỒ 21) */}
      {isStructure && singleStructureConfig ? (
        <div className="spdv-detail-table-wrap">
          <table className="spdv-matrix-table">
            <thead>
              <tr className="spdv-th-top-row">
                <th style={{ width: '50px', textAlign: 'center' }}>STT</th>
                <th className="spdv-th-name" style={{ width: '320px' }}>Đơn vị thực hiện</th>
                <th style={{ textAlign: 'right', paddingRight: '24px', backgroundColor: '#f1f6fd', color: '#0f172a', fontWeight: '800' }}>
                  {singleStructureConfig.obj1Label} ({singleStructureConfig.unit})
                </th>
                <th style={{ textAlign: 'center', width: '160px', backgroundColor: '#f1f6fd', color: '#0f172a', fontWeight: '800' }}>
                  {singleStructureConfig.shareLabel}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredStructureRows.map((row, idx) => (
                <tr key={row.id} className="spdv-row">
                  <td style={{ textAlign: 'center', fontWeight: '600', color: '#64748b' }}>
                    {idx + 1}
                  </td>
                  <td className="spdv-td-name">
                    <span className="spdv-dot" style={{ backgroundColor: row.color }}></span>
                    <span className="spdv-name-label">{row.name}</span>
                  </td>
                  <td className="spdv-td-num font-bold" style={{ color: '#0f172a', paddingRight: '24px' }}>
                    {formatUnitNum(row[selectedPeriod]?.th)}
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: '700', color: '#2563eb' }}>
                    {row[selectedPeriod]?.thShare || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="spdv-tr-total">
                <td style={{ textAlign: 'center', fontWeight: '800' }}>Σ</td>
                <td className="spdv-td-name font-bold">Tổng doanh thu</td>
                <td className="spdv-td-num font-extrabold" style={{ color: '#0f172a', paddingRight: '24px' }}>
                  {formatUnitNum(structureData.total?.[selectedPeriod]?.th)}
                </td>
                <td style={{ textAlign: 'center', fontWeight: '800', color: '#2563eb' }}>
                  {structureData.total?.[selectedPeriod]?.thShare || '100%'}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      ) : null}

      {/* 4. INTEGRATED 3-PERIOD TABLE FOR PREV PERIOD (BIỂU ĐỒ 23 - TẤT CẢ 3 KỲ) */}
      {isPrevPeriodComparison && selectedPeriod === 'all' && (
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
      )}

      {/* 5. INTEGRATED 3-PERIOD TABLE FOR PLAN COMPARISON (BIỂU ĐỒ 18 - TẤT CẢ 3 KỲ) */}
      {!isStructure && !isPrevPeriodComparison && selectedPeriod === 'all' && (
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
                    <td className="spdv-td-num spdv-border-left">{formatUnitNum(row.month.th)}</td>
                    <td className="spdv-td-num spdv-td-kh">{formatUnitNum(row.month.kh)}</td>
                    <td className={`spdv-td-num ${row.month.diff >= 0 ? 'text-green' : 'text-red'}`}>
                      {row.month.diff >= 0 ? `+${formatUnitNum(row.month.diff)}` : formatUnitNum(row.month.diff)}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`spdv-rate-pill ${row.month.isPass ? 'rate-pass' : 'rate-fail'}`}>
                        {row.month.rate}
                      </span>
                    </td>

                    {/* Quý */}
                    <td className="spdv-td-num spdv-border-left">{formatUnitNum(row.quarter.th)}</td>
                    <td className="spdv-td-num spdv-td-kh">{formatUnitNum(row.quarter.kh)}</td>
                    <td className={`spdv-td-num ${row.quarter.diff >= 0 ? 'text-green' : 'text-red'}`}>
                      {row.quarter.diff >= 0 ? `+${formatUnitNum(row.quarter.diff)}` : formatUnitNum(row.quarter.diff)}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`spdv-rate-pill ${row.quarter.isPass ? 'rate-pass' : 'rate-fail'}`}>
                        {row.quarter.rate}
                      </span>
                    </td>

                    {/* Năm */}
                    <td className="spdv-td-num spdv-border-left">{formatUnitNum(row.year.th)}</td>
                    <td className="spdv-td-num spdv-td-kh">{formatUnitNum(row.year.kh)}</td>
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
                  <td colSpan={14} className="spdv-no-data-cell">
                    Không tìm thấy dữ liệu đơn vị phù hợp với điều kiện lọc
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr className="spdv-tr-total">
                <td style={{ textAlign: 'center', fontWeight: '800' }}>Σ</td>
                <td className="spdv-td-name font-bold">Tổng doanh thu</td>

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
      )}

      {/* 6. INTEGRATED 3-PERIOD TABLE FOR STRUCTURE (BIỂU ĐỒ 21 - TẤT CẢ 3 KỲ) */}
      {isStructure && selectedPeriod === 'all' && (
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
