import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Send,
  Plus,
  Trash2,
  MessageSquareText,
  History,
  Filter
} from 'lucide-react';

import './BusinessPlanForm.css';

const YEAR_OPTIONS = ['2025', '2026', '2027', '2028'];
const MONTH_LABELS = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];

const CUSTOMER_GROUP_OPTIONS = ['Doanh nghiệp lớn', 'SME', 'Public Sector', 'Startup'];
const CUSTOMER_NAME_OPTIONS = ['Hakuhodo', 'Toyota', 'VinFast', 'Unilever'];
const SERVICE_GROUP_OPTIONS = ['Media', 'Digital', 'PR', 'Activation'];
const PLAN_NAME_OPTIONS = ['Kế hoạch thương hiệu', 'Kế hoạch mở rộng', 'Kế hoạch duy trì'];

const WORKFLOW_STEPS = [
  { id: 1, label: 'Mới tạo' },
  { id: 2, label: 'Chờ điều chỉnh' },
  { id: 3, label: 'Hiệu lực' }
];

const createRow = () => ({
  id: `row_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
  customerGroup: '',
  customerName: '',
  serviceGroup: '',
  planName: ''
});

const renderSelect = (value, options, onChange) => (
  <select className="bp-select" value={value} onChange={onChange}>
    <option value="">-- Chọn giá trị --</option>
    {options.map(opt => (
      <option key={opt} value={opt}>{opt}</option>
    ))}
  </select>
);

const BusinessPlanForm = () => {
  const navigate = useNavigate();

  const [currentStep] = useState(1);
  const [planYear, setPlanYear] = useState('2026');
  const [existingRows, setExistingRows] = useState([createRow()]);
  const [monthTargets, setMonthTargets] = useState(
    MONTH_LABELS.reduce((acc, month) => ({ ...acc, [month]: '' }), {})
  );
  const [activePanel, setActivePanel] = useState('comment');
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);

  const yearlyTotal = useMemo(
    () => MONTH_LABELS.reduce((sum, month) => sum + Number(monthTargets[month] || 0), 0),
    [monthTargets]
  );

  const addExistingRow = () => {
    setExistingRows(prev => [...prev, createRow()]);
  };

  const removeExistingRow = (id) => {
    setExistingRows(prev => prev.filter(row => row.id !== id));
  };

  const updateExistingRow = (id, field, value) => {
    setExistingRows(prev => prev.map(row => (
      row.id === id ? { ...row, [field]: value } : row
    )));
  };

  const updateMonthTarget = (month, value) => {
    setMonthTargets(prev => ({ ...prev, [month]: value }));
  };

  const handleSendComment = () => {
    if (!commentText.trim()) return;
    setComments(prev => [...prev, { id: Date.now(), text: commentText.trim() }]);
    setCommentText('');
  };

  return (
    <div className="bp-page">
      <div className="bp-topbar bp-card">
        <button className="bp-btn bp-btn-ghost" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
          Quay lại
        </button>

        <div className="bp-stepper">
          {WORKFLOW_STEPS.map((step, index) => {
            const isActive = step.id === currentStep;
            return (
              <React.Fragment key={step.id}>
                <div className="bp-step-item">
                  <div className={`bp-step-dot ${isActive ? 'is-active' : ''}`}>{step.id}</div>
                  <div className={`bp-step-label ${isActive ? 'is-active' : ''}`}>{step.label}</div>
                </div>
                {index < WORKFLOW_STEPS.length - 1 && <div className="bp-step-line" />}
              </React.Fragment>
            );
          })}
        </div>

        <div className="bp-action-group">
          <button className="bp-btn bp-btn-ghost">Hủy</button>
          <button className="bp-btn bp-btn-outline">
            <Save size={16} />
            Lưu
          </button>
          <button className="bp-btn bp-btn-primary">
            <Send size={16} />
            Gửi
          </button>
        </div>
      </div>

      <div className="bp-layout">
        <main className="bp-main-col">
          <section className="bp-card bp-section-card">
            <div className="bp-section-head">
              <h2>Thông tin kế hoạch doanh thu năm</h2>
              <span className="bp-badge">Mới tạo</span>
            </div>

            <div className="bp-year-row">
              <label htmlFor="planYear">Năm Kế Hoạch <span>*</span></label>
              <select
                id="planYear"
                className="bp-select bp-year-select"
                value={planYear}
                onChange={e => setPlanYear(e.target.value)}
              >
                {YEAR_OPTIONS.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </section>

          <section className="bp-card bp-section-card">
            <h2>Bảng chỉ tiêu doanh thu khách hàng hiện hữu</h2>

            <div className="bp-table-wrap">
              <table className="bp-table">
                <thead>
                  <tr>
                    <th className="bp-col-action" />
                    <th>
                      <span className="bp-header-with-icon">
                        Nhóm khách hàng
                        <Filter size={14} />
                      </span>
                    </th>
                    <th>
                      <span className="bp-header-with-icon">
                        Tên khách hàng
                        <Filter size={14} />
                      </span>
                    </th>
                    <th>
                      <span className="bp-header-with-icon">
                        Nhóm SPDV
                        <Filter size={14} />
                      </span>
                    </th>
                    <th>Tên</th>
                  </tr>
                </thead>
                <tbody>
                  {existingRows.map(row => (
                    <tr key={row.id}>
                      <td className="bp-col-action">
                        <button
                          className="bp-icon-btn"
                          onClick={() => removeExistingRow(row.id)}
                          disabled={existingRows.length === 1}
                          title="Xóa dòng"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                      <td>{renderSelect(row.customerGroup, CUSTOMER_GROUP_OPTIONS, e => updateExistingRow(row.id, 'customerGroup', e.target.value))}</td>
                      <td>{renderSelect(row.customerName, CUSTOMER_NAME_OPTIONS, e => updateExistingRow(row.id, 'customerName', e.target.value))}</td>
                      <td>{renderSelect(row.serviceGroup, SERVICE_GROUP_OPTIONS, e => updateExistingRow(row.id, 'serviceGroup', e.target.value))}</td>
                      <td>{renderSelect(row.planName, PLAN_NAME_OPTIONS, e => updateExistingRow(row.id, 'planName', e.target.value))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bp-row-action">
              <button className="bp-link-btn" onClick={addExistingRow}>
                <Plus size={16} />
                Thêm dòng
              </button>
            </div>
          </section>

          <section className="bp-card bp-section-card">
            <h2>Chỉ tiêu doanh thu khách hàng mới</h2>

            <div className="bp-month-grid">
              {MONTH_LABELS.map(month => (
                <div key={month} className="bp-month-cell">
                  <span>{month}</span>
                  <input
                    type="number"
                    value={monthTargets[month]}
                    onChange={e => updateMonthTarget(month, e.target.value)}
                    placeholder="0"
                  />
                </div>
              ))}

              <div className="bp-month-cell bp-year-total-cell">
                <span>Kế hoạch cả năm</span>
                <div className="bp-total-value">{new Intl.NumberFormat('vi-VN').format(yearlyTotal)}</div>
              </div>
            </div>
          </section>
        </main>

        <aside className="bp-side-col bp-card">
          <div className="bp-side-tabs">
            <button
              className={`bp-side-tab ${activePanel === 'comment' ? 'is-active' : ''}`}
              onClick={() => setActivePanel('comment')}
            >
              <MessageSquareText size={16} />
              COMMENT
            </button>
            <button
              className={`bp-side-tab ${activePanel === 'history' ? 'is-active' : ''}`}
              onClick={() => setActivePanel('history')}
            >
              <History size={16} />
              LỊCH SỬ
            </button>
          </div>

          {activePanel === 'comment' ? (
            <div className="bp-comment-panel">
              <div className="bp-comment-list">
                {comments.length === 0 ? (
                  <div className="bp-empty">Chưa có nội dung.</div>
                ) : (
                  comments.map(item => (
                    <div key={item.id} className="bp-comment-item">{item.text}</div>
                  ))
                )}
              </div>

              <div className="bp-comment-form">
                <textarea
                  placeholder="Viết comment..."
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                />
                <button className="bp-btn bp-btn-primary" onClick={handleSendComment}>
                  <Send size={16} />
                  Gửi
                </button>
              </div>
            </div>
          ) : (
            <div className="bp-history-panel">
              <div className="bp-empty">Chưa có lịch sử thao tác.</div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default BusinessPlanForm;
