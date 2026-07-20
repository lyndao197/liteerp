import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, Save } from 'lucide-react';
import { mockStore } from '../utils/mockStore';

const DEFAULT_BODY = `Xin chao {{username}},

Tai khoan cua ban da duoc tao thanh cong tren he thong LiteERP.
De bat dau su dung he thong, vui long nhan vao nut ben duoi de kich hoat tai khoan va thiet lap mat khau.

[ Kich hoat tai khoan ]

Luu y: Lien ket kich hoat co hieu luc trong 7 ngay ke tu thoi diem email duoc gui.
Thong tin tai khoan:
- He thong: {{fDomain}}
- Ten dang nhap: {{useraccount}}

Tran trong,
Doi ngu xERP`;

const EMPTY_FORM = {
  id: '',
  code: '',
  name: '',
  category: 'system',
  subject: '[xERP] Tai khoan cua ban da duoc tao thanh cong',
  body: DEFAULT_BODY,
  status: 'active'
};

export default function EmailConfig() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      const existing = mockStore.getEmailTemplate(id);
      if (existing) {
        setFormData({ ...EMPTY_FORM, ...existing });
        return;
      }
    }

    const all = mockStore.getAllEmailTemplates();
    const first = all[0];
    if (first) {
      setFormData({ ...EMPTY_FORM, ...first, id: first.id });
    }
  }, [searchParams]);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const nextErrors = {};
    if (!formData.code.trim()) nextErrors.code = 'Vui lòng nhập mã template';
    if (!formData.name.trim()) nextErrors.name = 'Vui lòng nhập tên template';
    if (!formData.subject.trim()) nextErrors.subject = 'Vui lòng nhập tiêu đề email';
    if (!formData.body.trim()) nextErrors.body = 'Vui lòng nhập nội dung email';
    return nextErrors;
  };

  const handleSave = (event) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setMessage('Không thể lưu, vui lòng kiểm tra dữ liệu bắt buộc.');
      return;
    }

    const templateId = formData.id || mockStore.getNextEmailTemplateId();
    mockStore.saveEmailTemplate(templateId, {
      ...formData,
      id: templateId,
      code: formData.code.toUpperCase()
    });

    setFormData(prev => ({ ...prev, id: templateId, code: prev.code.toUpperCase() }));
    setMessage('Đã lưu email template thành công.');
  };

  const renderError = (field) => {
    if (!errors[field]) return null;
    return <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '6px' }}>{errors[field]}</p>;
  };

  return (
    <div className="contract-form-container">
      <div className="contract-form-header">
        <button className="btn-back" onClick={() => navigate('/email-templates')}>
          <ChevronLeft size={20} /> Quay lại danh sách
        </button>
        <div style={{ marginTop: '16px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 800 }}>Mẫu email</h1>
          <p style={{ color: '#64748b' }}>Soạn và cập nhật nội dung mẫu email.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="contract-form-content">
        <div className="form-main-section" style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label>Mã mẫu email *</label>
              <input className="input-modern" value={formData.code} onChange={(e) => updateField('code', e.target.value)} placeholder="Ví dụ: WELCOME_USER" />
              {renderError('code')}
            </div>

            <div className="form-group">
              <label>Tên mẫu email *</label>
              <input className="input-modern" value={formData.name} onChange={(e) => updateField('name', e.target.value)} placeholder="Nhập tên mẫu email" />
              {renderError('name')}
            </div>

            <div className="form-group">
              <label>Loại</label>
              <select className="select-modern" value={formData.category} onChange={(e) => updateField('category', e.target.value)}>
                <option value="system">Hệ thống</option>
                <option value="notification">Thông báo</option>
                <option value="marketing">Tiếp thị</option>
              </select>
            </div>

            <div className="form-group">
              <label>Trạng thái</label>
              <select className="select-modern" value={formData.status} onChange={(e) => updateField('status', e.target.value)}>
                <option value="active">Đang sử dụng</option>
                <option value="inactive">Tạm ngưng</option>
              </select>
            </div>

            <div className="form-group" style={{ gridColumn: '1 / span 2' }}>
              <label>Tiêu đề email *</label>
              <input className="input-modern" value={formData.subject} onChange={(e) => updateField('subject', e.target.value)} />
              {renderError('subject')}
            </div>

            <div className="form-group" style={{ gridColumn: '1 / span 2' }}>
              <label>Nội dung email *</label>
              <textarea className="input-modern" rows={14} value={formData.body} onChange={(e) => updateField('body', e.target.value)} />
              {renderError('body')}
            </div>
          </div>

          {message ? (
            <div style={{ marginTop: '16px', padding: '10px 12px', background: '#f8fafc', color: '#0f172a', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              {message}
            </div>
          ) : null}

          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn-create" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <Save size={16} /> Lưu mẫu email
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
