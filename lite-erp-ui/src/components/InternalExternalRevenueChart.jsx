import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Eye, EyeOff } from 'lucide-react';
import './SpdvComparisonChart.css';
import './MonthComparisonChart.css';
import {
  INTERNAL_EXTERNAL_CATEGORIES,
  INTERNAL_EXTERNAL_DATA,
  DOMESTIC_INTERNATIONAL_CATEGORIES,
  DOMESTIC_INTERNATIONAL_DATA
} from '../data/revenueInternalExternalData';

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
                  percent: slice.formattedPercent,
                  value: slice.value,
                  color: slice.color,
                  unit: chart.unit || 'tỷ đ'
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
                  fontSize: '11.5px',
                  fontWeight: '700',
                  fill: '#ffffff',
                  textShadow: '0 1px 2px rgba(0,0,0,0.4)'
                }}
              >
                {slice.formattedPercent}
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

// Subcard component matching the exact mockup
function InternalExternalSubcard({
  title,
  tag,
  tagType = 'th',
  chart,
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
          {/* Indicator bar matching screenshot */}
          <span
            style={{
              width: '4px',
              height: '24px',
              borderRadius: '2px',
              backgroundColor: tagType === 'th' ? '#38bdf8' : '#fb7185',
              flexShrink: 0
            }}
          />
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
            hoveredSlice={hoveredSlice}
            setHoveredSlice={setHoveredSlice}
            cardKey={cardKey}
          />
          {hoveredSlice && hoveredSlice.cardKey === cardKey && (
            <div className="month-subcard-tooltip" style={{ marginTop: '8px', width: '90%' }}>
              <div className="tooltip-item-title">{hoveredSlice.sliceName}</div>
              <div className="tooltip-stat-row">
                <span>Tỷ trọng:</span>
                <strong>{hoveredSlice.percent}</strong>
              </div>
              <div className="tooltip-stat-row">
                <span>Giá trị:</span>
                <strong>{hoveredSlice.value} {hoveredSlice.unit || chart.unit || 'tỷ đ'}</strong>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function InternalExternalRevenueChart({
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

  // Section level collapse states
  const [section1Open, setSection1Open] = useState(true);
  const [section2Open, setSection2Open] = useState(true);

  // Independent toggle states for each of the subcards (default collapsed like the user screenshot)
  const [internalVisibleCards, setInternalVisibleCards] = useState({
    // Biểu đồ 25 & 26 (Cơ cấu DT nội bộ và ngoài Tập đoàn)
    thMonth: false,
    khMonth: false,
    thQuarter: false,
    khQuarter: false,
    thYear: false,
    khYear: false,
    // Biểu đồ 27 & 28 (Cơ cấu DT trong nước và quốc tế)
    thMonth27: false,
    khMonth28: false,
    thQuarter27: false,
    khQuarter28: false,
    thYear27: false,
    khYear28: false
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
      khYear: nextState,
      thMonth27: nextState,
      khMonth28: nextState,
      thQuarter27: nextState,
      khQuarter28: nextState,
      thYear27: nextState,
      khYear28: nextState
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

  // Data for Biểu đồ 25 & 26 (Nội bộ vs Ngoài Tập đoàn)
  const data = INTERNAL_EXTERNAL_DATA[activeYear] || INTERNAL_EXTERNAL_DATA['2026'];

  // Data for Biểu đồ 27 & 28 (Trong nước vs Quốc tế)
  const data27 = DOMESTIC_INTERNATIONAL_DATA[activeYear] || DOMESTIC_INTERNATIONAL_DATA['2026'];

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

      {/* ========================================================
          PHẦN 1: BIỂU ĐỒ 25 – 26 (NỘI BỘ VÀ NGOÀI TẬP ĐOÀN)
          ======================================================== */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '20px 22px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}
      >
        {/* Section Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <h2
            style={{
              fontSize: '16px',
              fontWeight: '700',
              color: '#0f172a',
              margin: 0
            }}
          >
            Cơ cấu doanh thu nội bộ và doanh thu ngoài Tập đoàn
          </h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontSize: '12px',
                fontWeight: '600',
                color: '#475569',
                backgroundColor: '#f1f5f9',
                padding: '3px 10px',
                borderRadius: '6px'
              }}
            >
              Biểu đồ 25 – 26
            </span>
            <button
              type="button"
              onClick={() => setSection1Open(!section1Open)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                color: '#64748b',
                cursor: 'pointer'
              }}
              title={section1Open ? 'Thu gọn phân đoạn' : 'Mở rộng phân đoạn'}
            >
              {section1Open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        </div>

        {/* Section Subcards Grid */}
        {section1Open && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* DÒNG 1: THÁNG */}
            <div className="month-row-grid">
              <InternalExternalSubcard
                title={thMonthTitle}
                tag="Hàng 1 - Khu 1"
                tagType="th"
                chart={data.thMonth}
                hoveredSlice={hoveredSlice}
                setHoveredSlice={setHoveredSlice}
                cardKey="th-month"
                isVisible={visibleCards.thMonth}
                onToggle={() => toggleCard('thMonth')}
              />
              <InternalExternalSubcard
                title={khMonthTitle}
                tag="Hàng 1 - Khu 2"
                tagType="kh"
                chart={data.khMonth}
                hoveredSlice={hoveredSlice}
                setHoveredSlice={setHoveredSlice}
                cardKey="kh-month"
                isVisible={visibleCards.khMonth}
                onToggle={() => toggleCard('khMonth')}
              />
            </div>

            {/* DÒNG 2: QUÝ */}
            <div className="month-row-grid">
              <InternalExternalSubcard
                title={thQuarterTitle}
                tag="Hàng 2 - Khu 1"
                tagType="th"
                chart={data.thQuarter}
                hoveredSlice={hoveredSlice}
                setHoveredSlice={setHoveredSlice}
                cardKey="th-quarter"
                isVisible={visibleCards.thQuarter}
                onToggle={() => toggleCard('thQuarter')}
              />
              <InternalExternalSubcard
                title={khQuarterTitle}
                tag="Hàng 2 - Khu 2"
                tagType="kh"
                chart={data.khQuarter}
                hoveredSlice={hoveredSlice}
                setHoveredSlice={setHoveredSlice}
                cardKey="kh-quarter"
                isVisible={visibleCards.khQuarter}
                onToggle={() => toggleCard('khQuarter')}
              />
            </div>

            {/* DÒNG 3: NĂM */}
            <div className="month-row-grid">
              <InternalExternalSubcard
                title={thYearTitle}
                tag="Hàng 3 - Khu 1"
                tagType="th"
                chart={data.thYear}
                hoveredSlice={hoveredSlice}
                setHoveredSlice={setHoveredSlice}
                cardKey="th-year"
                isVisible={visibleCards.thYear}
                onToggle={() => toggleCard('thYear')}
              />
              <InternalExternalSubcard
                title={khYearTitle}
                tag="Hàng 3 - Khu 2"
                tagType="kh"
                chart={data.khYear}
                hoveredSlice={hoveredSlice}
                setHoveredSlice={setHoveredSlice}
                cardKey="kh-year"
                isVisible={visibleCards.khYear}
                onToggle={() => toggleCard('khYear')}
              />
            </div>
          </div>
        )}
      </div>

      {/* ========================================================
          PHẦN 2: BIỂU ĐỒ 27 – 28 (TRONG NƯỚC VÀ QUỐC TẾ)
          ======================================================== */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '20px 22px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}
      >
        {/* Section Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <h2
              style={{
                fontSize: '16px',
                fontWeight: '700',
                color: '#0f172a',
                margin: 0
              }}
            >
              Cơ cấu doanh thu trong nước và doanh thu quốc tế
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontSize: '12px',
                fontWeight: '600',
                color: '#475569',
                backgroundColor: '#f1f5f9',
                padding: '3px 10px',
                borderRadius: '6px'
              }}
            >
              Biểu đồ 27 – 28
            </span>
            <button
              type="button"
              onClick={() => setSection2Open(!section2Open)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                color: '#64748b',
                cursor: 'pointer'
              }}
              title={section2Open ? 'Thu gọn phân đoạn' : 'Mở rộng phân đoạn'}
            >
              {section2Open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        </div>

        {/* Section Subcards Grid */}
        {section2Open && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* DÒNG 1: THÁNG */}
            <div className="month-row-grid">
              <InternalExternalSubcard
                title={thMonthTitle}
                tag="Hàng 1 - Khu 1"
                tagType="th"
                chart={data27.thMonth}
                hoveredSlice={hoveredSlice}
                setHoveredSlice={setHoveredSlice}
                cardKey="th-month-27"
                isVisible={visibleCards.thMonth27}
                onToggle={() => toggleCard('thMonth27')}
              />
              <InternalExternalSubcard
                title={khMonthTitle}
                tag="Hàng 1 - Khu 2"
                tagType="kh"
                chart={data27.khMonth}
                hoveredSlice={hoveredSlice}
                setHoveredSlice={setHoveredSlice}
                cardKey="kh-month-28"
                isVisible={visibleCards.khMonth28}
                onToggle={() => toggleCard('khMonth28')}
              />
            </div>

            {/* DÒNG 2: QUÝ */}
            <div className="month-row-grid">
              <InternalExternalSubcard
                title={thQuarterTitle}
                tag="Hàng 2 - Khu 1"
                tagType="th"
                chart={data27.thQuarter}
                hoveredSlice={hoveredSlice}
                setHoveredSlice={setHoveredSlice}
                cardKey="th-quarter-27"
                isVisible={visibleCards.thQuarter27}
                onToggle={() => toggleCard('thQuarter27')}
              />
              <InternalExternalSubcard
                title={khQuarterTitle}
                tag="Hàng 2 - Khu 2"
                tagType="kh"
                chart={data27.khQuarter}
                hoveredSlice={hoveredSlice}
                setHoveredSlice={setHoveredSlice}
                cardKey="kh-quarter-28"
                isVisible={visibleCards.khQuarter28}
                onToggle={() => toggleCard('khQuarter28')}
              />
            </div>

            {/* DÒNG 3: NĂM */}
            <div className="month-row-grid">
              <InternalExternalSubcard
                title={thYearTitle}
                tag="Hàng 3 - Khu 1"
                tagType="th"
                chart={data27.thYear}
                hoveredSlice={hoveredSlice}
                setHoveredSlice={setHoveredSlice}
                cardKey="th-year-27"
                isVisible={visibleCards.thYear27}
                onToggle={() => toggleCard('thYear27')}
              />
              <InternalExternalSubcard
                title={khYearTitle}
                tag="Hàng 3 - Khu 2"
                tagType="kh"
                chart={data27.khYear}
                hoveredSlice={hoveredSlice}
                setHoveredSlice={setHoveredSlice}
                cardKey="kh-year-28"
                isVisible={visibleCards.khYear28}
                onToggle={() => toggleCard('khYear28')}
              />
            </div>
          </div>
        )}
      </div>

      {/* ========================================================
          CHÚ THÍCH (LEGEND) CHUẨN MOCKUP
          ======================================================== */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
          padding: '12px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
        }}
      >
        {/* Hàng trên: TH & KH theo đúng screenshot */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '36px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                width: '14px',
                height: '14px',
                borderRadius: '3px',
                backgroundColor: '#93c5fd'
              }}
            />
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>
              TH: Thực hiện
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                width: '14px',
                height: '14px',
                borderRadius: '3px',
                backgroundColor: '#fca5a5'
              }}
            />
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>
              KH: Kế hoạch
            </span>
          </div>
        </div>

        {/* Hàng dưới: Màu lát cắt Donut để phân biệt cơ cấu chi tiết khi mở rộng biểu đồ */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '24px',
            flexWrap: 'wrap',
            paddingTop: '6px',
            borderTop: '1px dashed #f1f5f9',
            width: '100%'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: '#64748b' }} />
            <span style={{ fontSize: '12px', color: '#64748b' }}>DT nội bộ</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: '#EE0033' }} />
            <span style={{ fontSize: '12px', color: '#64748b' }}>DT ngoài Tập đoàn</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: '#0284c7' }} />
            <span style={{ fontSize: '12px', color: '#64748b' }}>DT trong nước</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: '#ea580c' }} />
            <span style={{ fontSize: '12px', color: '#64748b' }}>DT quốc tế</span>
          </div>
        </div>
      </div>
    </div>
  );
}
