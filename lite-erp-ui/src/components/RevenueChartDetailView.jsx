import React, { useState, useMemo } from 'react';
import {
  ArrowLeft, Download, Search, Filter, CheckCircle2, AlertCircle,
  TrendingUp, TrendingDown, ChevronDown, TableProperties, BarChart2,
  Calendar, Layers, RefreshCw, Eye, FileText, Building, User,
  DollarSign, Check, X, ChevronLeft, ChevronRight, SlidersHorizontal,
  ExternalLink, Printer, Clock, Briefcase, Hash, ShieldCheck
} from 'lucide-react';
import * as XLSX from 'xlsx';
import './RevenueChartDetailView.css';

import {
  filterRevenueRecords,
  computeRecordsSummary,
  SPDV_LIST,
  UNIT_LIST,
  REVENUE_TYPE_LIST,
  RECORD_STATUS_LIST
} from '../data/revenueRecordsData';

import {
  MONTH_OPTIONS,
  MONTHLY_PLAN_DATA,
  MONTH_PREV_DATA,
  MONTH_LAST_YEAR_DATA,
  MONTH_NEXT_PLAN_DATA
} from '../data/revenueMonthData';

import {
  QUARTER_OPTIONS,
  QUARTER_CUMULATIVE_DATA,
  QUARTER_ESTIMATE_DATA,
  QUARTER_PREV_DATA,
  QUARTER_SAME_PERIOD_DATA,
  QUARTER_NEXT_PLAN_DATA
} from '../data/revenueQuarterData';

import {
  CUMULATIVE_MONTH_OPTIONS,
  YEAR_CUMULATIVE_DATA,
  YEAR_PLAN_FULL_DATA,
  YEAR_ESTIMATE_DATA
} from '../data/revenueYearData';

const YEAR_OPTIONS = ['2026', '2025', '2024'];

