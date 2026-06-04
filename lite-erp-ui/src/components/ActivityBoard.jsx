import React, { useState, useMemo, useEffect } from 'react';
import './KanbanBoard.css'; // Inheritamos base styles
import './ActivityBoard.css'; // Specific styles
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, List, Columns, Clock, AlertCircle, CheckCircle2, Filter, ChevronUp, ChevronDown, SlidersHorizontal, Download, Edit2, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { QueryBuilder } from './QueryBuilder';
import { evaluateQuery } from '../utils/filterUtils';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import * as XLSX from 'xlsx';
import { TASKS_UPDATED_EVENT, loadPersonalTasks, savePersonalTasks } from '../utils/taskSyncStore';

const ALL_COLUMNS = [
  { key: 'id', label: 'ID công việc' },
  { key: 'title', label: 'Tên nhiệm vụ' },
  { key: 'assignee', label: 'Người được giao' },
  { key: 'dueDate', label: 'Hạn chót' },
  { key: 'priority', label: 'Độ ưu tiên' },
  { key: 'source', label: 'Nguồn' },
  { key: 'createdDate', label: 'Ngày tạo' },
  { key: 'status', label: 'Trạng thái' }
];

function ActivityBoard() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' or 'list'
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [advancedQuery, setAdvancedQuery] = useState({
    id: 'root',
    combinator: 'AND',
    rules: []
  });

  // List View specific states
  const [visibleColumns, setVisibleColumns] = useState(ALL_COLUMNS.map(c => c.key));
  const [showColPicker, setShowColPicker] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [filters, setFilters] = useState({});
  const [activeFilterCol, setActiveFilterCol] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [selectedRows, setSelectedRows] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  const currentColumns = [
    { id: 'todo', title: 'Mới', color: '#64748b' },
    { id: 'processing', title: 'Đang thực hiện', color: '#3b82f6' },
    { id: 'done', title: 'Hoàn thành', color: '#22c55e' },
  ];

  // Helper cho doanh thu
  const parseRevenue = (revenueStr) => {
    if (!revenueStr) return 0;
    return parseInt(revenueStr.replace(/[^0-9]/g, ''), 10) || 0;
  };
  const formatRevenue = (value) => {
    if (value === 0) return '0 ₫';
    return value.toLocaleString('vi-VN') + ' ₫';
  };

  const [activityList, setActivityList] = useState(() => loadPersonalTasks());

  useEffect(() => {
    savePersonalTasks(activityList);
  }, [activityList]);

  useEffect(() => {
    const refreshFromSharedStore = () => setActivityList(loadPersonalTasks());
    window.addEventListener(TASKS_UPDATED_EVENT, refreshFromSharedStore);
    return () => window.removeEventListener(TASKS_UPDATED_EVENT, refreshFromSharedStore);
  }, []);

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const updatedActivities = [...activityList];
    const activityIndex = updatedActivities.findIndex(a => a.id.toString() === draggableId.toString());
    
    if (activityIndex !== -1) {
      updatedActivities[activityIndex].status = destination.droppableId;
      setActivityList(updatedActivities);
    }
  };

  // --- LIST VIEW HELPER LOGIC ---
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    else if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = null;
      key = null;
    }
    setSortConfig({ key, direction });
  };

  const getDistinctValues = (key) => {
    return [...new Set(activityList.map(t => t[key] || ''))].filter(Boolean);
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

  const processedData = useMemo(() => {
    let result = [...activityList];

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(item => 
        Object.values(item).some(val => 
          String(val).toLowerCase().includes(lowerSearch)
        )
      );
    }

    Object.keys(filters).forEach(key => {
      if (filters[key].length > 0) {
        result = result.filter(item => filters[key].includes(item[key]));
      }
    });

    if (statusFilter !== 'All') {
      result = result.filter(item => item.status === statusFilter);
    }
    
    if (priorityFilter !== 'All') {
      result = result.filter(item => item.priority === priorityFilter);
    }

    if (advancedQuery && advancedQuery.rules.length > 0) {
      result = result.filter(item => evaluateQuery(item, advancedQuery));
    }

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
  }, [activityList, searchTerm, filters, sortConfig, advancedQuery]);

  const totalItems = processedData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages || 1);
  const paginatedData = processedData.slice((safeCurrentPage - 1) * pageSize, safeCurrentPage * pageSize);

  const handleExport = () => {
    const exportData = processedData.map(item => {
      const row = {};
      ALL_COLUMNS.forEach(col => {
        if (visibleColumns.includes(col.key)) {
          row[col.label] = item[col.key] || '';
        }
      });
      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Activities");
    XLSX.writeFile(workbook, "Activities_Export.xlsx");
  };

  const getDueDateStyle = (dueDate) => {
    if (!dueDate) return { color: '#64748b', borderColor: '#cbd5e1', backgroundColor: '#f8fafc' };
    if (dueDate < '2026-04-10') return { color: '#ef4444', borderColor: '#ef4444', backgroundColor: '#fef2f2' };
    if (dueDate === '2026-04-10') return { color: '#ca8a04', borderColor: '#fef08a', backgroundColor: '#fef9c3' };
    return { color: '#16a34a', borderColor: '#bbf7d0', backgroundColor: '#f0fdf4' };
  };

  const getPriorityLabel = (priority) => {
    if (priority === 'critical') return 'Rất gấp';
    if (priority === 'high') return 'Gấp';
    if (priority === 'normal') return 'Bình thường';
    if (priority === 'low') return 'Thấp';
    return '';
  };

  const getStatusBadge = (activity) => {
    if (activity.status === 'done') return null;
    if (activity.isOverdue) return <span className="badge overdue">Trễ hạn</span>;
    if (activity.dueDate === '2026-04-10') return <span className="badge due-today">Hôm nay</span>;
    return null;
  };

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = String(name).trim().split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Kanban: intentionally avoid decorative icons (stars/activity-type).

  return (
    <div className="activity-board kanban-container" onClick={() => setActiveFilterCol(null)}>
      <style>{`
        .task-popover-container .task-popover {
           display: none;
        }
        .task-popover-container:hover .task-popover {
           display: block;
        }

        /* Figma Table UI additions */
        .list-view-container {
          background: white;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          overflow: auto;
          flex: 1;
        }
        .list-view-table th {
          position: sticky;
          top: 0;
          background: #FFFFFF !important;
          padding: 16px 12px !important;
          font-weight: 700 !important;
          color: #000000 !important;
          border-bottom: 1px solid #E5E7EB !important;
          border-top: 1px solid #E5E7EB !important;
          border-right: none !important;
        }
        .list-view-table td {
          padding: 16px 12px !important;
          color: #000000 !important;
          border-bottom: 1px solid #E5E7EB !important;
        }
        .list-view-table tbody tr:nth-child(even) {
          background-color: #FAFAFA !important;
        }
        .list-view-table tbody tr.row-selected {
          background-color: #fdf2f2 !important;
        }
        .list-view-table tbody tr:hover {
          background-color: #f1f5f9 !important;
        }
        .list-view-table input[type="checkbox"] {
          width: 16px;
          height: 16px;
          accent-color: #e32b4c;
        }
      `}</style>
      {/* HEADER SECTION */}
      {(() => {
         let overdue = 0;
         let today = 0;
         let done = 0;
         activityList.forEach(item => {
             if (item.status === 'done') done++;
             else {
                 if (item.dueDate === '2026-04-10') today++;
                 else if (item.dueDate < '2026-04-10') overdue++;
             }
         });
         return (
           <div className="kanban-header" style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'flex-start' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
               <div style={{ textAlign: 'left' }}>
                 <h1 className="page-title" style={{ margin: 0, fontSize: '24px', color: '#1e293b', fontWeight: 700 }}>Quản lý tiếp xúc Khách hàng</h1>
               </div>
               <button 
                 className="btn" 
                 style={{ backgroundColor: '#e32b4c', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}
                 onClick={() => navigate('/activity/new')}
               >
                 + Hoạt động
               </button>
             </div>
             
            <div className="metrics-cards-container" style={{ width: '100%' }}>
              <div className="metric-card">
                 <span className="metric-label">Trễ hạn</span>
                 <div className="metric-value-row">
                   <span className="metric-value" style={{color: '#ef4444'}}>{overdue}</span>
                   <div className="metric-trend" style={{color: '#ef4444'}}><TrendingDown size={14} /> Quá hạn</div>
                 </div>
              </div>
              <div className="metric-card">
                 <span className="metric-label">Đến hạn hôm nay</span>
                 <div className="metric-value-row">
                   <span className="metric-value" style={{color: '#f59e0b'}}>{today}</span>
                   <div className="metric-trend" style={{color: '#f59e0b'}}><TrendingUp size={14} /> Hôm nay</div>
                 </div>
              </div>
              <div className="metric-card">
                 <span className="metric-label">Đã hoàn thành</span>
                 <div className="metric-value-row">
                   <span className="metric-value" style={{color: '#10b981'}}>{done}</span>
                   <div className="metric-trend" style={{color: '#10b981'}}><CheckCircle2 size={14} /> Hoàn thành</div>
                 </div>
              </div>
            </div>
           </div>
         );
      })()}

      {/* TOOLBAR SECTION */}
      <div className="list-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', background: 'white', padding: '24px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <div className="search-group" style={{ position: 'relative', display: 'flex', gap: '24px', alignItems: 'center' }}>
            <div className="contact-search-box" style={{ width: '434px', position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#44494D' }} />
              <input type="text" placeholder="Tìm kiếm tự do..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ padding: '10px 16px 10px 44px', borderRadius: '8px', border: '1px solid #E2E8F0', background: '#F8F8F8', fontSize: '14px', width: '100%', outline: 'none', color: '#44494D' }} />
            </div>

            <button className="btn" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 12px', height: '40px', backgroundColor: showAdvancedFilter ? '#c22541' : '#e32b4c', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }} onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}>
              <Filter size={16}/> Lọc nâng cao
            </button>
            
            {showAdvancedFilter && (
              <div style={{position: 'absolute', top: '100%', left: 0, marginTop: '8px', zIndex: 100, width: '600px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', border: '1px solid #cbd5e1', borderRadius: '8px', background: 'white', overflow: 'hidden'}}>
                 <div style={{padding: '12px 16px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <span style={{fontWeight: 600, color: '#0f172a'}}>Bộ lọc phức tạp</span>
                    <button style={{background: 'none', border: 'none', color: '#64748b', cursor: 'pointer'}} onClick={() => setShowAdvancedFilter(false)}>Đóng</button>
                 </div>
                 <div style={{padding: '16px', maxHeight: '400px', overflowY: 'auto'}}>
                   <QueryBuilder query={advancedQuery} fields={ALL_COLUMNS} onChange={setAdvancedQuery} />
                 </div>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn-outline-brand" onClick={handleExport} title="Xuất dữ liệu" style={{ border: '1px solid #f45476', color: '#e32b4c', background: 'transparent', height: '40px', padding: '0 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
              <Download size={18} /> Xuất Excel
            </button>
          </div>

          <div className="view-switcher" style={{ background: '#EFEDED', padding: '4px', borderRadius: '8px', display: 'flex', gap: '4px' }}>
             {selectedRows.length > 0 && selectedRows.every(id => activityList.find(a => a.id === id)?.status === 'todo') && (
               <button 
                 className="btn" 
                 onClick={() => {
                   if (window.confirm(`Bạn có chắc muốn xóa ${selectedRows.length} nhiệm vụ đang chọn?`)) {
                     setActivityList(prev => prev.filter(a => !selectedRows.includes(a.id)));
                     setSelectedRows([]);
                   }
                 }} 
                 style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', padding: '0 16px', height: '40px', fontWeight: 600, fontSize: '14px', cursor: 'pointer', marginRight: '16px' }}
               >
                 <Trash2 size={16} style={{ marginRight: '8px' }} /> Xóa ({selectedRows.length})
               </button>
             )}
             <button className={`view-btn ${viewMode === 'kanban' ? 'active' : ''}`} style={{ border: 'none', background: viewMode === 'kanban' ? 'white' : 'transparent', color: viewMode === 'kanban' ? '#e32b4c' : '#64748b', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }} onClick={() => setViewMode('kanban')} title="Kanban View"><Columns size={16} /></button>
             <button className={`view-btn ${viewMode === 'list' ? 'active' : ''}`} style={{ border: 'none', background: viewMode === 'list' ? 'white' : 'transparent', color: viewMode === 'list' ? '#e32b4c' : '#64748b', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }} onClick={() => setViewMode('list')} title="List View"><List size={16} /></button>
          </div>
        </div>
      </div>

      {viewMode === 'kanban' ? (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="kanban-columns">
            {currentColumns.map(col => {
              const columnTasks = processedData.filter(a => a.status === col.id);
              
              const totalRevenue = columnTasks.reduce((sum, t) => sum + parseRevenue(t.revenue), 0);
              const totalAct = columnTasks.length;
              const overdueCount = columnTasks.filter(item => item.dueDate && item.status !== 'done' && item.dueDate < '2026-04-10').length;
              const todayCount = columnTasks.filter(item => item.dueDate && item.status !== 'done' && item.dueDate === '2026-04-10').length;
              const futureCount = totalAct - overdueCount - todayCount;

              const greenPct = totalAct ? (futureCount / totalAct) * 100 : 0;
              const yellowPct = totalAct ? (todayCount / totalAct) * 100 : 0;
              const redPct = totalAct ? (overdueCount / totalAct) * 100 : 0;

              return (
              <div key={col.id} className="kanban-column" style={{ backgroundColor: '#f6f6f6', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, minWidth: '0' }}>
                <div className="column-header" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', padding: 0, margin: 0, background: 'transparent' }}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden', flex: 1, width: '100%', marginBottom: '0'}}>
                      <div className="column-count" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0', borderRadius: '8px', width: '24px', height: '24px', color: '#545454', fontSize: '14px', fontWeight: 700, flexShrink: 0, backgroundColor: 'transparent' }}>{columnTasks.length}</div>
                      <h3 className="column-title" style={{ margin: 0, flexShrink: 0, color: '#545454', fontSize: '14px', fontWeight: 600, textTransform: 'uppercase' }}>{col.title}</h3>
                    </div>
                  <div className="column-progress-bar" style={{ display: 'flex', height: '4px', width: '100%', borderRadius: '4px', overflow: 'hidden', backgroundColor: '#e2e8f0', marginTop: '8px' }}>
                    {greenPct > 0 && <div style={{width: `${greenPct}%`, backgroundColor: '#22c55e'}} title={`Chưa đến hạn: ${futureCount}`}></div>}
                    {yellowPct > 0 && <div style={{width: `${yellowPct}%`, backgroundColor: '#eab308'}} title={`Hôm nay: ${todayCount}`}></div>}
                    {redPct > 0 && <div style={{width: `${redPct}%`, backgroundColor: '#ef4444'}} title={`Quá hạn: ${overdueCount}`}></div>}
                  </div>
                </div>
                
                <Droppable droppableId={col.id}>
                  {(provided, snapshot) => (
                    <div className={`task-list kanban-column-content ${snapshot.isDraggingOver ? 'dragging-over' : ''}`} {...provided.droppableProps} ref={provided.innerRef}>
                      {columnTasks.map((activity, index) => {
                        const isOverdue = activity.dueDate && activity.status !== 'done' && activity.dueDate < '2026-04-10';
                        return (
                          <Draggable key={activity.id.toString()} draggableId={activity.id.toString()} index={index}>
                            {(provided, snapshot) => (
                              <div 
                                className={`activity-card opp-style priority-${activity.priority} ${isOverdue ? 'is-overdue' : ''} ${snapshot.isDragging ? 'is-dragging' : ''}`} 
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                ref={provided.innerRef}
                                onClick={() => navigate(`/activity/edit/${activity.id}`)}
                              >
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', background: '#f1f5f9', padding: '2px 8px', borderRadius: '999px', flexShrink: 0 }}>
                                        {`ACT-2026-${String(activity.id).padStart(5, '0')}`}
                                      </span>
                                      <div className="card-title" title={activity.title} style={{ minWidth: 0 }}>{activity.title}</div>
                                    </div>
                                    <div />
                                  </div>
                                  <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                                      <span style={{ fontWeight: 600, color: '#475569' }}>Người được giao:</span>
                                      <span>{activity.assignee || '-'}</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                                      <span style={{ fontWeight: 600, color: '#475569' }}>Độ ưu tiên:</span>
                                      <span>{getPriorityLabel(activity.priority) || '-'}</span>
                                    </div>
                                  </div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', borderTop: '1px dashed #f1f5f9', paddingTop: '8px' }}>
                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                      <div style={{ ...getDueDateStyle(activity.dueDate), borderRadius: '4px', padding: '2px 6px', fontSize: '10px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid' }}>
                                         <Calendar size={12} /> {activity.dueDate}
                                      </div>
                                    </div>
                                    <div className="avatar-circle" style={{ backgroundColor: '#8b5cf6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>
                                      {getInitials(activity.assignee)}
                                    </div>
                                  </div>
                              </div>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
              );
            })}
          </div>
        </DragDropContext>
      ) : (
        <>
        <div className="list-view-container" style={{overflow: 'auto', backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '8px', marginBottom: '16px'}}>
          <table className="list-view-table" style={{width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px', whiteSpace: 'nowrap'}}>
            <thead>
              <tr>
                <th style={{position: 'sticky', top: 0, zIndex: 6, backgroundColor: '#FFFFFF', padding: '16px 12px', fontWeight: 700, color: '#000000', borderBottom: '1px solid #E5E7EB', borderTop: '1px solid #E5E7EB', width: '40px', textAlign: 'center'}}>
                   <input 
                     type="checkbox" 
                     checked={paginatedData.length > 0 && selectedRows.length === paginatedData.length} 
                     onChange={(e) => {
                       if(e.target.checked) setSelectedRows(paginatedData.map(t => t.id));
                       else setSelectedRows([]);
                     }}
                   />
                </th>
                {ALL_COLUMNS.filter(col => visibleColumns.includes(col.key)).map(col => (
                  <th key={col.key} style={{position: 'sticky', top: 0, zIndex: col.key === activeFilterCol ? 6 : 5}}>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                      <div style={{display: 'flex', alignItems: 'center', cursor: 'pointer', flex: 1}} onClick={() => handleSort(col.key)}>
                        {col.label}
                        <div style={{display: 'flex', flexDirection: 'column', marginLeft: '6px', color: sortConfig.key === col.key ? '#0f172a' : '#cbd5e1'}}>
                          <ChevronUp size={12} style={{marginBottom: '-4px', opacity: sortConfig.key === col.key && sortConfig.direction === 'desc' ? 0.3 : 1}} />
                          <ChevronDown size={12} style={{opacity: sortConfig.key === col.key && sortConfig.direction === 'asc' ? 0.3 : 1}} />
                        </div>
                      </div>
                      <div className="filter-trigger" onClick={(e) => { e.stopPropagation(); setActiveFilterCol(activeFilterCol === col.key ? null : col.key); }} style={{cursor: 'pointer', color: (filters[col.key] && filters[col.key].length > 0) ? '#16a34a' : '#94a3b8'}}>
                        <Filter size={14} />
                      </div>
                    </div>

                    {activeFilterCol === col.key && (
                      <div className="column-filter-popup" onClick={e => e.stopPropagation()} style={{position: 'absolute', top: '100%', right: 0, zIndex: 10, background: 'white', border: '1px solid #cbd5e1', borderRadius: '4px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', minWidth: '180px'}}>
                        <div style={{padding: '8px', borderBottom: '1px solid #e2e8f0', fontWeight: 600, fontSize: '12px', color: '#334155'}}>Lọc: {col.label}</div>
                        <div style={{maxHeight: '200px', overflowY: 'auto', padding: '8px'}}>
                           {getDistinctValues(col.key).map(val => (
                             <label key={val} style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', padding: '4px 0', cursor: 'pointer'}}>
                               <input type="checkbox" checked={filters[col.key]?.includes(val) || false} onChange={() => handleFilterChange(col.key, val)}/>
                               {val}
                             </label>
                           ))}
                           {getDistinctValues(col.key).length === 0 && <div style={{fontSize: '12px', color: '#94a3b8', fontStyle: 'italic'}}>Không có dữ liệu</div>}
                        </div>
                      </div>
                    )}
                  </th>
                ))}
                
                <th style={{position: 'sticky', top: 0, zIndex: 6, backgroundColor: '#FFFFFF', padding: '16px 12px', borderBottom: '1px solid #E5E7EB', borderTop: '1px solid #E5E7EB', width: '40px', textAlign: 'center'}} onClick={(e) => { e.stopPropagation(); setShowColPicker(!showColPicker); }}>
                  <SlidersHorizontal size={16} color="#94a3b8" style={{cursor: 'pointer'}} />
                  {showColPicker && (
                    <div className="column-picker-popup" onClick={e => e.stopPropagation()} style={{position: 'absolute', top: '100%', right: 0, zIndex: 10, background: 'white', border: '1px solid #cbd5e1', borderRadius: '4px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', minWidth: '150px', padding: '8px', fontWeight: 'normal', textAlign: 'left'}}>
                      <div style={{marginBottom: '8px', fontWeight: 600, fontSize: '12px', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px', color: '#1e293b'}}>Hiển thị cột</div>
                      <div style={{maxHeight: '300px', overflowY: 'auto'}}>
                        {ALL_COLUMNS.map(col => (
                          <label key={col.key} style={{display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0', fontSize: '13px', cursor: 'pointer', color: '#334155'}}>
                            <input 
                              type="checkbox" 
                              checked={visibleColumns.includes(col.key)}
                              onChange={() => {
                                if (visibleColumns.includes(col.key)) {
                                  setVisibleColumns(visibleColumns.filter(c => c !== col.key));
                                } else {
                                  const newCols = [...visibleColumns, col.key];
                                  setVisibleColumns(ALL_COLUMNS.map(c => c.key).filter(k => newCols.includes(k)));
                                }
                              }}
                            />
                            {col.label}
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? paginatedData.map(activity => (
                <tr key={activity.id} style={{cursor: 'pointer', transition: 'background-color 0.2s'}} onClick={() => navigate(`/activity/edit/${activity.id}`)} className={selectedRows.includes(activity.id) ? "row-selected" : "list-row-hover"}>
                  <td style={{textAlign: 'center'}} onClick={e => e.stopPropagation()}>
                    <input type="checkbox" checked={selectedRows.includes(activity.id)} onChange={(e) => {
                       if(e.target.checked) setSelectedRows([...selectedRows, activity.id]);
                       else setSelectedRows(selectedRows.filter(id => id !== activity.id));
                    }}/>
                  </td>
                  
                  {visibleColumns.includes('id') && <td style={{ fontWeight: 700, color: '#0f172a' }}>{`ACT-2026-${String(activity.id).padStart(5, '0')}`}</td>}
                  {visibleColumns.includes('title') && (
                    <td style={{ fontWeight: 500 }}>
                      {activity.title} 
                      {activity.isDaily && <span className="badge daily" style={{ marginLeft: 8 }}>Daily</span>}
                      {activity.isOverdue && <span className="badge overdue" style={{ marginLeft: 8 }}>Trễ hạn</span>}
                    </td>
                  )}
                  {visibleColumns.includes('assignee') && <td>{activity.assignee || '-'}</td>}
                  {visibleColumns.includes('dueDate') && <td>{activity.dueDate}</td>}
                  {visibleColumns.includes('priority') && (
                    <td>
                      {activity.priority === 'critical' && <div style={{display: 'flex', alignItems: 'center', gap: '6px'}}><div style={{width: 8, height: 8, borderRadius: '50%', backgroundColor: '#ef4444'}}></div> <span>Rất gấp</span></div>}
                      {activity.priority === 'high' && <div style={{display: 'flex', alignItems: 'center', gap: '6px'}}><div style={{width: 8, height: 8, borderRadius: '50%', backgroundColor: '#eab308'}}></div> <span>Gấp</span></div>}
                      {activity.priority === 'low' && <div style={{display: 'flex', alignItems: 'center', gap: '6px'}}><div style={{width: 8, height: 8, borderRadius: '50%', backgroundColor: '#94a3b8'}}></div> <span>Thấp</span></div>}
                      {(activity.priority === 'normal' || !activity.priority) && <div style={{display: 'flex', alignItems: 'center', gap: '6px'}}><div style={{width: 8, height: 8, borderRadius: '50%', backgroundColor: '#22c55e'}}></div> <span>Bình thường</span></div>}
                    </td>
                  )}
                  {visibleColumns.includes('source') && <td title={activity.source || ''}>{activity.source || '-'}</td>}
                  {visibleColumns.includes('createdDate') && <td>{activity.createdDate || '11/04/2026'}</td>}
                  {visibleColumns.includes('status') && (
                    <td>
                      {activity.status === 'todo' && <span className="status-badge" style={{ backgroundColor: '#e2e8f0', color: '#475569', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>Mới</span>}
                      {activity.status === 'processing' && <span className="status-badge" style={{ backgroundColor: '#dbeafe', color: '#1d4ed8', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>Đang thực hiện</span>}
                      {activity.status === 'done' && <span className="status-badge" style={{ backgroundColor: '#dcfce3', color: '#166534', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>Hoàn thành</span>}
                      {activity.status === 'cancelled' && <span className="status-badge" style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>Hủy</span>}
                    </td>
                  )}
                  <td style={{ textAlign: 'center' }}>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={visibleColumns.length + 2} style={{padding: '30px', textAlign: 'center', color: '#64748b'}}>Không tìm thấy dữ liệu khớp lệnh trích xuất.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* BOTTOM PAGINATION */}
        {processedData.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', border: '1px solid #E2E8F0', background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div style={{ color: '#64748b', fontSize: '13px' }}>
              Hiển thị {totalItems > 0 ? (safeCurrentPage - 1) * pageSize + 1 : 0}-{Math.min(safeCurrentPage * pageSize, totalItems)} trong số {totalItems} nhiệm vụ
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button onClick={() => setCurrentPage(p => p - 1)} disabled={safeCurrentPage === 1} style={{ border: 'none', background: 'transparent', cursor: safeCurrentPage === 1 ? 'default' : 'pointer', opacity: safeCurrentPage === 1 ? 0.3 : 1, padding: '4px 8px', fontWeight: 700 }}>
                &lt;
              </button>

              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
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
        </>
      )}
    </div>
  );
}

export default ActivityBoard;
