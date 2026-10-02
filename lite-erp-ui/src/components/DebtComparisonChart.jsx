import React, { useState } from 'react';
import {
  ChevronDown, ChevronUp, Wallet, AlertTriangle, CheckCircle2,
  Clock, TrendingUp, Filter, Users, ArrowUpRight, ArrowDownRight,
  ShieldAlert, Building2, Globe
} from 'lucide-react';
import './MonthComparisonChart.css';
import {
  DEBT_SUMMARY_METRICS,
  DEBT_AGING_DATA,
  DEBT_BY_CUSTOMER_GROUP,
  DEBT_MONTHLY_RECOVERY,
  DEBT_TOP_CUSTOMERS
} from '../data/revenueDebtData';

// Helper format number
const formatNum = (val) => {
  if (val === null || val === undefined || val === '') return '';
  return val.toString().replace('.', ',');
};

export default function DebtComparisonChart({
  selectedYear = '2026',
  setSelectedYear,
  selectedMonth = 'Tháng 8',
  setSelectedMonth,
  visibleCards: propVisibleCards,
  onVisibleCardsChange
}) {
  const [customerFilter, setCustomerFilter] = useState('all');
  const [hoveredAgingItem, setHoveredAgingItem] = useState(null);
  const [hoveredGroupItem, setHoveredGroupItem] = useState(null);
  const [hoveredRecoveryItem, setHoveredRecoveryItem] = useState(null);

  // Subcard collapse/expand state
  const [internalVisibleCards, setInternalVisibleCards] = useState({
    c1Aging: true,
    c2Ratio: true,
    c3Group: true,
    c4Recovery: true,
    c5Table: true
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
      c1Aging: nextState,
      c2Ratio: nextState,
      c3Group: nextState,
      c4Recovery: nextState,
      c5Table: nextState
    });
  };

  // Filtered customer list
  const filteredCustomers = customerFilter === 'all'
    ? DEBT_TOP_CUSTOMERS
    : DEBT_TOP_CUSTOMERS.filter((c) => {
        if (customerFilter === 'external') return c.group === 'Ngoài Tập đoàn';
        if (customerFilter === 'internal') return c.group === 'Nội bộ Tập đoàn';
        if (customerFilter === 'global') return c.group === 'Quốc tế';
        return true;
      });

  return (
    <div className="month-charts-stack">
      {/* Top Filter Bar */}
      <div className="month-top-filter-bar">
        {/* Filter Năm */}
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

        {/* Filter Kỳ báo cáo */}
        <div className="clean-filter-item">
          <span className="clean-filter-label">Kỳ báo cáo</span>
          <div className="clean-select-wrapper">
            <select
              className="clean-filter-select"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth && setSelectedMonth(e.target.value)}
            >
              <option value="Tháng 8">Tháng 8 (Hiện tại)</option>
              <option value="Tháng 7">Tháng 7</option>
              <option value="Tháng 6">Tháng 6</option>
              <option value="Lũy kế 8 tháng">Lũy kế 8 tháng</option>
              <option value="Cả năm">Cả năm</option>
            </select>
            <ChevronDown size={14} className="clean-select-chevron" />
          </div>
        </div>

        {/* Filter Nhóm khách hàng */}
        <div className="clean-filter-item">
          <span className="clean-filter-label">Nhóm đối tượng</span>
          <div className="clean-select-wrapper">
            <select
              className="clean-filter-select"
              value={customerFilter}
              onChange={(e) => setCustomerFilter(e.target.value)}
            >
              <option value="all">Tất cả khách hàng</option>
              <option value="external">Ngoài Tập đoàn</option>
              <option value="internal">Nội bộ Tập đoàn</option>
              <option value="global">Quốc tế</option>
            </select>
            <ChevronDown size={14} className="clean-select-chevron" />
          </div>
        </div>
      </div>

      {/* KPI METRICS OVERVIEW CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '4px' }}>
        {/* Metric 1: Tổng nợ phải thu */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
          padding: '16px 18px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#64748b' }}>Tổng nợ phải thu (AR)</span>
            <div style={{ width: '28px', height: '28px', borderRadius: '6px', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Wallet size={16} color="#2563eb" />
            </div>
          </div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
            {formatNum(DEBT_SUMMARY_METRICS.totalReceivable)} <span style={{ fontSize: '13px', fontWeight: 500, color: '#64748b' }}>Tỷ đồng</span>
          </div>
          <div style={{ fontSize: '12px', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ArrowUpRight size={14} />
            <span>Thu hồi đạt <strong>{formatNum(DEBT_SUMMARY_METRICS.recoveryRate)}%</strong> kế hoạch</span>
          </div>
        </div>

        {/* Metric 2: Nợ trong hạn */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
          padding: '16px 18px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#64748b' }}>Nợ trong hạn</span>
            <div style={{ width: '28px', height: '28px', borderRadius: '6px', backgroundColor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={16} color="#16a34a" />
            </div>
          </div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#16a34a', marginBottom: '4px' }}>
            {formatNum(DEBT_SUMMARY_METRICS.inTermReceivable)} <span style={{ fontSize: '13px', fontWeight: 500, color: '#64748b' }}>Tỷ đồng</span>
          </div>
          <div style={{ fontSize: '12px', color: '#475569' }}>
            Chiếm <strong>86,9%</strong> tổng dư nợ (An toàn)
          </div>
        </div>

        {/* Metric 3: Nợ quá hạn & rủi ro */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
          padding: '16px 18px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#64748b' }}>Nợ quá hạn</span>
            <div style={{ width: '28px', height: '28px', borderRadius: '6px', backgroundColor: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertTriangle size={16} color="#e11d48" />
            </div>
          </div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#e11d48', marginBottom: '4px' }}>
            {formatNum(DEBT_SUMMARY_METRICS.overdueReceivable)} <span style={{ fontSize: '13px', fontWeight: 500, color: '#64748b' }}>Tỷ đồng</span>
          </div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>
            Chiếm <strong>13,1%</strong> (Khó đòi: {formatNum(DEBT_SUMMARY_METRICS.badDebt)} Tỷ)
          </div>
        </div>

        {/* Metric 4: Kỳ thu tiền bình quân (DSO) */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
          padding: '16px 18px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#64748b' }}>Vòng quay công nợ (DSO)</span>
            <div style={{ width: '28px', height: '28px', borderRadius: '6px', backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={16} color="#0284c7" />
            </div>
          </div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
            {DEBT_SUMMARY_METRICS.dso} <span style={{ fontSize: '13px', fontWeight: 500, color: '#64748b' }}>ngày</span>
          </div>
          <div style={{ fontSize: '12px', color: '#16a34a' }}>
            Tốt hơn mục tiêu giao (≤ {DEBT_SUMMARY_METRICS.targetDso} ngày)
          </div>
        </div>
      </div>

      {/* DÒNG 1: PHÂN TÍCH TUỔI NỢ & TỶ TRỌNG CƠ CẤU */}
      <div className="month-row-grid">
        {/* SUBCARD 1: GIÁ TRỊ CÔNG NỢ THEO TUỔI NỢ */}
        <div className="month-subcard">
          <div className="month-subcard-header">
            <h3 className="month-subcard-title" title="Phân tích số dư công nợ phải thu theo tuổi nợ">
              Số dư công nợ phải thu theo tuổi nợ (AR Aging)
            </h3>
            <div className="month-subcard-header-actions">
              <span className="month-subcard-tag">Hàng 1 - Khu 1</span>
            </div>
          </div>

          <div className="month-subcard-svg-wrap">
              <svg viewBox="0 0 540 280" className="month-subcard-svg">
                {/* Legends */}
                <g transform="translate(380, 8)">
                  <g>
                    <rect x={0} y={0} width={12} height={12} fill="#e11d48" rx={1} />
                    <text x={16} y={10} className="legend-label">Thực tế</text>
                  </g>
                  <g transform="translate(0, 16)">
                    <rect x={0} y={0} width={12} height={12} fill="#94a3b8" rx={1} />
                    <text x={16} y={10} className="legend-label">Định mức</text>
                  </g>
                </g>

                {/* Y Axis */}
                <text x={16} y={127} transform="rotate(-90, 16, 127)" textAnchor="middle" className="axis-title">
                  Tỷ đồng
                </text>
                <line x1={55} y1={27} x2={55} y2={222} stroke="#64748b" strokeWidth={1} />
                {[0, 250, 500, 750, 1000, 1250].map((tick) => {
                  const y = 222 - (tick / 1250) * 190;
                  return (
                    <g key={`aging-tick-${tick}`}>
                      <line x1={51} y1={y} x2={55} y2={y} stroke="#64748b" strokeWidth={1} />
                      <text x={47} y={y + 4} textAnchor="end" className="axis-tick-text">{tick}</text>
                    </g>
                  );
                })}
                <line x1={55} y1={222} x2={515} y2={222} stroke="#64748b" strokeWidth={1} />

                {/* Bars */}
                {DEBT_AGING_DATA.map((item, idx) => {
                  const centerX = 101 + idx * 92;
                  const barWidth = 14;
                  const thH = (item.amount / 1250) * 190;
                  const khH = (item.khAmount / 1250) * 190;
                  const thY = 222 - thH;
                  const khY = 222 - khH;
                  const isHovered = hoveredAgingItem?.id === item.id;

                  return (
                    <g key={item.id}>
                      {/* X Labels */}
                      {item.lines.map((line, lIdx) => (
                        <text
                          key={lIdx}
                          x={centerX}
                          y={238 + lIdx * 14}
                          textAnchor="middle"
                          className="category-x-label"
                        >
                          {line}
                        </text>
                      ))}

                      {/* Bar Group */}
                      <g
                        className="chart-bar-group"
                        onMouseEnter={() => setHoveredAgingItem(item)}
                        onMouseLeave={() => setHoveredAgingItem(null)}
                      >
                        {/* Rate / Percentage on top */}
                        <text
                          x={centerX}
                          y={Math.min(thY, khY) - 8}
                          textAnchor="middle"
                          className="bar-top-rate negative"
                          style={{ fill: item.color }}
                        >
                          {formatNum(item.percent)}%
                        </text>

                        {/* Actual Bar */}
                        <rect
                          x={centerX - barWidth - 1}
                          y={thY}
                          width={barWidth}
                          height={thH}
                          fill={item.color}
                          rx={1}
                          className={`bar-rect ${isHovered ? 'bar-highlight' : ''}`}
                        />
                        <text
                          x={centerX - barWidth / 2 - 1}
                          y={thY - 4}
                          textAnchor="middle"
                          className="bar-val-primary"
                        >
                          {formatNum(item.amount)}
                        </text>

                        {/* Target Bar */}
                        <rect
                          x={centerX + 1}
                          y={khY}
                          width={barWidth}
                          height={khH}
                          fill="#94a3b8"
                          rx={1}
                          className={`bar-rect ${isHovered ? 'bar-highlight' : ''}`}
                        />
                        <text
                          x={centerX + barWidth / 2 + 1}
                          y={khY - 4}
                          textAnchor="middle"
                          className="bar-val-secondary"
                        >
                          {formatNum(item.khAmount)}
                        </text>
                      </g>
                    </g>
                  );
                })}
              </svg>

              {/* Tooltip */}
              {hoveredAgingItem && (
                <div className="month-subcard-tooltip">
                  <div className="tooltip-item-title">{hoveredAgingItem.range}</div>
                  <div className="tooltip-stat-row">
                    <span className="tooltip-dot" style={{ backgroundColor: hoveredAgingItem.color }}></span>
                    <span>Số dư thực tế:</span>
                    <strong>{formatNum(hoveredAgingItem.amount)} Tỷ đồng</strong>
                  </div>
                  <div className="tooltip-stat-row">
                    <span className="tooltip-dot gray"></span>
                    <span>Hạn mức cho phép:</span>
                    <strong>{formatNum(hoveredAgingItem.khAmount)} Tỷ đồng</strong>
                  </div>
                  <div className="tooltip-stat-row">
                    <span>Tỷ trọng / Tổng nợ:</span>
                    <strong style={{ color: hoveredAgingItem.color }}>{formatNum(hoveredAgingItem.percent)}%</strong>
                  </div>
                  <div className="tooltip-stat-row">
                    <span>Mức độ rủi ro:</span>
                    <strong>{hoveredAgingItem.riskLevel}</strong>
                  </div>
                </div>
              )}
            </div>
        </div>

        {/* SUBCARD 2: TỶ TRỌNG CƠ CẤU TUỔI NỢ */}
        <div className="month-subcard">
          <div className="month-subcard-header">
            <h3 className="month-subcard-title" title="Tỷ trọng cơ cấu nợ và cảnh báo rủi ro">
              Tỷ trọng cơ cấu nợ & Mức độ kiểm soát rủi ro
            </h3>
            <div className="month-subcard-header-actions">
              <span className="month-subcard-tag">Hàng 1 - Khu 2</span>
            </div>
          </div>

          <div className="month-subcard-svg-wrap">
            <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '14px', height: '248px', boxSizing: 'border-box', justifyContent: 'center' }}>
                {DEBT_AGING_DATA.map((item) => (
                  <div key={item.id} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12.5px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: item.color }}></span>
                        <span style={{ fontWeight: 600, color: '#1e293b' }}>{item.range}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '16px', fontSize: '12px' }}>
                        <span style={{ color: '#64748b' }}>{formatNum(item.amount)} Tỷ ({formatNum(item.percent)}%)</span>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 600,
                          backgroundColor: item.riskLevel === 'Thấp' ? '#f0fdf4' : item.riskLevel === 'Rủi ro cao' ? '#fef2f2' : '#fffbeb',
                          color: item.riskLevel === 'Thấp' ? '#16a34a' : item.riskLevel === 'Rủi ro cao' ? '#e11d48' : '#b45309'
                        }}>
                          {item.riskLevel}
                        </span>
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div style={{ width: '100%', height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${item.percent}%`,
                        height: '100%',
                        backgroundColor: item.color,
                        borderRadius: '4px',
                        transition: 'width 0.4s ease'
                      }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
        </div>
      </div>

      {/* DÒNG 2: CÔNG NỢ THEO NHÓM ĐỐI TƯỢNG & TIẾN ĐỘ THU HỒI */}
      <div className="month-row-grid" style={{ marginTop: '16px' }}>
        {/* SUBCARD 3: CÔNG NỢ THEO NHÓM ĐỐI TƯỢNG */}
        <div className="month-subcard">
          <div className="month-subcard-header">
            <h3 className="month-subcard-title" title="Cơ cấu công nợ theo 3 nhóm đối tượng khách hàng">
              Công nợ phải thu theo nhóm đối tượng khách hàng
            </h3>
            <div className="month-subcard-header-actions">
              <span className="month-subcard-tag">Hàng 2 - Khu 1</span>
            </div>
          </div>

          <div className="month-subcard-svg-wrap">
            <svg viewBox="0 0 540 280" className="month-subcard-svg">
                {/* Legends */}
                <g transform="translate(360, 8)">
                  <g>
                    <rect x={0} y={0} width={12} height={12} fill="#10b981" rx={1} />
                    <text x={16} y={10} className="legend-label">Trong hạn</text>
                  </g>
                  <g transform="translate(0, 16)">
                    <rect x={0} y={0} width={12} height={12} fill="#e11d48" rx={1} />
                    <text x={16} y={10} className="legend-label">Quá hạn</text>
                  </g>
                </g>

                {/* Y Axis */}
                <text x={16} y={127} transform="rotate(-90, 16, 127)" textAnchor="middle" className="axis-title">
                  Tỷ đồng
                </text>
                <line x1={55} y1={27} x2={55} y2={222} stroke="#64748b" strokeWidth={1} />
                {[0, 200, 400, 600, 800, 1000].map((tick) => {
                  const y = 222 - (tick / 1000) * 190;
                  return (
                    <g key={`group-tick-${tick}`}>
                      <line x1={51} y1={y} x2={55} y2={y} stroke="#64748b" strokeWidth={1} />
                      <text x={47} y={y + 4} textAnchor="end" className="axis-tick-text">{tick}</text>
                    </g>
                  );
                })}
                <line x1={55} y1={222} x2={515} y2={222} stroke="#64748b" strokeWidth={1} />

                {/* Bars for 3 Groups */}
                {DEBT_BY_CUSTOMER_GROUP.map((item, idx) => {
                  const centerX = 135 + idx * 150;
                  const barWidth = 18;
                  const inTermH = (item.inTerm / 1000) * 190;
                  const overH = (item.overdue / 1000) * 190;
                  const inTermY = 222 - inTermH;
                  const overY = 222 - overH;
                  const isHovered = hoveredGroupItem?.id === item.id;

                  return (
                    <g key={item.id}>
                      {/* X Labels */}
                      {item.lines.map((line, lIdx) => (
                        <text
                          key={lIdx}
                          x={centerX}
                          y={238 + lIdx * 14}
                          textAnchor="middle"
                          className="category-x-label"
                        >
                          {line}
                        </text>
                      ))}

                      {/* Bar Group */}
                      <g
                        className="chart-bar-group"
                        onMouseEnter={() => setHoveredGroupItem(item)}
                        onMouseLeave={() => setHoveredGroupItem(null)}
                      >
                        {/* Overdue percentage top label */}
                        <text
                          x={centerX}
                          y={Math.min(inTermY, overY) - 8}
                          textAnchor="middle"
                          className="bar-top-rate negative"
                        >
                          Quá hạn {formatNum(item.overdueRatio)}%
                        </text>

                        {/* In-term Bar */}
                        <rect
                          x={centerX - barWidth - 1}
                          y={inTermY}
                          width={barWidth}
                          height={inTermH}
                          fill="#10b981"
                          rx={1}
                          className={`bar-rect ${isHovered ? 'bar-highlight' : ''}`}
                        />
                        <text
                          x={centerX - barWidth / 2 - 1}
                          y={inTermY - 4}
                          textAnchor="middle"
                          className="bar-val-primary"
                        >
                          {formatNum(item.inTerm)}
                        </text>

                        {/* Overdue Bar */}
                        <rect
                          x={centerX + 1}
                          y={overY}
                          width={barWidth}
                          height={overH}
                          fill="#e11d48"
                          rx={1}
                          className={`bar-rect ${isHovered ? 'bar-highlight' : ''}`}
                        />
                        <text
                          x={centerX + barWidth / 2 + 1}
                          y={overY - 4}
                          textAnchor="middle"
                          className="bar-val-secondary"
                        >
                          {formatNum(item.overdue)}
                        </text>
                      </g>
                    </g>
                  );
                })}
              </svg>

              {/* Tooltip */}
              {hoveredGroupItem && (
                <div className="month-subcard-tooltip">
                  <div className="tooltip-item-title">{hoveredGroupItem.groupName}</div>
                  <div className="tooltip-stat-row">
                    <span>Tổng nợ phải thu:</span>
                    <strong>{formatNum(hoveredGroupItem.receivable)} Tỷ đồng</strong>
                  </div>
                  <div className="tooltip-stat-row">
                    <span className="tooltip-dot" style={{ backgroundColor: '#10b981' }}></span>
                    <span>Trong hạn:</span>
                    <strong style={{ color: '#16a34a' }}>{formatNum(hoveredGroupItem.inTerm)} Tỷ đồng</strong>
                  </div>
                  <div className="tooltip-stat-row">
                    <span className="tooltip-dot" style={{ backgroundColor: '#e11d48' }}></span>
                    <span>Quá hạn:</span>
                    <strong style={{ color: '#e11d48' }}>{formatNum(hoveredGroupItem.overdue)} Tỷ đồng ({formatNum(hoveredGroupItem.overdueRatio)}%)</strong>
                  </div>
                </div>
              )}
            </div>
        </div>

        {/* SUBCARD 4: TIẾN ĐỘ THU HỒI CÔNG NỢ TỪNG THÁNG */}
        <div className="month-subcard">
          <div className="month-subcard-header">
            <h3 className="month-subcard-title" title="Tiến độ thu hồi công nợ các tháng so với kế hoạch">
              Tiến độ thu hồi công nợ từng tháng trong năm {selectedYear}
            </h3>
            <div className="month-subcard-header-actions">
              <span className="month-subcard-tag">Hàng 2 - Khu 2</span>
            </div>
          </div>

          <div className="month-subcard-svg-wrap">
            <svg viewBox="0 0 540 280" className="month-subcard-svg">
                {/* Legends */}
                <g transform="translate(370, 8)">
                  <g>
                    <rect x={0} y={0} width={12} height={12} fill="#e11d48" rx={1} />
                    <text x={16} y={10} className="legend-label">TH thu hồi</text>
                  </g>
                  <g transform="translate(0, 16)">
                    <rect x={0} y={0} width={12} height={12} fill="#94a3b8" rx={1} />
                    <text x={16} y={10} className="legend-label">KH thu hồi</text>
                  </g>
                </g>

                {/* Y Axis */}
                <text x={16} y={127} transform="rotate(-90, 16, 127)" textAnchor="middle" className="axis-title">
                  Tỷ đồng
                </text>
                <line x1={45} y1={27} x2={45} y2={222} stroke="#64748b" strokeWidth={1} />
                {[0, 50, 100, 150, 200].map((tick) => {
                  const y = 222 - (tick / 200) * 190;
                  return (
                    <g key={`rec-tick-${tick}`}>
                      <line x1={41} y1={y} x2={45} y2={y} stroke="#64748b" strokeWidth={1} />
                      <text x={38} y={y + 4} textAnchor="end" className="axis-tick-text">{tick}</text>
                    </g>
                  );
                })}
                <line x1={45} y1={222} x2={525} y2={222} stroke="#64748b" strokeWidth={1} />

                {/* 12 Months Bars */}
                {DEBT_MONTHLY_RECOVERY.map((item, idx) => {
                  const centerX = 65 + idx * 38;
                  const barWidth = 6.5;
                  const actH = (item.actual / 200) * 190;
                  const planH = (item.plan / 200) * 190;
                  const actY = 222 - actH;
                  const planY = 222 - planH;
                  const isHovered = hoveredRecoveryItem?.month === item.month;

                  return (
                    <g key={item.month}>
                      <text x={centerX} y={238} textAnchor="middle" className="category-x-label">
                        {item.month}
                      </text>

                      <g
                        className="chart-bar-group"
                        onMouseEnter={() => setHoveredRecoveryItem(item)}
                        onMouseLeave={() => setHoveredRecoveryItem(null)}
                      >
                        {/* Actual Bar */}
                        <rect
                          x={centerX - barWidth - 1}
                          y={actY}
                          width={barWidth}
                          height={actH}
                          fill="#e11d48"
                          rx={1}
                          className={`bar-rect ${isHovered ? 'bar-highlight' : ''}`}
                        />
                        {/* Plan Bar */}
                        <rect
                          x={centerX + 1}
                          y={planY}
                          width={barWidth}
                          height={planH}
                          fill="#94a3b8"
                          rx={1}
                          className={`bar-rect ${isHovered ? 'bar-highlight' : ''}`}
                        />
                      </g>
                    </g>
                  );
                })}
              </svg>

              {/* Tooltip */}
              {hoveredRecoveryItem && (
                <div className="month-subcard-tooltip">
                  <div className="tooltip-item-title">Kỳ thu nợ {hoveredRecoveryItem.month}/{selectedYear}</div>
                  <div className="tooltip-stat-row">
                    <span className="tooltip-dot red"></span>
                    <span>Thực hiện thu hồi:</span>
                    <strong>{formatNum(hoveredRecoveryItem.actual)} Tỷ đồng</strong>
                  </div>
                  <div className="tooltip-stat-row">
                    <span className="tooltip-dot gray"></span>
                    <span>Kế hoạch thu hồi:</span>
                    <strong>{formatNum(hoveredRecoveryItem.plan)} Tỷ đồng</strong>
                  </div>
                  <div className="tooltip-stat-row">
                    <span>Tỷ lệ (%):</span>
                    <strong style={{ color: '#16a34a' }}>{hoveredRecoveryItem.rate}</strong>
                  </div>
                  <div className="tooltip-stat-row">
                    <span>Thu hồi nợ quá hạn:</span>
                    <strong>{formatNum(hoveredRecoveryItem.overdueRecovery)} Tỷ đồng</strong>
                  </div>
                </div>
              )}
            </div>
        </div>
      </div>

      {/* DÒNG 3: BẢNG CHI TIẾT CÔNG NỢ THEO KHÁCH HÀNG / ĐỐI TÁC */}
      <div className="month-subcard" style={{ marginTop: '16px' }}>
        <div className="month-subcard-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 className="month-subcard-title">
              Bảng chi tiết top khách hàng có số dư công nợ lớn
            </h3>
            <span style={{ fontSize: '12px', color: '#64748b' }}>({filteredCustomers.length} khách hàng)</span>
          </div>
          <div className="month-subcard-header-actions">
            <span className="month-subcard-tag">Hàng 3 - Bảng số liệu</span>
          </div>
        </div>

        <div style={{ overflowX: 'auto', padding: '0 4px 12px 4px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                  <th style={{ padding: '10px 12px', width: '45px', textAlign: 'center' }}>STT</th>
                  <th style={{ padding: '10px 12px', width: '90px' }}>Mã KH</th>
                  <th style={{ padding: '10px 12px' }}>Tên Khách hàng / Đối tác</th>
                  <th style={{ padding: '10px 12px', width: '140px' }}>Phân nhóm</th>
                  <th style={{ padding: '10px 12px', width: '110px', textAlign: 'right' }}>Tổng nợ (Tỷ)</th>
                  <th style={{ padding: '10px 12px', width: '110px', textAlign: 'right' }}>Trong hạn</th>
                  <th style={{ padding: '10px 12px', width: '100px', textAlign: 'right' }}>Quá hạn</th>
                  <th style={{ padding: '10px 12px', width: '80px', textAlign: 'center' }}>DSO</th>
                  <th style={{ padding: '10px 12px', width: '130px', textAlign: 'center' }}>Trạng thái</th>
                  <th style={{ padding: '10px 12px' }}>Hành động xử lý</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((cust, idx) => (
                  <tr
                    key={cust.code}
                    style={{
                      borderBottom: '1px solid #f1f5f9',
                      backgroundColor: idx % 2 === 0 ? '#ffffff' : '#fafafa',
                      transition: 'background-color 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f9ff'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = idx % 2 === 0 ? '#ffffff' : '#fafafa'}
                  >
                    <td style={{ padding: '10px 12px', textAlign: 'center', color: '#64748b' }}>{cust.stt}</td>
                    <td style={{ padding: '10px 12px', fontWeight: 600, color: '#2563eb' }}>{cust.code}</td>
                    <td style={{ padding: '10px 12px', fontWeight: 600, color: '#0f172a' }}>{cust.name}</td>
                    <td style={{ padding: '10px 12px', color: '#475569' }}>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        backgroundColor: cust.group === 'Nội bộ Tập đoàn' ? '#f0fdf4' : cust.group === 'Quốc tế' ? '#eff6ff' : '#f8fafc',
                        color: cust.group === 'Nội bộ Tập đoàn' ? '#16a34a' : cust.group === 'Quốc tế' ? '#2563eb' : '#475569'
                      }}>
                        {cust.group}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>
                      {formatNum(cust.totalDebt)}
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', color: '#16a34a', fontWeight: 600 }}>
                      {formatNum(cust.inTerm)}
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', color: cust.overdue > 0 ? '#e11d48' : '#64748b', fontWeight: cust.overdue > 0 ? 700 : 400 }}>
                      {formatNum(cust.overdue)}
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'center', color: cust.dso > 50 ? '#e11d48' : '#0f172a', fontWeight: 600 }}>
                      {cust.dso} ngày
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 600,
                        backgroundColor: cust.status === 'Tốt' ? '#f0fdf4' : cust.status === 'Bình thường' ? '#f8fafc' : cust.status === 'Cảnh báo' ? '#fef2f2' : '#fffbeb',
                        color: cust.status === 'Tốt' ? '#16a34a' : cust.status === 'Bình thường' ? '#475569' : cust.status === 'Cảnh báo' ? '#e11d48' : '#b45309'
                      }}>
                        {cust.status}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px', color: '#64748b', fontSize: '12px' }}>
                      {cust.action}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      </div>
    </div>
  );
}
