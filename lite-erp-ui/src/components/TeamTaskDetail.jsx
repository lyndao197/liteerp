import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import {
  EMPLOYEE_OPTIONS,
  TASKS_UPDATED_EVENT,
  findTeamTaskById,
  syncTeamTaskToPersonal,
  updateTeamTaskById,
} from '../utils/taskSyncStore';

function TeamTaskDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [task, setTask] = useState(() => findTeamTaskById(id));
  const [showSubtaskPopup, setShowSubtaskPopup] = useState(false);
  const [subTaskForm, setSubTaskForm] = useState({
    title: '',
    assignee: EMPLOYEE_OPTIONS[0] || '',
    dueDate: '',
    priority: 'normal',
  });

  useEffect(() => {
    const reload = () => setTask(findTeamTaskById(id));
    window.addEventListener(TASKS_UPDATED_EVENT, reload);
    return () => window.removeEventListener(TASKS_UPDATED_EVENT, reload);
  }, [id]);

  const summary = useMemo(() => {
    if (!task) return { total: 0, done: 0 };
    const total = task.subTasks?.length || 0;
    const done = (task.subTasks || []).filter((item) => item.status === 'done').length;
    return { total, done };
  }, [task]);

  if (!task) {
    return (
      <div style={{ padding: '24px' }}>
        <button onClick={() => navigate('/activities/team')} style={{ border: '1px solid #cbd5e1', background: 'white', borderRadius: '8px', padding: '8px 12px', cursor: 'pointer' }}>
          Quay lại
        </button>
        <div style={{ marginTop: '16px', color: '#64748b' }}>Không tìm thấy công việc chung.</div>
      </div>
    );
  }

  const updateTaskAndRefresh = (updater, shouldSync = true) => {
    const updated = updateTeamTaskById(task.id, updater);
    if (shouldSync && updated?.assignee) {
      syncTeamTaskToPersonal(updated);
    }
    setTask(findTeamTaskById(task.id));
  };

  const handleCreateSubTask = (e) => {
    e.preventDefault();
    if (!subTaskForm.title.trim() || !subTaskForm.assignee) {
      window.alert('Vui lòng nhập tên sub-task và chọn nhân viên phụ trách.');
      return;
    }
    const nextSubtask = {
      id: (task.subTasks || []).reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1,
      title: subTaskForm.title.trim(),
      assignee: subTaskForm.assignee.trim(),
      dueDate: subTaskForm.dueDate || '',
      priority: subTaskForm.priority,
      status: 'todo',
    };
    updateTaskAndRefresh((prev) => ({ subTasks: [...(prev.subTasks || []), nextSubtask] }), false);
    setShowSubtaskPopup(false);
    setSubTaskForm({ title: '', assignee: EMPLOYEE_OPTIONS[0] || '', dueDate: '', priority: 'normal' });
  };

  const setSubTaskStatus = (subTaskId, status) => {
    updateTaskAndRefresh((prev) => ({
      subTasks: (prev.subTasks || []).map((item) => (item.id === subTaskId ? { ...item, status } : item)),
    }), false);
  };

  return (
    <div style={{ padding: '24px', display: 'grid', gap: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => navigate('/activities/team')} style={{ border: '1px solid #cbd5e1', background: 'white', borderRadius: '8px', padding: '8px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ArrowLeft size={16} /> Quay lại Kanban
        </button>
        <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', background: '#f1f5f9', padding: '4px 10px', borderRadius: '999px' }}>
          #{task.id}
        </span>
      </div>

      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', display: 'grid', gap: '10px' }}>
        <h2 style={{ margin: 0, fontSize: '20px', color: '#0f172a' }}>{task.title}</h2>
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', color: '#475569', fontSize: '13px' }}>
          <span><strong>Phòng ban:</strong> {task.department}</span>
          <span><strong>Nguồn:</strong> {task.source || '-'}</span>
          <span><strong>Hạn chót:</strong> {task.dueDate || '-'}</span>
          <span><strong>Trưởng nhóm:</strong> {task.assignee || 'Chưa giao'}</span>
        </div>
        {task.description ? <div style={{ fontSize: '13px', color: '#64748b' }}>{task.description}</div> : null}
      </div>

      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>Phân bổ sub-task cho nhân viên</h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>
              Tiến độ: {summary.done}/{summary.total} sub-task hoàn thành
            </p>
          </div>
          <button onClick={() => setShowSubtaskPopup(true)} style={{ border: 'none', background: '#e32b4c', color: 'white', borderRadius: '8px', height: '36px', padding: '0 12px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 600 }}>
            <Plus size={14} /> Phân bổ công việc
          </button>
        </div>

        <div style={{ display: 'grid', gap: '8px' }}>
          {(task.subTasks || []).length === 0 && (
            <div style={{ color: '#94a3b8', fontSize: '13px' }}>Chưa có sub-task, hãy thêm và phân bổ cho nhân viên.</div>
          )}
          {(task.subTasks || []).map((item) => (
            <div key={item.id} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 12px', display: 'grid', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '14px' }}>{item.title}</div>
                <select value={item.status} onChange={(e) => setSubTaskStatus(item.id, e.target.value)} style={{ border: '1px solid #cbd5e1', borderRadius: '6px', height: '30px', fontSize: '12px', padding: '0 8px' }}>
                  <option value="todo">Mới</option>
                  <option value="processing">Đang thực hiện</option>
                  <option value="done">Hoàn thành</option>
                  <option value="cancelled">Hủy</option>
                </select>
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <span><strong>Nhân viên:</strong> {item.assignee}</span>
                <span><strong>Hạn chót:</strong> {item.dueDate || '-'}</span>
                <span><strong>Ưu tiên:</strong> {item.priority || 'normal'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showSubtaskPopup && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
          onClick={() => setShowSubtaskPopup(false)}
        >
          <form
            onSubmit={handleCreateSubTask}
            onClick={(e) => e.stopPropagation()}
            style={{ width: '100%', maxWidth: '560px', background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '18px' }}
          >
            <h3 style={{ margin: 0, marginBottom: '12px', color: '#0f172a' }}>Tạo sub-task</h3>
            <div style={{ display: 'grid', gap: '10px' }}>
              <input value={subTaskForm.title} onChange={(e) => setSubTaskForm((prev) => ({ ...prev, title: e.target.value }))} placeholder="Tên sub-task" style={{ height: '38px', borderRadius: '8px', border: '1px solid #cbd5e1', padding: '0 12px' }} />
              <select value={subTaskForm.assignee} onChange={(e) => setSubTaskForm((prev) => ({ ...prev, assignee: e.target.value }))} style={{ height: '38px', borderRadius: '8px', border: '1px solid #cbd5e1', padding: '0 12px' }}>
                {EMPLOYEE_OPTIONS.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <input type="date" value={subTaskForm.dueDate} onChange={(e) => setSubTaskForm((prev) => ({ ...prev, dueDate: e.target.value }))} style={{ height: '38px', borderRadius: '8px', border: '1px solid #cbd5e1', padding: '0 12px' }} />
                <select value={subTaskForm.priority} onChange={(e) => setSubTaskForm((prev) => ({ ...prev, priority: e.target.value }))} style={{ height: '38px', borderRadius: '8px', border: '1px solid #cbd5e1', padding: '0 12px' }}>
                  <option value="normal">Bình thường</option>
                  <option value="high">Gấp</option>
                  <option value="critical">Rất gấp</option>
                  <option value="low">Thấp</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '14px' }}>
              <button type="button" onClick={() => setShowSubtaskPopup(false)} style={{ height: '36px', padding: '0 12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white', cursor: 'pointer' }}>
                Hủy
              </button>
              <button type="submit" style={{ height: '36px', padding: '0 12px', borderRadius: '8px', border: 'none', background: '#e32b4c', color: 'white', cursor: 'pointer', fontWeight: 600 }}>
                Lưu sub-task
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default TeamTaskDetail;
