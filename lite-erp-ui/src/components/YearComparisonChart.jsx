import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import './MonthComparisonChart.css';
import {
  YEAR_CUMULATIVE_DATA,
  YEAR_PLAN_FULL_DATA,
  CUMULATIVE_MONTH_OPTIONS
} from '../data/revenueYearData';

// Helper to format numbers with comma as decimal separator
const formatVal = (val) => {
  if (val === null || val === undefined || val === '') return '';
  return val.toString().replace('.', ',');
};

// ==============================================================================
// SUBCARD 1: GIÁ TRỊ DOANH THU & LỢI NHUẬN - NĂM
// ==============================================================================
function YearValueCard({
  title,
  tag,
  primaryLegend,
  secondaryLegend,
  data,
  hoveredItem,
  setHoveredItem,
  isVisible = true,
  onToggle,
  maxVal = 3500,
  yTicks = [0, 500, 1000, 1500, 2000, 2500, 3000, 3500],
  rateLabel = '% Hoàn thành KH'
}) {
  const svgWidth = 540;
  const svgHeight = 280;
  const chartLeft = 55;
  const chartRight = 515;
  const chartTop = 32;
  const chartBottom = 222;
  const chartHeight = chartBottom - chartTop; // 190px

  const xCenters = data.length === 5
    ? [101, 193, 285, 377, 469]
    : [112, 226, 340, 454];
  const barWidth = data.length === 5 ? 13 : 14;
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
            <g transform="translate(435, 8)">
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
                <g key={`y-val-tick-${tick}`}>
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
              const centerX = xCenters[idx] || (chartLeft + (idx + 0.5) * (chartRight - chartLeft) / data.length);
              const thBarX = centerX - barWidth - barGap / 2;
              const khBarX = centerX + barGap / 2;

              const val1 = item.lk;
              const val2 = item.kh !== undefined ? item.kh : item.khYear;

              const hasTh = val1 !== null && val1 !== undefined && val1 !== '';
              const hasKh = val2 !== null && val2 !== undefined && val2 !== '';

              const thHeight = hasTh ? (val1 / maxVal) * chartHeight : 0;
              const khHeight = hasKh ? (val2 / maxVal) * chartHeight : 0;
              const thY = chartBottom - thHeight;
              const khY = chartBottom - khHeight;
              const rateY = (hasTh && hasKh ? Math.min(thY, khY) : (hasTh ? thY : khY)) - 18;
              const isHovered = hoveredItem?.id === item.id;

              return (
                <g key={`y-val-group-${item.id}`}>
                  {/* Category X Labels */}
                  {item.lines.map((line, lIdx) => (
                    <text
                      key={`y-val-lbl-${item.id}-${lIdx}`}
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

                    {/* Red Bar (Primary - LK) */}
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

                    {/* Gray Bar (Secondary - KH LK / KH năm) */}
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
                  {formatVal(hoveredItem.lk)}{' '}
                  {hoveredItem.unit || 'Triệu đồng'}
                </strong>
              </div>
              <div className="tooltip-stat-row">
                <span className="tooltip-dot gray"></span>
                <span>{secondaryLegend}:</span>
                <strong>
                  {formatVal(hoveredItem.kh !== undefined ? hoveredItem.kh : hoveredItem.khYear)}{' '}
                  {hoveredItem.unit || 'Triệu đồng'}
                </strong>
              </div>
              {hoveredItem.rate && hoveredItem.rate !== '-' && (
                <div className="tooltip-stat-row">
                  <span>{rateLabel}:</span>
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
// SUBCARD 2: TỶ SUẤT / TỶ TRỌNG (CHÊNH LỆCH ĐIỂM %) - NĂM
// ==============================================================================
function YearRatioCard({
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
    : [210, 390];
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
            <g transform="translate(435, 8)">
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
                <g key={`y-ratio-tick-${tick}`}>
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
              const centerX = xCenters[idx] || (chartLeft + (idx + 0.5) * (chartRight - chartLeft) / data.length);
              const thBarX = centerX - barWidth - barGap / 2;
              const khBarX = centerX + barGap / 2;

              const val1 = item.lk;
              const val2 = item.kh !== undefined ? item.kh : item.khYear;

              const hasTh = val1 !== null && val1 !== undefined && val1 !== '';
              const hasKh = val2 !== null && val2 !== undefined && val2 !== '';

              const thHeight = hasTh ? (val1 / maxVal) * chartHeight : 0;
              const khHeight = hasKh ? (val2 / maxVal) * chartHeight : 0;
              const thY = chartBottom - thHeight;
              const khY = chartBottom - khHeight;
              const diffY = (hasTh && hasKh ? Math.min(thY, khY) : (hasTh ? thY : khY)) - 18;
              const isHovered = hoveredItem?.id === item.id;

              return (
                <g key={`y-ratio-group-${item.id}`}>
                  {/* Category X Labels */}
                  {item.lines.map((line, lIdx) => (
                    <text
                      key={`y-ratio-lbl-${item.id}-${lIdx}`}
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
                    {/* Diff Badge / Text on Top */}
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

                    {/* Red Bar (Primary - LK) */}
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

                    {/* Gray Bar (Secondary - KH LK / KH năm) */}
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
                <strong>{formatVal(hoveredItem.lk)}%</strong>
              </div>
              <div className="tooltip-stat-row">
                <span className="tooltip-dot gray"></span>
                <span>{secondaryLegend}:</span>
                <strong>{formatVal(hoveredItem.kh !== undefined ? hoveredItem.kh : hoveredItem.khYear)}%</strong>
              </div>
              {hoveredItem.diff && (
                <div className="tooltip-stat-row">
                  <span>Chênh lệch:</span>
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
// MAIN COMPONENT: PHÂN TÍCH THEO NĂM (LAYOUT 2 BIỂU ĐỒ / DÒNG)
// ==============================================================================
export default function YearComparisonChart({
  selectedYear = '2026',
  setSelectedYear,
  selectedCumulativeMonth = 'Lũy kế 8 tháng',
  setSelectedCumulativeMonth,
  visibleCards: propVisibleCards,
  onVisibleCardsChange
}) {
  // Hover states for Biểu đồ 10
  const [hoveredC10Val, setHoveredC10Val] = useState(null);
  const [hoveredC10Rat, setHoveredC10Rat] = useState(null);

  // Hover states for Biểu đồ 11
  const [hoveredC11Val, setHoveredC11Val] = useState(null);
  const [hoveredC11Rat, setHoveredC11Rat] = useState(null);

  // Independent collapse state for each subcard (4 subcards)
  const [internalVisibleCards, setInternalVisibleCards] = useState({
    c10Val: true,
    c10Rat: true,
    c11Val: true,
    c11Rat: true
  });

  const visibleCards = propVisibleCards || internalVisibleCards;
  const setVisibleCards = (updater) => {
    const nextVal = typeof updater === 'function' ? updater(visibleCards) : updater;
    if (onVisibleCardsChange) onVisibleCardsChange(nextVal);
    else setInternalVisibleCards(nextVal);
  };

  const toggleCard = (cardKey) => {
    setVisibleCards((prev) => ({
      ...prev,
      [cardKey]: !prev[cardKey]
    }));
  };

  const isAllVisible = Object.values(visibleCards).every(Boolean);
  const toggleAll = () => {
    const nextState = !isAllVisible;
    setVisibleCards({
      c10Val: nextState,
      c10Rat: nextState,
      c11Val: nextState,
      c11Rat: nextState
    });
  };

  // Data for Biểu đồ 10 (Lũy kế năm so với kế hoạch lũy kế năm)
  const currentYearData = YEAR_CUMULATIVE_DATA[selectedCumulativeMonth] || YEAR_CUMULATIVE_DATA['Lũy kế 8 tháng'];
  const shortCode = currentYearData.shortCode || '8T';
  const monthText = currentYearData.monthText || '8 tháng';
  const chart10Values = currentYearData.values;
  const chart10Ratios = currentYearData.ratios;

  // Data for Biểu đồ 11 (Lũy kế năm so với kế hoạch cả năm)
  const currentPlanFullData = YEAR_PLAN_FULL_DATA[selectedCumulativeMonth] || YEAR_PLAN_FULL_DATA['Lũy kế 8 tháng'];
  const chart11Values = currentPlanFullData.values;
  const chart11Ratios = currentPlanFullData.ratios;

  return (
    <div className="month-charts-stack">
      {/* Top Filter Bar: View all toggle + Năm [ 2026 ⌄ ] + Kỳ lũy kế [ Lũy kế 8 tháng ⌄ ] */}
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
          <span className="clean-filter-label">Kỳ lũy kế</span>
          <div className="clean-select-wrapper">
            <select
              className="clean-filter-select"
              value={selectedCumulativeMonth}
              onChange={(e) => setSelectedCumulativeMonth && setSelectedCumulativeMonth(e.target.value)}
            >
              {CUMULATIVE_MONTH_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <ChevronDown size={14} className="clean-select-chevron" />
          </div>
        </div>
      </div>

      {/* DÒNG 1 (2 BIỂU ĐỒ): BIỂU ĐỒ 10 - LŨY KẾ NĂM SO VỚI KẾ HOẠCH LŨY KẾ NĂM */}
      <div className="month-row-grid">
        <YearValueCard
          title={`Biểu đồ 10. Lũy kế năm ${selectedYear} so với kế hoạch lũy kế năm ${selectedYear}`}
          tag="Hàng 1 - Khu 1"
          primaryLegend={`LK ${shortCode}`}
          secondaryLegend={`KH LK ${shortCode}`}
          data={chart10Values}
          maxVal={3500}
          yTicks={[0, 500, 1000, 1500, 2000, 2500, 3000, 3500]}
          rateLabel={`% Hoàn thành KH LK ${shortCode}`}
          hoveredItem={hoveredC10Val}
          setHoveredItem={setHoveredC10Val}
          isVisible={visibleCards.c10Val}
          onToggle={() => toggleCard('c10Val')}
        />

        <YearRatioCard
          title="Tỷ suất / tỷ trọng (chênh lệch điểm %)"
          tag="Hàng 1 - Khu 2"
          primaryLegend={`LK ${shortCode}`}
          secondaryLegend={`KH LK ${shortCode}`}
          data={chart10Ratios}
          maxVal={100}
          yTicks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
          hoveredItem={hoveredC10Rat}
          setHoveredItem={setHoveredC10Rat}
          isVisible={visibleCards.c10Rat}
          onToggle={() => toggleCard('c10Rat')}
        />
      </div>

      {/* DÒNG 2 (2 BIỂU ĐỒ): BIỂU ĐỒ 11 - LŨY KẾ NĂM SO VỚI KẾ HOẠCH CẢ NĂM */}
      <div className="month-row-grid" style={{ marginTop: '16px' }}>
        <YearValueCard
          title={`Biểu đồ 11. Lũy kế năm ${selectedYear} so với kế hoạch cả năm ${selectedYear}`}
          tag="Hàng 2 - Khu 1"
          primaryLegend={`LK ${shortCode}`}
          secondaryLegend="KH năm"
          data={chart11Values}
          maxVal={6000}
          yTicks={[0, 1000, 2000, 3000, 4000, 5000, 6000]}
          rateLabel="% Hoàn thành KH năm"
          hoveredItem={hoveredC11Val}
          setHoveredItem={setHoveredC11Val}
          isVisible={visibleCards.c11Val}
          onToggle={() => toggleCard('c11Val')}
        />

        <YearRatioCard
          title="Tỷ suất / tỷ trọng (chênh lệch điểm %)"
          tag="Hàng 2 - Khu 2"
          primaryLegend={`LK ${shortCode}`}
          secondaryLegend="KH năm"
          data={chart11Ratios}
          maxVal={80}
          yTicks={[0, 10, 20, 30, 40, 50, 60, 70, 80]}
          hoveredItem={hoveredC11Rat}
          setHoveredItem={setHoveredC11Rat}
          isVisible={visibleCards.c11Rat}
          onToggle={() => toggleCard('c11Rat')}
        />
      </div>
    </div>
  );
}

