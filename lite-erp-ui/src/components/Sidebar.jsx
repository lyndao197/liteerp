import React, { useState } from 'react';
import './Sidebar.css';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Target,
  Users,
  Settings,
  Kanban,
  TrendingUp,
  BarChart2,
  LineChart,
  Gift,
  Tag,
  ClipboardList,
  FileText,
  ListTodo,
  CircleDollarSign,
  Receipt,
  UserCog,
  BarChart,
  ChevronDown,
  ChevronRight,
  ArrowDownToLine,
  ArrowUpFromLine,
  Layers,
  Briefcase
} from 'lucide-react';

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [billingOpen, setBillingOpen] = useState(location.pathname.includes('/billing'));
  const [contractsOpen, setContractsOpen] = useState(location.pathname.includes('/contracts'));

  return (
    <aside className="sidebar">
      <div className="sidebar-logo" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', fontStyle: 'normal', lineHeight: '1' }}>
          <span style={{ fontSize: '18px', fontWeight: '900', color: '#EE0033', letterSpacing: '-1px', fontFamily: 'Arial Black, sans-serif', marginRight: '2px' }}>x</span>
          <span style={{ fontSize: '30px', fontWeight: '900', color: '#000', letterSpacing: '-1.5px', fontFamily: 'Arial Black, sans-serif' }}>ERP</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {/* Independent Home Page */}
        <div className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`} onClick={() => navigate('/dashboard')} style={{ marginBottom: '8px' }}>
          <LayoutDashboard size={20} />
          <span>Trang chủ</span>
          <span className="mvp-badge">MVP</span>
        </div>

        {/* Section 1 */}
        <div className="nav-group">
          <div className="group-title">
            <span>QUẢN TRỊ CÔNG VIỆC & MỤC TIÊU</span>
          </div>
          <div className={`nav-item ${location.pathname === '/activities' ? 'active' : ''}`} onClick={() => navigate('/activities')}>
            <Kanban size={20} />
            <span>Quản lý tiếp xúc Khách hàng</span>
            <span className="mvp-badge">MVP</span>
          </div>
          <div className={`nav-item ${location.pathname === '/goals' ? 'active' : ''}`} onClick={() => navigate('/goals')}>
            <Target size={20} />
            <span>Quản lý mục tiêu doanh số</span>
            <span className="mvp-badge">MVP</span>
          </div>
        </div>

        {/* Section 2 */}
        <div className="nav-group">
          <div className="group-title">
            <span>QUẢN TRỊ KHÁCH HÀNG (CRM)</span>
          </div>
          <div className={`nav-item ${location.pathname === '/' || location.pathname.includes('/opportunity') ? 'active' : ''}`} onClick={() => navigate('/')}>
            <BarChart2 size={20} />
            <span>Quản lý Lead & Cơ hội bán hàng</span>
            <span className="mvp-badge">MVP</span>
          </div>
          <div className={`nav-item ${location.pathname.includes('/customer') ? 'active' : ''}`} onClick={() => navigate('/customers')}>
            <LineChart size={20} />
            <span>Quản lý hồ sơ khách hàng</span>
            <span className="mvp-badge">MVP</span>
          </div>
          <div className={`nav-item ${location.pathname.includes('/customer-service') ? 'active' : ''}`} onClick={() => navigate('/customer-service')}>
            <Settings size={20} />
            <span>Customer Service</span>
          </div>
          <div
            className={`nav-item ${location.pathname.includes('/customer-service/surveys') ? 'active' : ''}`}
            onClick={() => navigate('/customer-service/surveys')}
          >
            <Tag size={20} />
            <span>Quản lý Khảo sát khách hàng</span>
          </div>
          <div
            className={`nav-item ${location.pathname.includes('/loyalty') ? 'active' : ''}`}
            onClick={() => navigate('/loyalty')}
          >
            <Gift size={20} />
            <span>Loyalty</span>
          </div>
        </div>

        {/* Quản lý Hợp đồng */}
        <div className="nav-group">
          <div className="group-title">
            <span>QUẢN LÝ HỢP ĐỒNG</span>
          </div>
          <div
            className={`nav-item ${location.pathname.includes('/contracts') ? 'active' : ''}`}
            onClick={() => navigate('/contracts')}
          >
            <ClipboardList size={20} />
            <span>Quản lý hợp đồng</span>
            <span className="mvp-badge">MVP</span>
          </div>
          <div
            className={`nav-item ${location.pathname.includes('/projects') ? 'active' : ''}`}
            onClick={() => navigate('/projects')}
          >
            <Kanban size={20} />
            <span>Quản trị triển khai dự án</span>
            <span className="mvp-badge">MVP</span>
          </div>
        </div>

        {/* Quản lý Nghiệm thu */}
        <div className="nav-group">
          <div className="group-title">
            <span>QUẢN LÝ NGHIỆM THU</span>
          </div>
          <div
            className={`nav-item ${location.pathname.includes('/acceptances') ? 'active' : ''}`}
            onClick={() => navigate('/acceptances')}
          >
            <ClipboardList size={20} />
            <span>Danh sách nghiệm thu</span>
            <span className="mvp-badge">MVP</span>
          </div>
        </div>

        {/* Quản lý Nhà cung cấp */}
        <div className="nav-group">
          <div className="group-title">
            <span>QUẢN LÝ HỒ SƠ NHÀ CUNG CẤP</span>
          </div>
          <div
            className={`nav-item ${location.pathname.includes('/supplier-contracts') ? 'active' : ''}`}
            onClick={() => navigate('/supplier-contracts')}
          >
            <Briefcase size={20} />
            <span>Danh sách Hợp đồng</span>
            <span className="mvp-badge">MVP</span>
          </div>
        </div>

        {/* Quản lý Bán hàng */}
        <div className="nav-group">
          <div className="group-title">
            <span>QUẢN LÝ BÁN HÀNG</span>
          </div>
          <div className={`nav-item ${location.pathname.includes('/order') ? 'active' : ''}`} onClick={() => navigate('/orders')}>
            <FileText size={20} />
            <span>Quản lý đơn hàng</span>
            <span className="mvp-badge">MVP</span>
          </div>
          {/* Billing - Collapsible */}
          <div
            className={`nav-item ${location.pathname.includes('/billing') ? 'active' : ''}`}
            onClick={() => setBillingOpen(o => !o)}
            style={{ justifyContent: 'space-between' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CircleDollarSign size={20} />
              <span>Tính cước</span>
              <span className="mvp-badge">MVP</span>
            </div>
            {billingOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </div>
          {billingOpen && (
            <div style={{ paddingLeft: '16px' }}>
              <div
                className={`nav-item ${location.pathname === '/billing/in' ? 'active' : ''}`}
                onClick={() => navigate('/billing/in')}
                style={{ fontSize: '13px' }}
              >
                <ArrowDownToLine size={16} />
                <span>Tính cước khách hàng</span>
              </div>
              <div
                className={`nav-item ${location.pathname === '/billing/out' ? 'active' : ''}`}
                onClick={() => navigate('/billing/out')}
                style={{ fontSize: '13px' }}
              >
                <ArrowUpFromLine size={16} />
                <span>Tính cước đối tác</span>
              </div>
            </div>
          )}
        </div>

        {/* Section 4 */}
        <div className="nav-group">
          <div className="group-title">
            <span>TÀI CHÍNH VÀ KẾ TOÁN</span>
          </div>

          <div className={`nav-item ${location.pathname.includes('/invoices') ? 'active' : ''}`} onClick={() => navigate('/invoices')}>
            <Receipt size={20} />
            <span>Quản lý hóa đơn</span>
          </div>

          <div className={`nav-item ${location.pathname.includes('/debt') ? 'active' : ''}`} onClick={() => navigate('/debt')}>
            <Receipt size={20} />
            <span>Quản lý công nợ</span>
          </div>

          <div className={`nav-item ${location.pathname.includes('/revenue') ? 'active' : ''}`} onClick={() => navigate('/revenue')}>
            <TrendingUp size={20} />
            <span>Quản lý Doanh thu</span>
          </div>
        </div>


        {/* Section 6 */}
        <div className="nav-group">
          <div className="group-title">
            <span>QUẢN TRỊ HỆ THỐNG</span>
          </div>
          <div className={`nav-item ${location.pathname.includes('/users') ? 'active' : ''}`} onClick={() => navigate('/users')}>
            <UserCog size={20} />
            <span>Quản lý người dùng</span>
          </div>
          <div className={`nav-item ${location.pathname.includes('/roles') ? 'active' : ''}`} onClick={() => navigate('/roles')}>
            <Users size={20} />
            <span>Quản lý vai trò</span>
          </div>
          <div className={`nav-item ${location.pathname.includes('/product') ? 'active' : ''}`} onClick={() => navigate('/products')}>
            <ListTodo size={20} />
            <span>Cấu hình Sản phẩm & Dịch vụ</span>
          </div>
        </div>

        {/* Section 7 */}
        <div className="nav-group">
          <div className="group-title">
            <span>BÁO CÁO DASHBOARD</span>
          </div>
          <div className={`nav-item ${location.pathname === '/reports' ? 'active' : ''}`} onClick={() => navigate('/reports')}>
            <BarChart size={20} />
            <span>Báo cáo Dashboard</span>
            <span className="mvp-badge">MVP</span>
          </div>
        </div>


      </nav>
    </aside>
  );
}

export default Sidebar;
