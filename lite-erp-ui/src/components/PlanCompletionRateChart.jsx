import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import TotalRevenuePlanProgressTable from './TotalRevenuePlanProgressTable';
import ExternalRevenuePlanProgressTable from './ExternalRevenuePlanProgressTable';
import InternationalRevenuePlanProgressTable from './InternationalRevenuePlanProgressTable';

/**
 * Helper tính path SVG cho miếng donut
 */
function getDonutArcPath(cx, cy, innerR, outerR, startAngle, endAngle) {
  const delta = endAngle - startAngle;
  if (delta >= 2 * Math.PI - 0.0001) {
    const midAngle = startAngle + Math.PI;
    return `${getDonutArcPath(cx, cy, innerR, outerR, startAngle, midAngle)} ${getDonutArcPath(cx, cy, innerR, outerR, midAngle, endAngle)}`;
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

/**
 * Biểu đồ Donut đơn có kim/vạch mốc thời gian đỏ (66,7%)
 */
function CompletionGaugeDonut({
  ratePercent = 62.2,
  actualVal = '775,0',
  targetVal = '1.246,0',
  unit = 'triệu đồng',
  timeElapsedPercent = 66.7,
  timeElapsedLabel = '66,7%',
  doneColor = '#1d4877',
  hoveredPart,
  setHoveredPart,
  chartId
}) {
  const cx = 185;
  const cy = 135;
  const outerR = 92;
  const innerR = 56;

  // 12 o'clock corresponds to -Math.PI / 2
  const startAngle = -Math.PI / 2;
  const doneAngleDelta = Math.min(Math.max(ratePercent / 100, 0.001), 0.999) * 2 * Math.PI;
  const doneEndAngle = startAngle + doneAngleDelta;
  const remainEndAngle = startAngle + 2 * Math.PI;

  const doneHovered = hoveredPart?.chartId === chartId && hoveredPart?.part === 'done';
  const remainHovered = hoveredPart?.chartId === chartId && hoveredPart?.part === 'remain';

  const donePath = getDonutArcPath(
    cx,
    cy,
    innerR,
    doneHovered ? outerR + 4 : outerR,
    startAngle,
    doneEndAngle
  );

  const remainPath = getDonutArcPath(
    cx,
    cy,
    innerR,
    remainHovered ? outerR + 4 : outerR,
    doneEndAngle,
    remainEndAngle
  );

  // Red marker angle for elapsed time
  const timeAngle = startAngle + (timeElapsedPercent / 100) * 2 * Math.PI;
  const needleInnerR = innerR - 2;
  const needleOuterR = outerR + 32;

  const nx1 = cx + needleInnerR * Math.cos(timeAngle);
  const ny1 = cy + needleInnerR * Math.sin(timeAngle);
  const nx2 = cx + needleOuterR * Math.cos(timeAngle);
  const ny2 = cy + needleOuterR * Math.sin(timeAngle);

  // Position of red label at needle tip
  const labelX = nx2 - 8;
  const labelY = ny2;

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '370px', margin: '0 auto' }}>
      <svg viewBox="0 0 370 270" style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}>
        {/* Slice 1: Đã thực hiện (Navy Blue hoặc Royal Blue) */}
        <path
          d={donePath}
          fill={doneColor}
          stroke="#ffffff"
          strokeWidth={1.5}
          style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
          onMouseEnter={() => {
            const timeDelta = ratePercent - timeElapsedPercent;
            setHoveredPart({
              chartId,
              part: 'done',
              label: 'Đã thực hiện',
              val: `${ratePercent.toFixed(1).replace('.', ',')}% (${actualVal} ${unit})`,
              delta: `${timeDelta >= 0 ? '+' : ''}${timeDelta.toFixed(1).replace('.', ',')}%`,
              isPositive: timeDelta >= 0
            });
          }}
          onMouseLeave={() => setHoveredPart(null)}
        />

        {/* Slice 2: Còn phải thực hiện để đạt KH (Light Grey #e5e7eb) */}
        <path
          d={remainPath}
          fill="#e5e7eb"
          stroke="#ffffff"
          strokeWidth={1.5}
          style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
          onMouseEnter={() => {
            const remainPercent = 100 - ratePercent;
            setHoveredPart({
              chartId,
              part: 'remain',
              label: 'Còn phải thực hiện để đạt KH',
              val: `${remainPercent.toFixed(1).replace('.', ',')}%`,
              delta: `-${remainPercent.toFixed(1).replace('.', ',')}%`,
              isPositive: false
            });
          }}
          onMouseLeave={() => setHoveredPart(null)}
        />

        {/* Kim/Vạch đỏ đánh dấu mốc thời gian đã trôi qua */}
        <g style={{ pointerEvents: 'none' }}>
          <line
            x1={nx1}
            y1={ny1}
            x2={nx2}
            y2={ny2}
            stroke="#b91c1c"
            strokeWidth={2.8}
            strokeLinecap="round"
          />
          {/* Label vạch đỏ */}
          <text
            x={labelX}
            y={labelY - 5}
            textAnchor="end"
            fill="#b91c1c"
            fontSize="11.5"
            fontWeight="600"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            Mốc thời gian
          </text>
          <text
            x={labelX}
            y={labelY + 10}
            textAnchor="end"
            fill="#b91c1c"
            fontSize="12.5"
            fontWeight="800"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            {timeElapsedLabel}
          </text>
        </g>

        {/* Text ở giữa Donut */}
        {/* Phần trăm hoàn thành nổi bật màu đỏ đô (#991b1b) */}
        <text
          x={cx}
          y={cy - 4}
          textAnchor="middle"
          fill="#991b1b"
          fontSize="27"
          fontWeight="800"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          {ratePercent.toFixed(1).replace('.', ',')}%
        </text>

        {/* Giá trị Thực hiện / Kế hoạch */}
        <text
          x={cx}
          y={cy + 18}
          textAnchor="middle"
          fill="#1e293b"
          fontSize="12.5"
          fontWeight="700"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          {actualVal} / {targetVal}
        </text>

        {/* Đơn vị */}
        <text
          x={cx}
          y={cy + 34}
          textAnchor="middle"
          fill="#64748b"
          fontSize="11.5"
          fontWeight="500"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          {unit}
        </text>
      </svg>

      {/* Tooltip khi rê chuột vào miếng cắt */}
      {hoveredPart && hoveredPart.chartId === chartId && (
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#0f172a',
            color: '#ffffff',
            padding: '5px 12px',
            borderRadius: '6px',
            fontSize: '11.5px',
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            zIndex: 10,
            pointerEvents: 'none'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <div>
              <span style={{ fontWeight: 600 }}>{hoveredPart.label}: </span>
              <span style={{ color: '#93c5fd' }}>{hoveredPart.val}</span>
            </div>
            {hoveredPart.delta && (
              <div>
                <span style={{ fontWeight: 600 }}>% Delta (so mốc tgian): </span>
                <span style={{ color: hoveredPart.isPositive ? '#4ade80' : '#f87171', fontWeight: 700 }}>{hoveredPart.delta}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Chú giải dữ liệu trực tiếp trong biểu đồ (Data Legend) */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px 14px',
          marginTop: '6px',
          fontSize: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '2px',
              backgroundColor: doneColor,
              display: 'inline-block',
              flexShrink: 0
            }}
          />
          <span style={{ color: '#475569' }}>Đã TH:</span>
          <strong style={{ color: '#0f172a' }}>
            {actualVal} ({ratePercent.toFixed(1).replace('.', ',')}%)
          </strong>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '2px',
              backgroundColor: '#e5e7eb',
              border: '1px solid #cbd5e1',
              display: 'inline-block',
              flexShrink: 0
            }}
          />
          <span style={{ color: '#475569' }}>Còn lại:</span>
          <strong style={{ color: '#0f172a' }}>
            {Math.max(0, 100 - ratePercent).toFixed(1).replace('.', ',')}%
          </strong>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span
            style={{
              width: '14px',
              height: '3px',
              borderRadius: '1px',
              backgroundColor: '#b91c1c',
              display: 'inline-block',
              flexShrink: 0
            }}
          />
          <span style={{ color: '#475569' }}>Mốc tgian:</span>
          <strong style={{ color: '#b91c1c' }}>
            {timeElapsedLabel}
          </strong>
        </div>
      </div>
    </div>
  );
}

