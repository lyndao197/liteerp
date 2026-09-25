import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import './MonthComparisonChart.css';
import { MONTH_TREND_DATA, MONTH_PLAN_TREND_DATA } from '../data/revenueTrendData';

// Helper to format values with comma decimal separator
const formatVal = (val) => {
  if (val === null || val === undefined || val === '') return '';
  return val.toString().replace('.', ',');
};

// ==============================================================================
// BIỂU ĐỒ 14: XU HƯỚNG TỔNG DOANH THU TỪNG THÁNG SO VỚI NĂM TRƯỚC
// ==============================================================================
function TrendPrevYearCard({
  selectedYear,
  prevYear,
  data,
  hoveredIdx,
  setHoveredIdx,
  isVisible = true,
  onToggle
}) {
  const svgWidth = 540;
  const svgHeight = 310;
  const chartTop = 52;
  const chartBottom = 250;
  const chartHeight = chartBottom - chartTop; // 198px
  const chartLeft = 45;
  const chartRight = 515;
  const chartWidth = chartRight - chartLeft; // 470px

  const yMax = 600;
  const yTicks = [0, 100, 200, 300, 400, 500, 600];

  const getX = (index) => chartLeft + (index / 11) * chartWidth;
  const getY = (val) => (val !== null && val !== undefined) ? chartBottom - (val / yMax) * chartHeight : null;

  // Path for TH prevYear (all 12 months)
  const pathPrev = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i).toFixed(1)} ${getY(d.th2025).toFixed(1)}`)
    .join(' ');

  // Path for TH selectedYear (valid months T1-T8)
  const validCurrent = data.filter((d) => d.th2026 !== null && d.th2026 !== undefined);
  const pathCurrent = validCurrent
    .map((d, i) => {
      const idx = data.findIndex((item) => item.month === d.month);
      return `${i === 0 ? 'M' : 'L'} ${getX(idx).toFixed(1)} ${getY(d.th2026).toFixed(1)}`;
    })
    .join(' ');

  const hoveredData = hoveredIdx !== null ? data[hoveredIdx] : null;

  return (
    <div className={`month-subcard ${!isVisible ? 'is-collapsed' : ''}`}>
      <div
        className="month-subcard-header"
        onClick={!isVisible ? onToggle : undefined}
        style={!isVisible ? { cursor: 'pointer', marginBottom: 0 } : undefined}
      >
        <h3
          className="month-subcard-title"
          title={`Xu hướng doanh thu từng tháng năm ${selectedYear} so với năm ${prevYear}`}
        >
          {`Xu hướng doanh thu từng tháng năm ${selectedYear} so với năm ${prevYear}`}
        </h3>
        <div className="month-subcard-header-actions">
          <span className="month-subcard-tag">Hàng 1 - Khu 1</span>
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
        <div className="month-subcard-svg-wrap" style={{ position: 'relative' }}>
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="month-subcard-svg"
            onMouseLeave={() => setHoveredIdx(null)}
          >
            {/* Subtitle in chart */}
            <text x={chartLeft} y={20} style={{ fontSize: '11px', fontWeight: '700', fill: '#0f172a' }}>
              (ngoặc: tăng trưởng cùng kỳ)
            </text>

            {/* Stacked Legend Top Right */}
            <g transform={`translate(${chartRight - 150}, 8)`}>
              {/* TH prevYear */}
              <line x1={0} y1={6} x2={16} y2={6} stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 2" />
              <circle cx={8} cy={6} r="3" fill="#94a3b8" />
              <text x={22} y={10} style={{ fontSize: '11px', fontWeight: '600', fill: '#64748b' }}>
                TH {prevYear}
              </text>

              {/* TH selectedYear */}
              <line x1={80} y1={6} x2={96} y2={6} stroke="#c8102e" strokeWidth="2.5" />
              <circle cx={88} cy={6} r="3.5" fill="#c8102e" />
              <text x={102} y={10} style={{ fontSize: '11px', fontWeight: '700', fill: '#1e293b' }}>
                TH {selectedYear}
              </text>
            </g>

            {/* Y Axis Unit */}
            <text
              x={14}
              y={chartTop + chartHeight / 2}
              transform={`rotate(-90 14 ${chartTop + chartHeight / 2})`}
              textAnchor="middle"
              className="axis-title"
            >
              Triệu đồng
            </text>

            {/* Horizontal Grid Lines & Y Ticks */}
            {yTicks.map((tick) => {
              const y = getY(tick);
              return (
                <g key={`c14-ytick-${tick}`}>
                  <line
                    x1={chartLeft}
                    y1={y}
                    x2={chartRight}
                    y2={y}
                    stroke={tick === 0 ? '#64748b' : '#f1f5f9'}
                    strokeWidth={tick === 0 ? 1.2 : 1}
                  />
                  <line x1={chartLeft - 4} y1={y} x2={chartLeft} y2={y} stroke="#64748b" strokeWidth={1} />
                  <text
                    x={chartLeft - 7}
                    y={y + 4}
                    textAnchor="end"
                    style={{ fontSize: '10.5px', fontWeight: '500', fill: '#64748b' }}
                  >
                    {tick}
                  </text>
                </g>
              );
            })}

            {/* Y-Axis Line */}
            <line
              x1={chartLeft}
              y1={chartTop - 5}
              x2={chartLeft}
              y2={chartBottom}
              stroke="#64748b"
              strokeWidth={1}
            />

            {/* X-Axis Baseline */}
            <line
              x1={chartLeft}
              y1={chartBottom}
              x2={chartRight}
              y2={chartBottom}
              stroke="#64748b"
              strokeWidth={1.2}
            />

            {/* X Ticks & Labels (T1 - T12) */}
            {data.map((item, idx) => {
              const x = getX(idx);
              const isHovered = hoveredIdx === idx;
              return (
                <g key={`c14-xtick-${item.month}`}>
                  <line x1={x} y1={chartBottom} x2={x} y2={chartBottom + 4} stroke="#64748b" strokeWidth={1} />
                  <text
                    x={x}
                    y={chartBottom + 16}
                    textAnchor="middle"
                    style={{
                      fontSize: '11px',
                      fontWeight: isHovered ? '700' : '600',
                      fill: isHovered ? '#1e3a8a' : '#475569'
                    }}
                  >
                    {item.month}
                  </text>

                  {/* Transparent hover column */}
                  <rect
                    x={x - chartWidth / 24}
                    y={chartTop}
                    width={chartWidth / 12}
                    height={chartHeight}
                    fill="transparent"
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={() => setHoveredIdx(idx)}
                  />
                </g>
              );
            })}

            {/* Hover Vertical Guide Line */}
            {hoveredIdx !== null && (
              <line
                x1={getX(hoveredIdx)}
                y1={chartTop}
                x2={getX(hoveredIdx)}
                y2={chartBottom}
                stroke="#94a3b8"
                strokeWidth={1.2}
                strokeDasharray="3 3"
                pointerEvents="none"
              />
            )}

            {/* Line 1: TH prevYear (Dashed) */}
            <path
              d={pathPrev}
              fill="none"
              stroke="#94a3b8"
              strokeWidth="2"
              strokeDasharray="4 3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {data.map((d, idx) => {
              const x = getX(idx);
              const y = getY(d.th2025);
              return (
                <circle
                  key={`c14-dot-prev-${d.month}`}
                  cx={x}
                  cy={y}
                  r={hoveredIdx === idx ? 5 : 3.5}
                  fill="#94a3b8"
                  stroke="#ffffff"
                  strokeWidth={1}
                  pointerEvents="none"
                />
              );
            })}

            {/* Line 2: TH selectedYear (Solid Red) */}
            <path
              d={pathCurrent}
              fill="none"
              stroke="#c8102e"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {data.map((d, idx) => {
              if (d.th2026 === null || d.th2026 === undefined) return null;
              const x = getX(idx);
              const y = getY(d.th2026);
              const isHovered = hoveredIdx === idx;
              const formattedVal = formatVal(d.th2026);

              return (
                <g key={`c14-dot-cur-${d.month}`} pointerEvents="none">
                  <text
                    x={x}
                    y={y - 14}
                    textAnchor="middle"
                    style={{
                      fontSize: '9.5px',
                      fontWeight: '700',
                      fill: '#15803d',
                      letterSpacing: '-0.2px'
                    }}
                  >
                    {formattedVal}
                  </text>
                  <text
                    x={x}
                    y={y - 5}
                    textAnchor="middle"
                    style={{
                      fontSize: '9px',
                      fontWeight: '600',
                      fill: '#15803d'
                    }}
                  >
                    ({d.growth})
                  </text>
                  <circle
                    cx={x}
                    cy={y}
                    r={isHovered ? 5.5 : 4}
                    fill="#c8102e"
                    stroke="#ffffff"
                    strokeWidth={1.5}
                  />
                </g>
              );
            })}
          </svg>

          {/* Interactive Floating Tooltip */}
          {hoveredData && (
            <div
              style={{
                position: 'absolute',
                left: `${Math.min(Math.max(getX(hoveredIdx) - 20, 20), svgWidth - 170)}px`,
                top: `${Math.max(getY(hoveredData.th2026 || hoveredData.th2025) - 80, 20)}px`,
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                padding: '8px 12px',
                boxShadow: '0 6px 16px -2px rgba(0, 0, 0, 0.12)',
                fontSize: '11.5px',
                pointerEvents: 'none',
                zIndex: 20,
                minWidth: '145px'
              }}
            >
              <div style={{ fontWeight: '700', color: '#1e293b', borderBottom: '1px solid #f1f5f9', paddingBottom: '3px', marginBottom: '5px' }}>
                {hoveredData.name} ({hoveredData.month})
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                <span style={{ color: '#c8102e', fontWeight: '600' }}>TH {selectedYear}:</span>
                <span style={{ fontWeight: '700', color: '#0f172a' }}>
                  {hoveredData.th2026 !== null ? `${formatVal(hoveredData.th2026)} Tr.đ` : 'Chưa có'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                <span style={{ color: '#64748b', fontWeight: '500' }}>TH {prevYear}:</span>
                <span style={{ fontWeight: '600', color: '#475569' }}>
                  {hoveredData.th2025 !== null ? `${formatVal(hoveredData.th2025)} Tr.đ` : '-'}
                </span>
              </div>
              {hoveredData.growth && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3px', paddingTop: '3px', borderTop: '1px dashed #e2e8f0' }}>
                  <span style={{ color: '#15803d', fontWeight: '600' }}>Tăng trưởng:</span>
                  <span style={{ fontWeight: '700', color: '#15803d' }}>{hoveredData.growth}</span>
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
// BIỂU ĐỒ 15: XU HƯỚNG TỔNG DOANH THU TỪNG THÁNG SO VỚI KẾ HOẠCH
// ==============================================================================
function TrendPlanCard({
  selectedYear,
  data,
  hoveredIdx,
  setHoveredIdx,
  isVisible = true,
  onToggle
}) {
  const svgWidth = 540;
  const svgHeight = 310;
  const chartTop = 52;
  const chartBottom = 250;
  const chartHeight = chartBottom - chartTop; // 198px
  const chartLeft = 45;
  const chartRight = 515;
  const chartWidth = chartRight - chartLeft; // 470px

  const yMax = 700;
  const yTicks = [0, 100, 200, 300, 400, 500, 600, 700];

  const getX = (index) => chartLeft + (index / 11) * chartWidth;
  const getY = (val) => (val !== null && val !== undefined) ? chartBottom - (val / yMax) * chartHeight : null;

  // Path for TH line (months with valid TH data)
  const validTh = data.filter((d) => d.th !== null && d.th !== undefined);
  const pathTh = validTh
    .map((d, i) => {
      const idx = data.findIndex((item) => item.month === d.month);
      return `${i === 0 ? 'M' : 'L'} ${getX(idx).toFixed(1)} ${getY(d.th).toFixed(1)}`;
    })
    .join(' ');

  const barWidth = 24;
  const hoveredData = hoveredIdx !== null ? data[hoveredIdx] : null;

  return (
    <div className={`month-subcard ${!isVisible ? 'is-collapsed' : ''}`}>
      <div
        className="month-subcard-header"
        onClick={!isVisible ? onToggle : undefined}
        style={!isVisible ? { cursor: 'pointer', marginBottom: 0 } : undefined}
      >
        <h3
          className="month-subcard-title"
          title={`Xu hướng doanh thu từng tháng năm ${selectedYear} so với kế hoạch năm ${selectedYear}`}
        >
          {`Xu hướng doanh thu từng tháng năm ${selectedYear} so với kế hoạch năm ${selectedYear}`}
        </h3>
        <div className="month-subcard-header-actions">
          <span className="month-subcard-tag">Hàng 1 - Khu 2</span>
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
        <div className="month-subcard-svg-wrap" style={{ position: 'relative' }}>
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="month-subcard-svg"
            onMouseLeave={() => setHoveredIdx(null)}
          >
            {/* Subtitle in chart */}
            <text x={chartLeft} y={20} style={{ fontSize: '11px', fontWeight: '700', fill: '#0f172a' }}>
              (số %: mức hoàn thành KH tháng)
            </text>

            {/* Stacked Legend Top Right */}
            <g transform={`translate(${chartRight - 150}, 8)`}>
              {/* TH selectedYear (Dark Navy Blue Line) */}
              <line x1={0} y1={6} x2={16} y2={6} stroke="#1e3a8a" strokeWidth="2.5" />
              <circle cx={8} cy={6} r="3.5" fill="#1e3a8a" />
              <text x={22} y={10} style={{ fontSize: '11px', fontWeight: '700', fill: '#1e3a8a' }}>
                TH {selectedYear}
              </text>

              {/* KH selectedYear (Light Steel Blue Bar) */}
              <rect x={80} y={1} width={14} height={10} fill="#9fbcd7" rx={1.5} />
              <text x={99} y={10} style={{ fontSize: '11px', fontWeight: '600', fill: '#475569' }}>
                KH {selectedYear}
              </text>
            </g>

            {/* Y Axis Unit */}
            <text
              x={14}
              y={chartTop + chartHeight / 2}
              transform={`rotate(-90 14 ${chartTop + chartHeight / 2})`}
              textAnchor="middle"
              className="axis-title"
            >
              Triệu đồng
            </text>

            {/* Horizontal Grid Lines & Y Ticks */}
            {yTicks.map((tick) => {
              const y = getY(tick);
              return (
                <g key={`c15-ytick-${tick}`}>
                  <line
                    x1={chartLeft}
                    y1={y}
                    x2={chartRight}
                    y2={y}
                    stroke={tick === 0 ? '#64748b' : '#f1f5f9'}
                    strokeWidth={tick === 0 ? 1.2 : 1}
                  />
                  <line x1={chartLeft - 4} y1={y} x2={chartLeft} y2={y} stroke="#64748b" strokeWidth={1} />
                  <text
                    x={chartLeft - 7}
                    y={y + 4}
                    textAnchor="end"
                    style={{ fontSize: '10.5px', fontWeight: '500', fill: '#64748b' }}
                  >
                    {tick}
                  </text>
                </g>
              );
            })}

            {/* Y-Axis Line */}
            <line
              x1={chartLeft}
              y1={chartTop - 5}
              x2={chartLeft}
              y2={chartBottom}
              stroke="#64748b"
              strokeWidth={1}
            />

            {/* X-Axis Baseline */}
            <line
              x1={chartLeft}
              y1={chartBottom}
              x2={chartRight}
              y2={chartBottom}
              stroke="#64748b"
              strokeWidth={1.2}
            />

            {/* BARS: KH (Light Steel Blue) */}
            {data.map((item, idx) => {
              const x = getX(idx);
              const barHeight = item.kh ? (item.kh / yMax) * chartHeight : 0;
              const barY = chartBottom - barHeight;
              const isHovered = hoveredIdx === idx;

              return (
                <g key={`c15-bar-${item.month}`}>
                  <rect
                    x={x - barWidth / 2}
                    y={barY}
                    width={barWidth}
                    height={barHeight}
                    fill="#9fbcd7"
                    rx={1.5}
                    style={{
                      transition: 'all 0.15s ease',
                      opacity: isHovered ? 0.9 : 0.8
                    }}
                  />
                </g>
              );
            })}

            {/* X Ticks & Labels (T1 - T12) */}
            {data.map((item, idx) => {
              const x = getX(idx);
              const isHovered = hoveredIdx === idx;
              return (
                <g key={`c15-xtick-${item.month}`}>
                  <line x1={x} y1={chartBottom} x2={x} y2={chartBottom + 4} stroke="#64748b" strokeWidth={1} />
                  <text
                    x={x}
                    y={chartBottom + 16}
                    textAnchor="middle"
                    style={{
                      fontSize: '11px',
                      fontWeight: isHovered ? '700' : '600',
                      fill: isHovered ? '#1e3a8a' : '#475569'
                    }}
                  >
                    {item.month}
                  </text>

                  {/* Transparent hover column */}
                  <rect
                    x={x - chartWidth / 24}
                    y={chartTop}
                    width={chartWidth / 12}
                    height={chartHeight}
                    fill="transparent"
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={() => setHoveredIdx(idx)}
                  />
                </g>
              );
            })}

            {/* Hover Vertical Guide Line */}
            {hoveredIdx !== null && (
              <line
                x1={getX(hoveredIdx)}
                y1={chartTop}
                x2={getX(hoveredIdx)}
                y2={chartBottom}
                stroke="#94a3b8"
                strokeWidth={1.2}
                strokeDasharray="3 3"
                pointerEvents="none"
              />
            )}

            {/* LINE: TH (Dark Navy Blue) */}
            <path
              d={pathTh}
              fill="none"
              stroke="#1e3a8a"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* DOTS & % RATES for TH */}
            {data.map((d, idx) => {
              if (d.th === null || d.th === undefined) return null;
              const x = getX(idx);
              const y = getY(d.th);
              const isHovered = hoveredIdx === idx;

              // Color for rate text: green for >100%, dark red for <=100%
              const isGreen = d.isPositive;

              return (
                <g key={`c15-dot-${d.month}`} pointerEvents="none">
                  {/* % Rate Label on top of dot */}
                  {d.rate && (
                    <text
                      x={x}
                      y={y - 8}
                      textAnchor="middle"
                      style={{
                        fontSize: '9.5px',
                        fontWeight: '700',
                        fill: isGreen ? '#15803d' : '#b91c1c',
                        letterSpacing: '-0.2px'
                      }}
                    >
                      {d.rate}
                    </text>
                  )}

                  {/* Dot on line */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isHovered ? 5.5 : 4}
                    fill="#1e3a8a"
                    stroke="#ffffff"
                    strokeWidth={1.5}
                  />
                </g>
              );
            })}
          </svg>

          {/* Interactive Floating Tooltip */}
          {hoveredData && (
            <div
              style={{
                position: 'absolute',
                left: `${Math.min(Math.max(getX(hoveredIdx) - 20, 20), svgWidth - 170)}px`,
                top: `${Math.max(getY(hoveredData.th || hoveredData.kh) - 80, 20)}px`,
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                padding: '8px 12px',
                boxShadow: '0 6px 16px -2px rgba(0, 0, 0, 0.12)',
                fontSize: '11.5px',
                pointerEvents: 'none',
                zIndex: 20,
                minWidth: '145px'
              }}
            >
              <div style={{ fontWeight: '700', color: '#1e293b', borderBottom: '1px solid #f1f5f9', paddingBottom: '3px', marginBottom: '5px' }}>
                {hoveredData.name} ({hoveredData.month})
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                <span style={{ color: '#1e3a8a', fontWeight: '600' }}>TH {selectedYear}:</span>
                <span style={{ fontWeight: '700', color: '#0f172a' }}>
                  {hoveredData.th !== null ? `${formatVal(hoveredData.th)} Tr.đ` : 'Chưa có'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                <span style={{ color: '#64748b', fontWeight: '500' }}>KH {selectedYear}:</span>
                <span style={{ fontWeight: '600', color: '#475569' }}>
                  {hoveredData.kh !== null ? `${formatVal(hoveredData.kh)} Tr.đ` : '-'}
                </span>
              </div>
              {hoveredData.rate && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3px', paddingTop: '3px', borderTop: '1px dashed #e2e8f0' }}>
                  <span style={{ color: hoveredData.isPositive ? '#15803d' : '#b91c1c', fontWeight: '600' }}>% Hoàn thành:</span>
                  <span style={{ fontWeight: '700', color: hoveredData.isPositive ? '#15803d' : '#b91c1c' }}>{hoveredData.rate}</span>
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
// MAIN COMPONENT: XU HƯỚNG THEO THỜI GIAN (BIỂU ĐỒ 14 & 15 CÙNG 1 DÒNG)
// ==============================================================================
export default function TrendComparisonChart({
  selectedYear = '2026',
  setSelectedYear
}) {
  const [hoveredIdx14, setHoveredIdx14] = useState(null);
  const [hoveredIdx15, setHoveredIdx15] = useState(null);

  // Independent toggle states for Biểu đồ 14 and Biểu đồ 15
  const [visibleCards, setVisibleCards] = useState({
    chart14: true,
    chart15: true
  });

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
      chart14: nextState,
      chart15: nextState
    });
  };

  const prevYear = (parseInt(selectedYear, 10) - 1).toString();
  const rawData14 = MONTH_TREND_DATA[selectedYear] || MONTH_TREND_DATA['2026'];
  const rawData15 = MONTH_PLAN_TREND_DATA[selectedYear] || MONTH_PLAN_TREND_DATA['2026'];

  return (
    <div className="month-charts-stack">
      {/* Top Filter Bar: View all toggle + Năm [ 2026 ⌄ ] */}
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
      </div>

      {/* DÒNG 1 (2 BIỂU ĐỒ): BIỂU ĐỒ 14 & BIỂU ĐỒ 15 */}
      <div className="month-row-grid">
        <TrendPrevYearCard
          selectedYear={selectedYear}
          prevYear={prevYear}
          data={rawData14}
          hoveredIdx={hoveredIdx14}
          setHoveredIdx={setHoveredIdx14}
          isVisible={visibleCards.chart14}
          onToggle={() => toggleCard('chart14')}
        />

        <TrendPlanCard
          selectedYear={selectedYear}
          data={rawData15}
          hoveredIdx={hoveredIdx15}
          setHoveredIdx={setHoveredIdx15}
          isVisible={visibleCards.chart15}
          onToggle={() => toggleCard('chart15')}
        />
      </div>
    </div>
  );
}
