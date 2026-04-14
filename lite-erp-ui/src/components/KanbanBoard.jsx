import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './KanbanBoard.css';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Search, Filter, ArrowUpDown, Plus, MessageSquare, Calendar, LayoutGrid, List, Settings, Download, Upload, ChevronUp, ChevronDown, SlidersHorizontal, Star, Clock, Phone, Mail, CheckCircle2 } from 'lucide-react';
import * as XLSX from 'xlsx';

// --- MOCK DATA ---
const ALL_COLUMNS = [
  { key: 'id', label: 'Lead ID' },
  { key: 'content', label: 'Tên Lead' },
  { key: 'company', label: 'Tên khách hàng' },
  { key: 'mst', label: 'MST' },
  { key: 'contactName', label: 'Contact Name' },
  { key: 'email', label: 'Email' },
  { key: 'district', label: 'Quận/Huyện' },
  { key: 'ward', label: 'Phường/Xã' },
  { key: 'city', label: 'Thành phố' },
  { key: 'projectedService', label: 'Dịch vụ dự kiến' },
  { key: 'assignedPartner', label: 'Assigned Partner' },
  { key: 'status', label: 'Trạng thái' },
  { key: 'revenue', label: 'Doanh thu (Dự kiến)' },
  { key: 'probability', label: 'Xác suất' },
  { key: 'salesperson', label: 'Sale person' }
];

import { mockStore } from '../utils/mockStore';

// --- MAIN COMPONENT ---

