import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Send,
  MessageSquare,
  History,
  Trash2,
  Plus,
  ChevronDown,
  ArrowUpDown,
  Filter,
  ArrowDownToLine
} from 'lucide-react';
import { mockStore } from '../utils/mockStore';
import './GoalForm.css';

const STEPS = [
  { num: 1, label: 'Mới tạo', active: true },
  { num: 2, label: 'Chờ điều chỉnh', active: false },
  { num: 3, label: 'Hiệu lực', active: false }
];

const YEAR_OPTIONS = Array.from({ length: 31 }, (_, i) => (2024 + i).toString());

const MONTH_KEYS = ['t1', 't2', 't3', 't4', 't5', 't6', 't7', 't8', 't9', 't10', 't11', 't12'];
const QUARTER_KEYS = ['q1', 'q2', 'q3', 'q4'];

const EMPTY_ROW = {
  customerGroup: '',
  customerName: '',
  spdvGroup: '',
  spdvName: '',
  t1: '0', t2: '0', t3: '0', t4: '0', t5: '0', t6: '0',
  t7: '0', t8: '0', t9: '0', t10: '0', t11: '0', t12: '0',
  q1: 0, q2: 0, q3: 0, q4: 0,
  nam: 0
};

const CUSTOMER_GROUPS = [
  'Khách hàng nội bộ - Tập đoàn trong nước',
  'Khách hàng nội bộ - Tập đoàn nước ngoài',
  'Khách hàng ngoài - Tập đoàn trong nước',
  'Khách hàng ngoài - Tập đoàn nước ngoài'
];

const CUSTOMER_NAMES_MAP = {
  'Khách hàng nội bộ - Tập đoàn trong nước': [
    '0101111222 - Công ty A (Nội bộ)',
    '0101111333 - Tổng công ty B (Nội bộ)'
  ],
  'Khách hàng nội bộ - Tập đoàn nước ngoài': [
    '0202222333 - Công ty C (Nội bộ FDI)',
    '0202222444 - Công ty D (Nội bộ FDI)'
  ],
  'Khách hàng ngoài - Tập đoàn trong nước': [
    '0107654321 - Viettel (Tập đoàn Viettel)',
    '0109876543 - FPT (Tập đoàn FPT)',
    '0101112223 - Masan (Tập đoàn Masan)',
    '0105556667 - Công ty E (Ngoài)'
  ],
  'Khách hàng ngoài - Tập đoàn nước ngoài': [
    '0101234567 - Hakuhodo (Hakuhodo Việt Nam)',
    '0303333444 - Toyota Việt Nam (Toyota)',
    '0404444555 - Samsung Vina (Samsung)'
  ]
};

const SPDV_GROUPS = ['DV CC outsourcing', 'DV BPO', 'CSKH', 'Giải pháp'];

const SPDV_NAMES_MAP = {
  'DV CC outsourcing': ['SP001 - Dịch vụ FO', 'SP002 - Dịch vụ BO', 'SP003 - Dịch vụ IT Support'],
  'DV BPO': ['SP002 - Dịch vụ BO', 'SP004 - Dịch vụ Data Entry', 'SP005 - Dịch vụ Call Center'],
  'CSKH': ['SP006 - Dịch vụ CSKH 24/7', 'SP007 - Khảo sát khách hàng'],
  'Giải pháp': ['SP008 - Giải pháp ERP', 'SP009 - Giải pháp HRM', 'SP010 - Giải pháp CRM']
};

const GoalForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [planYear, setPlanYear] = useState('2026');
  const [statusLabel, setStatusLabel] = useState('Mới tạo');
  const [activeSideTab, setActiveSideTab] = useState('comment');
  const [commentInput, setCommentInput] = useState('');
  const [existingRows, setExistingRows] = useState([{ ...EMPTY_ROW }]);
  const [newCustomerPlan, setNewCustomerPlan] = useState({
    t1: '0', t2: '0', t3: '0', t4: '0', t5: '0', t6: '0',
    t7: '0', t8: '0', t9: '0', t10: '0', t11: '0', t12: '0',
    q1: 0, q2: 0, q3: 0, q4: 0,
    nam: 0
  });
  const [attachmentFiles, setAttachmentFiles] = useState([]);
  const [historyLogs, setHistoryLogs] = useState([]);
  const [comments, setComments] = useState([]);

  const isReadOnlyForm = statusLabel === 'Hiệu lực';

  const isMonthDisabled = (monthIndex) => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const selectedYearNum = parseInt(planYear, 10);

    if (selectedYearNum < currentYear) {
      return true;
    } else if (selectedYearNum === currentYear) {
      return monthIndex < currentMonth;
    }
    return false;
  };

  useEffect(() => {
    if (isEdit) {
      const goal = mockStore.getGoal(id);
      if (goal) {
        setPlanYear(goal.planYear || '2026');
        setStatusLabel(goal.statusLabel || 'Mới tạo');
        if (goal.existingRows && goal.existingRows.length > 0) {
          setExistingRows(goal.existingRows);
        } else {
          setExistingRows([
            {
              ...EMPTY_ROW,
              customerGroup: goal.category || '',
              customerName: goal.name || '',
              spdvGroup: goal.subCategory || '',
              spdvName: goal.unit || '',
            }
          ]);
        }
        if (goal.newCustomerPlan) {
          setNewCustomerPlan(goal.newCustomerPlan);
        }
        if (goal.attachmentFiles) {
          setAttachmentFiles(goal.attachmentFiles);
        }
        setHistoryLogs(goal.historyLogs || []);
        setComments(goal.comments || []);
      }
    }
  }, [id, isEdit]);

  const validateForm = (saveId) => {
    // Basic verification: Check required fields are not empty
    if (!planYear) {
      alert('Năm kế hoạch là trường bắt buộc.');
      return false;
    }

    for (let i = 0; i < existingRows.length; i++) {
      const r = existingRows[i];
      if (!r.customerGroup || !r.customerName || !r.spdvGroup || !r.spdvName) {
        alert(`Dòng thứ ${i + 1} của Bảng chỉ tiêu doanh thu khách hàng hiện hữu chưa nhập đầy đủ thông tin bắt buộc.`);
        return false;
      }
      
      // Numeric values validation: must be >= 0
      for (const mKey of MONTH_KEYS) {
        const val = parseFloat(r[mKey]);
        if (isNaN(val) || val < 0) {
          alert(`Dòng thứ ${i + 1}, tháng ${mKey.toUpperCase()} nhập sai định dạng số (phải >= 0).`);
          return false;
        }
      }
    }

    for (const mKey of MONTH_KEYS) {
      const val = parseFloat(newCustomerPlan[mKey]);
      if (isNaN(val) || val < 0) {
        alert(`Phần chỉ tiêu khách hàng mới, tháng ${mKey.toUpperCase()} nhập sai định dạng số (phải >= 0).`);
        return false;
      }
    }

    // BR 2: Check trùng giữa các bản ghi và trong cùng 1 bản ghi
    const seen = new Set();
    for (let i = 0; i < existingRows.length; i++) {
      const row = existingRows[i];
      const key = `${row.customerName}_${row.spdvName}_${planYear}`;
      if (seen.has(key)) {
        alert(`bản ghi đã tồn tại (Lỗi trùng lặp khách hàng + SPDV + năm ở dòng thứ ${i + 1})`);
        return false;
      }
      seen.add(key);
    }

    const allGoals = mockStore.getAllGoals();
    for (let i = 0; i < existingRows.length; i++) {
      const row = existingRows[i];
      const duplicateFound = allGoals.some(goal => {
        if (goal.id === saveId) return false;
        if (goal.planYear === planYear) {
          if (goal.existingRows && goal.existingRows.some(r => r.customerName === row.customerName && r.spdvName === row.spdvName)) {
            return true;
          }
        }
        return false;
      });

      if (duplicateFound) {
        alert(`bản ghi đã tồn tại (Kế hoạch cho khách hàng ${row.customerName.split(' - ')[1]} và sản phẩm ${row.spdvName.split(' - ')[1]} trong năm ${planYear} đã tồn tại trong hệ thống)`);
        return false;
      }
    }

    return true;
  };

  const saveDraft = () => {
    const saveId = isEdit ? id : mockStore.getNextGoalId();
    
    if (!validateForm(saveId)) {
      return;
    }

    mockStore.saveGoal(saveId, {
      id: saveId,
      planYear,
      statusLabel: 'Mới tạo',
      existingRows,
      newCustomerPlan,
      attachmentFiles,
      comments,
      historyLogs: [
        {
          id: Date.now(),
          action: isEdit ? 'Cập nhật mục tiêu doanh số' : 'Tạo mới mục tiêu doanh số',
          user: 'Admin',
          time: new Date().toLocaleString('vi-VN')
        },
        ...historyLogs
      ]
    });

    alert('Lưu thành công');
    if (!isEdit) {
      navigate(`/goal/edit/${saveId}`);
    } else {
      window.location.reload();
    }
  };

  const submitForm = () => {
    const saveId = isEdit ? id : mockStore.getNextGoalId();

    if (!validateForm(saveId)) {
      return;
    }

    mockStore.saveGoal(saveId, {
      id: saveId,
      planYear,
      statusLabel: 'Hiệu lực',
      existingRows,
      newCustomerPlan,
      attachmentFiles,
      comments,
      historyLogs: [
        {
          id: Date.now() + 1,
          action: 'Gửi phê duyệt mục tiêu doanh số',
          user: 'Admin',
          time: new Date().toLocaleString('vi-VN')
        },
        {
          id: Date.now(),
          action: isEdit ? 'Cập nhật mục tiêu doanh số' : 'Tạo mới mục tiêu doanh số',
          user: 'Admin',
          time: new Date().toLocaleString('vi-VN')
        },
        ...historyLogs
      ]
    });

    alert('Tạo mới mục tiêu doanh số thành công');
    if (!isEdit) {
      navigate(`/goal/edit/${saveId}`);
    } else {
      setStatusLabel('Hiệu lực');
      window.location.reload();
    }
  };

  const deleteGoal = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa kế hoạch doanh số này không?')) {
      mockStore.deleteGoal(id);
      alert('Xóa mục tiêu doanh số thành công');
      navigate('/goals');
    }
  };

  const addExistingRow = () => {
    setExistingRows(prev => [...prev, { ...EMPTY_ROW }]);
  };

  const removeExistingRow = (index) => {
    setExistingRows(prev => prev.filter((_, idx) => idx !== index));
  };

  const updateExistingRow = (index, key, value) => {
    setExistingRows(prev =>
      prev.map((row, idx) => {
        if (idx !== index) return row;

        const updatedRow = { ...row, [key]: value };

        // Cascading reset
        if (key === 'customerGroup') {
          updatedRow.customerName = '';
        } else if (key === 'spdvGroup') {
          updatedRow.spdvName = '';
        }

        // Auto-calculation if monthly target changes
        if (key.startsWith('t')) {
          const getVal = (val) => parseFloat(val) || 0;
          const t1 = key === 't1' ? getVal(value) : getVal(row.t1);
          const t2 = key === 't2' ? getVal(value) : getVal(row.t2);
          const t3 = key === 't3' ? getVal(value) : getVal(row.t3);
          const t4 = key === 't4' ? getVal(value) : getVal(row.t4);
          const t5 = key === 't5' ? getVal(value) : getVal(row.t5);
          const t6 = key === 't6' ? getVal(value) : getVal(row.t6);
          const t7 = key === 't7' ? getVal(value) : getVal(row.t7);
          const t8 = key === 't8' ? getVal(value) : getVal(row.t8);
          const t9 = key === 't9' ? getVal(value) : getVal(row.t9);
          const t10 = key === 't10' ? getVal(value) : getVal(row.t10);
          const t11 = key === 't11' ? getVal(value) : getVal(row.t11);
          const t12 = key === 't12' ? getVal(value) : getVal(row.t12);

          updatedRow.q1 = t1 + t2 + t3;
          updatedRow.q2 = t4 + t5 + t6;
          updatedRow.q3 = t7 + t8 + t9;
          updatedRow.q4 = t10 + t11 + t12;
          updatedRow.nam = t1 + t2 + t3 + t4 + t5 + t6 + t7 + t8 + t9 + t10 + t11 + t12;
        }

        return updatedRow;
      })
    );
  };

  const updateNewCustomerPlan = (key, value) => {
    setNewCustomerPlan(prev => {
      const updated = { ...prev, [key]: value };
      
      const getVal = (val) => parseFloat(val) || 0;
      const t1 = key === 't1' ? getVal(value) : getVal(prev.t1);
      const t2 = key === 't2' ? getVal(value) : getVal(prev.t2);
      const t3 = key === 't3' ? getVal(value) : getVal(prev.t3);
      const t4 = key === 't4' ? getVal(value) : getVal(prev.t4);
      const t5 = key === 't5' ? getVal(value) : getVal(prev.t5);
      const t6 = key === 't6' ? getVal(value) : getVal(prev.t6);
      const t7 = key === 't7' ? getVal(value) : getVal(prev.t7);
      const t8 = key === 't8' ? getVal(value) : getVal(prev.t8);
      const t9 = key === 't9' ? getVal(value) : getVal(prev.t9);
      const t10 = key === 't10' ? getVal(value) : getVal(prev.t10);
      const t11 = key === 't11' ? getVal(value) : getVal(prev.t11);
      const t12 = key === 't12' ? getVal(value) : getVal(prev.t12);

      updated.q1 = t1 + t2 + t3;
      updated.q2 = t4 + t5 + t6;
      updated.q3 = t7 + t8 + t9;
      updated.q4 = t10 + t11 + t12;
      updated.nam = t1 + t2 + t3 + t4 + t5 + t6 + t7 + t8 + t9 + t10 + t11 + t12;

      return updated;
    });
  };

  const handleAttachmentUpload = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map(file => ({
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: 'Kế hoạch mục tiêu năm',
      description: '',
      uploadedAt: new Date().toLocaleString('vi-VN')
    }));
    setAttachmentFiles(prev => [...prev, ...newFiles]);
  };

  const postComment = () => {
    if (!commentInput.trim()) return;
    const item = {
      id: Date.now(),
      text: commentInput.trim(),
      author: 'A',
      time: 'vừa xong'
    };
    setComments(prev => [item, ...prev]);
    setCommentInput('');
  };

  const currentStepNum = statusLabel === 'Hiệu lực' ? 3 : (statusLabel === 'Chờ điều chỉnh' ? 2 : 1);

  return (
    <div className="goal-screen">
      {/* Top Navigation & Action Header */}
      <div className="goal-topbar">
        <button className="btn-back" type="button" onClick={() => navigate('/goals')}>
          <ArrowLeft size={16} />
          Quay lại
        </button>

        <div className="goal-stepper">
          {STEPS.map((step) => (
            <React.Fragment key={step.num}>
              <div className="step-item">
                <div className={`step-circle ${step.num === currentStepNum ? 'active' : ''}`}>
                  {step.num}
                </div>
                <span className={`step-label ${step.num === currentStepNum ? 'active' : ''}`}>
                  {step.label}
                </span>
              </div>
              {step.num < STEPS.length && <div className="step-line" />}
            </React.Fragment>
          ))}
        </div>

        <div className="topbar-actions">
          {isEdit && statusLabel === 'Mới tạo' && (
            <button className="btn-delete-goal" type="button" onClick={deleteGoal} style={{ marginRight: '8px' }}>
              Xóa mục tiêu
            </button>
          )}
          <button className="btn-cancel" type="button" onClick={() => navigate('/goals')}>
            Hủy
          </button>
          <button className="btn-save" type="button" onClick={saveDraft} disabled={isReadOnlyForm}>
            <Save size={16} />
            Lưu
          </button>
          <button className="btn-submit" type="button" onClick={submitForm} disabled={isReadOnlyForm}>
            Gửi
          </button>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="goal-body-grid">
        {/* Left Main Column */}
        <div className="goal-main-col">
          {/* Card 1: Thông tin kế hoạch */}
          <section className="goal-card">
            <div className="goal-card-header">
              <h3>Thông tin kế hoạch doanh thu năm</h3>
              <span className="badge-status">{statusLabel}</span>
            </div>

            <div className="card-box-inner">
              <div className="field-inline-row" style={{ display: 'flex', gap: '32px' }}>
                <div className="form-group-inline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <label className="field-label">Mã mục tiêu</label>
                  <input
                    type="text"
                    className="month-input readonly-input"
                    value={id || 'Sẽ tự động sinh'}
                    disabled
                    style={{ width: '150px', height: '36px', border: '1px solid #d9d9d9', borderRadius: '6px', textAlign: 'center', backgroundColor: '#f5f5f5', color: '#595959', cursor: 'not-allowed' }}
                  />
                </div>
                <div className="form-group-inline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <label className="field-label">
                    Năm Kế Hoạch <span className="req-star">*</span>
                  </label>
                  <div className="select-wrapper">
                    <select value={planYear} onChange={(e) => setPlanYear(e.target.value)} disabled={isReadOnlyForm}>
                      {YEAR_OPTIONS.map((year) => {
                        const isPastYear = parseInt(year, 10) < new Date().getFullYear();
                        return (
                          <option key={year} value={year} disabled={isPastYear}>
                            {year}
                          </option>
                        );
                      })}
                    </select>
                    <ChevronDown className="select-arrow" size={16} />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Card 2: Bảng chỉ tiêu doanh thu khách hàng hiện hữu */}
          <section className="goal-card">
            <div className="goal-card-header">
              <h3>Bảng chỉ tiêu doanh thu khách hàng hiện hữu</h3>
            </div>


            <div className="table-container scrollable-table-container">
              <table className="goal-data-table unified-grid-table">
                <thead>
                  <tr>
                    <th rowSpan={2} style={{ width: '40px' }}></th>
                    <th rowSpan={2} style={{ minWidth: '150px' }}>
                      <div className="th-content">
                        <span>Nhóm khách hàng</span>
                        <div className="th-icons">
                          <ArrowUpDown size={12} />
                          <Filter size={12} />
                        </div>
                      </div>
                    </th>
                    <th rowSpan={2} style={{ minWidth: '150px' }}>
                      <div className="th-content">
                        <span>Tên khách hàng</span>
                        <div className="th-icons">
                          <ArrowUpDown size={12} />
                          <Filter size={12} />
                        </div>
                      </div>
                    </th>
                    <th rowSpan={2} style={{ minWidth: '150px' }}>
                      <div className="th-content">
                        <span>Nhóm SPDV</span>
                        <div className="th-icons">
                          <ArrowUpDown size={12} />
                          <Filter size={12} />
                        </div>
                      </div>
                    </th>
                    <th rowSpan={2} style={{ minWidth: '150px' }}>
                      <div className="th-content">
                        <span>Tên SPDV</span>
                        <div className="th-icons">
                          <ArrowUpDown size={12} />
                          <Filter size={12} />
                        </div>
                      </div>
                    </th>
                    <th colSpan={17} style={{ textAlign: 'center' }}>
                      Kế hoạch doanh thu năm
                    </th>
                  </tr>
                  <tr>
                    {Array.from({ length: 12 }, (_, i) => (
                      <th key={`t${i+1}`} className="sub-th-month">T{i+1}</th>
                    ))}
                    {Array.from({ length: 4 }, (_, i) => (
                      <th key={`q${i+1}`} className="sub-th-quarter">Q{i+1}</th>
                    ))}
                    <th className="sub-th-year">Năm</th>
                  </tr>
                </thead>
                <tbody>
                  {existingRows.map((row, rowIndex) => {
                    const availableNames = CUSTOMER_NAMES_MAP[row.customerGroup] || [];
                    const availableSpdvNames = SPDV_NAMES_MAP[row.spdvGroup] || [];

                    return (
                      <tr key={`existing_${rowIndex}`}>
                        <td className="td-action">
                          <button className="btn-icon-delete" type="button" onClick={() => removeExistingRow(rowIndex)}>
                            <Trash2 size={16} />
                          </button>
                        </td>
                        <td>
                          <div className="select-wrapper table-select">
                            <select
                              value={row.customerGroup}
                              onChange={(e) => updateExistingRow(rowIndex, 'customerGroup', e.target.value)}
                            >
                              <option value="">-- Chọn giá trị --</option>
                              {CUSTOMER_GROUPS.map((item) => <option key={item} value={item}>{item}</option>)}
                            </select>
                            <ChevronDown className="select-arrow" size={14} />
                          </div>
                        </td>
                        <td>
                          <div className="select-wrapper table-select">
                            <select
                              value={row.customerName}
                              onChange={(e) => updateExistingRow(rowIndex, 'customerName', e.target.value)}
                              disabled={!row.customerGroup}
                            >
                              <option value="">-- Chọn giá trị --</option>
                              {availableNames.map((item) => <option key={item} value={item}>{item}</option>)}
                            </select>
                            <ChevronDown className="select-arrow" size={14} />
                          </div>
                        </td>
                        <td>
                          <div className="select-wrapper table-select">
                            <select
                              value={row.spdvGroup}
                              onChange={(e) => updateExistingRow(rowIndex, 'spdvGroup', e.target.value)}
                            >
                              <option value="">-- Chọn giá trị --</option>
                              {SPDV_GROUPS.map((item) => <option key={item} value={item}>{item}</option>)}
                            </select>
                            <ChevronDown className="select-arrow" size={14} />
                          </div>
                        </td>
                        <td>
                          <div className="select-wrapper table-select">
                            <select
                              value={row.spdvName}
                              onChange={(e) => updateExistingRow(rowIndex, 'spdvName', e.target.value)}
                              disabled={!row.spdvGroup}
                            >
                              <option value="">-- Chọn giá trị --</option>
                              {availableSpdvNames.map((item) => <option key={item} value={item}>{item}</option>)}
                            </select>
                            <ChevronDown className="select-arrow" size={14} />
                          </div>
                        </td>

                        {MONTH_KEYS.map((mKey) => (
                          <td key={mKey} className="td-month-input">
                            <input
                              type="text"
                              className="month-grid-input"
                              value={row[mKey]}
                              onChange={(e) => updateExistingRow(rowIndex, mKey, e.target.value)}
                            />
                          </td>
                        ))}

                        {QUARTER_KEYS.map((qKey) => (
                          <td key={qKey} className="td-quarter-input">
                            <input
                              type="text"
                              className="month-grid-input readonly-input"
                              value={row[qKey]}
                              readOnly
                            />
                          </td>
                        ))}

                        <td className="td-year-input">
                          <input
                            type="text"
                            className="month-grid-input readonly-input"
                            value={row.nam}
                            readOnly
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="table-footer-action">
              <button type="button" className="btn-add-row" onClick={addExistingRow}>
                <Plus size={16} />
                Thêm dòng
              </button>
            </div>
          </section>

          {/* Card 3: Chỉ tiêu doanh thu khách hàng mới */}
          <section className="goal-card">
            <div className="goal-card-header">
              <h3>Chỉ tiêu doanh thu khách hàng mới</h3>
            </div>

            <div className="table-container scrollable-table-container">
              <table className="goal-data-table month-table">
                <thead>
                  <tr>
                    <th colSpan={17} style={{ textAlign: 'center' }}>
                      Kế hoạch doanh thu năm
                    </th>
                  </tr>
                  <tr>
                    {Array.from({ length: 12 }, (_, i) => (
                      <th key={`new_t${i+1}`} className="sub-th-month">T{i+1}</th>
                    ))}
                    {Array.from({ length: 4 }, (_, i) => (
                      <th key={`new_q${i+1}`} className="sub-th-quarter">Q{i+1}</th>
                    ))}
                    <th className="sub-th-year">Năm</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {MONTH_KEYS.map((mKey) => (
                      <td key={`new_input_${mKey}`} className="td-month-input">
                        <input
                          type="text"
                          className="month-grid-input"
                          value={newCustomerPlan[mKey]}
                          onChange={(e) => updateNewCustomerPlan(mKey, e.target.value)}
                        />
                      </td>
                    ))}
                    {QUARTER_KEYS.map((qKey) => (
                      <td key={`new_input_${qKey}`} className="td-quarter-input">
                        <input
                          type="text"
                          className="month-grid-input readonly-input"
                          value={newCustomerPlan[qKey]}
                          readOnly
                        />
                      </td>
                    ))}
                    <td className="td-year-input">
                      <input
                        type="text"
                        className="month-grid-input readonly-input"
                        value={newCustomerPlan.nam}
                        readOnly
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Card 4: Khối tài liệu */}
          <section className="goal-card" style={{ marginTop: '16px' }}>
            <div className="goal-card-header">
              <h3 style={{ fontSize: '15px', fontWeight: '600' }}>Tài liệu</h3>
            </div>
            <div className="notebook-content">
              <label
                htmlFor="goal-doc-upload"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '100px',
                  border: '1px dashed #cbd5e1',
                  borderRadius: '8px',
                  background: '#fafafa',
                  cursor: isReadOnlyForm ? 'not-allowed' : 'pointer',
                  marginBottom: '16px',
                  padding: '16px'
                }}
              >
                <ArrowDownToLine size={24} color="#0f3a66" />
                <div style={{ marginTop: '8px', fontSize: '14px', fontWeight: 600, color: '#1f2937' }}>Drag and drop or Browse your file</div>
                <div style={{ marginTop: '4px', fontSize: '12px', color: '#64748b' }}>Tối đa 20MB mỗi file</div>
              </label>
              <input id="goal-doc-upload" type="file" multiple style={{ display: 'none' }} onChange={handleAttachmentUpload} disabled={isReadOnlyForm} />
              
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                <table className="goal-data-table doc-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <tr>
                      <th style={{ padding: '10px', textAlign: 'left', width: '50px' }}>No</th>
                      <th style={{ padding: '10px', textAlign: 'left' }}>Tài liệu</th>
                      <th style={{ padding: '10px', textAlign: 'left', width: '200px' }}>Loại chứng từ</th>
                      <th style={{ padding: '10px', textAlign: 'left' }}>Nội dung tài liệu</th>
                      <th style={{ padding: '10px', textAlign: 'left', width: '180px' }}>Thời điểm tải lên</th>
                      <th style={{ padding: '10px', textAlign: 'center', width: '70px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attachmentFiles.length === 0 ? (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', color: '#94a3b8', padding: '20px 10px' }}>
                          Chưa có tài liệu nào được tải lên
                        </td>
                      </tr>
                    ) : (
                      attachmentFiles.map((file, index) => (
                        <tr key={file.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '8px 10px' }}>{index + 1}</td>
                          <td style={{ padding: '8px 10px', color: '#2563eb' }}>{file.name}</td>
                          <td style={{ padding: '8px 10px' }}>
                            <select
                              className="form-control"
                              style={{ width: '100%', padding: '6px', border: '1px solid #d9d9d9', borderRadius: '4px', background: '#ffffff', color: '#262626' }}
                              value={file.type || 'Kế hoạch mục tiêu năm'}
                              onChange={(e) => setAttachmentFiles((prev) => prev.map((f) => (f.id === file.id ? { ...f, type: e.target.value } : f)))}
                              disabled={isReadOnlyForm}
                            >
                              <option value="Kế hoạch mục tiêu năm">Kế hoạch mục tiêu năm</option>
                              <option value="Báo giá">Báo giá</option>
                              <option value="Hợp đồng">Hợp đồng</option>
                              <option value="Tài liệu kỹ thuật">Tài liệu kỹ thuật</option>
                              <option value="Khác">Khác</option>
                            </select>
                          </td>
                          <td style={{ padding: '8px 10px' }}>
                            <input
                              type="text"
                              className="form-control"
                              style={{ width: '100%', padding: '6px', border: '1px solid #d9d9d9', borderRadius: '4px', background: '#ffffff', color: '#262626' }}
                              placeholder="Nhập nội dung tài liệu..."
                              value={file.description || ''}
                              onChange={(e) => setAttachmentFiles((prev) => prev.map((f) => (f.id === file.id ? { ...f, description: e.target.value } : f)))}
                              disabled={isReadOnlyForm}
                            />
                          </td>
                          <td style={{ padding: '8px 10px', color: '#64748b' }}>{file.uploadedAt || '-'}</td>
                          <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                            <button
                              title="Xóa"
                              type="button"
                              style={{ background: 'none', border: 'none', color: '#ef4444', cursor: isReadOnlyForm ? 'not-allowed' : 'pointer', padding: 0 }}
                              onClick={() => setAttachmentFiles((prev) => prev.filter((f) => f.id !== file.id))}
                              disabled={isReadOnlyForm}
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>

        {/* Right Sidebar Column */}
        <aside className="goal-side-col">
          <section className="side-card">
            <div className="side-tabs">
              <button
                type="button"
                className={`tab-btn ${activeSideTab === 'comment' ? 'active' : ''}`}
                onClick={() => setActiveSideTab('comment')}
              >
                <MessageSquare size={14} /> COMMENT
              </button>
              <button
                type="button"
                className={`tab-btn ${activeSideTab === 'history' ? 'active' : ''}`}
                onClick={() => setActiveSideTab('history')}
              >
                <History size={14} /> LỊCH SỬ
              </button>
            </div>

            <div className="side-content">
              {activeSideTab === 'comment' ? (
                comments.length > 0 ? (
                  <div className="comment-list">
                    {comments.map((item) => (
                      <div key={item.id} className="comment-item">
                        <div className="user-avatar">A</div>
                        <div className="comment-bubble">
                          <div className="comment-meta">{item.time}</div>
                          <div className="comment-text">{item.text}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state-text">Chưa có nội dung.</div>
                )
              ) : (
                historyLogs.length > 0 ? (
                  <div className="history-list">
                    {historyLogs.map((item) => (
                      <div key={item.id} className="history-item">
                        <div className="history-title">{item.action}</div>
                        <div className="history-user" style={{ fontSize: '11px', color: '#8c8c8c', marginTop: '2px' }}>
                          Người thực hiện: {item.user || 'Admin'}
                        </div>
                        <div className="history-time">{item.time}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state-text">Chưa có lịch sử.</div>
                )
              )}
            </div>

            <div className="side-comment-footer">
              <div className="comment-input-row">
                <div className="user-avatar olive">A</div>
                <textarea
                  className="comment-textarea"
                  placeholder="Viết comment..."
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                />
              </div>
              <div className="comment-send-row">
                <button className="btn-send-comment" type="button" onClick={postComment}>
                  <Send size={13} /> Gửi
                </button>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default GoalForm;