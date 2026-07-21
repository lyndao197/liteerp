import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, ChevronDown, ChevronUp, Save, Shield, List, CheckCircle2, AlertCircle } from 'lucide-react';
import { mockStore } from '../utils/mockStore';

function DataFieldMultiSelect({ record, selectedFieldKeys = [], onChange, catalog }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const allFields = record.fields;
  const isAllSelected = allFields.length > 0 && selectedFieldKeys.length === allFields.length;
  const isNoneSelected = selectedFieldKeys.length === 0;

  const handleToggleField = (fieldKey) => {
    if (selectedFieldKeys.includes(fieldKey)) {
      onChange(selectedFieldKeys.filter(k => k !== fieldKey));
    } else {
      onChange([...selectedFieldKeys, fieldKey]);
    }
  };

  const handleSelectAll = () => {
    onChange([...allFields]);
  };

  const handleDeselectAll = () => {
    onChange([]);
  };

  const filteredFields = allFields.filter(fieldKey => {
    const label = catalog[fieldKey]?.label || fieldKey;
    const desc = catalog[fieldKey]?.description || '';
    const q = searchTerm.toLowerCase();
    return label.toLowerCase().includes(q) || desc.toLowerCase().includes(q);
  });

  return (
    <div style={{ position: 'relative', width: '100%' }} ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          border: '1px solid #cbd5e1',
          borderRadius: '8px',
          padding: '8px 12px',
          background: '#ffffff',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between',
          minHeight: '42px',
          gap: '8px'
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center', flex: 1, minWidth: 0 }}>
          {isAllSelected ? (
            <span style={{ fontSize: '13px', color: '#1e293b', fontWeight: 600 }}>
              Tất cả trường dữ liệu ({allFields.length}/{allFields.length})
            </span>
          ) : isNoneSelected ? (
            <span style={{ fontSize: '13px', color: '#94a3b8', fontStyle: 'italic' }}>
              Chưa chọn trường nào (Không hiển thị dữ liệu)
            </span>
          ) : (
            <>
              {selectedFieldKeys.map(fieldKey => (
                <span
                  key={fieldKey}
                  style={{
                    background: '#f1f5f9',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    padding: '2px 8px',
                    fontSize: '12px',
                    color: '#334155',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {catalog[fieldKey]?.label || fieldKey}
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleField(fieldKey);
                    }}
                    style={{
                      cursor: 'pointer',
                      color: '#94a3b8',
                      fontWeight: 700,
                      marginLeft: '2px',
                      fontSize: '12px'
                    }}
                    title="Bỏ chọn"
                  >
                    ✕
                  </span>
                </span>
              ))}
            </>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {!isAllSelected && !isNoneSelected && (
            <span style={{ fontSize: '12px', color: '#64748b', background: '#e2e8f0', padding: '2px 6px', borderRadius: '10px', fontWeight: 600 }}>
              {selectedFieldKeys.length}/{allFields.length}
            </span>
          )}
          {isOpen ? <ChevronUp size={16} color="#64748b" /> : <ChevronDown size={16} color="#64748b" />}
        </div>
      </div>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '10px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            zIndex: 100,
            padding: '10px',
            maxHeight: '300px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>
              Chọn trường ({selectedFieldKeys.length}/{allFields.length})
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={handleSelectAll}
                style={{ background: 'none', border: 'none', color: '#EE0033', fontSize: '12px', fontWeight: 600, cursor: 'pointer', padding: 0 }}
              >
                Chọn tất cả
              </button>
              <span style={{ color: '#cbd5e1' }}>|</span>
              <button
                type="button"
                onClick={handleDeselectAll}
                style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '12px', fontWeight: 600, cursor: 'pointer', padding: 0 }}
              >
                Bỏ chọn tất cả
              </button>
            </div>
          </div>

          {allFields.length > 5 && (
            <input
              type="text"
              placeholder="Tìm kiếm trường..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                padding: '6px 10px',
                fontSize: '12px',
                width: '100%',
                outline: 'none'
              }}
            />
          )}

          <div style={{ overflowY: 'auto', maxHeight: '200px', minHeight: 0, paddingRight: '4px' }}>
            {filteredFields.map(fieldKey => {
              const isChecked = selectedFieldKeys.includes(fieldKey);
              const fieldMeta = catalog[fieldKey];
              return (
                <label
                  key={fieldKey}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    padding: '8px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    background: isChecked ? '#fef2f2' : 'transparent',
                    transition: 'background 0.15s'
                  }}
                  onMouseEnter={(e) => {
                    if (!isChecked) e.currentTarget.style.background = '#f8fafc';
                  }}
                  onMouseLeave={(e) => {
                    if (!isChecked) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleToggleField(fieldKey)}
                    style={{ marginTop: '2px', accentColor: '#EE0033' }}
                  />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: isChecked ? '#EE0033' : '#1e293b' }}>
                      {fieldMeta?.label || fieldKey}
                    </div>
                    {fieldMeta?.description && (
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '1px' }}>
                        {fieldMeta.description}
                      </div>
                    )}
                  </div>
                </label>
              );
            })}
            {filteredFields.length === 0 && (
              <div style={{ padding: '12px', fontSize: '12px', color: '#94a3b8', textAlign: 'center' }}>
                Không tìm thấy trường tương ứng
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

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
    dataPermissions: [],
    dataScopeByRecord: {},
    inheritedRoleIds: [],
    inheritedByRoleIds: []
  });
  const [expandedGroups, setExpandedGroups] = useState({});
  const [expandedDataModules, setExpandedDataModules] = useState({});
  const [activePermissionTab, setActivePermissionTab] = useState('detailed');
  const [dataPermissionRowsByRecord, setDataPermissionRowsByRecord] = useState({});
  const [submitError, setSubmitError] = useState('');

  const PERMISSION_GROUPS = [
    {
      name: 'Quản lý Lead & CHBH',
      description: 'Quyền lead và cơ hội bán hàng theo danh sách nghiệp vụ.',
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
      description: 'Quản lý hồ sơ khách hàng và các thao tác tra cứu cơ bản.',
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
      description: 'To do list, kanban công việc và các thao tác công việc.',
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
      description: 'Quyền với kế hoạch doanh thu và kết quả mục tiêu.',
      keys: [
        'goal_plan_create',
        'goal_plan_edit',
        'goal_plan_delete',
        'goal_plan_view',
        'goal_plan_export',
        'goal_plan_detail',
        'goal_result_create',
        'goal_result_export'
      ]
    },
    {
      name: 'Quản lý Hợp Đồng',
      description: 'Quyền hợp đồng theo đúng danh sách nghiệp vụ đã chốt.',
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
      description: 'Bao gồm tạo, cập nhật, xuất biên bản và các bước xử lý nghiệm thu.',
      keys: [
        'acceptance_create',
        'acceptance_edit',
        'acceptance_view',
        'acceptance_detail',
        'acceptance_export',
        'acceptance_template_detail',
        'acceptance_report_edit',
        'acceptance_invoice_request',
        'acceptance_invoice_upload'
      ]
    },
    {
      name: 'Thanh lý Hợp Đồng',
      description: 'Quyền thao tác với biên bản thanh lý hợp đồng.',
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
      description: 'Quyền tạo, xem và xuất báo cáo.',
      keys: [
        'report_create',
        'report_view',
        'report_export'
      ]
    }
  ];

  const DATA_FIELD_CATALOG = useMemo(() => ({
    id: { label: 'ID', description: 'Mã bản ghi' },
    content: { label: 'Tên lead', description: 'Tên lead hiển thị trên board' },
    company: { label: 'Tên khách hàng', description: 'Tên doanh nghiệp/công ty' },
    mst: { label: 'Mã số thuế', description: 'Thông tin định danh pháp lý' },
    projectedService: { label: 'Dịch vụ dự kiến', description: 'Dịch vụ chính của lead' },
    probability: { label: 'Xác suất', description: 'Xác suất chốt lead' },
    status: { label: 'Trạng thái', description: 'Trạng thái xử lý nghiệp vụ' },
    tags: { label: 'Nhãn', description: 'Phân loại bản ghi bằng tag' },
    revenue: { label: 'Doanh thu dự kiến', description: 'Giá trị doanh thu dự kiến' },
    salesperson: { label: 'Sale phụ trách', description: 'Nhân sự phụ trách chính' },
    date: { label: 'Ngày tạo', description: 'Ngày tạo lead' },
    attachments: { label: 'Số tệp đính kèm', description: 'Tổng tệp đính kèm' },
    comments: { label: 'Số bình luận', description: 'Tổng bình luận' },

    contractNo: { label: 'Số hợp đồng', description: 'Mã số hợp đồng' },
    name: { label: 'Tên hợp đồng', description: 'Tên hiển thị của hợp đồng' },
    customerId: { label: 'Mã khách hàng', description: 'Định danh khách hàng' },
    customerName: { label: 'Tên khách hàng', description: 'Tên doanh nghiệp/cá nhân' },
    shortName: { label: 'Tên viết tắt', description: 'Tên ngắn của khách hàng' },
    amName: { label: 'AM phụ trách', description: 'Nhân sự account phụ trách' },
    promotionUnit: { label: 'Đơn vị xúc tiến', description: 'Đơn vị triển khai/xúc tiến' },
    projectType: { label: 'Loại dự án', description: 'Nhóm dự án triển khai' },
    serviceType: { label: 'Loại dịch vụ', description: 'Phân loại dịch vụ hợp đồng' },
    classification: { label: 'Phân loại', description: 'Ngoài/Nội bộ' },
    contractStatus: { label: 'Trạng thái hợp đồng', description: 'Tình trạng hiện tại của hợp đồng' },
    implementationStatus: { label: 'Trạng thái triển khai', description: 'Mức độ triển khai thực tế' },
    revenueStatus: { label: 'Trạng thái doanh thu', description: 'Đã/Chưa ghi nhận doanh thu' },
    revenueMonth: { label: 'Tháng ghi nhận doanh thu', description: 'Thời điểm ghi nhận doanh thu' },
    contractValue: { label: 'Giá trị hợp đồng', description: 'Tổng giá trị tài chính' },
    unitPrice: { label: 'Đơn giá', description: 'Đơn giá trung bình/đơn vị' },
    totalContracts: { label: 'Tổng số hợp đồng', description: 'Số lượng hợp đồng liên quan' },
    effectiveDate: { label: 'Ngày hiệu lực', description: 'Ngày bắt đầu hiệu lực' },
    expiryDate: { label: 'Ngày hết hiệu lực', description: 'Ngày kết thúc hiệu lực' },
    signedDate: { label: 'Ngày ký', description: 'Ngày ký hợp đồng' },
    serviceContent: { label: 'Nội dung dịch vụ', description: 'Mô tả phạm vi dịch vụ' },
    notes: { label: 'Ghi chú', description: 'Thông tin bổ sung' },
    approvalStatus: { label: 'Trạng thái phê duyệt', description: 'Trạng thái phê duyệt nội bộ' },

    reconcNo: { label: 'Số đối soát', description: 'Mã đợt đối soát' },
    month: { label: 'Tháng', description: 'Tháng đối soát' },
    year: { label: 'Năm', description: 'Năm đối soát' },
    slaScore: { label: 'Điểm SLA', description: 'Điểm chất lượng SLA' },
    penaltyRate: { label: 'Tỷ lệ phạt', description: 'Tỷ lệ phạt SLA' },
    totalBeforePenalty: { label: 'Tổng trước phạt', description: 'Tổng giá trị trước khấu trừ' },
    penaltyAmount: { label: 'Tiền phạt', description: 'Số tiền bị khấu trừ' },
    totalAfterPenalty: { label: 'Tổng sau phạt', description: 'Tổng giá trị sau khấu trừ' },
    vatRate: { label: 'VAT (%)', description: 'Tỷ lệ VAT áp dụng' },
    vatAmount: { label: 'Tiền VAT', description: 'Số tiền VAT' },
    grandTotal: { label: 'Tổng cộng', description: 'Giá trị thanh toán cuối cùng' },
    createdDate: { label: 'Ngày tạo', description: 'Ngày tạo bản ghi đối soát' },
    confirmedDate: { label: 'Ngày xác nhận', description: 'Ngày xác nhận đối soát' }
  }), []);

  const DATA_PERMISSION_RECORDS = useMemo(() => ([
    {
      key: 'lead',
      label: 'Lead',
      fields: ['id', 'content', 'company', 'mst', 'projectedService', 'probability', 'status', 'tags', 'revenue', 'salesperson', 'date', 'attachments', 'comments']
    },
    {
      key: 'customer',
      label: 'Khách hàng',
      fields: ['id', 'customerName', 'shortName', 'mst', 'customerId', 'status', 'tags', 'notes']
    },
    {
      key: 'contract',
      label: 'Hợp đồng',
      fields: ['id', 'contractNo', 'name', 'customerId', 'customerName', 'shortName', 'amName', 'promotionUnit', 'projectType', 'serviceType', 'classification', 'contractStatus', 'implementationStatus', 'revenueStatus', 'revenueMonth', 'contractValue', 'unitPrice', 'totalContracts', 'effectiveDate', 'expiryDate', 'signedDate', 'serviceContent', 'notes', 'approvalStatus']
    },
    {
      key: 'acceptance',
      label: 'Nghiệm thu',
      fields: ['id', 'reconcNo', 'customerId', 'customerName', 'shortName', 'contractNo', 'month', 'year', 'status', 'slaScore', 'penaltyRate', 'totalBeforePenalty', 'penaltyAmount', 'totalAfterPenalty', 'vatRate', 'vatAmount', 'grandTotal', 'notes', 'createdDate', 'confirmedDate']
    }
  ]), []);

  const allDataPermissionKeys = useMemo(
    () => DATA_PERMISSION_RECORDS.flatMap(record => record.fields.map(fieldKey => `${record.key}.${fieldKey}`)),
    [DATA_PERMISSION_RECORDS]
  );

  const defaultDataScopeByRecord = useMemo(
    () => DATA_PERMISSION_RECORDS.reduce((acc, record) => {
      acc[record.key] = 'all';
      return acc;
    }, {}),
    [DATA_PERMISSION_RECORDS]
  );

  const buildDataPermissionRowsByRecord = (dataPermissions = []) => {
    const permissionSet = new Set(dataPermissions || []);
    const isDefaultAll = !dataPermissions || dataPermissions.length === 0;

    return DATA_PERMISSION_RECORDS.reduce((acc, record) => {
      if (isDefaultAll) {
        acc[record.key] = [...record.fields];
      } else {
        const selectedFields = record.fields.filter(fieldKey => permissionSet.has(`${record.key}.${fieldKey}`));
        acc[record.key] = selectedFields;
      }
      return acc;
    }, {});
  };

  const flattenDataPermissionRowsByRecord = (rowsByRecord = {}) => {
    return DATA_PERMISSION_RECORDS.flatMap(record =>
      (rowsByRecord[record.key] || [])
        .filter(Boolean)
        .map(fieldKey => `${record.key}.${fieldKey}`)
    );
  };

  const INHERITABLE_ROLES = allRoles.filter(role => role.id !== formData.id);

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
          dataPermissions: Object.prototype.hasOwnProperty.call(role, 'dataPermissions')
            ? (role.dataPermissions || [])
            : allDataPermissionKeys,
          dataScopeByRecord: {
            ...defaultDataScopeByRecord,
            ...(role.dataScopeByRecord || {})
          },
          inheritedRoleIds: role.inheritedRoleIds || [],
          inheritedByRoleIds
        });
        setDataPermissionRowsByRecord(buildDataPermissionRowsByRecord(role.dataPermissions || []));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        id: mockStore.getNextRoleId(),
        dataPermissions: [],
        dataScopeByRecord: defaultDataScopeByRecord,
        inheritedRoleIds: [],
        inheritedByRoleIds: []
      }));
      setDataPermissionRowsByRecord(buildDataPermissionRowsByRecord([]));
    }
  }, [id, isEdit, allDataPermissionKeys, defaultDataScopeByRecord]);

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

    const normalizedDataPermissions = flattenDataPermissionRowsByRecord(dataPermissionRowsByRecord);

    const dataToSave = {
      ...formData,
      name: normalizedName,
      description: String(formData.description || '').trim(),
      dataPermissions: normalizedDataPermissions,
      inheritedRoleIds: selectedInheritedRoleIds,
      inheritedByRoleIds: selectedInheritedByRoleIds
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

  const isGroupFullySelected = (groupKeys) => groupKeys.every(key => formData.permissions.includes(key));

  const toggleGroupPermissions = (groupKeys, shouldSelectAll) => {
    if (shouldSelectAll) {
      const confirmed = window.confirm('Bạn có muốn cấp toàn bộ quyền trong nhóm này không?');
      if (!confirmed) return;

      setFormData({
        ...formData,
        permissions: Array.from(new Set([...(formData.permissions || []), ...groupKeys]))
      });
      return;
    }

    setFormData({
      ...formData,
      permissions: (formData.permissions || []).filter(key => !groupKeys.includes(key))
    });
  };

  const toggleGroup = (groupName) => {
    setExpandedGroups(prev => ({ ...prev, [groupName]: !(prev[groupName] ?? true) }));
  };

  const toggleDataModule = (moduleKey) => {
    setExpandedDataModules(prev => ({ ...prev, [moduleKey]: !(prev[moduleKey] ?? true) }));
  };

  const getDataPermissionKey = (recordKey, fieldKey) => `${recordKey}.${fieldKey}`;

  const getDataPermissionRows = (recordKey) => dataPermissionRowsByRecord[recordKey] || [];

  const setDataScopeForRecord = (recordKey, scope) => {
    setFormData({
      ...formData,
      dataScopeByRecord: {
        ...(formData.dataScopeByRecord || defaultDataScopeByRecord),
        [recordKey]: scope
      }
    });
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

  const normalizeRoleIds = (roleIds) => Array.from(new Set((roleIds || []).filter(roleId => roleId && roleId !== formData.id)));

  const updateRoleRow = (field, index, roleId) => {
    const nextRoleIds = [...formData[field]];
    nextRoleIds[index] = roleId;
    setFormData({ ...formData, [field]: nextRoleIds });
  };

  const addRoleRow = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const removeRoleRow = (field, index) => {
    setFormData({ ...formData, [field]: formData[field].filter((_, rowIndex) => rowIndex !== index) });
  };

  const isRoleSelectedElsewhere = (list, index, roleId) => {
    if (!roleId) return false;
    return list.some((item, itemIndex) => itemIndex !== index && item === roleId);
  };

  const selectedInheritedRoleIds = normalizeRoleIds(formData.inheritedRoleIds);
  const selectedInheritedByRoleIds = normalizeRoleIds(formData.inheritedByRoleIds);

  const inheritedPermissions = Array.from(
    new Set(
      selectedInheritedRoleIds
        .map(roleId => mockStore.getRole(roleId))
        .filter(Boolean)
        .flatMap(role => role.permissions || [])
    )
  );

  const effectivePermissions = Array.from(new Set([...(formData.permissions || []), ...inheritedPermissions]));

  const inheritedFromRoles = allRoles.filter(role => selectedInheritedRoleIds.includes(role.id));
  const inheritedByRoles = allRoles.filter(role => selectedInheritedByRoleIds.includes(role.id));

  const permissionLabels = {
    // Quản lý Lead & CHBH
    lead_create: 'Tạo lead (bao gồm Tạo bản sao LEAD)',
    lead_edit: 'Chỉnh sửa lead (Chuyển trạng thái + update thông tin)',
    lead_search: 'Xem danh sách/Tìm kiếm/Lọc lead',
    lead_detail: 'Xem chi tiết lead',
    lead_export: 'Export danh sách lead',
    lead_delete: 'Xóa LEAD',
    lead_mark_failed: 'Không thành công Lead',

    // Quản lý Khách hàng
    customer_create: 'Tạo mới hồ sơ khách hàng',
    customer_edit: 'Chỉnh sửa hồ sơ khách hàng',
    customer_detail: 'Xem chi tiết hồ sơ khách hàng',
    customer_view: 'Xem danh sách/Tìm kiếm',
    customer_export: 'Export danh sách khách hàng',
    customer_delete: 'Xóa hồ sơ khách hàng',

    // To do list
    task_create: 'Thêm mới công việc',
    task_edit: 'Chỉnh sửa công việc (Edit thông tin + Chuyển trạng thái)',
    task_delete: 'Xóa công việc',
    task_view: 'Xem danh sách công việc (Kanban + List/Tìm kiếm/Di chuyển kanban/Lọc)',
    task_detail: 'Xem chi tiết công việc',
    task_export: 'Export danh sách công việc',

    // Quản lý mục tiêu
    goal_plan_create: 'Thêm mới kế hoạch',
    goal_plan_edit: 'Chỉnh sửa kế hoạch',
    goal_plan_delete: 'Xóa kế hoạch',
    goal_plan_view: 'Xem danh sách/lọc/tìm kiếm kế hoạch',
    goal_plan_export: 'Export danh sách kế hoạch',
    goal_plan_detail: 'Xem chi tiết kế hoạch',
    goal_result_create: 'Tạo kết quả',
    goal_result_export: 'Export kết quả mục tiêu',

    // Quản lý Hợp Đồng
    contract_create: 'Tạo hợp đồng (Lưu nháp/Gửi duyệt/Tạo bản sao/Phản hồi yêu cầu xem xét HĐ) + Tạo phụ lục',
    contract_delete_draft: 'Xóa HĐ (TT dự thảo)',
    contract_edit: 'Chỉnh sửa hợp đồng',
    contract_approve: 'Phê duyệt hợp đồng (Xem xét HĐ)',
    contract_confirm: 'Xác nhận Hợp đồng',
    contract_cancel: 'Hủy hợp đồng',
    contract_view: 'Xem danh sách/Tìm kiếm/Lọc HĐ',
    contract_detail: 'Xem chi tiết HĐ',
    contract_create_appendix: 'Tạo phụ lục HĐ',
    contract_pdf_generate: 'Gen PDF Hợp đồng (gắn watermark)',
    contract_export: 'Xuất danh sách Hợp đồng',
    contract_share: 'Chia sẻ Hợp đồng',
    contract_send_customer_confirmation: 'Gửi KH confirm Hợp đồng',
    contract_sign: 'Trình ký Hợp đồng',

    // Nghiệm thu đầu ra
    acceptance_create: 'Tạo nghiệm thu',
    acceptance_edit: 'Chỉnh sửa nghiệm thu (Bao gồm toàn bộ chức năng trong các bước nghiệm thu: Upload File Gửi KH/TRÌNH KÝ/HOÀN THÀNH/KÝ...)',
    acceptance_view: 'Xem danh sách nghiệm thu',
    acceptance_detail: 'Xem chi tiết nghiệm thu',
    acceptance_export: 'Xuất biên bản nghiệm thu & biên bản xác nhận thanh toán',
    acceptance_template_detail: 'Xem chi tiết mẫu biên bản',
    acceptance_report_edit: 'Chỉnh sửa biên bản nghiệm thu',
    acceptance_invoice_request: 'Gửi yêu cầu xuất hóa đơn',
    acceptance_invoice_upload: 'Upload file hóa đơn',

    // Thanh lý Hợp Đồng
    liquidation_create: 'Tạo thanh lý',
    liquidation_edit: 'Chỉnh sửa biên bản thanh lý',
    liquidation_cancel: 'Hủy thanh lý',
    liquidation_approve: 'Phê duyệt thanh lý',
    liquidation_reject_approval: 'Từ chối phê duyệt thanh lý',
    liquidation_generate_report: 'Gen biên bản thanh lý',
    liquidation_sign: 'Trình ký thanh lý',
    liquidation_export: 'Xuất BB thanh lý',

    // Báo cáo
    report_create: 'Tạo báo cáo',
    report_view: 'Xem báo cáo',
    report_export: 'Xuất báo cáo',

    // Dashboard & Others
    dashboard_view: 'Xem trang chủ cá nhân',
    dashboard_view_team: 'Xem dashboard đơn vị/đội nhóm',
    dashboard_view_kpi: 'Xem KPI và chỉ số tổng hợp',
    dashboard_export: 'Xuất dữ liệu dashboard'
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
                    Kế thừa quyền
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivePermissionTab('data')}
                    style={{
                      border: 'none',
                      background: activePermissionTab === 'data' ? '#fff' : 'transparent',
                      color: activePermissionTab === 'data' ? '#EE0033' : '#475569',
                      fontWeight: 700,
                      padding: '8px 12px',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    Quyền dữ liệu
                  </button>
                </div>
              </div>

              {activePermissionTab === 'detailed' && (
                <div>
                  <div style={{ border: '1px solid #f1f5f9', borderRadius: '8px', overflow: 'hidden' }}>
                    {PERMISSION_GROUPS.map((group, idx) => {
                      const expanded = expandedGroups[group.name] ?? true;
                      const allSelected = isGroupFullySelected(group.keys);
                      return (
                        <div key={group.name} style={{ borderBottom: idx === PERMISSION_GROUPS.length - 1 ? 'none' : '1px solid #f1f5f9' }}>
                          <div
                            onClick={() => toggleGroup(group.name)}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', background: '#f8fafc', padding: '10px 16px', fontSize: '13px', fontWeight: 700, color: '#1e293b', cursor: 'pointer', userSelect: 'none' }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleGroup(group.name);
                                }}
                                aria-label={expanded ? `Thu hẹp ${group.name}` : `Mở rộng ${group.name}`}
                                title={expanded ? `Thu hẹp ${group.name}` : `Mở rộng ${group.name}`}
                                style={{ border: '1px solid #dbe4ef', background: '#fff', color: '#334155', borderRadius: '8px', padding: '4px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                              >
                                {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                              </button>
                              <div>
                                <div>{group.name}</div>
                                {group.description && (
                                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 500, marginTop: '2px' }}>{group.description}</div>
                                )}
                              </div>
                            </div>
                            <label
                              onClick={(e) => e.stopPropagation()}
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 600, color: '#475569' }}
                            >
                              <input
                                type="checkbox"
                                checked={allSelected}
                                onChange={e => toggleGroupPermissions(group.keys, e.target.checked)}
                              />
                              Tất cả
                            </label>
                          </div>
                          {expanded && (
                            <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '12px 16px' }}>
                              {group.keys.map(key => {
                                return (
                                  <label key={key} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#475569', lineHeight: '1.4' }}>
                                    <input
                                      type="checkbox"
                                      checked={formData.permissions.includes(key)}
                                      onChange={() => togglePermission(key)}
                                      style={{ marginTop: '2px', flexShrink: 0, accentColor: '#EE0033' }}
                                    />
                                    <span>{getPermissionLabel(key)}</span>
                                  </label>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}

                  </div>
                </div>
              )}

              {activePermissionTab === 'inherited' && (
                <div style={{ border: '1px solid #f1f5f9', borderRadius: '12px', padding: '16px', background: '#fff' }}>
                  <div style={{ marginBottom: '16px', padding: '12px 14px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '13px', color: '#334155', lineHeight: '1.6' }}>
                    Thêm từng dòng để cấu hình kế thừa quyền.
                  </div>

                  <div style={{ display: 'grid', gap: '16px', marginBottom: '16px' }}>
                    <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px', background: '#ffffff' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '4px' }}>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>Kế thừa từ</div>
                        <button
                          type="button"
                          onClick={() => addRoleRow('inheritedRoleIds')}
                          style={{ border: '1px solid #cbd5e1', background: '#fff', color: '#334155', borderRadius: '8px', padding: '6px 10px', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}
                        >
                          Thêm dòng
                        </button>
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '12px' }}>Mỗi dòng là một vai trò nguồn để vai trò hiện tại lấy toàn bộ quyền.</div>
                      <div style={{ display: 'grid', gap: '8px' }}>
                        {formData.inheritedRoleIds.length === 0 && (
                          <div style={{ fontSize: '13px', color: '#94a3b8', padding: '10px 12px', border: '1px dashed #dbe4ef', borderRadius: '8px' }}>Chưa có dòng nào. Nhấn “Thêm dòng” để chọn vai trò nguồn.</div>
                        )}
                        {formData.inheritedRoleIds.map((roleId, index) => (
                          <div key={`from-row-${index}`} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px', alignItems: 'center', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '10px' }}>
                            <select
                              className="select-modern"
                              value={roleId}
                              onChange={e => updateRoleRow('inheritedRoleIds', index, e.target.value)}
                            >
                              <option value="">-- Chọn vai trò nguồn --</option>
                              {INHERITABLE_ROLES.map(role => (
                                <option key={role.id} value={role.id} disabled={isRoleSelectedElsewhere(formData.inheritedRoleIds, index, role.id)}>
                                  {role.name}
                                </option>
                              ))}
                            </select>
                            <button
                              type="button"
                              onClick={() => removeRoleRow('inheritedRoleIds', index)}
                              style={{ border: 'none', background: '#fef2f2', color: '#dc2626', borderRadius: '8px', padding: '8px 10px', fontSize: '12px', cursor: 'pointer', fontWeight: 700 }}
                            >
                              Xóa
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px', background: '#ffffff' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '4px' }}>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>Được kế thừa bởi</div>
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '12px' }}>
                        Danh sách này lấy từ cấu hình của các vai trò khác (chỉ hiển thị, không chỉnh sửa tại đây).
                      </div>
                      <div style={{ display: 'grid', gap: '8px' }}>
                        {inheritedByRoles.length === 0 && (
                          <div style={{ fontSize: '13px', color: '#94a3b8', padding: '10px 12px', border: '1px dashed #dbe4ef', borderRadius: '8px' }}>
                            Chưa có vai trò nào kế thừa role này.
                          </div>
                        )}
                        {inheritedByRoles.map((role) => (
                          <div
                            key={role.id}
                            style={{
                              display: 'grid',
                              gridTemplateColumns: '1fr auto',
                              gap: '8px',
                              alignItems: 'center',
                              border: '1px solid #e2e8f0',
                              borderRadius: '10px',
                              padding: '10px'
                            }}
                          >
                            <div style={{ fontSize: '13px', color: '#334155', fontWeight: 600 }}>{role.name}</div>
                            <div style={{ fontSize: '11px', color: '#64748b' }}>{role.id}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {activePermissionTab === 'data' && (
                <div style={{ border: '1px solid #f1f5f9', borderRadius: '12px', padding: '16px', background: '#fff' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(280px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                    <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px 14px', background: '#f8fafc' }}>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>Phạm vi bản ghi</div>
                      <div style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.6' }}>
                        Xác định vai trò được xem những bản ghi nào: chỉ bản ghi do mình tạo, hoặc toàn bộ bản ghi trong hệ thống.
                      </div>
                    </div>
                    <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px 14px', background: '#f8fafc' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '6px' }}>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>Phạm vi trường dữ liệu</div>
                        <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Dropdown chọn nhiều</div>
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.6' }}>
                        Cấu hình cột dữ liệu được phép hiển thị theo từng nhóm bản ghi, cho phép giới hạn theo vai trò: mỗi trường thông tin chỉ hiển thị với những vai trò được cấp quyền xem.
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gap: '12px' }}>
                    {DATA_PERMISSION_RECORDS.map(record => {
                      const dataScope = (formData.dataScopeByRecord || defaultDataScopeByRecord)[record.key] || 'all';
                      const moduleExpanded = expandedDataModules[record.key] ?? true;

                      return (
                        <div key={record.key} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', position: 'relative' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', padding: '12px 14px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <div>
                              <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>{record.label}</div>
                            </div>
                            <button
                              type="button"
                              onClick={() => toggleDataModule(record.key)}
                              aria-label={moduleExpanded ? `Thu hẹp ${record.label}` : `Mở rộng ${record.label}`}
                              title={moduleExpanded ? `Thu hẹp ${record.label}` : `Mở rộng ${record.label}`}
                              style={{ border: '1px solid #dbe4ef', background: '#fff', color: '#334155', borderRadius: '8px', padding: '6px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                              {moduleExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </button>
                          </div>

                          {moduleExpanded && (
                            <>
                              <div style={{ padding: '12px 14px', borderBottom: '1px solid #f1f5f9' }}>
                                <div style={{ fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>Phạm vi bản ghi</div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(180px, max-content))', gap: '8px' }}>
                                  <label style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '6px 8px', display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '6px', alignItems: 'center', fontSize: '12px', color: '#334155', background: '#fff', cursor: 'pointer' }}>
                                    <input
                                      type="radio"
                                      name={`data-scope-${record.key}`}
                                      checked={dataScope === 'own'}
                                      onChange={() => setDataScopeForRecord(record.key, 'own')}
                                    />
                                    Chỉ của tôi
                                  </label>
                                  <label style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '6px 8px', display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '6px', alignItems: 'center', fontSize: '12px', color: '#334155', background: '#fff', cursor: 'pointer' }}>
                                    <input
                                      type="radio"
                                      name={`data-scope-${record.key}`}
                                      checked={dataScope === 'all'}
                                      onChange={() => setDataScopeForRecord(record.key, 'all')}
                                    />
                                    Tất cả
                                  </label>
                                </div>
                              </div>

                              <div style={{ padding: '12px 14px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '8px' }}>
                                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>Phạm vi trường dữ liệu</div>
                                </div>
                                <DataFieldMultiSelect
                                  record={record}
                                  selectedFieldKeys={getDataPermissionRows(record.key)}
                                  onChange={(nextSelected) => {
                                    setDataPermissionRowsByRecord(prev => ({
                                      ...prev,
                                      [record.key]: nextSelected
                                    }));
                                  }}
                                  catalog={DATA_FIELD_CATALOG}
                                />
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

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
