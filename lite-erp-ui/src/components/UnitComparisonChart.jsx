import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import './SpdvComparisonChart.css';
import './MonthComparisonChart.css';
import { UNIT_CATEGORIES, UNIT_STRUCTURE_DATA, UNIT_PLAN_COMPARISON_DATA } from '../data/revenueUnitData';

const MONTH_OPTIONS = [
  'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4',
  'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8',
  'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
];

// Helper: tính path SVG cho từng miếng donut
function getDonutSlicePath(cx, cy, innerR, outerR, startAngle, endAngle) {
  const delta = endAngle - startAngle;
  if (delta >= 2 * Math.PI - 0.0001) {
    const midAngle = startAngle + Math.PI;
    return `${getDonutSlicePath(cx, cy, innerR, outerR, startAngle, midAngle)} ${getDonutSlicePath(cx, cy, innerR, outerR, midAngle, endAngle)}`;
  }

  const x1 = cx + outerR * Math.cos(startAngle);
  const y1 = cy + outerR * Math.sin(startAngle);
  const x2 = cx + outerR * Math.cos(endAngle);
  const y2 = cy + outerR * Math.sin(endAngle);

  const x3 = cx + innerR * Math.cos(endAngle);
  const y3 = cy + innerR * Math.sin(endAngle);
  const x4 = cx + innerR * Math.cos(startAngle);
  const y4 = cy + innerR * Math.sin(startAngle);

  const largeArcFlag = delta > Math.PI ? 1 : 0;

  return `M ${x1} ${y1} A ${outerR} ${outerR} 0 ${largeArcFlag} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerR} ${innerR} 0 ${largeArcFlag} 0 ${x4} ${y4} Z`;
}

// Single Donut Chart Component (Biểu đồ 21)
function SingleDonut({ chart, hoveredSlice, setHoveredSlice, cardKey }) {
  const cx = 110;
  const cy = 105;
  const outerRadius = 82;
  const innerRadius = 48;
  const textRadius = (outerRadius + innerRadius) / 2;

  let currentAngle = -Math.PI / 2;

  return (
    <div className="spdv-donut-wrapper">
      <svg viewBox="0 0 220 210" className="spdv-donut-svg">
        {chart.slices.map((slice, sIdx) => {
          const sliceAngle = (slice.percent / 100) * 2 * Math.PI;
          const startAngle = currentAngle;
          const endAngle = currentAngle + sliceAngle;
          currentAngle = endAngle;

          const midAngle = startAngle + sliceAngle / 2;
          const tx = cx + textRadius * Math.cos(midAngle);
          const ty = cy + textRadius * Math.sin(midAngle);

          const isHovered =
            hoveredSlice &&
            hoveredSlice.cardKey === cardKey &&
            hoveredSlice.sliceName === slice.name;

          const path = getDonutSlicePath(
            cx,
            cy,
            innerRadius,
            isHovered ? outerRadius + 4 : outerRadius,
            startAngle,
            endAngle
          );

          return (
            <g
              key={`slice-${sIdx}`}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => {
                setHoveredSlice({
                  cardKey,
                  sliceName: slice.name,
                  percent: slice.percent,
                  value: slice.value,
                  color: slice.color
                });
              }}
              onMouseLeave={() => setHoveredSlice(null)}
            >
              <path
                d={path}
                fill={slice.color}
                stroke="#ffffff"
                strokeWidth={1.5}
                style={{
                  transition: 'all 0.15s ease',
                  opacity: hoveredSlice && !isHovered ? 0.85 : 1
                }}
              />
              <text
                x={tx}
                y={ty}
                textAnchor="middle"
                dominantBaseline="central"
                pointerEvents="none"
                style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  fill: '#ffffff',
                  textShadow: '0 1px 2px rgba(0,0,0,0.35)'
                }}
              >
                {slice.percent}%
              </text>
            </g>
          );
        })}

        {/* Center label: Value and Unit */}
        <text
          x={cx}
          y={cy - 2}
          textAnchor="middle"
          style={{
            fontSize: '15.5px',
            fontWeight: '800',
            fill: '#0f172a',
            letterSpacing: '-0.2px'
          }}
        >
          {chart.formattedTotal}
        </text>
        <text
          x={cx}
          y={cy + 14}
          textAnchor="middle"
          style={{
            fontSize: '12px',
            fontWeight: '600',
            fill: '#0f172a'
          }}
        >
          {chart.unit}
        </text>
      </svg>
    </div>
  );
}

