import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import './MonthComparisonChart.css';
import {
  YEAR_CUMULATIVE_DATA,
  YEAR_PLAN_FULL_DATA,
  YEAR_ESTIMATE_DATA,
  YEAR_ESTIMATE_PREV_DATA,
  CUMULATIVE_MONTH_OPTIONS
} from '../data/revenueYearData';
import { explainLegend, explainCategory } from '../utils/reportAbbreviations';
import MonthRatioDetailTable from './MonthRatioDetailTable';

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
  onOpenDetail,
  maxVal = 3500,
  yTicks = [0, 500, 1000, 1500, 2000, 2500, 3000, 3500],
  rateLabel = 'Tỷ lệ (%)',
  unitLabel = 'Triệu đồng',
  primaryColor = '#e11d48',
  secondaryColor = '#94a3b8'
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

  const isCompareOther = rateLabel === '% Delta';
  const isCompareNext = rateLabel === '% so KH kỳ sau';
  const isComparePlan = !isCompareOther && !isCompareNext;

  const displayPrimaryLegend = primaryLegend || (isCompareOther ? 'Ước TH' : 'TH');
  const displaySecondaryLegend = secondaryLegend || (isCompareOther ? 'TH' : 'KH');

  const col1Label = isComparePlan ? displaySecondaryLegend : displayPrimaryLegend;
  const col2Label = isComparePlan ? displayPrimaryLegend : displaySecondaryLegend;
  const diffLabel = isCompareOther ? 'Tăng/giảm' : '+/- so KH';

  let col1Val = null;
  let col2Val = null;
  let diffVal = null;
  let isCol1Primary = false;

  if (hoveredItem) {
    const val1 = hoveredItem.lk !== undefined ? hoveredItem.lk : hoveredItem.uoc;
    const val2 = hoveredItem.kh !== undefined
      ? hoveredItem.kh
      : hoveredItem.khYear !== undefined
      ? hoveredItem.khYear
      : hoveredItem.thPrev;

    if (isComparePlan) {
      col1Val = val2;
      col2Val = val1;
      diffVal = (val1 !== null && val1 !== undefined && val2 !== null && val2 !== undefined) ? (val1 - val2) : null;
      isCol1Primary = false;
    } else if (isCompareNext) {
      col1Val = val1;
      col2Val = val2;
      diffVal = (val1 !== null && val1 !== undefined && val2 !== null && val2 !== undefined) ? (val1 - val2) : null;
      isCol1Primary = true;
    } else {
      col1Val = val1;
      col2Val = val2;
      diffVal = (val1 !== null && val1 !== undefined && val2 !== null && val2 !== undefined) ? (val1 - val2) : null;
      isCol1Primary = true;
    }
  }

  const legendX = (displayPrimaryLegend?.length > 12 || displaySecondaryLegend?.length > 12) ? 365 : ((displayPrimaryLegend?.length > 8 || displaySecondaryLegend?.length > 8) ? 395 : 435);

  return (
    <div className="month-subcard">
      <div className="month-subcard-header">
        <h3 className="month-subcard-title" title={title}>{title}</h3>
        <div className="month-subcard-header-actions">
          <span className="month-subcard-tag">{tag}</span>
        </div>
      </div>

      <div className="month-subcard-svg-wrap">
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="month-subcard-svg">
            {/* Stacked Legend Top Right */}
            <g transform={`translate(${legendX}, 8)`} style={{ cursor: 'help' }}>
              <g>
                <title>{explainLegend(displayPrimaryLegend)}</title>
                <rect x={0} y={0} width={12} height={12} fill={primaryColor} rx={1} />
                <text x={16} y={10} className="legend-label">{displayPrimaryLegend}</text>
              </g>

              <g transform="translate(0, 16)">
                <title>{explainLegend(displaySecondaryLegend)}</title>
                <rect x={0} y={0} width={12} height={12} fill={secondaryColor} rx={1} />
                <text x={16} y={10} className="legend-label">{displaySecondaryLegend}</text>
              </g>
            </g>

            {/* Left Y Axis Title & Ticks */}
            <text
              x={16}
              y={chartTop + chartHeight / 2}
              transform={`rotate(-90, 16, ${chartTop + chartHeight / 2})`}
              textAnchor="middle"
              className="axis-title"
            >
              {unitLabel}
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

              const val1 = item.lk !== undefined ? item.lk : item.uoc;
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
                  <g style={{ cursor: 'help' }}>
                    <title>{explainCategory(item.name)}</title>
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
                  </g>

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

                    {/* Primary Bar */}
                    {hasTh && (
                      <>
                        <rect
                          x={thBarX}
                          y={thY}
                          width={barWidth}
                          height={thHeight}
                          fill={primaryColor}
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

                    {/* Secondary Bar */}
                    {hasKh && (
                      <>
                        <rect
                          x={khBarX}
                          y={khY}
                          width={barWidth}
                          height={khHeight}
                          fill={secondaryColor}
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
                <span className="tooltip-dot" style={{ backgroundColor: isCol1Primary ? primaryColor : secondaryColor }}></span>
                <span>{col1Label}:</span>
                <strong>
                  {col1Val !== null && col1Val !== undefined ? formatVal(col1Val) : '-'}{' '}
                  {hoveredItem.unit || unitLabel}
                </strong>
              </div>
              <div className="tooltip-stat-row">
                <span className="tooltip-dot" style={{ backgroundColor: isCol1Primary ? secondaryColor : primaryColor }}></span>
                <span>{col2Label}:</span>
                <strong>
                  {col2Val !== null && col2Val !== undefined ? formatVal(col2Val) : '-'}{' '}
                  {hoveredItem.unit || unitLabel}
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
              {(() => {
                const deltaNum = (col1Val !== null && col1Val !== undefined && col2Val !== null && col2Val !== undefined && Number(col2Val) > 0)
                  ? ((Number(col1Val) - Number(col2Val)) / Number(col2Val) * 100)
                  : null;
                return (
                  <div className="tooltip-stat-row" style={{ borderTop: '1px dashed #e2e8f0', paddingTop: '4px', marginTop: '4px' }}>
                    <span>% Delta:</span>
                    <strong style={{ color: deltaNum !== null ? (deltaNum >= 0 ? '#16a34a' : '#dc2626') : '#64748b' }}>
                      {deltaNum !== null ? `${deltaNum >= 0 ? '+' : ''}${deltaNum.toFixed(1).replace('.', ',')}%` : '-'}
                    </strong>
                  </div>
                );
              })()}
            </div>
          )}
        </div>

      {onOpenDetail && (
        <div className="subcard-bottom-bar">
          <button
            type="button"
            className="subcard-detail-action-btn"
            title="Xem chi tiết"
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetail();
            }}
          >
            <span>Xem chi tiết</span>
            <ArrowRight size={14} />
          </button>
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
  tooltipPrimaryLabel,
  tooltipSecondaryLabel,
  data,
  hoveredItem,
  setHoveredItem,
  isVisible = true,
  onToggle,
  onOpenDetail,
  maxVal = 100,
  yTicks = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
  primaryColor = '#e11d48',
  secondaryColor = '#94a3b8'
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
  const legendX = (primaryLegend?.length > 12 || secondaryLegend?.length > 12) ? 365 : ((primaryLegend?.length > 8 || secondaryLegend?.length > 8) ? 395 : 435);

  return (
    <div className="month-subcard">
      <div className="month-subcard-header">
        <h3 className="month-subcard-title" title={title}>{title}</h3>
        <div className="month-subcard-header-actions">
          <span className="month-subcard-tag">{tag}</span>
        </div>
      </div>

      <div className="month-subcard-svg-wrap">
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="month-subcard-svg">
            {/* Stacked Legend Top Right */}
            <g transform={`translate(${legendX}, 8)`} style={{ cursor: 'help' }}>
              <g>
                <title>{explainLegend(primaryLegend)}</title>
                <rect x={0} y={0} width={12} height={12} fill={primaryColor} rx={1} />
                <text x={16} y={10} className="legend-label">{primaryLegend}</text>
              </g>

              <g transform="translate(0, 16)">
                <title>{explainLegend(secondaryLegend)}</title>
                <rect x={0} y={0} width={12} height={12} fill={secondaryColor} rx={1} />
                <text x={16} y={10} className="legend-label">{secondaryLegend}</text>
              </g>
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

              const val1 = item.lk !== undefined ? item.lk : item.uoc;
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
                  <g style={{ cursor: 'help' }}>
                    <title>{explainCategory(item.name)}</title>
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
                  </g>

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

                    {/* Primary Bar */}
                    {hasTh && (
                      <>
                        <rect
                          x={thBarX}
                          y={thY}
                          width={barWidth}
                          height={thHeight}
                          fill={primaryColor}
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

                    {/* Secondary Bar */}
                    {hasKh && (
                      <>
                        <rect
                          x={khBarX}
                          y={khY}
                          width={barWidth}
                          height={khHeight}
                          fill={secondaryColor}
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
          {hoveredItem && (() => {
            const rawLbl1 = tooltipPrimaryLabel || (primaryLegend.includes('/') ? primaryLegend : `TH ${primaryLegend}`);
            const rawLbl2 = tooltipSecondaryLabel || (secondaryLegend.includes('/') ? secondaryLegend : (secondaryLegend === 'KH' ? 'KH' : secondaryLegend));
            const primaryLabel = rawLbl1.endsWith(':') ? rawLbl1 : `${rawLbl1}:`;
            const secondaryLabel = rawLbl2.endsWith(':') ? rawLbl2 : `${rawLbl2}:`;

            const val1 = hoveredItem.lk !== undefined ? hoveredItem.lk : hoveredItem.uoc;
            const val2 = hoveredItem.kh !== undefined
              ? hoveredItem.kh
              : (hoveredItem.khYear !== undefined
                ? hoveredItem.khYear
                : (hoveredItem.thLastYear !== undefined
                  ? hoveredItem.thLastYear
                  : hoveredItem.thPrev));

            const formatPercent = (val) => {
              if (val === null || val === undefined || val === '') return '-';
              const num = Number(val);
              if (isNaN(num)) return `${val}%`;
              return `${num.toFixed(1).replace('.', ',')}%`;
            };

            const formatDiff = (diffVal, v1, v2) => {
              if (diffVal !== null && diffVal !== undefined && diffVal !== '' && diffVal !== '-') {
                const str = String(diffVal).trim();
                if (str.includes('đ.%')) return str;
                return `${str} đ.%`;
              }
              if (v1 !== null && v1 !== undefined && v2 !== null && v2 !== undefined) {
                const d = Number(v1) - Number(v2);
                if (!isNaN(d)) {
                  const sign = d > 0 ? '+' : '';
                  return `${sign}${d.toFixed(1).replace('.', ',')} đ.%`;
                }
              }
              return '-';
            };

            const diffDisplay = formatDiff(hoveredItem.diff, val1, val2);
            const isPositive = hoveredItem.isDiffPositive !== undefined
              ? Boolean(hoveredItem.isDiffPositive)
              : (val1 !== null && val1 !== undefined && val2 !== null && val2 !== undefined
                  ? Number(val1) >= Number(val2)
                  : true);

            const deltaNum = (val1 !== null && val1 !== undefined && val2 !== null && val2 !== undefined && Number(val2) > 0)
              ? ((Number(val1) - Number(val2)) / Number(val2) * 100)
              : null;

            return (
              <div className="ratio-subcard-tooltip">
                <div className="ratio-tooltip-header">
                  <div className="ratio-tooltip-title">{hoveredItem.name}</div>
                </div>
                <div className="ratio-tooltip-row">
                  <span className="ratio-tooltip-square" style={{ backgroundColor: primaryColor }}></span>
                  <span className="ratio-tooltip-label">{primaryLabel}</span>
                  <strong className="ratio-tooltip-val">
                    {formatPercent(val1)}
                  </strong>
                </div>
                <div className="ratio-tooltip-row">
                  <span className="ratio-tooltip-square" style={{ backgroundColor: secondaryColor }}></span>
                  <span className="ratio-tooltip-label">{secondaryLabel}</span>
                  <strong className="ratio-tooltip-val">
                    {formatPercent(val2)}
                  </strong>
                </div>
                {diffDisplay && diffDisplay !== '-' && (
                  <div className="ratio-tooltip-row" style={{ borderTop: '1px dashed #e2e8f0', paddingTop: '4px', marginTop: '4px' }}>
                    <span className="ratio-tooltip-label">Chênh lệch:</span>
                    <strong className={`ratio-tooltip-val ${isPositive ? 'diff-positive' : 'diff-negative'}`}>
                      {diffDisplay}
                    </strong>
                  </div>
                )}
                <div className="ratio-tooltip-row" style={!diffDisplay || diffDisplay === '-' ? { borderTop: '1px dashed #e2e8f0', paddingTop: '4px', marginTop: '4px' } : {}}>
                  <span className="ratio-tooltip-label">% Delta:</span>
                  <strong className={`ratio-tooltip-val ${deltaNum !== null ? (deltaNum >= 0 ? 'diff-positive' : 'diff-negative') : ''}`} style={deltaNum === null ? { color: '#64748b' } : {}}>
                    {deltaNum !== null ? `${deltaNum >= 0 ? '+' : ''}${deltaNum.toFixed(1).replace('.', ',')}%` : '-'}
                  </strong>
                </div>
              </div>
            );
          })()}
        </div>

      {onOpenDetail && (
        <div className="subcard-bottom-bar">
          <button
            type="button"
            className="subcard-detail-action-btn"
            title="Xem chi tiết"
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetail && onOpenDetail();
            }}
          >
            <span>Xem chi tiết</span>
            <ArrowRight size={14} />
          </button>
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
  onVisibleCardsChange,
  onOpenDetail
}) {
  // Hover states for Biểu đồ 10
  const [hoveredC10Val, setHoveredC10Val] = useState(null);
  const [hoveredC10Rat, setHoveredC10Rat] = useState(null);

  // Hover states for Biểu đồ 11
  const [hoveredC11Val, setHoveredC11Val] = useState(null);
  const [hoveredC11Rat, setHoveredC11Rat] = useState(null);

  // Hover states for Biểu đồ 12
  const [hoveredC12Val, setHoveredC12Val] = useState(null);
  const [hoveredC12Rat, setHoveredC12Rat] = useState(null);

  // Hover states for Biểu đồ 13
  const [hoveredC13Val, setHoveredC13Val] = useState(null);
  const [hoveredC13Rat, setHoveredC13Rat] = useState(null);

  // Independent collapse state for each subcard (8 subcards)
  const [internalVisibleCards, setInternalVisibleCards] = useState({
    c10Val: true,
    c10Rat: true,
    c11Val: true,
    c11Rat: true,
    c12Val: true,
    c12Rat: true,
    c13Val: true,
    c13Rat: true
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
      c11Rat: nextState,
      c12Val: nextState,
      c12Rat: nextState,
      c13Val: nextState,
      c13Rat: nextState
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

  // Data for Biểu đồ 12 (Ước kết quả năm so với kế hoạch năm)
  const currentEstimateData = YEAR_ESTIMATE_DATA[selectedCumulativeMonth] || YEAR_ESTIMATE_DATA['Lũy kế 8 tháng'];
  const chart12Values = currentEstimateData.values;
  const chart12Ratios = currentEstimateData.ratios;

  // Data for Biểu đồ 13 (Ước kết quả năm so với kết quả năm trước)
  const prevYear = (parseInt(selectedYear, 10) - 1).toString();
  const currentEstimatePrevData = YEAR_ESTIMATE_PREV_DATA[selectedCumulativeMonth] || YEAR_ESTIMATE_PREV_DATA['Lũy kế 8 tháng'];
  const chart13Values = currentEstimatePrevData.values;
  const chart13Ratios = currentEstimatePrevData.ratios;

  return (
    <div className="month-charts-stack">
      {/* Top Filter Bar: Năm [ 2026 ⌄ ] + Kỳ lũy kế [ Lũy kế 8 tháng ⌄ ] */}
      <div className="month-top-filter-bar">
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

      </div>

      {/* DÒNG 1 (2 BIỂU ĐỒ): BIỂU ĐỒ 10 - LŨY KẾ NĂM SO VỚI KẾ HOẠCH LŨY KẾ NĂM */}
      <div className="month-row-grid">
        <YearValueCard
          title={`Lũy kế TH ${shortCode} năm ${selectedYear} so với luỹ kế KH ${shortCode} năm ${selectedYear}`}
          tag="Hàng 1 - Khu 1"
          primaryLegend={`TH LK ${shortCode}/${selectedYear}`}
          secondaryLegend={`KH LK ${shortCode}/${selectedYear}`}
          data={chart10Values}
          maxVal={3500}
          yTicks={[0, 500, 1000, 1500, 2000, 2500, 3000, 3500]}
          rateLabel="% HTKH"
          hoveredItem={hoveredC10Val}
          setHoveredItem={setHoveredC10Val}
          isVisible={visibleCards.c10Val}
          onToggle={() => toggleCard('c10Val')}
          onOpenDetail={() => onOpenDetail && onOpenDetail({
            chartKey: 'chart10_val',
            chartTitle: `Lũy kế TH ${shortCode} năm ${selectedYear} so với luỹ kế KH ${shortCode} năm ${selectedYear}`
          })}
        />

        <YearRatioCard
          title={`Tỷ suất / tỷ trọng lũy kế TH ${shortCode} năm ${selectedYear} so với luỹ kế KH ${shortCode} năm ${selectedYear}`}
          tag="Hàng 1 - Khu 2"
          primaryLegend={`TH LK ${shortCode}/${selectedYear}`}
          secondaryLegend={`KH LK ${shortCode}/${selectedYear}`}
          tooltipPrimaryLabel={`TH LK ${shortCode}/${selectedYear}`}
          tooltipSecondaryLabel={`KH LK ${shortCode}/${selectedYear}`}
          data={chart10Ratios}
          maxVal={100}
          yTicks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
          hoveredItem={hoveredC10Rat}
          setHoveredItem={setHoveredC10Rat}
          isVisible={visibleCards.c10Rat}
          onToggle={() => toggleCard('c10Rat')}
          onOpenDetail={() => onOpenDetail && onOpenDetail({
            chartKey: 'chart10_rat',
            chartTitle: `Tỷ suất / tỷ trọng lũy kế TH ${shortCode} năm ${selectedYear} so với luỹ kế KH ${shortCode} năm ${selectedYear}`
          })}
        />
      </div>

      {/* DÒNG 2 (2 BIỂU ĐỒ): BIỂU ĐỒ 11 - LŨY KẾ NĂM SO VỚI KẾ HOẠCH CẢ NĂM */}
      <div className="month-row-grid" style={{ marginTop: '16px' }}>
        <YearValueCard
          title={`Lũy kế TH năm ${selectedYear} so với KH cả năm ${selectedYear}`}
          tag="Hàng 2 - Khu 1"
          primaryLegend={`TH LK ${shortCode}/${selectedYear}`}
          secondaryLegend={`KH ${selectedYear}`}
          data={chart11Values}
          maxVal={6000}
          yTicks={[0, 1000, 2000, 3000, 4000, 5000, 6000]}
          rateLabel="% HTKH"
          hoveredItem={hoveredC11Val}
          setHoveredItem={setHoveredC11Val}
          isVisible={visibleCards.c11Val}
          onToggle={() => toggleCard('c11Val')}
          onOpenDetail={() => onOpenDetail && onOpenDetail({
            chartKey: 'chart11_val',
            chartTitle: `Lũy kế TH năm ${selectedYear} so với KH cả năm ${selectedYear}`
          })}
        />

        <YearRatioCard
          title={`Tỷ suất / tỷ trọng lũy kế TH năm ${selectedYear} so với KH cả năm ${selectedYear}`}
          tag="Hàng 2 - Khu 2"
          primaryLegend={`TH LK ${shortCode}/${selectedYear}`}
          secondaryLegend={`KH ${selectedYear}`}
          tooltipPrimaryLabel={`TH LK ${shortCode}/${selectedYear}`}
          tooltipSecondaryLabel={`KH ${selectedYear}`}
          data={chart11Ratios}
          maxVal={80}
          yTicks={[0, 10, 20, 30, 40, 50, 60, 70, 80]}
          hoveredItem={hoveredC11Rat}
          setHoveredItem={setHoveredC11Rat}
          isVisible={visibleCards.c11Rat}
          onToggle={() => toggleCard('c11Rat')}
          onOpenDetail={() => onOpenDetail && onOpenDetail({
            chartKey: 'chart11_rat',
            chartTitle: `Tỷ suất / tỷ trọng lũy kế TH năm ${selectedYear} so với KH cả năm ${selectedYear}`
          })}
        />
      </div>

      {/* DÒNG 3 (2 BIỂU ĐỒ): BIỂU ĐỒ 12 - ƯỚC KẾT QUẢ NĂM SO VỚI KẾ HOẠCH NĂM */}
      <div className="month-row-grid" style={{ marginTop: '16px' }}>
        <YearValueCard
          title={`Ước kết quả năm ${selectedYear} so với kế hoạch năm ${selectedYear}`}
          tag="Hàng 3 - Khu 1"
          primaryLegend={`Ước TH ${selectedYear}`}
          secondaryLegend={`KH ${selectedYear}`}
          data={chart12Values}
          maxVal={6000}
          yTicks={[0, 1000, 2000, 3000, 4000, 5000, 6000]}
          unitLabel="Tỷ đồng"
          rateLabel="% HTKH"
          hoveredItem={hoveredC12Val}
          setHoveredItem={setHoveredC12Val}
          isVisible={visibleCards.c12Val}
          onToggle={() => toggleCard('c12Val')}
          onOpenDetail={() => onOpenDetail && onOpenDetail({
            chartKey: 'chart12_val',
            chartTitle: `Ước kết quả năm ${selectedYear} so với kế hoạch năm ${selectedYear}`
          })}
        />

        <YearRatioCard
          title={`Tỷ suất / tỷ trọng ước kết quả năm ${selectedYear} so với kế hoạch năm ${selectedYear}`}
          tag="Hàng 3 - Khu 2"
          primaryLegend={`Ước TH ${selectedYear}`}
          secondaryLegend={`KH ${selectedYear}`}
          tooltipPrimaryLabel={`Ước TH ${selectedYear}`}
          tooltipSecondaryLabel={`KH ${selectedYear}`}
          data={chart12Ratios}
          maxVal={80}
          yTicks={[0, 10, 20, 30, 40, 50, 60, 70, 80]}
          hoveredItem={hoveredC12Rat}
          setHoveredItem={setHoveredC12Rat}
          isVisible={visibleCards.c12Rat}
          onToggle={() => toggleCard('c12Rat')}
          onOpenDetail={() => onOpenDetail && onOpenDetail({
            chartKey: 'chart12_rat',
            chartTitle: `Tỷ suất / tỷ trọng ước kết quả năm ${selectedYear} so với kế hoạch năm ${selectedYear}`
          })}
        />
      </div>

      {/* DÒNG 4 (2 BIỂU ĐỒ): BIỂU ĐỒ 13 - ƯỚC KẾT QUẢ NĂM SO VỚI KẾT QUẢ NĂM TRƯỚC */}
      <div className="month-row-grid" style={{ marginTop: '16px' }}>
        <YearValueCard
          title={`Ước kết quả năm ${selectedYear} so với kết quả năm ${prevYear}`}
          tag="Hàng 4 - Khu 1"
          primaryLegend={`Ước TH ${selectedYear}`}
          secondaryLegend={`TH ${prevYear}`}
          data={chart13Values}
          maxVal={5000}
          yTicks={[0, 1000, 2000, 3000, 4000, 5000]}
          unitLabel="Tỷ đồng"
          rateLabel="% Delta"
          hoveredItem={hoveredC13Val}
          setHoveredItem={setHoveredC13Val}
          isVisible={visibleCards.c13Val}
          onToggle={() => toggleCard('c13Val')}
          onOpenDetail={() => onOpenDetail && onOpenDetail({
            chartKey: 'chart13_val',
            chartTitle: `Ước kết quả năm ${selectedYear} so với kết quả năm ${prevYear}`
          })}
        />

        <YearRatioCard
          title={`Tỷ suất / tỷ trọng ước kết quả năm ${selectedYear} so với kết quả năm ${prevYear}`}
          tag="Hàng 4 - Khu 2"
          primaryLegend={`Ước TH ${selectedYear}`}
          secondaryLegend={`TH ${prevYear}`}
          tooltipPrimaryLabel={`Ước TH ${selectedYear}`}
          tooltipSecondaryLabel={`TH ${prevYear}`}
          data={chart13Ratios}
          maxVal={80}
          yTicks={[0, 10, 20, 30, 40, 50, 60, 70, 80]}
          hoveredItem={hoveredC13Rat}
          setHoveredItem={setHoveredC13Rat}
          isVisible={visibleCards.c13Rat}
          onToggle={() => toggleCard('c13Rat')}
          onOpenDetail={() => onOpenDetail && onOpenDetail({
            chartKey: 'chart13_rat',
            chartTitle: `Tỷ suất / tỷ trọng ước kết quả năm ${selectedYear} so với kết quả năm ${prevYear}`
          })}
        />
      </div>

      {/* BẢNG PHÂN TÍCH TỶ SUẤT / TỶ TRỌNG NĂM */}
      <MonthRatioDetailTable
        branchId="year"
        selectedYear={selectedYear}
        selectedCumulativeMonth={selectedCumulativeMonth}
        activeChartKey="chart10_rat"
      />
    </div>
  );
}

