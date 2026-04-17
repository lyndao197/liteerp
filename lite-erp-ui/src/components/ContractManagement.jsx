import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Plus,
    Search,
    Filter,
    ChevronUp,
    ChevronDown,
    Download,
    Upload,
    SlidersHorizontal,
    MoreVertical,
    ExternalLink,
    ArrowLeft,
    List,
    Grid2X2
} from 'lucide-react';
import { mockStore } from '../utils/mockStore';
import './CustomerList.css';
import './ContractManagement.css';

const ContractManagement = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isPendingView = false;
    const [contracts, setContracts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'contractNo', direction: 'desc' });
    const [filters, setFilters] = useState({});
    const [activeFilterCol, setActiveFilterCol] = useState(null);
    const [visibleColumns, setVisibleColumns] = useState(['contractNo', 'name', 'customerName', 'signedDate', 'contractValue', 'contractStatus', 'approvalStatus', 'revenueMonth']);
    const [showColPicker, setShowColPicker] = useState(false);
    const [pickerPos, setPickerPos] = useState({ top: 0, right: 0 });
    const [selectedIds, setSelectedIds] = useState(new Set());

    // --- SELECTION LOGIC ---
    const toggleSelectAll = () => {
        if (selectedIds.size === processedContracts.length && processedContracts.length > 0) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(processedContracts.map(c => c.id || c.contractNo)));
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
        const data = mockStore.getAllContracts();
        setContracts(data || []);
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



    const processedContracts = useMemo(() => {
        let result = contracts ? [...contracts] : [];

        // Filter by type based on URL
        if (location.pathname.includes('/solution')) {
            result = result.filter(c => c.serviceType?.toLowerCase().includes('giải pháp') || c.serviceType?.toLowerCase().includes('platform'));
        } else if (location.pathname.includes('/service')) {
            result = result.filter(c => c.serviceType?.toLowerCase().includes('dịch vụ') || c.serviceType?.toLowerCase().includes('outsourcing'));
        } else if (location.pathname.includes('/supplier-contracts')) {
            // Mock filter for supplier contracts: Internal or specifically designated
            result = result.filter(c => c.classification === 'Nội bộ' || c.serviceType?.includes('Dịch vụ CC outsourcing'));
        }

        if (isPendingView) {
            result = result.filter(contract => ['Chờ duyệt bản thảo', 'Chờ duyệt bản ký'].includes(contract.approvalStatus));
        }

        if (searchTerm) {
            const low = searchTerm.toLowerCase();
            result = result.filter(c =>
                (c.contractNo?.toLowerCase().includes(low)) ||
                (c.customerName?.toLowerCase().includes(low)) ||
                (c.amName?.toLowerCase().includes(low))
            );
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
    }, [contracts, searchTerm, filters, sortConfig, isPendingView, location.pathname]);

    const getStatusClass = (status) => {
        switch (status) {
            case 'Hiệu lực': return 'status-badge-modern status-badge-green';
            case 'Chờ Upload': return 'status-badge-modern status-badge-green';
            case 'Chờ duyệt bản ký': return 'status-badge-modern status-badge-yellow';
            case 'Chờ duyệt bản thảo': return 'status-badge-modern status-badge-yellow';
            default: return 'status-badge-modern status-badge-gray';
        }
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
                            {(columnKey === 'approvalStatus' ? ['Nháp', 'Chờ duyệt bản thảo', 'Chờ Upload', 'Chờ duyệt bản ký', 'Hiệu lực'] : [...new Set(contracts.map(c => c[columnKey]))].filter(Boolean)).map(val => (
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

    const isSupplierView = location.pathname.includes('/supplier-contracts');

    const pageTitle = isSupplierView 
        ? 'Danh sách Hợp đồng Nhà cung cấp'
        : location.pathname.includes('/solution') 
            ? 'Quản lý bản thảo và Hợp đồng' 
            : 'Quản lý hợp đồng';

    const pageSubtitle = isSupplierView
        ? `Quản lý danh sách các hợp đồng đầu vào từ nhà cung cấp đối tác.`
        : location.pathname.includes('/solution')
            ? `Hiện có ${processedContracts.length} bản thảo và hợp đồng đang được quản lý.`
            : `Hiện có ${contracts.length || 0} hợp đồng kinh doanh đang được quản lý trên hệ thống.`;


    return (
        <div className="contract-page-container" onClick={() => setActiveFilterCol(null)}>
            <div className="contract-page-header">
                <div className="contract-header-left">
                    <h1>{pageTitle}</h1>
                    <p className="contract-subtitle">{pageSubtitle}</p>
                </div>
            </div>

            <div className="metric-cards-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                <div className="crm-metric-card">
                    <p className="crm-card-title">Hợp đồng mới</p>
                    <div className="crm-card-body">
                        <p className="crm-card-value">{contracts.length > 0 ? 12 : 0}</p>
                        <span className="crm-card-indicator indicator-neutral">0%</span>
                    </div>
                </div>
                <div className="crm-metric-card">
                    <p className="crm-card-title">Tổng hợp chờ duyệt</p>
                    <div className="crm-card-body">
                        <p className="crm-card-value">{contracts.filter(c => c.approvalStatus === 'Chờ duyệt bản thảo' || c.approvalStatus === 'Chờ duyệt bản ký').length}</p>
                        <span className="crm-card-indicator indicator-up">+5%</span>
                    </div>
                </div>
                <div className="crm-metric-card">
                    <p className="crm-card-title">Hợp đồng hiệu lực</p>
                    <div className="crm-card-body">
                        <p className="crm-card-value">{contracts.filter(c => c.approvalStatus === 'Hiệu lực').length}</p>
                        <span className="crm-card-indicator indicator-up">+12%</span>
                    </div>
                </div>
            </div>

            <div className="toolbar-row">
                <div className="toolbar-left">
                    <div className="search-box-modern">
                        <Search size={18} color="#94a3b8" />
                        <input type="text" placeholder="Tìm kiếm ..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                    <select
                        className="btn-outline-brand"
                        style={{ marginLeft: '12px', padding: '0 12px', height: '36px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', background: 'white', color: '#334155' }}
                        value={filters.approvalStatus?.[0] || ''}
                        onChange={(e) => {
                            const val = e.target.value;
                            if (val) {
                                setFilters(prev => ({ ...prev, approvalStatus: [val] }));
                            } else {
                                setFilters(prev => { const { approvalStatus, ...rest } = prev; return rest; });
                            }
                        }}
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="Nháp">Nháp</option>
                        <option value="Chờ duyệt bản thảo">Chờ duyệt bản thảo</option>
                        <option value="Chờ Upload">Chờ Upload</option>
                        <option value="Chờ duyệt bản ký">Chờ duyệt bản ký</option>
                        <option value="Hiệu lực">Hiệu lực</option>
                    </select>
                    <button className="btn-search-primary" style={{ marginLeft: '12px' }}>
                        <Search size={18} />
                        Tìm kiếm
                    </button>
                </div>

                <div className="toolbar-right">
                        <button className="btn-primary" onClick={() => navigate('/contract/new')}>
                            <Plus size={20} /> Tạo mới Hợp đồng
                        </button>
                    <button className="btn-outline-brand">
                        <Download size={18} /> Xuất Excel
                    </button>
                    <div className="view-switcher-modern">
                        <button className="view-btn-modern"><Grid2X2 size={18} /></button>
                        <button className="view-btn-modern active"><List size={18} /></button>
                    </div>
                </div>
            </div>

            <div className="contract-table-wrapper">
                <table className="contract-table">
                    <thead>
                        <tr>
                            <th style={{ width: '40px', textAlign: 'center' }}>
                                <input
                                    type="checkbox"
                                    checked={processedContracts.length > 0 && selectedIds.size === processedContracts.length}
                                    onChange={toggleSelectAll}
                                />
                            </th>
                            {visibleColumns.includes('contractNo') && <TableHeader label="Số hợp đồng" columnKey="contractNo" hasFilter={true} />}
                            {visibleColumns.includes('name') && <TableHeader label="Tên hợp đồng" columnKey="name" hasFilter={true} />}
                            {visibleColumns.includes('customerName') && <TableHeader label={isSupplierView ? "Nhà cung cấp" : "Khách hàng"} columnKey="customerName" hasFilter={true} />}
                            {visibleColumns.includes('signedDate') && <TableHeader label="Ngày ký" columnKey="signedDate" hasFilter={true} />}
                            {visibleColumns.includes('contractValue') && <TableHeader label="Giá trị (VND)" columnKey="contractValue" hasFilter={true} />}
                            {visibleColumns.includes('contractStatus') && <TableHeader label="Tình trạng hợp đồng" columnKey="contractStatus" hasFilter={true} />}
                            {visibleColumns.includes('approvalStatus') && <TableHeader label="Trạng thái hợp đồng" columnKey="approvalStatus" hasFilter={true} />}
                            {visibleColumns.includes('revenueMonth') && <TableHeader label="Tháng ghi nhận" columnKey="revenueMonth" hasFilter={true} />}
                            <th style={{ width: '50px', textAlign: 'center', cursor: 'pointer', position: 'relative' }} onClick={(e) => {
                                e.stopPropagation();
                                if (!showColPicker) {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    setPickerPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
                                }
                                setShowColPicker(!showColPicker);
                            }}>
                                <SlidersHorizontal size={16} color="#94a3b8" />
                                {showColPicker && createPortal(
                                    <div className="column-picker-popup" onClick={e => e.stopPropagation()} style={{ position: 'fixed', top: `${pickerPos.top}px`, right: `${pickerPos.right}px`, zIndex: 9999, background: 'white', border: '1px solid #cbd5e1', borderRadius: '4px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', minWidth: '180px', padding: '12px', fontWeight: 'normal', textAlign: 'left' }}>
                                        <div style={{ marginBottom: '8px', fontWeight: 600, fontSize: '12px', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px', color: '#1e293b' }}>Hiển thị cột</div>
                                        {['contractNo', 'name', 'customerName', 'signedDate', 'contractValue', 'contractStatus', 'approvalStatus', 'revenueMonth'].map(key => {
                                            const labelMap = { contractNo: 'Số hợp đồng', name: 'Tên hợp đồng', customerName: 'Khách hàng', signedDate: 'Ngày ký', contractValue: 'Giá trị (VND)', contractStatus: 'Tình trạng hợp đồng', approvalStatus: 'Trạng thái hợp đồng', revenueMonth: 'Tháng ghi nhận' };
                                            return (
                                                <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 0', fontSize: '13px', cursor: 'pointer', color: '#334155' }}>
                                                    <input type="checkbox" checked={visibleColumns.includes(key)} onChange={() => {
                                                        setVisibleColumns(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
                                                    }} />
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
                        {processedContracts.length > 0 ? (
                            processedContracts.map(c => {
                                const stClass = getStatusClass(c.approvalStatus);
                                return (
                                    <tr key={c.id || c.contractNo} onClick={() => navigate(`/contract/edit/${c.id}`)} className={selectedIds.has(c.id || c.contractNo) ? 'row-selected' : ''}>
                                        <td style={{ textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.has(c.id || c.contractNo)}
                                                onChange={(e) => toggleSelectRow(e, c.id || c.contractNo)}
                                            />
                                        </td>
                                        {visibleColumns.includes('contractNo') && <td style={{ fontWeight: 600, color: '#3b82f6' }}>{c.contractNo}</td>}
                                        {visibleColumns.includes('name') && <td style={{ fontWeight: 500, color: '#1e293b' }}>{c.name}</td>}
                                        {visibleColumns.includes('customerName') && (
                                            <td>
                                                <div style={{ fontWeight: 700, color: '#1e293b' }}>{c.shortName || c.customerName}</div>
                                                {c.shortName && <div style={{ fontSize: '12px', color: '#64748b' }}>{c.customerName}</div>}
                                            </td>
                                        )}
                                        {visibleColumns.includes('signedDate') && <td>{c.signedDate}</td>}
                                        {visibleColumns.includes('contractValue') && <td style={{ fontWeight: 700 }}>{c.contractValue}</td>}
                                        {visibleColumns.includes('contractStatus') && (
                                            <td>
                                                <span style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '4px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#475569' }}>
                                                    {c.contractStatus}
                                                </span>
                                            </td>
                                        )}
                                        {visibleColumns.includes('approvalStatus') && (
                                            <td>
                                                <span className={stClass}>
                                                    {c.approvalStatus || 'Nháp'}
                                                </span>
                                            </td>
                                        )}
                                        {visibleColumns.includes('revenueMonth') && <td>{c.revenueMonth}</td>}
                                        <td></td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="9" style={{ textAlign: 'center', padding: '80px', color: '#94a3b8' }}>
                                    Không tìm thấy dữ liệu hợp đồng
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ContractManagement;
