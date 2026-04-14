import React from 'react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  ComposedChart, Area, Cell 
} from 'recharts';
import { Download, Filter, TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const CASH_FLOW_DATA = [
  { name: 'Th 1', in: 45, out: 30, bal: 15 },
  { name: 'Th 2', in: 52, out: 35, bal: 32 },
  { name: 'Th 3', in: 48, out: 40, bal: 40 },
  { name: 'Th 4', in: 61, out: 45, bal: 56 },
  { name: 'Th 5', in: 55, out: 38, bal: 73 },
  { name: 'Th 6', in: 67, out: 50, bal: 90 },
  { name: 'Th 7', in: 70, out: 55, bal: 105 },
  { name: 'Th 8', in: 0, out: 0, bal: 105 },
  { name: 'Th 9', in: 0, out: 0, bal: 105 },
  { name: 'Th 10', in: 0, out: 0, bal: 105 },
  { name: 'Th 11', in: 0, out: 0, bal: 105 },
  { name: 'Th 12', in: 0, out: 0, bal: 105 },
];

const REVENUE_DATA = [
  { name: 'Th 1', value: 55 },
  { name: 'Th 2', value: 88 },
  { name: 'Th 3', value: 84 },
  { name: 'Th 4', value: 5 },
  { name: 'Th 5', value: 0 },
  { name: 'Th 6', value: 0 },
  { name: 'Th 7', value: 0 },
  { name: 'Th 8', value: 0 },
  { name: 'Th 9', value: 0 },
  { name: 'Th 10', value: 0 },
  { name: 'Th 11', value: 0 },
  { name: 'Th 12', value: 0 },
];

const EXPENSE_DATA = [
  { name: 'Th 1', value: 52 },
  { name: 'Th 2', value: 70 },
  { name: 'Th 3', value: 62 },
  { name: 'Th 4', value: 15 },
  { name: 'Th 5', value: 0 },
  { name: 'Th 6', value: 0 },
  { name: 'Th 7', value: 0 },
  { name: 'Th 8', value: 0 },
  { name: 'Th 9', value: 0 },
  { name: 'Th 10', value: 0 },
  { name: 'Th 11', value: 0 },
  { name: 'Th 12', value: 0 },
];

const AR_AGING_DATA = [
  { name: 'Chưa đến hạn', value: 15 },
  { name: '0 - 30 ngày', value: 115 },
  { name: '31 - 60 ngày', value: 25 },
  { name: '61 - 90 ngày', value: 95 },
  { name: 'Trên 90 ngày', value: 30 },
];

const AP_AGING_DATA = [
  { name: 'Chưa đến hạn', value: 40 },
  { name: '0 - 30 ngày', value: 55 },
  { name: '31 - 60 ngày', value: 15 },
  { name: '61 - 90 ngày', value: 45 },
  { name: 'Trên 90 ngày', value: 340 },
];

const TOP_PRODUCTS = [
  { id: 'PRD-OX', name: 'Giải pháp tổng đài OmniX', qty: 15, rev: 1150000000 },
  { id: 'PRD-KH', name: 'Nền tảng tri thức KnowxHUB', qty: 8, rev: 850000000 },
  { id: 'SRV-CS', name: 'Dịch vụ hỗ trợ khách hàng', qty: 120, rev: 514800000 },
  { id: 'SRV-BPO', name: 'Dịch vụ BPO chuyên nghiệp', qty: 45, rev: 960000000 },
  { id: 'PRD-WC', name: 'WorkForcX Workforce Management', qty: 5, rev: 670000000 },
];

export default function DebtManagement() {
  const fmt = (v) => v.toLocaleString('vi-VN') + ' ₫';

  return (
    <div className="contract-page-container" style={{ background: '#f8fafc', paddingBottom: '40px' }}>
      <div className="contract-page-header">
        <div className="contract-header-left">
          <h1>Quản lý công nợ</h1>
          <p className="contract-subtitle">Báo cáo tổng quan về dòng tiền, doanh thu, chi phí và tuổi nợ.</p>
        </div>
        <div className="contract-header-right" style={{ gap: '10px' }}>
          <button className="btn-outline-brand"><Filter size={18} /> Bộ lọc</button>
          <button className="btn-primary"><Download size={18} /> Xuất báo cáo</button>
        </div>
      </div>

      {/* Top row: Metrics */}
      <div className="metric-cards-container" style={{ marginBottom: '24px' }}>
        <div className="crm-metric-card">
           <div style={{ display: 'flex', justifyContent: 'space-between' }}>
             <p className="crm-card-title">Tổng nợ phải thu</p>
             <Wallet size={16} color="#3b82f6" />
           </div>
           <div className="crm-card-body">
             <p className="crm-card-value">2,450,000,000 <span style={{ fontSize: '14px', fontWeight: 400 }}>₫</span></p>
             <span className="crm-card-indicator indicator-up"><ArrowUpRight size={12}/> 12%</span>
           </div>
        </div>
        <div className="crm-metric-card">
           <div style={{ display: 'flex', justifyContent: 'space-between' }}>
             <p className="crm-card-title">Tổng nợ phải trả</p>
             <TrendingDown size={16} color="#ef4444" />
           </div>
           <div className="crm-card-body">
             <p className="crm-card-value">1,820,000,000 <span style={{ fontSize: '14px', fontWeight: 400 }}>₫</span></p>
             <span className="crm-card-indicator indicator-neutral">ổn định</span>
           </div>
        </div>
        <div className="crm-metric-card">
           <div style={{ display: 'flex', justifyContent: 'space-between' }}>
             <p className="crm-card-title">Dòng tiền thuần</p>
             <TrendingUp size={16} color="#16a34a" />
           </div>
           <div className="crm-card-body">
             <p className="crm-card-value">+ 630,000,000 <span style={{ fontSize: '14px', fontWeight: 400 }}>₫</span></p>
             <span className="crm-card-indicator indicator-up"><ArrowUpRight size={12}/> 5%</span>
           </div>
        </div>
      </div>

      {/* Grid for Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
        
        {/* Cash Flow Chart */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', height: '350px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b' }}>Dòng tiền</h3>
            <select style={{ border: 'none', background: 'none', fontSize: '12px', color: '#64748b', cursor: 'pointer' }}><option>Năm nay</option></select>
          </div>
          <div style={{ display: 'flex', gap: '20px', marginBottom: '15px', fontSize: '11px' }}>
            <div><span style={{ color: '#94a3b8' }}>Tồn:</span> <strong style={{ color: '#3b82f6' }}>—</strong></div>
            <div><span style={{ color: '#94a3b8' }}>Tổng thu:</span> <strong style={{ color: '#10b981' }}>0 ₫</strong></div>
            <div><span style={{ color: '#94a3b8' }}>Tổng chi:</span> <strong style={{ color: '#f59e0b' }}>0 ₫</strong></div>
          </div>
          <div style={{ flex: 1, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={CASH_FLOW_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="bal" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Chart */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', height: '350px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b' }}>Doanh thu</h3>
            <select style={{ border: 'none', background: 'none', fontSize: '12px', color: '#64748b', cursor: 'pointer' }}><option>Năm nay</option></select>
          </div>
          <div style={{ flex: 1, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={REVENUE_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip />
                <Bar dataKey="value" fill="#5db0af" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Chart */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', height: '350px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b' }}>Chi phí</h3>
            <select style={{ border: 'none', background: 'none', fontSize: '12px', color: '#64748b', cursor: 'pointer' }}><option>Năm nay</option></select>
          </div>
          <div style={{ flex: 1, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={EXPENSE_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip />
                <Bar dataKey="value" fill="#f97316" radius={[4, 4, 0, 0]} opacity={0.8} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AR Aging */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', height: '400px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b', marginBottom: '20px' }}>Nợ phải thu khách hàng theo tuổi nợ</h3>
          <div style={{ flex: 1, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={AR_AGING_DATA} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#1e293b', fontWeight: 500 }} width={100} />
                <Tooltip />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                  {AR_AGING_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index > 0 ? '#ffcc66' : '#ff9966'} opacity={index === 1 ? 0.6 : 1} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ fontSize: '10px', color: '#94a3b8', textAlign: 'center', marginTop: '10px' }}>Đơn vị: đồng (đ)</div>
        </div>

        {/* AP Aging */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', height: '400px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b', marginBottom: '20px' }}>Nợ phải trả nhà cung cấp theo tuổi nợ</h3>
          <div style={{ flex: 1, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={AP_AGING_DATA} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#1e293b', fontWeight: 500 }} width={100} />
                <Tooltip />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                  {AP_AGING_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 4 ? '#993333' : '#ff9999'} opacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ fontSize: '10px', color: '#94a3b8', textAlign: 'center', marginTop: '10px' }}>Đơn vị: đồng (đ)</div>
        </div>

        {/* Top Product Table */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', height: '400px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b', marginBottom: '20px' }}>Sản phẩm bán chạy</h3>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #f1f5f9', textAlign: 'left' }}>
                  <th style={{ paddingBottom: '10px', color: '#64748b' }}>STT</th>
                  <th style={{ paddingBottom: '10px', color: '#64748b' }}>Tên Sản Phẩm</th>
                  <th style={{ paddingBottom: '10px', color: '#64748b', textAlign: 'center' }}>Số lượng</th>
                  <th style={{ paddingBottom: '10px', color: '#64748b', textAlign: 'right' }}>Doanh Thu</th>
                </tr>
              </thead>
              <tbody>
                {TOP_PRODUCTS.map((p, i) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '12px 0', color: '#64748b' }}>{i + 1}</td>
                    <td style={{ padding: '12px 0' }}>
                      <div style={{ fontWeight: 600 }}>{p.id}</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>{p.name}</div>
                    </td>
                    <td style={{ padding: '12px 0', textAlign: 'center' }}>{p.qty}</td>
                    <td style={{ padding: '12px 0', textAlign: 'right' }}>{fmt(p.rev)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ textAlign: 'center', marginTop: '15px' }}>
            <button style={{ border: 'none', background: 'none', color: '#3b82f6', fontWeight: 600, fontSize: '12px', cursor: 'pointer' }}>Xem Thêm</button>
          </div>
        </div>

      </div>
    </div>
  );
}
