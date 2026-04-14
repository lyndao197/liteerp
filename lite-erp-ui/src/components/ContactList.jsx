import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Phone,
  Mail,
  Briefcase,
  User,
  Settings,
  Download,
  Upload,
  ChevronUp,
  ChevronDown,
  Filter,
  SlidersHorizontal,
  Circle,
  TrendingUp,
  TrendingDown,
  Edit2
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { mockStore } from '../utils/mockStore';
import { QueryBuilder } from './QueryBuilder';
import { evaluateQuery } from '../utils/filterUtils';
import './ContactList.css';

const ContactList = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
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
  const [visibleColumns, setVisibleColumns] = useState(['id', 'name', 'position', 'companyName', 'email', 'phone', 'status']);

  useEffect(() => {
    setContacts(mockStore.getAllContacts());
  }, []);

  const handleToggleStatus = (e, id, currentStatus) => {
    e.stopPropagation();
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    mockStore.updateContactStatus(id, newStatus);
    setContacts(mockStore.getAllContacts());
  };

  const handleToggleAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(new Set(processedContacts.map(c => c.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleToggleRow = (e, id) => {
    e.stopPropagation();
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedIds(newSelected);
  };

  const handleImport = () => {
    alert('Chức năng Import đang được chuẩn bị. Vui lòng chọn file Excel/CSV để tải dữ liệu vào hệ thống.');
    // In a real app, this would trigger a file input click
  };

  const toggleColumn = (key) => {
    setVisibleColumns(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

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
    return [...new Set(contacts.map(c => c[key] || ''))].filter(Boolean);
  };

  const processedContacts = useMemo(() => {
    let result = [...contacts];

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(c =>
        c.name.toLowerCase().includes(lowerSearch) ||
        c.position?.toLowerCase().includes(lowerSearch) ||
        c.companyName?.toLowerCase().includes(lowerSearch) ||
        c.id?.toLowerCase().includes(lowerSearch)
      );
    }

    Object.keys(filters).forEach(key => {
      if (filters[key].length > 0) {
        result = result.filter(c => filters[key].includes(c[key]));
      }
    });

    if (advancedQuery && advancedQuery.rules.length > 0) {
      result = result.filter(c => evaluateQuery(c, advancedQuery));
    }

    if (sortConfig.key) {
      result.sort((a, b) => {
        const valA = a[sortConfig.key] || '';
        const valB = b[sortConfig.key] || '';
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    } else {
      result.sort((a, b) => {
        const numA = parseInt((a.id || '').split('-')[1], 10) || 0;
        const numB = parseInt((b.id || '').split('-')[1], 10) || 0;
        return numB - numA;
      });
    }

    return result;
  }, [contacts, searchTerm, filters, sortConfig, advancedQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters, advancedQuery, sortConfig]);

  const totalItems = processedContacts.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const paginatedData = processedContacts.slice((safeCurrentPage - 1) * pageSize, safeCurrentPage * pageSize);

  const handleExport = () => {
    const dataToExport = selectedIds.size > 0
      ? processedContacts.filter(c => selectedIds.has(c.id))
      : processedContacts;

    const exportData = dataToExport.map(c => ({
      'ID Liên hệ': c.id,
      'Tên liên hệ': c.name,
      'Chức vụ': c.position,
      'Công ty': c.companyName,
      'Email': c.email,
      'Số điện thoại': c.phone,
      'Trạng thái': c.status
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Contacts");
    XLSX.writeFile(wb, `Danh_sach_lien_he_${selectedIds.size > 0 ? 'selected_' : ''}${new Date().getTime()}.xlsx`);
  };

  const COLUMN_OPTIONS = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Tên liên hệ' },
    { key: 'position', label: 'Chức vụ' },
    { key: 'companyName', label: 'Công ty' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Số điện thoại' },
    { key: 'status', label: 'Trạng thái' }
  ];

  const [filterPos, setFilterPos] = useState({ top: 0, right: 0 });

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
            <div onClick={(e) => { 
                e.stopPropagation(); 
                if (activeFilterCol !== columnKey) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setFilterPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
                }
                setActiveFilterCol(activeFilterCol === columnKey ? null : columnKey); 
            }} style={{ cursor: 'pointer', color: filters[columnKey]?.length > 0 ? '#e32b4c' : '#94a3b8' }}>
              <Filter size={14} />
            </div>
          )}
        </div>
        {activeFilterCol === columnKey && createPortal(
          <div className="column-filter-popup" onClick={e => e.stopPropagation()} style={{ position: 'fixed', top: `${filterPos.top}px`, right: `${filterPos.right}px`, zIndex: 9999, background: 'white', border: '1px solid #cbd5e1', borderRadius: '4px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', minWidth: '180px', width: 'max-content', padding: '8px', fontWeight: 'normal', color: '#334155' }}>
            <div style={{ marginBottom: '8px', fontWeight: 600, fontSize: '12px', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px' }}>Lọc: {label}</div>
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {getDistinctValues(columnKey).map(val => (
                <label key={val} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', padding: '4px 0', cursor: 'pointer' }}>
                  <input type="checkbox" checked={filters[columnKey]?.includes(val) || false} onChange={() => handleFilterChange(columnKey, val)} />
                  {val === 'Active' ? 'Active' : (val === 'Inactive' ? 'Inactive' : val)}
                </label>
              ))}
            </div>
          </div>, document.body
        )}
      </th>
    );
  };

  return (
    <div className="contact-list-container" onClick={() => setActiveFilterCol(null)}>
      <div className="page-title-section">
        <h1>Quản lý liên hệ khách hàng</h1>
        <p>Quản lý nhân sự và thông tin liên hệ của các đối tác/khách hàng.</p>
      </div>

      <div className="metrics-cards-container" style={{ display: 'flex', gap: '36px', marginBottom: '24px', marginTop: '16px' }}>
        <div className="metric-card" style={{ flex: 1, backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '21px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#44494D', textTransform: 'uppercase', letterSpacing: '0.6px' }}>Tổng liên hệ</span>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%' }}>
            <span style={{ fontSize: '24px', fontWeight: 700, color: '#000', lineHeight: '32px' }}>{contacts.length}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10B981', fontSize: '13px', fontWeight: 700, paddingBottom: '4px' }}>
              <TrendingUp size={16} strokeWidth={2.5} /> +10%
            </div>
          </div>
        </div>
        <div className="metric-card" style={{ flex: 1, backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '21px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#44494D', textTransform: 'uppercase', letterSpacing: '0.6px' }}>Tổng liên hệ active</span>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%' }}>
            <span style={{ fontSize: '24px', fontWeight: 700, color: '#000', lineHeight: '32px' }}>{contacts.filter(c => c.status === 'Active').length}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#3B82F6', fontSize: '13px', fontWeight: 700, paddingBottom: '4px' }}>
              <TrendingUp size={16} strokeWidth={2.5} /> +8%
            </div>
          </div>
        </div>
        <div className="metric-card" style={{ flex: 1, backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '21px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#44494D', textTransform: 'uppercase', letterSpacing: '0.6px' }}>Tổng liên hệ inactive</span>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%' }}>
            <span style={{ fontSize: '24px', fontWeight: 700, color: '#000', lineHeight: '32px' }}>{contacts.filter(c => c.status !== 'Active').length}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#EF4444', fontSize: '13px', fontWeight: 700, paddingBottom: '4px' }}>
              <TrendingDown size={16} strokeWidth={2.5} /> -2%
            </div>
          </div>
        </div>
      </div>

      <div className="action-bar-container">
        <div className="action-bar-left">
          <div className="search-group" style={{position: 'relative'}}>
            <div className="contact-search-box">
              <Search size={18} className="contact-search-icon" />
              <input type="text" placeholder="Tìm kiếm ..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <button className={`btn-search ${showAdvancedFilter ? 'active' : ''}`} style={{display: 'flex', alignItems: 'center', gap: '6px'}} onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}>
              <Filter size={16}/> Lọc nâng cao
            </button>
            {showAdvancedFilter && (
              <div style={{position: 'absolute', top: '100%', left: 0, marginTop: '8px', zIndex: 100, width: '500px', textAlign: 'left', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', border: '1px solid #cbd5e1', borderRadius: '8px', background: 'white', overflow: 'hidden'}}>
                 <div style={{padding: '12px 16px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <span style={{fontWeight: 600, color: '#0f172a', fontSize: '14px'}}>Bộ lọc phức tạp</span>
                    <button style={{background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '13px'}} onClick={() => setShowAdvancedFilter(false)}>Đóng</button>
                 </div>
                 <div style={{padding: '16px', maxHeight: '400px', overflowY: 'auto'}}>
                   <QueryBuilder query={advancedQuery} fields={COLUMN_OPTIONS} onChange={setAdvancedQuery} />
                 </div>
              </div>
            )}
          </div>
        </div>

        <div className="action-bar-right">
          {selectedIds.size > 0 && Array.from(selectedIds).every(id => contacts.find(c => c.id === id)?.status === 'Active') && (
            <button className="btn-outline-brand" style={{background: '#cbd5e1', color: '#fff', borderColor: '#cbd5e1'}} onClick={() => {
               Array.from(selectedIds).forEach(id => mockStore.updateContactStatus(id, 'Inactive'));
               setContacts(mockStore.getAllContacts());
               setSelectedIds(new Set());
            }}>Chuyển Inactive</button>
          )}
          {selectedIds.size > 0 && Array.from(selectedIds).every(id => contacts.find(c => c.id === id)?.status !== 'Active') && (
            <button className="btn-outline-brand" style={{background: '#10b981', color: '#fff', borderColor: '#10b981'}} onClick={() => {
               Array.from(selectedIds).forEach(id => mockStore.updateContactStatus(id, 'Active'));
               setContacts(mockStore.getAllContacts());
               setSelectedIds(new Set());
            }}>Chuyển Active</button>
          )}
          <button className="btn-outline-brand" onClick={() => navigate('/contact/new')}><Plus size={18} /> Thêm liên hệ</button>
          <button className="btn-outline-brand" onClick={() => document.getElementById('import-input').click()}><Upload size={18} /> Nhập</button>
          <input type="file" id="import-input" style={{ display: 'none' }} accept=".xlsx, .xls" onChange={handleImport} />
          <button className="btn-outline-brand" onClick={handleExport}>
            <Download size={18} /> Xuất Excel
          </button>
        </div>
      </div>
      
      <div className="contact-table-container">
        <table className="contact-table">
            <thead>
              <tr>
                <th style={{ width: '40px', paddingLeft: '16px' }} onClick={e => e.stopPropagation()}>
                  <input type="checkbox" onChange={handleToggleAll} checked={selectedIds.size === processedContacts.length && processedContacts.length > 0} />
                </th>
                <TableHeader label="ID" columnKey="id" hasFilter={true} />
                <TableHeader label="Tên liên hệ" columnKey="name" hasFilter={true} />
                <TableHeader label="Chức vụ" columnKey="position" hasFilter={true} />
                <TableHeader label="Công ty" columnKey="companyName" hasFilter={true} />
                <TableHeader label="Email" columnKey="email" hasFilter={true} />
                <TableHeader label="Số điện thoại" columnKey="phone" hasFilter={true} />
                <TableHeader label="Trạng thái" columnKey="status" hasFilter={true} />
                <th style={{ width: '40px', textAlign: 'center', cursor: 'pointer', position: 'relative' }} onClick={e => {
                  e.stopPropagation();
                  if (!showColPicker) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setPickerPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
                  }
                  setShowColPicker(!showColPicker);
                }}>
                  <SlidersHorizontal size={16} color="#94a3b8" />
                  {showColPicker && createPortal(
                    <div className="column-picker-popup" onClick={e => e.stopPropagation()} style={{ position: 'fixed', top: `${pickerPos.top}px`, right: `${pickerPos.right}px`, zIndex: 9999, background: 'white', border: '1px solid #cbd5e1', borderRadius: '4px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', minWidth: '180px', padding: '12px', textAlign: 'left' }}>
                      <div style={{ fontWeight: 700, fontSize: '12px', color: '#1e293b', marginBottom: '8px', borderBottom: '1px solid #f1f5f9', paddingBottom: '4px' }}>Ẩn/Hiện cột</div>
                      {COLUMN_OPTIONS.map(opt => (
                        <label key={opt.key} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', padding: '4px 0', cursor: 'pointer', fontWeight: 500, color: '#475569' }}>
                          <input type="checkbox" checked={visibleColumns.includes(opt.key)} onChange={() => toggleColumn(opt.key)} />
                          {opt.label}
                        </label>
                      ))}
                    </div>, document.body
                  )}
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map(contact => (
                  <tr key={contact.id} onClick={(e) => {
                    if (contact.status === 'Active') navigate(`/contact/edit/${contact.id}`);
                  }} className={selectedIds.has(contact.id) ? 'selected-row' : ''} style={{cursor: contact.status === 'Active' ? 'pointer' : 'default'}}>
                    <td onClick={e => handleToggleRow(e, contact.id)} style={{ paddingLeft: '16px' }}>
                      <input type="checkbox" checked={selectedIds.has(contact.id)} readOnly />
                    </td>
                    {visibleColumns.includes('id') && <td style={{ color: '#2563eb', fontWeight: 600 }}>{contact.id}</td>}
                    {visibleColumns.includes('name') && (
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div className="contact-avatar" style={{ width: '32px', height: '32px', fontSize: '11px' }}>{getInitials(contact.name)}</div>
                          <div style={{ fontWeight: 600, color: '#1e293b' }}>{contact.name}</div>
                        </div>
                      </td>
                    )}
                    {visibleColumns.includes('position') && <td>{contact.position}</td>}
                    {visibleColumns.includes('companyName') && <td><span className="company-badge">{contact.companyName}</span></td>}
                    {visibleColumns.includes('email') && <td>{contact.email}</td>}
                    {visibleColumns.includes('phone') && <td>{contact.phone}</td>}
                    {visibleColumns.includes('status') && (
                      <td onClick={(e) => handleToggleStatus(e, contact.id, contact.status)}>
                        <div style={{ 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          height: '20px',
                          padding: '3px 9px',
                          borderRadius: '9999px',
                          cursor: 'pointer',
                          background: contact.status === 'Active' ? '#f0fdf4' : '#f1f5f9',
                          border: `1px solid ${contact.status === 'Active' ? '#f0f0f0' : '#e2e8f0'}`,
                          color: contact.status === 'Active' ? '#00a63e' : '#64748b',
                          fontSize: '12px',
                          fontWeight: 400,
                          fontFamily: "'FS_PF_BeauSans_Pro', sans-serif"
                        }}>
                          {contact.status === 'Active' ? 'Active' : 'Inactive'}
                        </div>
                      </td>
                    )}
                    <td style={{textAlign: 'center', width: '40px'}} onClick={e => e.stopPropagation()}>
                      {contact.status === 'Active' && (
                        <span onClick={() => navigate(`/contact/edit/${contact.id}`)} style={{cursor: 'pointer', color: '#64748b'}} title="Chỉnh sửa">
                          ✏️
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>Không có dữ liệu liên hệ</td></tr>
              )}
            </tbody>
          </table>
        </div>

      {/* PAGINATION UI */}
      {processedContacts.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderTop: '1px solid #e2e8f0', background: 'white', borderRadius: '0 0 8px 8px', marginTop: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ color: '#64748b', fontSize: '13px' }}>
            Hiển thị {totalItems > 0 ? (safeCurrentPage - 1) * pageSize + 1 : 0}-{Math.min(safeCurrentPage * pageSize, totalItems)} trong số {totalItems} liên hệ
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button onClick={() => setCurrentPage(p => p - 1)} disabled={safeCurrentPage === 1} style={{ border: 'none', background: 'transparent', cursor: safeCurrentPage === 1 ? 'default' : 'pointer', opacity: safeCurrentPage === 1 ? 0.3 : 1, padding: '4px 8px', fontWeight: 700 }}>
               &lt;
            </button>
            
            {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                // Hiển thị dạng 1 2 3 ... N
                if (page === 1 || page === totalPages || (page >= safeCurrentPage - 1 && page <= safeCurrentPage + 1)) {
                    return (
                        <button key={page} onClick={() => setCurrentPage(page)} style={{ border: 'none', background: page === safeCurrentPage ? '#e32b4c' : 'transparent', color: page === safeCurrentPage ? 'white' : '#64748b', width: '28px', height: '28px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {page}
                        </button>
                    );
                }
                if (page === safeCurrentPage - 2 || page === safeCurrentPage + 2) {
                    return <span key={page} style={{color: '#64748b', letterSpacing: '2px', marginLeft: '4px', marginRight: '4px'}}>...</span>;
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

export default ContactList;
