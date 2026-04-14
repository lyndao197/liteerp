import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, LabelList
} from 'recharts';
import { 
  TrendingUp, Users, Target, FileText, BarChart3, PieChart as PieChartIcon, 
  Layers, Package, Globe, ShieldCheck
} from 'lucide-react';
import { mockStore } from '../utils/mockStore';
import './ReportDashboard.css';

const COLORS = ['#EE0033', '#3b82f6', '#16a34a', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

const ReportDashboard = () => {
  const store = mockStore.getStore();
  const [startDate, setStartDate] = React.useState('2026-01-01');
  const [endDate, setEndDate] = React.useState('2026-12-31');

  // Helper to parse date from various formats: 'DD/MM/YYYY' or 'YYYY-MM-DD'
  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    if (dateStr.includes('-')) return new Date(dateStr); // YYYY-MM-DD
    if (dateStr.includes('/')) {
      const [d, m, y] = dateStr.split('/');
      return new Date(`${y}-${m}-${d}`); // DD/MM/YYYY to YYYY-MM-DD for parsing
    }
    return null;
  };

  const isWithinRange = (dateStr) => {
    const d = parseDate(dateStr);
    if (!d) return true; // Default to true if no date (fallback)
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    
    if (start && d < start) return false;
    if (end && d > end) return false;
    return true;
  };

  // 1. Data Aggregation for Metrics
  const metrics = useMemo(() => {
    const tasks = Object.values(store.tasks || {}).filter(t => isWithinRange(t.date));
    const opps = Object.values(store.oppTasks || {}).filter(o => isWithinRange(o.date));
    const contracts = Object.values(store.contracts || {}).filter(c => isWithinRange(c.effectiveDate || c.signedDate));

    const totalLeads = tasks.length;
    const totalOpps = opps.length;
    const totalContracts = contracts.length;
    
    const totalRevenue = contracts.reduce((sum, c) => {
      const val = parseInt((c.contractValue || '0').replace(/,/g, ''), 10);
      return sum + (isNaN(val) ? 0 : val);
    }, 0);

    return { totalLeads, totalOpps, totalContracts, totalRevenue };
  }, [store, startDate, endDate]);

  // 2. Tỷ lệ Khách hàng nội bộ vs Khách hàng ngoài
  const customerTypeData = useMemo(() => {
    const contracts = Object.values(store.contracts || {}).filter(c => isWithinRange(c.effectiveDate || c.signedDate));
    const counts = { 'Nội bộ': 0, 'Ngoài': 0 };
    contracts.forEach(c => {
      const type = c.classification === 'Nội bộ' ? 'Nội bộ' : 'Ngoài';
      counts[type]++;
    });
    return [
      { name: 'Khách hàng nội bộ', value: counts['Nội bộ'], color: '#EE0033' },
      { name: 'Khách hàng ngoài', value: counts['Ngoài'], color: '#3b82f6' }
    ];
  }, [store, startDate, endDate]);

  // 3. Tỷ lệ Sản phẩm/Dịch vụ
  const productDistributionData = useMemo(() => {
    const contracts = Object.values(store.contracts || {}).filter(c => isWithinRange(c.effectiveDate || c.signedDate));
    const counts = {
      'OmniX': 0,
      'KnowxHUB': 0,
      'Dịch vụ hỗ trợ khách hàng': 0,
      'Dịch vụ BPO': 0,
      'Khác': 0
    };

    contracts.forEach(c => {
      const name = (c.name || '').toLowerCase();
      if (name.includes('omnix')) counts['OmniX']++;
      else if (name.includes('knowxhub')) counts['KnowxHUB']++;
      else if (name.includes('bpo')) counts['Dịch vụ BPO']++;
      else if (name.includes('hỗ trợ') || name.includes('chăm sóc') || name.includes('cskh')) counts['Dịch vụ hỗ trợ khách hàng']++;
      else counts['Khác']++;
    });

    return Object.entries(counts)
      .filter(([_, value]) => value > 0)
      .map(([name, value], index) => ({
        name,
        value,
        color: COLORS[index % COLORS.length]
      }));
  }, [store, startDate, endDate]);

  // 4. Trạng thái Lead & CHKD (Pipeline)
  const pipelineStatusData = useMemo(() => {
    const leadCounts = {};
    const oppCounts = {};

    Object.values(store.tasks || {})
      .filter(t => isWithinRange(t.date))
      .forEach(t => {
        leadCounts[t.status] = (leadCounts[t.status] || 0) + 1;
      });

    Object.values(store.oppTasks || {})
      .filter(o => isWithinRange(o.date))
      .forEach(o => {
        oppCounts[o.status] = (oppCounts[o.status] || 0) + 1;
      });

    const allStatuses = Array.from(new Set([
      ...Object.keys(leadCounts),
      ...Object.keys(oppCounts)
    ])).filter(s => 
      s !== 'Thành công' && 
      s !== 'Không thành công' && 
      s !== 'Converted' && 
      s !== 'Lost' && 
      s !== 'Thua'
    );

    return allStatuses.map(status => ({
      status: status === 'New' ? 'Mới' : status,
      'Leads': leadCounts[status] || 0,
      'Cơ hội': oppCounts[status] || 0
    }));
  }, [store, startDate, endDate]);

  const fmtCurrency = (val) => {
    if (val >= 1000000000) return (val / 1000000000).toFixed(2) + ' tỷ VNĐ';
    if (val >= 1000000) return (val / 1000000).toFixed(0) + ' triệu VNĐ';
    return val.toLocaleString() + ' VNĐ';
  };

  const renderActiveShape = (props) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    return (
      <g>
        <Pie
          {...props}
          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
        />
      </g>
    );
  };

  return (
    <div className="report-dashboard-container">
      <div className="report-header">
        <div className="report-title-area">
          <h2>Báo cáo Dashboard Tổng quan</h2>
          <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>
            Dữ liệu tích lũy đến: {new Date().toLocaleDateString('vi-VN')}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
             <div className="filter-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', padding: '6px 16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
               <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Từ:</span>
               <input 
                 type="date"
                 value={startDate} 
                 onChange={(e) => setStartDate(e.target.value)}
                 style={{ border: 'none', outline: 'none', fontSize: '13px', fontWeight: 600, color: '#0f172a', background: 'transparent', cursor: 'pointer' }}
               />
               <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b', marginLeft: '8px' }}>Đến:</span>
               <input 
                 type="date"
                 value={endDate} 
                 onChange={(e) => setEndDate(e.target.value)}
                 style={{ border: 'none', outline: 'none', fontSize: '13px', fontWeight: 600, color: '#0f172a', background: 'transparent', cursor: 'pointer' }}
               />
             </div>
             <button className="dashboard-settings-btn"><TrendingUp size={16} /> Xuất báo cáo</button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Tổng số Lead</div>
          <div className="stat-value">{metrics.totalLeads}</div>
          <div style={{ color: '#16a34a', fontSize: '12px', fontWeight: 600 }}>
            <TrendingUp size={12} style={{ verticalAlign: 'middle', marginRight: 4 }}/> +8% tuần qua
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Cơ hội bán hàng</div>
          <div className="stat-value">{metrics.totalOpps}</div>
          <div style={{ color: '#3b82f6', fontSize: '12px', fontWeight: 600 }}>
             <Target size={12} style={{ verticalAlign: 'middle', marginRight: 4 }}/> Đang theo dõi
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Hợp đồng ký kết</div>
          <div className="stat-value">{metrics.totalContracts}</div>
          <div style={{ color: '#16a34a', fontSize: '12px', fontWeight: 600 }}>
             <ShieldCheck size={12} style={{ verticalAlign: 'middle', marginRight: 4 }}/> 92% hiệu lực
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Tổng Doanh thu (HĐ)</div>
          <div className="stat-value" style={{ fontSize: '22px' }}>{fmtCurrency(metrics.totalRevenue)}</div>
          <div style={{ color: '#EE0033', fontSize: '12px', fontWeight: 600 }}>
             Viettel CS XERP
          </div>
        </div>
      </div>

      <div className="charts-main-grid">
        {/* Pie 1: Customer Type */}
        <div className="chart-card">
          <div className="chart-title">
            <Users size={18} color="#EE0033" /> Tỷ lệ Khách hàng Nội bộ & Ngoài
          </div>
          <div className="chart-container-inner">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={customerTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {customerTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie 2: Product Distribution */}
        <div className="chart-card">
          <div className="chart-title">
            <Package size={18} color="#3b82f6" /> Tỷ lệ sản phẩm & dịch vụ đã bán
          </div>
          <div className="chart-container-inner">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={productDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={0}
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {productDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar: Pipeline Status */}
        <div className="chart-card full-width">
          <div className="chart-title">
            <Layers size={18} color="#f59e0b" /> Trạng thái Lead và CHKD theo phễu
          </div>
          <div className="chart-container-inner" style={{ minHeight: '350px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={pipelineStatusData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                    dataKey="status" 
                    angle={-45} 
                    textAnchor="end" 
                    interval={0} 
                    height={80}
                    tick={{ fontSize: 11, fill: '#64748b' }} 
                />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <RechartsTooltip cursor={{ fill: '#f1f5f9' }} />
                <Legend verticalAlign="top" height={36}/>
                <Bar dataKey="Leads" fill="#EE0033" radius={[4, 4, 0, 0]} barSize={24} />
                <Bar dataKey="Cơ hội" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDashboard;