// Biểu đồ 21 Subcard (Donut Chart)
function UnitStructureSubcard({
  title,
  tag = 'Thực hiện',
  chart,
  hoveredSlice,
  setHoveredSlice,
  cardKey,
  isVisible = true,
  onToggle
}) {
  return (
    <div className={`month-subcard spdv-card-item ${!isVisible ? 'is-collapsed' : ''}`}>
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
        <div className="spdv-subcard-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <SingleDonut
            chart={chart}
            hoveredSlice={hoveredSlice}
            setHoveredSlice={setHoveredSlice}
            cardKey={cardKey}
          />
          {hoveredSlice && hoveredSlice.cardKey === cardKey && (
            <div className="month-subcard-tooltip" style={{ marginTop: '8px', width: '90%' }}>
              <div className="tooltip-item-title">{hoveredSlice.sliceName}</div>
              <div className="tooltip-stat-row">
                <span>Tỷ trọng:</span>
                <strong>{hoveredSlice.percent}%</strong>
              </div>
              <div className="tooltip-stat-row">
                <span>Giá trị:</span>
                <strong>{hoveredSlice.value} Triệu đồng</strong>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Biểu đồ 22 Subcard (Horizontal Bar Chart so sánh TH vs KH 6 đơn vị)
function UnitPlanSubcard({
  title,
  tag = 'Kế hoạch',
  data,
  cardKey,
  isVisible = true,
  onToggle
}) {
  const [hoveredUnit, setHoveredUnit] = useState(null);

  const svgWidth = 540;
  const svgHeight = 280;
  const chartLeft = 110;
  const chartRight = 485;
  const chartWidth = chartRight - chartLeft; // 375px
  const chartTop = 32;
  const chartBottom = 236;

  const maxVal = data.maxVal || 150;
  const items = data.items || [];
  const xTicks = data.xTicks || [];

  return (
    <div className={`month-subcard spdv-card-item ${!isVisible ? 'is-collapsed' : ''}`}>
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
        <div className="month-subcard-svg-wrap" style={{ position: 'relative' }}>
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="month-subcard-svg" onMouseLeave={() => setHoveredUnit(null)}>
            {/* Top Legend */}
            <g transform={`translate(${chartRight - 150}, 8)`}>
              <rect x={0} y={1} width={12} height={9} fill="#e11d48" rx={1.5} />
              <text x={16} y={9} style={{ fontSize: '11px', fontWeight: '600', fill: '#1e293b' }}>
                {data.primaryLegend}
              </text>

              <rect x={75} y={1} width={12} height={9} fill="#94a3b8" rx={1.5} />
              <text x={91} y={9} style={{ fontSize: '11px', fontWeight: '600', fill: '#64748b' }}>
                {data.secondaryLegend}
              </text>
            </g>

            {/* Left Y-Axis Baseline */}
            <line x1={chartLeft} y1={chartTop - 5} x2={chartLeft} y2={chartBottom} stroke="#64748b" strokeWidth={1} />

            {/* Bottom X-Axis Baseline */}
            <line x1={chartLeft} y1={chartBottom} x2={chartRight} y2={chartBottom} stroke="#64748b" strokeWidth={1} />

            {/* X Ticks & Labels */}
            {xTicks.map((tick) => {
              const x = chartLeft + (tick / maxVal) * chartWidth;
              return (
                <g key={`u-tick-${cardKey}-${tick}`}>
                  <line x1={x} y1={chartBottom} x2={x} y2={chartBottom + 4} stroke="#64748b" strokeWidth={1} />
                  <text
                    x={x}
                    y={chartBottom + 16}
                    textAnchor="middle"
                    style={{ fontSize: '10px', fontWeight: '500', fill: '#64748b' }}
                  >
                    {tick}
                  </text>
                </g>
              );
            })}

            {/* Unit text at bottom */}
            <text x={chartRight + 5} y={chartBottom + 16} textAnchor="start" style={{ fontSize: '10px', fontWeight: '600', fill: '#64748b' }}>
              Tr.đ
            </text>

            {/* 6 Horizontal Bar Groups */}
            {items.map((item, idx) => {
              const yRow = chartTop + idx * 33 + 16;
              const thW = Math.max((item.th / maxVal) * chartWidth, 0);
              const khW = Math.max((item.kh / maxVal) * chartWidth, 0);
              const rateX = chartLeft + Math.max(thW, khW) + 8;
              const isHovered = hoveredUnit?.id === item.id;

              return (
                <g
                  key={`u-bar-group-${cardKey}-${item.id}`}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredUnit(item)}
                >
                  {/* Category Name on Y-axis */}
                  <text
                    x={chartLeft - 8}
                    y={yRow + 4}
                    textAnchor="end"
                    style={{
                      fontSize: '11px',
                      fontWeight: isHovered ? '700' : '600',
                      fill: isHovered ? '#e11d48' : '#334155'
                    }}
                  >
                    {item.name}
                  </text>

                  {/* TH Bar (Red) */}
                  <rect
                    x={chartLeft}
                    y={yRow - 9}
                    width={thW}
                    height={8}
                    fill="#e11d48"
                    rx={1.5}
                    style={{
                      transition: 'all 0.15s ease',
                      opacity: isHovered ? 1 : 0.95
                    }}
                  />

                  {/* KH Bar (Gray) */}
                  <rect
                    x={chartLeft}
                    y={yRow + 1}
                    width={khW}
                    height={8}
                    fill="#94a3b8"
                    rx={1.5}
                    style={{
                      transition: 'all 0.15s ease',
                      opacity: isHovered ? 1 : 0.85
                    }}
                  />

                  {/* % Rate Label on the right */}
                  <text
                    x={rateX}
                    y={yRow + 4}
                    textAnchor="start"
                    style={{
                      fontSize: '10.5px',
                      fontWeight: '700',
                      fill: item.isPositive ? '#15803d' : '#b91c1c'
                    }}
                  >
                    {item.rate}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Interactive Floating Tooltip */}
          {hoveredUnit && (
            <div
              style={{
                position: 'absolute',
                right: '18px',
                top: '40px',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                padding: '8px 12px',
                boxShadow: '0 6px 16px -2px rgba(0, 0, 0, 0.12)',
                fontSize: '11.5px',
                pointerEvents: 'none',
                zIndex: 20,
                minWidth: '150px'
              }}
            >
              <div style={{ fontWeight: '700', color: '#1e293b', borderBottom: '1px solid #f1f5f9', paddingBottom: '3px', marginBottom: '5px' }}>
                {hoveredUnit.name}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                <span style={{ color: '#e11d48', fontWeight: '600' }}>{data.primaryLegend}:</span>
                <span style={{ fontWeight: '700', color: '#0f172a' }}>{hoveredUnit.th} Triệu đồng</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                <span style={{ color: '#64748b', fontWeight: '500' }}>{data.secondaryLegend}:</span>
                <span style={{ fontWeight: '600', color: '#475569' }}>{hoveredUnit.kh} Triệu đồng</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3px', paddingTop: '3px', borderTop: '1px dashed #e2e8f0' }}>
                <span style={{ color: hoveredUnit.isPositive ? '#15803d' : '#b91c1c', fontWeight: '600' }}>% Hoàn thành:</span>
                <span style={{ fontWeight: '700', color: hoveredUnit.isPositive ? '#15803d' : '#b91c1c' }}>{hoveredUnit.rate}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ==============================================================================
// MAIN COMPONENT: NHÁNH 6 - DOANH THU THEO ĐƠN VỊ (BIỂU ĐỒ 21 & 22)
// ==============================================================================
export default function UnitComparisonChart({
  selectedYear = '2026',
  setSelectedYear,
  selectedMonth = 'Tháng 8',
  setSelectedMonth,
  visibleCards: externalVisibleCards,
  onVisibleCardsChange
}) {
  const [internalYear, setInternalYear] = useState('2026');
  const [internalMonth, setInternalMonth] = useState('Tháng 8');
  const [hoveredSlice, setHoveredSlice] = useState(null);

  // Independent toggle states for each of the 6 subcards
  const [internalVisibleCards, setInternalVisibleCards] = useState({
    c21Month: true,
    c22Month: true,
    c21Quarter: true,
    c22Quarter: true,
    c21Year: true,
    c22Year: true
  });

  const visibleCards = externalVisibleCards !== undefined ? externalVisibleCards : internalVisibleCards;
  const setVisibleCards = (updater) => {
    if (onVisibleCardsChange) {
      if (typeof updater === 'function') {
        onVisibleCardsChange(updater(visibleCards));
      } else {
        onVisibleCardsChange(updater);
      }
    } else {
      setInternalVisibleCards(updater);
    }
  };

  const toggleCard = (key) => {
    setVisibleCards((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const isAllVisible = Object.values(visibleCards).every(Boolean);
  const toggleAll = () => {
    const nextState = !isAllVisible;
    setVisibleCards({
      c21Month: nextState,
      c22Month: nextState,
      c21Quarter: nextState,
      c22Quarter: nextState,
      c21Year: nextState,
      c22Year: nextState
    });
  };

  const activeYear = selectedYear || internalYear;
  const activeMonth = selectedMonth || internalMonth;

  const handleYearChange = (val) => {
    setInternalYear(val);
    if (setSelectedYear) setSelectedYear(val);
  };

  const handleMonthChange = (val) => {
    setInternalMonth(val);
    if (setSelectedMonth) setSelectedMonth(val);
  };

  const data21 = UNIT_STRUCTURE_DATA[activeYear] || UNIT_STRUCTURE_DATA['2026'];
  const data22 = UNIT_PLAN_COMPARISON_DATA[activeYear] || UNIT_PLAN_COMPARISON_DATA['2026'];

  // Calculate Quarter and Cumulative texts based on activeMonth
  const monthNum = parseInt(activeMonth.match(/\d+/)?.[0] || '8', 10);
  const quarterNumber = Math.ceil(monthNum / 3);
  const quarterRoman = ['I', 'II', 'III', 'IV'][quarterNumber - 1];
  const quarterText = `Quý ${quarterRoman}/${activeYear}`;

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
              value={activeYear}
              onChange={(e) => handleYearChange(e.target.value)}
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
              value={activeMonth}
              onChange={(e) => handleMonthChange(e.target.value)}
            >
              {MONTH_OPTIONS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <ChevronDown size={14} className="clean-select-chevron" />
          </div>
        </div>
      </div>

      {/* DÒNG 1: THÁNG (BIỂU ĐỒ 21 & BIỂU ĐỒ 22) */}
      <div className="month-row-grid">
        <UnitStructureSubcard
          title={`Cơ cấu theo từng đơn vị – ${activeMonth}/${activeYear}`}
          tag="Hàng 1 - Khu 1"
          chart={data21.thMonth}
          hoveredSlice={hoveredSlice}
          setHoveredSlice={setHoveredSlice}
          cardKey="u21-month"
          isVisible={visibleCards.c21Month}
          onToggle={() => toggleCard('c21Month')}
        />

        <UnitPlanSubcard
          title={`Doanh thu theo đơn vị so với kế hoạch – ${activeMonth}/${activeYear}`}
          tag="Hàng 1 - Khu 2"
          data={data22.month}
          cardKey="u22-month"
          isVisible={visibleCards.c22Month}
          onToggle={() => toggleCard('c22Month')}
        />
      </div>

      {/* DÒNG 2: QUÝ (BIỂU ĐỒ 21 & BIỂU ĐỒ 22) */}
      <div className="month-row-grid">
        <UnitStructureSubcard
          title={`Cơ cấu theo từng đơn vị – ${quarterText}`}
          tag="Hàng 2 - Khu 1"
          chart={data21.thQuarter}
          hoveredSlice={hoveredSlice}
          setHoveredSlice={setHoveredSlice}
          cardKey="u21-quarter"
          isVisible={visibleCards.c21Quarter}
          onToggle={() => toggleCard('c21Quarter')}
        />

        <UnitPlanSubcard
          title={`Doanh thu theo đơn vị so với kế hoạch – ${quarterText}`}
          tag="Hàng 2 - Khu 2"
          data={data22.quarter}
          cardKey="u22-quarter"
          isVisible={visibleCards.c22Quarter}
          onToggle={() => toggleCard('c22Quarter')}
        />
      </div>

      {/* DÒNG 3: NĂM (BIỂU ĐỒ 21 & BIỂU ĐỒ 22) */}
      <div className="month-row-grid">
        <UnitStructureSubcard
          title={`Cơ cấu theo từng đơn vị – Năm ${activeYear}`}
          tag="Hàng 3 - Khu 1"
          chart={data21.thYear}
          hoveredSlice={hoveredSlice}
          setHoveredSlice={setHoveredSlice}
          cardKey="u21-year"
          isVisible={visibleCards.c21Year}
          onToggle={() => toggleCard('c21Year')}
        />

        <UnitPlanSubcard
          title={`Doanh thu theo đơn vị so với kế hoạch – Năm ${activeYear}`}
          tag="Hàng 3 - Khu 2"
          data={data22.year}
          cardKey="u22-year"
          isVisible={visibleCards.c22Year}
          onToggle={() => toggleCard('c22Year')}
        />
      </div>

      {/* LEGEND matching screenshot */}
      <div className="month-chart-card" style={{ padding: '16px 20px', marginTop: '4px' }}>
        <div className="spdv-legend-grid" style={{ borderTop: 'none', paddingTop: 0, marginTop: 0 }}>
          <div className="spdv-legend-row" style={{ gap: '28px' }}>
            {UNIT_CATEGORIES.map((cat) => (
              <div key={cat.id} className="spdv-legend-item">
                <span className="spdv-legend-color-box" style={{ backgroundColor: cat.color }} />
                <span style={{ fontWeight: '600' }}>{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
