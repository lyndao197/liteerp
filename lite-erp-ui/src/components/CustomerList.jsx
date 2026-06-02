import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  FileText,
  ChevronRight,
  Calendar,
  CheckSquare,
  StickyNote,
  Filter,
  ChevronUp,
  ChevronDown,
  Download,
  Upload,
  Settings,
  SlidersHorizontal,
  TrendingUp,
  TrendingDown,
  Minus,
  MoreVertical,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  Trash2
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { mockStore } from '../utils/mockStore';
import { QueryBuilder } from './QueryBuilder';
import { evaluateQuery } from '../utils/filterUtils';
import './CustomerList.css';

const CustomerList = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('Chính thức'); // 'Chính thức' | 'Dự thảo/Mới tạo'

  // SORT & FILTER STATE
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [filters, setFilters] = useState({});
  const [activeFilterCol, setActiveFilterCol] = useState(null);
  const [filterSearchTerm, setFilterSearchTerm] = useState({});

  // ADVANCED FILTER
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [advancedQuery, setAdvancedQuery] = useState({
    id: 'root',
    combinator: 'AND',
    rules: []
  });

  // PAGINATION & VIEW MODE
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'grid'
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  // SELECTION & COLUMN VISIBILITY
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [showColPicker, setShowColPicker] = useState(false);
  const [pickerPos, setPickerPos] = useState({ top: 0, right: 0 });
  const [visibleColumns, setVisibleColumns] = useState(['id_kh', 'name', 'mst', 'industry', 'tag', 'companyPhone', 'contactName', 'email', 'contactPhone']);

  // COLUMN DEFINITIONS FOR QUERY BUILDER
  const COLUMN_OPTIONS = [
    { key: 'id_kh', label: 'ID khách hàng' },
    { key: 'name', label: 'Khách hàng' },
    { key: 'mst', label: 'Mã số thuế' },
    { key: 'industry', label: 'Lĩnh vực' },
    { key: 'tag', label: 'Tag' },
    { key: 'companyPhone', label: 'SĐT Công ty' },
    { key: 'contactName', label: 'Tên liên hệ' },
    { key: 'email', label: 'Email liên hệ' },
    { key: 'contactPhone', label: 'SĐT liên hệ' }
  ];

  useEffect(() => {
    setCustomers(mockStore.getAllCustomers());
  }, []);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    else if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = null;
      key = null;
    }
    setSortConfig({ key, direction });
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => {
      const colFilters = prev[key] || [];
      const isSelected = colFilters.includes(value);
      const newFilters = isSelected ? colFilters.filter(v => v !== value) : [...colFilters, value];
      if (newFilters.length === 0) {
        const { [key]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [key]: newFilters };
    });
  };

  const getDistinctValues = (key) => {
    return [...new Set(customers.map(c => c[key] || ''))].filter(Boolean);
  };

  const getCustomerStatus = (customerId) => {
    const contracts = mockStore.getAllContracts().filter(c => c.customerId === customerId);
    if (!contracts || contracts.length === 0) return 'Mới tạo';
    const hasOfficial = contracts.some(c => 
      ['Hiệu lực', 'Tạm dừng', 'Sửa đổi gia hạn', 'Chấm dứt hợp đồng', 'Hoàn thành'].includes(c.approvalStatus)
    );
    if (hasOfficial) return 'Chính thức';
    return 'Dự thảo';
  };

  const processedCustomers = useMemo(() => {
    let result = customers.filter(c => {
      const status = getCustomerStatus(c.id);
      if (activeTab === 'Chính thức') return status === 'Chính thức';
      return status === 'Dự thảo' || status === 'Mới tạo';
    });

    // 1. Search
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(c =>
        (c.name || '').toLowerCase().includes(lowerSearch) ||
        (c.mst || '').includes(searchTerm) ||
        (c.contractNo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.id || '').toLowerCase().includes(lowerSearch)
      );
    }

    // 2. Filters
    Object.keys(filters).forEach(key => {
      if (filters[key].length > 0) {
        result = result.filter(c => filters[key].includes(c[key]));
      }
    });

    // 3. Advanced Query Filter
    if (advancedQuery && advancedQuery.rules.length > 0) {
      result = result.filter(c => evaluateQuery(c, advancedQuery));
    }

    // 4. Sort
    if (sortConfig.key) {
      result.sort((a, b) => {
        const valA = a[sortConfig.key] || '';
        const valB = b[sortConfig.key] || '';
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [customers, searchTerm, filters, sortConfig, advancedQuery, activeTab]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters, advancedQuery, sortConfig, activeTab]);

  const totalItems = processedCustomers.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const paginatedData = processedCustomers.slice((safeCurrentPage - 1) * pageSize, safeCurrentPage * pageSize);

  // Statistics Metrics
  const stats = useMemo(() => {
    const total = customers.length;
    const internalCount = customers.filter(c => c.classification === 'Nội bộ' || (c.tag && c.tag.includes('Nội bộ'))).length || 2;
    const externalCount = Math.max(0, total - internalCount);
    return { total, internalCount, externalCount };
  }, [customers]);

  // --- SELECTION LOGIC ---
  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedData.length && paginatedData.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedData.map(c => c.id)));
    }
  };

  const toggleSelectRow = (e, id) => {
    e.stopPropagation();
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedIds(newSelected);
  };

  const handleExport = () => {
    const exportData = processedCustomers
      .filter(c => selectedIds.size === 0 || selectedIds.has(c.id))
      .map(c => ({
        'ID Khách hàng': c.id,
        'Khách hàng': c.name,
        'Mã số thuế': c.mst,
        'Lĩnh vực': c.industry || 'Lĩnh vực',
        'Số hợp đồng': c.contractNo || '',
        'Ngày ký': c.signedDate,
        'Nguồn': c.source
      }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Customers");
    XLSX.writeFile(wb, `Danh_sach_khach_hang_${new Date().getTime()}.xlsx`);
  };

  const handleDeleteMany = () => {
    if (selectedIds.size === 0) return;
    if (confirm(`Bạn có chắc chắn muốn xóa ${selectedIds.size} khách hàng đã chọn?`)) {
      mockStore.deleteMultipleCustomers(Array.from(selectedIds));
      setCustomers(mockStore.getAllCustomers());
      setSelectedIds(new Set());
    }
  };

  const TableHeader = ({ label, columnKey, hasFilter = false }) => {
    if (!visibleColumns.includes(columnKey)) return null;
    return (
      <th onClick={() => handleSort(columnKey)} style={{ position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', flex: 1 }}>
            {label}
            <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '6px', color: sortConfig.key === columnKey ? '#0f172a' : '#cbd5e1' }}>
              <ChevronUp size={12} style={{ marginBottom: '-4px', opacity: sortConfig.key === columnKey && sortConfig.direction === 'desc' ? 0.3 : 1 }} />
              <ChevronDown size={12} style={{ opacity: sortConfig.key === columnKey && sortConfig.direction === 'asc' ? 0.3 : 1 }} />
            </div>
          </div>
          {hasFilter && (
            <div onClick={(e) => { e.stopPropagation(); setActiveFilterCol(activeFilterCol === columnKey ? null : columnKey); }} style={{ cursor: 'pointer', color: filters[columnKey]?.length > 0 ? '#e32b4c' : '#94a3b8' }}>
              <Filter size={14} />
            </div>
          )}
        </div>

        {activeFilterCol === columnKey && (
          <div className="column-filter-popup" onClick={e => e.stopPropagation()} style={{ position: 'absolute', top: '100%', right: 0, zIndex: 10, background: 'white', border: '1px solid #cbd5e1', borderRadius: '4px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', minWidth: '180px', padding: '8px', fontWeight: 'normal', color: '#334155' }}>
            <div style={{ marginBottom: '8px', fontWeight: 600, fontSize: '12px', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px' }}>Lọc: {label}</div>
            <div style={{ padding: '0 4px 8px 4px' }}>
              <input type="text" placeholder="Tìm..." value={filterSearchTerm[columnKey] || ''} onChange={e => setFilterSearchTerm({...filterSearchTerm, [columnKey]: e.target.value})} style={{ width: '100%', padding: '4px 8px', fontSize: '11px', border: '1px solid #e2e8f0', borderRadius: '4px', outline: 'none' }} />
            </div>
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {getDistinctValues(columnKey)
                .filter(v => (v || '').toLowerCase().includes((filterSearchTerm[columnKey] || '').toLowerCase()))
                .map(val => (
                <label key={val} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', padding: '4px 0', cursor: 'pointer' }}>
                  <input type="checkbox" checked={filters[columnKey]?.includes(val) || false} onChange={() => handleFilterChange(columnKey, val)} />
                  {val}
                </label>
              ))}
            </div>
          </div>
        )}
      </th>
    );
  };

  return (
    <div className="customer-list-container" onClick={() => setActiveFilterCol(null)}>
      
      {/* Header section */}
      <div className="customer-list-header">
        <div className="header-left">
          <h1>Quản lý hồ sơ khách hàng</h1>
          <p style={{ color: '#64748b', fontSize: '12px', margin: '4px 0 0 0', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.6px' }}>
            Hiện có {totalItems} khách hàng chiến lược đã được xác minh đang hoạt động trong hệ sinh thái.
          </p>
        </div>
      </div>

      {/* Stats Cards (Figma Aesthetics) */}
      <div className="metrics-cards-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '24px' }}>
        <div className="metric-card" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: '-8px', bottom: '-8px', opacity: 0.05 }}>
            <FileText size={96} color="#e03" />
          </div>
          <span className="metric-label">Tổng khách hàng thêm mới</span>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%' }}>
            <span className="metric-value" style={{ fontSize: '24px', fontWeight: 700, color: '#000', lineHeight: '32px' }}>{stats.total}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10B981', fontSize: '13px', fontWeight: 700 }}>
              <TrendingUp size={16} strokeWidth={2.5} /> +12%
            </div>
          </div>
        </div>

        <div className="metric-card" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: '-8px', bottom: '-8px', opacity: 0.05 }}>
            <SlidersHorizontal size={96} color="#3b82f6" />
          </div>
          <span className="metric-label">Tổng khách hàng nội bộ</span>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%' }}>
            <span className="metric-value" style={{ fontSize: '24px', fontWeight: 700, color: '#000', lineHeight: '32px' }}>{stats.internalCount}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#3B82F6', fontSize: '13px', fontWeight: 700 }}>
              <TrendingUp size={16} strokeWidth={2.5} /> +5%
            </div>
          </div>
        </div>

        <div className="metric-card" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: '-8px', bottom: '-8px', opacity: 0.05 }}>
            <MapPin size={96} color="#f59e0b" />
          </div>
          <span className="metric-label">Tổng khách hàng ngoài</span>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%' }}>
            <span className="metric-value" style={{ fontSize: '24px', fontWeight: 700, color: '#000', lineHeight: '32px' }}>{stats.externalCount}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#F59E0B', fontSize: '13px', fontWeight: 700 }}>
              <TrendingUp size={16} strokeWidth={2.5} /> +8%
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '24px', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
        <div 
          onClick={() => { setActiveTab('Chính thức'); setSelectedIds(new Set()); }}
          style={{ cursor: 'pointer', fontWeight: 600, paddingBottom: '8px', borderBottom: activeTab === 'Chính thức' ? '2px solid #e03' : 'none', color: activeTab === 'Chính thức' ? '#e03' : '#64748b' }}>
          Khách hàng chính thức
        </div>
        <div 
          onClick={() => { setActiveTab('Dự thảo/Mới tạo'); setSelectedIds(new Set()); }}
          style={{ cursor: 'pointer', fontWeight: 600, paddingBottom: '8px', borderBottom: activeTab === 'Dự thảo/Mới tạo' ? '2px solid #e03' : 'none', color: activeTab === 'Dự thảo/Mới tạo' ? '#e03' : '#64748b' }}>
          Draft/Dự thảo & Mới tạo
        </div>
      </div>

      {/* Toolbar */}
      <div className="list-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', background: 'white', padding: '24px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <div className="search-group" style={{ position: 'relative', display: 'flex', gap: '24px', alignItems: 'center' }}>
            <div className="contact-search-box" style={{ width: '434px', position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#44494D' }} />
              <input type="text" placeholder="Tìm kiếm ..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ padding: '10px 16px 10px 44px', borderRadius: '8px', border: '1px solid #E2E8F0', background: '#F8F8F8', fontSize: '14px', width: '100%', outline: 'none', color: '#44494D' }} />
            </div>

            <button className={`btn-search ${showAdvancedFilter ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#e03', color: 'white', height: '40px', padding: '0 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }} onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}>
              <Filter size={16} /> Lọc nâng cao
            </button>
            {showAdvancedFilter && (
              <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', zIndex: 100, width: '500px', textAlign: 'left', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', border: '1px solid #cbd5e1', borderRadius: '8px', background: 'white', overflow: 'hidden' }}>
                <div style={{ padding: '12px 16px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, color: '#0f172a', fontSize: '14px' }}>Bộ lọc phức tạp</span>
                  <button style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '13px' }} onClick={() => setShowAdvancedFilter(false)}>Đóng</button>
                </div>
                <div style={{ padding: '16px', maxHeight: '400px', overflowY: 'auto' }}>
                  <QueryBuilder query={advancedQuery} fields={COLUMN_OPTIONS} onChange={setAdvancedQuery} />
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {activeTab === 'Dự thảo/Mới tạo' && selectedIds.size > 0 && (
              <button className="btn-outline-brand" onClick={handleDeleteMany} title="Xóa khách hàng" style={{ border: '1px solid #ef4444', color: '#ef4444', background: '#fef2f2', height: '40px', padding: '0 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
                <Trash2 size={18} /> Xóa ({selectedIds.size})
              </button>
            )}
            <button className="btn-outline-brand" onClick={() => navigate('/customer/new')} style={{ border: '1px solid #f45476', color: '#e03', background: 'transparent', height: '40px', padding: '0 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
              <Plus size={18} /> Thêm khách hàng
            </button>
            <button className="btn-outline-brand" onClick={handleExport} style={{ border: '1px solid #f45476', color: '#e03', background: 'transparent', height: '40px', padding: '0 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
              <Download size={18} /> Xuất Excel
            </button>
          </div>
          <div className="view-switcher" style={{ background: '#EFEDED', padding: '4px', borderRadius: '8px', display: 'flex', gap: '4px', height: '40px', alignItems: 'center', boxSizing: 'border-box' }}>
             <button className={`view-btn-modern ${viewMode === 'grid' ? 'active' : ''}`} style={{ border: 'none', background: viewMode === 'grid' ? 'white' : 'transparent', color: viewMode === 'grid' ? '#e32b4c' : '#64748b', width: '32px', height: '32px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setViewMode('grid')} title="Giao diện Grid"><LayoutGrid size={16} /></button>
             <button className={`view-btn-modern ${viewMode === 'list' ? 'active' : ''}`} style={{ border: 'none', background: viewMode === 'list' ? 'white' : 'transparent', color: viewMode === 'list' ? '#e32b4c' : '#64748b', width: '32px', height: '32px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setViewMode('list')} title="Giao diện List"><List size={16} /></button>
          </div>
        </div>
      </div>

      {/* Grid or List Content */}
      {processedCustomers.length === 0 ? (
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '80px', textAlign: 'center', color: '#64748b' }}>
          <Search size={48} style={{ margin: '0 auto 16px', display: 'block', opacity: 0.5 }} />
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b' }}>Không tìm thấy dữ liệu khách hàng</h3>
          <p style={{ fontSize: '13px', marginTop: '4px' }}>Hãy thử điều chỉnh từ khóa tìm kiếm hoặc các cột lọc.</p>
        </div>
      ) : viewMode === 'list' ? (
        /* List view: Custom table */
        <div className="customer-table-container">
          <table className="customer-table">
            <thead>
              <tr>
                <th style={{ width: '40px', paddingLeft: '16px' }}>
                  <input type="checkbox" checked={selectedIds.size === paginatedData.length && paginatedData.length > 0} onChange={toggleSelectAll} />
                </th>
                <TableHeader label="ID khách hàng" columnKey="id_kh" hasFilter={true} />
                <TableHeader label="Khách hàng" columnKey="name" hasFilter={true} />
                <TableHeader label="Mã số thuế" columnKey="mst" hasFilter={true} />
                <TableHeader label="Lĩnh vực" columnKey="industry" hasFilter={true} />
                <TableHeader label="Tag" columnKey="tag" hasFilter={true} />
                <TableHeader label="SĐT Công ty" columnKey="companyPhone" hasFilter={true} />
                <TableHeader label="Tên liên hệ" columnKey="contactName" hasFilter={true} />
                <TableHeader label="Email liên hệ" columnKey="email" hasFilter={true} />
                <TableHeader label="SĐT liên hệ" columnKey="contactPhone" hasFilter={true} />
                <th style={{ textAlign: 'center', cursor: 'pointer', width: '40px' }} onClick={(e) => {
                  e.stopPropagation();
                  if (!showColPicker) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setPickerPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
                  }
                  setShowColPicker(!showColPicker);
                }}>
                  <SlidersHorizontal size={16} color="#94a3b8" />
                  {showColPicker && createPortal(
                    <div className="column-picker-popup" onClick={e => e.stopPropagation()} style={{ position: 'fixed', top: `${pickerPos.top}px`, right: `${pickerPos.right}px`, zIndex: 9999, background: 'white', border: '1px solid #cbd5e1', borderRadius: '4px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', minWidth: '150px', padding: '8px', fontWeight: 'normal', textAlign: 'left' }}>
                      <div style={{ marginBottom: '8px', fontWeight: 600, fontSize: '12px', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px', color: '#1e293b' }}>Hiển thị cột</div>
                      {['id_kh', 'name', 'mst', 'industry', 'tag', 'companyPhone', 'contactName', 'email', 'contactPhone'].map(key => {
                        const labelMap = { id_kh: 'ID khách hàng', name: 'Khách hàng', mst: 'Mã số thuế', industry: 'Lĩnh vực', tag: 'Tag', companyPhone: 'SĐT Công ty', contactName: 'Tên liên hệ', email: 'Email liên hệ', contactPhone: 'SĐT liên hệ' };
                        return (
                          <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0', fontSize: '13px', cursor: 'pointer', color: '#334155' }}>
                            <input type="checkbox" checked={visibleColumns.includes(key)} onChange={() => {
                              setVisibleColumns(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
                            }} />
                            {labelMap[key]}
                          </label>
                        );
                      })}
                    </div>,
                    document.body
                  )}
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map(customer => {
                return (
                  <tr key={customer.id} onClick={() => navigate(`/customer/edit/${customer.id}`)} className={selectedIds.has(customer.id) ? 'row-selected' : ''}>
                    <td style={{ paddingLeft: '16px' }} onClick={(e) => toggleSelectRow(e, customer.id)}>
                      <input type="checkbox" checked={selectedIds.has(customer.id)} readOnly onClick={(e) => e.stopPropagation()} />
                    </td>
                    {visibleColumns.includes('id_kh') && (
                      <td className="id-col" style={{ fontWeight: 600, color: '#2563eb' }}>
                        {customer.id}
                      </td>
                    )}
                    {visibleColumns.includes('name') && (
                      <td>
                        <div style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <div style={{ fontWeight: 700, color: '#000000', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '14px' }}>{customer.name}</div>
                          <div style={{ fontSize: '11px', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{customer.email || 'user@example.com'}</div>
                        </div>
                      </td>
                    )}
                    {visibleColumns.includes('mst') && <td style={{ fontWeight: 500 }}>{customer.mst || '0300588569'}</td>}
                    {visibleColumns.includes('industry') && (
                      <td>
                        <span style={{ padding: '3px 9px', borderRadius: '9999px', backgroundColor: '#e0e7ff', color: '#3730a3', fontSize: '12px', border: '1px solid #E0E7FF', display: 'inline-flex', fontWeight: 600 }}>
                          {customer.industry || 'Chưa rõ'}
                        </span>
                      </td>
                    )}
                    {visibleColumns.includes('tag') && (
                      <td>
                        <span style={{ padding: '3px 9px', borderRadius: '4px', backgroundColor: '#FEF8E9', color: '#F2BB24', fontSize: '12px', border: '1px solid #F0F0F0', display: 'inline-flex', fontWeight: 600 }}>
                          {customer.tag || 'Tiềm năng'}
                        </span>
                      </td>
                    )}
                    {visibleColumns.includes('companyPhone') && <td>{customer.companyPhone || customer.phone || ''}</td>}
                    {visibleColumns.includes('contactName') && <td>{mockStore.getContactsByCompany(customer.id)?.[0]?.name || ''}</td>}
                    {visibleColumns.includes('email') && <td>{mockStore.getContactsByCompany(customer.id)?.[0]?.email || ''}</td>}
                    {visibleColumns.includes('contactPhone') && <td>{mockStore.getContactsByCompany(customer.id)?.[0]?.phone || ''}</td>}
                    <td style={{ textAlign: 'center' }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/customer/edit/${customer.id}`); }}
                        style={{ border: '1px solid #f45476', color: '#e03', background: 'transparent', height: '28px', padding: '0 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}
                      >
                        Chi tiết
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* Grid view: Cards */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {paginatedData.map(customer => {
            const firstLetter = customer.name ? customer.name.charAt(0).toUpperCase() : 'C';
            return (
              <div 
                key={customer.id} 
                onClick={() => navigate(`/customer/edit/${customer.id}`)}
                style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '16px', transition: 'all 0.2s', position: 'relative' }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: '#fff0f2', color: '#e03', border: '1px solid #ffe0e4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px' }}>
                    {firstLetter}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', overflow: 'hidden' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {customer.name}
                    </h4>
                    <span style={{ display: 'inline-flex', padding: '2px 8px', borderRadius: '100px', backgroundColor: '#f1f5f9', color: '#475569', fontSize: '10px', width: 'fit-content', fontWeight: 'bold' }}>
                      {customer.id}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b' }}>
                    <SlidersHorizontal size={14} />
                    <span style={{ fontWeight: 500 }}>MST: {customer.mst || '0300588569'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b' }}>
                    <Mail size={14} />
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{customer.email || '—'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b' }}>
                    <Phone size={14} />
                    <span>{customer.phone || '—'}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                  <span style={{ padding: '3px 9px', borderRadius: '9999px', backgroundColor: '#e0e7ff', color: '#3730a3', fontSize: '10px', fontWeight: 600 }}>
                    {customer.industry || 'Chưa rõ'}
                  </span>
                  <span style={{ padding: '3px 9px', borderRadius: '4px', backgroundColor: '#FEF8E9', color: '#F2BB24', fontSize: '10px', fontWeight: 600 }}>
                    {customer.tag || 'Tiềm năng'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Footer */}
      {processedCustomers.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px', borderTop: '1px solid #E2E8F0', background: 'white', borderRadius: '0 0 8px 8px', marginTop: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ color: '#64748b', fontSize: '13px' }}>
            Hiển thị <span style={{ fontWeight: 600, color: '#0f172a' }}>{(safeCurrentPage - 1) * pageSize + 1}</span> - <span style={{ fontWeight: 600, color: '#0f172a' }}>{Math.min(safeCurrentPage * pageSize, totalItems)}</span> trong số <span style={{ fontWeight: 600, color: '#0f172a' }}>{totalItems}</span> khách hàng
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button 
              onClick={() => setCurrentPage(1)} 
              disabled={safeCurrentPage === 1}
              style={{ border: '1px solid #cbd5e1', borderRadius: '8px', padding: '6px', background: 'white', cursor: safeCurrentPage === 1 ? 'not-allowed' : 'pointer', opacity: safeCurrentPage === 1 ? 0.4 : 1 }}
            >
              <ChevronsLeft size={16} />
            </button>
            <button 
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} 
              disabled={safeCurrentPage === 1}
              style={{ border: '1px solid #cbd5e1', borderRadius: '8px', padding: '6px', background: 'white', cursor: safeCurrentPage === 1 ? 'not-allowed' : 'pointer', opacity: safeCurrentPage === 1 ? 0.4 : 1 }}
            >
              <ChevronLeft size={16} />
            </button>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#334155', padding: '0 8px' }}>
              Trang {safeCurrentPage} / {totalPages}
            </div>
            <button 
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} 
              disabled={safeCurrentPage === totalPages}
              style={{ border: '1px solid #cbd5e1', borderRadius: '8px', padding: '6px', background: 'white', cursor: safeCurrentPage === totalPages ? 'not-allowed' : 'pointer', opacity: safeCurrentPage === totalPages ? 0.4 : 1 }}
            >
              <ChevronRight size={16} />
            </button>
            <button 
              onClick={() => setCurrentPage(totalPages)} 
              disabled={safeCurrentPage === totalPages}
              style={{ border: '1px solid #cbd5e1', borderRadius: '8px', padding: '6px', background: 'white', cursor: safeCurrentPage === totalPages ? 'not-allowed' : 'pointer', opacity: safeCurrentPage === totalPages ? 0.4 : 1 }}
            >
              <ChevronsRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerList;
