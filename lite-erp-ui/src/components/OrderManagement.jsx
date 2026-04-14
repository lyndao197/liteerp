import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  ChevronUp, 
  ChevronDown, 
  Download, 
  SlidersHorizontal,
  List,
  Grid2X2,
  Edit2
} from 'lucide-react';
import { mockStore } from '../utils/mockStore';

const OrderManagement = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [sortConfig, setSortConfig] = useState({ key: 'orderNo', direction: 'desc' });
    const [filters, setFilters] = useState({});
    const [activeFilterCol, setActiveFilterCol] = useState(null);
    const [visibleColumns, setVisibleColumns] = useState(['orderNo', 'contractNo', 'customerName', 'orderDate', 'totalAmount', 'orderStatus']);
    const [showColPicker, setShowColPicker] = useState(false);
    const [pickerPos, setPickerPos] = useState({ top: 0, right: 0 });
    const [selectedIds, setSelectedIds] = useState(new Set());

    const toggleSelectAll = () => {
        if (selectedIds.size === processedOrders.length && processedOrders.length > 0) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(processedOrders.map(c => c.id || c.orderNo)));
        }
    };

    const toggleSelectRow = (e, id) => {
        e.stopPropagation();
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) newSelected.delete(id);
        else newSelected.add(id);
        setSelectedIds(newSelected);
    };

    useEffect(() => {
        const fetchOrders = () => {
            const data = mockStore.getAllOrders();
            // enrich orders with customerName and contractNo for display
            const enriched = data.map(o => {
                const contract = o.contractId ? mockStore.getContract(o.contractId) : null;
                const customer = o.customerId ? mockStore.getCustomer(o.customerId) : null;
                return {
                    ...o,
                    contractNo: contract ? contract.contractNo : '',
                    contractName: contract ? contract.name : '',
                    shortName: contract ? contract.shortName : '',
                    customerName: contract ? contract.customerName : (customer ? (customer.company || customer.name) : '')
                };
            });
            setOrders(enriched || []);
        };
        fetchOrders();
    }, []);

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
        else if (sortConfig.key === key && sortConfig.direction === 'desc') {
            direction = null;
            key = null;
        }
        setSortConfig({ key, direction });
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => {
            const colFilters = prev[key] || [];
            if (colFilters.includes(value)) {
                const updated = colFilters.filter(v => v !== value);
                if (updated.length === 0) {
                    const { [key]: _, ...rest } = prev;
                    return rest;
                }
                return { ...prev, [key]: updated };
            } else {
                return { ...prev, [key]: [...colFilters, value] };
            }
        });
    };

    const processedOrders = useMemo(() => {
        let result = orders ? [...orders] : [];
        
        if (searchTerm) {
            const low = searchTerm.toLowerCase();
            result = result.filter(o => 
                (o.orderNo?.toLowerCase().includes(low)) || 
                (o.customerName?.toLowerCase().includes(low)) ||
                (o.contractNo?.toLowerCase().includes(low))
            );
        }
        if (statusFilter !== 'All') {
            result = result.filter(o => o.orderStatus === statusFilter);
        }
        Object.keys(filters).forEach(key => {
            if (filters[key]?.length > 0) {
                result = result.filter(c => filters[key].includes(c[key]));
            }
        });
        if (sortConfig.key && sortConfig.direction) {
            result.sort((a, b) => {
                const aVal = a[sortConfig.key] || '';
                const bVal = b[sortConfig.key] || '';
                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return result;
    }, [orders, searchTerm, statusFilter, filters, sortConfig]);

    const getStatusClass = (status) => {
        switch(status) {
            case 'Mới': return 'status-badge-modern status-badge-blue';
            case 'Đang triển khai': return 'status-badge-modern status-badge-yellow';
            case 'Hoàn thành': return 'status-badge-modern status-badge-green';
            case 'Đã hủy': return 'status-badge-modern status-badge-gray';
            default: return 'status-badge-modern status-badge-gray';
        }
    };

    const formatCurrency = (val) => {
        if (!val) return '0 ₫';
        return parseInt(val).toLocaleString('vi-VN') + ' ₫';
    };

    const TableHeader = ({ label, columnKey, hasFilter = false }) => {
        return (
            <th onClick={() => handleSort(columnKey)} style={{ position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', flex: 1 }}>
                        {label}
                        <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '6px', color: sortConfig.key === columnKey ? '#0f172a' : '#cbd5e1' }}>
                            <ChevronUp size={12} style={{ marginBottom: '-4px', opacity: sortConfig.key === columnKey && sortConfig.direction === 'desc' ? 0.3 : 1 }} />
                            <ChevronDown size={12} style={{ opacity: sortConfig.key === columnKey && sortConfig.direction === 'asc' ? 0.3 : 1 }} />
                        </div>
                    </div>
                    {hasFilter && (
                        <div onClick={(e) => { e.stopPropagation(); setActiveFilterCol(activeFilterCol === columnKey ? null : columnKey); }} style={{ cursor: 'pointer', color: filters[columnKey]?.length > 0 ? '#e32b4c' : '#94a3b8' }}>
                            <Filter size={14} />
                        </div>
                    )}
                </div>
                {activeFilterCol === columnKey && (
                    <div className="column-filter-popup" onClick={e => e.stopPropagation()} style={{ position: 'absolute', top: '100%', right: 0, zIndex: 10, background: 'white', border: '1px solid #cbd5e1', borderRadius: '4px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', minWidth: '180px', padding: '8px', fontWeight: 'normal', color: '#334155' }}>
                        <div style={{ marginBottom: '8px', fontWeight: 600, fontSize: '12px', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px' }}>Lọc: {label}</div>
                        <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                            {([...new Set(orders.map(c => c[columnKey]))].filter(Boolean)).map(val => (
                                <label key={val} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', padding: '4px 0', cursor: 'pointer' }}>
                                    <input type="checkbox" checked={filters[columnKey]?.includes(val) || false} onChange={() => handleFilterChange(columnKey, val)} />
                                    {val}
                                </label>
                            ))}
                        </div>
                    </div>
                )}
            </th>
        );
    };

    return (
        <div className="contract-page-container" onClick={() => setActiveFilterCol(null)}>
            <div className="contract-page-header">
                <div className="contract-header-left">
                    <h1>Quản lý đơn hàng</h1>
                    <p className="contract-subtitle">Quản lý và theo dõi danh sách các đơn hàng từ Hợp đồng.</p>
                </div>
            </div>

            <div className="metrics-cards-container" style={{ display: 'flex', gap: '24px', marginBottom: '24px', marginTop: '16px' }}>
                <div className="metric-card" style={{ flex: 1, backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '21px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#44494D', textTransform: 'uppercase', letterSpacing: '0.6px' }}>Tổng đơn hàng mới</span>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%' }}>
                        <span style={{ fontSize: '24px', fontWeight: 700, color: '#000', lineHeight: '32px' }}>{orders.filter(o => o.orderStatus === 'Mới' || !o.orderStatus).length}</span>
                    </div>
                </div>
                <div className="metric-card" style={{ flex: 1, backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '21px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#44494D', textTransform: 'uppercase', letterSpacing: '0.6px' }}>Tổng ĐH Hoàn thành</span>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%' }}>
                        <span style={{ fontSize: '24px', fontWeight: 700, color: '#000', lineHeight: '32px' }}>{orders.filter(o => o.orderStatus === 'Hoàn thành').length}</span>
                    </div>
                </div>
                <div className="metric-card" style={{ flex: 1, backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '21px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#44494D', textTransform: 'uppercase', letterSpacing: '0.6px' }}>ĐH Đang triển khai</span>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%' }}>
                        <span style={{ fontSize: '24px', fontWeight: 700, color: '#000', lineHeight: '32px' }}>{orders.filter(o => o.orderStatus === 'Đang triển khai').length}</span>
                    </div>
                </div>
                <div className="metric-card" style={{ flex: 1, backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '21px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#44494D', textTransform: 'uppercase', letterSpacing: '0.6px' }}>Tổng đơn hàng hủy</span>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%' }}>
                        <span style={{ fontSize: '24px', fontWeight: 700, color: '#000', lineHeight: '32px' }}>{orders.filter(o => o.orderStatus === 'Đã hủy').length}</span>
                    </div>
                </div>
            </div>

            <div className="toolbar-row">
                <div className="toolbar-left">
                    <div className="search-box-modern">
                        <Search size={18} color="#94a3b8" />
                        <input type="text" placeholder="Tìm kiếm đơn hàng, khách hàng..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                    <select className="select-modern" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{marginLeft: '12px', minWidth: '180px'}}>
                        <option value="All">Tất cả trạng thái</option>
                        <option value="Mới">Mới</option>
                        <option value="Đang triển khai">Đang triển khai</option>
                        <option value="Hoàn thành">Hoàn thành</option>
                        <option value="Đã hủy">Đã hủy</option>
                    </select>
                </div>
                
                <div className="toolbar-right">
                    <button className="btn-primary" onClick={() => navigate('/order/new')}>
                        <Plus size={20} /> Tạo mới Đơn hàng
                    </button>
                    <button className="btn-outline-brand">
                        <Download size={18} /> Xuất Excel
                    </button>
                </div>
            </div>

            <div className="contract-table-wrapper">
                <table className="contract-table">
                    <thead>
                        <tr>
                            <th style={{width: '40px', textAlign: 'center'}}>
                                <input 
                                    type="checkbox" 
                                    checked={processedOrders.length > 0 && selectedIds.size === processedOrders.length}
                                    onChange={toggleSelectAll}
                                />
                            </th>
                            {visibleColumns.includes('orderNo') && <TableHeader label="Mã ĐH" columnKey="orderNo" hasFilter={true} />}
                            {visibleColumns.includes('contractNo') && <TableHeader label="Số Hợp Đồng" columnKey="contractNo" hasFilter={true} />}
                            {visibleColumns.includes('customerName') && <TableHeader label="Khách hàng" columnKey="customerName" hasFilter={true} />}
                            {visibleColumns.includes('orderDate') && <TableHeader label="Ngày lên đơn" columnKey="orderDate" hasFilter={true} />}
                            {visibleColumns.includes('totalAmount') && <TableHeader label="Tổng giá trị" columnKey="totalAmount" hasFilter={false} />}
                            {visibleColumns.includes('orderStatus') && <TableHeader label="Trạng thái" columnKey="orderStatus" hasFilter={true} />}
                            <th style={{width: '50px', textAlign: 'center', cursor: 'pointer', position: 'relative'}} onClick={(e) => { 
                                e.stopPropagation(); 
                                if (!showColPicker) {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    setPickerPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
                                }
                                setShowColPicker(!showColPicker); 
                            }}>
                                <SlidersHorizontal size={16} color="#94a3b8" />
                                {showColPicker && createPortal(
                                    <div className="column-picker-popup" onClick={e => e.stopPropagation()} style={{position: 'fixed', top: `${pickerPos.top}px`, right: `${pickerPos.right}px`, zIndex: 9999, background: 'white', border: '1px solid #cbd5e1', borderRadius: '4px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', minWidth: '180px', padding: '12px', fontWeight: 'normal', textAlign: 'left'}}>
                                        <div style={{marginBottom: '8px', fontWeight: 600, fontSize: '12px', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px', color: '#1e293b'}}>Hiển thị cột</div>
                                        {['orderNo', 'contractNo', 'customerName', 'orderDate', 'totalAmount', 'orderStatus'].map(key => {
                                            const labelMap = { orderNo: 'Mã ĐH', contractNo: 'Số Hợp Đồng', customerName: 'Khách hàng', orderDate: 'Ngày lên đơn', totalAmount: 'Tổng giá trị', orderStatus: 'Trạng thái' };
                                            return (
                                                <label key={key} style={{display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0', fontSize: '13px', cursor: 'pointer', color: '#334155'}}>
                                                    <input type="checkbox" checked={visibleColumns.includes(key)} onChange={() => {
                                                        setVisibleColumns(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
                                                    }}/>
                                                    {labelMap[key]}
                                                </label>
                                            );
                                        })}
                                    </div>,
                                    document.body
                                )}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {processedOrders.length > 0 ? (
                            processedOrders.map(o => {
                                const stClass = getStatusClass(o.orderStatus);
                                return (
                                    <tr key={o.id || o.orderNo} onClick={() => navigate(`/order/edit/${o.id}`)} className={selectedIds.has(o.id || o.orderNo) ? 'row-selected' : ''}>
                                        <td style={{textAlign: 'center'}} onClick={(e) => e.stopPropagation()}>
                                            <input 
                                                type="checkbox" 
                                                checked={selectedIds.has(o.id || o.orderNo)} 
                                                onChange={(e) => toggleSelectRow(e, o.id || o.orderNo)} 
                                            />
                                        </td>
                                        {visibleColumns.includes('orderNo') && <td style={{fontWeight: 600, color: '#3b82f6'}}>{o.orderNo}</td>}
                                        {visibleColumns.includes('contractNo') && <td style={{fontWeight: 500, color: '#1e293b'}}>{o.contractNo}</td>}
                                        {visibleColumns.includes('customerName') && (
                                        <td>
                                            <div style={{fontWeight: 700, color: '#1e293b'}}>{o.shortName || o.customerName}</div>
                                            {o.shortName && <div style={{fontSize: '12px', color: '#64748b', marginTop: '2px'}}>{o.customerName}</div>}
                                        </td>
                                        )}
                                        {visibleColumns.includes('orderDate') && <td>{o.orderDate}</td>}
                                        {visibleColumns.includes('totalAmount') && <td style={{fontWeight: 700}}>{formatCurrency(o.totalAmount)}</td>}
                                        {visibleColumns.includes('orderStatus') && (
                                        <td>
                                            <span className={stClass}>
                                                {o.orderStatus || 'Mới'}
                                            </span>
                                        </td>
                                        )}
                                        <td style={{textAlign: 'center'}} onClick={(e) => { e.stopPropagation(); if (o.orderStatus === 'Mới' || !o.orderStatus) navigate(`/order/edit/${o.id}`); }}>
                                            {(o.orderStatus === 'Mới' || !o.orderStatus) && (
                                                <Edit2 size={16} color="#64748b" style={{cursor: 'pointer'}} />
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="8" style={{textAlign: 'center', padding: '80px', color: '#94a3b8'}}>
                                    Không có đơn hàng nào
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderManagement;
