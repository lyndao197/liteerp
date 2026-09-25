import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer, AreaChart, Area, LineChart, Line,
  BarChart, Bar, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip
} from 'recharts';
import {
  TrendingUp, TrendingDown, Calendar, RefreshCw,
  FileSpreadsheet, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, ChevronDown, ChevronUp, ChevronRight,
  PieChart as PieIcon, BarChart2, CheckCircle2, AlertCircle,
  DollarSign, Award, Users, FileText, Smile, Target, Sparkles,
  Layers, ArrowUpRight, ArrowDownRight, Activity, Globe,
  Building2, Landmark, Percent, Briefcase, Compass, Info, Maximize2, MoreVertical, Clock,
  Search, Check, Filter, X
} from 'lucide-react';
import * as XLSX from 'xlsx';
import {
  INTERNAL_EXTERNAL_DATA,
  DOMESTIC_INTERNATIONAL_DATA
} from '../data/revenueInternalExternalData';
import { SPDV_STRUCTURE_DATA } from '../data/revenueSpdvData';
import { UNIT_STRUCTURE_DATA } from '../data/revenueUnitData';
import './Dashboard.css';

const YEAR_OPTIONS = ['2026', '2025', '2024'];
const QUARTER_OPTIONS = ['Quý I', 'Quý II', 'Quý III', 'Quý IV'];
const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => `Tháng ${i + 1}`);

// 12-month full dataset for Item 10: Xu thế tổng doanh thu
const MONTHLY_TREND_FULL = [
  { month: 'T1', actual: 315.4, plan: 335.0, lastYear: 288.0, profit: 39.4 },
  { month: 'T2', actual: 298.2, plan: 320.0, lastYear: 275.5, profit: 37.2 },
  { month: 'T3', actual: 362.5, plan: 375.0, lastYear: 320.0, profit: 45.3 },
  { month: 'T4', actual: 378.0, plan: 390.0, lastYear: 342.0, profit: 47.2 },
  { month: 'T5', actual: 395.2, plan: 410.0, lastYear: 355.0, profit: 49.4 },
  { month: 'T6', actual: 410.0, plan: 425.0, lastYear: 370.0, profit: 51.2 },
  { month: 'T7', actual: 385.1, plan: 405.0, lastYear: 364.3, profit: 48.1 },
  { month: 'T8', actual: 389.9, plan: 414.0, lastYear: 364.3, profit: 48.6 },
  { month: 'T9', actual: 405.0, plan: 427.0, lastYear: 382.0, profit: 50.6 },
  { month: 'T10', actual: 420.0, plan: 440.0, lastYear: 395.0, profit: 52.5 },
  { month: 'T11', actual: 435.0, plan: 455.0, lastYear: 410.0, profit: 54.3 },
  { month: 'T12', actual: 460.0, plan: 480.0, lastYear: 432.0, profit: 57.5 }
];

// Pipeline LEAD theo giai đoạn dataset
const LEAD_PIPELINE_DATA = [
  { stage: 'Mới', displayLabel: 'Mới', value: 125.0, deals: 66, color: '#7ea5fc' },
  { stage: 'Đang tiếp xúc', displayLabel: 'Đang tiếp\nxúc', value: 95.0, deals: 49, color: '#4385f5' },
  { stage: 'Đánh giá nhu cầu', displayLabel: 'Đánh giá\nnhu cầu', value: 85.0, deals: 38, color: '#1f64f2' },
  { stage: 'Xây dựng PA thực hiện', displayLabel: 'Xây dựng\nPA thực hiện', value: 90.0, deals: 32, color: '#5550df' },
  { stage: 'Đang báo giá', displayLabel: 'Đang báo\ngiá', value: 88.0, deals: 28, color: '#8b44f7' },
  { stage: 'POC', displayLabel: 'POC', value: 45.0, deals: 13, color: '#ad55f8' },
  { stage: 'Đấu thầu', displayLabel: 'Đấu thầu', value: 78.0, deals: 16, color: '#e13b8a' },
  { stage: 'Đang ký hợp đồng', displayLabel: 'Đang ký\nhợp đồng', value: 35.0, deals: 10, color: '#f97316' },
  { stage: 'Đã ký hợp đồng', displayLabel: 'Đã ký\nhợp đồng', value: 376.6, deals: 147, color: '#059669' },
  { stage: 'Không thành công', displayLabel: 'Không thành\ncông', value: 75.5, deals: 36, color: '#8f9bb3' }
];

// Custom tick renderer for Pipeline LEAD X-axis with line-break support
const renderPipelineCustomTick = ({ x, y, payload }) => {
  if (!payload || !payload.value) return null;
  const lines = payload.value.split('\n');
  return (
    <g transform={`translate(${x},${y})`}>
      {lines.map((line, i) => (
        <text
          key={i}
          x={0}
          y={i * 14 + 12}
          textAnchor="middle"
          fill="#334155"
          fontSize={12}
          fontWeight={500}
          fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        >
          {line}
        </text>
      ))}
    </g>
  );
};

// Custom top label for Pipeline LEAD bars
const renderPipelineCustomLabel = (props) => {
  const { x, y, width, index } = props;
  const item = LEAD_PIPELINE_DATA[index];
  if (!item || x === undefined || y === undefined) return null;
  return (
    <text
      x={x + width / 2}
      y={y - 8}
      fill="#0f172a"
      textAnchor="middle"
      fontSize={12}
      fontWeight={700}
      fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    >
      {item.deals} deal
    </text>
  );
};

// Baseline data for T8/2026 matching corporate executive dashboard
const MONTHLY_EXECUTIVE_DATA = {
  '2026': {
    8: {
      month: 8,
      year: '2026',
      quarter: 'III',
      kpis: {
        totalRevenue: { value: 389.9, plan: 414.0, rate: 94.2, diffPrev: 4.8, percentPrev: 1.2, diffYear: 25.6, percentYear: 7.0, unit: 'Triệu đồng' },
        profitBeforeTax: { value: 48.6, plan: 50.0, rate: 97.2, diffPrev: 0.5, percentPrev: 1.0, diffYear: 3.8, percentYear: 8.5, unit: 'Triệu đồng' },
        profitMargin: { value: 12.5, plan: 12.1, rate: 103.3, diffPrev: 0.1, percentPrev: 0.8, diffYear: 0.4, percentYear: 3.3, unit: '%' },
        internalRevenue: { value: 127.2, plan: 124.2, rate: 102.4, diffPrev: 4.4, percentPrev: 3.6, diffYear: 4.3, percentYear: 3.5, unit: 'Triệu đồng' },
        externalRevenue: { value: 262.7, plan: 289.8, rate: 90.6, diffPrev: 0.4, percentPrev: 0.2, diffYear: 21.3, percentYear: 8.8, unit: 'Triệu đồng' },
        domesticRevenue: { value: 347.1, plan: 369.0, rate: 94.1, diffPrev: 3.6, percentPrev: 1.0, diffYear: 19.0, percentYear: 5.8, unit: 'Triệu đồng' },
        globalRevenue: { value: 42.8, plan: 45.0, rate: 95.1, diffPrev: 1.2, percentPrev: 2.9, diffYear: 6.6, percentYear: 18.2, unit: 'Triệu đồng' },
        customerCount: { value: 1248, plan: 1170, rate: 106.7, diffPrev: 48, percentPrev: 4.0, diffYear: 182, percentYear: 17.1, unit: 'KH' },
        contractCount: { value: 856, plan: 820, rate: 104.4, diffPrev: 74, percentPrev: 9.5, diffYear: 114, percentYear: 15.4, unit: 'HĐ' },
        customerSatisfaction: { value: 96.4, plan: 95.0, rate: 101.5, diffPrev: 0.4, percentPrev: 0.4, diffYear: 1.6, percentYear: 1.7, unit: '%' }
      },
      total: {
        actual: 389.9,
        plan: 414.0,
        rate: 94.2,
        vsPrev: { value: 4.8, percent: 1.2, isUp: true },
        vsLastYear: { value: 25.6, percent: 7.0, isUp: true },
        table: [
          { period: 'T8/2026', actual: 389.9, plan: 414.0, rate: 94.2, growth: 7.0, isUp: true },
          { period: 'Quý III', actual: 775.0, plan: 1246.0, rate: 62.2, growth: 8.7, isUp: true },
          { period: 'Luỹ kế năm 2026', actual: 2976.3, plan: 3043.1, rate: 97.8, growth: 12.8, isUp: true },
          { period: 'Năm 2026', actual: 2976.3, plan: 4968.1, rate: 59.9, growth: null, isUp: null }
        ]
      },
      internal: {
        actual: 127.2,
        plan: 124.2,
        rate: 102.4,
        vsPrev: { value: 4.4, percent: 3.6, isUp: true },
        vsLastYear: { value: 4.3, percent: 3.5, isUp: true },
        table: [
          { period: 'T8/2026', actual: 127.2, plan: 124.2, rate: 102.4, growth: 3.5, isUp: true },
          { period: 'Quý III', actual: 250.0, plan: 373.8, rate: 66.9, growth: 4.2, isUp: true },
          { period: 'Luỹ kế năm 2026', actual: 953.5, plan: 912.9, rate: 104.4, growth: 6.8, isUp: true },
          { period: 'Năm 2026', actual: 953.5, plan: 1490.4, rate: 64.0, growth: null, isUp: null }
        ]
      },
      external: {
        actual: 262.7,
        plan: 289.8,
        rate: 90.6,
        vsPrev: { value: 0.4, percent: 0.2, isUp: true },
        vsLastYear: { value: 21.3, percent: 8.8, isUp: true },
        table: [
          { period: 'T8/2026', actual: 262.7, plan: 289.8, rate: 90.6, growth: 8.8, isUp: true },
          { period: 'Quý III', actual: 525.0, plan: 872.2, rate: 60.2, growth: 11.6, isUp: true },
          { period: 'Luỹ kế năm 2026', actual: 2022.8, plan: 2130.2, rate: 95.0, growth: 17.5, isUp: true },
          { period: 'Năm 2026', actual: 2022.8, plan: 3477.7, rate: 58.2, growth: null, isUp: null }
        ]
      },
      domestic: {
        actual: 347.1,
        plan: 369.0,
        rate: 94.1,
        vsPrev: { value: 3.6, percent: 1.0, isUp: true },
        vsLastYear: { value: 19.0, percent: 5.8, isUp: true },
        table: [
          { period: 'T8/2026', actual: 347.1, plan: 369.0, rate: 94.1, growth: 5.8, isUp: true },
          { period: 'Quý III', actual: 692.9, plan: 1096.5, rate: 63.2, growth: 7.8, isUp: true },
          { period: 'Luỹ kế năm 2026', actual: 2663.8, plan: 2713.1, rate: 98.2, growth: 12.0, isUp: true },
          { period: 'Năm 2026', actual: 2663.8, plan: 4421.6, rate: 60.2, growth: null, isUp: null }
        ]
      },
      global: {
        actual: 42.8,
        plan: 45.0,
        rate: 95.1,
        table: [
          { period: 'T8/2026', actual: 42.8, plan: 45.0, rate: 95.1, growth: 18.2, isUp: true },
          { period: 'Quý III', actual: 82.1, plan: 149.5, rate: 54.9, growth: 16.5, isUp: true },
          { period: 'Luỹ kế năm 2026', actual: 312.5, plan: 330.0, rate: 94.7, growth: 19.4, isUp: true },
          { period: 'Năm 2026', actual: 312.5, plan: 546.5, rate: 57.2, growth: null, isUp: null }
        ]
      },
      customers: {
        actual: 1248,
        plan: 1170,
        rate: 106.7,
        vsPrev: { value: 48, percent: 4.0, isUp: true },
        vsLastYear: { value: 182, percent: 17.1, isUp: true },
        table: [
          { period: 'T8/2026', actual: 1248, plan: 1170, rate: 106.7, growth: 17.1, isUp: true },
          { period: 'Quý III', actual: 2450, plan: 3510, rate: 69.8, growth: 15.5, isUp: true },
          { period: 'Luỹ kế năm 2026', actual: 9480, plan: 8775, rate: 108.0, growth: 18.2, isUp: true },
          { period: 'Năm 2026', actual: 9480, plan: 14040, rate: 67.5, growth: null, isUp: null }
        ]
      },
      contracts: {
        actual: 856,
        plan: 820,
        rate: 104.4,
        table: [
          { period: 'T8/2026', actual: 856, plan: 820, rate: 104.4, growth: 15.4, isUp: true },
          { period: 'Quý III', actual: 1680, plan: 2460, rate: 68.3, growth: 14.2, isUp: true },
          { period: 'Luỹ kế năm 2026', actual: 6420, plan: 6150, rate: 104.4, growth: 16.0, isUp: true },
          { period: 'Năm 2026', actual: 6420, plan: 9840, rate: 65.2, growth: null, isUp: null }
        ]
      }
    }
  }
};