/**
 * Subcard hiển thị độc lập cho từng biểu đồ tiến độ kế hoạch (Quý hoặc Năm)
 */
function PlanGaugeSubcard({
  title,
  subtitle,
  tag,
  data,
  hoveredPart,
  setHoveredPart,
  onOpenDetail,
  chartKey = 'chart29_30'
}) {
  return (
    <div
      className="month-subcard spdv-card-item"
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        padding: '18px 20px 16px 20px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'all 0.2s ease',
        boxSizing: 'border-box'
      }}
    >
      {/* 1. Header Subcard */}
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '12px',
            marginBottom: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', flex: 1, minWidth: 0 }}>
            <span
              style={{
                width: '4px',
                height: '24px',
                borderRadius: '2px',
                backgroundColor: data.doneColor,
                flexShrink: 0,
                marginTop: '2px'
              }}
            />
            <div style={{ minWidth: 0 }}>
              <h3
                style={{
                  fontSize: '14.5px',
                  fontWeight: '700',
                  color: '#0f172a',
                  margin: 0,
                  lineHeight: 1.35
                }}
              >
                {title}
              </h3>
              {subtitle && (
                <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '500', marginTop: '2px' }}>
                  {subtitle}
                </div>
              )}
            </div>
          </div>

          <span
            style={{
              fontSize: '11.5px',
              fontWeight: '600',
              color: '#334155',
              backgroundColor: '#f1f5f9',
              padding: '3px 9px',
              borderRadius: '6px',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
          >
            {tag}
          </span>
        </div>

        {/* 2. Donut Gauge Chart */}
        <CompletionGaugeDonut
          ratePercent={data.ratePercent}
          actualVal={data.actualVal}
          targetVal={data.targetVal}
          unit={data.unit}
          doneColor={data.doneColor}
          timeElapsedPercent={data.timeElapsedPercent}
          timeElapsedLabel={data.timeElapsedLabel}
          hoveredPart={hoveredPart}
          setHoveredPart={setHoveredPart}
          chartId={data.id}
        />
      </div>

      {/* 3. Footer: Chú giải ngang & Nút Xem chi tiết */}
      <div
        style={{
          borderTop: '1px solid #f1f5f9',
          paddingTop: '12px',
          marginTop: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '16px',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                width: '16px',
                height: '9px',
                backgroundColor: data.doneColor,
                borderRadius: '2px',
                display: 'inline-block'
              }}
            />
            <span style={{ fontSize: '12px', fontWeight: '600', color: '#1e293b' }}>
              Đã thực hiện
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                width: '16px',
                height: '9px',
                backgroundColor: '#e5e7eb',
                borderRadius: '2px',
                display: 'inline-block'
              }}
            />
            <span style={{ fontSize: '12px', fontWeight: '600', color: '#1e293b' }}>
              Còn phải TH để đạt KH
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                width: '18px',
                height: '3px',
                backgroundColor: '#b91c1c',
                borderRadius: '2px',
                display: 'inline-block'
              }}
            />
            <span style={{ fontSize: '12px', fontWeight: '600', color: '#1e293b' }}>
              Mốc tgian ({data.timeElapsedLabel})
            </span>
          </div>
        </div>

        {onOpenDetail && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '2px' }}>
            <button
              type="button"
              className="subcard-detail-action-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                fontWeight: '600',
                color: data.doneColor === '#1d4877' ? '#1d4ed8' : data.doneColor,
                backgroundColor: '#eff6ff',
                border: '1px solid #bfdbfe',
                padding: '5px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onClick={() => onOpenDetail({
                chartKey,
                chartTitle: title
              })}
            >
              <span>Xem chi tiết</span>
              <ArrowRight size={13} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Biểu đồ 29 – 30. Tỷ lệ hoàn thành kế hoạch tổng doanh thu (lũy kế Quý / lũy kế năm)
 * Nhóm thứ 7: Chuyển dịch doanh thu ngoài và doanh thu quốc tế
 */
