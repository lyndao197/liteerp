import React, { useMemo, useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Layers, Calendar, BarChart3, PieChart } from 'lucide-react';
import { SPDV_CATEGORIES, SPDV_STRUCTURE_TABLE_DATA, getSpdvBarComparisonData, getSpdvYoyComparisonData, getSpdvPrevPeriodComparisonData } from '../data/revenueSpdvData';
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
  statusFilter = 'all',
  onSelectChartKey
}) {
  const monthNum = parseInt(selectedMonth?.match(/\d+/)?.[0] || '8', 10);
  const quarterNum = Math.ceil(monthNum / 3);
  const quarterRoman = `${quarterNum}`;
  const quarterStartMonth = (quarterNum - 1) * 3 + 1;
  const quarterCumText = quarterStartMonth === monthNum
    ? `T${quarterStartMonth}`
    : `T${quarterStartMonth}-T${monthNum}`;

  // View modes for toggle when viewing individual charts
  const [structureViewMode, setStructureViewMode] = useState('single'); // 'single' | 'integrated'
  const [barViewMode, setBarViewMode] = useState('single'); // 'single' | 'integrated'

  // Reset to single mode whenever activeChartKey changes
  useEffect(() => {
    setStructureViewMode('single');
    setBarViewMode('single');
  }, [activeChartKey]);

  // Check if viewing YoY table (Biểu đồ 19) or Prev Period table (Biểu đồ 20)
  const isYoyComparison = useMemo(() => {
    const key = (activeChartKey || '').toLowerCase();
    const title = (chartTitle || '').toLowerCase();
    return (
      key === 'spdv_yoy_comparison' ||
      key === 'chart19' ||
      key.includes('cung_ky') ||
      key.includes('cùng kỳ') ||
      title.includes('cùng kỳ') ||
      title.includes('19')
    );
  }, [activeChartKey, chartTitle]);

  const isPrevPeriodComparison = useMemo(() => {
    const key = (activeChartKey || '').toLowerCase();
    const title = (chartTitle || '').toLowerCase();
    return (
      key === 'spdv_prev_period' ||
      key === 'chart20' ||
      key.includes('ky_truoc') ||
      key.includes('kỳ trước') ||
      title.includes('kỳ trước') ||
      title.includes('20')
    );
  }, [activeChartKey, chartTitle]);

  // Detect single structure donut chart (Biểu đồ 16 & 17)
  const singleStructureConfig = useMemo(() => {
    if (isYoyComparison || isPrevPeriodComparison) return null;
    const key = (activeChartKey || '').toLowerCase();
    const title = (chartTitle || '').toLowerCase();

    // 1. TH Tháng
    if (key === 'spdv_th_month' || (key === 'chart16' && (title.includes('tháng') || (!title.includes('quý') && !title.includes('năm'))))) {
      return {
        badge: 'Biểu đồ 16 – Thực hiện Tháng',
        period: 'month',
        metric: 'th',
        periodLabel: `Tháng ${monthNum}/${selectedYear}`,
        metricLabel: `Doanh thu thực hiện (TH)`,
        shareLabel: 'Tỷ trọng TH',
        title: `Biểu đồ 16. Cơ cấu doanh thu thực hiện theo 6 nhóm SPDV – Tháng ${monthNum}/${selectedYear}`,
        unit: 'Triệu đồng',
        valueColor: '#1d4370',
        note: `Biểu đồ tròn thể hiện cơ cấu tỷ trọng doanh thu thực hiện của 6 nhóm SPDV trong Tháng ${monthNum}/${selectedYear}.`
      };
    }
    // 2. KH Tháng
    if (key === 'spdv_kh_month' || (key === 'chart17' && (title.includes('tháng') || (!title.includes('quý') && !title.includes('năm'))))) {
      return {
        badge: 'Biểu đồ 17 – Kế hoạch Tháng',
        period: 'month',
        metric: 'kh',
        periodLabel: `Tháng ${monthNum}/${selectedYear}`,
        metricLabel: `Doanh thu kế hoạch (KH)`,
        shareLabel: 'Tỷ trọng KH',
        title: `Biểu đồ 17. Cơ cấu doanh thu kế hoạch theo 6 nhóm SPDV – Tháng ${monthNum}/${selectedYear}`,
        unit: 'Triệu đồng',
        valueColor: '#0369a1',
        note: `Biểu đồ tròn thể hiện cơ cấu tỷ trọng kế hoạch doanh thu giao cho 6 nhóm SPDV trong Tháng ${monthNum}/${selectedYear}.`
      };
    }
    // 3. TH Quý
    if (key === 'spdv_th_quarter' || (key === 'chart16' && (title.includes('quý') || title.includes('q3')))) {
      return {
        badge: 'Biểu đồ 16 – Thực hiện Quý',
        period: 'quarter',
        metric: 'th',
        periodLabel: `Quý ${quarterRoman}/${selectedYear} (lũy kế ${quarterCumText})`,
        metricLabel: `Doanh thu thực hiện (TH)`,
        shareLabel: 'Tỷ trọng TH',
        title: `Biểu đồ 16. Cơ cấu doanh thu thực hiện theo 6 nhóm SPDV – Quý ${quarterRoman}/${selectedYear}`,
        unit: 'Triệu đồng',
        valueColor: '#1d4370',
        note: `Biểu đồ tròn thể hiện cơ cấu tỷ trọng doanh thu thực hiện của 6 nhóm SPDV trong Quý ${quarterRoman}/${selectedYear} (lũy kế ${quarterCumText}).`
      };
    }
    // 4. KH Quý
    if (key === 'spdv_kh_quarter' || (key === 'chart17' && (title.includes('quý') || title.includes('q3')))) {
      return {
        badge: 'Biểu đồ 17 – Kế hoạch Quý',
        period: 'quarter',
        metric: 'kh',
        periodLabel: `Quý ${quarterRoman}/${selectedYear}`,
        metricLabel: `Doanh thu kế hoạch (KH)`,
        shareLabel: 'Tỷ trọng KH',
        title: `Biểu đồ 17. Cơ cấu doanh thu kế hoạch theo 6 nhóm SPDV – Quý ${quarterRoman}/${selectedYear}`,
        unit: 'Triệu đồng',
        valueColor: '#0369a1',
        note: `Biểu đồ tròn thể hiện cơ cấu tỷ trọng kế hoạch doanh thu giao cho 6 nhóm SPDV trong Quý ${quarterRoman}/${selectedYear}.`
      };
    }
    // 5. TH Năm
    if (key === 'spdv_th_year' || (key === 'chart16' && (title.includes('năm') || title.includes('cả năm')))) {
      return {
        badge: 'Biểu đồ 16 – Thực hiện Năm',
        period: 'year',
        metric: 'th',
        periodLabel: `Năm ${selectedYear} (lũy kế ${monthNum}T)`,
        metricLabel: `Doanh thu thực hiện (TH)`,
        shareLabel: 'Tỷ trọng TH',
        title: `Biểu đồ 16. Cơ cấu doanh thu thực hiện theo 6 nhóm SPDV – Năm ${selectedYear}`,
        unit: 'Triệu đồng',
        valueColor: '#1d4370',
        note: `Biểu đồ tròn thể hiện cơ cấu tỷ trọng doanh thu thực hiện của 6 nhóm SPDV trong Năm ${selectedYear} (lũy kế ${monthNum} tháng).`
      };
    }
    // 6. KH Năm
    if (key === 'spdv_kh_year' || (key === 'chart17' && (title.includes('năm') || title.includes('cả năm')))) {
      return {
        badge: 'Biểu đồ 17 – Kế hoạch Năm',
        period: 'year',
        metric: 'kh',
        periodLabel: `Năm ${selectedYear}`,
        metricLabel: `Doanh thu kế hoạch (KH)`,
        shareLabel: 'Tỷ trọng KH',
        title: `Biểu đồ 17. Cơ cấu doanh thu kế hoạch theo 6 nhóm SPDV – Năm ${selectedYear}`,
        unit: 'Triệu đồng',
        valueColor: '#0369a1',
        note: `Biểu đồ tròn thể hiện cơ cấu tỷ trọng kế hoạch doanh thu giao cho 6 nhóm SPDV trong cả Năm ${selectedYear}.`
      };
    }

    return null;
  }, [activeChartKey, chartTitle, isYoyComparison, isPrevPeriodComparison, monthNum, quarterRoman, quarterCumText, selectedYear]);

  // Detect single bar chart (Biểu đồ 18 - Tháng, Quý hoặc Năm)
  const singleBarConfig = useMemo(() => {
    if (isYoyComparison || isPrevPeriodComparison || singleStructureConfig) return null;
    const key = (activeChartKey || '').toLowerCase();
    const title = (chartTitle || '').toLowerCase();

    if (key === 'spdv_bar_month' || (key.startsWith('spdv_bar') && title.includes('tháng'))) {
      return {
        badge: 'Biểu đồ 18 – Tháng',
        period: 'month',
        periodLabel: `Tháng ${monthNum}/${selectedYear}`,
        thLabel: `TH T${monthNum}/${selectedYear}`,
        khLabel: `KH T${monthNum}/${selectedYear}`,
        title: `Biểu đồ 18. Doanh thu 6 nhóm SPDV so với KH – Tháng ${monthNum}/${selectedYear}`,
        unit: 'Tỷ đồng',
        note: `So sánh thực hiện với kế hoạch doanh thu của 6 nhóm sản phẩm dịch vụ trong Tháng ${monthNum}/${selectedYear}.`
      };
    }
    if (key === 'spdv_bar_quarter' || (key.startsWith('spdv_bar') && title.includes('quý'))) {
      return {
        badge: 'Biểu đồ 18 – Quý',
        period: 'quarter',
        periodLabel: `Quý ${quarterRoman}/${selectedYear}`,
        thLabel: `Ước TH Q${quarterRoman}/${selectedYear}`,
        khLabel: `KH Q${quarterRoman}/${selectedYear}`,
        title: `Biểu đồ 18. Doanh thu 6 nhóm SPDV so với KH – Quý ${quarterRoman}/${selectedYear}`,
        unit: 'Tỷ đồng',
        note: `So sánh ước thực hiện với kế hoạch doanh thu của 6 nhóm sản phẩm dịch vụ trong Quý ${quarterRoman}/${selectedYear}.`
      };
    }
    if (key === 'spdv_bar_year' || (key.startsWith('spdv_bar') && (title.includes('năm') || title.includes('cả năm')))) {
      return {
        badge: 'Biểu đồ 18 – Năm',
        period: 'year',
        periodLabel: `Năm ${selectedYear}`,
        thLabel: `Ước TH Năm ${selectedYear}`,
        khLabel: `KH Năm ${selectedYear}`,
        title: `Biểu đồ 18. Doanh thu 6 nhóm SPDV so với KH – Năm ${selectedYear}`,
        unit: 'Tỷ đồng',
        note: `So sánh ước thực hiện cả năm với kế hoạch doanh thu được giao năm ${selectedYear}.`
      };
    }
    return null;
  }, [activeChartKey, chartTitle, isYoyComparison, isPrevPeriodComparison, singleStructureConfig, monthNum, quarterRoman, selectedYear]);

  // Integrated structure table (Bảng cơ cấu tổng hợp 3 kỳ)
  const isStructureIntegrated = useMemo(() => {
    if (isYoyComparison || isPrevPeriodComparison) return false;
    const key = (activeChartKey || '').toLowerCase();
    return key === 'spdv_structure' || (singleStructureConfig && structureViewMode === 'integrated');
  }, [activeChartKey, isYoyComparison, isPrevPeriodComparison, singleStructureConfig, structureViewMode]);

  // Integrated bar table (Bảng so với KH 3 kỳ Biểu đồ 18)
  const isBarIntegrated = useMemo(() => {
    if (isYoyComparison || isPrevPeriodComparison || singleStructureConfig || isStructureIntegrated) return false;
    const key = (activeChartKey || '').toLowerCase();
    return key === 'spdv_bar_integrated' || (singleBarConfig && barViewMode === 'integrated');
  }, [activeChartKey, isYoyComparison, isPrevPeriodComparison, singleStructureConfig, isStructureIntegrated, singleBarConfig, barViewMode]);

  const formatSpdvNum = (val) => {
    if (val === null || val === undefined) return '—';
    if (typeof val === 'string') return val;
    return Number(val).toLocaleString('vi-VN', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    });
  };

  // Get bar comparison data for Biểu đồ 18 (Month, Quarter, Year)
  const barData = getSpdvBarComparisonData(selectedYear, selectedMonth);

  // 3-Period Integrated Data for Biểu đồ 18
  const integratedBarRows = useMemo(() => {
    const monthItems = barData.monthItems || [];
    const quarterItems = barData.quarterItems || [];
    const yearItems = barData.yearItems || [];

    return SPDV_CATEGORIES.map((cat, idx) => {
      const m = monthItems.find((it) => it.id === cat.id) || {};
      const q = quarterItems.find((it) => it.id === cat.id) || {};
      const y = yearItems.find((it) => it.id === cat.id) || {};

      const mTh = Number(m.th ?? 0);
      const mKh = Number(m.kh ?? 0);
      const mDiff = Number((mTh - mKh).toFixed(1));
      const mRate = m.rate || (mKh > 0 ? ((mTh / mKh) * 100).toFixed(1).replace('.', ',') + '%' : '0%');
      const mIsPass = m.isRatePositive !== undefined ? m.isRatePositive : (mKh > 0 && mTh >= mKh);

      const qTh = Number(q.th ?? 0);
      const qKh = Number(q.kh ?? 0);
      const qDiff = Number((qTh - qKh).toFixed(1));
      const qRate = q.rate || (qKh > 0 ? ((qTh / qKh) * 100).toFixed(1).replace('.', ',') + '%' : '0%');
      const qIsPass = q.isRatePositive !== undefined ? q.isRatePositive : (qKh > 0 && qTh >= qKh);

      const yTh = Number(y.th ?? 0);
      const yKh = Number(y.kh ?? 0);
      const yDiff = Number((yTh - yKh).toFixed(1));
      const yRate = y.rate || (yKh > 0 ? ((yTh / yKh) * 100).toFixed(1).replace('.', ',') + '%' : '0%');
      const yIsPass = y.isRatePositive !== undefined ? y.isRatePositive : (yKh > 0 && yTh >= yKh);

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
  }, [barData]);

  // Filtering for integrated Biểu đồ 18
  const filteredIntegratedRows = useMemo(() => {
    return integratedBarRows.filter((item) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase().trim();
        if (!item.name.toLowerCase().includes(q)) return false;
      }
      if (statusFilter === 'pass' && !item.year.isPass) return false;
      if (statusFilter === 'fail' && item.year.isPass) return false;
      return true;
    });
  }, [integratedBarRows, searchQuery, statusFilter]);

  // Integrated totals for Biểu đồ 18
  const integratedTotals = useMemo(() => {
    const monthItems = barData.monthItems || [];
    const quarterItems = barData.quarterItems || [];
    const yearItems = barData.yearItems || [];

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
  }, [barData]);

  // Biểu đồ 19 YoY Comparison Data (Tích hợp số liệu 3 hình: Tháng, Quý, Lũy kế)
  const yoyData = getSpdvYoyComparisonData(selectedYear, selectedMonth);
  const lastYear = (parseInt(selectedYear, 10) - 1).toString();

  const integratedYoyRows = useMemo(() => {
    const mItems = yoyData.monthItems || [];
    const qItems = yoyData.quarterItems || [];
    const yItems = yoyData.yearItems || [];

    return SPDV_CATEGORIES.map((cat, idx) => {
      const m = mItems.find((it) => it.id === cat.id) || {};
      const q = qItems.find((it) => it.id === cat.id) || {};
      const y = yItems.find((it) => it.id === cat.id) || {};

      const mCurr = Number(m.curr ?? 0);
      const mPrev = Number(m.prev ?? 0);
      const mDiff = Number((mCurr - mPrev).toFixed(1));
      const mRate = m.rate || (mPrev > 0 ? ((mCurr / mPrev) * 100).toFixed(1).replace('.', ',') + '%' : '0%');
      const mIsPass = m.isRatePositive !== undefined ? m.isRatePositive : (mCurr >= mPrev);

      const qCurr = Number(q.curr ?? 0);
      const qPrev = Number(q.prev ?? 0);
      const qDiff = Number((qCurr - qPrev).toFixed(1));
      const qRate = q.rate || (qPrev > 0 ? ((qCurr / qPrev) * 100).toFixed(1).replace('.', ',') + '%' : '0%');
      const qIsPass = q.isRatePositive !== undefined ? q.isRatePositive : (qCurr >= qPrev);

      const yCurr = Number(y.curr ?? 0);
      const yPrev = Number(y.prev ?? 0);
      const yDiff = Number((yCurr - yPrev).toFixed(1));
      const yRate = y.rate || (yPrev > 0 ? ((yCurr / yPrev) * 100).toFixed(1).replace('.', ',') + '%' : '0%');
      const yIsPass = y.isRatePositive !== undefined ? y.isRatePositive : (yCurr >= yPrev);

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
  }, [yoyData]);

  const filteredYoyRows = useMemo(() => {
    return integratedYoyRows.filter((item) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase().trim();
        if (!item.name.toLowerCase().includes(q)) return false;
      }
      if (statusFilter === 'pass' && !item.year.isPass) return false;
      if (statusFilter === 'fail' && item.year.isPass) return false;
      return true;
    });
  }, [integratedYoyRows, searchQuery, statusFilter]);

  const yoyTotals = useMemo(() => {
    const mItems = yoyData.monthItems || [];
    const qItems = yoyData.quarterItems || [];
    const yItems = yoyData.yearItems || [];

    const mTotalCurr = mItems.reduce((acc, it) => acc + (Number(it.curr) || 0), 0);
    const mTotalPrev = mItems.reduce((acc, it) => acc + (Number(it.prev) || 0), 0);
    const mTotalDiff = Number((mTotalCurr - mTotalPrev).toFixed(1));
    const mTotalRate = mTotalPrev > 0 ? (mTotalCurr / mTotalPrev) * 100 : 0;

    const qTotalCurr = qItems.reduce((acc, it) => acc + (Number(it.curr) || 0), 0);
    const qTotalPrev = qItems.reduce((acc, it) => acc + (Number(it.prev) || 0), 0);
    const qTotalDiff = Number((qTotalCurr - qTotalPrev).toFixed(1));
    const qTotalRate = qTotalPrev > 0 ? (qTotalCurr / qTotalPrev) * 100 : 0;

    const yTotalCurr = yItems.reduce((acc, it) => acc + (Number(it.curr) || 0), 0);
    const yTotalPrev = yItems.reduce((acc, it) => acc + (Number(it.prev) || 0), 0);
    const yTotalDiff = Number((yTotalCurr - yTotalPrev).toFixed(1));
    const yTotalRate = yTotalPrev > 0 ? (yTotalCurr / yTotalPrev) * 100 : 0;

    return {
      month: {
        curr: mTotalCurr,
        prev: mTotalPrev,
        diff: mTotalDiff,
        rate: mTotalRate.toFixed(1).replace('.', ',') + '%',
        isPass: mTotalRate >= 100
      },
      quarter: {
        curr: qTotalCurr,
        prev: qTotalPrev,
        diff: qTotalDiff,
        rate: qTotalRate.toFixed(1).replace('.', ',') + '%',
        isPass: qTotalRate >= 100
      },
      year: {
        curr: yTotalCurr,
        prev: yTotalPrev,
        diff: yTotalDiff,
        rate: yTotalRate.toFixed(1).replace('.', ',') + '%',
        isPass: yTotalRate >= 100
      }
    };
  }, [yoyData]);

  // Biểu đồ 20 Prev Period Comparison Data
  const prevPeriodData = getSpdvPrevPeriodComparisonData(selectedYear, selectedMonth);

  const integratedPrevPeriodRows = useMemo(() => {
    const mItems = prevPeriodData.monthItems || [];
    const qItems = prevPeriodData.quarterItems || [];
    const yItems = prevPeriodData.yearItems || [];

    return SPDV_CATEGORIES.map((cat, idx) => {
      const m = mItems.find((it) => it.id === cat.id) || {};
      const q = qItems.find((it) => it.id === cat.id) || {};
      const y = yItems.find((it) => it.id === cat.id) || {};

      const mCurr = Number(m.curr ?? 0);
      const mPrev = Number(m.prev ?? 0);
      const mDiff = Number((mCurr - mPrev).toFixed(1));
      const mRate = m.rate || (mPrev > 0 ? ((mCurr / mPrev) * 100).toFixed(1).replace('.', ',') + '%' : '0%');
      const mIsPass = m.isRatePositive !== undefined ? m.isRatePositive : (mCurr >= mPrev);

      const qCurr = Number(q.curr ?? 0);
      const qPrev = Number(q.prev ?? 0);
      const qDiff = Number((qCurr - qPrev).toFixed(1));
      const qRate = q.rate || (qPrev > 0 ? ((qCurr / qPrev) * 100).toFixed(1).replace('.', ',') + '%' : '0%');
      const qIsPass = q.isRatePositive !== undefined ? q.isRatePositive : (qCurr >= qPrev);

      const yCurr = Number(y.curr ?? 0);
      const yPrev = Number(y.prev ?? 0);
      const yDiff = Number((yCurr - yPrev).toFixed(1));
      const yRate = y.rate || (yPrev > 0 ? ((yCurr / yPrev) * 100).toFixed(1).replace('.', ',') + '%' : '0%');
      const yIsPass = y.isRatePositive !== undefined ? y.isRatePositive : (yCurr >= yPrev);

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

  const filteredPrevPeriodRows = useMemo(() => {
    return integratedPrevPeriodRows.filter((item) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase().trim();
        if (!item.name.toLowerCase().includes(q)) return false;
      }
      if (statusFilter === 'pass' && !item.year.isPass) return false;
      if (statusFilter === 'fail' && item.year.isPass) return false;
      return true;
    });
  }, [integratedPrevPeriodRows, searchQuery, statusFilter]);

  const prevPeriodTotals = useMemo(() => {
    const mItems = prevPeriodData.monthItems || [];
    const qItems = prevPeriodData.quarterItems || [];
    const yItems = prevPeriodData.yearItems || [];

    const mTotalCurr = mItems.reduce((acc, it) => acc + (Number(it.curr) || 0), 0);
    const mTotalPrev = mItems.reduce((acc, it) => acc + (Number(it.prev) || 0), 0);
    const mTotalDiff = Number((mTotalCurr - mTotalPrev).toFixed(1));
    const mTotalRate = mTotalPrev > 0 ? (mTotalCurr / mTotalPrev) * 100 : 0;

    const qTotalCurr = qItems.reduce((acc, it) => acc + (Number(it.curr) || 0), 0);
    const qTotalPrev = qItems.reduce((acc, it) => acc + (Number(it.prev) || 0), 0);
    const qTotalDiff = Number((qTotalCurr - qTotalPrev).toFixed(1));
    const qTotalRate = qTotalPrev > 0 ? (qTotalCurr / qTotalPrev) * 100 : 0;

    const yTotalCurr = yItems.reduce((acc, it) => acc + (Number(it.curr) || 0), 0);
    const yTotalPrev = yItems.reduce((acc, it) => acc + (Number(it.prev) || 0), 0);
    const yTotalDiff = Number((yTotalCurr - yTotalPrev).toFixed(1));
    const yTotalRate = yTotalPrev > 0 ? (yTotalCurr / yTotalPrev) * 100 : 0;

    return {
      month: {
        curr: mTotalCurr,
        prev: mTotalPrev,
        diff: mTotalDiff,
        rate: mTotalRate.toFixed(1).replace('.', ',') + '%',
        isPass: mTotalRate >= 100
      },
      quarter: {
        curr: qTotalCurr,
        prev: qTotalPrev,
        diff: qTotalDiff,
        rate: qTotalRate.toFixed(1).replace('.', ',') + '%',
        isPass: qTotalRate >= 100
      },
      year: {
        curr: yTotalCurr,
        prev: yTotalPrev,
        diff: yTotalDiff,
        rate: yTotalRate.toFixed(1).replace('.', ',') + '%',
        isPass: yTotalRate >= 100
      }
    };
  }, [prevPeriodData]);

  // Structure Table Data (Biểu đồ 16 & 17)
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

  // Single structure table rows (Filtered for specific chart: TH or KH, Month or Quarter or Year)
  const singleStructureRows = useMemo(() => {
    if (!singleStructureConfig) return [];
    const { period, metric } = singleStructureConfig;
    return filteredStructureRows.map((r, idx) => {
      const p = r[period] || {};
      const val = metric === 'th' ? p.th : p.kh;
      const share = metric === 'th' ? p.thShare : p.khShare;
      return {
        id: r.id,
        stt: idx + 1,
        name: r.name,
        color: r.color,
        val,
        share
      };
    });
  }, [singleStructureConfig, filteredStructureRows]);

  const singleStructureTotal = useMemo(() => {
    if (!singleStructureConfig || !structureData.total) return null;
    const { period, metric } = singleStructureConfig;
    const p = structureData.total[period] || {};
    return {
      val: metric === 'th' ? p.th : p.kh,
      share: metric === 'th' ? p.thShare : p.khShare
    };
  }, [singleStructureConfig, structureData]);

  // Single bar table rows (Filtered for specific period: Tháng, Quý, or Năm)
  const singleBarRows = useMemo(() => {
    if (!singleBarConfig) return [];
    const period = singleBarConfig.period;
    return filteredIntegratedRows.map((item, idx) => {
      const pData = item[period] || {};
      return {
        id: item.id,
        stt: idx + 1,
        name: item.name,
        color: item.color,
        th: pData.th,
        kh: pData.kh,
        diff: pData.diff,
        rate: pData.rate,
        isPass: pData.isPass
      };
    });
  }, [singleBarConfig, filteredIntegratedRows]);

  const singleBarTotal = useMemo(() => {
    if (!singleBarConfig || !integratedTotals) return null;
    return integratedTotals[singleBarConfig.period];
  }, [singleBarConfig, integratedTotals]);

  return (
    <div className="spdv-detail-table-card">
      {/* Top Header with title and controls */}
      <div className="spdv-detail-header-wrap">
        <div className="spdv-header-title-box">
          {/* Subcard tag */}
          {singleStructureConfig && structureViewMode === 'single' && (
            <span className="spdv-badge-chart-label">
              <PieChart size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
              {singleStructureConfig.badge}
            </span>
          )}
          {singleBarConfig && barViewMode === 'single' && (
            <span className="spdv-badge-chart-label">
              <BarChart3 size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
              {singleBarConfig.badge}
            </span>
          )}
          {isYoyComparison && (
            <span className="spdv-badge-chart-label">Biểu đồ 19 – 3 Kỳ</span>
          )}
          {isPrevPeriodComparison && (
            <span className="spdv-badge-chart-label">Biểu đồ 20 – 3 Kỳ</span>
          )}
          {(isStructureIntegrated || isBarIntegrated) && (
            <span className="spdv-badge-chart-label">
              <Layers size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
              Bảng ma trận tổng hợp 3 kỳ
            </span>
          )}

          <h3 className="spdv-detail-title">
            {isYoyComparison
              ? `Biểu đồ 19. Doanh thu 6 nhóm SPDV so với cùng kỳ năm trước`
              : isPrevPeriodComparison
              ? `Biểu đồ 20. Doanh thu 6 nhóm SPDV so với kỳ trước`
              : singleStructureConfig && structureViewMode === 'single'
              ? singleStructureConfig.title
              : singleBarConfig && barViewMode === 'single'
              ? singleBarConfig.title
              : isStructureIntegrated
              ? `Cơ cấu doanh thu theo nhóm SPDV (Bảng tổng hợp cả 3 kỳ)`
              : `Biểu đồ 18. Doanh thu 6 nhóm SPDV so với KH (Bảng tổng hợp 3 kỳ)`}
          </h3>

          <span className="spdv-detail-unit">
            {singleStructureConfig && structureViewMode === 'single'
              ? `(${singleStructureConfig.unit})`
              : isStructureIntegrated
              ? '(Đơn vị: Triệu đồng)'
              : '(Đơn vị: Tỷ đồng)'}
          </span>
        </div>

        {/* Action Toggle Switchers */}
        <div className="spdv-header-actions">
          {/* Switcher for single structure chart (Biểu đồ 16 & 17) */}
          {singleStructureConfig && (
            <div className="spdv-period-tab-group">
              <button
                type="button"
                className={`spdv-period-tab-btn ${structureViewMode === 'single' ? 'active' : ''}`}
                onClick={() => setStructureViewMode('single')}
              >
                Chỉ xem biểu đồ này
              </button>
              <button
                type="button"
                className={`spdv-period-tab-btn ${structureViewMode === 'integrated' ? 'active' : ''}`}
                onClick={() => setStructureViewMode('integrated')}
              >
                Xem tổng hợp 3 kỳ (TH & KH)
              </button>
            </div>
          )}

          {/* Switcher for single bar comparison chart (Biểu đồ 18) */}
          {singleBarConfig && (
            <div className="spdv-period-tab-group">
              <button
                type="button"
                className={`spdv-period-tab-btn ${barViewMode === 'single' ? 'active' : ''}`}
                onClick={() => setBarViewMode('single')}
              >
                Chỉ xem {singleBarConfig.periodLabel}
              </button>
              <button
                type="button"
                className={`spdv-period-tab-btn ${barViewMode === 'integrated' ? 'active' : ''}`}
                onClick={() => setBarViewMode('integrated')}
              >
                Xem tổng hợp cả 3 kỳ
              </button>
            </div>
          )}
        </div>

        {/* Note / Basis description */}
        {isYoyComparison && (
          <div style={{ width: '100%', fontSize: '13px', color: '#475569', marginTop: '2px' }}>
            <strong>Cơ sở so sánh:</strong> {yoyData.monthBasis} | Quý: {yoyData.quarterBasis} | Năm: {yoyData.yearBasis}
          </div>
        )}
        {isPrevPeriodComparison && (
          <div style={{ width: '100%', fontSize: '13px', color: '#475569', marginTop: '2px' }}>
            <strong>Cơ sở so sánh:</strong> {prevPeriodData.monthBasis} | Quý: {prevPeriodData.quarterBasis} | Năm: {prevPeriodData.yearBasis}
          </div>
        )}
      </div>

      {/* TABLE VIEWS ROUTING */}
      {isYoyComparison ? (
        /* ===================================================================== */
        /* VIEW 1: BIỂU ĐỒ 19: SO VỚI CÙNG KỲ NĂM TRƯỚC (3 KỲ THÁNG, QUÝ, NĂM)   */
        /* ===================================================================== */
        <div className="spdv-detail-table-wrap">
          <table className="spdv-matrix-table">
            <thead>
              <tr className="spdv-th-top-row">
                <th rowSpan={2} style={{ width: '50px', textAlign: 'center' }}>STT</th>
                <th rowSpan={2} className="spdv-th-name">Nhóm SPDV</th>
                <th colSpan={4} className="spdv-th-period-group spdv-col-period-month">
                  {yoyData.monthTitle} ({yoyData.monthBasis})
                </th>
                <th colSpan={4} className="spdv-th-period-group spdv-col-period-quarter">
                  {yoyData.quarterTitle} ({yoyData.quarterBasis})
                </th>
                <th colSpan={4} className="spdv-th-period-group spdv-col-period-year">
                  {yoyData.yearTitle} ({yoyData.yearBasis})
                </th>
              </tr>
              <tr className="spdv-th-sub-row">
                {/* Tháng */}
                <th className="spdv-th-col spdv-th-th spdv-border-left">{yoyData.monthLegendCurr}</th>
                <th className="spdv-th-col spdv-th-kh">{yoyData.monthLegendPrev}</th>
                <th className="spdv-th-col spdv-th-th">+/- Chênh lệch</th>
                <th className="spdv-th-col spdv-th-rate" style={{ textAlign: 'center' }}>% TH/cùng kỳ</th>

                {/* Quý */}
                <th className="spdv-th-col spdv-th-th spdv-border-left">{yoyData.quarterLegendCurr}</th>
                <th className="spdv-th-col spdv-th-kh">{yoyData.quarterLegendPrev}</th>
                <th className="spdv-th-col spdv-th-th">+/- Chênh lệch</th>
                <th className="spdv-th-col spdv-th-rate" style={{ textAlign: 'center' }}>% TH/cùng kỳ</th>

                {/* Năm */}
                <th className="spdv-th-col spdv-th-th spdv-border-left">{yoyData.yearLegendCurr}</th>
                <th className="spdv-th-col spdv-th-kh">{yoyData.yearLegendPrev}</th>
                <th className="spdv-th-col spdv-th-th">+/- Chênh lệch</th>
                <th className="spdv-th-col spdv-th-rate" style={{ textAlign: 'center' }}>% TH/cùng kỳ</th>
              </tr>
            </thead>
            <tbody>
              {filteredYoyRows.length > 0 ? (
                filteredYoyRows.map((row) => (
                  <tr key={row.id} className="spdv-row">
                    <td style={{ textAlign: 'center', fontWeight: '600', color: '#64748b' }}>
                      {row.stt}
                    </td>
                    <td className="spdv-td-name">
                      <span className="spdv-dot" style={{ backgroundColor: row.color }}></span>
                      <span className="spdv-name-label">{row.name}</span>
                    </td>

                    {/* Tháng */}
                    <td className="spdv-td-num spdv-border-left font-bold" style={{ color: '#1d4370' }}>
                      {formatSpdvNum(row.month?.curr)}
                    </td>
                    <td className="spdv-td-num font-semibold" style={{ color: '#475569' }}>
                      {formatSpdvNum(row.month?.prev)}
                    </td>
                    <td className={`spdv-td-num font-bold ${row.month?.diff >= 0 ? 'text-green' : 'text-red'}`}>
                      {row.month?.diff >= 0 ? `+${formatSpdvNum(row.month?.diff)}` : formatSpdvNum(row.month?.diff)}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`spdv-rate-pill ${row.month?.isPass ? 'rate-pass' : 'rate-fail'}`}>
                        {row.month?.rate}
                      </span>
                    </td>

                    {/* Quý */}
                    <td className="spdv-td-num spdv-border-left font-bold" style={{ color: '#1d4370' }}>
                      {formatSpdvNum(row.quarter?.curr)}
                    </td>
                    <td className="spdv-td-num font-semibold" style={{ color: '#475569' }}>
                      {formatSpdvNum(row.quarter?.prev)}
                    </td>
                    <td className={`spdv-td-num font-bold ${row.quarter?.diff >= 0 ? 'text-green' : 'text-red'}`}>
                      {row.quarter?.diff >= 0 ? `+${formatSpdvNum(row.quarter?.diff)}` : formatSpdvNum(row.quarter?.diff)}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`spdv-rate-pill ${row.quarter?.isPass ? 'rate-pass' : 'rate-fail'}`}>
                        {row.quarter?.rate}
                      </span>
                    </td>

                    {/* Năm */}
                    <td className="spdv-td-num spdv-border-left font-bold" style={{ color: '#1d4370' }}>
                      {formatSpdvNum(row.year?.curr)}
                    </td>
                    <td className="spdv-td-num font-semibold" style={{ color: '#475569' }}>
                      {formatSpdvNum(row.year?.prev)}
                    </td>
                    <td className={`spdv-td-num font-bold ${row.year?.diff >= 0 ? 'text-green' : 'text-red'}`}>
                      {row.year?.diff >= 0 ? `+${formatSpdvNum(row.year?.diff)}` : formatSpdvNum(row.year?.diff)}
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

                {/* Tháng */}
                <td className="spdv-td-num font-extrabold spdv-border-left" style={{ color: '#1d4370' }}>
                  {formatSpdvNum(yoyTotals.month.curr)}
                </td>
                <td className="spdv-td-num font-extrabold" style={{ color: '#475569' }}>
                  {formatSpdvNum(yoyTotals.month.prev)}
                </td>
                <td className={`spdv-td-num font-extrabold ${yoyTotals.month.diff >= 0 ? 'text-green' : 'text-red'}`}>
                  {yoyTotals.month.diff >= 0 ? `+${formatSpdvNum(yoyTotals.month.diff)}` : formatSpdvNum(yoyTotals.month.diff)}
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span className={`spdv-rate-pill spdv-rate-pill-total ${yoyTotals.month.isPass ? 'rate-pass' : 'rate-fail'}`}>
                    {yoyTotals.month.rate}
                  </span>
                </td>

                {/* Quý */}
                <td className="spdv-td-num font-extrabold spdv-border-left" style={{ color: '#1d4370' }}>
                  {formatSpdvNum(yoyTotals.quarter.curr)}
                </td>
                <td className="spdv-td-num font-extrabold" style={{ color: '#475569' }}>
                  {formatSpdvNum(yoyTotals.quarter.prev)}
                </td>
                <td className={`spdv-td-num font-extrabold ${yoyTotals.quarter.diff >= 0 ? 'text-green' : 'text-red'}`}>
                  {yoyTotals.quarter.diff >= 0 ? `+${formatSpdvNum(yoyTotals.quarter.diff)}` : formatSpdvNum(yoyTotals.quarter.diff)}
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span className={`spdv-rate-pill spdv-rate-pill-total ${yoyTotals.quarter.isPass ? 'rate-pass' : 'rate-fail'}`}>
                    {yoyTotals.quarter.rate}
                  </span>
                </td>

                {/* Năm */}
                <td className="spdv-td-num font-extrabold spdv-border-left" style={{ color: '#1d4370' }}>
                  {formatSpdvNum(yoyTotals.year.curr)}
                </td>
                <td className="spdv-td-num font-extrabold" style={{ color: '#475569' }}>
                  {formatSpdvNum(yoyTotals.year.prev)}
                </td>
                <td className={`spdv-td-num font-extrabold ${yoyTotals.year.diff >= 0 ? 'text-green' : 'text-red'}`}>
                  {yoyTotals.year.diff >= 0 ? `+${formatSpdvNum(yoyTotals.year.diff)}` : formatSpdvNum(yoyTotals.year.diff)}
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span className={`spdv-rate-pill spdv-rate-pill-total ${yoyTotals.year.isPass ? 'rate-pass' : 'rate-fail'}`}>
                    {yoyTotals.year.rate}
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      ) : isPrevPeriodComparison ? (
        /* ===================================================================== */
        /* VIEW 2: BIỂU ĐỒ 20: SO VỚI KỲ TRƯỚC (3 KỲ THÁNG, QUÝ, NĂM)             */
        /* ===================================================================== */
        <div className="spdv-detail-table-wrap">
          <table className="spdv-matrix-table">
            <thead>
              <tr className="spdv-th-top-row">
                <th rowSpan={2} style={{ width: '50px', textAlign: 'center' }}>STT</th>
                <th rowSpan={2} className="spdv-th-name">Nhóm SPDV</th>
                <th colSpan={4} className="spdv-th-period-group spdv-col-period-month">
                  {prevPeriodData.monthTitle} ({prevPeriodData.monthBasis})
                </th>
                <th colSpan={4} className="spdv-th-period-group spdv-col-period-quarter">
                  {prevPeriodData.quarterTitle} ({prevPeriodData.quarterBasis})
                </th>
                <th colSpan={4} className="spdv-th-period-group spdv-col-period-year">
                  {prevPeriodData.yearTitle} ({prevPeriodData.yearBasis})
                </th>
              </tr>
              <tr className="spdv-th-sub-row">
                {/* Tháng */}
                <th className="spdv-th-col spdv-th-th spdv-border-left">{prevPeriodData.monthLegendCurr}</th>
                <th className="spdv-th-col spdv-th-kh">{prevPeriodData.monthLegendPrev}</th>
                <th className="spdv-th-col spdv-th-th">+/- Chênh lệch</th>
                <th className="spdv-th-col spdv-th-rate" style={{ textAlign: 'center' }}>% TH/kỳ trước</th>

                {/* Quý */}
                <th className="spdv-th-col spdv-th-th spdv-border-left">{prevPeriodData.quarterLegendCurr}</th>
                <th className="spdv-th-col spdv-th-kh">{prevPeriodData.quarterLegendPrev}</th>
                <th className="spdv-th-col spdv-th-th">+/- Chênh lệch</th>
                <th className="spdv-th-col spdv-th-rate" style={{ textAlign: 'center' }}>% TH/kỳ trước</th>

                {/* Năm */}
                <th className="spdv-th-col spdv-th-th spdv-border-left">{prevPeriodData.yearLegendCurr}</th>
                <th className="spdv-th-col spdv-th-kh">{prevPeriodData.yearLegendPrev}</th>
                <th className="spdv-th-col spdv-th-th">+/- Chênh lệch</th>
                <th className="spdv-th-col spdv-th-rate" style={{ textAlign: 'center' }}>% TH/kỳ trước</th>
              </tr>
            </thead>
            <tbody>
              {filteredPrevPeriodRows.length > 0 ? (
                filteredPrevPeriodRows.map((row) => (
                  <tr key={row.id} className="spdv-row">
                    <td style={{ textAlign: 'center', fontWeight: '600', color: '#64748b' }}>
                      {row.stt}
                    </td>
                    <td className="spdv-td-name">
                      <span className="spdv-dot" style={{ backgroundColor: row.color }}></span>
                      <span className="spdv-name-label">{row.name}</span>
                    </td>

                    {/* Tháng */}
                    <td className="spdv-td-num spdv-border-left font-bold" style={{ color: '#1d4370' }}>
                      {formatSpdvNum(row.month?.curr)}
                    </td>
                    <td className="spdv-td-num font-semibold" style={{ color: '#475569' }}>
                      {formatSpdvNum(row.month?.prev)}
                    </td>
                    <td className={`spdv-td-num font-bold ${row.month?.diff >= 0 ? 'text-green' : 'text-red'}`}>
                      {row.month?.diff >= 0 ? `+${formatSpdvNum(row.month?.diff)}` : formatSpdvNum(row.month?.diff)}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`spdv-rate-pill ${row.month?.isPass ? 'rate-pass' : 'rate-fail'}`}>
                        {row.month?.rate}
                      </span>
                    </td>

                    {/* Quý */}
                    <td className="spdv-td-num spdv-border-left font-bold" style={{ color: '#1d4370' }}>
                      {formatSpdvNum(row.quarter?.curr)}
                    </td>
                    <td className="spdv-td-num font-semibold" style={{ color: '#475569' }}>
                      {formatSpdvNum(row.quarter?.prev)}
                    </td>
                    <td className={`spdv-td-num font-bold ${row.quarter?.diff >= 0 ? 'text-green' : 'text-red'}`}>
                      {row.quarter?.diff >= 0 ? `+${formatSpdvNum(row.quarter?.diff)}` : formatSpdvNum(row.quarter?.diff)}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`spdv-rate-pill ${row.quarter?.isPass ? 'rate-pass' : 'rate-fail'}`}>
                        {row.quarter?.rate}
                      </span>
                    </td>

                    {/* Năm */}
                    <td className="spdv-td-num spdv-border-left font-bold" style={{ color: '#1d4370' }}>
                      {formatSpdvNum(row.year?.curr)}
                    </td>
                    <td className="spdv-td-num font-semibold" style={{ color: '#475569' }}>
                      {formatSpdvNum(row.year?.prev)}
                    </td>
                    <td className={`spdv-td-num font-bold ${row.year?.diff >= 0 ? 'text-green' : 'text-red'}`}>
                      {row.year?.diff >= 0 ? `+${formatSpdvNum(row.year?.diff)}` : formatSpdvNum(row.year?.diff)}
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

                {/* Tháng */}
                <td className="spdv-td-num font-extrabold spdv-border-left" style={{ color: '#1d4370' }}>
                  {formatSpdvNum(prevPeriodTotals.month.curr)}
                </td>
                <td className="spdv-td-num font-extrabold" style={{ color: '#475569' }}>
                  {formatSpdvNum(prevPeriodTotals.month.prev)}
                </td>
                <td className={`spdv-td-num font-extrabold ${prevPeriodTotals.month.diff >= 0 ? 'text-green' : 'text-red'}`}>
                  {prevPeriodTotals.month.diff >= 0 ? `+${formatSpdvNum(prevPeriodTotals.month.diff)}` : formatSpdvNum(prevPeriodTotals.month.diff)}
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span className={`spdv-rate-pill spdv-rate-pill-total ${prevPeriodTotals.month.isPass ? 'rate-pass' : 'rate-fail'}`}>
                    {prevPeriodTotals.month.rate}
                  </span>
                </td>

                {/* Quý */}
                <td className="spdv-td-num font-extrabold spdv-border-left" style={{ color: '#1d4370' }}>
                  {formatSpdvNum(prevPeriodTotals.quarter.curr)}
                </td>
                <td className="spdv-td-num font-extrabold" style={{ color: '#475569' }}>
                  {formatSpdvNum(prevPeriodTotals.quarter.prev)}
                </td>
                <td className={`spdv-td-num font-extrabold ${prevPeriodTotals.quarter.diff >= 0 ? 'text-green' : 'text-red'}`}>
                  {prevPeriodTotals.quarter.diff >= 0 ? `+${formatSpdvNum(prevPeriodTotals.quarter.diff)}` : formatSpdvNum(prevPeriodTotals.quarter.diff)}
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span className={`spdv-rate-pill spdv-rate-pill-total ${prevPeriodTotals.quarter.isPass ? 'rate-pass' : 'rate-fail'}`}>
                    {prevPeriodTotals.quarter.rate}
                  </span>
                </td>

                {/* Năm */}
                <td className="spdv-td-num font-extrabold spdv-border-left" style={{ color: '#1d4370' }}>
                  {formatSpdvNum(prevPeriodTotals.year.curr)}
                </td>
                <td className="spdv-td-num font-extrabold" style={{ color: '#475569' }}>
                  {formatSpdvNum(prevPeriodTotals.year.prev)}
                </td>
                <td className={`spdv-td-num font-extrabold ${prevPeriodTotals.year.diff >= 0 ? 'text-green' : 'text-red'}`}>
                  {prevPeriodTotals.year.diff >= 0 ? `+${formatSpdvNum(prevPeriodTotals.year.diff)}` : formatSpdvNum(prevPeriodTotals.year.diff)}
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span className={`spdv-rate-pill spdv-rate-pill-total ${prevPeriodTotals.year.isPass ? 'rate-pass' : 'rate-fail'}`}>
                    {prevPeriodTotals.year.rate}
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      ) : singleStructureConfig && structureViewMode === 'single' ? (
        /* ===================================================================== */
        /* VIEW 3: BẢNG SỐ LIỆU TƯƠNG ỨNG TỪNG BIỂU ĐỒ TRÒN (TH/KH THEO 1 KỲ)    */
        /* (Ví dụ: TH - Tháng 8/2026 thì chỉ hiển thị đúng cột TH Tháng 8)       */
        /* ===================================================================== */
        <div className="spdv-detail-table-wrap">
          <table className="spdv-matrix-table">
            <thead>
              <tr className="spdv-th-top-row">
                <th style={{ width: '60px', textAlign: 'center' }}>STT</th>
                <th className="spdv-th-name" style={{ width: '320px' }}>Nhóm SPDV</th>
                <th style={{ textAlign: 'right', paddingRight: '28px', backgroundColor: '#f1f6fd', color: '#0f172a', fontWeight: '800' }}>
                  {singleStructureConfig.metricLabel} – {singleStructureConfig.periodLabel} ({singleStructureConfig.unit})
                </th>
                <th style={{ textAlign: 'center', width: '180px', backgroundColor: '#f1f6fd', color: '#0f172a', fontWeight: '800' }}>
                  {singleStructureConfig.shareLabel} (%)
                </th>
              </tr>
            </thead>
            <tbody>
              {singleStructureRows.length > 0 ? (
                singleStructureRows.map((row) => (
                  <tr key={row.id} className="spdv-row">
                    <td style={{ textAlign: 'center', fontWeight: '600', color: '#64748b' }}>
                      {row.stt}
                    </td>
                    <td className="spdv-td-name">
                      <span className="spdv-dot" style={{ backgroundColor: row.color }}></span>
                      <span className="spdv-name-label">{row.name}</span>
                    </td>
                    <td className="spdv-td-num font-bold" style={{ color: singleStructureConfig.valueColor, paddingRight: '28px', fontSize: '14.5px' }}>
                      {formatSpdvNum(row.val)}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span
                        className="spdv-rate-pill"
                        style={{
                          backgroundColor: '#eff6ff',
                          color: '#1d4ed8',
                          border: '1px solid #bfdbfe',
                          fontWeight: '800'
                        }}
                      >
                        {row.share}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="spdv-no-data-cell">
                    Không tìm thấy dữ liệu nhóm SPDV phù hợp với điều kiện tìm kiếm
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr className="spdv-tr-total">
                <td style={{ textAlign: 'center', fontWeight: '800' }}>Σ</td>
                <td className="spdv-td-name font-bold">
                  {structureData.total?.name || 'Tổng doanh thu 6 nhóm SPDV'}
                </td>
                <td className="spdv-td-num font-extrabold" style={{ color: singleStructureConfig.valueColor, paddingRight: '28px', fontSize: '15px' }}>
                  {formatSpdvNum(singleStructureTotal?.val)}
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span
                    className="spdv-rate-pill spdv-rate-pill-total"
                    style={{
                      backgroundColor: '#dbeafe',
                      color: '#1e3a8a',
                      border: '1px solid #93c5fd',
                      fontWeight: '800'
                    }}
                  >
                    {singleStructureTotal?.share || '100%'}
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Under-table Note */}
          <div style={{ marginTop: '14px', padding: '10px 14px', background: '#f8fafc', borderLeft: '4px solid #2563eb', borderRadius: '4px', fontSize: '13px', color: '#1e293b' }}>
            <strong>Ghi chú:</strong> {singleStructureConfig.note}
          </div>
        </div>
      ) : singleBarConfig && barViewMode === 'single' ? (
        /* ===================================================================== */
        /* VIEW 4: BẢNG SỐ LIỆU TƯƠNG ỨNG 1 KỲ BIỂU ĐỒ 18 (THÁNG, QUÝ HOẶC NĂM)   */
        /* (Ví dụ: Biểu đồ 18 Tháng 8 thì chỉ hiển thị đúng cột của Tháng 8)     */
        /* ===================================================================== */
        <div className="spdv-detail-table-wrap">
          <table className="spdv-matrix-table">
            <thead>
              <tr className="spdv-th-top-row">
                <th style={{ width: '50px', textAlign: 'center' }}>STT</th>
                <th className="spdv-th-name" style={{ width: '280px' }}>Nhóm SPDV</th>
                <th style={{ textAlign: 'right', paddingRight: '20px', backgroundColor: '#f1f6fd', color: '#0f172a', fontWeight: '800' }}>
                  {singleBarConfig.thLabel} ({singleBarConfig.unit})
                </th>
                <th style={{ textAlign: 'right', paddingRight: '20px', backgroundColor: '#f1f6fd', color: '#0f172a', fontWeight: '800' }}>
                  {singleBarConfig.khLabel} ({singleBarConfig.unit})
                </th>
                <th style={{ textAlign: 'right', paddingRight: '20px', backgroundColor: '#f1f6fd', color: '#0f172a', fontWeight: '800' }}>
                  +/- so KH ({singleBarConfig.unit})
                </th>
                <th style={{ textAlign: 'center', width: '150px', backgroundColor: '#f1f6fd', color: '#0f172a', fontWeight: '800' }}>
                  % HTKH
                </th>
              </tr>
            </thead>
            <tbody>
              {singleBarRows.length > 0 ? (
                singleBarRows.map((row) => (
                  <tr key={row.id} className="spdv-row">
                    <td style={{ textAlign: 'center', fontWeight: '600', color: '#64748b' }}>
                      {row.stt}
                    </td>
                    <td className="spdv-td-name">
                      <span className="spdv-dot" style={{ backgroundColor: row.color }}></span>
                      <span className="spdv-name-label">{row.name}</span>
                    </td>
                    <td className="spdv-td-num font-bold" style={{ color: '#0f172a', paddingRight: '20px' }}>
                      {formatSpdvNum(row.th)}
                    </td>
                    <td className="spdv-td-num font-semibold" style={{ color: '#334155', paddingRight: '20px' }}>
                      {formatSpdvNum(row.kh)}
                    </td>
                    <td className={`spdv-td-num font-bold ${row.diff >= 0 ? 'text-green' : 'text-red'}`} style={{ paddingRight: '20px' }}>
                      {row.diff >= 0 ? `+${formatSpdvNum(row.diff)}` : formatSpdvNum(row.diff)}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`spdv-rate-pill ${row.isPass ? 'rate-pass' : 'rate-fail'}`}>
                        {row.rate}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="spdv-no-data-cell">
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
                <td className="spdv-td-num font-extrabold" style={{ color: '#0f172a', paddingRight: '20px' }}>
                  {formatSpdvNum(singleBarTotal?.th)}
                </td>
                <td className="spdv-td-num font-extrabold" style={{ color: '#1e293b', paddingRight: '20px' }}>
                  {formatSpdvNum(singleBarTotal?.kh)}
                </td>
                <td className={`spdv-td-num font-extrabold ${singleBarTotal?.diff >= 0 ? 'text-green' : 'text-red'}`} style={{ paddingRight: '20px' }}>
                  {singleBarTotal?.diff >= 0 ? `+${formatSpdvNum(singleBarTotal?.diff)}` : formatSpdvNum(singleBarTotal?.diff)}
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span className={`spdv-rate-pill spdv-rate-pill-total ${singleBarTotal?.isPass ? 'rate-pass' : 'rate-fail'}`}>
                    {singleBarTotal?.rate}
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Under-table Note */}
          <div style={{ marginTop: '14px', padding: '10px 14px', background: '#f8fafc', borderLeft: '4px solid #1e40af', borderRadius: '4px', fontSize: '13px', color: '#1e293b' }}>
            <strong>Ghi chú:</strong> {singleBarConfig.note}
          </div>
        </div>
      ) : isBarIntegrated ? (
        /* ===================================================================== */
        /* VIEW 5: BẢNG TỔNG HỢP BIỂU ĐỒ 18 TÍCH HỢP 3 HÌNH: THÁNG, QUÝ, NĂM     */
        /* ===================================================================== */
        <div className="spdv-detail-table-wrap">
          <table className="spdv-matrix-table">
            <thead>
              <tr className="spdv-th-top-row">
                <th rowSpan={2} style={{ width: '45px', textAlign: 'center' }}>STT</th>
                <th rowSpan={2} className="spdv-th-name">Nhóm SPDV</th>
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
                      {formatSpdvNum(row.month?.th)}
                    </td>
                    <td className="spdv-td-num font-semibold" style={{ color: '#334155' }}>
                      {formatSpdvNum(row.month?.kh)}
                    </td>
                    <td className={`spdv-td-num font-bold ${row.month?.diff >= 0 ? 'text-green' : 'text-red'}`}>
                      {row.month?.diff >= 0 ? `+${formatSpdvNum(row.month?.diff)}` : formatSpdvNum(row.month?.diff)}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`spdv-rate-pill ${row.month?.isPass ? 'rate-pass' : 'rate-fail'}`}>
                        {row.month?.rate}
                      </span>
                    </td>

                    {/* Quý */}
                    <td className="spdv-td-num spdv-border-left font-bold" style={{ color: '#0f172a' }}>
                      {formatSpdvNum(row.quarter?.th)}
                    </td>
                    <td className="spdv-td-num font-semibold" style={{ color: '#334155' }}>
                      {formatSpdvNum(row.quarter?.kh)}
                    </td>
                    <td className={`spdv-td-num font-bold ${row.quarter?.diff >= 0 ? 'text-green' : 'text-red'}`}>
                      {row.quarter?.diff >= 0 ? `+${formatSpdvNum(row.quarter?.diff)}` : formatSpdvNum(row.quarter?.diff)}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`spdv-rate-pill ${row.quarter?.isPass ? 'rate-pass' : 'rate-fail'}`}>
                        {row.quarter?.rate}
                      </span>
                    </td>

                    {/* Năm */}
                    <td className="spdv-td-num spdv-border-left font-bold" style={{ color: '#0f172a' }}>
                      {formatSpdvNum(row.year?.th)}
                    </td>
                    <td className="spdv-td-num font-semibold" style={{ color: '#334155' }}>
                      {formatSpdvNum(row.year?.kh)}
                    </td>
                    <td className={`spdv-td-num font-bold ${row.year?.diff >= 0 ? 'text-green' : 'text-red'}`}>
                      {row.year?.diff >= 0 ? `+${formatSpdvNum(row.year?.diff)}` : formatSpdvNum(row.year?.diff)}
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

                {/* Tháng */}
                <td className="spdv-td-num font-extrabold spdv-border-left" style={{ color: '#0f172a' }}>
                  {formatSpdvNum(integratedTotals.month.th)}
                </td>
                <td className="spdv-td-num font-extrabold" style={{ color: '#1e293b' }}>
                  {formatSpdvNum(integratedTotals.month.kh)}
                </td>
                <td className={`spdv-td-num font-extrabold ${integratedTotals.month.diff >= 0 ? 'text-green' : 'text-red'}`}>
                  {integratedTotals.month.diff >= 0 ? `+${formatSpdvNum(integratedTotals.month.diff)}` : formatSpdvNum(integratedTotals.month.diff)}
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span className={`spdv-rate-pill spdv-rate-pill-total ${integratedTotals.month.isPass ? 'rate-pass' : 'rate-fail'}`}>
                    {integratedTotals.month.rate}
                  </span>
                </td>

                {/* Quý */}
                <td className="spdv-td-num font-extrabold spdv-border-left" style={{ color: '#0f172a' }}>
                  {formatSpdvNum(integratedTotals.quarter.th)}
                </td>
                <td className="spdv-td-num font-extrabold" style={{ color: '#1e293b' }}>
                  {formatSpdvNum(integratedTotals.quarter.kh)}
                </td>
                <td className={`spdv-td-num font-extrabold ${integratedTotals.quarter.diff >= 0 ? 'text-green' : 'text-red'}`}>
                  {integratedTotals.quarter.diff >= 0 ? `+${formatSpdvNum(integratedTotals.quarter.diff)}` : formatSpdvNum(integratedTotals.quarter.diff)}
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span className={`spdv-rate-pill spdv-rate-pill-total ${integratedTotals.quarter.isPass ? 'rate-pass' : 'rate-fail'}`}>
                    {integratedTotals.quarter.rate}
                  </span>
                </td>

                {/* Năm */}
                <td className="spdv-td-num font-extrabold spdv-border-left" style={{ color: '#0f172a' }}>
                  {formatSpdvNum(integratedTotals.year.th)}
                </td>
                <td className="spdv-td-num font-extrabold" style={{ color: '#1e293b' }}>
                  {formatSpdvNum(integratedTotals.year.kh)}
                </td>
                <td className={`spdv-td-num font-extrabold ${integratedTotals.year.diff >= 0 ? 'text-green' : 'text-red'}`}>
                  {integratedTotals.year.diff >= 0 ? `+${formatSpdvNum(integratedTotals.year.diff)}` : formatSpdvNum(integratedTotals.year.diff)}
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
        /* VIEW 6: BẢNG TỔNG HỢP CƠ CẤU 3 KỲ (CÓ CỘT KH, TH VÀ TỶ TRỌNG TH/KH)   */
        /* ===================================================================== */
        <div className="spdv-detail-table-wrap">
          <table className="spdv-matrix-table">
            <thead>
              <tr className="spdv-th-top-row">
                <th rowSpan={2} className="spdv-th-name">Nhóm SPDV</th>
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
                <th className="spdv-th-col spdv-th-share">Tỷ trọng TH</th>
                <th className="spdv-th-col spdv-th-kh">KH T{monthNum}/{selectedYear}</th>
                <th className="spdv-th-col spdv-th-share">Tỷ trọng KH</th>

                {/* Quý */}
                <th className="spdv-th-col spdv-th-th spdv-border-left">TH Q{quarterRoman}/{selectedYear}</th>
                <th className="spdv-th-col spdv-th-share">Tỷ trọng TH</th>
                <th className="spdv-th-col spdv-th-kh">KH Q{quarterRoman}/{selectedYear}</th>
                <th className="spdv-th-col spdv-th-share">Tỷ trọng KH</th>

                {/* Năm */}
                <th className="spdv-th-col spdv-th-th spdv-border-left">TH Năm {selectedYear}</th>
                <th className="spdv-th-col spdv-th-share">Tỷ trọng TH</th>
                <th className="spdv-th-col spdv-th-kh">KH Năm {selectedYear}</th>
                <th className="spdv-th-col spdv-th-share">Tỷ trọng KH</th>
              </tr>
            </thead>
            <tbody>
              {filteredStructureRows.length > 0 ? (
                filteredStructureRows.map((row) => (
                  <tr key={row.id} className="spdv-row">
                    <td className="spdv-td-name">
                      <span className="spdv-dot" style={{ backgroundColor: row.color }}></span>
                      <span className="spdv-name-label">{row.name}</span>
                    </td>

                    {/* Tháng */}
                    <td className="spdv-td-num spdv-border-left font-bold" style={{ color: '#0f172a' }}>
                      {formatSpdvNum(row.month?.th)}
                    </td>
                    <td className="spdv-td-share">{row.month?.thShare}</td>
                    <td className="spdv-td-num font-semibold" style={{ color: '#334155' }}>
                      {formatSpdvNum(row.month?.kh)}
                    </td>
                    <td className="spdv-td-share">{row.month?.khShare}</td>

                    {/* Quý */}
                    <td className="spdv-td-num spdv-border-left font-bold" style={{ color: '#0f172a' }}>
                      {formatSpdvNum(row.quarter?.th)}
                    </td>
                    <td className="spdv-td-share">{row.quarter?.thShare}</td>
                    <td className="spdv-td-num font-semibold" style={{ color: '#334155' }}>
                      {formatSpdvNum(row.quarter?.kh)}
                    </td>
                    <td className="spdv-td-share">{row.quarter?.khShare}</td>

                    {/* Năm */}
                    <td className="spdv-td-num spdv-border-left font-bold" style={{ color: '#0f172a' }}>
                      {formatSpdvNum(row.year?.th)}
                    </td>
                    <td className="spdv-td-share">{row.year?.thShare}</td>
                    <td className="spdv-td-num font-semibold" style={{ color: '#334155' }}>
                      {formatSpdvNum(row.year?.kh)}
                    </td>
                    <td className="spdv-td-share">{row.year?.khShare}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={13} className="spdv-no-data-cell">
                    Không tìm thấy dữ liệu nhóm SPDV phù hợp với điều kiện lọc
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr className="spdv-tr-total">
                <td className="spdv-td-name font-bold">
                  {structureData.total?.name || 'Tổng doanh thu 6 nhóm SPDV'}
                </td>

                {/* Tháng */}
                <td className="spdv-td-num font-bold spdv-border-left" style={{ color: '#0f172a' }}>
                  {formatSpdvNum(structureData.total?.month?.th)}
                </td>
                <td className="spdv-td-share font-bold">{structureData.total?.month?.thShare}</td>
                <td className="spdv-td-num font-bold" style={{ color: '#1e293b' }}>
                  {formatSpdvNum(structureData.total?.month?.kh)}
                </td>
                <td className="spdv-td-share font-bold">{structureData.total?.month?.khShare}</td>

                {/* Quý */}
                <td className="spdv-td-num font-bold spdv-border-left" style={{ color: '#0f172a' }}>
                  {formatSpdvNum(structureData.total?.quarter?.th)}
                </td>
                <td className="spdv-td-share font-bold">{structureData.total?.quarter?.thShare}</td>
                <td className="spdv-td-num font-bold" style={{ color: '#1e293b' }}>
                  {formatSpdvNum(structureData.total?.quarter?.kh)}
                </td>
                <td className="spdv-td-share font-bold">{structureData.total?.quarter?.khShare}</td>

                {/* Năm */}
                <td className="spdv-td-num font-bold spdv-border-left" style={{ color: '#0f172a' }}>
                  {formatSpdvNum(structureData.total?.year?.th)}
                </td>
                <td className="spdv-td-share font-bold">{structureData.total?.year?.thShare}</td>
                <td className="spdv-td-num font-bold" style={{ color: '#1e293b' }}>
                  {formatSpdvNum(structureData.total?.year?.kh)}
                </td>
                <td className="spdv-td-share font-bold">{structureData.total?.year?.khShare}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}
