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
  Briefcase,
  FileSliders
} from 'lucide-react';

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [billingOpen, setBillingOpen] = useState(location.pathname.includes('/billing'));
  const [contractsOpen, setContractsOpen] = useState(location.pathname.includes('/contracts'));
  const [goalsOpen, setGoalsOpen] = useState(location.pathname.includes('/goals'));

  return (
    <aside className="sidebar">
      <div className="sidebar-logo" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '36px', height: '36px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="#EE0033" fillOpacity="0.1"/>
            <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" fill="#EE0033"/>
            <circle cx="12" cy="4" r="2.5" fill="#EE0033"/>
            <circle cx="4.5" cy="16" r="2.5" fill="#EE0033"/>
            <circle cx="19.5" cy="16" r="2.5" fill="#EE0033"/>
          </svg>
        </div>
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
          {/* Goals - Collapsible */}
          <div
            className={`nav-item ${location.pathname.includes('/goals') ? 'active' : ''}`}
            onClick={() => setGoalsOpen(o => !o)}
            style={{ justifyContent: 'space-between' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Target size={20} />
              <span>Quản lý mục tiêu doanh số</span>
              <span className="mvp-badge">MVP</span>
            </div>
            {goalsOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </div>
          {goalsOpen && (
            <div style={{ paddingLeft: '16px' }}>
              <div
                className={`nav-item ${location.pathname === '/goals' || location.pathname.includes('/goal/') ? 'active' : ''}`}
                onClick={() => navigate('/goals')}
                style={{ fontSize: '13px' }}
              >
                <FileText size={16} />
                <span>Kế hoạch doanh thu</span>
              </div>
              <div
                className={`nav-item ${location.pathname === '/goals/results' ? 'active' : ''}`}
                onClick={() => navigate('/goals/results')}
                style={{ fontSize: '13px' }}
              >
                <BarChart2 size={16} />
                <span>Kết quả doanh thu</span>
              </div>
            </div>
          )}
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
          <div
            className={`nav-item ${location.pathname.includes('/contract-kpi-config') ? 'active' : ''}`}
            onClick={() => navigate('/contract-kpi-config')}
          >
            <Target size={20} />
            <span>Cấu hình KPI và SLA</span>
            <span className="mvp-badge" style={{ backgroundColor: '#10b981' }}>New</span>
          </div>
          <div
            className={`nav-item ${location.pathname.startsWith('/acceptances') ? 'active' : ''}`}
            onClick={() => navigate('/acceptances')}
          >
            <FileText size={20} />
            <span>Danh sách nghiệm thu</span>
            <span className="mvp-badge" style={{ backgroundColor: '#10b981' }}>New</span>
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
          <div className={`nav-item ${location.pathname.includes('/config-file') ? 'active' : ''}`} onClick={() => navigate('/config-files')}>
            <FileSliders size={20} />
            <span>Cấu hình File</span>
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

        {/* Footer Logo Section */}
        <div style={{ padding: '24px 20px', marginTop: 'auto', borderTop: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '16px', fontWeight: '800', color: '#EE0033', lineHeight: '1', fontFamily: 'sans-serif' }}>viettel</span>
            <span style={{ fontSize: '9px', color: '#444', lineHeight: '1', fontWeight: '600', textTransform: 'lowercase', marginTop: '1px' }}>customer service</span>
          </div>
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar;
