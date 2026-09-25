import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import './MonthComparisonChart.css';

import {
  MONTH_OPTIONS,
  MONTHLY_PLAN_DATA,
  MONTH_PREV_DATA,
  MONTH_LAST_YEAR_DATA,
  MONTH_NEXT_PLAN_DATA
} from '../data/revenueMonthData';

// Helper to format numbers with comma as decimal separator
const formatVal = (val) => {
  if (val === null || val === undefined || val === '') return '';
  return val.toString().replace('.', ',');
};

// ==============================================================================
// SUBCARD KHU 1: GIÁ TRỊ (4 NHÓM DOANH THU)
// ==============================================================================
function MonthValueCard({
  title,
  tag,
  primaryLegend,
  secondaryLegend,
  data,
  isBlank,
  hoveredItem,
  setHoveredItem,
  isVisible = true,
  onToggle
}) {
  const svgWidth = 540;
  const svgHeight = 280;
  const chartLeft = 55;
  const chartRight = 515;
  const chartTop = 32;
  const chartBottom = 222;
  const chartHeight = chartBottom - chartTop; // 190px
  const maxVal = 500;
  const yTicks = isBlank ? [] : [0, 100, 200, 300, 400, 500];
  const xCenters = [112, 226, 340, 454];
  const barWidth = 14;
  const barGap = 2;

  return (
    <div className={`month-subcard ${!isVisible ? 'is-collapsed' : ''}`}>
      <div
        className="month-subcard-header"
        onClick={!isVisible ? onToggle : undefined}
        style={!isVisible ? { cursor: 'pointer', marginBottom: 0 } : undefined}
      >
        <h3 className="month-subcard-title">{title}</h3>
        <div className="month-subcard-header-actions">
          <span className="month-subcard-tag">{tag}</span>
          {onToggle && (
            <button
              type="button"
              className={`chart-view-toggle-btn ${!isVisible ? 'is-collapsed' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}
              title={isVisible ? 'Thu gọn biểu đồ' : 'Mở rộng biểu đồ'}
              aria-label={isVisible ? 'Thu gọn biểu đồ' : 'Mở rộng biểu đồ'}
            >
              {isVisible ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>
          )}
        </div>
      </div>

      {isVisible && (
        <div className="month-subcard-svg-wrap">
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="month-subcard-svg">
            {/* Stacked Legend Top Right */}
            <g transform="translate(445, 8)">
              <rect x={0} y={0} width={12} height={12} fill="#e11d48" rx={1} />
              <text x={16} y={10} className="legend-label">{primaryLegend}</text>

              <rect x={0} y={16} width={12} height={12} fill="#94a3b8" rx={1} />
              <text x={16} y={26} className="legend-label">{secondaryLegend}</text>
            </g>

            {/* Left Y Axis Title & Ticks */}
            <text
              x={16}
              y={chartTop + chartHeight / 2}
              transform={`rotate(-90, 16, ${chartTop + chartHeight / 2})`}
              textAnchor="middle"
              className="axis-title"
            >
              Triệu đồng
            </text>
            <line
              x1={chartLeft}
              y1={chartTop - 5}
              x2={chartLeft}
              y2={chartBottom}
              stroke="#64748b"
              strokeWidth={1}
            />

            {yTicks.map((tick) => {
              const y = chartBottom - (tick / maxVal) * chartHeight;
              return (
                <g key={`val-tick-${tick}`}>
                  <line x1={chartLeft - 4} y1={y} x2={chartLeft} y2={y} stroke="#64748b" strokeWidth={1} />
                  <text x={chartLeft - 8} y={y + 4} textAnchor="end" className="axis-tick-text">
                    {tick}
                  </text>
                </g>
              );
            })}

            {/* Baseline */}
            <line
              x1={chartLeft}
              y1={chartBottom}
              x2={chartRight}
              y2={chartBottom}
              stroke="#64748b"
              strokeWidth={1}
            />

            {/* Bars */}
            {!isBlank &&
              data.map((item, idx) => {
                const centerX = xCenters[idx];
                const thBarX = centerX - barWidth - barGap / 2;
                const khBarX = centerX + barGap / 2;

                // Normalized values
                const val1 = item.th !== undefined ? item.th : item.thCurrent;
                const val2 =
                  item.kh !== undefined
                    ? item.kh
                    : item.thPrev !== undefined
                    ? item.thPrev
                    : item.thLastYear !== undefined
                    ? item.thLastYear
                    : item.khNext;

                const hasTh = val1 !== null && val1 !== undefined && val1 !== '';
                const hasKh = val2 !== null && val2 !== undefined && val2 !== '';

                const thHeight = hasTh ? (val1 / maxVal) * chartHeight : 0;
                const khHeight = hasKh ? (val2 / maxVal) * chartHeight : 0;
                const thY = chartBottom - thHeight;
                const khY = chartBottom - khHeight;
                const rateY = (hasTh && hasKh ? Math.min(thY, khY) : (hasTh ? thY : khY)) - 18;
                const isHovered = hoveredItem?.id === item.id;

                return (
                  <g key={`val-group-${item.id}`}>
                    {/* Category X Labels */}
                    {item.lines.map((line, lIdx) => (
                      <text
                        key={`val-lbl-${item.id}-${lIdx}`}
                        x={centerX}
                        y={chartBottom + 16 + lIdx * 14}
                        textAnchor="middle"
                        className="category-x-label"
                      >
                        {line}
                      </text>
                    ))}

                    <g
                      className="chart-bar-group"
                      onMouseEnter={() => setHoveredItem(item)}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      {/* Rate Percentage on Top */}
                      {hasTh && item.rate && item.rate !== '-' && (
                        <text
                          x={centerX}
                          y={rateY}
                          textAnchor="middle"
                          className={`bar-top-rate ${item.isRatePositive ? 'positive' : 'negative'}`}
                        >
                          {item.rate}
                        </text>
                      )}

                      {/* Red Bar (Primary) */}
                      {hasTh && (
                        <>
                          <rect
                            x={thBarX}
                            y={thY}
                            width={barWidth}
                            height={thHeight}
                            fill="#e11d48"
                            rx={1}
                            className={`bar-rect ${isHovered ? 'bar-highlight' : ''}`}
                          />
                          <text
                            x={thBarX + barWidth / 2}
                            y={thY - 5}
                            textAnchor="middle"
                            className="bar-val-primary"
                          >
                            {formatVal(val1)}
                          </text>
                        </>
                      )}

                      {/* Gray Bar (Secondary) */}
                      {hasKh && (
                        <>
                          <rect
                            x={khBarX}
                            y={khY}
                            width={barWidth}
                            height={khHeight}
                            fill="#94a3b8"
                            rx={1}
                            className={`bar-rect ${isHovered ? 'bar-highlight' : ''}`}
                          />
                          <text
                            x={khBarX + barWidth / 2}
                            y={khY - 5}
                            textAnchor="middle"
                            className="bar-val-secondary"
                          >
                            {formatVal(val2)}
                          </text>
                        </>
                      )}
                    </g>
                  </g>
                );
              })}

            {/* Empty State */}
            {isBlank && (
              <text
                x={chartLeft + (chartRight - chartLeft) / 2}
                y={chartTop + chartHeight / 2}
                textAnchor="middle"
                className="chart-empty-text"
              >
                Chưa có số liệu
              </text>
            )}
          </svg>

          {/* Hover Tooltip */}
          {hoveredItem && !isBlank && (
            <div className="month-subcard-tooltip">
              <div className="tooltip-item-title">{hoveredItem.name}</div>
              <div className="tooltip-stat-row">
                <span className="tooltip-dot red"></span>
                <span>{primaryLegend}:</span>
                <strong>
                  {hoveredItem.th !== undefined
                    ? formatVal(hoveredItem.th)
                    : formatVal(hoveredItem.thCurrent)}{' '}
                  {hoveredItem.unit || 'Triệu đồng'}
                </strong>
              </div>
              <div className="tooltip-stat-row">
                <span className="tooltip-dot gray"></span>
                <span>{secondaryLegend}:</span>
                <strong>
                  {hoveredItem.kh !== undefined
                    ? formatVal(hoveredItem.kh)
                    : hoveredItem.thPrev !== undefined
                    ? formatVal(hoveredItem.thPrev)
                    : hoveredItem.thLastYear !== undefined
                    ? formatVal(hoveredItem.thLastYear)
                    : formatVal(hoveredItem.khNext)}{' '}
                  {hoveredItem.unit || 'Triệu đồng'}
                </strong>
              </div>
              {hoveredItem.rate && hoveredItem.rate !== '-' && (
                <div className="tooltip-stat-row">
                  <span>Tỷ lệ hoàn thành:</span>
                  <strong className={hoveredItem.isRatePositive ? 'text-green' : 'text-red'}>
                    {hoveredItem.rate}
                  </strong>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ==============================================================================
// SUBCARD KHU 2: TỶ TRỌNG (CHÊNH LỆCH ĐIỂM %)
// ==============================================================================
function MonthRatioCard({
  title,
  tag,
  primaryLegend,
  secondaryLegend,
  data,
  isBlank,
  hoveredItem,
  setHoveredItem,
  isVisible = true,
  onToggle
}) {
  const svgWidth = 540;
  const svgHeight = 280;
  const chartLeft = 55;
  const chartRight = 515;
  const chartTop = 32;
  const chartBottom = 222;
  const chartHeight = chartBottom - chartTop; // 190px
  const maxVal = 100;
  const yTicks = isBlank ? [] : [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  const xCenters = [210, 390];
  const barWidth = 15;
  const barGap = 2;

  return (
    <div className={`month-subcard ${!isVisible ? 'is-collapsed' : ''}`}>
      <div
        className="month-subcard-header"
        onClick={!isVisible ? onToggle : undefined}
        style={!isVisible ? { cursor: 'pointer', marginBottom: 0 } : undefined}
      >
        <h3 className="month-subcard-title">{title}</h3>
        <div className="month-subcard-header-actions">
          <span className="month-subcard-tag">{tag}</span>
          {onToggle && (
            <button
              type="button"
              className={`chart-view-toggle-btn ${!isVisible ? 'is-collapsed' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}
              title={isVisible ? 'Thu gọn biểu đồ' : 'Mở rộng biểu đồ'}
              aria-label={isVisible ? 'Thu gọn biểu đồ' : 'Mở rộng biểu đồ'}
            >
              {isVisible ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>
          )}
        </div>
      </div>

      {isVisible && (
        <div className="month-subcard-svg-wrap">
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="month-subcard-svg">
            {/* Stacked Legend Top Right */}
            <g transform="translate(445, 8)">
              <rect x={0} y={0} width={12} height={12} fill="#e11d48" rx={1} />
              <text x={16} y={10} className="legend-label">{primaryLegend}</text>

              <rect x={0} y={16} width={12} height={12} fill="#94a3b8" rx={1} />
              <text x={16} y={26} className="legend-label">{secondaryLegend}</text>
            </g>

            {/* Left Y Axis Title & Ticks */}
            <text
              x={16}
              y={chartTop + chartHeight / 2}
              transform={`rotate(-90, 16, ${chartTop + chartHeight / 2})`}
              textAnchor="middle"
              className="axis-title"
            >
              %
            </text>
            <line
              x1={chartLeft}
              y1={chartTop - 5}
              x2={chartLeft}
              y2={chartBottom}
              stroke="#64748b"
              strokeWidth={1}
            />

            {yTicks.map((tick) => {
              const y = chartBottom - (tick / maxVal) * chartHeight;
              return (
                <g key={`rat-tick-${tick}`}>
                  <line x1={chartLeft - 4} y1={y} x2={chartLeft} y2={y} stroke="#64748b" strokeWidth={1} />
                  <text x={chartLeft - 8} y={y + 3.5} textAnchor="end" className="axis-tick-text-ratio">
                    {tick}
                  </text>
                </g>
              );
            })}

            {/* Baseline */}
            <line
              x1={chartLeft}
              y1={chartBottom}
              x2={chartRight}
              y2={chartBottom}
              stroke="#64748b"
              strokeWidth={1}
            />

            {/* Bars */}
            {!isBlank &&
              data.map((item, idx) => {
                const centerX = xCenters[idx];
                const thBarX = centerX - barWidth - barGap / 2;
                const khBarX = centerX + barGap / 2;

                // Normalized values
                const val1 = item.th !== undefined ? item.th : item.thCurrent;
                const val2 =
                  item.kh !== undefined
                    ? item.kh
                    : item.thPrev !== undefined
                    ? item.thPrev
                    : item.thLastYear !== undefined
                    ? item.thLastYear
                    : item.khNext;

                const hasTh = val1 !== null && val1 !== undefined && val1 !== '';
                const hasKh = val2 !== null && val2 !== undefined && val2 !== '';

                const thHeight = hasTh ? (val1 / maxVal) * chartHeight : 0;
                const khHeight = hasKh ? (val2 / maxVal) * chartHeight : 0;
                const thY = chartBottom - thHeight;
                const khY = chartBottom - khHeight;
                const diffY = (hasTh && hasKh ? Math.min(thY, khY) : (hasTh ? thY : khY)) - 18;
                const isHovered = hoveredItem?.id === item.id;

                return (
                  <g key={`rat-group-${item.id}`}>
                    {/* Category X Labels */}
                    {item.lines.map((line, lIdx) => (
                      <text
                        key={`rat-lbl-${item.id}-${lIdx}`}
                        x={centerX}
                        y={chartBottom + 16 + lIdx * 14}
                        textAnchor="middle"
                        className="category-x-label"
                      >
                        {line}
                      </text>
                    ))}

                    <g
                      className="chart-bar-group"
                      onMouseEnter={() => setHoveredItem(item)}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      {/* Diff Points on Top */}
                      {hasTh && item.diff && item.diff !== '-' && (
                        <text
                          x={centerX}
                          y={diffY}
                          textAnchor="middle"
                          className={`bar-top-rate ${item.isDiffPositive ? 'positive' : 'negative'}`}
                        >
                          {item.diff}
                        </text>
                      )}

                      {/* Red Bar (Primary) */}
                      {hasTh && (
                        <>
                          <rect
                            x={thBarX}
                            y={thY}
                            width={barWidth}
                            height={thHeight}
                            fill="#e11d48"
                            rx={1}
                            className={`bar-rect ${isHovered ? 'bar-highlight' : ''}`}
                          />
                          <text
                            x={thBarX + barWidth / 2}
                            y={thY - 5}
                            textAnchor="middle"
                            className="bar-val-primary"
                          >
                            {formatVal(val1)}%
                          </text>
                        </>
                      )}

                      {/* Gray Bar (Secondary) */}
                      {hasKh && (
                        <>
                          <rect
                            x={khBarX}
                            y={khY}
                            width={barWidth}
                            height={khHeight}
                            fill="#94a3b8"
                            rx={1}
                            className={`bar-rect ${isHovered ? 'bar-highlight' : ''}`}
                          />
                          <text
                            x={khBarX + barWidth / 2}
                            y={khY - 5}
                            textAnchor="middle"
                            className="bar-val-secondary"
                          >
                            {formatVal(val2)}%
                          </text>
                        </>
                      )}
                    </g>
                  </g>
                );
              })}

            {/* Empty State */}
            {isBlank && (
              <text
                x={chartLeft + (chartRight - chartLeft) / 2}
                y={chartTop + chartHeight / 2}
                textAnchor="middle"
                className="chart-empty-text"
              >
                Chưa có số liệu
              </text>
            )}
          </svg>

          {/* Hover Tooltip */}
          {hoveredItem && !isBlank && (
            <div className="month-subcard-tooltip">
              <div className="tooltip-item-title">{hoveredItem.name}</div>
              <div className="tooltip-stat-row">
                <span className="tooltip-dot red"></span>
                <span>{primaryLegend}:</span>
                <strong>
                  {hoveredItem.th !== undefined
                    ? formatVal(hoveredItem.th)
                    : formatVal(hoveredItem.thCurrent)}%
                </strong>
              </div>
              <div className="tooltip-stat-row">
                <span className="tooltip-dot gray"></span>
                <span>{secondaryLegend}:</span>
                <strong>
                  {hoveredItem.kh !== undefined
                    ? formatVal(hoveredItem.kh)
                    : hoveredItem.thPrev !== undefined
                    ? formatVal(hoveredItem.thPrev)
                    : hoveredItem.thLastYear !== undefined
                    ? formatVal(hoveredItem.thLastYear)
                    : formatVal(hoveredItem.khNext)}%
                </strong>
              </div>
              {hoveredItem.diff && hoveredItem.diff !== '-' && (
                <div className="tooltip-stat-row">
                  <span>Chênh lệch điểm %:</span>
                  <strong className={hoveredItem.isDiffPositive ? 'text-green' : 'text-red'}>
                    {hoveredItem.diff}
                  </strong>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ==============================================================================
// MAIN COMPONENT: PHÂN TÍCH THEO THÁNG
// ==============================================================================
export default function MonthComparisonChart({
  selectedYear = '2026',
  setSelectedYear,
  selectedMonth = 'Tháng 8',
  setSelectedMonth,
  visibleMap: externalVisibleMap,
  onVisibleMapChange
}) {
  const [hoveredItem1Val, setHoveredItem1Val] = useState(null);
  const [hoveredItem1Rat, setHoveredItem1Rat] = useState(null);
  const [hoveredItem2Val, setHoveredItem2Val] = useState(null);
  const [hoveredItem2Rat, setHoveredItem2Rat] = useState(null);
  const [hoveredItem3Val, setHoveredItem3Val] = useState(null);
  const [hoveredItem3Rat, setHoveredItem3Rat] = useState(null);
  const [hoveredItem4Val, setHoveredItem4Val] = useState(null);
  const [hoveredItem4Rat, setHoveredItem4Rat] = useState(null);

  // Visibility state for each subcard (Khu 1 and Khu 2 of Rows 1..4)
  const [internalVisibleMap, setInternalVisibleMap] = useState({
    r1_val: true,
    r1_rat: true,
    r2_val: true,
    r2_rat: true,
    r3_val: true,
    r3_rat: true,
    r4_val: true,
    r4_rat: true
  });

  const visibleMap = externalVisibleMap !== undefined ? externalVisibleMap : internalVisibleMap;
  const setVisibleMap = (updater) => {
    if (onVisibleMapChange) {
      if (typeof updater === 'function') {
        onVisibleMapChange(updater(visibleMap));
      } else {
        onVisibleMapChange(updater);
      }
    } else {
      setInternalVisibleMap(updater);
    }
  };

  const toggleSubcard = (key) => {
    setVisibleMap((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isAllVisible = Object.values(visibleMap).every(Boolean);

  const toggleAll = () => {
    const nextState = !isAllVisible;
    setVisibleMap({
      r1_val: nextState,
      r1_rat: nextState,
      r2_val: nextState,
      r2_rat: nextState,
      r3_val: nextState,
      r3_rat: nextState,
      r4_val: nextState,
      r4_rat: nextState
    });
  };

  // Month code: 'Tháng 8' -> 'T8'
  const monthNum = parseInt(selectedMonth.match(/\d+/)?.[0] || '8', 10);
  const shortMonth = `T${monthNum}`;

  // Previous month code: e.g. T7 for T8, or T12 for T1
  const prevMonthNum = monthNum === 1 ? 12 : monthNum - 1;
  const prevShortMonth = `T${prevMonthNum}`;
  const prevYear = monthNum === 1 ? (parseInt(selectedYear, 10) - 1).toString() : selectedYear;

  // Next month code: e.g. T9 for T8, or T1 for T12
  const nextMonthNum = monthNum === 12 ? 1 : monthNum + 1;
  const nextShortMonth = `T${nextMonthNum}`;
  const nextYear = monthNum === 12 ? (parseInt(selectedYear, 10) + 1).toString() : selectedYear;

  // Last year code: e.g. 2025 for 2026
  const lastYear = (parseInt(selectedYear, 10) - 1).toString();

  // Data for Row 1 (Month vs Plan)
  const currentPlanData = MONTHLY_PLAN_DATA[selectedMonth] || MONTHLY_PLAN_DATA['Tháng 8'];
  const chart1Values = currentPlanData.values;
  const chart1Ratios = currentPlanData.ratios;

  // Data for Row 2 (Month vs Previous Month)
  const currentPrevData = MONTH_PREV_DATA[selectedMonth] || MONTH_PREV_DATA['Tháng 8'];
  const chart2Values = currentPrevData.values;
  const chart2Ratios = currentPrevData.ratios;

  // Data for Row 3 (Month vs Last Year Same Period)
  const currentLastYearData = MONTH_LAST_YEAR_DATA[selectedMonth] || MONTH_LAST_YEAR_DATA['Tháng 8'];
  const chart3Values = currentLastYearData.values;
  const chart3Ratios = currentLastYearData.ratios;

  // Data for Row 4 (Month vs Next Month Plan)
  const currentNextPlanData = MONTH_NEXT_PLAN_DATA[selectedMonth] || MONTH_NEXT_PLAN_DATA['Tháng 8'];
  const chart4Values = currentNextPlanData.values;
  const chart4Ratios = currentNextPlanData.ratios;

  // Flag: Tháng 12 được giả định chưa có số liệu -> blank toàn bộ số liệu
  const isBlank = selectedMonth === 'Tháng 12' || Boolean(currentPlanData?.isBlank);

  return (
    <div className="month-charts-stack">
      {/* Top Filter Bar: View all toggle + Năm [ 2026 ⌄ ]   Tháng [ Tháng 8 ⌄ ] */}
      <div className="month-top-filter-bar">
        {/* Toggle All Button */}
        <button
          type="button"
          className={`chart-view-all-btn ${!isAllVisible ? 'is-collapsed' : ''}`}
          onClick={toggleAll}
          title={isAllVisible ? 'Thu gọn tất cả biểu đồ' : 'Mở rộng tất cả biểu đồ'}
          aria-label={isAllVisible ? 'Thu gọn tất cả biểu đồ' : 'Mở rộng tất cả biểu đồ'}
        >
          {isAllVisible ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        <div className="clean-filter-item">
          <span className="clean-filter-label">Năm</span>
          <div className="clean-select-wrapper">
            <select
              className="clean-filter-select"
              value={selectedYear}
              onChange={(e) => setSelectedYear && setSelectedYear(e.target.value)}
            >
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
            </select>
            <ChevronDown size={14} className="clean-select-chevron" />
          </div>
        </div>

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
      </div>

      {/* Blank State Alert for Month 12 */}
      {isBlank && (
        <div className="month-blank-alert">
          <span className="month-blank-dot"></span>
          <span>Tháng 12/{selectedYear} chưa có số liệu thực hiện &amp; kế hoạch (giả định chưa có số liệu)</span>
        </div>
      )}

      {/* ============================================================================== */}
      {/* HÀNG 1: KẾT QUẢ SO VỚI KẾ HOẠCH                                               */}
      {/* ============================================================================== */}
      <div className="month-row-grid">
        <MonthValueCard
          title={`Kết quả ${shortMonth}/${selectedYear} so với kế hoạch ${shortMonth}/${selectedYear}`}
          tag="Hàng 1 - Khu 1"
          primaryLegend={`TH ${shortMonth}`}
          secondaryLegend={`KH ${shortMonth}`}
          data={chart1Values}
          isBlank={isBlank}
          hoveredItem={hoveredItem1Val}
          setHoveredItem={setHoveredItem1Val}
          isVisible={visibleMap.r1_val}
          onToggle={() => toggleSubcard('r1_val')}
        />
        <MonthRatioCard
          title="Tỷ trọng (chênh lệch điểm %)"
          tag="Hàng 1 - Khu 2"
          primaryLegend={`TH ${shortMonth}`}
          secondaryLegend={`KH ${shortMonth}`}
          data={chart1Ratios}
          isBlank={isBlank}
          hoveredItem={hoveredItem1Rat}
          setHoveredItem={setHoveredItem1Rat}
          isVisible={visibleMap.r1_rat}
          onToggle={() => toggleSubcard('r1_rat')}
        />
      </div>

      {/* ============================================================================== */}
      {/* HÀNG 2: KẾT QUẢ SO VỚI THÁNG TRƯỚC                                            */}
      {/* ============================================================================== */}
      <div className="month-row-grid">
        <MonthValueCard
          title={`Kết quả ${shortMonth}/${selectedYear} so với ${prevShortMonth}/${prevYear}`}
          tag="Hàng 2 - Khu 1"
          primaryLegend={`TH ${shortMonth}`}
          secondaryLegend={`TH ${prevShortMonth}`}
          data={chart2Values}
          isBlank={isBlank}
          hoveredItem={hoveredItem2Val}
          setHoveredItem={setHoveredItem2Val}
          isVisible={visibleMap.r2_val}
          onToggle={() => toggleSubcard('r2_val')}
        />
        <MonthRatioCard
          title="Tỷ trọng (chênh lệch điểm %)"
          tag="Hàng 2 - Khu 2"
          primaryLegend={`TH ${shortMonth}`}
          secondaryLegend={`TH ${prevShortMonth}`}
          data={chart2Ratios}
          isBlank={isBlank}
          hoveredItem={hoveredItem2Rat}
          setHoveredItem={setHoveredItem2Rat}
          isVisible={visibleMap.r2_rat}
          onToggle={() => toggleSubcard('r2_rat')}
        />
      </div>

      {/* ============================================================================== */}
      {/* HÀNG 3: KẾT QUẢ SO VỚI CÙNG KỲ NĂM TRƯỚC                                      */}
      {/* ============================================================================== */}
      <div className="month-row-grid">
        <MonthValueCard
          title={`Kết quả ${shortMonth}/${selectedYear} so với cùng kỳ ${shortMonth}/${lastYear}`}
          tag="Hàng 3 - Khu 1"
          primaryLegend={`TH ${shortMonth}`}
          secondaryLegend={`TH ${shortMonth}/${lastYear}`}
          data={chart3Values}
          isBlank={isBlank}
          hoveredItem={hoveredItem3Val}
          setHoveredItem={setHoveredItem3Val}
          isVisible={visibleMap.r3_val}
          onToggle={() => toggleSubcard('r3_val')}
        />
        <MonthRatioCard
          title="Tỷ trọng (chênh lệch điểm %)"
          tag="Hàng 3 - Khu 2"
          primaryLegend={`TH ${shortMonth}`}
          secondaryLegend={`TH ${shortMonth}/${lastYear}`}
          data={chart3Ratios}
          isBlank={isBlank}
          hoveredItem={hoveredItem3Rat}
          setHoveredItem={setHoveredItem3Rat}
          isVisible={visibleMap.r3_rat}
          onToggle={() => toggleSubcard('r3_rat')}
        />
      </div>

      {/* ============================================================================== */}
      {/* HÀNG 4: KẾT QUẢ SO VỚI KẾ HOẠCH THÁNG SAU                                     */}
      {/* ============================================================================== */}
      <div className="month-row-grid">
        <MonthValueCard
          title={`Kết quả ${shortMonth}/${selectedYear} so với kế hoạch ${nextShortMonth}/${nextYear}`}
          tag="Hàng 4 - Khu 1"
          primaryLegend={`TH ${shortMonth}`}
          secondaryLegend={`KH ${nextShortMonth}`}
          data={chart4Values}
          isBlank={isBlank}
          hoveredItem={hoveredItem4Val}
          setHoveredItem={setHoveredItem4Val}
          isVisible={visibleMap.r4_val}
          onToggle={() => toggleSubcard('r4_val')}
        />
        <MonthRatioCard
          title="Tỷ trọng (chênh lệch điểm %)"
          tag="Hàng 4 - Khu 2"
          primaryLegend={`TH ${shortMonth}`}
          secondaryLegend={`KH ${nextShortMonth}`}
          data={chart4Ratios}
          isBlank={isBlank}
          hoveredItem={hoveredItem4Rat}
          setHoveredItem={setHoveredItem4Rat}
          isVisible={visibleMap.r4_rat}
          onToggle={() => toggleSubcard('r4_rat')}
        />
      </div>
    </div>
  );
}
