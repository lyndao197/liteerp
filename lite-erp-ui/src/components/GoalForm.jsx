import React, { useMemo, useState } from 'react';
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
  Filter
} from 'lucide-react';
import { mockStore } from '../utils/mockStore';
import './GoalForm.css';

const STEPS = [
  { num: 1, label: 'Mới tạo', active: true },
  { num: 2, label: 'Chờ điều chỉnh', active: false },
  { num: 3, label: 'Hiệu lực', active: false }
];

const YEAR_OPTIONS = ['2024', '2025', '2026', '2027', '2028'];
const MONTH_COLUMNS = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8'];

const EMPTY_EXISTING_ROW = {
  customerGroup: '',
  customerName: '',
  spdvGroup: '',
  targetName: ''
};

const GoalForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [planYear, setPlanYear] = useState('2026');
  const [statusLabel, setStatusLabel] = useState('Mới tạo');
  const [activeSideTab, setActiveSideTab] = useState('comment');
  const [commentInput, setCommentInput] = useState('');
  const [existingRows, setExistingRows] = useState([{ ...EMPTY_EXISTING_ROW }]);
  const [newCustomerPlan, setNewCustomerPlan] = useState(
    MONTH_COLUMNS.reduce((acc, month) => ({ ...acc, [month]: '' }), {})
  );
  const [historyLogs, setHistoryLogs] = useState([]);
  const [comments, setComments] = useState([]);

  const customerGroups = useMemo(() => ['VIP', 'Chiến lược', 'Doanh nghiệp', 'SME'], []);
  const customerNames = useMemo(() => ['Hakuhodo', 'Viettel', 'FPT', 'Masan'], []);
  const spdvGroups = useMemo(() => ['CSKH', 'Outsourcing', 'BPO', 'Giải pháp'], []);
  const targetNames = useMemo(() => ['Doanh thu năm', 'Doanh thu quý', 'Doanh thu theo gói'], []);

  const saveDraft = () => {
    const saveId = isEdit ? id : mockStore.getNextGoalId();
    mockStore.saveGoal(saveId, {
      id: saveId,
      planYear,
      statusLabel,
      existingRows,
      newCustomerPlan,
      comments,
      historyLogs
    });

    const log = {
      id: Date.now(),
      action: 'Lưu',
      time: new Date().toLocaleString('vi-VN')
    };
    setHistoryLogs(prev => [log, ...prev]);
    alert('Đã lưu dữ liệu kế hoạch.');
  };

  const submitForm = () => {
    saveDraft();
    setStatusLabel('Chờ điều chỉnh');
    const log = {
      id: Date.now() + 1,
      action: 'Gửi phê duyệt',
      time: new Date().toLocaleString('vi-VN')
    };
    setHistoryLogs(prev => [log, ...prev]);
  };

  const addExistingRow = () => {
    setExistingRows(prev => [...prev, { ...EMPTY_EXISTING_ROW }]);
  };

  const removeExistingRow = (index) => {
    setExistingRows(prev => prev.filter((_, idx) => idx !== index));
  };

  const updateExistingRow = (index, key, value) => {
    setExistingRows(prev => prev.map((row, idx) => (idx === index ? { ...row, [key]: value } : row)));
  };

  const updateMonthPlan = (month, value) => {
    setNewCustomerPlan(prev => ({ ...prev, [month]: value }));
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

  return (
    <div className="goal-screen">
      {/* Top Navigation & Action Header */}
      <div className="goal-topbar">
        <button className="btn-back" type="button" onClick={() => navigate('/goals')}>
          <ArrowLeft size={16} />
          Quay lại
        </button>

        <div className="goal-stepper">
          {STEPS.map((step, idx) => (
            <React.Fragment key={step.num}>
              <div className="step-item">
                <div className={`step-circle ${step.num === 1 ? 'active' : ''}`}>
                  {step.num}
                </div>
                <span className={`step-label ${step.num === 1 ? 'active' : ''}`}>
                  {step.label}
                </span>
              </div>
              {idx < STEPS.length - 1 && <div className="step-line" />}
            </React.Fragment>
          ))}
        </div>

        <div className="topbar-actions">
          <button className="btn-cancel" type="button" onClick={() => navigate('/goals')}>
            Hủy
          </button>
          <button className="btn-save" type="button" onClick={saveDraft}>
            <Save size={16} />
            Lưu
          </button>
          <button className="btn-submit" type="button" onClick={submitForm}>
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
              <div className="field-inline-row">
                <label className="field-label">
                  Năm Kế Hoạch <span className="req-star">*</span>
                </label>
                <div className="select-wrapper">
                  <select value={planYear} onChange={(e) => setPlanYear(e.target.value)}>
                    {YEAR_OPTIONS.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                  <ChevronDown className="select-arrow" size={16} />
                </div>
              </div>
            </div>
          </section>

          {/* Card 2: Bảng chỉ tiêu doanh thu khách hàng hiện hữu */}
          <section className="goal-card">
            <div className="goal-card-header">
              <h3>Bảng chỉ tiêu doanh thu khách hàng hiện hữu</h3>
            </div>

            <div className="table-container">
              <table className="goal-data-table">
                <thead>
                  <tr>
                    <th style={{ width: '40px' }}></th>
                    <th>
                      <div className="th-content">
                        <span>Nhóm khách hàng</span>
                        <div className="th-icons">
                          <ArrowUpDown size={12} />
                          <Filter size={12} />
                        </div>
                      </div>
                    </th>
                    <th>
                      <div className="th-content">
                        <span>Tên khách hàng</span>
                        <div className="th-icons">
                          <ArrowUpDown size={12} />
                          <Filter size={12} />
                        </div>
                      </div>
                    </th>
                    <th>
                      <div className="th-content">
                        <span>Nhóm SPDV</span>
                        <div className="th-icons">
                          <ArrowUpDown size={12} />
                          <Filter size={12} />
                        </div>
                      </div>
                    </th>
                    <th>
                      <div className="th-content">
                        <span>Tên</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {existingRows.map((row, rowIndex) => (
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
                            {customerGroups.map((item) => <option key={item} value={item}>{item}</option>)}
                          </select>
                          <ChevronDown className="select-arrow" size={14} />
                        </div>
                      </td>
                      <td>
                        <div className="select-wrapper table-select">
                          <select
                            value={row.customerName}
                            onChange={(e) => updateExistingRow(rowIndex, 'customerName', e.target.value)}
                          >
                            <option value="">-- Chọn giá trị --</option>
                            {customerNames.map((item) => <option key={item} value={item}>{item}</option>)}
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
                            {spdvGroups.map((item) => <option key={item} value={item}>{item}</option>)}
                          </select>
                          <ChevronDown className="select-arrow" size={14} />
                        </div>
                      </td>
                      <td>
                        <div className="select-wrapper table-select">
                          <select
                            value={row.targetName}
                            onChange={(e) => updateExistingRow(rowIndex, 'targetName', e.target.value)}
                          >
                            <option value="">-- Chọn giá trị --</option>
                            {targetNames.map((item) => <option key={item} value={item}>{item}</option>)}
                          </select>
                          <ChevronDown className="select-arrow" size={14} />
                        </div>
                      </td>
                    </tr>
                  ))}
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
              <span className="sub-header-label">Kế hoạch cả năm</span>
            </div>

            <div className="table-container month-table-container">
              <table className="goal-data-table month-table">
                <thead>
                  <tr>
                    {MONTH_COLUMNS.map((month) => (
                      <th key={month}>{month}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {MONTH_COLUMNS.map((month) => (
                      <td key={`input_${month}`}>
                        <input
                          type="text"
                          className="month-input"
                          placeholder=""
                          value={newCustomerPlan[month]}
                          onChange={(e) => updateMonthPlan(month, e.target.value)}
                        />
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
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