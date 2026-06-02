import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './KanbanBoard.css';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Search, Filter, ArrowUpDown, Plus, MessageSquare, Calendar, LayoutGrid, List, Settings, Download, Upload, ChevronUp, ChevronDown, SlidersHorizontal, Star, Clock, Phone, Mail, CheckCircle2, TrendingUp, TrendingDown, Trash2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, FileText } from 'lucide-react';
import * as XLSX from 'xlsx';

// --- MOCK DATA ---
const ALL_COLUMNS = [
  { key: 'id', label: 'Lead/Opportunity ID' },
  { key: 'content', label: 'Tên Lead/Opportunity' },
  { key: 'company', label: 'Tên khách hàng' },
  { key: 'mst', label: 'MST' },
  { key: 'district', label: 'Quận/Huyện' },
  { key: 'ward', label: 'Phường/Xã' },
  { key: 'city', label: 'Thành phố' },
  { key: 'projectType', label: 'Loại dự án' },
  { key: 'projectedService', label: 'Dịch vụ dự kiến' },
  { key: 'priority', label: 'Độ ưu tiên' },
  { key: 'leadTag', label: 'Tag Lead' },
  { key: 'classification', label: 'Phân loại KH' },
  { key: 'domain', label: 'Lĩnh vực' },
  { key: 'contactDate', label: 'Ngày BĐ tiếp xúc' },
  { key: 'issueMonth', label: 'Tháng phát hành' },
  { key: 'contractMonth', label: 'Tháng ký HĐ' },
  { key: 'vcxContact', label: 'Đầu mối NV VCX' },
  { key: 'source', label: 'Nguồn tiếp cận' },
  { key: 'promotionUnit', label: 'Đơn vị xúc tiến' },
  { key: 'assignedPartner', label: 'Assigned Partner' },
  { key: 'status', label: 'Trạng thái' },
  { key: 'revenue', label: 'Doanh thu (Dự kiến)' },
  { key: 'probability', label: 'Xác suất' },
  { key: 'salesperson', label: 'Sale person' },
  { key: 'date', label: 'Ngày tạo' }
];

import { mockStore } from '../utils/mockStore';

const REMOVED_STATUSES = ['Triển khai', 'Thành công'];
const FALLBACK_STATUS = 'Kí hợp đồng';
const NEW_STATUS_COLUMN = { id: 'opp-new', title: 'Mới', color: '#e32b4c', taskIds: [] };

const normalizeStatus = (status, columns) => {
  if (!REMOVED_STATUSES.includes(status)) return status;
  const fallbackExists = columns.some((c) => c.title === FALLBACK_STATUS);
  return fallbackExists ? FALLBACK_STATUS : (columns[0]?.title || status);
};

const sanitizeBoardData = (rawData) => {
  let safeColumns = (rawData.columns || [])
    .filter((column) => !REMOVED_STATUSES.includes(column.title))
    .map((column) => ({ ...column, taskIds: [] }));
  const safeTasks = {};

  Object.entries(rawData.tasks || {}).forEach(([taskId, task]) => {
    safeTasks[taskId] = {
      ...task,
      status: normalizeStatus(task.status, safeColumns),
    };
  });

  // Always keep the "Mới" stage in Kanban.
  if (!safeColumns.some((column) => column.title === 'Mới')) {
    safeColumns = [{ ...NEW_STATUS_COLUMN }, ...safeColumns];
  }

  safeColumns.forEach((column) => {
    column.taskIds = Object.keys(safeTasks).filter((taskId) => safeTasks[taskId].status === column.title);
  });

  return { columns: safeColumns, tasks: safeTasks };
};

// --- MAIN COMPONENT ---

