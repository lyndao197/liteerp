import React, { useMemo, useState } from 'react';
import { Plus, Search, Pencil, Trash2, X, Building2, ShieldCheck, History } from 'lucide-react';

const initialSegments = [
  { id: 'SEG-001', name: 'Diamond B2B', customerType: 'B2B', targetRole: 'CEO/CTO/CFO', minRevenue: '5,000,000,000', status: 'Active' },
  { id: 'SEG-002', name: 'Gold Enterprise', customerType: 'B2B', targetRole: 'Giám đốc vận hành', minRevenue: '2,000,000,000', status: 'Active' }
];

const initialPolicies = [
  { id: 'POL-001', segmentName: 'Diamond B2B', servicePolicy: 'Ưu tiên SLA 2h', discountPolicy: 'Giảm 12% phí dịch vụ', supportPolicy: 'AM riêng cấp cao' },
  { id: 'POL-002', segmentName: 'Gold Enterprise', servicePolicy: 'Ưu tiên SLA 4h', discountPolicy: 'Giảm 8% phí dịch vụ', supportPolicy: 'AM chuyên trách theo ngành' }
];

const initialCareHistory = [
  { id: 'CARE-001', customerName: 'Vinamilk', segmentName: 'Diamond B2B', careType: 'Họp chiến lược', owner: 'Trần B', careDate: '2026-04-15', result: 'Đề xuất mở rộng gói OmniX' },
  { id: 'CARE-002', customerName: 'MB Bank', segmentName: 'Gold Enterprise', careType: 'Khảo sát hài lòng', owner: 'Nguyễn Văn A', careDate: '2026-04-18', result: 'NPS 9/10' }
];

const modalTitles = {
  segment: { create: 'Thêm phân hạng khách hàng', edit: 'Cập nhật phân hạng khách hàng' },
  policy: { create: 'Thêm chính sách phân hạng', edit: 'Cập nhật chính sách phân hạng' },
  care: { create: 'Thêm lịch sử chăm sóc', edit: 'Cập nhật lịch sử chăm sóc' }
};

