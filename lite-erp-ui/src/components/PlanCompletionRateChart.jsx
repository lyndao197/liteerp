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
          onMouseEnter={() =>
            setHoveredPart({
              chartId,
              part: 'done',
              label: 'Đã thực hiện',
              val: `${ratePercent.toFixed(1).replace('.', ',')}% (${actualVal} ${unit})`
            })
          }
          onMouseLeave={() => setHoveredPart(null)}
        />

        {/* Slice 2: Còn phải thực hiện để đạt KH (Light Grey #e5e7eb) */}
        <path
          d={remainPath}
          fill="#e5e7eb"
          stroke="#ffffff"
          strokeWidth={1.5}
          style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
          onMouseEnter={() =>
            setHoveredPart({
              chartId,
              part: 'remain',
              label: 'Còn phải thực hiện để đạt KH',
              val: `${(100 - ratePercent).toFixed(1).replace('.', ',')}%`
            })
          }
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
          <span style={{ fontWeight: 600 }}>{hoveredPart.label}: </span>
          <span style={{ color: '#93c5fd' }}>{hoveredPart.val}</span>
        </div>
      )}
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
    ratePercent: 62.2,
    actualVal: '775,0',
    targetVal: '1.246,0',
    unit: 'triệu đồng',
    doneColor: '#1d4877',
    timeElapsedPercent: timeElapsedQuarterPercent || 66.7,
    timeElapsedLabel: timeElapsedQuarterLabel || '66,7%',
    headerCategory: 'Tỷ lệ hoàn thành kế hoạch - Tổng doanh thu',
    chartTitle: `Lũy kế Quý ${quarterRoman}/${selectedYear} (${quarterCumText})`,
    comparisonSubtitle: `so với KH Quý ${quarterRoman}`
  };

  // Chart 30 (Năm): 2.976,3 / 4.968,1 => 59,9%
  const chart30Data = {
    ratePercent: 59.9,
    actualVal: '2.976,3',
    targetVal: '4.968,1',
    unit: 'triệu đồng',
    doneColor: '#1d4877',
    timeElapsedPercent: timeElapsedYearPercent || 66.7,
    timeElapsedLabel: timeElapsedYearLabel || '66,7%',
    chartTitle: `Lũy kế ${monthNum} tháng ${selectedYear}`,
    comparisonSubtitle: `so với KH cả năm ${selectedYear}`
  };

  return (
    <div
      className="plan-completion-rate-card"
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        padding: '22px 24px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px'
      }}
    >
      {/* 1. Header Card với tiêu đề và cơ sở so sánh */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '14px',
          borderBottom: '1px solid #f1f5f9',
          paddingBottom: '14px'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <h2
            style={{
              fontSize: '17px',
              fontWeight: '700',
              color: '#1b3a6b',
              margin: 0,
              lineHeight: 1.35
            }}
          >
            Tỷ lệ hoàn thành kế hoạch tổng doanh thu (lũy kế Quý / lũy kế năm)
          </h2>
          <div
            style={{
              fontSize: '13.5px',
              color: '#1e293b',
              lineHeight: 1.5,
              fontWeight: '500'
            }}
          >
            <strong>Cơ sở so sánh:</strong> Quý: TH {quarterCumText} – KH Quý {quarterRoman} | Năm: TH {monthNum} tháng – KH cả năm; vạch đỏ là mốc thời gian đã trôi qua ({timeElapsedYearLabel})
          </div>
        </div>
      </div>

      {/* 2. Hai biểu đồ đặt cạnh nhau */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          alignItems: 'flex-start'
        }}
      >
        {/* Biểu đồ 29 (Lũy kế Quý) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            padding: '10px 14px'
          }}
        >
          <div style={{ minHeight: '66px', marginBottom: '8px' }}>
            <div
              style={{
                fontSize: '14px',
                fontWeight: '700',
                color: '#0f172a',
                marginBottom: '4px'
              }}
            >
              {chart29Data.headerCategory}
            </div>
            <div style={{ fontSize: '13px', color: '#334155', lineHeight: 1.35 }}>
              {chart29Data.chartTitle}
            </div>
            <div style={{ fontSize: '13px', color: '#334155', lineHeight: 1.35 }}>
              {chart29Data.comparisonSubtitle}
            </div>
          </div>

          <CompletionGaugeDonut
            ratePercent={chart29Data.ratePercent}
            actualVal={chart29Data.actualVal}
            targetVal={chart29Data.targetVal}
            unit={chart29Data.unit}
            doneColor={chart29Data.doneColor}
            timeElapsedPercent={chart29Data.timeElapsedPercent}
            timeElapsedLabel={chart29Data.timeElapsedLabel}
            hoveredPart={hoveredPart}
            setHoveredPart={setHoveredPart}
            chartId="chart29"
          />
        </div>

        {/* Biểu đồ 30 (Lũy kế Năm) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            padding: '10px 14px'
          }}
        >
          <div style={{ minHeight: '66px', marginBottom: '8px' }}>
            <div
              style={{
                fontSize: '14px',
                fontWeight: '700',
                color: 'transparent',
                marginBottom: '4px',
                userSelect: 'none'
              }}
            >
              &nbsp;
            </div>
            <div style={{ fontSize: '13px', color: '#334155', lineHeight: 1.35 }}>
              {chart30Data.chartTitle}
            </div>
            <div style={{ fontSize: '13px', color: '#334155', lineHeight: 1.35 }}>
              {chart30Data.comparisonSubtitle}
            </div>
          </div>

          <CompletionGaugeDonut
            ratePercent={chart30Data.ratePercent}
            actualVal={chart30Data.actualVal}
            targetVal={chart30Data.targetVal}
            unit={chart30Data.unit}
            doneColor={chart30Data.doneColor}
            timeElapsedPercent={chart30Data.timeElapsedPercent}
            timeElapsedLabel={chart30Data.timeElapsedLabel}
            hoveredPart={hoveredPart}
            setHoveredPart={setHoveredPart}
            chartId="chart30"
          />
        </div>
      </div>

      {/* 3. Chú thích (Legend) nằm ngang */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '28px',
          flexWrap: 'wrap',
          paddingTop: '16px',
          borderTop: '1px solid #f1f5f9'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              width: '20px',
              height: '11px',
              backgroundColor: '#1d4877',
              borderRadius: '2px',
              display: 'inline-block'
            }}
          />
          <span style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>
            Đã thực hiện
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              width: '20px',
              height: '11px',
              backgroundColor: '#e5e7eb',
              borderRadius: '2px',
              display: 'inline-block'
            }}
          />
          <span style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>
            Còn phải thực hiện để đạt KH
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              width: '24px',
              height: '3px',
              backgroundColor: '#b91c1c',
              borderRadius: '2px',
              display: 'inline-block'
            }}
          />
          <span style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>
            Mốc thời gian đã trôi qua của kỳ
          </span>
        </div>
      </div>

      {/* Bảng dữ liệu chi tiết tiến độ kế hoạch tổng doanh thu (Biểu đồ 29 – 30) */}
      <TotalRevenuePlanProgressTable
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
      />

      {onOpenDetail && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '4px' }}>
          <button
            type="button"
            className="subcard-detail-action-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12.5px',
              fontWeight: '600',
              color: '#1d4ed8',
              backgroundColor: '#eff6ff',
              border: '1px solid #bfdbfe',
              padding: '6px 14px',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onClick={() => onOpenDetail({
              chartKey: 'chart29_30',
              chartTitle: `Tỷ lệ hoàn thành kế hoạch tổng doanh thu`
            })}
          >
            <span>Xem chi tiết</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}
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
    ratePercent: 60.2,
    actualVal: '525,0',
    targetVal: '872,2',
    unit: 'triệu đồng',
    doneColor: '#2563eb', // Royal Blue matching screenshot
    timeElapsedPercent: timeElapsedQuarterPercent || 66.7,
    timeElapsedLabel: timeElapsedQuarterLabel || '66,7%',
    headerCategory: 'Tỷ lệ hoàn thành kế hoạch - Doanh thu ngoài Tập đoàn',
    chartTitle: `Lũy kế Quý ${quarterRoman}/${selectedYear} (${quarterCumText})`,
    comparisonSubtitle: `so với KH Quý ${quarterRoman}`
  };

  // Chart 32 (Năm): 2.022,8 / 3.477,7 => 58,2%
  const chart32Data = {
    ratePercent: 58.2,
    actualVal: '2.022,8',
    targetVal: '3.477,7',
    unit: 'triệu đồng',
    doneColor: '#2563eb', // Royal Blue matching screenshot
    timeElapsedPercent: timeElapsedYearPercent || 66.7,
    timeElapsedLabel: timeElapsedYearLabel || '66,7%',
    chartTitle: `Lũy kế ${monthNum} tháng ${selectedYear}`,
    comparisonSubtitle: `so với KH cả năm ${selectedYear}`
  };

  return (
    <div
      className="plan-completion-rate-card external-revenue-card"
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        padding: '22px 24px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px'
      }}
    >
      {/* 1. Header Card với tiêu đề và cơ sở so sánh chuẩn theo ảnh mẫu */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '14px',
          borderBottom: '1px solid #f1f5f9',
          paddingBottom: '14px'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <h2
            style={{
              fontSize: '17px',
              fontWeight: '700',
              color: '#1b3a6b',
              margin: 0,
              lineHeight: 1.35
            }}
          >
            Tỷ lệ hoàn thành kế hoạch doanh thu ngoài Tập đoàn (lũy kế Quý / lũy kế năm)
          </h2>
          <div
            style={{
              fontSize: '13.5px',
              color: '#1e293b',
              lineHeight: 1.5,
              fontWeight: '500'
            }}
          >
            <strong>Cơ sở so sánh:</strong> Như kế hoạch tổng doanh thu, áp dụng cho DT ngoài Tập đoàn
          </div>
        </div>
      </div>

      {/* 2. Hai biểu đồ đặt cạnh nhau */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          alignItems: 'flex-start'
        }}
      >
        {/* Biểu đồ 31 (Lũy kế Quý) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            padding: '10px 14px'
          }}
        >
          <div style={{ minHeight: '66px', marginBottom: '8px' }}>
            <div
              style={{
                fontSize: '14px',
                fontWeight: '700',
                color: '#0f172a',
                marginBottom: '4px'
              }}
            >
              {chart31Data.headerCategory}
            </div>
            <div style={{ fontSize: '13px', color: '#334155', lineHeight: 1.35 }}>
              {chart31Data.chartTitle}
            </div>
            <div style={{ fontSize: '13px', color: '#334155', lineHeight: 1.35 }}>
              {chart31Data.comparisonSubtitle}
            </div>
          </div>

          <CompletionGaugeDonut
            ratePercent={chart31Data.ratePercent}
            actualVal={chart31Data.actualVal}
            targetVal={chart31Data.targetVal}
            unit={chart31Data.unit}
            doneColor={chart31Data.doneColor}
            timeElapsedPercent={chart31Data.timeElapsedPercent}
            timeElapsedLabel={chart31Data.timeElapsedLabel}
            hoveredPart={hoveredPart}
            setHoveredPart={setHoveredPart}
            chartId="chart31"
          />
        </div>

        {/* Biểu đồ 32 (Lũy kế Năm) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            padding: '10px 14px'
          }}
        >
          <div style={{ minHeight: '66px', marginBottom: '8px' }}>
            <div
              style={{
                fontSize: '14px',
                fontWeight: '700',
                color: 'transparent',
                marginBottom: '4px',
                userSelect: 'none'
              }}
            >
              &nbsp;
            </div>
            <div style={{ fontSize: '13px', color: '#334155', lineHeight: 1.35 }}>
              {chart32Data.chartTitle}
            </div>
            <div style={{ fontSize: '13px', color: '#334155', lineHeight: 1.35 }}>
              {chart32Data.comparisonSubtitle}
            </div>
          </div>

          <CompletionGaugeDonut
            ratePercent={chart32Data.ratePercent}
            actualVal={chart32Data.actualVal}
            targetVal={chart32Data.targetVal}
            unit={chart32Data.unit}
            doneColor={chart32Data.doneColor}
            timeElapsedPercent={chart32Data.timeElapsedPercent}
            timeElapsedLabel={chart32Data.timeElapsedLabel}
            hoveredPart={hoveredPart}
            setHoveredPart={setHoveredPart}
            chartId="chart32"
          />
        </div>
      </div>

      {/* 3. Chú thích (Legend) nằm ngang ở đáy chuẩn theo ảnh */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '28px',
          flexWrap: 'wrap',
          paddingTop: '16px',
          borderTop: '1px solid #f1f5f9'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              width: '20px',
              height: '11px',
              backgroundColor: '#2563eb',
              borderRadius: '2px',
              display: 'inline-block'
            }}
          />
          <span style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>
            Đã thực hiện
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              width: '20px',
              height: '11px',
              backgroundColor: '#e5e7eb',
              borderRadius: '2px',
              display: 'inline-block'
            }}
          />
          <span style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>
            Còn phải thực hiện để đạt KH
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              width: '24px',
              height: '3px',
              backgroundColor: '#b91c1c',
              borderRadius: '2px',
              display: 'inline-block'
            }}
          />
          <span style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>
            Mốc thời gian đã trôi qua của kỳ
          </span>
        </div>
      </div>

      {/* Bảng dữ liệu chi tiết tiến độ kế hoạch doanh thu ngoài Tập đoàn (Biểu đồ 31 – 32) */}
      <ExternalRevenuePlanProgressTable
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
      />

      {onOpenDetail && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '4px' }}>
          <button
            type="button"
            className="subcard-detail-action-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12.5px',
              fontWeight: '600',
              color: '#2563eb',
              backgroundColor: '#eff6ff',
              border: '1px solid #bfdbfe',
              padding: '6px 14px',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onClick={() => onOpenDetail({
              chartKey: 'chart31_32',
              chartTitle: `Tỷ lệ hoàn thành kế hoạch doanh thu ngoài Tập đoàn`
            })}
          >
            <span>Xem chi tiết</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}
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
    ratePercent: 54.7,
    actualVal: '81,9',
    targetVal: '149,6',
    unit: 'triệu đồng',
    doneColor: '#c25e1a', // Burnt orange matching screenshot
    timeElapsedPercent: timeElapsedQuarterPercent || 66.7,
    timeElapsedLabel: timeElapsedQuarterLabel || '66,7%',
    headerCategory: 'Tỷ lệ hoàn thành kế hoạch - Doanh thu quốc tế',
    chartTitle: `Lũy kế Quý ${quarterRoman}/${selectedYear} (${quarterCumText})`,
    comparisonSubtitle: `so với KH Quý ${quarterRoman}`
  };

  // Chart 34 (Năm): 313,9 / 596,3 => 52,6%
  const chart34Data = {
    ratePercent: 52.6,
    actualVal: '313,9',
    targetVal: '596,3',
    unit: 'triệu đồng',
    doneColor: '#c25e1a', // Burnt orange matching screenshot
    timeElapsedPercent: timeElapsedYearPercent || 66.7,
    timeElapsedLabel: timeElapsedYearLabel || '66,7%',
    chartTitle: `Lũy kế ${monthNum} tháng ${selectedYear}`,
    comparisonSubtitle: `so với KH cả năm ${selectedYear}`
  };

  return (
    <div
      className="plan-completion-rate-card international-revenue-card"
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        padding: '22px 24px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px'
      }}
    >
      {/* 1. Header Card với tiêu đề và cơ sở so sánh chuẩn theo ảnh mẫu */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '14px',
          borderBottom: '1px solid #f1f5f9',
          paddingBottom: '14px'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <h2
            style={{
              fontSize: '17px',
              fontWeight: '700',
              color: '#1b3a6b',
              margin: 0,
              lineHeight: 1.35
            }}
          >
            Tỷ lệ hoàn thành kế hoạch doanh thu quốc tế (lũy kế Quý / lũy kế năm)
          </h2>
          <div
            style={{
              fontSize: '13.5px',
              color: '#1e293b',
              lineHeight: 1.5,
              fontWeight: '500'
            }}
          >
            <strong>Cơ sở so sánh:</strong> Như kế hoạch tổng doanh thu, áp dụng cho DT quốc tế
          </div>
        </div>
      </div>

      {/* 2. Hai biểu đồ đặt cạnh nhau */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          alignItems: 'flex-start'
        }}
      >
        {/* Biểu đồ 33 (Lũy kế Quý) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            padding: '10px 14px'
          }}
        >
          <div style={{ minHeight: '66px', marginBottom: '8px' }}>
            <div
              style={{
                fontSize: '14px',
                fontWeight: '700',
                color: '#0f172a',
                marginBottom: '4px'
              }}
            >
              {chart33Data.headerCategory}
            </div>
            <div style={{ fontSize: '13px', color: '#334155', lineHeight: 1.35 }}>
              {chart33Data.chartTitle}
            </div>
            <div style={{ fontSize: '13px', color: '#334155', lineHeight: 1.35 }}>
              {chart33Data.comparisonSubtitle}
            </div>
          </div>

          <CompletionGaugeDonut
            ratePercent={chart33Data.ratePercent}
            actualVal={chart33Data.actualVal}
            targetVal={chart33Data.targetVal}
            unit={chart33Data.unit}
            doneColor={chart33Data.doneColor}
            timeElapsedPercent={chart33Data.timeElapsedPercent}
            timeElapsedLabel={chart33Data.timeElapsedLabel}
            hoveredPart={hoveredPart}
            setHoveredPart={setHoveredPart}
            chartId="chart33"
          />
        </div>

        {/* Biểu đồ 34 (Lũy kế Năm) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            padding: '10px 14px'
          }}
        >
          <div style={{ minHeight: '66px', marginBottom: '8px' }}>
            <div
              style={{
                fontSize: '14px',
                fontWeight: '700',
                color: 'transparent',
                marginBottom: '4px',
                userSelect: 'none'
              }}
            >
              &nbsp;
            </div>
            <div style={{ fontSize: '13px', color: '#334155', lineHeight: 1.35 }}>
              {chart34Data.chartTitle}
            </div>
            <div style={{ fontSize: '13px', color: '#334155', lineHeight: 1.35 }}>
              {chart34Data.comparisonSubtitle}
            </div>
          </div>

          <CompletionGaugeDonut
            ratePercent={chart34Data.ratePercent}
            actualVal={chart34Data.actualVal}
            targetVal={chart34Data.targetVal}
            unit={chart34Data.unit}
            doneColor={chart34Data.doneColor}
            timeElapsedPercent={chart34Data.timeElapsedPercent}
            timeElapsedLabel={chart34Data.timeElapsedLabel}
            hoveredPart={hoveredPart}
            setHoveredPart={setHoveredPart}
            chartId="chart34"
          />
        </div>
      </div>

      {/* 3. Chú thích (Legend) nằm ngang ở đáy chuẩn theo ảnh */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '28px',
          flexWrap: 'wrap',
          paddingTop: '16px',
          borderTop: '1px solid #f1f5f9'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              width: '20px',
              height: '11px',
              backgroundColor: '#c25e1a',
              borderRadius: '2px',
              display: 'inline-block'
            }}
          />
          <span style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>
            Đã thực hiện
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              width: '20px',
              height: '11px',
              backgroundColor: '#e5e7eb',
              borderRadius: '2px',
              display: 'inline-block'
            }}
          />
          <span style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>
            Còn phải thực hiện để đạt KH
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              width: '24px',
              height: '3px',
              backgroundColor: '#b91c1c',
              borderRadius: '2px',
              display: 'inline-block'
            }}
          />
          <span style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>
            Mốc thời gian đã trôi qua của kỳ
          </span>
        </div>
      </div>

      {/* Bảng dữ liệu chi tiết tiến độ kế hoạch doanh thu quốc tế */}
      <InternationalRevenuePlanProgressTable
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
      />

      {onOpenDetail && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '4px' }}>
          <button
            type="button"
            className="subcard-detail-action-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12.5px',
              fontWeight: '600',
              color: '#c2410c',
              backgroundColor: '#fff7ed',
              border: '1px solid #fed7aa',
              padding: '6px 14px',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onClick={() => onOpenDetail({
              chartKey: 'chart33_34',
              chartTitle: `Tỷ lệ hoàn thành kế hoạch doanh thu quốc tế`
            })}
          >
            <span>Xem chi tiết</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
