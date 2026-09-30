import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Eye, EyeOff, TableProperties } from 'lucide-react';
import './SpdvComparisonChart.css';
import './MonthComparisonChart.css';
import { SPDV_CATEGORIES, SPDV_STRUCTURE_DATA, getSpdvBarComparisonData } from '../data/revenueSpdvData';

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
function SingleDonut({ chart, centerLabel, hoveredSlice, setHoveredSlice, cardKey }) {
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
              height: '32px',
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
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
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
          {onOpenDetail && (
            <button
              className="subcard-detail-action-btn"
              onClick={(e) => {
                e.stopPropagation();
                onOpenDetail();
              }}
              title="Xem danh sách chi tiết"
            >
              <TableProperties size={13} />
              <span>Xem chi tiết</span>
            </button>
          )}
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
                <strong>{hoveredSlice.percent}%</strong>
              </div>
              <div className="tooltip-stat-row">
                <span>Giá trị:</span>
                <strong>{hoveredSlice.value} Triệu đồng</strong>
              </div>
            </div>
          )}
        </div>
    </div>
  );
}

// Subcard component for Biểu đồ 18 (2 biểu đồ 1 hàng theo chuẩn hệ thống)
function SpdvBarSubcard({
  title,
  tag,
  legendTh,
  legendKh,
  maxVal,
  ticks,
  items,
  cardKey,
  onOpenDetail
}) {
  const [hoveredItem, setHoveredItem] = useState(null);

  const svgWidth = 540;
  const svgHeight = 280;
  const chartLeft = 112;
  const chartRight = 392;
  const chartWidth = chartRight - chartLeft; // 280px
  const chartTop = 38;
  const chartBottom = 236;

  return (
    <div className="month-subcard spdv-card-item">
      <div className="month-subcard-header">
        <h3 className="month-subcard-title" title={title}>{title}</h3>
        <div className="month-subcard-header-actions">
          {onOpenDetail && (
            <button
              className="subcard-detail-action-btn"
              onClick={(e) => {
                e.stopPropagation();
                onOpenDetail();
              }}
              title="Xem danh sách chi tiết"
            >
              <TableProperties size={13} />
              <span>Xem chi tiết</span>
            </button>
          )}
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
          <g transform="translate(190, 10)">
            <rect x={0} y={1} width={12} height={9} fill="#e11d48" rx={1.5} />
            <text x={16} y={9} style={{ fontSize: '10.5px', fontWeight: '600', fill: '#1e293b' }}>
              {legendTh}
            </text>

            <rect x={82} y={1} width={12} height={9} fill="#94a3b8" rx={1.5} />
            <text x={98} y={9} style={{ fontSize: '10.5px', fontWeight: '600', fill: '#64748b' }}>
              {legendKh}
            </text>
          </g>

          {/* Top Headers for Values and Completion Rate columns */}
          <text x="402" y="19" style={{ fontSize: '9.5px', fontWeight: '700', fill: '#64748b' }}>
            Giá trị
          </text>
          <text x="532" y="19" textAnchor="end" style={{ fontSize: '9.5px', fontWeight: '700', fill: '#64748b' }}>
            % Đạt
          </text>

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
          {ticks.map((tick) => {
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
            Tỷ đ
          </text>

          {/* 6 Horizontal Bar Groups */}
          {items.map((item, idx) => {
            const yRow = chartTop + idx * 31 + 14;
            const thW = Math.max((item.th / maxVal) * chartWidth, 2);
            const khW = Math.max((item.kh / maxVal) * chartWidth, 2);
            const isHovered = hoveredItem?.id === item.id;

            return (
              <g
                key={`spdv-bar-group-${cardKey}-${item.id}`}
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredItem(item)}
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

                {/* TH Bar (Red #e11d48) */}
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

                {/* KH Bar (Slate Gray #94a3b8) */}
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

                {/* TH Value in dedicated column */}
                <text
                  x={402}
                  y={yRow - 5.5}
                  dominantBaseline="central"
                  style={{
                    fontSize: '8.5px',
                    fontWeight: '700',
                    fill: '#e11d48'
                  }}
                >
                  TH: {item.th.toFixed(1)}
                </text>

                {/* KH Value in dedicated column */}
                <text
                  x={402}
                  y={yRow + 5.5}
                  dominantBaseline="central"
                  style={{
                    fontSize: '8.5px',
                    fontWeight: '600',
                    fill: '#64748b'
                  }}
                >
                  KH: {item.kh.toFixed(1)}
                </text>

                {/* % Rate in dedicated column */}
                <text
                  x={532}
                  y={yRow + 0.5}
                  dominantBaseline="central"
                  textAnchor="end"
                  style={{
                    fontSize: '10.5px',
                    fontWeight: '800',
                    fill: item.isRatePositive ? '#15803d' : '#dc2626'
                  }}
                >
                  {item.rate}
                </text>
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
              minWidth: '180px'
            }}
          >
            <div style={{ fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>
              {hoveredItem.name}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', marginBottom: '3px' }}>
              <span style={{ color: '#e11d48', fontWeight: '600' }}>{legendTh}:</span>
              <strong>{hoveredItem.th.toFixed(1)} Tỷ đ</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', marginBottom: '3px' }}>
              <span style={{ color: '#64748b', fontWeight: '600' }}>{legendKh}:</span>
              <strong>{hoveredItem.kh.toFixed(1)} Tỷ đ</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', marginBottom: '3px' }}>
              <span>Chênh lệch:</span>
              <strong style={{ color: hoveredItem.th >= hoveredItem.kh ? '#16a34a' : '#dc2626' }}>
                {(hoveredItem.th - hoveredItem.kh) > 0 ? '+' : ''}
                {(hoveredItem.th - hoveredItem.kh).toFixed(1)} Tỷ đ
              </strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', paddingTop: '4px', borderTop: '1px solid #e2e8f0' }}>
              <span>Hoàn thành:</span>
              <strong style={{ color: hoveredItem.isRatePositive ? '#16a34a' : '#dc2626' }}>
                {hoveredItem.rate}
              </strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Subcard for Hàng 5 - Khu 2: Chú thích 6 nhóm SPDV & Quy chuẩn màu sắc
function SpdvLegendSubcard({ tag = 'Hàng 5 - Khu 2' }) {
  return (
    <div className="month-subcard spdv-card-item" style={{ justifyContent: 'space-between' }}>
      <div className="month-subcard-header">
        <h3 className="month-subcard-title" title="Chú thích 6 nhóm SPDV & Mức độ hoàn thành">
          Chú thích 6 nhóm SPDV & Mức độ hoàn thành
        </h3>
        <div className="month-subcard-header-actions">
          <span className="month-subcard-tag">{tag}</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', padding: '8px 4px', flex: 1, justifyContent: 'center' }}>
        {/* Phần 1: Quy ước màu thanh Biểu đồ 18 */}
        <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>
            Quy ước màu thanh so sánh (Biểu đồ 18):
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '9px', borderRadius: '2px', backgroundColor: '#e11d48' }} />
              <span style={{ fontSize: '11.5px', fontWeight: '600', color: '#334155' }}>
                Thực hiện / Ước
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '9px', borderRadius: '2px', backgroundColor: '#94a3b8' }} />
              <span style={{ fontSize: '11.5px', fontWeight: '600', color: '#334155' }}>
                Kế hoạch
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '11.5px', fontWeight: '700', color: '#15803d' }}>
                ≥ 100%: Đạt
              </span>
              <span style={{ color: '#cbd5e1' }}>|</span>
              <span style={{ fontSize: '11.5px', fontWeight: '700', color: '#dc2626' }}>
                &lt; 100%: Chưa đạt
              </span>
            </div>
          </div>
        </div>

        {/* Phần 2: Cơ cấu 6 nhóm SPDV (Biểu đồ 16 & 17) */}
        <div>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>
            Phân loại màu sắc 6 nhóm SPDV (Biểu đồ 16 & 17):
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '10px 14px'
            }}
          >
            {SPDV_CATEGORIES.map((cat) => (
              <div key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '3px',
                    backgroundColor: cat.color,
                    flexShrink: 0
                  }}
                />
                <span style={{ fontSize: '12px', fontWeight: '500', color: '#334155' }}>
                  {cat.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
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

  // Calculate Quarter and Cumulative texts based on activeMonth
  const monthNum = parseInt(activeMonth.match(/\d+/)?.[0] || '8', 10);
  const quarterNumber = Math.ceil(monthNum / 3);
  const quarterRoman = ['I', 'II', 'III', 'IV'][quarterNumber - 1];
  const startMonthOfQuarter = (quarterNumber - 1) * 3 + 1;

  // Formatted subcard titles exactly matching user mockup
  const thMonthTitle = `TH – Tháng ${monthNum}/${activeYear}`;
  const khMonthTitle = `KH – Tháng ${monthNum}/${activeYear}`;

  const thQuarterTitle = startMonthOfQuarter === monthNum
    ? `TH – Quý ${quarterRoman}/${activeYear} (lũy kế T${startMonthOfQuarter})`
    : `TH – Quý ${quarterRoman}/${activeYear} (lũy kế T${startMonthOfQuarter} – T${monthNum})`;
  const khQuarterTitle = `KH – Quý ${quarterRoman}/${activeYear}`;

  const thYearTitle = `TH – Năm ${activeYear} (lũy kế ${monthNum}T)`;
  const khYearTitle = `KH – Năm ${activeYear}`;

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
          subtitle={thSubtitle}
          tag="Hàng 1 - Khu 1"
          tagType="th"
          chart={data.thMonth}
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
          subtitle={khSubtitle}
          tag="Hàng 1 - Khu 2"
          tagType="kh"
          chart={data.khMonth}
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
          subtitle={thSubtitle}
          tag="Hàng 2 - Khu 1"
          tagType="th"
          chart={data.thQuarter}
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
          subtitle={khSubtitle}
          tag="Hàng 2 - Khu 2"
          tagType="kh"
          chart={data.khQuarter}
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
          subtitle={thSubtitle}
          tag="Hàng 3 - Khu 1"
          tagType="th"
          chart={data.thYear}
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
          subtitle={khSubtitle}
          tag="Hàng 3 - Khu 2"
          tagType="kh"
          chart={data.khYear}
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
          title={`Biểu đồ 18. Doanh thu 6 nhóm SPDV so với KH – ${barData.monthTitle}`}
          tag="Hàng 4 - Khu 1"
          legendTh={barData.monthLegendTh}
          legendKh={barData.monthLegendKh}
          maxVal={barData.monthMax}
          ticks={barData.monthTicks}
          items={barData.monthItems}
          cardKey="month"
          onOpenDetail={() => onOpenDetail && onOpenDetail({
            chartKey: 'spdv_bar_month',
            chartTitle: `Biểu đồ 18. Doanh thu 6 nhóm SPDV so với KH – ${barData.monthTitle}`
          })}
        />

        <SpdvBarSubcard
          title={`Biểu đồ 18. Doanh thu 6 nhóm SPDV so với KH – ${barData.quarterTitle}`}
          tag="Hàng 4 - Khu 2"
          legendTh={barData.quarterLegendTh}
          legendKh={barData.quarterLegendKh}
          maxVal={barData.quarterMax}
          ticks={barData.quarterTicks}
          items={barData.quarterItems}
          cardKey="quarter"
          onOpenDetail={() => onOpenDetail && onOpenDetail({
            chartKey: 'spdv_bar_quarter',
            chartTitle: `Biểu đồ 18. Doanh thu 6 nhóm SPDV so với KH – ${barData.quarterTitle}`
          })}
        />
      </div>

      {/* DÒNG 5: BIỂU ĐỒ 18 - NĂM & CHÚ THÍCH NHÓM SPDV (2 BIỂU ĐỒ 1 HÀNG) */}
      <div className="month-row-grid">
        <SpdvBarSubcard
          title={`Biểu đồ 18. Doanh thu 6 nhóm SPDV so với KH – ${barData.yearTitle}`}
          tag="Hàng 5 - Khu 1"
          legendTh={barData.yearLegendTh}
          legendKh={barData.yearLegendKh}
          maxVal={barData.yearMax}
          ticks={barData.yearTicks}
          items={barData.yearItems}
          cardKey="year"
          onOpenDetail={() => onOpenDetail && onOpenDetail({
            chartKey: 'spdv_bar_year',
            chartTitle: `Biểu đồ 18. Doanh thu 6 nhóm SPDV so với KH – ${barData.yearTitle}`
          })}
        />

        <SpdvLegendSubcard tag="Hàng 5 - Khu 2" />
      </div>
    </div>
  );
}
