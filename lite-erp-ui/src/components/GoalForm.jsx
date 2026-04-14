import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ChevronLeft, 
  Save, 
  Target,
  BarChart,
  Calendar,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Activity,
  Smile,
  Paperclip,
  Maximize2,
  Trash2,
  Trash,
  Plus
} from 'lucide-react';
import { mockStore } from '../utils/mockStore';
import './GoalForm.css';

const CATEGORY_TREE = {
  "Chỉ tiêu doanh thu": {
    "Doanh thu HĐ nội bộ": [],
    "Doanh thu từ Bảo hành": [],
    "Doanh thu HĐ ngoài": ["Dịch vụ CC Outsourcing", "Dịch vụ BPO", "Giải pháp", "DV khác"]
  },
  "Chỉ tiêu xúc tiến": {
    "Số lượng KH tiếp xúc": ["Dịch vụ CC Outsourcing", "Dịch vụ BPO", "Giải pháp", "DV khác"],
    "Số lượng KH tiềm năng": ["Dịch vụ CC Outsourcing", "Dịch vụ BPO", "Giải pháp", "DV khác"]
  },
  "Nhiệm vụ trọng tâm": {
    "Chuyên môn & Quy trình": [],
    "Hỗ trợ nghiệp vụ": [],
    "Nhiệm vụ khác": []
  }
};

const STEPS_ORDER = ['Mới', 'Đang thực hiện', 'Chờ đánh giá', 'Hoàn thành', 'Không hoàn thành'];

const GoalForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [chatterMessages, setChatterMessages] = useState([]);
  const [chatterInput, setChatterInput] = useState('');
  const [activeNotebookTab, setActiveNotebookTab] = useState('notes');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [employeeCols, setEmployeeCols] = useState([1]);
  const [reviewData, setReviewData] = useState({ result: 'Đạt 110% chỉ tiêu', score: '95' });

  const tableBorder = '1px solid #cbd5e1';
  const thStyle = { border: tableBorder, padding: '10px 8px', backgroundColor: '#f8fafc', whiteSpace: 'nowrap', textAlign: 'center', fontWeight: '600', verticalAlign: 'middle', color: '#1e293b', fontSize: '12px' };
  const tdStyle = { border: tableBorder, padding: '8px', verticalAlign: 'middle', color: '#334155' };
  const tdCenter = { ...tdStyle, textAlign: 'center' };
  const tdNum = { ...tdStyle, textAlign: 'right', fontWeight: '600' };
  const tdInputStyle = { ...tdStyle, padding: 0 };
  const inputBase = { width: '100%', border: 'none', padding: '8px', outline: 'none', background: 'transparent', color: 'inherit' };
  const inputCenter = { ...inputBase, textAlign: 'center' };
  const inputNumStyle = { ...inputBase, textAlign: 'right', fontWeight: '600' };

  const MOCK_EMPLOYEES = ['Anhbd2', 'Ducnt76', 'Hoang12', 'Tienltt1', 'Honglien', 'Sonnt12', 'Minhcv', 'Huongnt'];

  const [formData, setFormData] = useState({
    name: '',
    category: 'Chỉ tiêu doanh thu',
    subCategory: 'Doanh thu HĐ nội bộ',
    serviceType: '',
    measureMethod: '',
    unit: '',
    weight: '0',
    threshold: '',
    base: '',
    stretch: '',
    startDate: '',
    endDate: '',
    approvalStatus: 'Mới',
    actualProgress: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit) {
      const existing = mockStore.getGoal(id);
      if (existing) {
          // Backward compatibility if status doesn't match new schema
          if (!existing.approvalStatus) {
              existing.approvalStatus = existing.status === 'Inactive' ? 'Hoàn thành' : 'Mới';
          }
          if (existing.actualProgress === undefined) {
              existing.actualProgress = '';
          }
          setChatterMessages(existing.chatterMessages || []);
          setFormData(existing);
      }
    }
  }, [id, isEdit]);

  const isReadOnly = ['Chờ đánh giá', 'Hoàn thành', 'Không hoàn thành'].includes(formData.approvalStatus);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      // Handle cascading resets
      if (name === 'category') {
        const firstSub = Object.keys(CATEGORY_TREE[value] || {})[0] || '';
        newData.subCategory = firstSub;
        const firstService = (CATEGORY_TREE[value][firstSub] || [])[0] || '';
        newData.serviceType = firstService;
      } else if (name === 'subCategory') {
        const firstService = (CATEGORY_TREE[newData.category][value] || [])[0] || '';
        newData.serviceType = firstService;
      }

      return newData;
    });
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name?.trim()) newErrors.name = 'Vui lòng nhập tên mục tiêu';
    if (!formData.category) newErrors.category = 'Vui lòng chọn nhóm chỉ tiêu';
    if (!formData.startDate) newErrors.startDate = 'Vui lòng chọn ngày bắt đầu';
    if (!formData.endDate) newErrors.endDate = 'Vui lòng chọn ngày hoàn thành';
    if (!formData.weight || parseInt(formData.weight) < 0) newErrors.weight = 'Vui lòng nhập tỷ trọng hợp lệ';
    return newErrors;
  };

  const saveCurrentData = (newStatus = null) => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return null;
    }

    const saveId = isEdit ? id : mockStore.getNextGoalId();
    const dataToSave = { ...formData, id: saveId, chatterMessages };
    if (newStatus) {
        dataToSave.approvalStatus = newStatus;
    }
    
    mockStore.saveGoal(saveId, dataToSave);
    return saveId;
  };

  const handleManualSave = (e, createNew = false) => {
      e.preventDefault();
      const saveId = saveCurrentData();
      if (saveId) {
          alert('Đã lưu thông tin mục tiêu!');
          if (createNew) {
              if (isEdit) {
                  navigate('/goal/new');
              } else {
                  setFormData({
                      name: '', category: 'Chỉ tiêu doanh thu', subCategory: 'Doanh thu HĐ nội bộ',
                      serviceType: '', measureMethod: '', unit: '', weight: '0', threshold: '',
                      base: '', stretch: '', startDate: '', endDate: '', approvalStatus: 'Mới', actualProgress: ''
                  });
              }
          } else {
              if (!isEdit) {
                  navigate(`/goal/edit/${saveId}`);
              } else {
                  alert('Đã cập nhật thay đổi!');
              }
          }
      }
  };

  const updateStatus = (newStatus) => {
    const saveId = saveCurrentData(newStatus);
    if (!saveId) return;
    alert(`Đã cập nhật trạng thái: ${newStatus}`);
    navigate('/goals');
  };

  const postNote = () => {
    if (!chatterInput.trim()) return;
    const newMsg = {
      id: Date.now(),
      type: 'note',
      author: 'Phạm Quang Mạnh',
      text: chatterInput,
      time: 'vừa xong',
      avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Felix&backgroundColor=b6e3f4'
    };
    const newMessages = [newMsg, ...chatterMessages];
    setChatterMessages(newMessages);
    setChatterInput('');
    
    if (isEdit) {
       const existing = mockStore.getGoal(id);
       if (existing) {
           existing.chatterMessages = newMessages;
           mockStore.saveGoal(id, existing);
       }
    }
  };

  const getStepClass = (stepName) => {
      const currentIdx = STEPS_ORDER.indexOf(formData.approvalStatus);
      const stepIdx = STEPS_ORDER.indexOf(stepName);
      
      if (currentIdx === stepIdx) return 'active';
      if (stepIdx < currentIdx) return 'done';
      return '';
  };

  const renderActions = () => {
    const s = formData.approvalStatus;

    if (['Hoàn thành', 'Không hoàn thành'].includes(s)) {
      return (
        <div className="header-actions" style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
          <div className={`status-badge ${s === 'Hoàn thành' ? 'approved' : ''}`} style={{ backgroundColor: s === 'Hoàn thành' ? '#dcfce3' : '#fee2e2', color: s === 'Hoàn thành' ? '#166534' : '#b91c1c', padding: '6px 12px', borderRadius: '4px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
            {s === 'Hoàn thành' ? <CheckCircle2 size={16} /> : <XCircle size={16} />} {s}
          </div>
          <button className="btn-secondary" onClick={() => alert('Đang xuất kết quả ra file Excel...')}>Export kết quả</button>
        </div>
      );
    }

    return (
      <div className="header-actions">
        {(!s || s === 'Mới') && isEdit && (
            <button className="btn-secondary" style={{ color: '#ef4444', borderColor: '#ef4444' }} type="button" onClick={() => setShowDeleteConfirm(true)}>
                <Trash size={16} /> Xóa mục tiêu
            </button>
        )}
        <button className="btn-secondary" type="button" onClick={() => navigate('/goals')}>Hủy</button>
        {(!s || s === 'Mới' || s === 'Đang thực hiện') && (
            <button className="btn-primary" style={{ backgroundColor: '#e32b4c', borderColor: '#e32b4c' }} onClick={(e) => handleManualSave(e, false)}>
                <Save size={16} /> Lưu
            </button>
        )}
        {(!s || s === 'Mới' || s === 'Đang thực hiện') && isEdit && (
            <button className="btn-primary" style={{backgroundColor: '#00A63E', borderColor: '#00A63E'}} onClick={() => {
              alert('Hệ thống đã tự động tính toán tổng hợp kết quả của nhân viên...');
              updateStatus('Chờ đánh giá');
            }}>Chuyển sang Chờ đánh giá</button>
        )}

        {s === 'Chờ đánh giá' && (
            <button className="btn-primary" style={{backgroundColor: '#eab308', borderColor: '#eab308', color: '#1e293b'}} onClick={() => setShowReviewModal(true)}>Đánh giá kết quả</button>
        )}
      </div>
    );
  };

  return (
    <div className="goal-form-container">
      {/* Header Top Bar */}
      <div className="goal-form-header" style={{ padding: '16px 24px', background: 'white', borderBottom: '1px solid #e2e8f0', margin: '-24px -24px 24px -24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '15px' }}>
          <span style={{ color: '#64748b', cursor: 'pointer' }} onClick={() => navigate('/goals')}>Danh sách Mục tiêu</span>
          <span style={{ color: '#cbd5e1' }}>/</span>
          <span style={{ fontWeight: 600, color: '#1e293b' }}>{isEdit ? `Mục tiêu: ${formData.id}` : 'Mới'}</span>
        </div>
        {renderActions()}
      </div>

      <form className={`goal-form-card ${isReadOnly ? 'readonly' : ''}`}>
        {/* Odoo-style Statusbar (Inside Card) */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px 24px 0 24px' }}>
          <div className="odoo-statusbar" style={{ border: 'none', margin: 0, padding: 0, height: '36px', background: 'transparent' }}>
            <div className="statusbar-steps">
              {STEPS_ORDER.map(step => (
                  <div key={step} className={`statusbar-step ${getStepClass(step)}`}>
                    <span>{step}</span>
                  </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ overflowX: 'auto', padding: '24px 24px 32px', margin: '0 -24px' }}>
          <div style={{ fontWeight: 'bold', fontSize: '15px', marginBottom: '16px', color: '#0f172a', textTransform: 'uppercase' }}>
            1. Nội dung giao nhiệm vụ, công việc và đánh giá kết quả thực hiện
          </div>

          <div style={{ display: 'flex', gap: '24px', marginBottom: '20px', background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <label style={{ fontWeight: '600', color: '#1e293b' }}>Tháng đánh giá:</label>
              <input type="month" style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', outline: 'none', fontSize: '14px' }} />
            </div>

            <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={() => setEmployeeCols([...employeeCols, employeeCols.length + 1])}
                style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Plus size={16} /> Thêm nhân sự
              </button>
            </div>
          </div>

          <table className="goal-sheet-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr>
                <th rowSpan={2} style={thStyle}>STT</th>
                <th rowSpan={2} style={thStyle}>Mục tiêu nhiệm vụ/công việc</th>
                <th colSpan={1 + employeeCols.length} style={thStyle}>Chỉ số đo lường KPI</th>
                <th rowSpan={2} style={thStyle}>Phương pháp đo<br/>(công thức hoặc mô tả)</th>
                <th rowSpan={2} style={thStyle}>Đơn vị đo</th>
                <th rowSpan={2} style={thStyle}>Tỷ trọng<br/>(%)</th>
                <th colSpan={3} style={thStyle}>Các mức chỉ tiêu</th>
                <th rowSpan={2} style={thStyle}>Ngày bắt đầu</th>
                <th rowSpan={2} style={thStyle}>Ngày hoàn thành</th>
              </tr>
              <tr>
                <th style={thStyle}>Tổng</th>
                {employeeCols.map(colId => (
                    <th key={colId} style={{...thStyle, padding: 0}}>
                      <select style={{...inputCenter, fontWeight: '600', appearance: 'none', cursor: 'pointer'}}>
                        <option value="" style={{color: '#94a3b8'}}>Chọn NS {colId}...</option>
                        {MOCK_EMPLOYEES.map(emp => <option key={emp} value={emp}>{emp}</option>)}
                      </select>
                    </th>
                ))}
                <th style={thStyle}>Tối thiểu (T)</th>
                <th style={thStyle}>Mong đợi (B)</th>
                <th style={thStyle}>Thách thức (S)</th>
              </tr>
            </thead>
            <tbody>
              {/* Row TỔNG */}
              <tr style={{ fontWeight: 'bold', color: '#e32b4c', backgroundColor: '#fff0f2' }}>
                <td style={tdStyle}></td>
                <td style={tdStyle}>TỔNG</td>
                <td style={tdInputStyle}><input style={{...inputNumStyle, color: '#e32b4c'}} readOnly /></td>
                {employeeCols.map(colId => (
                    <td key={colId} style={tdInputStyle}><input style={{...inputCenter, color: '#e32b4c'}} /></td>
                ))}
                <td colSpan={2} style={tdStyle}></td>
                <td style={tdInputStyle}><input defaultValue="100%" style={{...inputCenter, color: '#e32b4c'}} /></td>
                <td colSpan={5} style={tdStyle}></td>
              </tr>
              
              {/* I. Doanh thu */}
              <tr style={{ backgroundColor: '#e2e8f0', fontWeight: 'bold' }}>
                <td style={tdCenter}>I</td>
                <td style={tdStyle}>CHỈ TIÊU DOANH THU</td>
                <td colSpan={1 + employeeCols.length} style={tdStyle}></td>
                <td colSpan={2} style={tdStyle}></td>
                <td style={tdInputStyle}><input placeholder="%" style={{...inputCenter, fontWeight: 'bold'}} /></td>
                <td colSpan={5} style={tdStyle}></td>
              </tr>
              <tr>
                <td style={tdCenter}>1.1</td>
                <td style={tdStyle}>Doanh thu HĐ nội bộ</td>
                <td style={{...tdInputStyle, backgroundColor: ['Chờ đánh giá', 'Hoàn thành', 'Không hoàn thành'].includes(formData?.approvalStatus) ? '#ecfdf5' : 'transparent'}}>
                    <input defaultValue={['Chờ đánh giá', 'Hoàn thành', 'Không hoàn thành'].includes(formData?.approvalStatus) ? '1,500,000,000' : ''} placeholder="Nhập số..." style={{...inputNumStyle, color: ['Chờ đánh giá', 'Hoàn thành', 'Không hoàn thành'].includes(formData?.approvalStatus) ? '#059669' : 'inherit', background: 'transparent'}} />
                </td>
                {employeeCols.map(colId => (
                    <td key={colId} style={{...tdInputStyle, backgroundColor: ['Chờ đánh giá', 'Hoàn thành', 'Không hoàn thành'].includes(formData?.approvalStatus) ? '#f0fdf4' : 'transparent'}}>
                        <input defaultValue={['Chờ đánh giá', 'Hoàn thành', 'Không hoàn thành'].includes(formData?.approvalStatus) ? (colId === 1 ? '110%' : '90%') : ''} placeholder="%" style={{...inputCenter, color: ['Chờ đánh giá', 'Hoàn thành', 'Không hoàn thành'].includes(formData?.approvalStatus) ? '#059669' : 'inherit', fontWeight: ['Chờ đánh giá', 'Hoàn thành', 'Không hoàn thành'].includes(formData?.approvalStatus) ? 'bold' : 'normal', background: 'transparent'}} />
                    </td>
                ))}
                <td style={tdInputStyle}><input placeholder="Công thức tính" style={inputBase} /></td>
                <td style={tdInputStyle}><input placeholder="Đơn vị" style={inputCenter} /></td>
                <td style={tdInputStyle}><input placeholder="%" style={inputCenter} /></td>
                <td style={tdInputStyle}><input placeholder="T" style={inputCenter} /></td>
                <td style={tdInputStyle}><input placeholder="B" style={inputCenter} /></td>
                <td style={tdInputStyle}><input placeholder="S" style={inputCenter} /></td>
                <td style={tdInputStyle}><input type="date" style={inputCenter} /></td>
                <td style={tdInputStyle}><input type="date" style={inputCenter} /></td>
              </tr>
              <tr>
                <td style={tdCenter}>1.2</td>
                <td style={tdStyle}>Doanh thu từ Bảo hành</td>
                <td colSpan={1 + employeeCols.length + 2} style={tdStyle}></td>
                <td style={tdInputStyle}><input placeholder="%" style={inputCenter} /></td>
                <td colSpan={5} style={tdStyle}></td>
              </tr>
              <tr>
                <td style={tdCenter}>1.3</td>
                <td style={tdStyle}>Doanh thu HĐ ngoài</td>
                <td style={{...tdInputStyle, backgroundColor: ['Chờ đánh giá', 'Hoàn thành', 'Không hoàn thành'].includes(formData?.approvalStatus) ? '#ecfdf5' : 'transparent'}}>
                  <input defaultValue={['Chờ đánh giá', 'Hoàn thành', 'Không hoàn thành'].includes(formData?.approvalStatus) ? '2,800,000,000' : ''} placeholder="Nhập số..." style={{...inputNumStyle, color: ['Chờ đánh giá', 'Hoàn thành', 'Không hoàn thành'].includes(formData?.approvalStatus) ? '#059669' : 'inherit', background: 'transparent'}} />
                </td>
                {employeeCols.map(colId => (
                    <td key={colId} style={{...tdInputStyle, backgroundColor: ['Chờ đánh giá', 'Hoàn thành', 'Không hoàn thành'].includes(formData?.approvalStatus) ? '#f0fdf4' : 'transparent'}}>
                      <input defaultValue={['Chờ đánh giá', 'Hoàn thành', 'Không hoàn thành'].includes(formData?.approvalStatus) ? (colId === 1 ? '105%' : '95%') : ''} placeholder="%" style={{...inputCenter, color: ['Chờ đánh giá', 'Hoàn thành', 'Không hoàn thành'].includes(formData?.approvalStatus) ? '#059669' : 'inherit', background: 'transparent'}} />
                    </td>
                ))}
                <td style={tdInputStyle}><input placeholder="Công thức tính" style={inputBase} /></td>
                <td style={tdInputStyle}><input placeholder="Đơn vị" style={inputCenter} /></td>
                <td style={tdInputStyle}><input placeholder="%" style={inputCenter} /></td>
                <td style={tdInputStyle}><input placeholder="T" style={inputCenter} /></td>
                <td style={tdInputStyle}><input placeholder="B" style={inputCenter} /></td>
                <td style={tdInputStyle}><input placeholder="S" style={inputCenter} /></td>
                <td style={tdInputStyle}><input type="date" style={inputCenter} /></td>
                <td style={tdInputStyle}><input type="date" style={inputCenter} /></td>
              </tr>
              <tr>
                <td style={tdCenter}>1.3.1</td>
                <td style={{...tdStyle, paddingLeft: '24px', fontStyle: 'italic', whiteSpace: 'nowrap'}}>Dịch vụ CC Outsourcing</td>
                <td style={{...tdInputStyle, backgroundColor: ['Chờ đánh giá', 'Hoàn thành', 'Không hoàn thành'].includes(formData?.approvalStatus) ? '#ecfdf5' : 'transparent'}}>
                  <input defaultValue={['Chờ đánh giá', 'Hoàn thành', 'Không hoàn thành'].includes(formData?.approvalStatus) ? '1,200,000,000' : ''} placeholder="Nhập số..." style={{...inputNumStyle, color: ['Chờ đánh giá', 'Hoàn thành', 'Không hoàn thành'].includes(formData?.approvalStatus) ? '#059669' : 'inherit', background: 'transparent'}} />
                </td>
                {employeeCols.map(colId => (
                    <td key={colId} style={{...tdInputStyle, backgroundColor: ['Chờ đánh giá', 'Hoàn thành', 'Không hoàn thành'].includes(formData?.approvalStatus) ? '#f0fdf4' : 'transparent'}}>
                      <input defaultValue={['Chờ đánh giá', 'Hoàn thành', 'Không hoàn thành'].includes(formData?.approvalStatus) ? (colId === 1 ? '100%' : '100%') : ''} placeholder="%" style={{...inputCenter, color: ['Chờ đánh giá', 'Hoàn thành', 'Không hoàn thành'].includes(formData?.approvalStatus) ? '#059669' : 'inherit', background: 'transparent'}} />
                    </td>
                ))}
                <td style={tdInputStyle}><input placeholder="Công thức tính" style={inputBase} /></td>
                <td style={tdInputStyle}><input placeholder="Đơn vị" style={inputCenter} /></td>
                <td style={tdInputStyle}><input placeholder="%" style={inputCenter} /></td>
                <td style={tdInputStyle}><input placeholder="T" style={inputCenter} /></td>
                <td style={tdInputStyle}><input placeholder="B" style={inputCenter} /></td>
                <td style={tdInputStyle}><input placeholder="S" style={inputCenter} /></td>
                <td colSpan={2} style={tdStyle}></td>
              </tr>
              <tr>
                <td style={tdCenter}>1.3.2</td>
                <td style={{...tdStyle, paddingLeft: '24px', fontStyle: 'italic', whiteSpace: 'nowrap'}}>Dịch vụ BPO</td>
                <td style={tdInputStyle}><input placeholder="Nhập số..." style={inputNumStyle} /></td>
                {employeeCols.map(colId => (
                    <td key={colId} style={tdInputStyle}><input placeholder="%" style={inputCenter} /></td>
                ))}
                <td style={tdInputStyle}><input placeholder="Công thức tính" style={inputBase} /></td>
                <td style={tdInputStyle}><input placeholder="Đơn vị" style={inputCenter} /></td>
                <td style={tdInputStyle}><input placeholder="%" style={inputCenter} /></td>
                <td style={tdInputStyle}><input placeholder="T" style={inputCenter} /></td>
                <td style={tdInputStyle}><input placeholder="B" style={inputCenter} /></td>
                <td style={tdInputStyle}><input placeholder="S" style={inputCenter} /></td>
                <td colSpan={2} style={tdStyle}></td>
              </tr>
              
              {/* II. Xúc tiến */}
              <tr style={{ backgroundColor: '#e2e8f0', fontWeight: 'bold' }}>
                <td style={tdCenter}>II</td>
                <td style={tdStyle}>CHỈ TIÊU XÚC TIẾN</td>
                <td colSpan={1 + employeeCols.length} style={tdStyle}></td>
                <td colSpan={2} style={tdStyle}></td>
                <td style={tdInputStyle}><input placeholder="%" style={{...inputCenter, fontWeight: 'bold'}} /></td>
                <td colSpan={5} style={tdStyle}></td>
              </tr>
              <tr>
                <td style={tdCenter}>2.1</td>
                <td style={{...tdStyle, whiteSpace: 'nowrap'}}>Số lượng KH tiếp xúc</td>
                <td style={{...tdInputStyle, backgroundColor: ['Chờ đánh giá', 'Hoàn thành', 'Không hoàn thành'].includes(formData?.approvalStatus) ? '#ecfdf5' : 'transparent'}}>
                    <input defaultValue={['Chờ đánh giá', 'Hoàn thành', 'Không hoàn thành'].includes(formData?.approvalStatus) ? '120' : ''} placeholder="SL" style={{...inputNumStyle, color: ['Chờ đánh giá', 'Hoàn thành', 'Không hoàn thành'].includes(formData?.approvalStatus) ? '#059669' : 'inherit', background: 'transparent'}} />
                </td>
                {employeeCols.map(colId => (
                    <td key={colId} style={{...tdInputStyle, backgroundColor: ['Chờ đánh giá', 'Hoàn thành', 'Không hoàn thành'].includes(formData?.approvalStatus) ? '#f0fdf4' : 'transparent'}}>
                        <input defaultValue={['Chờ đánh giá', 'Hoàn thành', 'Không hoàn thành'].includes(formData?.approvalStatus) ? (colId === 1 ? '70' : '50') : ''} placeholder="SL" style={{...inputCenter, color: ['Chờ đánh giá', 'Hoàn thành', 'Không hoàn thành'].includes(formData?.approvalStatus) ? '#059669' : 'inherit', fontWeight: ['Chờ đánh giá', 'Hoàn thành', 'Không hoàn thành'].includes(formData?.approvalStatus) ? 'bold' : 'normal', background: 'transparent'}} />
                    </td>
                ))}
                <td style={tdInputStyle}><input placeholder="Công thức tính" style={inputBase} /></td>
                <td style={tdInputStyle}><input placeholder="Đơn vị" style={inputCenter} /></td>
                <td style={tdInputStyle}><input placeholder="%" style={inputCenter} /></td>
                <td style={tdInputStyle}><input placeholder="T" style={inputCenter} /></td>
                <td style={tdInputStyle}><input placeholder="B" style={inputCenter} /></td>
                <td style={tdInputStyle}><input placeholder="S" style={inputCenter} /></td>
                <td style={tdInputStyle}><input type="date" style={inputCenter} /></td>
                <td style={tdInputStyle}><input type="date" style={inputCenter} /></td>
              </tr>
              <tr>
                <td style={tdCenter}>2.2</td>
                <td style={{...tdStyle, whiteSpace: 'nowrap'}}>Số lượng KH tiềm năng</td>
                <td style={{...tdInputStyle, backgroundColor: ['Chờ đánh giá', 'Hoàn thành', 'Không hoàn thành'].includes(formData?.approvalStatus) ? '#ecfdf5' : 'transparent'}}>
                  <input defaultValue={['Chờ đánh giá', 'Hoàn thành', 'Không hoàn thành'].includes(formData?.approvalStatus) ? '85' : ''} placeholder="SL" style={{...inputNumStyle, color: ['Chờ đánh giá', 'Hoàn thành', 'Không hoàn thành'].includes(formData?.approvalStatus) ? '#059669' : 'inherit', background: 'transparent'}} />
                </td>
                <td colSpan={employeeCols.length} style={tdStyle}></td>
                <td style={tdInputStyle}><input placeholder="Công thức tính" style={inputBase} /></td>
                <td style={tdInputStyle}><input placeholder="Đơn vị" style={inputCenter} /></td>
                <td style={tdInputStyle}><input placeholder="%" style={inputCenter} /></td>
                <td style={tdInputStyle}><input placeholder="T" style={inputCenter} /></td>
                <td style={tdInputStyle}><input placeholder="B" style={inputCenter} /></td>
                <td style={tdInputStyle}><input placeholder="S" style={inputCenter} /></td>
                <td style={tdInputStyle}><input type="date" style={inputCenter} /></td>
                <td style={tdInputStyle}><input type="date" style={inputCenter} /></td>
              </tr>
              
              {/* III. Trọng tâm */}
              <tr style={{ backgroundColor: '#e2e8f0', fontWeight: 'bold' }}>
                <td style={tdCenter}>III</td>
                <td style={tdStyle}>NHIỆM VỤ TRỌNG TÂM</td>
                <td colSpan={1 + employeeCols.length} style={tdStyle}></td>
                <td colSpan={2} style={tdStyle}></td>
                <td style={tdInputStyle}><input placeholder="%" style={{...inputCenter, fontWeight: 'bold'}} /></td>
                <td colSpan={5} style={tdStyle}></td>
              </tr>
              <tr>
                <td style={tdCenter}>1</td>
                <td style={{...tdStyle, padding: 0}}><input placeholder="Tên nhiệm vụ..." style={inputBase} /></td>
                <td colSpan={1 + employeeCols.length} style={tdStyle}></td>
                <td colSpan={8} style={tdStyle}></td>
              </tr>
            </tbody>
          </table>

          {['Chờ đánh giá', 'Hoàn thành', 'Không hoàn thành'].includes(formData?.approvalStatus) && (
            <>
              <div style={{ marginTop: '32px' }}>
                <div style={{ fontWeight: 'bold', fontSize: '15px', marginBottom: '16px', color: '#0f172a', textTransform: 'uppercase' }}>2. Đánh giá yêu cầu về tuân thủ</div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr>
                      <th style={{...thStyle, width: '60%', textAlign: 'left', paddingLeft: '16px'}}>Nội dung đánh giá</th>
                      <th style={thStyle}>Đánh giá của QLTT</th>
                      <th style={thStyle}>Ghi chú</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{...tdStyle, paddingLeft: '16px'}}>- Tuân thủ địa điểm làm việc được giao:</td>
                      <td style={{...tdStyle, padding: 0}}><input type="text" placeholder="Nhập đánh giá..." style={{width: '100%', border: 'none', padding: '8px', outline: 'none', background: 'transparent'}} /></td>
                      <td style={{...tdStyle, padding: 0}}><input type="text" placeholder="Ghi chú thêm..." style={{width: '100%', border: 'none', padding: '8px', outline: 'none', background: 'transparent'}} /></td>
                    </tr>
                    <tr>
                      <td style={{...tdStyle, paddingLeft: '16px'}}>- Tuân thủ nội quy lao động:</td>
                      <td style={{...tdStyle, padding: 0}}><input type="text" placeholder="Nhập đánh giá..." style={{width: '100%', border: 'none', padding: '8px', outline: 'none', background: 'transparent'}} /></td>
                      <td style={{...tdStyle, padding: 0}}><input type="text" placeholder="Ghi chú thêm..." style={{width: '100%', border: 'none', padding: '8px', outline: 'none', background: 'transparent'}} /></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div style={{ marginTop: '32px' }}>
                <div style={{ fontWeight: 'bold', fontSize: '15px', marginBottom: '16px', color: '#0f172a', textTransform: 'uppercase' }}>3. Nhận xét chung</div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr>
                      <th style={{...thStyle, width: '60%', textAlign: 'left', paddingLeft: '16px'}}>Nội dung nhận xét</th>
                      <th style={{...thStyle, textAlign: 'left', paddingLeft: '16px'}}>Ý kiến của QLTT</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ backgroundColor: '#f8fafc', fontWeight: 'bold' }}>
                      <td colSpan={2} style={tdStyle}>- Tình hình thực hiện nhiệm vụ, công việc:</td>
                    </tr>
                    <tr>
                      <td style={{...tdStyle, paddingLeft: '32px'}}>+ Những mục tiêu đã hoàn thành tốt, cách làm tốt cần tiếp tục phát huy:</td>
                      <td style={{...tdStyle, padding: 0}}><textarea placeholder="Nhập ý kiến..." style={{width: '100%', border: 'none', padding: '8px', outline: 'none', resize: 'none', minHeight: '40px', display: 'block', background: 'transparent'}} /></td>
                    </tr>
                    <tr>
                      <td style={{...tdStyle, paddingLeft: '32px'}}>+ Những mục tiêu cần bắt đầu triển khai:</td>
                      <td style={{...tdStyle, padding: 0}}><textarea placeholder="Nhập ý kiến..." style={{width: '100%', border: 'none', padding: '8px', outline: 'none', resize: 'none', minHeight: '40px', display: 'block', background: 'transparent'}} /></td>
                    </tr>
                    <tr>
                      <td style={{...tdStyle, paddingLeft: '16px', fontWeight: 'bold'}}>- Ghi nhận nỗ lực, đóng góp của CBNV trong tháng:</td>
                      <td style={{...tdStyle, padding: 0}}><textarea placeholder="Nhập ý kiến..." style={{width: '100%', border: 'none', padding: '8px', outline: 'none', resize: 'none', minHeight: '40px', display: 'block', background: 'transparent'}} /></td>
                    </tr>
                    <tr>
                      <td style={{...tdStyle, paddingLeft: '16px', fontWeight: 'bold'}}>- Các nhận xét, ý kiến khác:</td>
                      <td style={{...tdStyle, padding: 0}}><textarea placeholder="Nhập ý kiến..." style={{width: '100%', border: 'none', padding: '8px', outline: 'none', resize: 'none', minHeight: '40px', display: 'block', background: 'transparent'}} /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

      </form>

      {/* INTERNAL NOTES / CHATTER (Visible in both Create and Edit) */}
      <div className="notebook" style={{marginTop: '40px', borderTop: '1px solid #e2e8f0', background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
            <div className="notebook-tabs" style={{display: 'flex', gap: '2px', borderBottom: '1px solid #e2e8f0'}}>
              <div className={`notebook-tab ${activeNotebookTab === 'notes' ? 'active' : ''}`} onClick={() => setActiveNotebookTab('notes')} style={{padding: '10px 20px', cursor: 'pointer', borderBottom: activeNotebookTab === 'notes' ? '2px solid #e32b4c' : 'none', color: activeNotebookTab === 'notes' ? '#e32b4c' : '#64748b', fontWeight: activeNotebookTab === 'notes' ? 600 : 400}}>Ghi chú</div>
              <div className={`notebook-tab ${activeNotebookTab === 'history' ? 'active' : ''}`} onClick={() => setActiveNotebookTab('history')} style={{padding: '10px 20px', cursor: 'pointer', borderBottom: activeNotebookTab === 'history' ? '2px solid #e32b4c' : 'none', color: activeNotebookTab === 'history' ? '#e32b4c' : '#64748b', fontWeight: activeNotebookTab === 'history' ? 600 : 400}}>Lịch sử hoạt động</div>
            </div>

            <div className="notebook-content" style={{padding: '20px 0'}}>
                <div className="chatter-in-tab">
                  {activeNotebookTab === 'notes' ? (
                    <>
                      <div style={{display: 'flex', gap: '12px', marginBottom: '24px'}}>
                        <div className="chatter-avatar-small" style={{width: '36px', height: '36px', borderRadius: '4px', overflow: 'hidden'}}><img src="https://api.dicebear.com/7.x/personas/svg?seed=Felix&backgroundColor=b6e3f4" alt="Avatar" style={{width: '100%', height: '100%', objectFit: 'cover'}} /></div>
                        <div style={{flex: 1}}>
                            <div className="chatter-input-box" style={{border: '1px solid #e2e8f0', borderRadius: '4px', background: '#fff'}}>
                                <textarea className="chatter-textarea" style={{width: '100%', border: 'none', padding: '10px', minHeight: '80px', resize: 'vertical', fontSize: '14px', outline: 'none'}} placeholder="Ghi chú nội bộ (@ để tag tên người dùng)..." value={chatterInput} onChange={(e) => setChatterInput(e.target.value)}></textarea>
                                <div className="chatter-input-toolbar" style={{display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#f8fafc', borderTop: '1px solid #f1f5f9'}}>
                                    <div className="chatter-toolbar-left" style={{display: 'flex', gap: '14px', color: '#64748b'}}>
                                        <Smile size={18} style={{cursor: 'pointer'}} />
                                        <Paperclip size={18} style={{cursor: 'pointer'}} />
                                    </div>
                                    <div className="chatter-toolbar-right"><Maximize2 size={16} style={{color: '#64748b', cursor: 'pointer'}} /></div>
                                </div>
                            </div>
                            <button className="btn-log-odoo" style={{marginTop: '10px', background: '#e32b4c', color: '#fff', border: 'none', padding: '6px 16px', borderRadius: '4px', fontWeight: 600, cursor: 'pointer'}} onClick={postNote}>Gửi</button>
                        </div>
                      </div>
                      
                      <div className="chatter-messages" style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                        {chatterMessages.filter(msg => msg.type === 'note').map(msg => (
                          <div key={msg.id} className="message-item-odoo" style={{display: 'flex', gap: '12px'}}>
                            <div className="chatter-avatar-small" style={{width: '32px', height: '32px', borderRadius: '4px', overflow: 'hidden'}}><img src={msg.avatar} alt="Author" style={{width: '100%', height: '100%', objectFit: 'cover'}} /></div>
                            <div className="message-content-wrapper">
                              <div className="message-author-info" style={{display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px'}}>
                                  <span className="message-author-name" style={{fontWeight: 700, fontSize: '14px', color: '#1e293b'}}>{msg.author}</span>
                                  <span className="message-time" style={{fontSize: '12px', color: '#94a3b8'}}>- {msg.time}</span>
                              </div>
                              <div className="message-body-odoo" style={{fontSize: '14px', color: '#334155', lineHeight: 1.5, whiteSpace: 'pre-wrap'}}>
                                {msg.text.split(/(@\S+)/g).map((part, i) => (
                                    part.startsWith('@') ? <strong key={i} style={{color: '#e32b4c', background: '#fff0f2', padding: '0 4px', borderRadius: '4px'}}>{part}</strong> : <span key={i}>{part}</span>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                        {chatterMessages.filter(msg => msg.type === 'note').length === 0 && (
                          <div style={{textAlign: 'center', color: '#94a3b8', fontStyle: 'italic', padding: '20px 0'}}>Chưa có ghi chú nào</div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="history-table-wrapper" style={{background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden'}}>
                      <table style={{width: '100%', borderCollapse: 'collapse', fontSize: '13px'}}>
                        <thead>
                          <tr style={{background: '#f8fafc', borderBottom: '1px solid #e2e8f0'}}>
                            <th style={{textAlign: 'left', padding: '12px', color: '#64748b', fontWeight: 600}}>Người thao tác</th>
                            <th style={{textAlign: 'left', padding: '12px', color: '#64748b', fontWeight: 600}}>Thời gian</th>
                            <th style={{textAlign: 'left', padding: '12px', color: '#64748b', fontWeight: 600}}>Hoạt động / Thay đổi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {chatterMessages.filter(msg => msg.type === 'log').map(msg => (
                            <tr key={msg.id} style={{borderBottom: '1px solid #f1f5f9'}}>
                              <td style={{padding: '12px', fontWeight: 500, color: '#1e293b'}}>{msg.author}</td>
                              <td style={{padding: '12px', color: '#94a3b8'}}>{msg.time}</td>
                              <td style={{padding: '12px', color: '#475569'}}>
                                {msg.changes ? (
                                  <ul style={{margin: 0, paddingLeft: '16px'}}>
                                    {msg.changes.map((c, i) => (
                                      <li key={i}>Đổi <b>{c.label}</b> từ <i>'{c.from}'</i> sang <b style={{color: '#e32b4c'}}>{c.to}</b></li>
                                    ))}
                                  </ul>
                                ) : msg.text}
                              </td>
                            </tr>
                          ))}
                          {chatterMessages.filter(msg => msg.type === 'log').length === 0 && (
                            <tr><td colSpan="3" style={{textAlign: 'center', padding: '30px', color: '#94a3b8'}}>Chưa có bản ghi lịch sử</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
            </div>
        </div>

      {/* DELETE CONFIRM MODAL */}
      {showDeleteConfirm && (
        <div className="modal-overlay" style={{ zIndex: 1100, position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="modal-content" style={{ maxWidth: '400px', padding: '24px', background: 'white', borderRadius: '8px' }}>
             <div style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: '#1e293b' }}>
               Xác nhận xóa
             </div>
             <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>
               Bạn có chắc chắn muốn xóa mục tiêu này không? Thao tác này không thể hoàn tác.
             </p>
             <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
               <button className="btn-secondary" style={{padding: '8px 16px'}} onClick={() => setShowDeleteConfirm(false)}>Hủy</button>
               <button className="btn-primary" style={{ backgroundColor: '#ef4444', borderColor: '#ef4444', padding: '8px 16px', color: 'white' }} onClick={() => {
                 mockStore.deleteGoal(id);
                 navigate('/goals');
               }}>Đồng ý</button>
             </div>
          </div>
        </div>
      )}
      {/* REVIEW MODAL */}
      {showReviewModal && (
        <div className="modal-overlay" style={{ zIndex: 1100, position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="modal-content" style={{ maxWidth: '500px', width: '100%', padding: '24px', background: 'white', borderRadius: '8px' }}>
            <div style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: '#1e293b', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
              Trưởng phòng đánh giá kết quả
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#475569', fontSize: '14px' }}>Nhận xét / Kết quả</label>
                <textarea 
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', minHeight: '80px', outline: 'none' }}
                  value={reviewData.result}
                  onChange={(e) => setReviewData({...reviewData, result: e.target.value})}
                  placeholder="Nhập nhận xét..."
                />
              </div>
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#475569', fontSize: '14px' }}>Điểm tổng (AM tính toán)</label>
                <input 
                  type="number"
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '16px', fontWeight: 'bold' }}
                  value={reviewData.score}
                  onChange={(e) => setReviewData({...reviewData, score: e.target.value})}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
               <button className="btn-secondary" style={{padding: '8px 16px'}} onClick={() => setShowReviewModal(false)}>Hủy</button>
               <button className="btn-primary" style={{ backgroundColor: '#ef4444', borderColor: '#ef4444', padding: '8px 16px', color: 'white' }} onClick={() => {
                 setShowReviewModal(false);
                 updateStatus('Không hoàn thành');
               }}>Từ chối</button>
               <button className="btn-primary" style={{ backgroundColor: '#10b981', borderColor: '#10b981', padding: '8px 16px', color: 'white' }} onClick={() => {
                 setShowReviewModal(false);
                 updateStatus('Hoàn thành');
               }}>Phê duyệt mức hoàn thành</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalForm;
