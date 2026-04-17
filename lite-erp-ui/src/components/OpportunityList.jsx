import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Target,
  Settings,
  Download,
  Upload,
  ChevronUp,
  ChevronDown,
  Filter,
  SlidersHorizontal,
  X
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { mockStore } from '../utils/mockStore';
import './ContactList.css';

const OpportunityList = () => {
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [filters, setFilters] = useState({});
  const [activeFilterCol, setActiveFilterCol] = useState(null);
  
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [showColPicker, setShowColPicker] = useState(false);
  const [showAdvSearch, setShowAdvSearch] = useState(false);
  const [showNameDrop, setShowNameDrop] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(['id', 'content', 'company', 'revenue', 'probability', 'date', 'salesperson', 'status']);

  useEffect(() => {
    setOpportunities(mockStore.getAllOpportunities());
  }, []);

  const handleToggleAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(new Set(processedOpps.map(c => c.id)));
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
  };

  const toggleColumn = (key) => {
    setVisibleColumns(prev => 
        prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
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
    return [...new Set(opportunities.map(c => c[key] || ''))].filter(Boolean);
  };

  const processedOpps = useMemo(() => {
    let result = [...opportunities];

    if (searchTerm) {
        const lowerSearch = searchTerm.toLowerCase();
        result = result.filter(c => 
            c.content?.toLowerCase().includes(lowerSearch) || 
            c.company?.toLowerCase().includes(lowerSearch) ||
            c.id?.toLowerCase().includes(lowerSearch)
        );
    }

    Object.keys(filters).forEach(key => {
        if (filters[key].length > 0) {
            if (key === 'nameOrId') {
                const query = filters[key][0].toLowerCase();
                result = result.filter(c => (c.content?.toLowerCase().includes(query) || c.id?.toLowerCase().includes(query)));
            } else {
                result = result.filter(c => filters[key].includes(c[key]));
            }
        }
    });

    if (sortConfig.key) {
        result.sort((a, b) => {
            let valA = a[sortConfig.key] || '';
            let valB = b[sortConfig.key] || '';
            
            // basic stripping for numeric comparison if revenue/probability
            if (sortConfig.key === 'revenue' || sortConfig.key === 'probability') {
                valA = Number(valA.toString().replace(/[^0-9.-]+/g,""));
                valB = Number(valB.toString().replace(/[^0-9.-]+/g,""));
            }

            if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
            if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }

    return result;
  }, [opportunities, searchTerm, filters, sortConfig]);

  const handleExport = () => {
    const dataToExport = selectedIds.size > 0 
        ? processedOpps.filter(c => selectedIds.has(c.id))
        : processedOpps;

    const exportData = dataToExport.map(c => ({
        'ID Cơ hội': c.id,
        'Tên cơ hội': c.content,
        'Công ty': c.company,
        'Giá trị': c.revenue,
        'Xác suất': c.probability,
        'Ngày dự kiến': c.date,
        'Người phụ trách': c.salesperson,
        'Trạng thái': c.status
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Opportunities");
    XLSX.writeFile(wb, `Danh_sach_co_hoi_${selectedIds.size > 0 ? 'selected_' : ''}${new Date().getTime()}.xlsx`);
  };

  const COLUMN_OPTIONS = [
    { key: 'id', label: 'ID' },
    { key: 'content', label: 'Tên cơ hội' },
    { key: 'company', label: 'Công ty / Khách hàng' },
    { key: 'revenue', label: 'Giá trị' },
    { key: 'probability', label: 'Xác suất' },
    { key: 'date', label: 'Ngày dự kiến' },
    { key: 'salesperson', label: 'Người phụ trách' },
    { key: 'status', label: 'Trạng thái' }
  ];

  const TableHeader = ({ label, columnKey, hasFilter = false }) => {
    if (!visibleColumns.includes(columnKey)) return null;
    return (
      <th onClick={() => handleSort(columnKey)} style={{position: 'relative'}}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <div style={{display: 'flex', alignItems: 'center', cursor: 'pointer', flex: 1}}>
            {label}
            <div style={{display: 'flex', flexDirection: 'column', marginLeft: '6px', color: sortConfig.key === columnKey ? '#0f172a' : '#cbd5e1'}}>
              <ChevronUp size={12} style={{marginBottom: '-4px', opacity: sortConfig.key === columnKey && sortConfig.direction === 'desc' ? 0.3 : 1}} />
              <ChevronDown size={12} style={{opacity: sortConfig.key === columnKey && sortConfig.direction === 'asc' ? 0.3 : 1}} />
            </div>
          </div>
          {hasFilter && (
              <div onClick={(e) => { e.stopPropagation(); setActiveFilterCol(activeFilterCol === columnKey ? null : columnKey); }} style={{cursor: 'pointer', color: filters[columnKey]?.length > 0 ? '#e32b4c' : '#94a3b8'}}>
                  <Filter size={14} />
              </div>
          )}
        </div>
        {activeFilterCol === columnKey && (
            <div className="column-filter-popup" onClick={e => e.stopPropagation()} style={{position: 'absolute', top: '100%', right: 0, zIndex: 10, background: 'white', border: '1px solid #cbd5e1', borderRadius: '4px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', minWidth: '180px', padding: '8px', fontWeight: 'normal', color: '#334155'}}>
                <div style={{marginBottom: '8px', fontWeight: 600, fontSize: '12px', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px'}}>Lọc: {label}</div>
                <div style={{maxHeight: '200px', overflowY: 'auto'}}>
                  {getDistinctValues(columnKey).map(val => (
                      <label key={val} style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', padding: '4px 0', cursor: 'pointer'}}>
                          <input type="checkbox" checked={filters[columnKey]?.includes(val) || false} onChange={() => handleFilterChange(columnKey, val)}/>
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
    <div className="contact-list-container" onClick={() => setActiveFilterCol(null)}>
      <div className="contact-list-header">
        <div className="header-left">
          <h1>Quản lý Cơ hội</h1>
          <p style={{color: '#64748b', fontSize: '14px', margin: '4px 0 0 0'}}>Quản lý và chuyển đổi khách hàng tiềm năng</p>
        </div>
        
        <div className="header-right">
          <div className="search-box" style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
            <div style={{position: 'relative'}}>
                <Search size={18} style={{position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8'}} />
                <input type="text" placeholder="Tìm ID, tên cơ hội, công ty..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{padding: '10px 16px 10px 40px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', width: '260px', outline: 'none'}} />
            </div>
            <button className="btn-secondary" onClick={() => setShowAdvSearch(!showAdvSearch)} style={{padding: '10px', borderRadius: '10px', background: showAdvSearch ? '#e2e8f0' : 'white', border: showAdvSearch ? '1px solid #cbd5e1' : '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center'}} title="Tìm kiếm nâng cao">
                <SlidersHorizontal size={18} color={showAdvSearch ? '#0f172a' : '#64748b'} />
            </button>
          </div>

          <div style={{display: 'flex', gap: '8px'}}>
            <button className="btn-secondary" onClick={handleImport} title="Nhập dữ liệu"><Upload size={18} /> Import</button>
            <button className="btn-secondary" onClick={handleExport} title="Xuất dữ liệu">
              <Download size={18} /> 
              {selectedIds.size > 0 ? `Export (${selectedIds.size})` : 'Export'}
            </button>
          </div>

          <button className="btn-primary" onClick={() => navigate('/opportunity/new')}><Plus size={18} /> Thêm cơ hội</button>
        </div>
      </div>

      {showAdvSearch && (
        <div className="advanced-search-panel" style={{background: '#fff', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', padding: '24px 32px', marginBottom: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)'}}>
            <div style={{marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <h3 style={{margin: 0, fontSize: '18px', color: '#1e293b', fontWeight: 500}}>Tìm kiếm nâng cao</h3>
                <X size={20} style={{cursor: 'pointer', color: '#94a3b8'}} onClick={() => setShowAdvSearch(false)} />
            </div>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px'}}>
                <div>
                    <div style={{display: 'flex', alignItems: 'center', marginBottom: '16px'}}>
                        <div style={{width: '140px', fontWeight: 600, fontSize: '13px', color: '#334155'}}>Tên / Mã Cơ hội</div>
                        <div style={{flex: 1, position: 'relative'}}>
                            <input type="text" placeholder="Nhập ID hoặc tên cơ hội..." value={filters['nameOrId']?.[0] || ''} 
                                onFocus={() => setShowNameDrop(true)}
                                onBlur={() => setTimeout(() => setShowNameDrop(false), 200)}
                                onChange={e => {
                                    setFilters(prev => ({...prev, nameOrId: e.target.value ? [e.target.value] : []}));
                                    setShowNameDrop(true);
                                }} 
                                style={{width: '100%', border: 'none', borderBottom: '1px solid #cbd5e1', padding: '4px 0', outline: 'none', fontSize: '14px', color: '#64748b', background: 'transparent'}} />
                            {showNameDrop && (
                                <div style={{position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50, background: '#fff', border: '1px solid #cbd5e1', borderRadius: '4px', maxHeight: '150px', overflowY: 'auto', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', marginTop: '4px'}}>
                                    {opportunities.filter(c => {
                                        const q = (filters['nameOrId']?.[0] || '').toLowerCase();
                                        return !q || c.content?.toLowerCase().includes(q) || c.id?.toLowerCase().includes(q);
                                    }).length > 0 ? opportunities.filter(c => {
                                        const q = (filters['nameOrId']?.[0] || '').toLowerCase();
                                        return !q || c.content?.toLowerCase().includes(q) || c.id?.toLowerCase().includes(q);
                                    }).map(c => (
                                        <div key={c.id} style={{padding: '8px 12px', fontSize: '13px', cursor: 'pointer', borderBottom: '1px solid #f1f5f9'}}
                                            onMouseOver={e => e.currentTarget.style.background = '#f8fafc'}
                                            onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                                            onClick={() => {
                                                setFilters(prev => ({...prev, nameOrId: [c.content]}));
                                                setShowNameDrop(false);
                                            }}>
                                            <div style={{fontWeight: 600, color: '#1e293b'}}>{c.content}</div>
                                            <div style={{fontSize: '11px', color: '#64748b'}}>{c.id}</div>
                                        </div>
                                    )) : (
                                        <div style={{padding: '8px 12px', fontSize: '13px', color: '#94a3b8', fontStyle: 'italic'}}>Không tìm thấy kết quả</div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', marginBottom: '16px'}}>
                        <div style={{width: '140px', fontWeight: 600, fontSize: '13px', color: '#334155'}}>Người phụ trách</div>
                        <select value={filters['salesperson']?.[0] || ''} onChange={e => setFilters(prev => ({...prev, salesperson: e.target.value ? [e.target.value] : []}))} style={{flex: 1, border: 'none', borderBottom: '1px solid #cbd5e1', padding: '4px 0', outline: 'none', fontSize: '14px', color: '#64748b', background: 'transparent', appearance: 'auto'}}>
                            <option value="">Tất cả nhân viên...</option>
                            {getDistinctValues('salesperson').map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                </div>
                <div>
                    <div style={{display: 'flex', alignItems: 'center', marginBottom: '16px'}}>
                        <div style={{width: '140px', fontWeight: 600, fontSize: '13px', color: '#334155'}}>Trạng thái</div>
                        <select value={filters['status']?.[0] || ''} onChange={e => setFilters(prev => ({...prev, status: e.target.value ? [e.target.value] : []}))} style={{flex: 1, border: 'none', borderBottom: '1px solid #cbd5e1', padding: '4px 0', outline: 'none', fontSize: '14px', color: '#64748b', background: 'transparent', appearance: 'auto'}}>
                            <option value="">Tất cả trạng thái...</option>
                            {getDistinctValues('status').map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                </div>
            </div>
            <div style={{marginTop: '24px', display: 'flex', gap: '10px'}}>
                <button className="btn-primary" style={{background: '#714B67', borderColor: '#714B67', borderRadius: '4px', padding: '8px 24px', fontWeight: 600, fontSize: '14px'}} onClick={() => setShowAdvSearch(false)}>Áp dụng</button>
                <button className="btn-secondary" style={{borderRadius: '4px', padding: '8px 24px', background: '#e2e8f0', color: '#475569', border: 'none', fontSize: '14px', fontWeight: 500}} onClick={() => { setFilters({}); setShowAdvSearch(false); }}>Xóa bộ lọc</button>
            </div>
        </div>
      )}

      <div className="contact-table-container">
        <table className="contact-table">
        <thead>
            <tr>
            <th style={{width: '40px', paddingLeft: '16px'}} onClick={e => e.stopPropagation()}>
                <input type="checkbox" onChange={handleToggleAll} checked={selectedIds.size === processedOpps.length && processedOpps.length > 0} />
            </th>
            <TableHeader label="ID" columnKey="id" />
            <TableHeader label="Tên cơ hội" columnKey="content" hasFilter={true} />
            <TableHeader label="Công ty" columnKey="company" hasFilter={true} />
            <TableHeader label="Giá trị" columnKey="revenue" />
            <TableHeader label="Xác suất" columnKey="probability" />
            <TableHeader label="Ngày dự kiến" columnKey="date" />
            <TableHeader label="Người phụ trách" columnKey="salesperson" hasFilter={true} />
            <TableHeader label="Trạng thái" columnKey="status" hasFilter={true} />
            <th style={{width: '40px', textAlign: 'center', position: 'relative'}} onClick={e => e.stopPropagation()}>
                <div onClick={() => setShowColPicker(!showColPicker)} style={{cursor: 'pointer', color: '#64748b'}}>
                    <Settings size={16} />
                </div>
                {showColPicker && (
                    <div className="column-picker-popup" style={{position: 'absolute', top: '100%', right: 0, zIndex: 20, background: 'white', border: '1px solid #cbd5e1', borderRadius: '4px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', minWidth: '180px', padding: '12px', textAlign: 'left'}}>
                        <div style={{fontWeight: 700, fontSize: '12px', color: '#1e293b', marginBottom: '8px', borderBottom: '1px solid #f1f5f9', paddingBottom: '4px'}}>Ẩn/Hiện cột</div>
                        {COLUMN_OPTIONS.map(opt => (
                            <label key={opt.key} style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', padding: '4px 0', cursor: 'pointer', fontWeight: 500, color: '#475569'}}>
                                <input type="checkbox" checked={visibleColumns.includes(opt.key)} onChange={() => toggleColumn(opt.key)} />
                                {opt.label}
                            </label>
                        ))}
                    </div>
                )}
            </th>
            </tr>
        </thead>
        <tbody>
            {processedOpps.length > 0 ? processedOpps.map(opp => (
            <tr key={opp.id} className={selectedIds.has(opp.id) ? 'selected-row' : ''} onClick={() => navigate(`/opportunity/edit/${opp.id}`)} style={{cursor: 'pointer'}}>
                <td onClick={e => handleToggleRow(e, opp.id)} style={{paddingLeft: '16px'}}>
                    <input type="checkbox" checked={selectedIds.has(opp.id)} readOnly />
                </td>
                {visibleColumns.includes('id') && <td style={{color: '#2563eb', fontWeight: 600}}>{opp.id}</td>}
                {visibleColumns.includes('content') && (
                <td>
                    <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                    <div className="contact-avatar" style={{width: '32px', height: '32px', fontSize: '11px', background: '#f1f5f9', color: '#1e293b', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}><Target size={16} /></div>
                    <div style={{fontWeight: 600, color: '#1e293b'}}>{opp.content}</div>
                    </div>
                </td>
                )}
                {visibleColumns.includes('company') && <td><span className="company-badge">{opp.company}</span></td>}
                {visibleColumns.includes('revenue') && <td style={{fontWeight: 500, color: '#0f172a'}}>{opp.revenue}</td>}
                {visibleColumns.includes('probability') && <td>{opp.probability}</td>}
                {visibleColumns.includes('date') && <td>{opp.date}</td>}
                {visibleColumns.includes('salesperson') && <td>{opp.salesperson}</td>}
                {visibleColumns.includes('status') && (
                <td onClick={e => e.stopPropagation()}>
                    <select 
                        value={opp.status}
                        onChange={(e) => {
                            e.stopPropagation();
                            mockStore.updateLeadStatus(opp.id, e.target.value);
                            setOpportunities(mockStore.getAllOpportunities());
                        }}
                        onClick={e => e.stopPropagation()}
                        style={{
                            padding: '4px 8px', 
                            borderRadius: '4px', 
                            fontSize: '12px', 
                            fontWeight: 600,
                            backgroundColor: opp.status === 'New' ? '#fee2e2' : opp.status === 'Converted' ? '#dcfce7' : '#f1f5f9',
                            color: opp.status === 'New' ? '#dc2626' : opp.status === 'Converted' ? '#16a34a' : '#64748b',
                            border: 'none',
                            outline: 'none',
                            cursor: 'pointer',
                            appearance: 'auto'
                        }}
                    >
                        <option value="New">Đang tiếp xúc</option>
                        <option value="Qualify">Đánh giá nhu cầu</option>
                        <option value="Proposition">Đang báo giá</option>
                        <option value="Bidding">Đấu thầu</option>
                        <option value="POC">POC</option>
                        <option value="Contract">Ký hợp đồng</option>
                        <option value="Deploy">Triển khai</option>
                        <option value="Converted">Thành công</option>
                        <option value="Lost">Thất bại</option>
                    </select>
                </td>
                )}
                <td></td>
            </tr>
            )) : (
            <tr><td colSpan="10" style={{textAlign: 'center', padding: '40px', color: '#94a3b8'}}>Không có dữ liệu cơ hội</td></tr>
            )}
        </tbody>
        </table>
      </div>
    </div>
  );
};

export default OpportunityList;
