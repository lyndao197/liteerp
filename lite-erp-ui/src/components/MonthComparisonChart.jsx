import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import './MonthComparisonChart.css';

import {
  MONTH_OPTIONS,
  MONTHLY_PLAN_DATA,
  MONTH_PREV_DATA,
  MONTH_LAST_YEAR_DATA,
  MONTH_NEXT_PLAN_DATA
} from '../data/revenueMonthData';
import { explainLegend, explainCategory } from '../utils/reportAbbreviations';
import MonthRatioDetailTable from './MonthRatioDetailTable';

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
  onToggle,
  onOpenDetail,
  rateLabel = '% HTKH'
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
  const xCenters = data.length === 5
    ? [101, 193, 285, 377, 469]
    : [112, 226, 340, 454];
  const barWidth = data.length === 5 ? 13 : 14;
  const barGap = 2;

  const isCompareOther = rateLabel === '% Delta';
  const isCompareNext = rateLabel === '% so KH kỳ sau';
  const isComparePlan = !isCompareOther && !isCompareNext;

  const displayPrimaryLegend = primaryLegend || 'TH';
  const displaySecondaryLegend = secondaryLegend || (isCompareOther ? 'TH' : 'KH');

  const col1Label = isComparePlan ? displaySecondaryLegend : displayPrimaryLegend;
  const col2Label = isComparePlan ? displayPrimaryLegend : displaySecondaryLegend;
  const diffLabel = isCompareOther ? 'Tăng/giảm' : '+/- so KH';

  let col1Val = null;
  let col2Val = null;
  let diffVal = null;
  let isCol1Primary = false;

  if (hoveredItem) {
    const val1 = hoveredItem.th !== undefined ? hoveredItem.th : hoveredItem.thCurrent;
    const val2 = hoveredItem.kh !== undefined
      ? hoveredItem.kh
      : hoveredItem.thPrev !== undefined
      ? hoveredItem.thPrev
      : hoveredItem.thLastYear !== undefined
      ? hoveredItem.thLastYear
      : hoveredItem.khNext;

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

  const legendX = (displayPrimaryLegend.length > 12 || displaySecondaryLegend.length > 12) ? 370 : ((displayPrimaryLegend.length > 8 || displaySecondaryLegend.length > 8) ? 395 : 435);

  return (
    <div className="month-subcard">
      <div className="month-subcard-header">
        <h3 className="month-subcard-title">{title}</h3>
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
                <rect x={0} y={0} width={12} height={12} fill="#e11d48" rx={1} />
                <text x={16} y={10} className="legend-label">{displayPrimaryLegend}</text>
              </g>

              <g transform="translate(0, 16)">
                <title>{explainLegend(displaySecondaryLegend)}</title>
                <rect x={0} y={0} width={12} height={12} fill="#94a3b8" rx={1} />
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
                    <g style={{ cursor: 'help' }}>
                      <title>{explainCategory(item.name)}</title>
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
                <span className={`tooltip-dot ${isCol1Primary ? 'red' : 'gray'}`}></span>
                <span>{col1Label}:</span>
                <strong>
                  {col1Val !== null && col1Val !== undefined ? formatVal(col1Val) : '-'}{' '}
                  {hoveredItem.unit || 'Triệu đồng'}
                </strong>
              </div>
              <div className="tooltip-stat-row">
                <span className={`tooltip-dot ${isCol1Primary ? 'gray' : 'red'}`}></span>
                <span>{col2Label}:</span>
                <strong>
                  {col2Val !== null && col2Val !== undefined ? formatVal(col2Val) : '-'}{' '}
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
// SUBCARD KHU 2: TỶ TRỌNG (CHÊNH LỆCH ĐIỂM %)
// ==============================================================================
function MonthRatioCard({
  title,
  tag,
  primaryLegend,
  secondaryLegend,
  tooltipPrimaryLabel,
  tooltipSecondaryLabel,
  data,
  isBlank,
  hoveredItem,
  setHoveredItem,
  isVisible = true,
  onToggle,
  onOpenDetail
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
  const xCenters = data.length === 3
    ? [132, 285, 438]
    : [210, 390];
  const barWidth = data.length === 3 ? 14 : 15;
  const barGap = 2;

  const legendX = (primaryLegend.length > 12 || secondaryLegend.length > 12) ? 370 : ((primaryLegend.length > 8 || secondaryLegend.length > 8) ? 395 : 425);

  return (
    <div className="month-subcard">
      <div className="month-subcard-header">
        <h3 className="month-subcard-title">{title}</h3>
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
                <rect x={0} y={0} width={12} height={12} fill="#e11d48" rx={1} />
                <text x={16} y={10} className="legend-label">{primaryLegend}</text>
              </g>

              <g transform="translate(0, 16)">
                <title>{explainLegend(secondaryLegend)}</title>
                <rect x={0} y={0} width={12} height={12} fill="#94a3b8" rx={1} />
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
                    <g style={{ cursor: 'help' }}>
                      <title>{explainCategory(item.name)}</title>
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
                    </g>

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
          {hoveredItem && !isBlank && (() => {
            const rawLbl1 = tooltipPrimaryLabel || (primaryLegend.includes('/') ? primaryLegend : `TH ${primaryLegend}`);
            const rawLbl2 = tooltipSecondaryLabel || (secondaryLegend.includes('/') ? secondaryLegend : (secondaryLegend === 'KH' ? 'KH' : secondaryLegend));
            const primaryLabel = rawLbl1.endsWith(':') ? rawLbl1 : `${rawLbl1}:`;
            const secondaryLabel = rawLbl2.endsWith(':') ? rawLbl2 : `${rawLbl2}:`;

            const val1 = hoveredItem.th !== undefined ? hoveredItem.th : hoveredItem.thCurrent;
            const val2 = hoveredItem.kh !== undefined
              ? hoveredItem.kh
              : hoveredItem.thPrev !== undefined
              ? hoveredItem.thPrev
              : hoveredItem.thLastYear !== undefined
              ? hoveredItem.thLastYear
              : hoveredItem.khNext;

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
                  <span className="ratio-tooltip-square red"></span>
                  <span className="ratio-tooltip-label">{primaryLabel}</span>
                  <strong className="ratio-tooltip-val">
                    {formatPercent(val1)}
                  </strong>
                </div>
                <div className="ratio-tooltip-row">
                  <span className="ratio-tooltip-square gray"></span>
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
// MAIN COMPONENT: PHÂN TÍCH THEO THÁNG
// ==============================================================================
export default function MonthComparisonChart({
  selectedYear = '2026',
  setSelectedYear,
  selectedMonth = 'Tháng 8',
  setSelectedMonth,
  visibleMap: externalVisibleMap,
  onVisibleMapChange,
  onOpenDetail
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
      {/* Top Filter Bar: Năm [ 2026 ⌄ ]   Tháng [ Tháng 8 ⌄ ] */}
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
          primaryLegend={`TH ${shortMonth}/${selectedYear}`}
          secondaryLegend={`KH ${shortMonth}/${selectedYear}`}
          data={chart1Values}
          isBlank={isBlank}
          rateLabel="% HTKH"
          hoveredItem={hoveredItem1Val}
          setHoveredItem={setHoveredItem1Val}
          isVisible={visibleMap.r1_val}
          onToggle={() => toggleSubcard('r1_val')}
          onOpenDetail={() => onOpenDetail && onOpenDetail({ chartKey: 'chart1_val', chartTitle: `Kết quả ${shortMonth}/${selectedYear} so với kế hoạch ${shortMonth}/${selectedYear}` })}
        />
        <MonthRatioCard
          title={`Tỷ suất / tỷ trọng kết quả ${shortMonth}/${selectedYear} so với kế hoạch ${shortMonth}/${selectedYear}`}
          tag="Hàng 1 - Khu 2"
          primaryLegend={`TH ${shortMonth}/${selectedYear}`}
          secondaryLegend={`KH ${shortMonth}/${selectedYear}`}
          tooltipPrimaryLabel={`TH ${shortMonth}/${selectedYear}`}
          tooltipSecondaryLabel={`KH ${shortMonth}/${selectedYear}`}
          data={chart1Ratios}
          isBlank={isBlank}
          hoveredItem={hoveredItem1Rat}
          setHoveredItem={setHoveredItem1Rat}
          isVisible={visibleMap.r1_rat}
          onToggle={() => toggleSubcard('r1_rat')}
          onOpenDetail={() => onOpenDetail && onOpenDetail({
            chartKey: 'chart1_rat',
            chartTitle: `Tỷ suất / tỷ trọng kết quả ${shortMonth}/${selectedYear} so với kế hoạch ${shortMonth}/${selectedYear}`
          })}
        />
      </div>

      {/* ============================================================================== */}
      {/* HÀNG 2: KẾT QUẢ SO VỚI THÁNG TRƯỚC                                            */}
      {/* ============================================================================== */}
      <div className="month-row-grid">
        <MonthValueCard
          title={`Kết quả ${shortMonth}/${selectedYear} so với ${prevShortMonth}/${prevYear}`}
          tag="Hàng 2 - Khu 1"
          primaryLegend={`TH ${shortMonth}/${selectedYear}`}
          secondaryLegend={`TH ${prevShortMonth}/${prevYear}`}
          data={chart2Values}
          isBlank={isBlank}
          rateLabel="% Delta"
          hoveredItem={hoveredItem2Val}
          setHoveredItem={setHoveredItem2Val}
          isVisible={visibleMap.r2_val}
          onToggle={() => toggleSubcard('r2_val')}
          onOpenDetail={() => onOpenDetail && onOpenDetail({
            chartKey: 'chart2_val',
            chartTitle: `Kết quả ${shortMonth}/${selectedYear} so với ${prevShortMonth}/${prevYear}`
          })}
        />
        <MonthRatioCard
          title={`Tỷ suất / tỷ trọng kết quả ${shortMonth}/${selectedYear} so với ${prevShortMonth}/${prevYear}`}
          tag="Hàng 2 - Khu 2"
          primaryLegend={`TH ${shortMonth}/${selectedYear}`}
          secondaryLegend={`TH ${prevShortMonth}/${prevYear}`}
          tooltipPrimaryLabel={`TH ${shortMonth}/${selectedYear}`}
          tooltipSecondaryLabel={`TH ${prevShortMonth}/${prevYear}`}
          data={chart2Ratios}
          isBlank={isBlank}
          hoveredItem={hoveredItem2Rat}
          setHoveredItem={setHoveredItem2Rat}
          isVisible={visibleMap.r2_rat}
          onToggle={() => toggleSubcard('r2_rat')}
          onOpenDetail={() => onOpenDetail && onOpenDetail({
            chartKey: 'chart2_rat',
            chartTitle: `Tỷ suất / tỷ trọng kết quả ${shortMonth}/${selectedYear} so với ${prevShortMonth}/${prevYear}`
          })}
        />
      </div>

      {/* ============================================================================== */}
      {/* HÀNG 3: KẾT QUẢ SO VỚI CÙNG KỲ NĂM TRƯỚC                                      */}
      {/* ============================================================================== */}
      <div className="month-row-grid">
        <MonthValueCard
          title={`Kết quả ${shortMonth}/${selectedYear} so với cùng kỳ ${shortMonth}/${lastYear}`}
          tag="Hàng 3 - Khu 1"
          primaryLegend={`TH ${shortMonth}/${selectedYear}`}
          secondaryLegend={`TH ${shortMonth}/${lastYear}`}
          data={chart3Values}
          isBlank={isBlank}
          rateLabel="% Delta"
          hoveredItem={hoveredItem3Val}
          setHoveredItem={setHoveredItem3Val}
          isVisible={visibleMap.r3_val}
          onToggle={() => toggleSubcard('r3_val')}
          onOpenDetail={() => onOpenDetail && onOpenDetail({
            chartKey: 'chart3_val',
            chartTitle: `Kết quả ${shortMonth}/${selectedYear} so với cùng kỳ ${shortMonth}/${lastYear}`
          })}
        />
        <MonthRatioCard
          title={`Tỷ suất / tỷ trọng kết quả ${shortMonth}/${selectedYear} so với cùng kỳ ${shortMonth}/${lastYear}`}
          tag="Hàng 3 - Khu 2"
          primaryLegend={`TH ${shortMonth}/${selectedYear}`}
          secondaryLegend={`TH ${shortMonth}/${lastYear}`}
          tooltipPrimaryLabel={`TH ${shortMonth}/${selectedYear}`}
          tooltipSecondaryLabel={`TH ${shortMonth}/${lastYear}`}
          data={chart3Ratios}
          isBlank={isBlank}
          hoveredItem={hoveredItem3Rat}
          setHoveredItem={setHoveredItem3Rat}
          isVisible={visibleMap.r3_rat}
          onToggle={() => toggleSubcard('r3_rat')}
          onOpenDetail={() => onOpenDetail && onOpenDetail({
            chartKey: 'chart3_rat',
            chartTitle: `Tỷ suất / tỷ trọng kết quả ${shortMonth}/${selectedYear} so với cùng kỳ ${shortMonth}/${lastYear}`
          })}
        />
      </div>

      {/* ============================================================================== */}
      {/* HÀNG 4: KẾT QUẢ SO VỚI KẾ HOẠCH THÁNG SAU                                     */}
      {/* ============================================================================== */}
      <div className="month-row-grid">
        <MonthValueCard
          title={`Kết quả ${shortMonth}/${selectedYear} so với kế hoạch ${nextShortMonth}/${nextYear}`}
          tag="Hàng 4 - Khu 1"
          primaryLegend={`TH ${shortMonth}/${selectedYear}`}
          secondaryLegend={`KH ${nextShortMonth}/${nextYear}`}
          data={chart4Values}
          isBlank={isBlank}
          rateLabel="% so KH kỳ sau"
          hoveredItem={hoveredItem4Val}
          setHoveredItem={setHoveredItem4Val}
          isVisible={visibleMap.r4_val}
          onToggle={() => toggleSubcard('r4_val')}
          onOpenDetail={() => onOpenDetail && onOpenDetail({
            chartKey: 'chart4_val',
            chartTitle: `Kết quả ${shortMonth}/${selectedYear} so với kế hoạch ${nextShortMonth}/${nextYear}`
          })}
        />
        <MonthRatioCard
          title={`Tỷ suất / tỷ trọng kết quả ${shortMonth}/${selectedYear} so với kế hoạch ${nextShortMonth}/${nextYear}`}
          tag="Hàng 4 - Khu 2"
          primaryLegend={`TH ${shortMonth}/${selectedYear}`}
          secondaryLegend={`KH ${nextShortMonth}/${nextYear}`}
          tooltipPrimaryLabel={`TH ${shortMonth}/${selectedYear}`}
          tooltipSecondaryLabel={`KH ${nextShortMonth}/${nextYear}`}
          data={chart4Ratios}
          isBlank={isBlank}
          hoveredItem={hoveredItem4Rat}
          setHoveredItem={setHoveredItem4Rat}
          isVisible={visibleMap.r4_rat}
          onToggle={() => toggleSubcard('r4_rat')}
          onOpenDetail={() => onOpenDetail && onOpenDetail({
            chartKey: 'chart4_rat',
            chartTitle: `Tỷ suất / tỷ trọng kết quả ${shortMonth}/${selectedYear} so với kế hoạch ${nextShortMonth}/${nextYear}`
          })}
        />
      </div>

      {/* BẢNG PHÂN TÍCH TỶ SUẤT / TỶ TRỌNG THÁNG */}
      {!isBlank && (
        <MonthRatioDetailTable
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          activeChartKey="chart1_rat"
        />
      )}
    </div>
  );
}
