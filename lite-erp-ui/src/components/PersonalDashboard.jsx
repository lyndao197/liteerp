import React from 'react';
import { Settings, Clock, AlertCircle, TrendingUp, ChevronDown } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar
} from 'recharts';
import './PersonalDashboard.css';

const revenueData = [
  { name: '0', doanThu: 0, mucTieu: 300 },
  { name: '200', doanThu: 450, mucTieu: 400 },
  { name: '400', doanThu: 750, mucTieu: 600 },
  { name: '600', doanThu: 500, mucTieu: 700 },
  { name: '800', doanThu: 900, mucTieu: 800 },
];

const customerSegments = [
  { name: 'Khách hàng nội bộ', value: 65, color: '#ED0029' },
  { name: 'Khách hàng ngoài', value: 35, color: '#007EFF' }
];

const pipelineData = [
  { name: 'Tiếp xúc', value: 15 },
  { name: 'Triển khai hợp đồng', value: 30 },
  { name: 'PoC (nếu cần)', value: 18 },
  { name: 'Xây dựng phương án', value: 22 },
  { name: 'Báo giá', value: 45 },
  { name: 'Ký kết hợp đồng', value: 60 },
  { name: 'Thanh lý gia hạn', value: 40 }
];

const upcomingTasks = [
  { id: 1, title: "Lead \"Apex Dynamics\" ($450k) has been in 'Negotiation' phase for > 15 days.", priority: 'red', statusText: 'Quá hạn', assigned: 'Nguyễn Văn A' },
  { id: 2, title: "Lead \"Apex Dynamics\" ($450k) has been in 'Negotiation' phase for > 15 days.", priority: 'yellow', statusText: 'Đang làm', assigned: 'Nguyễn Văn B' },
  { id: 3, title: "Lead \"Apex Dynamics\" ($450k) has been in 'Negotiation' phase for > 15 days.", priority: 'gray', statusText: 'Chưa làm', assigned: 'Trần C' },
];

const CustomPipelineTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#fff', border: '1px solid #E5E7EB', padding: '10px', borderRadius: '4px', fontSize: '12px' }}>
        <p style={{ margin: 0, fontWeight: 600 }}>{payload[0].payload.name}</p>
        <p style={{ margin: 0 }}>{payload[0].value} deals</p>
      </div>
    );
  }
  return null;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#fff', border: '1px solid #EE0033', padding: '8px', borderRadius: '4px', fontSize: '12px', textAlign: 'center' }}>
        <div style={{ fontSize: '9px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Current Q3</div>
        <div style={{ fontSize: '12px', fontWeight: 700 }}>${payload[0].value}k</div>
      </div>
    );
  }
  return null;
};

