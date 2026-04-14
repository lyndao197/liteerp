import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockStore } from '../utils/mockStore';
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  MessageSquare, 
  Clock, 
  Send,
  X,
  Smile,
  Paperclip,
  Maximize2
} from 'lucide-react';
import './CustomerForm.css';
import './ContractForm.css';

const OrderForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    // Form Data State
    const [formErrors, setFormErrors] = useState({});
    const [orderNo, setOrderNo] = useState('');
    const [contractId, setContractId] = useState('');
    const [customerId, setCustomerId] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [contractValueText, setContractValueText] = useState('');
    const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);
    const [orderStatus, setOrderStatus] = useState('Mới');
    const [notes, setNotes] = useState('');

    const [lines, setLines] = useState([]);
    const [discountAmount, setDiscountAmount] = useState(0);

    // Lists for select
    const [activeContracts, setActiveContracts] = useState([]);
    const [products, setProducts] = useState([]);

    // Promo Modal
    const [showPromoModal, setShowPromoModal] = useState(false);
    const [promoType, setPromoType] = useState('percent'); // 'percent' or 'amount'
    const [promoValue, setPromoValue] = useState('');

    // Chatter
    const [activeTab, setActiveTab] = useState('notes');
    const [logText, setLogText] = useState('');
    const [chatterMessages, setChatterMessages] = useState([]);

    useEffect(() => {
        // Load dependencies
        const allContracts = mockStore.getAllContracts().filter(c => c.approvalStatus === 'Hiệu lực');
        setActiveContracts(allContracts);
        setProducts(mockStore.getAllProducts());

        if (isEdit) {
            const data = mockStore.getOrder(id);
            if (data) {
                setOrderNo(data.orderNo || '');
                setContractId(data.contractId || '');
                setCustomerId(data.customerId || '');
                setOrderDate(data.orderDate || '');
                setOrderStatus(data.orderStatus || 'Mới');
                setNotes(data.notes || '');
                setLines(data.lines || []);
                setDiscountAmount(data.discountAmount || 0);
                
                // load customer info
                if (data.customerId) {
                    const cus = mockStore.getCustomer(data.customerId);
                    if (cus) {
                        setCustomerName(cus.company || cus.name);
                        setCustomerEmail(cus.email || '');
                        setCustomerPhone(cus.phone || '');
                    }
                }
                // load contract value
                if (data.contractId) {
                    const ctr = mockStore.getContract(data.contractId);
                    if (ctr) setContractValueText(ctr.contractValue || '');
                }

                // mock chatter load
                const mockMessages = [
                    { id: 1, type: 'note', text: 'Tạo đơn hàng từ hợp đồng', author: 'Hệ thống', time: data.orderDate || 'Vừa xong' }
                ];
                setChatterMessages(mockMessages);
            }
        } else {
            setOrderNo(mockStore.getNextOrderNo());
            setOrderDate(new Date().toISOString().split('T')[0]);
        }
    }, [id, isEdit]);

    // Handle Contract Selection
    const handleContractChange = (e) => {
        const selectedId = e.target.value;
        setContractId(selectedId);
        
        if (!selectedId) {
            setCustomerId('');
            setCustomerName('');
            setCustomerEmail('');
            setCustomerPhone('');
            setContractValueText('');
            return;
        }

        const ctr = activeContracts.find(c => c.id === selectedId);
        if (ctr) {
            setContractValueText(ctr.contractValue || '');
            if (ctr.customerId) {
                setCustomerId(ctr.customerId);
                const cus = mockStore.getCustomer(ctr.customerId);
                if (cus) {
                    setCustomerName(cus.company || cus.name);
                    setCustomerEmail(cus.email || '');
                    setCustomerPhone(cus.phone || '');
                }
            }
        }
    };

    // Lines Logic
    const handleAddLine = () => {
        const newLine = {
            id: Date.now(),
            productId: '',
            productName: '',
            quantity: 1,
            unitPrice: 0,
            discount: 0,
            total: 0
        };
        setLines([...lines, newLine]);
    };

    const handleRemoveLine = (lineId) => {
        setLines(lines.filter(l => l.id !== lineId));
    };

    const handleProductChange = (lineId, prodId) => {
        const prod = products.find(p => p.id === prodId);
        if (!prod) return;

        setLines(lines.map(l => {
            if (l.id === lineId) {
                const newTotal = (l.quantity * prod.price) - l.discount;
                return { ...l, productId: prodId, productName: prod.name, unitPrice: prod.price, total: newTotal > 0 ? newTotal : 0 };
            }
            return l;
        }));
    };

    const handleQuantityChange = (lineId, qty) => {
        const q = parseInt(qty) || 0;
        setLines(lines.map(l => {
            if (l.id === lineId) {
                const newTotal = (q * l.unitPrice) - l.discount;
                return { ...l, quantity: q, total: newTotal > 0 ? newTotal : 0 };
            }
            return l;
        }));
    };

    // Promotion Logic
    const applyPromotion = () => {
        let val = parseFloat(promoValue) || 0;
        if (val <= 0) {
            setShowPromoModal(false);
            return;
        }

        if (promoType === 'percent') {
            // apply % evenly to each line
            setLines(lines.map(l => {
                const lineGross = l.quantity * l.unitPrice;
                const disc = Math.round(lineGross * (val / 100));
                return { ...l, discount: disc, total: lineGross - disc > 0 ? lineGross - disc : 0 };
            }));
            setDiscountAmount(0); // line discounts absorb it
        } else {
            // General order discount
            setDiscountAmount(val);
        }
        setShowPromoModal(false);
        setPromoValue('');
    };

    const subTotal = lines.reduce((acc, l) => acc + (l.quantity * l.unitPrice), 0);
    const lineDiscounts = lines.reduce((acc, l) => acc + (l.discount || 0), 0);
    const finalTotal = subTotal - lineDiscounts - discountAmount;

    const validateForm = () => {
        let errs = {};
        if (!contractId) errs.contractId = true;
        setFormErrors(errs);
        if (Object.keys(errs).length > 0) {
            alert('Trường bắt buộc');
            return false;
        }
        return true;
    };

    const addSystemLog = (text) => {
        const newMsg = {
            id: Date.now(),
            type: 'activity',
            text: text,
            author: 'Hệ thống',
            time: 'Vừa xong',
            avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Felix&backgroundColor=b6e3f4'
        };
        setChatterMessages(prev => [newMsg, ...prev]);
    };

    const handleStatusClick = (newStatus) => {
        if (!validateForm()) return;
        if (orderStatus === 'Đã hủy') return;
        if (newStatus !== orderStatus) {
            addSystemLog(`Chuyển trạng thái từ '${orderStatus}' sang '${newStatus}'`);
            setOrderStatus(newStatus);
        }
    };

    // Save
    const handleSave = () => {
        if (!validateForm()) return;
        const saveId = isEdit ? id : mockStore.getNextOrderId();
        const payload = {
            id: saveId,
            orderNo,
            contractId,
            customerId,
            orderDate,
            orderStatus,
            notes,
            lines,
            totalAmount: finalTotal,
            discountAmount
        };
        mockStore.saveOrder(saveId, payload);
        if (!isEdit) {
            addSystemLog(`Tạo mới đơn hàng: ${orderNo}`);
        } else {
            addSystemLog(`Cập nhật thông tin đơn hàng`);
        }
        navigate('/orders');
    };

    const addLog = () => {
        if (!logText.trim()) return;
        const newMsg = {
            id: Date.now(),
            type: 'note',
            text: logText,
            author: 'Nguyễn Văn A',
            time: 'Vừa xong',
            avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Felix&backgroundColor=b6e3f4'
        };
        setChatterMessages([newMsg, ...chatterMessages]);
        setLogText('');
    };

    return (
        <div className="customer-form-modern">
            <div className="customer-form-header">
                <div className="breadcrumb">
                    <span className="breadcrumb-item" onClick={() => navigate('/orders')}>Quản lý đơn hàng</span>
                    <span className="breadcrumb-item">/</span>
                    <span className="breadcrumb-current">{isEdit ? orderNo : 'Tạo mới'}</span>
                </div>
                <div className="header-actions">
                    {(isEdit && (orderStatus === 'Mới' || orderStatus === 'Đang triển khai')) && (
                        <button className="btn btn-secondary" onClick={() => handleStatusClick('Đã hủy')} style={{color: '#e32b4c', borderColor: '#e32b4c'}}><X size={16} /> Hủy đơn hàng</button>
                    )}
                    <button className="btn btn-secondary" onClick={() => navigate('/orders')}><ArrowLeft size={16} /> Quay lại</button>
                    {(!isEdit || orderStatus === 'Mới') && (
                        <button className="btn btn-primary" onClick={handleSave}><Save size={16} /> Lưu đơn hàng</button>
                    )}
                </div>
            </div>

            {/* Status Bar */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', margin: '0 32px 24px' }}>
                <div className="statusbar" style={{ display: 'flex', alignItems: 'center', background: 'transparent', margin: 0, gap: '4px' }}>
                    {(orderStatus === 'Đã hủy' ? ['Mới', 'Đang triển khai', 'Đã hủy'] : ['Mới', 'Đang triển khai', 'Hoàn thành']).map((st, idx, arr) => {
                        const currentIndex = arr.indexOf(orderStatus);
                        const isCurrent = st === orderStatus;
                        const isPast = idx < currentIndex;
                        const isNext = idx === currentIndex + 1;
                        return (
                            <div 
                                key={st} 
                                onClick={() => handleStatusClick(st)}
                                className={`statusbar-item ${isCurrent ? 'active' : ''} ${isPast ? 'completed' : ''} ${isNext ? 'next' : ''}`}
                                title={st}
                                style={{ position: 'relative', cursor: orderStatus === 'Đã hủy' ? 'default' : 'pointer' }}
                            >
                                {st}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="form-body-wrapper">
                <div className="form-card">
                    <div className="section-header">
                        <h2 className="section-title">Thông tin chung</h2>
                    </div>
                    <div className="form-row-modern">
                        <div className="form-label-modern" style={{ color: formErrors.contractId ? '#e32b4c' : '', fontWeight: formErrors.contractId ? 700 : 500 }}>
                            <span>Số hợp đồng gốc</span> <span className="asterisk">*</span>
                        </div>
                        <div className="form-value-modern">
                            <select className="select-modern" style={{maxWidth: '430px', borderColor: formErrors.contractId ? '#e32b4c' : ''}} value={contractId} onChange={(e) => { handleContractChange(e); setFormErrors({...formErrors, contractId: false}); }}>
                                <option value="">-- Chọn Hợp đồng có hiệu lực --</option>
                                {activeContracts.map(c => (
                                    <option key={c.id} value={c.id}>{c.contractNo} - {c.customerName}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                    <div className="form-row-modern">
                        <div className="form-label-modern">
                            <span>Khách hàng</span>
                        </div>
                        <div className="form-value-modern">
                            <input type="text" className="input-modern" value={customerName} readOnly style={{background: '#f8fafc', fontWeight: 600}} placeholder="Tự động điền..." />
                        </div>
                    </div>

                    <div className="form-row-modern" style={{display: 'flex', gap: '32px'}}>
                        <div style={{flex: 1, display: 'flex', alignItems: 'center'}}>
                            <div className="form-label-modern" style={{minWidth: '150px'}}>
                                <span>Email liên hệ</span>
                            </div>
                            <div className="form-value-modern text-link" style={{flex: 1}}>
                                <input type="text" className="input-modern" value={customerEmail} readOnly style={{background: '#f8fafc'}} placeholder="Auto..." />
                            </div>
                        </div>
                        <div style={{flex: 1, display: 'flex', alignItems: 'center'}}>
                            <div className="form-label-modern" style={{minWidth: '150px'}}>
                                <span>Số điện thoại</span>
                            </div>
                            <div className="form-value-modern text-link" style={{flex: 1}}>
                                <input type="text" className="input-modern" value={customerPhone} readOnly style={{background: '#f8fafc'}} placeholder="Auto..." />
                            </div>
                        </div>
                    </div>

                    <div className="form-row-modern">
                        <div className="form-label-modern">
                            <span>Ngày lên đơn</span>
                        </div>
                        <div className="form-value-modern">
                            <input type="date" className="input-modern" style={{maxWidth: '200px'}} value={orderDate} onChange={e => setOrderDate(e.target.value)} />
                        </div>
                    </div>
                    
                    <div className="form-row-modern">
                        <div className="form-label-modern">
                            <span>Giá trị HĐ gốc</span>
                        </div>
                        <div className="form-value-modern text-link" style={{fontWeight: 600, color: '#e32b4c'}}>
                            <input type="text" className="input-modern" value={contractValueText} readOnly style={{background: '#f8fafc', color: '#e32b4c'}} placeholder="VNĐ" />
                        </div>
                    </div>
                </div>

                {/* Order Lines */}
                <div className="section-header" style={{margin: '32px 0 16px', display: 'flex', justifyContent: 'space-between'}}>
                    <h2 className="section-title">Chi tiết sản phẩm</h2>
                    <span className="text-action" onClick={handleAddLine} style={{cursor: 'pointer'}}>+ Thêm sản phẩm</span>
                </div>
                
                <div className="table-card">
                    <div className="table-header" style={{display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) 150px 100px 150px 150px 50px', gap: '16px'}}>
                        <span>Sản phẩm / Dịch vụ</span><span>Đơn giá</span><span>Số lượng</span><span>Chiết khấu</span><span>Thành tiền</span><span></span>
                    </div>
                    {lines.map((line) => (
                        <div className="table-row" key={line.id} style={{display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) 150px 100px 150px 150px 50px', gap: '16px'}}>
                            <div>
                                <select 
                                    className="select-modern" 
                                    value={line.productId}
                                    onChange={e => handleProductChange(line.id, e.target.value)}
                                >
                                    <option value="">-- Chọn SP --</option>
                                    {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <input type="text" className="input-modern" readOnly value={(line.unitPrice || 0).toLocaleString()} style={{ background: 'transparent', border: 'none' }}/>
                            </div>
                            <div>
                                <input type="number" className="input-modern" min="1" value={line.quantity} onChange={e => handleQuantityChange(line.id, e.target.value)} />
                            </div>
                            <div>
                                <input type="text" className="input-modern" readOnly value={(line.discount || 0).toLocaleString()} style={{ background: 'transparent', border: 'none', color: '#e32b4c' }}/>
                            </div>
                            <div style={{ fontWeight: 600 }}>
                                {(line.total || 0).toLocaleString()}
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <button style={{ color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => handleRemoveLine(line.id)}>
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {lines.length === 0 && (
                        <div style={{textAlign: 'center', padding: '24px', color: '#94a3b8'}}>Chưa có sản phẩm nào. Lên đơn ngay!</div>
                    )}
                    
                    {/* Summary */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', borderRadius: '0 0 8px 8px' }}>
                        <div>
                            <span className="text-action text-link" onClick={() => setShowPromoModal(true)}>+ Thêm khuyến mãi</span>
                        </div>
                        <div style={{ width: '300px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#64748b', fontSize: '14px' }}>
                                <span>Tổng cộng:</span>
                                <span>{subTotal.toLocaleString()} đ</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#e32b4c', fontSize: '14px' }}>
                                <span>Tổng chiết khấu:</span>
                                <span>- {(lineDiscounts + discountAmount).toLocaleString()} đ</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: '8px', fontWeight: 700, fontSize: '18px', color: '#0f172a' }}>
                                <span>Thanh toán:</span>
                                <span>{finalTotal > 0 ? finalTotal.toLocaleString() : 0} đ</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* NOTEBOOK FOR CHATTER */}
                <div className="notebook">
                    <div className="notebook-tabs">
                        <div className={`notebook-tab ${activeTab === 'notes' ? 'active' : ''}`} onClick={() => setActiveTab('notes')}>Ghi chú nội bộ</div>
                        <div className={`notebook-tab ${activeTab === 'activities' ? 'active' : ''}`} onClick={() => setActiveTab('activities')}>Lịch sử hoạt động</div>
                    </div>
                    <div className="notebook-content">
                        <div className="chatter-in-tab">
                            {activeTab === 'notes' && (
                                <div style={{display: 'flex', gap: '12px', marginBottom: '24px'}}>
                                    <div className="chatter-avatar-small"><img src="https://api.dicebear.com/7.x/personas/svg?seed=Felix&backgroundColor=b6e3f4" alt="Avatar" /></div>
                                    <div style={{flex: 1}}>
                                        <div className="chatter-input-box">
                                            <textarea className="chatter-textarea" placeholder="Nội dung ghi chú..." value={logText} onChange={(e)=>setLogText(e.target.value)}></textarea>
                                            <div className="chatter-input-toolbar">
                                                <div className="chatter-toolbar-left">
                                                    <Smile size={18} className="chatter-toolbar-btn" />
                                                    <Paperclip size={18} className="chatter-toolbar-btn" />
                                                </div>
                                                <div className="chatter-toolbar-right">
                                                    <Maximize2 size={16} className="chatter-toolbar-btn" />
                                                </div>
                                            </div>
                                        </div>
                                        <button className="btn-log-odoo" onClick={addLog}>Ghi nhận</button>
                                    </div>
                                </div>
                            )}
                            <div className="chatter-messages" style={{display: 'flex', flexDirection: 'column'}}>
                                {chatterMessages.filter(msg => activeTab === 'notes' ? msg.type === 'note' : msg.type === 'activity').map(msg => (
                                    <div key={msg.id} className="message-item-odoo">
                                        <div className="chatter-avatar-small" style={{borderRadius: msg.author === 'Hệ thống' ? '50%' : '8px'}}><img src={msg.avatar || "https://api.dicebear.com/7.x/personas/svg?seed=Felix&backgroundColor=b6e3f4"} alt="Author" /></div>
                                        <div className="message-content-wrapper" style={{flex: 1}}>
                                            <div className="message-author-info">
                                                <span className="message-author-name">{msg.author}</span>
                                                <span style={{fontSize: '12px', color: '#94a3b8'}}>- {msg.time}</span>
                                            </div>
                                            <div className="message-body-odoo">
                                                <div style={{whiteSpace: 'pre-wrap', color: msg.type === 'activity' ? '#64748b' : '#334155'}}>{msg.text}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {chatterMessages.filter(msg => activeTab === 'notes' ? msg.type === 'note' : msg.type === 'activity').length === 0 && (
                                    <div style={{textAlign: 'center', color: '#94a3b8', fontStyle: 'italic', padding: '20px 0'}}>Chưa có dữ liệu</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Promo Modal */}
            {showPromoModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ background: 'white', padding: '24px', borderRadius: '8px', width: '400px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <h3 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>Áp dụng khuyến mãi</h3>
                            <X size={20} style={{ cursor: 'pointer', color: '#64748b' }} onClick={() => setShowPromoModal(false)} />
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Hình thức giảm</label>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', cursor: 'pointer' }}>
                                    <input type="radio" value="percent" checked={promoType === 'percent'} onChange={() => setPromoType('percent')} />
                                    Mức %
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', cursor: 'pointer' }}>
                                    <input type="radio" value="amount" checked={promoType === 'amount'} onChange={() => setPromoType('amount')} />
                                    Tiền mặt
                                </label>
                            </div>
                        </div>
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>
                                Mức giảm ({promoType === 'percent' ? '%' : 'VNĐ'})
                            </label>
                            <input 
                                type="number" 
                                className="form-control" 
                                placeholder={promoType === 'percent' ? 'Ví dụ: 10' : 'Ví dụ: 500000'}
                                value={promoValue} 
                                onChange={e => setPromoValue(e.target.value)} 
                            />
                            {promoType === 'percent' && <p style={{ fontSize: '12px', color: '#64748b', marginTop: '6px' }}>Hệ thống sẽ dải mức chiết khấu đều lên từng sản phẩm.</p>}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            <button className="btn-outline-brand" onClick={() => setShowPromoModal(false)}>Đóng</button>
                            <button className="btn-primary" onClick={applyPromotion}>Áp dụng toàn bộ</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderForm;
