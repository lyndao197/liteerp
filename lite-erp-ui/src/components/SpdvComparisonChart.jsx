import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Eye, EyeOff, ArrowRight } from 'lucide-react';
import './SpdvComparisonChart.css';
import './MonthComparisonChart.css';
import {
  SPDV_CATEGORIES,
  SPDV_STRUCTURE_DATA,
  getSpdvBarComparisonData,
  getSpdvYoyComparisonData,
  getSpdvPrevPeriodComparisonData
} from '../data/revenueSpdvData';

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

// Single Donut Chart Component
function SingleDonut({ chart, centerLabel, hoveredSlice, setHoveredSlice, cardKey, compareChart }) {
  const cx = 110;
  const cy = 105;
  const outerRadius = 78;
  const innerRadius = 45;
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
                  color: slice.color,
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
                  fontSize: slice.percent < 10 ? '9.5px' : '10.5px',
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

        {/* Center label */}
        <text
          x={cx}
          y={cy + 4}
          textAnchor="middle"
          style={{
            fontSize: centerLabel && centerLabel.length > 10 ? '12px' : '13.5px',
            fontWeight: '800',
            fill: '#0f172a',
            letterSpacing: '-0.2px'
          }}
        >
          {centerLabel}
        </text>
      </svg>
    </div>
  );
}

