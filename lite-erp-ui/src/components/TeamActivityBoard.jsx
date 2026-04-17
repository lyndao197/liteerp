import React, { useMemo, useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, Search, Calendar, Filter, Users, TrendingDown, TrendingUp, CheckCircle2, List, Columns } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  DEPARTMENT_OPTIONS,
  EMPLOYEE_OPTIONS,
  TASKS_UPDATED_EVENT,
  createTeamTask,
  loadTeamTasks,
  syncTeamTaskToPersonal,
  updateTeamTaskById,
} from '../utils/taskSyncStore';

const STATUS_COLUMNS = [
  { id: 'todo', title: 'Mới', color: '#64748b' },
  { id: 'processing', title: 'Đang thực hiện', color: '#3b82f6' },
  { id: 'cancelled', title: 'Hủy', color: '#ef4444' },
  { id: 'done', title: 'Hoàn thành', color: '#22c55e' },
];

function TeamActivityBoard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState(() => loadTeamTasks());
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' or 'list'
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [assigningTaskId, setAssigningTaskId] = useState(null);
  const [selectedAssignee, setSelectedAssignee] = useState(EMPLOYEE_OPTIONS[0] || '');
  const [createForm, setCreateForm] = useState({
    title: '',
    department: DEPARTMENT_OPTIONS[0] || '',
    dueDate: '',
    priority: 'normal',
    assignee: '',
    description: '',
  });

  useEffect(() => {
    const reload = () => setTasks(loadTeamTasks());
    window.addEventListener(TASKS_UPDATED_EVENT, reload);
    return () => window.removeEventListener(TASKS_UPDATED_EVENT, reload);
  }, []);

  const departments = useMemo(
    () => ['All', ...new Set([...DEPARTMENT_OPTIONS, ...tasks.map((t) => t.department)].filter(Boolean))],
    [tasks]
  );

  const filteredTasks = useMemo(() => {
    let result = [...tasks];
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter((item) =>
        [item.title, item.department, item.assignee, item.source]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(q))
      );
    }
    if (departmentFilter !== 'All') {
      result = result.filter((item) => item.department === departmentFilter);
    }
    if (statusFilter !== 'All') {
      result = result.filter((item) => item.status === statusFilter);
    }
    return result;
  }, [tasks, searchTerm, departmentFilter, statusFilter]);

  const summaryMetrics = useMemo(() => {
    let overdue = 0;
    let today = 0;
    let done = 0;
    tasks.forEach((item) => {
      if (item.status === 'done') {
        done += 1;
      } else if (item.dueDate === '2026-04-10') {
        today += 1;
      } else if (item.dueDate && item.dueDate < '2026-04-10') {
        overdue += 1;
      }
    });
    return { overdue, today, done };
  }, [tasks]);

  const onDragEnd = (result) => {
    const { destination, draggableId } = result;
    if (!destination) return;
    const changedTask = updateTeamTaskById(draggableId, { status: destination.droppableId });
    if (changedTask?.assignee) syncTeamTaskToPersonal(changedTask);
    setTasks(loadTeamTasks());
  };

  const handleCreateDepartmentTask = (e) => {
    e.preventDefault();
    if (!createForm.title.trim() || !createForm.department.trim()) {
      window.alert('Vui lòng nhập Tên công việc và Phòng ban.');
      return;
    }
    const newTask = createTeamTask({
      title: createForm.title.trim(),
      department: createForm.department.trim(),
      dueDate: createForm.dueDate,
      priority: createForm.priority,
      assignee: createForm.assignee.trim(),
      description: createForm.description.trim(),
      status: 'todo',
    });
    if (newTask.assignee) syncTeamTaskToPersonal(newTask);
    setShowCreateModal(false);
    setCreateForm({
      title: '',
      department: DEPARTMENT_OPTIONS[0] || '',
      dueDate: '',
      priority: 'normal',
      assignee: '',
      description: '',
    });
    setTasks(loadTeamTasks());
  };

  const handleAssignEmployee = (taskId, assignee) => {
    if (!assignee) return;
    const assignedTask = updateTeamTaskById(taskId, { assignee: assignee.trim() });
    if (assignedTask) syncTeamTaskToPersonal(assignedTask);
    setTasks(loadTeamTasks());
  };

  const getPriorityLabel = (priority) => {
    if (priority === 'critical') return 'Rất gấp';
    if (priority === 'high') return 'Gấp';
    if (priority === 'low') return 'Thấp';
    return 'Bình thường';
  };

  const getDueDateStyle = (dueDate) => {
    if (!dueDate) return { color: '#64748b', borderColor: '#cbd5e1', backgroundColor: '#f8fafc' };
    if (dueDate < '2026-04-10') return { color: '#ef4444', borderColor: '#ef4444', backgroundColor: '#fef2f2' };
    if (dueDate === '2026-04-10') return { color: '#ca8a04', borderColor: '#fef08a', backgroundColor: '#fef9c3' };
    return { color: '#16a34a', borderColor: '#bbf7d0', backgroundColor: '#f0fdf4' };
  };

  return (
    <div className="activity-board kanban-container">
      <div className="kanban-header" style={{ marginBottom: '24px' }}>
        <h1 className="page-title" style={{ margin: 0, fontSize: '24px', color: '#1e293b', fontWeight: 700 }}>
          Quản lý công việc chung
        </h1>
        <p style={{ color: '#64748b', fontSize: '14px', margin: '4px 0 0 0', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.6px' }}>
          Tạo công việc theo phòng ban và phân bổ đến nhân viên
        </p>
      </div>

      <div className="metrics-cards-container" style={{ width: '100%', marginBottom: '16px' }}>
        <div className="metric-card">
          <span className="metric-label">Trễ hạn</span>
          <div className="metric-value-row">
            <span className="metric-value" style={{ color: '#ef4444' }}>{summaryMetrics.overdue}</span>
            <div className="metric-trend" style={{ color: '#ef4444' }}><TrendingDown size={14} /> Quá hạn</div>
          </div>
        </div>
        <div className="metric-card">
          <span className="metric-label">Đến hạn hôm nay</span>
          <div className="metric-value-row">
            <span className="metric-value" style={{ color: '#f59e0b' }}>{summaryMetrics.today}</span>
            <div className="metric-trend" style={{ color: '#f59e0b' }}><TrendingUp size={14} /> Hôm nay</div>
          </div>
        </div>
        <div className="metric-card">
          <span className="metric-label">Đã hoàn thành</span>
          <div className="metric-value-row">
            <span className="metric-value" style={{ color: '#10b981' }}>{summaryMetrics.done}</span>
            <div className="metric-trend" style={{ color: '#10b981' }}><CheckCircle2 size={14} /> Hoàn thành</div>
          </div>
        </div>
      </div>

      <div className="list-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', background: 'white', padding: '24px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ width: '360px', position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#44494D' }} />
            <input
              type="text"
              placeholder="Tìm theo công việc, phòng ban, nhân viên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: '10px 16px 10px 44px', borderRadius: '8px', border: '1px solid #E2E8F0', background: '#F8F8F8', fontSize: '14px', width: '100%', outline: 'none', color: '#44494D' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={16} color="#64748b" />
            <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #E2E8F0', background: '#F8F8F8' }}>
              {departments.map((department) => (
                <option key={department} value={department}>
                  {department === 'All' ? 'Tất cả phòng ban' : department}
                </option>
              ))}
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #E2E8F0', background: '#F8F8F8' }}>
              <option value="All">Tất cả trạng thái</option>
              {STATUS_COLUMNS.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="view-switcher" style={{ background: '#EFEDED', padding: '4px', borderRadius: '8px', display: 'flex', gap: '4px' }}>
          <button 
            className={`view-btn ${viewMode === 'kanban' ? 'active' : ''}`} 
            style={{ border: 'none', background: viewMode === 'kanban' ? 'white' : 'transparent', color: viewMode === 'kanban' ? '#e32b4c' : '#64748b', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }} 
            onClick={() => setViewMode('kanban')} 
            title="Kanban View"
          >
            <Columns size={16} />
          </button>
          <button 
            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`} 
            style={{ border: 'none', background: viewMode === 'list' ? 'white' : 'transparent', color: viewMode === 'list' ? '#e32b4c' : '#64748b', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }} 
            onClick={() => setViewMode('list')} 
            title="List View"
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {viewMode === 'kanban' ? (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="kanban-columns">
            {STATUS_COLUMNS.map((column) => {
              const columnTasks = filteredTasks.filter((task) => task.status === column.id);
              return (
                <div key={column.id} className="kanban-column" style={{ backgroundColor: '#f6f6f6', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, minWidth: '0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0', borderRadius: '8px', width: '24px', height: '24px', color: '#545454', fontSize: '14px', fontWeight: 700 }}>
                      {columnTasks.length}
                    </div>
                    <h3 style={{ margin: 0, color: '#545454', fontSize: '14px', fontWeight: 600, textTransform: 'uppercase' }}>{column.title}</h3>
                  </div>
                  <Droppable droppableId={column.id}>
                    {(provided) => (
                      <div className="task-list kanban-column-content" {...provided.droppableProps} ref={provided.innerRef}>
                        {columnTasks.map((task, index) => (
                          <Draggable key={task.id.toString()} draggableId={task.id.toString()} index={index}>
                            {(dragProvided, snapshot) => (
                              <div
                                className={`activity-card opp-style priority-${task.priority} ${snapshot.isDragging ? 'is-dragging' : ''}`}
                                {...dragProvided.draggableProps}
                                {...dragProvided.dragHandleProps}
                                ref={dragProvided.innerRef}
                                style={{ ...dragProvided.draggableProps.style }}
                                onClick={() => navigate(`/activities/team/${task.id}`)}
                              >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', background: '#f1f5f9', padding: '2px 8px', borderRadius: '999px' }}>
                                    #{task.id}
                                  </span>
                                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#475569' }}>{task.department}</span>
                                </div>
                                <div style={{ marginTop: '8px', fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{task.title}</div>
                                <div style={{ marginTop: '8px', fontSize: '12px', color: '#64748b', display: 'grid', gap: '4px' }}>
                                  <div><strong>Nguồn:</strong> {task.source || '-'}</div>
                                  <div><strong>Độ ưu tiên:</strong> {getPriorityLabel(task.priority)}</div>
                                  <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                                      <strong>Tiến độ sub-task:</strong>
                                      <span>
                                        {(() => {
                                          const total = task.subTasks?.length || 0;
                                          const done = (task.subTasks || []).filter((x) => x.status === 'done').length;
                                          return `${total ? Math.round((done / total) * 100) : 0}%`;
                                        })()}
                                      </span>
                                    </div>
                                    <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
                                      <div
                                        style={{
                                          height: '100%',
                                          background: '#22c55e',
                                          width: `${(() => {
                                            const total = task.subTasks?.length || 0;
                                            const done = (task.subTasks || []).filter((x) => x.status === 'done').length;
                                            return total ? Math.round((done / total) * 100) : 0;
                                          })()}%`,
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <strong>Hạn chót:</strong>
                                    <span style={{ ...getDueDateStyle(task.dueDate), borderRadius: '4px', padding: '2px 6px', fontWeight: 700, border: '1px solid' }}>
                                      {task.dueDate || '-'}
                                    </span>
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                                    <span><strong>Người nhận:</strong> {task.assignee || 'Chưa phân bổ'}</span>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedAssignee(task.assignee || EMPLOYEE_OPTIONS[0] || '');
                                        setAssigningTaskId(task.id);
                                      }}
                                      style={{ border: '1px solid #cbd5e1', background: 'white', borderRadius: '6px', fontSize: '11px', padding: '4px 8px', cursor: 'pointer', color: '#334155', display: 'flex', alignItems: 'center', gap: '4px' }}
                                    >
                                      <Users size={12} /> Phân bổ
                                    </button>
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
        <div className="list-view-container" style={{ overflow: 'auto', backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569' }}>Mã việc</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569' }}>Tên công việc</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569' }}>Phòng ban</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569' }}>Người nhận</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569' }}>Hạn chót</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569' }}>Độ ưu tiên</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, color: '#475569' }}>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr key={task.id} onClick={() => navigate(`/activities/team/${task.id}`)} style={{ borderBottom: '1px solid #e2e8f0', cursor: 'pointer' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>#{task.id}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: '#0f172a' }}>{task.title}</td>
                  <td style={{ padding: '12px 16px' }}>{task.department}</td>
                  <td style={{ padding: '12px 16px' }}>{task.assignee || 'Chưa phân bổ'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ ...getDueDateStyle(task.dueDate), padding: '2px 8px', borderRadius: '4px', border: '1px solid', fontSize: '11px', fontWeight: 700 }}>
                      {task.dueDate || '-'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>{getPriorityLabel(task.priority)}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ 
                      backgroundColor: STATUS_COLUMNS.find(c => c.id === task.status)?.color + '20', 
                      color: STATUS_COLUMNS.find(c => c.id === task.status)?.color,
                      padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700
                    }}>
                      {STATUS_COLUMNS.find(c => c.id === task.status)?.title}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredTasks.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>Không có dữ liệu công việc</div>
          )}
        </div>
      )}

      {showCreateModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.45)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
          onClick={() => setShowCreateModal(false)}
        >
          <form
            onSubmit={handleCreateDepartmentTask}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '720px',
              background: 'white',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 20px 45px rgba(2, 6, 23, 0.2)',
              padding: '20px',
            }}
          >
            <h3 style={{ margin: 0, marginBottom: '4px', fontSize: '20px', color: '#0f172a' }}>Tạo công việc chung</h3>
            <p style={{ margin: 0, marginBottom: '16px', color: '#64748b', fontSize: '13px' }}>
              Khởi tạo công việc phòng ban và thiết lập thông tin cơ bản trước khi phân bổ.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <label style={{ display: 'grid', gap: '6px', gridColumn: '1 / span 2' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>Tên công việc *</span>
                <input value={createForm.title} onChange={(e) => setCreateForm((prev) => ({ ...prev, title: e.target.value }))} style={{ height: '38px', borderRadius: '8px', border: '1px solid #cbd5e1', padding: '0 12px' }} placeholder="Ví dụ: Triển khai quy trình CSKH tháng 05" />
              </label>
              <label style={{ display: 'grid', gap: '6px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>Phòng ban phụ trách *</span>
                <select value={createForm.department} onChange={(e) => setCreateForm((prev) => ({ ...prev, department: e.target.value }))} style={{ height: '38px', borderRadius: '8px', border: '1px solid #cbd5e1', padding: '0 12px' }}>
                  {DEPARTMENT_OPTIONS.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </label>
              <label style={{ display: 'grid', gap: '6px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>Hạn chót</span>
                <input type="date" value={createForm.dueDate} onChange={(e) => setCreateForm((prev) => ({ ...prev, dueDate: e.target.value }))} style={{ height: '38px', borderRadius: '8px', border: '1px solid #cbd5e1', padding: '0 12px' }} />
              </label>
              <label style={{ display: 'grid', gap: '6px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>Độ ưu tiên</span>
                <select value={createForm.priority} onChange={(e) => setCreateForm((prev) => ({ ...prev, priority: e.target.value }))} style={{ height: '38px', borderRadius: '8px', border: '1px solid #cbd5e1', padding: '0 12px' }}>
                  <option value="normal">Bình thường</option>
                  <option value="high">Gấp</option>
                  <option value="critical">Rất gấp</option>
                  <option value="low">Thấp</option>
                </select>
              </label>
              <label style={{ display: 'grid', gap: '6px', gridColumn: '1 / span 2' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>Giao trưởng nhóm phụ trách (tuỳ chọn)</span>
                <select value={createForm.assignee} onChange={(e) => setCreateForm((prev) => ({ ...prev, assignee: e.target.value }))} style={{ height: '38px', borderRadius: '8px', border: '1px solid #cbd5e1', padding: '0 12px' }}>
                  <option value="">Chưa chọn</option>
                  {EMPLOYEE_OPTIONS.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </label>
              <label style={{ display: 'grid', gap: '6px', gridColumn: '1 / span 2' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>Mô tả ngắn</span>
                <textarea value={createForm.description} onChange={(e) => setCreateForm((prev) => ({ ...prev, description: e.target.value }))} rows={3} style={{ borderRadius: '8px', border: '1px solid #cbd5e1', padding: '10px 12px', resize: 'vertical' }} placeholder="Mục tiêu công việc, phạm vi và đầu ra kỳ vọng..." />
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
              <button type="button" onClick={() => setShowCreateModal(false)} style={{ height: '38px', padding: '0 14px', border: '1px solid #cbd5e1', background: '#fff', borderRadius: '8px', cursor: 'pointer' }}>
                Huỷ
              </button>
              <button type="submit" style={{ height: '38px', padding: '0 14px', border: 'none', background: '#e32b4c', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
                Tạo công việc
              </button>
            </div>
          </form>
        </div>
      )}

      {assigningTaskId && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
          onClick={() => setAssigningTaskId(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ width: '100%', maxWidth: '420px', background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '18px' }}
          >
            <h4 style={{ margin: 0, marginBottom: '10px', color: '#0f172a' }}>Phân bổ cho nhân viên</h4>
            <select
              value={selectedAssignee}
              onChange={(e) => setSelectedAssignee(e.target.value)}
              style={{ width: '100%', height: '38px', borderRadius: '8px', border: '1px solid #cbd5e1', padding: '0 12px' }}
            >
              {EMPLOYEE_OPTIONS.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '14px' }}>
              <button type="button" onClick={() => setAssigningTaskId(null)} style={{ height: '36px', padding: '0 12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white', cursor: 'pointer' }}>
                Hủy
              </button>
              <button
                type="button"
                onClick={() => {
                  handleAssignEmployee(assigningTaskId, selectedAssignee);
                  setAssigningTaskId(null);
                }}
                style={{ height: '36px', padding: '0 12px', borderRadius: '8px', border: 'none', background: '#e32b4c', color: 'white', cursor: 'pointer', fontWeight: 600 }}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeamActivityBoard;