export default function PlanCompletionRateChart({
  selectedYear = '2026',
  selectedMonth = 'Tháng 8',
  onOpenDetail
}) {
  const [hoveredPart, setHoveredPart] = useState(null);

  const monthNum = parseInt(selectedMonth?.match(/\d+/)?.[0] || '8', 10);
  const quarterNum = Math.ceil(monthNum / 3);
  const quarterRoman = `${quarterNum}`;
  const quarterStartMonth = (quarterNum - 1) * 3 + 1;
  const quarterCumText = quarterStartMonth === monthNum
    ? `T${quarterStartMonth}`
    : `T${quarterStartMonth}–T${monthNum}`;

  // Time elapsed ratio:
  const monthsInQuarterElapsed = (monthNum - quarterStartMonth + 1);
  const timeElapsedQuarterPercent = (monthsInQuarterElapsed / 3) * 100;
  const timeElapsedQuarterLabel = `${timeElapsedQuarterPercent.toFixed(1).replace('.', ',')}%`;

  const timeElapsedYearPercent = (monthNum / 12) * 100;
  const timeElapsedYearLabel = `${timeElapsedYearPercent.toFixed(1).replace('.', ',')}%`;

  // Chart 29 (Quý): 775,0 / 1.246,0 => 62,2%
  const chart29Data = {
    id: 'chart29',
    ratePercent: 62.2,
    actualVal: '775,0',
    targetVal: '1.246,0',
    unit: 'triệu đồng',
    doneColor: '#1d4877',
    timeElapsedPercent: timeElapsedQuarterPercent || 66.7,
    timeElapsedLabel: timeElapsedQuarterLabel || '66,7%',
    title: `Biểu đồ 29. Tỷ lệ hoàn thành KH tổng doanh thu – Lũy kế Quý ${quarterRoman}/${selectedYear} (${quarterCumText})`,
    subtitle: `so với KH Quý ${quarterRoman}`,
    tag: 'Hàng 1 - Khu 1'
  };

  // Chart 30 (Năm): 2.976,3 / 4.968,1 => 59,9%
  const chart30Data = {
    id: 'chart30',
    ratePercent: 59.9,
    actualVal: '2.976,3',
    targetVal: '4.968,1',
    unit: 'triệu đồng',
    doneColor: '#1d4877',
    timeElapsedPercent: timeElapsedYearPercent || 66.7,
    timeElapsedLabel: timeElapsedYearLabel || '66,7%',
    title: `Biểu đồ 30. Tỷ lệ hoàn thành KH tổng doanh thu – Lũy kế ${monthNum} tháng ${selectedYear}`,
    subtitle: `so với KH cả năm ${selectedYear}`,
    tag: 'Hàng 1 - Khu 2'
  };

  return (
    <div
      className="plan-completion-rate-card"
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        padding: '20px 22px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}
    >

      {/* 2 Biểu đồ tách rời trong lưới 2 cột */}
      <div className="month-row-grid">
        <PlanGaugeSubcard
          title={chart29Data.title}
          subtitle={chart29Data.subtitle}
          tag={chart29Data.tag}
          data={chart29Data}
          hoveredPart={hoveredPart}
          setHoveredPart={setHoveredPart}
          onOpenDetail={onOpenDetail}
          chartKey="chart29_30"
        />

        <PlanGaugeSubcard
          title={chart30Data.title}
          subtitle={chart30Data.subtitle}
          tag={chart30Data.tag}
          data={chart30Data}
          hoveredPart={hoveredPart}
          setHoveredPart={setHoveredPart}
          onOpenDetail={onOpenDetail}
          chartKey="chart29_30"
        />
      </div>

      {/* Bảng dữ liệu chi tiết tiến độ kế hoạch tổng doanh thu (Biểu đồ 29 – 30) */}
      <TotalRevenuePlanProgressTable
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
      />
    </div>
  );
}

