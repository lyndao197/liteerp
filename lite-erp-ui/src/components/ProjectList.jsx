import React, { useState, useEffect } from 'react';
import { Search, Plus, MoreVertical, LayoutDashboard, ListTodo, Users, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockStore } from '../utils/mockStore';

export default function ProjectList() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState(() => mockStore.getAllProjects());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');

  useEffect(() => {
    mockStore.syncProjectsFromActiveContracts();
    setProjects(mockStore.getAllProjects());
  }, []);

  const refreshProjects = () => {
    setProjects(mockStore.getAllProjects());
  };

  const handleSyncFromContracts = () => {
    const createdCount = mockStore.syncProjectsFromActiveContracts();
    refreshProjects();
    window.alert(createdCount > 0 ? `Đã tạo tự động ${createdCount} dự án từ hợp đồng hiệu lực.` : 'Không có dự án mới cần tạo.');
  };

  const filtered = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || p.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Triển khai nghiệp vụ theo Hợp đồng': return { color: '#3b82f6', bg: '#eff6ff' };
      case 'Thống nhất số liệu nghiệm thu': return { color: '#8b5cf6', bg: '#f5f3ff' };
      case 'Ký Biên bản nghiệm thu': return { color: '#10b981', bg: '#ecfdf5' };
      case 'Thu hồi công nợ': return { color: '#f59e0b', bg: '#fffbeb' };
      case 'Thanh lý Hợp đồng': return { color: '#64748b', bg: '#f1f5f9' };
      default: return { color: '#64748b', bg: '#f1f5f9' };
    }
  };

  return (
    <div className="contract-page-container" style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '40px' }}>
      <div className="contract-page-header">
        <div className="contract-header-left">
          <h1>Quản trị triển khai dự án</h1>
          <p className="contract-subtitle">Xem danh sách/chi tiết dự án, tự động tạo dự án & công việc từ hợp đồng đã ký.</p>
        </div>
        <div className="contract-header-right">
          <button className="btn-primary" onClick={handleSyncFromContracts} style={{ background: '#e32b4c', border: 'none', padding: '10px 16px', borderRadius: '8px', color: 'white', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <Plus size={18} /> Đồng bộ dự án từ HĐ hiệu lực
          </button>
        </div>
      </div>

      <div className="metrics-cards-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '24px' }}>
        <div className="metric-card" style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
           <div style={{ fontSize: '13px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '12px' }}>Tổng dự án triển khai</div>
           <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '28px', fontWeight: 800, color: '#1e293b' }}>
                {projects.filter(p => !['Thanh lý Hợp đồng'].includes(p.status)).length}
              </span>
              <span style={{ background: '#ecfdf5', color: '#10b981', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 700 }}>+5.2%</span>
           </div>
        </div>
        <div className="metric-card" style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
           <div style={{ fontSize: '13px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '12px' }}>Tổng dự án thanh lý</div>
           <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '28px', fontWeight: 800, color: '#1e293b' }}>
                {projects.filter(p => p.status === 'Thanh lý Hợp đồng').length}
              </span>
              <span style={{ background: '#ecfdf5', color: '#10b981', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 700 }}>+12%</span>
           </div>
        </div>
        <div className="metric-card" style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
           <div style={{ fontSize: '13px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '12px' }}>Tổng dự án đang nghiệm thu</div>
           <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '28px', fontWeight: 800, color: '#1e293b' }}>
                {projects.filter(p => ['Thống nhất số liệu nghiệm thu', 'Ký Biên bản nghiệm thu'].includes(p.status)).length}
              </span>
              <span style={{ background: '#fff1f2', color: '#e11d48', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 700 }}>-2.1%</span>
           </div>
        </div>
      </div>

      <div className="toolbar-row" style={{ marginTop: '24px' }}>
         <div className="toolbar-left" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div className="search-box-modern">
               <Search size={16} color="#94a3b8" />
               <input type="text" placeholder="Tìm tên dự án, khách hàng..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            
            <select 
              value={selectedStatus} 
              onChange={e => setSelectedStatus(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', color: '#475569', fontSize: '14px', outline: 'none', cursor: 'pointer' }}
            >
              <option value="All">Tất cả trạng thái</option>
              <option value="Triển khai nghiệp vụ theo Hợp đồng">1. Triển khai theo HĐ</option>
              <option value="Thống nhất số liệu nghiệm thu">2. Thống nhất nghiệm thu</option>
              <option value="Ký Biên bản nghiệm thu">3. Ký BB nghiệm thu</option>
              <option value="Thu hồi công nợ">4. Thu hồi công nợ</option>
              <option value="Thanh lý Hợp đồng">5. Thanh lý Hợp đồng</option>
            </select>

            <div style={{ display: 'flex', gap: '8px' }}>
               <button className="btn-outline-brand" onClick={() => setSelectedStatus('All')} style={{ padding: '6px 12px', fontSize: '13px', background: selectedStatus === 'All' ? '#f1f5f9' : 'white' }}>Tất cả</button>
            </div>
         </div>
      </div>

      <div className="list-view-container" style={{ marginTop: '24px', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '12px 20px', fontWeight: 700, color: '#475569' }}>Dự án</th>
              <th style={{ padding: '12px 20px', fontWeight: 700, color: '#475569' }}>Số hợp đồng</th>
              <th style={{ padding: '12px 20px', fontWeight: 700, color: '#475569' }}>Khách hàng</th>
              <th style={{ padding: '12px 20px', fontWeight: 700, color: '#475569' }}>Tiến độ task</th>
              <th style={{ padding: '12px 20px', fontWeight: 700, color: '#475569' }}>Hạn chót</th>
              <th style={{ padding: '12px 20px', fontWeight: 700, color: '#475569' }}>Người phụ trách</th>
              <th style={{ padding: '12px 20px', fontWeight: 700, color: '#475569' }}>Trạng thái triển khai</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => {
              const style = getStatusStyle(p.status);
              const progress = Math.round((p.completed / p.tasks) * 100);
              const contract = p.contractId ? mockStore.getContract(p.contractId) : null;
              
              return (
                <tr key={p.id} onClick={() => navigate(`/projects/${p.id}`)} style={{ borderBottom: '1px solid #e2e8f0', cursor: 'pointer', transition: 'background 0.2s' }} 
                    onMouseOver={e => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                    onMouseOut={e => e.currentTarget.style.backgroundColor = 'white'}>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ fontWeight: 700, color: '#1e293b' }}>{p.name}</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>#{p.id}</div>
                  </td>
                  <td style={{ padding: '16px 20px', color: '#475569', fontWeight: 600 }}>
                    {contract?.contractNo || '-'}
                  </td>
                  <td style={{ padding: '16px 20px', color: '#475569' }}>{p.customer}</td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                       <span style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>{progress}%</span>
                       <span style={{ fontSize: '11px', color: '#64748b' }}>({p.completed}/{p.tasks} task)</span>
                    </div>
                    <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '3px', width: '120px', overflow: 'hidden' }}>
                       <div style={{ height: '100%', width: `${progress}%`, background: style.color }}></div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px', color: '#475569' }}>{p.deadline}</td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                       <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700 }}>{p.manager.charAt(0)}</div>
                       <span>{p.manager}</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{ 
                      backgroundColor: style.bg, 
                      color: style.color, 
                      padding: '4px 12px', 
                      borderRadius: '999px', 
                      fontSize: '12px', 
                      fontWeight: 600,
                      border: `1px solid ${style.color}20`
                    }}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>Không tìm thấy dự án nào</div>
        )}
      </div>
    </div>
  );
}
