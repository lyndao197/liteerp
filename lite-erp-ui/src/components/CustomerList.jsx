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
  MoreVertical
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

  // SORT & FILTER STATE
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [filters, setFilters] = useState({});
  const [activeFilterCol, setActiveFilterCol] = useState(null);

  // ADVANCED FILTER
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [advancedQuery, setAdvancedQuery] = useState({
    id: 'root',
    combinator: 'AND',
    rules: []
  });

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // SELECTION & COLUMN VISIBILITY
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [showColPicker, setShowColPicker] = useState(false);
  const [pickerPos, setPickerPos] = useState({ top: 0, right: 0 });
  const [visibleColumns, setVisibleColumns] = useState(['id_kh', 'name', 'mst', 'domain', 'contractValue', 'signedDate', 'source']);

  // COLUMN DEFINITIONS FOR QUERY BUILDER
  const COLUMN_OPTIONS = [
    { key: 'id_kh', label: 'ID khách hàng' },
    { key: 'name', label: 'Khách hàng' },
    { key: 'mst', label: 'Mã số thuế' },
    { key: 'domain', label: 'Dịch vụ' },
    { key: 'contractValue', label: 'Số hợp đồng' },
    { key: 'signedDate', label: 'Ngày ký' },
    { key: 'source', label: 'Nguồn' }
  ];

  useEffect(() => {
    setCustomers(mockStore.getAllCustomers());
  }, []);

  const getInitials = (name) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

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

  const processedCustomers = useMemo(() => {
    let result = [...customers];

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
  }, [customers, searchTerm, filters, sortConfig, advancedQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters, advancedQuery, sortConfig]);

  const totalItems = processedCustomers.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const paginatedData = processedCustomers.slice((safeCurrentPage - 1) * pageSize, safeCurrentPage * pageSize);

  const renderActivityIcons = (activities = []) => {
    if (!activities || activities.length === 0) return null;
    const iconMap = {
      'Gọi': { icon: <Phone size={14} />, color: '#3b82f6' },
      'Meeting': { icon: <Calendar size={14} />, color: '#8b5cf6' },
      'Email': { icon: <Mail size={14} />, color: '#10b981' },
      'Task': { icon: <CheckSquare size={14} />, color: '#f59e0b' },
      'Ghi chú': { icon: <StickyNote size={14} />, color: '#64748b' }
    };
    const activeTypes = new Set();
    activities.forEach(act => {
      const title = act.title.toLowerCase();
      if (title.includes('gọi') || title.includes('goi') || title.includes('call') || title.includes('điện thoại')) activeTypes.add('Gọi');
      else if (title.includes('họp') || title.includes('hop') || title.includes('meeting') || title.includes('lịch') || title.includes('meet')) activeTypes.add('Meeting');
      else if (title.includes('email') || title.includes('thư') || title.includes('thu') || title.includes('mail')) activeTypes.add('Email');
      else if (title.includes('công việc') || title.includes('cv') || title.includes('task') || title.includes('giao')) activeTypes.add('Task');
      else activeTypes.add('Ghi chú');
    });
    return (
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        {[...activeTypes].map(type => (
          <div key={type} title={type} style={{ color: iconMap[type]?.color || '#94a3b8', display: 'flex', alignItems: 'center' }}>{iconMap[type]?.icon || <FileText size={14} />}</div>
        ))}
      </div>
    );
  };

  // --- SELECTION LOGIC ---
  const toggleSelectAll = () => {
    if (selectedIds.size === processedCustomers.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(processedCustomers.map(c => c.id)));
    }
  };

  const toggleSelectRow = (e, id) => {
    e.stopPropagation();
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedIds(newSelected);
  };

  // --- IMPORT / EXPORT LOGIC (ODoo Style) ---
  const handleExport = () => {
    const exportData = processedCustomers
      .filter(c => selectedIds.size === 0 || selectedIds.has(c.id))
      .map(c => ({
        'ID Khách hàng': c.id,
        'Khách hàng': c.name,
        'Mã số thuế': c.mst,
        'Dịch vụ': c.domain || 'Dịch vụ',
        'Số hợp đồng': c.contractNo || '1,000,000,000',
        'Ngày ký': c.signedDate,
        'Nguồn': c.source
      }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Customers");
    XLSX.writeFile(wb, `Danh_sach_khach_hang_${new Date().getTime()}.xlsx`);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);

      if (customers.length > 0) {
        if (!confirm(`Bảng danh sách Khách hàng hiện tại đang có dữ liệu. Bạn có muốn ghi đè dữ liệu hiện tại không?`)) {
          return;
        }
      }

      // Map English/Vietnamese headers to object fields
      const mappedData = data.map((item, idx) => ({
        id: item['ID Khách hàng'] || `CUS-IMPORT-${idx}`,
        name: item['Tên khách hàng'] || item['Name'] || 'Chưa rõ',
        mst: item['Mã số thuế'] || item['MST'] || '',
        domain: item['Dịch vụ'] || '',
        contractNo: item['Số hợp đồng'] || '',
        signedDate: item['Ngày ký'] || '',
        source: 'Import'
      }));

      mappedData.forEach(c => mockStore.saveCustomer(c.id, c));
      setCustomers(mockStore.getAllCustomers());
      alert(`Đã import thành công ${mappedData.length} bản ghi.`);
    };
    reader.readAsBinaryString(file);
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
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {getDistinctValues(columnKey).map(val => (
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

  const getDisplayId = (customer) => {
    if (!customer.id) return '---';
    const numPart = customer.id.includes('-') ? customer.id.split('-')[1] : customer.id;
    const prefix = customer.shortName || 'CUS';
    return `${prefix}-${numPart}`;
  };

  return (
    <div className="customer-list-container" onClick={() => setActiveFilterCol(null)}>
      <div className="customer-list-header">
        <div className="header-left">
          <h1>Quản lý hồ sơ khách hàng</h1>
          <p style={{ color: '#64748b', fontSize: '14px', margin: '4px 0 0 0', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.6px' }}>Hiện có {processedCustomers.length} khách hàng chiến lược đã được xác minh đang hoạt động trong hệ sinh thái.</p>
        </div>
      </div>

      <div className="metrics-cards-container" style={{ display: 'flex', gap: '36px', marginBottom: '24px' }}>
        <div className="metric-card" style={{ flex: 1, backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '21px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#44494D', textTransform: 'uppercase', letterSpacing: '0.6px' }}>Tổng khách hàng thêm mới</span>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%' }}>
            <span style={{ fontSize: '24px', fontWeight: 700, color: '#000', lineHeight: '32px' }}>{customers.length || 0}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10B981', fontSize: '13px', fontWeight: 700, paddingBottom: '4px' }}>
              <TrendingUp size={16} strokeWidth={2.5} /> +12%
            </div>
          </div>
        </div>
        <div className="metric-card" style={{ flex: 1, backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '21px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#44494D', textTransform: 'uppercase', letterSpacing: '0.6px' }}>Tổng khách hàng nội bộ</span>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%' }}>
            <span style={{ fontSize: '24px', fontWeight: 700, color: '#000', lineHeight: '32px' }}>{customers.filter(c => c.tags?.some(tag => tag.text === 'Nội bộ')).length || 15}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#3B82F6', fontSize: '13px', fontWeight: 700, paddingBottom: '4px' }}>
              <TrendingUp size={16} strokeWidth={2.5} /> +5%
            </div>
          </div>
        </div>
        <div className="metric-card" style={{ flex: 1, backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '21px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#44494D', textTransform: 'uppercase', letterSpacing: '0.6px' }}>Tổng khách hàng ngoài</span>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%' }}>
            <span style={{ fontSize: '24px', fontWeight: 700, color: '#000', lineHeight: '32px' }}>{customers.filter(c => !c.tags?.some(tag => tag.text === 'Nội bộ')).length || Math.max(0, customers.length - 15)}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#F59E0B', fontSize: '13px', fontWeight: 700, paddingBottom: '4px' }}>
              <TrendingUp size={16} strokeWidth={2.5} /> +8%
            </div>
          </div>
        </div>
      </div>

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
            <button className="btn-outline-brand" onClick={() => navigate('/customer/new')} style={{ border: '1px solid #f45476', color: '#e03', background: 'transparent', height: '40px', padding: '0 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
              <Plus size={18} /> Thêm khách hàng
            </button>
            <button className="btn-outline-brand" onClick={handleExport} title="Xuất dữ liệu" style={{ border: '1px solid #f45476', color: '#e03', background: 'transparent', height: '40px', padding: '0 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
              <Download size={18} /> Xuất Excel
            </button>
          </div>

        </div>
      </div>

      <div className="customer-table-container">
        <table className="customer-table">
            <thead>
              <tr>
                <th style={{ width: '40px', paddingLeft: '16px' }}>
                  <input type="checkbox" checked={selectedIds.size === processedCustomers.length && processedCustomers.length > 0} onChange={toggleSelectAll} />
                </th>
                <TableHeader label="ID khách hàng" columnKey="id_kh" hasFilter={true} />
                <TableHeader label="Khách hàng" columnKey="name" hasFilter={true} />
                <TableHeader label="Mã số thuế" columnKey="mst" hasFilter={true} />
                <TableHeader label="Dịch vụ" columnKey="domain" hasFilter={true} />
                <TableHeader label="Số hợp đồng" columnKey="contractValue" hasFilter={true} />
                <TableHeader label="Ngày ký" columnKey="signedDate" hasFilter={true} />
                <TableHeader label="Nguồn" columnKey="source" hasFilter={true} />
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
                      {['id_kh', 'name', 'mst', 'domain', 'contractValue', 'signedDate', 'source'].map(key => {
                        const labelMap = { id_kh: 'ID khách hàng', name: 'Khách hàng', mst: 'Mã số thuế', domain: 'Dịch vụ', contractValue: 'Số hợp đồng', signedDate: 'Ngày ký', source: 'Nguồn' };
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
              {paginatedData.length > 0 ? paginatedData.map(customer => {
                // Determine mock dummy display for pill styling and extra data based on index/id for simulation:
                const isEven = parseInt(customer.id.replace(/\D/g, '')) % 2 === 0;
                const srcState = isEven ? 'Yellow' : 'Green';
                const sColor = srcState === 'Yellow' ? { bg: '#FEF8E9', text: '#F2BB24', val: 'Tiềm năng' } : { bg: '#F0FDF4', text: '#00A63E', val: 'Mới' };
                const domainState = isEven ? { bg: '#FFE2E2', text: '#EE0033', val: 'Hàng tiêu dùng' } : { bg: '#e0e7ff', text: '#3730a3', val: 'Ngân hàng' };

                return (
                  <tr key={customer.id} onClick={() => navigate(`/customer/edit/${customer.id}`)} className={selectedIds.has(customer.id) ? 'row-selected' : ''}>
                    <td style={{ paddingLeft: '16px' }} onClick={(e) => toggleSelectRow(e, customer.id)}>
                      <input type="checkbox" checked={selectedIds.has(customer.id)} readOnly onClick={(e) => e.stopPropagation()} />
                    </td>
                    {visibleColumns.includes('id_kh') && (
                      <td className="id-col" style={{ fontWeight: 500, color: '#334155' }}>
                        {customer.id}
                      </td>
                    )}
                    {visibleColumns.includes('name') && (
                      <td>
                        <div style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <div style={{ fontWeight: 500, color: '#000000', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '14px' }}>{customer.name}</div>
                          <div style={{ fontSize: '11px', color: '#44494d', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{customer.email || 'user@example.com'}</div>
                        </div>
                      </td>
                    )}
                    {visibleColumns.includes('mst') && <td>{customer.mst || '0300588569'}</td>}
                    {visibleColumns.includes('domain') && (
                      <td>
                        <span style={{ padding: '3px 9px', borderRadius: '9999px', backgroundColor: domainState.bg, color: domainState.text, fontSize: '12px', border: `1px solid ${domainState.bg === '#FFE2E2' ? '#F0F0F0' : '#E0E7FF'}`, display: 'inline-flex' }}>
                          {customer.domain || domainState.val}
                        </span>
                      </td>
                    )}
                    {visibleColumns.includes('contractValue') && <td style={{ color: '#000000' }}>{customer.contractNo || '1,3 tỉ VNĐ'}</td>}
                    {visibleColumns.includes('signedDate') && <td style={{ whiteSpace: 'nowrap', color: '#000000' }}>{customer.signedDate || '22/12/2025'}</td>}
                    {visibleColumns.includes('source') && (
                      <td>
                        <span style={{ padding: '3px 9px', borderRadius: '9999px', backgroundColor: sColor.bg, color: sColor.text, fontSize: '12px', border: '1px solid #F0F0F0', display: 'inline-flex' }}>
                          {srcState === 'Yellow' ? 'Manual' : 'Lead Conversion'}
                        </span>
                      </td>
                    )}
                    <td style={{ textAlign: 'center' }}></td>
                  </tr>
                )
              }) : (
                <tr><td colSpan="9" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>Không có dữ liệu phù hợp</td></tr>
              )}
            </tbody>
          </table>
        </div>

      {/* PAGINATION UI */}
      {processedCustomers.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderTop: '1px solid #E2E8F0', background: 'white', borderRadius: '0 0 8px 8px', marginTop: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ color: '#64748b', fontSize: '13px' }}>
            Hiển thị {totalItems > 0 ? (safeCurrentPage - 1) * pageSize + 1 : 0}-{Math.min(safeCurrentPage * pageSize, totalItems)} trong số {totalItems} khách hàng
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button onClick={() => setCurrentPage(p => p - 1)} disabled={safeCurrentPage === 1} style={{ border: 'none', background: 'transparent', cursor: safeCurrentPage === 1 ? 'default' : 'pointer', opacity: safeCurrentPage === 1 ? 0.3 : 1, padding: '4px 8px', fontWeight: 700 }}>
              &lt;
            </button>

            {[...Array(totalPages)].map((_, i) => {
              const page = i + 1;
              // Hiển thị 1 2 3 ... N
              if (page === 1 || page === totalPages || (page >= safeCurrentPage - 1 && page <= safeCurrentPage + 1)) {
                return (
                  <button key={page} onClick={() => setCurrentPage(page)} style={{ border: 'none', background: page === safeCurrentPage ? '#e32b4c' : 'transparent', color: page === safeCurrentPage ? 'white' : '#64748b', width: '28px', height: '28px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {page}
                  </button>
                );
              }
              if (page === safeCurrentPage - 2 || page === safeCurrentPage + 2) {
                return <span key={page} style={{ color: '#64748b', letterSpacing: '2px', marginLeft: '4px', marginRight: '4px' }}>...</span>;
              }
              return null;
            })}

            <button onClick={() => setCurrentPage(p => p + 1)} disabled={safeCurrentPage >= totalPages} style={{ border: 'none', background: 'transparent', cursor: safeCurrentPage >= totalPages ? 'default' : 'pointer', opacity: safeCurrentPage >= totalPages ? 0.3 : 1, padding: '4px 8px', fontWeight: 700 }}>
              &gt;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerList;
