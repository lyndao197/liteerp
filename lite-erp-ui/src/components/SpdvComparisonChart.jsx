import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Eye, EyeOff, ArrowRight } from 'lucide-react';
import './SpdvComparisonChart.css';
import './MonthComparisonChart.css';
import { SPDV_STRUCTURE_DATA, getSpdvBarComparisonData, getSpdvYoyComparisonData, getSpdvPrevPeriodComparisonData } from '../data/revenueSpdvData';

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
                const compSlice = compareChart?.slices?.find((s) => s.name === slice.name);
                let sliceDelta = null;
                if (compSlice && compSlice.value > 0 && slice.value !== undefined && slice.value !== null) {
                  sliceDelta = ((slice.value - compSlice.value) / compSlice.value) * 100;
                }
                setHoveredSlice({
                  cardKey,
                  sliceName: slice.name,
                  percent: slice.percent,
                  value: slice.value,
                  color: slice.color,
                  delta: sliceDelta !== null ? sliceDelta.toFixed(1).replace('.', ',') : null,
                  isDeltaPositive: sliceDelta !== null ? sliceDelta >= 0 : null
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
              <div className="tooltip-stat-row" style={{ borderTop: '1px dashed #e2e8f0', paddingTop: '4px', marginTop: '4px' }}>
                <span>% Delta:</span>
                <strong style={{ color: hoveredSlice.delta ? (hoveredSlice.isDeltaPositive ? '#16a34a' : '#dc2626') : '#64748b' }}>
                  {hoveredSlice.delta ? `${hoveredSlice.isDeltaPositive ? '+' : ''}${hoveredSlice.delta}%` : '-'}
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
      <div className="month-subcard-header">
        <h3 className="month-subcard-title" title={title}>{title}</h3>
        <div className="month-subcard-header-actions">
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
              <span style={{ color: '#64748b', fontWeight: '600' }}>{legendKh}:</span>
              <strong>{hoveredItem.kh.toFixed(1)} Tỷ đ</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', marginBottom: '3px' }}>
              <span style={{ color: '#e11d48', fontWeight: '600' }}>{legendTh}:</span>
              <strong>{hoveredItem.th.toFixed(1)} Tỷ đ</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', paddingTop: '4px', borderTop: '1px solid #e2e8f0' }}>
              <span>% HTKH:</span>
              <strong style={{ color: hoveredItem.isRatePositive ? '#16a34a' : '#dc2626' }}>
                {hoveredItem.rate}
              </strong>
            </div>
            {(() => {
              const deltaNum = (hoveredItem.th !== null && hoveredItem.kh !== null && hoveredItem.kh > 0)
                ? ((hoveredItem.th - hoveredItem.kh) / hoveredItem.kh * 100)
                : null;
              return (
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', paddingTop: '3px' }}>
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
// Component Biểu đồ 19: Doanh thu 6 nhóm SPDV so với cùng kỳ năm trước
// 3 panels side-by-side: Tháng, Quý, Lũy kế (theo ảnh thiết kế mockup)
// ==============================================================================
function SpdvYoyThreePanelCard({
  year = '2026',
  month = 'Tháng 8',
  onOpenDetail
}) {
  const [hoveredInfo, setHoveredInfo] = useState(null);
  const data = getSpdvYoyComparisonData(year, month);

  const monthItems = data.monthItems || [];
  const quarterItems = data.quarterItems || [];
  const yearItems = data.yearItems || [];

  return (
    <div className="spdv-yoy-card-container">
      {/* Header */}
      <div className="spdv-yoy-header">
        <div className="spdv-yoy-title-area">
          <h3 className="spdv-yoy-main-title">
            Biểu đồ 19. Doanh thu 6 nhóm SPDV so với cùng kỳ năm trước
          </h3>
          <div className="spdv-yoy-sub-basis">
            <strong>Cơ sở so sánh:</strong> Tháng: {data.monthBasis} | Quý: {data.quarterBasis} | Năm: {data.yearBasis}
          </div>
          <div className="spdv-yoy-sub-desc">
            Biểu đồ 19. Doanh thu 6 nhóm SPDV so với cùng kỳ năm trước (số %: TH/cùng kỳ)
          </div>
        </div>

        <div className="spdv-yoy-actions">
          <span className="month-subcard-tag">Biểu đồ 19</span>
          {onOpenDetail && (
            <button
              type="button"
              className="subcard-detail-action-btn"
              title="Xem bảng chi tiết"
              onClick={() => onOpenDetail({
                chartKey: 'spdv_yoy_comparison',
                chartTitle: 'Biểu đồ 19. Doanh thu 6 nhóm SPDV so với cùng kỳ năm trước'
              })}
            >
              <span>Xem chi tiết</span>
              <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>

      {/* 3 Panels Side-by-Side */}
      <div className="spdv-yoy-panels-grid">
        {/* Panel 1: Tháng */}
        <div className="spdv-yoy-panel-wrap">
          <svg viewBox="0 0 395 285" className="spdv-yoy-panel-svg">
            {/* Title */}
            <text x={245} y={19} textAnchor="middle" style={{ fontSize: '13px', fontWeight: '700', fill: '#1e293b' }}>
              {data.monthTitle}
            </text>

            {/* Left Y Axis */}
            <line x1={118} y1={32} x2={118} y2={234} stroke="#334155" strokeWidth={1.5} />
            {/* Bottom X Axis */}
            <line x1={118} y1={234} x2={365} y2={234} stroke="#334155" strokeWidth={1.5} />

            {/* Ticks */}
            {data.monthTicks.map((t) => {
              const x = 118 + (t / data.monthMax) * 235;
              return (
                <g key={`m-t-${t}`}>
                  <line x1={x} y1={234} x2={x} y2={239} stroke="#64748b" strokeWidth={1} />
                  <text x={x} y={249} textAnchor="middle" style={{ fontSize: '9px', fill: '#475569', fontWeight: '500' }}>
                    {t}
                  </text>
                </g>
              );
            })}
            <text x={235} y={262} textAnchor="middle" style={{ fontSize: '9.5px', fill: '#64748b', fontWeight: '500' }}>
              Tỷ đồng
            </text>

            {/* Bars */}
            {monthItems.map((item, idx) => {
              const y = 42 + idx * 31;
              const wCurr = Math.max((item.curr / data.monthMax) * 235, 2);
              const wPrev = Math.max((item.prev / data.monthMax) * 235, 2);
              const maxW = Math.max(wCurr, wPrev);
              const isHovered = hoveredInfo?.id === item.id && hoveredInfo?.period === 'month';

              return (
                <g
                  key={item.id}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredInfo({ ...item, period: 'month', pTitle: data.monthTitle, currLabel: data.monthLegendCurr, prevLabel: data.monthLegendPrev })}
                  onMouseLeave={() => setHoveredInfo(null)}
                >
                  {/* Category Name */}
                  <text
                    x={112}
                    y={y + 8}
                    textAnchor="end"
                    style={{ fontSize: '10px', fontWeight: isHovered ? '700' : '600', fill: isHovered ? '#1d4370' : '#334155' }}
                  >
                    {item.name}
                  </text>

                  {/* Curr Bar (Dark Blue) */}
                  <rect x={118} y={y} width={wCurr} height={7.5} fill="#1d4370" rx={1} />
                  {/* Prev Bar (Light Blue) */}
                  <rect x={118} y={y + 9} width={wPrev} height={7.5} fill="#9cb9dc" rx={1} />

                  {/* % Label */}
                  <text
                    x={118 + maxW + 4}
                    y={y + 11}
                    textAnchor="start"
                    style={{
                      fontSize: '9.5px',
                      fontWeight: '700',
                      fill: item.isRatePositive ? '#15803d' : '#dc2626'
                    }}
                  >
                    {item.rate}
                  </text>
                </g>
              );
            })}

            {/* Legend */}
            <g transform="translate(210, 269)">
              <rect x={0} y={0} width={14} height={7} fill="#1d4370" rx={1} />
              <text x={18} y={7} style={{ fontSize: '9px', fontWeight: '600', fill: '#334155' }}>
                {data.monthLegendCurr}
              </text>
              <rect x={65} y={0} width={14} height={7} fill="#9cb9dc" rx={1} />
              <text x={83} y={7} style={{ fontSize: '9px', fontWeight: '600', fill: '#334155' }}>
                {data.monthLegendPrev}
              </text>
            </g>
          </svg>
        </div>

        {/* Panel 2: Quý */}
        <div className="spdv-yoy-panel-wrap">
          <svg viewBox="0 0 315 285" className="spdv-yoy-panel-svg">
            {/* Title */}
            <text x={155} y={19} textAnchor="middle" style={{ fontSize: '13px', fontWeight: '700', fill: '#1e293b' }}>
              {data.quarterTitle}
            </text>

            {/* Left Y Axis */}
            <line x1={20} y1={32} x2={20} y2={234} stroke="#334155" strokeWidth={1.5} />
            {/* Bottom X Axis */}
            <line x1={20} y1={234} x2={290} y2={234} stroke="#334155" strokeWidth={1.5} />

            {/* Ticks */}
            {data.quarterTicks.map((t) => {
              const x = 20 + (t / data.quarterMax) * 255;
              return (
                <g key={`q-t-${t}`}>
                  <line x1={x} y1={234} x2={x} y2={239} stroke="#64748b" strokeWidth={1} />
                  <text x={x} y={249} textAnchor="middle" style={{ fontSize: '9px', fill: '#475569', fontWeight: '500' }}>
                    {t}
                  </text>
                </g>
              );
            })}
            <text x={155} y={262} textAnchor="middle" style={{ fontSize: '9.5px', fill: '#64748b', fontWeight: '500' }}>
              Tỷ đồng
            </text>

            {/* Bars */}
            {quarterItems.map((item, idx) => {
              const y = 42 + idx * 31;
              const wCurr = Math.max((item.curr / data.quarterMax) * 255, 2);
              const wPrev = Math.max((item.prev / data.quarterMax) * 255, 2);
              const maxW = Math.max(wCurr, wPrev);

              return (
                <g
                  key={item.id}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredInfo({ ...item, period: 'quarter', pTitle: data.quarterTitle, currLabel: data.quarterLegendCurr, prevLabel: data.quarterLegendPrev })}
                  onMouseLeave={() => setHoveredInfo(null)}
                >
                  {/* Curr Bar (Dark Blue) */}
                  <rect x={20} y={y} width={wCurr} height={7.5} fill="#1d4370" rx={1} />
                  {/* Prev Bar (Light Blue) */}
                  <rect x={20} y={y + 9} width={wPrev} height={7.5} fill="#9cb9dc" rx={1} />

                  {/* % Label */}
                  <text
                    x={20 + maxW + 4}
                    y={y + 11}
                    textAnchor="start"
                    style={{
                      fontSize: '9.5px',
                      fontWeight: '700',
                      fill: item.isRatePositive ? '#15803d' : '#dc2626'
                    }}
                  >
                    {item.rate}
                  </text>
                </g>
              );
            })}

            {/* Legend */}
            <g transform="translate(120, 269)">
              <rect x={0} y={0} width={14} height={7} fill="#1d4370" rx={1} />
              <text x={18} y={7} style={{ fontSize: '9px', fontWeight: '600', fill: '#334155' }}>
                {data.quarterLegendCurr}
              </text>
              <rect x={82} y={0} width={14} height={7} fill="#9cb9dc" rx={1} />
              <text x={100} y={7} style={{ fontSize: '9px', fontWeight: '600', fill: '#334155' }}>
                {data.quarterLegendPrev}
              </text>
            </g>
          </svg>
        </div>

        {/* Panel 3: Năm / Lũy kế */}
        <div className="spdv-yoy-panel-wrap">
          <svg viewBox="0 0 315 285" className="spdv-yoy-panel-svg">
            {/* Title */}
            <text x={155} y={19} textAnchor="middle" style={{ fontSize: '13px', fontWeight: '700', fill: '#1e293b' }}>
              {data.yearTitle}
            </text>

            {/* Left Y Axis */}
            <line x1={20} y1={32} x2={20} y2={234} stroke="#334155" strokeWidth={1.5} />
            {/* Bottom X Axis */}
            <line x1={20} y1={234} x2={290} y2={234} stroke="#334155" strokeWidth={1.5} />

            {/* Ticks */}
            {data.yearTicks.map((t) => {
              const x = 20 + (t / data.yearMax) * 255;
              return (
                <g key={`y-t-${t}`}>
                  <line x1={x} y1={234} x2={x} y2={239} stroke="#64748b" strokeWidth={1} />
                  <text x={x} y={249} textAnchor="middle" style={{ fontSize: '9px', fill: '#475569', fontWeight: '500' }}>
                    {t}
                  </text>
                </g>
              );
            })}
            <text x={155} y={262} textAnchor="middle" style={{ fontSize: '9.5px', fill: '#64748b', fontWeight: '500' }}>
              Tỷ đồng
            </text>

            {/* Bars */}
            {yearItems.map((item, idx) => {
              const y = 42 + idx * 31;
              const wCurr = Math.max((item.curr / data.yearMax) * 255, 2);
              const wPrev = Math.max((item.prev / data.yearMax) * 255, 2);
              const maxW = Math.max(wCurr, wPrev);

              return (
                <g
                  key={item.id}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredInfo({ ...item, period: 'year', pTitle: data.yearTitle, currLabel: data.yearLegendCurr, prevLabel: data.yearLegendPrev })}
                  onMouseLeave={() => setHoveredInfo(null)}
                >
                  {/* Curr Bar (Dark Blue) */}
                  <rect x={20} y={y} width={wCurr} height={7.5} fill="#1d4370" rx={1} />
                  {/* Prev Bar (Light Blue) */}
                  <rect x={20} y={y + 9} width={wPrev} height={7.5} fill="#9cb9dc" rx={1} />

                  {/* % Label */}
                  <text
                    x={20 + maxW + 4}
                    y={y + 11}
                    textAnchor="start"
                    style={{
                      fontSize: '9.5px',
                      fontWeight: '700',
                      fill: item.isRatePositive ? '#15803d' : '#dc2626'
                    }}
                  >
                    {item.rate}
                  </text>
                </g>
              );
            })}

            {/* Legend */}
            <g transform="translate(125, 269)">
              <rect x={0} y={0} width={14} height={7} fill="#1d4370" rx={1} />
              <text x={18} y={7} style={{ fontSize: '9px', fontWeight: '600', fill: '#334155' }}>
                {data.yearLegendCurr}
              </text>
              <rect x={76} y={0} width={14} height={7} fill="#9cb9dc" rx={1} />
              <text x={94} y={7} style={{ fontSize: '9px', fontWeight: '600', fill: '#334155' }}>
                {data.yearLegendPrev}
              </text>
            </g>
          </svg>
        </div>
      </div>

      {/* Floating Hover Tooltip */}
      {hoveredInfo && (
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            padding: '10px 14px',
            boxShadow: '0 6px 16px -2px rgba(0, 0, 0, 0.12)',
            fontSize: '12px',
            maxWidth: '300px',
            marginTop: '4px'
          }}
        >
          <div style={{ fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>
            {hoveredInfo.name} ({hoveredInfo.pTitle})
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', marginBottom: '3px' }}>
            <span style={{ color: '#1d4370', fontWeight: '600' }}>{hoveredInfo.currLabel}:</span>
            <strong>{hoveredInfo.curr.toFixed(1)} Tỷ đồng</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', marginBottom: '3px' }}>
            <span style={{ color: '#64748b', fontWeight: '600' }}>{hoveredInfo.prevLabel}:</span>
            <strong>{hoveredInfo.prev.toFixed(1)} Tỷ đồng</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', paddingTop: '4px', borderTop: '1px solid #e2e8f0' }}>
            <span>Tỷ lệ TH / Cùng kỳ:</span>
            <strong style={{ color: hoveredInfo.isRatePositive ? '#16a34a' : '#dc2626' }}>
              {hoveredInfo.rate}
            </strong>
          </div>
          {(() => {
            const deltaNum = (hoveredInfo.curr !== null && hoveredInfo.prev !== null && hoveredInfo.prev > 0)
              ? ((hoveredInfo.curr - hoveredInfo.prev) / hoveredInfo.prev * 100)
              : null;
            return (
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', paddingTop: '3px' }}>
                <span>% Delta:</span>
                <strong style={{ color: deltaNum !== null ? (deltaNum >= 0 ? '#16a34a' : '#dc2626') : '#64748b' }}>
                  {deltaNum !== null ? `${deltaNum >= 0 ? '+' : ''}${deltaNum.toFixed(1).replace('.', ',')}%` : '-'}
                </strong>
              </div>
            );
          })()}
        </div>
      )}

      {/* Bottom Note */}
      <div className="spdv-yoy-bottom-note">
        <strong>Nhận xét:</strong> {data.note}
      </div>
    </div>
  );
}

// ==============================================================================
// Component Biểu đồ 20: Doanh thu 6 nhóm SPDV so với kỳ trước
// 3 panels side-by-side: Tháng (T8 vs T7), Quý (Q3 vs Q2), Năm (2026 vs 2025)
// ==============================================================================
function SpdvPrevPeriodThreePanelCard({
  year = '2026',
  month = 'Tháng 8',
  onOpenDetail
}) {
  const [hoveredInfo, setHoveredInfo] = useState(null);
  const data = getSpdvPrevPeriodComparisonData(year, month);

  const monthItems = data.monthItems || [];
  const quarterItems = data.quarterItems || [];
  const yearItems = data.yearItems || [];

  return (
    <div className="spdv-yoy-card-container">
      {/* Header */}
      <div className="spdv-yoy-header">
        <div className="spdv-yoy-title-area">
          <h3 className="spdv-yoy-main-title">
            Biểu đồ 20. Doanh thu 6 nhóm SPDV so với kỳ trước
          </h3>
          <div className="spdv-yoy-sub-basis">
            <strong>Cơ sở so sánh:</strong> Tháng: {data.monthBasis} | Quý: {data.quarterBasis} | Năm: {data.yearBasis}
          </div>
          <div className="spdv-yoy-sub-desc">
            Biểu đồ 20. Doanh thu 6 nhóm SPDV so với kỳ trước (số %: TH/kỳ trước)
          </div>
        </div>

        <div className="spdv-yoy-actions">
          <span className="month-subcard-tag">Biểu đồ 20</span>
          {onOpenDetail && (
            <button
              type="button"
              className="subcard-detail-action-btn"
              title="Xem bảng chi tiết"
              onClick={() => onOpenDetail({
                chartKey: 'spdv_prev_period',
                chartTitle: 'Biểu đồ 20. Doanh thu 6 nhóm SPDV so với kỳ trước'
              })}
            >
              <span>Xem chi tiết</span>
              <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>

      {/* 3 Panels Side-by-Side */}
      <div className="spdv-yoy-panels-grid">
        {/* Panel 1: Tháng */}
        <div className="spdv-yoy-panel-wrap">
          <svg viewBox="0 0 395 285" className="spdv-yoy-panel-svg">
            <text x={245} y={19} textAnchor="middle" style={{ fontSize: '13px', fontWeight: '700', fill: '#1e293b' }}>
              {data.monthTitle}
            </text>

            <line x1={118} y1={32} x2={118} y2={234} stroke="#334155" strokeWidth={1.5} />
            <line x1={118} y1={234} x2={365} y2={234} stroke="#334155" strokeWidth={1.5} />

            {data.monthTicks.map((t) => {
              const x = 118 + (t / data.monthMax) * 235;
              return (
                <g key={`pp-m-t-${t}`}>
                  <line x1={x} y1={234} x2={x} y2={239} stroke="#64748b" strokeWidth={1} />
                  <text x={x} y={249} textAnchor="middle" style={{ fontSize: '9px', fill: '#475569', fontWeight: '500' }}>
                    {t}
                  </text>
                </g>
              );
            })}
            <text x={235} y={262} textAnchor="middle" style={{ fontSize: '9.5px', fill: '#64748b', fontWeight: '500' }}>
              Tỷ đồng
            </text>

            {monthItems.map((item, idx) => {
              const y = 42 + idx * 31;
              const wCurr = Math.max((item.curr / data.monthMax) * 235, 2);
              const wPrev = Math.max((item.prev / data.monthMax) * 235, 2);
              const maxW = Math.max(wCurr, wPrev);
              const isHovered = hoveredInfo?.id === item.id && hoveredInfo?.period === 'month';

              return (
                <g
                  key={item.id}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredInfo({ ...item, period: 'month', pTitle: data.monthTitle, currLabel: data.monthLegendCurr, prevLabel: data.monthLegendPrev })}
                  onMouseLeave={() => setHoveredInfo(null)}
                >
                  <text
                    x={112}
                    y={y + 8}
                    textAnchor="end"
                    style={{ fontSize: '10px', fontWeight: isHovered ? '700' : '600', fill: isHovered ? '#1d4370' : '#334155' }}
                  >
                    {item.name}
                  </text>

                  <rect x={118} y={y} width={wCurr} height={7.5} fill="#1d4370" rx={1} />
                  <rect x={118} y={y + 9} width={wPrev} height={7.5} fill="#9cb9dc" rx={1} />

                  <text
                    x={118 + maxW + 4}
                    y={y + 11}
                    textAnchor="start"
                    style={{
                      fontSize: '9.5px',
                      fontWeight: '700',
                      fill: item.isRatePositive ? '#15803d' : '#dc2626'
                    }}
                  >
                    {item.rate}
                  </text>
                </g>
              );
            })}

            <g transform="translate(225, 269)">
              <rect x={0} y={0} width={14} height={7} fill="#1d4370" rx={1} />
              <text x={18} y={7} style={{ fontSize: '9px', fontWeight: '600', fill: '#334155' }}>
                {data.monthLegendCurr}
              </text>
              <rect x={60} y={0} width={14} height={7} fill="#9cb9dc" rx={1} />
              <text x={78} y={7} style={{ fontSize: '9px', fontWeight: '600', fill: '#334155' }}>
                {data.monthLegendPrev}
              </text>
            </g>
          </svg>
        </div>

        {/* Panel 2: Quý */}
        <div className="spdv-yoy-panel-wrap">
          <svg viewBox="0 0 315 285" className="spdv-yoy-panel-svg">
            <text x={155} y={19} textAnchor="middle" style={{ fontSize: '13px', fontWeight: '700', fill: '#1e293b' }}>
              {data.quarterTitle}
            </text>

            <line x1={20} y1={32} x2={20} y2={234} stroke="#334155" strokeWidth={1.5} />
            <line x1={20} y1={234} x2={290} y2={234} stroke="#334155" strokeWidth={1.5} />

            {data.quarterTicks.map((t) => {
              const x = 20 + (t / data.quarterMax) * 255;
              return (
                <g key={`pp-q-t-${t}`}>
                  <line x1={x} y1={234} x2={x} y2={239} stroke="#64748b" strokeWidth={1} />
                  <text x={x} y={249} textAnchor="middle" style={{ fontSize: '9px', fill: '#475569', fontWeight: '500' }}>
                    {t}
                  </text>
                </g>
              );
            })}
            <text x={155} y={262} textAnchor="middle" style={{ fontSize: '9.5px', fill: '#64748b', fontWeight: '500' }}>
              Tỷ đồng
            </text>

            {quarterItems.map((item, idx) => {
              const y = 42 + idx * 31;
              const wCurr = Math.max((item.curr / data.quarterMax) * 255, 2);
              const wPrev = Math.max((item.prev / data.quarterMax) * 255, 2);
              const maxW = Math.max(wCurr, wPrev);

              return (
                <g
                  key={item.id}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredInfo({ ...item, period: 'quarter', pTitle: data.quarterTitle, currLabel: data.quarterLegendCurr, prevLabel: data.quarterLegendPrev })}
                  onMouseLeave={() => setHoveredInfo(null)}
                >
                  <rect x={20} y={y} width={wCurr} height={7.5} fill="#1d4370" rx={1} />
                  <rect x={20} y={y + 9} width={wPrev} height={7.5} fill="#9cb9dc" rx={1} />

                  <text
                    x={20 + maxW + 4}
                    y={y + 11}
                    textAnchor="start"
                    style={{
                      fontSize: '9.5px',
                      fontWeight: '700',
                      fill: item.isRatePositive ? '#15803d' : '#dc2626'
                    }}
                  >
                    {item.rate}
                  </text>
                </g>
              );
            })}

            <g transform="translate(130, 269)">
              <rect x={0} y={0} width={14} height={7} fill="#1d4370" rx={1} />
              <text x={18} y={7} style={{ fontSize: '9px', fontWeight: '600', fill: '#334155' }}>
                {data.quarterLegendCurr}
              </text>
              <rect x={70} y={0} width={14} height={7} fill="#9cb9dc" rx={1} />
              <text x={88} y={7} style={{ fontSize: '9px', fontWeight: '600', fill: '#334155' }}>
                {data.quarterLegendPrev}
              </text>
            </g>
          </svg>
        </div>

        {/* Panel 3: Năm */}
        <div className="spdv-yoy-panel-wrap">
          <svg viewBox="0 0 315 285" className="spdv-yoy-panel-svg">
            <text x={155} y={19} textAnchor="middle" style={{ fontSize: '13px', fontWeight: '700', fill: '#1e293b' }}>
              {data.yearTitle}
            </text>

            <line x1={20} y1={32} x2={20} y2={234} stroke="#334155" strokeWidth={1.5} />
            <line x1={20} y1={234} x2={290} y2={234} stroke="#334155" strokeWidth={1.5} />

            {data.yearTicks.map((t) => {
              const x = 20 + (t / data.yearMax) * 255;
              return (
                <g key={`pp-y-t-${t}`}>
                  <line x1={x} y1={234} x2={x} y2={239} stroke="#64748b" strokeWidth={1} />
                  <text x={x} y={249} textAnchor="middle" style={{ fontSize: '9px', fill: '#475569', fontWeight: '500' }}>
                    {t}
                  </text>
                </g>
              );
            })}
            <text x={155} y={262} textAnchor="middle" style={{ fontSize: '9.5px', fill: '#64748b', fontWeight: '500' }}>
              Tỷ đồng
            </text>

            {yearItems.map((item, idx) => {
              const y = 42 + idx * 31;
              const wCurr = Math.max((item.curr / data.yearMax) * 255, 2);
              const wPrev = Math.max((item.prev / data.yearMax) * 255, 2);
              const maxW = Math.max(wCurr, wPrev);

              return (
                <g
                  key={item.id}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredInfo({ ...item, period: 'year', pTitle: data.yearTitle, currLabel: data.yearLegendCurr, prevLabel: data.yearLegendPrev })}
                  onMouseLeave={() => setHoveredInfo(null)}
                >
                  <rect x={20} y={y} width={wCurr} height={7.5} fill="#1d4370" rx={1} />
                  <rect x={20} y={y + 9} width={wPrev} height={7.5} fill="#9cb9dc" rx={1} />

                  <text
                    x={20 + maxW + 4}
                    y={y + 11}
                    textAnchor="start"
                    style={{
                      fontSize: '9.5px',
                      fontWeight: '700',
                      fill: item.isRatePositive ? '#15803d' : '#dc2626'
                    }}
                  >
                    {item.rate}
                  </text>
                </g>
              );
            })}

            <g transform="translate(120, 269)">
              <rect x={0} y={0} width={14} height={7} fill="#1d4370" rx={1} />
              <text x={18} y={7} style={{ fontSize: '9px', fontWeight: '600', fill: '#334155' }}>
                {data.yearLegendCurr}
              </text>
              <rect x={76} y={0} width={14} height={7} fill="#9cb9dc" rx={1} />
              <text x={94} y={7} style={{ fontSize: '9px', fontWeight: '600', fill: '#334155' }}>
                {data.yearLegendPrev}
              </text>
            </g>
          </svg>
        </div>
      </div>

      {/* Floating Hover Tooltip */}
      {hoveredInfo && (
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            padding: '10px 14px',
            boxShadow: '0 6px 16px -2px rgba(0, 0, 0, 0.12)',
            fontSize: '12px',
            maxWidth: '300px',
            marginTop: '4px'
          }}
        >
          <div style={{ fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>
            {hoveredInfo.name} ({hoveredInfo.pTitle})
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', marginBottom: '3px' }}>
            <span style={{ color: '#1d4370', fontWeight: '600' }}>{hoveredInfo.currLabel}:</span>
            <strong>{hoveredInfo.curr.toFixed(1)} Tỷ đồng</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', marginBottom: '3px' }}>
            <span style={{ color: '#64748b', fontWeight: '600' }}>{hoveredInfo.prevLabel}:</span>
            <strong>{hoveredInfo.prev.toFixed(1)} Tỷ đồng</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', paddingTop: '4px', borderTop: '1px solid #e2e8f0' }}>
            <span>Tỷ lệ TH / Kỳ trước:</span>
            <strong style={{ color: hoveredInfo.isRatePositive ? '#16a34a' : '#dc2626' }}>
              {hoveredInfo.rate}
            </strong>
          </div>
          {(() => {
            const deltaNum = (hoveredInfo.curr !== null && hoveredInfo.prev !== null && hoveredInfo.prev > 0)
              ? ((hoveredInfo.curr - hoveredInfo.prev) / hoveredInfo.prev * 100)
              : null;
            return (
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', paddingTop: '3px' }}>
                <span>% Delta:</span>
                <strong style={{ color: deltaNum !== null ? (deltaNum >= 0 ? '#16a34a' : '#dc2626') : '#64748b' }}>
                  {deltaNum !== null ? `${deltaNum >= 0 ? '+' : ''}${deltaNum.toFixed(1).replace('.', ',')}%` : '-'}
                </strong>
              </div>
            );
          })()}
        </div>
      )}

      {/* Bottom Note */}
      <div className="spdv-yoy-bottom-note">
        <strong>Nhận xét:</strong> {data.note}
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
  const quarterRoman = `${quarterNumber}`;
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
          subtitle={khSubtitle}
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
          subtitle={thSubtitle}
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
          subtitle={khSubtitle}
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
          subtitle={thSubtitle}
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
          subtitle={khSubtitle}
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
          title={`Biểu đồ 18. Doanh thu 6 nhóm SPDV so với KH – ${barData.monthTitle}`}
          tag="Hàng 4 - Khu 1"
          legendTh={`TH ${barData.monthTitle?.replace('Tháng ', 'T')}`}
          legendKh={`KH ${barData.monthTitle?.replace('Tháng ', 'T')}`}
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
          legendTh={`Ước TH ${barData.quarterTitle?.replace(/Quý\s*(III|3)/, 'Q3')?.replace(/Quý\s*(II|2)/, 'Q2')?.replace(/Quý\s*(IV|4)/, 'Q4')?.replace(/Quý\s*(I|1)/, 'Q1')}`}
          legendKh={`KH ${barData.quarterTitle?.replace(/Quý\s*(III|3)/, 'Q3')?.replace(/Quý\s*(II|2)/, 'Q2')?.replace(/Quý\s*(IV|4)/, 'Q4')?.replace(/Quý\s*(I|1)/, 'Q1')}`}
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

      {/* DÒNG 5: BIỂU ĐỒ 18 - NĂM */}
      <div className="month-row-grid">
        <SpdvBarSubcard
          title={`Biểu đồ 18. Doanh thu 6 nhóm SPDV so với KH – ${barData.yearTitle}`}
          tag="Hàng 5"
          legendTh={`Ước TH ${barData.yearTitle?.replace('Năm ', '')}`}
          legendKh={`KH ${barData.yearTitle?.replace('Năm ', '')}`}
          maxVal={barData.yearMax}
          ticks={barData.yearTicks}
          items={barData.yearItems}
          cardKey="year"
          onOpenDetail={() => onOpenDetail && onOpenDetail({
            chartKey: 'spdv_bar_year',
            chartTitle: `Biểu đồ 18. Doanh thu 6 nhóm SPDV so với KH – ${barData.yearTitle}`
          })}
        />
      </div>

      {/* DÒNG 6: BIỂU ĐỒ 19 - DOANH THU 6 NHÓM SPDV SO VỚI CÙNG KỲ NĂM TRƯỚC (3 HÌNH TRONG 1 BẢN THIẾT KẾ ĐẸP MẮT) */}
      <SpdvYoyThreePanelCard
        year={activeYear}
        month={activeMonth}
        onOpenDetail={onOpenDetail}
      />

      {/* DÒNG 7: BIỂU ĐỒ 20 - DOANH THU 6 NHÓM SPDV SO VỚI KỲ TRƯỚC (3 HÌNH TRONG 1 BẢN THIẾT KẾ ĐẸP MẮT) */}
      <SpdvPrevPeriodThreePanelCard
        year={activeYear}
        month={activeMonth}
        onOpenDetail={onOpenDetail}
      />
    </div>
  );
}
