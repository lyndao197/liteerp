/* eslint-disable react-hooks/purity */
/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Download, Eye, FileText, ChevronRight, ChevronDown, Plus, Trash2, Save, Send, CheckCircle, XCircle, ChevronLeft, Lock } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import './BusinessPlanForm.css';
import { mockStore } from '../utils/mockStore';

const DEFAULT_SERVICES = [
  { id: 's1', name: 'Dịch vụ FO - CSKH' },
  { id: 's2', name: 'Dịch vụ thiết lập và vận hành dịch vụ' }
];

const createDefaultServicesProp = (val1, val2) => ({
  s1: { unit: 'seat', qty: 1, price: val1 },
  s2: { unit: 'seat', qty: 1, price: val2 }
});

// Default parent indicators (chỉ tiêu cha mặc định)
const DEFAULT_PARENT_NAMES = [
  { id: 'dp1', name: '1. Chi phí đích danh cho ĐTV' },
  { id: 'dp2', name: '2. Chi phí Bán hàng' },
  { id: 'dp3', name: '3. Chi phí quản lý Cty cần phân bổ' },
];

// Default child indicators per parent (chỉ tiêu con mặc định)
const DEFAULT_CHILD_NAMES = {
  'dp1': [
    { id: 'dc1_1', name: '1.1 Chi phí nhân công (đích danh cho ĐTV)' },
    { id: 'dc1_2', name: '1.2 Chi phí Lương nhân sự trực tiếp hỗ trợ' },
    { id: 'dc1_3', name: '1.3 Chi phí hệ thống, CNTT' },
    { id: 'dc1_4', name: '1.4 Chi phí VP- Hành chính đích danh' },
    { id: 'dc1_5', name: '1.5 Chi phí khấu hao' },
  ],
  'dp2': [
    { id: 'dc2_1', name: '2.1 Chi phí quảng cáo truyền thông, tài trợ' },
    { id: 'dc2_2', name: '2.2 Chi phí Chăm sóc Khách hàng' },
  ],
  'dp3': [
    { id: 'dc3_1', name: '3.1 Chi phí Lương khối quản lý' },
    { id: 'dc3_2', name: '3.2 Chi phí hệ thống, CNTT' },
    { id: 'dc3_3', name: '3.3 Chi phí VP- Hành chính' },
    { id: 'dc3_4', name: '3.4 Chung và thường xuyên (CCDC)' },
    { id: 'dc3_5', name: '3.5 Chi phí khấu hao' },
  ],
};

const DEFAULT_BUSINESS_PLAN_DATA = [
  {
    id: 'p1', text: '1. Chi phí đích danh cho ĐTV', expanded: true, isDefault: true, parentNameId: 'dp1',
    children: [
      { id: 'c1_1', text: '1.1 Chi phí nhân công (đích danh cho ĐTV)', isDefault: true, services: createDefaultServicesProp(11587000, 23174000) },
      { id: 'c1_2', text: '1.2 Chi phí Lương nhân sự trực tiếp hỗ trợ', isDefault: true, services: createDefaultServicesProp(770155, 1540310) },
      { id: 'c1_3', text: '1.3 Chi phí hệ thống, CNTT', isDefault: true, services: createDefaultServicesProp(310000, 1240000) },
      { id: 'c1_4', text: '1.4 Chi phí VP- Hành chính đích danh', isDefault: true, services: createDefaultServicesProp(0, 0) },
      { id: 'c1_5', text: '1.5 Chi phí khấu hao', isDefault: true, services: createDefaultServicesProp(0, 0) },
    ]
  },
  {
    id: 'p2', text: '2. Chi phí Bán hàng', expanded: true, isDefault: true, parentNameId: 'dp2',
    children: [
      { id: 'c2_1', text: '2.1 Chi phí quảng cáo truyền thông, tài trợ', isDefault: true, services: createDefaultServicesProp(97690, 216496) },
      { id: 'c2_2', text: '2.2 Chi phí Chăm sóc Khách hàng', isDefault: true, services: createDefaultServicesProp(54180, 120071) },
    ]
  },
  {
    id: 'p3', text: '3. Chi phí quản lý Cty cần phân bổ', expanded: true, isDefault: true, parentNameId: 'dp3',
    children: [
      { id: 'c3_1', text: '3.1 Chi phí Lương khối quản lý', isDefault: true, services: createDefaultServicesProp(665148, 1474059) },
      { id: 'c3_2', text: '3.2 Chi phí hệ thống, CNTT', isDefault: true, services: createDefaultServicesProp(13682, 30321) },
      { id: 'c3_3', text: '3.3 Chi phí VP- Hành chính', isDefault: true, services: createDefaultServicesProp(392834, 870574) },
      { id: 'c3_4', text: '3.4 Chung và thường xuyên (CCDC)', isDefault: true, services: createDefaultServicesProp(0, 0) },
      { id: 'c3_5', text: '3.5 Chi phí khấu hao', isDefault: true, services: createDefaultServicesProp(11865, 26294) },
    ]
  }
];

