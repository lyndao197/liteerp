import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, ChevronDown, ChevronUp, Save, Shield, List, CheckCircle2, AlertCircle } from 'lucide-react';
import { mockStore } from '../utils/mockStore';

export default function RoleForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const allRoles = mockStore.getAllRoles();

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    status: 'Active',
    permissions: [],
    inheritedRoleIds: [],
    inheritedByRoleIds: [],
    additionalPermissions: []
  });
  const [expandedGroups, setExpandedGroups] = useState({});
  const [activePermissionTab, setActivePermissionTab] = useState('detailed');
  const [submitError, setSubmitError] = useState('');

  const PERMISSION_GROUPS = [
    {
      name: 'Quản lý Lead & CHBH',
      keys: [
        'lead_create',
        'lead_edit',
        'lead_search',
        'lead_detail',
        'lead_view_non_owner',
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
        'customer_view_non_owner',
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
        'task_view_non_owner',
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
        'goal_plan_view_non_owner',
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
        'contract_view_non_owner',
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
        'acceptance_view_non_owner',
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

  const INHERITABLE_ROLES = allRoles.filter(role => role.id !== formData.id);

  const NON_OWNER_PERMISSION_MAP = {
    lead_view_non_owner: 'lead_detail',
    customer_view_non_owner: 'customer_detail',
    task_view_non_owner: 'task_detail',
    goal_plan_view_non_owner: 'goal_plan_detail',
    contract_view_non_owner: 'contract_detail',
    acceptance_view_non_owner: 'acceptance_detail'
  };

  const ADDITIONAL_PERMISSIONS = [
    {
      key: 'record_view_non_owner_all',
      title: 'Xem bản ghi không phải owner (toàn hệ thống)',
      description: 'Bật nhanh quyền xem bản ghi ngoài phạm vi cá nhân ở các module hỗ trợ.'
    },
    {
      key: 'permission_audit_log_view',
      title: 'Xem nhật ký phân quyền',
      description: 'Theo dõi lịch sử thay đổi vai trò, kế thừa quyền và quyền bổ sung.'
    },
    {
      key: 'permission_delegate_temporary',
      title: 'Ủy quyền tạm thời',
      description: 'Cho phép cấp quyền tạm thời theo thời hạn cho người dùng khác.'
    },
    {
      key: 'permission_bulk_assign',
      title: 'Gán quyền hàng loạt',
      description: 'Cho phép gán vai trò/quyền cho nhiều tài khoản cùng lúc.'
    }
  ];

  useEffect(() => {
    if (isEdit) {
      const role = mockStore.getRole(id);
      if (role) {
        const inheritedByRoleIds = allRoles
          .filter(r => r.id !== role.id && (r.inheritedRoleIds || []).includes(role.id))
          .map(r => r.id);

        setFormData({
          ...role,
          permissions: role.permissions || [],
          inheritedRoleIds: role.inheritedRoleIds || [],
          inheritedByRoleIds,
          additionalPermissions: role.additionalPermissions || []
        });
      }
    } else {
      setFormData(prev => ({
        ...prev,
        id: mockStore.getNextRoleId(),
        inheritedRoleIds: [],
        inheritedByRoleIds: [],
        additionalPermissions: []
      }));
    }
  }, [id, isEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const normalizedName = String(formData.name || '').trim();
    const duplicateRole = allRoles.find(
      role => role.id !== formData.id && String(role.name || '').trim().toLowerCase() === normalizedName.toLowerCase()
    );

    if (!normalizedName) {
      setSubmitError('Tên vai trò là bắt buộc.');
      return;
    }

    if (duplicateRole) {
      setSubmitError(`Tên vai trò đã tồn tại: ${duplicateRole.name}`);
      return;
    }

    const dataToSave = {
      ...formData,
      name: normalizedName,
      description: String(formData.description || '').trim()
    };

    setSubmitError('');
    mockStore.saveRole(formData.id, dataToSave);
    navigate('/roles');
  };

  const togglePermission = (key) => {
    const newPerms = formData.permissions.includes(key)
      ? formData.permissions.filter(k => k !== key)
      : [...formData.permissions, key];
    setFormData({ ...formData, permissions: newPerms });
  };

  const toggleGroup = (groupName) => {
    setExpandedGroups(prev => ({ ...prev, [groupName]: !(prev[groupName] ?? true) }));
  };

  const toggleInheritedRole = (roleId) => {
    const inheritedRoleIds = formData.inheritedRoleIds.includes(roleId)
      ? formData.inheritedRoleIds.filter(id => id !== roleId)
      : [...formData.inheritedRoleIds, roleId];
    setFormData({ ...formData, inheritedRoleIds });
  };

  const toggleInheritedByRole = (roleId) => {
    const inheritedByRoleIds = formData.inheritedByRoleIds.includes(roleId)
      ? formData.inheritedByRoleIds.filter(id => id !== roleId)
      : [...formData.inheritedByRoleIds, roleId];
    setFormData({ ...formData, inheritedByRoleIds });
  };

  const toggleAdditionalPermission = (key) => {
    if (key === 'record_view_non_owner_all') {
      const currentlyEnabled = formData.additionalPermissions.includes(key);
      const additionalPermissions = currentlyEnabled
        ? formData.additionalPermissions.filter(p => p !== key)
        : [...formData.additionalPermissions, key];

      let permissions = formData.permissions;
      if (currentlyEnabled) {
        permissions = permissions.filter(p => !Object.keys(NON_OWNER_PERMISSION_MAP).includes(p));
      } else {
        permissions = Array.from(new Set([...permissions, ...Object.keys(NON_OWNER_PERMISSION_MAP)]));
      }

      setFormData({ ...formData, additionalPermissions, permissions });
      return;
    }

    const additionalPermissions = formData.additionalPermissions.includes(key)
      ? formData.additionalPermissions.filter(p => p !== key)
      : [...formData.additionalPermissions, key];
    setFormData({ ...formData, additionalPermissions });
  };

  const inheritedPermissions = Array.from(
    new Set(
      formData.inheritedRoleIds
        .map(roleId => mockStore.getRole(roleId))
        .filter(Boolean)
        .flatMap(role => role.permissions || [])
    )
  );

  const effectivePermissions = Array.from(new Set([...(formData.permissions || []), ...inheritedPermissions]));

  const inheritedFromRoles = allRoles.filter(role => formData.inheritedRoleIds.includes(role.id));
  const inheritedByRoles = allRoles.filter(role => formData.inheritedByRoleIds.includes(role.id));

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

    lead_view_non_owner: 'Xem bản ghi Lead không phải owner',
    customer_view_non_owner: 'Xem bản ghi Khách hàng không phải owner',
    task_view_non_owner: 'Xem bản ghi Công việc không phải owner',
    goal_plan_view_non_owner: 'Xem bản ghi Kế hoạch không phải owner',
    contract_view_non_owner: 'Xem bản ghi Hợp đồng không phải owner',
    acceptance_view_non_owner: 'Xem bản ghi Nghiệm thu không phải owner',

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
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <List size={18} color="#EE0033" />
                  <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>Quản trị quyền</h2>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '6px' }}>
                  <button
                    type="button"
                    onClick={() => setActivePermissionTab('detailed')}
                    style={{
                      border: 'none',
                      background: activePermissionTab === 'detailed' ? '#fff' : 'transparent',
                      color: activePermissionTab === 'detailed' ? '#EE0033' : '#475569',
                      fontWeight: 700,
                      padding: '8px 12px',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    Phân quyền chi tiết
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivePermissionTab('inherited')}
                    style={{
                      border: 'none',
                      background: activePermissionTab === 'inherited' ? '#fff' : 'transparent',
                      color: activePermissionTab === 'inherited' ? '#EE0033' : '#475569',
                      fontWeight: 700,
                      padding: '8px 12px',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    Quyền kế thừa
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivePermissionTab('additional')}
                    style={{
                      border: 'none',
                      background: activePermissionTab === 'additional' ? '#fff' : 'transparent',
                      color: activePermissionTab === 'additional' ? '#EE0033' : '#475569',
                      fontWeight: 700,
                      padding: '8px 12px',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    Quyền bổ sung
                  </button>
                </div>
              </div>

              {activePermissionTab === 'detailed' && (
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
              )}

              {activePermissionTab === 'inherited' && (
                <div style={{ border: '1px solid #f1f5f9', borderRadius: '8px', padding: '16px' }}>
                  <p style={{ marginTop: 0, marginBottom: '16px', fontSize: '13px', color: '#64748b' }}>
                    Thiết lập kế thừa giống Odoo: chọn vai trò nguồn để nhận quyền và chọn vai trò đích sẽ kế thừa từ vai trò hiện tại.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px' }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>Người được kế thừa</div>
                      <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '10px' }}>Vai trò nguồn mà vai trò hiện tại sẽ nhận quyền.</div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
                        {INHERITABLE_ROLES.length === 0 && (
                          <div style={{ fontSize: '13px', color: '#94a3b8' }}>Chưa có vai trò nào để kế thừa.</div>
                        )}
                        {INHERITABLE_ROLES.map(role => (
                          <label key={`from-${role.id}`} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px', cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={formData.inheritedRoleIds.includes(role.id)}
                              onChange={() => toggleInheritedRole(role.id)}
                            />
                            <span>
                              <span style={{ display: 'block', fontWeight: 600, fontSize: '13px', color: '#1e293b' }}>{role.name}</span>
                              <span style={{ display: 'block', fontSize: '12px', color: '#64748b' }}>{role.description}</span>
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px' }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>Người kế thừa</div>
                      <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '10px' }}>Vai trò sẽ tự động kế thừa quyền từ vai trò hiện tại.</div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
                        {INHERITABLE_ROLES.length === 0 && (
                          <div style={{ fontSize: '13px', color: '#94a3b8' }}>Chưa có vai trò nào để cấu hình kế thừa.</div>
                        )}
                        {INHERITABLE_ROLES.map(role => (
                          <label key={`by-${role.id}`} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px', cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={formData.inheritedByRoleIds.includes(role.id)}
                              onChange={() => toggleInheritedByRole(role.id)}
                            />
                            <span>
                              <span style={{ display: 'block', fontWeight: 600, fontSize: '13px', color: '#1e293b' }}>{role.name}</span>
                              <span style={{ display: 'block', fontSize: '12px', color: '#64748b' }}>{role.description}</span>
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '8px', padding: '12px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>Quyền kế thừa hiệu lực ({inheritedPermissions.length})</div>
                    {inheritedPermissions.length === 0 ? (
                      <div style={{ fontSize: '12px', color: '#94a3b8' }}>Chưa có quyền kế thừa.</div>
                    ) : (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {inheritedPermissions.map(key => (
                          <span key={key} style={{ fontSize: '12px', color: '#334155', background: '#e2e8f0', padding: '4px 8px', borderRadius: '999px' }}>
                            {getPermissionLabel(key)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div style={{ marginTop: '10px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px' }}>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Nguồn kế thừa đã chọn ({inheritedFromRoles.length})</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>
                        {inheritedFromRoles.length === 0 ? 'Chưa chọn.' : inheritedFromRoles.map(r => r.name).join(', ')}
                      </div>
                    </div>
                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px' }}>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Vai trò kế thừa từ vai trò này ({inheritedByRoles.length})</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>
                        {inheritedByRoles.length === 0 ? 'Chưa chọn.' : inheritedByRoles.map(r => r.name).join(', ')}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activePermissionTab === 'additional' && (
                <div style={{ border: '1px solid #f1f5f9', borderRadius: '8px', padding: '16px' }}>
                  <p style={{ marginTop: 0, marginBottom: '12px', fontSize: '13px', color: '#64748b' }}>
                    Quyền bổ sung giúp cấu hình nhanh các quyền đặc biệt ngoài bộ phân quyền chuẩn.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
                    {ADDITIONAL_PERMISSIONS.map(item => (
                      <label key={item.key} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={formData.additionalPermissions.includes(item.key)}
                          onChange={() => toggleAdditionalPermission(item.key)}
                        />
                        <span>
                          <span style={{ display: 'block', fontWeight: 600, fontSize: '13px', color: '#1e293b' }}>{item.title}</span>
                          <span style={{ display: 'block', fontSize: '12px', color: '#64748b' }}>{item.description}</span>
                        </span>
                      </label>
                    ))}
                  </div>

                  <div style={{ marginTop: '12px', fontSize: '12px', color: '#334155', background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '8px', padding: '10px' }}>
                    Khi bật quyền "Xem bản ghi không phải owner (toàn hệ thống)", hệ thống sẽ tự thêm các quyền xem ngoài owner cho Lead, Khách hàng, Công việc, Mục tiêu, Hợp đồng và Nghiệm thu.
                  </div>
                </div>
              )}

              <div style={{ marginTop: '16px', padding: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px', color: '#475569' }}>
                Tổng quyền hiệu lực hiện tại: <strong>{effectivePermissions.length}</strong>
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

              {submitError && (
                <div style={{ marginTop: '12px', display: 'flex', gap: '8px', alignItems: 'flex-start', color: '#dc2626', fontSize: '12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px' }}>
                  <AlertCircle size={14} style={{ marginTop: '1px', flexShrink: 0 }} />
                  <span>{submitError}</span>
                </div>
              )}

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