// Generate data dynamically for any month and year
function getMonthData(m, y = '2026') {
  if (MONTHLY_EXECUTIVE_DATA[y] && MONTHLY_EXECUTIVE_DATA[y][m]) {
    return MONTHLY_EXECUTIVE_DATA[y][m];
  }
  const quarterMap = { 1: 'I', 2: 'I', 3: 'I', 4: 'II', 5: 'II', 6: 'II', 7: 'III', 8: 'III', 9: 'III', 10: 'IV', 11: 'IV', 12: 'IV' };
  const yearScale = y === '2025' ? 0.92 : (y === '2024' ? 0.84 : 1.0);

  const tTotal = +(389.9 * (0.85 + (m % 4) * 0.08) * yearScale).toFixed(1);
  const pTotal = +(414.0 * (0.9 + (m % 3) * 0.05) * yearScale).toFixed(1);
  const rTotal = +((tTotal / pTotal) * 100).toFixed(1);

  const tInt = +(tTotal * 0.32).toFixed(1);
  const pInt = +(pTotal * 0.30).toFixed(1);
  const rInt = +((tInt / pInt) * 100).toFixed(1);

  const tExt = +(tTotal - tInt).toFixed(1);
  const pExt = +(pTotal - pInt).toFixed(1);
  const rExt = +((tExt / pExt) * 100).toFixed(1);

  const tGlobal = +(tTotal * 0.11).toFixed(1);
  const pGlobal = +(pTotal * 0.11).toFixed(1);
  const rGlobal = +((tGlobal / pGlobal) * 100).toFixed(1);

  const tDomestic = +(tTotal - tGlobal).toFixed(1);
  const pDomestic = +(pTotal - pGlobal).toFixed(1);
  const rDomestic = +((tDomestic / pDomestic) * 100).toFixed(1);

  const profit = +(tTotal * 0.125).toFixed(1);
  const pProfit = +(pTotal * 0.121).toFixed(1);
  const rProfit = +((profit / pProfit) * 100).toFixed(1);

  const ros = +((profit / tTotal) * 100).toFixed(1);
  const pRos = +((pProfit / pTotal) * 100).toFixed(1);

  const contracts = Math.round(856 * (0.9 + m * 0.02) * yearScale);
  const pContracts = Math.round(820 * (0.9 + m * 0.02) * yearScale);

  return {
    month: m,
    year: y,
    quarter: quarterMap[m],
    kpis: {
      totalRevenue: { value: tTotal, plan: pTotal, rate: rTotal, diffPrev: +(tTotal * 0.015).toFixed(1), percentPrev: 1.5, diffYear: +(tTotal * 0.06).toFixed(1), percentYear: 6.2, unit: 'Triệu đồng' },
      profitBeforeTax: { value: profit, plan: pProfit, rate: rProfit, diffPrev: +(profit * 0.02).toFixed(1), percentPrev: 2.0, diffYear: +(profit * 0.08).toFixed(1), percentYear: 8.0, unit: 'Triệu đồng' },
      profitMargin: { value: ros, plan: pRos, rate: +((ros / pRos) * 100).toFixed(1), diffPrev: 0.1, percentPrev: 0.8, diffYear: 0.3, percentYear: 2.5, unit: '%' },
      internalRevenue: { value: tInt, plan: pInt, rate: rInt, diffPrev: +(tInt * 0.03).toFixed(1), percentPrev: 3.1, diffYear: +(tInt * 0.035).toFixed(1), percentYear: 3.4, unit: 'Triệu đồng' },
      externalRevenue: { value: tExt, plan: pExt, rate: rExt, diffPrev: +(tExt * 0.01).toFixed(1), percentPrev: 0.8, diffYear: +(tExt * 0.08).toFixed(1), percentYear: 8.2, unit: 'Triệu đồng' },
      domesticRevenue: { value: tDomestic, plan: pDomestic, rate: rDomestic, diffPrev: +(tDomestic * 0.01).toFixed(1), percentPrev: 1.0, diffYear: +(tDomestic * 0.055).toFixed(1), percentYear: 5.8, unit: 'Triệu đồng' },
      globalRevenue: { value: tGlobal, plan: pGlobal, rate: rGlobal, diffPrev: +(tGlobal * 0.03).toFixed(1), percentPrev: 3.0, diffYear: +(tGlobal * 0.15).toFixed(1), percentYear: 15.0, unit: 'Triệu đồng' },
      customerCount: { value: Math.round(1248 * (0.9 + m * 0.02) * yearScale), plan: Math.round(1170 * (0.9 + m * 0.02) * yearScale), rate: 106.7, diffPrev: 35 + m, percentPrev: 3.2, diffYear: 150 + m * 4, percentYear: 14.5, unit: 'KH' },
      contractCount: { value: contracts, plan: pContracts, rate: +((contracts / pContracts) * 100).toFixed(1), diffPrev: 50 + m, percentPrev: 6.5, diffYear: 90 + m * 3, percentYear: 12.0, unit: 'HĐ' },
      customerSatisfaction: { value: 96.4, plan: 95.0, rate: 101.5, diffPrev: 0.2, percentPrev: 0.2, diffYear: 1.4, percentYear: 1.5, unit: '%' }
    },
    total: {
      actual: tTotal,
      plan: pTotal,
      rate: rTotal,
      vsPrev: { value: +(tTotal * 0.015).toFixed(1), percent: 1.5, isUp: true },
      vsLastYear: { value: +(tTotal * 0.06).toFixed(1), percent: 6.2, isUp: true },
      table: [
        { period: `T${m}/${y}`, actual: tTotal, plan: pTotal, rate: rTotal, growth: 7.2, isUp: true },
        { period: `Quý ${quarterMap[m]}`, actual: +(tTotal * 1.95).toFixed(1), plan: +(pTotal * 3).toFixed(1), rate: 65.0, growth: 8.5, isUp: true },
        { period: `Luỹ kế năm ${y}`, actual: +(tTotal * m * 0.95).toFixed(1), plan: +(pTotal * m).toFixed(1), rate: 95.2, growth: 11.5, isUp: true },
        { period: `Năm ${y}`, actual: +(tTotal * m * 0.95).toFixed(1), plan: +(4968.1 * yearScale).toFixed(1), rate: +((tTotal * m * 0.95 / (4968.1 * yearScale)) * 100).toFixed(1), growth: null, isUp: null }
      ]
    },
    internal: {
      actual: tInt,
      plan: pInt,
      rate: rInt,
      vsPrev: { value: +(tInt * 0.03).toFixed(1), percent: 3.1, isUp: true },
      vsLastYear: { value: +(tInt * 0.035).toFixed(1), percent: 3.4, isUp: true },
      table: [
        { period: `T${m}/${y}`, actual: tInt, plan: pInt, rate: rInt, growth: 5.8, isUp: true },
        { period: `Quý ${quarterMap[m]}`, actual: +(tInt * 1.92).toFixed(1), plan: +(pInt * 3).toFixed(1), rate: 64.0, growth: 6.5, isUp: true },
        { period: `Luỹ kế năm ${y}`, actual: +(tInt * m * 0.95).toFixed(1), plan: +(pInt * m).toFixed(1), rate: 95.0, growth: 8.2, isUp: true },
        { period: `Năm ${y}`, actual: +(tInt * m * 0.95).toFixed(1), plan: +(1490.4 * yearScale).toFixed(1), rate: 63.8, growth: null, isUp: null }
      ]
    },
    external: {
      actual: tExt,
      plan: pExt,
      rate: rExt,
      vsPrev: { value: +(tExt * 0.01).toFixed(1), percent: 0.8, isUp: true },
      vsLastYear: { value: +(tExt * 0.08).toFixed(1), percent: 8.2, isUp: true },
      table: [
        { period: `T${m}/${y}`, actual: tExt, plan: pExt, rate: rExt, growth: 8.5, isUp: true },
        { period: `Quý ${quarterMap[m]}`, actual: +(tExt * 1.9).toFixed(1), plan: +(pExt * 3).toFixed(1), rate: 61.2, growth: 11.2, isUp: true },
        { period: `Luỹ kế năm ${y}`, actual: +(tExt * m * 0.94).toFixed(1), plan: +(pExt * m).toFixed(1), rate: 94.0, growth: 16.8, isUp: true },
        { period: `Năm ${y}`, actual: +(tExt * m * 0.94).toFixed(1), plan: +(3477.7 * yearScale).toFixed(1), rate: 57.5, growth: null, isUp: null }
      ]
    },
    domestic: {
      actual: tDomestic,
      plan: pDomestic,
      rate: rDomestic,
      vsPrev: { value: +(tDomestic * 0.01).toFixed(1), percent: 1.0, isUp: true },
      vsLastYear: { value: +(tDomestic * 0.055).toFixed(1), percent: 5.8, isUp: true },
      table: [
        { period: `T${m}/${y}`, actual: tDomestic, plan: pDomestic, rate: rDomestic, growth: 5.8, isUp: true },
        { period: `Quý ${quarterMap[m]}`, actual: +(tDomestic * 1.95).toFixed(1), plan: +(pDomestic * 3).toFixed(1), rate: 63.2, growth: 7.8, isUp: true },
        { period: `Luỹ kế năm ${y}`, actual: +(tDomestic * m * 0.95).toFixed(1), plan: +(pDomestic * m).toFixed(1), rate: 98.2, growth: 12.0, isUp: true },
        { period: `Năm ${y}`, actual: +(tDomestic * m * 0.95).toFixed(1), plan: +(4421.6 * yearScale).toFixed(1), rate: 60.2, growth: null, isUp: null }
      ]
    },
    global: {
      actual: tGlobal,
      plan: pGlobal,
      rate: rGlobal,
      table: [
        { period: `T${m}/${y}`, actual: tGlobal, plan: pGlobal, rate: rGlobal, growth: 18.2, isUp: true },
        { period: `Quý ${quarterMap[m]}`, actual: +(tGlobal * 1.9).toFixed(1), plan: +(pGlobal * 3).toFixed(1), rate: 54.9, growth: 16.5, isUp: true },
        { period: `Luỹ kế năm ${y}`, actual: +(tGlobal * m * 0.95).toFixed(1), plan: +(pGlobal * m).toFixed(1), rate: 94.7, growth: 19.4, isUp: true },
        { period: `Năm ${y}`, actual: +(tGlobal * m * 0.95).toFixed(1), plan: +(546.5 * yearScale).toFixed(1), rate: 57.2, growth: null, isUp: null }
      ]
    },
    customers: {
      actual: Math.round(1248 * (0.9 + m * 0.02) * yearScale),
      plan: Math.round(1170 * (0.9 + m * 0.02) * yearScale),
      rate: 106.7,
      vsPrev: { value: 35 + m, percent: 3.2, isUp: true },
      vsLastYear: { value: 150 + m * 4, percent: 14.5, isUp: true },
      table: [
        { period: `T${m}/${y}`, actual: Math.round(1248 * (0.9 + m * 0.02) * yearScale), plan: Math.round(1170 * (0.9 + m * 0.02) * yearScale), rate: 106.7, growth: 12.4, isUp: true },
        { period: `Quý ${quarterMap[m]}`, actual: Math.round(1248 * 2.1 * yearScale), plan: Math.round(1170 * 3 * yearScale), rate: 74.5, growth: 10.8, isUp: true },
        { period: `Luỹ kế năm ${y}`, actual: Math.round(1248 * m * 0.96 * yearScale), plan: Math.round(1170 * m * yearScale), rate: 102.4, growth: 14.2, isUp: true },
        { period: `Năm ${y}`, actual: Math.round(1248 * m * 0.96 * yearScale), plan: Math.round(1170 * 12 * yearScale), rate: 68.3, growth: null, isUp: null }
      ]
    },
    contracts: {
      actual: contracts,
      plan: pContracts,
      rate: +((contracts / pContracts) * 100).toFixed(1),
      table: [
        { period: `T${m}/${y}`, actual: contracts, plan: pContracts, rate: +((contracts / pContracts) * 100).toFixed(1), growth: 15.4, isUp: true },
        { period: `Quý ${quarterMap[m]}`, actual: contracts * 2, plan: pContracts * 3, rate: 68.3, growth: 14.2, isUp: true },
        { period: `Luỹ kế năm ${y}`, actual: contracts * m, plan: pContracts * m, rate: 104.4, growth: 16.0, isUp: true },
        { period: `Năm ${y}`, actual: contracts * m, plan: pContracts * 12, rate: 65.2, growth: null, isUp: null }
      ]
    }
  };
}

