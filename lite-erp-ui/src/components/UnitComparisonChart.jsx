import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import './SpdvComparisonChart.css';
import './MonthComparisonChart.css';
import {
  UNIT_CATEGORIES,
  UNIT_STRUCTURE_DATA,
  UNIT_PLAN_COMPARISON_DATA,
  UNIT_PREV_PERIOD_COMPARISON_DATA
} from '../data/revenueUnitData';

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
function SingleDonut({ chart, hoveredSlice, setHoveredSlice, cardKey, planItems }) {
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
                const item = planItems?.find((it) => it.name === slice.name);
                let delta = null;
                if (item && item.kh > 0 && item.th !== null && item.th !== undefined) {
                  delta = ((item.th - item.kh) / item.kh) * 100;
                }
                setHoveredSlice({
                  cardKey,
                  sliceName: slice.name,
                  percent: slice.percent,
                  value: slice.value,
                  color: slice.color,
                  delta: delta !== null ? delta.toFixed(1).replace('.', ',') : null,
                  isDeltaPositive: delta !== null ? delta >= 0 : null
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
  planItems,
  hoveredSlice,
  setHoveredSlice,
  cardKey,
  isVisible = true,
  onToggle,
  onOpenDetail
}) {
  return (
    <div className="month-subcard spdv-card-item">
      <div className="month-subcard-header">
        <h3 className="month-subcard-title">{title}</h3>
        <div className="month-subcard-header-actions">
          <span className="month-subcard-tag">{tag}</span>
        </div>
      </div>

      <div className="spdv-subcard-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <SingleDonut
            chart={chart}
            planItems={planItems}
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

          {/* Chú giải theo đơn vị (Legend trực tiếp trong biểu đồ) */}
          <div
            className="unit-subcard-legend"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px 18px',
              padding: '12px 14px 4px',
              marginTop: '10px',
              borderTop: '1px solid #f1f5f9',
              width: '100%'
            }}
          >
            {UNIT_CATEGORIES.map((cat) => {
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

// Biểu đồ 22 Subcard (Horizontal Bar Chart so sánh TH vs KH 6 đơn vị)
function UnitPlanSubcard({
  title,
  tag = 'Kế hoạch',
  data,
  cardKey,
  isVisible = true,
  onToggle,
  onOpenDetail
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

  const primaryLegendStr = String(data.primaryLegend || 'TH');
  const secondaryLegendStr = String(data.secondaryLegend || 'KH');
  const secondLegendOffset = primaryLegendStr.length > 10 ? 115 : (primaryLegendStr.length > 7 ? 95 : 75);
  const legendTranslateX = (primaryLegendStr.length > 10 || secondaryLegendStr.length > 10) ? (chartRight - 200) : (chartRight - 150);

  return (
    <div className="month-subcard spdv-card-item">
      <div className="month-subcard-header">
        <h3 className="month-subcard-title">{title}</h3>
        <div className="month-subcard-header-actions">
          <span className="month-subcard-tag">{tag}</span>
        </div>
      </div>

      <div className="month-subcard-svg-wrap" style={{ position: 'relative' }}>
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="month-subcard-svg" onMouseLeave={() => setHoveredUnit(null)}>
            {/* Top Legend */}
            <g transform={`translate(${legendTranslateX}, 8)`}>
              <rect x={0} y={1} width={12} height={9} fill="#e11d48" rx={1.5} />
              <text x={16} y={9} style={{ fontSize: '11px', fontWeight: '600', fill: '#1e293b' }}>
                {primaryLegendStr}
              </text>

              <rect x={secondLegendOffset} y={1} width={12} height={9} fill="#94a3b8" rx={1.5} />
              <text x={secondLegendOffset + 16} y={9} style={{ fontSize: '11px', fontWeight: '600', fill: '#64748b' }}>
                {secondaryLegendStr}
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
                <span style={{ color: '#e11d48', fontWeight: '600' }}>{data.primaryLegend || 'TH'}:</span>
                <span style={{ fontWeight: '700', color: '#0f172a' }}>{hoveredUnit.th} Triệu đồng</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                <span style={{ color: '#64748b', fontWeight: '500' }}>{data.secondaryLegend || 'KH'}:</span>
                <span style={{ fontWeight: '600', color: '#475569' }}>{hoveredUnit.kh} Triệu đồng</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3px', paddingTop: '3px', borderTop: '1px dashed #e2e8f0' }}>
                <span style={{ color: hoveredUnit.isPositive ? '#15803d' : '#b91c1c', fontWeight: '600' }}>% HTKH:</span>
                <span style={{ fontWeight: '700', color: hoveredUnit.isPositive ? '#15803d' : '#b91c1c' }}>{hoveredUnit.rate}</span>
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

// ==============================================================================
// BIỂU ĐỒ 23 SUBCARD (Horizontal Bar Chart: Doanh thu theo đơn vị so với kỳ trước)
// Theme: Cột TH kỳ này màu navy (#1b4570), cột TH kỳ trước màu xanh nhạt (#9eb5d0)
// Tỷ lệ % delta: xanh (#15803d) nếu > 100%, đỏ (#b91c1c) nếu <= 100%
// ==============================================================================
function UnitPrevPeriodSubcard({
  title,
  tag = 'So kỳ trước',
  data,
  cardKey,
  isVisible = true,
  onToggle,
  onOpenDetail
}) {
  const [hoveredUnit, setHoveredUnit] = useState(null);

  if (!data) return null;

  const items = data.items || [];
  const maxVal = data.maxVal || 120;
  const xTicks = data.xTicks || [0, 20, 40, 60, 80, 100, 120];
  const unitLabel = data.unit || 'Tỷ đồng';

  const chartLeft = 110;
  const chartRight = 450;
  const chartTop = 15;
  const chartBottom = 205;

  return (
    <div className="month-subcard spdv-card-item">
      <div className="month-subcard-header">
        <h3 className="month-subcard-title">{title}</h3>
        <div className="month-subcard-header-actions">
          <span className="month-subcard-tag">{tag}</span>
        </div>
      </div>

      <div className="spdv-subcard-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', position: 'relative' }}>
        {/* Legends: Primary (Rose red #e11d48) & Secondary (Slate gray #94a3b8) */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '8px', fontSize: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '12px', height: '12px', backgroundColor: '#e11d48', borderRadius: '2px', display: 'inline-block' }} />
            <span style={{ fontWeight: '600', color: '#1e293b' }}>{data.primaryLegend || 'TH'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '12px', height: '12px', backgroundColor: '#94a3b8', borderRadius: '2px', display: 'inline-block' }} />
            <span style={{ fontWeight: '600', color: '#475569' }}>{data.secondaryLegend || 'Kỳ trước'}</span>
          </div>
        </div>

        {/* SVG Horizontal Bar Chart */}
        <svg
          viewBox="0 0 520 235"
          style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}
          onMouseLeave={() => setHoveredUnit(null)}
        >
          {/* Vertical axis line at X=0 */}
          <line
            x1={chartLeft}
            y1={chartTop}
            x2={chartLeft}
            y2={chartBottom}
            stroke="#475569"
            strokeWidth={1.2}
          />
          {/* Bottom axis line */}
          <line
            x1={chartLeft}
            y1={chartBottom}
            x2={chartRight}
            y2={chartBottom}
            stroke="#475569"
            strokeWidth={1.2}
          />

          {/* Vertical Grid lines & X-ticks */}
          {xTicks.map((val) => {
            const xPos = chartLeft + (val / maxVal) * (chartRight - chartLeft);
            return (
              <g key={`x-tick-${cardKey}-${val}`}>
                <line
                  x1={xPos}
                  y1={chartBottom}
                  x2={xPos}
                  y2={chartBottom + 4}
                  stroke="#64748b"
                  strokeWidth={1}
                />
                <text
                  x={xPos}
                  y={chartBottom + 16}
                  textAnchor="middle"
                  style={{ fontSize: '10.5px', fill: '#475569', fontWeight: '500' }}
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Unit text at bottom center */}
          <text
            x={chartLeft + (chartRight - chartLeft) / 2}
            y={chartBottom + 28}
            textAnchor="middle"
            style={{ fontSize: '10.5px', fontWeight: '600', fill: '#475569' }}
          >
            {unitLabel}
          </text>

          {/* 6 Horizontal Bar Groups */}
          {items.map((item, idx) => {
            const yRow = chartTop + idx * 31 + 14;
            const currW = Math.max(((item.curr || 0) / maxVal) * (chartRight - chartLeft), 0);
            const prevW = Math.max(((item.prev || 0) / maxVal) * (chartRight - chartLeft), 0);
            const rateX = chartLeft + Math.max(currW, prevW) + 8;
            const isHovered = hoveredUnit?.id === item.id;
            const rateNum = parseFloat(item.rate?.replace('%', '') || '0');
            const isPositive = rateNum > 100;

            return (
              <g
                key={`u23-bar-group-${cardKey}-${item.id}`}
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

                {/* Top Bar: TH Kỳ này (Rose Red #e11d48) */}
                <rect
                  x={chartLeft}
                  y={yRow - 9}
                  width={currW}
                  height={8}
                  fill="#e11d48"
                  rx={1.5}
                  style={{
                    transition: 'all 0.15s ease',
                    opacity: isHovered ? 1 : 0.95
                  }}
                />

                {/* Bottom Bar: TH Kỳ trước (Slate Gray #94a3b8) */}
                <rect
                  x={chartLeft}
                  y={yRow + 1}
                  width={prevW}
                  height={8}
                  fill="#94a3b8"
                  rx={1.5}
                  style={{
                    transition: 'all 0.15s ease',
                    opacity: isHovered ? 1 : 0.85
                  }}
                />

                {/* % delta Label on the right */}
                <text
                  x={rateX}
                  y={yRow + 4}
                  textAnchor="start"
                  style={{
                    fontSize: '10.5px',
                    fontWeight: '700',
                    fill: isPositive ? '#15803d' : '#b91c1c'
                  }}
                >
                  {item.rate}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating Tooltip */}
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
              minWidth: '160px'
            }}
          >
            <div style={{ fontWeight: '700', color: '#1e293b', borderBottom: '1px solid #f1f5f9', paddingBottom: '3px', marginBottom: '5px' }}>
              {hoveredUnit.name}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
              <span style={{ color: '#e11d48', fontWeight: '600' }}>{data.primaryLegend || 'TH'}:</span>
              <span style={{ fontWeight: '700', color: '#0f172a' }}>{hoveredUnit.curr} {unitLabel}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
              <span style={{ color: '#64748b', fontWeight: '500' }}>{data.secondaryLegend || 'Kỳ trước'}:</span>
              <span style={{ fontWeight: '600', color: '#475569' }}>{hoveredUnit.prev} {unitLabel}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3px', paddingTop: '3px', borderTop: '1px dashed #e2e8f0' }}>
              <span style={{ color: '#475569', fontWeight: '600' }}>% delta:</span>
              <span style={{ fontWeight: '700', color: (parseFloat(hoveredUnit.rate?.replace('%', '') || '0') > 100) ? '#15803d' : '#b91c1c' }}>
                {hoveredUnit.rate}
              </span>
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

// ==============================================================================
// MAIN COMPONENT: NHÁNH 6 - DOANH THU THEO ĐƠN VỊ (BIỂU ĐỒ 21, 22 & 23)
// ==============================================================================
export default function UnitComparisonChart({
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

  // Independent toggle states for each of the 9 subcards
  const [internalVisibleCards, setInternalVisibleCards] = useState({
    c21Month: true,
    c22Month: true,
    c21Quarter: true,
    c22Quarter: true,
    c21Year: true,
    c22Year: true,
    c23Month: true,
    c23Quarter: true,
    c23Year: true
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
      c22Year: nextState,
      c23Month: nextState,
      c23Quarter: nextState,
      c23Year: nextState
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
  const data23 = UNIT_PREV_PERIOD_COMPARISON_DATA[activeYear] || UNIT_PREV_PERIOD_COMPARISON_DATA['2026'];

  // Calculate Quarter and Cumulative texts based on activeMonth
  const monthNum = parseInt(activeMonth.match(/\d+/)?.[0] || '8', 10);
  const prevMonthNum = monthNum === 1 ? 12 : monthNum - 1;
  const prevMonthYear = monthNum === 1 ? (parseInt(activeYear, 10) - 1).toString() : activeYear;
  const quarterNumber = Math.ceil(monthNum / 3);
  const prevQuarterNum = quarterNumber === 1 ? 4 : quarterNumber - 1;
  const prevQuarterYear = quarterNumber === 1 ? (parseInt(activeYear, 10) - 1).toString() : activeYear;
  const quarterRoman = `${quarterNumber}`;
  const quarterText = `Quý ${quarterRoman}/${activeYear}`;
  const lastYear = (parseInt(activeYear, 10) - 1).toString();

  const prevMonthTitle = `Biểu đồ 23. Thực hiện Tháng ${monthNum}/${activeYear} so với thực hiện Tháng ${prevMonthNum}/${prevMonthYear} theo đơn vị (T${monthNum} vs T${prevMonthNum})`;
  const prevQuarterTitle = `Biểu đồ 23. Ước thực hiện Quý ${quarterRoman}/${activeYear} so với thực hiện Quý ${prevQuarterNum}/${prevQuarterYear} theo đơn vị (Q${quarterRoman} vs Q${prevQuarterNum})`;
  const prevYearTitle = `Biểu đồ 23. Ước thực hiện năm ${activeYear} so với thực hiện năm ${lastYear} theo đơn vị (${activeYear} vs ${lastYear})`;

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

      {/* DÒNG 1: THÁNG & QUÝ - CƠ CẤU DOANH THU TH THEO TỪNG ĐƠN VỊ (BIỂU ĐỒ 21) */}
      <div className="month-row-grid">
        <UnitStructureSubcard
          title={`Cơ cấu doanh thu TH theo từng đơn vị – ${activeMonth}/${activeYear}`}
          tag="Hàng 1 - Khu 1"
          chart={data21.thMonth}
          planItems={data22.month.items}
          hoveredSlice={hoveredSlice}
          setHoveredSlice={setHoveredSlice}
          cardKey="u21-month"
          isVisible={visibleCards.c21Month}
          onToggle={() => toggleCard('c21Month')}
          onOpenDetail={() => onOpenDetail && onOpenDetail({
            chartKey: 'unit_struct_month',
            chartTitle: `Cơ cấu doanh thu TH theo từng đơn vị – ${activeMonth}/${activeYear}`
          })}
        />

        <UnitStructureSubcard
          title={`Cơ cấu doanh thu TH theo từng đơn vị – ${quarterText}`}
          tag="Hàng 1 - Khu 2"
          chart={data21.thQuarter}
          planItems={data22.quarter.items}
          hoveredSlice={hoveredSlice}
          setHoveredSlice={setHoveredSlice}
          cardKey="u21-quarter"
          isVisible={visibleCards.c21Quarter}
          onToggle={() => toggleCard('c21Quarter')}
          onOpenDetail={() => onOpenDetail && onOpenDetail({
            chartKey: 'unit_struct_quarter',
            chartTitle: `Cơ cấu doanh thu TH theo từng đơn vị – ${quarterText}`
          })}
        />
      </div>

      {/* DÒNG 2: NĂM - CƠ CẤU DOANH THU TH THEO TỪNG ĐƠN VỊ (BIỂU ĐỒ 21) */}
      <div className="month-row-grid">
        <UnitStructureSubcard
          title={`Cơ cấu doanh thu TH theo từng đơn vị – Năm ${activeYear}`}
          tag="Hàng 2 - Khu 1"
          chart={data21.thYear}
          planItems={data22.year.items}
          hoveredSlice={hoveredSlice}
          setHoveredSlice={setHoveredSlice}
          cardKey="u21-year"
          isVisible={visibleCards.c21Year}
          onToggle={() => toggleCard('c21Year')}
          onOpenDetail={() => onOpenDetail && onOpenDetail({
            chartKey: 'unit_struct_year',
            chartTitle: `Cơ cấu doanh thu TH theo từng đơn vị – Năm ${activeYear}`
          })}
        />
      </div>

      {/* DÒNG 3: THÁNG & QUÝ - THỰC HIỆN SO VỚI KẾ HOẠCH THEO ĐƠN VỊ (BIỂU ĐỒ 22) */}
      <div className="month-row-grid">
        <UnitPlanSubcard
          title={`Biểu đồ 22. Thực hiện Tháng ${monthNum}/${activeYear} so với kế hoạch Tháng ${monthNum}/${activeYear} theo đơn vị`}
          tag="Hàng 3 - Khu 1"
          data={data22.month}
          cardKey="u22-month"
          isVisible={visibleCards.c22Month}
          onToggle={() => toggleCard('c22Month')}
          onOpenDetail={() => onOpenDetail && onOpenDetail({
            chartKey: 'unit_plan_month',
            chartTitle: `Biểu đồ 22. Thực hiện Tháng ${monthNum}/${activeYear} so với kế hoạch Tháng ${monthNum}/${activeYear} theo đơn vị`
          })}
        />

        <UnitPlanSubcard
          title={`Biểu đồ 22. Ước thực hiện ${quarterText} so với kế hoạch ${quarterText} theo đơn vị`}
          tag="Hàng 3 - Khu 2"
          data={data22.quarter}
          cardKey="u22-quarter"
          isVisible={visibleCards.c22Quarter}
          onToggle={() => toggleCard('c22Quarter')}
          onOpenDetail={() => onOpenDetail && onOpenDetail({
            chartKey: 'unit_plan_quarter',
            chartTitle: `Biểu đồ 22. Ước thực hiện ${quarterText} so với kế hoạch ${quarterText} theo đơn vị`
          })}
        />
      </div>

      {/* DÒNG 4: NĂM - THỰC HIỆN SO VỚI KẾ HOẠCH THEO ĐƠN VỊ (BIỂU ĐỒ 22) */}
      <div className="month-row-grid">
        <UnitPlanSubcard
          title={`Biểu đồ 22. Ước thực hiện năm ${activeYear} so với kế hoạch năm ${activeYear} theo đơn vị`}
          tag="Hàng 4 - Khu 1"
          data={data22.year}
          cardKey="u22-year"
          isVisible={visibleCards.c22Year}
          onToggle={() => toggleCard('c22Year')}
          onOpenDetail={() => onOpenDetail && onOpenDetail({
            chartKey: 'unit_plan_year',
            chartTitle: `Biểu đồ 22. Ước thực hiện năm ${activeYear} so với kế hoạch năm ${activeYear} theo đơn vị`
          })}
        />
      </div>

      {/* DÒNG 5: THÁNG & QUÝ (BIỂU ĐỒ 23 - SO VỚI KỲ TRƯỚC THEO ĐƠN VỊ) */}
      <div className="month-row-grid">
        <UnitPrevPeriodSubcard
          title={prevMonthTitle}
          tag="Hàng 5 - Khu 1"
          data={data23.month}
          cardKey="u23-month"
          isVisible={visibleCards.c23Month}
          onToggle={() => toggleCard('c23Month')}
          onOpenDetail={() => onOpenDetail && onOpenDetail({
            chartKey: 'unit_prev_month',
            chartTitle: prevMonthTitle
          })}
        />

        <UnitPrevPeriodSubcard
          title={prevQuarterTitle}
          tag="Hàng 5 - Khu 2"
          data={data23.quarter}
          cardKey="u23-quarter"
          isVisible={visibleCards.c23Quarter}
          onToggle={() => toggleCard('c23Quarter')}
          onOpenDetail={() => onOpenDetail && onOpenDetail({
            chartKey: 'unit_prev_quarter',
            chartTitle: prevQuarterTitle
          })}
        />
      </div>

      {/* DÒNG 6: NĂM (BIỂU ĐỒ 23 - SO VỚI KỲ TRƯỚC THEO ĐƠN VỊ) */}
      <div className="month-row-grid">
        <UnitPrevPeriodSubcard
          title={prevYearTitle}
          tag="Hàng 6"
          data={data23.year}
          cardKey="u23-year"
          isVisible={visibleCards.c23Year}
          onToggle={() => toggleCard('c23Year')}
          onOpenDetail={() => onOpenDetail && onOpenDetail({
            chartKey: 'unit_prev_year',
            chartTitle: prevYearTitle
          })}
        />
      </div>
    </div>
  );
}
