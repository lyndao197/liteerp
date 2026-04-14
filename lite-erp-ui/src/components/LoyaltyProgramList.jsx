import React, { useState } from 'react';
import { Search, Plus, Gift, Award, Users, Settings, Filter, Star } from 'lucide-react';
import { mockStore } from '../utils/mockStore';

export default function LoyaltyProgramList() {
  const [programs, setPrograms] = useState(() => mockStore.getAllLoyaltyPrograms());
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = programs.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="contract-page-container">
      <div className="contract-page-header">
        <div className="contract-header-left">
          <h1>Quản lý Loyalty</h1>
          <p className="contract-subtitle">Thiết lập các chương trình khách hàng thân thiết và tích lũy điểm thưởng.</p>
        </div>
        <div className="contract-header-right">
          <button className="btn-primary">
            <Plus size={18} /> Tạo chương trình mới
          </button>
        </div>
      </div>

      <div className="metric-cards-container">
        <div className="crm-metric-card" style={{ background: 'linear-gradient(135deg, #fff 0%, #fff7ed 100%)' }}>
          <p className="crm-card-title">Tổng thành viên</p>
          <div className="crm-card-body">
            <p className="crm-card-value">{programs.reduce((s, p) => s + p.members, 0).toLocaleString()}</p>
            <Users size={20} color="#f59e0b" style={{ marginLeft: 'auto' }} />
          </div>
        </div>
        <div className="crm-metric-card" style={{ background: 'linear-gradient(135deg, #fff 0%, #f0f9ff 100%)' }}>
          <p className="crm-card-title">Điểm đã quy đổi</p>
          <div className="crm-card-body">
            <p className="crm-card-value">25.4M</p>
            <Star size={20} color="#3b82f6" style={{ marginLeft: 'auto' }} />
          </div>
        </div>
        <div className="crm-metric-card" style={{ background: 'linear-gradient(135deg, #fff 0%, #f0fdf4 100%)' }}>
          <p className="crm-card-title">Chương trình chạy</p>
          <div className="crm-card-body">
            <p className="crm-card-value">{programs.filter(p => p.status === 'Active').length}</p>
            <Award size={20} color="#16a34a" style={{ marginLeft: 'auto' }} />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '24px', marginTop: '32px' }}>
        {filtered.map(p => (
          <div key={p.id} className="crm-metric-card" style={{ height: 'auto', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ padding: '10px', borderRadius: '12px', background: '#EE003310', color: '#EE0033' }}>
                <Gift size={24} />
              </div>
              <span className="status-badge-modern status-badge-green">{p.status}</span>
            </div>
            
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>{p.name}</h3>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px' }}>Loại hình: <strong>{p.type}</strong></p>
            
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Công thức tích điểm:</div>
              <div style={{ fontWeight: 600, color: '#0f172a' }}>{p.pointsFormula}</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontSize: '14px' }}>
                <Users size={16} /> <strong>{p.members.toLocaleString()}</strong> thành viên
              </div>
              <button className="btn-outline-brand" style={{ padding: '6px 12px', fontSize: '13px' }}>Cấu hình</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