/**
 * Biểu đồ 31 – 32. Tỷ lệ hoàn thành kế hoạch doanh thu ngoài Tập đoàn (lũy kế Quý / lũy kế năm)
 * Nhóm thứ 7: Chuyển dịch doanh thu ngoài và doanh thu quốc tế
 */
export function ExternalPlanCompletionRateChart({
  selectedYear = '2026',
  selectedMonth = 'Tháng 8',
  onOpenDetail
}) {
  const [hoveredPart, setHoveredPart] = useState(null);

  const monthNum = parseInt(selectedMonth?.match(/\d+/)?.[0] || '8', 10);
  const quarterNum = Math.ceil(monthNum / 3);
  const quarterRoman = `${quarterNum}`;
  const quarterStartMonth = (quarterNum - 1) * 3 + 1;
  const quarterCumText = quarterStartMonth === monthNum
    ? `T${quarterStartMonth}`
    : `T${quarterStartMonth}–T${monthNum}`;

  // Time elapsed ratio:
  const monthsInQuarterElapsed = (monthNum - quarterStartMonth + 1);
  const timeElapsedQuarterPercent = (monthsInQuarterElapsed / 3) * 100;
  const timeElapsedQuarterLabel = `${timeElapsedQuarterPercent.toFixed(1).replace('.', ',')}%`;

  const timeElapsedYearPercent = (monthNum / 12) * 100;
  const timeElapsedYearLabel = `${timeElapsedYearPercent.toFixed(1).replace('.', ',')}%`;

  // Chart 31 (Quý): 525,0 / 872,2 => 60,2%
  const chart31Data = {
    id: 'chart31',
    ratePercent: 60.2,
    actualVal: '525,0',
    targetVal: '872,2',
    unit: 'triệu đồng',
    doneColor: '#2563eb', // Royal Blue
    timeElapsedPercent: timeElapsedQuarterPercent || 66.7,
    timeElapsedLabel: timeElapsedQuarterLabel || '66,7%',
    title: `Biểu đồ 31. Tỷ lệ hoàn thành KH doanh thu ngoài Tập đoàn – Lũy kế Quý ${quarterRoman}/${selectedYear} (${quarterCumText})`,
    subtitle: `so với KH Quý ${quarterRoman}`,
    tag: 'Hàng 1 - Khu 1'
  };

  // Chart 32 (Năm): 2.022,8 / 3.477,7 => 58,2%
  const chart32Data = {
    id: 'chart32',
    ratePercent: 58.2,
    actualVal: '2.022,8',
    targetVal: '3.477,7',
    unit: 'triệu đồng',
    doneColor: '#2563eb', // Royal Blue
    timeElapsedPercent: timeElapsedYearPercent || 66.7,
    timeElapsedLabel: timeElapsedYearLabel || '66,7%',
    title: `Biểu đồ 32. Tỷ lệ hoàn thành KH doanh thu ngoài Tập đoàn – Lũy kế ${monthNum} tháng ${selectedYear}`,
    subtitle: `so với KH cả năm ${selectedYear}`,
    tag: 'Hàng 1 - Khu 2'
  };

  return (
    <div
      className="plan-completion-rate-card external-revenue-card"
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        padding: '20px 22px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}
    >

      <div className="month-row-grid">
        <PlanGaugeSubcard
          title={chart31Data.title}
          subtitle={chart31Data.subtitle}
          tag={chart31Data.tag}
          data={chart31Data}
          hoveredPart={hoveredPart}
          setHoveredPart={setHoveredPart}
          onOpenDetail={onOpenDetail}
          chartKey="chart31_32"
        />

        <PlanGaugeSubcard
          title={chart32Data.title}
          subtitle={chart32Data.subtitle}
          tag={chart32Data.tag}
          data={chart32Data}
          hoveredPart={hoveredPart}
          setHoveredPart={setHoveredPart}
          onOpenDetail={onOpenDetail}
          chartKey="chart31_32"
        />
      </div>

      {/* Bảng dữ liệu chi tiết tiến độ kế hoạch doanh thu ngoài Tập đoàn (Biểu đồ 31 – 32) */}
      <ExternalRevenuePlanProgressTable
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
      />
    </div>
  );
}

