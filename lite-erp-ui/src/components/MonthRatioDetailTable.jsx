import React, { useState, useMemo } from 'react';
import { Copy, Check } from 'lucide-react';
import './MonthRatioDetailTable.css';
import {
  MONTHLY_PLAN_DATA,
  MONTH_PREV_DATA,
  MONTH_LAST_YEAR_DATA,
  MONTH_NEXT_PLAN_DATA
} from '../data/revenueMonthData';
import {
  QUARTER_CUMULATIVE_DATA,
  QUARTER_ESTIMATE_DATA,
  QUARTER_PREV_DATA,
  QUARTER_SAME_PERIOD_DATA,
  QUARTER_NEXT_PLAN_DATA
} from '../data/revenueQuarterData';
import {
  YEAR_CUMULATIVE_DATA,
  YEAR_PLAN_FULL_DATA,
  YEAR_ESTIMATE_DATA,
  YEAR_ESTIMATE_PREV_DATA
} from '../data/revenueYearData';

// Helper to format float with 1 decimal digit and comma decimal separator
const formatNum = (val) => {
  if (val === null || val === undefined || val === '') return '—';
  if (typeof val === 'string') return val;
  return Number(val).toLocaleString('vi-VN', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  });
};

const getPrimaryVal = (item) => {
  if (!item) return 0;
  if (item.th !== undefined) return item.th;
  if (item.lk !== undefined) return item.lk;
  if (item.uoc !== undefined) return item.uoc;
  if (item.thCurrent !== undefined) return item.thCurrent;
  return 0;
};

const getSecondaryVal = (item) => {
  if (!item) return 0;
  if (item.kh !== undefined) return item.kh;
  if (item.thPrev !== undefined) return item.thPrev;
  if (item.thSamePeriod !== undefined) return item.thSamePeriod;
  if (item.thLastYear !== undefined) return item.thLastYear;
  if (item.khNext !== undefined) return item.khNext;
  if (item.khYear !== undefined) return item.khYear;
  if (item.prev !== undefined) return item.prev;
  return 0;
};

