import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Eye, EyeOff } from 'lucide-react';
import './SpdvComparisonChart.css';
import './MonthComparisonChart.css';
import { SPDV_CATEGORIES, SPDV_STRUCTURE_DATA } from '../data/revenueSpdvData';

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

        {/* Center label */}
        <text
          x={cx}
          y={cy + 4}
          textAnchor="middle"
          style={{
            fontSize: centerLabel && centerLabel.length > 10 ? '12.5px' : '14.5px',
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
  isVisible = false,
  onToggle
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
              backgroundColor: tagType === 'th' ? '#2563eb' : '#e11d48',
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
          <button
            type="button"
            className="chart-view-toggle-btn"
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            title={isVisible ? 'Thu gọn biểu đồ' : 'Mở rộng biểu đồ'}
            aria-label={isVisible ? 'Thu gọn biểu đồ' : 'Mở rộng biểu đồ'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '26px',
              height: '26px',
              padding: 0,
              background: 'none',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer'
            }}
          >
            {isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
          <button
            type="button"
            className="chart-view-toggle-btn"
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            title={isVisible ? 'Thu gọn biểu đồ' : 'Mở rộng biểu đồ'}
            aria-label={isVisible ? 'Thu gọn biểu đồ' : 'Mở rộng biểu đồ'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '26px',
              height: '26px',
              padding: 0,
              background: 'none',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer'
            }}
          >
            {isVisible ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {isVisible && (
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
  onVisibleCardsChange
}) {
  const [internalYear, setInternalYear] = useState('2026');
  const [internalMonth, setInternalMonth] = useState('Tháng 8');
  const [hoveredSlice, setHoveredSlice] = useState(null);

  // Independent toggle states for each of the 6 subcards (default collapsed matching screenshot)
  const [internalVisibleCards, setInternalVisibleCards] = useState({
    thMonth: false,
    khMonth: false,
    thQuarter: false,
    khQuarter: false,
    thYear: false,
    khYear: false
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
        />
      </div>

      {/* CHÚ THÍCH (LEGEND) CHUẨN MOCKUP THEO 2 HÀNG / 3 CỘT */}
      <div
        className="month-chart-card"
        style={{
          padding: '16px 24px',
          marginTop: '6px',
          backgroundColor: '#ffffff',
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, auto)',
            gap: '14px 48px',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {SPDV_CATEGORIES.map((cat) => (
            <div key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  width: '13px',
                  height: '13px',
                  borderRadius: '3px',
                  backgroundColor: cat.color,
                  flexShrink: 0
                }}
              />
              <span style={{ fontSize: '13px', fontWeight: '500', color: '#334155' }}>
                {cat.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
