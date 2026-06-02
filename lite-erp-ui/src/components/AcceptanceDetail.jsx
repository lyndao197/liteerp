import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Plus, 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Edit3, 
  Trash2,
  HelpCircle,
  TrendingUp,
  SlidersHorizontal,
  Building
} from 'lucide-react';
import { mockStore } from '../utils/mockStore';
import './CustomerList.css';
import './AcceptanceManagement.css';

const AcceptanceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [contract, setContract] = useState(null);
  const [phases, setPhases] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState(null);

  // Load contract and its phases
  const loadData = () => {
    const store = mockStore.getStore();
    const rawContract = store.contracts[id];
    if (rawContract) {
      // Map name/contractNo same as AcceptanceManagement list
      let contractNo = rawContract.contractNo || '';
      if (contractNo.startsWith('HD-') || contractNo.startsWith('HD/')) {
        contractNo = contractNo.replace('HD-', 'NT-').replace('HD/', 'NT/');
      } else {
        contractNo = 'NT-2026-' + id.split('-').pop();
      }

      let name = rawContract.name || '';
      if (name.includes('Hợp đồng')) {
        name = name.replace(/Hợp đồng/g, 'Nghiệm thu');
      } else if (name.includes('Dự án')) {
        name = name.replace(/Dự án/g, 'Nghiệm thu dự án');
      } else {
        name = 'Nghiệm thu ' + name;
      }

      setContract({
        ...rawContract,
        contractNo,
        name
      });
    }

    const phaseList = mockStore.getAcceptancePhases(id);
    setPhases(phaseList || []);
  };

  useEffect(() => {
    loadData();
  }, [id]);

  // Recalculate status counts
  const statusStats = useMemo(() => {
    const draft = phases.filter(p => p.status === 'Bản nháp').length;
    const pending = phases.filter(p => p.status === 'Trình ký').length;
    const effective = phases.filter(p => p.status === 'Hiệu lực').length;
    return { draft, pending, effective };
  }, [phases]);

  const handleOpenCreateModal = () => {
    navigate(`/acceptances/${id}/phase/new`);
  };

  const handleOpenEditModal = (e, phase) => {
    e.stopPropagation();
    navigate(`/acceptances/${id}/phase/edit/${phase.id}`);
  };

  const handleDeletePhase = (e, phaseId) => {
    e.stopPropagation();
    if (window.confirm('Bạn có chắc chắn muốn xóa đợt nghiệm thu này không?')) {
      mockStore.deleteAcceptancePhase(phaseId);
      loadData();
    }
  };

  const handleFormSubmit = (data) => {
    if (selectedPhase) {
      // Edit
      mockStore.updateAcceptancePhase(selectedPhase.id, data);
    } else {
      // Create
      mockStore.createAcceptancePhase(id, data);
    }
    loadData();
  };

  if (!contract) {
    return (
      <div style={{ padding: '48px', textAlign: 'center', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <AlertCircle style={{ margin: '0 auto 16px', color: '#94a3b8' }} size={48} />
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b' }}>Không tìm thấy Hồ sơ Nghiệm thu</h3>
        <button onClick={() => navigate('/acceptances')} style={{ marginTop: '16px', padding: '8px 16px', backgroundColor: '#e11d48', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
          Quay lại danh sách
        </button>
      </div>
    );
  }

  return (
    <div className="contract-page-container" style={{ padding: '24px', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '20px', minHeight: '100vh' }}>
      
      {/* Top Navigation Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: '16px 24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button 
            onClick={() => navigate('/acceptances')}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded-lg text-xs font-semibold transition-all"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', border: '1px solid #e2e8f0', backgroundColor: 'white', borderRadius: '8px', color: '#475569', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
          >
            <ChevronLeft size={14} />
            <span>Quay lại Lập hồ sơ Cha</span>
          </button>
          <div style={{ width: '1px', height: '24px', backgroundColor: '#e2e8f0' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ padding: '4px 10px', backgroundColor: '#fff1f2', color: '#e11d48', border: '1px solid #ffe4e6', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', fontFamily: 'monospace' }}>
              {contract.contractNo}
            </span>
            <span style={{ color: '#cbd5e1' }}>|</span>
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#475569' }}>Tháng 05/2026</span>
          </div>
        </div>

        <button 
          onClick={handleOpenCreateModal}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: '#ed0029', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '13px', boxShadow: '0 4px 6px -1px rgba(237, 0, 41, 0.2)' }}
        >
          <Plus size={16} />
          <span>Khởi Tạo Đợt Nghiệm Thu Mới</span>
        </button>
      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '20px' }}>
        
        {/* Left Column: General contract info */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
          <div>
            <div style={{ padding: '20px', borderBottom: '1px solid #f1f5f9', backgroundColor: '#f8fafc', borderTopLeftRadius: '12px', borderTopRightRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Building size={18} style={{ color: '#ed0029' }} />
              <div>
                <span style={{ fontSize: '9px', textTransform: 'uppercase', fontWeight: 'bold', color: '#94a3b8', letterSpacing: '0.05em' }}>Hồ sơ thông tin gốc:</span>
                <h3 style={{ fontSize: '13px', fontWeight: 'bold', color: '#1e293b', marginTop: '2px', lineHeight: '1.4' }}>
                  Nghiệm thu khối lượng
                </h3>
              </div>
            </div>

            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '2px' }}>Doanh nghiệp Đối tác</span>
                <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#1e293b', lineHeight: '1.4', display: 'block' }}>{contract.customerName}</span>
              </div>

              <div>
                <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '2px' }}>Hợp đồng gốc</span>
                <span style={{ fontSize: '13px', fontWeight: '500', color: '#334155', lineHeight: '1.4', display: 'block' }}>{contract.name}</span>
                <span style={{ display: 'inline-block', marginTop: '6px', padding: '2px 8px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', color: '#64748b', fontSize: '11px', borderRadius: '4px', fontFamily: 'monospace' }}>
                  Mã HĐ: {contract.id}
                </span>
              </div>
            </div>
          </div>

          <div style={{ padding: '12px 20px', backgroundColor: '#f8fafc', borderTop: '1px solid #f1f5f9', borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#64748b' }}>
            <span>Ngày lập hồ sơ:</span>
            <span style={{ fontWeight: 'bold', color: '#334155' }}>2/6/2026</span>
          </div>
        </div>

        {/* Right Column: Total KPIs & Summary cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {/* KPI 1 */}
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '120px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', right: '-8px', bottom: '-8px', opacity: 0.03, color: '#ed0029' }}>
                <TrendingUp size={72} />
              </div>
              <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', tracking: '0.05em' }}>Lũy kế khối lượng đợt</span>
              <div style={{ marginTop: '8px' }}>
                <span style={{ fontSize: '22px', fontWeight: '800', color: '#1e293b' }}>{contract.cumulativeValue || '0'}</span>
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b', marginLeft: '2px' }}>₫</span>
              </div>
              <span style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px', display: 'block' }}>Cộng gộp từ {phases.length} đợt nghiệm thu</span>
            </div>

            {/* KPI 2 */}
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '120px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', right: '-8px', bottom: '-8px', opacity: 0.03, color: '#ed0029' }}>
                <AlertCircle size={72} />
              </div>
              <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', tracking: '0.05em' }}>Tổng trừ phạt SLA</span>
              <div style={{ marginTop: '8px' }}>
                <span style={{ fontSize: '22px', fontWeight: '800', color: '#e11d48' }}>{contract.totalPenalty || '0'}</span>
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#e11d48', marginLeft: '2px' }}>₫</span>
              </div>
              <span style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px', display: 'block' }}>Khấu trừ lỗi chất lượng KPI</span>
            </div>

            {/* KPI 3 */}
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '120px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', right: '-8px', bottom: '-8px', opacity: 0.03, color: '#ed0029' }}>
                <FileText size={72} />
              </div>
              <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', tracking: '0.05em' }}>Lượng thực nhận tổng</span>
              <div style={{ marginTop: '8px' }}>
                <span style={{ fontSize: '22px', fontWeight: '800', color: '#10b981' }}>{contract.netTotal || '0'}</span>
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#10b981', marginLeft: '2px' }}>₫</span>
              </div>
              <span style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px', display: 'block' }}>{statusStats.effective} đợt đã có hiệu lực VAT</span>
            </div>
          </div>

          {/* Status Indicators Bar */}
          <div style={{ backgroundColor: 'white', padding: '12px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '500', color: '#475569' }}>
              <SlidersHorizontal size={14} style={{ color: '#94a3b8' }} />
              <span>Tình trạng thi công và trình duyệt các đợt:</span>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', backgroundColor: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold' }}>
                <CheckCircle2 size={12} />
                <span>{statusStats.effective} Hiệu lực</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', backgroundColor: '#fffbeb', color: '#b45309', border: '1px solid #fde68a', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold' }}>
                <Clock size={12} />
                <span>{statusStats.pending} Trình ký</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold' }}>
                <FileText size={12} />
                <span>{statusStats.draft} Bản nháp</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Guidelines Block */}
      <div style={{ backgroundColor: '#fff1f2', padding: '16px 20px', borderRadius: '12px', border: '1px solid #ffe4e6', display: 'flex', gap: '12px', fontSize: '13px' }}>
        <HelpCircle style={{ color: '#ed0029', shrink: 0, marginTop: '2px' }} size={16} />
        <div>
          <strong style={{ color: '#9f1239' }}>Hướng dẫn quy trình:</strong>
          <p style={{ color: '#4c0519', marginTop: '4px', lineHeight: '1.5' }}>
            Nhấp <strong>Khởi Tạo Đợt Nghiệm Thu Mới</strong> hoặc chỉnh sửa đợt có sẵn để nộp hồ sơ qua 3 bước chuẩn nghiệp vụ:
            1. Khối lượng nghiệm thu $\rightarrow$ 2. Khấu trừ phạt SLA $\rightarrow$ 3. Chọn trạng thái trình duyệt.
          </p>
        </div>
      </div>

      {/* Child Phases List Block */}
      <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)', overflow: 'hidden' }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#1e293b' }}>
            Danh sách Đợt Nghiệm Thu nhỏ ({phases.length})
          </h3>
          <span style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }}>Nhấp chỉnh sửa để nộp hồ sơ 3 bước</span>
        </div>

        {phases.length === 0 ? (
          <div style={{ padding: '64px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '16px' }}>
            <FileText style={{ color: '#cbd5e1', strokeWidth: '1.2' }} size={56} />
            <h4 style={{ fontSize: '15px', fontWeight: 'bold', color: '#1e293b' }}>Chưa có Đợt Nghiệm Thu nào</h4>
            <p style={{ fontSize: '13px', color: '#64748b', maxWidth: '360px', lineHeight: '1.6' }}>
              Sổ cái lần nghiệm thu này đang trống. Hãy khởi tạo đợt nghiệm thu giai đoạn đầu tiên để bắt đầu tải lên khối lượng và trình ký.
            </p>
            <button 
              onClick={handleOpenCreateModal}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', backgroundColor: '#ed0029', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '13px', boxShadow: '0 2px 4px rgba(237,0,41,0.15)' }}
            >
              <Plus size={14} />
              <span>Khởi tạo đợt nghiệm thu đầu tiên</span>
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px', color: '#475569' }}>
              <thead style={{ backgroundColor: '#f8fafc', fontSize: '11px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', borderBottom: '1px solid #e2e8f0' }}>
                <tr>
                  <th style={{ padding: '12px 24px' }}>Mã đợt</th>
                  <th style={{ padding: '12px 24px' }}>Tên đợt nghiệm thu con</th>
                  <th style={{ padding: '12px 24px' }}>Khối lượng (VNĐ)</th>
                  <th style={{ padding: '12px 24px' }}>Khấu trừ SLA (VNĐ)</th>
                  <th style={{ padding: '12px 24px' }}>Thực nhận (VNĐ)</th>
                  <th style={{ padding: '12px 24px' }}>Trạng thái</th>
                  <th style={{ padding: '12px 24px', textAlign: 'right' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody style={{ divideY: '1px solid #f1f5f9' }}>
                {phases.map((phase, idx) => {
                  const val = parseFloat(String(phase.value || '0').replace(/[^0-9.-]/g, ''));
                  const pen = parseFloat(String(phase.penalty || '0').replace(/[^0-9.-]/g, ''));
                  const net = val - pen;

                  let statusBadge = 'background-color: #f1f5f9; color: #475569; border-color: #cbd5e1';
                  if (phase.status === 'Hiệu lực') statusBadge = 'background-color: #ecfdf5; color: #047857; border-color: #a7f3d0';
                  else if (phase.status === 'Trình ký') statusBadge = 'background-color: #fffbeb; color: #b45309; border-color: #fde68a';

                  return (
                    <tr key={phase.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.15s' }} className="hover:bg-slate-50">
                      <td style={{ padding: '14px 24px', fontFamily: 'monospace', fontSize: '11px', fontWeight: 'bold', color: '#1e293b' }}>{phase.id.split('-').pop().substring(0, 6)}</td>
                      <td style={{ padding: '14px 24px' }}>
                        <span style={{ fontWeight: 'bold', color: '#1e293b', display: 'block' }}>{phase.name}</span>
                        {phase.notes && <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginTop: '2px' }}>{phase.notes}</span>}
                      </td>
                      <td style={{ padding: '14px 24px', fontWeight: 'bold', color: '#1e293b' }}>{phase.value}</td>
                      <td style={{ padding: '14px 24px', fontWeight: 'semibold', color: '#e11d48' }}>-{phase.penalty || '0'}</td>
                      <td style={{ padding: '14px 24px', fontWeight: 'bold', color: '#10b981' }}>
                        {new Intl.NumberFormat('en-US').format(net)}
                      </td>
                      <td style={{ padding: '14px 24px' }}>
                        <span style={{ display: 'inline-flex', padding: '2px 8px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold' }} className={phase.status === 'Hiệu lực' ? 'status-badge-green' : phase.status === 'Trình ký' ? 'status-badge-yellow' : 'status-badge-gray'}>
                          {phase.status}
                        </span>
                      </td>
                      <td style={{ padding: '14px 24px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button 
                            onClick={(e) => handleOpenEditModal(e, phase)}
                            style={{ padding: '6px', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', borderRadius: '4px' }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#ed0029'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
                            title="Sửa đợt"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button 
                            onClick={(e) => handleDeletePhase(e, phase.id)}
                            style={{ padding: '6px', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', borderRadius: '4px' }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#ed0029'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
                            title="Xóa đợt"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>


    </div>
  );
};

export default AcceptanceDetail;
