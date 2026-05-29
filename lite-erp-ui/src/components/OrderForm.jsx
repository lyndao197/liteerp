import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockStore } from '../utils/mockStore';
import { 
  ArrowLeft, Save, FileText, CheckCircle, Clock, 
  Menu, Type, Image, Table, Link as LinkIcon, Edit, 
  Search, Plus, ChevronDown, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Bold, Italic, Underline
} from 'lucide-react';


const OrderForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    // Form State
    const [customerName, setCustomerName] = useState('D-TECH');
    const [contractName, setContractName] = useState('Hợp đồng mua bán thiết bị');
    const [contractType, setContractType] = useState('Hợp đồng mua bán');
    const [contractGroup, setContractGroup] = useState('Nhóm dự án');
    const [status, setStatus] = useState('Mới');
    const [startDate, setStartDate] = useState('2026-05-15');
    const [endDate, setEndDate] = useState('2026-12-31');
    
    const [exchangeRate, setExchangeRate] = useState('1');
    const [paymentMethod, setPaymentMethod] = useState('Chuyển khoản');
    const [currency, setCurrency] = useState('VNĐ');
    const [vat, setVat] = useState('10');
    const [discountRate, setDiscountRate] = useState('0');
    const [discountAmount, setDiscountAmount] = useState('0');

    const [contactCus, setContactCus] = useState('Nguyễn Văn A');
    const [contactCom, setContactCom] = useState('Trần Thị B');
    const [note, setNote] = useState('');
    const [deliveryDate, setDeliveryDate] = useState('2026-06-01');

    const totals = {
        subTotal: 50000000,
        vat: 5000000,
        discount: 0,
        total: 55000000
    };

    const handleSave = () => {
        alert('Đã lưu hợp đồng (Demo)');
    };

    return (
        <div style={{ display: 'flex', height: '100vh', width: '100%', overflow: 'hidden', background: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>
            
            {/* LEFT PANEL: ONLYOFFICE MOCKUP (70%) */}
            <div style={{ flex: '7', display: 'flex', flexDirection: 'column', borderRight: '1px solid #e2e8f0', background: '#e5e7eb' }}>
                
                {/* Fake OnlyOffice Header */}
                <div style={{ background: '#fff', borderBottom: '1px solid #cbd5e1' }}>
                    {/* Top bar */}
                    <div style={{ display: 'flex', alignItems: 'center', padding: '8px 16px', background: '#1e40af', color: 'white', gap: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                            <FileText size={20} />
                            ONLYOFFICE
                        </div>
                        <div style={{ fontSize: '13px', opacity: 0.9 }}>Tạo mới hợp đồng.docx</div>
                    </div>
                    {/* Toolbar Tabs */}
                    <div style={{ display: 'flex', gap: '16px', padding: '8px 16px', borderBottom: '1px solid #e2e8f0', fontSize: '13px', color: '#475569' }}>
                        <span style={{ fontWeight: 600, color: '#1e40af', borderBottom: '2px solid #1e40af', paddingBottom: '4px' }}>Trang chủ</span>
                        <span>Chèn</span>
                        <span>Bố cục</span>
                        <span>Tham chiếu</span>
                        <span>Cộng tác</span>
                        <span>Bảo vệ</span>
                    </div>
                    {/* Toolbar Actions */}
                    <div style={{ display: 'flex', gap: '16px', padding: '8px 16px', alignItems: 'center', color: '#475569' }}>
                        <div style={{ display: 'flex', gap: '8px', borderRight: '1px solid #e2e8f0', paddingRight: '16px' }}>
                            <Menu size={18} />
                            <Save size={18} />
                        </div>
                        <div style={{ display: 'flex', gap: '8px', borderRight: '1px solid #e2e8f0', paddingRight: '16px' }}>
                            <select style={{ border: '1px solid #cbd5e1', borderRadius: '4px', padding: '2px 8px', fontSize: '12px' }}>
                                <option>Arial</option>
                                <option>Times New Roman</option>
                            </select>
                            <select style={{ border: '1px solid #cbd5e1', borderRadius: '4px', padding: '2px 8px', fontSize: '12px' }}>
                                <option>12</option>
                                <option>14</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', borderRight: '1px solid #e2e8f0', paddingRight: '16px' }}>
                            <Bold size={16} />
                            <Italic size={16} />
                            <Underline size={16} />
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <AlignLeft size={16} />
                            <AlignCenter size={16} />
                            <AlignRight size={16} />
                            <AlignJustify size={16} />
                        </div>
                    </div>
                </div>

                {/* Fake Document Canvas */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '40px', display: 'flex', justifyContent: 'center' }}>
                    <div style={{ 
                        width: '800px', 
                        minHeight: '1122px', 
                        background: '#fff', 
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                        padding: '96px',
                        position: 'relative'
                    }}>
                        {/* Content Mockup */}
                        <h1 style={{ color: '#1e3a8a', fontSize: '28px', marginBottom: '24px', textAlign: 'center' }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h1>
                        <h2 style={{ fontSize: '18px', textAlign: 'center', marginBottom: '48px' }}>Độc lập - Tự do - Hạnh phúc</h2>
                        
                        <h1 style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold', marginBottom: '48px' }}>HỢP ĐỒNG MUA BÁN THIẾT BỊ</h1>
                        
                        <p style={{ lineHeight: '1.8', fontSize: '15px', color: '#334155', textAlign: 'justify' }}>
                            Hôm nay, ngày ... tháng ... năm ..., tại .............................................................<br/>
                            Chúng tôi gồm có:
                        </p>
                        
                        <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '24px', marginBottom: '12px' }}>BÊN A (BÊN BÁN): {'{customerName}'}</h3>
                        <p style={{ lineHeight: '1.8', fontSize: '15px', color: '#334155' }}>
                            Địa chỉ: {'{billingAddress}'}<br/>
                            Điện thoại: {'{phone}'}<br/>
                            Mã số thuế: {'{taxCode}'}<br/>
                            Đại diện: <strong>{'{contactPerson}'}</strong> - Chức vụ: Giám đốc
                        </p>

                        <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '24px', marginBottom: '12px' }}>BÊN B (BÊN MUA): CÔNG TY CỔ PHẦN CÔNG NGHỆ XERP</h3>
                        <p style={{ lineHeight: '1.8', fontSize: '15px', color: '#334155' }}>
                            Địa chỉ: Tầng 3, Tòa nhà DND, Hà Nội<br/>
                            Đại diện: <strong>{'{contactCom}'}</strong>
                        </p>

                        <p style={{ lineHeight: '1.8', fontSize: '15px', color: '#334155', marginTop: '24px', textAlign: 'justify' }}>
                            Sau khi bàn bạc, hai bên thống nhất ký kết Hợp đồng kinh tế với các điều khoản như sau:
                        </p>

                        <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '24px', marginBottom: '12px' }}>ĐIỀU 1: NỘI DUNG VÀ GIÁ TRỊ HỢP ĐỒNG</h3>
                        <p style={{ lineHeight: '1.8', fontSize: '15px', color: '#334155', marginBottom: '12px' }}>
                            Bên A đồng ý bán và Bên B đồng ý mua các thiết bị/dịch vụ theo bảng chi tiết sau:
                        </p>

                        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
                            <thead>
                                <tr style={{ background: '#f1f5f9' }}>
                                    <th style={{ border: '1px solid #cbd5e1', padding: '8px', textAlign: 'center' }}>STT</th>
                                    <th style={{ border: '1px solid #cbd5e1', padding: '8px', textAlign: 'left' }}>Tên Hàng Hóa/Dịch Vụ</th>
                                    <th style={{ border: '1px solid #cbd5e1', padding: '8px', textAlign: 'center' }}>SL</th>
                                    <th style={{ border: '1px solid #cbd5e1', padding: '8px', textAlign: 'center' }}>Đơn giá</th>
                                    <th style={{ border: '1px solid #cbd5e1', padding: '8px', textAlign: 'center' }}>Thành tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td colSpan="5" style={{ border: '1px solid #cbd5e1', padding: '8px', textAlign: 'center', color: '#94a3b8', fontStyle: 'italic' }}>
                                        {'{#products}...{/products}'}
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan="4" style={{ border: '1px solid #cbd5e1', padding: '8px', textAlign: 'right', fontWeight: 'bold' }}>TỔNG CỘNG:</td>
                                    <td style={{ border: '1px solid #cbd5e1', padding: '8px', textAlign: 'right', fontWeight: 'bold' }}>{'{totalAmount}'}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL: FORM (30%) */}
            <div style={{ flex: '3', minWidth: '350px', maxWidth: '450px', background: '#fff', display: 'flex', flexDirection: 'column' }}>
                
                {/* Panel Header */}
                <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => navigate(-1)}>
                        <ArrowLeft size={18} color="#475569" />
                        <span style={{ fontSize: '14px', color: '#475569' }}>Quay lại</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '13px' }} onClick={() => navigate(-1)}>Hủy</button>
                        <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '13px', background: '#e32b4c', border: 'none' }} onClick={handleSave}>Lưu & Tiếp tục</button>
                    </div>
                </div>

                <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#0f172a', margin: 0 }}>Tạo mới hợp đồng</h2>
                </div>

                {/* Panel Body (Scrollable) */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    
                    {/* Section 1 */}
                    <div className="form-section">
                        <div className="section-title" style={{ fontSize: '14px', fontWeight: 600, color: '#1e40af', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <ChevronDown size={16} /> Thông tin chung
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div>
                                <label className="form-label" style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', display: 'block' }}>Tên khách hàng *</label>
                                <div style={{ display: 'flex', gap: '4px' }}>
                                    <input type="text" className="input-modern" value={customerName} onChange={e => setCustomerName(e.target.value)} style={{ padding: '6px 8px', fontSize: '13px', flex: 1 }} />
                                    <button className="btn btn-secondary" style={{ padding: '6px 8px' }}><Search size={14}/></button>
                                </div>
                            </div>
                            <div>
                                <label className="form-label" style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', display: 'block' }}>Tên hợp đồng *</label>
                                <input type="text" className="input-modern" value={contractName} onChange={e => setContractName(e.target.value)} style={{ padding: '6px 8px', fontSize: '13px', width: '100%' }} />
                            </div>
                            <div>
                                <label className="form-label" style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', display: 'block' }}>Loại hợp đồng</label>
                                <select className="select-modern" value={contractType} onChange={e => setContractType(e.target.value)} style={{ padding: '6px 8px', fontSize: '13px', width: '100%' }}>
                                    <option>Hợp đồng mua bán</option>
                                    <option>Hợp đồng dịch vụ</option>
                                </select>
                            </div>
                            <div>
                                <label className="form-label" style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', display: 'block' }}>Nhóm hợp đồng</label>
                                <select className="select-modern" value={contractGroup} onChange={e => setContractGroup(e.target.value)} style={{ padding: '6px 8px', fontSize: '13px', width: '100%' }}>
                                    <option>Nhóm dự án</option>
                                    <option>Nhóm bảo trì</option>
                                </select>
                            </div>
                            <div>
                                <label className="form-label" style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', display: 'block' }}>Trạng thái</label>
                                <select className="select-modern" value={status} onChange={e => setStatus(e.target.value)} style={{ padding: '6px 8px', fontSize: '13px', width: '100%', background: '#f1f5f9' }} disabled>
                                    <option>Mới</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <div style={{ flex: 1 }}>
                                    <label className="form-label" style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', display: 'block' }}>Ngày hiệu lực</label>
                                    <input type="date" className="input-modern" value={startDate} onChange={e => setStartDate(e.target.value)} style={{ padding: '6px 8px', fontSize: '13px', width: '100%' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label className="form-label" style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', display: 'block' }}>Ngày hết hiệu lực</label>
                                    <input type="date" className="input-modern" value={endDate} onChange={e => setEndDate(e.target.value)} style={{ padding: '6px 8px', fontSize: '13px', width: '100%' }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2 */}
                    <div className="form-section">
                        <div className="section-title" style={{ fontSize: '14px', fontWeight: 600, color: '#1e40af', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <ChevronDown size={16} /> Thông tin hợp đồng chi tiết
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <div style={{ flex: 1 }}>
                                    <label className="form-label" style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', display: 'block' }}>Tỷ giá</label>
                                    <input type="number" className="input-modern" value={exchangeRate} onChange={e => setExchangeRate(e.target.value)} style={{ padding: '6px 8px', fontSize: '13px', width: '100%' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label className="form-label" style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', display: 'block' }}>Hình thức TT</label>
                                    <select className="select-modern" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} style={{ padding: '6px 8px', fontSize: '13px', width: '100%' }}>
                                        <option>Chuyển khoản</option>
                                        <option>Tiền mặt</option>
                                    </select>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <div style={{ flex: 1 }}>
                                    <label className="form-label" style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', display: 'block' }}>Loại tiền</label>
                                    <select className="select-modern" value={currency} onChange={e => setCurrency(e.target.value)} style={{ padding: '6px 8px', fontSize: '13px', width: '100%' }}>
                                        <option>VNĐ</option>
                                        <option>USD</option>
                                    </select>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label className="form-label" style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', display: 'block' }}>Thuế VAT (%)</label>
                                    <select className="select-modern" value={vat} onChange={e => setVat(e.target.value)} style={{ padding: '6px 8px', fontSize: '13px', width: '100%' }}>
                                        <option>10</option>
                                        <option>8</option>
                                        <option>0</option>
                                    </select>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <div style={{ flex: 1 }}>
                                    <label className="form-label" style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', display: 'block' }}>Tỷ lệ CK (%)</label>
                                    <input type="number" className="input-modern" value={discountRate} onChange={e => setDiscountRate(e.target.value)} style={{ padding: '6px 8px', fontSize: '13px', width: '100%' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label className="form-label" style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', display: 'block' }}>Tiền CK</label>
                                    <input type="number" className="input-modern" value={discountAmount} onChange={e => setDiscountAmount(e.target.value)} style={{ padding: '6px 8px', fontSize: '13px', width: '100%' }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 3 */}
                    <div className="form-section">
                        <div className="section-title" style={{ fontSize: '14px', fontWeight: 600, color: '#1e40af', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <ChevronDown size={16} /> Liên hệ
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div>
                                <label className="form-label" style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', display: 'block' }}>Người liên hệ KH</label>
                                <select className="select-modern" value={contactCus} onChange={e => setContactCus(e.target.value)} style={{ padding: '6px 8px', fontSize: '13px', width: '100%' }}>
                                    <option>Nguyễn Văn A</option>
                                </select>
                            </div>
                            <div>
                                <label className="form-label" style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', display: 'block' }}>Liên hệ công ty</label>
                                <select className="select-modern" value={contactCom} onChange={e => setContactCom(e.target.value)} style={{ padding: '6px 8px', fontSize: '13px', width: '100%' }}>
                                    <option>Trần Thị B</option>
                                </select>
                            </div>
                            <div>
                                <label className="form-label" style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', display: 'block' }}>Ghi chú</label>
                                <textarea className="input-modern" value={note} onChange={e => setNote(e.target.value)} style={{ padding: '6px 8px', fontSize: '13px', width: '100%', minHeight: '60px', resize: 'vertical' }} />
                            </div>
                        </div>
                    </div>

                    {/* Section 4 */}
                    <div className="form-section">
                        <div className="section-title" style={{ fontSize: '14px', fontWeight: 600, color: '#1e40af', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <ChevronDown size={16} /> Giao hàng
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div>
                                <label className="form-label" style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', display: 'block' }}>Ngày giao hàng</label>
                                <input type="date" className="input-modern" value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)} style={{ padding: '6px 8px', fontSize: '13px', width: '100%' }} />
                            </div>
                        </div>
                    </div>

                    {/* Section 5 - Products */}
                    <div className="form-section">
                        <div className="section-title" style={{ fontSize: '14px', fontWeight: 600, color: '#1e40af', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <ChevronDown size={16} /> Chi tiết sản phẩm
                            </div>
                            <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '12px', display: 'flex', gap: '4px', alignItems: 'center' }}>
                                <Plus size={14} /> Thêm
                            </button>
                        </div>
                        <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>Phần mềm XERP Enterprise</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b' }}>
                                <span>SL: 1 x 50,000,000</span>
                                <span>Thành tiền: 50,000,000</span>
                            </div>
                        </div>
                    </div>

                    {/* Totals Box */}
                    <div className="form-section" style={{ background: '#f1f5f9', padding: '16px', borderRadius: '8px', marginTop: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#475569', marginBottom: '8px' }}>
                            <span>Tổng trước thuế</span>
                            <span style={{ fontWeight: 600 }}>{totals.subTotal.toLocaleString()}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#475569', marginBottom: '8px' }}>
                            <span>VAT</span>
                            <span style={{ fontWeight: 600 }}>{totals.vat.toLocaleString()}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#475569', marginBottom: '12px' }}>
                            <span>Chiết khấu</span>
                            <span style={{ fontWeight: 600 }}>{totals.discount.toLocaleString()}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', color: '#1e40af', fontWeight: 700, borderTop: '1px solid #cbd5e1', paddingTop: '12px' }}>
                            <span>Tổng cộng</span>
                            <span>{totals.total.toLocaleString()}</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default OrderForm;
