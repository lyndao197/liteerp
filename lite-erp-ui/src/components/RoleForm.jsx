import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, ChevronDown, ChevronUp, Save, Shield, List, CheckCircle2, AlertCircle } from 'lucide-react';
import { mockStore } from '../utils/mockStore';

export default function RoleForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    status: 'Active',
    permissions: []
  });
  const [expandedGroups, setExpandedGroups] = useState({});

  const PERMISSION_GROUPS = [
    {
      name: 'Quản lý Lead & CHBH',
      keys: [
        'lead_create',
        'lead_edit',
        'lead_search',
        'lead_detail',
        'lead_export',
        'lead_delete',
        'lead_mark_failed'
      ]
    },
    {
      name: 'Quản lý Khách hàng',
      keys: [
        'customer_create',
        'customer_edit',
        'customer_detail',
        'customer_view',
        'customer_export'
      ]
    },
    {
      name: 'To do list',
      keys: [
        'task_create',
        'task_edit',
        'task_delete',
        'task_view',
        'task_detail',
        'task_export'
      ]
    },
    {
      name: 'Quản lý mục tiêu',
      keys: [
        'goal_plan_create',
        'goal_plan_edit',
        'goal_plan_delete',
        'goal_plan_view',
        'goal_plan_detail',
        'goal_plan_export',
        'goal_result_create',
        'goal_result_export'
      ]
    },
    {
      name: 'Quản lý Hợp đồng',
      keys: [
        'contract_create',
        'contract_delete_draft',
        'contract_edit',
        'contract_approve',
        'contract_confirm',
        'contract_cancel',
        'contract_view',
        'contract_detail',
        'contract_create_appendix',
        'contract_pdf_generate',
        'contract_export',
        'contract_share',
        'contract_send_customer_confirmation',
        'contract_sign'
      ]
    },
    {
      name: 'Nghiệm thu đầu ra',
      keys: [
        'acceptance_create',
        'acceptance_edit',
        'acceptance_view',
        'acceptance_detail',
        'acceptance_export',
        'acceptance_template_detail',
        'acceptance_report_edit'
      ]
    },
    {
      name: 'Thanh lý Hợp Đồng',
      keys: [
        'liquidation_create',
        'liquidation_edit',
        'liquidation_cancel',
        'liquidation_approve',
        'liquidation_reject_approval',
        'liquidation_generate_report',
        'liquidation_sign',
        'liquidation_export'
      ]
    },
    {
      name: 'Báo cáo',
      keys: [
        'report_create',
        'report_view',
        'report_export'
      ]
    }
  ];

  useEffect(() => {
    if (isEdit) {
      const role = mockStore.getRole(id);
      if (role) setFormData({ ...role, permissions: role.permissions || [] });
    } else {
      setFormData(prev => ({ ...prev, id: mockStore.getNextRoleId() }));
    }
  }, [id, isEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    mockStore.saveRole(formData.id, formData);
    navigate('/roles');
  };

  const togglePermission = (key) => {
    const newPerms = formData.permissions.includes(key)
      ? formData.permissions.filter(k => k !== key)
      : [...formData.permissions, key];
    setFormData({ ...formData, permissions: newPerms });
  };

  const permissionLabels = {
    lead_create: 'Tạo lead',
    lead_edit: 'Chỉnh sửa lead',
    lead_search: 'Xem danh sách/Tìm kiếm/Lọc lead',
    lead_detail: 'Xem chi tiết lead',
    lead_export: 'Export danh sách lead',
    lead_delete: 'Xóa LEAD',
    lead_mark_failed: 'Không thành công Lead',

    customer_create: 'Tạo mới hồ sơ khách hàng',
    customer_edit: 'Chỉnh sửa hồ sơ khách hàng',
    customer_detail: 'Xem chi tiết hồ sơ khách hàng',
    customer_view: 'Xem danh sách/Tìm kiếm',
    customer_export: 'Export danh sách khách hàng',

    task_create: 'Thêm mới công việc',
    task_edit: 'Chỉnh sửa công việc',
    task_delete: 'Xóa công việc',
    task_view: 'Xem danh sách công việc',
    task_detail: 'Xem chi tiết công việc',
    task_export: 'Export danh sách công việc',

    goal_plan_create: 'Thêm mới kế hoạch',
    goal_plan_edit: 'Chỉnh sửa kế hoạch',
    goal_plan_delete: 'Xóa kế hoạch',
    goal_plan_view: 'Xem danh sách/lọc/tìm kiếm kế hoạch',
    goal_plan_detail: 'Xem chi tiết kế hoạch',
    goal_plan_export: 'Export danh sách kế hoạch',
    goal_result_create: 'Tạo kết quả',
    goal_result_export: 'Export kết quả mục tiêu',

    contract_create: 'Tạo hợp đồng + Tạo phụ lục',
    contract_delete_draft: 'Xóa HĐ',
    contract_edit: 'Chỉnh sửa hợp đồng',
    contract_approve: 'Phê duyệt hợp đồng',
    contract_confirm: 'Xác nhận Hợp đồng',
    contract_cancel: 'Hủy hợp đồng',
    contract_view: 'Xem danh sách/Tìm kiếm/Lọc HĐ',
    contract_detail: 'Xem chi tiết HĐ',
    contract_create_appendix: 'Tạo phụ lục HĐ',
    contract_pdf_generate: 'Gen PDF Hợp đồng',
    contract_export: 'Xuất danh sách Hợp đồng',
    contract_share: 'Chia sẻ Hợp đồng',
    contract_send_customer_confirmation: 'Gửi KH confirm Hợp đồng',
    contract_sign: 'Trình ký Hợp đồng',

    acceptance_create: 'Tạo nghiệm thu',
    acceptance_edit: 'Chỉnh sửa nghiệm thu',
    acceptance_view: 'Xem danh sách nghiệm thu',
    acceptance_detail: 'Xem chi tiết nghiệm thu',
    acceptance_export: 'Xuất biên bản nghiệm thu & biên bản xác nhận thanh toán',
    acceptance_template_detail: 'Xem chi tiết mẫu biên bản',
    acceptance_report_edit: 'Chỉnh sửa biên bản nghiệm thu',

    liquidation_create: 'Tạo thanh lý',
    liquidation_edit: 'Chỉnh sửa biên bản thanh lý',
    liquidation_cancel: 'Hủy thanh lý',
    liquidation_approve: 'Phê duyệt thanh lý',
    liquidation_reject_approval: 'Từ chối phê duyệt thanh lý',
    liquidation_generate_report: 'Gen biên bản thanh lý',
    liquidation_sign: 'Trình ký thanh lý',
    liquidation_export: 'Xuất BB thanh lý',

    report_create: 'Tạo báo cáo',
    report_view: 'Xem báo cáo',
    report_export: 'Xuất báo cáo'
  };

  const getPermissionLabel = (key) => permissionLabels[key] || key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="contract-form-container">
      <div className="contract-form-header">
        <button className="btn-back" onClick={() => navigate('/roles')}>
          <ChevronLeft size={20} /> Quay lại danh sách
        </button>
        <div style={{ marginTop: '16px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 800 }}>{isEdit ? 'Chỉnh sửa vai trò' : 'Thêm vai trò mới'}</h1>
          <p style={{ color: '#64748b' }}>Định nghĩa quyền hạn và phạm vi truy cập cho nhóm người dùng.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="contract-form-content">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px' }}>
          
          <div className="form-main-section" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Basic Info */}
            <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Shield size={18} color="#EE0033" /> Thông tin vai trò
              </h2>
              
              <div className="form-group">
                <label>Tên vai trò <span style={{ color: '#EE0033' }}>*</span></label>
                <input 
                  type="text" 
                  className="input-modern" 
                  placeholder="Ví dụ: Giám đốc kinh doanh, Kế toán viên..."
                  value={formData.name} 
                  onChange={e => setFormData({ ...formData, name: e.target.value })} 
                  required 
                />
              </div>

              <div className="form-group" style={{ marginTop: '16px' }}>
                <label>Mô tả quyền hạn</label>
                <textarea 
                  className="input-modern" 
                  rows="3"
                  placeholder="Mô tả ngắn gọn về phạm vi công việc của vai trò này..."
                  value={formData.description} 
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </div>

            </div>

            {/* Permissions Matrix */}
            <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <List size={18} color="#EE0033" /> Phân quyền chi tiết
              </h2>

              <div style={{ border: '1px solid #f1f5f9', borderRadius: '8px', overflow: 'hidden' }}>
                {PERMISSION_GROUPS.map((group, idx) => {
                  const expanded = expandedGroups[group.name] ?? true;
                  return (
                    <div key={group.name} style={{ borderBottom: idx === PERMISSION_GROUPS.length - 1 ? 'none' : '1px solid #f1f5f9' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc', padding: '10px 16px', fontSize: '13px', fontWeight: 700, color: '#1e293b', cursor: 'pointer' }} onClick={() => toggleGroup(group.name)}>
                        <span>{group.name}</span>
                        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                      {expanded && (
                        <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                          {group.keys.map(key => (
                            <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#475569' }}>
                              <input 
                                type="checkbox" 
                                checked={formData.permissions.includes(key)} 
                                onChange={() => togglePermission(key)}
                              />
                              {getPermissionLabel(key)}
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="form-side-section">
            <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <label style={{ fontWeight: 700, fontSize: '14px', marginBottom: '12px', display: 'block' }}>Trạng thái vai trò</label>
              <select 
                className="select-modern" 
                style={{ width: '100%', marginBottom: '20px' }}
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Active">Đang áp dụng</option>
                <option value="Inactive">Ngừng áp dụng</option>
              </select>

              <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0', height: '44px', justifyContent: 'center' }}>
                <Save size={18} /> {isEdit ? 'Lưu thay đổi' : 'Tạo vai trò'}
              </button>

              <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', gap: '8px', color: '#16a34a', marginBottom: '12px' }}>
                  <CheckCircle2 size={16} />
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>Tài liệu hướng dẫn</span>
                </div>
                <p style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.6' }}>
                  Mọi thay đổi về quyền hạn của vai trò sẽ có hiệu lực ngay lập tức với những người dùng đang được gán vai trò này.
                </p>
              </div>
            </div>
          </div>

        </div>
      </form>
    </div>
  );
}
