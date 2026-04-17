import React, { useMemo, useState } from 'react';
import { Search, Plus, User, Pencil, Trash2, X } from 'lucide-react';
import { mockStore } from '../utils/mockStore';

export default function ServiceTicketList() {
  const [tickets, setTickets] = useState(() => mockStore.getAllTickets());
  const [searchTerm, setSearchTerm] = useState('');
  const [formModal, setFormModal] = useState({ open: false, mode: 'create', id: null });
  const [formData, setFormData] = useState({
    title: '',
    customerName: '',
    priority: 'Medium',
    status: 'Open',
    assignedTo: 'admin'
  });

  const filtered = useMemo(
    () =>
      tickets.filter(
        (t) =>
          t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.id.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [tickets, searchTerm]
  );

  const getPriorityStyle = (p) => {
    if (p === 'High') return { color: '#dc2626', background: '#fef2f2', border: '1px solid #fee2e2' };
    if (p === 'Medium') return { color: '#d97706', background: '#fffbeb', border: '1px solid #fef3c7' };
    return { color: '#059669', background: '#ecfdf5', border: '1px solid #d1fae5' };
  };

  const reloadTickets = () => setTickets(mockStore.getAllTickets());

  const openCreateModal = () => {
    setFormData({
      title: '',
      customerName: '',
      priority: 'Medium',
      status: 'Open',
      assignedTo: 'admin'
    });
    setFormModal({ open: true, mode: 'create', id: null });
  };

  const openEditModal = (ticket) => {
    setFormData({
      title: ticket.title || '',
      customerName: ticket.customerName || '',
      priority: ticket.priority || 'Medium',
      status: ticket.status || 'Open',
      assignedTo: ticket.assignedTo || 'admin'
    });
    setFormModal({ open: true, mode: 'edit', id: ticket.id });
  };

  const submitForm = () => {
    if (!formData.title.trim() || !formData.customerName.trim()) {
      alert('Vui lòng nhập tiêu đề ticket và tên khách hàng.');
      return;
    }
    const id = formModal.mode === 'create' ? mockStore.getNextTicketId() : formModal.id;
    mockStore.saveTicket(id, {
      id,
      title: formData.title.trim(),
      customerName: formData.customerName.trim(),
      priority: formData.priority,
      status: formData.status,
      createdDate:
        formModal.mode === 'create'
          ? new Date().toLocaleString('vi-VN')
          : tickets.find((ticket) => ticket.id === id)?.createdDate || new Date().toLocaleString('vi-VN'),
      assignedTo: formData.assignedTo.trim() || 'admin'
    });
    setFormModal({ open: false, mode: 'create', id: null });
    reloadTickets();
  };

  const deleteTicket = (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa ticket này?')) return;
    mockStore.deleteTicket(id);
    reloadTickets();
  };

  return (
    <div className="contract-page-container">
      <div className="contract-page-header">
        <div className="contract-header-left">
          <h1>Quản lý ticket</h1>
          <p className="contract-subtitle">Tiếp nhận và xử lý các yêu cầu hỗ trợ kỹ thuật và nghiệp vụ.</p>
        </div>
        <div className="contract-header-right">
          <button className="btn-primary" onClick={openCreateModal}>
            <Plus size={18} /> Tạo ticket mới
          </button>
        </div>
      </div>

      <div className="metric-cards-container">
        <div className="crm-metric-card" style={{ borderLeft: '4px solid #3b82f6' }}>
          <p className="crm-card-title">Ticket mới</p>
          <div className="crm-card-body"><p className="crm-card-value">{tickets.filter(t => t.status === 'Open').length}</p></div>
        </div>
        <div className="crm-metric-card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <p className="crm-card-title">Đang xử lý</p>
          <div className="crm-card-body"><p className="crm-card-value">{tickets.filter(t => t.status === 'In progress').length}</p></div>
        </div>
        <div className="crm-metric-card" style={{ borderLeft: '4px solid #16a34a' }}>
          <p className="crm-card-title">SLA đạt chuẩn</p>
          <div className="crm-card-body"><p className="crm-card-value">98.5%</p></div>
        </div>
      </div>

      <div className="toolbar-row" style={{ marginTop: '24px' }}>
        <div className="toolbar-left">
          <div className="search-box-modern">
            <Search size={16} color="#94a3b8" />
            <input type="text" placeholder="Tìm tiêu đề, khách hàng..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <select className="select-modern">
            <option>Tất cả độ ưu tiên</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </div>
      </div>

      <div className="contract-table-wrapper">
        <table className="contract-table">
          <thead>
            <tr>
              <th>Mã Ticket</th>
              <th>Tiêu đề yêu cầu</th>
              <th>Khách hàng</th>
              <th>Độ ưu tiên</th>
              <th>Ngày tạo</th>
              <th>Người xử lý</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(t => (
              <tr key={t.id}>
                <td style={{ fontWeight: 700, color: '#3b82f6' }}>#{t.id}</td>
                <td style={{ fontWeight: 600 }}>{t.title}</td>
                <td>{t.customerName}</td>
                <td>
                  <span style={{ 
                    padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700,
                    ...getPriorityStyle(t.priority)
                  }}>
                    {t.priority}
                  </span>
                </td>
                <td style={{ fontSize: '12px', color: '#64748b' }}>{t.createdDate}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <User size={12} />
                    </div>
                    {t.assignedTo}
                  </div>
                </td>
                <td>
                  <span className={`status-badge-modern ${t.status === 'Open' ? 'status-badge-blue' : 'status-badge-yellow'}`}>
                    {t.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button onClick={() => openEditModal(t)} style={{ border: 'none', background: 'transparent', color: '#2563eb', cursor: 'pointer' }} title="Sửa ticket">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => deleteTicket(t.id)} style={{ border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer' }} title="Xóa ticket">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {formModal.open && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
          <div style={{ width: '560px', maxWidth: '92vw', background: 'white', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderBottom: '1px solid #e2e8f0' }}>
              <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>
                {formModal.mode === 'create' ? 'Tạo ticket mới' : 'Cập nhật ticket'}
              </h3>
              <button onClick={() => setFormModal({ open: false, mode: 'create', id: null })} style={{ border: 'none', background: 'transparent', color: '#64748b', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>
            <div style={{ padding: '16px', display: 'grid', gap: '12px' }}>
              <input className="form-control" placeholder="Tiêu đề ticket" value={formData.title} onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))} />
              <input className="form-control" placeholder="Tên khách hàng" value={formData.customerName} onChange={(e) => setFormData((prev) => ({ ...prev, customerName: e.target.value }))} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <select className="form-control" value={formData.priority} onChange={(e) => setFormData((prev) => ({ ...prev, priority: e.target.value }))}>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
                <select className="form-control" value={formData.status} onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}>
                  <option value="Open">Open</option>
                  <option value="In progress">In progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>
              <input className="form-control" placeholder="Người xử lý" value={formData.assignedTo} onChange={(e) => setFormData((prev) => ({ ...prev, assignedTo: e.target.value }))} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', padding: '14px 16px', borderTop: '1px solid #e2e8f0' }}>
              <button className="btn btn-secondary" onClick={() => setFormModal({ open: false, mode: 'create', id: null })}>Hủy</button>
              <button className="btn btn-primary" onClick={submitForm}>Lưu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