// Subcard component for 2-column layout in SPDV matching user mockup
function SpdvSubcard({
  title,
  subtitle,
  tag,
  tagType = 'th',
  chart,
  compareChart,
  centerLabel,
  hoveredSlice,
  setHoveredSlice,
  cardKey,
  isVisible = true,
  onToggle,
  onOpenDetail
}) {
  return (
    <div
      className={`month-subcard spdv-card-item ${!isVisible ? 'is-collapsed' : ''}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: isVisible ? '14px 16px' : '10px 14px',
        transition: 'all 0.2s ease',
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
      }}
    >
      <div
        className="month-subcard-header"
        onClick={onToggle}
        style={{
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          margin: 0,
          userSelect: 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
          {/* Vertical indicator bar matching user screenshot */}
          <span
            style={{
              width: '4px',
              height: subtitle ? '32px' : '22px',
              borderRadius: '2px',
              backgroundColor: tagType === 'th' ? '#e11d48' : '#94a3b8',
              flexShrink: 0
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0, flex: 1 }}>
            <h3
              style={{
                fontSize: '13.5px',
                fontWeight: '700',
                color: '#0f172a',
                margin: 0,
                lineHeight: '1.35',
                whiteSpace: 'normal',
                wordBreak: 'break-word'
              }}
              title={title}
            >
              {title}
            </h3>
            {subtitle && (
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#64748b',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {subtitle}
              </span>
            )}
          </div>
        </div>

        <div className="month-subcard-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <span
            style={{
              fontSize: '11.5px',
              fontWeight: '600',
              color: '#475569',
              backgroundColor: '#f1f5f9',
              padding: '2px 8px',
              borderRadius: '4px',
              whiteSpace: 'nowrap'
            }}
          >
            {tag}
          </span>
        </div>
      </div>

      <div
        className="spdv-subcard-body"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          marginTop: '12px',
          paddingTop: '8px',
          borderTop: '1px solid #f1f5f9'
        }}
      >
          <SingleDonut
            chart={chart}
            compareChart={compareChart}
            centerLabel={centerLabel}
            hoveredSlice={hoveredSlice}
            setHoveredSlice={setHoveredSlice}
            cardKey={cardKey}
          />
          {hoveredSlice && hoveredSlice.cardKey === cardKey && (
            <div className="month-subcard-tooltip" style={{ marginTop: '8px', width: '90%' }}>
              <div className="tooltip-item-title">{hoveredSlice.sliceName}</div>
              <div className="tooltip-stat-row">
                <span>Tỷ trọng:</span>
                <strong>{hoveredSlice.percent !== null && hoveredSlice.percent !== undefined ? `${hoveredSlice.percent}%` : '-'}</strong>
              </div>
              <div className="tooltip-stat-row">
                <span>Giá trị:</span>
                <strong>{hoveredSlice.value !== null && hoveredSlice.value !== undefined ? `${hoveredSlice.value} Triệu đồng` : '-'}</strong>
              </div>
            </div>
          )}

          {/* Chú giải theo nhóm SPDV (Legend trực tiếp trong biểu đồ) */}
          <div
            className="spdv-subcard-legend"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px 16px',
              padding: '12px 14px 4px',
              marginTop: '10px',
              borderTop: '1px solid #f1f5f9',
              width: '100%'
            }}
          >
            {SPDV_CATEGORIES.map((cat) => {
              const isHovered =
                hoveredSlice &&
                hoveredSlice.cardKey === cardKey &&
                hoveredSlice.sliceName === cat.name;
              return (
                <div
                  key={cat.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '7px',
                    fontSize: '12px',
                    fontWeight: isHovered ? '700' : '600',
                    color: isHovered ? '#0f172a' : '#334155',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    padding: '2px 4px',
                    borderRadius: '4px',
                    backgroundColor: isHovered ? '#f1f5f9' : 'transparent'
                  }}
                  onMouseEnter={() => {
                    const slice = chart?.slices?.find((s) => s.name === cat.name);
                    if (slice) {
                      setHoveredSlice({
                        cardKey,
                        sliceName: slice.name,
                        percent: slice.percent,
                        value: slice.value,
                        color: slice.color
                      });
                    }
                  }}
                  onMouseLeave={() => setHoveredSlice(null)}
                >
                  <span
                    style={{
                      width: '13px',
                      height: '13px',
                      borderRadius: '3px',
                      backgroundColor: cat.color,
                      flexShrink: 0,
                      boxShadow: isHovered ? `0 0 0 2px ${cat.color}` : 'none',
                      transition: 'all 0.15s ease'
                    }}
                  />
                  <span>{cat.name}</span>
                </div>
              );
            })}
          </div>
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

// Subcard component for Biểu đồ 18, 19, 20 (chuẩn hệ thống 2 biểu đồ 1 hàng hoặc 1 biểu đồ cả hàng)
function SpdvBarSubcard({
  title,
  tag,
  legendTh,
  legendKh,
  maxVal,
  ticks,
  items,
  cardKey,
  rateLabel = '% HTKH:',
  diffLabel = '+/- Chênh lệch:',
  unit = 'Tỷ đ',
  onOpenDetail
}) {
  const [hoveredItem, setHoveredItem] = useState(null);

  const svgWidth = 540;
  const svgHeight = 280;
  const chartLeft = 112;
  const chartRight = 490;
  const chartWidth = chartRight - chartLeft; // 378px
  const chartTop = 38;
  const chartBottom = 236;

  const legendThStr = String(legendTh || 'TH');
  const legendKhStr = String(legendKh || 'KH');
  const secondLegendOffset = legendThStr.length > 10 ? 115 : (legendThStr.length > 7 ? 95 : 82);
  const legendTranslateX = chartRight - (secondLegendOffset + 65);

  return (
    <div className="month-subcard spdv-card-item">
      <div className="month-subcard-header" style={{ alignItems: 'flex-start', gap: '12px' }}>
        <h3
          className="month-subcard-title"
          title={title}
          style={{ whiteSpace: 'normal', lineHeight: '1.35', wordBreak: 'break-word' }}
        >
          {title}
        </h3>
        <div className="month-subcard-header-actions" style={{ flexShrink: 0, marginTop: '2px' }}>
          <span className="month-subcard-tag">{tag}</span>
        </div>
      </div>

      <div className="month-subcard-svg-wrap" style={{ position: 'relative' }}>
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="month-subcard-svg"
          onMouseLeave={() => setHoveredItem(null)}
        >
          {/* Top Legend */}
          <g transform={`translate(${legendTranslateX}, 10)`}>
            <rect x={0} y={1} width={12} height={9} fill="#e11d48" rx={1.5} />
            <text x={16} y={9} style={{ fontSize: '10.5px', fontWeight: '600', fill: '#1e293b' }}>
              {legendThStr}
            </text>

            <rect x={secondLegendOffset} y={1} width={12} height={9} fill="#94a3b8" rx={1.5} />
            <text x={secondLegendOffset + 16} y={9} style={{ fontSize: '10.5px', fontWeight: '600', fill: '#64748b' }}>
              {legendKhStr}
            </text>
          </g>

          {/* Left Y-Axis Baseline */}
          <line
            x1={chartLeft}
            y1={chartTop - 5}
            x2={chartLeft}
            y2={chartBottom}
            stroke="#64748b"
            strokeWidth={1}
          />

          {/* Bottom X-Axis Baseline */}
          <line
            x1={chartLeft}
            y1={chartBottom}
            x2={chartRight}
            y2={chartBottom}
            stroke="#64748b"
            strokeWidth={1}
          />

          {/* X Ticks & Labels */}
          {ticks && ticks.map((tick) => {
            const x = chartLeft + (tick / maxVal) * chartWidth;
            return (
              <g key={`spdv-tick-${cardKey}-${tick}`}>
                <line
                  x1={x}
                  y1={chartBottom}
                  x2={x}
                  y2={chartBottom + 4}
                  stroke="#64748b"
                  strokeWidth={1}
                />
                <text
                  x={x}
                  y={chartBottom + 14}
                  textAnchor="middle"
                  style={{ fontSize: '8.5px', fontWeight: '500', fill: '#64748b' }}
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {/* Unit text at bottom */}
          <text
            x={chartRight + 6}
            y={chartBottom + 14}
            textAnchor="start"
            style={{ fontSize: '9px', fontWeight: '600', fill: '#64748b' }}
          >
            {unit}
          </text>

          {/* 6 Horizontal Bar Groups */}
          {(items || []).map((item, idx) => {
            const yRow = chartTop + idx * 31 + 14;
            const valTh = Number(item.th !== undefined ? item.th : (item.curr ?? 0));
            const valKh = Number(item.kh !== undefined ? item.kh : (item.prev ?? 0));
            const thW = Math.max((valTh / maxVal) * chartWidth, 2);
            const khW = Math.max((valKh / maxVal) * chartWidth, 2);
            const maxW = Math.max(thW, khW);
            const isHovered = hoveredItem?.id === item.id;

            return (
              <g
                key={`spdv-bar-group-${cardKey}-${item.id}`}
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredItem({ ...item, valTh, valKh })}
              >
                {/* Background hover effect */}
                <rect
                  x={2}
                  y={yRow - 12}
                  width={svgWidth - 4}
                  height={28}
                  rx={4}
                  fill={isHovered ? 'rgba(225, 29, 72, 0.05)' : 'transparent'}
                />

                {/* Category Name on Y-axis */}
                <text
                  x={chartLeft - 6}
                  y={yRow + 1}
                  textAnchor="end"
                  dominantBaseline="central"
                  style={{
                    fontSize: '10px',
                    fontWeight: isHovered ? '700' : '600',
                    fill: isHovered ? '#e11d48' : '#334155'
                  }}
                >
                  {item.name}
                </text>

                {/* Primary Bar (#e11d48) */}
                <rect
                  x={chartLeft}
                  y={yRow - 9.5}
                  width={thW}
                  height={8}
                  fill="#e11d48"
                  rx={1.5}
                  style={{
                    transition: 'all 0.15s ease',
                    opacity: isHovered ? 1 : 0.95
                  }}
                />

                {/* Secondary Comparison Bar (#94a3b8) */}
                <rect
                  x={chartLeft}
                  y={yRow + 1.5}
                  width={khW}
                  height={8}
                  fill="#94a3b8"
                  rx={1.5}
                  style={{
                    transition: 'all 0.15s ease',
                    opacity: isHovered ? 1 : 0.85
                  }}
                />

                {/* % Rate text displayed right next to the longer bar */}
                {item.rate && (
                  <text
                    x={chartLeft + maxW + 6}
                    y={yRow + 1}
                    dominantBaseline="central"
                    style={{
                      fontSize: '9.5px',
                      fontWeight: '700',
                      fill: item.isRatePositive ? '#16a34a' : '#dc2626'
                    }}
                  >
                    {item.rate}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Interactive Floating Tooltip */}
        {hoveredItem && (
          <div
            style={{
              position: 'absolute',
              right: '24px',
              top: '44px',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              padding: '10px 14px',
              boxShadow: '0 6px 16px -2px rgba(0, 0, 0, 0.12)',
              fontSize: '11.5px',
              pointerEvents: 'none',
              zIndex: 20,
              minWidth: '185px'
            }}
          >
            <div style={{ fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>
              {hoveredItem.name}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', marginBottom: '3px' }}>
              <span style={{ color: '#e11d48', fontWeight: '600' }}>{legendThStr}:</span>
              <strong>{hoveredItem.valTh.toFixed(1)} {unit}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', marginBottom: '3px' }}>
              <span style={{ color: '#64748b', fontWeight: '600' }}>{legendKhStr}:</span>
              <strong>{hoveredItem.valKh.toFixed(1)} {unit}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', paddingTop: '4px', borderTop: '1px solid #e2e8f0' }}>
              <span>{rateLabel}</span>
              <strong style={{ color: hoveredItem.isRatePositive ? '#16a34a' : '#dc2626' }}>
                {hoveredItem.rate}
              </strong>
            </div>
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

export default function SpdvComparisonChart({
  selectedYear = '2026',
  setSelectedYear,
  selectedMonth = 'Tháng 8',
  setSelectedMonth,
  visibleCards: externalVisibleCards,
  onVisibleCardsChange,
  onOpenDetail
}) {
  const [internalYear, setInternalYear] = useState('2026');
  const [internalMonth, setInternalMonth] = useState('Tháng 8');
  const [hoveredSlice, setHoveredSlice] = useState(null);

  // Independent toggle states for each of the subcards (default open)
  const [internalVisibleCards, setInternalVisibleCards] = useState({
    thMonth: true,
    khMonth: true,
    thQuarter: true,
    khQuarter: true,
    thYear: true,
    khYear: true,
    chart18: true
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
      thMonth: nextState,
      khMonth: nextState,
      thQuarter: nextState,
      khQuarter: nextState,
      thYear: nextState,
      khYear: nextState
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

  const data = SPDV_STRUCTURE_DATA[activeYear] || SPDV_STRUCTURE_DATA['2026'];
  const barData = getSpdvBarComparisonData(activeYear, activeMonth);
  const yoyData = getSpdvYoyComparisonData(activeYear, activeMonth);
  const prevPeriodData = getSpdvPrevPeriodComparisonData(activeYear, activeMonth);

  // Calculate Quarter and Cumulative texts based on activeMonth
  const monthNum = parseInt(activeMonth.match(/\d+/)?.[0] || "8", 10);
  const quarterNumber = Math.ceil(monthNum / 3);
  const quarterRoman = `${quarterNumber}`;
  const startMonthOfQuarter = (quarterNumber - 1) * 3 + 1;
  const lastYear = (parseInt(activeYear, 10) - 1).toString();

  const prevMonthNum = monthNum > 1 ? monthNum - 1 : 12;
  const prevMonthYear = monthNum > 1 ? activeYear : lastYear;
  const prevQuarterNum = quarterNumber > 1 ? quarterNumber - 1 : 4;
  const prevQuarterYear = quarterNumber > 1 ? activeYear : lastYear;

  // Formatted subcard titles exactly matching user mockup
  const thMonthTitle = `Cơ cấu thực hiện doanh thu tháng ${monthNum}/${activeYear} theo nhóm SPDV`;
  const khMonthTitle = `Cơ cấu kế hoạch doanh thu tháng ${monthNum}/${activeYear} theo nhóm SPDV`;

  const thQuarterTitle = startMonthOfQuarter === monthNum
    ? `Cơ cấu thực hiện doanh thu Quý ${quarterRoman}/${activeYear} (lũy kế T${startMonthOfQuarter}) theo nhóm SPDV`
    : `Cơ cấu thực hiện doanh thu Quý ${quarterRoman}/${activeYear} (lũy kế T${startMonthOfQuarter} – T${monthNum}) theo nhóm SPDV`;
  const khQuarterTitle = `Cơ cấu kế hoạch doanh thu Quý ${quarterRoman}/${activeYear} theo nhóm SPDV`;

  const thYearTitle = `Cơ cấu thực hiện doanh thu năm ${activeYear} (lũy kế ${monthNum}T) theo nhóm SPDV`;
  const khYearTitle = `Cơ cấu kế hoạch doanh thu năm ${activeYear} theo nhóm SPDV`;

  // Titles for Biểu đồ 19 (So với cùng kỳ năm trước)
  const yoyMonthTitle = `Biểu đồ 19. Thực hiện Tháng ${monthNum}/${activeYear} so với cùng kỳ Tháng ${monthNum}/${lastYear} theo nhóm SPDV`;
  const yoyQuarterTitle = `Biểu đồ 19. Ước thực hiện Quý ${quarterNumber}/${activeYear} so với cùng kỳ Quý ${quarterNumber}/${lastYear} theo nhóm SPDV`;
  const yoyYearTitle = `Biểu đồ 19. Thực hiện lũy kế năm ${activeYear} so với cùng kỳ năm ${lastYear} theo nhóm SPDV`;

  // Titles for Biểu đồ 20 (So với kỳ trước)
  const prevMonthTitle = `Biểu đồ 20. Thực hiện Tháng ${monthNum}/${activeYear} so với thực hiện Tháng ${prevMonthNum}/${prevMonthYear} theo nhóm SPDV`;
  const prevQuarterTitle = `Biểu đồ 20. Ước thực hiện Quý ${quarterNumber}/${activeYear} so với thực hiện Quý ${prevQuarterNum}/${prevQuarterYear} theo nhóm SPDV`;
  const prevYearTitle = `Biểu đồ 20. Ước thực hiện năm ${activeYear} so với thực hiện năm ${lastYear} theo nhóm SPDV`;

  const thSubtitle = 'Doanh thu thực hiện theo nhóm SPDV';
  const khSubtitle = 'Doanh thu kế hoạch theo nhóm SPDV';

  // Values in Center
  const centerThMonth = activeYear === '2025' ? '364,4 triệu' : '389,9 triệu';
  const centerKhMonth = activeYear === '2025' ? '380 triệu' : '414 triệu';
  const centerThQuarter = activeYear === '2025' ? '712,9 triệu' : '775 triệu';
  const centerKhQuarter = activeYear === '2025' ? '1.150 triệu' : '1.246 triệu';
  const centerThYear = activeYear === '2025' ? '2.674,5 triệu' : '2.976,3 triệu';
  const centerKhYear = activeYear === '2025' ? '4.500 triệu' : '4.968,1 triệu';

  return (
    <div className="month-charts-stack">
      {/* Top Filter Bar: Năm [ 2026 ⌄ ]   Tháng [ Tháng 8 ⌄ ] */}
      <div className="month-top-filter-bar">
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

      {/* DÒNG 1: THÁNG (2 BIỂU ĐỒ: THỰC HIỆN & KẾ HOẠCH) */}
      <div className="month-row-grid">
        <SpdvSubcard
          title={thMonthTitle}
          subtitle={null}
          tag="Hàng 1 - Khu 1"
          tagType="th"
          chart={data.thMonth}
          compareChart={data.khMonth}
          centerLabel={centerThMonth}
          hoveredSlice={hoveredSlice}
          setHoveredSlice={setHoveredSlice}
          cardKey="th-month"
          isVisible={visibleCards.thMonth}
          onToggle={() => toggleCard('thMonth')}
          onOpenDetail={() => onOpenDetail && onOpenDetail({
            chartKey: 'spdv_th_month',
            chartTitle: thMonthTitle
          })}
        />

        <SpdvSubcard
          title={khMonthTitle}
          subtitle={null}
          tag="Hàng 1 - Khu 2"
          tagType="kh"
          chart={data.khMonth}
          compareChart={data.thMonth}
          centerLabel={centerKhMonth}
          hoveredSlice={hoveredSlice}
          setHoveredSlice={setHoveredSlice}
          cardKey="kh-month"
          isVisible={visibleCards.khMonth}
          onToggle={() => toggleCard('khMonth')}
          onOpenDetail={() => onOpenDetail && onOpenDetail({
            chartKey: 'spdv_kh_month',
            chartTitle: khMonthTitle
          })}
        />
      </div>

      {/* DÒNG 2: QUÝ (2 BIỂU ĐỒ: THỰC HIỆN & KẾ HOẠCH) */}
      <div className="month-row-grid">
        <SpdvSubcard
          title={thQuarterTitle}
          subtitle={null}
          tag="Hàng 2 - Khu 1"
          tagType="th"
          chart={data.thQuarter}
          compareChart={data.khQuarter}
          centerLabel={centerThQuarter}
          hoveredSlice={hoveredSlice}
          setHoveredSlice={setHoveredSlice}
          cardKey="th-quarter"
          isVisible={visibleCards.thQuarter}
          onToggle={() => toggleCard('thQuarter')}
          onOpenDetail={() => onOpenDetail && onOpenDetail({
            chartKey: 'spdv_th_quarter',
            chartTitle: thQuarterTitle
          })}
        />

        <SpdvSubcard
          title={khQuarterTitle}
          subtitle={null}
          tag="Hàng 2 - Khu 2"
          tagType="kh"
          chart={data.khQuarter}
          compareChart={data.thQuarter}
          centerLabel={centerKhQuarter}
          hoveredSlice={hoveredSlice}
          setHoveredSlice={setHoveredSlice}
          cardKey="kh-quarter"
          isVisible={visibleCards.khQuarter}
          onToggle={() => toggleCard('khQuarter')}
          onOpenDetail={() => onOpenDetail && onOpenDetail({
            chartKey: 'spdv_kh_quarter',
            chartTitle: khQuarterTitle
          })}
        />
      </div>

      {/* DÒNG 3: NĂM (2 BIỂU ĐỒ: THỰC HIỆN & KẾ HOẠCH) */}
      <div className="month-row-grid">
        <SpdvSubcard
          title={thYearTitle}
          subtitle={null}
          tag="Hàng 3 - Khu 1"
          tagType="th"
          chart={data.thYear}
          compareChart={data.khYear}
          centerLabel={centerThYear}
          hoveredSlice={hoveredSlice}
          setHoveredSlice={setHoveredSlice}
          cardKey="th-year"
          isVisible={visibleCards.thYear}
          onToggle={() => toggleCard('thYear')}
          onOpenDetail={() => onOpenDetail && onOpenDetail({
            chartKey: 'spdv_th_year',
            chartTitle: thYearTitle
          })}
        />

        <SpdvSubcard
          title={khYearTitle}
          subtitle={null}
          tag="Hàng 3 - Khu 2"
          tagType="kh"
          chart={data.khYear}
          compareChart={data.thYear}
          centerLabel={centerKhYear}
          hoveredSlice={hoveredSlice}
          setHoveredSlice={setHoveredSlice}
          cardKey="kh-year"
          isVisible={visibleCards.khYear}
          onToggle={() => toggleCard('khYear')}
          onOpenDetail={() => onOpenDetail && onOpenDetail({
            chartKey: 'spdv_kh_year',
            chartTitle: khYearTitle
          })}
        />
      </div>

      {/* DÒNG 4: BIỂU ĐỒ 18 - THÁNG & QUÝ (2 BIỂU ĐỒ 1 HÀNG) */}
      <div className="month-row-grid">
        <SpdvBarSubcard
          title={`Biểu đồ 18. Thực hiện ${barData.monthTitle} so với kế hoạch ${barData.monthTitle} theo nhóm SPDV`}
          tag="Hàng 4 - Khu 1"
          legendTh={`TH ${barData.monthTitle?.replace('Tháng ', 'T')}`}
          legendKh={`KH ${barData.monthTitle?.replace('Tháng ', 'T')}`}
          maxVal={barData.monthMax}
          ticks={barData.monthTicks}
          items={barData.monthItems}
          cardKey="month"
          onOpenDetail={() => onOpenDetail && onOpenDetail({
            chartKey: 'spdv_bar_month',
            chartTitle: `Biểu đồ 18. Thực hiện ${barData.monthTitle} so với kế hoạch ${barData.monthTitle} theo nhóm SPDV`
          })}
        />

        <SpdvBarSubcard
          title={`Biểu đồ 18. Ước thực hiện ${barData.quarterTitle} so với kế hoạch ${barData.quarterTitle} theo nhóm SPDV`}
          tag="Hàng 4 - Khu 2"
          legendTh={`Ước TH ${barData.quarterTitle?.replace(/Quý\s*(III|3)/, 'Q3')?.replace(/Quý\s*(II|2)/, 'Q2')?.replace(/Quý\s*(IV|4)/, 'Q4')?.replace(/Quý\s*(I|1)/, 'Q1')}`}
          legendKh={`KH ${barData.quarterTitle?.replace(/Quý\s*(III|3)/, 'Q3')?.replace(/Quý\s*(II|2)/, 'Q2')?.replace(/Quý\s*(IV|4)/, 'Q4')?.replace(/Quý\s*(I|1)/, 'Q1')}`}
          maxVal={barData.quarterMax}
          ticks={barData.quarterTicks}
          items={barData.quarterItems}
          cardKey="quarter"
          onOpenDetail={() => onOpenDetail && onOpenDetail({
            chartKey: 'spdv_bar_quarter',
            chartTitle: `Biểu đồ 18. Ước thực hiện ${barData.quarterTitle} so với kế hoạch ${barData.quarterTitle} theo nhóm SPDV`
          })}
        />
      </div>

      {/* DÒNG 5: BIỂU ĐỒ 18 - NĂM */}
      <div className="month-row-grid">
        <SpdvBarSubcard
          title={`Biểu đồ 18. Ước thực hiện ${barData.yearTitle} so với kế hoạch ${barData.yearTitle} theo nhóm SPDV`}
          tag="Hàng 5"
          legendTh={`Ước TH ${barData.yearTitle?.replace('Năm ', '')}`}
          legendKh={`KH ${barData.yearTitle?.replace('Năm ', '')}`}
          maxVal={barData.yearMax}
          ticks={barData.yearTicks}
          items={barData.yearItems}
          cardKey="year"
          onOpenDetail={() => onOpenDetail && onOpenDetail({
            chartKey: 'spdv_bar_year',
            chartTitle: `Biểu đồ 18. Ước thực hiện ${barData.yearTitle} so với kế hoạch ${barData.yearTitle} theo nhóm SPDV`
          })}
        />
      </div>

      {/* DÒNG 6: BIỂU ĐỒ 19 - THÁNG & QUÝ (2 BIỂU ĐỒ 1 HÀNG) */}
      <div className="month-row-grid">
        <SpdvBarSubcard
          title={yoyMonthTitle}
          tag="Hàng 6 - Khu 1"
          legendTh={yoyData.monthLegendCurr || `T${monthNum}/${activeYear}`}
          legendKh={yoyData.monthLegendPrev || `T${monthNum}/${lastYear}`}
          maxVal={yoyData.monthMax}
          ticks={yoyData.monthTicks}
          items={yoyData.monthItems}
          cardKey="yoy-month"
          rateLabel="% delta:"
          diffLabel="+/- Chênh lệch:"
          onOpenDetail={() => onOpenDetail && onOpenDetail({
            chartKey: 'spdv_yoy_month',
            chartTitle: yoyMonthTitle
          })}
        />

        <SpdvBarSubcard
          title={yoyQuarterTitle}
          tag="Hàng 6 - Khu 2"
          legendTh={yoyData.quarterLegendCurr || `Ước Q${quarterNumber}/${activeYear}`}
          legendKh={yoyData.quarterLegendPrev || `Q${quarterNumber}/${lastYear}`}
          maxVal={yoyData.quarterMax}
          ticks={yoyData.quarterTicks}
          items={yoyData.quarterItems}
          cardKey="yoy-quarter"
          rateLabel="% delta:"
          diffLabel="+/- Chênh lệch:"
          onOpenDetail={() => onOpenDetail && onOpenDetail({
            chartKey: 'spdv_yoy_quarter',
            chartTitle: yoyQuarterTitle
          })}
        />
      </div>

      {/* DÒNG 7: BIỂU ĐỒ 19 - NĂM */}
      <div className="month-row-grid">
        <SpdvBarSubcard
          title={yoyYearTitle}
          tag="Hàng 7"
          legendTh={yoyData.yearLegendCurr || `${monthNum}T/${activeYear}`}
          legendKh={yoyData.yearLegendPrev || `${monthNum}T/${lastYear}`}
          maxVal={yoyData.yearMax}
          ticks={yoyData.yearTicks}
          items={yoyData.yearItems}
          cardKey="yoy-year"
          rateLabel="% delta:"
          diffLabel="+/- Chênh lệch:"
          onOpenDetail={() => onOpenDetail && onOpenDetail({
            chartKey: 'spdv_yoy_year',
            chartTitle: yoyYearTitle
          })}
        />
      </div>

      {/* DÒNG 8: BIỂU ĐỒ 20 - THÁNG & QUÝ (2 BIỂU ĐỒ 1 HÀNG) */}
      <div className="month-row-grid">
        <SpdvBarSubcard
          title={prevMonthTitle}
          tag="Hàng 8 - Khu 1"
          legendTh={prevPeriodData.monthLegendCurr || `TH T${monthNum}`}
          legendKh={prevPeriodData.monthLegendPrev || `TH T${prevMonthNum}`}
          maxVal={prevPeriodData.monthMax}
          ticks={prevPeriodData.monthTicks}
          items={prevPeriodData.monthItems}
          cardKey="prev-month"
          rateLabel="% delta:"
          diffLabel="+/- Chênh lệch:"
          onOpenDetail={() => onOpenDetail && onOpenDetail({
            chartKey: 'spdv_prev_month',
            chartTitle: prevMonthTitle
          })}
        />

        <SpdvBarSubcard
          title={prevQuarterTitle}
          tag="Hàng 8 - Khu 2"
          legendTh={prevPeriodData.quarterLegendCurr || `Ước Q${quarterNumber}`}
          legendKh={prevPeriodData.quarterLegendPrev || `TH Q${prevQuarterNum}`}
          maxVal={prevPeriodData.quarterMax}
          ticks={prevPeriodData.quarterTicks}
          items={prevPeriodData.quarterItems}
          cardKey="prev-quarter"
          rateLabel="% delta:"
          diffLabel="+/- Chênh lệch:"
          onOpenDetail={() => onOpenDetail && onOpenDetail({
            chartKey: 'spdv_prev_quarter',
            chartTitle: prevQuarterTitle
          })}
        />
      </div>

      {/* DÒNG 9: BIỂU ĐỒ 20 - NĂM */}
      <div className="month-row-grid">
        <SpdvBarSubcard
          title={prevYearTitle}
          tag="Hàng 9"
          legendTh={prevPeriodData.yearLegendCurr || `Ước ${activeYear}`}
          legendKh={prevPeriodData.yearLegendPrev || `TH ${lastYear}`}
          maxVal={prevPeriodData.yearMax}
          ticks={prevPeriodData.yearTicks}
          items={prevPeriodData.yearItems}
          cardKey="prev-year"
          rateLabel="% delta:"
          diffLabel="+/- Chênh lệch:"
          onOpenDetail={() => onOpenDetail && onOpenDetail({
            chartKey: 'spdv_prev_year',
            chartTitle: prevYearTitle
          })}
        />
      </div>
    </div>
  );
}