function OpportunityBoard() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // --- STATE ---
  // Helper for Revenue Sum
  const parseRevenue = (revenueStr) => {
    if (!revenueStr) return 0;
    return parseInt(revenueStr.replace(/[^0-9]/g, ''), 10) || 0;
  };
  const formatRevenue = (value) => {
    if (value === 0) return '0 ₫';
    return value.toLocaleString('vi-VN') + ' ₫';
  };

  const getAllowedTransitions = (currentStatus) => {
    switch (currentStatus) {
        case 'Mới': return ['Đang tiếp xúc', 'Không thành công'];
        case 'Đang tiếp xúc': return ['Đánh giá nhu cầu', 'Không thành công'];
        case 'Đánh giá nhu cầu': return ['Đang báo giá', 'Không thành công'];
        case 'Đang báo giá': return ['Đấu thầu', 'POC', 'Không thành công'];
        case 'Đấu thầu': return ['Kí hợp đồng', 'Không thành công'];
        case 'POC': return ['Kí hợp đồng', 'Không thành công'];
        case 'Kí hợp đồng': return ['Không thành công'];
        default: return [];
    }
  };

  const [data, setData] = useState(() => {
    const st = mockStore.getStore();
    return sanitizeBoardData({ columns: st.oppColumns || st.columns || [], tasks: st.oppTasks || st.tasks || {} });
  });
  
  // Need useEffect to refresh if returned from form
  React.useEffect(() => {
    const st = mockStore.getStore();
    setData(sanitizeBoardData({ columns: st.oppColumns || st.columns || [], tasks: st.oppTasks || st.tasks || {} }));
  }, []);
  const [activeTab, setActiveTab] = useState('my_customers'); // 'my_customers' | 'general_customers'
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'kanban'
  const [searchTerm, setSearchTerm] = useState('');
  
  // List View specific states
  const [visibleColumns, setVisibleColumns] = useState(ALL_COLUMNS.map(c => c.key));
  const [showColPicker, setShowColPicker] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [filters, setFilters] = useState({});
  const [activeFilterCol, setActiveFilterCol] = useState(null);
  const [filterSearchTerm, setFilterSearchTerm] = useState('');

  const toggleFilterPopup = (key) => {
    if (activeFilterCol === key) {
      setActiveFilterCol(null);
    } else {
      setActiveFilterCol(key);
      setFilterSearchTerm('');
    }
  };
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [selectedRows, setSelectedRows] = useState([]);
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [contactSearchTerm, setContactSearchTerm] = useState('');

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

    const task = data.tasks[draggableId];
    const sourceStatus = sourceCol.title;
    const destStatus = destCol.title;

    const allowed = getAllowedTransitions(sourceStatus);
    if (!allowed.includes(destStatus) && sourceStatus !== destStatus) {
      alert(`Không thể chuyển trạng thái từ '${sourceStatus}' sang '${destStatus}'.`);
      return;
    }

    if (sourceStatus === 'Đánh giá nhu cầu' && destStatus === 'Đang báo giá' && parseInt(task.attachments || 0) === 0) {
      alert('Cần upload ít nhất 1 tài liệu ở màn hình chi tiết mới có thể chuyển sang trạng thái Đang báo giá.');
      return;
    }

    const newDestTaskIds = Array.from(destCol.taskIds);
    newDestTaskIds.splice(destination.index, 0, draggableId);

    const newSourceCol = { ...sourceCol, taskIds: newSourceTaskIds };
    const newDestCol = { ...destCol, taskIds: newDestTaskIds };

    const newColumns = [...data.columns];
    newColumns[sourceColIndex] = newSourceCol;
    newColumns[destColIndex] = newDestCol;

    const updatedTask = { ...task, status: destStatus };
    
    const newData = { ...data, columns: newColumns, tasks: { ...data.tasks, [draggableId]: updatedTask } };
    
    setData(newData);
    const globalStore = mockStore.getStore();
    globalStore.oppColumns = newColumns;
    globalStore.oppTasks = newData.tasks;
    mockStore.saveStore(globalStore);
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

  // Lấy danh sách nhiệm vụ và đảo ngược để hiển thị cái mới nhất (thêm sau cùng) lên đầu tiên
  const currentTasks = Object.values(data.tasks).reverse();

  // Derived distinct values for filtering
  const getDistinctValues = (key) => {
    return [...new Set(currentTasks.map(t => t[key] || ''))].filter(Boolean);
  };

  const getDistinctContacts = () => {
    const list = [];
    const seen = new Set();
    const st = mockStore.getStore();
    
    currentTasks.forEach(t => {
      if (t.contactName && !seen.has(t.contactName)) {
        seen.add(t.contactName);
        let phone = t.contactPhone || t.phone || '';
        if (!phone && st.customers) {
           const c = Object.values(st.customers).find(cus => cus.contactName === t.contactName);
           if (c && c.phone) phone = c.phone;
        }
        if (!phone && st.contacts) {
           const c = Object.values(st.contacts).find(con => con.name === t.contactName);
           if (c && c.phone) phone = c.phone;
        }
        if (!phone) {
           let hash = 0;
           for (let i = 0; i < t.contactName.length; i++) hash = t.contactName.charCodeAt(i) + ((hash << 5) - hash);
           phone = '09' + Math.abs(hash).toString().padStart(8, '0').slice(0, 8);
        }
        list.push({ name: t.contactName, phone });
      }
    });
    return list;
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

  const handleDateRangeChange = (key, field, value) => {
    setFilters(prev => {
      const colFilters = prev[key] || { from: '', to: '' };
      const newFilters = { ...colFilters, [field]: value };
      if (!newFilters.from && !newFilters.to) {
        const { [key]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [key]: newFilters };
    });
  };

  const parseDateToMs = (dateStr) => {
    if (!dateStr) return 0;
    if (dateStr.includes('/')) {
       const parts = dateStr.split('/');
       if (parts.length === 3) {
         return new Date(parts[2], parts[1] - 1, parts[0]).getTime();
       }
    } else if (dateStr.includes('-')) {
       return new Date(dateStr).getTime();
    }
    return 0;
  };

  const processedData = useMemo(() => {
    let result = [...currentTasks];

    // Filter by Active Tab
    if (activeTab === 'my_customers') {
      result = result.filter(item => item.salesperson === 'Trần B (Bạn)' || item.salesperson === 'Trần B');
    } else if (activeTab === 'general_customers') {
      result = result.filter(item => item.salesperson !== 'Trần B (Bạn)' && item.salesperson !== 'Trần B');
    }

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
      if (key === 'date' || key === 'contactDate') {
         const { from, to } = filters[key];
         const fromMs = from ? parseDateToMs(from) : 0;
         // If "to" is selected, include the whole day (up to 23:59:59). Using Infinity if not set.
         const toMs = to ? parseDateToMs(to) + 86399999 : Infinity;
         
         result = result.filter(item => {
            const itemMs = parseDateToMs(item[key]);
            if (!itemMs) return false;
            return itemMs >= fromMs && itemMs <= toMs;
         });
      } else if (Array.isArray(filters[key]) && filters[key].length > 0) {
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

  // For General Customers tab, force specific columns
  const effectiveVisibleColumns = activeTab === 'general_customers' 
    ? ['id', 'content', 'company', 'mst', 'salesperson', 'date'] 
    : visibleColumns;

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
          status: 'Chờ tiếp nhận', 
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
        const globalStore = mockStore.getStore();
        globalStore.oppColumns = newData.columns;
        globalStore.oppTasks = newData.tasks;
        mockStore.saveStore(globalStore);
        return newData;
      });
      alert(`Đã import thành công ${jsonObj.length} dòng dữ liệu.`);
    };
    reader.readAsBinaryString(file);
    e.target.value = null; // reset
  };

  const getCompanyShortName = (companyName) => {
    if (!companyName) return '';
    const customers = mockStore.getStore().customers || {};
    const found = Object.values(customers).find(c => c.name === companyName || c.shortName === companyName);
    return found ? found.shortName : companyName;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Mới': return { bg: '#FFF0F2', text: '#E32B4C', border: '#FFE0E4' };
      case 'Đang tiếp xúc': return { bg: '#EFF6FF', text: '#3B82F6', border: '#DBEAFE' };
      case 'Đánh giá nhu cầu': return { bg: '#EEF2FF', text: '#6366F1', border: '#E0E7FF' };
      case 'Đang báo giá': return { bg: '#F5F3FF', text: '#8B5CF6', border: '#EDE9FE' };
      case 'Đấu thầu': return { bg: '#FDF2F8', text: '#EC4899', border: '#FCE7F3' };
      case 'POC': return { bg: '#FFF1F2', text: '#F43F5E', border: '#FFE4E6' };
      case 'Kí hợp đồng': return { bg: '#FFF7ED', text: '#F97316', border: '#FFEDD5' };
      case 'Triển khai': return { bg: '#FEF9C3', text: '#CA8A04', border: '#FEF08A' };
      case 'Thành công': return { bg: '#ECFDF5', text: '#10B981', border: '#D1FAE5' };
      case 'Không thành công': return { bg: '#F1F5F9', text: '#64748B', border: '#E2E8F0' };
      default: return { bg: '#F1F5F9', text: '#64748b', border: '#E2E8F0' };
    }
  };

  const renderTags = (task) => {
    const list = [];
    if (Array.isArray(task.tags)) {
      list.push(...task.tags);
    } else if (typeof task.tags === 'string' && task.tags) {
      list.push({ text: task.tags, color: '#f1f5f9', textCol: '#475569' });
    }
    if (task.priority) {
      const p = task.priority;
      let color = '#f1f5f9';
      let textCol = '#475569';
      if (p === 'Cao' || p === 'High') { color = '#fee2e2'; textCol = '#ef4444'; }
      else if (p === 'Trung bình' || p === 'Medium') { color = '#ffedd5'; textCol = '#f97316'; }
      list.push({ text: `Độ ưu tiên: ${p}`, color, textCol });
    }
    if (task.projectedService) {
      list.push({ text: task.projectedService, color: '#e0f2fe', textCol: '#0369a1' });
    }
    
    return list.map((tag, idx) => (
      <span key={idx} style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, backgroundColor: tag.color || '#f1f5f9', color: tag.textCol || '#475569', border: '1px solid rgba(0,0,0,0.03)' }}>
        {tag.text}
      </span>
    ));
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

        /* Figma Table UI additions */
        .list-view-container {
          background: white;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          overflow: auto;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
        }
        .list-view-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 13px;
          white-space: nowrap;
        }
        .list-view-table th {
          position: sticky;
          top: 0;
          background: #FFFFFF !important;
          padding: 14px 16px !important;
          font-weight: 700 !important;
          color: #1e293b !important;
          border-bottom: 1px solid #E2E8F0 !important;
          border-top: 1px solid #E2E8F0 !important;
          border-right: none !important;
          font-size: 12px !important;
          text-transform: uppercase !important;
          letter-spacing: 0.5px !important;
        }
        .list-view-table td {
          padding: 16px !important;
          color: #334155 !important;
          border-bottom: 1px solid #E2E8F0 !important;
          font-size: 13.5px !important;
        }
        .list-view-table tbody tr {
          transition: background-color 0.15s ease !important;
          cursor: pointer;
        }
        .list-view-table tbody tr:nth-child(even) {
          background-color: #FAFAFA !important;
        }
        .list-view-table tbody tr.row-selected {
          background-color: #fff0f2 !important;
        }
        .list-view-table tbody tr:hover {
          background-color: #f1f5f9 !important;
        }
        .list-view-table input[type="checkbox"] {
          width: 16px;
          height: 16px;
          accent-color: #e32b4c;
          cursor: pointer;
        }
        .metric-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 100px;
          position: relative;
          overflow: hidden;
          transition: all 0.2s ease;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }
        .metric-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.08);
        }
        .metric-label {
          font-size: 13px;
          color: #64748b;
          font-weight: 600;
          margin-bottom: 8px;
        }
        .btn-outline-brand {
          border: 1px solid #f45476 !important;
          color: #e03 !important;
          background: transparent !important;
          transition: all 0.2s ease !important;
        }
        .btn-outline-brand:hover {
          background: #fff0f2 !important;
          border-color: #e03 !important;
        }
        .view-btn-modern {
          border: none;
          background: transparent;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .view-btn-modern.active {
          background: white !important;
          color: #e32b4c !important;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
      `}</style>
      {/* HEADER SECTION */}
      {(() => {
         const tasksList = Object.values(data.tasks);
         const totalDeals = tasksList.length;
         const successDeals = tasksList.filter(t => t.status === 'Kí hợp đồng').length;
         const failedDeals = tasksList.filter(t => t.status === 'Không thành công').length;
         
         return (
           <div className="opportunity-header-section" style={{ marginBottom: '24px' }}>
             <div style={{ marginBottom: '20px' }}>
                <h1 className="page-title" style={{ margin: 0, fontSize: '24px', color: '#1e293b', fontWeight: 700 }}>Danh sách Lead/Opportunity</h1>
                <p style={{ color: '#64748b', fontSize: '12px', margin: '4px 0 0 0', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.6px' }}>Quản lý chi tiết cơ hội và khách hàng tiềm năng</p>
             </div>
             
             <div className="metrics-cards-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '24px' }}>
               <div className="metric-card" style={{ position: 'relative', overflow: 'hidden' }}>
                 <div style={{ position: 'absolute', right: '-8px', bottom: '-8px', opacity: 0.05 }}>
                   <FileText size={96} color="#3b82f6" />
                 </div>
                 <span className="metric-label">Tổng số deal</span>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%' }}>
                   <span className="metric-value" style={{ fontSize: '24px', fontWeight: 700, color: '#000', lineHeight: '32px' }}>{totalDeals}</span>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#3B82F6', fontSize: '13px', fontWeight: 700 }}>
                     <TrendingUp size={16} strokeWidth={2.5} /> +12%
                   </div>
                 </div>
               </div>

               <div className="metric-card" style={{ position: 'relative', overflow: 'hidden' }}>
                 <div style={{ position: 'absolute', right: '-8px', bottom: '-8px', opacity: 0.05 }}>
                   <CheckCircle2 size={96} color="#10b981" />
                 </div>
                 <span className="metric-label">Tổng deal ký hợp đồng</span>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%' }}>
                   <span className="metric-value" style={{ fontSize: '24px', fontWeight: 700, color: '#10b981', lineHeight: '32px' }}>{successDeals}</span>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981', fontSize: '13px', fontWeight: 700 }}>
                     <CheckCircle2 size={16} strokeWidth={2.5} /> Thành công
                   </div>
                 </div>
               </div>

               <div className="metric-card" style={{ position: 'relative', overflow: 'hidden' }}>
                 <div style={{ position: 'absolute', right: '-8px', bottom: '-8px', opacity: 0.05 }}>
                   <TrendingDown size={96} color="#ef4444" />
                 </div>
                 <span className="metric-label">Tổng deal không thành công</span>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%' }}>
                   <span className="metric-value" style={{ fontSize: '24px', fontWeight: 700, color: '#ef4444', lineHeight: '32px' }}>{failedDeals}</span>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ef4444', fontSize: '13px', fontWeight: 700 }}>
                     <TrendingDown size={16} strokeWidth={2.5} /> Thất bại
                   </div>
                 </div>
               </div>
             </div>
           </div>
         );
      })()}

      <div style={{ display: 'flex', gap: '24px', borderBottom: '1px solid #e2e8f0', marginBottom: '16px' }}>
        <button 
          className={`tab-btn ${activeTab === 'my_customers' ? 'active' : ''}`}
          onClick={() => setActiveTab('my_customers')}
          style={{ padding: '12px 16px', border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: 600, fontSize: '15px', color: activeTab === 'my_customers' ? '#e32b4c' : '#64748b', borderBottom: activeTab === 'my_customers' ? '2px solid #e32b4c' : '2px solid transparent' }}
        >
          Khách hàng của tôi
        </button>
        <button 
          className={`tab-btn ${activeTab === 'general_customers' ? 'active' : ''}`}
          onClick={() => { setActiveTab('general_customers'); setViewMode('list'); }}
          style={{ padding: '12px 16px', border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: 600, fontSize: '15px', color: activeTab === 'general_customers' ? '#e32b4c' : '#64748b', borderBottom: activeTab === 'general_customers' ? '2px solid #e32b4c' : '2px solid transparent' }}
        >
          Khách hàng chung
        </button>
      </div>

      {/* TOOLBAR SECTION (FRAME 1) */}
      <div className="list-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', background: 'white', padding: '24px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <div className="search-group" style={{ position: 'relative', display: 'flex', gap: '24px', alignItems: 'center' }}>
            <div className="contact-search-box" style={{ width: '434px', position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#44494D' }} />
              <input type="text" placeholder="Tìm kiếm tự do..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ padding: '10px 16px 10px 44px', borderRadius: '8px', border: '1px solid #E2E8F0', background: '#F8F8F8', fontSize: '14px', width: '100%', outline: 'none', color: '#44494D' }} />
            </div>

            <button className="btn-outline-brand" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 12px', height: '40px', border: '1px solid #f45476', color: '#e03', background: 'transparent', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }} onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}>
              <Filter size={16}/> Lọc liên hệ
            </button>
            
          {showAdvancedFilter && (
            <div style={{position: 'absolute', top: '100%', left: 0, marginTop: '8px', zIndex: 100, width: '300px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', border: '1px solid #cbd5e1', borderRadius: '8px', background: 'white', overflow: 'hidden'}}>
               <div style={{padding: '12px 16px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span style={{fontWeight: 600, color: '#0f172a', fontSize: '14px'}}>Lọc liên hệ</span>
                  <button style={{background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '13px'}} onClick={() => setShowAdvancedFilter(false)}>Đóng</button>
               </div>
               <div style={{padding: '12px', maxHeight: '400px', overflowY: 'auto'}}>
                 <div style={{background: 'white'}}>
                   <div style={{marginBottom: '12px'}}>
                       <input 
                         type="text" 
                         placeholder="Tìm kiếm liên hệ..." 
                         value={contactSearchTerm}
                         onChange={(e) => setContactSearchTerm(e.target.value)}
                         style={{width: '90%', padding: '6px 8px', fontSize: '12px', border: '1px solid #cbd5e1', borderRadius: '4px'}}
                       />
                     </div>
                     <div style={{maxHeight: '160px', overflowY: 'auto'}}>
                       {getDistinctContacts()
                         .filter(c => c.name.toLowerCase().includes(contactSearchTerm.toLowerCase()) || (c.phone && c.phone.includes(contactSearchTerm)))
                         .map(c => (
                         <label key={c.name} style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', padding: '6px 4px', cursor: 'pointer'}}>
                           <input type="checkbox" checked={filters['contactName']?.includes(c.name) || false} onChange={() => handleFilterChange('contactName', c.name)}/>
                           {c.name} {c.phone ? `- ${c.phone}` : ''}
                         </label>
                       ))}
                       {getDistinctContacts().length === 0 && <div style={{fontSize: '13px', color: '#94a3b8', fontStyle: 'italic', padding: '4px'}}>Không có dữ liệu</div>}
                       {getDistinctContacts().length > 0 && getDistinctContacts().filter(c => c.name.toLowerCase().includes(contactSearchTerm.toLowerCase()) || (c.phone && c.phone.includes(contactSearchTerm))).length === 0 && <div style={{fontSize: '13px', color: '#94a3b8', fontStyle: 'italic', padding: '4px'}}>Không tìm thấy liên hệ</div>}
                     </div>
                   </div>
                 </div>
            </div>
          )}
          
          {selectedRows.length > 0 && selectedRows.every(id => data.tasks[id]?.status === 'Mới') && (
            <button 
              className="btn" 
              onClick={() => {
                if (window.confirm(`Bạn có chắc muốn xóa ${selectedRows.length} bản ghi đang chọn?`)) {
                  const newTasks = { ...data.tasks };
                  selectedRows.forEach(id => delete newTasks[id]);
                  setData({ ...data, tasks: newTasks });
                  setSelectedRows([]);
                }
              }} 
              style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', padding: '0 16px', height: '40px', fontWeight: 600, fontSize: '14px', cursor: 'pointer', marginLeft: '24px' }}
            >
              <Trash2 size={16} /> Xóa ({selectedRows.length})
            </button>
          )}
        </div>
      </div>

        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn-outline-brand" onClick={() => navigate('/opportunity/new')} style={{ height: '40px', padding: '0 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
              <Plus size={18} /> Thêm lead
            </button>
            <button className="btn-outline-brand" onClick={handleExport} title="Xuất dữ liệu" style={{ height: '40px', padding: '0 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
              <Download size={18} /> Xuất Excel
            </button>
            <button className="btn-outline-brand" onClick={triggerImport} title="Nhập dữ liệu" style={{ height: '40px', padding: '0 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
              <Upload size={18} /> Nhập Excel
            </button>
            <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept=".xlsx, .xls, .csv" onChange={handleImport} />
          </div>

          <div className="view-switcher" style={{ background: '#EFEDED', padding: '4px', borderRadius: '8px', display: 'flex', gap: '4px', height: '40px', alignItems: 'center', boxSizing: 'border-box' }}>
             <button disabled={activeTab === 'general_customers'} className={`view-btn-modern ${viewMode === 'kanban' ? 'active' : ''}`} style={{ border: 'none', background: viewMode === 'kanban' ? 'white' : 'transparent', color: viewMode === 'kanban' ? '#e32b4c' : '#64748b', width: '32px', height: '32px', borderRadius: '6px', cursor: activeTab === 'general_customers' ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: activeTab === 'general_customers' ? 0.5 : 1 }} onClick={() => setViewMode('kanban')} title="Kanban View"><LayoutGrid size={16} /></button>
             <button className={`view-btn-modern ${viewMode === 'list' ? 'active' : ''}`} style={{ border: 'none', background: viewMode === 'list' ? 'white' : 'transparent', color: viewMode === 'list' ? '#e32b4c' : '#64748b', width: '32px', height: '32px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setViewMode('list')} title="List View"><List size={16} /></button>
          </div>
        </div>
      </div>

      {viewMode === 'kanban' ? (
        // --- KANBAN RENDER PORTION ---
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="kanban-columns">
            {data.columns.map((column) => {
              const tasks = (column.taskIds || []).map(taskId => data.tasks[taskId]).filter(Boolean);
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
                <div key={column.id} className="kanban-column" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderTop: '4px solid ' + (column.color || '#cbd5e1'), borderRadius: '12px', padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: '16px', minWidth: '300px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)' }}>
                  <div className="column-header" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', padding: 0, margin: '0 0 4px 0', background: 'transparent' }}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden', flex: 1, width: '100%', marginBottom: '0'}}>
                      <div className="column-count" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', width: '24px', height: '24px', color: column.color || '#64748b', backgroundColor: (column.color ? column.color + '15' : '#f1f5f9'), fontSize: '13px', fontWeight: 700, flexShrink: 0 }}>
                        {tasks.length}
                      </div>
                      <h3 className="column-title" style={{ margin: 0, flexShrink: 0, color: '#334155', fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                        {column.title}
                      </h3>
                      {totalRevenue > 0 && <div title={formatRevenue(totalRevenue)} style={{fontSize: '12px', color: '#475569', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', backgroundColor: '#f1f5f9', padding: '2px 8px', borderRadius: '4px', marginLeft: 'auto'}}>
                        {formatRevenue(totalRevenue)}
                      </div>}
                      <Plus size={18} className="add-task-icon" onClick={() => navigate('/opportunity/new')} style={{cursor: 'pointer', flexShrink: 0, color: '#64748b', marginLeft: totalRevenue > 0 ? '8px' : 'auto'}} />
                    </div>
                    {totalAct > 0 && (
                      <div className="column-progress-bar" style={{ display: 'flex', height: '4px', width: '100%', borderRadius: '4px', overflow: 'hidden', backgroundColor: '#e2e8f0', marginTop: '8px' }}>
                        {greenPct > 0 && <div style={{width: `${greenPct}%`, backgroundColor: '#22c55e'}} title={`Cần làm: ${todoCount}`}></div>}
                        {yellowPct > 0 && <div style={{width: `${yellowPct}%`, backgroundColor: '#eab308'}} title={`Hôm nay: ${todayCount}`}></div>}
                        {redPct > 0 && <div style={{width: `${redPct}%`, backgroundColor: '#ef4444'}} title={`Trễ hạn: ${overdueCount}`}></div>}
                      </div>
                    )}
                  </div>
                  
                  <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                      <div className={`task-list ${snapshot.isDraggingOver ? 'dragging-over' : ''}`} ref={provided.innerRef} {...provided.droppableProps} style={{ padding: '4px 2px', minHeight: '300px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {tasks.map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided, snapshot) => (
                              <div 
                                className={`task-card ${snapshot.isDragging ? 'is-dragging' : ''}`} 
                                ref={provided.innerRef} 
                                {...provided.draggableProps} 
                                {...provided.dragHandleProps} 
                                onClick={() => navigate(`/opportunity/edit/${task.id}`)} 
                                style={{ 
                                  ...provided.draggableProps.style, 
                                  cursor: 'pointer', 
                                  padding: '16px', 
                                  borderRadius: '12px', 
                                  border: '1px solid #e2e8f0', 
                                  backgroundColor: 'white', 
                                  display: 'flex', 
                                  flexDirection: 'column', 
                                  gap: '10px',
                                  boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
                                  transition: 'all 0.2s ease',
                                  position: 'relative'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.transform = 'translateY(-2px)';
                                  e.currentTarget.style.boxShadow = '0 6px 12px rgba(15, 23, 42, 0.08)';
                                  e.currentTarget.style.borderColor = '#cbd5e1';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.transform = 'none';
                                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(15, 23, 42, 0.04)';
                                  e.currentTarget.style.borderColor = '#e2e8f0';
                                }}
                              >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#e32b4c', backgroundColor: '#fff0f2', padding: '2px 6px', borderRadius: '4px', border: '1px solid #ffe0e4' }}>
                                    {task.id}
                                  </span>
                                  {task.date && (
                                    <span style={{ fontSize: '11px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '3px' }}>
                                      <Calendar size={12} /> {task.date}
                                    </span>
                                  )}
                                </div>
                                <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', lineHeight: '20px' }}>{task.content}</div>
                                {task.company && (
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#64748b' }}>
                                    <span>🏢 {getCompanyShortName(task.company)}</span>
                                  </div>
                                )}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', background: '#f8fafc', padding: '8px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '11px', color: '#64748b' }}>Doanh thu dự kiến:</span>
                                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{task.revenue || '0 ₫'}</span>
                                  </div>
                                  {task.probability && task.probability !== '0%' && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                                      <div style={{ flex: 1, height: '4px', backgroundColor: '#e2e8f0', borderRadius: '2px', overflow: 'hidden' }}>
                                        <div style={{ width: task.probability, height: '100%', backgroundColor: '#10b981', borderRadius: '2px' }}></div>
                                      </div>
                                      <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 700 }}>{task.probability}</span>
                                    </div>
                                  )}
                                </div>
                                {(task.tags || task.priority || task.projectedService) && (
                                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                    {renderTags(task)}
                                  </div>
                                )}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '8px', marginTop: '4px' }}>
                                  <div style={{ display: 'flex', gap: '8px' }}>
                                    {task.attachments > 0 && (
                                      <span style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '3px' }} title="Tài liệu đính kèm">
                                        📎 {task.attachments}
                                      </span>
                                    )}
                                    {task.comments > 0 && (
                                      <span style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '3px' }} title="Bình luận">
                                        💬 {task.comments}
                                      </span>
                                    )}
                                    {task.tasks && task.tasks.length > 0 && (
                                      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                                        {task.tasks.some(t => t.status === 'overdue') && <span style={{ padding: '2px 6px', borderRadius: '4px', backgroundColor: '#fee2e2', color: '#ef4444', fontSize: '10px', fontWeight: 700 }}>Trễ hạn</span>}
                                        {task.tasks.some(t => t.status === 'today') && <span style={{ padding: '2px 6px', borderRadius: '4px', backgroundColor: '#fef9c3', color: '#ca8a04', fontSize: '10px', fontWeight: 700 }}>Hôm nay</span>}
                                        {task.tasks.some(t => t.status === 'todo') && <span style={{ padding: '2px 6px', borderRadius: '4px', backgroundColor: '#dcfce3', color: '#10b981', fontSize: '10px', fontWeight: 700 }}>Cần làm</span>}
                                      </div>
                                    )}
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    {task.salesperson && (
                                      <div 
                                        title={`Người phụ trách: ${task.salesperson}`} 
                                        style={{ 
                                          width: '24px', 
                                          height: '24px', 
                                          borderRadius: '50%', 
                                          backgroundColor: '#e32b4c', 
                                          color: 'white', 
                                          display: 'flex', 
                                          alignItems: 'center', 
                                          justifyContent: 'center', 
                                          fontSize: '10px', 
                                          fontWeight: 700 
                                        }}
                                      >
                                        {task.salesperson.split(' ').pop().charAt(0).toUpperCase()}
                                      </div>
                                    )}
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
        <>
        {/* --- MULTI-FEATURE LIST VIEW (FRAME 2) --- */}
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
                {ALL_COLUMNS.filter(col => effectiveVisibleColumns.includes(col.key)).map(col => (
                  <th key={col.key} style={{position: 'sticky', top: 0, zIndex: col.key === activeFilterCol ? 6 : 5}}>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                      <div style={{display: 'flex', alignItems: 'center', cursor: 'pointer', flex: 1}} onClick={() => handleSort(col.key)}>
                        {col.label}
                        <div style={{display: 'flex', flexDirection: 'column', marginLeft: '6px', color: sortConfig.key === col.key ? '#0f172a' : '#cbd5e1'}}>
                          <ChevronUp size={12} style={{marginBottom: '-4px', opacity: sortConfig.key === col.key && sortConfig.direction === 'desc' ? 0.3 : 1}} />
                          <ChevronDown size={12} style={{opacity: sortConfig.key === col.key && sortConfig.direction === 'asc' ? 0.3 : 1}} />
                        </div>
                      </div>
                      <div className="filter-trigger" onClick={(e) => { e.stopPropagation(); toggleFilterPopup(col.key); }} style={{cursor: 'pointer', color: (filters[col.key] && filters[col.key].length > 0) ? '#16a34a' : '#94a3b8'}}>
                        <Filter size={14} />
                      </div>
                    </div>

                    {/* Filter Popup Window */}
                    {activeFilterCol === col.key && (
                      <div className="column-filter-popup" onClick={e => e.stopPropagation()} style={{position: 'absolute', top: '100%', right: 0, zIndex: 10, background: 'white', border: '1px solid #cbd5e1', borderRadius: '4px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', minWidth: '180px'}}>
                        <div style={{padding: '8px', borderBottom: '1px solid #e2e8f0', fontWeight: 600, fontSize: '12px', color: '#334155'}}>Lọc: {col.label}</div>
                        <div style={{maxHeight: '200px', overflowY: 'auto', padding: '8px'}}>
                           {(col.key === 'date' || col.key === 'contactDate') ? (
                             <div style={{display: 'flex', flexDirection: 'column', gap: '8px', padding: '4px'}}>
                               <div style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
                                 <label style={{fontSize: '12px', color: '#64748b'}}>Từ ngày</label>
                                 <input type="date" value={filters[col.key]?.from || ''} onChange={e => handleDateRangeChange(col.key, 'from', e.target.value)} style={{padding: '4px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12px'}} />
                               </div>
                               <div style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
                                 <label style={{fontSize: '12px', color: '#64748b'}}>Đến ngày</label>
                                 <input type="date" value={filters[col.key]?.to || ''} onChange={e => handleDateRangeChange(col.key, 'to', e.target.value)} style={{padding: '4px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12px'}} />
                               </div>
                             </div>
                           ) : (
                             <>
                               <div style={{marginBottom: '8px', padding: '0 4px'}}>
                                 <input 
                                   type="text" 
                                   placeholder="Tìm kiếm nhanh..." 
                                   value={filterSearchTerm}
                                   onChange={(e) => setFilterSearchTerm(e.target.value)}
                                   style={{width: '90%', padding: '4px 8px', fontSize: '12px', border: '1px solid #cbd5e1', borderRadius: '4px'}}
                                 />
                               </div>
                               {getDistinctValues(col.key)
                                 .filter(val => val.toLowerCase().includes(filterSearchTerm.toLowerCase()))
                                 .map(val => (
                                 <label key={val} style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', padding: '4px 0', cursor: 'pointer'}}>
                                   <input type="checkbox" checked={filters[col.key]?.includes(val) || false} onChange={() => handleFilterChange(col.key, val)}/>
                                   {val}
                                 </label>
                               ))}
                               {getDistinctValues(col.key).length === 0 && <div style={{fontSize: '12px', color: '#94a3b8', fontStyle: 'italic'}}>Không có dữ liệu</div>}
                               {getDistinctValues(col.key).length > 0 && getDistinctValues(col.key).filter(val => val.toLowerCase().includes(filterSearchTerm.toLowerCase())).length === 0 && <div style={{fontSize: '12px', color: '#94a3b8', fontStyle: 'italic'}}>Không tìm thấy kết quả</div>}
                             </>
                           )}
                        </div>
                      </div>
                    )}
                  </th>
                ))}
                
                <th style={{position: 'sticky', top: 0, zIndex: 6, backgroundColor: '#FFFFFF', padding: '16px 12px', borderBottom: '1px solid #E5E7EB', borderTop: '1px solid #E5E7EB', width: '40px', textAlign: 'center'}} onClick={(e) => { e.stopPropagation(); if(activeTab !== 'general_customers') setShowColPicker(!showColPicker); }}>
                  <SlidersHorizontal size={16} color={activeTab === 'general_customers' ? '#cbd5e1' : '#94a3b8'} style={{cursor: activeTab === 'general_customers' ? 'not-allowed' : 'pointer'}} />
                  {showColPicker && activeTab !== 'general_customers' && (
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
              {paginatedData.length > 0 ? paginatedData.map(task => (
                <tr key={task.id} style={{cursor: activeTab === 'general_customers' ? 'default' : 'pointer'}} onClick={() => { if(activeTab !== 'general_customers') navigate(`/opportunity/edit/${task.id}`); }} className={selectedRows.includes(task.id) ? "row-selected" : ""}>
                  <td style={{textAlign: 'center'}} onClick={e => e.stopPropagation()}>
                    <input type="checkbox" checked={selectedRows.includes(task.id)} onChange={(e) => {
                       if(e.target.checked) setSelectedRows([...selectedRows, task.id]);
                       else setSelectedRows(selectedRows.filter(id => id !== task.id));
                    }}/>
                  </td>
                  
                  {effectiveVisibleColumns.includes('id') && (
                    <td 
                      style={{padding: '16px', fontWeight: 700, color: '#2563eb'}}
                      onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                      onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                    >
                      {task.id}
                    </td>
                  )}
                  {effectiveVisibleColumns.includes('content') && <td style={{padding: '16px', color: '#0f172a', fontWeight: 600}}>{task.content}</td>}
                  {effectiveVisibleColumns.includes('company') && <td style={{padding: '16px', fontWeight: 500, color: '#1e293b'}}>{getCompanyShortName(task.company)}</td>}
                  {effectiveVisibleColumns.includes('mst') && <td style={{padding: '16px', fontWeight: 500}}>{task.mst || '—'}</td>}
                  {effectiveVisibleColumns.includes('district') && <td style={{padding: '16px'}}>{task.district || '—'}</td>}
                  {effectiveVisibleColumns.includes('ward') && <td style={{padding: '16px'}}>{task.ward || '—'}</td>}
                  {effectiveVisibleColumns.includes('city') && <td style={{padding: '16px'}}>{task.city || '—'}</td>}
                  {effectiveVisibleColumns.includes('projectType') && <td style={{padding: '16px'}}>{task.projectType || '—'}</td>}
                  {effectiveVisibleColumns.includes('projectedService') && <td style={{padding: '16px'}}>{task.projectedService || '—'}</td>}
                  {effectiveVisibleColumns.includes('priority') && (
                    <td style={{padding: '16px'}}>
                      {(() => {
                        const p = task.priority || 'Thấp';
                        let bg = '#f1f5f9';
                        let text = '#475569';
                        if (p === 'Cao' || p === 'High') { bg = '#fee2e2'; text = '#ef4444'; }
                        else if (p === 'Trung bình' || p === 'Medium') { bg = '#ffedd5'; text = '#f97316'; }
                        return (
                          <span style={{ padding: '3px 8px', borderRadius: '4px', backgroundColor: bg, color: text, fontSize: '11px', fontWeight: 700 }}>
                            {p}
                          </span>
                        );
                      })()}
                    </td>
                  )}
                  {effectiveVisibleColumns.includes('leadTag') && <td style={{padding: '16px'}}>{task.leadTag || '—'}</td>}
                  {effectiveVisibleColumns.includes('classification') && <td style={{padding: '16px'}}>{task.classification || '—'}</td>}
                  {effectiveVisibleColumns.includes('domain') && <td style={{padding: '16px'}}>{task.domain || '—'}</td>}
                  {effectiveVisibleColumns.includes('contactDate') && <td style={{padding: '16px'}}>{task.contactDate || '—'}</td>}
                  {effectiveVisibleColumns.includes('issueMonth') && <td style={{padding: '16px'}}>{task.issueMonth || '—'}</td>}
                  {effectiveVisibleColumns.includes('contractMonth') && <td style={{padding: '16px'}}>{task.contractMonth || '—'}</td>}
                  {effectiveVisibleColumns.includes('vcxContact') && <td style={{padding: '16px'}}>{task.vcxContact || '—'}</td>}
                  {effectiveVisibleColumns.includes('source') && <td style={{padding: '16px'}}>{task.source || '—'}</td>}
                  {effectiveVisibleColumns.includes('promotionUnit') && <td style={{padding: '16px'}}>{task.promotionUnit || '—'}</td>}
                  {effectiveVisibleColumns.includes('assignedPartner') && <td style={{padding: '16px'}}>{task.assignedPartner || '—'}</td>}
                  
                  {effectiveVisibleColumns.includes('status') && (
                    <td style={{padding: '16px'}} onClick={(e) => e.stopPropagation()}>
                      {(() => {
                        const colors = getStatusColor(task.status);
                        return (
                          <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            backgroundColor: colors.bg,
                            color: colors.text,
                            border: `1px solid ${colors.border}`,
                            borderRadius: '100px',
                            padding: '3px 10px',
                            fontSize: '12px',
                            fontWeight: 600,
                            gap: '4px'
                          }}>
                            <select 
                              style={{ 
                                background: 'transparent', 
                                color: colors.text, 
                                border: 'none', 
                                outline: 'none', 
                                cursor: 'pointer', 
                                fontSize: '12px', 
                                fontWeight: 600,
                                appearance: 'none',
                                paddingRight: '12px',
                                paddingLeft: '2px',
                                backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${encodeURIComponent(colors.text)}' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right center',
                                backgroundSize: '10px'
                              }}
                              value={task.status}
                              onChange={(e) => {
                                 const newStatus = e.target.value;
                                 if (task.status === 'Đánh giá nhu cầu' && newStatus === 'Đang báo giá' && parseInt(task.attachments || 0) === 0) {
                                    alert('Cần upload ít nhất 1 tài liệu ở màn hình chi tiết mới có thể chuyển sang trạng thái Đang báo giá.');
                                    e.target.value = task.status;
                                    return;
                                 }
                                 mockStore.updateOppStatus(task.id, newStatus);
                                 const st = mockStore.getStore();
                                 setData(sanitizeBoardData({ columns: st.oppColumns, tasks: st.oppTasks }));
                              }}
                            >
                              {data.columns.filter(c => c.title === task.status || getAllowedTransitions(task.status).includes(c.title)).map(c => <option key={c.id} value={c.title} style={{color: 'black', background: 'white'}}>{c.title}</option>)}
                            </select>
                          </div>
                        );
                      })()}
                    </td>
                  )}
                  {effectiveVisibleColumns.includes('revenue') && <td style={{padding: '16px', fontWeight: 700, color: '#0f172a'}}>{task.revenue || '0 ₫'}</td>}
                  {effectiveVisibleColumns.includes('probability') && (
                    <td style={{padding: '16px'}}>
                      <span style={{ padding: '3px 8px', borderRadius: '100px', backgroundColor: '#e2fcf0', color: '#059669', fontSize: '11px', fontWeight: 700 }}>
                        {task.probability || '0%'}
                      </span>
                    </td>
                  )}
                  {effectiveVisibleColumns.includes('salesperson') && <td style={{padding: '16px'}}>{task.salesperson || '—'}</td>}
                  {effectiveVisibleColumns.includes('date') && <td style={{padding: '16px'}}>{task.date || '—'}</td>}
                  <td style={{textAlign: 'center'}}>
                    {task.status === 'Mới' && activeTab !== 'general_customers' && (
                      <span onClick={(e) => { e.stopPropagation(); navigate(`/opportunity/edit/${task.id}`); }} style={{cursor: 'pointer', color: '#64748b'}} title="Chỉnh sửa">
                        ✏️
                      </span>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={effectiveVisibleColumns.length + 2} style={{padding: '30px', textAlign: 'center', color: '#64748b'}}>Không tìm thấy dữ liệu khớp lệnh trích xuất.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* FRAME 3: BOTTOM PAGINATION */}
        {processedData.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px', borderTop: '1px solid #E2E8F0', background: 'white', borderRadius: '0 0 8px 8px', marginTop: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div style={{ color: '#64748b', fontSize: '13px' }}>
              Hiển thị <span style={{ fontWeight: 600, color: '#0f172a' }}>{(safeCurrentPage - 1) * pageSize + 1}</span> - <span style={{ fontWeight: 600, color: '#0f172a' }}>{Math.min(safeCurrentPage * pageSize, totalItems)}</span> trong số <span style={{ fontWeight: 600, color: '#0f172a' }}>{totalItems}</span> cơ hội
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
        </>
      )}
    </div>
  );
}

export default OpportunityBoard;