// ─────────────────────────────────────────────
// Modal: Tìm kiếm & tạo mới chỉ tiêu cha
// ─────────────────────────────────────────────
const ParentSearchModal = ({ open, parentNamesDb, childNamesDb, onAddParent, onAddChild, onSelect, onClose }) => {
  const [search, setSearch] = useState('');
  const [creating, setCreating] = useState(false);
  const [newParentName, setNewParentName] = useState('');
  const [newParentChildren, setNewParentChildren] = useState([]);
  const [newChildInput, setNewChildInput] = useState('');

  if (!open) return null;

  const filtered = parentNamesDb.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  const handleCreate = () => {
    if (!newParentName.trim()) return;
    const newParent = { id: `dp_${Date.now()}`, name: newParentName.trim() };
    onAddParent(newParent, newParentChildren);
    onSelect(newParent.name, newParent.id);
    setCreating(false); setNewParentName(''); setNewParentChildren([]);
    onClose();
  };

  const addNewChild = () => {
    if (!newChildInput.trim()) return;
    setNewParentChildren(prev => [...prev, { id: `dc_tmp_${Date.now()}`, name: newChildInput.trim() }]);
    setNewChildInput('');
  };

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', zIndex:9000, display:'flex', alignItems:'center', justifyContent:'center' }} onClick={onClose}>
      <div style={{ background:'white', borderRadius:'10px', width:'520px', maxHeight:'80vh', display:'flex', flexDirection:'column', boxShadow:'0 20px 60px rgba(0,0,0,0.3)' }} onClick={e=>e.stopPropagation()}>
        <div style={{ padding:'16px 20px', borderBottom:'1px solid #e2e8f0', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <h3 style={{ margin:0, fontSize:'16px', fontWeight:700, color:'#0f172a' }}>Chọn chỉ tiêu cha</h3>
          <button onClick={onClose} style={{ border:'none', background:'none', cursor:'pointer', fontSize:'18px', color:'#64748b' }}>✕</button>
        </div>
        {!creating ? (
          <>
            <div style={{ padding:'12px 16px', borderBottom:'1px solid #e2e8f0' }}>
              <input autoFocus type="text" placeholder="Tìm chỉ tiêu cha..." value={search} onChange={e=>setSearch(e.target.value)}
                style={{ width:'100%', padding:'8px 12px', border:'1px solid #cbd5e1', borderRadius:'6px', fontSize:'14px', outline:'none', boxSizing:'border-box' }}/>
            </div>
            <div style={{ overflowY:'auto', flex:1 }}>
              {filtered.map(p => (
                <div key={p.id} onClick={() => { onSelect(p.name, p.id); onClose(); }}
                  style={{ padding:'12px 16px', cursor:'pointer', borderBottom:'1px solid #f1f5f9', fontSize:'14px', color:'#1e293b' }}
                  onMouseEnter={e=>e.currentTarget.style.background='#f8fafc'} onMouseLeave={e=>e.currentTarget.style.background='white'}>
                  {p.name}
                  {childNamesDb[p.id] && <div style={{fontSize:'12px',color:'#94a3b8',marginTop:'2px'}}>{childNamesDb[p.id].length} chỉ tiêu con</div>}
                </div>
              ))}
              {filtered.length === 0 && <div style={{ padding:'20px', textAlign:'center', color:'#94a3b8', fontSize:'14px' }}>Không tìm thấy kết quả</div>}
            </div>
            <div style={{ padding:'12px 16px', borderTop:'1px solid #e2e8f0' }}>
              <button onClick={() => { setCreating(true); setNewParentName(search); }}
                style={{ width:'100%', padding:'8px', border:'2px dashed #cbd5e1', borderRadius:'6px', background:'white', cursor:'pointer', color:'#2563eb', fontWeight:600, fontSize:'14px' }}>+ Tạo mới chỉ tiêu cha</button>
            </div>
          </>
        ) : (
          <div style={{ padding:'16px', overflowY:'auto', flex:1, display:'flex', flexDirection:'column', gap:'12px' }}>
            <div>
              <label style={{ fontSize:'13px', fontWeight:600, color:'#475569', display:'block', marginBottom:'4px' }}>Tên chỉ tiêu cha *</label>
              <input autoFocus type="text" value={newParentName} onChange={e=>setNewParentName(e.target.value)}
                placeholder="Nhập tên chỉ tiêu cha..."
                style={{ width:'100%', padding:'8px 12px', border:'1px solid #cbd5e1', borderRadius:'6px', fontSize:'14px', outline:'none', boxSizing:'border-box' }}/>
            </div>
            <div>
              <label style={{ fontSize:'13px', fontWeight:600, color:'#475569', display:'block', marginBottom:'4px' }}>Chỉ tiêu con</label>
              <div style={{ border:'1px solid #e2e8f0', borderRadius:'6px', overflow:'hidden' }}>
                {newParentChildren.map((c,i) => (
                  <div key={c.id} style={{ padding:'8px 12px', borderBottom:'1px solid #f1f5f9', display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:'13px' }}>
                    <span>{c.name}</span>
                    <button onClick={() => setNewParentChildren(prev=>prev.filter((_,idx)=>idx!==i))}
                      style={{ border:'none', background:'none', color:'#ef4444', cursor:'pointer', fontSize:'16px' }}>×</button>
                  </div>
                ))}
                <div style={{ display:'flex', gap:'8px', padding:'8px' }}>
                  <input type="text" value={newChildInput} onChange={e=>setNewChildInput(e.target.value)}
                    placeholder="Tên chỉ tiêu con..." onKeyDown={e=>e.key==='Enter'&&addNewChild()}
                    style={{ flex:1, padding:'6px 10px', border:'1px solid #cbd5e1', borderRadius:'4px', fontSize:'13px', outline:'none' }}/>
                  <button onClick={addNewChild} style={{ padding:'6px 12px', background:'#0284c7', color:'white', border:'none', borderRadius:'4px', cursor:'pointer', fontSize:'13px' }}>Thêm</button>
                </div>
              </div>
            </div>
            <div style={{ display:'flex', gap:'8px', marginTop:'auto' }}>
              <button onClick={() => setCreating(false)} style={{ flex:1, padding:'8px', border:'1px solid #cbd5e1', borderRadius:'6px', background:'white', cursor:'pointer', fontSize:'14px' }}>← Quay lại</button>
              <button onClick={handleCreate} style={{ flex:1, padding:'8px', border:'none', borderRadius:'6px', background:'#e32b4c', color:'white', cursor:'pointer', fontWeight:600, fontSize:'14px' }}>Tạo & Chọn</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Modal: Tìm kiếm & tạo mới chỉ tiêu con
// ─────────────────────────────────────────────
const ChildSearchModal = ({ open, dbParentId, parentNamesDb, childNamesDb, onAddChild, onSelect, onClose }) => {
  const [newChildName, setNewChildName] = useState('');
  if (!open) return null;

  const parent = parentNamesDb.find(p => p.id === dbParentId);
  const children = childNamesDb[dbParentId] || [];

  const handleAdd = () => {
    if (!newChildName.trim()) return;
    const newChild = { id: `dc_${Date.now()}`, name: newChildName.trim() };
    onAddChild(dbParentId, newChild);
    setNewChildName('');
  };

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', zIndex:9000, display:'flex', alignItems:'center', justifyContent:'center' }} onClick={onClose}>
      <div style={{ background:'white', borderRadius:'10px', width:'480px', maxHeight:'75vh', display:'flex', flexDirection:'column', boxShadow:'0 20px 60px rgba(0,0,0,0.3)' }} onClick={e=>e.stopPropagation()}>
        <div style={{ padding:'16px 20px', borderBottom:'1px solid #e2e8f0', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <h3 style={{ margin:0, fontSize:'15px', fontWeight:700, color:'#0f172a' }}>Chỉ tiêu con</h3>
            {parent && <div style={{ fontSize:'12px', color:'#64748b', marginTop:'2px' }}>Thuộc: {parent.name}</div>}
          </div>
          <button onClick={onClose} style={{ border:'none', background:'none', cursor:'pointer', fontSize:'18px', color:'#64748b' }}>✕</button>
        </div>
        <div style={{ overflowY:'auto', flex:1 }}>
          {children.length === 0 && <div style={{ padding:'24px', textAlign:'center', color:'#94a3b8', fontSize:'14px' }}>Chưa có chỉ tiêu con nào</div>}
          {children.map(c => (
            <div key={c.id} onClick={() => { onSelect(c.name); onClose(); }}
              style={{ padding:'12px 16px', cursor:'pointer', borderBottom:'1px solid #f1f5f9', fontSize:'14px', color:'#334155', display:'flex', alignItems:'center', gap:'8px' }}
              onMouseEnter={e=>e.currentTarget.style.background='#f8fafc'} onMouseLeave={e=>e.currentTarget.style.background='white'}>
              <span style={{ width:'20px', height:'20px', borderRadius:'50%', background:'#e0f2fe', display:'inline-flex', alignItems:'center', justifyContent:'center', fontSize:'11px', color:'#0284c7', flexShrink:0 }}>→</span>
              {c.name}
            </div>
          ))}
        </div>
        <div style={{ padding:'12px 16px', borderTop:'1px solid #e2e8f0', display:'flex', gap:'8px' }}>
          <input autoFocus type="text" value={newChildName} onChange={e=>setNewChildName(e.target.value)}
            placeholder="Tên chỉ tiêu con mới..." onKeyDown={e=>e.key==='Enter'&&handleAdd()}
            style={{ flex:1, padding:'8px 12px', border:'1px solid #cbd5e1', borderRadius:'6px', fontSize:'14px', outline:'none' }}/>
          <button onClick={handleAdd} style={{ padding:'8px 14px', background:'#0284c7', color:'white', border:'none', borderRadius:'6px', cursor:'pointer', fontWeight:600, fontSize:'14px' }}>+ Thêm</button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Combobox cho chỉ tiêu cha
// ─────────────────────────────────────────────
const ParentNameCombobox = ({ value, onSelect, parentNamesDb, onOpenModal }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [showSearchPanel, setShowSearchPanel] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const wrapRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
        setShowSearchPanel(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const recent = parentNamesDb.slice(0, 5);
  const filtered = parentNamesDb.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (item) => {
    onSelect(item.name, item.id);
    setOpen(false);
    setShowSearchPanel(false);
  };

  const handleCreate = (nameToCreate) => {
    if (!nameToCreate.trim()) return;
    const newItem = { id: `dp_${Date.now()}`, name: nameToCreate.trim() };
    onAddToDb(newItem);
    onSelect(newItem.name, newItem.id);
    setOpen(false);
    setShowSearchPanel(false);
    setSearchQuery('');
  };

  return (
    <div ref={wrapRef} style={{ position: 'relative', flex: 1 }}>
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 6px',
          border: '1px solid #e2e8f0', borderRadius: '4px', cursor: 'pointer',
          background: 'white', minWidth: '220px'
        }}
        onClick={() => setOpen(o => !o)}
      >
        <span style={{ flex: 1, fontSize: '14px', fontWeight: 600, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {value || <span style={{ color: '#94a3b8' }}>-- Chọn chỉ tiêu cha --</span>}
        </span>
        <span style={{ color: '#64748b', fontSize: '10px' }}>▼</span>
      </div>

      {open && (
        <div className="dropdown-menu" style={{ top:'100%', left:0, minWidth:'300px', maxHeight:'280px', overflowY:'auto', zIndex:1000, padding:0 }}>
          {recent.map(p => (
            <div key={p.id} className="dropdown-item" onMouseDown={e => { e.preventDefault(); handleSelect(p); }}>
              {p.name}
            </div>
          ))}
          <div className="dropdown-item" style={{ color:'#2563eb', fontWeight:500, borderTop:'1px solid #f1f5f9' }}
            onMouseDown={e => { e.preventDefault(); setOpen(false); onOpenModal(); }}>
            🔍 Tìm kiếm / Tạo mới...
          </div>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// Combobox cho chỉ tiêu con
// ─────────────────────────────────────────────
const ChildNameCombobox = ({ value, parentId, onSelect, childNamesDb, onOpenModal }) => {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const childList = (childNamesDb[parentId] || []);
  const recent = childList.slice(0, 5);

  return (
    <div ref={wrapRef} style={{ position:'relative', flex:1 }}>
      <div style={{ display:'flex', alignItems:'center', gap:'4px', padding:'4px 6px', border:'1px solid transparent', borderBottom:'1px dashed #cbd5e1', borderRadius:'4px', cursor:'pointer', background:'transparent' }}
        onClick={() => setOpen(o => !o)}>
        <span style={{ flex:1, fontSize:'13px', color:'#334155', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
          {value || <span style={{ color:'#94a3b8' }}>-- Chọn chỉ tiêu con --</span>}
        </span>
        <span style={{ color:'#64748b', fontSize:'10px' }}>▼</span>
      </div>
      {open && (
        <div className="dropdown-menu" style={{ top:'100%', left:0, minWidth:'280px', maxHeight:'240px', overflowY:'auto', zIndex:1000, padding:0 }}>
          {recent.length > 0 ? recent.map(c => (
            <div key={c.id} className="dropdown-item" onMouseDown={e => { e.preventDefault(); onSelect(c.name); setOpen(false); }}>
              {c.name}
            </div>
          )) : (
            <div className="dropdown-item" style={{ color:'#94a3b8' }}>Chưa có chỉ tiêu con nào</div>
          )}
          <div className="dropdown-item" style={{ color:'#2563eb', fontWeight:500, borderTop:'1px solid #f1f5f9' }}
            onMouseDown={e => { e.preventDefault(); setOpen(false); onOpenModal(); }}>
            🔍 Tìm kiếm / Thêm mới...
          </div>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
const BusinessPlanForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [opportunity, setOpportunity] = useState(null);

  useEffect(() => {
    if (id) {
      const opp = mockStore.getOpp(id);
      if (opp) setOpportunity(opp);
    }
  }, [id]);

  const [status, setStatus] = useState('Nháp');
  const [quoteStatus, setQuoteStatus] = useState('Chưa báo giá');
  const [docs, setDocs] = useState([{ id: 'd1', type: 'Báo giá đối tác', file: null }]);
  const [data, setData] = useState(DEFAULT_BUSINESS_PLAN_DATA);
  const [services, setServices] = useState(DEFAULT_SERVICES);
  const [collapsedServices, setCollapsedServices] = useState({});

  // DB chỉ tiêu cha + con
  const [parentNamesDb, setParentNamesDb] = useState([...DEFAULT_PARENT_NAMES]);
  const [childNamesDb, setChildNamesDb] = useState({ ...DEFAULT_CHILD_NAMES });

  // Modal state
  const [parentModal, setParentModal] = useState({ open: false, targetParentId: null });
  const [childModal, setChildModal] = useState({ open: false, targetParentId: null, targetChildId: null, dbParentId: null });

  const pdfRef = useRef(null);

  const statuses = ['Nháp', 'Chờ phê duyệt', 'Từ chối', 'Phê duyệt'];

  // MATH CALCULATIONS
  const calculateCellTotal = (child, serviceId) => {
    let s = child.services[serviceId];
    if (!s) return 0;
    return Number(s.qty || 0) * Number(s.price || 0);
  };

  const calculateRowTotal = (child) => {
    return services.reduce((sum, s) => sum + calculateCellTotal(child, s.id), 0);
  };

  const calculateParentCellTotal = (children, serviceId) => {
    return children.reduce((sum, child) => sum + calculateCellTotal(child, serviceId), 0);
  };

  const calculateParentRowTotal = (children) => {
    return children.reduce((sum, child) => sum + calculateRowTotal(child), 0);
  };

  const calculateGrandCellTotal = (serviceId) => {
    return data.reduce((sum, parent) => sum + calculateParentCellTotal(parent.children, serviceId), 0);
  };

  const calculateGrandRowTotal = () => {
    return data.reduce((sum, parent) => sum + calculateParentRowTotal(parent.children), 0);
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);
  };

  // UPDATES
  const updateChildService = (parentId, childId, serviceId, field, value) => {
    setData(data.map(p => {
      if (p.id === parentId) {
        return {
          ...p,
          children: p.children.map(c => {
            if (c.id === childId) {
              return {
                ...c,
                services: {
                  ...c.services,
                  [serviceId]: { ...c.services[serviceId], [field]: value }
                }
              };
            }
            return c;
          })
        };
      }
      return p;
    }));
  };

  const updateChildText = (parentId, childId, text) => {
    setData(data.map(p => {
      if (p.id === parentId) {
        return { ...p, children: p.children.map(c => c.id === childId ? { ...c, text } : c) };
      }
      return p;
    }));
  };

  const updateParentText = (parentId, text) => {
    setData(data.map(p => p.id === parentId ? { ...p, text } : p));
  };

  const toggleExpandParent = (parentId) => {
    setData(data.map(p => p.id === parentId ? { ...p, expanded: !p.expanded } : p));
  };

  const toggleCollapseService = (serviceId) => {
    setCollapsedServices(prev => ({ ...prev, [serviceId]: !prev[serviceId] }));
  };

  const addChild = (parentId) => {
    let emptyServices = {};
    services.forEach(s => { emptyServices[s.id] = { unit: '', qty: 1, price: 0 }; });

    setData(data.map(p => {
      if (p.id === parentId) {
        return {
          ...p, expanded: true,
          children: [...p.children, { id: `c_${Date.now()}`, text: '', isDefault: false, services: emptyServices }]
        };
      }
      return p;
    }));
  };

  const addParent = () => {
    setData([...data, { id: `p_${Date.now()}`, text: '', expanded: true, isDefault: false, parentNameId: null, children: [] }]);
  };

  const removeChild = (parentId, childId) => {
    setData(data.map(p => p.id === parentId ? { ...p, children: p.children.filter(c => c.id !== childId) } : p));
  };

  const removeParent = (parentId) => {
    setData(data.filter(p => p.id !== parentId));
  };

  // Handler chọn chỉ tiêu cha từ combobox
  const handleSelectParentName = (parentId, nameText, nameDbId) => {
    setData(data.map(p => p.id === parentId ? { ...p, text: nameText, parentNameId: nameDbId } : p));
  };

  // Handler chọn chỉ tiêu con từ combobox
  const handleSelectChildName = (parentId, childId, nameText) => {
    setData(data.map(p => {
      if (p.id === parentId) {
        return { ...p, children: p.children.map(c => c.id === childId ? { ...c, text: nameText } : c) };
      }
      return p;
    }));
  };

  // Thêm vào DB chỉ tiêu cha (kèm theo children nếu có)
  const addToParentNamesDb = (newItem, initialChildren = []) => {
    setParentNamesDb(prev => [...prev, newItem]);
    if (initialChildren.length > 0) {
      setChildNamesDb(prev => ({ ...prev, [newItem.id]: initialChildren }));
    }
  };

  // Thêm vào DB chỉ tiêu con
  const addToChildNamesDb = (parentNameId, newItem) => {
    if (!parentNameId) return;
    setChildNamesDb(prev => ({
      ...prev,
      [parentNameId]: [...(prev[parentNameId] || []), newItem]
    }));
  };

  // Mở modal chỉ tiêu cha
  const openParentModal = (targetParentId) => {
    setParentModal({ open: true, targetParentId });
  };

  // Mở modal chỉ tiêu con
  const openChildModal = (targetParentId, targetChildId, dbParentId) => {
    setChildModal({ open: true, targetParentId, targetChildId, dbParentId });
  };

  // DOCUMENTS
  const addDocument = () => {
    setDocs([...docs, { id: `d_${Date.now()}`, type: 'Báo giá đối tác', file: null }]);
  };

  const updateDocument = (docId, field, val) => {
    setDocs(docs.map(d => d.id === docId ? { ...d, [field]: val } : d));
  };

  const removeDocument = (docId) => {
    setDocs(docs.filter(d => d.id !== docId));
  };

  // PDF
  const handleExportPDF = async () => {
    if (!pdfRef.current) return;
    const canvas = await html2canvas(pdfRef.current, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('l', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('PhuongAnKinhDoanh.pdf');
  };

  const handlePreviewPDF = async () => {
    if (!pdfRef.current) return;
    const canvas = await html2canvas(pdfRef.current, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('l', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    window.open(pdf.output('bloburl'), '_blank');
  };

  return (
    <div className="main-content form-container" style={{ height: '100vh', overflowY: 'auto', background: '#f8fafc', padding: 0 }}>

      {/* Modal tìm kiếm chỉ tiêu cha */}
      <ParentSearchModal
        open={parentModal.open}
        parentNamesDb={parentNamesDb}
        childNamesDb={childNamesDb}
        onAddParent={(newParent, children) => addToParentNamesDb(newParent, children)}
        onAddChild={addToChildNamesDb}
        onSelect={(nameText, nameDbId) => {
          if (parentModal.targetParentId) handleSelectParentName(parentModal.targetParentId, nameText, nameDbId);
        }}
        onClose={() => setParentModal({ open: false, targetParentId: null })}
      />

      {/* Modal tìm kiếm chỉ tiêu con */}
      <ChildSearchModal
        open={childModal.open}
        dbParentId={childModal.dbParentId}
        parentNamesDb={parentNamesDb}
        childNamesDb={childNamesDb}
        onAddChild={addToChildNamesDb}
        onSelect={(nameText) => {
          if (childModal.targetParentId && childModal.targetChildId)
            handleSelectChildName(childModal.targetParentId, childModal.targetChildId, nameText);
        }}
        onClose={() => setChildModal({ open: false, targetParentId: null, targetChildId: null, dbParentId: null })}
      />

      {/* Header Pipeline & Actions */}
      <div className="form-header-sticky" style={{ background: 'white', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <h2 style={{ fontSize: '20px', margin: 0, fontWeight: 700, color: '#0f172a' }}>Phương án kinh doanh</h2>
            <div style={{ fontSize: '14px', marginLeft: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center' }}>
              Cơ hội liên kết: <span
                style={{ color: '#0284c7', cursor: 'pointer', marginLeft: '4px', fontWeight: 500, padding: 0, textDecoration: 'underline', textUnderlineOffset: '2px' }}
                onClick={() => navigate(`/opportunity/edit/${id}`)}
                title="Xem chi tiết Opportunity"
              >
                {opportunity ? opportunity.content : `#${id}`}
              </span>
            </div>
          </div>

          <div className="statusbar" style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '2px', display: 'flex' }}>
            {statuses.map((s) => {
              let bg = 'transparent';
              let color = '#64748b';

              if (s === status) {
                if (s === 'Phê duyệt') { bg = '#dcfce7'; color = '#166534'; }
                else if (s === 'Từ chối') { bg = '#fee2e2'; color = '#b91c1c'; }
                else { bg = '#e0f2fe'; color = '#0284c7'; }
              } else if (s === 'Từ chối' && status !== 'Từ chối') {
                return null;
              }

              return (
                <div key={s} style={{
                  padding: '6px 16px', fontSize: '13px', fontWeight: s === status ? 600 : 400,
                  background: bg, color: color, borderRadius: '18px', display: 'flex', alignItems: 'center', gap: '4px',
                  cursor: 'pointer'
                }} onClick={() => setStatus(s)}>
                  {s === 'Phê duyệt' && s === status && <CheckCircle size={14} />}
                  {s === 'Từ chối' && s === status && <XCircle size={14} />}
                  {s}
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ padding: '12px 24px', background: '#f8fafc', display: 'flex', gap: '8px', borderTop: '1px solid #e2e8f0' }}>
          <button className="btn btn-outline" onClick={() => setStatus('Nháp')}><Save size={16} /> Lưu nháp</button>
          <button className="btn btn-primary" onClick={() => setStatus('Chờ phê duyệt')} style={{ background: '#0284c7', borderColor: '#0284c7', color: 'white' }}><Send size={16} /> Gửi phê duyệt</button>
          {status === 'Chờ phê duyệt' && (
            <>
              <button className="btn btn-primary" style={{ background: '#16a34a', borderColor: '#16a34a', color: 'white' }} onClick={() => setStatus('Phê duyệt')}><CheckCircle size={16} /> Phê duyệt</button>
              <button className="btn btn-danger" onClick={() => setStatus('Từ chối')}><XCircle size={16} /> Từ chối</button>
            </>
          )}
          <div style={{ flex: 1 }}></div>
          <button className="btn btn-outline" onClick={handlePreviewPDF}><Eye size={16} /> Preview PDF</button>
          <button className="btn btn-primary" onClick={handleExportPDF}><Download size={16} /> Xuất PDF</button>
        </div>
      </div>

      {/* Main Body */}
      <div style={{ padding: '24px', margin: '0 auto', width: 'fit-content' }}>
        <div className="sheet-card" ref={pdfRef} style={{ background: 'white', padding: '32px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', width: 'fit-content' }}>

          {/* Header Form */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
            <div style={{ width: '50%' }}>
              <h1 style={{ fontSize: '28px', color: '#0f172a', marginBottom: '24px', borderBottom: '1px dashed #cbd5e1', paddingBottom: '8px' }}>
                <input type="text" style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent' }} defaultValue="PAKD - Đa dịch vụ Hakuhodo" placeholder="Nhập tên phương án..." />
              </h1>
            </div>

            <div style={{ width: '60%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ width: '130px', fontWeight: 600, color: '#475569', fontSize: '13px' }}>Trạng thái báo giá:</div>
                <select className="document-type-select" style={{ width: '180px', borderBottom: '1px solid #cbd5e1', fontSize: '13px', padding: '4px 0' }} value={quoteStatus} onChange={e => setQuoteStatus(e.target.value)}>
                  <option value="Chưa báo giá">Chưa báo giá</option>
                  <option value="Đã báo giá">Đã báo giá</option>
                </select>
              </div>
              <div style={{ display: 'flex' }}>
                <div style={{ width: '130px', fontWeight: 600, color: '#475569', fontSize: '13px', paddingTop: '8px' }}>Tài liệu đính kèm:</div>
                <div style={{ flex: 1 }}>
                  {docs.map(doc => (
                    <div className="document-row" key={doc.id} style={{ marginBottom: '8px' }}>
                      <select className="document-type-select" style={{ width: '150px', borderBottom: '1px solid #cbd5e1', fontSize: '13px' }} value={doc.type} onChange={e => updateDocument(doc.id, 'type', e.target.value)}>
                        <option value="Báo giá đối tác">Báo giá đối tác</option>
                        <option value="Quỹ công">Quỹ công</option>
                        <option value="Nội bộ">Kế hoạch nội bộ</option>
                      </select>
                      <input type="file" style={{ fontSize: '12px', flex: 1 }} />
                      <Trash2 size={16} className="action-icon" onClick={() => removeDocument(doc.id)} style={{ cursor: 'pointer' }} />
                    </div>
                  ))}
                  <div style={{ marginTop: '4px' }}>
                    <span className="add-row-btn" onClick={addDocument} style={{ padding: 0 }}><Plus size={14} style={{ display: 'inline', verticalAlign: 'sub' }} /> Thêm tài liệu</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Grid Title - bỏ text, chỉ giữ icon */}
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={20} color="#e32b4c" />
          </h3>

          {/* Matrix Data Grid */}
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '6px', width: 'fit-content' }}>

            {/* HEADER TIERS */}
            <div>
              <div className="table-row table-header" style={{ background: '#ffffff', borderBottom: '2px solid #cbd5e1' }}>
                <div className="w-name" style={{ borderRight: '1px solid #e2e8f0' }}>NỘI DUNG ĐÁNH GIÁ</div>
                {services.map((s, index) => (
                  collapsedServices[s.id] ? (
                    <div key={s.id} className="vertical-text-container" style={{ width: '40px', background: index % 2 === 0 ? '#f8fafc' : '#ffffff' }}>
                      <div className="action-icon" onClick={() => toggleCollapseService(s.id)}><ChevronRight size={16} /></div>
                    </div>
                  ) : (
                    <div key={s.id} className="service-block-expanded" style={{ flexDirection: 'column', background: index % 2 === 0 ? '#f8fafc' : '#ffffff' }}>
                      <div className="table-header-group-title" style={{ background: '#ffffff', color: '#334155', borderBottom: '1px solid #cbd5e1' }}>
                        <span style={{ flex: 1 }}>{s.name}</span>
                        <div className="action-icon" onClick={() => toggleCollapseService(s.id)} title="Thu gọn khối này"><ChevronLeft size={16} /></div>
                      </div>
                      <div className="table-header-group-cols">
                        <div className="w-col-header">ĐVT</div>
                        <div className="w-col-header">Số lượng</div>
                        <div className="w-col-header">Đơn giá (VNĐ)</div>
                        <div className="w-col-header">Thành tiền (VNĐ)</div>
                      </div>
                    </div>
                  )
                ))}
                <div className="w-col-total" style={{ textAlign: 'center', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#334155' }}>Toàn dự án</div>
                <div className="w-actions"></div>
              </div>
            </div>

            {/* BODY */}
            {data.map(parent => (
              <React.Fragment key={parent.id}>
                {/* Parent Row */}
                <div className="table-row parent-row" style={{ background: '#ffffff' }}>
                  <div className="w-name" style={{ borderRight: '1px solid #e2e8f0' }}>
                    <div className="expand-icon" onClick={() => toggleExpandParent(parent.id)}>
                      {parent.expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </div>

                    {parent.isDefault ? (
                      // Default: không thể sửa, chỉ hiện text + icon khóa
                      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontWeight: 600, fontSize: '14px', color: '#1e293b', flex: 1 }}>{parent.text}</span>
                        <Lock size={13} color="#94a3b8" title="Chỉ tiêu mặc định - không thể sửa tên" />
                      </div>
                    ) : (
                      // Custom: dùng combobox
                      <ParentNameCombobox
                        value={parent.text}
                        onSelect={(nameText, nameDbId) => handleSelectParentName(parent.id, nameText, nameDbId)}
                        parentNamesDb={parentNamesDb}
                        onOpenModal={() => openParentModal(parent.id)}
                      />
                    )}
                  </div>

                  {services.map((s, index) => (
                    collapsedServices[s.id] ? (
                      <div key={s.id} className="vertical-text-container" style={{ width: '40px', background: index % 2 === 0 ? '#ffffff' : '#f8fafc' }}></div>
                    ) : (
                      <div key={s.id} className="service-block-expanded" style={{ background: index % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                        <div className="w-col"></div>
                        <div className="w-col"></div>
                        <div className="w-col"></div>
                        <div className="w-col" style={{ textAlign: 'right', fontWeight: 'bold', color: '#475569' }}>{formatCurrency(calculateParentCellTotal(parent.children, s.id))}</div>
                      </div>
                    )
                  ))}

                  {/* Parent Row Total */}
                  <div className="w-col-total" style={{ textAlign: 'right', fontWeight: 800, color: '#0f172a', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }} align="right">{formatCurrency(calculateParentRowTotal(parent.children))}</div>

                  <div className="w-actions" style={{ display: 'flex', gap: '4px' }}>
                    <Plus size={16} className="action-icon" onClick={() => addChild(parent.id)} title="Thêm chỉ tiêu con" />
                    {!parent.isDefault && (
                      <Trash2 size={16} className="action-icon" onClick={() => removeParent(parent.id)} title="Xóa nhóm" />
                    )}
                  </div>
                </div>

                {/* Children Rows */}
                {parent.expanded && parent.children.map(child => (
                  <div className="table-row child-row" key={child.id} style={{ background: 'white' }}>
                    <div className="w-name" style={{ borderRight: '1px solid #e2e8f0' }}>
                      {child.isDefault ? (
                        // Default child: không thể sửa
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '100%', paddingLeft: '28px' }}>
                          <span style={{ flex: 1, fontSize: '13px', color: '#334155' }}>{child.text}</span>
                          <Lock size={12} color="#94a3b8" title="Chỉ tiêu mặc định - không thể sửa tên" />
                        </div>
                      ) : (
                        // Custom child: dùng combobox
                        <div style={{ paddingLeft: '28px', width: '100%', display: 'flex' }}>
                          <ChildNameCombobox
                            value={child.text}
                            parentId={parent.parentNameId || parent.id}
                            onSelect={(nameText) => handleSelectChildName(parent.id, child.id, nameText)}
                            childNamesDb={childNamesDb}
                            onOpenModal={() => openChildModal(parent.id, child.id, parent.parentNameId || parent.id)}
                          />
                        </div>
                      )}
                    </div>

                    {/* Child Service Cells */}
                    {services.map((s, index) => {
                      const cSrv = child.services[s.id] || { unit: '', qty: '', price: 0 };
                      return collapsedServices[s.id] ? (
                        <div key={s.id} className="vertical-text-container" style={{ width: '40px', background: index % 2 === 0 ? '#f8fafc' : '#ffffff' }}></div>
                      ) : (
                        <div key={s.id} className="service-block-expanded" style={{ background: index % 2 === 0 ? '#f8fafc' : '#ffffff' }}>
                          <div className="w-col"><input type="text" value={cSrv.unit} onChange={e => updateChildService(parent.id, child.id, s.id, 'unit', e.target.value)} style={{ width: '90%', textAlign: 'center', border: 'none', outline: 'none', fontSize: '13px' }} placeholder="ĐVT" /></div>
                          <div className="w-col"><input type="number" value={cSrv.qty} onChange={e => updateChildService(parent.id, child.id, s.id, 'qty', e.target.value)} style={{ width: '90%', textAlign: 'center', border: '1px solid transparent', outline: 'none', fontSize: '13px' }} /></div>
                          <div className="w-col"><input type="number" value={cSrv.price} onChange={e => updateChildService(parent.id, child.id, s.id, 'price', e.target.value)} style={{ width: '90%', textAlign: 'right', border: '1px solid transparent', outline: 'none', fontSize: '13px' }} /></div>
                          <div className="w-col" style={{ textAlign: 'right', fontWeight: 600, fontSize: '13px', color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>{formatCurrency(Number(cSrv.qty) * Number(cSrv.price))}</div>
                        </div>
                      );
                    })}

                    {/* Child Row Total */}
                    <div className="w-col-total" style={{ textAlign: 'right', fontWeight: 600, color: '#334155', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>{formatCurrency(calculateRowTotal(child))}</div>

                    <div className="w-actions">
                      {!child.isDefault && (
                        <Trash2 size={14} className="action-icon" onClick={() => removeChild(parent.id, child.id)} />
                      )}
                    </div>
                  </div>
                ))}
              </React.Fragment>
            ))}

            {/* Add Parent Button Row */}
            <div className="table-row" style={{ background: 'white' }}>
              <div className="w-name" style={{ borderRight: '1px solid #e2e8f0' }}>
                <div className="add-row-btn" onClick={addParent}>
                  Thêm chỉ tiêu cha
                </div>
              </div>
              {services.map((s, index) => collapsedServices[s.id] ? <div key={s.id} className="vertical-text-container" style={{ width: '40px', background: index % 2 === 0 ? '#f8fafc' : '#ffffff' }}></div> : <div key={s.id} className="service-block-expanded" style={{ background: index % 2 === 0 ? '#f8fafc' : '#ffffff' }}></div>)}
              <div className="w-col-total"></div><div className="w-actions"></div>
            </div>

            {/* Grand Total Row */}
            <div className="table-row" style={{ background: '#fef3c7', borderTop: '2px solid #fde68a' }}>
              <div className="w-name" style={{ fontWeight: 700, color: '#b45309', fontSize: '15px', textAlign: 'right', borderRight: '1px solid #fde68a' }}>
                TỔNG CHI PHÍ TẠM TÍNH:
              </div>
              {services.map((s, index) => collapsedServices[s.id] ? (
                <div key={s.id} className="vertical-text-container" style={{ width: '40px', background: index % 2 === 0 ? '#fcf8eb' : '#fffbef' }}></div>
              ) : (
                <div key={s.id} className="service-block-expanded" style={{ display: 'flex', justifyContent: 'flex-end', background: index % 2 === 0 ? '#fcf8eb' : '#fffbef' }}>
                  <div style={{ width: '300px' }}></div>
                  <div className="w-col" style={{ textAlign: 'right', fontWeight: 800, color: '#b45309', fontSize: '15px' }}>{formatCurrency(calculateGrandCellTotal(s.id))}</div>
                </div>
              ))}
              <div className="w-col-total" style={{ textAlign: 'right', fontWeight: 900, color: '#e11d48', fontSize: '16px' }}>{formatCurrency(calculateGrandRowTotal())}</div>
              <div className="w-actions"></div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default BusinessPlanForm;