function PersonalDashboard() {
  return (
    <div className="personal-dashboard-container">
      <div className="dashboard-header-title">
        <div className="dashboard-title-text">
          <h2>Tổng quan</h2>
          <p>DỰ BÁO DOANH THU QUÝ 4: 1,20 TỈ VNĐ</p>
        </div>
        <button className="dashboard-settings-btn">
          <Settings size={16} /> Tùy chỉnh Dashboard
        </button>
      </div>

      <div className="metrics-cards-grid">
        <div className="metric-card">
          <h3 className="metric-card-title">TỔNG SỐ CÔNG VIỆC</h3>
          <div className="metric-card-value-container">
            <p className="metric-card-val">488</p>
            <span className="metric-badge green">
              <TrendingUp size={12} /> +12%
            </span>
          </div>
        </div>

        <div className="metric-card">
          <h3 className="metric-card-title">ĐANG THỰC HIỆN</h3>
          <div className="metric-card-value-container">
            <p className="metric-card-val">324</p>
            <span className="metric-badge yellow">
              <TrendingUp size={12} /> +3%
            </span>
          </div>
        </div>

        <div className="metric-card">
          <h3 className="metric-card-title">ĐÃ HOÀN THÀNH</h3>
          <div className="metric-card-value-container">
            <p className="metric-card-val">250</p>
            <span className="metric-badge red">
              <TrendingUp size={12} style={{transform: 'scaleY(-1)'}}/> -12%
            </span>
          </div>
        </div>

        <div className="metric-card">
          <h3 className="metric-card-title">QUÁ HẠN/CẦN XỬ LÝ GẤP</h3>
          <div className="metric-card-value-container">
            <p className="metric-card-val">4</p>
            <span className="metric-badge gray">
              <span style={{marginRight: 4}}>-</span> 0%
            </span>
          </div>
        </div>
      </div>

      <div className="charts-row">
        <div className="sales-chart-card">
          <div className="sales-chart-header">
            <h3 className="sales-chart-title">Doanh thu & Mục tiêu</h3>
            <div className="sales-chart-filters">
              <div className="filter-dropdown">
                Tuần này <ChevronDown size={14} />
              </div>
              <div className="filter-icon-btn">
                <Settings size={14} />
              </div>
            </div>
          </div>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorDoanhThu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ED0029" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#ED0029" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{fontSize: 11, fill: '#666'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize: 11, fill: '#666'}} axisLine={false} tickLine={false} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="doanThu" stroke="#ED0029" strokeWidth={2} fillOpacity={1} fill="url(#colorDoanhThu)" />
                <Area type="monotone" dataKey="mucTieu" stroke="#64748B" strokeDasharray="5 5" fill="none" opacity={0.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="customer-segments-card">
          <h3 className="segment-title">Phân khúc khách hàng</h3>
          <div style={{ width: '100%', height: 160, display: 'flex', justifyContent: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={customerSegments}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {customerSegments.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="segment-legend">
            {customerSegments.map((seg, i) => (
              <div key={i} className="segment-legend-item">
                <div className="legend-label">
                  <div className="legend-dot" style={{ background: seg.color }}></div>
                  {seg.name}
                </div>
                <div className="legend-percent">{seg.value}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="todo-board">
        <div className="todo-header">
          <h3 className="todo-title">Việc cần làm hôm nay</h3>
          <span className="view-all-link">Xem tất cả</span>
        </div>
        <div className="todo-cards-row">
          <div className="todo-card">
            <p className="todo-card-title">Gọi điện khách hàng Viettel Mobile</p>
            <div className="todo-card-time"><Clock size={12}/> 10h20 AM</div>
            <span className="todo-card-priority">Ưu tiên</span>
          </div>
          <div className="todo-card">
            <p className="todo-card-title">Gửi báo giá cho FPT Software</p>
            <div className="todo-card-time"><Clock size={12}/> 11:30 AM</div>
            <span className="todo-card-priority">Ưu tiên</span>
          </div>
          <div className="todo-card">
            <p className="todo-card-title">Họp team review pipeline Q3</p>
            <div className="todo-card-time"><Clock size={12}/> 02:00 PM</div>
          </div>
          <div className="todo-card">
            <p className="todo-card-title">Follow up deal BIDV</p>
            <div className="todo-card-time"><Clock size={12}/> 04:00 PM</div>
          </div>
        </div>
      </div>

      <div className="bottom-row">
        <div className="pipeline-chart-card">
          <div className="pipeline-chart-header">
            <h3 className="pipeline-chart-title">Pipeline theo giai đoạn</h3>
            <div className="pipeline-chart-subtitle">
              Tổng: <strong>18.43 tỉ VND</strong> <span className="pipeline-chart-pipe">|</span> <strong>115</strong> deals
            </div>
          </div>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pipelineData} margin={{ top: 10, right: 0, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{fontSize: 10, fill: '#666'}} interval={0} axisLine={false} tickLine={false} width={80}  />
                <YAxis tick={{fontSize: 11, fill: '#666'}} axisLine={false} tickLine={false} />
                <RechartsTooltip content={<CustomPipelineTooltip />} cursor={{fill: 'rgba(0,0,0,0.05)'}} />
                <Bar dataKey="value" fill="#ED0029" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="upcoming-tasks-card">
          <h3 className="upcoming-title">Nhiệm vụ sắp tới hạn</h3>
          <div className="upcoming-list">
            {upcomingTasks.map((task, i) => (
              <div key={i} className="upcoming-item">
                <div className="upcoming-item-header">
                  <div className="upcoming-item-owner">
                    <AlertCircle size={14} color="#EE0033" /> {task.assigned}
                    <span className="todo-card-priority" style={{marginTop: 0}}>Ưu tiên</span>
                  </div>
                  <span className={`upcoming-item-status ${task.priority}`}>{task.statusText}</span>
                </div>
                <div className="upcoming-item-content">
                  {task.title}
                </div>
              </div>
            ))}
            <button className="upcoming-view-btn">Xem tất cả</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PersonalDashboard;
