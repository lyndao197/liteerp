import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Save, 
    ArrowLeft, 
    Trash2, 
    FileText,
    Plus,
    CornerDownRight
} from 'lucide-react';
import { mockStore } from '../utils/mockStore';
import './ContractKpiConfig.css';

function ContractKpiConfig() {
    const navigate = useNavigate();
    const [contracts, setContracts] = useState([]);
    const [selectedContractId, setSelectedContractId] = useState('');
    const [orderStatus, setOrderStatus] = useState('');
    
    // KPI & Productivity State
    const [activeTab, setActiveTab] = useState('SLA');
    const [kpiLines, setKpiLines] = useState([]);
    const [productivityLines, setProductivityLines] = useState([]);
    
    // Modal state
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, message: '', onConfirm: null, isAlert: false });

    useEffect(() => {
        const storeData = mockStore.getStore();
        const ctrs = (storeData.contractIds || []).map(id => storeData.contracts[id]).filter(c => c);
        setContracts(ctrs);
    }, []);

    const handleContractChange = (e) => {
        const cid = e.target.value;
        setSelectedContractId(cid);
        
        if (!cid) {
            setKpiLines([]);
            setProductivityLines([]);
            setOrderStatus('');
            return;
        }

        const storeData = mockStore.getStore();
        const orders = Object.values(storeData.orders || {}).filter(o => o.contractId === cid);
        const order = orders[0]; 
        
        if (order) {
            setKpiLines(order.kpiLines || []);
            setProductivityLines(order.productivityLines || []);
            setOrderStatus(order.orderStatus || 'Dự thảo');
        } else {
            setKpiLines([]);
            setProductivityLines([]);
            setOrderStatus('Dự thảo');
        }
    };

    const handleSave = () => {
        if (!selectedContractId) return;
        
        const storeData = mockStore.getStore();
        const orders = Object.values(storeData.orders || {}).filter(o => o.contractId === selectedContractId);
        
        if (orders.length > 0) {
            const order = orders[0];
            const updatedOrder = {
                ...order,
                kpiLines,
                productivityLines
            };
            mockStore.saveOrder(updatedOrder);
            setConfirmModal({
                isOpen: true,
                message: 'Đã lưu cấu hình KPI & Năng suất thành công!',
                isAlert: true,
                onConfirm: () => setConfirmModal({ ...confirmModal, isOpen: false })
            });
        } else {
            setConfirmModal({
                isOpen: true,
                message: 'Không tìm thấy Đơn hàng tương ứng để lưu cấu hình!',
                isAlert: true,
                onConfirm: () => setConfirmModal({ ...confirmModal, isOpen: false })
            });
        }
    };

    const handleSyncToWord = () => {
        setConfirmModal({
            isOpen: true,
            message: 'Đã đẩy cấu hình bảng SLA & Năng suất vào file Template thành công!',
            isAlert: true,
            onConfirm: () => setConfirmModal({ ...confirmModal, isOpen: false })
        });
    };

    const isReadOnly = !['Dự thảo', 'Bị từ chối', 'Đã hủy', ''].includes(orderStatus);

    // Tree Helpers
    const getDescendantsCount = (lines, startIndex) => {
        let count = 0;
        const startLevel = lines[startIndex].level || 0;
        for (let i = startIndex + 1; i < lines.length; i++) {
            if ((lines[i].level || 0) > startLevel) count++;
            else break;
        }
        return count;
    };

    const handleAddRoot = (listName) => {
        const newLine = { id: Date.now(), level: 0, index: '', name: '' };
        if (listName === 'kpi') setKpiLines([...kpiLines, newLine]);
        else setProductivityLines([...productivityLines, newLine]);
    };

    const handleAddSibling = (index, listName) => {
        const list = listName === 'kpi' ? kpiLines : productivityLines;
        const current = list[index];
        const descCount = getDescendantsCount(list, index);
        const newLine = { id: Date.now(), level: current.level || 0, index: '', name: '' };
        const newList = [...list];
        newList.splice(index + 1 + descCount, 0, newLine);
        listName === 'kpi' ? setKpiLines(newList) : setProductivityLines(newList);
    };

    const handleAddChild = (index, listName) => {
        const list = listName === 'kpi' ? kpiLines : productivityLines;
        const current = list[index];
        const newLine = { id: Date.now(), level: (current.level || 0) + 1, index: '', name: '' };
        const newList = [...list];
        newList.splice(index + 1, 0, newLine);
        listName === 'kpi' ? setKpiLines(newList) : setProductivityLines(newList);
    };

    const handleRemove = (index, listName) => {
        const list = listName === 'kpi' ? kpiLines : productivityLines;
        const descCount = getDescendantsCount(list, index);
        const newList = [...list];
        newList.splice(index, 1 + descCount);
        listName === 'kpi' ? setKpiLines(newList) : setProductivityLines(newList);
    };

    const handleChange = (index, field, val, listName) => {
        const list = listName === 'kpi' ? kpiLines : productivityLines;
        const newList = [...list];
        newList[index] = { ...newList[index], [field]: val };
        listName === 'kpi' ? setKpiLines(newList) : setProductivityLines(newList);
    };

    return (
        <div className="form-container">
            <div className="form-header">
                <div className="form-title">
                    <button className="btn-icon" onClick={() => navigate(-1)}>
                        <ArrowLeft size={20} />
                    </button>
                    <h2>Cấu hình KPI/SLA và Năng suất</h2>
                </div>
                <div className="form-actions">
                    <button className="btn btn-primary" onClick={handleSave} disabled={isReadOnly}>
                        <Save size={16} /> Lưu cấu hình
                    </button>
                </div>
            </div>

            <div className="form-content">
                <div className="form-card">
                    <div className="section-header">
                        <h3>Chọn Hợp đồng</h3>
                    </div>
                    <div className="form-grid">
                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                            <label>Hợp đồng cần cấu hình <span className="required">*</span></label>
                            <select className="input-modern" value={selectedContractId} onChange={handleContractChange}>
                                <option value="">-- Chọn hợp đồng --</option>
                                {contracts.map(c => (
                                    <option key={c.id} value={c.id}>{c.contractNo} - {c.customerName}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {selectedContractId && (
                    <div className="kpi-container">
                        <div className="tab-header">
                            <button 
                                className={`tab-btn sla ${activeTab === 'SLA' ? 'active' : ''}`}
                                onClick={() => setActiveTab('SLA')}
                            >
                                Cấu hình KPI / SLA
                            </button>
                            <button 
                                className={`tab-btn prod ${activeTab === 'PRODUCTIVITY' ? 'active' : ''}`}
                                onClick={() => setActiveTab('PRODUCTIVITY')}
                            >
                                Cấu hình Năng suất
                            </button>
                        </div>

                        <div className="kpi-table-wrapper">
                            <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white' }}>
                                <h3 style={{ fontSize: '16px', color: '#0f172a', margin: 0, fontWeight: 700 }}>
                                    {activeTab === 'SLA' ? 'DANH SÁCH CHỈ SỐ KPI/SLA CAM KẾT' : 'DANH SÁCH CHỈ SỐ NĂNG SUẤT CAM KẾT'}
                                    {isReadOnly && <span style={{ color: '#ef4444', fontSize: '12px', marginLeft: '12px', fontWeight: 'normal', textTransform: 'none' }}>(Chỉ xem - Hợp đồng không ở trạng thái Dự thảo)</span>}
                                </h3>
                                <button className="btn btn-primary" onClick={handleSyncToWord} style={{ background: '#0ea5e9', border: 'none', borderRadius: '8px', padding: '10px 20px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <FileText size={18} /> Đồng bộ dữ liệu vào Word
                                </button>
                            </div>

                            {activeTab === 'SLA' && (
                                <div style={{ overflowX: 'auto' }}>
                                    <table className="kpi-table">
                                        <thead>
                                            <tr>
                                                <th style={{ width: '60px' }}>TT</th>
                                                <th style={{ minWidth: '250px' }}>Nội dung đánh giá</th>
                                                <th style={{ width: '250px' }}>Định nghĩa tiêu chí</th>
                                                <th style={{ width: '120px' }}>Tiêu chuẩn</th>
                                                <th style={{ width: '100px' }}>Tỷ trọng</th>
                                                <th style={{ width: '250px' }}>Phương pháp tính điểm</th>
                                                <th style={{ width: '120px', textAlign: 'center' }}>Thao tác</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {kpiLines.map((line, index) => {
                                                const level = line.level || 0;
                                                return (
                                                <tr key={line.id} className={`kpi-row level-${level}`}>
                                                    <td>
                                                        <input type="text" className="cell-input" value={line.index || ''} onChange={e => handleChange(index, 'index', e.target.value, 'kpi')} readOnly={isReadOnly} placeholder="I, 1..." style={{ textAlign: 'center' }} />
                                                    </td>
                                                    <td>
                                                        <div style={{ display: 'flex', alignItems: 'center', height: '100%', paddingLeft: `${16 + level * 24}px` }}>
                                                            {level > 0 && <span className="tree-indicator">|_</span>}
                                                            <textarea className="cell-input" value={line.name || ''} onChange={e => handleChange(index, 'name', e.target.value, 'kpi')} readOnly={isReadOnly} placeholder="Tên nhóm / Chỉ số..." style={{ paddingLeft: '8px' }} />
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <textarea className="cell-input" value={line.definition || ''} onChange={e => handleChange(index, 'definition', e.target.value, 'kpi')} readOnly={isReadOnly} />
                                                    </td>
                                                    <td>
                                                        <input type="text" className="cell-input" value={line.standard || ''} onChange={e => handleChange(index, 'standard', e.target.value, 'kpi')} readOnly={isReadOnly} />
                                                    </td>
                                                    <td>
                                                        <input type="text" className="cell-input" value={line.weight || ''} onChange={e => handleChange(index, 'weight', e.target.value, 'kpi')} readOnly={isReadOnly} style={{ textAlign: 'center' }} />
                                                    </td>
                                                    <td>
                                                        <textarea className="cell-input" value={line.method || ''} onChange={e => handleChange(index, 'method', e.target.value, 'kpi')} readOnly={isReadOnly} />
                                                    </td>
                                                    <td>
                                                        {!isReadOnly && (
                                                            <div className="action-buttons">
                                                                <button className="btn-action child" title="Thêm mục con" onClick={() => handleAddChild(index, 'kpi')}>
                                                                    <CornerDownRight size={16} />
                                                                </button>
                                                                <button className="btn-action sibling" title="Thêm mục cùng cấp" onClick={() => handleAddSibling(index, 'kpi')}>
                                                                    <Plus size={16} />
                                                                </button>
                                                                <button className="btn-action delete" title="Xóa" onClick={() => handleRemove(index, 'kpi')}>
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            )})}
                                            {kpiLines.length === 0 && (
                                                <tr><td colSpan="7" style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>Chưa có cấu hình KPI/SLA</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                    {!isReadOnly && (
                                        <div style={{ padding: '24px' }}>
                                            <button className="add-root-btn" onClick={() => handleAddRoot('kpi')}>
                                                <Plus size={18} /> Thêm nhóm gốc mới
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'PRODUCTIVITY' && (
                                <div style={{ overflowX: 'auto' }}>
                                    <table className="kpi-table">
                                        <thead>
                                            <tr>
                                                <th style={{ width: '60px' }}>TT</th>
                                                <th style={{ minWidth: '300px' }}>Kênh</th>
                                                <th style={{ width: '200px' }}>Đơn vị tính</th>
                                                <th style={{ width: '150px' }}>Năng suất / Ngày</th>
                                                <th style={{ width: '250px' }}>Ghi chú</th>
                                                <th style={{ width: '120px', textAlign: 'center' }}>Thao tác</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {productivityLines.map((line, index) => {
                                                const level = line.level || 0;
                                                return (
                                                <tr key={line.id} className={`kpi-row level-${level}`}>
                                                    <td>
                                                        <input type="text" className="cell-input" value={line.index || ''} onChange={e => handleChange(index, 'index', e.target.value, 'productivity')} readOnly={isReadOnly} placeholder="I, 1..." style={{ textAlign: 'center' }} />
                                                    </td>
                                                    <td>
                                                        <div style={{ display: 'flex', alignItems: 'center', height: '100%', paddingLeft: `${16 + level * 24}px` }}>
                                                            {level > 0 && <span className="tree-indicator">|_</span>}
                                                            <textarea className="cell-input" value={line.name || ''} onChange={e => handleChange(index, 'name', e.target.value, 'productivity')} readOnly={isReadOnly} placeholder="Tên kênh..." style={{ paddingLeft: '8px' }} />
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <textarea className="cell-input" value={line.unit || ''} onChange={e => handleChange(index, 'unit', e.target.value, 'productivity')} readOnly={isReadOnly} placeholder="Cuộc gọi..." />
                                                    </td>
                                                    <td>
                                                        <input type="text" className="cell-input" value={line.target || ''} onChange={e => handleChange(index, 'target', e.target.value, 'productivity')} readOnly={isReadOnly} placeholder="140" style={{ textAlign: 'center' }} />
                                                    </td>
                                                    <td>
                                                        <textarea className="cell-input" value={line.note || ''} onChange={e => handleChange(index, 'note', e.target.value, 'productivity')} readOnly={isReadOnly} />
                                                    </td>
                                                    <td>
                                                        {!isReadOnly && (
                                                            <div className="action-buttons">
                                                                <button className="btn-action child" title="Thêm mục con" onClick={() => handleAddChild(index, 'productivity')}>
                                                                    <CornerDownRight size={16} />
                                                                </button>
                                                                <button className="btn-action sibling" title="Thêm mục cùng cấp" onClick={() => handleAddSibling(index, 'productivity')}>
                                                                    <Plus size={16} />
                                                                </button>
                                                                <button className="btn-action delete" title="Xóa" onClick={() => handleRemove(index, 'productivity')}>
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            )})}
                                            {productivityLines.length === 0 && (
                                                <tr><td colSpan="6" style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>Chưa có cấu hình Năng suất</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                    {!isReadOnly && (
                                        <div style={{ padding: '24px' }}>
                                            <button className="add-root-btn" onClick={() => handleAddRoot('productivity')}>
                                                <Plus size={18} /> Thêm nhóm gốc mới
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {confirmModal.isOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
                    <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', width: '400px', maxWidth: '90%', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                        <h3 style={{ marginTop: 0, marginBottom: '16px', fontSize: '16px', color: '#0f172a' }}>Thông báo</h3>
                        <p style={{ margin: 0, marginBottom: '24px', color: '#475569', fontSize: '14px', lineHeight: '1.5' }}>{confirmModal.message}</p>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            <button 
                                className="btn btn-primary" 
                                style={{ background: '#0ea5e9', border: 'none' }}
                                onClick={() => {
                                    if (confirmModal.onConfirm) confirmModal.onConfirm();
                                    setConfirmModal({ ...confirmModal, isOpen: false });
                                }}
                            >
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ContractKpiConfig;
