import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import './MonthComparisonChart.css';

import {
  QUARTER_OPTIONS,
  QUARTER_CUMULATIVE_DATA,
  QUARTER_ESTIMATE_DATA,
  QUARTER_PREV_DATA,
  QUARTER_SAME_PERIOD_DATA
} from '../data/revenueQuarterData';

// Helper to format numbers with comma as decimal separator
const formatVal = (val) => {
  if (val === null || val === undefined || val === '') return '';
  return val.toString().replace('.', ',');
};

// ==============================================================================
// SUBCARD KHU 1: GIÁ TRỊ (4-5 NHÓM DOANH THU) - QUÝ
// ==============================================================================
function QuarterValueCard({
  title,
  tag,
  primaryLegend,
  secondaryLegend,
  data,
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
  const maxVal = 1400;
  const yTicks = [0, 200, 400, 600, 800, 1000, 1200, 1400];
  const xCenters = data.length === 5
    ? [101, 193, 285, 377, 469]
    : (data.length === 4
      ? [112, 226, 340, 454]
      : data.map((_, i) => chartLeft + (chartRight - chartLeft) * ((i + 0.5) / data.length)));
  const barWidth = 14;
  const barGap = 2;
  const legendX = (primaryLegend.length > 8 || secondaryLegend.length > 8) ? 412 : 445;

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
            <g transform={`translate(${legendX}, 8)`}>
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
                <g key={`q-val-tick-${tick}`}>
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
            {data.map((item, idx) => {
              const centerX = xCenters[idx];
              const thBarX = centerX - barWidth - barGap / 2;
              const khBarX = centerX + barGap / 2;

              // Normalized values for Quarter
              const val1 = item.lk !== undefined ? item.lk : item.uoc;
              const val2 = item.kh !== undefined ? item.kh : (item.thPrev !== undefined ? item.thPrev : item.thSamePeriod);

              const hasTh = val1 !== null && val1 !== undefined && val1 !== '';
              const hasKh = val2 !== null && val2 !== undefined && val2 !== '';

              const thHeight = hasTh ? (val1 / maxVal) * chartHeight : 0;
              const khHeight = hasKh ? (val2 / maxVal) * chartHeight : 0;
              const thY = chartBottom - thHeight;
              const khY = chartBottom - khHeight;
              const rateY = (hasTh && hasKh ? Math.min(thY, khY) : (hasTh ? thY : khY)) - 18;
              const isHovered = hoveredItem?.id === item.id;

              return (
                <g key={`q-val-group-${item.id}`}>
                  {/* Category X Labels */}
                  {item.lines.map((line, lIdx) => (
                    <text
                      key={`q-val-lbl-${item.id}-${lIdx}`}
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
          </svg>

          {/* Hover Tooltip */}
          {hoveredItem && (
            <div className="month-subcard-tooltip">
              <div className="tooltip-item-title">{hoveredItem.name}</div>
              <div className="tooltip-stat-row">
                <span className="tooltip-dot red"></span>
                <span>{primaryLegend}:</span>
                <strong>
                  {formatVal(hoveredItem.lk !== undefined ? hoveredItem.lk : hoveredItem.uoc)}{' '}
                  {hoveredItem.unit || 'Triệu đồng'}
                </strong>
              </div>
              <div className="tooltip-stat-row">
                <span className="tooltip-dot gray"></span>
                <span>{secondaryLegend}:</span>
                <strong>
                  {formatVal(hoveredItem.kh !== undefined ? hoveredItem.kh : (hoveredItem.thPrev !== undefined ? hoveredItem.thPrev : hoveredItem.thSamePeriod))}{' '}
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
// SUBCARD KHU 2: TỶ SUẤT / TỶ TRỌNG (CHÊNH LỆCH ĐIỂM %) - QUÝ
// ==============================================================================
function QuarterRatioCard({
  title,
  tag,
  primaryLegend,
  secondaryLegend,
  data,
  hoveredItem,
  setHoveredItem,
  isVisible = true,
  onToggle,
  maxVal = 100,
  yTicks = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
}) {
  const svgWidth = 540;
  const svgHeight = 280;
  const chartLeft = 55;
  const chartRight = 515;
  const chartTop = 32;
  const chartBottom = 222;
  const chartHeight = chartBottom - chartTop; // 190px
  const xCenters = data.length === 3
    ? [132, 285, 438]
    : (data.length === 2
      ? [210, 390]
      : data.map((_, i) => chartLeft + (chartRight - chartLeft) * ((i + 0.5) / data.length)));
  const barWidth = 15;
  const barGap = 2;
  const legendX = (primaryLegend.length > 8 || secondaryLegend.length > 8) ? 412 : 445;

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
            <g transform={`translate(${legendX}, 8)`}>
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
                <g key={`q-rat-tick-${tick}`}>
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
            {data.map((item, idx) => {
              const centerX = xCenters[idx];
              const thBarX = centerX - barWidth - barGap / 2;
              const khBarX = centerX + barGap / 2;

              // Normalized values for Quarter ratios
              const val1 = item.lk !== undefined ? item.lk : item.uoc;
              const val2 = item.kh !== undefined ? item.kh : (item.thPrev !== undefined ? item.thPrev : item.thSamePeriod);

              const hasTh = val1 !== null && val1 !== undefined && val1 !== '';
              const hasKh = val2 !== null && val2 !== undefined && val2 !== '';

              const thHeight = hasTh ? (val1 / maxVal) * chartHeight : 0;
              const khHeight = hasKh ? (val2 / maxVal) * chartHeight : 0;
              const thY = chartBottom - thHeight;
              const khY = chartBottom - khHeight;
              const diffY = (hasTh && hasKh ? Math.min(thY, khY) : (hasTh ? thY : khY)) - 18;
              const isHovered = hoveredItem?.id === item.id;

              return (
                <g key={`q-rat-group-${item.id}`}>
                  {/* Category X Labels */}
                  {item.lines.map((line, lIdx) => (
                    <text
                      key={`q-rat-lbl-${item.id}-${lIdx}`}
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
          </svg>

          {/* Hover Tooltip */}
          {hoveredItem && (
            <div className="month-subcard-tooltip">
              <div className="tooltip-item-title">{hoveredItem.name}</div>
              <div className="tooltip-stat-row">
                <span className="tooltip-dot red"></span>
                <span>{primaryLegend}:</span>
                <strong>
                  {formatVal(hoveredItem.lk !== undefined ? hoveredItem.lk : hoveredItem.uoc)}%
                </strong>
              </div>
              <div className="tooltip-stat-row">
                <span className="tooltip-dot gray"></span>
                <span>{secondaryLegend}:</span>
                <strong>
                  {formatVal(hoveredItem.kh !== undefined ? hoveredItem.kh : (hoveredItem.thPrev !== undefined ? hoveredItem.thPrev : hoveredItem.thSamePeriod))}%
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
// MAIN COMPONENT: PHÂN TÍCH THEO QUÝ
// ==============================================================================
export default function QuarterComparisonChart({
  selectedYear = '2026',
  setSelectedYear,
  selectedQuarter = 'Quý III',
  setSelectedQuarter,
  visibleMap: propVisibleMap,
  onVisibleMapChange
}) {
  const [hoveredItem5Val, setHoveredItem5Val] = useState(null);
  const [hoveredItem5Rat, setHoveredItem5Rat] = useState(null);
  const [hoveredItem6Val, setHoveredItem6Val] = useState(null);
  const [hoveredItem6Rat, setHoveredItem6Rat] = useState(null);
  const [hoveredItem7Val, setHoveredItem7Val] = useState(null);
  const [hoveredItem7Rat, setHoveredItem7Rat] = useState(null);
  const [hoveredItem8Val, setHoveredItem8Val] = useState(null);
  const [hoveredItem8Rat, setHoveredItem8Rat] = useState(null);

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

  const visibleMap = propVisibleMap || internalVisibleMap;
  const setVisibleMap = (updater) => {
    const nextVal = typeof updater === 'function' ? updater(visibleMap) : updater;
    if (onVisibleMapChange) onVisibleMapChange(nextVal);
    else setInternalVisibleMap(nextVal);
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

  // Data for Row 1 (Biểu đồ 5: Lũy kế Quý so với kế hoạch Quý)
  const quarterData = QUARTER_CUMULATIVE_DATA[selectedQuarter] || QUARTER_CUMULATIVE_DATA['Quý III'];
  const quarterCode = quarterData.quarterCode || 'Q3';
  const chart5Values = quarterData.values;
  const chart5Ratios = quarterData.ratios;

  // Data for Row 2 (Biểu đồ 6: Ước kết quả Quý so với kế hoạch Quý)
  const quarterEstData = QUARTER_ESTIMATE_DATA[selectedQuarter] || QUARTER_ESTIMATE_DATA['Quý III'];
  const chart6Values = quarterEstData.values;
  const chart6Ratios = quarterEstData.ratios;

  // Data for Row 3 (Biểu đồ 7: Ước kết quả Quý so với kết quả Quý trước)
  const quarterPrevData = QUARTER_PREV_DATA[selectedQuarter] || QUARTER_PREV_DATA['Quý III'];
  const prevQuarterCode = quarterPrevData.prevQuarterCode || 'Q2';
  const prevQuarterName = quarterPrevData.prevQuarterName || 'Quý II';
  const prevYear = selectedQuarter === 'Quý I' ? (parseInt(selectedYear, 10) - 1).toString() : selectedYear;
  const chart7Values = quarterPrevData.values;
  const chart7Ratios = quarterPrevData.ratios;

  // Data for Row 4 (Biểu đồ 8: Ước kết quả Quý so với cùng kỳ năm trước)
  const prevYearNum = (parseInt(selectedYear, 10) - 1).toString();
  const quarterSamePeriodData = QUARTER_SAME_PERIOD_DATA[selectedQuarter] || QUARTER_SAME_PERIOD_DATA['Quý III'];
  const chart8Values = quarterSamePeriodData.values;
  const chart8Ratios = quarterSamePeriodData.ratios;

  return (
    <div className="month-charts-stack">
      {/* Top Filter Bar: View all toggle + Năm [ 2026 ⌄ ]   Quý [ Quý III ⌄ ] */}
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
      </div>

      {/* ============================================================================== */}
      {/* HÀNG 1: LŨY KẾ QUÝ SO VỚI KẾ HOẠCH (BIỂU ĐỒ 5)                                */}
      {/* ============================================================================== */}
      <div className="month-row-grid">
        <QuarterValueCard
          title={`Lũy kế ${selectedQuarter}/${selectedYear} so với kế hoạch ${selectedQuarter}/${selectedYear}`}
          tag="Hàng 1 - Khu 1"
          primaryLegend={`LK ${quarterCode}`}
          secondaryLegend={`KH ${quarterCode}`}
          data={chart5Values}
          hoveredItem={hoveredItem5Val}
          setHoveredItem={setHoveredItem5Val}
          isVisible={visibleMap.r1_val}
          onToggle={() => toggleSubcard('r1_val')}
        />
        <QuarterRatioCard
          title="Tỷ suất / tỷ trọng (chênh lệch điểm %)"
          tag="Hàng 1 - Khu 2"
          primaryLegend={`LK ${quarterCode}`}
          secondaryLegend={`KH ${quarterCode}`}
          data={chart5Ratios}
          hoveredItem={hoveredItem5Rat}
          setHoveredItem={setHoveredItem5Rat}
          isVisible={visibleMap.r1_rat}
          onToggle={() => toggleSubcard('r1_rat')}
        />
      </div>

      {/* ============================================================================== */}
      {/* HÀNG 2: ƯỚC KẾT QUẢ QUÝ SO VỚI KẾ HOẠCH (BIỂU ĐỒ 6)                           */}
      {/* ============================================================================== */}
      <div className="month-row-grid">
        <QuarterValueCard
          title={`Ước kết quả ${selectedQuarter}/${selectedYear} so với kế hoạch ${selectedQuarter}/${selectedYear}`}
          tag="Hàng 2 - Khu 1"
          primaryLegend={`Ước ${quarterCode}`}
          secondaryLegend={`KH ${quarterCode}`}
          data={chart6Values}
          hoveredItem={hoveredItem6Val}
          setHoveredItem={setHoveredItem6Val}
          isVisible={visibleMap.r2_val}
          onToggle={() => toggleSubcard('r2_val')}
        />
        <QuarterRatioCard
          title="Tỷ suất / tỷ trọng (chênh lệch điểm %)"
          tag="Hàng 2 - Khu 2"
          primaryLegend={`Ước ${quarterCode}`}
          secondaryLegend={`KH ${quarterCode}`}
          data={chart6Ratios}
          hoveredItem={hoveredItem6Rat}
          setHoveredItem={setHoveredItem6Rat}
          isVisible={visibleMap.r2_rat}
          onToggle={() => toggleSubcard('r2_rat')}
        />
      </div>

      {/* ============================================================================== */}
      {/* HÀNG 3: ƯỚC KẾT QUẢ QUÝ SO VỚI QUÝ TRƯỚC (BIỂU ĐỒ 7)                           */}
      {/* ============================================================================== */}
      <div className="month-row-grid">
        <QuarterValueCard
          title={`Ước kết quả ${selectedQuarter}/${selectedYear} so với kết quả ${prevQuarterName}/${prevYear}`}
          tag="Hàng 3 - Khu 1"
          primaryLegend={`Ước ${quarterCode}`}
          secondaryLegend={`TH ${prevQuarterCode}`}
          data={chart7Values}
          hoveredItem={hoveredItem7Val}
          setHoveredItem={setHoveredItem7Val}
          isVisible={visibleMap.r3_val}
          onToggle={() => toggleSubcard('r3_val')}
        />
        <QuarterRatioCard
          title="Tỷ suất / tỷ trọng (chênh lệch điểm %)"
          tag="Hàng 3 - Khu 2"
          primaryLegend={`Ước ${quarterCode}`}
          secondaryLegend={`TH ${prevQuarterCode}`}
          data={chart7Ratios}
          hoveredItem={hoveredItem7Rat}
          setHoveredItem={setHoveredItem7Rat}
          isVisible={visibleMap.r3_rat}
          onToggle={() => toggleSubcard('r3_rat')}
        />
      </div>

      {/* ============================================================================== */}
      {/* HÀNG 4: ƯỚC KẾT QUẢ QUÝ SO VỚI CÙNG KỲ NĂM TRƯỚC (BIỂU ĐỒ 8)                  */}
      {/* ============================================================================== */}
      <div className="month-row-grid">
        <QuarterValueCard
          title={`Ước kết quả ${selectedQuarter}/${selectedYear} so với cùng kỳ ${selectedQuarter}/${prevYearNum}`}
          tag="Hàng 4 - Khu 1"
          primaryLegend={`Ước ${quarterCode}/${selectedYear}`}
          secondaryLegend={`TH ${quarterCode}/${prevYearNum}`}
          data={chart8Values}
          hoveredItem={hoveredItem8Val}
          setHoveredItem={setHoveredItem8Val}
          isVisible={visibleMap.r4_val}
          onToggle={() => toggleSubcard('r4_val')}
        />
        <QuarterRatioCard
          title="Tỷ suất / tỷ trọng (chênh lệch điểm %)"
          tag="Hàng 4 - Khu 2"
          primaryLegend={`Ước ${quarterCode}/${selectedYear}`}
          secondaryLegend={`TH ${quarterCode}/${prevYearNum}`}
          data={chart8Ratios}
          hoveredItem={hoveredItem8Rat}
          setHoveredItem={setHoveredItem8Rat}
          isVisible={visibleMap.r4_rat}
          onToggle={() => toggleSubcard('r4_rat')}
          maxVal={80}
          yTicks={[0, 10, 20, 30, 40, 50, 60, 70, 80]}
        />
      </div>
    </div>
  );
}