export default function LoyaltyProgramList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [segments, setSegments] = useState(initialSegments);
  const [policies, setPolicies] = useState(initialPolicies);
  const [careHistory, setCareHistory] = useState(initialCareHistory);

  const [modal, setModal] = useState({ open: false, type: 'segment', mode: 'create', id: null });
  const [formData, setFormData] = useState({});

  const filteredSegments = useMemo(
    () =>
      segments.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.targetRole.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.customerType.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [segments, searchTerm]
  );

  const filteredPolicies = useMemo(
    () =>
      policies.filter(
        (item) =>
          item.segmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.servicePolicy.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.discountPolicy.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [policies, searchTerm]
  );

  const filteredCareHistory = useMemo(
    () =>
      careHistory.filter(
        (item) =>
          item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.segmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.careType.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [careHistory, searchTerm]
  );

  const openCreateModal = (type) => {
    const baseByType = {
      segment: { name: '', customerType: 'B2B', targetRole: '', minRevenue: '', status: 'Active' },
      policy: { segmentName: segments[0]?.name || '', servicePolicy: '', discountPolicy: '', supportPolicy: '' },
      care: { customerName: '', segmentName: segments[0]?.name || '', careType: 'Gọi chăm sóc', owner: 'admin', careDate: new Date().toISOString().slice(0, 10), result: '' }
    };
    setFormData(baseByType[type]);
    setModal({ open: true, type, mode: 'create', id: null });
  };

  const openEditModal = (type, item) => {
    setFormData({ ...item });
    setModal({ open: true, type, mode: 'edit', id: item.id });
  };

  const nextId = (prefix, collection) => {
    let max = 0;
    collection.forEach((item) => {
      const n = parseInt(String(item.id).split('-')[1], 10);
      if (!Number.isNaN(n) && n > max) max = n;
    });
    return `${prefix}-${String(max + 1).padStart(3, '0')}`;
  };

  const submitModal = () => {
    const type = modal.type;
    if (type === 'segment') {
      if (!formData.name?.trim() || !formData.targetRole?.trim()) {
        alert('Vui lòng nhập tên phân hạng và vai trò mục tiêu.');
        return;
      }
      if (modal.mode === 'create') {
        setSegments((prev) => [...prev, { ...formData, id: nextId('SEG', prev) }]);
      } else {
        setSegments((prev) => prev.map((item) => (item.id === modal.id ? { ...item, ...formData } : item)));
      }
    }

    if (type === 'policy') {
      if (!formData.segmentName?.trim() || !formData.servicePolicy?.trim()) {
        alert('Vui lòng chọn phân hạng và nhập chính sách dịch vụ.');
        return;
      }
      if (modal.mode === 'create') {
        setPolicies((prev) => [...prev, { ...formData, id: nextId('POL', prev) }]);
      } else {
        setPolicies((prev) => prev.map((item) => (item.id === modal.id ? { ...item, ...formData } : item)));
      }
    }

    if (type === 'care') {
      if (!formData.customerName?.trim() || !formData.segmentName?.trim()) {
        alert('Vui lòng nhập tên khách hàng và phân hạng.');
        return;
      }
      if (modal.mode === 'create') {
        setCareHistory((prev) => [...prev, { ...formData, id: nextId('CARE', prev) }]);
      } else {
        setCareHistory((prev) => prev.map((item) => (item.id === modal.id ? { ...item, ...formData } : item)));
      }
    }

    setModal({ open: false, type: 'segment', mode: 'create', id: null });
    setFormData({});
  };

  const deleteItem = (type, id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bản ghi này?')) return;
    if (type === 'segment') setSegments((prev) => prev.filter((item) => item.id !== id));
    if (type === 'policy') setPolicies((prev) => prev.filter((item) => item.id !== id));
    if (type === 'care') setCareHistory((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="contract-page-container">
      <div className="contract-page-header">
        <div className="contract-header-left">
          <h1>Loyalty</h1>
          <p className="contract-subtitle">Phân hạng khách hàng doanh nghiệp, cấu hình chính sách và theo dõi lịch sử chăm sóc.</p>
        </div>
      </div>

      <div className="metric-cards-container">
        <div className="crm-metric-card" style={{ borderLeft: '4px solid #3b82f6' }}>
          <p className="crm-card-title">Phân hạng khách hàng</p>
          <div className="crm-card-body"><p className="crm-card-value">{segments.length}</p></div>
        </div>
        <div className="crm-metric-card" style={{ borderLeft: '4px solid #16a34a' }}>
          <p className="crm-card-title">Chính sách loyalty</p>
          <div className="crm-card-body"><p className="crm-card-value">{policies.length}</p></div>
        </div>
        <div className="crm-metric-card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <p className="crm-card-title">Lịch sử chăm sóc</p>
          <div className="crm-card-body"><p className="crm-card-value">{careHistory.length}</p></div>
        </div>
      </div>

      <div className="toolbar-row" style={{ marginTop: '20px' }}>
        <div className="toolbar-left">
          <div className="search-box-modern">
            <Search size={16} color="#94a3b8" />
            <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Tìm phân hạng, chính sách, lịch sử chăm sóc..." />
          </div>
        </div>
      </div>

      <div className="crm-metric-card" style={{ marginTop: '20px', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}><Building2 size={18} /> Phân hạng tập KH B2B/Lãnh đạo DN</h3>
          <button className="btn-primary" onClick={() => openCreateModal('segment')}><Plus size={16} /> Thêm phân hạng</button>
        </div>
        <div className="contract-table-wrapper">
          <table className="contract-table">
            <thead>
              <tr>
                <th>Mã</th><th>Tên phân hạng</th><th>Loại KH</th><th>Vai trò mục tiêu</th><th>Ngưỡng doanh thu</th><th>Trạng thái</th><th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredSegments.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td><td>{item.name}</td><td>{item.customerType}</td><td>{item.targetRole}</td><td>{item.minRevenue}</td><td>{item.status}</td>
                  <td>
                    <button onClick={() => openEditModal('segment', item)} style={{ border: 'none', background: 'transparent', color: '#2563eb', cursor: 'pointer' }}><Pencil size={15} /></button>
                    <button onClick={() => deleteItem('segment', item.id)} style={{ border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={15} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="crm-metric-card" style={{ marginTop: '16px', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}><ShieldCheck size={18} /> Cấu hình chính sách theo phân hạng</h3>
          <button className="btn-primary" onClick={() => openCreateModal('policy')}><Plus size={16} /> Thêm chính sách</button>
        </div>
        <div className="contract-table-wrapper">
          <table className="contract-table">
            <thead>
              <tr>
                <th>Mã</th><th>Phân hạng</th><th>Chính sách dịch vụ</th><th>Chính sách ưu đãi</th><th>Chính sách chăm sóc</th><th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredPolicies.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td><td>{item.segmentName}</td><td>{item.servicePolicy}</td><td>{item.discountPolicy}</td><td>{item.supportPolicy}</td>
                  <td>
                    <button onClick={() => openEditModal('policy', item)} style={{ border: 'none', background: 'transparent', color: '#2563eb', cursor: 'pointer' }}><Pencil size={15} /></button>
                    <button onClick={() => deleteItem('policy', item.id)} style={{ border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={15} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="crm-metric-card" style={{ marginTop: '16px', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}><History size={18} /> Tra cứu lịch sử chăm sóc KH</h3>
          <button className="btn-primary" onClick={() => openCreateModal('care')}><Plus size={16} /> Thêm lịch sử chăm sóc</button>
        </div>
        <div className="contract-table-wrapper">
          <table className="contract-table">
            <thead>
              <tr>
                <th>Mã</th><th>Khách hàng</th><th>Phân hạng</th><th>Loại chăm sóc</th><th>Ngày chăm sóc</th><th>Chủ trì</th><th>Kết quả</th><th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredCareHistory.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td><td>{item.customerName}</td><td>{item.segmentName}</td><td>{item.careType}</td><td>{item.careDate}</td><td>{item.owner}</td><td>{item.result}</td>
                  <td>
                    <button onClick={() => openEditModal('care', item)} style={{ border: 'none', background: 'transparent', color: '#2563eb', cursor: 'pointer' }}><Pencil size={15} /></button>
                    <button onClick={() => deleteItem('care', item.id)} style={{ border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={15} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal.open && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
          <div style={{ width: '620px', maxWidth: '94vw', background: 'white', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderBottom: '1px solid #e2e8f0' }}>
              <h3 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>{modalTitles[modal.type][modal.mode]}</h3>
              <button onClick={() => setModal({ open: false, type: 'segment', mode: 'create', id: null })} style={{ border: 'none', background: 'transparent', color: '#64748b', cursor: 'pointer' }}><X size={18} /></button>
            </div>

            <div style={{ padding: '16px', display: 'grid', gap: '12px' }}>
              {modal.type === 'segment' && (
                <>
                  <input className="form-control" placeholder="Tên phân hạng" value={formData.name || ''} onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))} />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <select className="form-control" value={formData.customerType || 'B2B'} onChange={(e) => setFormData((prev) => ({ ...prev, customerType: e.target.value }))}>
                      <option value="B2B">B2B</option>
                      <option value="Lãnh đạo doanh nghiệp">Lãnh đạo doanh nghiệp</option>
                    </select>
                    <select className="form-control" value={formData.status || 'Active'} onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                  <input className="form-control" placeholder="Vai trò mục tiêu (CEO/CTO/CFO...)" value={formData.targetRole || ''} onChange={(e) => setFormData((prev) => ({ ...prev, targetRole: e.target.value }))} />
                  <input className="form-control" placeholder="Ngưỡng doanh thu tối thiểu" value={formData.minRevenue || ''} onChange={(e) => setFormData((prev) => ({ ...prev, minRevenue: e.target.value }))} />
                </>
              )}

              {modal.type === 'policy' && (
                <>
                  <select className="form-control" value={formData.segmentName || ''} onChange={(e) => setFormData((prev) => ({ ...prev, segmentName: e.target.value }))}>
                    {segments.map((item) => (
                      <option key={item.id} value={item.name}>{item.name}</option>
                    ))}
                  </select>
                  <input className="form-control" placeholder="Chính sách dịch vụ" value={formData.servicePolicy || ''} onChange={(e) => setFormData((prev) => ({ ...prev, servicePolicy: e.target.value }))} />
                  <input className="form-control" placeholder="Chính sách ưu đãi" value={formData.discountPolicy || ''} onChange={(e) => setFormData((prev) => ({ ...prev, discountPolicy: e.target.value }))} />
                  <input className="form-control" placeholder="Chính sách chăm sóc" value={formData.supportPolicy || ''} onChange={(e) => setFormData((prev) => ({ ...prev, supportPolicy: e.target.value }))} />
                </>
              )}

              {modal.type === 'care' && (
                <>
                  <input className="form-control" placeholder="Tên khách hàng" value={formData.customerName || ''} onChange={(e) => setFormData((prev) => ({ ...prev, customerName: e.target.value }))} />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <select className="form-control" value={formData.segmentName || ''} onChange={(e) => setFormData((prev) => ({ ...prev, segmentName: e.target.value }))}>
                      {segments.map((item) => (
                        <option key={item.id} value={item.name}>{item.name}</option>
                      ))}
                    </select>
                    <select className="form-control" value={formData.careType || 'Gọi chăm sóc'} onChange={(e) => setFormData((prev) => ({ ...prev, careType: e.target.value }))}>
                      <option value="Gọi chăm sóc">Gọi chăm sóc</option>
                      <option value="Gặp trực tiếp">Gặp trực tiếp</option>
                      <option value="Khảo sát hài lòng">Khảo sát hài lòng</option>
                      <option value="Họp chiến lược">Họp chiến lược</option>
                    </select>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <input className="form-control" type="date" value={formData.careDate || ''} onChange={(e) => setFormData((prev) => ({ ...prev, careDate: e.target.value }))} />
                    <input className="form-control" placeholder="Chủ trì chăm sóc" value={formData.owner || ''} onChange={(e) => setFormData((prev) => ({ ...prev, owner: e.target.value }))} />
                  </div>
                  <input className="form-control" placeholder="Kết quả chăm sóc" value={formData.result || ''} onChange={(e) => setFormData((prev) => ({ ...prev, result: e.target.value }))} />
                </>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', padding: '14px 16px', borderTop: '1px solid #e2e8f0' }}>
              <button className="btn btn-secondary" onClick={() => setModal({ open: false, type: 'segment', mode: 'create', id: null })}>Hủy</button>
              <button className="btn btn-primary" onClick={submitModal}>Lưu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