function KanbanBoard() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // --- STATE ---
  // Helper for Initials
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length === 0) return 'U';
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Helper for Stars
  const renderStars = (probability) => {
    const probInt = parseInt(probability || '0');
    let stars = 1; // Default 1 star priority
    if (probInt > 70) stars = 3;
    else if (probInt > 30) stars = 2;
    
    return (
      <div style={{display: 'flex', gap: '2px'}}>
        <Star size={15} fill={stars >= 1 ? '#fbbf24' : '#cbd5e1'} color="transparent" />
        <Star size={15} fill={stars >= 2 ? '#fbbf24' : '#cbd5e1'} color="transparent" />
        <Star size={15} fill={stars >= 3 ? '#fbbf24' : '#cbd5e1'} color="transparent" />
      </div>
    );
  };

  const renderPopoverTasks = (tasksList) => {
    if (!tasksList || tasksList.length === 0) return null;
    return (
      <div className="task-popover" style={{ position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: '8px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', zIndex: 100, minWidth: '220px', cursor: 'default' }}>
        {tasksList.map(t => (
          <div key={t.id} style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px solid #f1f5f9', padding: '8px 12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <div style={{display: 'flex', alignItems: 'center', gap: '6px', fontWeight: t.status === 'done' ? 500 : 600, color: t.status === 'done' ? '#cbd5e1' : (t.status === 'todo' ? '#22c55e' : t.status === 'today' ? '#eab308' : '#ef4444'), textDecoration: t.status === 'done' ? 'line-through' : 'none', fontSize: '13px'}}>
                {t.type === 'phone' && <Phone size={14} color="currentColor" />}
                {t.type === 'mail' && <Mail size={14} color="currentColor" />}
                {t.type === 'meeting' && <Calendar size={14} color="currentColor" />}
                <span>{t.title}</span>
              </div>
              <div style={{display: 'flex', gap: '8px'}}>
                 <span style={{cursor: 'pointer', color: '#94a3b8', fontSize: '12px'}}>✏️</span>
                 <span style={{cursor: 'pointer', color: t.status === 'done' ? '#16a34a' : '#64748b', fontSize: '12px'}}>✅</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748b' }}>
               <div style={{ width: '16px', height: '16px', borderRadius: '4px', backgroundColor: '#8b5cf6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 'bold' }}>M</div>
               <span>Mitchell Admin</span>
             </div>
          </div>
        ))}
      </div>
    );
  };


  // Helper for Revenue Sum
  const parseRevenue = (revenueStr) => {
    if (!revenueStr) return 0;
    return parseInt(revenueStr.replace(/[^0-9]/g, ''), 10) || 0;
  };
  const formatRevenue = (value) => {
    if (value === 0) return '0 ₫';
    return value.toLocaleString('vi-VN') + ' ₫';
  };
  const [data, setData] = useState(() => mockStore.getStore());
  
  // Need useEffect to refresh if returned from form
  React.useEffect(() => {
    setData(mockStore.getStore());
  }, []);
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'kanban'
  const [searchTerm, setSearchTerm] = useState('');
  
  // List View specific states
  const [visibleColumns, setVisibleColumns] = useState(ALL_COLUMNS.map(c => c.key));
  const [showColPicker, setShowColPicker] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [filters, setFilters] = useState({});
  const [activeFilterCol, setActiveFilterCol] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [selectedRows, setSelectedRows] = useState([]);

  // --- KANBAN LOGIC ---
  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const sourceColIndex = data.columns.findIndex(col => col.id === source.droppableId);
    const destColIndex = data.columns.findIndex(col => col.id === destination.droppableId);

    const sourceCol = data.columns[sourceColIndex];
    const destCol = data.columns[destColIndex];

    const newSourceTaskIds = Array.from(sourceCol.taskIds);
    newSourceTaskIds.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      newSourceTaskIds.splice(destination.index, 0, draggableId);
      const newCol = { ...sourceCol, taskIds: newSourceTaskIds };
      const newColumns = [...data.columns];
      newColumns[sourceColIndex] = newCol;
      setData({ ...data, columns: newColumns });
      return;
    }

    const newDestTaskIds = Array.from(destCol.taskIds);
    newDestTaskIds.splice(destination.index, 0, draggableId);

    const newSourceCol = { ...sourceCol, taskIds: newSourceTaskIds };
    const newDestCol = { ...destCol, taskIds: newDestTaskIds };

    const newColumns = [...data.columns];
    newColumns[sourceColIndex] = newSourceCol;
    newColumns[destColIndex] = newDestCol;

    const task = data.tasks[draggableId];
    const updatedTask = { ...task, status: newDestCol.title };
    
    const newData = { ...data, columns: newColumns, tasks: { ...data.tasks, [draggableId]: updatedTask } };
    
    setData(newData);
    mockStore.saveStore(newData);
  };

  // --- LIST VIEW LOGIC ---
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    else if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = null;
      key = null;
    }
    setSortConfig({ key, direction });
  };

  const currentTasks = Object.values(data.tasks);

  // Derived distinct values for filtering
  const getDistinctValues = (key) => {
    return [...new Set(currentTasks.map(t => t[key] || ''))].filter(Boolean);
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
    let result = [...currentTasks];

    // Global Search
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(item => 
        Object.values(item).some(val => 
          String(val).toLowerCase().includes(lowerSearch)
        )
      );
    }

    // Column Filters
    Object.keys(filters).forEach(key => {
      if (filters[key].length > 0) {
        result = result.filter(item => filters[key].includes(item[key]));
      }
    });

    // Sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        const valA = a[sortConfig.key] || '';
        const valB = b[sortConfig.key] || '';
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    } else {
      // Default: sort by numeric part of ID descending
      result.sort((a, b) => {
        const numA = parseInt((a.id || '').split('-')[1]) || 0;
        const numB = parseInt((b.id || '').split('-')[1]) || 0;
        return numB - numA;
      });
    }

    return result;
  }, [currentTasks, searchTerm, filters, sortConfig]);

  // --- PAGINATION LOGIC ---
  const totalItems = processedData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages || 1);
  const paginatedData = processedData.slice((safeCurrentPage - 1) * pageSize, safeCurrentPage * pageSize);

  // --- IMPORT / EXPORT LOGIC ---
  const handleExport = () => {
    // Generate export array based on visible columns and processed data
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");
    XLSX.writeFile(workbook, "Leads_Export.xlsx");
  };

  const triggerImport = () => {
    fileInputRef.current.click();
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
      const jsonObj = XLSX.utils.sheet_to_json(ws);

      if (jsonObj.length === 0) return;

      const newTasksObj = {};
      const newTaskIds = [];

      jsonObj.forEach((row, index) => {
        // Map excel row matching headers to our column system. Fallback to generic defaults.
        const id = row['Lead ID'] || `IM-LEAD-${Date.now()}-${index}`;
        const content = row['Tên Lead'] || `Imported Lead ${index}`;
        
        newTasksObj[id] = {
          id,
          content,
          contactName: row['Contact Name'] || '',
          email: row['Email'] || '',
          district: row['Quận/Huyện'] || '',
          ward: row['Phường/Xã'] || '',
          city: row['Thành phố'] || '',
          assignedPartner: row['Assigned Partner'] || '',
          status: 'Khách hàng mới', // Override or use row['Trạng thái'] if preferred inside Odoo logical flow. Usually new imports go to pipeline root.
          revenue: row['Doanh thu (Dự kiến)'] || '0 ₫',
          probability: row['Xác suất'] || '0%',
          salesperson: row['Sale person'] || 'System',
          date: new Date().toLocaleDateString('vi-VN'),
          company: row['Contact Name'] ? '' : 'Imported Company',
          tags: [], attachments: 0, comments: 0, avatars: []
        };
        newTaskIds.push(id);
      });

      // Update state
      setData(prev => {
        const updatedColumns = [...prev.columns];
        // Ensure new tasks go to the first column (Khách hàng mới)
        updatedColumns[0] = {
          ...updatedColumns[0],
          taskIds: [...newTaskIds, ...updatedColumns[0].taskIds]
        };
        const newData = {
          ...prev,
          columns: updatedColumns,
          tasks: { ...prev.tasks, ...newTasksObj }
        };
        mockStore.saveStore(newData);
        return newData;
      });
      alert(`Đã import thành công ${jsonObj.length} dòng dữ liệu.`);
    };
    reader.readAsBinaryString(file);
    e.target.value = null; // reset
  };

  return (
    <div className="kanban-container" onClick={() => setActiveFilterCol(null)}>
      <style>{`
        .task-popover-container .task-popover {
           display: none;
        }
        .task-popover-container:hover .task-popover {
           display: block;
        }
      `}</style>
      <div className="kanban-header">
        <h1 className="page-title">Danh sách Lead</h1>
        <div style={{display: 'flex', gap: '16px', alignItems: 'center'}}>
          
          <button className="btn-secondary" onClick={handleExport} title="Export to Excel">
            <Download size={16} /> Export
          </button>
          <button className="btn-secondary" onClick={triggerImport} title="Import from Excel">
            <Upload size={16} /> Import
          </button>
          <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept=".xlsx, .xls, .csv" onChange={handleImport} />

          {/* VIEW SWITCHER */}
          <div className="view-switcher">
             <button className={`view-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')} title="List View"><List size={18} /></button>
             <button className={`view-btn ${viewMode === 'kanban' ? 'active' : ''}`} onClick={() => setViewMode('kanban')} title="Kanban View"><LayoutGrid size={18} /></button>
          </div>
          <button className="btn-primary" onClick={() => navigate('/lead/new')}>
            <Plus size={16} /> Lead
          </button>
        </div>
      </div>

      <div className="kanban-toolbar">
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input type="text" placeholder="Tìm kiếm tự do..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        
        <div className="toolbar-actions" style={{position: 'relative', display: 'flex', alignItems: 'center'}}>
          {viewMode === 'list' && (
            <div className="pagination-controls" style={{display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: '#64748b', marginRight: '16px'}}>
               <select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setCurrentPage(1); }} className="page-size-select" style={{border: '1px solid transparent', background: 'transparent', outline: 'none', color: '#64748b', cursor: 'pointer', padding: '2px 4px', borderRadius: '4px'}}>
                 <option value={6}>6 items</option>
                 <option value={10}>10 items</option>
                 <option value={20}>20 items</option>
                 <option value={50}>50 items</option>
               </select>
               <span>{totalItems > 0 ? (safeCurrentPage - 1) * pageSize + 1 : 0}-{Math.min(safeCurrentPage * pageSize, totalItems)} / {totalItems}</span>
               <div style={{display: 'flex', gap: '8px'}}>
                 <button onClick={() => setCurrentPage(p => p - 1)} disabled={safeCurrentPage === 1} style={{border: 'none', background: 'transparent', cursor: safeCurrentPage === 1 ? 'default' : 'pointer', opacity: safeCurrentPage === 1 ? 0.3 : 1, padding: 0}}>
                   &lt;
                 </button>
                 <button onClick={() => setCurrentPage(p => p + 1)} disabled={safeCurrentPage >= totalPages} style={{border: 'none', background: 'transparent', cursor: safeCurrentPage >= totalPages ? 'default' : 'pointer', opacity: safeCurrentPage >= totalPages ? 0.3 : 1, padding: 0}}>
                   &gt;
                 </button>
               </div>
            </div>
          )}
          {viewMode === 'list' && (
            <div className="column-picker-container">
              <button className="icon-btn" onClick={(e) => { e.stopPropagation(); setShowColPicker(!showColPicker); }} title="Tùy chỉnh cột" style={{border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', padding: '6px'}}>
                <SlidersHorizontal size={18} />
              </button>
              {showColPicker && (
                <div className="column-picker-popup" onClick={e => e.stopPropagation()}>
                  <div style={{padding: '8px 12px', fontWeight: 600, borderBottom: '1px solid #e2e8f0', fontSize: '13px'}}>Ẩn/Hiện Cột</div>
                  <div style={{maxHeight: '300px', overflowY: 'auto', padding: '8px'}}>
                    {ALL_COLUMNS.map(col => (
                      <label key={col.key} style={{display: 'flex', alignItems: 'center', gap: '8px', padding: '6px', fontSize: '13px', cursor: 'pointer'}}>
                        <input 
                          type="checkbox" 
                          checked={visibleColumns.includes(col.key)}
                          onChange={() => {
                            if (visibleColumns.includes(col.key)) {
                              setVisibleColumns(visibleColumns.filter(c => c !== col.key));
                            } else {
                              const newCols = [...visibleColumns, col.key];
                              // Keep original order
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
            </div>
          )}
        </div>
      </div>

      {viewMode === 'kanban' ? (
        // --- KANBAN RENDER PORTION ---
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="kanban-columns">
            {data.columns.map((column) => {
              const tasks = column.taskIds.map(taskId => data.tasks[taskId]);
              const totalRevenue = tasks.reduce((sum, t) => sum + parseRevenue(t.revenue), 0);
              
              let overdueCount = 0;
              let todayCount = 0;
              let todoCount = 0;

              tasks.forEach(item => {
                  if (item.tasks) {
                      overdueCount += item.tasks.filter(t => t.status === 'overdue').length;
                      todayCount += item.tasks.filter(t => t.status === 'today').length;
                      todoCount += item.tasks.filter(t => t.status === 'todo').length;
                  }
              });

              const totalAct = overdueCount + todayCount + todoCount;
              const greenPct = totalAct ? (todoCount / totalAct) * 100 : 0;
              const yellowPct = totalAct ? (todayCount / totalAct) * 100 : 0;
              const redPct = totalAct ? (overdueCount / totalAct) * 100 : 0;
              
              return (
                <div key={column.id} className="kanban-column">
                  <div className="column-header" style={{ backgroundColor: column.color, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden', flex: 1, width: '100%', marginBottom: '8px'}}>
                      <div className="column-count" style={{flexShrink: 0}}>{tasks.length}</div>
                      <h3 className="column-title" style={{margin: 0, flexShrink: 0, textTransform: 'none'}}>{column.title}</h3>
                      {totalRevenue > 0 && <div title={formatRevenue(totalRevenue)} style={{fontSize: '13px', opacity: 0.95, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: '0 4px', maxWidth: '85px', marginLeft: 'auto'}}>
                        {formatRevenue(totalRevenue)}
                      </div>}
                      <Plus size={16} className="add-task-icon" onClick={() => navigate('/lead/new')} style={{cursor: 'pointer', flexShrink: 0, marginLeft: '8px'}} />
                    </div>
                    {/* Progress Bar */}
                    <div className="column-progress-bar" style={{ display: 'flex', height: '8px', width: '100%', borderRadius: '4px', overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.3)', marginTop: '4px' }}>
                      {greenPct > 0 && <div style={{width: `${greenPct}%`, backgroundColor: '#22c55e'}} title={`Cần làm: ${todoCount}`}></div>}
                      {yellowPct > 0 && <div style={{width: `${yellowPct}%`, backgroundColor: '#eab308'}} title={`Hôm nay: ${todayCount}`}></div>}
                      {redPct > 0 && <div style={{width: `${redPct}%`, backgroundColor: '#ef4444'}} title={`Trễ hạn: ${overdueCount}`}></div>}
                    </div>
                  </div>
                  
                  <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                      <div className={`task-list ${snapshot.isDraggingOver ? 'dragging-over' : ''}`} ref={provided.innerRef} {...provided.droppableProps}>
                        {tasks.map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided, snapshot) => (
                              <div className={`task-card ${snapshot.isDragging ? 'is-dragging' : ''}`} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} onClick={() => navigate(`/lead/edit/${task.id}`)} style={{ ...provided.draggableProps.style, cursor: 'pointer', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: 'white', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a' }}>{task.content}</div>
                                {task.revenue && task.revenue !== '0 ₫' && <div style={{ fontSize: '14px', fontWeight: 500, color: '#334155' }}>{task.revenue}</div>}
                                {task.company && <div style={{ fontSize: '13px', color: '#64748b' }}>{task.company}</div>}
                                
                                <div className="task-tags" style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
                                  {task.tags && task.tags.length > 0 
                                     ? task.tags.map((tag, i) => <span key={i} className="tag" style={{ backgroundColor: tag.color || '#e2e8f0', color: tag.textCol || '#334155', fontSize: '11px', padding: '2px 8px', borderRadius: '12px' }}>{tag.text}</span>)
                                     : <span className="tag" style={{ backgroundColor: '#fed7aa', color: '#ea580c', fontSize: '11px', padding: '2px 8px', borderRadius: '12px' }}>Lead mới</span>}
                                </div>
                                
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    {renderStars(task.probability)}
                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                      {(() => {
                                          const uncompletedTasks = task.tasks ? task.tasks.filter(t => t.status !== 'done') : [];
                                          const grouped = uncompletedTasks.reduce((acc, t) => {
                                            acc[t.type] = [...(acc[t.type] || []), t];
                                            return acc;
                                          }, {});
                                          return Object.entries(grouped).map(([type, tasksOfType]) => {
                                             const count = tasksOfType.length;
                                             const badge = count > 1 ? <div style={{position: 'absolute', bottom: -6, right: -8, background: '#ef4444', color: 'white', fontSize: '9px', borderRadius: '50%', width: '13px', height: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', zIndex: 10}}>{count}</div> : (tasksOfType[0]?.status === 'overdue' ? <div style={{position: 'absolute', bottom: -6, right: -8, background: '#ef4444', color: 'white', fontSize: '9px', borderRadius: '50%', width: '13px', height: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', zIndex: 10}}>1</div> : null);
                                             
                                             const popoverContent = renderPopoverTasks(tasksOfType);

                                             if (type === 'mail') return <div key={type} className="task-popover-container" style={{position: 'relative'}}><Mail size={16} color={tasksOfType.some(t => t.status === 'overdue' || t.status === 'today') ? "#16a34a" : "#94a3b8"} />{badge}{popoverContent}</div>;
                                             if (type === 'phone') return <div key={type} className="task-popover-container" style={{position: 'relative'}}><Phone size={16} color={tasksOfType.some(t => t.status === 'overdue' || t.status === 'today') ? "#16a34a" : "#94a3b8"} />{badge}{popoverContent}</div>;
                                             if (type === 'meeting') return <div key={type} className="task-popover-container" style={{position: 'relative'}}><Calendar size={16} color={tasksOfType.some(t => t.status === 'overdue') ? '#ef4444' : (tasksOfType.some(t => t.status === 'today') ? '#eab308' : '#94a3b8')} />{badge}{popoverContent}</div>;
                                             return null;
                                          });
                                      })()}
                                      
                                      <div className="task-popover-container" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#64748b', fontWeight: 500, marginLeft: '4px' }}>
                                        <CheckCircle2 size={14} color={task.tasks && task.tasks.filter(t => t.status === 'done').length === task.tasks.length && task.tasks.length > 0 ? "#16a34a" : "#94a3b8"} />
                                        {task.tasks ? task.tasks.filter(t => t.status === 'done').length : 0}/{task.tasks?.length || 0}
                                        {renderPopoverTasks(task.tasks)}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="avatar-circle" style={{backgroundColor: '#6366f1', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold', width: '22px', height: '22px', borderRadius: '50%'}} title={task.salesperson}>
                                    {getInitials(task.salesperson)}
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
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
        // --- MULTI-FEATURE LIST VIEW ---
        <div className="list-view-container" style={{marginTop: '16px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #e2e8f0', overflow: 'auto', flex: 1}}>
          <table className="list-view-table" style={{width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px', whiteSpace: 'nowrap'}}>
            <thead>
              <tr>
                <th style={{position: 'sticky', top: 0, zIndex: 6, backgroundColor: '#f8fafc', padding: '12px 16px', fontWeight: 600, borderRight: '1px solid #f1f5f9', borderBottom: '1px solid #cbd5e1', width: '40px', textAlign: 'center'}}>
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
                  <th key={col.key} style={{position: 'sticky', top: 0, zIndex: col.key === activeFilterCol ? 6 : 5, backgroundColor: '#f8fafc', padding: '12px 16px', fontWeight: 600, borderRight: '1px solid #f1f5f9', borderBottom: '1px solid #cbd5e1', color: '#475569'}}>
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

                    {/* Filter Popup Window */}
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
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? paginatedData.map(task => (
                <tr key={task.id} style={{borderBottom: '1px solid #f1f5f9', cursor: 'pointer', transition: 'background-color 0.2s', backgroundColor: selectedRows.includes(task.id) ? '#f8fafc' : 'transparent'}} onClick={() => navigate(`/lead/edit/${task.id}`)} className="list-row-hover">
                  <td style={{padding: '12px 16px', textAlign: 'center'}} onClick={e => e.stopPropagation()}>
                    <input type="checkbox" checked={selectedRows.includes(task.id)} onChange={(e) => {
                       if(e.target.checked) setSelectedRows([...selectedRows, task.id]);
                       else setSelectedRows(selectedRows.filter(id => id !== task.id));
                    }}/>
                  </td>
                  
                  {visibleColumns.includes('id') && <td style={{padding: '12px 16px', fontWeight: 500, color: '#2563eb'}}>{task.id}</td>}
                  {visibleColumns.includes('content') && <td style={{padding: '12px 16px', color: '#0f172a', fontWeight: 500}}>{task.content}</td>}
                  {visibleColumns.includes('company') && <td style={{padding: '12px 16px'}}>{task.company}</td>}
                  {visibleColumns.includes('mst') && <td style={{padding: '12px 16px'}}>{task.mst}</td>}
                  {visibleColumns.includes('contactName') && <td style={{padding: '12px 16px'}}>{task.contactName}</td>}
                  {visibleColumns.includes('email') && <td style={{padding: '12px 16px', color: '#64748b'}}>{task.email}</td>}
                  {visibleColumns.includes('district') && <td style={{padding: '12px 16px'}}>{task.district}</td>}
                  {visibleColumns.includes('ward') && <td style={{padding: '12px 16px'}}>{task.ward}</td>}
                  {visibleColumns.includes('city') && <td style={{padding: '12px 16px'}}>{task.city}</td>}
                  {visibleColumns.includes('projectedService') && <td style={{padding: '12px 16px'}}>{task.projectedService}</td>}
                  {visibleColumns.includes('assignedPartner') && <td style={{padding: '12px 16px'}}>{task.assignedPartner}</td>}
                  
                  {visibleColumns.includes('status') && (
                    <td style={{padding: '12px 16px'}} onClick={(e) => e.stopPropagation()}>
                      <select 
                        style={{ backgroundColor: data.columns.find(c => c.title === task.status)?.color || '#94a3b8', color: 'white', padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 600, border: 'none', outline: 'none', cursor: 'pointer' }}
                        value={task.status}
                        onChange={(e) => {
                           const newStatus = e.target.value;
                           mockStore.updateLeadStatus(task.id, newStatus);
                           setData(mockStore.getStore());
                        }}
                      >
                        {data.columns.map(c => <option key={c.id} value={c.title} style={{color: 'black', background: 'white'}}>{c.title}</option>)}
                      </select>
                    </td>
                  )}
                  {visibleColumns.includes('revenue') && <td style={{padding: '12px 16px', fontWeight: 500}}>{task.revenue}</td>}
                  {visibleColumns.includes('probability') && <td style={{padding: '12px 16px'}}>{task.probability}</td>}
                  {visibleColumns.includes('salesperson') && <td style={{padding: '12px 16px'}}>{task.salesperson}</td>}
                </tr>
              )) : (
                <tr>
                  <td colSpan={visibleColumns.length} style={{padding: '30px', textAlign: 'center', color: '#64748b'}}>Không tìm thấy dữ liệu khớp lệnh trích xuất.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default KanbanBoard;