/**
 * Biểu đồ 33 – 34. Tỷ lệ hoàn thành kế hoạch doanh thu quốc tế (lũy kế Quý / lũy kế năm)
 * Nhóm thứ 7: Chuyển dịch doanh thu ngoài và doanh thu quốc tế
 */
export function InternationalPlanCompletionRateChart({
  selectedYear = '2026',
  selectedMonth = 'Tháng 8',
  onOpenDetail
}) {
  const [hoveredPart, setHoveredPart] = useState(null);

  const monthNum = parseInt(selectedMonth?.match(/\d+/)?.[0] || '8', 10);
  const quarterNum = Math.ceil(monthNum / 3);
  const quarterRoman = `${quarterNum}`;
  const quarterStartMonth = (quarterNum - 1) * 3 + 1;
  const quarterCumText = quarterStartMonth === monthNum
    ? `T${quarterStartMonth}`
    : `T${quarterStartMonth}–T${monthNum}`;

  // Time elapsed ratio:
  const monthsInQuarterElapsed = (monthNum - quarterStartMonth + 1);
  const timeElapsedQuarterPercent = (monthsInQuarterElapsed / 3) * 100;
  const timeElapsedQuarterLabel = `${timeElapsedQuarterPercent.toFixed(1).replace('.', ',')}%`;

  const timeElapsedYearPercent = (monthNum / 12) * 100;
  const timeElapsedYearLabel = `${timeElapsedYearPercent.toFixed(1).replace('.', ',')}%`;

  // Chart 33 (Quý): 81,9 / 149,6 => 54,7%
  const chart33Data = {
    id: 'chart33',
    ratePercent: 54.7,
    actualVal: '81,9',
    targetVal: '149,6',
    unit: 'triệu đồng',
    doneColor: '#c25e1a', // Burnt orange
    timeElapsedPercent: timeElapsedQuarterPercent || 66.7,
    timeElapsedLabel: timeElapsedQuarterLabel || '66,7%',
    title: `Biểu đồ 33. Tỷ lệ hoàn thành KH doanh thu quốc tế – Lũy kế Quý ${quarterRoman}/${selectedYear} (${quarterCumText})`,
    subtitle: `so với KH Quý ${quarterRoman}`,
    tag: 'Hàng 1 - Khu 1'
  };

  // Chart 34 (Năm): 313,9 / 596,3 => 52,6%
  const chart34Data = {
    id: 'chart34',
    ratePercent: 52.6,
    actualVal: '313,9',
    targetVal: '596,3',
    unit: 'triệu đồng',
    doneColor: '#c25e1a', // Burnt orange
    timeElapsedPercent: timeElapsedYearPercent || 66.7,
    timeElapsedLabel: timeElapsedYearLabel || '66,7%',
    title: `Biểu đồ 34. Tỷ lệ hoàn thành KH doanh thu quốc tế – Lũy kế ${monthNum} tháng ${selectedYear}`,
    subtitle: `so với KH cả năm ${selectedYear}`,
    tag: 'Hàng 1 - Khu 2'
  };

  return (
    <div
      className="plan-completion-rate-card international-revenue-card"
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        padding: '20px 22px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}
    >

      <div className="month-row-grid">
        <PlanGaugeSubcard
          title={chart33Data.title}
          subtitle={chart33Data.subtitle}
          tag={chart33Data.tag}
          data={chart33Data}
          hoveredPart={hoveredPart}
          setHoveredPart={setHoveredPart}
          onOpenDetail={onOpenDetail}
          chartKey="chart33_34"
        />

        <PlanGaugeSubcard
          title={chart34Data.title}
          subtitle={chart34Data.subtitle}
          tag={chart34Data.tag}
          data={chart34Data}
          hoveredPart={hoveredPart}
          setHoveredPart={setHoveredPart}
          onOpenDetail={onOpenDetail}
          chartKey="chart33_34"
        />
      </div>

      {/* Bảng dữ liệu chi tiết tiến độ kế hoạch doanh thu quốc tế */}
      <InternationalRevenuePlanProgressTable
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
      />
    </div>
  );
}
