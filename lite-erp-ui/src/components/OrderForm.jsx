import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockStore } from '../utils/mockStore';
import { 
  ArrowLeft, Save, Trash2, Send, UploadCloud, FileText, FileSpreadsheet, File,
  Download, Mail, MessageSquare, History, ThumbsUp, Heart, MoreVertical, Paperclip, Smile
} from 'lucide-react';
import './CustomerForm.css';
import './ContractForm.css';

const OrderForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    // Header info
    const [contractId, setContractId] = useState('CTR-2026-017'); // Default to our mock contract
    const [salesTeam, setSalesTeam] = useState('Nhóm A _ P.CLKD');
    
    // Buyer info
    const [customerName, setCustomerName] = useState('');
    const [debtDays, setDebtDays] = useState('30');
    const [paymentMethod, setPaymentMethod] = useState('Chuyển khoản');
    const [contactPerson, setContactPerson] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [billingAddress, setBillingAddress] = useState('');
    const [shippingAddress, setShippingAddress] = useState('');
    
    // Payment Type
    const [paymentType, setPaymentType] = useState('Phương thức 2'); // 'Phương thức 1' or 'Phương thức 2'

    // Products
    const [lines, setLines] = useState([
        { id: 1, type: '', group: '', service: '', qty: 1, unit: '--chọn--', price: '', desc: '', tax: '' }
    ]);

    const storeData = mockStore.getStore();
    const groups = Object.values(storeData.productGroups || {});
    const categories = Object.values(storeData.productCategories || {});
    const allProducts = Object.values(storeData.products || {});

    // Documents
    const [documents, setDocuments] = useState([
        { id: 1, name: 'Tailieugia.pdf', desc: 'Tài liệu về giá sản phẩm', time: '02/09/2026 by Author', type: 'pdf' },
        { id: 2, name: 'Bangkechitietgia.xlsx', desc: 'Tài liệu về giá sản phẩm', time: '02/09/2026 by Author', type: 'excel' },
        { id: 3, name: 'Tailieugia.pdf', desc: 'Tài liệu về giá sản phẩm', time: '02/09/2026 by Author', type: 'pdf' },
        { id: 4, name: 'hopdong.docx', desc: 'Hợp đồng', time: '02/09/2026 by Author', type: 'word' }
    ]);

    const [activeContracts, setActiveContracts] = useState([]);

    // Chatter State
    const [chatterTab, setChatterTab] = useState('comment');
    const [commentInput, setCommentInput] = useState('');
    
    const comments = [
        { id: 1, user: 'Nguyễn Văn A', avatar: 'https://i.pravatar.cc/150?u=1', time: '2h trước', content: 'Đã liên hệ với khách hàng, họ đang xem xét đề xuất.', likes: 45, hearts: 25 },
        { id: 2, user: 'Trần Thị B', avatar: 'https://i.pravatar.cc/150?u=2', time: '5h trước', content: 'Đã liên hệ với khách hàng, họ đang xem xét đề xuất.', likes: 45, hearts: 25 }
    ];

    const histories = [
        { id: 1, user: 'Nguyễn Văn A', avatar: 'https://i.pravatar.cc/150?u=1', time: 'Vừa xong', content: 'Tạo mới bản ghi' },
        { id: 2, user: 'Nguyễn Văn A', avatar: 'https://i.pravatar.cc/150?u=1', time: 'Vừa xong', content: 'Trạng thái : Ngừng hoạt động → Đang hoạt động', isStatus: true }
    ];

    useEffect(() => {
        const allContracts = mockStore.getAllContracts().filter(c => c.approvalStatus === 'Hiệu lực');
        setActiveContracts(allContracts);

        // Pre-fill if default contract selected
        if (contractId) {
            const ctr = allContracts.find(c => c.id === contractId);
            if (ctr) {
                const cus = mockStore.getCustomer(ctr.customerId);
                if (cus) {
                    setCustomerName(cus.name);
                    setEmail(cus.email);
                    setPhone(cus.phone);
                    setBillingAddress(cus.address);
                    setShippingAddress(cus.address);
                    setContactPerson(cus.contactName);
                }
            }
        }
    }, [contractId]);

    const handleContractChange = (e) => {
        const selectedId = e.target.value;
        setContractId(selectedId);
        
        if (!selectedId) {
            setCustomerName('');
            setEmail('');
            setPhone('');
            setBillingAddress('');
            setShippingAddress('');
            setContactPerson('');
            return;
        }

        const ctr = activeContracts.find(c => c.id === selectedId);
        if (ctr) {
            const cus = mockStore.getCustomer(ctr.customerId);
            if (cus) {
                setCustomerName(cus.name);
                setEmail(cus.email);
                setPhone(cus.phone);
                setBillingAddress(cus.address);
                setShippingAddress(cus.address);
                setContactPerson(cus.contactName);
            }
        }
    };

    // Product Handlers
    const handleAddLine = () => {
        const newLine = {
            id: Date.now(), type: '', group: '', service: '', qty: 1, unit: '--chọn--', price: '', desc: '', tax: ''
        };
        setLines([...lines, newLine]);
    };

    const handleRemoveLine = (lineId) => {
        setLines(lines.filter(l => l.id !== lineId));
    };

    const handleLineChange = (id, field, value) => {
        setLines(lines.map(l => {
            if (l.id === id) {
                const updatedLine = { ...l, [field]: value };
                if (field === 'type') {
                    updatedLine.group = '';
                    updatedLine.service = '';
                } else if (field === 'group') {
                    updatedLine.service = '';
                } else if (field === 'service') {
                    const prd = allProducts.find(p => p.id === value);
                    if (prd) {
                        updatedLine.unit = prd.unit;
                        updatedLine.price = prd.price;
                        updatedLine.tax = prd.tax;
                    }
                }
                return updatedLine;
            }
            return l;
        }));
    };

    // Document Handlers
    const handleRemoveDoc = (docId) => {
        setDocuments(documents.filter(d => d.id !== docId));
    };

    const handleFileDrop = (e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer?.files || e.target?.files || []);
        if (files.length > 0) {
            const newDocs = files.map((f, i) => ({
                id: Date.now() + i,
                name: f.name,
                desc: 'Tài liệu mới tải lên',
                time: new Date().toLocaleDateString('vi-VN') + ' by TrangNTT55',
                type: f.name.endsWith('.pdf') ? 'pdf' : f.name.endsWith('.xlsx') ? 'excel' : 'word'
            }));
            setDocuments([...documents, ...newDocs]);
        }
    };

    const calculateTotals = () => {
        const subTotal = lines.reduce((acc, l) => {
            const p = parseFloat(String(l.price).replace(/,/g, '')) || 0;
            return acc + (p * l.qty);
        }, 0);
        // VAT assumed 10%
        const vat = subTotal * 0.1;
        return { subTotal, vat, total: subTotal + vat };
    };

    const totals = calculateTotals();

    const getFileIcon = (type) => {
        if (type === 'pdf') return <FileText size={16} color="#e32b4c" />;
        if (type === 'excel') return <FileSpreadsheet size={16} color="#16a34a" />;
        return <File size={16} color="#3b82f6" />;
    };

    return (
        <div className="customer-form-modern" style={{ paddingBottom: '100px' }}>
            <div className="customer-form-header">
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 600, color: '#0f172a', margin: '0 0 8px 0' }}>Tạo mới yêu cầu bán hàng dự án</h1>
                    <div className="breadcrumb" style={{ margin: 0 }}>
                        <span className="breadcrumb-item" onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                            <ArrowLeft size={16} /> Trở về
                        </span>
                    </div>
                </div>
                <div className="header-actions">
                    <button className="btn btn-secondary"><Save size={16} /> Lưu nháp</button>
                    <button className="btn btn-primary"><Send size={16} /> Gửi yêu cầu bán hàng</button>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                <div className="form-body-wrapper" style={{ flex: 1, minWidth: 0 }}>
                <div style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', gap: '32px', fontSize: '14px', color: '#475569' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>Số hợp đồng</span>
                            <select className="select-modern" style={{ color: '#0ea5e9', fontWeight: 500, padding: '4px 8px', height: 'auto', minWidth: '250px' }} value={contractId} onChange={handleContractChange}>
                                <option value="">-- Chọn hợp đồng --</option>
                                {activeContracts.map(c => (
                                    <option key={c.id} value={c.id}>{c.contractNo}</option>
                                ))}
                            </select>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span>Người tạo: </span><span style={{ fontWeight: 500, color: '#0f172a', marginLeft: '4px' }}>TrangNTT55</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span>Ngày tạo: </span><span style={{ fontWeight: 500, color: '#0f172a', marginLeft: '4px' }}>07/05/2026</span>
                        </div>
                    </div>
                    <div style={{ width: '300px' }}>
                        <label style={{ display: 'block', fontSize: '13px', color: '#475569', marginBottom: '4px' }}>Salesteam <span style={{color: '#e32b4c'}}>*</span></label>
                        <select className="select-modern" value={salesTeam} onChange={e => setSalesTeam(e.target.value)}>
                            <option value="Nhóm A _ P.CLKD">Nhóm A _ P.CLKD</option>
                            <option value="Nhóm B _ P.CLKD">Nhóm B _ P.CLKD</option>
                        </select>
                    </div>
                </div>
                {/* BÊN MUA */}
                <div className="form-card" style={{ padding: '24px' }}>
                    <div className="section-header" style={{ marginBottom: '24px' }}>
                        <h2 className="section-title" style={{ fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ color: '#64748b' }}>⌄</span> Bên mua
                        </h2>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Khách hàng mua</label>
                            <input type="text" className="input-modern" style={{ background: '#f1f5f9' }} readOnly value={customerName} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Số ngày công nợ</label>
                            <input type="text" className="input-modern" style={{ background: '#f1f5f9' }} value={debtDays} onChange={e => setDebtDays(e.target.value)} />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Hình thức thanh toán <span style={{color: '#e32b4c'}}>*</span></label>
                            <select className="select-modern" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                                <option value="Chuyển khoản">Chuyển khoản</option>
                                <option value="Tiền mặt">Tiền mặt</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Người liên hệ <span style={{color: '#e32b4c'}}>*</span></label>
                            <select className="select-modern" value={contactPerson} onChange={e => setContactPerson(e.target.value)}>
                                <option value={contactPerson}>{contactPerson}</option>
                                <option value="Khác">Khác...</option>
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Địa chỉ hóa đơn</label>
                            <select className="select-modern" value={billingAddress} onChange={e => setBillingAddress(e.target.value)}>
                                <option value={billingAddress}>{billingAddress}</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', gap: '24px' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Email</label>
                                <input type="text" className="input-modern" style={{ background: '#f1f5f9' }} readOnly value={email} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Số điện thoại</label>
                                <input type="text" className="input-modern" style={{ background: '#f1f5f9' }} readOnly value={phone} />
                            </div>
                        </div>

                        <div>
                            <div style={{ display: 'inline-block' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Loại thanh toán <span style={{color: '#e32b4c'}}>*</span></label>
                                <div style={{ display: 'flex', gap: '24px' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                                        <input type="radio" name="paymentType" value="Phương thức 1" checked={paymentType === 'Phương thức 1'} onChange={e => setPaymentType(e.target.value)} />
                                        Phương thức 1
                                    </label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                                        <input type="radio" name="paymentType" value="Phương thức 2" checked={paymentType === 'Phương thức 2'} onChange={e => setPaymentType(e.target.value)} />
                                        Phương thức 2
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Địa chỉ giao hàng</label>
                            <select className="select-modern" value={shippingAddress} onChange={e => setShippingAddress(e.target.value)}>
                                <option value={shippingAddress}>{shippingAddress}</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* THÔNG TIN SẢN PHẨM */}
                <div className="form-card" style={{ padding: '24px' }}>
                    <div className="section-header" style={{ marginBottom: '24px' }}>
                        <h2 className="section-title" style={{ fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ color: '#64748b' }}>⌄</span> Thông tin sản phẩm
                        </h2>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1000px' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                                    <th style={{ padding: '12px 8px', textAlign: 'left', color: '#64748b', fontSize: '13px', fontWeight: 600, width: '40px' }}>No</th>
                                    <th style={{ padding: '12px 8px', textAlign: 'left', color: '#64748b', fontSize: '13px', fontWeight: 600, width: '40px' }}></th>
                                    <th style={{ padding: '12px 8px', textAlign: 'left', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Loại dự án</th>
                                    <th style={{ padding: '12px 8px', textAlign: 'left', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Nhóm dịch vụ</th>
                                    <th style={{ padding: '12px 8px', textAlign: 'left', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Tên dịch vụ</th>
                                    <th style={{ padding: '12px 8px', textAlign: 'left', color: '#64748b', fontSize: '13px', fontWeight: 600, width: '80px' }}>SL</th>
                                    <th style={{ padding: '12px 8px', textAlign: 'left', color: '#64748b', fontSize: '13px', fontWeight: 600, width: '100px' }}>Đơn vị</th>
                                    <th style={{ padding: '12px 8px', textAlign: 'left', color: '#64748b', fontSize: '13px', fontWeight: 600, width: '150px' }}>Đơn giá</th>
                                    <th style={{ padding: '12px 8px', textAlign: 'left', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Mô tả thêm</th>
                                    <th style={{ padding: '12px 8px', textAlign: 'left', color: '#64748b', fontSize: '13px', fontWeight: 600, width: '80px' }}>Thuế</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lines.map((line, index) => {
                                    const availableCategories = categories.filter(c => c.groupId === line.type);
                                    const availableProducts = allProducts.filter(p => p.categoryId === line.group);
                                    return (
                                    <tr key={line.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '12px 8px', color: '#475569', fontSize: '14px' }}>{String(index + 1).padStart(2, '0')}</td>
                                        <td style={{ padding: '12px 8px' }}>
                                            <button style={{ color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => handleRemoveLine(line.id)}>
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                        <td style={{ padding: '12px 8px' }}>
                                            <select className="select-modern" value={line.type} onChange={e => handleLineChange(line.id, 'type', e.target.value)} style={{ padding: '6px 8px', fontSize: '13px' }}>
                                                <option value="">-- Chọn --</option>
                                                {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                                            </select>
                                        </td>
                                        <td style={{ padding: '12px 8px' }}>
                                            <select className="select-modern" value={line.group} onChange={e => handleLineChange(line.id, 'group', e.target.value)} style={{ padding: '6px 8px', fontSize: '13px' }}>
                                                <option value="">-- Nhóm dịch vụ --</option>
                                                {availableCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                            </select>
                                        </td>
                                        <td style={{ padding: '12px 8px' }}>
                                            <select className="select-modern" value={line.service} onChange={e => handleLineChange(line.id, 'service', e.target.value)} style={{ padding: '6px 8px', fontSize: '13px' }}>
                                                <option value="">-- Dịch vụ --</option>
                                                {availableProducts.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                            </select>
                                        </td>
                                        <td style={{ padding: '12px 8px' }}>
                                            <input type="number" className="input-modern" value={line.qty} onChange={e => handleLineChange(line.id, 'qty', e.target.value)} style={{ padding: '6px 8px', fontSize: '13px', background: '#f1f5f9', width: '60px' }} min="1" />
                                        </td>
                                        <td style={{ padding: '12px 8px' }}>
                                            <input type="text" className="input-modern" value={line.unit} readOnly style={{ padding: '6px 8px', fontSize: '13px', background: '#f1f5f9', width: '80px', color: '#64748b' }} placeholder="--chọn--" />
                                        </td>
                                        <td style={{ padding: '12px 8px' }}>
                                            <input type="text" className="input-modern" value={line.price} onChange={e => handleLineChange(line.id, 'price', e.target.value)} placeholder="đ" style={{ padding: '6px 8px', fontSize: '13px', background: '#f1f5f9' }} />
                                        </td>
                                        <td style={{ padding: '12px 8px' }}>
                                            <input type="text" className="input-modern" value={line.desc} onChange={e => handleLineChange(line.id, 'desc', e.target.value)} placeholder="Nhập mô tả" style={{ padding: '6px 8px', fontSize: '13px', background: '#f1f5f9' }} />
                                        </td>
                                        <td style={{ padding: '12px 8px' }}>
                                            <span style={{ fontSize: '13px', color: '#475569' }}>{line.tax ? `${line.tax}%` : '10%'}</span>
                                        </td>
                                    </tr>
                                )})}
                            </tbody>
                        </table>
                    </div>

                    <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between' }}>
                        <span className="text-action text-link" onClick={handleAddLine} style={{ cursor: 'pointer', fontWeight: 500 }}>+ Thêm sản phẩm</span>
                        
                        <div style={{ width: '300px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#64748b', fontSize: '14px' }}>
                                <span>Tổng thành tiền</span>
                                <span style={{ color: '#f97316', fontWeight: 600 }}>{totals.subTotal.toLocaleString()} VND</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#64748b', fontSize: '14px' }}>
                                <span>Tổng VAT</span>
                                <span style={{ color: '#f97316', fontWeight: 600 }}>{totals.vat.toLocaleString()} VND</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '15px' }}>
                                <span>Tổng giá trị đơn hàng</span>
                                <span style={{ color: '#f97316', fontWeight: 700 }}>{totals.total.toLocaleString()} VND</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* TÀI LIỆU */}
                <div className="form-card" style={{ padding: '24px' }}>
                    <div className="section-header" style={{ marginBottom: '24px' }}>
                        <h2 className="section-title" style={{ fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ color: '#64748b' }}>⌄</span> Tài liệu
                        </h2>
                    </div>

                    <div 
                        onDragOver={e => e.preventDefault()}
                        onDrop={handleFileDrop}
                        style={{ 
                            border: '1px dashed #cbd5e1', 
                            background: '#f8fafc', 
                            borderRadius: '8px', 
                            padding: '32px', 
                            textAlign: 'center',
                            marginBottom: '24px',
                            position: 'relative'
                        }}
                    >
                        <label htmlFor="file-upload" style={{ cursor: 'pointer', display: 'block', width: '100%', height: '100%' }}>
                            <UploadCloud size={32} color="#94a3b8" style={{ marginBottom: '8px' }} />
                            <div style={{ color: '#64748b', fontSize: '14px' }}>Drag and drop or Browse your file</div>
                        </label>
                        <input type="file" multiple style={{ display: 'none' }} id="file-upload" onChange={handleFileDrop} />
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                                <th style={{ padding: '12px 8px', textAlign: 'left', color: '#64748b', fontSize: '13px', fontWeight: 600, width: '40px' }}>No</th>
                                <th style={{ padding: '12px 8px', textAlign: 'left', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Tài liệu</th>
                                <th style={{ padding: '12px 8px', textAlign: 'left', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Nội dung tài liệu</th>
                                <th style={{ padding: '12px 8px', textAlign: 'left', color: '#64748b', fontSize: '13px', fontWeight: 600, width: '200px' }}>Thời điểm tải lên</th>
                                <th style={{ padding: '12px 8px', textAlign: 'center', color: '#64748b', fontSize: '13px', fontWeight: 600, width: '80px' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {documents.map((doc, index) => (
                                <tr key={doc.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '12px 8px', color: '#475569', fontSize: '14px' }}>{String(index + 1).padStart(2, '0')}</td>
                                    <td style={{ padding: '12px 8px', fontSize: '14px', color: '#0ea5e9' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            {getFileIcon(doc.type)}
                                            {doc.name}
                                        </div>
                                    </td>
                                    <td style={{ padding: '12px 8px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontSize: '14px' }}>
                                            {doc.desc}
                                            <span style={{ color: '#cbd5e1', cursor: 'pointer' }}>✎</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '12px 8px', color: '#64748b', fontSize: '13px' }}>{doc.time}</td>
                                    <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                                        <button style={{ color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }} onClick={() => handleRemoveDoc(doc.id)}>
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {documents.length === 0 && (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '24px', color: '#94a3b8' }}>Chưa có tài liệu đính kèm</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                </div>
                </div>

                {/* KHUNG CHATTER BÊN PHẢI */}
                <div style={{ width: '400px', flexShrink: 0, position: 'sticky', top: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* Header Actions for Document */}
                    <div className="form-card" style={{ padding: '16px', display: 'flex', gap: '12px', justifyContent: 'space-between' }}>
                        <button className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center', padding: '8px' }} onClick={() => alert('Xem trước PDF')}>
                            <FileText size={16} /> Preview
                        </button>
                        <button className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center', padding: '8px' }} onClick={() => alert('Đã sinh file PDF')}>
                            <Download size={16} /> Generate
                        </button>
                        <button className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center', padding: '8px' }} onClick={() => alert('Mở popup gửi Email')}>
                            <Mail size={16} /> Email
                        </button>
                    </div>

                    {/* Chatter Box */}
                    <div className="form-card" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 150px)', overflow: 'hidden' }}>
                        {/* Chatter Tabs */}
                        <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', padding: '0 16px' }}>
                            <div 
                                style={{ padding: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: chatterTab === 'history' ? '#e32b4c' : '#64748b', borderBottom: chatterTab === 'history' ? '2px solid #e32b4c' : '2px solid transparent' }}
                                onClick={() => setChatterTab('history')}
                            >
                                <History size={16} /> LỊCH SỬ HOẠT ĐỘNG
                            </div>
                            <div 
                                style={{ padding: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: chatterTab === 'comment' ? '#e32b4c' : '#64748b', borderBottom: chatterTab === 'comment' ? '2px solid #e32b4c' : '2px solid transparent' }}
                                onClick={() => setChatterTab('comment')}
                            >
                                <MessageSquare size={16} /> COMMENT
                            </div>
                        </div>

                        {/* Chatter Content */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
                            {chatterTab === 'history' ? (
                                <div style={{ position: 'relative', paddingLeft: '12px' }}>
                                    <div style={{ position: 'absolute', left: '15px', top: '20px', bottom: 0, width: '2px', background: '#e2e8f0' }}></div>
                                    {histories.map(h => (
                                        <div key={h.id} style={{ position: 'relative', marginBottom: '24px' }}>
                                            <div style={{ position: 'absolute', left: '-1px', top: '4px', width: '10px', height: '10px', borderRadius: '50%', background: '#e32b4c', border: '2px solid #fff' }}></div>
                                            <div style={{ marginLeft: '24px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                                    <img src={h.avatar} alt="avatar" style={{ width: '20px', height: '20px', borderRadius: '50%' }} />
                                                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{h.user}</span>
                                                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>{h.time}</span>
                                                </div>
                                                <div style={{ fontSize: '14px', color: h.isStatus ? '#3b82f6' : '#475569', display: 'flex', alignItems: 'center', gap: h.isStatus ? '4px' : '0' }}>
                                                    {h.isStatus && <span style={{ color: '#64748b', fontSize: '12px', marginRight: '4px' }}>▶</span>}
                                                    {h.content}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {comments.map(c => (
                                        <div key={c.id} style={{ display: 'flex', gap: '12px' }}>
                                            <img src={c.avatar} alt="avatar" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                                            <div style={{ flex: 1, background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                                    <div>
                                                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{c.user}</div>
                                                        <div style={{ fontSize: '12px', color: '#94a3b8' }}>{c.time}</div>
                                                    </div>
                                                    <MoreVertical size={16} color="#94a3b8" />
                                                </div>
                                                <div style={{ fontSize: '14px', color: '#475569', marginBottom: '12px', lineHeight: '1.5' }}>
                                                    {c.content}
                                                </div>
                                                <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', alignItems: 'center' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b', fontSize: '12px' }}><ThumbsUp size={14} /> {c.likes}</div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ec4899', fontSize: '12px' }}><Heart size={14} /> {c.hearts}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Comment Input */}
                        {chatterTab === 'comment' && (
                            <div style={{ padding: '16px', borderTop: '1px solid #e2e8f0' }}>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <img src="https://i.pravatar.cc/150?u=3" alt="me" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                                            <textarea 
                                                value={commentInput}
                                                onChange={e => setCommentInput(e.target.value)}
                                                placeholder="Viết comment..." 
                                                style={{ width: '100%', border: 'none', padding: '12px', minHeight: '80px', resize: 'none', fontSize: '14px', outline: 'none' }}
                                            />
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
                                                <div style={{ display: 'flex', gap: '12px', color: '#64748b' }}>
                                                    <Smile size={16} style={{ cursor: 'pointer' }} />
                                                    <Paperclip size={16} style={{ cursor: 'pointer' }} />
                                                </div>
                                                <button className="btn btn-primary" style={{ padding: '6px 16px' }} onClick={() => { if(commentInput) { setCommentInput(''); } }}>
                                                    <Send size={14} /> Gửi
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default OrderForm;
