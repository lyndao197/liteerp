import React, { useState, useMemo, useEffect } from 'react';
import './ActivityBoard.css';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Plus, 
  Download, 
  LayoutGrid, 
  List, 
  ChevronLeft, 
  ChevronRight,
  ChevronDown,
  Calendar,
  X,
  Trash2
} from 'lucide-react';
import { QueryBuilder } from './QueryBuilder';
import { evaluateQuery } from '../utils/filterUtils';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import * as XLSX from 'xlsx';
import { TASKS_UPDATED_EVENT, loadPersonalTasks, savePersonalTasks } from '../utils/taskSyncStore';

// Custom Multi-Select with "Tất cả" option
function MultiSelect({ options = [], selected = [], onChange, placeholder = '-- Chọn giá trị --' }) {
  const [isOpen, setIsOpen] = useState(false);

  const safeSelected = Array.isArray(selected) ? selected : (selected ? [selected] : []);
  const normalizedOptions = (options || []).map(opt => 
    typeof opt === 'object' ? opt : { value: opt, label: opt }
  );

  const allValues = normalizedOptions.map(o => o.value);
  const isAllSelected = safeSelected.length === 0 || safeSelected.includes('ALL') || safeSelected.length === allValues.length;

  const handleToggleAll = (e) => {
    e.stopPropagation();
    if (isAllSelected) {
      onChange([]);
    } else {
      onChange(['ALL']);
    }
  };

  const handleToggleItem = (val, e) => {
    e.stopPropagation();
    let currentSelected = safeSelected.includes('ALL') ? [...allValues] : [...safeSelected];
    if (currentSelected.includes(val)) {
      currentSelected = currentSelected.filter(v => v !== val);
    } else {
      currentSelected.push(val);
    }

    if (currentSelected.length === allValues.length || currentSelected.length === 0) {
      onChange(['ALL']);
    } else {
      onChange(currentSelected);
    }
  };

  const displayText = useMemo(() => {
    if (isAllSelected) return 'Tất cả';
    if (safeSelected.length === 1) {
      const found = normalizedOptions.find(o => o.value === safeSelected[0]);
      return found ? found.label : safeSelected[0];
    }
    if (safeSelected.length > 1) {
      return `${safeSelected.length} đã chọn`;
    }
    return placeholder;
  }, [safeSelected, isAllSelected, normalizedOptions, placeholder]);

  return (
    <div className="ab-adv-multiselect-container" onClick={(e) => e.stopPropagation()}>
      <div 
        className={`ab-adv-multiselect-trigger ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="ab-adv-multiselect-label">{displayText}</span>
        <ChevronDown size={16} color="#64748b" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} />
      </div>

      {isOpen && (
        <div className="ab-adv-multiselect-dropdown" onClick={e => e.stopPropagation()}>
          {/* Option: Tất cả */}
          <label className="ab-adv-multiselect-item all-option" onClick={handleToggleAll}>
            <input 
              type="checkbox"
              className="ab-filter-checkbox"
              checked={isAllSelected}
              onChange={() => {}}
            />
            <span>Tất cả</span>
          </label>

          {/* Individual Options */}
          {normalizedOptions.map(opt => {
            const isChecked = isAllSelected || safeSelected.includes(opt.value);
            return (
              <label 
                key={opt.value}
                className="ab-adv-multiselect-item"
                onClick={(e) => handleToggleItem(opt.value, e)}
              >
                <input 
                  type="checkbox"
                  className="ab-filter-checkbox"
                  checked={isChecked}
                  onChange={() => {}}
                />
                <span>{opt.label}</span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Filter configuration for each column matching the user's reference design
const COLUMN_FILTER_CONFIG = {
  id: {
    title: 'Lọc ID công việc',
    options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
  },
  title: {
    title: 'Lọc tên nhiệm vụ',
    options: [
      'Gọi điện xác nhận nhu cầu',
      'Gửi email giới thiệu sản phẩm',
      'Theo dõi phản hồi khách hàng',
      'Hẹn gặp trực tiếp trao đổi',
      'Chuẩn bị báo giá chi tiết',
      'Đào tạo sp cho khách hàng',
      'Phân tích nhu cầu mở rộng',
      'Gửi hợp đồng ký kết',
      'Lên kế hoạch triển khai dự án',
      'Đánh giá hiệu quả chiến dịch'
    ]
  },
  reporter: {
    title: 'Lọc người được giao',
    options: ['Hung NV', 'Lan PT', 'Minh NH', 'Hải DT', 'Trang LT', 'Quang BV', 'Thu HA', 'Tùng ND', 'Hương PT', 'Nam LV']
  },
  dueDate: {
    title: 'Lọc hạn chót',
    options: ['08/05/2026', '07/05/2026', '06/05/2026', '09/05/2026', '10/05/2026', '11/05/2026', '12/05/2026', '13/05/2026', '14/05/2026', '15/05/2026', '16/05/2026']
  },
  priority: {
    title: 'Lọc độ ưu tiên',
    options: ['Cao', 'Trung bình', 'Thấp']
  },
  source: {
    title: 'Lọc liên kết tới',
    options: [
      'Lead Công ty Viettel Post',
      'Dự án dịch vụ chăm sóc khách hàng',
      'Lead Khách hàng: Trần Thị B',
      'Dự án phần mềm KnowxHub'
    ]
  },
  status: {
    title: 'Lọc trạng thái',
    options: ['Todo', 'Processing', 'Done', 'Cancelled']
  }
};

const ALL_COLUMNS = [
  { key: 'id', label: 'ID công việc' },
  { key: 'title', label: 'Tên nhiệm vụ' },
  { key: 'reporter', label: 'Báo cáo bởi' },
  { key: 'createdDate', label: 'Ngày tạo' },
  { key: 'dueDate', label: 'Hạn chót' },
  { key: 'priority', label: 'Độ ưu tiên' },
  { key: 'source', label: 'Liên kết tới' }
];

function ActivityBoard() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('list'); // Default to 'list'
  const [activeTab, setActiveTab] = useState('my_activities'); // 'my_activities' | 'support_activities'
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [advancedQuery, setAdvancedQuery] = useState({
    id: 'root',
    combinator: 'AND',
    rules: []
  });

  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [columnFilters, setColumnFilters] = useState({});
  const [activeFilterCol, setActiveFilterCol] = useState(null);

  // Advanced Filter Form State
  const [advFilterForm, setAdvFilterForm] = useState({
    reporters: ['ALL'],
    dueDate: '18/05/2026',
    priorities: ['low'],
    sources: ['ALL'],
    statuses: ['ALL'],
    createdFrom: '04/2026',
    createdTo: '17/04/2026'
  });
  const [appliedAdvFilter, setAppliedAdvFilter] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [selectedRows, setSelectedRows] = useState([]);

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

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    else if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = null;
      key = null;
    }
    setSortConfig({ key, direction });
  };

  const handleFilterToggle = (colKey, optionValue) => {
    setColumnFilters(prev => {
      const currentList = prev[colKey] || [];
      const exists = currentList.includes(optionValue);
      const updatedList = exists 
        ? currentList.filter(item => item !== optionValue)
        : [...currentList, optionValue];

      if (updatedList.length === 0) {
        const { [colKey]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [colKey]: updatedList };
    });
  };

  const getPriorityLabel = (priority) => {
    if (priority === 'high' || priority === 'critical' || priority === 'Cao') return 'Cao';
    if (priority === 'normal' || priority === 'medium' || priority === 'Trung bình') return 'Trung bình';
    return 'Thấp';
  };

  const getStatusLabel = (status) => {
    if (status === 'todo') return 'Todo';
    if (status === 'processing') return 'Processing';
    if (status === 'done') return 'Done';
    if (status === 'cancelled') return 'Cancelled';
    return status;
  };

  const handleApplyAdvancedFilter = () => {
    setAppliedAdvFilter({ ...advFilterForm });
    setShowAdvancedFilter(false);
  };

  const processedData = useMemo(() => {
    let result = [...activityList];

    // 1. Search term filter
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(item => 
        Object.values(item).some(val => 
          String(val).toLowerCase().includes(lowerSearch)
        )
      );
    }

    // 2. Column specific filters
    Object.keys(columnFilters).forEach(colKey => {
      const selectedOpts = columnFilters[colKey];
      if (selectedOpts && selectedOpts.length > 0) {
        result = result.filter(item => {
          if (colKey === 'id') {
            return selectedOpts.includes(String(item.id));
          }
          if (colKey === 'priority') {
            const mapped = getPriorityLabel(item.priority);
            return selectedOpts.includes(mapped);
          }
          if (colKey === 'status') {
            const mapped = getStatusLabel(item.status);
            return selectedOpts.includes(mapped);
          }
          if (colKey === 'reporter') {
            const val = item.reporter || item.assignee || '';
            return selectedOpts.includes(val);
          }
          const itemVal = item[colKey] || '';
          return selectedOpts.includes(itemVal);
        });
      }
    });

    // 3. Applied Advanced Filter Modal
    if (appliedAdvFilter) {
      if (appliedAdvFilter.reporter) {
        result = result.filter(item => (item.reporter || item.assignee) === appliedAdvFilter.reporter);
      }
      if (appliedAdvFilter.priority) {
        result = result.filter(item => item.priority === appliedAdvFilter.priority || getPriorityLabel(item.priority) === appliedAdvFilter.priority);
      }
      if (appliedAdvFilter.source) {
        result = result.filter(item => item.source === appliedAdvFilter.source);
      }
      if (appliedAdvFilter.status) {
        result = result.filter(item => item.status === appliedAdvFilter.status);
      }
    }

    // 4. Sorting
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
  }, [activityList, searchTerm, columnFilters, appliedAdvFilter, sortConfig]);

  const paginatedData = processedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleExport = () => {
    const exportData = processedData.map(item => ({
      'ID công việc': `ACT-2026-${String(item.id).padStart(5, '0')}`,
      'Tên nhiệm vụ': item.title || '',
      'Báo cáo bởi': item.reporter || item.assignee || '',
      'Ngày tạo': item.createdDate || '',
      'Hạn chót': item.dueDate || '',
      'Độ ưu tiên': getPriorityLabel(item.priority),
      'Liên kết tới': item.source || ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Activities");
    XLSX.writeFile(workbook, "Danh_sach_hoat_dong.xlsx");
  };

  const renderPriority = (priority) => {
    const label = getPriorityLabel(priority);
    if (label === 'Cao') {
      return (
        <div className="ab-priority-badge">
          <span className="star-icon">★★★</span>
          <span>Cao</span>
        </div>
      );
    }
    if (label === 'Trung bình') {
      return (
        <div className="ab-priority-badge">
          <span className="star-icon">★★</span>
          <span>Trung bình</span>
        </div>
      );
    }
    return (
      <div className="ab-priority-badge">
        <span className="star-icon">★</span>
        <span>Thấp</span>
      </div>
    );
  };

  const renderFilterPopup = (colKey) => {
    const config = COLUMN_FILTER_CONFIG[colKey];
    if (!config) return null;

    // Merge default options with any extra dynamic values from current data
    const dynamicValues = [...new Set(activityList.map(item => {
      if (colKey === 'id') return String(item.id);
      if (colKey === 'priority') return getPriorityLabel(item.priority);
      if (colKey === 'reporter') return item.reporter || item.assignee;
      if (colKey === 'status') return getStatusLabel(item.status);
      return item[colKey];
    }))].filter(Boolean);

    const mergedOptions = [...new Set([...config.options, ...dynamicValues])];
    const selectedList = columnFilters[colKey] || [];

    return (
      <div 
        className="ab-filter-card-popup"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="ab-filter-card-header">
          {config.title}
        </div>
        <div className="ab-filter-card-body">
          {mergedOptions.map((opt) => {
            const isChecked = selectedList.includes(opt);
            return (
              <label 
                key={opt} 
                className="ab-filter-option-item"
                onClick={() => handleFilterToggle(colKey, opt)}
              >
                <input 
                  type="checkbox"
                  className="ab-filter-checkbox"
                  checked={isChecked}
                  onChange={() => {}} // Handled by label click
                />
                <span>{opt}</span>
              </label>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="ab-page-container" onClick={() => setActiveFilterCol(null)}>
      <div className="ab-inner-content">
        
        {/* PAGE TITLE */}
        <h1 className="ab-page-title">Quản lý tiếp xúc khách hàng</h1>

        {/* 3 KPI METRIC CARDS */}
        <div className="ab-metrics-grid">
          <div className="ab-metric-card">
            <span className="ab-metric-label">TRỄ HẠN</span>
            <span className="ab-metric-value">5</span>
          </div>
          <div className="ab-metric-card">
            <span className="ab-metric-label">ĐẾN HẠN HÔM NAY</span>
            <span className="ab-metric-value">10</span>
          </div>
          <div className="ab-metric-card">
            <span className="ab-metric-label">ĐÃ HOÀN THÀNH</span>
            <span className="ab-metric-value">3</span>
          </div>
        </div>

        {/* SUB-NAVIGATION TABS */}
        <div className="ab-nav-tabs">
          <div 
            className={`ab-nav-tab ${activeTab === 'my_activities' ? 'active' : ''}`}
            onClick={() => setActiveTab('my_activities')}
          >
            Hoạt động của tôi
          </div>
          <div 
            className={`ab-nav-tab ${activeTab === 'support_activities' ? 'active' : ''}`}
            onClick={() => setActiveTab('support_activities')}
          >
            Hoạt động hỗ trợ
          </div>
        </div>

        {/* MAIN CARD CONTAINER */}
        <div className="ab-main-card">
          
          {/* TOOLBAR */}
          <div className="ab-toolbar">
            
            {/* Left: Search & Filter */}
            <div className="ab-toolbar-left">
              <div className="ab-search-box">
                <Search size={16} color="#94a3b8" />
                <input 
                  type="text" 
                  className="ab-search-input"
                  placeholder="Tìm kiếm ..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div>
                <button 
                  type="button" 
                  className="ab-btn-advanced-filter"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAdvancedFilter(true);
                    setActiveFilterCol(null);
                  }}
                >
                  <Filter size={15} />
                  <span>Lọc nâng cao</span>
                </button>
              </div>
            </div>

            {/* Right: Actions & View Switch */}
            <div className="ab-toolbar-right">
              {selectedRows.length > 0 && (
                <button 
                  type="button"
                  className="ab-btn-outline-red"
                  style={{ borderColor: '#ef4444', color: '#ef4444' }}
                  onClick={() => {
                    if (window.confirm(`Xóa ${selectedRows.length} hoạt động đã chọn?`)) {
                      setActivityList(prev => prev.filter(a => !selectedRows.includes(a.id)));
                      setSelectedRows([]);
                    }
                  }}
                >
                  <Trash2 size={15} />
                  <span>Xóa ({selectedRows.length})</span>
                </button>
              )}

              <button 
                type="button" 
                className="ab-btn-outline-red"
                onClick={() => navigate('/activity/new')}
              >
                <Plus size={16} />
                <span>Thêm hoạt động</span>
              </button>

              <button 
                type="button" 
                className="ab-btn-outline-red"
                onClick={handleExport}
              >
                <Download size={15} />
                <span>Xuất Excel</span>
              </button>

              <div className="ab-view-toggle">
                <button 
                  type="button" 
                  className={`ab-view-btn ${viewMode === 'kanban' ? 'active' : ''}`}
                  onClick={() => setViewMode('kanban')}
                  title="Giao diện Kanban"
                >
                  <LayoutGrid size={16} />
                </button>
                <button 
                  type="button" 
                  className={`ab-view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                  title="Giao diện Danh sách"
                >
                  <List size={16} />
                </button>
              </div>
            </div>

          </div>

          {/* VIEW: LIST TABLE */}
          {viewMode === 'list' ? (
            <>
              <div className="ab-table-container">
                <table className="ab-table">
                  <thead>
                    <tr>
                      <th style={{ width: '40px', textAlign: 'center' }}>
                        <input 
                          type="checkbox"
                          className="ab-checkbox"
                          checked={paginatedData.length > 0 && selectedRows.length === paginatedData.length}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedRows(paginatedData.map(t => t.id));
                            else setSelectedRows([]);
                          }}
                        />
                      </th>

                      {/* ID CÔNG VIỆC */}
                      <th className="ab-th-cell">
                        <div className="ab-th-content">
                          <span className="ab-th-title" onClick={() => handleSort('id')}>ID công việc</span>
                          <div 
                            className={`ab-filter-trigger ${(columnFilters.id && columnFilters.id.length > 0) || activeFilterCol === 'id' ? 'active' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveFilterCol(activeFilterCol === 'id' ? null : 'id');
                              setShowAdvancedFilter(false);
                            }}
                          >
                            ⇅ ▽
                          </div>
                        </div>
                        {activeFilterCol === 'id' && renderFilterPopup('id')}
                      </th>

                      {/* TÊN NHIỆM VỤ */}
                      <th className="ab-th-cell">
                        <div className="ab-th-content">
                          <span className="ab-th-title" onClick={() => handleSort('title')}>Tên nhiệm vụ</span>
                          <div 
                            className={`ab-filter-trigger ${(columnFilters.title && columnFilters.title.length > 0) || activeFilterCol === 'title' ? 'active' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveFilterCol(activeFilterCol === 'title' ? null : 'title');
                              setShowAdvancedFilter(false);
                            }}
                          >
                            ⇅ ▽
                          </div>
                        </div>
                        {activeFilterCol === 'title' && renderFilterPopup('title')}
                      </th>

                      {/* BÁO CÁO BỞI */}
                      <th className="ab-th-cell">
                        <div className="ab-th-content">
                          <span className="ab-th-title" onClick={() => handleSort('reporter')}>Báo cáo bởi</span>
                          <div 
                            className={`ab-filter-trigger ${(columnFilters.reporter && columnFilters.reporter.length > 0) || activeFilterCol === 'reporter' ? 'active' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveFilterCol(activeFilterCol === 'reporter' ? null : 'reporter');
                              setShowAdvancedFilter(false);
                            }}
                          >
                            ⇅ ▽
                          </div>
                        </div>
                        {activeFilterCol === 'reporter' && renderFilterPopup('reporter')}
                      </th>

                      {/* NGÀY TẠO */}
                      <th className="ab-th-cell">
                        <div className="ab-th-content">
                          <span className="ab-th-title" onClick={() => handleSort('createdDate')}>Ngày tạo</span>
                          <div 
                            className="ab-filter-trigger"
                            onClick={() => handleSort('createdDate')}
                          >
                            ⇅ ▽
                          </div>
                        </div>
                      </th>

                      {/* HẠN CHÓT */}
                      <th className="ab-th-cell">
                        <div className="ab-th-content">
                          <span className="ab-th-title" onClick={() => handleSort('dueDate')}>Hạn chót</span>
                          <div 
                            className={`ab-filter-trigger ${(columnFilters.dueDate && columnFilters.dueDate.length > 0) || activeFilterCol === 'dueDate' ? 'active' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveFilterCol(activeFilterCol === 'dueDate' ? null : 'dueDate');
                              setShowAdvancedFilter(false);
                            }}
                          >
                            ⇅ ▽
                          </div>
                        </div>
                        {activeFilterCol === 'dueDate' && renderFilterPopup('dueDate')}
                      </th>

                      {/* ĐỘ ƯU TIÊN */}
                      <th className="ab-th-cell">
                        <div className="ab-th-content">
                          <span className="ab-th-title" onClick={() => handleSort('priority')}>Độ ưu tiên</span>
                          <div 
                            className={`ab-filter-trigger ${(columnFilters.priority && columnFilters.priority.length > 0) || activeFilterCol === 'priority' ? 'active' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveFilterCol(activeFilterCol === 'priority' ? null : 'priority');
                              setShowAdvancedFilter(false);
                            }}
                          >
                            ⇅ ▽
                          </div>
                        </div>
                        {activeFilterCol === 'priority' && renderFilterPopup('priority')}
                      </th>

                      {/* LIÊN KẾT TỚI */}
                      <th className="ab-th-cell">
                        <div className="ab-th-content">
                          <span className="ab-th-title" onClick={() => handleSort('source')}>Liên kết tới</span>
                          <div 
                            className={`ab-filter-trigger ${(columnFilters.source && columnFilters.source.length > 0) || activeFilterCol === 'source' ? 'active' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveFilterCol(activeFilterCol === 'source' ? null : 'source');
                              setShowAdvancedFilter(false);
                            }}
                          >
                            ⇅ ▽
                          </div>
                        </div>
                        {activeFilterCol === 'source' && renderFilterPopup('source')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.map((activity) => (
                      <tr 
                        key={activity.id}
                        className={selectedRows.includes(activity.id) ? 'row-selected' : ''}
                        onClick={() => navigate(`/activity/edit/${activity.id}`)}
                      >
                        <td style={{ textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                          <input 
                            type="checkbox" 
                            className="ab-checkbox"
                            checked={selectedRows.includes(activity.id)}
                            onChange={(e) => {
                              if (e.target.checked) setSelectedRows([...selectedRows, activity.id]);
                              else setSelectedRows(selectedRows.filter(id => id !== activity.id));
                            }}
                          />
                        </td>
                        <td className="ab-task-id">{`ACT-2026-${String(activity.id).padStart(5, '0')}`}</td>
                        <td className="ab-task-title">{activity.title}</td>
                        <td>{activity.reporter || activity.assignee || 'Hung NV'}</td>
                        <td>{activity.createdDate || '07/04/2026'}</td>
                        <td>{activity.dueDate || '07/05/2026'}</td>
                        <td>{renderPriority(activity.priority)}</td>
                        <td>{activity.source ? (activity.source.length > 18 ? activity.source.substring(0, 15) + '...' : activity.source) : 'Lead...'}</td>
                      </tr>
                    ))}
                    {paginatedData.length === 0 && (
                      <tr>
                        <td colSpan="8" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                          Không có hoạt động nào phù hợp.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION FOOTER */}
              <div className="ab-pagination-footer">
                <div className="ab-pagination-info">
                  Hiển thị {paginatedData.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}-{Math.min(currentPage * pageSize, processedData.length)} trong số {processedData.length > 10 ? processedData.length : '1.284'} khách hàng
                </div>
                <div className="ab-pagination-controls">
                  <span className="ab-pagination-range">1-10/10</span>
                  <button 
                    type="button" 
                    className={`ab-page-arrow-btn ${currentPage > 1 ? 'active-red' : 'disabled-gray'}`}
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    title="Trang trước"
                    disabled={currentPage <= 1}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button 
                    type="button" 
                    className={`ab-page-arrow-btn ${currentPage * pageSize < processedData.length ? 'active-red' : 'disabled-gray'}`}
                    onClick={() => setCurrentPage(p => p + 1)}
                    title="Trang tiếp theo"
                    disabled={currentPage * pageSize >= processedData.length}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* VIEW: KANBAN BOARD */
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="ab-kanban-board">
                {[
                  { id: 'todo', title: 'MỚI', progress: [{ color: '#22c55e', width: '60%' }, { color: '#ef4444', width: '40%' }] },
                  { id: 'processing', title: 'ĐANG THỰC HIỆN', progress: [{ color: '#22c55e', width: '50%' }, { color: '#eab308', width: '50%' }] },
                  { id: 'cancelled', title: 'HỦY', progress: [{ color: '#ef4444', width: '100%' }] },
                  { id: 'done', title: 'HOÀN THÀNH', progress: [{ color: '#22c55e', width: '100%' }] },
                ].map(col => {
                  const columnTasks = processedData.filter(a => a.status === col.id);
                  return (
                    <div key={col.id} className="ab-kanban-column">
                      {/* Column Header */}
                      <div className="ab-kanban-col-header">
                        <div className="ab-kanban-header-left">
                          <span className="ab-kanban-count-badge">{columnTasks.length}</span>
                          <span className="ab-kanban-col-title">{col.title}</span>
                        </div>
                        <button 
                          type="button" 
                          className="ab-kanban-btn-add"
                          onClick={() => navigate('/activity/new')}
                          title="Thêm công việc"
                        >
                          +
                        </button>
                      </div>

                      {/* Progress Bar */}
                      <div className="ab-kanban-col-progress">
                        {col.progress.map((p, idx) => (
                          <div 
                            key={idx} 
                            style={{ 
                              width: p.width, 
                              backgroundColor: p.color, 
                              height: '100%' 
                            }} 
                          />
                        ))}
                      </div>

                      {/* Droppable Cards Container */}
                      <Droppable droppableId={col.id}>
                        {(provided) => (
                          <div 
                            ref={provided.innerRef} 
                            {...provided.droppableProps} 
                            className="ab-kanban-cards-list"
                          >
                            {columnTasks.map((activity, idx) => {
                              const isOverdue = activity.dueDate === '05/05/2026' || (activity.dueDate && activity.dueDate < '07/05/2026' && activity.status !== 'done');
                              const dateBadgeColor = isOverdue ? 'red' : (col.id === 'processing' && activity.id === 4 ? 'yellow' : 'green');
                              const typeColor = isOverdue ? '#dc2626' : (col.id === 'processing' && activity.id === 4 ? '#ca8a04' : '#16a34a');

                              return (
                                <Draggable 
                                  key={String(activity.id)} 
                                  draggableId={String(activity.id)} 
                                  index={idx}
                                >
                                  {(provided, snapshot) => (
                                    <div 
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      onClick={() => navigate(`/activity/edit/${activity.id}`)}
                                      className={`ab-kanban-card ${snapshot.isDragging ? 'is-dragging' : ''}`}
                                    >
                                      {/* Title */}
                                      <div className="ab-kcard-title">
                                        {activity.title}
                                      </div>

                                      {/* Entity / Deal */}
                                      <div className="ab-kcard-entity-box">
                                        {activity.partnerName ? (
                                          <>
                                            <span className="ab-kcard-entity-name">{activity.partnerName}</span>
                                            {activity.partnerTax && (
                                              <span className="ab-kcard-entity-sub">{activity.partnerTax}</span>
                                            )}
                                          </>
                                        ) : (
                                          <span className="ab-kcard-entity-name">
                                            {activity.dealCode || `DEAL-2026-${String(activity.id).padStart(5, '0')}`}
                                          </span>
                                        )}
                                      </div>

                                      {/* Badges Row */}
                                      <div className="ab-kcard-badges-row">
                                        <span className="ab-kcard-badge-daily">
                                          Daily
                                        </span>
                                        <span className={`ab-kcard-badge-date ${dateBadgeColor}`}>
                                          <Calendar size={12} />
                                          <span>{activity.dueDate || '07/05/2026'}</span>
                                        </span>
                                      </div>

                                      {/* Footer Row */}
                                      <div className="ab-kcard-footer-row">
                                        <div className="ab-kcard-footer-left">
                                          {/* Stars */}
                                          <div className="ab-kcard-stars">
                                            {activity.priority === 'high' || activity.priority === 'critical' ? (
                                              <>
                                                <span className="star-gold">★</span>
                                                <span className="star-gold">★</span>
                                                <span className="star-gold">★</span>
                                              </>
                                            ) : (activity.priority === 'normal' || activity.priority === 'medium') ? (
                                              <>
                                                <span className="star-gold">★</span>
                                                <span className="star-gold">★</span>
                                                <span className="star-gray">★</span>
                                              </>
                                            ) : (
                                              <>
                                                <span className="star-gold">★</span>
                                                <span className="star-gray">★</span>
                                                <span className="star-gray">★</span>
                                              </>
                                            )}
                                          </div>

                                          {/* Activity Type Icon */}
                                          <div className="ab-kcard-type-icon">
                                            {activity.activityType === 'email' ? (
                                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={typeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <rect width="20" height="16" x="2" y="4" rx="2"/>
                                                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                                              </svg>
                                            ) : activity.activityType === 'meeting' ? (
                                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={typeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                                                <line x1="16" x2="16" y1="2" y2="6"/>
                                                <line x1="8" x2="8" y1="2" y2="6"/>
                                                <line x1="3" x2="21" y1="10" y2="10"/>
                                              </svg>
                                            ) : (
                                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={typeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                                              </svg>
                                            )}
                                          </div>
                                        </div>

                                        {/* Avatar */}
                                        <div className="ab-kcard-avatar">
                                          <img 
                                            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80" 
                                            alt={activity.assignee || 'User'} 
                                          />
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
          )}

        </div>

      </div>

      {/* ADVANCED FILTER MODAL */}
      {showAdvancedFilter && (
        <div className="ab-modal-overlay" onClick={() => setShowAdvancedFilter(false)}>
          <div className="ab-adv-modal" onClick={(e) => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div className="ab-adv-modal-header">
              <span className="ab-adv-modal-title">Bộ lọc nâng cao</span>
              <button 
                type="button" 
                className="ab-adv-modal-close"
                onClick={() => setShowAdvancedFilter(false)}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="ab-adv-modal-body">
              
              {/* Row 1: Người Báo Cáo */}
              <div className="ab-adv-form-row">
                <label className="ab-adv-form-label">Người Báo Cáo</label>
                <MultiSelect 
                  options={COLUMN_FILTER_CONFIG.reporter.options}
                  selected={advFilterForm.reporters}
                  onChange={(vals) => setAdvFilterForm({ ...advFilterForm, reporters: vals })}
                />
              </div>

              {/* Row 2: Hạn Chót */}
              <div className="ab-adv-form-row">
                <label className="ab-adv-form-label">Hạn Chót</label>
                <div className="ab-adv-input-with-icon">
                  <input 
                    type="text" 
                    value={advFilterForm.dueDate}
                    onChange={(e) => setAdvFilterForm({ ...advFilterForm, dueDate: e.target.value })}
                    placeholder="dd/mm/yyyy"
                  />
                  <Calendar size={18} color="#475569" style={{ cursor: 'pointer', flexShrink: 0 }} />
                </div>
              </div>

              {/* Row 3: Độ Ưu Tiên */}
              <div className="ab-adv-form-row">
                <label className="ab-adv-form-label">Độ Ưu Tiên</label>
                <MultiSelect 
                  options={[
                    { value: 'low', label: '★ Thấp' },
                    { value: 'normal', label: '★★ Trung bình' },
                    { value: 'high', label: '★★★ Cao' }
                  ]}
                  selected={advFilterForm.priorities}
                  onChange={(vals) => setAdvFilterForm({ ...advFilterForm, priorities: vals })}
                />
              </div>

              {/* Row 4: Liên Kết Tới */}
              <div className="ab-adv-form-row">
                <label className="ab-adv-form-label">Liên Kết Tới</label>
                <MultiSelect 
                  options={COLUMN_FILTER_CONFIG.source.options}
                  selected={advFilterForm.sources}
                  onChange={(vals) => setAdvFilterForm({ ...advFilterForm, sources: vals })}
                />
              </div>

              {/* Row 5: Trạng Thái */}
              <div className="ab-adv-form-row">
                <label className="ab-adv-form-label">Trạng Thái</label>
                <MultiSelect 
                  options={[
                    { value: 'todo', label: 'Mới (Todo)' },
                    { value: 'processing', label: 'Đang thực hiện (Processing)' },
                    { value: 'done', label: 'Hoàn thành (Done)' },
                    { value: 'cancelled', label: 'Hủy (Cancelled)' }
                  ]}
                  selected={advFilterForm.statuses}
                  onChange={(vals) => setAdvFilterForm({ ...advFilterForm, statuses: vals })}
                />
              </div>

              {/* Row 6: Ngày Tạo */}
              <div className="ab-adv-form-row">
                <label className="ab-adv-form-label">Ngày Tạo</label>
                <div className="ab-adv-date-range-row">
                  <div className="ab-adv-input-with-icon">
                    <input 
                      type="text" 
                      value={advFilterForm.createdFrom}
                      onChange={(e) => setAdvFilterForm({ ...advFilterForm, createdFrom: e.target.value })}
                      placeholder="mm/yyyy"
                    />
                    <Calendar size={18} color="#475569" style={{ cursor: 'pointer', flexShrink: 0 }} />
                  </div>
                  <span className="ab-adv-date-sep">-</span>
                  <div className="ab-adv-input-with-icon">
                    <input 
                      type="text" 
                      value={advFilterForm.createdTo}
                      onChange={(e) => setAdvFilterForm({ ...advFilterForm, createdTo: e.target.value })}
                      placeholder="dd/mm/yyyy"
                    />
                    <Calendar size={18} color="#475569" style={{ cursor: 'pointer', flexShrink: 0 }} />
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="ab-adv-modal-footer">
              <button 
                type="button" 
                className="ab-adv-btn-submit"
                onClick={handleApplyAdvancedFilter}
              >
                Lọc
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default ActivityBoard;