export default function MonthRatioDetailTable({
  branchId = 'month',
  selectedYear = '2026',
  selectedMonth = 'Tháng 8',
  selectedQuarter = 'Quý 3',
  selectedCumulativeMonth = 'Lũy kế 8 tháng',
  activeChartKey = 'chart1_rat',
  title = null,
  showCardWrapper = true
}) {
  const [copied, setCopied] = useState(false);

  // Automatically resolve branchId if not explicitly provided
  const resolvedBranchId = useMemo(() => {
    if (branchId === 'quarter' || branchId === 'year') return branchId;
    if (
      activeChartKey.startsWith('chart5_') ||
      activeChartKey.startsWith('chart6_') ||
      activeChartKey.startsWith('chart7_') ||
      activeChartKey.startsWith('chart8_') ||
      activeChartKey.startsWith('chart9_')
    ) {
      return 'quarter';
    }
    if (
      activeChartKey.startsWith('chart10_') ||
      activeChartKey.startsWith('chart11_') ||
      activeChartKey.startsWith('chart12_') ||
      activeChartKey.startsWith('chart13_')
    ) {
      return 'year';
    }
    return 'month';
  }, [branchId, activeChartKey]);

  // Month number & codes
  const monthNum = parseInt(selectedMonth?.match(/\d+/)?.[0] || '8', 10);
  const shortMonth = `T${monthNum}`;
  const prevMonthNum = monthNum === 1 ? 12 : monthNum - 1;
  const prevShortMonth = `T${prevMonthNum}`;
  const prevYear = monthNum === 1 ? (parseInt(selectedYear, 10) - 1).toString() : selectedYear;
  const lastYear = (parseInt(selectedYear, 10) - 1).toString();
  const nextMonthNum = monthNum === 12 ? 1 : monthNum + 1;
  const nextShortMonth = `T${nextMonthNum}`;
  const nextYear = monthNum === 12 ? (parseInt(selectedYear, 10) + 1).toString() : selectedYear;

  // Quarter codes
  const qNum = (selectedQuarter?.includes('4') || selectedQuarter?.includes('IV')) ? 4
    : (selectedQuarter?.includes('3') || selectedQuarter?.includes('III')) ? 3
    : (selectedQuarter?.includes('2') || selectedQuarter?.includes('II')) ? 2
    : 1;
  const qCode = `Q${qNum}`;
  const prevQNum = qNum === 1 ? 4 : qNum - 1;
  const prevQCode = `Q${prevQNum}`;
  const prevQYear = qNum === 1 ? (parseInt(selectedYear, 10) - 1).toString() : selectedYear;
  const nextQNum = qNum === 4 ? 1 : qNum + 1;
  const nextQCode = `Q${nextQNum}`;
  const nextQYear = qNum === 4 ? (parseInt(selectedYear, 10) + 1).toString() : selectedYear;

  // Year short codes
  const yearShortCode = selectedCumulativeMonth?.includes('12') ? '12T' :
    selectedCumulativeMonth?.includes('11') ? '11T' :
    selectedCumulativeMonth?.includes('10') ? '10T' :
    selectedCumulativeMonth?.includes('9') ? '9T' :
    selectedCumulativeMonth?.includes('8') ? '8T' :
    selectedCumulativeMonth?.includes('7') ? '7T' :
    selectedCumulativeMonth?.includes('6') ? '6T' : '8T';

  // Header labels based on branch and comparison mode
  const { thHeader, compHeader, compRatHeader, cardTag, defaultTitle } = useMemo(() => {
    if (resolvedBranchId === 'quarter') {
      if (activeChartKey === 'chart6_rat') {
        return {
          thHeader: `Ước ${qCode}/${selectedYear}`,
          compHeader: `KH ${qCode}/${selectedYear}`,
          compRatHeader: `Tỷ suất/Tỷ trọng KH`,
          cardTag: 'Biểu đồ 6b',
          defaultTitle: `Bảng phân tích tỷ suất / tỷ trọng ước kết quả ${selectedQuarter}/${selectedYear}`
        };
      }
      if (activeChartKey === 'chart7_rat') {
        return {
          thHeader: `Ước ${qCode}/${selectedYear}`,
          compHeader: `TH ${prevQCode}/${prevQYear}`,
          compRatHeader: `Tỷ suất/Tỷ trọng ${prevQCode}`,
          cardTag: 'Biểu đồ 7b',
          defaultTitle: `Bảng phân tích tỷ suất / tỷ trọng so với quý trước (${prevQCode}/${prevQYear})`
        };
      }
      if (activeChartKey === 'chart8_rat') {
        return {
          thHeader: `Ước ${qCode}/${selectedYear}`,
          compHeader: `TH ${qCode}/${lastYear}`,
          compRatHeader: `Tỷ suất/Tỷ trọng ${qCode}/${lastYear}`,
          cardTag: 'Biểu đồ 8b',
          defaultTitle: `Bảng phân tích tỷ suất / tỷ trọng so với cùng kỳ năm trước (${lastYear})`
        };
      }
      if (activeChartKey === 'chart9_rat') {
        return {
          thHeader: `Ước ${qCode}/${selectedYear}`,
          compHeader: `KH ${nextQCode}/${nextQYear}`,
          compRatHeader: `Tỷ suất/Tỷ trọng KH`,
          cardTag: 'Biểu đồ 9b',
          defaultTitle: `Bảng phân tích tỷ suất / tỷ trọng so với kế hoạch quý tới (${nextQCode}/${nextQYear})`
        };
      }
      // Default: chart5_rat (Lũy kế quý so với KH)
      return {
        thHeader: `TH LK ${qCode}/${selectedYear}`,
        compHeader: `KH ${qCode}/${selectedYear}`,
        compRatHeader: `Tỷ suất/Tỷ trọng KH`,
        cardTag: 'Biểu đồ 5b',
        defaultTitle: `Bảng phân tích tỷ suất / tỷ trọng lũy kế ${selectedQuarter}/${selectedYear}`
      };
    }

    if (resolvedBranchId === 'year') {
      if (activeChartKey === 'chart11_rat') {
        return {
          thHeader: `TH LK ${yearShortCode}/${selectedYear}`,
          compHeader: `KH ${selectedYear}`,
          compRatHeader: `Tỷ suất/Tỷ trọng KH cả năm`,
          cardTag: 'Biểu đồ 11b',
          defaultTitle: `Bảng phân tích tỷ suất / tỷ trọng lũy kế TH năm so với KH cả năm ${selectedYear}`
        };
      }
      if (activeChartKey === 'chart12_rat') {
        return {
          thHeader: `Ước ${selectedYear}`,
          compHeader: `KH ${selectedYear}`,
          compRatHeader: `Tỷ suất/Tỷ trọng KH`,
          cardTag: 'Biểu đồ 12b',
          defaultTitle: `Bảng phân tích tỷ suất / tỷ trọng ước kết quả năm so với KH năm ${selectedYear}`
        };
      }
      if (activeChartKey === 'chart13_rat') {
        return {
          thHeader: `Ước ${selectedYear}`,
          compHeader: `TH ${lastYear}`,
          compRatHeader: `Tỷ suất/Tỷ trọng ${lastYear}`,
          cardTag: 'Biểu đồ 13b',
          defaultTitle: `Bảng phân tích tỷ suất / tỷ trọng ước kết quả năm so với năm trước (${lastYear})`
        };
      }
      // Default: chart10_rat (Lũy kế so với KH lũy kế)
      return {
        thHeader: `TH LK ${yearShortCode}/${selectedYear}`,
        compHeader: `KH LK ${yearShortCode}/${selectedYear}`,
        compRatHeader: `Tỷ suất/Tỷ trọng KH LK`,
        cardTag: 'Biểu đồ 10b',
        defaultTitle: `Bảng phân tích tỷ suất / tỷ trọng lũy kế ${yearShortCode} năm ${selectedYear}`
      };
    }

    // Default: month
    if (activeChartKey === 'chart2_rat') {
      return {
        thHeader: `TH ${shortMonth}/${selectedYear}`,
        compHeader: `TH ${prevShortMonth}/${prevYear}`,
        compRatHeader: `Tỷ suất/Tỷ trọng ${prevShortMonth}`,
        cardTag: 'Biểu đồ 2b',
        defaultTitle: `Bảng phân tích tỷ suất / tỷ trọng so với tháng trước (${prevShortMonth}/${prevYear})`
      };
    }
    if (activeChartKey === 'chart3_rat') {
      return {
        thHeader: `TH ${shortMonth}/${selectedYear}`,
        compHeader: `TH ${shortMonth}/${lastYear}`,
        compRatHeader: `Tỷ suất/Tỷ trọng ${shortMonth}/${lastYear}`,
        cardTag: 'Biểu đồ 3b',
        defaultTitle: `Bảng phân tích tỷ suất / tỷ trọng so với cùng kỳ năm trước (${lastYear})`
      };
    }
    if (activeChartKey === 'chart4_rat') {
      return {
        thHeader: `TH ${shortMonth}/${selectedYear}`,
        compHeader: `KH ${nextShortMonth}/${nextYear}`,
        compRatHeader: `Tỷ suất/Tỷ trọng KH`,
        cardTag: 'Biểu đồ 4b',
        defaultTitle: `Bảng phân tích tỷ suất / tỷ trọng so với kế hoạch tháng tới (${nextShortMonth}/${nextYear})`
      };
    }
    // Default: So với KH tháng
    return {
      thHeader: `TH ${shortMonth}/${selectedYear}`,
      compHeader: `KH ${shortMonth}/${selectedYear}`,
      compRatHeader: `Tỷ suất/Tỷ trọng KH`,
      cardTag: 'Biểu đồ 1b',
      defaultTitle: `Bảng phân tích tỷ suất / tỷ trọng doanh thu – ${selectedMonth}/${selectedYear}`
    };
  }, [
    resolvedBranchId,
    activeChartKey,
    shortMonth,
    selectedMonth,
    selectedYear,
    prevShortMonth,
    prevYear,
    lastYear,
    nextShortMonth,
    nextYear,
    qCode,
    prevQCode,
    prevQYear,
    nextQCode,
    nextQYear,
    selectedQuarter,
    yearShortCode,
    selectedCumulativeMonth
  ]);

  // Table rows data
  // Table rows data
  const rows = useMemo(() => {
    // 1. Month Mode
    if (resolvedBranchId === 'month') {
      if (selectedMonth === 'Tháng 8' && selectedYear === '2026' && activeChartKey !== 'chart2_rat' && activeChartKey !== 'chart3_rat' && activeChartKey !== 'chart4_rat') {
        return [
          {
            id: 'external',
            name: 'Doanh thu ngoài Tập đoàn',
            th: 641.8,
            kh: 659.9,
            thShare: '67,4%',
            khShare: '70,0%',
            diff: '-2,6 đ.%'
          },
          {
            id: 'global',
            name: 'Doanh thu quốc tế',
            th: 97.1,
            kh: 113.1,
            thShare: '10,2%',
            khShare: '12,0%',
            diff: '-1,8 đ.%'
          },
          {
            id: 'profit',
            name: 'Lợi nhuận trước thuế',
            th: 92.3,
            kh: 92.1,
            thShare: '9,7%',
            khShare: '9,8%',
            diff: '-0,1 đ.%'
          },
          {
            id: 'total',
            name: 'Tổng doanh thu',
            th: 952.0,
            kh: 942.9,
            thShare: '100,0%',
            khShare: '100,0%',
            diff: '0,0 đ.%'
          }
        ];
      }

      let baseData = MONTHLY_PLAN_DATA[selectedMonth] || MONTHLY_PLAN_DATA['Tháng 8'];
      if (activeChartKey === 'chart2_rat') baseData = MONTH_PREV_DATA[selectedMonth] || MONTH_PREV_DATA['Tháng 8'];
      else if (activeChartKey === 'chart3_rat') baseData = MONTH_LAST_YEAR_DATA[selectedMonth] || MONTH_LAST_YEAR_DATA['Tháng 8'];
      else if (activeChartKey === 'chart4_rat') baseData = MONTH_NEXT_PLAN_DATA[selectedMonth] || MONTH_NEXT_PLAN_DATA['Tháng 8'];

      const values = baseData?.values || [];
      const ratios = baseData?.ratios || [];

      const totalVal = values.find(v => v.id === 'total');
      const profitVal = values.find(v => v.id === 'profit' || v.id === 'lntt');
      const extVal = values.find(v => v.id === 'external');
      const globVal = values.find(v => v.id === 'global');

      const profitRat = ratios.find(r => r.id === 'profit_ratio' || r.id === 'lntt_ratio');
      const extRat = ratios.find(r => r.id === 'external_ratio');
      const globRat = ratios.find(r => r.id === 'global_ratio');

      const totTh = getPrimaryVal(totalVal);
      const totKh = getSecondaryVal(totalVal);
      const profTh = getPrimaryVal(profitVal);
      const profKh = getSecondaryVal(profitVal);

      return [
        {
          id: 'external',
          name: 'Doanh thu ngoài Tập đoàn',
          th: getPrimaryVal(extVal),
          kh: getSecondaryVal(extVal),
          thShare: extRat ? `${formatNum(getPrimaryVal(extRat))}%` : '—',
          khShare: extRat ? `${formatNum(getSecondaryVal(extRat))}%` : '—',
          diff: extRat?.diff || '—'
        },
        {
          id: 'global',
          name: 'Doanh thu quốc tế',
          th: getPrimaryVal(globVal),
          kh: getSecondaryVal(globVal),
          thShare: globRat ? `${formatNum(getPrimaryVal(globRat))}%` : '—',
          khShare: globRat ? `${formatNum(getSecondaryVal(globRat))}%` : '—',
          diff: globRat?.diff || '—'
        },
        {
          id: 'profit',
          name: 'Lợi nhuận trước thuế',
          th: profTh,
          kh: profKh,
          thShare: profitRat ? `${formatNum(getPrimaryVal(profitRat))}%` : '—',
          khShare: profitRat ? `${formatNum(getSecondaryVal(profitRat))}%` : '—',
          diff: profitRat?.diff || '—'
        },
        {
          id: 'total',
          name: 'Tổng doanh thu',
          th: totTh,
          kh: totKh,
          thShare: '100,0%',
          khShare: '100,0%',
          diff: '0,0 đ.%'
        }
      ];
    }

    // 2. Quarter Mode
    if (resolvedBranchId === 'quarter') {
      let baseData = QUARTER_CUMULATIVE_DATA[selectedQuarter] || QUARTER_CUMULATIVE_DATA['Quý III'];
      if (activeChartKey === 'chart6_rat') baseData = QUARTER_ESTIMATE_DATA[selectedQuarter] || QUARTER_ESTIMATE_DATA['Quý III'];
      else if (activeChartKey === 'chart7_rat') baseData = QUARTER_PREV_DATA[selectedQuarter] || QUARTER_PREV_DATA['Quý III'];
      else if (activeChartKey === 'chart8_rat') baseData = QUARTER_SAME_PERIOD_DATA[selectedQuarter] || QUARTER_SAME_PERIOD_DATA['Quý III'];
      else if (activeChartKey === 'chart9_rat') baseData = QUARTER_NEXT_PLAN_DATA[selectedQuarter] || QUARTER_NEXT_PLAN_DATA['Quý III'];

      const values = baseData?.values || [];
      const ratios = baseData?.ratios || [];

      const totalVal = values.find(v => v.id === 'total');
      const profitVal = values.find(v => v.id === 'lntt' || v.id === 'profit');
      const extVal = values.find(v => v.id === 'external');
      const globVal = values.find(v => v.id === 'global');

      const profitRat = ratios.find(r => r.id === 'lntt_ratio' || r.id === 'profit_ratio');
      const extRat = ratios.find(r => r.id === 'external_ratio');
      const globRat = ratios.find(r => r.id === 'global_ratio');

      const totTh = getPrimaryVal(totalVal);
      const totKh = getSecondaryVal(totalVal);
      const profTh = getPrimaryVal(profitVal);
      const profKh = getSecondaryVal(profitVal);

      return [
        {
          id: 'external',
          name: 'Doanh thu ngoài Tập đoàn',
          th: getPrimaryVal(extVal),
          kh: getSecondaryVal(extVal),
          thShare: extRat ? `${formatNum(getPrimaryVal(extRat))}%` : '—',
          khShare: extRat ? `${formatNum(getSecondaryVal(extRat))}%` : '—',
          diff: extRat?.diff || '—'
        },
        {
          id: 'global',
          name: 'Doanh thu quốc tế',
          th: getPrimaryVal(globVal),
          kh: getSecondaryVal(globVal),
          thShare: globRat ? `${formatNum(getPrimaryVal(globRat))}%` : '—',
          khShare: globRat ? `${formatNum(getSecondaryVal(globRat))}%` : '—',
          diff: globRat?.diff || '—'
        },
        {
          id: 'profit',
          name: 'Lợi nhuận trước thuế',
          th: profTh,
          kh: profKh,
          thShare: profitRat ? `${formatNum(getPrimaryVal(profitRat))}%` : '—',
          khShare: profitRat ? `${formatNum(getSecondaryVal(profitRat))}%` : '—',
          diff: profitRat?.diff || '—'
        },
        {
          id: 'total',
          name: 'Tổng doanh thu',
          th: totTh,
          kh: totKh,
          thShare: '100,0%',
          khShare: '100,0%',
          diff: '0,0 đ.%'
        }
      ];
    }

    // 3. Year Mode
    if (resolvedBranchId === 'year') {
      let baseData = YEAR_CUMULATIVE_DATA[selectedCumulativeMonth] || YEAR_CUMULATIVE_DATA['Lũy kế 8 tháng'];
      if (activeChartKey === 'chart11_rat') baseData = YEAR_PLAN_FULL_DATA[selectedCumulativeMonth] || YEAR_PLAN_FULL_DATA['Lũy kế 8 tháng'];
      else if (activeChartKey === 'chart12_rat') baseData = YEAR_ESTIMATE_DATA[selectedCumulativeMonth] || YEAR_ESTIMATE_DATA['Lũy kế 8 tháng'];
      else if (activeChartKey === 'chart13_rat') baseData = YEAR_ESTIMATE_PREV_DATA[selectedCumulativeMonth] || YEAR_ESTIMATE_PREV_DATA['Lũy kế 8 tháng'];

      const values = baseData?.values || [];
      const ratios = baseData?.ratios || [];

      const totalVal = values.find(v => v.id === 'total');
      const profitVal = values.find(v => v.id === 'profit' || v.id === 'lntt');
      const extVal = values.find(v => v.id === 'external');
      const globVal = values.find(v => v.id === 'global');

      const profitRat = ratios.find(r => r.id === 'profit_ratio' || r.id === 'lntt_ratio');
      const extRat = ratios.find(r => r.id === 'external_ratio');
      const globRat = ratios.find(r => r.id === 'global_ratio');

      const totTh = getPrimaryVal(totalVal);
      const totKh = getSecondaryVal(totalVal);
      const profTh = getPrimaryVal(profitVal);
      const profKh = getSecondaryVal(profitVal);

      return [
        {
          id: 'external',
          name: 'Doanh thu ngoài Tập đoàn',
          th: getPrimaryVal(extVal),
          kh: getSecondaryVal(extVal),
          thShare: extRat ? `${formatNum(getPrimaryVal(extRat))}%` : '—',
          khShare: extRat ? `${formatNum(getSecondaryVal(extRat))}%` : '—',
          diff: extRat?.diff || '—'
        },
        {
          id: 'global',
          name: 'Doanh thu quốc tế',
          th: getPrimaryVal(globVal),
          kh: getSecondaryVal(globVal),
          thShare: globRat ? `${formatNum(getPrimaryVal(globRat))}%` : '—',
          khShare: globRat ? `${formatNum(getSecondaryVal(globRat))}%` : '—',
          diff: globRat?.diff || '—'
        },
        {
          id: 'profit',
          name: 'Lợi nhuận trước thuế',
          th: profTh,
          kh: profKh,
          thShare: profitRat ? `${formatNum(getPrimaryVal(profitRat))}%` : '—',
          khShare: profitRat ? `${formatNum(getSecondaryVal(profitRat))}%` : '—',
          diff: profitRat?.diff || '—'
        },
        {
          id: 'total',
          name: 'Tổng doanh thu',
          th: totTh,
          kh: totKh,
          thShare: '100,0%',
          khShare: '100,0%',
          diff: '0,0 đ.%'
        }
      ];
    }

    return [];
  }, [
    resolvedBranchId,
    selectedMonth,
    selectedYear,
    selectedQuarter,
    selectedCumulativeMonth,
    activeChartKey
  ]);

  // Copy table to clipboard
  const handleCopy = () => {
    const headerRow = `Chỉ tiêu\t${thHeader}\t${compHeader}\tTỷ suất/Tỷ trọng TH\t${compRatHeader}\tChênh lệch`;
    const dataRows = rows.map(r =>
      `${r.name}\t${formatNum(r.th)}\t${formatNum(r.kh)}\t${r.thShare}\t${r.khShare}\t${r.diff}`
    ).join('\n');
    const tsvContent = `${headerRow}\n${dataRows}`;

    navigator.clipboard.writeText(tsvContent).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const tableElement = (
    <div className="month-ratio-table-wrap">
      <table className="month-ratio-table">
        <thead>
          <tr>
            <th style={{ textAlign: 'left', minWidth: '220px' }}>Chỉ tiêu</th>
            <th style={{ textAlign: 'right', width: '130px' }}>{thHeader}</th>
            <th style={{ textAlign: 'right', width: '130px' }}>{compHeader}</th>
            <th style={{ textAlign: 'right', width: '160px' }}>Tỷ suất/Tỷ trọng TH</th>
            <th style={{ textAlign: 'right', width: '160px' }}>{compRatHeader}</th>
            <th style={{ textAlign: 'right', width: '140px' }}>
              <span>Chênh lệch</span>
              <button
                type="button"
                className="month-ratio-copy-btn"
                title="Sao chép bảng dữ liệu"
                onClick={handleCopy}
              >
                {copied ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
              </button>
              {copied && <span className="month-ratio-copy-toast">Đã chép!</span>}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className={`month-ratio-row-${row.id}`}>
              <td className="month-ratio-td-name">{row.name}</td>
              <td style={{ textAlign: 'right' }}>{formatNum(row.th)}</td>
              <td style={{ textAlign: 'right' }}>{formatNum(row.kh)}</td>
              <td style={{ textAlign: 'right' }}>{row.thShare}</td>
              <td style={{ textAlign: 'right' }}>{row.khShare}</td>
              <td style={{ textAlign: 'right' }}>{row.diff}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (!showCardWrapper) {
    return tableElement;
  }

  return (
    <div className="month-ratio-table-card">
      <div className="month-ratio-card-header">
        <h3 className="month-ratio-card-title">
          {title || defaultTitle}
        </h3>
        <span className="month-ratio-card-tag">{cardTag}</span>
      </div>
      {tableElement}
    </div>
  );
}
