import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Package, Tag, Layers, Settings2, MoreVertical, Filter, Trash2, Edit } from 'lucide-react';
import { mockStore } from '../utils/mockStore';

export default function ProductList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  
  const [products, setProducts] = useState(() => mockStore.getAllProducts());

  const filtered = useMemo(() => {
    return products.filter(p => {
      const matchSearch = !searchTerm || 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchType = !filterType || p.type === filterType;
      const matchCategory = !filterCategory || p.category === filterCategory;
      return matchSearch && matchType && matchCategory;
    });
  }, [products, searchTerm, filterType, filterCategory]);

  const handleToggleStatus = (e, id) => {
    e.stopPropagation();
    mockStore.toggleProductStatus(id);
    setProducts(mockStore.getAllProducts());
  };

  const fmt = (v) => v ? v.toLocaleString('vi-VN') + ' ₫' : '0 ₫';

  return (
    <div className="contract-page-container">
      <div className="contract-page-header">
        <div className="contract-header-left">
          <h1>Sản phẩm & Dịch vụ</h1>
          <p className="contract-subtitle">Quản lý danh mục hàng hóa, dịch vụ và chính sách giá.</p>
        </div>
        <div className="contract-header-right">
          <button className="btn-primary" onClick={() => navigate('/product/new')}>
            <Plus size={18} /> Thêm sản phẩm mới
          </button>
        </div>
      </div>

      <div className="toolbar-row" style={{ marginTop: '24px' }}>
        <div className="toolbar-left">
          <div className="search-box-modern">
            <Search size={16} color="#94a3b8" />
            <input type="text" placeholder="Tìm tên hoặc SKU..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <select className="select-modern" value={filterType} onChange={e => setFilterType(e.target.value)}>
            <option value="">Tất cả loại hình</option>
            <option value="Dịch vụ">Dịch vụ</option>
            <option value="Sản phẩm">Sản phẩm</option>
            <option value="Nhân sự">Nhân sự</option>
          </select>
          <select className="select-modern" value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
            <option value="">Tất cả nhóm</option>
            <option value="Phần mềm">Phần mềm</option>
            <option value="BPO">BPO</option>
            <option value="Hạ tầng">Hạ tầng</option>
            <option value="Triển khai">Triển khai</option>
          </select>
        </div>
      </div>

      <div className="contract-table-wrapper">
        <table className="contract-table">
          <thead>
            <tr>
              <th>Sản phẩm / Dịch vụ</th>
              <th>SKU / Mã</th>
              <th>Loại</th>
              <th>Nhóm</th>
              <th>Đơn giá công bố</th>
              <th>Đơn vị</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} onClick={() => navigate(`/product/edit/${p.id}`)} style={{ cursor: 'pointer' }}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                      <Package size={18} />
                    </div>
                    <div style={{ fontWeight: 600, color: '#1e293b' }}>{p.name}</div>
                  </div>
                </td>
                <td style={{ fontSize: '12px', fontFamily: 'monospace', color: '#64748b' }}>{p.sku}</td>
                <td>{p.type}</td>
                <td>
                  <span style={{ fontSize: '13px', color: '#475569' }}>{p.category}</span>
                </td>
                <td style={{ fontWeight: 700, color: '#1e293b' }}>{fmt(p.price)}</td>
                <td style={{ fontSize: '13px' }}>{p.unit}</td>
                <td>
                  <button 
                    onClick={(e) => handleToggleStatus(e, p.id)}
                    className={`status-badge-modern ${p.status === 'Active' ? 'status-badge-green' : 'status-badge-gray'}`}
                    style={{ border: 'none', cursor: 'pointer' }}
                  >
                    {p.status}
                  </button>
                </td>
                <td>
                   <div style={{ display: 'flex', gap: '10px' }}>
                      <Edit size={16} color="#3b82f6" />
                      <Trash2 size={16} color="#ef4444" />
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
