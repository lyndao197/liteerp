import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, AreaChart as RechartsAreaChart, Area
} from 'recharts';
import {
  BarChart2, Activity, PieChart as PieChartIcon, AreaChart as AreaIcon,
  Save, Grid, List, Check, Download, TrendingUp, TrendingDown,
  Building, DollarSign, Calendar, Filter, Search, RefreshCw, Layers, ShieldCheck,
  Users, Target, Award, Clock, ArrowLeft
} from 'lucide-react';
import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';
import html2canvas from 'html2canvas';
import './RevenueReportDashboard.css';
import MonthComparisonChart from './MonthComparisonChart';
import QuarterComparisonChart from './QuarterComparisonChart';
import { MONTHLY_PLAN_DATA, MONTH_PREV_DATA, MONTH_LAST_YEAR_DATA, MONTH_NEXT_PLAN_DATA } from '../data/revenueMonthData';
import { QUARTER_CUMULATIVE_DATA, QUARTER_ESTIMATE_DATA, QUARTER_PREV_DATA, QUARTER_SAME_PERIOD_DATA } from '../data/revenueQuarterData';
import YearComparisonChart from './YearComparisonChart';
import { YEAR_CUMULATIVE_DATA, YEAR_PLAN_FULL_DATA } from '../data/revenueYearData';
import TrendComparisonChart from './TrendComparisonChart';
import { MONTH_TREND_DATA } from '../data/revenueTrendData';
import SpdvComparisonChart from './SpdvComparisonChart';
import { SPDV_CATEGORIES, SPDV_STRUCTURE_DATA } from '../data/revenueSpdvData';
import UnitComparisonChart from './UnitComparisonChart';
import { UNIT_CATEGORIES, UNIT_STRUCTURE_DATA } from '../data/revenueUnitData';
import InternalExternalRevenueChart from './InternalExternalRevenueChart';
import {
  INTERNAL_EXTERNAL_CATEGORIES,
  INTERNAL_EXTERNAL_DATA,
  DOMESTIC_INTERNATIONAL_CATEGORIES,
  DOMESTIC_INTERNATIONAL_DATA
} from '../data/revenueInternalExternalData';

// 7 Sub-branch groups matching the requested design
const REVENUE_SUB_BRANCHES = [
  {
    id: 'month',
    title: '1. Phân tích theo tháng',
    subtitle: 'Kết quả tháng so với các mốc liên quan',
    badge: 4,
    icon: BarChart2,
    color: '#2563eb'
  },
  {
    id: 'quarter',
    title: '2. Phân tích theo quý',
    subtitle: 'Lũy kế, ước Quý và so sánh',
    badge: 4,
    icon: Calendar,
    color: '#10b981'
  },
  {
    id: 'year',
    title: '3. Phân tích theo năm',
    subtitle: 'Lũy kế, ước năm và so sánh',
    badge: 4,
    icon: Calendar,
    color: '#f59e0b'
  },
  {
    id: 'trend',
    title: '4. Xu hướng doanh thu từng tháng',
    subtitle: 'So sánh từng tháng so với năm trước và kế hoạch',
    badge: 2,
    icon: TrendingUp,
    color: '#8b5cf6'
  },
  {
    id: 'spdv',
    title: '5. Doanh thu theo nhóm SPDV',
    subtitle: 'Cơ cấu doanh thu thực hiện và kế hoạch theo 6 nhóm SPDV',
    badge: 2,
    icon: PieChartIcon,
    color: '#ef4444'
  },
  {
    id: 'unit',
    title: '6. Doanh thu theo đơn vị',
    subtitle: 'Cơ cấu và doanh thu theo đơn vị so với kế hoạch',
    badge: 2,
    icon: Building,
    color: '#0284c7'
  },
  {
    id: 'plan_progress',
    title: '7. Chuyển dịch DT ngoài và DT quốc tế',
    subtitle: 'Cơ cấu DT nội bộ - ngoài TĐ & DT trong nước - quốc tế',
    badge: 4,
    icon: Target,
    color: '#dc2626'
  }
];

// 1. Monthly revenue actual vs target (in Billion VNĐ)
const MONTHLY_REVENUE_DATA = [
  { month: 'T1', actual: 9.8, target: 11.0, lastYear: 8.5, diff: -1.2, growth: 12.5, rate: 89.1 },
  { month: 'T2', actual: 8.5, target: 10.5, lastYear: 7.8, diff: -2.0, growth: 8.2, rate: 81.0 },
  { month: 'T3', actual: 13.2, target: 13.0, lastYear: 11.2, diff: 0.2, growth: 18.4, rate: 101.5 },
  { month: 'T4', actual: 11.6, target: 12.5, lastYear: 10.1, diff: -0.9, growth: 14.1, rate: 92.8 },
  { month: 'T5', actual: 12.8, target: 13.0, lastYear: 11.0, diff: -0.2, growth: 16.5, rate: 98.5 },
  { month: 'T6', actual: 15.4, target: 15.0, lastYear: 12.6, diff: 0.4, growth: 22.0, rate: 102.7 },
  { month: 'T7', actual: 14.1, target: 14.5, lastYear: 12.2, diff: -0.4, growth: 15.8, rate: 97.2 },
  { month: 'T8', actual: 13.9, target: 14.0, lastYear: 12.1, diff: -0.1, growth: 14.3, rate: 99.3 },
  { month: 'T9', actual: 16.2, target: 15.5, lastYear: 13.0, diff: 0.7, growth: 24.6, rate: 104.5 },
  { month: 'T10', actual: 14.8, target: 15.0, lastYear: 12.6, diff: -0.2, growth: 17.2, rate: 98.7 },
  { month: 'T11', actual: 17.5, target: 17.0, lastYear: 14.5, diff: 0.5, growth: 21.0, rate: 102.9 },
  { month: 'T12', actual: 20.7, target: 19.0, lastYear: 16.5, diff: 1.7, growth: 25.5, rate: 108.9 }
];

// 2. Quarterly revenue data
const QUARTERLY_REVENUE_DATA = [
  { quarter: 'Quý 1', actual: 31.5, target: 34.5, lastYear: 27.5, forecast: 31.5, rate: 91.3, growth: 14.5 },
  { quarter: 'Quý 2', actual: 39.8, target: 40.5, lastYear: 33.7, forecast: 39.8, rate: 98.3, growth: 18.1 },
  { quarter: 'Quý 3', actual: 44.2, target: 44.0, lastYear: 37.3, forecast: 44.2, rate: 100.5, growth: 18.5 },
  { quarter: 'Quý 4 (Dự kiến)', actual: 53.0, target: 51.0, lastYear: 43.6, forecast: 53.0, rate: 103.9, growth: 21.6 }
];

// 3. Yearly revenue data
const YEARLY_REVENUE_DATA = [
  { year: '2023', actual: 104.5, target: 100.0, growth: 15.2, rate: 104.5 },
  { year: '2024', actual: 122.8, target: 120.0, growth: 17.5, rate: 102.3 },
  { year: '2025', actual: 142.1, target: 140.0, growth: 15.7, rate: 101.5 },
  { year: '2026 (Kế hoạch / Ước)', actual: 168.5, target: 160.0, growth: 18.6, rate: 105.3 }
];

// 4. Trend & Seasonality
const TREND_DATA = [
  { month: 'T1', actual: 9.8, trendLine: 9.5, movingAvg: 9.8 },
  { month: 'T2', actual: 8.5, trendLine: 10.3, movingAvg: 9.15 },
  { month: 'T3', actual: 13.2, trendLine: 11.1, movingAvg: 10.5 },
  { month: 'T4', actual: 11.6, trendLine: 12.0, movingAvg: 11.1 },
  { month: 'T5', actual: 12.8, trendLine: 12.8, movingAvg: 12.5 },
  { month: 'T6', actual: 15.4, trendLine: 13.6, movingAvg: 13.3 },
  { month: 'T7', actual: 14.1, trendLine: 14.4, movingAvg: 14.1 },
  { month: 'T8', actual: 13.9, trendLine: 15.2, movingAvg: 14.5 },
  { month: 'T9', actual: 16.2, trendLine: 16.0, movingAvg: 14.7 },
  { month: 'T10', actual: 14.8, trendLine: 16.9, movingAvg: 15.0 },
  { month: 'T11', actual: 17.5, trendLine: 17.7, movingAvg: 16.2 },
  { month: 'T12', actual: 20.7, trendLine: 18.5, movingAvg: 17.7 }
];

// 5. Revenue distribution by 5 core streams
const REVENUE_STREAMS = [
  { id: 'vtt', name: 'Khách hàng VTT (Viettel Telecom)', amount: 56.4, target: 58.0, percent: 38, count: 42, color: '#EE0033' },
  { id: 'internal', name: 'Nội bộ ngoài VTT (VDS, VTP, VTNet...)', amount: 35.6, target: 38.0, percent: 24, count: 28, color: '#2563eb' },
  { id: 'external', name: 'Khách hàng ngoài tập đoàn (B2B/B2G)', amount: 32.7, target: 36.0, percent: 22, count: 35, color: '#10b981' },
  { id: 'global', name: 'Doanh thu Global (Thị trường quốc tế)', amount: 14.8, target: 16.0, percent: 10, count: 16, color: '#f59e0b' },
  { id: 'new_service', name: 'Dịch vụ mới & Giải pháp số (Cloud/AI/IoT)', amount: 9.0, target: 12.0, percent: 6, count: 19, color: '#8b5cf6' }
];

// 6. Revenue by Unit / Division
const UNIT_REVENUE_DATA = [
  { id: 'cntt', name: 'Trung tâm Giải pháp CNTT', amount: 48.5, target: 50.0, rate: 97.0, contracts: 52, color: '#2563eb' },
  { id: 'cloud', name: 'Trung tâm Hạ tầng số & Cloud', amount: 39.2, target: 40.0, rate: 98.0, contracts: 38, color: '#10b981' },
  { id: 'b2g', name: 'Khối Doanh nghiệp & Chính phủ (B2G)', amount: 32.6, target: 35.0, rate: 93.1, contracts: 31, color: '#f59e0b' },
  { id: 'global', name: 'TT Kinh doanh Viễn thông Quốc tế', amount: 16.4, target: 18.0, rate: 91.1, contracts: 18, color: '#8b5cf6' },
  { id: 'south', name: 'Chi nhánh Khách hàng Miền Nam', amount: 11.8, target: 13.0, rate: 90.8, contracts: 14, color: '#06b6d4' }
];

// 7. Plan Progress 10 indicators
const PLAN_PROGRESS_INDICATORS = [
  { id: 1, title: 'Tổng kế hoạch giao năm 2026', value: '160,00 Tỷ VNĐ', note: 'Chỉ tiêu HĐQT giao', badge: 'Chỉ tiêu' },
  { id: 2, title: 'Doanh thu lũy kế thực hiện', value: '148,50 Tỷ VNĐ', note: 'Đạt 92.8% kế hoạch', badge: '92.8%' },
  { id: 3, title: 'Doanh thu đã nghiệm thu BB-NT', value: '132,20 Tỷ VNĐ', note: 'Đã xuất hóa đơn / đối soát', badge: '89.0%' },
  { id: 4, title: 'Doanh thu đang đối soát / dở dang', value: '28,30 Tỷ VNĐ', note: 'Dự kiến ghi nhận trong Q3', badge: '22 BB' },
  { id: 5, title: 'Doanh số còn thiếu để về đích', value: '11,50 Tỷ VNĐ', note: 'Cần đạt thêm trong Q4', badge: 'Gap' },
  { id: 6, title: 'Số ngày làm việc còn lại', value: '101 Ngày', note: 'Đến 31/12/2026', badge: 'Đếm ngược' },
  { id: 7, title: 'Mục tiêu trung bình mỗi ngày', value: '0,114 Tỷ/ngày', note: '~114 triệu VNĐ / ngày', badge: 'Tốc độ' },
  { id: 8, title: 'Số lượng hợp đồng phát sinh DT', value: '148 Hợp đồng', note: '+24 hợp đồng ký mới', badge: 'Hợp đồng' },
  { id: 9, title: 'Tỷ lệ hoàn thành nhóm Tập đoàn', value: '94,2%', note: 'Khách hàng VTT & nội bộ', badge: 'Nội bộ' },
  { id: 10, title: 'Tỷ lệ hoàn thành ngoài Tập đoàn', value: '88,6%', note: 'Khối B2B / B2G / Quốc tế', badge: 'Bên ngoài' }
];

// Top contract records
const DETAILED_CONTRACT_DATA = [
  { id: 'HD-2026-001', customer: 'Tập đoàn Viettel (Viettel Telecom)', stream: 'Khách hàng VTT', service: 'Hạ tầng mạng & Thuê kênh truyền', month: '06/2026', plan: 18.5, actual: 18.2, status: 'Đã nghiệm thu', rate: 98.4 },
  { id: 'HD-2026-002', customer: 'Ngân hàng TMCP Quân đội (MB Bank)', stream: 'Ngoài tập đoàn', service: 'Triển khai Private Cloud & Bảo mật', month: '05/2026', plan: 12.0, actual: 12.0, status: 'Đã nghiệm thu', rate: 100.0 },
  { id: 'HD-2026-003', customer: 'Tổng Công ty Dịch vụ số Viettel (VDS)', stream: 'Nội bộ ngoài VTT', service: 'Phát triển Viettel Money Core Platform', month: '07/2026', plan: 10.5, actual: 9.8, status: 'Chờ đối soát', rate: 93.3 },
  { id: 'HD-2026-004', customer: 'Công ty Cổ phần Sữa Việt Nam (Vinamilk)', stream: 'Ngoài tập đoàn', service: 'Giải pháp ERP & Quản trị chuỗi cung ứng', month: '06/2026', plan: 8.5, actual: 8.5, status: 'Đã nghiệm thu', rate: 100.0 },
  { id: 'HD-2026-005', customer: 'Metfone (Viettel Cambodia)', stream: 'Doanh thu Global', service: 'Tư vấn Chuyển đổi số & Billing BSS', month: '04/2026', plan: 7.2, actual: 6.9, status: 'Đã nghiệm thu', rate: 95.8 },
  { id: 'HD-2026-006', customer: 'Tổng Công ty Bưu chính Viettel (Viettel Post)', stream: 'Nội bộ ngoài VTT', service: 'Hệ thống Định tuyến Logistics thông minh', month: '07/2026', plan: 6.8, actual: 6.2, status: 'Chờ đối soát', rate: 91.2 },
  { id: 'HD-2026-007', customer: 'Unitel (Star Telecom Lào)', stream: 'Doanh thu Global', service: 'Data Center & Lưu trữ đám mây', month: '05/2026', plan: 5.5, actual: 5.2, status: 'Đã nghiệm thu', rate: 94.5 },
  { id: 'HD-2026-008', customer: 'Tập đoàn Điện lực Việt Nam (EVN)', stream: 'Dịch vụ mới', service: 'Giám sát IoT Trạm biến áp & An toàn thông tin', month: '06/2026', plan: 4.8, actual: 4.6, status: 'Đang triển khai', rate: 95.8 }
];

const RevenueReportDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Active sub-branch from URL: ?view=month | quarter | year | trend | spdv | unit | plan_progress
  const searchParams = new URLSearchParams(location.search);
  const currentView = searchParams.get('view') || 'month';

  // Filter States
  const [selectedYear, setSelectedYear] = useState('2026');
  const [selectedMonth, setSelectedMonth] = useState('Tháng 8');
  const [selectedQuarter, setSelectedQuarter] = useState('Quý III');
  const [selectedCumulativeMonth, setSelectedCumulativeMonth] = useState('Lũy kế 8 tháng');
  const [selectedStream, setSelectedStream] = useState('all');
  const [searchKeyword, setSearchKeyword] = useState('');

  // View States
  const [viewMode, setViewMode] = useState('chart'); // 'chart' | 'pivot' | 'list'
  const [chartType, setChartType] = useState('bar'); // 'bar' | 'line' | 'donut' | 'area'

  // Card visibility state across sub-branches to control selective export
  const [spdvVisibleCards, setSpdvVisibleCards] = useState({
    thMonth: false,
    khMonth: false,
    thQuarter: false,
    khQuarter: false,
    thYear: false,
    khYear: false
  });

  const [inExVisibleCards, setInExVisibleCards] = useState({
    thMonth: false,
    khMonth: false,
    thQuarter: false,
    khQuarter: false,
    thYear: false,
    khYear: false,
    thMonth27: false,
    khMonth28: false,
    thQuarter27: false,
    khQuarter28: false,
    thYear27: false,
    khYear28: false
  });

  const [unitVisibleCards, setUnitVisibleCards] = useState({
    c21Month: true,
    c22Month: true,
    c21Quarter: true,
    c22Quarter: true,
    c21Year: true,
    c22Year: true
  });

  const [monthVisibleMap, setMonthVisibleMap] = useState({
    r1_val: true,
    r1_rat: true,
    r2_val: true,
    r2_rat: true,
    r3_val: true,
    r3_rat: true,
    r4_val: true,
    r4_rat: true
  });

  const [quarterVisibleMap, setQuarterVisibleMap] = useState({
    r1_val: true,
    r1_rat: true,
    r2_val: true,
    r2_rat: true,
    r3_val: true,
    r3_rat: true,
    r4_val: true,
    r4_rat: true
  });

  const [yearVisibleCards, setYearVisibleCards] = useState({
    c10Val: true,
    c10Rat: true,
    c11Val: true,
    c11Rat: true
  });

  // Toast
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleSelectSubBranch = (viewId) => {
    navigate(`/reports/revenue?view=${viewId}`);
  };

  // Filtered detailed contracts
  const filteredContracts = useMemo(() => {
    return DETAILED_CONTRACT_DATA.filter(item => {
      const matchStream = selectedStream === 'all' || item.stream === selectedStream;
      const matchKeyword = !searchKeyword || 
        item.customer.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        item.id.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        item.service.toLowerCase().includes(searchKeyword.toLowerCase());
      return matchStream && matchKeyword;
    });
  }, [selectedStream, searchKeyword]);

  // Fallback: Vẽ biểu đồ trực tiếp lên Canvas 2x Retina đảm bảo 100% luôn có ảnh nét đẹp, không phụ thuộc DOM
  const generateChartPngFallback = (chartType, shortMonth, selectedYear, data) => {
    const canvas = document.createElement('canvas');
    const w = 1040 * 2;
    const h = 460 * 2;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');

    // Background trắng
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);

    // Khung bo viền nhẹ nhàng
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, w - 20, h - 20);

    // Scale 2x cho retina
    ctx.scale(2, 2);

    const setFont = (size, weight = 'normal') => {
      ctx.font = `${weight} ${size}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    };

    // Tiêu đề biểu đồ
    setFont(15, 'bold');
    ctx.fillStyle = '#0f172a';
    ctx.textAlign = 'left';

    if (chartType === 14) {
      const prevY = (parseInt(selectedYear, 10) - 1).toString();
      setFont(16, 'bold');
      ctx.fillStyle = '#1e3a8a';
      ctx.fillText('Biểu đồ 14. Xu hướng doanh thu từng tháng so với năm trước', 30, 32);

      setFont(12.5, 'bold');
      ctx.fillText(`Biểu đồ 14. Xu hướng tổng doanh thu từng tháng năm ${selectedYear} so với năm ${prevY} (ngoặc: tăng trưởng cùng kỳ)`, 70, 85);

      // Legend top right
      const legX = 850;
      // TH prevYear
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([5, 3]);
      ctx.beginPath();
      ctx.moveTo(legX, 60);
      ctx.lineTo(legX + 22, 60);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath();
      ctx.arc(legX + 11, 60, 4, 0, Math.PI * 2);
      ctx.fill();
      setFont(11.5, '600');
      ctx.fillStyle = '#475569';
      ctx.fillText(`TH ${prevY}`, legX + 28, 64);

      // TH selectedYear
      ctx.strokeStyle = '#c8102e';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(legX, 80);
      ctx.lineTo(legX + 22, 80);
      ctx.stroke();
      ctx.fillStyle = '#c8102e';
      ctx.beginPath();
      ctx.arc(legX + 11, 80, 4.5, 0, Math.PI * 2);
      ctx.fill();
      setFont(11.5, 'bold');
      ctx.fillStyle = '#1e293b';
      ctx.fillText(`TH ${selectedYear}`, legX + 28, 84);

      // Coordinates
      const cLeft = 70;
      const cRight = 990;
      const cWidth = cRight - cLeft;
      const cTop = 110;
      const cBottom = 390;
      const cHeight = cBottom - cTop;
      const yMax = 600;

      // Y Axis Label
      setFont(12, 'bold');
      ctx.fillStyle = '#64748b';
      ctx.save();
      ctx.translate(26, cTop + cHeight / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.textAlign = 'center';
      ctx.fillText('Triệu đồng', 0, 0);
      ctx.restore();

      // Grid lines & Y Ticks
      const ticks = [0, 100, 200, 300, 400, 500, 600];
      ticks.forEach(tick => {
        const y = cBottom - (tick / yMax) * cHeight;
        ctx.beginPath();
        ctx.strokeStyle = tick === 0 ? '#334155' : '#f1f5f9';
        ctx.lineWidth = tick === 0 ? 1.5 : 1;
        ctx.moveTo(cLeft, y);
        ctx.lineTo(cRight, y);
        ctx.stroke();

        ctx.strokeStyle = '#64748b';
        ctx.beginPath();
        ctx.moveTo(cLeft - 5, y);
        ctx.lineTo(cLeft, y);
        ctx.stroke();

        setFont(11, '500');
        ctx.fillStyle = '#64748b';
        ctx.textAlign = 'right';
        ctx.fillText(tick.toString(), cLeft - 8, y + 4);
      });

      // Axis lines
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(cLeft, cTop - 10);
      ctx.lineTo(cLeft, cBottom);
      ctx.stroke();

      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cLeft, cBottom);
      ctx.lineTo(cRight, cBottom);
      ctx.stroke();

      const items = Array.isArray(data) ? data : [];
      const getPtX = (i) => cLeft + (i / 11) * cWidth;
      const getPtY = (v) => cBottom - (v / yMax) * cHeight;

      // X ticks & labels
      ctx.textAlign = 'center';
      items.forEach((item, idx) => {
        const x = getPtX(idx);
        ctx.strokeStyle = '#64748b';
        ctx.beginPath();
        ctx.moveTo(x, cBottom);
        ctx.lineTo(x, cBottom + 5);
        ctx.stroke();

        setFont(11.5, '600');
        ctx.fillStyle = '#475569';
        ctx.fillText(item.month, x, cBottom + 20);
      });

      // Draw Path TH prevYear
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      items.forEach((item, idx) => {
        const x = getPtX(idx);
        const y = getPtY(item.th2025);
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.setLineDash([]);

      // Dots TH prevYear
      ctx.fillStyle = '#94a3b8';
      items.forEach((item, idx) => {
        const x = getPtX(idx);
        const y = getPtY(item.th2025);
        ctx.beginPath();
        ctx.arc(x, y, 4.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Path TH selectedYear
      const validItems = items.filter(d => d.th2026 !== null && d.th2026 !== undefined);
      ctx.strokeStyle = '#c8102e';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      validItems.forEach((item, i) => {
        const idx = items.findIndex(it => it.month === item.month);
        const x = getPtX(idx);
        const y = getPtY(item.th2026);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Dots and Labels TH selectedYear
      validItems.forEach(item => {
        const idx = items.findIndex(it => it.month === item.month);
        const x = getPtX(idx);
        const y = getPtY(item.th2026);

        // Dot
        ctx.fillStyle = '#c8102e';
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();

        // White ring
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Labels
        setFont(11, 'bold');
        ctx.fillStyle = '#2e7d32';
        ctx.fillText(item.th2026.toString().replace('.', ','), x, y - 18);

        setFont(10.5, '600');
        ctx.fillText(`(${item.growth})`, x, y - 6);
      });

      return canvas.toDataURL('image/png');
    }

    if (chartType === 16 || chartType === 'spdv') {
      const spdv = data || SPDV_STRUCTURE_DATA[selectedYear] || SPDV_STRUCTURE_DATA['2026'];
      setFont(16, 'bold');
      ctx.fillStyle = '#1e3a8a';
      ctx.textAlign = 'left';
      ctx.fillText('Biểu đồ 16 – 17. Cơ cấu doanh thu thực hiện và kế hoạch theo 6 nhóm SPDV', 30, 32);

      setFont(13.5, 'bold');
      ctx.textAlign = 'center';
      ctx.fillText('Biểu đồ 16 (hàng trên) & 17 (hàng dưới). Cơ cấu doanh thu thực hiện và kế hoạch theo 6 nhóm SPDV', 520, 85);

      const dList = [
        { cx: 195, cy: 165, titleY: 105, chart: spdv.thMonth },
        { cx: 520, cy: 165, titleY: 105, chart: spdv.thQuarter },
        { cx: 845, cy: 165, titleY: 105, chart: spdv.thYear },
        { cx: 195, cy: 320, titleY: 260, chart: spdv.khMonth },
        { cx: 520, cy: 320, titleY: 260, chart: spdv.khQuarter },
        { cx: 845, cy: 320, titleY: 260, chart: spdv.khYear }
      ];

      const oR = 52;
      const iR = 30;
      const tR = (oR + iR) / 2;

      dList.forEach(item => {
        setFont(12, '600');
        ctx.fillStyle = '#1e293b';
        ctx.textAlign = 'center';
        ctx.fillText(item.chart.title, item.cx, item.titleY);

        let curA = -Math.PI / 2;
        item.chart.slices.forEach(slice => {
          const sAngle = (slice.percent / 100) * 2 * Math.PI;
          const eAngle = curA + sAngle;

          ctx.beginPath();
          ctx.arc(item.cx, item.cy, oR, curA, eAngle);
          ctx.arc(item.cx, item.cy, iR, eAngle, curA, true);
          ctx.closePath();
          ctx.fillStyle = slice.color;
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          const midA = curA + sAngle / 2;
          const tx = item.cx + tR * Math.cos(midA);
          const ty = item.cy + tR * Math.sin(midA);
          setFont(9.5, 'bold');
          ctx.fillStyle = '#ffffff';
          ctx.fillText(`${slice.percent}%`, tx, ty + 3);

          curA = eAngle;
        });

        // Center total & unit
        setFont(12, 'bold');
        ctx.fillStyle = '#0f172a';
        ctx.fillText(item.chart.formattedTotal, item.cx, item.cy - 1);
        setFont(9.5, '600');
        ctx.fillText(item.chart.unit, item.cx, item.cy + 11);
      });

      // Legend at bottom
      const legCats = SPDV_CATEGORIES;
      const legStartX = 110;
      legCats.forEach((cat, idx) => {
        const lx = legStartX + idx * 145;
        const ly = 395;
        ctx.fillStyle = cat.color;
        ctx.fillRect(lx, ly, 18, 10);
        setFont(10.5, '500');
        ctx.fillStyle = '#334155';
        ctx.textAlign = 'left';
        ctx.fillText(cat.name, lx + 22, ly + 9);
      });

      return canvas.toDataURL('image/png');
    }

    if (chartType === 21 || chartType === 'unit') {
      const unit = data || UNIT_STRUCTURE_DATA[selectedYear] || UNIT_STRUCTURE_DATA['2026'];
      setFont(16, 'bold');
      ctx.fillStyle = '#1e3a8a';
      ctx.textAlign = 'left';
      ctx.fillText('Biểu đồ 21. Cơ cấu doanh thu theo đơn vị thực hiện', 30, 32);

      setFont(13.5, 'bold');
      ctx.textAlign = 'center';
      ctx.fillText('Biểu đồ 21. Cơ cấu doanh thu thực hiện theo đơn vị', 520, 85);

      const dList = [
        { cx: 195, cy: 195, titleY: 125, chart: unit.thMonth },
        { cx: 520, cy: 195, titleY: 125, chart: unit.thQuarter },
        { cx: 845, cy: 195, titleY: 125, chart: unit.thYear }
      ];

      const oR = 65;
      const iR = 38;
      const tR = (oR + iR) / 2;

      dList.forEach(item => {
        setFont(13, '600');
        ctx.fillStyle = '#1e293b';
        ctx.textAlign = 'center';
        ctx.fillText(item.chart.title, item.cx, item.titleY);

        let curA = -Math.PI / 2;
        item.chart.slices.forEach(slice => {
          const sAngle = (slice.percent / 100) * 2 * Math.PI;
          const eAngle = curA + sAngle;

          ctx.beginPath();
          ctx.arc(item.cx, item.cy, oR, curA, eAngle);
          ctx.arc(item.cx, item.cy, iR, eAngle, curA, true);
          ctx.closePath();
          ctx.fillStyle = slice.color;
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          const midA = curA + sAngle / 2;
          const tx = item.cx + tR * Math.cos(midA);
          const ty = item.cy + tR * Math.sin(midA);
          setFont(10, 'bold');
          ctx.fillStyle = '#ffffff';
          ctx.fillText(`${slice.percent}%`, tx, ty + 3);

          curA = eAngle;
        });

        // Center total & unit
        setFont(13, 'bold');
        ctx.fillStyle = '#0f172a';
        ctx.fillText(item.chart.formattedTotal, item.cx, item.cy - 1);
        setFont(10, '600');
        ctx.fillText(item.chart.unit, item.cx, item.cy + 13);
      });

      // Legend at bottom
      const legCats = UNIT_CATEGORIES;
      const legStartX = 110;
      legCats.forEach((cat, idx) => {
        const lx = legStartX + idx * 145;
        const ly = 295;
        ctx.fillStyle = cat.color;
        ctx.fillRect(lx, ly, 18, 10);
        setFont(10.5, '500');
        ctx.fillStyle = '#334155';
        ctx.textAlign = 'left';
        ctx.fillText(cat.name, lx + 22, ly + 9);
      });

      return canvas.toDataURL('image/png');
    }

    if (chartType === 25 || chartType === 'plan_progress') {
      const inEx = data || INTERNAL_EXTERNAL_DATA[selectedYear] || INTERNAL_EXTERNAL_DATA['2026'];
      setFont(16, 'bold');
      ctx.fillStyle = '#1e3a8a';
      ctx.textAlign = 'left';
      ctx.fillText('Biểu đồ 25 – 26. Cơ cấu doanh thu nội bộ và doanh thu ngoài Tập đoàn: thực hiện và kế hoạch', 30, 32);

      setFont(13.5, 'bold');
      ctx.textAlign = 'center';
      ctx.fillText('Biểu đồ 25 (hàng trên) & 26 (hàng dưới). Cơ cấu DT nội bộ - DT ngoài Tập đoàn: thực hiện và kế hoạch', 520, 85);

      const dList = [
        { cx: 195, cy: 165, titleY: 105, chart: inEx.thMonth },
        { cx: 520, cy: 165, titleY: 105, chart: inEx.thQuarter },
        { cx: 845, cy: 165, titleY: 105, chart: inEx.thYear },
        { cx: 195, cy: 320, titleY: 260, chart: inEx.khMonth },
        { cx: 520, cy: 320, titleY: 260, chart: inEx.khQuarter },
        { cx: 845, cy: 320, titleY: 260, chart: inEx.khYear }
      ];

      const oR = 52;
      const iR = 30;
      const tR = (oR + iR) / 2;

      dList.forEach(item => {
        setFont(12, '600');
        ctx.fillStyle = '#1e293b';
        ctx.textAlign = 'center';
        ctx.fillText(item.chart.title, item.cx, item.titleY);

        let curA = -Math.PI / 2;
        item.chart.slices.forEach(slice => {
          const sAngle = (slice.percent / 100) * 2 * Math.PI;
          const eAngle = curA + sAngle;

          ctx.beginPath();
          ctx.arc(item.cx, item.cy, oR, curA, eAngle);
          ctx.arc(item.cx, item.cy, iR, eAngle, curA, true);
          ctx.closePath();
          ctx.fillStyle = slice.color;
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          const midA = curA + sAngle / 2;
          const tx = item.cx + tR * Math.cos(midA);
          const ty = item.cy + tR * Math.sin(midA);
          setFont(9.5, 'bold');
          ctx.fillStyle = '#ffffff';
          ctx.fillText(`${slice.formattedPercent || slice.percent + '%'}`, tx, ty + 3);

          curA = eAngle;
        });

        // Center total & unit
        setFont(12, 'bold');
        ctx.fillStyle = '#0f172a';
        ctx.fillText(item.chart.formattedTotal, item.cx, item.cy - 1);
        setFont(9.5, '600');
        ctx.fillText(item.chart.unit, item.cx, item.cy + 11);
      });

      // Legend at bottom
      const legCats = INTERNAL_EXTERNAL_CATEGORIES;
      const legStartX = 340;
      legCats.forEach((cat, idx) => {
        const lx = legStartX + idx * 200;
        const ly = 395;
        ctx.fillStyle = cat.color;
        ctx.fillRect(lx, ly, 18, 10);
        setFont(11, '600');
        ctx.fillStyle = '#334155';
        ctx.textAlign = 'left';
        ctx.fillText(cat.name, lx + 24, ly + 9);
      });

      return canvas.toDataURL('image/png');
    }

    let cardTitle = '';
    let subtitleLeft = '';
    let legend1Label = '';
    let legend2Label = '';

    if (chartType === 1) {
      cardTitle = `Biểu đồ 1. Kết quả ${shortMonth}/${selectedYear} so với kế hoạch ${shortMonth}/${selectedYear}`;
      subtitleLeft = `Giá trị (số in đậm: TH ${shortMonth} % hoàn thành KH ${shortMonth})`;
      legend1Label = `TH ${shortMonth}`;
      legend2Label = `KH ${shortMonth}`;
    } else if (chartType === 2) {
      const monthNum = parseInt(shortMonth.replace('T', ''), 10);
      const prevM = monthNum === 1 ? 12 : monthNum - 1;
      const prevY = monthNum === 1 ? (parseInt(selectedYear, 10) - 1).toString() : selectedYear;
      cardTitle = `Biểu đồ 2. Kết quả ${shortMonth}/${selectedYear} so với kết quả T${prevM}/${prevY}`;
      subtitleLeft = `Giá trị (số in đậm: % tăng trưởng so với T${prevM})`;
      legend1Label = `TH ${shortMonth}`;
      legend2Label = `TH T${prevM}`;
    } else if (chartType === 3) {
      const lastY = (parseInt(selectedYear, 10) - 1).toString();
      cardTitle = `Biểu đồ 3. Kết quả ${shortMonth}/${selectedYear} so với cùng kỳ ${shortMonth}/${lastY}`;
      subtitleLeft = `Giá trị (số in đậm: % tăng trưởng so với cùng kỳ)`;
      legend1Label = `TH ${shortMonth}/${selectedYear}`;
      legend2Label = `Cùng kỳ ${shortMonth}/${lastY}`;
    } else if (chartType === 4) {
      const monthNum = parseInt(shortMonth.replace('T', ''), 10);
      const nextM = monthNum === 12 ? 1 : monthNum + 1;
      const nextY = monthNum === 12 ? (parseInt(selectedYear, 10) + 1).toString() : selectedYear;
      cardTitle = `Biểu đồ 4. Kết quả ${shortMonth}/${selectedYear} so với kế hoạch T${nextM}/${nextY}`;
      subtitleLeft = `Giá trị (số in đậm: TH ${shortMonth} % so với KH T${nextM})`;
      legend1Label = `TH ${shortMonth}`;
      legend2Label = `KH T${nextM}`;
    } else if (chartType === 5) {
      const qCode = data.quarterCode || 'Q3';
      cardTitle = `Biểu đồ 5. Lũy kế ${selectedQuarter}/${selectedYear} so với kế hoạch ${selectedQuarter}`;
      subtitleLeft = `Giá trị (số in đậm: LK ${qCode} % hoàn thành KH ${qCode})`;
      legend1Label = `LK ${qCode}`;
      legend2Label = `KH ${qCode}`;
    } else if (chartType === 6) {
      const qCode = data.quarterCode || 'Q3';
      cardTitle = `Biểu đồ 6. Ước kết quả ${selectedQuarter}/${selectedYear} so với kế hoạch ${selectedQuarter}`;
      subtitleLeft = `Giá trị (số in đậm: Ước ${qCode} % hoàn thành KH ${qCode})`;
      legend1Label = `Ước ${qCode}`;
      legend2Label = `KH ${qCode}`;
    } else if (chartType === 7) {
      const qCode = data.quarterCode || 'Q3';
      const prevQCode = data.prevQuarterCode || 'Q2';
      const prevQName = data.prevQuarterName || 'Quý II';
      const prevY = selectedQuarter === 'Quý I' ? (parseInt(selectedYear, 10) - 1).toString() : selectedYear;
      cardTitle = `Biểu đồ 7. Ước kết quả ${selectedQuarter}/${selectedYear} so với kết quả ${prevQName}/${prevY}`;
      subtitleLeft = `Giá trị (số in đậm: Ước ${qCode} % so với TH ${prevQCode})`;
      legend1Label = `Ước ${qCode}`;
      legend2Label = `TH ${prevQCode}`;
    } else if (chartType === 10) {
      const shortCode = data.shortCode || '8T';
      const monthText = data.monthText || '8 tháng';
      cardTitle = `Biểu đồ 10. Lũy kế năm ${selectedYear} so với kế hoạch lũy kế năm ${selectedYear}`;
      subtitleLeft = `Giá trị (số in đậm: LK ${shortCode} % hoàn thành KH LK ${shortCode})`;
      legend1Label = `LK ${shortCode}`;
      legend2Label = `KH LK ${shortCode}`;
    }

    setFont(15.5, 'bold');
    ctx.fillStyle = '#0f172a';
    ctx.textAlign = 'left';
    ctx.fillText(cardTitle, 24, 32);

    // Phụ đề 2 bên
    setFont(12, '600');
    ctx.fillStyle = '#334155';
    ctx.fillText(subtitleLeft, 140, 64);
    ctx.fillText('Tỷ suất / tỷ trọng (chênh lệch điểm %)', 710, 64);

    // Chú thích (Legend) ở giữa
    ctx.fillStyle = '#c8102e';
    ctx.fillRect(495, 52, 12, 12);
    setFont(11, '600');
    ctx.fillStyle = '#334155';
    ctx.fillText(legend1Label, 513, 63);

    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(495, 70, 12, 12);
    ctx.fillStyle = '#334155';
    ctx.fillText(legend2Label, 513, 81);

    // Trục toạ độ
    const leftAxisX = 60;
    const chartTop = 100;
    const chartBottom = 380;
    const chartHeight = chartBottom - chartTop;
    const leftChartWidth = 460;
    const rightAxisX = 640;
    const rightChartWidth = 330;

    // Trục Y trái: Triệu đồng
    setFont(12, 'bold');
    ctx.fillStyle = '#475569';
    ctx.save();
    ctx.translate(22, chartTop + chartHeight / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillText('Triệu đồng', 0, 0);
    ctx.restore();

    // Đường kẻ trục trái
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(leftAxisX, chartTop - 10);
    ctx.lineTo(leftAxisX, chartBottom);
    ctx.lineTo(leftAxisX + leftChartWidth, chartBottom);
    ctx.stroke();

    const isBlankMonth = (chartType >= 1 && chartType <= 4) && (shortMonth === 'T12' || shortMonth === 'Tháng 12');

    // Chỉ hiện số mốc trên trục tung khi đã có data
    if (chartType >= 1 && chartType <= 4 && !isBlankMonth) {
      const ticks = [0, 100, 200, 300, 400, 500];
      setFont(10, 'normal');
      ctx.fillStyle = '#64748b';
      ctx.textAlign = 'right';
      ticks.forEach(tick => {
        const y = chartBottom - (tick / 500) * chartHeight;
        ctx.beginPath();
        ctx.moveTo(leftAxisX - 4, y);
        ctx.lineTo(leftAxisX, y);
        ctx.stroke();
        ctx.fillText(tick.toString(), leftAxisX - 8, y + 4);
      });
    }

    // Vẽ các cột bên trái
    const barWidth = 32;
    const barGap = 6;
    const leftXCenters = [120, 240, 360, 480];

    items.forEach((item, idx) => {
      const cx = leftXCenters[idx] || 120 + idx * 110;
      const hasV1 = item[valKey1] !== null && item[valKey1] !== undefined;
      const hasV2 = item[valKey2] !== null && item[valKey2] !== undefined;
      const v1 = hasV1 ? item[valKey1] : 0;
      const v2 = hasV2 ? item[valKey2] : 0;
      const h1 = (v1 / leftMax) * chartHeight;
      const h2 = (v2 / leftMax) * chartHeight;
      const y1 = chartBottom - h1;
      const y2 = chartBottom - h2;
      const rateY = (hasV1 && hasV2 ? Math.min(y1, y2) : (hasV1 ? y1 : y2)) - 24;

      if (!isBlankMonth) {
        // Nhãn tỷ lệ hoàn thành / tăng trưởng
        if (hasV1 && item.rate && item.rate !== '-') {
          setFont(12, 'bold');
          ctx.textAlign = 'center';
          ctx.fillStyle = item.isRatePositive ? '#16a34a' : '#d9383a';
          ctx.fillText(item.rate || '', cx, rateY);
        }

        // Cột 1 (TH)
        if (hasV1) {
          ctx.fillStyle = '#c8102e';
          ctx.fillRect(cx - barWidth - barGap / 2, y1, barWidth, h1);
          setFont(11, 'bold');
          ctx.fillStyle = '#1e293b';
          ctx.fillText(v1.toString().replace('.', ','), cx - barWidth / 2 - barGap / 2, y1 - 6);
        }

        // Cột 2 (KH / Kỳ trước)
        if (hasV2) {
          ctx.fillStyle = '#94a3b8';
          ctx.fillRect(cx + barGap / 2, y2, barWidth, h2);
          setFont(11, '600');
          ctx.fillStyle = '#64748b';
          ctx.fillText(v2.toString().replace('.', ','), cx + barWidth / 2 + barGap / 2, y2 - 6);
        }
      }

      // Tên danh mục bên dưới
      setFont(11.5, '600');
      ctx.fillStyle = '#1e293b';
      if (item.lines) {
        item.lines.forEach((line, lIdx) => {
          ctx.fillText(line, cx, chartBottom + 16 + lIdx * 14);
        });
      } else {
        ctx.fillText(item.name, cx, chartBottom + 16);
      }
    });

    if (isBlankMonth) {
      setFont(14, 'italic');
      ctx.fillStyle = '#94a3b8';
      ctx.textAlign = 'center';
      ctx.fillText('Chưa có số liệu', 300, chartBottom - chartHeight / 2);
    }

    // Trục Y phải: %
    setFont(12, 'bold');
    ctx.fillStyle = '#475569';
    ctx.save();
    ctx.translate(605, chartTop + chartHeight / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillText('%', 0, 0);
    ctx.restore();

    ctx.beginPath();
    ctx.moveTo(rightAxisX, chartTop - 10);
    ctx.lineTo(rightAxisX, chartBottom);
    ctx.lineTo(rightAxisX + rightChartWidth, chartBottom);
    ctx.stroke();

    const ratioItems = data.ratios || [];
    const rightMax = 100;
    const rightStep = 10;

    setFont(11, '500');
    ctx.textAlign = 'right';
    for (let tick = 0; tick <= rightMax; tick += rightStep) {
      const y = chartBottom - (tick / rightMax) * chartHeight;
      ctx.beginPath();
      ctx.moveTo(rightAxisX - 4, y);
      ctx.lineTo(rightAxisX, y);
      ctx.stroke();
      ctx.fillText(tick.toString(), rightAxisX - 8, y + 4);
    }

    // Vẽ các cột bên phải (Cơ cấu tỷ trọng)
    const rightXCenters = [720, 870];

    ratioItems.forEach((item, idx) => {
      const cx = rightXCenters[idx] || 720 + idx * 140;
      const hasV1 = item[valKey1] !== null && item[valKey1] !== undefined;
      const hasV2 = item[valKey2] !== null && item[valKey2] !== undefined;
      const v1 = hasV1 ? item[valKey1] : 0;
      const v2 = hasV2 ? item[valKey2] : 0;
      const h1 = (v1 / rightMax) * chartHeight;
      const h2 = (v2 / rightMax) * chartHeight;
      const y1 = chartBottom - h1;
      const y2 = chartBottom - h2;
      const diffY = (hasV1 && hasV2 ? Math.min(y1, y2) : (hasV1 ? y1 : y2)) - 24;

      if (!isBlankMonth) {
        // Nhãn chênh lệch điểm %
        if (hasV1 && item.diff && item.diff !== '-') {
          setFont(12, 'bold');
          ctx.textAlign = 'center';
          ctx.fillStyle = item.isDiffPositive ? '#16a34a' : '#d9383a';
          ctx.fillText(item.diff || '', cx, diffY);
        }

        // Cột 1 (TH)
        if (hasV1) {
          ctx.fillStyle = '#c8102e';
          ctx.fillRect(cx - barWidth - barGap / 2, y1, barWidth, h1);
          setFont(11, 'bold');
          ctx.fillStyle = '#1e293b';
          ctx.fillText(`${v1.toString().replace('.', ',')}%`, cx - barWidth / 2 - barGap / 2, y1 - 6);
        }

        // Cột 2 (KH / Kỳ trước)
        if (hasV2) {
          ctx.fillStyle = '#94a3b8';
          ctx.fillRect(cx + barGap / 2, y2, barWidth, h2);
          setFont(11, '600');
          ctx.fillStyle = '#64748b';
          ctx.fillText(`${v2.toString().replace('.', ',')}%`, cx + barWidth / 2 + barGap / 2, y2 - 6);
        }
      }

      // Tên danh mục bên dưới
      setFont(11.5, '600');
      ctx.fillStyle = '#1e293b';
      if (item.lines) {
        item.lines.forEach((line, lIdx) => {
          ctx.fillText(line, cx, chartBottom + 16 + lIdx * 14);
        });
      } else {
        ctx.fillText(item.name, cx, chartBottom + 16);
      }
    });

    if (isBlankMonth) {
      setFont(14, 'italic');
      ctx.fillStyle = '#94a3b8';
      ctx.textAlign = 'center';
      ctx.fillText('Chưa có số liệu', 795, chartBottom - chartHeight / 2);
    }

    return canvas.toDataURL('image/png');
  };

  // Helper: Chụp thẻ biểu đồ bằng html2canvas, fallback sang vẽ canvas thuần
  const captureCardImage = async (cardIndex, chartType, shortMonth, selectedYear, data) => {
    try {
      const cards = document.querySelectorAll('.month-chart-card, .month-row-grid, .trend-chart-card, .spdv-main-card');
      if (cards && cards[cardIndex]) {
        const canvas = await html2canvas(cards[cardIndex], {
          scale: 2,
          backgroundColor: '#ffffff',
          useCORS: true,
          logging: false
        });
        if (canvas && canvas.width > 0 && canvas.height > 0) {
          const dataUrl = canvas.toDataURL('image/png');
          if (dataUrl && dataUrl.length > 500) {
            return dataUrl;
          }
        }
      }
    } catch (err) {
      console.warn(`html2canvas capture card ${cardIndex} failed:`, err);
    }

    // Luôn có fallback canvas độ phân giải cao sẵn sàng
    return generateChartPngFallback(chartType, shortMonth, selectedYear, data);
  };

  // Helper: Đảm bảo thư viện ExcelJS đã được tải
  const getExcelJS = () => {
    const inst = (ExcelJS && ExcelJS.Workbook) ? ExcelJS : (window.ExcelJS && window.ExcelJS.Workbook ? window.ExcelJS : null);
    if (inst) return Promise.resolve(inst);
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = '/exceljs.min.js';
      script.onload = () => {
        if (window.ExcelJS) resolve(window.ExcelJS);
        else reject(new Error('ExcelJS not found'));
      };
      script.onerror = () => {
        const fallbackScript = document.createElement('script');
        fallbackScript.src = 'https://cdn.jsdelivr.net/npm/exceljs@4.4.0/dist/exceljs.min.js';
        fallbackScript.onload = () => resolve(window.ExcelJS);
        fallbackScript.onerror = reject;
        document.head.appendChild(fallbackScript);
      };
      document.head.appendChild(script);
    });
  };

  // Helper: Tạo ảnh PNG đơn lẻ cực nét cho từng biểu đồ Donut (Retina Canvas 2x)
  const generateSingleDonutPng = ({
    title,
    subtitle,
    tag,
    tagType = 'th',
    chart
  }) => {
    const canvas = document.createElement('canvas');
    const w = 1040; // logical 520 * 2
    const h = 780;  // logical 390 * 2
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');

    // Background white with smooth border
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.strokeRect(6, 6, w - 12, h - 12);

    // Scale 2x for crisp Retina display
    ctx.scale(2, 2);

    const setFont = (size, weight = 'normal') => {
      ctx.font = `${weight} ${size}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    };

    // 1. Header with indicator bar
    const barColor = tagType === 'th' ? '#2563eb' : '#e11d48';
    ctx.fillStyle = barColor;
    ctx.fillRect(16, 14, 4, 30);

    setFont(13, 'bold');
    ctx.fillStyle = '#0f172a';
    ctx.textAlign = 'left';
    ctx.fillText(title, 26, 26);

    if (subtitle) {
      setFont(11, '500');
      ctx.fillStyle = '#64748b';
      ctx.fillText(subtitle, 26, 40);
    }

    // Tag badge on top right
    if (tag) {
      setFont(10.5, '600');
      const tagTextWidth = ctx.measureText(tag).width;
      const badgeW = tagTextWidth + 14;
      const badgeH = 20;
      const badgeX = 520 - 16 - badgeW;
      const badgeY = 18;

      ctx.fillStyle = '#f1f5f9';
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 4);
      else ctx.rect(badgeX, badgeY, badgeW, badgeH);
      ctx.fill();

      ctx.fillStyle = '#475569';
      ctx.textAlign = 'center';
      ctx.fillText(tag, badgeX + badgeW / 2, badgeY + 14);
    }

    // Divider
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(16, 52);
    ctx.lineTo(504, 52);
    ctx.stroke();

    // 2. Donut Geometry
    const cx = 260;
    const cy = 160;
    const outerRadius = 82;
    const innerRadius = 48;
    const textRadius = (outerRadius + innerRadius) / 2;

    const slices = chart.slices || [];
    let curAngle = -Math.PI / 2;

    slices.forEach((slice) => {
      const sliceAngle = ((slice.percent || 0) / 100) * 2 * Math.PI;
      const endAngle = curAngle + sliceAngle;

      ctx.beginPath();
      ctx.arc(cx, cy, outerRadius, curAngle, endAngle);
      ctx.arc(cx, cy, innerRadius, endAngle, curAngle, true);
      ctx.closePath();
      ctx.fillStyle = slice.color;
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw % text if slice is wide enough
      if ((slice.percent || 0) >= 6) {
        const midA = curAngle + sliceAngle / 2;
        const tx = cx + textRadius * Math.cos(midA);
        const ty = cy + textRadius * Math.sin(midA);
        setFont(9.5, 'bold');
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(slice.formattedPercent || `${slice.percent}%`, tx, ty + 3.5);
      }

      curAngle = endAngle;
    });

    // Center total & unit
    setFont(15, 'bold');
    ctx.fillStyle = '#0f172a';
    ctx.textAlign = 'center';
    ctx.fillText(chart.formattedTotal || chart.total?.toString() || '0', cx, cy - 2);

    setFont(10, '600');
    ctx.fillStyle = '#64748b';
    ctx.fillText(chart.unit || 'Triệu đồng', cx, cy + 14);

    // 3. Legend at bottom
    const legTop = 264;
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(16, legTop - 6);
    ctx.lineTo(504, legTop - 6);
    ctx.stroke();

    if (slices.length <= 2) {
      const itemW = 230;
      slices.forEach((sl, idx) => {
        const lx = 30 + idx * (itemW + 10);
        const ly = legTop + 24;

        ctx.fillStyle = sl.color;
        ctx.fillRect(lx, ly, 14, 10);

        setFont(11, 'bold');
        ctx.fillStyle = '#334155';
        ctx.textAlign = 'left';
        ctx.fillText(sl.name, lx + 18, ly + 9);

        setFont(10, '500');
        ctx.fillStyle = '#64748b';
        ctx.fillText(`${sl.formattedPercent || sl.percent + '%'} (${sl.value || 0} ${chart.unit || ''})`, lx + 18, ly + 23);
      });
    } else {
      const cols = 2;
      const colW = 244;
      slices.forEach((sl, idx) => {
        const col = idx % cols;
        const row = Math.floor(idx / cols);
        const lx = 20 + col * colW;
        const ly = legTop + 6 + row * 34;

        ctx.fillStyle = sl.color;
        ctx.fillRect(lx, ly, 12, 10);

        setFont(10.5, 'bold');
        ctx.fillStyle = '#334155';
        ctx.textAlign = 'left';
        const truncatedName = sl.name.length > 25 ? sl.name.slice(0, 24) + '…' : sl.name;
        ctx.fillText(truncatedName, lx + 16, ly + 9);

        setFont(9.5, '500');
        ctx.fillStyle = '#64748b';
        ctx.fillText(`${sl.formattedPercent || sl.percent + '%'}  •  ${sl.value} ${chart.unit || ''}`, lx + 16, ly + 22);
      });
    }

    return canvas.toDataURL('image/png');
  };

  // Helper: Tạo 1 sheet độc lập có bảng chi tiết bên trái và biểu đồ bên phải cạnh nhau
  const addSideBySideDonutSheet = (workbook, {
    sheetName,
    mainTitle,
    chartTitle,
    periodText,
    chart,
    pngData
  }) => {
    const ws = workbook.addWorksheet(sheetName, { views: [{ showGridLines: true }] });

    const headerFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } };
    const secFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEBF3FA' } };
    const totalFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
    const thinBorder = {
      top: { style: 'thin', color: { argb: 'FFCBD5E1' } },
      left: { style: 'thin', color: { argb: 'FFCBD5E1' } },
      bottom: { style: 'thin', color: { argb: 'FFCBD5E1' } },
      right: { style: 'thin', color: { argb: 'FFCBD5E1' } }
    };

    // Header Titles
    ws.mergeCells('B2:E2');
    const t1 = ws.getCell('B2');
    t1.value = mainTitle;
    t1.font = { name: 'Arial', size: 12.5, bold: true, color: { argb: 'FF1E3A8A' } };

    ws.mergeCells('B3:E3');
    const t2 = ws.getCell('B3');
    t2.value = chartTitle;
    t2.font = { name: 'Arial', size: 11.5, bold: true, color: { argb: 'FF0F172A' } };

    ws.mergeCells('B4:E4');
    const t3 = ws.getCell('B4');
    t3.value = `Kỳ báo cáo: ${periodText}  |  Ngày xuất: ${new Date().toLocaleDateString('vi-VN')}  |  Đơn vị: Trung tâm Giải pháp`;
    t3.font = { name: 'Arial', size: 9, italic: true, color: { argb: 'FF64748B' } };

    // Section I Header (B6:E6) - Bảng số liệu chi tiết
    ws.mergeCells('B6:E6');
    const s1 = ws.getCell('B6');
    s1.value = `I. BẢNG SỐ LIỆU CHI TIẾT (Đơn vị: ${chart.unit || 'Triệu đồng'})`;
    s1.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FF1E40AF' } };
    s1.fill = secFill;
    s1.alignment = { vertical: 'middle', horizontal: 'left' };
    ws.getRow(6).height = 24;

    // Table Column Headers (Row 7: B7 to E7)
    const tableCols = [
      { label: 'STT', align: 'center', width: 7 },
      { label: 'Tên chỉ tiêu / Khoản mục', align: 'left', width: 34 },
      { label: 'Tỷ trọng (%)', align: 'right', width: 16 },
      { label: `Giá trị (${chart.unit || 'Tr.đ'})`, align: 'right', width: 22 }
    ];

    tableCols.forEach((c, idx) => {
      const cell = ws.getCell(7, idx + 2);
      cell.value = c.label;
      cell.font = { name: 'Arial', size: 9.5, bold: true, color: { argb: 'FF1E293B' } };
      cell.fill = headerFill;
      cell.border = thinBorder;
      cell.alignment = { vertical: 'middle', horizontal: c.align };
    });
    ws.getRow(7).height = 24;

    // Data Rows (Row 8 onwards)
    const slices = chart.slices || [];
    slices.forEach((slice, idx) => {
      const rowNum = 8 + idx;
      const rowValues = [
        idx + 1,
        slice.name,
        slice.formattedPercent || `${slice.percent}%`,
        typeof slice.value === 'number' ? slice.value.toString().replace('.', ',') : (slice.value || '0')
      ];

      rowValues.forEach((val, cIdx) => {
        const cell = ws.getCell(rowNum, cIdx + 2);
        cell.value = val;
        cell.font = { name: 'Arial', size: 9.5, bold: cIdx === 1 };
        cell.border = thinBorder;
        cell.alignment = {
          vertical: 'middle',
          horizontal: cIdx === 0 ? 'center' : (cIdx === 1 ? 'left' : 'right')
        };
      });
      ws.getRow(rowNum).height = 22;
    });

    // Total Row
    const totalRowNum = 8 + slices.length;
    const totalCells = [
      '',
      'TỔNG CỘNG',
      '100,0%',
      chart.formattedTotal || (typeof chart.total === 'number' ? chart.total.toString().replace('.', ',') : (chart.total || '0'))
    ];

    totalCells.forEach((val, cIdx) => {
      const cell = ws.getCell(totalRowNum, cIdx + 2);
      cell.value = val;
      cell.font = { name: 'Arial', size: 9.5, bold: true, color: { argb: 'FF1E3A8A' } };
      cell.fill = totalFill;
      cell.border = thinBorder;
      cell.alignment = {
        vertical: 'middle',
        horizontal: cIdx === 0 ? 'center' : (cIdx === 1 ? 'left' : 'right')
      };
    });
    ws.getRow(totalRowNum).height = 24;

    // Right Side: Section II & Visual Donut Chart (Columns G to L, BÊN CẠNH bảng chi tiết)
    ws.mergeCells('G6:L6');
    const s2 = ws.getCell('G6');
    s2.value = 'II. HÌNH ẢNH BIỂU ĐỒ TRỰC QUAN';
    s2.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FF1E40AF' } };
    s2.fill = secFill;
    s2.alignment = { vertical: 'middle', horizontal: 'center' };

    // Set Column widths
    ws.getColumn(1).width = 3;  // A (margin)
    ws.getColumn(2).width = 7;  // B (STT)
    ws.getColumn(3).width = 34; // C (Tên)
    ws.getColumn(4).width = 16; // D (Tỷ trọng)
    ws.getColumn(5).width = 22; // E (Giá trị)
    ws.getColumn(6).width = 4;  // F (Spacer ngăn cách giữa bảng và biểu đồ)
    ws.getColumn(7).width = 15; // G
    ws.getColumn(8).width = 15; // H
    ws.getColumn(9).width = 15; // I
    ws.getColumn(10).width = 15; // J
    ws.getColumn(11).width = 15; // K
    ws.getColumn(12).width = 15; // L

    // Embedded Image placed on columns G to L (Row 7 to 24)
    if (pngData) {
      const cleanBase64 = pngData.replace(/^data:image\/\w+;base64,/, '');
      const imageId = workbook.addImage({
        base64: cleanBase64,
        extension: 'png'
      });

      ws.addImage(imageId, {
        tl: { col: 6, row: 6 }, // Cell G7: Col G (index 6), Row 7 (index 6)
        ext: { width: 510, height: 390 }
      });
    }
  };

  // Export to Excel (kèm ảnh biểu đồ trên từng sheet)
  const handleExportExcel = async () => {
    try {
      if (currentView === 'month') {
        const monthNum = parseInt(selectedMonth.match(/\d+/)?.[0] || '8', 10);
        const shortMonth = `T${monthNum}`;
        const prevMonthNum = monthNum === 1 ? 12 : monthNum - 1;
        const prevShortMonth = `T${prevMonthNum}`;
        const prevYear = monthNum === 1 ? (parseInt(selectedYear, 10) - 1).toString() : selectedYear;
        const lastYear = (parseInt(selectedYear, 10) - 1).toString();
        const nextMonthNum = monthNum === 12 ? 1 : monthNum + 1;
        const nextShortMonth = `T${nextMonthNum}`;
        const nextYear = monthNum === 12 ? (parseInt(selectedYear, 10) + 1).toString() : selectedYear;

        const chart1Data = MONTHLY_PLAN_DATA[selectedMonth] || MONTHLY_PLAN_DATA['Tháng 8'];
        const chart2Data = MONTH_PREV_DATA[selectedMonth] || MONTH_PREV_DATA['Tháng 8'];
        const chart3Data = MONTH_LAST_YEAR_DATA[selectedMonth] || MONTH_LAST_YEAR_DATA['Tháng 8'];
        const chart4Data = MONTH_NEXT_PLAN_DATA[selectedMonth] || MONTH_NEXT_PLAN_DATA['Tháng 8'];

        const isBlankMonth = selectedMonth === 'Tháng 12' || Boolean(chart1Data?.isBlank);
        const fmt = (v) => (isBlankMonth || v === null || v === undefined ? '-' : v);
        const fmtPct = (v) => (isBlankMonth || v === null || v === undefined ? '-' : `${v}%`);
        const fmtDiff = (v1, v2) => (isBlankMonth || v1 === null || v1 === undefined || v2 === null || v2 === undefined ? '-' : Number((v1 - v2).toFixed(1)));
        const fmtRate = (r, v1) => (isBlankMonth || v1 === null || v1 === undefined || !r || r === '-' ? '-' : r);
        const fmtRatioDiff = (d, v1) => (isBlankMonth || v1 === null || v1 === undefined || !d || d === '-' ? '-' : d);

        const ALL_MONTH_CHARTS = [
          {
            key: 'c1',
            isVisible: monthVisibleMap.r1_val || monthVisibleMap.r1_rat,
            cardIndex: 0,
            chartType: 1,
            sheetName: 'BieuDo_1_TH_vs_KH',
            chartTitle: `Biểu đồ 1. Kết quả ${shortMonth}/${selectedYear} so với kế hoạch ${shortMonth}/${selectedYear}`,
            vHeader: ['STT', 'Chỉ tiêu doanh thu', 'ĐVT', `TH ${shortMonth}`, `KH ${shortMonth}`, 'Chênh lệch (TH - KH)', 'Tỷ lệ hoàn thành (%)'],
            vRows: chart1Data.values.map((item, idx) => [idx + 1, item.name, item.unit, fmt(item.th), fmt(item.kh), fmtDiff(item.th, item.kh), fmtRate(item.rate, item.th)]),
            rHeader: ['STT', 'Chỉ tiêu cơ cấu', 'ĐVT', `TH ${shortMonth}`, `KH ${shortMonth}`, 'Chênh lệch điểm %'],
            rRows: chart1Data.ratios.map((item, idx) => [idx + 1, item.name, item.unit, fmtPct(item.th), fmtPct(item.kh), fmtRatioDiff(item.diff, item.th)]),
            data: chart1Data
          },
          {
            key: 'c2',
            isVisible: monthVisibleMap.r2_val || monthVisibleMap.r2_rat,
            cardIndex: 1,
            chartType: 2,
            sheetName: 'BieuDo_2_TH_vs_T.Truoc',
            chartTitle: `Biểu đồ 2. Kết quả ${shortMonth}/${selectedYear} so với kết quả ${prevShortMonth}/${prevYear}`,
            vHeader: ['STT', 'Chỉ tiêu doanh thu', 'ĐVT', `Kỳ này (TH ${shortMonth})`, `Kỳ trước (TH ${prevShortMonth})`, 'Chênh lệch', 'Tăng trưởng (%)'],
            vRows: chart2Data.values.map((item, idx) => [idx + 1, item.name, item.unit, fmt(item.thCurrent), fmt(item.thPrev), fmtDiff(item.thCurrent, item.thPrev), fmtRate(item.rate, item.thCurrent)]),
            rHeader: ['STT', 'Chỉ tiêu cơ cấu', 'ĐVT', `Kỳ này (TH ${shortMonth})`, `Kỳ trước (TH ${prevShortMonth})`, 'Chênh lệch điểm %'],
            rRows: chart2Data.ratios.map((item, idx) => [idx + 1, item.name, item.unit, fmtPct(item.thCurrent), fmtPct(item.thPrev), fmtRatioDiff(item.diff, item.thCurrent)]),
            data: chart2Data
          },
          {
            key: 'c3',
            isVisible: monthVisibleMap.r3_val || monthVisibleMap.r3_rat,
            cardIndex: 2,
            chartType: 3,
            sheetName: 'BieuDo_3_TH_vs_CungKy',
            chartTitle: `Biểu đồ 3. Kết quả ${shortMonth}/${selectedYear} so với cùng kỳ ${shortMonth}/${lastYear}`,
            vHeader: ['STT', 'Chỉ tiêu doanh thu', 'ĐVT', `TH (${shortMonth}/${selectedYear})`, `Cùng kỳ (${shortMonth}/${lastYear})`, 'Chênh lệch', 'Tăng trưởng (%)'],
            vRows: chart3Data.values.map((item, idx) => [idx + 1, item.name, item.unit, fmt(item.thCurrent), fmt(item.thLastYear), fmtDiff(item.thCurrent, item.thLastYear), fmtRate(item.rate, item.thCurrent)]),
            rHeader: ['STT', 'Chỉ tiêu cơ cấu', 'ĐVT', `TH (${shortMonth}/${selectedYear})`, `Cùng kỳ (${shortMonth}/${lastYear})`, 'Chênh lệch điểm %'],
            rRows: chart3Data.ratios.map((item, idx) => [idx + 1, item.name, item.unit, fmtPct(item.thCurrent), fmtPct(item.thLastYear), fmtRatioDiff(item.diff, item.thCurrent)]),
            data: chart3Data
          },
          {
            key: 'c4',
            isVisible: monthVisibleMap.r4_val || monthVisibleMap.r4_rat,
            cardIndex: 3,
            chartType: 4,
            sheetName: 'BieuDo_4_TH_vs_KH.Sau',
            chartTitle: `Biểu đồ 4. Kết quả ${shortMonth}/${selectedYear} so với kế hoạch ${nextShortMonth}/${nextYear}`,
            vHeader: ['STT', 'Chỉ tiêu doanh thu', 'ĐVT', `TH (${shortMonth}/${selectedYear})`, `KH (${nextShortMonth}/${nextYear})`, 'Chênh lệch', 'Tỷ lệ KH sau (%)'],
            vRows: chart4Data.values.map((item, idx) => [idx + 1, item.name, item.unit, fmt(item.thCurrent), fmt(item.khNext), fmtDiff(item.thCurrent, item.khNext), fmtRate(item.rate, item.thCurrent)]),
            rHeader: ['STT', 'Chỉ tiêu cơ cấu', 'ĐVT', `TH (${shortMonth}/${selectedYear})`, `KH (${nextShortMonth}/${nextYear})`, 'Chênh lệch điểm %'],
            rRows: chart4Data.ratios.map((item, idx) => [idx + 1, item.name, item.unit, fmtPct(item.thCurrent), fmtPct(item.khNext), fmtRatioDiff(item.diff, item.thCurrent)]),
            data: chart4Data
          }
        ];

        // Lọc CHỈ biểu đồ không bị ẩn
        const activeCharts = ALL_MONTH_CHARTS.filter(c => c.isVisible);
        if (activeCharts.length === 0) {
          showToast('Vui lòng mở ít nhất 1 biểu đồ cần xuất báo cáo (hoặc bấm "Mở rộng tất cả")!');
          return;
        }

        showToast(`Đang chụp hình ảnh và xuất ${activeCharts.length} biểu đồ sang Excel...`);

        let excelJSSucceeded = false;
        try {
          const ExcelJS = await getExcelJS();
          if (ExcelJS) {
            const workbook = new ExcelJS.Workbook();
            workbook.creator = 'Lite ERP Viettel';
            workbook.created = new Date();

            const headerFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } };
            const secFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEBF3FA' } };
            const thinBorder = {
              top: { style: 'thin', color: { argb: 'FFCBD5E1' } },
              left: { style: 'thin', color: { argb: 'FFCBD5E1' } },
              bottom: { style: 'thin', color: { argb: 'FFCBD5E1' } },
              right: { style: 'thin', color: { argb: 'FFCBD5E1' } }
            };

            for (const item of activeCharts) {
              const png = await captureCardImage(item.cardIndex, item.chartType, shortMonth, selectedYear, item.data);
              const ws = workbook.addWorksheet(item.sheetName, { views: [{ showGridLines: true }] });

              // Header Titles
              ws.mergeCells('B2:H2');
              const t1 = ws.getCell('B2');
              t1.value = 'BÁO CÁO DOANH THU - PHÂN TÍCH THEO THÁNG';
              t1.font = { name: 'Arial', size: 12.5, bold: true, color: { argb: 'FF1E3A8A' } };

              ws.mergeCells('B3:H3');
              const t2 = ws.getCell('B3');
              t2.value = item.chartTitle;
              t2.font = { name: 'Arial', size: 11.5, bold: true, color: { argb: 'FF0F172A' } };

              ws.mergeCells('B4:H4');
              const t3 = ws.getCell('B4');
              t3.value = `Kỳ báo cáo: ${selectedMonth} / ${selectedYear}  |  Ngày xuất: ${new Date().toLocaleDateString('vi-VN')}  |  Đơn vị: Trung tâm Giải pháp`;
              t3.font = { name: 'Arial', size: 9, italic: true, color: { argb: 'FF64748B' } };

              // Section I
              ws.mergeCells('B6:H6');
              const s1 = ws.getCell('B6');
              s1.value = 'I. GIÁ TRỊ DOANH THU (Đơn vị: Triệu đồng)';
              s1.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FF1E40AF' } };
              s1.fill = secFill;
              ws.getRow(6).height = 24;

              // Table I Header
              item.vHeader.forEach((h, i) => {
                const c = ws.getCell(7, i + 2);
                c.value = h;
                c.font = { name: 'Arial', size: 9.5, bold: true, color: { argb: 'FF1E293B' } };
                c.fill = headerFill;
                c.border = thinBorder;
                c.alignment = { vertical: 'middle', horizontal: i === 1 ? 'left' : 'center' };
              });
              ws.getRow(7).height = 24;

              // Table I Data
              item.vRows.forEach((row, rIdx) => {
                row.forEach((val, cIdx) => {
                  const c = ws.getCell(8 + rIdx, cIdx + 2);
                  c.value = val;
                  c.font = { name: 'Arial', size: 9.5 };
                  c.border = thinBorder;
                  c.alignment = { vertical: 'middle', horizontal: cIdx === 1 ? 'left' : (cIdx === 0 ? 'center' : 'right') };
                });
                ws.getRow(8 + rIdx).height = 21;
              });

              const r2Start = 8 + item.vRows.length + 1;

              // Section II
              ws.mergeCells(`B${r2Start}:G${r2Start}`);
              const s2 = ws.getCell(`B${r2Start}`);
              s2.value = 'II. CƠ CẤU TỶ TRỌNG (Đơn vị: %)';
              s2.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FF1E40AF' } };
              s2.fill = secFill;
              ws.getRow(r2Start).height = 24;

              // Table II Header
              item.rHeader.forEach((h, i) => {
                const c = ws.getCell(r2Start + 1, i + 2);
                c.value = h;
                c.font = { name: 'Arial', size: 9.5, bold: true, color: { argb: 'FF1E293B' } };
                c.fill = headerFill;
                c.border = thinBorder;
                c.alignment = { vertical: 'middle', horizontal: i === 1 ? 'left' : 'center' };
              });
              ws.getRow(r2Start + 1).height = 24;

              // Table II Data
              item.rRows.forEach((row, rIdx) => {
                row.forEach((val, cIdx) => {
                  const c = ws.getCell(r2Start + 2 + rIdx, cIdx + 2);
                  c.value = val;
                  c.font = { name: 'Arial', size: 9.5 };
                  c.border = thinBorder;
                  c.alignment = { vertical: 'middle', horizontal: cIdx === 1 ? 'left' : (cIdx === 0 ? 'center' : 'right') };
                });
                ws.getRow(r2Start + 2 + rIdx).height = 21;
              });

              // Section III: HÌNH ẢNH BIỂU ĐỒ BÊN CẠNH BẢNG (Starting at column J)
              ws.mergeCells('J6:R6');
              const s3 = ws.getCell('J6');
              s3.value = 'III. HÌNH ẢNH BIỂU ĐỒ TRỰC QUAN';
              s3.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FF1E40AF' } };
              s3.fill = secFill;
              s3.alignment = { vertical: 'middle', horizontal: 'center' };

              if (png) {
                const rawBase64 = png.replace(/^data:image\/\w+;base64,/, '');
                const imageId = workbook.addImage({
                  base64: rawBase64,
                  extension: 'png'
                });
                ws.addImage(imageId, {
                  tl: { col: 9, row: 6 }, // Cell J7
                  ext: { width: 680, height: 380 }
                });
              }

              ws.columns = [
                { width: 3 },  // A
                { width: 6 },  // B
                { width: 28 }, // C
                { width: 12 }, // D
                { width: 18 }, // E
                { width: 18 }, // F
                { width: 20 }, // G
                { width: 20 }, // H
                { width: 4 },  // I
                { width: 15 }, // J
                { width: 15 }, // K
                { width: 15 }, // L
                { width: 15 }, // M
                { width: 15 }, // N
                { width: 15 }, // O
                { width: 15 }, // P
                { width: 15 }, // Q
                { width: 15 }  // R
              ];
            }

            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Bao_Cao_Doanh_Thu_Phan_Tich_Theo_Thang_${selectedYear}_${shortMonth}_(${activeCharts.length}_Bieu_Do).xlsx`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            showToast(`Đã xuất ${activeCharts.length} biểu đồ sang ${activeCharts.length} sheet Excel (kèm bảng chi tiết bên cạnh) thành công!`);
            excelJSSucceeded = true;
          }
        } catch (excelErr) {
          console.warn('ExcelJS failed, falling back to XLSX:', excelErr);
        }

        // Fallback: nếu ExcelJS không khả dụng, xuất bảng số liệu qua XLSX
        if (!excelJSSucceeded) {
          const wb = XLSX.utils.book_new();
          for (const item of activeCharts) {
            const sheetRows = [
              ['BÁO CÁO DOANH THU - PHÂN TÍCH THEO THÁNG'],
              [item.chartTitle],
              [`Kỳ báo cáo: ${selectedMonth} năm ${selectedYear}`, `Thời gian xuất: ${new Date().toLocaleDateString('vi-VN')}`],
              [],
              ['I. GIÁ TRỊ DOANH THU (Đơn vị: Triệu đồng)'],
              item.vHeader,
              ...item.vRows,
              [],
              ['II. CƠ CẤU TỶ TRỌNG (Đơn vị: %)'],
              item.rHeader,
              ...item.rRows
            ];
            const ws = XLSX.utils.aoa_to_sheet(sheetRows);
            ws['!cols'] = [{ wch: 6 }, { wch: 30 }, { wch: 12 }, { wch: 20 }, { wch: 20 }, { wch: 22 }, { wch: 22 }];
            XLSX.utils.book_append_sheet(wb, ws, item.sheetName.slice(0, 31));
          }
          XLSX.writeFile(wb, `Bao_Cao_Doanh_Thu_Phan_Tich_Theo_Thang_${selectedYear}_${shortMonth}_(${activeCharts.length}_Bieu_Do).xlsx`);
          showToast(`Đã xuất Excel: ${activeCharts.length} biểu đồ (${activeCharts.length} Sheet) thành công!`);
        }
      } else if (currentView === 'quarter') {
        const quarterData5 = QUARTER_CUMULATIVE_DATA[selectedQuarter] || QUARTER_CUMULATIVE_DATA['Quý III'];
        const quarterData6 = QUARTER_ESTIMATE_DATA[selectedQuarter] || QUARTER_ESTIMATE_DATA['Quý III'];
        const quarterData7 = QUARTER_PREV_DATA[selectedQuarter] || QUARTER_PREV_DATA['Quý III'];
        const quarterData8 = QUARTER_SAME_PERIOD_DATA[selectedQuarter] || QUARTER_SAME_PERIOD_DATA['Quý III'];
        const qCode = quarterData5.quarterCode || 'Q3';
        const prevQName = quarterData7.prevQuarterName || 'Quý II';
        const prevYear = selectedQuarter === 'Quý I' ? (parseInt(selectedYear, 10) - 1).toString() : selectedYear;
        const prevYearNum = (parseInt(selectedYear, 10) - 1).toString();

        const ALL_QUARTER_CHARTS = [
          {
            key: 'c5',
            isVisible: quarterVisibleMap.r1_val || quarterVisibleMap.r1_rat,
            cardIndex: 0,
            chartType: 5,
            sheetName: 'BieuDo_5_LK_vs_KH_Quy',
            chartTitle: `Biểu đồ 5. Lũy kế ${selectedQuarter}/${selectedYear} so với kế hoạch ${selectedQuarter}`,
            vHeader: ['STT', 'Chỉ tiêu', 'ĐVT', `Lũy kế (${qCode})`, `Kế hoạch (${qCode})`, 'Chênh lệch (LK - KH)', 'Tỷ lệ hoàn thành (%)'],
            vRows: quarterData5.values.map((item, idx) => [idx + 1, item.name, item.unit, item.lk, item.kh, Number((item.lk - item.kh).toFixed(1)), item.rate]),
            rHeader: ['STT', 'Chỉ tiêu cơ cấu', 'ĐVT', `Lũy kế (${qCode})`, `Kế hoạch (${qCode})`, 'Chênh lệch điểm %'],
            rRows: quarterData5.ratios.map((item, idx) => [idx + 1, item.name, item.unit, `${item.lk}%`, `${item.kh}%`, item.diff]),
            data: quarterData5
          },
          {
            key: 'c6',
            isVisible: quarterVisibleMap.r2_val || quarterVisibleMap.r2_rat,
            cardIndex: 1,
            chartType: 6,
            sheetName: 'BieuDo_6_Uoc_vs_KH_Quy',
            chartTitle: `Biểu đồ 6. Ước kết quả ${selectedQuarter}/${selectedYear} so với kế hoạch ${selectedQuarter}`,
            vHeader: ['STT', 'Chỉ tiêu', 'ĐVT', `Ước (${selectedQuarter})`, `Kế hoạch (${selectedQuarter})`, 'Chênh lệch (Ước - KH)', 'Tỷ lệ hoàn thành (%)'],
            vRows: quarterData6.values.map((item, idx) => [idx + 1, item.name, item.unit, item.uoc, item.kh, Number((item.uoc - item.kh).toFixed(1)), item.rate]),
            rHeader: ['STT', 'Chỉ tiêu cơ cấu', 'ĐVT', `Ước (${selectedQuarter})`, `Kế hoạch (${selectedQuarter})`, 'Chênh lệch điểm %'],
            rRows: quarterData6.ratios.map((item, idx) => [idx + 1, item.name, item.unit, `${item.uoc}%`, `${item.kh}%`, item.diff]),
            data: quarterData6
          },
          {
            key: 'c7',
            isVisible: quarterVisibleMap.r3_val || quarterVisibleMap.r3_rat,
            cardIndex: 2,
            chartType: 7,
            sheetName: 'BieuDo_7_Uoc_vs_TH_Q.Truoc',
            chartTitle: `Biểu đồ 7. Ước kết quả ${selectedQuarter}/${selectedYear} so với kết quả ${prevQName}/${prevYear}`,
            vHeader: ['STT', 'Chỉ tiêu', 'ĐVT', `Ước (${selectedQuarter})`, `Thực hiện (${prevQName})`, 'Chênh lệch (Ước - TH trước)', 'Tỷ lệ so với TH trước (%)'],
            vRows: quarterData7.values.map((item, idx) => [idx + 1, item.name, item.unit, item.uoc, item.thPrev, Number((item.uoc - item.thPrev).toFixed(1)), item.rate]),
            rHeader: ['STT', 'Chỉ tiêu cơ cấu', 'ĐVT', `Ước (${selectedQuarter})`, `Thực hiện (${prevQName})`, 'Chênh lệch điểm %'],
            rRows: quarterData7.ratios.map((item, idx) => [idx + 1, item.name, item.unit, `${item.uoc}%`, `${item.thPrev}%`, item.diff]),
            data: quarterData7
          },
          {
            key: 'c8',
            isVisible: quarterVisibleMap.r4_val || quarterVisibleMap.r4_rat,
            cardIndex: 3,
            chartType: 8,
            sheetName: 'BieuDo_8_Uoc_vs_CungKy',
            chartTitle: `Biểu đồ 8. Ước kết quả ${selectedQuarter}/${selectedYear} so với cùng kỳ ${selectedQuarter}/${prevYearNum}`,
            vHeader: ['STT', 'Chỉ tiêu', 'ĐVT', `Ước (${selectedQuarter})`, `Cùng kỳ (${prevYearNum})`, 'Chênh lệch (Ước - Cùng kỳ)', 'Tỷ lệ so với cùng kỳ (%)'],
            vRows: quarterData8.values.map((item, idx) => [idx + 1, item.name, item.unit, item.uoc, item.thSamePeriod, Number((item.uoc - item.thSamePeriod).toFixed(1)), item.rate]),
            rHeader: ['STT', 'Chỉ tiêu cơ cấu', 'ĐVT', `Ước (${selectedQuarter})`, `Cùng kỳ (${prevYearNum})`, 'Chênh lệch điểm %'],
            rRows: quarterData8.ratios.map((item, idx) => [idx + 1, item.name, item.unit, `${item.uoc}%`, `${item.thSamePeriod}%`, item.diff]),
            data: quarterData8
          }
        ];

        const activeCharts = ALL_QUARTER_CHARTS.filter(c => c.isVisible);
        if (activeCharts.length === 0) {
          showToast('Vui lòng mở ít nhất 1 biểu đồ cần xuất báo cáo (hoặc bấm "Mở rộng tất cả")!');
          return;
        }

        showToast(`Đang chụp hình ảnh và xuất ${activeCharts.length} biểu đồ Quý sang Excel...`);

        let excelJSSucceeded = false;
        try {
          const ExcelJS = await getExcelJS();
          if (ExcelJS) {
            const workbook = new ExcelJS.Workbook();
            workbook.creator = 'Lite ERP Viettel';
            workbook.created = new Date();

            const headerFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } };
            const secFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEBF3FA' } };
            const thinBorder = {
              top: { style: 'thin', color: { argb: 'FFCBD5E1' } },
              left: { style: 'thin', color: { argb: 'FFCBD5E1' } },
              bottom: { style: 'thin', color: { argb: 'FFCBD5E1' } },
              right: { style: 'thin', color: { argb: 'FFCBD5E1' } }
            };

            for (const item of activeCharts) {
              const png = await captureCardImage(item.cardIndex, item.chartType, selectedQuarter, selectedYear, item.data);
              const ws = workbook.addWorksheet(item.sheetName, { views: [{ showGridLines: true }] });

              // Title
              ws.mergeCells('B2:H2');
              const t1 = ws.getCell('B2');
              t1.value = 'BÁO CÁO DOANH THU - PHÂN TÍCH THEO QUÝ';
              t1.font = { name: 'Arial', size: 12.5, bold: true, color: { argb: 'FF1E3A8A' } };

              ws.mergeCells('B3:H3');
              const t2 = ws.getCell('B3');
              t2.value = item.chartTitle;
              t2.font = { name: 'Arial', size: 11.5, bold: true, color: { argb: 'FF0F172A' } };

              ws.mergeCells('B4:H4');
              const t3 = ws.getCell('B4');
              t3.value = `Kỳ báo cáo: ${selectedQuarter} / ${selectedYear}  |  Ngày xuất: ${new Date().toLocaleDateString('vi-VN')}  |  Đơn vị: Trung tâm Giải pháp`;
              t3.font = { name: 'Arial', size: 9, italic: true, color: { argb: 'FF64748B' } };

              // Section I
              ws.mergeCells('B6:H6');
              const s1 = ws.getCell('B6');
              s1.value = 'I. GIÁ TRỊ DOANH THU & LỢI NHUẬN (Đơn vị: Triệu đồng)';
              s1.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FF1E40AF' } };
              s1.fill = secFill;
              ws.getRow(6).height = 24;

              // Table I Header
              item.vHeader.forEach((h, i) => {
                const cell = ws.getCell(7, i + 2);
                cell.value = h;
                cell.font = { name: 'Arial', size: 9.5, bold: true, color: { argb: 'FF1E293B' } };
                cell.fill = headerFill;
                cell.alignment = { horizontal: i === 1 ? 'left' : 'center', vertical: 'middle', wrapText: true };
                cell.border = thinBorder;
              });
              ws.getRow(7).height = 24;

              // Table I Rows
              item.vRows.forEach((row, rIdx) => {
                const rowNum = 8 + rIdx;
                row.forEach((val, cIdx) => {
                  const cell = ws.getCell(rowNum, cIdx + 2);
                  cell.value = val;
                  cell.font = { name: 'Arial', size: 9.5, bold: cIdx === 1 };
                  cell.alignment = { horizontal: cIdx === 1 ? 'left' : (cIdx >= 3 ? 'right' : 'center'), vertical: 'middle' };
                  cell.border = thinBorder;
                });
                ws.getRow(rowNum).height = 21;
              });

              // Section II
              const sec2StartRow = 8 + item.vRows.length + 1;
              ws.mergeCells(`B${sec2StartRow}:G${sec2StartRow}`);
              const s2 = ws.getCell(`B${sec2StartRow}`);
              s2.value = 'II. CƠ CẤU TỶ TRỌNG (Đơn vị: %)';
              s2.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FF1E40AF' } };
              s2.fill = secFill;
              ws.getRow(sec2StartRow).height = 24;

              // Table II Header
              const rHeaderRow = sec2StartRow + 1;
              item.rHeader.forEach((h, i) => {
                const cell = ws.getCell(rHeaderRow, i + 2);
                cell.value = h;
                cell.font = { name: 'Arial', size: 9.5, bold: true, color: { argb: 'FF1E293B' } };
                cell.fill = headerFill;
                cell.alignment = { horizontal: i === 1 ? 'left' : 'center', vertical: 'middle', wrapText: true };
                cell.border = thinBorder;
              });
              ws.getRow(rHeaderRow).height = 24;

              // Table II Rows
              item.rRows.forEach((row, rIdx) => {
                const rowNum = rHeaderRow + 1 + rIdx;
                row.forEach((val, cIdx) => {
                  const cell = ws.getCell(rowNum, cIdx + 2);
                  cell.value = val;
                  cell.font = { name: 'Arial', size: 9.5, bold: cIdx === 1 };
                  cell.alignment = { horizontal: cIdx === 1 ? 'left' : (cIdx >= 3 ? 'right' : 'center'), vertical: 'middle' };
                  cell.border = thinBorder;
                });
                ws.getRow(rowNum).height = 21;
              });

              // Section III: HÌNH ẢNH BIỂU ĐỒ BÊN CẠNH BẢNG (Col J to R, starting row 6)
              ws.mergeCells('J6:R6');
              const s3 = ws.getCell('J6');
              s3.value = 'III. HÌNH ẢNH BIỂU ĐỒ TRỰC QUAN';
              s3.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FF1E40AF' } };
              s3.fill = secFill;
              s3.alignment = { vertical: 'middle', horizontal: 'center' };

              if (png) {
                const cleanBase64 = png.replace(/^data:image\/\w+;base64,/, '');
                const imageId = workbook.addImage({
                  base64: cleanBase64,
                  extension: 'png'
                });
                ws.addImage(imageId, {
                  tl: { col: 9, row: 6 }, // Cell J7
                  ext: { width: 680, height: 380 }
                });
              }

              // Column widths
              ws.getColumn(1).width = 3;  // A
              ws.getColumn(2).width = 6;  // B (STT)
              ws.getColumn(3).width = 28; // C (Chỉ tiêu)
              ws.getColumn(4).width = 10; // D (ĐVT)
              ws.getColumn(5).width = 16; // E
              ws.getColumn(6).width = 16; // F
              ws.getColumn(7).width = 20; // G
              ws.getColumn(8).width = 20; // H
              ws.getColumn(9).width = 4;  // I (Spacer)
              for (let col = 10; col <= 18; col++) {
                ws.getColumn(col).width = 11;
              }
            }

            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Bao_Cao_Doanh_Thu_Phan_Tich_Theo_Quy_${selectedYear}_${qCode}_(${activeCharts.length}_Bieu_Do).xlsx`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            showToast(`Đã xuất ${activeCharts.length} biểu đồ sang ${activeCharts.length} sheet Excel (kèm bảng chi tiết bên cạnh) thành công!`);
            excelJSSucceeded = true;
          }
        } catch (excelErr) {
          console.warn('ExcelJS quarter export failed, falling back to XLSX:', excelErr);
        }

        if (!excelJSSucceeded) {
          const wb = XLSX.utils.book_new();
          for (const item of activeCharts) {
            const sheetRows = [
              ['BÁO CÁO DOANH THU - PHÂN TÍCH THEO QUÝ'],
              [item.chartTitle],
              [`Kỳ báo cáo: ${selectedQuarter} năm ${selectedYear}`, `Thời gian xuất: ${new Date().toLocaleDateString('vi-VN')}`],
              [],
              ['I. GIÁ TRỊ DOANH THU & LỢI NHUẬN (Đơn vị: Triệu đồng)'],
              item.vHeader,
              ...item.vRows,
              [],
              ['II. CƠ CẤU TỶ TRỌNG (Đơn vị: %)'],
              item.rHeader,
              ...item.rRows
            ];
            const ws = XLSX.utils.aoa_to_sheet(sheetRows);
            ws['!cols'] = [{ wch: 6 }, { wch: 32 }, { wch: 14 }, { wch: 24 }, { wch: 24 }, { wch: 24 }, { wch: 24 }];
            XLSX.utils.book_append_sheet(wb, ws, item.sheetName.slice(0, 31));
          }
          XLSX.writeFile(wb, `Bao_Cao_Doanh_Thu_Phan_Tich_Theo_Quy_${selectedYear}_${qCode}_(${activeCharts.length}_Bieu_Do).xlsx`);
          showToast(`Đã xuất Excel: ${activeCharts.length} biểu đồ (${activeCharts.length} Sheet) thành công!`);
        }
      } else if (currentView === 'year') {
        const currentYearData = YEAR_CUMULATIVE_DATA[selectedCumulativeMonth] || YEAR_CUMULATIVE_DATA['Lũy kế 8 tháng'];
        const currentPlanFullData = YEAR_PLAN_FULL_DATA[selectedCumulativeMonth] || YEAR_PLAN_FULL_DATA['Lũy kế 8 tháng'];
        const shortCode = currentYearData.shortCode || '8T';
        const monthText = currentYearData.monthText || '8 tháng';

        const ALL_YEAR_CHARTS = [
          {
            key: 'c10',
            isVisible: yearVisibleCards.c10Val || yearVisibleCards.c10Rat,
            cardIndex: 0,
            chartType: 10,
            sheetName: 'BieuDo_10_LK_vs_KH_LK',
            chartTitle: `Biểu đồ 10. Lũy kế năm ${selectedYear} so với kế hoạch lũy kế năm ${selectedYear}`,
            vHeader: ['STT', 'Chỉ tiêu doanh thu', 'ĐVT', `Lũy kế (${shortCode})`, `Kế hoạch (${shortCode})`, 'Chênh lệch (LK - KH)', 'Tỷ lệ hoàn thành (%)'],
            vRows: currentYearData.values.map((item, idx) => [idx + 1, item.name, item.unit, item.lk, item.kh, Number((item.lk - item.kh).toFixed(1)), item.rate]),
            rHeader: ['STT', 'Chỉ tiêu cơ cấu', 'ĐVT', `Lũy kế (${shortCode})`, `Kế hoạch (${shortCode})`, 'Chênh lệch điểm %'],
            rRows: currentYearData.ratios.map((item, idx) => [idx + 1, item.name, item.unit, `${item.lk}%`, `${item.kh}%`, item.diff]),
            data: currentYearData
          },
          {
            key: 'c11',
            isVisible: yearVisibleCards.c11Val || yearVisibleCards.c11Rat,
            cardIndex: 1,
            chartType: 11,
            sheetName: 'BieuDo_11_LK_vs_KH_Nam',
            chartTitle: `Biểu đồ 11. Lũy kế năm ${selectedYear} so với kế hoạch cả năm ${selectedYear}`,
            vHeader: ['STT', 'Chỉ tiêu', 'ĐVT', `Lũy kế (${shortCode})`, 'Kế hoạch năm', 'Chênh lệch (LK - KH)', 'Tỷ lệ hoàn thành (%)'],
            vRows: currentPlanFullData.values.map((item, idx) => [idx + 1, item.name, item.unit, item.lk, item.khYear, Number((item.lk - item.khYear).toFixed(1)), item.rate]),
            rHeader: ['STT', 'Chỉ tiêu', 'ĐVT', `Lũy kế (${shortCode})`, 'Kế hoạch năm', 'Chênh lệch điểm %'],
            rRows: currentPlanFullData.ratios.map((item, idx) => [idx + 1, item.name, item.unit, `${item.lk}%`, `${item.khYear}%`, item.diff]),
            data: currentPlanFullData
          }
        ];

        const activeCharts = ALL_YEAR_CHARTS.filter(c => c.isVisible);
        if (activeCharts.length === 0) {
          showToast('Vui lòng mở ít nhất 1 biểu đồ cần xuất báo cáo (hoặc bấm "Mở rộng tất cả")!');
          return;
        }

        showToast(`Đang chụp hình ảnh và xuất ${activeCharts.length} biểu đồ Năm sang Excel...`);

        let excelJSSucceeded = false;
        try {
          const ExcelJS = await getExcelJS();
          if (ExcelJS) {
            const workbook = new ExcelJS.Workbook();
            workbook.creator = 'Lite ERP Viettel';
            workbook.created = new Date();

            const headerFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } };
            const secFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEBF3FA' } };
            const thinBorder = {
              top: { style: 'thin', color: { argb: 'FFCBD5E1' } },
              left: { style: 'thin', color: { argb: 'FFCBD5E1' } },
              bottom: { style: 'thin', color: { argb: 'FFCBD5E1' } },
              right: { style: 'thin', color: { argb: 'FFCBD5E1' } }
            };

            for (const item of activeCharts) {
              const png = await captureCardImage(item.cardIndex, item.chartType, selectedCumulativeMonth, selectedYear, item.data);
              const ws = workbook.addWorksheet(item.sheetName, { views: [{ showGridLines: true }] });

              // Title
              ws.mergeCells('B2:H2');
              const t1 = ws.getCell('B2');
              t1.value = 'BÁO CÁO DOANH THU - PHÂN TÍCH THEO NĂM';
              t1.font = { name: 'Arial', size: 12.5, bold: true, color: { argb: 'FF1E3A8A' } };

              ws.mergeCells('B3:H3');
              const t2 = ws.getCell('B3');
              t2.value = item.chartTitle;
              t2.font = { name: 'Arial', size: 11.5, bold: true, color: { argb: 'FF0F172A' } };

              ws.mergeCells('B4:H4');
              const t3 = ws.getCell('B4');
              t3.value = `Kỳ báo cáo: ${selectedCumulativeMonth} năm ${selectedYear}  |  Ngày xuất: ${new Date().toLocaleDateString('vi-VN')}  |  Đơn vị: Trung tâm Giải pháp`;
              t3.font = { name: 'Arial', size: 9, italic: true, color: { argb: 'FF64748B' } };

              // Section I
              ws.mergeCells('B6:H6');
              const s1 = ws.getCell('B6');
              s1.value = 'I. GIÁ TRỊ DOANH THU LŨY KẾ (Đơn vị: Triệu đồng)';
              s1.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FF1E40AF' } };
              s1.fill = secFill;
              ws.getRow(6).height = 24;

              // Table I Header
              item.vHeader.forEach((h, i) => {
                const cell = ws.getCell(7, i + 2);
                cell.value = h;
                cell.font = { name: 'Arial', size: 9.5, bold: true, color: { argb: 'FF1E293B' } };
                cell.fill = headerFill;
                cell.alignment = { horizontal: i === 1 ? 'left' : 'center', vertical: 'middle', wrapText: true };
                cell.border = thinBorder;
              });
              ws.getRow(7).height = 24;

              // Table I Rows
              item.vRows.forEach((row, rIdx) => {
                const rowNum = 8 + rIdx;
                row.forEach((val, cIdx) => {
                  const cell = ws.getCell(rowNum, cIdx + 2);
                  cell.value = val;
                  cell.font = { name: 'Arial', size: 9.5, bold: cIdx === 1 };
                  cell.alignment = { horizontal: cIdx === 1 ? 'left' : (cIdx >= 3 ? 'right' : 'center'), vertical: 'middle' };
                  cell.border = thinBorder;
                });
                ws.getRow(rowNum).height = 21;
              });

              // Section II
              const sec2StartRow = 8 + item.vRows.length + 1;
              ws.mergeCells(`B${sec2StartRow}:G${sec2StartRow}`);
              const s2 = ws.getCell(`B${sec2StartRow}`);
              s2.value = 'II. CƠ CẤU TỶ TRỌNG (Đơn vị: %)';
              s2.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FF1E40AF' } };
              s2.fill = secFill;
              ws.getRow(sec2StartRow).height = 24;

              // Table II Header
              const rHeaderRow = sec2StartRow + 1;
              item.rHeader.forEach((h, i) => {
                const cell = ws.getCell(rHeaderRow, i + 2);
                cell.value = h;
                cell.font = { name: 'Arial', size: 9.5, bold: true, color: { argb: 'FF1E293B' } };
                cell.fill = headerFill;
                cell.alignment = { horizontal: i === 1 ? 'left' : 'center', vertical: 'middle', wrapText: true };
                cell.border = thinBorder;
              });
              ws.getRow(rHeaderRow).height = 24;

              // Table II Rows
              item.rRows.forEach((row, rIdx) => {
                const rowNum = rHeaderRow + 1 + rIdx;
                row.forEach((val, cIdx) => {
                  const cell = ws.getCell(rowNum, cIdx + 2);
                  cell.value = val;
                  cell.font = { name: 'Arial', size: 9.5, bold: cIdx === 1 };
                  cell.alignment = { horizontal: cIdx === 1 ? 'left' : (cIdx >= 3 ? 'right' : 'center'), vertical: 'middle' };
                  cell.border = thinBorder;
                });
                ws.getRow(rowNum).height = 21;
              });

              // Section III: HÌNH ẢNH BIỂU ĐỒ BÊN CẠNH BẢNG (Col J to R, starting row 6)
              ws.mergeCells('J6:R6');
              const s3 = ws.getCell('J6');
              s3.value = 'III. HÌNH ẢNH BIỂU ĐỒ TRỰC QUAN';
              s3.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FF1E40AF' } };
              s3.fill = secFill;
              s3.alignment = { vertical: 'middle', horizontal: 'center' };

              if (png) {
                const cleanBase64 = png.replace(/^data:image\/\w+;base64,/, '');
                const imageId = workbook.addImage({
                  base64: cleanBase64,
                  extension: 'png'
                });
                ws.addImage(imageId, {
                  tl: { col: 9, row: 6 }, // Cell J7
                  ext: { width: 680, height: 380 }
                });
              }

              // Column widths
              ws.getColumn(1).width = 3;  // A
              ws.getColumn(2).width = 6;  // B (STT)
              ws.getColumn(3).width = 28; // C (Chỉ tiêu)
              ws.getColumn(4).width = 10; // D (ĐVT)
              ws.getColumn(5).width = 16; // E
              ws.getColumn(6).width = 16; // F
              ws.getColumn(7).width = 20; // G
              ws.getColumn(8).width = 20; // H
              ws.getColumn(9).width = 4;  // I (Spacer)
              for (let col = 10; col <= 18; col++) {
                ws.getColumn(col).width = 11;
              }
            }

            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Bao_Cao_Doanh_Thu_Phan_Tich_Theo_Nam_${selectedYear}_${shortCode}_(${activeCharts.length}_Bieu_Do).xlsx`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            showToast(`Đã xuất ${activeCharts.length} biểu đồ sang ${activeCharts.length} sheet Excel (kèm bảng chi tiết bên cạnh) thành công!`);
            excelJSSucceeded = true;
          }
        } catch (excelErr) {
          console.warn('ExcelJS year export failed, falling back to XLSX:', excelErr);
        }

        if (!excelJSSucceeded) {
          const wb = XLSX.utils.book_new();
          for (const item of activeCharts) {
            const sheetRows = [
              ['BÁO CÁO DOANH THU - PHÂN TÍCH THEO NĂM'],
              [item.chartTitle],
              [`Kỳ báo cáo: ${selectedCumulativeMonth} năm ${selectedYear}`, `Thời gian xuất: ${new Date().toLocaleDateString('vi-VN')}`],
              [],
              ['I. GIÁ TRỊ DOANH THU (Đơn vị: Triệu đồng)'],
              item.vHeader,
              ...item.vRows,
              [],
              ['II. CƠ CẤU TỶ TRỌNG (Đơn vị: %)'],
              item.rHeader,
              ...item.rRows
            ];
            const ws = XLSX.utils.aoa_to_sheet(sheetRows);
            ws['!cols'] = [{ wch: 6 }, { wch: 32 }, { wch: 14 }, { wch: 24 }, { wch: 24 }, { wch: 24 }, { wch: 24 }];
            XLSX.utils.book_append_sheet(wb, ws, item.sheetName.slice(0, 31));
          }
          XLSX.writeFile(wb, `Bao_Cao_Doanh_Thu_Phan_Tich_Theo_Nam_${selectedYear}_${shortCode}_(${activeCharts.length}_Bieu_Do).xlsx`);
          showToast(`Đã xuất Excel: ${activeCharts.length} biểu đồ (${activeCharts.length} Sheet) thành công!`);
        }
      } else if (currentView === 'trend') {
        showToast('Đang tạo báo cáo Xu hướng 12 tháng và chụp hình ảnh biểu đồ 14...');
        const trendData = MONTH_TREND_DATA[selectedYear] || MONTH_TREND_DATA['2026'];
        const prevYear = (parseInt(selectedYear, 10) - 1).toString();

        // 1. Chụp ảnh Biểu đồ 14
        const img14 = await captureCardImage(0, 14, '12T', selectedYear, trendData);

        // 2. Dùng ExcelJS để nhúng ảnh biểu đồ vào sheet
        let excelJSSucceeded = false;
        try {
          const ExcelJS = await getExcelJS();
          if (ExcelJS) {
            const workbook = new ExcelJS.Workbook();
            workbook.creator = 'Lite ERP Viettel';
            workbook.created = new Date();

            const ws = workbook.addWorksheet('BieuDo_14_XuHuong_DT_12Thang', { views: [{ showGridLines: true }] });

            const headerFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } };
            const secFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEBF3FA' } };
            const thinBorder = {
              top: { style: 'thin', color: { argb: 'FFCBD5E1' } },
              left: { style: 'thin', color: { argb: 'FFCBD5E1' } },
              bottom: { style: 'thin', color: { argb: 'FFCBD5E1' } },
              right: { style: 'thin', color: { argb: 'FFCBD5E1' } }
            };

            // Title
            ws.mergeCells('B2:H2');
            const t1 = ws.getCell('B2');
            t1.value = 'BÁO CÁO DOANH THU - XU HƯỚNG THEO THỜI GIAN';
            t1.font = { name: 'Arial', size: 13, bold: true, color: { argb: 'FF1E3A8A' } };

            ws.mergeCells('B3:H3');
            const t2 = ws.getCell('B3');
            t2.value = `Biểu đồ 14. Xu hướng tổng doanh thu từng tháng năm ${selectedYear} so với năm ${prevYear}`;
            t2.font = { name: 'Arial', size: 12, bold: true, color: { argb: 'FF0F172A' } };

            ws.mergeCells('B4:H4');
            const t3 = ws.getCell('B4');
            t3.value = `Kỳ báo cáo: 12 Tháng năm ${selectedYear}  |  Ngày xuất: ${new Date().toLocaleDateString('vi-VN')}  |  Đơn vị tính: Triệu đồng`;
            t3.font = { name: 'Arial', size: 9.5, italic: true, color: { argb: 'FF64748B' } };

            // Section I
            ws.mergeCells('B6:H6');
            const s1 = ws.getCell('B6');
            s1.value = `I. BẢNG XU HƯỚNG DOANH THU TỪNG THÁNG NĂM ${selectedYear} SO VỚI NĂM ${prevYear} (Đơn vị: Triệu đồng)`;
            s1.font = { name: 'Arial', size: 10.5, bold: true, color: { argb: 'FF1E40AF' } };
            s1.fill = secFill;

            // Table Header
            const vHeader = ['STT', 'Tháng', 'Đơn vị tính', `TH ${selectedYear}`, `TH ${prevYear}`, 'Chênh lệch (TH - CK)', 'Tăng trưởng YoY (%)'];
            vHeader.forEach((h, i) => {
              const cell = ws.getCell(7, i + 2);
              cell.value = h;
              cell.font = { name: 'Arial', size: 10, bold: true, color: { argb: 'FF1E293B' } };
              cell.fill = headerFill;
              cell.alignment = { horizontal: i === 1 ? 'left' : 'center', vertical: 'middle', wrapText: true };
              cell.border = thinBorder;
            });
            ws.getRow(7).height = 26;

            // Table Rows
            trendData.forEach((item, rIdx) => {
              const rowNum = 8 + rIdx;
              const thCurr = item.th2026 !== null && item.th2026 !== undefined ? item.th2026 : null;
              const thOld = item.th2025;
              const diff = thCurr !== null ? Number((thCurr - thOld).toFixed(1)) : '-';
              const growth = item.growth || '-';

              const rowData = [
                rIdx + 1,
                `${item.name} (${item.month})`,
                'Triệu đồng',
                thCurr !== null ? thCurr : '-',
                thOld,
                diff,
                growth
              ];

              rowData.forEach((val, cIdx) => {
                const cell = ws.getCell(rowNum, cIdx + 2);
                cell.value = val;
                cell.font = { name: 'Arial', size: 9.5, bold: cIdx === 1 || cIdx === 3 };
                if (cIdx === 6 && growth !== '-') {
                  cell.font = { name: 'Arial', size: 9.5, bold: true, color: { argb: 'FF15803D' } };
                }
                cell.alignment = { horizontal: cIdx === 1 ? 'left' : (cIdx >= 3 ? 'right' : 'center'), vertical: 'middle' };
                cell.border = thinBorder;
              });
              ws.getRow(rowNum).height = 20;
            });

            // Section II: HÌNH ẢNH BIỂU ĐỒ BÊN CẠNH BẢNG (Col J to R, starting row 6)
            ws.mergeCells('J6:R6');
            const s2 = ws.getCell('J6');
            s2.value = 'II. HÌNH ẢNH BIỂU ĐỒ TRỰC QUAN';
            s2.font = { name: 'Arial', size: 10.5, bold: true, color: { argb: 'FF1E40AF' } };
            s2.fill = secFill;
            s2.alignment = { vertical: 'middle', horizontal: 'center' };

            // Column widths
            ws.getColumn(1).width = 3;  // A
            ws.getColumn(2).width = 6;  // B (STT)
            ws.getColumn(3).width = 24; // C (Tháng)
            ws.getColumn(4).width = 12; // D (ĐVT)
            ws.getColumn(5).width = 16; // E (TH 2026)
            ws.getColumn(6).width = 16; // F (TH 2025)
            ws.getColumn(7).width = 20; // G (Chênh lệch)
            ws.getColumn(8).width = 18; // H (Tăng trưởng)
            ws.getColumn(9).width = 4;  // I (Spacer)
            for (let col = 10; col <= 18; col++) {
              ws.getColumn(col).width = 11;
            }

            // Embedded Image of Biểu đồ 14
            if (img14) {
              const cleanBase64 = img14.replace(/^data:image\/\w+;base64,/, '');
              const imageId = workbook.addImage({
                base64: cleanBase64,
                extension: 'png'
              });

              ws.addImage(imageId, {
                tl: { col: 9, row: 6 }, // Cell J7
                ext: { width: 680, height: 380 }
              });
            }

            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Bao_Cao_Doanh_Thu_Xu_Huong_12_Thang_${selectedYear}.xlsx`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            showToast(`Đã xuất file Excel kèm cả hình ảnh Biểu đồ 14 thành công!`);
            excelJSSucceeded = true;
          }
        } catch (excelErr) {
          console.warn('ExcelJS trend export failed, falling back to XLSX:', excelErr);
        }

        if (!excelJSSucceeded) {
          const wb = XLSX.utils.book_new();
          const sheetRows = [
            ['BÁO CÁO DOANH THU - XU HƯỚNG THEO THỜI GIAN'],
            [`Biểu đồ 14. Xu hướng tổng doanh thu từng tháng năm ${selectedYear} so với năm ${prevYear}`],
            [`Kỳ báo cáo: 12 Tháng năm ${selectedYear}`, `Thời gian xuất: ${new Date().toLocaleDateString('vi-VN')}`],
            [],
            [`I. BẢNG XU HƯỚNG DOANH THU TỪNG THÁNG NĂM ${selectedYear} SO VỚI NĂM ${prevYear} (Đơn vị: Triệu đồng)`],
            ['STT', 'Tháng', 'Đơn vị tính', `TH ${selectedYear}`, `TH ${prevYear}`, 'Chênh lệch (TH - CK)', 'Tăng trưởng YoY (%)'],
            ...trendData.map((item, idx) => [
              idx + 1,
              `${item.name} (${item.month})`,
              'Triệu đồng',
              item.th2026 !== null && item.th2026 !== undefined ? item.th2026 : '-',
              item.th2025,
              item.th2026 !== null && item.th2026 !== undefined ? Number((item.th2026 - item.th2025).toFixed(1)) : '-',
              item.growth || '-'
            ])
          ];
          const ws = XLSX.utils.aoa_to_sheet(sheetRows);
          ws['!cols'] = [{ wch: 6 }, { wch: 24 }, { wch: 14 }, { wch: 20 }, { wch: 20 }, { wch: 24 }, { wch: 22 }];
          XLSX.utils.book_append_sheet(wb, ws, 'BieuDo_14_XuHuong_DT_12Thang');
          XLSX.writeFile(wb, `Bao_Cao_Doanh_Thu_Xu_Huong_12_Thang_${selectedYear}.xlsx`);
          showToast(`Đã xuất Excel: Biểu đồ 14 thành công!`);
        }
      } else if (currentView === 'spdv') {
        const spdvData = SPDV_STRUCTURE_DATA[selectedYear] || SPDV_STRUCTURE_DATA['2026'];

        const ALL_SPDV_CHARTS = [
          {
            key: 'thMonth',
            sheetName: 'TH_Thang8',
            mainTitle: 'BÁO CÁO DOANH THU - THEO NHÓM SPDV',
            chartTitle: 'Cơ cấu doanh thu thực hiện theo nhóm SPDV',
            subtitle: `Thực hiện - ${selectedMonth}/${selectedYear} (Đơn vị: Triệu đồng)`,
            periodText: `${selectedMonth}/${selectedYear}`,
            tag: 'Thực hiện',
            tagType: 'th',
            chart: spdvData.thMonth
          },
          {
            key: 'khMonth',
            sheetName: 'KH_Thang8',
            mainTitle: 'BÁO CÁO DOANH THU - THEO NHÓM SPDV',
            chartTitle: 'Cơ cấu doanh thu kế hoạch theo nhóm SPDV',
            subtitle: `Kế hoạch - ${selectedMonth}/${selectedYear} (Đơn vị: Triệu đồng)`,
            periodText: `${selectedMonth}/${selectedYear}`,
            tag: 'Kế hoạch',
            tagType: 'kh',
            chart: spdvData.khMonth
          },
          {
            key: 'thQuarter',
            sheetName: 'TH_Quy3_LK',
            mainTitle: 'BÁO CÁO DOANH THU - THEO NHÓM SPDV',
            chartTitle: 'Cơ cấu doanh thu thực hiện theo nhóm SPDV',
            subtitle: `Thực hiện - ${selectedQuarter}/${selectedYear} (lũy kế) (Đơn vị: Triệu đồng)`,
            periodText: `${selectedQuarter}/${selectedYear} (lũy kế)`,
            tag: 'Thực hiện',
            tagType: 'th',
            chart: spdvData.thQuarter
          },
          {
            key: 'khQuarter',
            sheetName: 'KH_Quy3',
            mainTitle: 'BÁO CÁO DOANH THU - THEO NHÓM SPDV',
            chartTitle: 'Cơ cấu doanh thu kế hoạch theo nhóm SPDV',
            subtitle: `Kế hoạch - ${selectedQuarter}/${selectedYear} (Đơn vị: Triệu đồng)`,
            periodText: `${selectedQuarter}/${selectedYear}`,
            tag: 'Kế hoạch',
            tagType: 'kh',
            chart: spdvData.khQuarter
          },
          {
            key: 'thYear',
            sheetName: 'TH_Nam_LK',
            mainTitle: 'BÁO CÁO DOANH THU - THEO NHÓM SPDV',
            chartTitle: 'Cơ cấu doanh thu thực hiện theo nhóm SPDV',
            subtitle: `Thực hiện - Năm ${selectedYear} (lũy kế) (Đơn vị: Triệu đồng)`,
            periodText: `Năm ${selectedYear} (lũy kế)`,
            tag: 'Thực hiện',
            tagType: 'th',
            chart: spdvData.thYear
          },
          {
            key: 'khYear',
            sheetName: 'KH_Nam',
            mainTitle: 'BÁO CÁO DOANH THU - THEO NHÓM SPDV',
            chartTitle: 'Cơ cấu doanh thu kế hoạch theo nhóm SPDV',
            subtitle: `Kế hoạch - Năm ${selectedYear} (Đơn vị: Triệu đồng)`,
            periodText: `Năm ${selectedYear}`,
            tag: 'Kế hoạch',
            tagType: 'kh',
            chart: spdvData.khYear
          }
        ];

        // Lọc CHỈ các biểu đồ không bị ẩn (chỉ export các biểu đồ đang mở)
        const activeCharts = ALL_SPDV_CHARTS.filter(c => spdvVisibleCards[c.key]);

        if (activeCharts.length === 0) {
          showToast('Vui lòng mở ít nhất 1 biểu đồ cần xuất báo cáo (hoặc bấm "Mở rộng tất cả")!');
          return;
        }

        showToast(`Đang xuất ${activeCharts.length} biểu đồ sang ${activeCharts.length} sheet Excel (kèm bảng số liệu bên cạnh)...`);

        let excelJSSucceeded = false;
        try {
          const ExcelJS = await getExcelJS();
          if (ExcelJS) {
            const workbook = new ExcelJS.Workbook();
            workbook.creator = 'Lite ERP Viettel';
            workbook.created = new Date();

            for (const item of activeCharts) {
              const png = generateSingleDonutPng({
                title: item.chartTitle,
                subtitle: item.subtitle,
                tag: item.tag,
                tagType: item.tagType,
                chart: item.chart
              });

              addSideBySideDonutSheet(workbook, {
                sheetName: item.sheetName,
                mainTitle: item.mainTitle,
                chartTitle: item.chartTitle,
                periodText: item.periodText,
                chart: item.chart,
                pngData: png
              });
            }

            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Bao_Cao_Doanh_Thu_Nhom_SPDV_${selectedYear}_(${activeCharts.length}_Bieu_Do).xlsx`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            showToast(`Đã xuất ${activeCharts.length} biểu đồ sang ${activeCharts.length} sheet Excel (kèm bảng chi tiết bên cạnh) thành công!`);
            excelJSSucceeded = true;
          }
        } catch (excelErr) {
          console.warn('ExcelJS SPDV export failed, falling back to XLSX:', excelErr);
        }

        if (!excelJSSucceeded) {
          const wb = XLSX.utils.book_new();
          for (const item of activeCharts) {
            const sheetRows = [
              [item.mainTitle],
              [item.chartTitle],
              [`Kỳ báo cáo: ${item.periodText}`, `Thời gian xuất: ${new Date().toLocaleDateString('vi-VN')}`],
              [],
              [`I. BẢNG SỐ LIỆU CHI TIẾT (Đơn vị: ${item.chart.unit || 'Triệu đồng'})`],
              ['STT', 'Tên nhóm SPDV', 'Tỷ trọng (%)', `Giá trị (${item.chart.unit || 'Tr.đ'})`],
              ...item.chart.slices.map((sl, idx) => [
                idx + 1,
                sl.name,
                sl.formattedPercent || `${sl.percent}%`,
                sl.value
              ]),
              ['', 'TỔNG CỘNG', '100,0%', item.chart.formattedTotal || item.chart.total]
            ];
            const ws = XLSX.utils.aoa_to_sheet(sheetRows);
            ws['!cols'] = [{ wch: 6 }, { wch: 34 }, { wch: 16 }, { wch: 22 }];
            XLSX.utils.book_append_sheet(wb, ws, item.sheetName.slice(0, 31));
          }
          XLSX.writeFile(wb, `Bao_Cao_Doanh_Thu_Nhom_SPDV_${selectedYear}_(${activeCharts.length}_Bieu_Do).xlsx`);
          showToast(`Đã xuất Excel: ${activeCharts.length} biểu đồ (${activeCharts.length} Sheet) thành công!`);
        }
      } else if (currentView === 'unit') {
        const unitData = UNIT_STRUCTURE_DATA[selectedYear] || UNIT_STRUCTURE_DATA['2026'];
        const ALL_UNIT_CHARTS = [
          {
            key: 'c21Month',
            sheetName: 'TH_DonVi_Thang8',
            mainTitle: 'BÁO CÁO DOANH THU - THEO ĐƠN VỊ THỰC HIỆN',
            chartTitle: 'Cơ cấu doanh thu theo đơn vị thực hiện',
            subtitle: `Thực hiện - ${selectedMonth}/${selectedYear} (Đơn vị: Triệu đồng)`,
            periodText: `${selectedMonth}/${selectedYear}`,
            tag: 'Thực hiện',
            tagType: 'th',
            chart: unitData.thMonth
          },
          {
            key: 'c21Quarter',
            sheetName: 'TH_DonVi_Quy3_LK',
            mainTitle: 'BÁO CÁO DOANH THU - THEO ĐƠN VỊ THỰC HIỆN',
            chartTitle: 'Cơ cấu doanh thu theo đơn vị thực hiện',
            subtitle: `Thực hiện - ${selectedQuarter}/${selectedYear} (lũy kế) (Đơn vị: Triệu đồng)`,
            periodText: `${selectedQuarter}/${selectedYear} (lũy kế)`,
            tag: 'Thực hiện',
            tagType: 'th',
            chart: unitData.thQuarter
          },
          {
            key: 'c21Year',
            sheetName: 'TH_DonVi_Nam_LK',
            mainTitle: 'BÁO CÁO DOANH THU - THEO ĐƠN VỊ THỰC HIỆN',
            chartTitle: 'Cơ cấu doanh thu theo đơn vị thực hiện',
            subtitle: `Thực hiện - Năm ${selectedYear} (lũy kế) (Đơn vị: Triệu đồng)`,
            periodText: `Năm ${selectedYear} (lũy kế)`,
            tag: 'Thực hiện',
            tagType: 'th',
            chart: unitData.thYear
          }
        ];

        const activeCharts = ALL_UNIT_CHARTS.filter(c => unitVisibleCards[c.key]);
        if (activeCharts.length === 0) {
          showToast('Vui lòng mở ít nhất 1 biểu đồ cần xuất báo cáo (hoặc bấm "Mở rộng tất cả")!');
          return;
        }

        showToast(`Đang xuất ${activeCharts.length} biểu đồ sang ${activeCharts.length} sheet Excel (kèm bảng số liệu bên cạnh)...`);

        let excelJSSucceeded = false;
        try {
          const ExcelJS = await getExcelJS();
          if (ExcelJS) {
            const workbook = new ExcelJS.Workbook();
            workbook.creator = 'Lite ERP Viettel';
            workbook.created = new Date();

            for (const item of activeCharts) {
              const png = generateSingleDonutPng({
                title: item.chartTitle,
                subtitle: item.subtitle,
                tag: item.tag,
                tagType: item.tagType,
                chart: item.chart
              });

              addSideBySideDonutSheet(workbook, {
                sheetName: item.sheetName,
                mainTitle: item.mainTitle,
                chartTitle: item.chartTitle,
                periodText: item.periodText,
                chart: item.chart,
                pngData: png
              });
            }

            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Bao_Cao_Doanh_Thu_Don_Vi_${selectedYear}_(${activeCharts.length}_Bieu_Do).xlsx`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            showToast(`Đã xuất ${activeCharts.length} biểu đồ sang ${activeCharts.length} sheet Excel (kèm bảng chi tiết bên cạnh) thành công!`);
            excelJSSucceeded = true;
          }
        } catch (excelErr) {
          console.warn('ExcelJS Unit export failed, falling back to XLSX:', excelErr);
        }

        if (!excelJSSucceeded) {
          const wb = XLSX.utils.book_new();
          for (const item of activeCharts) {
            const sheetRows = [
              [item.mainTitle],
              [item.chartTitle],
              [`Kỳ báo cáo: ${item.periodText}`, `Thời gian xuất: ${new Date().toLocaleDateString('vi-VN')}`],
              [],
              [`I. BẢNG SỐ LIỆU CHI TIẾT (Đơn vị: ${item.chart.unit || 'Triệu đồng'})`],
              ['STT', 'Đơn vị / Trung tâm', 'Tỷ trọng (%)', `Giá trị (${item.chart.unit || 'Tr.đ'})`],
              ...item.chart.slices.map((sl, idx) => [
                idx + 1,
                sl.name,
                sl.formattedPercent || `${sl.percent}%`,
                sl.value
              ]),
              ['', 'TỔNG CỘNG', '100,0%', item.chart.formattedTotal || item.chart.total]
            ];
            const ws = XLSX.utils.aoa_to_sheet(sheetRows);
            ws['!cols'] = [{ wch: 6 }, { wch: 34 }, { wch: 16 }, { wch: 22 }];
            XLSX.utils.book_append_sheet(wb, ws, item.sheetName.slice(0, 31));
          }
          XLSX.writeFile(wb, `Bao_Cao_Doanh_Thu_Don_Vi_${selectedYear}_(${activeCharts.length}_Bieu_Do).xlsx`);
          showToast(`Đã xuất Excel: ${activeCharts.length} biểu đồ (${activeCharts.length} Sheet) thành công!`);
        }
      } else if (currentView === 'plan_progress') {
        const inExData = INTERNAL_EXTERNAL_DATA[selectedYear] || INTERNAL_EXTERNAL_DATA['2026'];
        const domIntData = DOMESTIC_INTERNATIONAL_DATA[selectedYear] || DOMESTIC_INTERNATIONAL_DATA['2026'];

        const ALL_INEX_CHARTS = [
          // Biểu đồ 25 & 26 (Cơ cấu DT nội bộ và ngoài Tập đoàn)
          {
            key: 'thMonth',
            sheetName: 'TH_NoiBo_Thang8',
            mainTitle: 'BÁO CÁO DOANH THU - CƠ CẤU DT NỘI BỘ VÀ NGOÀI TẬP ĐOÀN',
            chartTitle: 'Cơ cấu doanh thu thực hiện nội bộ và ngoài Tập đoàn',
            subtitle: `Thực hiện - ${selectedMonth}/${selectedYear} (Đơn vị: Triệu đồng)`,
            periodText: `${selectedMonth}/${selectedYear}`,
            tag: 'Thực hiện',
            tagType: 'th',
            chart: inExData.thMonth
          },
          {
            key: 'khMonth',
            sheetName: 'KH_NoiBo_Thang8',
            mainTitle: 'BÁO CÁO DOANH THU - CƠ CẤU DT NỘI BỘ VÀ NGOÀI TẬP ĐOÀN',
            chartTitle: 'Cơ cấu doanh thu kế hoạch nội bộ và ngoài Tập đoàn',
            subtitle: `Kế hoạch - ${selectedMonth}/${selectedYear} (Đơn vị: Triệu đồng)`,
            periodText: `${selectedMonth}/${selectedYear}`,
            tag: 'Kế hoạch',
            tagType: 'kh',
            chart: inExData.khMonth
          },
          {
            key: 'thQuarter',
            sheetName: 'TH_NoiBo_Quy3_LK',
            mainTitle: 'BÁO CÁO DOANH THU - CƠ CẤU DT NỘI BỘ VÀ NGOÀI TẬP ĐOÀN',
            chartTitle: 'Cơ cấu doanh thu thực hiện nội bộ và ngoài Tập đoàn',
            subtitle: `Thực hiện - ${selectedQuarter}/${selectedYear} (lũy kế) (Đơn vị: Triệu đồng)`,
            periodText: `${selectedQuarter}/${selectedYear} (lũy kế)`,
            tag: 'Thực hiện',
            tagType: 'th',
            chart: inExData.thQuarter
          },
          {
            key: 'khQuarter',
            sheetName: 'KH_NoiBo_Quy3',
            mainTitle: 'BÁO CÁO DOANH THU - CƠ CẤU DT NỘI BỘ VÀ NGOÀI TẬP ĐOÀN',
            chartTitle: 'Cơ cấu doanh thu kế hoạch nội bộ và ngoài Tập đoàn',
            subtitle: `Kế hoạch - ${selectedQuarter}/${selectedYear} (Đơn vị: Triệu đồng)`,
            periodText: `${selectedQuarter}/${selectedYear}`,
            tag: 'Kế hoạch',
            tagType: 'kh',
            chart: inExData.khQuarter
          },
          {
            key: 'thYear',
            sheetName: 'TH_NoiBo_Nam_LK',
            mainTitle: 'BÁO CÁO DOANH THU - CƠ CẤU DT NỘI BỘ VÀ NGOÀI TẬP ĐOÀN',
            chartTitle: 'Cơ cấu doanh thu thực hiện nội bộ và ngoài Tập đoàn',
            subtitle: `Thực hiện - Năm ${selectedYear} (lũy kế) (Đơn vị: Triệu đồng)`,
            periodText: `Năm ${selectedYear} (lũy kế)`,
            tag: 'Thực hiện',
            tagType: 'th',
            chart: inExData.thYear
          },
          {
            key: 'khYear',
            sheetName: 'KH_NoiBo_Nam',
            mainTitle: 'BÁO CÁO DOANH THU - CƠ CẤU DT NỘI BỘ VÀ NGOÀI TẬP ĐOÀN',
            chartTitle: 'Cơ cấu doanh thu kế hoạch nội bộ và ngoài Tập đoàn',
            subtitle: `Kế hoạch - Năm ${selectedYear} (Đơn vị: Triệu đồng)`,
            periodText: `Năm ${selectedYear}`,
            tag: 'Kế hoạch',
            tagType: 'kh',
            chart: inExData.khYear
          },

          // Biểu đồ 27 & 28 (Cơ cấu DT trong nước và quốc tế)
          {
            key: 'thMonth27',
            sheetName: 'TH_TrongNuoc_Thang8',
            mainTitle: 'BÁO CÁO DOANH THU - CƠ CẤU DT TRONG NƯỚC VÀ QUỐC TẾ',
            chartTitle: 'Cơ cấu doanh thu thực hiện trong nước và quốc tế',
            subtitle: `Thực hiện - ${selectedMonth}/${selectedYear} (Đơn vị: ${domIntData.thMonth.unit || 'tỷ đ'})`,
            periodText: `${selectedMonth}/${selectedYear}`,
            tag: 'Thực hiện',
            tagType: 'th',
            chart: domIntData.thMonth
          },
          {
            key: 'khMonth28',
            sheetName: 'KH_TrongNuoc_Thang8',
            mainTitle: 'BÁO CÁO DOANH THU - CƠ CẤU DT TRONG NƯỚC VÀ QUỐC TẾ',
            chartTitle: 'Cơ cấu doanh thu kế hoạch trong nước và quốc tế',
            subtitle: `Kế hoạch - ${selectedMonth}/${selectedYear} (Đơn vị: ${domIntData.khMonth.unit || 'tỷ đ'})`,
            periodText: `${selectedMonth}/${selectedYear}`,
            tag: 'Kế hoạch',
            tagType: 'kh',
            chart: domIntData.khMonth
          },
          {
            key: 'thQuarter27',
            sheetName: 'TH_TrongNuoc_Quy3_LK',
            mainTitle: 'BÁO CÁO DOANH THU - CƠ CẤU DT TRONG NƯỚC VÀ QUỐC TẾ',
            chartTitle: 'Cơ cấu doanh thu thực hiện trong nước và quốc tế',
            subtitle: `Thực hiện - ${selectedQuarter}/${selectedYear} (lũy kế) (Đơn vị: ${domIntData.thQuarter.unit || 'tỷ đ'})`,
            periodText: `${selectedQuarter}/${selectedYear} (lũy kế)`,
            tag: 'Thực hiện',
            tagType: 'th',
            chart: domIntData.thQuarter
          },
          {
            key: 'khQuarter28',
            sheetName: 'KH_TrongNuoc_Quy3',
            mainTitle: 'BÁO CÁO DOANH THU - CƠ CẤU DT TRONG NƯỚC VÀ QUỐC TẾ',
            chartTitle: 'Cơ cấu doanh thu kế hoạch trong nước và quốc tế',
            subtitle: `Kế hoạch - ${selectedQuarter}/${selectedYear} (Đơn vị: ${domIntData.khQuarter.unit || 'tỷ đ'})`,
            periodText: `${selectedQuarter}/${selectedYear}`,
            tag: 'Kế hoạch',
            tagType: 'kh',
            chart: domIntData.khQuarter
          },
          {
            key: 'thYear27',
            sheetName: 'TH_TrongNuoc_Nam_LK',
            mainTitle: 'BÁO CÁO DOANH THU - CƠ CẤU DT TRONG NƯỚC VÀ QUỐC TẾ',
            chartTitle: 'Cơ cấu doanh thu thực hiện trong nước và quốc tế',
            subtitle: `Thực hiện - Năm ${selectedYear} (lũy kế) (Đơn vị: ${domIntData.thYear.unit || 'tỷ đ'})`,
            periodText: `Năm ${selectedYear} (lũy kế)`,
            tag: 'Thực hiện',
            tagType: 'th',
            chart: domIntData.thYear
          },
          {
            key: 'khYear28',
            sheetName: 'KH_TrongNuoc_Nam',
            mainTitle: 'BÁO CÁO DOANH THU - CƠ CẤU DT TRONG NƯỚC VÀ QUỐC TẾ',
            chartTitle: 'Cơ cấu doanh thu kế hoạch trong nước và quốc tế',
            subtitle: `Kế hoạch - Năm ${selectedYear} (Đơn vị: ${domIntData.khYear.unit || 'tỷ đ'})`,
            periodText: `Năm ${selectedYear}`,
            tag: 'Kế hoạch',
            tagType: 'kh',
            chart: domIntData.khYear
          }
        ];

        // Lọc CHỈ các biểu đồ không bị ẩn (chỉ export các biểu đồ đang mở)
        const activeCharts = ALL_INEX_CHARTS.filter(c => inExVisibleCards[c.key]);

        if (activeCharts.length === 0) {
          showToast('Vui lòng mở ít nhất 1 biểu đồ cần xuất báo cáo (hoặc bấm "Mở rộng tất cả")!');
          return;
        }

        showToast(`Đang xuất ${activeCharts.length} biểu đồ sang ${activeCharts.length} sheet Excel (kèm bảng số liệu bên cạnh)...`);

        let excelJSSucceeded = false;
        try {
          const ExcelJS = await getExcelJS();
          if (ExcelJS) {
            const workbook = new ExcelJS.Workbook();
            workbook.creator = 'Lite ERP Viettel';
            workbook.created = new Date();

            for (const item of activeCharts) {
              const png = generateSingleDonutPng({
                title: item.chartTitle,
                subtitle: item.subtitle,
                tag: item.tag,
                tagType: item.tagType,
                chart: item.chart
              });

              addSideBySideDonutSheet(workbook, {
                sheetName: item.sheetName,
                mainTitle: item.mainTitle,
                chartTitle: item.chartTitle,
                periodText: item.periodText,
                chart: item.chart,
                pngData: png
              });
            }

            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Bao_Cao_Chuyen_Dich_DT_Ngoai_Va_Quoc_Te_${selectedYear}_(${activeCharts.length}_Bieu_Do).xlsx`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            showToast(`Đã xuất ${activeCharts.length} biểu đồ sang ${activeCharts.length} sheet Excel (kèm bảng chi tiết bên cạnh) thành công!`);
            excelJSSucceeded = true;
          }
        } catch (excelErr) {
          console.warn('ExcelJS Internal-External export failed, falling back to XLSX:', excelErr);
        }

        if (!excelJSSucceeded) {
          const wb = XLSX.utils.book_new();
          for (const item of activeCharts) {
            const sheetRows = [
              [item.mainTitle],
              [item.chartTitle],
              [`Kỳ báo cáo: ${item.periodText}`, `Thời gian xuất: ${new Date().toLocaleDateString('vi-VN')}`],
              [],
              [`I. BẢNG SỐ LIỆU CHI TIẾT (Đơn vị: ${item.chart.unit || 'Triệu đồng'})`],
              ['STT', 'Khoản mục Doanh thu', 'Tỷ trọng (%)', `Giá trị (${item.chart.unit || 'Tr.đ'})`],
              ...item.chart.slices.map((sl, idx) => [
                idx + 1,
                sl.name,
                sl.formattedPercent || `${sl.percent}%`,
                sl.value
              ]),
              ['', 'TỔNG CỘNG', '100,0%', item.chart.formattedTotal || item.chart.total]
            ];
            const ws = XLSX.utils.aoa_to_sheet(sheetRows);
            ws['!cols'] = [{ wch: 6 }, { wch: 34 }, { wch: 16 }, { wch: 22 }];
            XLSX.utils.book_append_sheet(wb, ws, item.sheetName.slice(0, 31));
          }
          XLSX.writeFile(wb, `Bao_Cao_Chuyen_Dich_DT_Ngoai_Va_Quoc_Te_${selectedYear}_(${activeCharts.length}_Bieu_Do).xlsx`);
          showToast(`Đã xuất Excel: ${activeCharts.length} biểu đồ (${activeCharts.length} Sheet) thành công!`);
        }
      } else {
        const wb = XLSX.utils.book_new();
        // Sheet 1: Tổng hợp theo dòng
        const streamData = REVENUE_STREAMS.map(item => ({
          'Dòng doanh thu': item.name,
          'Kế hoạch (Tỷ VNĐ)': item.target,
          'Thực hiện (Tỷ VNĐ)': item.amount,
          'Tỷ lệ cơ cấu (%)': `${item.percent}%`,
          'Tỷ lệ hoàn thành (%)': `${((item.amount / item.target) * 100).toFixed(1)}%`,
          'Số lượng hợp đồng': item.count
        }));
        const ws1 = XLSX.utils.json_to_sheet(streamData);
        XLSX.utils.book_append_sheet(wb, ws1, 'DoanhThu_TheoDong');

        // Sheet 2: Doanh thu theo tháng
        const monthlyData = MONTHLY_REVENUE_DATA.map(item => ({
          'Tháng': item.month,
          'Doanh thu thực tế (Tỷ VNĐ)': item.actual,
          'Kế hoạch (Tỷ VNĐ)': item.target,
          'Cùng kỳ (Tỷ VNĐ)': item.lastYear,
          'Tăng trưởng (%)': `${item.growth}%`
        }));
        const ws2 = XLSX.utils.json_to_sheet(monthlyData);
        XLSX.utils.book_append_sheet(wb, ws2, 'DoanhThu_TheoThang');

        // Sheet 3: Danh sách hợp đồng chi tiết
        const contractsData = DETAILED_CONTRACT_DATA.map(item => ({
          'Mã Hợp Đồng': item.id,
          'Khách Hàng': item.customer,
          'Dòng Doanh Thu': item.stream,
          'Dịch Vụ / Giải Pháp': item.service,
          'Kỳ Doanh Thu': item.month,
          'Kế Hoạch (Tỷ VNĐ)': item.plan,
          'Thực Hiện (Tỷ VNĐ)': item.actual,
          'Tỷ Lệ Đạt (%)': `${item.rate}%`,
          'Trạng Thái': item.status
        }));
        const ws3 = XLSX.utils.json_to_sheet(contractsData);
        XLSX.utils.book_append_sheet(wb, ws3, 'HopDong_ChiTiet');

        XLSX.writeFile(wb, `Bao_Cao_Doanh_Thu_ViettelERP_${selectedYear}_${currentView}.xlsx`);
        showToast('Đã xuất file Excel báo cáo doanh thu thành công!');
      }
    } catch (err) {
      console.error(err);
      showToast('Lỗi khi xuất file Excel');
    }
  };

  const handleSaveConfig = () => {
    showToast('Đã lưu cấu hình báo cáo doanh thu thành công!');
  };

  // Custom tooltips
  const CustomBarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="revenue-tooltip-box">
          <div className="tooltip-title">{label}</div>
          {payload.map((entry, index) => (
            <div key={`tooltip-${index}`} className="tooltip-value" style={{ color: entry.color || entry.fill }}>
              <span>{entry.name}:</span>
              <strong>{entry.value} Tỷ VNĐ</strong>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const activeBranchInfo = REVENUE_SUB_BRANCHES.find(b => b.id === currentView) || REVENUE_SUB_BRANCHES[0];

  return (
    <div className="revenue-report-page">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="revenue-toast">
          <Check size={16} />
          <span>{toastMessage}</span>
        </div>
      )}


      {/* Top Header Bar: Clean with Back button, Title, pill tag, and 'Xuất Excel' button matching screenshot */}
      <div className="revenue-clean-top-bar">
        <div className="revenue-clean-title-area">
          <button className="revenue-back-btn" onClick={() => navigate(-1)} title="Quay lại">
            <ArrowLeft size={16} />
            <span>Quay lại</span>
          </button>
          <div className="revenue-title-with-pill">
            <h1 className="revenue-main-title">
              {currentView === 'quarter' ? `Báo cáo doanh thu ${selectedQuarter}/${selectedYear}` :
               currentView === 'year' ? `Báo cáo doanh thu năm ${selectedYear}` :
               currentView === 'month' ? `Báo cáo doanh thu ${selectedMonth}/${selectedYear}` :
               currentView === 'trend' ? `Xu hướng doanh thu từng tháng năm ${selectedYear}` :
               currentView === 'spdv' ? 'Doanh thu thực hiện và kế hoạch theo nhóm SPDV' :
               'Báo cáo doanh thu'}
            </h1>
            <span className="revenue-tag-pill">
              {currentView === 'month' ? `${selectedMonth}/${selectedYear}` :
               currentView === 'quarter' ? `${selectedQuarter}/${selectedYear}` :
               currentView === 'year' ? `Năm ${selectedYear}` :
               currentView === 'trend' ? `Năm ${selectedYear}` :
               currentView === 'spdv' ? `${selectedMonth}/${selectedYear}` :
               currentView === 'unit' ? `${selectedMonth}/${selectedYear}` :
               'DT ngoài & QT'}
            </span>
          </div>
        </div>

        <button className="clean-export-excel-btn" onClick={handleExportExcel}>
          Xuất Excel
        </button>
      </div>

      {/* Main Content Area (Sidebar already provides Nhóm biểu đồ navigation) */}
      <div className="revenue-group-content-panel">
        {currentView === 'month' ? (
          /* Phân tích theo tháng: Renders Biểu đồ 1-4 with Năm & Tháng filters */
          <MonthComparisonChart
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            visibleMap={monthVisibleMap}
            onVisibleMapChange={setMonthVisibleMap}
          />
        ) : currentView === 'quarter' ? (
          /* Phân tích theo quý: Renders Biểu đồ 5-7 with Năm & Quý filters */
          <QuarterComparisonChart
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            selectedQuarter={selectedQuarter}
            setSelectedQuarter={setSelectedQuarter}
            visibleMap={quarterVisibleMap}
            onVisibleMapChange={setQuarterVisibleMap}
          />
        ) : currentView === 'year' ? (
          /* Phân tích theo năm: Renders Biểu đồ 10 with Năm & Lũy kế tháng filters */
          <YearComparisonChart
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            selectedCumulativeMonth={selectedCumulativeMonth}
            setSelectedCumulativeMonth={setSelectedCumulativeMonth}
            visibleCards={yearVisibleCards}
            onVisibleCardsChange={setYearVisibleCards}
          />
        ) : currentView === 'trend' ? (
          /* Xu hướng theo thời gian: Renders Biểu đồ 14 */
          <TrendComparisonChart
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
          />
        ) : currentView === 'spdv' ? (
          /* Cơ cấu theo nhóm SPDV: Renders Biểu đồ 16 & 17 */
          <SpdvComparisonChart
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            visibleCards={spdvVisibleCards}
            onVisibleCardsChange={setSpdvVisibleCards}
          />
        ) : currentView === 'unit' ? (
          /* Cơ cấu theo đơn vị: Renders Biểu đồ 21 */
          <UnitComparisonChart
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            visibleCards={unitVisibleCards}
            onVisibleCardsChange={setUnitVisibleCards}
          />
        ) : currentView === 'plan_progress' ? (
          /* Chuyển dịch DT ngoài và DT quốc tế: Renders Biểu đồ 25 & 26 */
          <InternalExternalRevenueChart
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            visibleCards={inExVisibleCards}
            onVisibleCardsChange={setInExVisibleCards}
          />
        ) : (
            <>
              {/* Top KPI Summary Cards */}
              <div className="revenue-kpi-grid">
                <div className="revenue-kpi-card">
                  <div className="kpi-card-header">
                    <span className="kpi-card-title">Doanh thu lũy kế thực hiện</span>
                    <div className="kpi-card-icon red">
                      <DollarSign size={18} />
                    </div>
                  </div>
                  <div className="kpi-value-row">
                    <span className="kpi-main-number">148,50</span>
                    <span className="kpi-unit">Tỷ VNĐ</span>
                  </div>
                  <div className="kpi-footer-metric">
                    <span className="kpi-badge-growth up">
                      <TrendingUp size={12} /> +15.8% YoY
                    </span>
                    <span className="kpi-subtext">Đạt 92.8% KH năm</span>
                  </div>
                </div>

                <div className="revenue-kpi-card">
                  <div className="kpi-card-header">
                    <span className="kpi-card-title">Kế hoạch doanh thu 2026</span>
                    <div className="kpi-card-icon blue">
                      <Calendar size={18} />
                    </div>
                  </div>
                  <div className="kpi-value-row">
                    <span className="kpi-main-number">160,00</span>
                    <span className="kpi-unit">Tỷ VNĐ</span>
                  </div>
                  <div className="kpi-footer-metric">
                    <span className="kpi-badge-growth target">Mục tiêu 2026</span>
                    <span className="kpi-subtext">Q3 kỳ vọng: 44.0 Tỷ</span>
                  </div>
                </div>

                <div className="revenue-kpi-card">
                  <div className="kpi-card-header">
                    <span className="kpi-card-title">Đã nghiệm thu / Lên DT</span>
                    <div className="kpi-card-icon green">
                      <ShieldCheck size={18} />
                    </div>
                  </div>
                  <div className="kpi-value-row">
                    <span className="kpi-main-number">132,20</span>
                    <span className="kpi-unit">Tỷ VNĐ</span>
                  </div>
                  <div className="kpi-footer-metric">
                    <span className="kpi-badge-growth up">89.0% Tỷ lệ thu hồi</span>
                    <span className="kpi-subtext">118 Hợp đồng</span>
                  </div>
                </div>

                <div className="revenue-kpi-card">
                  <div className="kpi-card-header">
                    <span className="kpi-card-title">Dự kiến / Chờ đối soát</span>
                    <div className="kpi-card-icon amber">
                      <Layers size={18} />
                    </div>
                  </div>
                  <div className="kpi-value-row">
                    <span className="kpi-main-number">28,30</span>
                    <span className="kpi-unit">Tỷ VNĐ</span>
                  </div>
                  <div className="kpi-footer-metric">
                    <span className="kpi-badge-growth target">Đang xử lý</span>
                    <span className="kpi-subtext">22 Biên bản BB-NT</span>
                  </div>
                </div>
              </div>

              {/* DYNAMIC CONTENT AREA */}
              <div className="analysis-card-container">
                {/* Header of dynamic area */}
                <div className="analysis-action-bar">
                  <div className="action-bar-left">
                    <div className="current-branch-heading">
                      <span className="branch-title-highlight">{activeBranchInfo.title}</span>
                      <span className="branch-desc-muted">{activeBranchInfo.subtitle}</span>
                    </div>
                  </div>

                  <div className="action-bar-right">
                    {viewMode === 'chart' && currentView !== 'plan_progress' && (
                      <div className="chart-type-toggles">
                        <button
                          className={`chart-type-btn ${chartType === 'bar' ? 'active' : ''}`}
                          onClick={() => setChartType('bar')}
                          title="Biểu đồ cột"
                        >
                          <BarChart2 size={16} />
                        </button>
                        <button
                          className={`chart-type-btn ${chartType === 'line' ? 'active' : ''}`}
                          onClick={() => setChartType('line')}
                          title="Biểu đồ đường"
                        >
                          <Activity size={16} />
                        </button>
                        <button
                          className={`chart-type-btn ${chartType === 'donut' ? 'active' : ''}`}
                          onClick={() => setChartType('donut')}
                          title="Biểu đồ tròn cơ cấu"
                        >
                          <PieChartIcon size={16} />
                        </button>
                        <button
                          className={`chart-type-btn ${chartType === 'area' ? 'active' : ''}`}
                          onClick={() => setChartType('area')}
                          title="Biểu đồ diện tích"
                        >
                          <AreaIcon size={16} />
                        </button>
                      </div>
                    )}
                    <button className="save-report-btn" onClick={handleSaveConfig}>
                      <Save size={14} />
                      <span>Lưu</span>
                    </button>
                  </div>
                </div>







            {/* General Contracts Table (Always accessible via viewMode === 'list' or at the bottom) */}
            {viewMode === 'list' && (
              <div className="branch-table-panel" style={{ marginTop: '24px' }}>
                <div className="branch-table-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Danh sách Hợp đồng & Doanh thu chi tiết</span>
                  <span style={{ fontSize: '13px', fontWeight: 500, color: '#64748b' }}>
                    {filteredContracts.length} Hợp đồng
                  </span>
                </div>
                <table className="custom-branch-table">
                  <thead>
                    <tr>
                      <th>Mã HĐ</th>
                      <th>Khách hàng</th>
                      <th>Dịch vụ / Giải pháp</th>
                      <th>Dòng Doanh thu</th>
                      <th>Kỳ</th>
                      <th>Thực hiện</th>
                      <th>Kế hoạch</th>
                      <th>Tỷ lệ</th>
                      <th>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredContracts.map((c) => (
                      <tr key={c.id}>
                        <td><code>{c.id}</code></td>
                        <td><strong>{c.customer}</strong></td>
                        <td>{c.service}</td>
                        <td><span className="stream-tag">{c.stream}</span></td>
                        <td>{c.month}</td>
                        <td className="number-bold red">{c.actual} Tỷ</td>
                        <td>{c.plan} Tỷ</td>
                        <td><span className="status-pill pill-green">{c.rate}%</span></td>
                        <td>
                          <span className={`status-pill ${c.status === 'Đã nghiệm thu' ? 'pill-green' : 'pill-amber'}`}>
                            {c.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  </div>
);
};

export default RevenueReportDashboard;
