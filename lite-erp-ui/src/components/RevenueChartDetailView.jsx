import React, { useState, useMemo, useEffect } from 'react';
import {
  ArrowLeft, Download, Search, Filter, CheckCircle2, AlertCircle,
  TrendingUp, TrendingDown, ChevronDown, TableProperties, BarChart2,
  Calendar, Layers, RefreshCw
} from 'lucide-react';
import * as XLSX from 'xlsx';
import './RevenueChartDetailView.css';

import {
  MONTH_OPTIONS,
  MONTHLY_PLAN_DATA,
  MONTH_PREV_DATA,
  MONTH_LAST_YEAR_DATA,
  MONTH_NEXT_PLAN_DATA,
  getCustomerSpdvMonthData,
  CUSTOMER_SPDV_MONTH_DATA
} from '../data/revenueMonthData';

import {
  QUARTER_OPTIONS,
  QUARTER_CUMULATIVE_DATA,
  QUARTER_ESTIMATE_DATA,
  QUARTER_PREV_DATA,
  QUARTER_SAME_PERIOD_DATA,
  QUARTER_NEXT_PLAN_DATA
} from '../data/revenueQuarterData';

import {
  CUMULATIVE_MONTH_OPTIONS,
  YEAR_CUMULATIVE_DATA,
  YEAR_PLAN_FULL_DATA,
  YEAR_ESTIMATE_DATA
} from '../data/revenueYearData';

const YEAR_OPTIONS = ['2026', '2025', '2024'];

import { MONTH_TREND_DATA } from '../data/revenueTrendData';
import { SPDV_CATEGORIES, SPDV_STRUCTURE_DATA, SPDV_BAR_COMPARISON_DATA } from '../data/revenueSpdvData';
import { UNIT_CATEGORIES, UNIT_STRUCTURE_DATA } from '../data/revenueUnitData';
import {
  INTERNAL_EXTERNAL_CATEGORIES,
  INTERNAL_EXTERNAL_DATA,
  DOMESTIC_INTERNATIONAL_CATEGORIES,
  DOMESTIC_INTERNATIONAL_DATA
} from '../data/revenueInternalExternalData';

import {
  DEBT_SUMMARY_METRICS,
  DEBT_AGING_DATA,
  DEBT_BY_CUSTOMER_GROUP,
  DEBT_MONTHLY_RECOVERY,
  DEBT_TOP_CUSTOMERS
} from '../data/revenueDebtData';

// Chart options list per branch for quick switching
const BRANCH_CHART_OPTIONS = {
  month: [
    { id: 'chart1_val', label: 'Biểu đồ 1: Thực hiện tháng so với KH tháng (Giá trị)' },
    { id: 'chart1_rat', label: 'Biểu đồ 1b: Tỷ trọng doanh thu so với KH tháng' },
    { id: 'chart2_val', label: 'Biểu đồ 2: Thực hiện tháng so với tháng trước (Giá trị)' },
    { id: 'chart2_rat', label: 'Biểu đồ 2b: Tỷ trọng doanh thu so với tháng trước' },
    { id: 'chart3_val', label: 'Biểu đồ 3: Thực hiện tháng so với cùng kỳ năm trước (Giá trị)' },
    { id: 'chart3_rat', label: 'Biểu đồ 3b: Tỷ trọng doanh thu so với cùng kỳ năm trước' },
    { id: 'chart4_val', label: 'Biểu đồ 4: Kế hoạch tháng tới so với tháng hiện tại' },
    { id: 'chart4_rat', label: 'Biểu đồ 4b: Tỷ trọng kế hoạch tháng tới' }
  ],
  quarter: [
    { id: 'chart5_cum_val', label: 'Biểu đồ 5: Lũy kế Quý so với KH Quý (Giá trị)' },
    { id: 'chart5_est_val', label: 'Biểu đồ 5b: Ước Quý so với KH Quý (Giá trị)' },
    { id: 'chart6_val', label: 'Biểu đồ 6: Ước Quý so với Quý trước' },
    { id: 'chart7_val', label: 'Biểu đồ 7: Ước Quý so với cùng kỳ năm trước' },
    { id: 'chart7_next', label: 'Biểu đồ 7b: Kế hoạch Quý tiếp theo' }
  ],
  year: [
    { id: 'chart8', label: 'Biểu đồ 8: Lũy kế TH so với KH năm' },
    { id: 'chart9', label: 'Biểu đồ 9: Lũy kế TH so với KH lũy kế' },
    { id: 'chart10', label: 'Biểu đồ 10: Lũy kế TH so với cùng kỳ năm trước' },
    { id: 'chart11', label: 'Biểu đồ 11: Ước TH năm so với KH năm' },
    { id: 'chart12', label: 'Biểu đồ 12: Ước TH năm so với TH năm trước' },
    { id: 'chart13', label: 'Biểu đồ 13: Ước TH năm so với TH năm trước (Tăng trưởng)' }
  ],
  trend: [
    { id: 'chart14', label: 'Biểu đồ 14: Xu hướng doanh thu 12 tháng so với năm trước & KH' },
    { id: 'chart15', label: 'Biểu đồ 15: Tích lũy doanh thu 12 tháng' }
  ],
  spdv: [
    { id: 'chart16', label: 'Biểu đồ 16: Cơ cấu doanh thu thực hiện theo 6 nhóm SPDV' },
    { id: 'chart17', label: 'Biểu đồ 17: Cơ cấu doanh thu kế hoạch theo 6 nhóm SPDV' },
    { id: 'chart18_m', label: 'Biểu đồ 18: Doanh thu 6 nhóm SPDV so với KH (Tháng)' },
    { id: 'chart18_q', label: 'Biểu đồ 18b: Doanh thu 6 nhóm SPDV so với KH (Quý)' },
    { id: 'chart18_y', label: 'Biểu đồ 18c: Doanh thu 6 nhóm SPDV so với KH (Năm)' }
  ],
  unit: [
    { id: 'chart19', label: 'Biểu đồ 19: Doanh thu theo khối / đơn vị' },
    { id: 'chart20', label: 'Biểu đồ 20: Tỷ lệ hoàn thành kế hoạch theo đơn vị' }
  ],
  plan_progress: [
    { id: 'chart21', label: 'Biểu đồ 21: Cơ cấu DT nội bộ vs Ngoài tập đoàn' },
    { id: 'chart22', label: 'Biểu đồ 22: Chuyển dịch DT nội bộ vs Ngoài tập đoàn' },
    { id: 'chart23', label: 'Biểu đồ 23: Cơ cấu DT trong nước vs Quốc tế' },
    { id: 'chart24', label: 'Biểu đồ 24: Chuyển dịch DT trong nước vs Quốc tế' }
  ],
  debt: [
    { id: 'chart25', label: 'Biểu đồ 25: Phân loại tuổi nợ' },
    { id: 'chart26', label: 'Biểu đồ 26: Top khách hàng công nợ lớn' },
    { id: 'chart27', label: 'Biểu đồ 27: Tiến độ thu hồi công nợ theo tháng' },
    { id: 'chart28', label: 'Biểu đồ 28: Công nợ theo nhóm khách hàng' }
  ]
};

