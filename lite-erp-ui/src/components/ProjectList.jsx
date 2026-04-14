import React, { useState } from 'react';
import { Search, Plus, MoreVertical, LayoutDashboard, ListTodo, Users, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockStore } from '../utils/mockStore';

export default function ProjectList() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState(() => mockStore.getAllProjects());
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = projects.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.customer.toLowerCase().includes(searchTerm.toLowerCase()));

  const getStatusStyle = (status) => {
    switch (status) {
      case 'On Track': return { color: '#16a34a', bg: '#f0fdf4' };
      case 'At Risk': return { color: '#f59e0b', bg: '#fffbeb' };
      case 'Off Track': return { color: '#ef4444', bg: '#fef2f2' };
      default: return { color: '#64748b', bg: '#f1f5f9' };
    }
  };

  return (
    <div className="contract-page-container" style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '40px' }}>
      <div className="contract-page-header">
        <div className="contract-header-left">
          <h1>Dự án triển khai</h1>
          <p className="contract-subtitle">Theo dõi tiến độ, nhiệm vụ và nguồn lực dự án theo phong cách Odoo.</p>
        </div>
        <div className="contract-header-right">
          <button className="btn-primary">
            <Plus size={18} /> Tạo dự án mới
          </button>
        </div>
      </div>

      <div className="toolbar-row" style={{ marginTop: '24px' }}>
         <div className="toolbar-left">
            <div className="search-box-modern">
               <Search size={16} color="#94a3b8" />
               <input type="text" placeholder="Tìm tên dự án, khách hàng..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: '8px', marginLeft: '16px' }}>
               <button className="btn-outline-brand" style={{ padding: '6px 12px', fontSize: '13px' }}>Tất cả</button>
               <button className="btn-outline-brand" style={{ padding: '6px 12px', fontSize: '13px', borderColor: '#e2e8f0', color: '#64748b' }}>Của tôi</button>
            </div>
         </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px', marginTop: '24px' }}>
        {filtered.map(p => {
          const style = getStatusStyle(p.status);
          const progress = Math.round((p.completed / p.tasks) * 100);
          
          return (
            <div key={p.id} className="crm-metric-card" style={{ height: 'auto', padding: '0', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s', border: '1px solid #e2e8f0' }} 
                 onClick={() => navigate(`/projects/${p.id}`)}>
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b' }}>{p.name}</h3>
                  <MoreVertical size={16} color="#94a3b8" />
                </div>
                <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>{p.customer}</div>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#475569' }}>
                      <ListTodo size={14} color="#3b82f6" />
                      <strong>{p.completed}/{p.tasks}</strong> nhiệm vụ
                   </div>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#475569' }}>
                      <Clock size={14} color="#f59e0b" />
                      {p.deadline}
                   </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: style.color }}></div>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: style.color }}>{p.status}</span>
                   </div>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '-8px' }}>
                      <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#ffcc66', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700 }}>{p.manager.charAt(0)}</div>
                   </div>
                </div>
              </div>

              {/* Progress bar at bottom */}
              <div style={{ height: '4px', background: '#f1f5f9', width: '100%' }}>
                 <div style={{ height: '100%', width: `${progress}%`, background: style.color, transition: 'width 0.3s' }}></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