export default function RevenueChartDetailView({
  initialBranchId = 'month',
  initialChartKey = 'chart1_val',
  initialChartTitle = '',
  selectedYear = '2026',
  setSelectedYear,
  selectedMonth = 'Tháng 8',
  setSelectedMonth,
  selectedQuarter = 'Quý III',
  setSelectedQuarter,
  selectedCumulativeMonth = '8 tháng',
  setSelectedCumulativeMonth,
  onBack
}) {
  // Mode: 'records' (Danh sách bản ghi liên quan) | 'summary_table' (Bảng tổng hợp chỉ tiêu)
  const [viewMode, setViewMode] = useState('records');

  // Search & Filter state for Related Records
  const [searchQuery, setSearchQuery] = useState('');
  const [spdvFilter, setSpdvFilter] = useState('all');
  const [unitFilter, setUnitFilter] = useState('all');
  const [revenueTypeFilter, setRevenueTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Selected Record for Detail Drawer/Modal
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Resolve Title
  const chartTitle = initialChartTitle || 'Danh sách bản ghi doanh thu liên quan';

  // 1. FILTERED RECORDS LIST
  const records = useMemo(() => {
    return filterRevenueRecords({
      branchId: initialBranchId,
      chartKey: initialChartKey,
      selectedYear,
      selectedMonth,
      selectedQuarter,
      searchQuery,
      spdvFilter,
      unitFilter,
      revenueTypeFilter,
      statusFilter
    });
  }, [
    initialBranchId,
    initialChartKey,
    selectedYear,
    selectedMonth,
    selectedQuarter,
    searchQuery,
    spdvFilter,
    unitFilter,
    revenueTypeFilter,
    statusFilter
  ]);

  // Compute Records KPI summary
  const recordsSummary = useMemo(() => {
    return computeRecordsSummary(records);
  }, [records]);

  // Pagination slice
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return records.slice(start, start + pageSize);
  }, [records, currentPage, pageSize]);

  const totalPages = Math.ceil(records.length / pageSize) || 1;

  // Handle Export Excel
  const handleExportExcel = () => {
    try {
      const exportRows = records.map((r, i) => ({
        'STT': i + 1,
        'Mã Hợp đồng': r.contractCode,
        'Tên Hợp đồng': r.contractName,
        'Khách hàng': r.customer,
        'Nhóm SPDV': r.spdv,
        'Đơn vị thực hiện': r.unit,
        'Thời gian': `${r.month}/${r.year}`,
        'Ngày nghiệm thu': r.date,
        'Kế hoạch (Tr.đ)': r.kh,
        'Thực hiện (Tr.đ)': r.th,
        'Tỷ lệ hoàn thành (%)': `${r.rate}%`,
        'Phân loại doanh thu': r.revenueType,
        'Trạng thái chứng từ': r.statusLabel,
        'Hóa đơn VAT': r.invoiceNumber,
        'Phụ trách (AM)': r.am,
        'Ghi chú': r.note
      }));

      const ws = XLSX.utils.json_to_sheet(exportRows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'BanGhiDoanhThu');
      XLSX.writeFile(wb, `Danh_sach_ban_ghi_${initialBranchId}_${selectedYear}.xlsx`);
    } catch (err) {
      console.error('Export Excel failed:', err);
    }
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSpdvFilter('all');
    setUnitFilter('all');
    setRevenueTypeFilter('all');
    setStatusFilter('all');
    setCurrentPage(1);
  };

  return (
    <div className="revenue-chart-detail-view-page">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER & BREADCRUMB                                               */}
      {/* ========================================================================= */}
      <div className="chart-detail-nav-bar">
        <div className="chart-detail-nav-left">
          <button
            type="button"
            className="chart-detail-back-btn"
            onClick={onBack}
            title="Quay lại giao diện báo cáo biểu đồ"
          >
            <ArrowLeft size={16} />
            <span>Quay lại biểu đồ</span>
          </button>

          <div className="chart-detail-breadcrumb">
            <span className="crumb-root">Báo cáo Doanh thu</span>
            <span className="crumb-divider">/</span>
            <span className="crumb-active">{chartTitle}</span>
          </div>

          <span className="chart-detail-time-tag">
            {initialBranchId === 'month' ? `${selectedMonth}/${selectedYear}`
             : initialBranchId === 'quarter' ? `${selectedQuarter}/${selectedYear}`
             : `Năm ${selectedYear}`}
          </span>
        </div>

        {/* View Mode Switcher & Actions */}
        <div className="chart-detail-nav-right">
          <div className="view-mode-tab-group">
            <button
              type="button"
              className={`view-mode-tab-btn ${viewMode === 'records' ? 'active' : ''}`}
              onClick={() => setViewMode('records')}
            >
              <FileText size={15} />
              <span>Danh sách bản ghi ({records.length})</span>
            </button>
            <button
              type="button"
              className={`view-mode-tab-btn ${viewMode === 'summary_table' ? 'active' : ''}`}
              onClick={() => setViewMode('summary_table')}
            >
              <TableProperties size={15} />
              <span>Bảng tổng hợp chỉ tiêu</span>
            </button>
          </div>

          <button
            type="button"
            className="chart-detail-export-btn"
            onClick={handleExportExcel}
            title="Xuất dữ liệu danh sách bản ghi ra file Excel"
          >
            <Download size={14} />
            <span>Xuất Excel</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. EXECUTIVE SUMMARY KPIS (DÀNH CHO DANH SÁCH BẢN GHI)                   */}
      {/* ========================================================================= */}
      <div className="chart-detail-kpi-summary-grid">
        <div className="record-summary-card">
          <div className="record-card-icon-box blue">
            <FileText size={20} />
          </div>
          <div className="record-card-info">
            <div className="record-card-label">Tổng số bản ghi liên quan</div>
            <div className="record-card-number">{recordsSummary.totalCount} <span className="record-unit">hợp đồng</span></div>
            <div className="record-card-sub">Khớp với điều kiện lọc hiện tại</div>
          </div>
        </div>

        <div className="record-summary-card">
          <div className="record-card-icon-box rose">
            <DollarSign size={20} />
          </div>
          <div className="record-card-info">
            <div className="record-card-label">Tổng doanh thu thực hiện</div>
            <div className="record-card-number text-rose">
              {recordsSummary.totalTH.toLocaleString('vi-VN')} <span className="record-unit">Tr.đ</span>
            </div>
            <div className="record-card-sub">
              {(recordsSummary.totalTH / 1000).toFixed(2).replace('.', ',')} Tỷ đồng
            </div>
          </div>
        </div>

        <div className="record-summary-card">
          <div className="record-card-icon-box amber">
            <Layers size={20} />
          </div>
          <div className="record-card-info">
            <div className="record-card-label">Kế hoạch giao tương ứng</div>
            <div className="record-card-number">
              {recordsSummary.totalKH.toLocaleString('vi-VN')} <span className="record-unit">Tr.đ</span>
            </div>
            <div className="record-card-sub">
              Chênh lệch: <strong style={{ color: recordsSummary.diff >= 0 ? '#16a34a' : '#dc2626' }}>
                {(recordsSummary.diff >= 0 ? '+' : '') + recordsSummary.diff.toLocaleString('vi-VN')} Tr.đ
              </strong>
            </div>
          </div>
        </div>

        <div className="record-summary-card">
          <div className="record-card-icon-box green">
            <TrendingUp size={20} />
          </div>
          <div className="record-card-info">
            <div className="record-card-label">% Hoàn thành kế hoạch</div>
            <div className={`record-card-number ${recordsSummary.avgRate >= 100 ? 'text-green' : 'text-amber'}`}>
              {recordsSummary.avgRate}%
            </div>
            <div className="record-card-sub">
              {recordsSummary.passCount}/{recordsSummary.totalCount} bản ghi đạt ≥ 100%
            </div>
          </div>
        </div>

        <div className="record-summary-card">
          <div className="record-card-icon-box purple">
            <ShieldCheck size={20} />
          </div>
          <div className="record-card-info">
            <div className="record-card-label">Tình trạng hóa đơn VAT</div>
            <div className="record-card-number text-purple">
              {recordsSummary.invoicedCount}/{recordsSummary.totalCount}
            </div>
            <div className="record-card-sub">
              Tỷ lệ xuất HĐ: <strong>{recordsSummary.invoicedRate}%</strong>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. MAIN CONTENT: RELATED RECORDS LIST VIEW                                */}
      {/* ========================================================================= */}
      {viewMode === 'records' ? (
        <div className="records-list-container">
          {/* Smart Filter Toolbar */}
          <div className="records-filter-toolbar">
            <div className="records-search-box">
              <Search size={15} className="records-search-icon" />
              <input
                type="text"
                className="records-search-input"
                placeholder="Tìm theo Mã HĐ, Tên KH, Gói thầu, AM, Hóa đơn..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="records-clear-search-btn"
                  onClick={() => setSearchQuery('')}
                >
                  <X size={13} />
                </button>
              )}
            </div>

            <div className="records-dropdown-filters">
              {/* SPDV Filter */}
              <div className="filter-select-wrapper">
                <select
                  value={spdvFilter}
                  onChange={(e) => {
                    setSpdvFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="records-select"
                >
                  <option value="all">Tất cả Nhóm SPDV</option>
                  {SPDV_LIST.map((s, idx) => (
                    <option key={idx} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Unit Filter */}
              <div className="filter-select-wrapper">
                <select
                  value={unitFilter}
                  onChange={(e) => {
                    setUnitFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="records-select"
                >
                  <option value="all">Tất cả Đơn vị</option>
                  {UNIT_LIST.map((u, idx) => (
                    <option key={idx} value={u}>{u}</option>
                  ))}
                </select>
              </div>

              {/* Revenue Type Filter */}
              <div className="filter-select-wrapper">
                <select
                  value={revenueTypeFilter}
                  onChange={(e) => {
                    setRevenueTypeFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="records-select"
                >
                  <option value="all">Tất cả Loại doanh thu</option>
                  {REVENUE_TYPE_LIST.map((r, idx) => (
                    <option key={idx} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="filter-select-wrapper">
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="records-select"
                >
                  <option value="all">Tất cả Trạng thái</option>
                  {RECORD_STATUS_LIST.map((st) => (
                    <option key={st.id} value={st.id}>{st.label}</option>
                  ))}
                  <option value="pass">Đạt kế hoạch (≥ 100%)</option>
                  <option value="fail">Chưa đạt kế hoạch (&lt; 100%)</option>
                </select>
              </div>

              {/* Reset filter button */}
              {(searchQuery || spdvFilter !== 'all' || unitFilter !== 'all' || revenueTypeFilter !== 'all' || statusFilter !== 'all') && (
                <button
                  type="button"
                  className="records-reset-filter-btn"
                  onClick={handleResetFilters}
                  title="Xóa bộ lọc"
                >
                  <RefreshCw size={13} />
                  <span>Xóa lọc</span>
                </button>
              )}
            </div>
          </div>

          {/* Records Table */}
          <div className="records-table-wrapper">
            <table className="records-data-table">
              <thead>
                <tr>
                  <th style={{ width: '45px', textAlign: 'center' }}>STT</th>
                  <th style={{ width: '135px' }}>Mã Hợp đồng</th>
                  <th style={{ minWidth: '190px' }}>Khách hàng / Đối tác</th>
                  <th style={{ minWidth: '220px' }}>Nội dung gói thầu & dịch vụ</th>
                  <th style={{ width: '160px' }}>Nhóm SPDV</th>
                  <th style={{ width: '170px' }}>Đơn vị thực hiện</th>
                  <th style={{ width: '100px', textAlign: 'center' }}>Ngày NT</th>
                  <th style={{ width: '110px', textAlign: 'right' }}>Kế hoạch</th>
                  <th style={{ width: '115px', textAlign: 'right' }}>Thực hiện</th>
                  <th style={{ width: '115px', textAlign: 'center' }}>% Hoàn thành</th>
                  <th style={{ width: '130px' }}>Loại doanh thu</th>
                  <th style={{ width: '130px', textAlign: 'center' }}>Trạng thái</th>
                  <th style={{ width: '130px' }}>AM Phụ trách</th>
                  <th style={{ width: '80px', textAlign: 'center' }}>Chi tiết</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRecords.length > 0 ? (
                  paginatedRecords.map((item, index) => {
                    const stt = (currentPage - 1) * pageSize + index + 1;
                    const isPass = item.rate >= 100;
                    return (
                      <tr
                        key={item.id}
                        className="record-table-row"
                        onClick={() => setSelectedRecord(item)}
                      >
                        <td style={{ textAlign: 'center', color: '#64748b', fontWeight: '500' }}>
                          {stt}
                        </td>
                        <td>
                          <span className="record-code-link" title="Bấm để xem chi tiết bản ghi">
                            {item.contractCode}
                          </span>
                        </td>
                        <td>
                          <div className="record-customer-cell">
                            <span className="customer-avatar">
                              {item.customerShort?.slice(0, 2).toUpperCase() || 'KH'}
                            </span>
                            <div className="customer-info-box">
                              <span className="customer-name" title={item.customer}>{item.customer}</span>
                              <span className="customer-type-tag">{item.customerType}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="record-desc-cell" title={item.contractName}>
                            {item.contractName}
                          </div>
                        </td>
                        <td>
                          <span className="spdv-badge">{item.spdv}</span>
                        </td>
                        <td>
                          <div className="unit-name-cell" title={item.unit}>
                            <Building size={12} className="unit-icon" />
                            <span>{item.unit}</span>
                          </div>
                        </td>
                        <td style={{ textAlign: 'center', color: '#475569', fontSize: '12px' }}>
                          {item.date}
                        </td>
                        <td style={{ textAlign: 'right', color: '#64748b', fontWeight: '500' }}>
                          {item.kh.toLocaleString('vi-VN')}
                        </td>
                        <td style={{ textAlign: 'right', fontWeight: '800', color: '#e11d48' }}>
                          {item.th.toLocaleString('vi-VN')}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <div className="rate-cell-container">
                            <span className={`record-rate-pill ${isPass ? 'pass' : 'fail'}`}>
                              {item.rate}%
                            </span>
                            <div className="record-mini-bar-track">
                              <div
                                className={`record-mini-bar-fill ${isPass ? 'fill-green' : 'fill-rose'}`}
                                style={{ width: `${Math.min(item.rate, 100)}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`revenue-type-tag ${item.revenueType === 'Nội bộ tập đoàn' ? 'internal' : item.revenueType === 'Khách hàng Quốc tế' ? 'international' : 'external'}`}>
                            {item.revenueType}
                          </span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <span className={`record-status-pill status-${item.status}`}>
                            {item.statusLabel}
                          </span>
                        </td>
                        <td>
                          <div className="am-cell" title={item.am}>
                            <User size={12} className="am-icon" />
                            <span>{item.am}</span>
                          </div>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <button
                            type="button"
                            className="record-row-action-btn"
                            title="Xem chi tiết bản ghi này"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedRecord(item);
                            }}
                          >
                            <Eye size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="14" className="records-empty-state">
                      <div className="empty-box">
                        <AlertCircle size={32} color="#94a3b8" />
                        <p className="empty-title">Không tìm thấy bản ghi nào phù hợp</p>
                        <p className="empty-subtitle">Hãy thử thay đổi từ khóa tìm kiếm hoặc điều kiện lọc ở trên</p>
                        <button
                          type="button"
                          className="empty-reset-btn"
                          onClick={handleResetFilters}
                        >
                          Xóa bộ lọc
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {records.length > 0 && (
            <div className="records-pagination-bar">
              <div className="pagination-info">
                Hiển thị <strong>{Math.min((currentPage - 1) * pageSize + 1, records.length)}</strong> - <strong>{Math.min(currentPage * pageSize, records.length)}</strong> trên tổng số <strong>{records.length}</strong> bản ghi
              </div>

              <div className="pagination-controls">
                <div className="page-size-selector">
                  <span>Hiển thị:</span>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="page-size-select"
                  >
                    <option value={10}>10 dòng</option>
                    <option value={20}>20 dòng</option>
                    <option value={50}>50 dòng</option>
                  </select>
                </div>

                <div className="page-buttons">
                  <button
                    type="button"
                    className="page-nav-btn"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const pNum = idx + 1;
                    return (
                      <button
                        key={pNum}
                        type="button"
                        className={`page-num-btn ${currentPage === pNum ? 'active' : ''}`}
                        onClick={() => setCurrentPage(pNum)}
                      >
                        {pNum}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    className="page-nav-btn"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ========================================================================= */
        /* 4. TAB 2: AGGREGATED METRICS SUMMARY TABLE                                */
        /* ========================================================================= */
        <div className="chart-detail-table-card">
          <div className="chart-detail-table-header">
            <div className="table-header-title-box">
              <TableProperties size={18} color="#e11d48" />
              <h3 className="table-header-title">
                Bảng tổng hợp chỉ tiêu số liệu: <span>{chartTitle}</span>
              </h3>
            </div>
          </div>
          <div className="chart-detail-table-wrapper">
            <table className="chart-detail-erp-table">
              <thead>
                <tr>
                  <th style={{ width: '50px', textAlign: 'center' }}>STT</th>
                  <th style={{ textAlign: 'left', minWidth: '220px' }}>Chỉ tiêu / Nhóm</th>
                  <th style={{ width: '90px', textAlign: 'center' }}>Đơn vị</th>
                  <th style={{ width: '130px', textAlign: 'right' }}>Kế hoạch (KH)</th>
                  <th style={{ width: '130px', textAlign: 'right' }}>Thực hiện (TH)</th>
                  <th style={{ width: '130px', textAlign: 'right' }}>Chênh lệch (+/-)</th>
                  <th style={{ width: '140px', textAlign: 'center' }}>% Hoàn thành</th>
                  <th style={{ width: '110px', textAlign: 'center' }}>Đánh giá</th>
                </tr>
              </thead>
              <tbody>
                {SPDV_LIST.map((spdvName, idx) => {
                  const spdvRecords = records.filter(r => r.spdv === spdvName);
                  const sumKH = spdvRecords.reduce((acc, r) => acc + (r.kh || 0), 0);
                  const sumTH = spdvRecords.reduce((acc, r) => acc + (r.th || 0), 0);
                  const diff = sumTH - sumKH;
                  const rate = sumKH > 0 ? Math.round((sumTH / sumKH) * 100) : 100;
                  const isPass = rate >= 100;
                  return (
                    <tr key={idx}>
                      <td style={{ textAlign: 'center', fontWeight: '600', color: '#64748b' }}>{idx + 1}</td>
                      <td style={{ textAlign: 'left', fontWeight: '700', color: '#0f172a' }}>{spdvName}</td>
                      <td style={{ textAlign: 'center', color: '#64748b', fontSize: '12px' }}>Triệu đ</td>
                      <td style={{ textAlign: 'right', fontWeight: '600', color: '#475569' }}>{sumKH.toLocaleString('vi-VN')}</td>
                      <td style={{ textAlign: 'right', fontWeight: '800', color: '#e11d48' }}>{sumTH.toLocaleString('vi-VN')}</td>
                      <td style={{ textAlign: 'right', fontWeight: '700', color: diff >= 0 ? '#16a34a' : '#dc2626' }}>
                        {(diff >= 0 ? '+' : '') + diff.toLocaleString('vi-VN')}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span className={`rate-badge-pill ${isPass ? 'rate-pass' : 'rate-fail'}`}>
                          {rate}%
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span className={`status-pill ${isPass ? 'pill-green' : 'pill-red'}`}>
                          {isPass ? 'Đạt' : 'Chưa đạt'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MODAL CHI TIẾT BẢN GHI (RECORD DETAIL MODAL)                          */}
      {/* ========================================================================= */}
      {selectedRecord && (
        <div className="record-modal-backdrop" onClick={() => setSelectedRecord(null)}>
          <div className="record-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="record-modal-header">
              <div className="modal-header-left">
                <div className="modal-title-row">
                  <span className="modal-code-badge">{selectedRecord.contractCode}</span>
                  <span className={`record-status-pill status-${selectedRecord.status}`}>
                    {selectedRecord.statusLabel}
                  </span>
                </div>
                <h2 className="modal-contract-title">{selectedRecord.contractName}</h2>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setSelectedRecord(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="record-modal-body">
              {/* Financial Summary Highlight */}
              <div className="modal-kpi-highlight-row">
                <div className="modal-kpi-item">
                  <span className="modal-kpi-label">Doanh thu Thực hiện (TH)</span>
                  <span className="modal-kpi-val text-rose">{selectedRecord.th.toLocaleString('vi-VN')} Tr.đ</span>
                </div>
                <div className="modal-kpi-item">
                  <span className="modal-kpi-label">Kế hoạch Giao (KH)</span>
                  <span className="modal-kpi-val">{selectedRecord.kh.toLocaleString('vi-VN')} Tr.đ</span>
                </div>
                <div className="modal-kpi-item">
                  <span className="modal-kpi-label">Tỷ lệ Hoàn thành</span>
                  <span className={`modal-kpi-val ${selectedRecord.rate >= 100 ? 'text-green' : 'text-amber'}`}>
                    {selectedRecord.rate}%
                  </span>
                </div>
                <div className="modal-kpi-item">
                  <span className="modal-kpi-label">Chênh lệch (+/-)</span>
                  <span className={`modal-kpi-val ${selectedRecord.th - selectedRecord.kh >= 0 ? 'text-green' : 'text-rose'}`}>
                    {(selectedRecord.th - selectedRecord.kh >= 0 ? '+' : '') + (selectedRecord.th - selectedRecord.kh).toFixed(1)} Tr.đ
                  </span>
                </div>
              </div>

              {/* Detailed Specs Grid */}
              <div className="modal-specs-grid">
                <div className="spec-group">
                  <h4 className="spec-group-title">
                    <Building size={14} /> Thông tin Khách hàng & Đối tác
                  </h4>
                  <div className="spec-row">
                    <span className="spec-label">Khách hàng:</span>
                    <strong className="spec-value">{selectedRecord.customer}</strong>
                  </div>
                  <div className="spec-row">
                    <span className="spec-label">Phân khúc:</span>
                    <span className="spec-value">{selectedRecord.customerType}</span>
                  </div>
                  <div className="spec-row">
                    <span className="spec-label">Phân loại DT:</span>
                    <span className="spec-value">{selectedRecord.revenueType}</span>
                  </div>
                </div>

                <div className="spec-group">
                  <h4 className="spec-group-title">
                    <Briefcase size={14} /> Dịch vụ & Đơn vị phụ trách
                  </h4>
                  <div className="spec-row">
                    <span className="spec-label">Nhóm SPDV:</span>
                    <strong className="spec-value">{selectedRecord.spdv}</strong>
                  </div>
                  <div className="spec-row">
                    <span className="spec-label">Đơn vị thực hiện:</span>
                    <span className="spec-value">{selectedRecord.unit}</span>
                  </div>
                  <div className="spec-row">
                    <span className="spec-label">AM Phụ trách:</span>
                    <strong className="spec-value">{selectedRecord.am}</strong>
                  </div>
                </div>

                <div className="spec-group">
                  <h4 className="spec-group-title">
                    <Clock size={14} /> Tiến độ ghi nhận & Chứng từ
                  </h4>
                  <div className="spec-row">
                    <span className="spec-label">Ngày nghiệm thu:</span>
                    <strong className="spec-value">{selectedRecord.date}</strong>
                  </div>
                  <div className="spec-row">
                    <span className="spec-label">Kỳ báo cáo:</span>
                    <span className="spec-value">{selectedRecord.month}/{selectedRecord.year} ({selectedRecord.quarter})</span>
                  </div>
                  <div className="spec-row">
                    <span className="spec-label">Số hóa đơn VAT:</span>
                    <strong className="spec-value text-blue">{selectedRecord.invoiceNumber}</strong>
                  </div>
                </div>

                <div className="spec-group">
                  <h4 className="spec-group-title">
                    <FileText size={14} /> Ghi chú đối soát
                  </h4>
                  <p className="spec-note-content">{selectedRecord.note || 'Không có ghi chú thêm.'}</p>
                </div>
              </div>
            </div>

            <div className="record-modal-footer">
              <button
                type="button"
                className="modal-footer-secondary-btn"
                onClick={() => setSelectedRecord(null)}
              >
                Đóng
              </button>
              <button
                type="button"
                className="modal-footer-primary-btn"
                onClick={() => {
                  alert(`Đang mở hồ sơ nghiệm thu chi tiết của hợp đồng: ${selectedRecord.contractCode}`);
                }}
              >
                <ExternalLink size={14} />
                <span>Xem hồ sơ hợp đồng</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
