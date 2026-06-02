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
import KpiSlaBlock from './blocks/KpiSlaBlock';
import './ContractKpiConfig.css';

function ContractKpiConfig() {
    const navigate = useNavigate();
    const [contracts, setContracts] = useState([]);
    const [selectedContractId, setSelectedContractId] = useState('');
    const [orderStatus, setOrderStatus] = useState('');
    
    // KPI & Productivity State
    const [activeTab, setActiveTab] = useState('KPI');
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
                    <h2>Cấu hình KPI và SLA</h2>
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
                    <KpiSlaBlock isReadOnly={isReadOnly} />
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