export default function RevenueChartDetailView({
  initialBranchId = 'month',
  initialChartKey = 'chart1_val',
  initialChartTitle = '',
  selectedYear = '2026',
  setSelectedYear,
  selectedMonth = 'Tháng 8',
  setSelectedMonth,
  selectedQuarter = 'Quý III',
  setSelectedQuarter,
  selectedCumulativeMonth = '8 tháng',
  setSelectedCumulativeMonth,
  onBack
}) {
  const [activeBranchId, setActiveBranchId] = useState(initialBranchId);
  const [activeChartKey, setActiveChartKey] = useState(initialChartKey);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'pass' | 'fail'

  useEffect(() => {
    if (initialBranchId) setActiveBranchId(initialBranchId);
    if (initialChartKey) setActiveChartKey(initialChartKey);
  }, [initialBranchId, initialChartKey]);

  const chartOptions = BRANCH_CHART_OPTIONS[activeBranchId] || BRANCH_CHART_OPTIONS.month;

  // Resolve current active chart label
  const currentChartObj = chartOptions.find(o => o.id === activeChartKey) || chartOptions[0];
  const chartTitle = initialChartTitle || currentChartObj?.label || 'Bảng dữ liệu chi tiết';

  // Compute table dataset according to active branch and chart
  const tableData = useMemo(() => {
    let rows = [];
    let defaultUnit = 'Tỷ đồng';
    let isRatio = false;

    if (activeBranchId === 'month') {
      const pData = MONTHLY_PLAN_DATA[selectedMonth] || MONTHLY_PLAN_DATA['Tháng 8'];
      const prevData = MONTH_PREV_DATA[selectedMonth] || MONTH_PREV_DATA['Tháng 8'];
      const lyData = MONTH_LAST_YEAR_DATA[selectedMonth] || MONTH_LAST_YEAR_DATA['Tháng 8'];
      const npData = MONTH_NEXT_PLAN_DATA[selectedMonth] || MONTH_NEXT_PLAN_DATA['Tháng 8'];

      if (activeChartKey === 'chart1_rat' || activeChartKey === 'chart2_rat' || activeChartKey === 'chart3_rat' || activeChartKey === 'chart4_rat') {
        isRatio = true;
        defaultUnit = '%';
        const rawRatios = activeChartKey === 'chart1_rat' ? pData?.ratios
          : activeChartKey === 'chart2_rat' ? prevData?.ratios
          : activeChartKey === 'chart3_rat' ? lyData?.ratios
          : npData?.ratios;

        rows = (rawRatios || []).map((item, idx) => ({
          stt: idx + 1,
          name: item.name,
          unit: '%',
          kh: item.kh,
          th: item.th !== undefined ? item.th : item.thCurrent,
          diff: item.diff !== undefined ? item.diff : ((item.th || 0) - (item.kh || 0)).toFixed(1),
          rate: item.rate || (item.kh ? `${Math.round((item.th / item.kh) * 100)}%` : '-'),
          isPass: item.isDiffPositive !== undefined ? item.isDiffPositive : (item.th >= item.kh),
          share: item.th !== undefined ? `${item.th}%` : '-'
        }));
      } else {
        defaultUnit = 'Triệu đồng';
        const rawValues = activeChartKey === 'chart2_val' ? prevData?.values
          : activeChartKey === 'chart3_val' ? lyData?.values
          : activeChartKey === 'chart4_val' ? npData?.values
          : pData?.values;

        rows = (rawValues || []).map((item, idx) => {
          const khVal = item.kh !== undefined ? item.kh : item.thPrev !== undefined ? item.thPrev : item.thLastYear;
          const thVal = item.th !== undefined ? item.th : item.thCurrent;
          const diffVal = (thVal !== undefined && khVal !== undefined) ? Number((thVal - khVal).toFixed(1)) : 0;
          const rateVal = khVal > 0 ? Math.round((thVal / khVal) * 100) : 100;
          return {
            stt: idx + 1,
            name: item.name,
            unit: item.unit || 'Triệu đồng',
            kh: khVal,
            th: thVal,
            diff: (diffVal > 0 ? '+' : '') + diffVal.toLocaleString('vi-VN'),
            diffNum: diffVal,
            rate: item.rate || `${rateVal}%`,
            rateNum: rateVal,
            isPass: diffVal >= 0 || rateVal >= 100,
            share: item.id === 'total' ? '100%' : (thVal ? `${Math.round((thVal / 389.9) * 100)}%` : '-')
          };
        });
      }
    } else if (activeBranchId === 'quarter') {
      const qCum = QUARTER_CUMULATIVE_DATA[selectedQuarter] || QUARTER_CUMULATIVE_DATA['Quý III'];
      const qEst = QUARTER_ESTIMATE_DATA[selectedQuarter] || QUARTER_ESTIMATE_DATA['Quý III'];
      const qPrev = QUARTER_PREV_DATA[selectedQuarter] || QUARTER_PREV_DATA['Quý III'];
      const qSame = QUARTER_SAME_PERIOD_DATA[selectedQuarter] || QUARTER_SAME_PERIOD_DATA['Quý III'];
      const qNext = QUARTER_NEXT_PLAN_DATA[selectedQuarter] || QUARTER_NEXT_PLAN_DATA['Quý III'];

      const raw = activeChartKey === 'chart5_est_val' ? qEst?.values
        : activeChartKey === 'chart6_val' ? qPrev?.values
        : activeChartKey === 'chart7_val' ? qSame?.values
        : activeChartKey === 'chart7_next' ? qNext?.values
        : qCum?.values;

      rows = (raw || []).map((item, idx) => {
        const khVal = item.kh !== undefined ? item.kh : item.thPrev !== undefined ? item.thPrev : item.thLastYear;
        const thVal = item.th !== undefined ? item.th : item.thCurrent;
        const diffVal = (thVal !== undefined && khVal !== undefined) ? Number((thVal - khVal).toFixed(1)) : 0;
        const rateVal = khVal > 0 ? Math.round((thVal / khVal) * 100) : 100;
        return {
          stt: idx + 1,
          name: item.name,
          unit: item.unit || 'Triệu đồng',
          kh: khVal,
          th: thVal,
          diff: (diffVal > 0 ? '+' : '') + diffVal.toLocaleString('vi-VN'),
          diffNum: diffVal,
          rate: item.rate || `${rateVal}%`,
          rateNum: rateVal,
          isPass: diffVal >= 0 || rateVal >= 100,
          share: item.id === 'total' ? '100%' : (thVal ? `${Math.round((thVal / 1150) * 100)}%` : '-')
        };
      });
    } else if (activeBranchId === 'year') {
      const yData = YEAR_CUMULATIVE_DATA[selectedYear] || YEAR_CUMULATIVE_DATA['2026'];
      const yFull = YEAR_PLAN_FULL_DATA[selectedYear] || YEAR_PLAN_FULL_DATA['2026'];
      const yEst = YEAR_ESTIMATE_DATA[selectedYear] || YEAR_ESTIMATE_DATA['2026'];

      const raw = activeChartKey === 'chart11' ? yFull?.values
        : (activeChartKey === 'chart12' || activeChartKey === 'chart13') ? yEst?.values
        : yData?.values;

      rows = (raw || []).map((item, idx) => {
        const khVal = item.kh !== undefined ? item.kh : item.thLastYear;
        const thVal = item.th !== undefined ? item.th : item.thCurrent;
        const diffVal = (thVal !== undefined && khVal !== undefined) ? Number((thVal - khVal).toFixed(1)) : 0;
        const rateVal = khVal > 0 ? Math.round((thVal / khVal) * 100) : 100;
        return {
          stt: idx + 1,
          name: item.name,
          unit: 'Triệu đồng',
          kh: khVal,
          th: thVal,
          diff: (diffVal > 0 ? '+' : '') + diffVal.toLocaleString('vi-VN'),
          diffNum: diffVal,
          rate: item.rate || `${rateVal}%`,
          rateNum: rateVal,
          isPass: diffVal >= 0 || rateVal >= 100,
          share: item.id === 'total' ? '100%' : (thVal ? `${Math.round((thVal / 4500) * 100)}%` : '-')
        };
      });
    } else if (activeBranchId === 'trend') {
      const trendList = MONTH_TREND_DATA[selectedYear] || MONTH_TREND_DATA['2026'] || [];
      rows = trendList.map((item, idx) => {
        const diffVal = Number((item.actual - item.target).toFixed(1));
        return {
          stt: idx + 1,
          name: item.month,
          unit: 'Tỷ VNĐ',
          kh: item.target,
          th: item.actual,
          diff: (diffVal >= 0 ? '+' : '') + diffVal.toLocaleString('vi-VN'),
          diffNum: diffVal,
          rate: `${item.rate}%`,
          rateNum: item.rate,
          isPass: item.rate >= 100,
          share: `${item.growth}% tăng trưởng`
        };
      });
    } else if (activeBranchId === 'spdv') {
      const spdvFull = SPDV_STRUCTURE_DATA[selectedYear] || SPDV_STRUCTURE_DATA['2026'];
      const barCompare = SPDV_BAR_COMPARISON_DATA[selectedYear]?.['Tháng 8'] || SPDV_BAR_COMPARISON_DATA['2026']['Tháng 8'];

      if (activeChartKey === 'chart16') {
        const slices = spdvFull.thMonth.slices || [];
        rows = slices.map((s, idx) => ({
          stt: idx + 1,
          name: s.name,
          unit: 'Triệu đồng',
          kh: '-',
          th: s.value,
          diff: '-',
          diffNum: 0,
          rate: '100%',
          rateNum: 100,
          isPass: true,
          share: `${s.percent}%`
        }));
      } else if (activeChartKey === 'chart17') {
        const slices = spdvFull.khMonth.slices || [];
        rows = slices.map((s, idx) => ({
          stt: idx + 1,
          name: s.name,
          unit: 'Triệu đồng',
          kh: s.value,
          th: '-',
          diff: '-',
          diffNum: 0,
          rate: '-',
          rateNum: 0,
          isPass: true,
          share: `${s.percent}%`
        }));
      } else {
        const barItems = activeChartKey === 'chart18_q' ? barCompare.quarterItems
          : activeChartKey === 'chart18_y' ? barCompare.yearItems
          : barCompare.monthItems;

        rows = (barItems || []).map((item, idx) => {
          const diffVal = Number((item.th - item.kh).toFixed(1));
          const rateNum = parseInt(item.rate.replace('%', ''), 10);
          return {
            stt: idx + 1,
            name: item.name,
            unit: 'Tỷ đ',
            kh: item.kh,
            th: item.th,
            diff: (diffVal >= 0 ? '+' : '') + diffVal.toLocaleString('vi-VN'),
            diffNum: diffVal,
            rate: item.rate,
            rateNum: rateNum,
            isPass: item.isRatePositive,
            share: `${Math.round((item.th / (activeChartKey === 'chart18_y' ? 4500 : 389.9)) * 100)}%`
          };
        });
      }
    } else if (activeBranchId === 'unit') {
      const uData = UNIT_STRUCTURE_DATA[selectedYear] || UNIT_STRUCTURE_DATA['2026'];
      const slices = uData?.thMonth?.slices || [];
      rows = slices.map((s, idx) => ({
        stt: idx + 1,
        name: s.name,
        unit: 'Triệu đồng',
        kh: (s.value * 1.05).toFixed(1),
        th: s.value,
        diff: `-${(s.value * 0.05).toFixed(1)}`,
        diffNum: -1,
        rate: '95,2%',
        rateNum: 95.2,
        isPass: false,
        share: `${s.percent}%`
      }));
    } else if (activeBranchId === 'plan_progress') {
      const inEx = INTERNAL_EXTERNAL_DATA[selectedYear] || INTERNAL_EXTERNAL_DATA['2026'];
      const slices = inEx?.thMonth?.slices || [];
      rows = slices.map((s, idx) => ({
        stt: idx + 1,
        name: s.name,
        unit: 'Tỷ đ',
        kh: (s.value * 1.04).toFixed(1),
        th: s.value,
        diff: `-${(s.value * 0.04).toFixed(1)}`,
        diffNum: -1,
        rate: '96,1%',
        rateNum: 96.1,
        isPass: false,
        share: s.formattedPercent || `${s.percent}%`
      }));
    } else if (activeBranchId === 'debt') {
      const aging = DEBT_AGING_DATA[selectedYear] || DEBT_AGING_DATA['2026'] || [];
      rows = aging.map((item, idx) => ({
        stt: idx + 1,
        name: item.period,
        unit: 'Tỷ đ',
        kh: item.target || 20.0,
        th: item.amount,
        diff: item.amount <= (item.target || 20) ? 'Đạt kiểm soát' : 'Vượt ngưỡng nợ',
        diffNum: 0,
        rate: `${Math.round((item.amount / 142.5) * 100)}%`,
        rateNum: Math.round((item.amount / 142.5) * 100),
        isPass: item.amount <= (item.target || 20),
        share: `${item.rate}%`
      }));
    }

    return { rows, defaultUnit, isRatio };
  }, [activeBranchId, activeChartKey, selectedYear, selectedMonth, selectedQuarter, selectedCumulativeMonth]);

  // Filtered rows for Month branch (Customer & SPDV matrix)
  const filteredMonthRows = useMemo(() => {
    if (activeBranchId !== 'month') return [];
    const rawRows = getCustomerSpdvMonthData(selectedMonth);
    return rawRows.filter(row => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        row.customerGroup.toLowerCase().includes(q) ||
        row.customerName.toLowerCase().includes(q) ||
        row.spdvGroup.toLowerCase().includes(q) ||
        row.spdvName.toLowerCase().includes(q);
      if (!matchesSearch) return false;
      if (statusFilter === 'pass') return row.isPass === true;
      if (statusFilter === 'fail') return row.isPass === false;
      return true;
    });
  }, [activeBranchId, selectedMonth, searchQuery, statusFilter]);

  // Totals for Month branch matching user screenshot structure
  const monthTotals = useMemo(() => {
    const allRows = getCustomerSpdvMonthData(selectedMonth);
    const targetRows = (searchQuery || statusFilter !== 'all') ? filteredMonthRows : allRows;

    const calcGroup = (rows) => {
      const sumKh = rows.reduce((acc, r) => acc + (r.kh || 0), 0);
      const sumTh = rows.reduce((acc, r) => acc + (r.th || 0), 0);
      const diff = sumTh - sumKh;
      const rateNum = sumKh > 0 ? Number(((sumTh / sumKh) * 100).toFixed(1)) : 100;
      const rate = `${rateNum.toFixed(1).replace('.', ',')}%`;
      return {
        kh: sumKh,
        th: sumTh,
        diff,
        diffFormatted: (diff > 0 ? '+' : '') + diff,
        rate,
        rateNum,
        isPass: diff >= 0 || rateNum >= 100
      };
    };

    const externalRows = targetRows.filter(r => r.type === 'external');
    const internalRows = targetRows.filter(r => r.type === 'internal');

    return {
      external: calcGroup(externalRows),
      internal: calcGroup(internalRows),
      total: calcGroup(targetRows)
    };
  }, [selectedMonth, searchQuery, statusFilter, filteredMonthRows]);

  // Filtered rows by search and status for non-month branches
  const filteredRows = useMemo(() => {
    return tableData.rows.filter(row => {
      const matchesSearch = row.name.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;
      if (statusFilter === 'pass') return row.isPass === true;
      if (statusFilter === 'fail') return row.isPass === false;
      return true;
    });
  }, [tableData.rows, searchQuery, statusFilter]);

  // Compute table totals for non-month branches
  const totals = useMemo(() => {
    let sumKh = 0;
    let sumTh = 0;
    let validCount = 0;

    tableData.rows.forEach(r => {
      const numTh = typeof r.th === 'number' ? r.th : parseFloat(r.th);
      const numKh = typeof r.kh === 'number' ? r.kh : parseFloat(r.kh);
      if (!isNaN(numTh)) sumTh += numTh;
      if (!isNaN(numKh)) sumKh += numKh;
      if (!isNaN(numTh) && !isNaN(numKh)) validCount++;
    });

    const diffVal = Number((sumTh - sumKh).toFixed(1));
    const avgRate = sumKh > 0 ? Math.round((sumTh / sumKh) * 100) : 100;

    return {
      sumTh: Number(sumTh.toFixed(1)),
      sumKh: Number(sumKh.toFixed(1)),
      diffVal,
      diffFormatted: (diffVal >= 0 ? '+' : '') + diffVal.toLocaleString('vi-VN'),
      avgRate: `${avgRate}%`,
      rateNum: avgRate,
      isPass: avgRate >= 100
    };
  }, [tableData.rows]);

  // Unified KPI tiles totals depending on active branch
  const activeTotals = useMemo(() => {
    if (activeBranchId === 'month') {
      return {
        sumTh: monthTotals.total.th,
        sumKh: monthTotals.total.kh,
        diffVal: monthTotals.total.diff,
        diffFormatted: monthTotals.total.diffFormatted,
        avgRate: monthTotals.total.rate,
        rateNum: monthTotals.total.rateNum,
        isPass: monthTotals.total.isPass
      };
    }
    return totals;
  }, [activeBranchId, monthTotals, totals]);

  // Export table directly to Excel (.xlsx)
  const handleExportTableExcel = () => {
    try {
      if (activeBranchId === 'month') {
        const exportRows = filteredMonthRows.map(r => ({
          'Nhóm khách hàng': r.customerGroup,
          'Tên khách hàng': r.customerName,
          'Nhóm SPDV': r.spdvGroup,
          'Tên SPDV': r.spdvName,
          'KH': r.kh,
          'TH': r.th,
          '+/- so với KH': r.diffFormatted,
          '% HTKH': r.rate
        }));

        // Summary rows matching screenshot
        exportRows.push({
          'Nhóm khách hàng': 'Tổng doanh thu ngoài Tập đoàn',
          'Tên khách hàng': '',
          'Nhóm SPDV': '',
          'Tên SPDV': '',
          'KH': monthTotals.external.kh,
          'TH': monthTotals.external.th,
          '+/- so với KH': monthTotals.external.diffFormatted,
          '% HTKH': monthTotals.external.rate
        });

        exportRows.push({
          'Nhóm khách hàng': 'Tổng doanh thu nội bộ',
          'Tên khách hàng': '',
          'Nhóm SPDV': '',
          'Tên SPDV': '',
          'KH': monthTotals.internal.kh,
          'TH': monthTotals.internal.th,
          '+/- so với KH': monthTotals.internal.diffFormatted,
          '% HTKH': monthTotals.internal.rate
        });

        exportRows.push({
          'Nhóm khách hàng': 'Tổng doanh thu',
          'Tên khách hàng': '',
          'Nhóm SPDV': '',
          'Tên SPDV': '',
          'KH': monthTotals.total.kh,
          'TH': monthTotals.total.th,
          '+/- so với KH': monthTotals.total.diffFormatted,
          '% HTKH': monthTotals.total.rate
        });

        const ws = XLSX.utils.json_to_sheet(exportRows);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Thuc_Hien_So_Voi_KH');
        const cleanFileName = `Thuc_hien_so_voi_ke_hoach_Tap_doan_${selectedMonth}_${selectedYear}.xlsx`;
        XLSX.writeFile(wb, cleanFileName);
        return;
      }

      const exportRows = filteredRows.map((r) => ({
        'STT': r.stt,
        'Chỉ tiêu / Đối tượng': r.name,
        'Đơn vị tính': r.unit,
        'Kế hoạch (KH)': r.kh,
        'Thực hiện (TH)': r.th,
        'Chênh lệch (+/-)': r.diff,
        'Tỷ lệ hoàn thành': r.rate,
        'Tỷ trọng': r.share,
        'Đánh giá': r.isPass ? 'Đạt / Tốt' : 'Chưa đạt'
      }));

      // Add summary row
      exportRows.push({
        'STT': 'TỔNG',
        'Chỉ tiêu / Đối tượng': 'TỔNG CỘNG',
        'Đơn vị tính': tableData.defaultUnit,
        'Kế hoạch (KH)': totals.sumKh,
        'Thực hiện (TH)': totals.sumTh,
        'Chênh lệch (+/-)': totals.diffFormatted,
        'Tỷ lệ hoàn thành': totals.avgRate,
        'Tỷ trọng': '100%',
        'Đánh giá': totals.isPass ? 'Đạt KH chung' : 'Chưa đạt KH'
      });

      const ws = XLSX.utils.json_to_sheet(exportRows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Bang_Chi_Tiet');

      const cleanFileName = `Bang_chi_tiet_${chartTitle.replace(/[^a-zA-Z0-9_\u00C0-\u024F\u1E00-\u1EFF]/g, '_').substring(0, 40)}.xlsx`;
      XLSX.writeFile(wb, cleanFileName);
    } catch (err) {
      console.error('Error exporting table to excel:', err);
      alert('Có lỗi khi xuất file Excel. Vui lòng thử lại!');
    }
  };

  return (
    <div className="revenue-chart-detail-view-page">
      {/* ========================================================================= */}
      {/* 1. TOP NAVIGATION & CONTROLS BAR                                          */}
      {/* ========================================================================= */}
      <div className="chart-detail-nav-bar">
        <div className="chart-detail-nav-left">
          <button
            type="button"
            className="chart-detail-back-btn"
            onClick={onBack}
            title="Quay lại giao diện biểu đồ"
          >
            <ArrowLeft size={16} />
            <span>Quay lại nhóm biểu đồ</span>
          </button>

          <div className="chart-detail-breadcrumb">
            <span className="crumb-root">Báo cáo doanh thu</span>
            <span className="crumb-divider">/</span>
            <span className="crumb-active">{chartTitle}</span>
          </div>
        </div>

        <div className="chart-detail-nav-right">
          {/* Quick Chart Switcher Dropdown */}
          <div className="clean-filter-item">
            <span className="clean-filter-label">Chọn biểu đồ</span>
            <div className="clean-select-wrapper" style={{ minWidth: '260px' }}>
              <select
                className="clean-filter-select"
                value={activeChartKey}
                onChange={(e) => setActiveChartKey(e.target.value)}
              >
                {chartOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="clean-select-chevron" />
            </div>
          </div>

          {/* Time Filters */}
          <div className="clean-filter-item">
            <span className="clean-filter-label">Năm</span>
            <div className="clean-select-wrapper">
              <select
                className="clean-filter-select"
                value={selectedYear}
                onChange={(e) => setSelectedYear && setSelectedYear(e.target.value)}
              >
                {YEAR_OPTIONS.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <ChevronDown size={14} className="clean-select-chevron" />
            </div>
          </div>

          {(activeBranchId === 'month' || activeBranchId === 'spdv' || activeBranchId === 'unit') && (
            <div className="clean-filter-item">
              <span className="clean-filter-label">Tháng</span>
              <div className="clean-select-wrapper">
                <select
                  className="clean-filter-select"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth && setSelectedMonth(e.target.value)}
                >
                  {MONTH_OPTIONS.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="clean-select-chevron" />
              </div>
            </div>
          )}

          {activeBranchId === 'quarter' && (
            <div className="clean-filter-item">
              <span className="clean-filter-label">Quý</span>
              <div className="clean-select-wrapper">
                <select
                  className="clean-filter-select"
                  value={selectedQuarter}
                  onChange={(e) => setSelectedQuarter && setSelectedQuarter(e.target.value)}
                >
                  {QUARTER_OPTIONS.map((q) => (
                    <option key={q} value={q}>{q}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="clean-select-chevron" />
              </div>
            </div>
          )}

          {/* Export Excel Button */}
          <button
            type="button"
            className="chart-detail-export-btn"
            onClick={handleExportTableExcel}
            title="Xuất bảng dữ liệu chi tiết ra file Excel"
          >
            <Download size={15} />
            <span>Xuất Excel bảng này</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SUMMARY KPI TILES                                                      */}
      {/* ========================================================================= */}
      <div className="chart-detail-summary-cards">
        <div className="chart-detail-summary-card card-th">
          <div className="summary-card-label">Tổng Thực hiện / Ước (TH)</div>
          <div className="summary-card-value text-red">
            {activeTotals.sumTh.toLocaleString('vi-VN')}
            <span className="summary-card-unit">{activeBranchId === 'month' ? 'Tỷ đồng' : tableData.defaultUnit}</span>
          </div>
          <div className="summary-card-sub">Theo kỳ báo cáo hiện tại</div>
        </div>

        <div className="chart-detail-summary-card card-kh">
          <div className="summary-card-label">Tổng Kế hoạch giao (KH)</div>
          <div className="summary-card-value text-slate">
            {activeTotals.sumKh.toLocaleString('vi-VN')}
            <span className="summary-card-unit">{activeBranchId === 'month' ? 'Tỷ đồng' : tableData.defaultUnit}</span>
          </div>
          <div className="summary-card-sub">Chỉ tiêu phân bổ kỳ tương ứng</div>
        </div>

        <div className="chart-detail-summary-card card-diff">
          <div className="summary-card-label">Chênh lệch tuyệt đối (+/-)</div>
          <div className={`summary-card-value ${activeTotals.diffVal >= 0 ? 'text-green' : 'text-red'}`}>
            {activeTotals.diffFormatted}
            <span className="summary-card-unit">{activeBranchId === 'month' ? 'Tỷ đồng' : tableData.defaultUnit}</span>
          </div>
          <div className="summary-card-sub">
            {activeTotals.diffVal >= 0 ? 'Vượt chỉ tiêu kế hoạch giao' : 'Chưa đạt chỉ tiêu kế hoạch'}
          </div>
        </div>

        <div className="chart-detail-summary-card card-rate">
          <div className="summary-card-label">Tỷ lệ hoàn thành kế hoạch</div>
          <div className={`summary-card-value ${activeTotals.isPass ? 'text-green' : 'text-amber'}`}>
            {activeTotals.avgRate}
          </div>
          <div className="summary-card-sub">
            <span className={`status-pill-small ${activeTotals.isPass ? 'pill-green' : 'pill-red'}`}>
              {activeTotals.isPass ? 'Đạt mục tiêu' : 'Cần tăng tốc'}
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. TABLE CONTROLS & SEARCH                                                */}
      {/* ========================================================================= */}
      <div className="chart-detail-table-card">
        <div className="chart-detail-table-header">
          <div className="table-header-title-box">
            <TableProperties size={18} color="#e11d48" />
            <h3 className="table-header-title">
              {activeBranchId === 'month' ? (
                <>Thực hiện so với kế hoạch Tập đoàn</>
              ) : (
                <>Bảng dữ liệu chi tiết số liệu: <span>{chartTitle}</span></>
              )}
            </h3>
            <span className="table-row-count-badge">
              {activeBranchId === 'month' ? `${filteredMonthRows.length} dòng` : `${filteredRows.length} dòng`}
            </span>
          </div>

          <div className="table-header-actions">
            {/* Search Input */}
            <div className="table-search-box">
              <Search size={14} className="search-icon" />
              <input
                type="text"
                placeholder={activeBranchId === 'month' ? 'Tìm khách hàng, SPDV...' : 'Tìm kiếm chỉ tiêu...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="table-search-input"
              />
            </div>

            {/* Filter Buttons */}
            <div className="table-filter-group">
              <button
                type="button"
                className={`filter-chip-btn ${statusFilter === 'all' ? 'active' : ''}`}
                onClick={() => setStatusFilter('all')}
              >
                Tất cả ({activeBranchId === 'month' ? (getCustomerSpdvMonthData(selectedMonth) || []).length : tableData.rows.length})
              </button>
              <button
                type="button"
                className={`filter-chip-btn ${statusFilter === 'pass' ? 'active' : ''}`}
                onClick={() => setStatusFilter('pass')}
              >
                Đạt ≥ 100%
              </button>
              <button
                type="button"
                className={`filter-chip-btn ${statusFilter === 'fail' ? 'active' : ''}`}
                onClick={() => setStatusFilter('fail')}
              >
                Chưa đạt &lt; 100%
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. MAIN DATA TABLE                                                        */}
        {/* ========================================================================= */}
        <div className="chart-detail-table-wrapper">
          {activeBranchId === 'month' ? (
            /* ======================================================================= */
            /* MONTH BRANCH TABLE: THỰC HIỆN SO VỚI KẾ HOẠCH TẬP ĐOÀN                  */
            /* ======================================================================= */
            <table className="chart-detail-month-table">
              <thead>
                <tr>
                  <th rowSpan={2} className="th-customer-group">Nhóm khách hàng</th>
                  <th rowSpan={2} className="th-customer-name">Tên khách hàng</th>
                  <th rowSpan={2} className="th-spdv-group">Nhóm SPDV</th>
                  <th rowSpan={2} className="th-spdv-name">Tên SPDV</th>
                  <th colSpan={4} className="th-month-group">{selectedMonth}</th>
                </tr>
                <tr className="th-sub-row">
                  <th className="th-sub-kh">KH</th>
                  <th className="th-sub-th">TH</th>
                  <th className="th-sub-diff">+/- so với KH</th>
                  <th className="th-sub-rate">% HTKH</th>
                </tr>
              </thead>
              <tbody>
                {filteredMonthRows.length > 0 ? (
                  filteredMonthRows.map((row) => (
                    <tr key={row.id} className="month-data-row">
                      <td className="td-customer-group">{row.customerGroup}</td>
                      <td className="td-customer-name font-semibold">{row.customerName}</td>
                      <td className="td-spdv-group">{row.spdvGroup}</td>
                      <td className="td-spdv-name">{row.spdvName}</td>
                      <td className="td-kh text-right">{row.kh}</td>
                      <td className="td-th text-right font-medium">{row.th}</td>
                      <td className={`td-diff text-right font-medium ${row.diff >= 0 ? 'text-green' : 'text-red'}`}>
                        {row.diffFormatted}
                      </td>
                      <td className={`td-rate text-right font-bold ${row.isPass ? 'text-green' : 'text-red'}`}>
                        {row.rate}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="table-empty-row">
                      Không tìm thấy bản ghi nào phù hợp với bộ lọc tìm kiếm.
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                {/* Summary Row 1: Tổng doanh thu ngoài Tập đoàn */}
                <tr className="month-summary-row row-external">
                  <td colSpan={4} className="summary-title-cell font-bold">
                    Tổng doanh thu ngoài Tập đoàn
                  </td>
                  <td className="td-kh text-right font-bold">{monthTotals.external.kh}</td>
                  <td className="td-th text-right font-bold">{monthTotals.external.th}</td>
                  <td className={`td-diff text-right font-bold ${monthTotals.external.diff >= 0 ? 'text-green' : 'text-red'}`}>
                    {monthTotals.external.diffFormatted}
                  </td>
                  <td className={`td-rate text-right font-bold ${monthTotals.external.isPass ? 'text-green' : 'text-red'}`}>
                    {monthTotals.external.rate}
                  </td>
                </tr>

                {/* Summary Row 2: Tổng doanh thu nội bộ */}
                <tr className="month-summary-row row-internal">
                  <td colSpan={4} className="summary-title-cell font-bold">
                    Tổng doanh thu nội bộ
                  </td>
                  <td className="td-kh text-right font-bold">{monthTotals.internal.kh}</td>
                  <td className="td-th text-right font-bold">{monthTotals.internal.th}</td>
                  <td className={`td-diff text-right font-bold ${monthTotals.internal.diff >= 0 ? 'text-green' : 'text-red'}`}>
                    {monthTotals.internal.diffFormatted}
                  </td>
                  <td className={`td-rate text-right font-bold ${monthTotals.internal.isPass ? 'text-green' : 'text-red'}`}>
                    {monthTotals.internal.rate}
                  </td>
                </tr>

                {/* Summary Row 3: Tổng doanh thu (Highlight blue background) */}
                <tr className="month-summary-row row-grand-total">
                  <td colSpan={4} className="summary-title-cell font-extrabold">
                    Tổng doanh thu
                  </td>
                  <td className="td-kh text-right font-extrabold">{monthTotals.total.kh}</td>
                  <td className="td-th text-right font-extrabold">{monthTotals.total.th}</td>
                  <td className={`td-diff text-right font-extrabold ${monthTotals.total.diff >= 0 ? 'text-green' : 'text-red'}`}>
                    {monthTotals.total.diffFormatted}
                  </td>
                  <td className={`td-rate text-right font-extrabold ${monthTotals.total.isPass ? 'text-green' : 'text-red'}`}>
                    {monthTotals.total.rate}
                  </td>
                </tr>
              </tfoot>
            </table>
          ) : (
            <table className="chart-detail-erp-table">
              <thead>
                <tr>
                  <th style={{ width: '50px', textAlign: 'center' }}>STT</th>
                  <th style={{ textAlign: 'left', minWidth: '220px' }}>Chỉ tiêu / Đối tượng</th>
                  <th style={{ width: '90px', textAlign: 'center' }}>Đơn vị</th>
                  <th style={{ width: '120px', textAlign: 'right' }}>Kế hoạch (KH)</th>
                  <th style={{ width: '120px', textAlign: 'right' }}>Thực hiện (TH)</th>
                  <th style={{ width: '120px', textAlign: 'right' }}>Chênh lệch (+/-)</th>
                  <th style={{ width: '150px', textAlign: 'center' }}>% Hoàn thành</th>
                  <th style={{ width: '90px', textAlign: 'center' }}>Tỷ trọng</th>
                  <th style={{ width: '110px', textAlign: 'center' }}>Đánh giá</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.length > 0 ? (
                  filteredRows.map((row) => (
                    <tr key={`detail-row-${row.stt}`}>
                      <td style={{ textAlign: 'center', fontWeight: '600', color: '#64748b' }}>
                        {row.stt}
                      </td>
                      <td style={{ textAlign: 'left', fontWeight: '700', color: '#0f172a' }}>
                        {row.name}
                      </td>
                      <td style={{ textAlign: 'center', color: '#64748b', fontSize: '12px' }}>
                        {row.unit}
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: '600', color: '#475569' }}>
                        {typeof row.kh === 'number' ? row.kh.toLocaleString('vi-VN') : row.kh}
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: '800', color: '#e11d48' }}>
                        {typeof row.th === 'number' ? row.th.toLocaleString('vi-VN') : row.th}
                      </td>
                      <td
                        style={{
                          textAlign: 'right',
                          fontWeight: '700',
                          color: row.diffNum >= 0 ? '#15803d' : '#dc2626'
                        }}
                      >
                        {row.diff}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <div className="rate-progress-cell">
                          <span className={`rate-badge-pill ${row.isPass ? 'rate-pass' : 'rate-fail'}`}>
                            {row.rate}
                          </span>
                          {row.rateNum > 0 && (
                            <div className="rate-mini-bar-track">
                              <div
                                className={`rate-mini-bar-fill ${row.isPass ? 'fill-green' : 'fill-red'}`}
                                style={{ width: `${Math.min(row.rateNum, 100)}%` }}
                              />
                            </div>
                          )}
                        </div>
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: '600', color: '#334155' }}>
                        {row.share}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span className={`eval-status-pill ${row.isPass ? 'eval-pass' : 'eval-fail'}`}>
                          {row.isPass ? (
                            <>
                              <CheckCircle2 size={12} />
                              <span>Đạt</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle size={12} />
                              <span>Chưa đạt</span>
                            </>
                          )}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="table-empty-row">
                      Không tìm thấy bản ghi nào phù hợp với bộ lọc tìm kiếm.
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr className="chart-detail-table-footer">
                  <td colSpan={3} style={{ textAlign: 'left', fontWeight: '800', paddingLeft: '24px' }}>
                    TỔNG CỘNG
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: '800', color: '#334155' }}>
                    {totals.sumKh.toLocaleString('vi-VN')}
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: '900', color: '#e11d48' }}>
                    {totals.sumTh.toLocaleString('vi-VN')}
                  </td>
                  <td
                    style={{
                      textAlign: 'right',
                      fontWeight: '800',
                      color: totals.diffVal >= 0 ? '#15803d' : '#dc2626'
                    }}
                  >
                    {totals.diffFormatted}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span className={`rate-badge-pill large ${totals.avgRate >= 100 ? 'rate-pass' : 'rate-fail'}`}>
                      {totals.avgRate}%
                    </span>
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: '800', color: '#0f172a' }}>
                    100%
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span className={`eval-status-pill ${totals.isPass ? 'eval-pass' : 'eval-fail'}`}>
                      {totals.isPass ? 'Đạt KH' : 'Chưa đạt'}
                    </span>
                  </td>
                </tr>
              </tfoot>
            </table>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. BOTTOM ACTIONS                                                         */}
      {/* ========================================================================= */}
      <div className="chart-detail-bottom-bar">
        <button
          type="button"
          className="chart-detail-back-btn large"
          onClick={onBack}
        >
          <ArrowLeft size={16} />
          <span>Quay lại nhóm biểu đồ</span>
        </button>

        <button
          type="button"
          className="chart-detail-export-btn large"
          onClick={handleExportTableExcel}
        >
          <Download size={16} />
          <span>Tải bảng dữ liệu chi tiết (.xlsx)</span>
        </button>
      </div>
    </div>
  );
}
