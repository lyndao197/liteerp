import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Package, Layers, Edit, Trash2, ChevronRight, ChevronDown, Folder, X, History as HistoryIcon, Lock, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { mockStore } from '../utils/mockStore';

// Mock function for edge case testing
const checkProductUsage = (id) => {
  if (id === 'PRD-001') return { inUse: true, leads: 15, contracts: 24, orders: 8 };
  return { inUse: false };
};

// Global mock history state for demo
const globalChatterLog = [
  { id: 1, entityId: 'PRD-001', text: 'Đã tạo mới bản ghi.', changes: [], author: 'Phạm Quang M (Bạn)', time: '1 ngày trước' },
  { id: 2, entityId: 'PRD-001', text: '', changes: [{ field: 'Trạng thái', old: 'Ngừng hoạt động', new: 'Đang hoạt động' }, { field: 'Đơn giá', old: '0', new: '500,000' }], author: 'Phạm Quang M (Bạn)', time: '5 giờ trước' }
];

const addChatterLog = (entityId, text, changes = []) => {
  globalChatterLog.unshift({ id: Date.now(), entityId, text, changes, author: 'Phạm Quang M (Bạn)', time: 'Vừa xong' });
};

export default function ProductList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Data State
  const [groups, setGroups] = useState(() => mockStore.getAllProductGroups());
  const [categories, setCategories] = useState(() => mockStore.getAllProductCategories());
  const [products, setProducts] = useState(() => mockStore.getAllProducts());

  // Tree State
  const [expandedGroups, setExpandedGroups] = useState(new Set());
  const [expandedCategories, setExpandedCategories] = useState(new Set());

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({ type: '', action: 'add', data: null, parentId: null });

  // Dialog State
  const [dialogConfig, setDialogConfig] = useState({ open: false, type: 'alert', message: '', onConfirm: null });

  const toggleGroup = (id) => {
    const next = new Set(expandedGroups);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedGroups(next);
  };

  const toggleCategory = (id) => {
    const next = new Set(expandedCategories);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedCategories(next);
  };

  const treeData = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();
    
    return groups.map(g => {
      const gCats = categories.filter(c => c.groupId === g.id);
      
      const catsWithProducts = gCats.map(c => {
        const isCatInheritedInactive = g.status === 'Inactive';
        const cProds = products.filter(p => p.categoryId === c.id);
        const filteredProds = cProds.filter(p => !searchLower || p.name.toLowerCase().includes(searchLower));
        const catMatch = !searchLower || c.name.toLowerCase().includes(searchLower);
        
        return {
          ...c,
          products: filteredProds.map(p => ({ ...p, isInheritedInactive: isCatInheritedInactive || c.status === 'Inactive' })),
          isMatch: catMatch || filteredProds.length > 0,
          isInheritedInactive: isCatInheritedInactive
        };
      }).filter(c => c.isMatch);

      const groupMatch = !searchLower || g.name.toLowerCase().includes(searchLower);

      return {
        ...g,
        categories: catsWithProducts,
        isMatch: groupMatch || catsWithProducts.length > 0
      };
    }).filter(g => g.isMatch);

  }, [groups, categories, products, searchTerm]);

  React.useEffect(() => {
    if (searchTerm) {
      setExpandedGroups(new Set(groups.map(g => g.id)));
      setExpandedCategories(new Set(categories.map(c => c.id)));
    } else {
      setExpandedGroups(new Set());
      setExpandedCategories(new Set());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);



  const openModal = (type, action, data = null, parentId = null, e = null) => {
    if (e) e.stopPropagation();
    setModalConfig({ type, action, data, parentId });
    setModalOpen(true);
  };

  const refreshData = () => {
    setGroups(mockStore.getAllProductGroups());
    setCategories(mockStore.getAllProductCategories());
    setProducts(mockStore.getAllProducts());
  };

  const fmt = (v) => v ? v.toLocaleString('vi-VN') + ' ₫' : '0 ₫';

  return (
    <div className="contract-page-container" style={{ position: 'relative' }}>
      <div className="contract-page-header">
        <div className="contract-header-left">
          <h1>Cấu hình Sản phẩm & Dịch vụ</h1>
          <p className="contract-subtitle">Quản lý cây danh mục 3 cấp: Danh mục, Dòng sản phẩm và Sản phẩm/Gói sản phẩm.</p>
        </div>
        <div className="contract-header-right">
          <button className="btn-primary" onClick={() => openModal('group', 'add')}>
            <Plus size={18} /> Thêm Danh mục sản phẩm
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'flex', gap: '20px', marginTop: '24px' }}>
        <div style={{ flex: 1, background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px 20px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Số lượng sản phẩm/ Gói dịch vụ</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>{products.length}</div>
        </div>
        <div style={{ flex: 1, background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px 20px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Sản phẩm đang hoạt động</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>{products.filter(p => p.status === 'Active').length}</div>
        </div>
        <div style={{ flex: 1, background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px 20px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Sản phẩm ngừng hoạt động</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>{products.filter(p => p.status === 'Inactive').length}</div>
        </div>
      </div>

      <div className="toolbar-row" style={{ marginTop: '20px' }}>
        <div className="toolbar-left">
          <div className="search-box-modern">
            <Search size={16} color="#94a3b8" />
            <input type="text" placeholder="Tìm tên sản phẩm, nhóm..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="contract-table-wrapper" style={{ marginTop: '20px' }}>
        <table className="contract-table">
          <thead>
            <tr>
              <th style={{ width: '35%' }}>Tên Mục</th>
              <th style={{ width: '25%' }}>Mô tả</th>
              <th style={{ width: '10%' }}>Đơn giá</th>
              <th style={{ width: '8%' }}>Đơn vị</th>
              <th style={{ width: '7%' }}>Thuế</th>
              <th style={{ width: '15%' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {treeData.map(group => (
              <React.Fragment key={group.id}>
                {/* LEVEL 1: GROUP */}
                <tr style={{ background: '#f8fafc', cursor: 'pointer', borderBottom: '1px solid #e2e8f0' }} onClick={() => toggleGroup(group.id)}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: group.status === 'Inactive' ? '#94a3b8' : '#1e293b' }}>
                      {expandedGroups.has(group.id) ? <ChevronDown size={16} color="#64748b"/> : <ChevronRight size={16} color="#64748b"/>}
                      <Layers size={18} color={group.status === 'Inactive' ? '#cbd5e1' : '#3b82f6'} />
                      {group.name}
                    </div>
                  </td>
                  <td style={{ color: '#64748b', fontSize: '13px' }}>{group.description}</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button onClick={(e) => openModal('category', 'add', null, group.id, e)} title="Thêm Dòng sản phẩm" style={{ border: 'none', background: 'none', cursor: 'pointer' }}><Plus size={16} color="#10b981" /></button>
                      <button onClick={(e) => openModal('group', 'edit', group, null, e)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><Edit size={16} color="#3b82f6" /></button>
                    </div>
                  </td>
                </tr>

                {/* LEVEL 2 & 3 */}
                {expandedGroups.has(group.id) && group.categories.map(cat => (
                  <React.Fragment key={cat.id}>
                    {/* LEVEL 2: CATEGORY */}
                    <tr style={{ background: '#ffffff', cursor: 'pointer', borderBottom: '1px solid #f1f5f9' }} onClick={() => toggleCategory(cat.id)}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: (cat.status === 'Inactive' || cat.isInheritedInactive) ? '#94a3b8' : '#334155', paddingLeft: '28px' }}>
                          {expandedCategories.has(cat.id) ? <ChevronDown size={16} color="#94a3b8"/> : <ChevronRight size={16} color="#94a3b8"/>}
                          <Folder size={16} color={(cat.status === 'Inactive' || cat.isInheritedInactive) ? '#cbd5e1' : '#f59e0b'} />
                          {cat.name}
                          {cat.isInheritedInactive && cat.status !== 'Inactive' && <Lock size={12} color="#cbd5e1" title="Bị khóa do danh mục cha ngừng hoạt động" />}
                        </div>
                      </td>
                      <td style={{ color: '#64748b', fontSize: '13px' }}>{cat.description}</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button onClick={(e) => openModal('product', 'add', null, cat.id, e)} title="Thêm Sản phẩm" style={{ border: 'none', background: 'none', cursor: 'pointer' }}><Plus size={16} color="#10b981" /></button>
                          <button onClick={(e) => openModal('category', 'edit', cat, group.id, e)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><Edit size={16} color="#3b82f6" /></button>
                        </div>
                      </td>
                    </tr>

                    {/* LEVEL 3: PRODUCT */}
                    {expandedCategories.has(cat.id) && cat.products.map(prod => (
                      <tr key={prod.id} style={{ background: '#fff', borderBottom: '1px solid #f8fafc' }}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '64px', color: (prod.status === 'Inactive' || prod.isInheritedInactive) ? '#94a3b8' : '#475569' }}>
                            <Package size={14} color={(prod.status === 'Inactive' || prod.isInheritedInactive) ? '#cbd5e1' : '#8b5cf6'} />
                            {prod.name}
                            {prod.isInheritedInactive && prod.status !== 'Inactive' && <Lock size={12} color="#cbd5e1" title="Bị khóa do danh mục cha ngừng hoạt động" />}
                          </div>
                        </td>
                        <td style={{ color: '#64748b', fontSize: '13px' }}>{prod.description}</td>
                        <td style={{ fontWeight: 600, fontSize: '14px', color: '#0f172a' }}>{fmt(prod.price)}</td>
                        <td style={{ fontSize: '13px', color: '#475569' }}>{prod.unit}</td>
                        <td style={{ fontSize: '13px', color: '#475569' }}>{prod.tax}%</td>
                        <td>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={(e) => openModal('product', 'edit', prod, cat.id, e)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><Edit size={16} color="#3b82f6" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </React.Fragment>
            ))}
            {treeData.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Không tìm thấy dữ liệu phù hợp.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <ProductModalWrapper 
          config={modalConfig} 
          onClose={() => setModalOpen(false)} 
          onSave={refreshData}
          groups={groups}
          categories={categories}
        />
      )}

      {dialogConfig.open && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', width: '400px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)', textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 16px 0', color: dialogConfig.type === 'alert' ? '#ef4444' : '#0f172a' }}>
              {dialogConfig.type === 'alert' ? 'Cảnh báo' : 'Xác nhận'}
            </h3>
            <p style={{ color: '#475569', marginBottom: '24px', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>{dialogConfig.message}</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              {dialogConfig.type === 'confirm' && (
                <button onClick={() => setDialogConfig({ open: false, type: 'alert', message: '', onConfirm: null })} style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', color: '#475569', cursor: 'pointer', fontWeight: 600 }}>Hủy</button>
              )}
              <button 
                onClick={() => {
                  setDialogConfig({ open: false, type: 'alert', message: '', onConfirm: null });
                  if (dialogConfig.onConfirm) dialogConfig.onConfirm();
                }} 
                style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: '#e32b4c', color: '#fff', cursor: 'pointer', fontWeight: 600 }}
              >
                Đồng ý
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', color: 'white', padding: 20, zIndex: 9999 }}>
          <h2>Something went wrong in Drawer.</h2>
          <pre>{this.state.error.toString()}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

const CustomCombobox = ({ value, onChange, options, placeholder, onEnter, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value != null ? String(value) : '');
  const wrapperRef = React.useRef(null);

  React.useEffect(() => {
    setInputValue(value != null ? String(value) : '');
  }, [value]);

  React.useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const safeInput = String(inputValue).toLowerCase();
  const filteredOptions = options.filter(opt => String(opt).toLowerCase().includes(safeInput));
  const showCreate = safeInput && !options.some(opt => String(opt).toLowerCase() === safeInput);

  const handleSelect = (val) => {
    if (disabled) return;
    setInputValue(val);
    onChange(val);
    setIsOpen(false);
  };

  const handleKeyDown = (e) => {
    if (disabled) return;
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSelect(inputValue);
      if (onEnter) onEnter();
    }
  };

  return (
    <div ref={wrapperRef} style={{ position: 'relative', width: '100%', opacity: disabled ? 0.6 : 1 }}>
      <input 
        type="text" 
        value={inputValue} 
        onChange={e => {
          if (disabled) return;
          setInputValue(e.target.value);
          onChange(e.target.value);
          setIsOpen(true);
        }} 
        onFocus={() => !disabled && setIsOpen(true)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', outline: 'none', boxSizing: 'border-box', background: disabled ? '#f1f5f9' : '#fff', cursor: disabled ? 'not-allowed' : 'text' }} 
        placeholder={placeholder} 
      />
      <div onClick={() => !disabled && setIsOpen(!isOpen)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', cursor: disabled ? 'not-allowed' : 'pointer' }}>
        {disabled ? <Lock size={14} /> : <ChevronDown size={16} />}
      </div>

      {isOpen && !disabled && (
        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '4px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', zIndex: 1001, maxHeight: '200px', overflowY: 'auto' }}>
          {filteredOptions.map((opt, idx) => (
            <div 
              key={idx} 
              onClick={() => handleSelect(opt)}
              style={{ padding: '10px 12px', cursor: 'pointer', borderBottom: idx < filteredOptions.length - 1 ? '1px solid #f1f5f9' : 'none', color: '#334155', transition: 'background 0.2s', fontSize: '14px' }}
              onMouseEnter={e => e.target.style.background = '#f8fafc'}
              onMouseLeave={e => e.target.style.background = 'transparent'}
            >
              {opt}
            </div>
          ))}
          {showCreate && (
            <div 
              onClick={() => handleSelect(inputValue)}
              style={{ padding: '10px 12px', cursor: 'pointer', color: '#2563eb', fontWeight: 500, fontStyle: 'italic', fontSize: '14px' }}
              onMouseEnter={e => e.target.style.background = '#f0fdf4'}
              onMouseLeave={e => e.target.style.background = 'transparent'}
            >
              Tạo mới "{inputValue}"
            </div>
          )}
          {filteredOptions.length === 0 && !showCreate && (
            <div style={{ padding: '10px 12px', color: '#94a3b8', fontStyle: 'italic', fontSize: '14px' }}>Không có dữ liệu</div>
          )}
        </div>
      )}
    </div>
  );
};

function ProductModalWrapper(props) {
  return (
    <ErrorBoundary>
      <ProductModal {...props} />
    </ErrorBoundary>
  );
}

function ProductModal({ config, onClose, onSave, groups, categories }) {
  const { type, action, data, parentId } = config;
  
  const isGroup = type === 'group';
  const isCategory = type === 'category';
  const isProduct = type === 'product';

  const [activeTab, setActiveTab] = useState('info'); // 'info' or 'history'
  const usage = data && isProduct ? checkProductUsage(data.id) : { inUse: false };

  const [formData, setFormData] = useState({
    name: data?.name || '',
    description: data?.description || '',
    groupId: isCategory ? (data?.groupId || parentId || '') : '',
    categoryId: isProduct ? (data?.categoryId || parentId || '') : '',
    price: data?.price || 0,
    unit: data?.unit || '',
    tax: data?.tax !== undefined ? String(data?.tax) : '',
    status: data?.status || 'Active',
    skipKpiCalculation: data?.skipKpiCalculation || false
  });

  const parentGroup = isCategory ? groups.find(g => g.id === (data?.groupId || parentId)) : (isProduct ? groups.find(g => g.id === categories.find(c => c.id === (data?.categoryId || parentId))?.groupId) : null);
  const parentCat = isProduct ? categories.find(c => c.id === (data?.categoryId || parentId)) : null;
  const isParentInactive = (parentGroup?.status === 'Inactive') || (parentCat?.status === 'Inactive');

  const [dialogConfig, setDialogConfig] = useState({ open: false, type: 'alert', message: '', onConfirm: null });

  const logs = globalChatterLog.filter(log => log.entityId === data?.id);

  const getTitle = () => {
    const act = action === 'add' ? 'Thêm mới' : 'Cập nhật';
    if (isGroup) return `${act} Danh mục sản phẩm`;
    if (isCategory) return `${act} Dòng sản phẩm`;
    return `${act} Sản Phẩm / Gói dịch vụ`;
  };

  const handleSave = () => {
    if (!formData.name.trim()) return setDialogConfig({ open: true, type: 'alert', message: 'Vui lòng nhập tên.' });
    
    let saveData = { ...formData };
    let savedId = null;

    let changes = [];
    if (action === 'edit' && data) {
      if (data.name !== formData.name) changes.push({ field: 'Tên', old: data.name || 'None', new: formData.name || 'None' });
      if (data.description !== formData.description) changes.push({ field: 'Mô tả', old: data.description || 'None', new: formData.description || 'None' });
      if (data.status !== formData.status) changes.push({ field: 'Trạng thái', old: data.status === 'Active' ? 'Đang hoạt động' : 'Ngừng hoạt động', new: formData.status === 'Active' ? 'Đang hoạt động' : 'Ngừng hoạt động' });
      
      if (isCategory) {
        if (data.groupId !== formData.groupId) changes.push({ field: 'Danh mục', old: data.groupId || 'None', new: formData.groupId || 'None' });
      }
      
      if (isProduct) {
        if (data.categoryId !== formData.categoryId) changes.push({ field: 'Dòng sản phẩm', old: data.categoryId || 'None', new: formData.categoryId || 'None' });
        if (data.price != formData.price) changes.push({ field: 'Đơn giá', old: data.price ? Number(data.price).toLocaleString() : '0', new: formData.price ? Number(formData.price).toLocaleString() : '0' });
        if (data.unit !== formData.unit) changes.push({ field: 'Đơn vị tính', old: data.unit || 'None', new: formData.unit || 'None' });
        if (data.tax != formData.tax) changes.push({ field: 'Mức thuế', old: data.tax + '%', new: formData.tax + '%' });
        const skipLabel = (v) => v ? 'Có' : 'Không';
        if (!!data.skipKpiCalculation !== !!formData.skipKpiCalculation) changes.push({ field: 'Bỏ qua tính KL&KPI/SLA', old: skipLabel(data.skipKpiCalculation), new: skipLabel(formData.skipKpiCalculation) });
      }
    }

    if (isGroup) {
      savedId = data?.id || mockStore.getNextProductGroupId();
      mockStore.saveProductGroup(savedId, { id: savedId, name: saveData.name, description: saveData.description, status: saveData.status });
    } else if (isCategory) {
      if (!saveData.groupId) return setDialogConfig({ open: true, type: 'alert', message: 'Vui lòng chọn Danh mục (Cấp 1)' });
      savedId = data?.id || mockStore.getNextProductCategoryId();
      mockStore.saveProductCategory(savedId, { id: savedId, groupId: saveData.groupId, name: saveData.name, description: saveData.description, status: saveData.status });
    } else if (isProduct) {
      if (!saveData.categoryId) return setDialogConfig({ open: true, type: 'alert', message: 'Vui lòng chọn Dòng SP (Cấp 2)' });
      savedId = data?.id || mockStore.getNextProductId();
      mockStore.saveProduct(savedId, {
        id: savedId, 
        categoryId: saveData.categoryId, 
        name: saveData.name, 
        description: saveData.description, 
        price: Number(saveData.price),
        unit: saveData.unit,
        tax: Number(saveData.tax || 0),
        status: saveData.status,
        skipKpiCalculation: !!saveData.skipKpiCalculation
      });
    }

    if (action === 'add') {
      addChatterLog(savedId, 'Đã tạo mới bản ghi.', []);
    } else if (changes.length > 0) {
      addChatterLog(savedId, '', changes);
    }
    
    onSave();
    onClose();
  };



  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', zIndex: 1000, backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
      {/* Centered Modal */}
      <div style={{ backgroundColor: '#f8fafc', width: '600px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', borderRadius: '12px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', animation: 'fadeIn 0.2s ease-out', overflow: 'hidden' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', background: '#fff', borderBottom: '1px solid #e2e8f0' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: '#0f172a' }}>{getTitle()}</h2>
            {data?.id && <span style={{ fontSize: '13px', color: '#64748b' }}>ID: {data.id}</span>}
          </div>
          <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', cursor: 'pointer', color: '#64748b', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }} onMouseEnter={e => e.target.style.background = '#e2e8f0'} onMouseLeave={e => e.target.style.background = '#f1f5f9'}>
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        {action === 'edit' && (
          <div style={{ display: 'flex', background: '#fff', padding: '0 24px', borderBottom: '1px solid #e2e8f0' }}>
            <div onClick={() => setActiveTab('info')} style={{ padding: '12px 16px', cursor: 'pointer', fontWeight: activeTab === 'info' ? 600 : 500, color: activeTab === 'info' ? '#e32b4c' : '#64748b', borderBottom: activeTab === 'info' ? '2px solid #e32b4c' : '2px solid transparent' }}>Thông tin chung</div>
            <div onClick={() => setActiveTab('history')} style={{ padding: '12px 16px', cursor: 'pointer', fontWeight: activeTab === 'history' ? 600 : 500, color: activeTab === 'history' ? '#e32b4c' : '#64748b', borderBottom: activeTab === 'history' ? '2px solid #e32b4c' : '2px solid transparent', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <HistoryIcon size={16}/> Lịch sử hoạt động
            </div>
          </div>
        )}

        {/* Content Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {activeTab === 'info' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', background: '#fff', padding: '24px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              
              {/* Top Controls: Status Toggle & Badges */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {isParentInactive && (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#fef3c7', color: '#d97706', padding: '8px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: 600 }}>
                      <Lock size={14}/> Danh mục cha đang Ngừng hoạt động. Bản ghi này hiện bị khóa.
                    </div>
                  )}
                  {isProduct && usage.inUse && (
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#fef3c7', color: '#d97706', padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 600 }}>
                        <AlertCircle size={14}/> Đang được dùng trong: {usage.leads} Lead, {usage.contracts} Hợp đồng, {usage.orders} Đơn hàng
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: isParentInactive ? 'not-allowed' : 'pointer', opacity: isParentInactive ? 0.5 : 1 }} onClick={() => !isParentInactive && setFormData({...formData, status: formData.status === 'Active' ? 'Inactive' : 'Active'})} title={isParentInactive ? "Trạng thái bị khóa do cấp cha đang Ngừng hoạt động." : "Tắt trạng thái này để ngừng bán sản phẩm. Dữ liệu trên các đơn hàng cũ không bị ảnh hưởng."}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: formData.status === 'Active' ? '#10b981' : '#64748b' }}>
                    {formData.status === 'Active' ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                  </span>
                  <div style={{ width: '44px', height: '24px', background: formData.status === 'Active' ? '#10b981' : '#cbd5e1', borderRadius: '12px', position: 'relative', transition: 'background 0.3s' }}>
                    <div style={{ width: '20px', height: '20px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '2px', left: formData.status === 'Active' ? '22px' : '2px', transition: 'left 0.3s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}></div>
                  </div>
                </div>
              </div>

              {isCategory && (
                <div title={isParentInactive ? "Không thể thay đổi danh mục cha khi đang bị khóa do kế thừa trạng thái." : ""}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Thuộc Danh mục * {isParentInactive && <Lock size={12} color="#94a3b8"/>}</label>
                  <select value={formData.groupId} onChange={e => setFormData({...formData, groupId: e.target.value})} disabled={isParentInactive} style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', outline: 'none', opacity: isParentInactive ? 0.5 : 1, cursor: isParentInactive ? 'not-allowed' : 'pointer', background: isParentInactive ? '#f1f5f9' : '#fff' }}>
                    <option value="">-- Chọn Danh mục --</option>
                    {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                  </select>
                </div>
              )}

              {isProduct && (
                <div title={isParentInactive ? "Không thể thay đổi dòng sản phẩm khi đang bị khóa do kế thừa trạng thái." : ""}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Thuộc Dòng sản phẩm * {isParentInactive && <Lock size={12} color="#94a3b8"/>}</label>
                  <select value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})} disabled={isParentInactive} style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', outline: 'none', opacity: isParentInactive ? 0.5 : 1, cursor: isParentInactive ? 'not-allowed' : 'pointer', background: isParentInactive ? '#f1f5f9' : '#fff' }}>
                    <option value="">-- Chọn Dòng sản phẩm --</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Tên *</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', outline: 'none', boxSizing: 'border-box' }} placeholder="Nhập tên..." />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Mô tả</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', outline: 'none', boxSizing: 'border-box', minHeight: '80px', resize: 'vertical' }} placeholder="Nhập mô tả..." />
              </div>

              {isProduct && (
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <div style={{ flex: '1 1 calc(50% - 8px)' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Đơn giá (VNĐ)</label>
                    <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ flex: '1 1 calc(50% - 8px)' }} title={usage.inUse ? "Không thể sửa Đơn vị tính vì sản phẩm đã phát sinh giao dịch." : ""}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                      Đơn vị tính {usage.inUse && <Lock size={12} color="#94a3b8"/>}
                    </label>
                    <CustomCombobox 
                      value={formData.unit} 
                      onChange={val => setFormData({...formData, unit: val})} 
                      options={['seat', 'license']}
                      placeholder="-- Chọn Đơn vị tính --"
                      disabled={usage.inUse}
                    />
                  </div>
                  <div style={{ flex: '1 1 100%' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Mức Thuế (%)</label>
                    <CustomCombobox
                      value={formData.tax}
                      onChange={val => setFormData({...formData, tax: val})}
                      options={['0', '8', '10', '15']}
                      placeholder="-- Chọn Mức Thuế --"
                    />
                  </div>
                  <div style={{ flex: '1 1 100%' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#475569', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={formData.skipKpiCalculation} 
                        onChange={e => setFormData({...formData, skipKpiCalculation: e.target.checked})} 
                        style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                      />
                      Bỏ qua tính KL&KPI/SLA
                    </label>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {logs.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#94a3b8', padding: '40px 0' }}>Chưa có hoạt động nào.</div>
              ) : (
                <div style={{ position: 'relative', paddingLeft: '8px' }}>
                  {/* Timeline Line */}
                  <div style={{ position: 'absolute', left: '15px', top: '24px', bottom: '24px', width: '2px', background: '#e2e8f0' }}></div>
                  
                  {logs.map(log => (
                    <div key={log.id} style={{ position: 'relative', padding: '16px 0 16px 36px' }}>
                      {/* Timeline Dot */}
                      <div style={{ position: 'absolute', left: '3px', top: '24px', width: '12px', height: '12px', borderRadius: '50%', background: '#f43f5e', border: '3px solid #fff', boxShadow: '0 0 0 1px #e2e8f0', zIndex: 2 }}></div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <img 
                          src="https://api.dicebear.com/7.x/personas/svg?seed=Felix&backgroundColor=b6e3f4" 
                          alt="User" 
                          style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <span style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>{log.author}</span>
                        <span style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={12} /> {log.time}
                        </span>
                      </div>
                      
                      <div style={{ paddingLeft: '36px' }}>
                        {log.text && <div style={{ fontSize: '14px', color: '#334155', marginBottom: '8px' }}>{log.text}</div>}
                        
                        {log.changes && log.changes.length > 0 && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {log.changes.map((change, idx) => (
                              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13.5px' }}>
                                <span style={{ color: '#94a3b8', fontSize: '10px' }}>▶</span>
                                <span style={{ color: '#94a3b8' }}>{change.field}:</span>
                                <span style={{ color: '#334155' }}>{change.old}</span>
                                <span style={{ color: '#64748b' }}>→</span>
                                <span style={{ color: '#0284c7', fontWeight: 500 }}>{change.new}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', background: '#fff', borderTop: '1px solid #e2e8f0' }}>
          <div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={onClose} style={{ padding: '10px 20px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', color: '#475569', fontWeight: 600, cursor: 'pointer' }}>
              Hủy
            </button>
            <button onClick={handleSave} style={{ padding: '10px 20px', borderRadius: '6px', border: 'none', background: '#e32b4c', color: '#fff', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={18} /> {action === 'add' ? 'Tạo mới' : 'Lưu cập nhật'}
            </button>
          </div>
        </div>

      </div>

      {dialogConfig.open && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', width: '400px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)', textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 16px 0', color: dialogConfig.type === 'alert' ? '#ef4444' : '#0f172a' }}>
              {dialogConfig.type === 'alert' ? 'Cảnh báo' : 'Xác nhận'}
            </h3>
            <p style={{ color: '#475569', marginBottom: '24px', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>{dialogConfig.message}</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              {dialogConfig.type === 'confirm' && (
                <button onClick={() => setDialogConfig({ open: false, type: 'alert', message: '', onConfirm: null })} style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', color: '#475569', cursor: 'pointer', fontWeight: 600 }}>Hủy</button>
              )}
              <button 
                onClick={() => {
                  setDialogConfig({ open: false, type: 'alert', message: '', onConfirm: null });
                  if (dialogConfig.onConfirm) dialogConfig.onConfirm();
                }} 
                style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: '#e32b4c', color: '#fff', cursor: 'pointer', fontWeight: 600 }}
              >
                Đồng ý
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
