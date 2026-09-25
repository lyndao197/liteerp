import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line
} from 'recharts';
import {
  ChevronDown, ChevronUp, Filter, Tag, X,
  BarChart2, Activity, PieChart as PieChartIcon,
  Save, Grid, List, AreaChart, Check, Download, TrendingUp
} from 'lucide-react';
import * as XLSX from 'xlsx';
import './ReportDashboard.css';
import './RevenueReportDashboard.css';

// Exact slice data matching the design screenshot
const INITIAL_CHART_DATA = [
  { id: '1', name: 'Đề xuất - 06/2026', stage: 'Đề xuất', month: '06/2026', count: 60, percent: 60, color: '#ff5376' },
  { id: '2', name: 'Đủ điều kiện - 04/2026', stage: 'Đủ điều kiện', month: '04/2026', count: 4, percent: 4, color: '#fbc02d' },
  { id: '3', name: 'Đề xuất - 05/2026', stage: 'Đề xuất', month: '05/2026', count: 16, percent: 16, color: '#38c3c8' },
  { id: '4', name: 'Mới - 07/2026', stage: 'Mới', month: '07/2026', count: 20, percent: 20, color: '#2563eb' }
];

const OBJECT_OPTIONS = [
  { id: 'opp', label: 'Cơ hội bán hàng' },
  { id: 'lead', label: 'Lead' },
  { id: 'customer', label: 'Khách hàng' },
  { id: 'contract', label: 'Hợp đồng' },
  { id: 'order', label: 'Đơn hàng' }
];

const MEASURE_OPTIONS = [
  { id: 'count', label: 'Đếm' },
  { id: 'revenue', label: 'Doanh thu (VNĐ)' },
  { id: 'value', label: 'Giá trị hợp đồng' }
];

const ReportDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Navigation & Control States
  const [targetObject, setTargetObject] = useState('Cơ hội bán hàng');
  const [isObjectOpen, setIsObjectOpen] = useState(false);
  const [measure, setMeasure] = useState('Đếm');
  const [isMeasureOpen, setIsMeasureOpen] = useState(false);

  // Sync targetObject from URL query param ?object=
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const objectParam = searchParams.get('object');
    if (objectParam) {
      const match = OBJECT_OPTIONS.find(
        opt => opt.id === objectParam || opt.label.toLowerCase() === objectParam.toLowerCase()
      );
      if (match) {
        setTargetObject(match.label);
      }
    }
  }, [location.search]);

  // View switchers: 'chart' | 'pivot' | 'list'
  const [viewMode, setViewMode] = useState('chart');

  // Chart type: 'donut' | 'bar' | 'line'
  const [chartType, setChartType] = useState('donut');

  // Filter chips
  const [filters, setFilters] = useState([
    { id: 'time', text: 'Thời điểm tạo: 2026', icon: 'filter' },
    { id: 'tag', text: 'Tag', icon: 'tag' }
  ]);
  const [searchText, setSearchText] = useState('');
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const removeFilter = (id) => {
    setFilters(prev => prev.filter(f => f.id !== id));
  };

  const handleSave = () => {
    showToast('Đã lưu cấu hình báo cáo thành công!');
  };

  const handleExportExcel = () => {
    try {
      const dataToExport = INITIAL_CHART_DATA.map(item => ({
        'Giai đoạn / Thời điểm': item.name,
        'Giai đoạn': item.stage,
        'Tháng': item.month,
        'Số lượng': item.count,
        'Tỷ lệ (%)': `${item.percent}%`
      }));

      const ws = XLSX.utils.json_to_sheet(dataToExport);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'PhanTichBaoCao');
      XLSX.writeFile(wb, `Bao_cao_phan_tich_${targetObject}_2026.xlsx`);
      showToast('Đã xuất file Excel thành công!');
    } catch (err) {
      console.error(err);
      showToast('Lỗi khi xuất file Excel');
    }
  };

  // Custom tooltip for Donut/Pie
  const CustomDonutTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="report-tooltip-box">
          <div className="tooltip-title" style={{ color: item.color }}>{item.name}</div>
          <div className="tooltip-value">
            <span>{measure}: <strong>{item.count}</strong></span>
            <span>Tỷ lệ: <strong>{item.percent}%</strong></span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="report-analysis-page">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="report-toast">
          <Check size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sub-navigation Tabs: Switch between Report Branches */}
      <div className="report-branch-nav" style={{ marginBottom: '16px' }}>
        <button
          className="report-branch-tab active"
          onClick={() => navigate('/reports?object=opp')}
        >
          <PieChartIcon size={16} />
          <span>Report Dashboard</span>
        </button>
        <button
          className="report-branch-tab"
          onClick={() => navigate('/reports/revenue?view=month')}
        >
          <TrendingUp size={16} />
          <span>Báo cáo doanh thu</span>
          <span className="report-tab-badge">Mới</span>
        </button>
      </div>

      {/* Top Header Bar */}
      <div className="report-top-header">
        <div className="report-header-left">
          <h1 className="report-main-title">Report Dashboard - Phân tích {targetObject}</h1>
          
          {/* Object Dropdown */}
          <div className="object-dropdown-wrapper">
            <button 
              className="object-dropdown-btn"
              onClick={() => setIsObjectOpen(!isObjectOpen)}
            >
              <span>Đối tượng: {targetObject}</span>
              <ChevronDown size={14} className={isObjectOpen ? 'rotate-180' : ''} />
            </button>
            {isObjectOpen && (
              <div className="dropdown-popover">
                {OBJECT_OPTIONS.map(opt => (
                  <div
                    key={opt.id}
                    className={`dropdown-popover-item ${targetObject === opt.label ? 'selected' : ''}`}
                    onClick={() => {
                      setTargetObject(opt.label);
                      setIsObjectOpen(false);
                      navigate(`/reports?object=${opt.id}`);
                    }}
                  >
                    {opt.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="report-header-right">
          {/* Search & Filter Pill Container */}
          <div className="filter-pill-container">
            {filters.map(filter => (
              <div key={filter.id} className="filter-chip">
                {filter.icon === 'filter' ? <Filter size={12} /> : <Tag size={12} />}
                <span>{filter.text}</span>
                <button className="chip-close-btn" onClick={() => removeFilter(filter.id)}>
                  <X size={11} />
                </button>
              </div>
            ))}

            <input
              type="text"
              className="filter-search-input"
              placeholder="Tìm kiếm..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />

            {searchText && (
              <button className="clear-search-btn" onClick={() => setSearchText('')}>
                <X size={12} />
              </button>
            )}

            <button 
              className="collapse-filter-btn"
              onClick={() => setIsFilterExpanded(!isFilterExpanded)}
              title={isFilterExpanded ? 'Thu gọn' : 'Mở rộng'}
            >
              {isFilterExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>

          {/* View Switchers: Chart | Pivot Table | List */}
          <div className="view-mode-group">
            <button
              className={`view-mode-btn ${viewMode === 'chart' ? 'active' : ''}`}
              onClick={() => setViewMode('chart')}
              title="Biểu đồ"
            >
              <AreaChart size={18} />
            </button>
            <button
              className={`view-mode-btn ${viewMode === 'pivot' ? 'active' : ''}`}
              onClick={() => setViewMode('pivot')}
              title="Bảng tổng hợp (Pivot)"
            >
              <Grid size={18} />
            </button>
            <button
              className={`view-mode-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="Danh sách"
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Analysis White Container */}
      <div className="analysis-card-container">
        {/* Inner Action Bar */}
        <div className="analysis-action-bar">
          <div className="action-bar-left">
            {/* Measure Dropdown (Đếm / Doanh thu...) */}
            <div className="measure-dropdown-wrapper">
              <button
                className="measure-dropdown-btn"
                onClick={() => setIsMeasureOpen(!isMeasureOpen)}
              >
                <span>{measure}</span>
                <ChevronDown size={14} className={isMeasureOpen ? 'rotate-180' : ''} />
              </button>
              {isMeasureOpen && (
                <div className="dropdown-popover">
                  {MEASURE_OPTIONS.map(opt => (
                    <div
                      key={opt.id}
                      className={`dropdown-popover-item ${measure === opt.label ? 'selected' : ''}`}
                      onClick={() => {
                        setMeasure(opt.label);
                        setIsMeasureOpen(false);
                      }}
                    >
                      {opt.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Export Excel Button */}
            <button className="export-excel-btn" onClick={handleExportExcel}>
              Xuất excel
            </button>

            {/* Chart Type Toggles (Bar | Line | Donut) */}
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
                title="Biểu đồ tròn (Donut)"
              >
                <PieChartIcon size={16} />
              </button>
            </div>
          </div>

          {/* Save Button */}
          <div className="action-bar-right">
            <button className="save-report-btn" onClick={handleSave}>
              <Save size={16} />
              <span>Lưu</span>
            </button>
          </div>
        </div>

        {/* Content Body depending on ViewMode */}
        {viewMode === 'chart' && (
          <div className="analysis-chart-viewport">
            {chartType === 'donut' && (
              <div className="donut-chart-layout">
                {/* Left Side: Donut Chart */}
                <div className="donut-graphic-wrapper">
                  <ResponsiveContainer width={360} height={360}>
                    <PieChart>
                      <Pie
                        data={INITIAL_CHART_DATA}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={155}
                        paddingAngle={0}
                        dataKey="count"
                        stroke="#ffffff"
                        strokeWidth={2}
                      >
                        {INITIAL_CHART_DATA.map((entry) => (
                          <Cell key={`cell-${entry.id}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip content={<CustomDonutTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Right Side: Exact Legend Table */}
                <div className="donut-legend-wrapper">
                  <div className="donut-legend-list">
                    {INITIAL_CHART_DATA.map((item) => (
                      <div key={item.id} className="donut-legend-item">
                        <div className="legend-indicator-text">
                          <span
                            className="legend-color-dot"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="legend-label">{item.name}</span>
                        </div>
                        <span className="legend-percentage">{item.percent}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {chartType === 'bar' && (
              <div className="bar-chart-layout">
                <ResponsiveContainer width="100%" height={380}>
                  <BarChart data={INITIAL_CHART_DATA} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} interval={0} />
                    <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                    <RechartsTooltip content={<CustomDonutTooltip />} />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {INITIAL_CHART_DATA.map((entry) => (
                        <Cell key={`bar-${entry.id}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {chartType === 'line' && (
              <div className="line-chart-layout">
                <ResponsiveContainer width="100%" height={380}>
                  <LineChart data={INITIAL_CHART_DATA} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} />
                    <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                    <RechartsTooltip content={<CustomDonutTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#EE0033"
                      strokeWidth={3}
                      dot={{ r: 6, fill: '#EE0033', strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}

        {viewMode === 'pivot' && (
          <div className="analysis-table-viewport">
            <table className="report-pivot-table">
              <thead>
                <tr>
                  <th>Giai đoạn \ Tháng</th>
                  <th>04/2026</th>
                  <th>05/2026</th>
                  <th>06/2026</th>
                  <th>07/2026</th>
                  <th>Tổng cộng</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="row-header">Mới</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>20 (20%)</td>
                  <td className="subtotal">20</td>
                </tr>
                <tr>
                  <td className="row-header">Đủ điều kiện</td>
                  <td>4 (4%)</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td className="subtotal">4</td>
                </tr>
                <tr>
                  <td className="row-header">Đề xuất</td>
                  <td>-</td>
                  <td>16 (16%)</td>
                  <td>60 (60%)</td>
                  <td>-</td>
                  <td className="subtotal">76</td>
                </tr>
                <tr className="total-row">
                  <td className="row-header">Tổng cộng</td>
                  <td>4 (4%)</td>
                  <td>16 (16%)</td>
                  <td>60 (60%)</td>
                  <td>20 (20%)</td>
                  <td className="grand-total">100 (100%)</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {viewMode === 'list' && (
          <div className="analysis-table-viewport">
            <table className="report-list-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên báo cáo / Phân loại</th>
                  <th>Giai đoạn</th>
                  <th>Thời gian</th>
                  <th>Số lượng</th>
                  <th>Tỷ lệ</th>
                </tr>
              </thead>
              <tbody>
                {INITIAL_CHART_DATA.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>
                      <span className="table-item-badge" style={{ borderColor: item.color, color: item.color }}>
                        {item.name}
                      </span>
                    </td>
                    <td>{item.stage}</td>
                    <td>{item.month}</td>
                    <td><strong>{item.count}</strong></td>
                    <td><strong>{item.percent}%</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportDashboard;
