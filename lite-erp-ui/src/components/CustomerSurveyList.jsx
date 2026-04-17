import React, { useMemo, useState } from 'react';
import { Plus, Search, Pencil, Trash2, X, Copy } from 'lucide-react';
import { mockStore } from '../utils/mockStore';

export default function CustomerSurveyList() {
  const [surveys, setSurveys] = useState(() => mockStore.getAllCustomerSurveys());
  const [searchTerm, setSearchTerm] = useState('');
  const [formModal, setFormModal] = useState({ open: false, mode: 'create', id: null });
  const [formData, setFormData] = useState({
    title: '',
    customerName: '',
    channel: 'Email',
    status: 'Đã gửi',
    score: 5,
    owner: 'admin',
    surveyLink: ''
  });

  const buildSurveyLink = (surveyId) =>
    `${window.location.origin}/customer-service/surveys/respond/${surveyId}`;

  const filtered = useMemo(
    () =>
      surveys.filter(
        (survey) =>
          survey.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          survey.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          survey.id.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [surveys, searchTerm]
  );

  const reloadSurveys = () => setSurveys(mockStore.getAllCustomerSurveys());

  const openCreateModal = () => {
    setFormData({
      title: '',
      customerName: '',
      channel: 'Email',
      status: 'Đã gửi',
      score: 5,
      owner: 'admin',
      surveyLink: ''
    });
    setFormModal({ open: true, mode: 'create', id: null });
  };

  const openEditModal = (survey) => {
    setFormData({
      title: survey.title || '',
      customerName: survey.customerName || '',
      channel: survey.channel || 'Email',
      status: survey.status || 'Đã gửi',
      score: survey.score || 5,
      owner: survey.owner || 'admin',
      surveyLink: survey.surveyLink || buildSurveyLink(survey.id)
    });
    setFormModal({ open: true, mode: 'edit', id: survey.id });
  };

  const submitForm = () => {
    if (!formData.title.trim() || !formData.customerName.trim()) {
      alert('Vui lòng nhập tiêu đề khảo sát và tên khách hàng.');
      return;
    }
    const id = formModal.mode === 'create' ? mockStore.getNextCustomerSurveyId() : formModal.id;
    const surveyLink = formData.surveyLink?.trim() || buildSurveyLink(id);
    mockStore.saveCustomerSurvey(id, {
      id,
      title: formData.title.trim(),
      customerName: formData.customerName.trim(),
      channel: formData.channel,
      status: formData.status,
      score: Number(formData.score) || 0,
      owner: formData.owner.trim() || 'admin',
      surveyLink,
      createdDate:
        formModal.mode === 'create'
          ? new Date().toISOString().slice(0, 10)
          : surveys.find((survey) => survey.id === id)?.createdDate || new Date().toISOString().slice(0, 10)
    });
    setFormModal({ open: false, mode: 'create', id: null });
    reloadSurveys();
  };

  const deleteSurvey = (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa khảo sát này?')) return;
    mockStore.deleteCustomerSurvey(id);
    reloadSurveys();
  };

  const copySurveyLink = async (link) => {
    try {
      await navigator.clipboard.writeText(link);
      alert('Đã sao chép link khảo sát.');
    } catch (error) {
      alert('Không thể sao chép link. Vui lòng thử lại.');
    }
  };

  return (
    <div className="contract-page-container">
      <div className="contract-page-header">
        <div className="contract-header-left">
          <h1>Quản lý khảo sát khách hàng</h1>
          <p className="contract-subtitle">Thiết lập, theo dõi và xử lý phản hồi khảo sát từ khách hàng.</p>
        </div>
        <div className="contract-header-right">
          <button className="btn-primary" onClick={openCreateModal}>
            <Plus size={18} /> Tạo khảo sát
          </button>
        </div>
      </div>

      <div className="metric-cards-container">
        <div className="crm-metric-card" style={{ borderLeft: '4px solid #3b82f6' }}>
          <p className="crm-card-title">Tổng khảo sát</p>
          <div className="crm-card-body"><p className="crm-card-value">{surveys.length}</p></div>
        </div>
        <div className="crm-metric-card" style={{ borderLeft: '4px solid #10b981' }}>
          <p className="crm-card-title">Đã phản hồi</p>
          <div className="crm-card-body"><p className="crm-card-value">{surveys.filter((item) => item.status === 'Đã phản hồi').length}</p></div>
        </div>
        <div className="crm-metric-card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <p className="crm-card-title">Điểm hài lòng TB</p>
          <div className="crm-card-body"><p className="crm-card-value">{surveys.length ? (surveys.reduce((sum, item) => sum + (Number(item.score) || 0), 0) / surveys.length).toFixed(1) : '0.0'}</p></div>
        </div>
      </div>

      <div className="toolbar-row" style={{ marginTop: '24px' }}>
        <div className="toolbar-left">
          <div className="search-box-modern">
            <Search size={16} color="#94a3b8" />
            <input type="text" placeholder="Tìm mã khảo sát, tiêu đề, khách hàng..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="contract-table-wrapper">
        <table className="contract-table">
          <thead>
            <tr>
              <th>Mã khảo sát</th>
              <th>Tiêu đề</th>
              <th>Khách hàng</th>
              <th>Kênh</th>
              <th>Điểm</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
              <th>Chủ trì</th>
              <th>Link gửi KH</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((survey) => (
              <tr key={survey.id}>
                <td style={{ fontWeight: 700, color: '#3b82f6' }}>{survey.id}</td>
                <td style={{ fontWeight: 600 }}>{survey.title}</td>
                <td>{survey.customerName}</td>
                <td>{survey.channel}</td>
                <td>{survey.score}/5</td>
                <td>
                  <span className={`status-badge-modern ${survey.status === 'Đã phản hồi' ? 'status-badge-green' : 'status-badge-yellow'}`}>
                    {survey.status}
                  </span>
                </td>
                <td>{survey.createdDate}</td>
                <td>{survey.owner}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', maxWidth: '240px' }}>
                    <a
                      href={survey.surveyLink || buildSurveyLink(survey.id)}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: '#2563eb', fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                    >
                      {survey.surveyLink || buildSurveyLink(survey.id)}
                    </a>
                    <button
                      onClick={() => copySurveyLink(survey.surveyLink || buildSurveyLink(survey.id))}
                      style={{ border: 'none', background: 'transparent', color: '#64748b', cursor: 'pointer' }}
                      title="Sao chép link khảo sát"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button onClick={() => openEditModal(survey)} style={{ border: 'none', background: 'transparent', color: '#2563eb', cursor: 'pointer' }} title="Sửa khảo sát">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => deleteSurvey(survey.id)} style={{ border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer' }} title="Xóa khảo sát">
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
                {formModal.mode === 'create' ? 'Tạo khảo sát khách hàng' : 'Cập nhật khảo sát'}
              </h3>
              <button onClick={() => setFormModal({ open: false, mode: 'create', id: null })} style={{ border: 'none', background: 'transparent', color: '#64748b', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>
            <div style={{ padding: '16px', display: 'grid', gap: '12px' }}>
              <input className="form-control" placeholder="Tiêu đề khảo sát" value={formData.title} onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))} />
              <input className="form-control" placeholder="Tên khách hàng" value={formData.customerName} onChange={(e) => setFormData((prev) => ({ ...prev, customerName: e.target.value }))} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <select className="form-control" value={formData.channel} onChange={(e) => setFormData((prev) => ({ ...prev, channel: e.target.value }))}>
                  <option value="Email">Email</option>
                  <option value="Điện thoại">Điện thoại</option>
                  <option value="Zalo">Zalo</option>
                  <option value="Biểu mẫu">Biểu mẫu</option>
                </select>
                <select className="form-control" value={formData.status} onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}>
                  <option value="Đã gửi">Đã gửi</option>
                  <option value="Đã phản hồi">Đã phản hồi</option>
                  <option value="Nháp">Nháp</option>
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <input className="form-control" type="number" min="0" max="5" placeholder="Điểm (0-5)" value={formData.score} onChange={(e) => setFormData((prev) => ({ ...prev, score: e.target.value }))} />
                <input className="form-control" placeholder="Chủ trì khảo sát" value={formData.owner} onChange={(e) => setFormData((prev) => ({ ...prev, owner: e.target.value }))} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px', alignItems: 'center' }}>
                <input
                  className="form-control"
                  placeholder="Link khảo sát gửi khách hàng"
                  value={formData.surveyLink || (formModal.mode === 'create' ? buildSurveyLink('SRV-XXX') : '')}
                  onChange={(e) => setFormData((prev) => ({ ...prev, surveyLink: e.target.value }))}
                />
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => copySurveyLink(formData.surveyLink || (formModal.mode === 'edit' ? buildSurveyLink(formModal.id) : buildSurveyLink('SRV-XXX')))}
                >
                  <Copy size={14} /> Copy
                </button>
              </div>
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
