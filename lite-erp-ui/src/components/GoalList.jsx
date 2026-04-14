import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  LayoutGrid, 
  List, 
  Search, 
  Target,
  Download,
  Upload,
  ChevronUp,
  ChevronDown,
  Filter,
  SlidersHorizontal,
  Circle,
  TrendingUp,
  TrendingDown,
  Minus,
  Edit2,
  Trash2,
  Calendar,
  Settings
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { mockStore } from '../utils/mockStore';
import { QueryBuilder } from './QueryBuilder';
import { evaluateQuery } from '../utils/filterUtils';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import './GoalList.css';

const STATUS_ORDER = ['Mới', 'Đang thực hiện', 'Chờ đánh giá', 'Hoàn thành', 'Không hoàn thành'];

const GoalList = () => {
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [goals, setGoals] = useState([]);
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
  const [filterPos, setFilterPos] = useState({ top: 0, right: 0 });
  
  // Adjusted for Goal attributes
  const [visibleColumns, setVisibleColumns] = useState(['id', 'month', 'approvalStatus']);

  useEffect(() => {
    setGoals(mockStore.getAllGoals());
  }, []);

  const handleNextStatus = (e, id, currentStatus) => {
    if(e) e.stopPropagation();
    const currentIndex = STATUS_ORDER.indexOf(currentStatus || 'Mới');
    if (currentIndex < STATUS_ORDER.length - 1) {
      const nextStatus = STATUS_ORDER[currentIndex + 1];
      const updatedGoals = goals.map(g => {
        if (g.id === id) {
          return { ...g, approvalStatus: nextStatus };
        }
        return g;
      });
      setGoals(updatedGoals);
      mockStore.updateGoal(id, { approvalStatus: nextStatus });
      alert(`Đã chuyển trạng thái sang: ${nextStatus}`);
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
    const temp = goals.map(g => ({
        ...g,
        month: g.startDate ? g.startDate.split('-').slice(1, 2).concat(g.startDate.split('-').slice(0, 1)).join('/') : ''
    }));
    return [...new Set(temp.map(g => g[key] || ''))].filter(Boolean);
  };

  const processedGoals = useMemo(() => {
    let result = goals.map(g => ({
      ...g,
      month: g.startDate ? g.startDate.split('-').slice(1, 2).concat(g.startDate.split('-').slice(0, 1)).join('/') : ''
    }));

    if (searchTerm) {
        const lowerSearch = searchTerm.toLowerCase();
        result = result.filter(g => 
            g.name?.toLowerCase().includes(lowerSearch) || 
            g.category?.toLowerCase().includes(lowerSearch) ||
            g.id?.toLowerCase().includes(lowerSearch)
        );
    }

    Object.keys(filters).forEach(key => {
        if (filters[key].length > 0) {
            result = result.filter(g => filters[key].includes(g[key]));
        }
    });

    if (advancedQuery && advancedQuery.rules.length > 0) {
      result = result.filter(g => evaluateQuery(g, advancedQuery));
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
  }, [goals, searchTerm, filters, sortConfig, advancedQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters, advancedQuery, sortConfig]);

  const totalItems = processedGoals.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const paginatedData = processedGoals.slice((safeCurrentPage - 1) * pageSize, safeCurrentPage * pageSize);

  const handleExport = () => {
    const dataToExport = selectedIds.size > 0 
        ? processedGoals.filter(g => selectedIds.has(g.id))
        : processedGoals;

    const exportData = dataToExport.map(g => ({
        'ID Mục tiêu': g.id,
        'Tên mục tiêu': g.name,
        'Nhóm chỉ tiêu': g.category,
        'Loại chỉ tiêu': g.subCategory,
        'Dịch vụ / Sản phẩm': g.serviceType,
        'Đơn vị': g.unit,
        'Tỷ trọng (%)': g.weight,
        'Ngày bắt đầu': g.startDate,
        'Ngày hoàn thành': g.endDate,
        'Trạng thái': g.approvalStatus || 'Mới',
        'Kết quả thực tế': g.actualProgress || ''
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Goals");
    XLSX.writeFile(wb, `Danh_sach_muc_tieu_${selectedIds.size > 0 ? 'selected_' : ''}${new Date().getTime()}.xlsx`);
  };

  const handleBulkDelete = () => {
    if (confirm(`Bạn có chắc chắn muốn xóa ${selectedIds.size} bản ghi đã chọn?`)) {
      setGoals(prev => prev.filter(g => !selectedIds.has(g.id)));
      setSelectedIds(new Set());
      alert('Đã xóa các bản ghi thành công!');
    }
  };

  const isBulkDeleteEnabled = useMemo(() => {
    if (selectedIds.size === 0) return false;
    const selectedGoals = goals.filter(g => selectedIds.has(g.id));
    return selectedGoals.every(g => (g.approvalStatus || 'Mới') === 'Mới');
  }, [selectedIds, goals]);

  const stats = useMemo(() => {
    return {
      new: goals.filter(g => (g.approvalStatus || 'Mới') === 'Mới').length,
      done: goals.filter(g => g.approvalStatus === 'Hoàn thành').length,
      waiting: goals.filter(g => g.approvalStatus === 'Chờ đánh giá').length
    };
  }, [goals]);

  const COLUMN_OPTIONS = [
    { key: 'id', label: 'ID mục tiêu' },
    { key: 'month', label: 'Tháng' },
    { key: 'status', label: 'Trạng thái' }
  ];

  const renderStatusBadge = (status) => {
      const s = status || 'Mới';
      if (s === 'Mới') return <span style={{background: '#f1f5f9', color: '#64748b', padding: '4px 8px', borderRadius: '4px', fontWeight: 600, fontSize: '12px'}}>{s}</span>;
      if (s === 'Đang thực hiện') return <span style={{background: '#eff6ff', color: '#2563eb', padding: '4px 8px', borderRadius: '4px', fontWeight: 600, fontSize: '12px'}}>{s}</span>;
      if (s === 'Chờ đánh giá') return <span style={{background: '#ffedd5', color: '#ea580c', padding: '4px 8px', borderRadius: '4px', fontWeight: 600, fontSize: '12px'}}>Chờ đánh giá</span>;
      if (s === 'Hoàn thành') return <span style={{background: '#dcfce7', color: '#16a34a', padding: '4px 8px', borderRadius: '4px', fontWeight: 600, fontSize: '12px'}}>{s}</span>;
      if (s === 'Không hoàn thành') return <span style={{background: '#fee2e2', color: '#ef4444', padding: '4px 8px', borderRadius: '4px', fontWeight: 600, fontSize: '12px'}}>Không hoàn thành</span>;
      return <span style={{background: '#f1f5f9', color: '#64748b', padding: '4px 8px', borderRadius: '4px', fontWeight: 600, fontSize: '12px'}}>{s}</span>;
  };

  const TableHeader = ({ label, columnKey, hasFilter = true }) => {
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
              <div onClick={(e) => { 
                  e.stopPropagation(); 
                  if (activeFilterCol !== columnKey) {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setFilterPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
                  }
                  setActiveFilterCol(activeFilterCol === columnKey ? null : columnKey); 
              }} style={{cursor: 'pointer', color: filters[columnKey]?.length > 0 ? '#e32b4c' : '#94a3b8'}}>
                  <Filter size={14} />
              </div>
          )}
        </div>
        {activeFilterCol === columnKey && createPortal(
            <div className="column-filter-popup" onClick={e => e.stopPropagation()} style={{position: 'fixed', top: `${filterPos.top}px`, right: `${filterPos.right}px`, zIndex: 9999, background: 'white', border: '1px solid #cbd5e1', borderRadius: '4px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', minWidth: '180px', width: 'max-content', padding: '8px', fontWeight: 'normal', color: '#334155'}}>
                <div style={{marginBottom: '8px', fontWeight: 600, fontSize: '12px', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px'}}>Lọc: {label}</div>
                <div style={{maxHeight: '200px', overflowY: 'auto'}}>
                  {getDistinctValues(columnKey).map(val => (
                      <label key={val} style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', padding: '4px 0', cursor: 'pointer'}}>
                          <input type="checkbox" checked={filters[columnKey]?.includes(val) || false} onChange={() => handleFilterChange(columnKey, val)}/>
                          {val}
                      </label>
                  ))}
                </div>
            </div>, document.body
        )}
      </th>
    );
  };

  return (
    <div className="goal-list-container" onClick={() => setActiveFilterCol(null)}>
      <div className="page-title-section">
        <h1>Quản lý mục tiêu</h1>
        <p>Hiện có {stats.new} mục tiêu mới cần được triển khai và {stats.waiting} mục tiêu chờ phê duyệt.</p>
      </div>

      <div className="metrics-cards-container">
        <div className="metric-card">
          <span className="metric-label">Tổng nhiệm vụ mới</span>
          <div className="metric-value-row">
            <span className="metric-value">{stats.new}</span>
            <div className="metric-trend" style={{color: '#F2BB24'}}><TrendingUp size={16} /> +2%</div>
          </div>
        </div>
        <div className="metric-card">
          <span className="metric-label">Tổng nhiệm vụ hoàn thành</span>
          <div className="metric-value-row">
            <span className="metric-value">{stats.done}</span>
            <div className="metric-trend" style={{color: '#00A63E'}}><TrendingUp size={16} /> +5%</div>
          </div>
        </div>
        <div className="metric-card">
          <span className="metric-label">Tổng chờ đánh giá</span>
          <div className="metric-value-row">
            <span className="metric-value">{stats.waiting}</span>
            <div className="metric-trend" style={{color: '#EE0033'}}><TrendingDown size={16} /> -1%</div>
          </div>
        </div>
      </div>

      <div className="action-bar-container">
        <div className="action-bar-left">
          <div className="search-group" style={{position: 'relative'}}>
            <div className="goal-search-box">
              <Search size={18} className="goal-search-icon" />
              <input type="text" placeholder="Tìm tên mục tiêu, phân loại..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
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
          {isBulkDeleteEnabled && (
            <button className="btn-outline-brand" style={{borderColor: '#ef4444', color: '#ef4444'}} onClick={handleBulkDelete}>
              <Trash2 size={18} /> Xóa
            </button>
          )}
          <button className="btn-outline-brand" onClick={() => navigate('/goal/new')}><Plus size={18} /> Thêm mục tiêu</button>
          <button className="btn-outline-brand" onClick={() => document.getElementById('import-input').click()}><Upload size={18} /> Nhập</button>
          <input type="file" id="import-input" style={{display: 'none'}} accept=".xlsx, .xls" onChange={handleImport} />
          <button className="btn-outline-brand" onClick={handleExport}>
            <Download size={18} /> Xuất Excel
          </button>
        </div>
      </div>

        <div className="goal-table-container">
          <table className="goal-table">
            <thead>
              <tr>
                <th style={{width: '40px', paddingLeft: '16px'}} onClick={e => e.stopPropagation()}>
                    <input type="checkbox" onChange={(e) => {
                      if (e.target.checked) setSelectedIds(new Set(processedGoals.map(g => g.id)));
                      else setSelectedIds(new Set());
                    }} checked={selectedIds.size === processedGoals.length && processedGoals.length > 0} />
                </th>
                <TableHeader label="ID mục tiêu" columnKey="id" />
                <TableHeader label="Tháng" columnKey="month" hasFilter={true} />
                <TableHeader label="Trạng thái" columnKey="approvalStatus" hasFilter={true} />
                <th style={{width: '60px', textAlign: 'center'}}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? paginatedData.map(goal => {
                const monthStr = goal.startDate ? goal.startDate.split('-').slice(0, 2).reverse().join('/') : '';
                return (
                  <tr key={goal.id} onClick={() => navigate(`/goal/edit/${goal.id}`)} className={selectedIds.has(goal.id) ? 'selected-row' : ''}>
                    <td onClick={e => handleToggleRow(e, goal.id)} style={{paddingLeft: '16px'}}>
                        <input type="checkbox" checked={selectedIds.has(goal.id)} readOnly />
                    </td>
                    {visibleColumns.includes('id') && <td style={{color: '#2563eb', fontWeight: 600}}>{goal.id}</td>}
                    {visibleColumns.includes('month') && <td>{goal.month}</td>}
                    {visibleColumns.includes('approvalStatus') && (
                      <td>
                          {renderStatusBadge(goal.approvalStatus)}
                      </td>
                    )}
                    <td style={{textAlign: 'center'}}>
                      <div style={{display: 'flex', gap: '4px', alignItems: 'center', justifyContent: 'center'}}>
                        <button 
                          className="kanban-edit-btn" 
                          style={{border: 'none', background: 'transparent', cursor: 'pointer', padding: '4px'}}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/goal/edit/${goal.id}`);
                          }}
                        >
                          <Edit2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr><td colSpan="5" style={{textAlign: 'center', padding: '40px', color: '#94a3b8'}}>Không có dữ liệu mục tiêu</td></tr>
              )}
            </tbody>
          </table>
        </div>

      {/* PAGINATION UI */}
      {processedGoals.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderTop: '1px solid #e2e8f0', background: 'white', borderRadius: '0 0 8px 8px', marginTop: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ color: '#64748b', fontSize: '13px' }}>
            Hiển thị {totalItems > 0 ? (safeCurrentPage - 1) * pageSize + 1 : 0}-{Math.min(safeCurrentPage * pageSize, totalItems)} trong số {totalItems} mục tiêu
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

export default GoalList;
