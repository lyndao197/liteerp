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
  CalendarDays,
  Activity,
  List,
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
            <span>Quản lý công việc cá nhân</span>
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
          <div className={`nav-item ${location.pathname.includes('/contact') ? 'active' : ''}`} onClick={() => navigate('/contacts')}>
            <CalendarDays size={20} />
            <span>Quản lý liên hệ khách hàng</span>
            <span className="mvp-badge">MVP</span>
          </div>
          <div className={`nav-item ${location.pathname.includes('/marketing') ? 'active' : ''}`} onClick={() => navigate('/marketing')}>
            <Activity size={20} />
            <span>Marketing Automation</span>
          </div>
          <div className={`nav-item ${location.pathname.includes('/ticketing') ? 'active' : ''}`} onClick={() => navigate('/ticketing')}>
            <List size={20} />
            <span>Customer service ticketing</span>
          </div>
          <div className={`nav-item ${location.pathname.includes('/loyalty') ? 'active' : ''}`} onClick={() => navigate('/loyalty')}>
            <Tag size={20} />
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
            onClick={() => setContractsOpen(o => !o)}
            style={{ justifyContent: 'space-between' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ClipboardList size={20} />
              <span>Danh sách Hợp đồng</span>
              <span className="mvp-badge">MVP</span>
            </div>
            {contractsOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </div>
          {contractsOpen && (
            <div style={{ paddingLeft: '16px' }}>
              <div
                className={`nav-item ${location.pathname === '/contracts/solution' ? 'active' : ''}`}
                onClick={() => navigate('/contracts/solution')}
                style={{ fontSize: '13px' }}
              >
                <Layers size={16} />
                <span>Hợp đồng giải pháp</span>
              </div>
              <div
                className={`nav-item ${location.pathname === '/contracts/service' ? 'active' : ''}`}
                onClick={() => navigate('/contracts/service')}
                style={{ fontSize: '13px' }}
              >
                <Briefcase size={16} />
                <span>Hợp đồng dịch vụ</span>
              </div>
              <div
                className={`nav-item ${location.pathname.includes('/projects') ? 'active' : ''}`}
                onClick={() => navigate('/projects')}
                style={{ fontSize: '13px' }}
              >
                <Kanban size={16} />
                <span>Triển khai dự án</span>
              </div>
            </div>
          )}
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
          <div className={`nav-item ${location.pathname.includes('/product') ? 'active' : ''}`} onClick={() => navigate('/products')}>
            <ListTodo size={20} />
            <span>Quản lý sản phẩm & Dịch vụ</span>
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
          <div className={`nav-item ${location.pathname.includes('/debt') ? 'active' : ''}`} onClick={() => navigate('/debt')}>
            <Receipt size={20} />
            <span>Quản lý công nợ</span>
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