// Speedometer Gauge Component matching Viettel Executive UI spec
const SpeedometerGauge = ({
  rate = 51,
  actual = 516.34,
  plan = 1010.8,
  unit = 'Triệu đồng',
  id = 'gauge',
  width = 200,
  height = 112,
  compact = false
}) => {
  const cx = 110;
  const cy = 104;
  const r = 72;
  const strokeWidth = 14;

  const isPercentMetric = unit === '%';
  const numericVal = typeof actual === 'number'
    ? actual
    : parseFloat(String(actual).replace(',', '.').replace('%', '')) || 0;

  const maxPercentScale = 25;
  const numericRate = typeof rate === 'number' ? rate : parseFloat(rate) || 0;
  const clampedRate = Math.min(Math.max(numericRate, 0), 100);

  const arcPath = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;
  const ticks = isPercentMetric ? [0, 5, 10, 15, 20, 25] : [0, 20, 40, 60, 80, 100];
  const tickRadius = 54;

  const needleLength = 64;
  const needleAngle = isPercentMetric
    ? Math.PI - (Math.min(Math.max(numericVal, 0), maxPercentScale) / maxPercentScale) * Math.PI
    : Math.PI - (clampedRate / 100) * Math.PI;

  const tipX = cx + needleLength * Math.cos(needleAngle);
  const tipY = cy - needleLength * Math.sin(needleAngle);

  const labelDist = needleLength + 15;
  const labelX = cx + labelDist * Math.cos(needleAngle);
  const labelY = Math.max(13, cy - labelDist * Math.sin(needleAngle));

  const needleDisplayVal = isPercentMetric
    ? `${numericVal.toString().replace('.', ',')}%`
    : `${Math.round(numericRate)}%`;

  const formatNum = (val) => {
    if (val === null || val === undefined) return '0';
    if (typeof val === 'string') return val;
    return val.toLocaleString('vi-VN', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  };

  return (
    <div className={`speedometer-container ${compact ? 'compact' : ''}`}>
      <svg width={width} height={height} viewBox="0 0 220 122" className="speedometer-svg">
        <defs>
          <linearGradient id={`speedo-grad-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="18%" stopColor="#fb923c" />
            <stop offset="40%" stopColor="#facc15" />
            <stop offset="64%" stopColor="#22c55e" />
            <stop offset="84%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>

          <filter id={`speedo-glow-${id}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Glow Halo */}
        <path
          d={arcPath}
          fill="none"
          stroke={`url(#speedo-grad-${id})`}
          strokeWidth={strokeWidth + 5}
          strokeLinecap="round"
          opacity="0.32"
          filter={`url(#speedo-glow-${id})`}
        />

        {/* Main Rainbow Gauge Arc */}
        <path
          d={arcPath}
          fill="none"
          stroke={`url(#speedo-grad-${id})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Inner Tick Labels */}
        {ticks.map((pct) => {
          const tAngle = isPercentMetric
            ? Math.PI - (pct / maxPercentScale) * Math.PI
            : Math.PI - (pct / 100) * Math.PI;
          const tx = cx + tickRadius * Math.cos(tAngle);
          const ty = cy - tickRadius * Math.sin(tAngle);
          return (
            <text
              key={pct}
              x={tx}
              y={pct === 0 || pct === (isPercentMetric ? 25 : 100) ? ty - 2 : ty + 3}
              textAnchor="middle"
              className="speedo-tick-text"
            >
              {pct}%
            </text>
          );
        })}

        {/* Needle Line */}
        <line
          x1={cx}
          y1={cy}
          x2={tipX}
          y2={tipY}
          stroke="#ea580c"
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{ transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}
        />

        {/* Pivot Hub */}
        <circle
          cx={cx}
          cy={cy}
          r="4.5"
          stroke="#ea580c"
          strokeWidth="2.5"
          fill="#ffffff"
        />

        {/* Value Label above needle tip */}
        <text
          x={labelX}
          y={labelY}
          textAnchor="middle"
          className="speedo-needle-val"
          style={{ transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}
        >
          {needleDisplayVal}
        </text>
      </svg>

      {/* Target & Actual Fraction below gauge */}
      <div className={`speedometer-fraction-text ${compact ? 'compact' : ''}`}>
        {isPercentMetric ? `Tỷ suất: ${numericVal.toString().replace('.', ',')}%` : `${formatNum(actual)} / ${formatNum(plan)} ${unit}`}
      </div>
    </div>
  );
};

// Circular Ring Progress Gauge matching user reference image, displaying only margin percentage
const CircularRingGauge = ({
  value = '10,0%',
  maxScale = 20,
  label = 'Tỷ suất',
  color = '#EE0033'
}) => {
  const size = 96;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const numVal = typeof value === 'number'
    ? value
    : parseFloat(String(value).replace(',', '.').replace('%', '')) || 0;

  const pct = Math.min(Math.max((numVal / maxScale) * 100, 0), 100);
  const strokeDashoffset = circumference - (pct / 100) * circumference;

  const displayString = typeof value === 'string' && value.includes('%')
    ? value
    : `${numVal.toString().replace('.', ',')}%`;

  return (
    <div className="circular-ring-gauge-container">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="circular-ring-svg">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <div className="circular-ring-center-content">
        <span className="circular-ring-center-rate">{displayString}</span>
        <span className="circular-ring-center-label">{label}</span>
      </div>
    </div>
  );
};

function getProfitTaxDetails(m, y, activePeriod) {
  const isT8 = m === 8 && y === '2026';
  const table = [
    { period: isT8 ? 'T8/2026' : `T${m}/${y}`, type: 'Tháng', actual: isT8 ? '39,0' : (39.0 * (0.88 + (m % 4) * 0.06)).toFixed(1).replace('.', ','), plan: isT8 ? '42,0' : (42.0 * (0.9 + (m % 3) * 0.05)).toFixed(1).replace('.', ','), rate: isT8 ? '92,9%' : '92,9%', rateNum: 92.9 },
    { period: 'Quý III', type: 'Quý', actual: isT8 ? '76,0' : (76.0 * (0.9 + (m % 3) * 0.05)).toFixed(1).replace('.', ','), plan: isT8 ? '118,0' : '118,0', rate: isT8 ? '64,4%' : '64,4%', rateNum: 64.4 },
    { period: isT8 ? 'Luỹ kế năm 2026' : `Luỹ kế năm ${y}`, type: 'LK', actual: isT8 ? '285,0' : (39.0 * m * 0.91).toFixed(1).replace('.', ','), plan: isT8 ? '310,0' : (42.0 * m * 0.92).toFixed(1).replace('.', ','), rate: isT8 ? '91,9%' : '91,9%', rateNum: 91.9 },
    { period: `Năm ${y}`, type: 'Năm', actual: isT8 ? '285,0' : (39.0 * m * 0.91).toFixed(1).replace('.', ','), plan: '520,0', rate: isT8 ? '54,8%' : '54,8%', rateNum: 54.8 }
  ];

  let activeItem = table[0];
  if (activePeriod === 'Quý') activeItem = table[1];
  else if (activePeriod === 'Năm') activeItem = table[3];

  return {
    table,
    activeItem,
    diffPrev: '5,4%',
    diffYear: '8,1%',
    prevMonthLabel: `T${m - 1 || 12}`,
    prevYearLabel: `T${m}/${+y - 1}`
  };
}

function getProfitMarginDetails(m, y, activePeriod) {
  const isT8 = m === 8 && y === '2026';
  const table = [
    { period: isT8 ? 'T8/2026' : `T${m}/${y}`, type: 'Tháng', actual: '10,0%', plan: '10,1%', rate: '99,0%', rateNum: 99.0 },
    { period: 'Quý III', type: 'Quý', actual: '9,8%', plan: '9,5%', rate: '103,2%', rateNum: 103.2 },
    { period: isT8 ? 'Luỹ kế năm 2026' : `Luỹ kế năm ${y}`, type: 'LK', actual: '9,6%', plan: '10,2%', rate: '94,1%', rateNum: 94.1 },
    { period: `Năm ${y}`, type: 'Năm', actual: '9,6%', plan: '10,5%', rate: '91,4%', rateNum: 91.4 }
  ];

  let activeItem = table[0];
  if (activePeriod === 'Quý') activeItem = table[1];
  else if (activePeriod === 'Năm') activeItem = table[3];

  return {
    table,
    activeItem,
    diffPrev: '0,4 điểm %',
    diffYear: '0,1 điểm %',
    prevMonthLabel: `T${m - 1 || 12}`,
    prevYearLabel: `T${m}/${+y - 1}`
  };
}

// Executive SVG Donut Chart with center total and detailed legend
const ExecutiveDonutChart = ({ slices = [], total = 0, unit = 'Triệu đồng' }) => {
  const size = 170;
  const cx = size / 2;
  const cy = size / 2;
  const radius = 54;
  const strokeWidth = 24;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <div className="exec-donut-component">
      <div className="exec-donut-svg-wrapper">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="exec-donut-svg">
          {slices.map((slice, idx) => {
            const strokeDasharray = `${(slice.percent / 100) * circumference} ${circumference}`;
            const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
            accumulatedPercent += slice.percent;
            return (
              <circle
                key={idx}
                cx={cx}
                cy={cy}
                r={radius}
                fill="transparent"
                stroke={slice.color}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                transform={`rotate(-90 ${cx} ${cy})`}
                className="exec-donut-slice"
              />
            );
          })}
        </svg>
        <div className="exec-donut-center-info">
          <span className="donut-center-total">
            {typeof total === 'number' ? total.toLocaleString('vi-VN', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) : total}
          </span>
          <span className="donut-center-unit">{unit}</span>
        </div>
      </div>

      <div className="exec-donut-legend">
        {slices.map((slice, idx) => (
          <div key={idx} className="donut-legend-item">
            <span className="donut-legend-dot" style={{ backgroundColor: slice.color }}></span>
            <div className="donut-legend-content">
              <div className="donut-legend-top">
                <span className="donut-legend-name">{slice.name}</span>
                <span className="donut-legend-pct" style={{ color: slice.color }}>{slice.percent}%</span>
              </div>
              <div className="donut-legend-val">
                {typeof slice.value === 'number' ? slice.value.toLocaleString('vi-VN', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) : slice.value} {unit}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Executive Horizontal Progress Breakdown for SPDV and Units
const ExecutiveBarBreakdown = ({ items = [], unit = 'Triệu đồng' }) => {
  return (
    <div className="exec-bar-breakdown-list">
      {items.map((item, idx) => (
        <div key={idx} className="exec-bar-row">
          <div className="exec-bar-info-row">
            <div className="exec-bar-title-group">
              <span className="exec-bar-dot" style={{ backgroundColor: item.color }}></span>
              <span className="exec-bar-name">{item.name}</span>
            </div>
            <div className="exec-bar-metrics">
              <span className="exec-bar-val">
                {typeof item.value === 'number' ? item.value.toLocaleString('vi-VN', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) : item.value} {unit}
              </span>
              <span className="exec-bar-percent" style={{ color: item.color, backgroundColor: `${item.color}15`, borderColor: `${item.color}35` }}>
                {item.percent}%
              </span>
            </div>
          </div>
          <div className="exec-bar-track">
            <div
              className="exec-bar-fill"
              style={{
                width: `${Math.min(100, item.percent * 2.8)}%`,
                backgroundColor: item.color
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

// Generates SVG path for a bar with rounded top corners and flat bottom
function getRoundedTopBarPath(x, y, w, h, r = 10) {
  const actualR = Math.max(0, Math.min(r, h, w / 2));
  return `
    M ${x} ${y + h}
    L ${x} ${y + actualR}
    Q ${x} ${y} ${x + actualR} ${y}
    L ${x + w - actualR} ${y}
    Q ${x + w} ${y} ${x + w} ${y + actualR}
    L ${x + w} ${y + h}
    Z
  `;
}

// Data generator for Customer Satisfaction by channel matching user specification
function getCsatData(m, y) {
  const isT8 = m === 8 && y === '2026';
  if (isT8) {
    return [
      {
        channel: 'Kênh FO',
        actual: 89.2,
        actualText: '89,2%',
        kpi: 89.4,
        kpiText: '89,4%',
        color: '#f59e0b',
        diffText: '-0,2%',
        isPass: false
      },
      {
        channel: 'Kênh BO',
        actual: 94.7,
        actualText: '94,7%',
        kpi: 90.0,
        kpiText: '90,0%',
        color: '#3b82f6',
        diffText: '+4,7%',
        isPass: true
      },
      {
        channel: 'Callbot Inbound',
        actual: 48.6,
        actualText: '48,6%',
        kpi: 73.5,
        kpiText: '73,5%',
        color: '#f59e0b',
        diffText: '-24,9%',
        isPass: false
      }
    ];
  }

  // Realistic month-by-month variation
  const delta = (m - 8) * 0.35;
  const foActual = Math.min(99.5, Math.max(30, +(89.2 + delta).toFixed(1)));
  const boActual = Math.min(99.5, Math.max(30, +(94.7 + delta * 0.4).toFixed(1)));
  const cbActual = Math.min(99.5, Math.max(20, +(48.6 + delta * 0.7).toFixed(1)));

  return [
    {
      channel: 'Kênh FO',
      actual: foActual,
      actualText: `${foActual.toFixed(1).replace('.', ',')}%`,
      kpi: 89.4,
      kpiText: '89,4%',
      color: '#f59e0b',
      diffText: `${foActual >= 89.4 ? '+' : ''}${(foActual - 89.4).toFixed(1).replace('.', ',')}%`,
      isPass: foActual >= 89.4
    },
    {
      channel: 'Kênh BO',
      actual: boActual,
      actualText: `${boActual.toFixed(1).replace('.', ',')}%`,
      kpi: 90.0,
      kpiText: '90,0%',
      color: '#3b82f6',
      diffText: `${boActual >= 90.0 ? '+' : ''}${(boActual - 90.0).toFixed(1).replace('.', ',')}%`,
      isPass: boActual >= 90.0
    },
    {
      channel: 'Callbot Inbound',
      actual: cbActual,
      actualText: `${cbActual.toFixed(1).replace('.', ',')}%`,
      kpi: 73.5,
      kpiText: '73,5%',
      color: '#f59e0b',
      diffText: `${cbActual >= 73.5 ? '+' : ''}${(cbActual - 73.5).toFixed(1).replace('.', ',')}%`,
      isPass: cbActual >= 73.5
    }
  ];
}

// Customer Satisfaction Bar Chart matching user reference image exactly
const CustomerSatisfactionCard = ({ monthNum = 8, selectedYear = '2026' }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const csatItems = useMemo(() => getCsatData(monthNum, selectedYear), [monthNum, selectedYear]);

  // Chart dimensions & layout matching full 2-column width
  // viewBox: 0 0 1000 330
  const baselineY = 250;
  const chartHeight = 190; // 0% at 250, 100% at 60
  const axisX = 72;
  const rightX = 960;

  const getY = (val) => baselineY - (Math.min(Math.max(val, 0), 100) / 100) * chartHeight;

  // 3 column centers distributed evenly across wide 2-column space
  const colCenters = [240, 520, 800];
  const barWidth = 84;

  return (
    <div className={`csat-card ${isFullscreen ? 'fullscreen' : ''}`} id="csat-card-anchor">
      {/* Card Header */}
      <div className="csat-card-header">
        <div className="csat-header-left">
          <h3 className="csat-title">Tỷ lệ hài lòng của khách hàng</h3>
          <div
            className="csat-info-trigger"
            title="Tỷ lệ đánh giá hài lòng của khách hàng theo các kênh tiếp nhận (FO, BO, Callbot) so với mục tiêu KPI."
          >
            <Info size={19} />
          </div>
        </div>

        <div className="csat-header-actions">
          <button
            className="csat-icon-btn"
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}
          >
            <Maximize2 size={18} />
          </button>
          <div style={{ position: 'relative' }}>
            <button
              className="csat-icon-btn"
              onClick={() => setShowMenu(!showMenu)}
              title="Tùy chọn"
            >
              <MoreVertical size={18} />
            </button>
            {showMenu && (
              <div className="csat-menu-dropdown">
                <button onClick={() => setShowMenu(false)}>Sao chép số liệu</button>
                <button onClick={() => setShowMenu(false)}>Xuất biểu đồ PNG</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="csat-legend-bar">
        <div className="csat-legend-item">
          <span className="csat-legend-dot"></span>
          <span className="csat-legend-text">Thực hiện</span>
        </div>
        <div className="csat-legend-item">
          <span className="csat-legend-dashed-line"></span>
          <span className="csat-legend-text">KPI</span>
        </div>
      </div>

      {/* SVG Bar Chart Area */}
      <div className="csat-chart-container">
        <svg
          viewBox="0 0 1000 330"
          className="csat-svg"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* % Y-Axis Label */}
          <text x="60" y="36" className="csat-y-unit" textAnchor="end">
            %
          </text>

          {/* Grid lines & Y-axis labels at 100, 75, 50, 25 */}
          {[100, 75, 50, 25].map((tick) => {
            const y = getY(tick);
            return (
              <g key={tick} className="csat-grid-group">
                <line
                  x1={axisX}
                  y1={y}
                  x2={rightX}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <text x="54" y={y + 4.5} className="csat-axis-tick" textAnchor="end">
                  {tick}
                </text>
              </g>
            );
          })}

          {/* Baseline 0% */}
          <line
            x1={axisX}
            y1={baselineY}
            x2={rightX}
            y2={baselineY}
            stroke="#64748b"
            strokeWidth="1.5"
          />
          <text x="54" y={baselineY + 4.5} className="csat-axis-tick" textAnchor="end">
            0
          </text>

          {/* Vertical Y-Axis Line */}
          <line
            x1={axisX}
            y1={getY(100)}
            x2={axisX}
            y2={baselineY}
            stroke="#64748b"
            strokeWidth="1.5"
          />

          {/* Bars, Values, KPI lines & labels */}
          {csatItems.map((item, idx) => {
            const cx = colCenters[idx];
            const barX = cx - barWidth / 2;
            const barY = getY(item.actual);
            const barH = baselineY - barY;
            const kpiY = getY(item.kpi);

            // KPI dashed line width
            const kpiLineWidth = 110;
            const kpiLineX1 = cx - kpiLineWidth / 2;
            const kpiLineX2 = cx + kpiLineWidth / 2 + 10;
            const kpiLabelX = kpiLineX1 - 8;

            const isHovered = hoveredIdx === idx;
            const pathD = getRoundedTopBarPath(barX, barY, barWidth, barH, 9);

            return (
              <g
                key={item.channel}
                className="csat-column-group"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Invisible hover capture area */}
                <rect
                  x={cx - 100}
                  y="30"
                  width="200"
                  height="260"
                  fill="transparent"
                  style={{ cursor: 'pointer' }}
                />

                {/* Actual Bar with rounded top corners and flat bottom */}
                <path
                  d={pathD}
                  fill={item.color}
                  className="csat-bar-path"
                  style={{
                    filter: isHovered ? 'brightness(1.08)' : 'none',
                    transition: 'all 0.25s ease'
                  }}
                />

                {/* Actual Value above bar */}
                <text
                  x={cx}
                  y={barY - 8}
                  textAnchor="middle"
                  className="csat-bar-value"
                >
                  {item.actualText}
                </text>

                {/* KPI Reference Dashed Line */}
                <line
                  x1={kpiLineX1}
                  y1={kpiY}
                  x2={kpiLineX2}
                  y2={kpiY}
                  stroke="#ef4444"
                  strokeWidth="1.8"
                  strokeDasharray="4 3"
                />

                {/* KPI Label on the left of dashed line */}
                <text
                  x={kpiLabelX}
                  y={kpiY + 4.5}
                  textAnchor="end"
                  className="csat-kpi-label"
                >
                  {item.kpiText}
                </text>

                {/* Channel Label under baseline */}
                <text
                  x={cx}
                  y={baselineY + 28}
                  textAnchor="middle"
                  className="csat-channel-label"
                >
                  {item.channel}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

// Rainbow Speedometer component matching user reference
const RainbowSpeedometer = ({
  rate = 94.2,
  actual = 389900,
  plan = 414000,
  unit = 'triệu đ',
  periodLabel = 'tháng 8/2026',
  id = 'rainbow-speedo'
}) => {
  const cx = 150;
  const cy = 110;
  const r = 84;
  const strokeWidth = 14;

  const arcPath = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`;
  const clampedRate = Math.min(Math.max(rate, 0), 100);
  
  // Angle: 0% is PI (180 deg, left), 100% is 0 (0 deg, right)
  const needleAngle = Math.PI - (clampedRate / 100) * Math.PI;
  const needleLength = 68;
  const tipX = cx + needleLength * Math.cos(needleAngle);
  const tipY = cy - needleLength * Math.sin(needleAngle);

  const ticks = [
    { label: '0%', angleDeg: 180, rOffset: 16, anchor: 'end', dy: 4 },
    { label: '20%', angleDeg: 144, rOffset: 15, anchor: 'end', dy: 2 },
    { label: '40%', angleDeg: 108, rOffset: 14, anchor: 'middle', dy: 0 },
    { label: '60%', angleDeg: 72, rOffset: 14, anchor: 'middle', dy: 0 },
    { label: '80%', angleDeg: 36, rOffset: 15, anchor: 'start', dy: 2 },
    { label: '100%', angleDeg: 0, rOffset: 16, anchor: 'start', dy: 4 },
  ];

  const formatNum = (n) => {
    return Number(n).toLocaleString('vi-VN');
  };

  return (
    <div className="tr-rainbow-gauge-wrapper">
      <svg width="100%" height="auto" viewBox="0 0 300 156" className="tr-rainbow-svg">
        <defs>
          <linearGradient id={`rainbow-grad-${id}`} x1="0%" y1="100%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="18%" stopColor="#f97316" />
            <stop offset="36%" stopColor="#eab308" />
            <stop offset="52%" stopColor="#22c55e" />
            <stop offset="70%" stopColor="#06b6d4" />
            <stop offset="86%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>

        {/* Rainbow Arc */}
        <path
          d={arcPath}
          fill="none"
          stroke={`url(#rainbow-grad-${id})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Ticks along arc */}
        {ticks.map((t, idx) => {
          const rad = (t.angleDeg * Math.PI) / 180;
          const tx = cx + (r + t.rOffset) * Math.cos(rad);
          const ty = cy - (r + t.rOffset) * Math.sin(rad) + t.dy;

          return (
            <text
              key={idx}
              x={tx}
              y={ty}
              textAnchor={t.anchor}
              fontSize="11"
              fontWeight="600"
              fill="#64748b"
            >
              {t.label}
            </text>
          );
        })}

        {/* Center Rate Text (above needle pivot) */}
        <text
          x={cx}
          y={cy - 24}
          textAnchor="middle"
          fontSize="28"
          fontWeight="800"
          fill="#0f172a"
        >
          {rate.toString().replace('.', ',')}%
        </text>

        {/* Needle */}
        <line
          x1={cx}
          y1={cy}
          x2={tipX}
          y2={tipY}
          stroke="#ea580c"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Pivot Hub */}
        <circle cx={cx} cy={cy} r="6.5" fill="#ffffff" stroke="#ea580c" strokeWidth="3.5" />

        {/* Bottom Realized / Plan Text below Hub */}
        <text
          x={cx}
          y={cy + 24}
          textAnchor="middle"
          fontSize="14.5"
          fontWeight="800"
          fill="#0f172a"
        >
          {formatNum(actual)} / {formatNum(plan)}
        </text>
      </svg>
    </div>
  );
};

const formatDiffVal = (val) => {
  const num = Math.abs(Number(val) || 0);
  if (num % 1 !== 0) {
    return num.toLocaleString('vi-VN', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  }
  return num.toLocaleString('vi-VN');
};

const formatDiffPct = (pct) => {
  const num = Number(pct) || 0;
  const sign = num >= 0 ? '+' : '-';
  const formatted = Math.abs(num).toLocaleString('vi-VN', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  return `${sign}${formatted}%`;
};

// Master Executive Metric Card supporting all 6 indicators with consistent layout & identical size
const ExecutiveGaugeMasterCard = ({
  index = 1,
  id,
  monthNum = 8,
  selectedYear = '2026',
  data = {},
  isClickable = false,
  onOpenDetailScreen,
  isDetailScreen = false
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showMonthlyTable, setShowMonthlyTable] = useState(false);

  const isDefaultT8 = monthNum === 8 && selectedYear === '2026';
  const prevMonthNum = monthNum - 1 === 0 ? 12 : monthNum - 1;
  const samePeriodYear = +selectedYear - 1;
  const monthsLeft = 12 - monthNum > 0 ? 12 - monthNum : 4;

  const cfg = useMemo(() => {
    switch (index) {
      case 2: { // 2. Doanh thu nội bộ
        const d = data?.internal || {};
        const actual = isDefaultT8 ? 127200 : Math.round((d.actual || 127.2) * 1000);
        const plan = isDefaultT8 ? 124200 : Math.round((d.plan || 124.2) * 1000);
        const rate = isDefaultT8 ? 102.4 : (d.rate || 102.4);
        const rawDiffPrev = isDefaultT8 ? 4.4 : (d.vsPrev?.value ?? 4.4);
        const rawPctPrev = isDefaultT8 ? 3.6 : (d.vsPrev?.percent ?? 3.6);
        const rawDiffYear = isDefaultT8 ? 4.3 : (d.vsLastYear?.value ?? 4.3);
        const rawPctYear = isDefaultT8 ? 3.5 : (d.vsLastYear?.percent ?? 3.5);
        const diffPrevVal = formatDiffVal(rawDiffPrev);
        const pctPrev = formatDiffPct(rawPctPrev);
        const diffPrevIsNeg = rawDiffPrev < 0;
        const diffYearVal = formatDiffVal(rawDiffYear);
        const pctYear = formatDiffPct(rawPctYear);
        const diffYearIsNeg = rawDiffYear < 0;

        return {
          title: 'Doanh thu nội bộ',
          icon: Building2,
          iconBg: '#f1f5f9',
          iconColor: '#475569',
          unit: 'triệu đ',
          unitHeader: 'Đơn vị: triệu đ',
          infoText: 'Doanh thu cung cấp sản phẩm dịch vụ giữa các đơn vị nội bộ trong Tập đoàn.',
          actual,
          plan,
          rate,
          diffPrevVal,
          pctPrev,
          diffPrevIsNeg,
          diffYearVal,
          pctYear,
          diffYearIsNeg,
          sharePct: 32.6,
          customerRows: [
            { id: 'NB-01', customerGroup: 'Khách hàng nội bộ - Tập đoàn trong nước', customerName: 'Công ty A (Nội bộ VN)', isNewCustomer: false, spdvGroup: 'DV CC outsourcing', spdvName: 'Dịch vụ FO', kh: 32000, uocTh: 33500, th: 33200, diff: 1200, rate: 103.8, share: '26,1%' },
            { id: 'NB-02', customerGroup: 'Khách hàng nội bộ - Tập đoàn trong nước', customerName: 'Công ty A (Nội bộ VN)', isNewCustomer: false, spdvGroup: 'DV CC outsourcing', spdvName: 'Dịch vụ Tổng đài', kh: 28500, uocTh: 29200, th: 29000, diff: 500, rate: 101.8, share: '22,8%' },
            { id: 'NB-03', customerGroup: 'Khách hàng nội bộ - Tập đoàn trong nước', customerName: 'Tổng công ty B (Nội bộ VN)', isNewCustomer: false, spdvGroup: 'Tích hợp Hệ thống', spdvName: 'ERP Customization', kh: 22000, uocTh: 23000, th: 22800, diff: 800, rate: 103.6, share: '17,9%' },
            { id: 'NB-04', customerGroup: 'Khách hàng nội bộ - Tập đoàn trong nước', customerName: 'Tổng công ty B (Nội bộ VN)', isNewCustomer: false, spdvGroup: 'Dịch vụ Phần mềm', spdvName: 'SaaS Platform', kh: 14500, uocTh: 15000, th: 14900, diff: 400, rate: 102.8, share: '11,7%' },
            { id: 'NB-05', customerGroup: 'Khách hàng nội bộ - Tập đoàn trong nước', customerName: 'Viettel Telecom (Nội bộ VN)', isNewCustomer: false, spdvGroup: 'Giải pháp, Platform', spdvName: 'OmniX CRM', kh: 16200, uocTh: 16500, th: 16400, diff: 200, rate: 101.2, share: '12,9%' },
            { id: 'NB-06', customerGroup: 'Khách hàng nội bộ - Tập đoàn nước ngoài', customerName: 'Viettel Global (Nội bộ nước ngoài)', isNewCustomer: false, spdvGroup: 'Tích hợp Hệ thống', spdvName: 'Dịch vụ Cloud', kh: 11000, uocTh: 11200, th: 10900, diff: -100, rate: 99.1, share: '8,6%' }
          ],
          tableRows: [
            { period: `Tháng ${monthNum}/${selectedYear}`, actualPlan: `${actual.toLocaleString('vi-VN')} / ${plan.toLocaleString('vi-VN')}`, rate: `${rate.toString().replace('.', ',')}%`, rateNum: rate, growth: '▲ 3,5%', isHighlight: true },
            { period: `Quý III/${selectedYear}`, actualPlan: '250.000 / 373.800', rate: '66,9%', rateNum: 66.9, growth: '▲ 4,2%', isHighlight: false },
            { period: `Luỹ kế năm ${selectedYear}`, actualPlan: '953.500 / 912.900', rate: '104,4%', rateNum: 104.4, growth: '▲ 6,8%', isHighlight: false }
          ],
          detailedRows: [
            { period: `Tháng ${monthNum}/${selectedYear}`, isHighlight: true, actual: actual, plan: plan, rate: rate, diff: +(actual - plan), growthYear: '▲ +3,5%', growthPrev: '▲ +3,6%', share: '32,6%', status: 'Vượt KH', statusType: 'success' },
            { period: `Quý III/${selectedYear}`, isHighlight: false, actual: 250000, plan: 373800, rate: 66.9, diff: -123800, growthYear: '▲ +4,2%', growthPrev: '▲ +4,0%', share: '32,3%', status: 'Đạt tiến độ', statusType: 'warning' },
            { period: `Luỹ kế năm ${selectedYear} (8T)`, isHighlight: false, actual: 953500, plan: 912900, rate: 104.4, diff: 40600, growthYear: '▲ +6,8%', growthPrev: '—', share: '32,0%', status: 'Vượt KH', statusType: 'success' },
            { period: `Kế hoạch cả năm ${selectedYear}`, isHighlight: false, actual: 953500, plan: 1490400, rate: 64.0, diff: -536900, growthYear: '▲ +4,1%', growthPrev: '—', share: '30,0%', status: 'Tiến độ tốt', statusType: 'success' }
          ],
          monthlyList: [
            { monthName: 'Tháng 1', monthNum: 1, actual: 102800, plan: 100500, rate: 102.3, diff: 2300, growth: '▲ +3,1%', share: '32,6%' },
            { monthName: 'Tháng 2', monthNum: 2, actual: 97100, plan: 95000, rate: 102.2, diff: 2100, growth: '▲ +3,2%', share: '32,6%' },
            { monthName: 'Tháng 3', monthNum: 3, actual: 124700, plan: 121000, rate: 103.1, diff: 3700, growth: '▲ +3,8%', share: '32,6%' },
            { monthName: 'Tháng 4', monthNum: 4, actual: 110900, plan: 108000, rate: 102.7, diff: 2900, growth: '▲ +3,4%', share: '32,6%' },
            { monthName: 'Tháng 5', monthNum: 5, actual: 119000, plan: 116000, rate: 102.6, diff: 3000, growth: '▲ +3,5%', share: '32,6%' },
            { monthName: 'Tháng 6', monthNum: 6, actual: 133700, plan: 130000, rate: 102.8, diff: 3700, growth: '▲ +3,9%', share: '32,6%' },
            { monthName: 'Tháng 7', monthNum: 7, actual: 122800, plan: 120000, rate: 102.3, diff: 2800, growth: '▲ +3,4%', share: '32,6%' },
            { monthName: 'Tháng 8', monthNum: 8, actual: 127200, plan: 124200, rate: 102.4, diff: 3000, growth: '▲ +3,5%', share: '32,6%' },
            { monthName: 'Tháng 9 (KH)', monthNum: 9, actual: null, plan: 129600, rate: null, diff: null, growth: '—', share: '30,0%' },
            { monthName: 'Tháng 10 (KH)', monthNum: 10, actual: null, plan: 131000, rate: null, diff: null, growth: '—', share: '30,0%' },
            { monthName: 'Tháng 11 (KH)', monthNum: 11, actual: null, plan: 132000, rate: null, diff: null, growth: '—', share: '30,0%' },
            { monthName: 'Tháng 12 (KH)', monthNum: 12, actual: null, plan: 134900, rate: null, diff: null, growth: '—', share: '30,0%' }
          ],
          qForecast: '375.000',
          qRate: '100,3%',
          yForecast: '1.430.200',
          yRate: '96,0%',
          yGrowth: '▲ +4,1% so CK',
          avgNeeded: '119.175'
        };
      }
      case 3: { // 3. Doanh thu ngoài Tập đoàn
        const d = data?.external || {};
        const actual = isDefaultT8 ? 262700 : Math.round((d.actual || 262.7) * 1000);
        const plan = isDefaultT8 ? 289800 : Math.round((d.plan || 289.8) * 1000);
        const rate = isDefaultT8 ? 90.6 : (d.rate || 90.6);
        const rawDiffPrev = isDefaultT8 ? 0.4 : (d.vsPrev?.value ?? 0.4);
        const rawPctPrev = isDefaultT8 ? 0.2 : (d.vsPrev?.percent ?? 0.2);
        const rawDiffYear = isDefaultT8 ? 21.3 : (d.vsLastYear?.value ?? 21.3);
        const rawPctYear = isDefaultT8 ? 8.8 : (d.vsLastYear?.percent ?? 8.8);
        const diffPrevVal = formatDiffVal(rawDiffPrev);
        const pctPrev = formatDiffPct(rawPctPrev);
        const diffPrevIsNeg = rawDiffPrev < 0;
        const diffYearVal = formatDiffVal(rawDiffYear);
        const pctYear = formatDiffPct(rawPctYear);
        const diffYearIsNeg = rawDiffYear < 0;

        return {
          title: 'Doanh thu ngoài Tập đoàn',
          icon: Compass,
          iconBg: '#fee2e2',
          iconColor: '#dc2626',
          unit: 'triệu đ',
          unitHeader: 'Đơn vị: triệu đ',
          infoText: 'Doanh thu phát sinh từ khách hàng bên ngoài Tập đoàn.',
          actual,
          plan,
          rate,
          diffPrevVal,
          pctPrev,
          diffPrevIsNeg,
          diffYearVal,
          pctYear,
          diffYearIsNeg,
          sharePct: 67.4,
          customerRows: [
            { id: 'NG-01', customerGroup: 'Khách hàng ngoài - Tập đoàn trong nước', customerName: 'Sungroup (Tập đoàn Sun)', isNewCustomer: false, spdvGroup: 'Giải pháp, Platform', spdvName: 'OmniX CRM', kh: 48000, uocTh: 44500, th: 43800, diff: -4200, rate: 91.3, share: '16,7%' },
            { id: 'NG-02', customerGroup: 'Khách hàng ngoài - Tập đoàn nước ngoài', customerName: 'Singtel International', isNewCustomer: false, spdvGroup: 'Giải pháp, Platform', spdvName: 'AI Chatbot', kh: 28500, uocTh: 27200, th: 26800, diff: -1700, rate: 94.0, share: '10,2%' },
            { id: 'NG-03', customerGroup: 'Khách hàng ngoài - Tập đoàn trong nước', customerName: 'Sungroup (Tập đoàn Sun)', isNewCustomer: false, spdvGroup: 'Dịch vụ Phần mềm', spdvName: 'SaaS Platform', kh: 35500, uocTh: 33000, th: 32400, diff: -3100, rate: 91.3, share: '12,3%' },
            { id: 'NG-04', customerGroup: 'Khách hàng ngoài - Tập đoàn nước ngoài', customerName: 'Singtel International', isNewCustomer: false, spdvGroup: 'Giải pháp, Platform', spdvName: 'Loyalty App', kh: 14500, uocTh: 14000, th: 13800, diff: -700, rate: 95.2, share: '5,3%' },
            { id: 'NG-05', customerGroup: 'Khách hàng ngoài - Tập đoàn trong nước', customerName: 'Sungroup (Tập đoàn Sun)', isNewCustomer: false, spdvGroup: 'Dịch vụ Phần mềm', spdvName: 'Smart City Solution', kh: 42000, uocTh: 39000, th: 38600, diff: -3400, rate: 91.9, share: '14,7%' },
            { id: 'NG-06', customerGroup: 'Khách hàng ngoài - Tập đoàn nước ngoài', customerName: 'Singtel International', isNewCustomer: false, spdvGroup: 'Tích hợp Hệ thống', spdvName: 'ERP Customization', kh: 18000, uocTh: 17500, th: 17200, diff: -800, rate: 95.6, share: '6,5%' },
            { id: 'NG-07', customerGroup: 'Khách hàng ngoài - Tập đoàn trong nước', customerName: 'Tập đoàn FPT', isNewCustomer: true, spdvGroup: 'Tích hợp Hệ thống', spdvName: 'ERP Customization', kh: 45800, uocTh: 42000, th: 41500, diff: -4300, rate: 90.6, share: '15,8%' },
            { id: 'NG-08', customerGroup: 'Khách hàng ngoài - Tập đoàn trong nước', customerName: 'Tập đoàn Hòa Phát', isNewCustomer: false, spdvGroup: 'Giải pháp, Platform', spdvName: 'OmniX CRM', kh: 32500, uocTh: 30500, th: 30200, diff: -2300, rate: 92.9, share: '11,5%' },
            { id: 'NG-09', customerGroup: 'Khách hàng ngoài - Tập đoàn nước ngoài', customerName: 'Toyota Motor VN', isNewCustomer: true, spdvGroup: 'Giải pháp, Platform', spdvName: 'AI Chatbot', kh: 25000, uocTh: 18800, th: 18400, diff: -6600, rate: 73.6, share: '7,0%' }
          ],
          tableRows: [
            { period: `Tháng ${monthNum}/${selectedYear}`, actualPlan: `${actual.toLocaleString('vi-VN')} / ${plan.toLocaleString('vi-VN')}`, rate: `${rate.toString().replace('.', ',')}%`, rateNum: rate, growth: '▲ 8,8%', isHighlight: true },
            { period: `Quý III/${selectedYear}`, actualPlan: '525.000 / 872.200', rate: '60,2%', rateNum: 60.2, growth: '▲ 11,6%', isHighlight: false },
            { period: `Luỹ kế năm ${selectedYear}`, actualPlan: '2.022.800 / 2.130.200', rate: '95,0%', rateNum: 95.0, growth: '▲ 17,5%', isHighlight: false }
          ],
          detailedRows: [
            { period: `Tháng ${monthNum}/${selectedYear}`, isHighlight: true, actual: actual, plan: plan, rate: rate, diff: +(actual - plan), growthYear: '▲ +8,8%', growthPrev: '▲ +0,2%', share: '67,4%', status: 'Cần tăng tốc', statusType: 'warning' },
            { period: `Quý III/${selectedYear}`, isHighlight: false, actual: 525000, plan: 872200, rate: 60.2, diff: -347200, growthYear: '▲ +11,6%', growthPrev: '▲ +9,5%', share: '67,7%', status: 'Cần tăng tốc', statusType: 'warning' },
            { period: `Luỹ kế năm ${selectedYear} (8T)`, isHighlight: false, actual: 2022800, plan: 2130200, rate: 95.0, diff: -107400, growthYear: '▲ +17,5%', growthPrev: '—', share: '68,0%', status: 'Bám sát KH', statusType: 'warning' },
            { period: `Kế hoạch cả năm ${selectedYear}`, isHighlight: false, actual: 2022800, plan: 3477700, rate: 58.2, diff: -1454900, growthYear: '▲ +7,4%', growthPrev: '—', share: '70,0%', status: 'Tập trung Q4', statusType: 'warning' }
          ],
          monthlyList: [
            { monthName: 'Tháng 1', monthNum: 1, actual: 212600, plan: 234500, rate: 90.7, diff: -21900, growth: '▲ +7,2%', share: '67,4%' },
            { monthName: 'Tháng 2', monthNum: 2, actual: 200900, plan: 225000, rate: 89.3, diff: -24100, growth: '▲ +6,8%', share: '67,4%' },
            { monthName: 'Tháng 3', monthNum: 3, actual: 257800, plan: 284000, rate: 90.8, diff: -26200, growth: '▲ +8,5%', share: '67,4%' },
            { monthName: 'Tháng 4', monthNum: 4, actual: 229300, plan: 252000, rate: 91.0, diff: -22700, growth: '▲ +8,1%', share: '67,4%' },
            { monthName: 'Tháng 5', monthNum: 5, actual: 246000, plan: 271000, rate: 90.8, diff: -25000, growth: '▲ +8,3%', share: '67,4%' },
            { monthName: 'Tháng 6', monthNum: 6, actual: 276500, plan: 304000, rate: 91.0, diff: -27500, growth: '▲ +9,0%', share: '67,4%' },
            { monthName: 'Tháng 7', monthNum: 7, actual: 262300, plan: 289000, rate: 90.8, diff: -26700, growth: '▲ +8,7%', share: '67,4%' },
            { monthName: 'Tháng 8', monthNum: 8, actual: 262700, plan: 289800, rate: 90.6, diff: -27100, growth: '▲ +8,8%', share: '67,4%' },
            { monthName: 'Tháng 9 (KH)', monthNum: 9, actual: null, plan: 292600, rate: null, diff: null, growth: '—', share: '70,0%' },
            { monthName: 'Tháng 10 (KH)', monthNum: 10, actual: null, plan: 345000, rate: null, diff: null, growth: '—', share: '70,0%' },
            { monthName: 'Tháng 11 (KH)', monthNum: 11, actual: null, plan: 350000, rate: null, diff: null, growth: '—', share: '70,0%' },
            { monthName: 'Tháng 12 (KH)', monthNum: 12, actual: null, plan: 359900, rate: null, diff: null, growth: '—', share: '70,0%' }
          ],
          qForecast: '787.500',
          qRate: '90,3%',
          yForecast: '3.034.300',
          yRate: '87,2%',
          yGrowth: '▲ +7,4% so CK',
          avgNeeded: '252.875'
        };
      }
      case 4: { // 4. Doanh thu quốc tế
        const d = data?.global || {};
        const actual = isDefaultT8 ? 42800 : Math.round((d.actual || 42.8) * 1000);
        const plan = isDefaultT8 ? 45000 : Math.round((d.plan || 45.0) * 1000);
        const rate = isDefaultT8 ? 95.1 : (d.rate || 95.1);
        const rawDiffPrev = isDefaultT8 ? 1.2 : (data?.kpis?.globalRevenue?.diffPrev ?? 1.2);
        const rawPctPrev = isDefaultT8 ? 2.9 : (data?.kpis?.globalRevenue?.percentPrev ?? 2.9);
        const rawDiffYear = isDefaultT8 ? 6.6 : (data?.kpis?.globalRevenue?.diffYear ?? 6.6);
        const rawPctYear = isDefaultT8 ? 18.2 : (data?.kpis?.globalRevenue?.percentYear ?? 18.2);
        const diffPrevVal = formatDiffVal(rawDiffPrev);
        const pctPrev = formatDiffPct(rawPctPrev);
        const diffPrevIsNeg = rawDiffPrev < 0;
        const diffYearVal = formatDiffVal(rawDiffYear);
        const pctYear = formatDiffPct(rawPctYear);
        const diffYearIsNeg = rawDiffYear < 0;

        return {
          title: 'Doanh thu quốc tế',
          icon: Globe,
          iconBg: '#ffedd5',
          iconColor: '#ea580c',
          unit: 'triệu đ',
          unitHeader: 'Đơn vị: triệu đ',
          infoText: 'Doanh thu cung cấp sản phẩm dịch vụ ra thị trường quốc tế.',
          actual,
          plan,
          rate,
          diffPrevVal,
          pctPrev,
          diffPrevIsNeg,
          diffYearVal,
          pctYear,
          diffYearIsNeg,
          sharePct: 11.0,
          customerRows: [
            { id: 'QT-01', customerGroup: 'Khách hàng ngoài - Tập đoàn nước ngoài', customerName: 'Singtel International', isNewCustomer: false, spdvGroup: 'Giải pháp, Platform', spdvName: 'AI Chatbot', kh: 14000, uocTh: 13500, th: 13400, diff: -600, rate: 95.7, share: '31,3%' },
            { id: 'QT-02', customerGroup: 'Khách hàng ngoài - Tập đoàn nước ngoài', customerName: 'Singtel International', isNewCustomer: false, spdvGroup: 'Giải pháp, Platform', spdvName: 'Loyalty App', kh: 11000, uocTh: 10600, th: 10500, diff: -500, rate: 95.5, share: '24,5%' },
            { id: 'QT-03', customerGroup: 'Khách hàng nội bộ - Tập đoàn nước ngoài', customerName: 'Viettel Global (Nội bộ nước ngoài)', isNewCustomer: false, spdvGroup: 'Tích hợp Hệ thống', spdvName: 'Dịch vụ Cloud', kh: 11000, uocTh: 11200, th: 10900, diff: -100, rate: 99.1, share: '25,5%' },
            { id: 'QT-04', customerGroup: 'Khách hàng ngoài - Tập đoàn nước ngoài', customerName: 'Toyota Motor VN', isNewCustomer: true, spdvGroup: 'Giải pháp, Platform', spdvName: 'AI Chatbot', kh: 9000, uocTh: 8200, th: 8000, diff: -1000, rate: 88.9, share: '18,7%' }
          ],
          tableRows: [
            { period: `Tháng ${monthNum}/${selectedYear}`, actualPlan: `${actual.toLocaleString('vi-VN')} / ${plan.toLocaleString('vi-VN')}`, rate: `${rate.toString().replace('.', ',')}%`, rateNum: rate, growth: '▲ 18,2%', isHighlight: true },
            { period: `Quý III/${selectedYear}`, actualPlan: '82.100 / 149.500', rate: '54,9%', rateNum: 54.9, growth: '▲ 16,5%', isHighlight: false },
            { period: `Luỹ kế năm ${selectedYear}`, actualPlan: '312.500 / 330.000', rate: '94,7%', rateNum: 94.7, growth: '▲ 19,4%', isHighlight: false }
          ],
          detailedRows: [
            { period: `Tháng ${monthNum}/${selectedYear}`, isHighlight: true, actual: actual, plan: plan, rate: rate, diff: +(actual - plan), growthYear: '▲ +18,2%', growthPrev: '▲ +2,9%', share: '11,0%', status: 'Tăng trưởng cao', statusType: 'success' },
            { period: `Quý III/${selectedYear}`, isHighlight: false, actual: 82100, plan: 149500, rate: 54.9, diff: -67400, growthYear: '▲ +16,5%', growthPrev: '▲ +12,0%', share: '11,0%', status: 'Tăng trưởng cao', statusType: 'success' },
            { period: `Luỹ kế năm ${selectedYear} (8T)`, isHighlight: false, actual: 312500, plan: 330000, rate: 94.7, diff: -17500, growthYear: '▲ +19,4%', growthPrev: '—', share: '11,0%', status: 'Tăng trưởng cao', statusType: 'success' },
            { period: `Kế hoạch cả năm ${selectedYear}`, isHighlight: false, actual: 312500, plan: 540100, rate: 57.9, diff: -227600, growthYear: '▲ +15,2%', growthPrev: '—', share: '10,9%', status: 'Tăng trưởng tốt', statusType: 'success' }
          ],
          monthlyList: [
            { monthName: 'Tháng 1', monthNum: 1, actual: 34700, plan: 36800, rate: 94.3, diff: -2100, growth: '▲ +17,5%', share: '11,0%' },
            { monthName: 'Tháng 2', monthNum: 2, actual: 32800, plan: 34500, rate: 95.1, diff: -1700, growth: '▲ +17,8%', share: '11,0%' },
            { monthName: 'Tháng 3', monthNum: 3, actual: 42100, plan: 44000, rate: 95.7, diff: -1900, growth: '▲ +18,5%', share: '11,0%' },
            { monthName: 'Tháng 4', monthNum: 4, actual: 37400, plan: 39500, rate: 94.7, diff: -2100, growth: '▲ +18,0%', share: '11,0%' },
            { monthName: 'Tháng 5', monthNum: 5, actual: 40150, plan: 42300, rate: 94.9, diff: -2150, growth: '▲ +18,1%', share: '11,0%' },
            { monthName: 'Tháng 6', monthNum: 6, actual: 45120, plan: 47400, rate: 95.2, diff: -2280, growth: '▲ +19,0%', share: '11,0%' },
            { monthName: 'Tháng 7', monthNum: 7, actual: 39300, plan: 41500, rate: 94.7, diff: -2200, growth: '▲ +17,9%', share: '11,0%' },
            { monthName: 'Tháng 8', monthNum: 8, actual: 42800, plan: 45000, rate: 95.1, diff: -2200, growth: '▲ +18,2%', share: '11,0%' },
            { monthName: 'Tháng 9 (KH)', monthNum: 9, actual: null, plan: 63000, rate: null, diff: null, growth: '—', share: '10,9%' },
            { monthName: 'Tháng 10 (KH)', monthNum: 10, actual: null, plan: 70000, rate: null, diff: null, growth: '—', share: '10,9%' },
            { monthName: 'Tháng 11 (KH)', monthNum: 11, actual: null, plan: 70000, rate: null, diff: null, growth: '—', share: '10,9%' },
            { monthName: 'Tháng 12 (KH)', monthNum: 12, actual: null, plan: 70100, rate: null, diff: null, growth: '—', share: '10,9%' }
          ],
          qForecast: '135.000',
          qRate: '90,3%',
          yForecast: '480.000',
          yRate: '87,8%',
          yGrowth: '▲ +15,2% so CK',
          avgNeeded: '41.875'
        };
      }
      case 9: { // 9. Doanh thu trong nước
        const d = data?.domestic || {};
        const actual = isDefaultT8 ? 347100 : Math.round((d.actual || 347.1) * 1000);
        const plan = isDefaultT8 ? 369000 : Math.round((d.plan || 369.0) * 1000);
        const rate = isDefaultT8 ? 94.1 : (d.rate || 94.1);
        const rawDiffPrev = isDefaultT8 ? 3.6 : (data?.kpis?.domesticRevenue?.diffPrev ?? 3.6);
        const rawPctPrev = isDefaultT8 ? 1.0 : (data?.kpis?.domesticRevenue?.percentPrev ?? 1.0);
        const rawDiffYear = isDefaultT8 ? 19.0 : (data?.kpis?.domesticRevenue?.diffYear ?? 19.0);
        const rawPctYear = isDefaultT8 ? 5.8 : (data?.kpis?.domesticRevenue?.percentYear ?? 5.8);
        const diffPrevVal = formatDiffVal(rawDiffPrev);
        const pctPrev = formatDiffPct(rawPctPrev);
        const diffPrevIsNeg = rawDiffPrev < 0;
        const diffYearVal = formatDiffVal(rawDiffYear);
        const pctYear = formatDiffPct(rawPctYear);
        const diffYearIsNeg = rawDiffYear < 0;

        return {
          title: 'Doanh thu trong nước',
          icon: Landmark,
          iconBg: '#e0f2fe',
          iconColor: '#0284c7',
          unit: 'triệu đ',
          unitHeader: 'Đơn vị: triệu đ',
          infoText: 'Doanh thu cung cấp sản phẩm dịch vụ tại thị trường trong nước (Trong nước + Quốc tế = Tổng doanh thu).',
          actual,
          plan,
          rate,
          diffPrevVal,
          pctPrev,
          diffPrevIsNeg,
          diffYearVal,
          pctYear,
          diffYearIsNeg,
          sharePct: 89.0,
          customerRows: [
            { id: 'TN-01', customerGroup: 'Khách hàng ngoài - Tập đoàn trong nước', customerName: 'Sungroup (Tập đoàn Sun)', isNewCustomer: false, spdvGroup: 'Giải pháp, Platform', spdvName: 'OmniX CRM', kh: 48000, uocTh: 44500, th: 43800, diff: -4200, rate: 91.3, share: '12,6%' },
            { id: 'TN-02', customerGroup: 'Khách hàng ngoài - Tập đoàn trong nước', customerName: 'Sungroup (Tập đoàn Sun)', isNewCustomer: false, spdvGroup: 'Dịch vụ Phần mềm', spdvName: 'SaaS Platform', kh: 35500, uocTh: 33000, th: 32400, diff: -3100, rate: 91.3, share: '9,3%' },
            { id: 'TN-03', customerGroup: 'Khách hàng ngoài - Tập đoàn trong nước', customerName: 'Sungroup (Tập đoàn Sun)', isNewCustomer: false, spdvGroup: 'Dịch vụ Phần mềm', spdvName: 'Smart City Solution', kh: 42000, uocTh: 39000, th: 38600, diff: -3400, rate: 91.9, share: '11,1%' },
            { id: 'TN-04', customerGroup: 'Khách hàng nội bộ - Tập đoàn trong nước', customerName: 'Công ty A (Nội bộ VN)', isNewCustomer: false, spdvGroup: 'DV CC outsourcing', spdvName: 'Dịch vụ FO', kh: 32000, uocTh: 33500, th: 33200, diff: 1200, rate: 103.8, share: '9,6%' },
            { id: 'TN-05', customerGroup: 'Khách hàng nội bộ - Tập đoàn trong nước', customerName: 'Công ty A (Nội bộ VN)', isNewCustomer: false, spdvGroup: 'DV CC outsourcing', spdvName: 'Dịch vụ Tổng đài', kh: 28500, uocTh: 29200, th: 29000, diff: 500, rate: 101.8, share: '8,4%' },
            { id: 'TN-06', customerGroup: 'Khách hàng nội bộ - Tập đoàn trong nước', customerName: 'Tổng công ty B (Nội bộ VN)', isNewCustomer: false, spdvGroup: 'Tích hợp Hệ thống', spdvName: 'ERP Customization', kh: 22000, uocTh: 23000, th: 22800, diff: 800, rate: 103.6, share: '6,6%' },
            { id: 'TN-07', customerGroup: 'Khách hàng nội bộ - Tập đoàn trong nước', customerName: 'Tổng công ty B (Nội bộ VN)', isNewCustomer: false, spdvGroup: 'Dịch vụ Phần mềm', spdvName: 'SaaS Platform', kh: 14500, uocTh: 15000, th: 14900, diff: 400, rate: 102.8, share: '4,3%' },
            { id: 'TN-08', customerGroup: 'Khách hàng nội bộ - Tập đoàn trong nước', customerName: 'Viettel Telecom (Nội bộ VN)', isNewCustomer: false, spdvGroup: 'Giải pháp, Platform', spdvName: 'OmniX CRM', kh: 16200, uocTh: 16500, th: 16400, diff: 200, rate: 101.2, share: '4,7%' },
            { id: 'TN-09', customerGroup: 'Khách hàng ngoài - Tập đoàn trong nước', customerName: 'Tập đoàn FPT', isNewCustomer: true, spdvGroup: 'Tích hợp Hệ thống', spdvName: 'ERP Customization', kh: 45800, uocTh: 42000, th: 41500, diff: -4300, rate: 90.6, share: '12,0%' },
            { id: 'TN-10', customerGroup: 'Khách hàng ngoài - Tập đoàn trong nước', customerName: 'Tập đoàn Hòa Phát', isNewCustomer: false, spdvGroup: 'Giải pháp, Platform', spdvName: 'OmniX CRM', kh: 32500, uocTh: 30500, th: 30200, diff: -2300, rate: 92.9, share: '8,7%' },
            { id: 'TN-11', customerGroup: 'Khách hàng ngoài - Tập đoàn trong nước', customerName: 'Tập đoàn Masan', isNewCustomer: false, spdvGroup: 'Dịch vụ Phần mềm', spdvName: 'Smart City Solution', kh: 33000, uocTh: 31000, th: 30600, diff: -2400, rate: 92.7, share: '8,8%' },
            { id: 'TN-12', customerGroup: 'Khách hàng ngoài - Tập đoàn trong nước', customerName: 'Tập đoàn Vingroup', isNewCustomer: true, spdvGroup: 'Giải pháp, Platform', spdvName: 'OmniX CRM', kh: 19000, uocTh: 14000, th: 13700, diff: -5300, rate: 72.1, share: '3,9%' }
          ],
          tableRows: [
            { period: `Tháng ${monthNum}/${selectedYear}`, actualPlan: `${actual.toLocaleString('vi-VN')} / ${plan.toLocaleString('vi-VN')}`, rate: `${rate.toString().replace('.', ',')}%`, rateNum: rate, growth: '▲ 5,8%', isHighlight: true },
            { period: `Quý III/${selectedYear}`, actualPlan: '692.900 / 1.096.500', rate: '63,2%', rateNum: 63.2, growth: '▲ 7,8%', isHighlight: false },
            { period: `Luỹ kế năm ${selectedYear}`, actualPlan: '2.663.800 / 2.713.100', rate: '98,2%', rateNum: 98.2, growth: '▲ 12,0%', isHighlight: false }
          ],
          detailedRows: [
            { period: `Tháng ${monthNum}/${selectedYear}`, isHighlight: true, actual: actual, plan: plan, rate: rate, diff: +(actual - plan), growthYear: '▲ +5,8%', growthPrev: '▲ +1,0%', share: '89,0%', status: 'Đạt tiến độ', statusType: 'success' },
            { period: `Quý III/${selectedYear}`, isHighlight: false, actual: 690000, plan: 1110000, rate: 62.2, diff: -420000, growthYear: '▲ +8,2%', growthPrev: '▲ +7,8%', share: '89,0%', status: 'Đạt tiến độ', statusType: 'success' },
            { period: `Luỹ kế năm ${selectedYear} (8T)`, isHighlight: false, actual: 2650000, plan: 2710000, rate: 97.8, diff: -60000, growthYear: '▲ +12,5%', growthPrev: '—', share: '89,0%', status: 'Hoàn thành tốt', statusType: 'success' },
            { period: `Kế hoạch cả năm ${selectedYear}`, isHighlight: false, actual: 2650000, plan: 4428000, rate: 59.8, diff: -1778000, growthYear: '▲ +5,8%', growthPrev: '—', share: '89,1%', status: 'Bám sát KH', statusType: 'success' }
          ],
          monthlyList: [
            { monthName: 'Tháng 1', monthNum: 1, actual: 280700, plan: 298200, rate: 94.1, diff: -17500, growth: '▲ +5,1%', share: '89,0%' },
            { monthName: 'Tháng 2', monthNum: 2, actual: 265200, plan: 285500, rate: 92.9, diff: -20300, growth: '▲ +4,9%', share: '89,0%' },
            { monthName: 'Tháng 3', monthNum: 3, actual: 340400, plan: 361000, rate: 94.3, diff: -20600, growth: '▲ +5,7%', share: '89,0%' },
            { monthName: 'Tháng 4', monthNum: 4, actual: 302800, plan: 320500, rate: 94.5, diff: -17700, growth: '▲ +5,4%', share: '89,0%' },
            { monthName: 'Tháng 5', monthNum: 5, actual: 324850, plan: 344700, rate: 94.2, diff: -19850, growth: '▲ +5,5%', share: '89,0%' },
            { monthName: 'Tháng 6', monthNum: 6, actual: 365080, plan: 386600, rate: 94.4, diff: -21520, growth: '▲ +6,0%', share: '89,0%' },
            { monthName: 'Tháng 7', monthNum: 7, actual: 345800, plan: 367500, rate: 94.1, diff: -21700, growth: '▲ +5,6%', share: '89,0%' },
            { monthName: 'Tháng 8', monthNum: 8, actual: 347100, plan: 369000, rate: 94.1, diff: -21900, growth: '▲ +5,8%', share: '89,0%' },
            { monthName: 'Tháng 9 (KH)', monthNum: 9, actual: null, plan: 359200, rate: null, diff: null, growth: '—', share: '89,1%' },
            { monthName: 'Tháng 10 (KH)', monthNum: 10, actual: null, plan: 406000, rate: null, diff: null, growth: '—', share: '89,1%' },
            { monthName: 'Tháng 11 (KH)', monthNum: 11, actual: null, plan: 412000, rate: null, diff: null, growth: '—', share: '89,1%' },
            { monthName: 'Tháng 12 (KH)', monthNum: 12, actual: null, plan: 424700, rate: null, diff: null, growth: '—', share: '89,1%' }
          ],
          qForecast: '1.027.500',
          qRate: '93,7%',
          yForecast: '3.984.500',
          yRate: '90,1%',
          yGrowth: '▲ +2,5% so CK',
          avgNeeded: '456.125'
        };
      }
      case 5: { // 5. Số lượng khách hàng mới
        const d = data?.customers || {};
        const actual = isDefaultT8 ? 1248 : (d.actual || 1248);
        const plan = isDefaultT8 ? 1170 : (d.plan || 1170);
        const rate = isDefaultT8 ? 106.7 : (d.rate || 106.7);
        const rawDiffPrev = isDefaultT8 ? 48 : (d.vsPrev?.value ?? 48);
        const rawPctPrev = isDefaultT8 ? 4.0 : (d.vsPrev?.percent ?? 4.0);
        const rawDiffYear = isDefaultT8 ? 182 : (d.vsLastYear?.value ?? 182);
        const rawPctYear = isDefaultT8 ? 17.1 : (d.vsLastYear?.percent ?? 17.1);
        const diffPrevVal = formatDiffVal(rawDiffPrev);
        const pctPrev = formatDiffPct(rawPctPrev);
        const diffPrevIsNeg = rawDiffPrev < 0;
        const diffYearVal = formatDiffVal(rawDiffYear);
        const pctYear = formatDiffPct(rawPctYear);
        const diffYearIsNeg = rawDiffYear < 0;

        return {
          title: 'Số lượng khách hàng mới',
          icon: Users,
          iconBg: '#f3e8ff',
          iconColor: '#9333ea',
          unit: 'khách hàng',
          unitHeader: 'Đơn vị: khách hàng',
          infoText: 'Tổng số lượng khách hàng mới ký kết hợp đồng hoặc phát sinh giao dịch trong kỳ.',
          actual,
          plan,
          rate,
          diffPrevVal,
          pctPrev,
          diffPrevIsNeg,
          diffYearVal,
          pctYear,
          diffYearIsNeg,
          tableRows: [
            { period: `Tháng ${monthNum}/${selectedYear}`, actualPlan: `${actual.toLocaleString('vi-VN')} / ${plan.toLocaleString('vi-VN')}`, rate: `${rate.toString().replace('.', ',')}%`, rateNum: rate, growth: '▲ 17,1%', isHighlight: true },
            { period: `Quý III/${selectedYear}`, actualPlan: '2.450 / 3.510', rate: '69,8%', rateNum: 69.8, growth: '▲ 15,5%', isHighlight: false },
            { period: `Luỹ kế năm ${selectedYear}`, actualPlan: '9.480 / 8.775', rate: '108,0%', rateNum: 108.0, growth: '▲ 18,2%', isHighlight: false }
          ],
          qForecast: '3.700',
          qRate: '105,4%',
          yForecast: '14.500',
          yRate: '103,3%',
          yGrowth: '▲ +16,0% so CK',
          avgNeeded: '1.255'
        };
      }
      case 6: { // 6. Số lượng hợp đồng ký mới
        const d = data?.contracts || {};
        const actual = isDefaultT8 ? 856 : (d.actual || 856);
        const plan = isDefaultT8 ? 820 : (d.plan || 820);
        const rate = isDefaultT8 ? 104.4 : (d.rate || 104.4);
        const rawDiffPrev = isDefaultT8 ? 74 : (data?.kpis?.contractCount?.diffPrev ?? 74);
        const rawPctPrev = isDefaultT8 ? 9.5 : (data?.kpis?.contractCount?.percentPrev ?? 9.5);
        const rawDiffYear = isDefaultT8 ? 114 : (data?.kpis?.contractCount?.diffYear ?? 114);
        const rawPctYear = isDefaultT8 ? 15.4 : (data?.kpis?.contractCount?.percentYear ?? 15.4);
        const diffPrevVal = formatDiffVal(rawDiffPrev);
        const pctPrev = formatDiffPct(rawPctPrev);
        const diffPrevIsNeg = rawDiffPrev < 0;
        const diffYearVal = formatDiffVal(rawDiffYear);
        const pctYear = formatDiffPct(rawPctYear);
        const diffYearIsNeg = rawDiffYear < 0;

        return {
          title: 'Số lượng hợp đồng ký mới',
          icon: FileText,
          iconBg: '#e0f2fe',
          iconColor: '#0284c7',
          unit: 'hợp đồng',
          unitHeader: 'Đơn vị: hợp đồng',
          infoText: 'Tổng số hợp đồng kinh tế mới được ký kết trong kỳ.',
          actual,
          plan,
          rate,
          diffPrevVal,
          pctPrev,
          diffPrevIsNeg,
          diffYearVal,
          pctYear,
          diffYearIsNeg,
          tableRows: [
            { period: `Tháng ${monthNum}/${selectedYear}`, actualPlan: `${actual.toLocaleString('vi-VN')} / ${plan.toLocaleString('vi-VN')}`, rate: `${rate.toString().replace('.', ',')}%`, rateNum: rate, growth: '▲ 15,4%', isHighlight: true },
            { period: `Quý III/${selectedYear}`, actualPlan: '1.680 / 2.460', rate: '68,3%', rateNum: 68.3, growth: '▲ 14,2%', isHighlight: false },
            { period: `Luỹ kế năm ${selectedYear}`, actualPlan: '6.420 / 6.150', rate: '104,4%', rateNum: 104.4, growth: '▲ 16,0%', isHighlight: false }
          ],
          qForecast: '2.580',
          qRate: '104,9%',
          yForecast: '10.150',
          yRate: '103,2%',
          yGrowth: '▲ +13,8% so CK',
          avgNeeded: '933'
        };
      }
      case 7: { // 7. Lợi nhuận trước thuế
        const isT8 = isDefaultT8;
        const actual = isT8 ? 39000 : Math.round((data?.kpis?.profitBeforeTax?.value || 39.0) * 1000);
        const plan = isT8 ? 42000 : Math.round((data?.kpis?.profitBeforeTax?.plan || 42.0) * 1000);
        const rate = isT8 ? 92.9 : (data?.kpis?.profitBeforeTax?.rate || 92.9);
        const rawDiffPrev = isT8 ? 2.0 : (data?.kpis?.profitBeforeTax?.diffPrev ?? 2.0);
        const rawPctPrev = isT8 ? 5.4 : (data?.kpis?.profitBeforeTax?.percentPrev ?? 5.4);
        const rawDiffYear = isT8 ? 2.9 : (data?.kpis?.profitBeforeTax?.diffYear ?? 2.9);
        const rawPctYear = isT8 ? 8.1 : (data?.kpis?.profitBeforeTax?.percentYear ?? 8.1);
        const diffPrevVal = formatDiffVal(rawDiffPrev);
        const pctPrev = formatDiffPct(rawPctPrev);
        const diffPrevIsNeg = rawDiffPrev < 0;
        const diffYearVal = formatDiffVal(rawDiffYear);
        const pctYear = formatDiffPct(rawPctYear);
        const diffYearIsNeg = rawDiffYear < 0;

        return {
          title: 'Lợi nhuận trước thuế',
          icon: TrendingUp,
          iconBg: '#f3e8ff',
          iconColor: '#9333ea',
          unit: 'triệu đ',
          unitHeader: 'Đơn vị: triệu đ',
          infoText: 'Lợi nhuận trước thuế: Giá trị lợi nhuận của doanh nghiệp trước khi trừ thuế thu nhập doanh nghiệp.',
          actual,
          plan,
          rate,
          diffPrevVal,
          pctPrev,
          diffPrevIsNeg,
          diffYearVal,
          pctYear,
          diffYearIsNeg,
          tableRows: [
            { period: `Tháng ${monthNum}/${selectedYear}`, actualPlan: `${actual.toLocaleString('vi-VN')} / ${plan.toLocaleString('vi-VN')}`, rate: `${rate.toString().replace('.', ',')}%`, rateNum: rate, growth: '▲ 8,1%', isHighlight: true },
            { period: `Quý III/${selectedYear}`, actualPlan: '76.000 / 118.000', rate: '64,4%', rateNum: 64.4, growth: '▲ 6,5%', isHighlight: false },
            { period: `Luỹ kế năm ${selectedYear}`, actualPlan: '285.000 / 310.000', rate: '91,9%', rateNum: 91.9, growth: '▲ 9,2%', isHighlight: false }
          ],
          qForecast: '114.000',
          qRate: '96,6%',
          yForecast: '495.000',
          yRate: '95,2%',
          yGrowth: '▲ +6,5% so CK',
          avgNeeded: '52.500'
        };
      }
      case 8: { // 8. Tỷ suất lợi nhuận / doanh thu
        const isT8 = isDefaultT8;
        const actual = isT8 ? '10,0%' : `${(data?.kpis?.profitMargin?.value || 10.0).toString().replace('.', ',')}%`;
        const plan = isT8 ? '10,1%' : `${(data?.kpis?.profitMargin?.plan || 10.1).toString().replace('.', ',')}%`;
        const rate = isT8 ? 99.0 : (data?.kpis?.profitMargin?.rate || 99.0);
        const rawDiffPrev = isT8 ? 0.4 : (data?.kpis?.profitMargin?.diffPrev ?? 0.4);
        const rawPctPrev = isT8 ? 4.2 : (data?.kpis?.profitMargin?.percentPrev ?? 4.2);
        const rawDiffYear = isT8 ? 0.1 : (data?.kpis?.profitMargin?.diffYear ?? 0.1);
        const rawPctYear = isT8 ? 1.0 : (data?.kpis?.profitMargin?.percentYear ?? 1.0);
        const diffPrevVal = `${formatDiffVal(rawDiffPrev)}%`;
        const pctPrev = formatDiffPct(rawPctPrev);
        const diffPrevIsNeg = rawDiffPrev < 0;
        const diffYearVal = `${formatDiffVal(rawDiffYear)}%`;
        const pctYear = formatDiffPct(rawPctYear);
        const diffYearIsNeg = rawDiffYear < 0;

        return {
          title: 'Tỷ suất lợi nhuận / doanh thu',
          icon: Percent,
          iconBg: '#fee2e2',
          iconColor: '#dc2626',
          unit: '%',
          unitHeader: 'Đơn vị: %',
          infoText: 'Tỷ suất lợi nhuận / doanh thu = Lợi nhuận trước thuế / Doanh thu × 100%.',
          actual,
          plan,
          rate,
          diffPrevVal,
          pctPrev,
          diffPrevIsNeg,
          diffYearVal,
          pctYear,
          diffYearIsNeg,
          gaugeType: 'ring',
          ringVal: 10.0,
          tableRows: [
            { period: `Tháng ${monthNum}/${selectedYear}`, actualPlan: `${actual} / ${plan}`, rate: `${rate.toString().replace('.', ',')}%`, rateNum: rate, growth: '▲ 0,1%', isHighlight: true },
            { period: `Quý III/${selectedYear}`, actualPlan: '9,8% / 9,5%', rate: '103,2%', rateNum: 103.2, growth: '▲ 0,3%', isHighlight: false },
            { period: `Luỹ kế năm ${selectedYear}`, actualPlan: '9,6% / 10,2%', rate: '94,1%', rateNum: 94.1, growth: '▲ 0,2%', isHighlight: false }
          ],
          qForecast: '9,8%',
          qRate: '103,2%',
          yForecast: '9,9%',
          yRate: '94,3%',
          yGrowth: '▲ +0,3% so CK',
          customTargetLabel: 'Mục tiêu năm',
          avgNeeded: '10,5%',
          customTargetSubtext: 'Kế hoạch năm'
        };
      }
      default: { // 1. Tổng doanh thu
        const d = data?.total || {};
        const actual = isDefaultT8 ? 389900 : Math.round((d.actual || 389.9) * 1000);
        const plan = isDefaultT8 ? 414000 : Math.round((d.plan || 414.0) * 1000);
        const rate = isDefaultT8 ? 94.2 : (d.rate || 94.2);
        const rawDiffPrev = isDefaultT8 ? 4.8 : (d.vsPrev?.value ?? 4.8);
        const rawPctPrev = isDefaultT8 ? 1.2 : (d.vsPrev?.percent ?? 1.2);
        const rawDiffYear = isDefaultT8 ? 25.6 : (d.vsLastYear?.value ?? 25.6);
        const rawPctYear = isDefaultT8 ? 7.0 : (d.vsLastYear?.percent ?? 7.0);
        const diffPrevVal = formatDiffVal(rawDiffPrev);
        const pctPrev = formatDiffPct(rawPctPrev);
        const diffPrevIsNeg = rawDiffPrev < 0;
        const diffYearVal = formatDiffVal(rawDiffYear);
        const pctYear = formatDiffPct(rawPctYear);
        const diffYearIsNeg = rawDiffYear < 0;

        return {
          title: 'Tổng doanh thu',
          icon: BarChart2,
          iconBg: '#e0edff',
          iconColor: '#2563eb',
          unit: 'triệu đ',
          unitHeader: 'Đơn vị: triệu đ',
          infoText: 'Tổng doanh thu bao gồm toàn bộ doanh thu nội bộ, ngoài Tập đoàn và quốc tế.',
          actual,
          plan,
          rate,
          diffPrevVal,
          pctPrev,
          diffPrevIsNeg,
          diffYearVal,
          pctYear,
          diffYearIsNeg,
          tableRows: [
            { period: `Tháng ${monthNum}/${selectedYear}`, actualPlan: `${actual.toLocaleString('vi-VN')} / ${plan.toLocaleString('vi-VN')}`, rate: `${rate.toString().replace('.', ',')}%`, rateNum: rate, growth: '▲ 7,0%', isHighlight: true },
            { period: `Quý III/${selectedYear}`, actualPlan: '775.000 / 1.246.000', rate: '62,2%', rateNum: 62.2, growth: '▲ 8,7%', isHighlight: false },
            { period: `Luỹ kế năm ${selectedYear}`, actualPlan: '2.976.300 / 3.043.100', rate: '97,8%', rateNum: 97.8, growth: '▲ 12,8%', isHighlight: false }
          ],
          qForecast: '1.162.500',
          qRate: '93,3%',
          yForecast: '4.464.500',
          yRate: '89,9%',
          yGrowth: '▲ +3,2% so CK',
          avgNeeded: '498.000'
        };
      }
    }
  }, [index, isDefaultT8, monthNum, selectedYear, data]);

  const customerTotals = useMemo(() => {
    const rows = cfg.customerRows || [];
    if (!rows.length) return { kh: 0, uocTh: 0, th: 0, diff: 0, rate: 0 };
    const kh = rows.reduce((acc, r) => acc + (r.kh || 0), 0);
    const uocTh = rows.reduce((acc, r) => acc + (r.uocTh || 0), 0);
    const th = rows.reduce((acc, r) => acc + (r.th || 0), 0);
    const diff = th - kh;
    const rate = kh > 0 ? +( (th / kh) * 100 ).toFixed(1) : 0;
    return { kh, uocTh, th, diff, rate };
  }, [cfg.customerRows]);

  const IconComponent = cfg.icon;

  return (
    <div
      className={`tr-master-card ${isFullscreen ? 'fullscreen-overlay' : ''} ${isClickable ? 'clickable-card' : ''}`}
      id={id || `chart-metric-${index}`}
      onClick={isClickable && onOpenDetailScreen ? onOpenDetailScreen : undefined}
    >
      {/* Card Header */}
      <div className="tr-header">
        <div className="tr-header-left">
          <div className="tr-header-icon-box" style={{ background: cfg.iconBg }}>
            <IconComponent size={20} color={cfg.iconColor} strokeWidth={2.5} />
          </div>
          <h3 className="tr-header-title">{cfg.title}</h3>
          <div className="tr-info-btn" title={cfg.infoText} onClick={(e) => e.stopPropagation()}>
            <Info size={17} color="#64748b" />
          </div>
        </div>

        <div className="tr-header-right">
          <span className="tr-unit-text">{cfg.unitHeader}</span>
          <button
            className="tr-action-btn"
            onClick={(e) => {
              e.stopPropagation();
              setIsFullscreen(!isFullscreen);
            }}
            title={isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}
          >
            <Maximize2 size={17} />
          </button>
          <div style={{ position: 'relative' }}>
            <button
              className="tr-action-btn"
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              title="Tùy chọn"
            >
              <MoreVertical size={17} />
            </button>
            {showMenu && (
              <div className="tr-menu-dropdown" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => setShowMenu(false)}>Sao chép số liệu</button>
                <button onClick={() => setShowMenu(false)}>Xuất biểu đồ PNG</button>
                <button onClick={() => setShowMenu(false)}>In báo cáo</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top Section: Metrics + Rainbow Gauge */}
      <div className="tr-top-section">
        {/* Left Column: Number & Side-by-side Comparisons */}
        <div className="tr-left-metrics-panel">
          {/* Main Metric Box */}
          <div className="tr-metric-main-box">
            <div className="tr-period-badge">Tháng {monthNum}/{selectedYear}</div>

            <div className="tr-main-value-row">
              <span className="tr-big-value">
                {typeof cfg.actual === 'number' ? cfg.actual.toLocaleString('vi-VN') : cfg.actual}
              </span>
              {cfg.unit !== '%' && <span className="tr-value-unit">{cfg.unit}</span>}
            </div>

            <div className="tr-plan-subline">
              <span className="tr-plan-label">KH tháng:</span>
              <strong>{typeof cfg.plan === 'number' ? cfg.plan.toLocaleString('vi-VN') : cfg.plan}{cfg.unit !== '%' ? ` ${cfg.unit}` : ''}</strong>
              <span className="tr-subline-sep">|</span>
              <span className="tr-plan-label">Đạt</span>
              <strong className={cfg.rate >= 100 ? 'text-green' : 'text-red'}>{cfg.rate.toString().replace('.', ',')}%</strong>
            </div>
          </div>

          {/* Compare Col 1: So tháng trước (T-1) */}
          <div className="tr-metric-compare-col">
            <span className="tr-compare-col-label">So T{prevMonthNum}</span>
            <div className={`tr-compare-col-value ${cfg.diffPrevIsNeg ? 'negative' : 'positive'}`}>
              <span className="tr-compare-col-arrow">{cfg.diffPrevIsNeg ? '▼' : '▲'}</span>
              <span className="tr-compare-col-num">{cfg.diffPrevVal}</span>
            </div>
            <span className={`tr-compare-col-pct ${cfg.diffPrevIsNeg ? 'negative' : 'positive'}`}>
              ({cfg.pctPrev})
            </span>
          </div>

          {/* Compare Col 2: So cùng kỳ năm trước */}
          <div className="tr-metric-compare-col">
            <span className="tr-compare-col-label">So cùng kỳ T{monthNum}/{samePeriodYear}</span>
            <div className={`tr-compare-col-value ${cfg.diffYearIsNeg ? 'negative' : 'positive'}`}>
              <span className="tr-compare-col-arrow">{cfg.diffYearIsNeg ? '▼' : '▲'}</span>
              <span className="tr-compare-col-num">{cfg.diffYearVal}</span>
            </div>
            <span className={`tr-compare-col-pct ${cfg.diffYearIsNeg ? 'negative' : 'positive'}`}>
              ({cfg.pctYear})
            </span>
          </div>
        </div>

        {/* Right Column: Gauge */}
        <div className="tr-right-gauge-col">
          {cfg.gaugeType === 'ring' ? (
            <div className="tr-ring-gauge-wrapper">
              <CircularRingGauge
                value={cfg.ringVal || cfg.actual}
                maxScale={20}
                label="Tỷ suất"
                color="#EE0033"
                size={135}
              />
            </div>
          ) : (
            <RainbowSpeedometer
              rate={cfg.rate}
              actual={cfg.actual}
              plan={cfg.plan}
              unit={cfg.unit}
              periodLabel={`tháng ${monthNum}/${selectedYear}`}
              id={`tr-rainbow-${index}`}
            />
          )}
        </div>
      </div>

      {/* Middle Section: Detailed Table when isDetailScreen, otherwise Standard Table */}
      {isDetailScreen ? (
        <div className="tr-full-detail-table-panel plain-table-container">
          <div className="detail-table-responsive-box">
            <table className="tr-executive-detailed-table cust-matrix-style">
              <thead>
                <tr>
                  <th rowSpan={2} className="th-left col-cust-group">Nhóm khách hàng</th>
                  <th rowSpan={2} className="th-left col-cust-name">Tên khách hàng</th>
                  <th rowSpan={2} className="th-center col-cust-new" title="Khách hàng mới">KH Mới</th>
                  <th rowSpan={2} className="th-left col-spdv-group">Nhóm SPDV</th>
                  <th rowSpan={2} className="th-left col-spdv-name">Tên SPDV</th>
                  <th colSpan={5} className="th-center group-header-perf">
                    Thực hiện tháng {monthNum}/{selectedYear}
                  </th>
                  <th rowSpan={2} className="th-center col-share">Tỷ trọng</th>
                </tr>
                <tr>
                  <th className="th-right col-num">KH</th>
                  <th className="th-right col-num col-uoc-th" style={{ color: '#ea580c' }}>Ước TH</th>
                  <th className="th-right col-num">TH</th>
                  <th className="th-right col-num">+/- so KH</th>
                  <th className="th-center col-rate">% HTKH</th>
                </tr>
              </thead>
              <tbody>
                {cfg.customerRows && cfg.customerRows.length > 0 ? (
                  cfg.customerRows.map((r, rIdx) => {
                    const diffVal = r.diff;
                    const diffFormatted = (diffVal >= 0 ? '+' : '') + diffVal.toLocaleString('vi-VN');
                    return (
                      <tr key={r.id || rIdx}>
                        <td className="td-left text-muted-small" title={r.customerGroup}>
                          {r.customerGroup}
                        </td>
                        <td className="td-left text-strong-name" title={r.customerName}>
                          <strong>{r.customerName}</strong>
                        </td>
                        <td className="td-center">
                          <div className={`matrix-cust-checkbox-wrap ${r.isNewCustomer ? 'checked' : ''}`}>
                            {r.isNewCustomer && <Check size={11} strokeWidth={3} />}
                          </div>
                        </td>
                        <td className="td-left text-spdv-group">{r.spdvGroup}</td>
                        <td className="td-left text-spdv-name">
                          <strong>{r.spdvName}</strong>
                        </td>
                        <td className="td-right num-cell">{r.kh.toLocaleString('vi-VN')}</td>
                        <td className="td-right num-cell text-orange font-bold">
                          {r.uocTh.toLocaleString('vi-VN')}
                        </td>
                        <td className="td-right num-cell font-bold text-dark">
                          {r.th.toLocaleString('vi-VN')}
                        </td>
                        <td className={`td-right num-cell ${diffVal >= 0 ? 'text-green' : 'text-red'}`}>
                          <strong>{diffFormatted}</strong>
                        </td>
                        <td className="td-center">
                          <span className={`detail-rate-pill ${r.rate >= 100 ? 'rate-green' : (r.rate >= 90 ? 'rate-amber' : 'rate-red')}`}>
                            {r.rate}%
                          </span>
                        </td>
                        <td className="td-center">
                          <span className="share-cell-tag">{r.share}</span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={11} className="cust-empty-state">
                      Chưa có dữ liệu chi tiết khách hàng.
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr className="tr-row-footer-total">
                  <td colSpan={5} className="td-left font-bold footer-label-cell">
                    Tổng cộng ({(cfg.customerRows || []).length} dòng SPDV)
                  </td>
                  <td className="td-right font-bold num-cell">
                    {customerTotals.kh.toLocaleString('vi-VN')}
                  </td>
                  <td className="td-right font-bold text-orange num-cell">
                    {customerTotals.uocTh.toLocaleString('vi-VN')}
                  </td>
                  <td className="td-right font-bold text-dark num-cell">
                    {customerTotals.th.toLocaleString('vi-VN')}
                  </td>
                  <td className={`td-right font-bold num-cell ${customerTotals.diff >= 0 ? 'text-green' : 'text-red'}`}>
                    {(customerTotals.diff >= 0 ? '+' : '') + customerTotals.diff.toLocaleString('vi-VN')}
                  </td>
                  <td className="td-center">
                    <span className={`detail-rate-pill ${customerTotals.rate >= 100 ? 'rate-green' : (customerTotals.rate >= 90 ? 'rate-amber' : 'rate-red')}`}>
                      {customerTotals.rate}%
                    </span>
                  </td>
                  <td className="td-center font-bold">
                    <span className="share-cell-tag total">100%</span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      ) : (
        /* Standard Breakdown Table for Main Dashboard */
        <div className="tr-table-wrap">
          <table className="tr-breakdown-table">
            <thead>
              <tr>
                <th className="th-period">Kỳ</th>
                <th className="th-actual-plan">TH / KH</th>
                <th className="th-rate">% hoàn thành</th>
                <th className="th-growth">So cùng kỳ (%)</th>
              </tr>
            </thead>
            <tbody>
              {cfg.tableRows.map((row, idx) => (
                <tr key={idx} className={row.isHighlight ? 'tr-row-highlight' : ''}>
                  <td className="td-period"><strong>{row.period}</strong></td>
                  <td className="td-actual-plan">{row.actualPlan}</td>
                  <td className="td-rate">
                    <span className={row.rateNum >= 100 ? 'tr-rate-green' : 'tr-rate-red'}>
                      {row.rate}
                    </span>
                  </td>
                  <td className="td-growth">
                    <span className="tr-growth-green">{row.growth}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Bottom Section: 3 Forecast / Target Summary Cards */}
      <div className="tr-bottom-summary-cards">
        {/* Card 1: Ước Quý III/2026 */}
        <div className="tr-summary-card">
          <div className="tr-sc-icon-box purple">
            <BarChart2 size={16} color="#8b5cf6" strokeWidth={2.2} />
          </div>
          <div className="tr-sc-content">
            <div className="tr-sc-title">Ước Quý III/{selectedYear}</div>
            <div className="tr-sc-num-row">
              <span className="tr-sc-num">{cfg.qForecast}</span>
              <span className="tr-sc-unit">{cfg.unit}</span>
            </div>
            <div className="tr-sc-subtext">Đạt {cfg.qRate} KH</div>
          </div>
        </div>

        {/* Card 2: Ước năm 2026 */}
        <div className="tr-summary-card">
          <div className="tr-sc-icon-box green">
            <Calendar size={16} color="#10b981" strokeWidth={2.2} />
          </div>
          <div className="tr-sc-content">
            <div className="tr-sc-title">Ước năm {selectedYear}</div>
            <div className="tr-sc-num-row">
              <span className="tr-sc-num">{cfg.yForecast}</span>
              <span className="tr-sc-unit">{cfg.unit}</span>
            </div>
            <div className="tr-sc-subline">
              <span>Đạt {cfg.yRate} KH</span>
              <span className="tr-sc-growth-badge">{cfg.yGrowth}</span>
            </div>
          </div>
        </div>

        {/* Card 3: Cần bình quân X tháng còn lại */}
        <div className="tr-summary-card">
          <div className="tr-sc-icon-box orange">
            <Clock size={16} color="#f97316" strokeWidth={2.2} />
          </div>
          <div className="tr-sc-content">
            <div className="tr-sc-title">{cfg.customTargetLabel || `Cần BQ ${monthsLeft}T còn lại`}</div>
            <div className="tr-sc-num-row">
              <span className="tr-sc-num">{cfg.avgNeeded}</span>
              <span className="tr-sc-unit">{cfg.unit === '%' ? '' : (cfg.unit === 'triệu đ' ? 'triệu đ/th' : `${cfg.unit}/th`)}</span>
            </div>
            <div className="tr-sc-subtext">{cfg.customTargetSubtext || 'Để đạt KH năm'}</div>
          </div>
        </div>
      </div>

      {/* Bottom Drilldown Action Button for Total Revenue */}
      {index === 1 && onOpenDetailScreen && (
        <div className="tr-drilldown-footer-row">
          <button
            type="button"
            className="tr-btn-view-detail"
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetailScreen();
            }}
            title="Xem chi tiết 4 biểu đồ cơ cấu"
          >
            <span>Xem chi tiết</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

// Backwards compatibility alias for Total Revenue
const TotalRevenueMasterCard = (props) => <ExecutiveGaugeMasterCard index={1} {...props} />;

// Reusable Top KPI Metric Card with Compass/Speedometer Gauge
const KpiSummaryCard = ({ index, title, kpi, icon: Icon, colorTheme = 'red', onClick }) => {
  const isUpPrev = kpi.diffPrev >= 0;
  const isUpYear = kpi.diffYear >= 0;
  const isMeetPlan = kpi.rate >= 100;

  const formatVal = (v) => {
    if (typeof v === 'number') {
      return kpi.unit === '%'
        ? v.toString().replace('.', ',')
        : (kpi.unit === 'KH' || kpi.unit === 'HĐ' ? v.toLocaleString('vi-VN') : v.toLocaleString('vi-VN', { minimumFractionDigits: 1, maximumFractionDigits: 1 }));
    }
    return v;
  };

  return (
    <div
      className={`exec-kpi-card ${colorTheme} ${onClick ? 'clickable' : ''}`}
      onClick={onClick}
      style={onClick ? { cursor: 'pointer' } : undefined}
    >
      <div className="exec-kpi-top">
        <div className="exec-kpi-title-wrap">
          <div className="exec-kpi-icon-badge">
            <Icon size={16} />
          </div>
          <span className="exec-kpi-title">{index}. {title}</span>
        </div>
        <span className={`exec-kpi-rate-tag ${isMeetPlan ? 'green' : 'amber'}`}>
          {kpi.unit === '%' ? `${kpi.value.toString().replace('.', ',')}%` : `${kpi.rate.toString().replace('.', ',')}%`}
        </span>
      </div>

      <div className="exec-kpi-body-flex">
        <div className="exec-kpi-metrics-col">
          <div className="exec-kpi-main-val">
            <span className="kpi-num">{formatVal(kpi.value)}</span>
            <span className="kpi-unit">{kpi.unit}</span>
          </div>

          <div className="exec-kpi-plan-line">
            <Target size={12} className="kpi-sub-icon" />
            <span>Kế hoạch: <strong>{formatVal(kpi.plan)} {kpi.unit}</strong></span>
          </div>

          <div className="exec-kpi-bottom-comparisons">
            <div className={`kpi-compare-chip ${isUpPrev ? 'positive' : 'negative'}`}>
              {isUpPrev ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
              <span>T-1: {isUpPrev ? '+' : ''}{kpi.percentPrev}%</span>
            </div>
            <div className={`kpi-compare-chip ${isUpYear ? 'positive' : 'negative'}`}>
              {isUpYear ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
              <span>YoY: {isUpYear ? '+' : ''}{kpi.percentYear}%</span>
            </div>
          </div>
        </div>

        <div className="exec-kpi-gauge-col">
          <SpeedometerGauge
            rate={kpi.rate}
            actual={kpi.value}
            plan={kpi.plan}
            unit={kpi.unit}
            id={`kpi-compass-${index}`}
            width={140}
            height={80}
            compact={true}
          />
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [selectedYear, setSelectedYear] = useState('2026');
  const [selectedQuarter, setSelectedQuarter] = useState('Quý III');
  const [selectedMonth, setSelectedMonth] = useState('Tháng 8');
  const [isExporting, setIsExporting] = useState(false);
  const [trendMetric, setTrendMetric] = useState('revenue');
  const [currentScreen, setCurrentScreen] = useState('main'); // 'main' | 'revenue_breakdown'

  // Parse active month number (1..12)
  const monthNum = useMemo(() => {
    const parsed = parseInt(selectedMonth.replace('Tháng ', ''), 10);
    return isNaN(parsed) ? 8 : parsed;
  }, [selectedMonth]);

  // Handle Month change
  const handleMonthChange = (newMonthStr) => {
    setSelectedMonth(newMonthStr);
    const m = parseInt(newMonthStr.replace('Tháng ', ''), 10);
    if (m >= 1 && m <= 3) setSelectedQuarter('Quý I');
    else if (m >= 4 && m <= 6) setSelectedQuarter('Quý II');
    else if (m >= 7 && m <= 9) setSelectedQuarter('Quý III');
    else if (m >= 10 && m <= 12) setSelectedQuarter('Quý IV');
  };

  // Handle Quarter change
  const handleQuarterChange = (newQuarterStr) => {
    setSelectedQuarter(newQuarterStr);
    const m = monthNum;
    if (newQuarterStr === 'Quý I' && (m < 1 || m > 3)) setSelectedMonth('Tháng 3');
    else if (newQuarterStr === 'Quý II' && (m < 4 || m > 6)) setSelectedMonth('Tháng 6');
    else if (newQuarterStr === 'Quý III' && (m < 7 || m > 9)) setSelectedMonth('Tháng 8');
    else if (newQuarterStr === 'Quý IV' && (m < 10 || m > 12)) setSelectedMonth('Tháng 12');
  };

  const data = useMemo(() => getMonthData(monthNum, selectedYear), [monthNum, selectedYear]);
  const kpis = data.kpis;

  // Chart 10: Trend data filtered from T1 up to the current reporting month
  const trendDataUpToMonth = useMemo(() => {
    return MONTHLY_TREND_FULL.slice(0, monthNum);
  }, [monthNum]);


  // Chart 17: SPDV structure
  const spdvItems = useMemo(() => {
    if (SPDV_STRUCTURE_DATA[selectedYear] && SPDV_STRUCTURE_DATA[selectedYear].thMonth) {
      return SPDV_STRUCTURE_DATA[selectedYear].thMonth.slices;
    }
    return [
      { name: 'Giải pháp phần mềm', percent: 26, color: '#1f3d6d', value: 101.4 },
      { name: 'Hạ tầng CNTT', percent: 22, color: '#2e6aa6', value: 85.8 },
      { name: 'Dịch vụ số', percent: 19, color: '#5993cd', value: 74.1 },
      { name: 'Tư vấn & tích hợp', percent: 15, color: '#e59a68', value: 58.5 },
      { name: 'Vận hành & bảo trì', percent: 11, color: '#98d593', value: 42.9 },
      { name: 'Đào tạo & khác', percent: 7, color: '#b8c2cc', value: 27.3 }
    ];
  }, [selectedYear]);

  // Chart 18: Executing Unit structure
  const unitItems = useMemo(() => {
    if (UNIT_STRUCTURE_DATA[selectedYear] && UNIT_STRUCTURE_DATA[selectedYear].thMonth) {
      return UNIT_STRUCTURE_DATA[selectedYear].thMonth.slices;
    }
    return [
      { name: 'Đơn vị Hà Nội', percent: 27, color: '#1b4474', value: 105.3 },
      { name: 'Đơn vị TP.HCM', percent: 24, color: '#be5318', value: 93.6 },
      { name: 'Cty con Quốc tế', percent: 14, color: '#2b70c9', value: 54.6 },
      { name: 'Đơn vị Đà Nẵng', percent: 13, color: '#538234', value: 50.7 },
      { name: 'TT Giải pháp', percent: 13, color: '#70279e', value: 50.7 },
      { name: 'Khối Dịch vụ số', percent: 10, color: '#c58b09', value: 39.0 }
    ];
  }, [selectedYear]);

  // Export to Excel covering all metrics and charts
  const handleExportExcel = () => {
    try {
      setIsExporting(true);
      const rows = [];

      // 1. KPI Summary
      const kpiItems = [
        { 'STT': 1, 'Chỉ tiêu': 'Tổng doanh thu', 'Thực hiện': kpis.totalRevenue.value, 'Kế hoạch': kpis.totalRevenue.plan, 'Đạt (%)': `${kpis.totalRevenue.rate}%`, 'Đơn vị': kpis.totalRevenue.unit },
        { 'STT': 2, 'Chỉ tiêu': 'Lợi nhuận trước thuế', 'Thực hiện': kpis.profitBeforeTax.value, 'Kế hoạch': kpis.profitBeforeTax.plan, 'Đạt (%)': `${kpis.profitBeforeTax.rate}%`, 'Đơn vị': kpis.profitBeforeTax.unit },
        { 'STT': 3, 'Chỉ tiêu': 'Tỷ suất lợi nhuận/doanh thu', 'Thực hiện': `${kpis.profitMargin.value}%`, 'Kế hoạch': `${kpis.profitMargin.plan}%`, 'Đạt (%)': `${kpis.profitMargin.rate}%`, 'Đơn vị': '%' },
        { 'STT': 4, 'Chỉ tiêu': 'Doanh thu nội bộ', 'Thực hiện': kpis.internalRevenue.value, 'Kế hoạch': kpis.internalRevenue.plan, 'Đạt (%)': `${kpis.internalRevenue.rate}%`, 'Đơn vị': kpis.internalRevenue.unit },
        { 'STT': 5, 'Chỉ tiêu': 'Doanh thu ngoài Tập đoàn', 'Thực hiện': kpis.externalRevenue.value, 'Kế hoạch': kpis.externalRevenue.plan, 'Đạt (%)': `${kpis.externalRevenue.rate}%`, 'Đơn vị': kpis.externalRevenue.unit },
        { 'STT': 6, 'Chỉ tiêu': 'Doanh thu quốc tế', 'Thực hiện': kpis.globalRevenue.value, 'Kế hoạch': kpis.globalRevenue.plan, 'Đạt (%)': `${kpis.globalRevenue.rate}%`, 'Đơn vị': kpis.globalRevenue.unit },
        { 'STT': 7, 'Chỉ tiêu': 'Số lượng khách hàng mới', 'Thực hiện': kpis.customerCount.value, 'Kế hoạch': kpis.customerCount.plan, 'Đạt (%)': `${kpis.customerCount.rate}%`, 'Đơn vị': kpis.customerCount.unit },
        { 'STT': 8, 'Chỉ tiêu': 'Số lượng hợp đồng ký mới', 'Thực hiện': kpis.contractCount.value, 'Kế hoạch': kpis.contractCount.plan, 'Đạt (%)': `${kpis.contractCount.rate}%`, 'Đơn vị': kpis.contractCount.unit },
        { 'STT': 9, 'Chỉ tiêu': 'Tỷ lệ hài lòng của khách hàng', 'Thực hiện': `${kpis.customerSatisfaction.value}%`, 'Kế hoạch': `${kpis.customerSatisfaction.plan}%`, 'Đạt (%)': `${kpis.customerSatisfaction.rate}%`, 'Đơn vị': '%' }
      ];

      const wb = XLSX.utils.book_new();
      const wsKpis = XLSX.utils.json_to_sheet(kpiItems);
      XLSX.utils.book_append_sheet(wb, wsKpis, '9_Chi_Tieu_Cot_Loi');

      // Export file
      XLSX.writeFile(wb, `Bao_Cao_Dieu_Hanh_T${monthNum}_${selectedYear}.xlsx`);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Separate Screen: Chi tiết 4 biểu đồ cơ cấu doanh thu
  if (currentScreen === 'revenue_breakdown') {
    return (
      <div className="exec-dashboard-page revenue-breakdown-subscreen">
        {/* TOP NAVIGATION & FILTER BAR */}
        <div className="breakdown-screen-nav-bar">
          <button
            className="breakdown-back-btn"
            onClick={() => {
              setCurrentScreen('main');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            title="Quay về Dashboard điều hành"
          >
            <ArrowLeft size={18} />
            <span>Quay lại Dashboard điều hành</span>
          </button>

          <h2 className="breakdown-nav-page-title">
            Chi tiết 4 biểu đồ cơ cấu doanh thu
          </h2>

          <div className="exec-clean-filters-bar" style={{ margin: 0, padding: 0 }}>
            <div className="exec-filters-group">
              <div className="clean-filter-item">
                <span className="clean-filter-label">Năm</span>
                <div className="clean-select-wrapper">
                  <select
                    className="clean-filter-select"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                  >
                    {YEAR_OPTIONS.map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="clean-select-chevron" />
                </div>
              </div>

              <div className="clean-filter-item">
                <span className="clean-filter-label">Tháng</span>
                <div className="clean-select-wrapper">
                  <select
                    className="clean-filter-select"
                    value={selectedMonth}
                    onChange={(e) => handleMonthChange(e.target.value)}
                  >
                    {MONTH_OPTIONS.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="clean-select-chevron" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 BIỂU ĐỒ DOANH THU (MỖI BIỂU ĐỒ Ở 1 DÒNG, KÈM BẢNG TABLE SỐ LIỆU TƯƠNG ỨNG) */}
        <div className="breakdown-single-column-list">
          {/* DÒNG 1: DOANH THU NỘI BỘ */}
          <div className="breakdown-card-row">
            <ExecutiveGaugeMasterCard
              index={2}
              id="chart-screen-internal"
              monthNum={monthNum}
              selectedYear={selectedYear}
              data={data}
              isDetailScreen={true}
            />
          </div>

          {/* DÒNG 2: DOANH THU NGOÀI TẬP ĐOÀN */}
          <div className="breakdown-card-row">
            <ExecutiveGaugeMasterCard
              index={3}
              id="chart-screen-external"
              monthNum={monthNum}
              selectedYear={selectedYear}
              data={data}
              isDetailScreen={true}
            />
          </div>

          {/* DÒNG 3: DOANH THU TRONG NƯỚC */}
          <div className="breakdown-card-row">
            <ExecutiveGaugeMasterCard
              index={9}
              id="chart-screen-domestic"
              monthNum={monthNum}
              selectedYear={selectedYear}
              data={data}
              isDetailScreen={true}
            />
          </div>

          {/* DÒNG 4: DOANH THU QUỐC TẾ */}
          <div className="breakdown-card-row">
            <ExecutiveGaugeMasterCard
              index={4}
              id="chart-screen-global"
              monthNum={monthNum}
              selectedYear={selectedYear}
              data={data}
              isDetailScreen={true}
            />
          </div>
        </div>

        {/* BOTTOM RETURN BAR */}
        <div className="breakdown-screen-bottom-bar">
          <button
            className="breakdown-back-btn large"
            onClick={() => {
              setCurrentScreen('main');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <ArrowLeft size={18} />
            <span>Quay lại Dashboard điều hành</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="exec-dashboard-page">
      {/* ================= HEADER BANNER ================= */}
      <div className="exec-header-banner">
        <div className="exec-header-top-row">
          <div className="exec-title-group">
            <h1 className="exec-main-title">Toàn cảnh điều hành sản xuất kinh doanh</h1>
            <p className="exec-subtitle">Kết quả tháng, quý và lũy kế năm so với kế hoạch và cùng kỳ</p>
          </div>

          <button className="exec-export-btn" onClick={handleExportExcel} disabled={isExporting} title="Xuất báo cáo Excel">
            <FileSpreadsheet size={15} />
            <span>Xuất Excel</span>
          </button>
        </div>

        {/* Clean Filter Selectors placed under Title */}
        <div className="exec-clean-filters-bar">
          <div className="exec-filters-group">
            <div className="clean-filter-item">
              <span className="clean-filter-label">Năm</span>
              <div className="clean-select-wrapper">
                <select
                  className="clean-filter-select"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  {YEAR_OPTIONS.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="clean-select-chevron" />
              </div>
            </div>


            <div className="clean-filter-item">
              <span className="clean-filter-label">Tháng</span>
              <div className="clean-select-wrapper">
                <select
                  className="clean-filter-select"
                  value={selectedMonth}
                  onChange={(e) => handleMonthChange(e.target.value)}
                >
                  {MONTH_OPTIONS.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="clean-select-chevron" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= CHỈ TIÊU TIẾN ĐỘ ĐIỀU HÀNH ================= */}
      <div className="exec-section-header">
        <h2 className="exec-section-heading">Chỉ tiêu tiến độ điều hành</h2>
        <span className="exec-section-tag">Tháng {monthNum}/{selectedYear}</span>
      </div>

      <div className="exec-kpis-top-grid">
        {/* DÒNG 1: TỔNG DOANH THU (CHỈ TIÊU MẸ - BẤM VÀO ĐỂ SANG MÀN HÌNH 4 BIỂU ĐỒ CHI TIẾT) */}
        <div className="exec-kpi-full-span">
          <ExecutiveGaugeMasterCard
            index={1}
            id="chart-total-progress"
            monthNum={monthNum}
            selectedYear={selectedYear}
            data={data}
            isClickable={true}
            onOpenDetailScreen={() => {
              setCurrentScreen('revenue_breakdown');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </div>

        {/* DÒNG 2: CẶP PHÁT TRIỂN KHÁCH HÀNG & HỢP ĐỒNG KÝ MỚI */}
        <ExecutiveGaugeMasterCard
          index={5}
          id="chart-customers-progress"
          monthNum={monthNum}
          selectedYear={selectedYear}
          data={data}
        />
        <ExecutiveGaugeMasterCard
          index={6}
          id="chart-contracts-progress"
          monthNum={monthNum}
          selectedYear={selectedYear}
          data={data}
        />
      </div>

      {/* ================= CẶP BIỂU ĐỒ HIỆU QUẢ KINH DOANH: LỢI NHUẬN & TỶ SUẤT ================= */}
      <div className="profit-margin-pair-row">
        {/* CARD 1: LỢI NHUẬN TRƯỚC THUẾ (Biểu đồ la bàn đồng bộ) */}
        <ExecutiveGaugeMasterCard
          index={7}
          id="profit-tax-card-anchor"
          monthNum={monthNum}
          selectedYear={selectedYear}
          data={data}
        />

        {/* CARD 2: TỶ SUẤT LỢI NHUẬN / DOANH THU (Đồng bộ master card) */}
        <ExecutiveGaugeMasterCard
          index={8}
          id="profit-margin-card-anchor"
          monthNum={monthNum}
          selectedYear={selectedYear}
          data={data}
        />
      </div>

      {/* ================= BIỂU ĐỒ CHỈ TIÊU CHẤT LƯỢNG: TỶ LỆ HÀI LÒNG CỦA KHÁCH HÀNG ================= */}
      <div className="csat-section-row">
        <CustomerSatisfactionCard
          monthNum={monthNum}
          selectedYear={selectedYear}
        />
      </div>

      {/* ================= NHÓM BIỂU ĐỒ ĐIỀU HÀNH ================= */}
      <div className="exec-section-header" style={{ marginTop: '36px' }}>
        <h2 className="exec-section-heading">Nhóm biểu đồ điều hành</h2>
      </div>

      <div className="exec-charts-container">
        {/* ROW 1: XU THẾ TỔNG DOANH THU T1 -> THÁNG BÁO CÁO */}
        <div className="exec-chart-full-card">
          <div className="tr-header" style={{ marginBottom: '14px' }}>
            <div className="tr-header-left">
              <div className="tr-header-icon-box" style={{ background: '#fef2f2' }}>
                <TrendingUp size={20} color="#EE0033" strokeWidth={2.5} />
              </div>
              <h3 className="tr-header-title" style={{ fontWeight: 800 }}>Xu thế tổng doanh thu T1 → Tháng báo cáo (T1 → T{monthNum}/{selectedYear})</h3>
              <div
                className="tr-info-btn"
                title="Xu thế thực hiện doanh thu và lợi nhuận tích luỹ từ đầu năm đến tháng báo cáo so với kế hoạch và cùng kỳ."
              >
                <Info size={17} color="#64748b" />
              </div>
            </div>
            <div className="tr-header-right" style={{ gap: '10px' }}>
              <div className="trend-metric-switch">
                <button
                  className={`trend-switch-btn ${trendMetric === 'revenue' ? 'active' : ''}`}
                  onClick={() => setTrendMetric('revenue')}
                >
                  Doanh thu
                </button>
                <button
                  className={`trend-switch-btn ${trendMetric === 'profit' ? 'active' : ''}`}
                  onClick={() => setTrendMetric('profit')}
                >
                  Lợi nhuận
                </button>
              </div>
            </div>
          </div>

          <div className="trend-legend-badges">
            <span className="trend-legend-badge red">
              <span className="legend-color-dot"></span> Thực hiện
            </span>
            <span className="trend-legend-badge dashed">
              <span className="legend-color-line"></span> Kế hoạch
            </span>
            <span className="trend-legend-badge gray">
              <span className="legend-color-dot"></span> Cùng kỳ năm {+selectedYear - 1}
            </span>
          </div>

          <div className="trend-chart-viewport" style={{ width: '100%', height: '300px', marginTop: '12px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendDataUpToMonth} margin={{ top: 15, right: 25, left: -10, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EE0033" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#EE0033" stopOpacity={0.01}/>
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#059669" stopOpacity={0.01}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}`} unit=" Tr.đ" />
                <RechartsTooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="trend-tooltip-custom">
                          <div className="tooltip-month-title">{label}/{selectedYear}</div>
                          {payload.map((entry, index) => (
                            <div key={`item-${index}`} className="tooltip-metric-row">
                              <span className="tooltip-metric-name" style={{ color: entry.color }}>
                                {entry.name}:
                              </span>
                              <strong className="tooltip-metric-val">
                                {entry.value} triệu đ
                              </strong>
                            </div>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                {trendMetric === 'revenue' ? (
                  <>
                    <Area
                      type="monotone"
                      dataKey="actual"
                      name="Thực hiện"
                      stroke="#EE0033"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorActual)"
                      dot={{ r: 4.5, fill: '#EE0033', stroke: '#ffffff', strokeWidth: 2 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="plan"
                      name="Kế hoạch"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      dot={{ r: 3, fill: '#f59e0b' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="lastYear"
                      name={`Cùng kỳ năm ${+selectedYear - 1}`}
                      stroke="#94a3b8"
                      strokeWidth={1.5}
                      dot={false}
                    />
                  </>
                ) : (
                  <Area
                    type="monotone"
                    dataKey="profit"
                    name="Lợi nhuận trước thuế"
                    stroke="#059669"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorProfit)"
                    dot={{ r: 4.5, fill: '#059669', stroke: '#ffffff', strokeWidth: 2 }}
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>


        {/* ROW: PIPELINE LEAD THEO GIAI ĐOẠN */}
        <div className="exec-chart-full-card">
          <div className="tr-header" style={{ marginBottom: '8px' }}>
            <div className="tr-header-left">
              <span className="pipeline-title-dot"></span>
              <h3 className="tr-header-title" style={{ fontWeight: 800 }}>Pipeline LEAD theo giai đoạn</h3>
              <div
                className="tr-info-btn"
                title="Phân bổ giá trị và số lượng cơ hội bán hàng (LEAD) qua từng giai đoạn trong quy trình bán hàng."
              >
                <Info size={17} color="#64748b" />
              </div>
            </div>
            <div className="tr-header-right">
              <div className="pipeline-header-summary">
                Tổng: <strong>1.107,1 tỷ VND</strong> <span className="pipeline-summary-sep">|</span> <strong>435</strong> deals
              </div>
            </div>
          </div>

          <div className="pipeline-chart-viewport" style={{ width: '100%', height: '340px', marginTop: '8px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={LEAD_PIPELINE_DATA}
                margin={{ top: 28, right: 25, left: -5, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="displayLabel"
                  stroke="#94a3b8"
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                  interval={0}
                  tick={renderPipelineCustomTick}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 400]}
                  ticks={[0, 50, 100, 150, 200, 250, 300, 350, 400]}
                  tickFormatter={(val) => `${val}`}
                  label={{
                    value: 'tỷ đồng',
                    angle: -90,
                    position: 'insideLeft',
                    offset: 5,
                    style: { fill: '#475569', fontSize: 13, fontWeight: 500, textAnchor: 'middle' }
                  }}
                />
                <RechartsTooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="trend-tooltip-custom">
                          <div className="tooltip-month-title">{d.stage}</div>
                          <div className="tooltip-metric-row">
                            <span className="tooltip-metric-name" style={{ color: d.color }}>
                              Giá trị:
                            </span>
                            <strong className="tooltip-metric-val">
                              {d.value.toLocaleString('vi-VN')} tỷ đ
                            </strong>
                          </div>
                          <div className="tooltip-metric-row">
                            <span className="tooltip-metric-name" style={{ color: '#64748b' }}>
                              Số lượng:
                            </span>
                            <strong className="tooltip-metric-val">
                              {d.deals} deal
                            </strong>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="value"
                  radius={[6, 6, 0, 0]}
                  barSize={42}
                  label={renderPipelineCustomLabel}
                >
                  {LEAD_PIPELINE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="pipeline-lead-footer">
            <div className="pipeline-footer-item">
              <span className="pipeline-footer-label">Đang mở (Mới → Đang ký HĐ):</span>{' '}
              <strong className="pipeline-footer-val">252 deal</strong>,{' '}
              <strong className="pipeline-footer-val">655,0 tỷ đ</strong>
            </div>
            <div className="pipeline-footer-item">
              <span className="pipeline-footer-label">Đã ký T{monthNum}:</span>{' '}
              <strong className="pipeline-footer-val">147 deal</strong>,{' '}
              <strong className="pipeline-footer-val">376,6 tỷ đ</strong>
            </div>
            <div className="pipeline-footer-item">
              <span className="pipeline-footer-label">Không thành công:</span>{' '}
              <strong className="pipeline-footer-val">36 deal</strong>
            </div>
          </div>
        </div>


        {/* ROW 3: CẶP PHÂN BỔ DOANH THU */}
        <div className="exec-charts-pair-row">
          {/* DOANH THU THEO NHÓM SPDV */}
          <div className="exec-card">
            <div className="tr-header" style={{ marginBottom: '14px' }}>
              <div className="tr-header-left">
                <div className="tr-header-icon-box" style={{ background: '#f0f9ff' }}>
                  <Layers size={20} color="#0284c7" strokeWidth={2.5} />
                </div>
                <h3 className="tr-header-title" style={{ fontWeight: 800 }}>Doanh thu theo nhóm SPDV</h3>
                <div
                  className="tr-info-btn"
                  title="Phân bổ doanh thu theo các nhóm sản phẩm dịch vụ chủ lực"
                >
                  <Info size={17} color="#64748b" />
                </div>
              </div>
              <div className="tr-period-badge">6 Nhóm SPDV</div>
            </div>

            <ExecutiveBarBreakdown
              items={spdvItems}
              unit="Triệu đồng"
            />
          </div>

          {/* DOANH THU THEO ĐƠN VỊ THỰC HIỆN */}
          <div className="exec-card">
            <div className="tr-header" style={{ marginBottom: '14px' }}>
              <div className="tr-header-left">
                <div className="tr-header-icon-box" style={{ background: '#fffbeb' }}>
                  <Building2 size={20} color="#d97706" strokeWidth={2.5} />
                </div>
                <h3 className="tr-header-title" style={{ fontWeight: 800 }}>Doanh thu theo đơn vị thực hiện</h3>
                <div
                  className="tr-info-btn"
                  title="Phân bổ doanh thu theo các đơn vị kinh doanh chủ lực"
                >
                  <Info size={17} color="#64748b" />
                </div>
              </div>
              <div className="tr-period-badge">6 Đơn vị chủ lực</div>
            </div>

            <ExecutiveBarBreakdown
              items={unitItems}
              unit="Triệu đồng"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
