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
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    FileText,
    Clock,
    CheckCircle2
} from 'lucide-react';
import { mockStore } from '../utils/mockStore';
import './CustomerList.css';
import './AcceptanceManagement.css';

const AcceptanceManagement = () => {
    const navigate = useNavigate();
    
    // Core states
    const [contracts, setContracts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'contractNo', direction: 'desc' });
    const [filters, setFilters] = useState({});
    const [activeFilterCol, setActiveFilterCol] = useState(null);
    const [visibleColumns, setVisibleColumns] = useState(['contractNo', 'name', 'customerName', 'createdDate', 'effectiveDate', 'contractValue', 'approvalStatus']);
    const [showColPicker, setShowColPicker] = useState(false);
    const [pickerPos, setPickerPos] = useState({ top: 0, right: 0 });
    const [selectedIds, setSelectedIds] = useState(new Set());
    
    // Figma UI enhancements
    const [viewMode, setViewMode] = useState('list');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    useEffect(() => {
        const rawData = mockStore.getAllContracts();
        const mappedData = (rawData || []).map(c => {
            // Convert HD prefix in contractNo to NT
            let contractNo = c.contractNo || '';
            if (contractNo.startsWith('HD-') || contractNo.startsWith('HD/')) {
                contractNo = contractNo.replace('HD-', 'NT-').replace('HD/', 'NT/');
            } else {
                contractNo = 'NT-2026-' + (c.id || '').split('-').pop();
            }
            
            // Convert 'Hợp đồng' or 'Dự án' in name to 'Nghiệm thu'
            let name = c.name || '';
            if (name.includes('Hợp đồng')) {
                name = name.replace(/Hợp đồng/g, 'Nghiệm thu');
            } else if (name.includes('Dự án')) {
                name = name.replace(/Dự án/g, 'Nghiệm thu dự án');
            } else {
                name = 'Nghiệm thu ' + name;
            }

            // Map approvalStatus to acceptance statuses
            let approvalStatus = c.approvalStatus || 'Mới';
            if (approvalStatus === 'Hiệu lực') {
                approvalStatus = 'Đã nghiệm thu';
            } else if (approvalStatus === 'Chờ duyệt bản thảo' || approvalStatus === 'Chờ duyệt bản ký' || approvalStatus === 'Chờ Upload') {
                approvalStatus = 'Chờ nghiệm thu';
            } else if (approvalStatus === 'Nháp' || approvalStatus === 'Mới') {
                approvalStatus = 'Mới';
            }

            return {
                ...c,
                contractNo,
                name,
                approvalStatus
            };
        });
        setContracts(mappedData);
    }, []);

    // --- SELECTION LOGIC ---
    const toggleSelectAll = () => {
        if (selectedIds.size === paginatedContracts.length && paginatedContracts.length > 0) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(paginatedContracts.map(c => c.id || c.contractNo)));
        }
    };

    const toggleSelectRow = (e, id) => {
        e.stopPropagation();
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) newSelected.delete(id);
        else newSelected.add(id);
        setSelectedIds(newSelected);
    };

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
        setCurrentPage(1);
    };

    const processedContracts = useMemo(() => {
        let result = contracts || [];

        if (searchTerm) {
            const low = searchTerm.toLowerCase();
            result = result.filter(c =>
                (c.contractNo?.toLowerCase().includes(low)) ||
                (c.name?.toLowerCase().includes(low)) ||
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
    }, [contracts, searchTerm, filters, sortConfig]);

    // Paginated items for the active view page
    const paginatedContracts = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return processedContracts.slice(startIndex, startIndex + itemsPerPage);
    }, [processedContracts, currentPage]);

    const totalPages = Math.ceil(processedContracts.length / itemsPerPage) || 1;

    const getStatusClass = (status) => {
        switch (status) {
            case 'Đã nghiệm thu': return 'status-badge-modern status-badge-green';
            case 'Chờ nghiệm thu': return 'status-badge-modern status-badge-yellow';
            case 'Mới': return 'status-badge-modern status-badge-gray';
            default: return 'status-badge-modern status-badge-gray';
        }
    };

    // Calculate dynamic stats metrics
    const stats = useMemo(() => {
        const total = contracts.length;
        const newCount = contracts.filter(c => c.approvalStatus === 'Mới').length;
        const pendingCount = contracts.filter(c => c.approvalStatus === 'Chờ nghiệm thu').length;
        const effectiveCount = contracts.filter(c => c.approvalStatus === 'Đã nghiệm thu').length;
        return { total, newCount, pendingCount, effectiveCount };
    }, [contracts]);

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
                            {(columnKey === 'approvalStatus' ? ['Mới', 'Chờ nghiệm thu', 'Đã nghiệm thu'] : [...new Set(contracts.map(c => c[columnKey]))].filter(Boolean)).map(val => (
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

    const pageTitle = 'Danh sách nghiệm thu';
    const pageSubtitle = `Hiện có ${processedContracts.length} nghiệm thu đang được quản lý trên hệ thống.`;

    const handleExport = () => {
        alert("Đang trích xuất Excel... Danh sách bao gồm " + processedContracts.length + " nghiệm thu.");
    };

    const handleCreateNew = () => {
        const newId = mockStore.getNextContractId();
        const newParent = {
            id: newId,
            contractNo: newId.replace('CTR-', 'NT-'),
            name: 'Nghiệm thu dịch vụ triển khai ERP mới',
            customerName: 'Công ty Cổ phần Công nghệ Tài chính CMC',
            shortName: 'CMC FinTech',
            amName: 'Nguyễn Văn A',
            contractValue: '5,000,000,000',
            approvalStatus: 'Mới',
            createdDate: new Date().toISOString().split('T')[0],
            createdBy: 'admin'
        };
        mockStore.saveContract(newId, newParent);
        navigate(`/acceptances/${newId}`);
    };

    const handleRowClick = (c) => {
        navigate(`/acceptances/${c.id}`);
    };

    return (
        <div className="contract-page-container" onClick={() => setActiveFilterCol(null)}>
            <div className="contract-page-header">
                <div className="contract-header-left">
                    <h1>{pageTitle}</h1>
                    <p className="contract-subtitle">{pageSubtitle}</p>
                </div>
            </div>

            {/* 3 Metrics Cards */}
            <div className="metric-cards-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                <div className="crm-metric-card" style={{ position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', right: '-8px', bottom: '-8px', opacity: 0.05 }}>
                        <FileText size={96} color="#e03" />
                    </div>
                    <p className="crm-card-title">Nghiệm thu mới</p>
                    <div className="crm-card-body">
                        <p className="crm-card-value">{stats.newCount}</p>
                        <span className="crm-card-indicator indicator-neutral">0%</span>
                    </div>
                </div>
                <div className="crm-metric-card" style={{ position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', right: '-8px', bottom: '-8px', opacity: 0.05 }}>
                        <Clock size={96} color="#f2bb24" />
                    </div>
                    <p className="crm-card-title">Tổng chờ nghiệm thu</p>
                    <div className="crm-card-body">
                        <p className="crm-card-value">{stats.pendingCount}</p>
                        <span className="crm-card-indicator indicator-up">+5%</span>
                    </div>
                </div>
                <div className="crm-metric-card" style={{ position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', right: '-8px', bottom: '-8px', opacity: 0.05 }}>
                        <CheckCircle2 size={96} color="#00a63e" />
                    </div>
                    <p className="crm-card-title">Nghiệm thu hoàn thành</p>
                    <div className="crm-card-body">
                        <p className="crm-card-value">{stats.effectiveCount}</p>
                        <span className="crm-card-indicator indicator-up">+12%</span>
                    </div>
                </div>
            </div>

            {/* Toolbar row with search & toggles */}
            <div className="toolbar-row">
                <div className="toolbar-left">
                    <div className="search-box-modern">
                        <Search size={18} color="#94a3b8" />
                        <input 
                            type="text" 
                            placeholder="Tìm số nghiệm thu, tên, đối tác..." 
                            value={searchTerm} 
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }} 
                        />
                    </div>
                    <button className="btn-search-primary" style={{ marginLeft: '12px' }}>
                        <Search size={18} />
                        Tìm kiếm
                    </button>
                </div>

                <div className="toolbar-right">
                    <button className="btn-primary" onClick={handleCreateNew} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#e03', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 16px', fontWeight: 600, cursor: 'pointer' }}>
                        <Plus size={20} /> Tạo mới nghiệm thu
                    </button>
                    <button className="btn-outline-brand" onClick={handleExport}>
                        <Download size={18} /> Xuất Excel
                    </button>
                    <div className="view-switcher-modern">
                        <button onClick={() => setViewMode('grid')} className={`view-btn-modern ${viewMode === 'grid' ? 'active' : ''}`}><Grid2X2 size={18} /></button>
                        <button onClick={() => setViewMode('list')} className={`view-btn-modern ${viewMode === 'list' ? 'active' : ''}`}><List size={18} /></button>
                    </div>
                </div>
            </div>

            {/* Content view (List or Grid) */}
            {processedContracts.length === 0 ? (
                <div style={{ background: 'white', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '80px', textAlign: 'center', color: '#64748b' }}>
                    <Search size={48} style={{ margin: '0 auto 16px', display: 'block', opacity: 0.5 }} />
                    <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b' }}>Không tìm thấy dữ liệu nghiệm thu</h3>
                    <p style={{ fontSize: '13px', marginTop: '4px' }}>Hãy thử điều chỉnh từ khóa tìm kiếm hoặc các cột lọc.</p>
                </div>
            ) : viewMode === 'list' ? (
                /* List View: Table */
                <div className="contract-table-wrapper">
                    <table className="contract-table">
                        <thead>
                            <tr>
                                <th style={{ width: '40px', textAlign: 'center' }}>
                                    <input
                                        type="checkbox"
                                        checked={paginatedContracts.length > 0 && selectedIds.size === paginatedContracts.length}
                                        onChange={toggleSelectAll}
                                    />
                                </th>
                                {visibleColumns.includes('contractNo') && <TableHeader label="Số nghiệm thu" columnKey="contractNo" hasFilter={true} />}
                                {visibleColumns.includes('name') && <TableHeader label="Tên nghiệm thu" columnKey="name" hasFilter={true} />}
                                {visibleColumns.includes('customerName') && <TableHeader label="Khách hàng" columnKey="customerName" hasFilter={true} />}
                                {visibleColumns.includes('leadOppId') && <TableHeader label="Lead/Opportunity ID" columnKey="leadOppId" hasFilter={true} />}
                                {visibleColumns.includes('createdDate') && <TableHeader label="Ngày tạo" columnKey="createdDate" hasFilter={true} />}
                                {visibleColumns.includes('createdBy') && <TableHeader label="Người tạo" columnKey="createdBy" hasFilter={true} />}
                                {visibleColumns.includes('effectiveDate') && <TableHeader label="Ngày nghiệm thu" columnKey="effectiveDate" hasFilter={true} />}
                                {visibleColumns.includes('contractValue') && <TableHeader label="Giá trị (VND)" columnKey="contractValue" hasFilter={true} />}
                                {visibleColumns.includes('approvalStatus') && <TableHeader label="Trạng thái" columnKey="approvalStatus" hasFilter={true} />}
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
                                            {['contractNo', 'name', 'customerName', 'leadOppId', 'createdDate', 'createdBy', 'effectiveDate', 'contractValue', 'approvalStatus'].map(key => {
                                                const labelMap = { contractNo: 'Số nghiệm thu', name: 'Tên nghiệm thu', customerName: 'Khách hàng', leadOppId: 'Lead/Opportunity ID', createdDate: 'Ngày tạo', createdBy: 'Người tạo', effectiveDate: 'Ngày nghiệm thu', contractValue: 'Giá trị nghiệm thu (VND)', approvalStatus: 'Trạng thái nghiệm thu' };
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
                            {paginatedContracts.map(c => {
                                const stClass = getStatusClass(c.approvalStatus);
                                return (
                                    <tr key={c.id || c.contractNo} onClick={() => handleRowClick(c)} className={selectedIds.has(c.id || c.contractNo) ? 'row-selected' : ''}>
                                        <td style={{ textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.has(c.id || c.contractNo)}
                                                onChange={(e) => toggleSelectRow(e, c.id || c.contractNo)}
                                            />
                                        </td>
                                        {visibleColumns.includes('contractNo') && <td style={{ fontWeight: 600, color: '#2563eb' }}>{c.contractNo}</td>}
                                        {visibleColumns.includes('name') && <td style={{ fontWeight: 500, color: '#1e293b', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</td>}
                                        {visibleColumns.includes('customerName') && (
                                            <td>
                                                <div style={{ fontWeight: 700, color: '#1e293b' }}>{c.shortName || c.customerName}</div>
                                                {c.shortName && <div style={{ fontSize: '11px', color: '#64748b' }}>{c.customerName}</div>}
                                            </td>
                                        )}
                                        {visibleColumns.includes('leadOppId') && <td>{c.leadOppId || '-'}</td>}
                                        {visibleColumns.includes('createdDate') && <td>{c.createdDate || '-'}</td>}
                                        {visibleColumns.includes('createdBy') && <td>{c.createdBy || '-'}</td>}
                                        {visibleColumns.includes('effectiveDate') && <td>{c.effectiveDate || '-'}</td>}
                                        {visibleColumns.includes('contractValue') && <td style={{ fontWeight: 700, color: '#0f172a' }}>{c.contractValue} VNĐ</td>}
                                        {visibleColumns.includes('approvalStatus') && (
                                            <td>
                                                <span className={stClass}>
                                                    {c.approvalStatus || 'Mới'}
                                                </span>
                                            </td>
                                        )}
                                        <td></td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                /* Grid View: Cards */
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                    {paginatedContracts.map(c => {
                        const stClass = getStatusClass(c.approvalStatus);
                        return (
                            <div 
                                key={c.id || c.contractNo} 
                                onClick={() => handleRowClick(c)}
                                style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'all 0.2s', position: 'relative' }}
                                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
                            >
                                <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
                                    <span className={stClass}>
                                        {c.approvalStatus || 'Mới'}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', tracking: '0.05em' }}>
                                        {c.serviceType || 'Nghiệm thu'}
                                    </div>
                                    <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: 0, paddingRight: '60px', minHeight: '36px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {c.name}
                                    </h4>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '8px 12px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#2563eb' }}>{c.contractNo}</span>
                                        <span style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>{c.contractValue} VNĐ</span>
                                    </div>
                                </div>
                                <div style={{ marginTop: '20px', paddingTop: '12px', borderTop: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: '#94a3b8' }}>Khách hàng:</span>
                                        <span style={{ fontWeight: 600, color: '#475569', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={c.customerName}>{c.shortName || c.customerName}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: '#94a3b8' }}>Ngày nghiệm thu:</span>
                                        <span style={{ fontWeight: 600, color: '#475569' }}>{c.effectiveDate || '-'}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Pagination */}
            <div style={{ background: 'white', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                <div style={{ fontSize: '13px', color: '#64748b' }}>
                    Hiển thị <span style={{ fontWeight: 600, color: '#0f172a' }}>{processedContracts.length ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> - <span style={{ fontWeight: 600, color: '#0f172a' }}>{Math.min(currentPage * itemsPerPage, processedContracts.length)}</span> trong số <span style={{ fontWeight: 600, color: '#0f172a' }}>{processedContracts.length}</span> nghiệm thu
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button 
                        onClick={() => setCurrentPage(1)} 
                        disabled={currentPage === 1}
                        style={{ border: '1px solid #cbd5e1', borderRadius: '8px', padding: '6px', background: 'white', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.4 : 1 }}
                    >
                        <ChevronsLeft size={16} />
                    </button>
                    <button 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                        disabled={currentPage === 1}
                        style={{ border: '1px solid #cbd5e1', borderRadius: '8px', padding: '6px', background: 'white', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.4 : 1 }}
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#334155', padding: '0 8px' }}>
                        Trang {currentPage} / {totalPages}
                    </div>
                    <button 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                        disabled={currentPage === totalPages}
                        style={{ border: '1px solid #cbd5e1', borderRadius: '8px', padding: '6px', background: 'white', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.4 : 1 }}
                    >
                        <ChevronRight size={16} />
                    </button>
                    <button 
                        onClick={() => setCurrentPage(totalPages)} 
                        disabled={currentPage === totalPages}
                        style={{ border: '1px solid #cbd5e1', borderRadius: '8px', padding: '6px', background: 'white', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.4 : 1 }}
                    >
                        <ChevronsRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AcceptanceManagement;
