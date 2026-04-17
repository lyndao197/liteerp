import React from 'react';
import { Settings, TrendingUp, TrendingDown, Minus, Clock, MoreHorizontal } from 'lucide-react';
import './Dashboard.css';

const pipelineData = [
  { label: 'Triển khai\nnghiệp vụ theo\nhợp đồng', value: 45, max: 60 },
  { label: 'Tiếp xúc\nkhách hàng', value: 45, max: 60 },
  { label: 'PoC\n(nếu cần)', value: 32, max: 60 },
  { label: 'Xây dựng\nphương án\nthực hiện', value: 32, max: 60 },
  { label: 'Báo giá', value: 18, max: 60 },
  { label: 'Đánh giá\nnhu cầu\nkhách hàng', value: 18, max: 60 },
  { label: 'Ký kết\nhợp đồng', value: 12, max: 60 },
  { label: 'Thanh lý gia\nhạn hợp\nđồng', value: 12, max: 60 }
];

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>Tổng quan</h1>
          <p>DỰ BÁO DOANH THU QUÝ 4: 1,20 TỈ VNĐ</p>
        </div>
        <button className="btn-outline">
          <Settings size={16} /> Tùy chỉnh Dashboard
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-title">TỔNG SỐ CÔNG VIỆC</div>
          <div className="stat-card-val">
            488
            <div className="stat-trend trend-up"><TrendingUp size={14} /> +12%</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-title">ĐANG THỰC HIỆN</div>
          <div className="stat-card-val">
            324
            <div className="stat-trend trend-warning"><TrendingUp size={14} /> +3%</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-title">ĐÃ HOÀN THÀNH</div>
          <div className="stat-card-val">
            250
            <div className="stat-trend trend-down"><TrendingDown size={14} /> -12%</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-title">QUÁ HẠN/CẦN XỬ LÝ GẤP</div>
          <div className="stat-card-val">
            4
            <div className="stat-trend trend-neutral"><Minus size={14} /> 0%</div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="charts-row-1">
        {/* Doanh thu Chart */}
        <div className="chart-card">
          <div className="chart-card-header" style={{ marginBottom: '10px' }}>
            <div className="chart-card-title">Doanh thu & Mục tiêu</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <select className="mock-select"><option>Hàng tháng</option></select>
              <button className="btn-outline" style={{ padding: '4px 8px' }}><Settings size={14} /></button>
            </div>
          </div>
          
          <div style={{ position: 'relative', height: '240px', width: '100%', marginTop: '20px' }}>
            {/* Y axis Labels */}
            <div style={{ position: 'absolute', left: '-10px', top: 0, bottom: '20px', width: '30px', borderRight: '1px solid #e2e8f0', paddingRight: '8px', zIndex: 10, fontSize: '11px', color: '#94a3b8' }}>
               <span style={{ position: 'absolute', top: 0, right: '8px', transform: 'translateY(-50%)' }}>800</span>
               <span style={{ position: 'absolute', top: '25%', right: '8px', transform: 'translateY(-50%)' }}>600</span>
               <span style={{ position: 'absolute', top: '50%', right: '8px', transform: 'translateY(-50%)' }}>400</span>
               <span style={{ position: 'absolute', top: '75%', right: '8px', transform: 'translateY(-50%)' }}>200</span>
               <span style={{ position: 'absolute', bottom: 0, right: '8px', transform: 'translateY(50%)' }}>0</span>
            </div>
            
            {/* Chart Canvas */}
            <div style={{ marginLeft: '20px', height: '100%', position: 'relative' }}>
               {/* Horizontal Dotted lines */}
               <div style={{position: 'absolute', top: 0, width: '100%', borderBottom: '1px dotted #cbd5e1'}}></div>
               <div style={{position: 'absolute', top: '25%', width: '100%', borderBottom: '1px dotted #cbd5e1'}}></div>
               <div style={{position: 'absolute', top: '50%', width: '100%', borderBottom: '1px dotted #cbd5e1'}}></div>
               <div style={{position: 'absolute', top: '75%', width: '100%', borderBottom: '1px dotted #cbd5e1'}}></div>
               <div style={{position: 'absolute', bottom: '20px', width: '100%', borderBottom: '1px solid #94a3b8'}}></div>
               
               {/* Chart SVG */}
               <svg style={{width:'100%', height:'calc(100% - 20px)', position: 'absolute', bottom: '20px', left: 0, overflow: 'visible'}} preserveAspectRatio="none" viewBox="0 0 700 100">
                  <defs>
                    <linearGradient id="gradientArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(227, 43, 76, 0.2)" />
                      <stop offset="100%" stopColor="rgba(227, 43, 76, 0.02)" />
                    </linearGradient>
                  </defs>
                  
                  {/* Vertical Dotted Lines mapping 0 to 700 */}
                  {Array.from({length: 8}).map((_, i) => (
                    <line key={i} x1={i * 100} y1="0" x2={i * 100} y2="100" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="2,2" />
                  ))}

                  {/* Goal dashed line (faint behind) */}
                  <path d="M0,48 C50,48 50,53 100,53 C150,53 150,38 200,38 C250,38 250,44 300,44 C350,44 350,23 400,23 C450,23 450,28 500,28 C550,28 550,11 600,11 C650,11 650,13 700,13" fill="none" stroke="#64748b" strokeWidth="1.2" strokeDasharray="4,4" opacity="0.6" />

                  {/* Fill Area */}
                  <path d="M0,47.5 C50,47.5 50,52.5 100,52.5 C150,52.5 150,37.5 200,37.5 C250,37.5 250,43.75 300,43.75 C350,43.75 350,22.5 400,22.5 C450,22.5 450,27.5 500,27.5 C550,27.5 550,10 600,10 C650,10 650,12.5 700,12.5 L700,100 L0,100 Z" fill="url(#gradientArea)" />
                  
                  {/* Revenue Line */}
                  <path d="M0,47.5 C50,47.5 50,52.5 100,52.5 C150,52.5 150,37.5 200,37.5 C250,37.5 250,43.75 300,43.75 C350,43.75 350,22.5 400,22.5 C450,22.5 450,27.5 500,27.5 C550,27.5 550,10 600,10 C650,10 650,12.5 700,12.5" fill="none" stroke="#e32b4c" strokeWidth="2" strokeLinejoin="round" />
                  
                  {/* Data Points */}
                  <circle cx="0" cy="47.5" r="3" fill="white" stroke="#e32b4c" strokeWidth="1.5" />
                  <circle cx="100" cy="52.5" r="3.5" fill="#e32b4c" />
                  <circle cx="200" cy="37.5" r="3.5" fill="#e32b4c" />
                  <circle cx="300" cy="43.75" r="3.5" fill="#e32b4c" />
                  <circle cx="400" cy="22.5" r="3.5" fill="#e32b4c" />
                  <circle cx="500" cy="27.5" r="3.5" fill="#e32b4c" />
                  <circle cx="600" cy="10" r="3.5" fill="#e32b4c" />
                  <circle cx="700" cy="12.5" r="3.5" fill="#e32b4c" />
               </svg>

               {/* Tooltip at T3 (x: 2/7 = 28.57%) */}
               <div style={{position: 'absolute', left: '28.57%', top: '6%', transform: 'translateX(-50%)', background: 'white', border: '1px solid #e32b4c', padding: '6px 10px', borderRadius: '4px', textAlign: 'center', zIndex: 15, boxShadow: '0 2px 4px rgba(227,43,76,0.1)'}}>
                  <div style={{fontSize: '9px', color: '#64748b', fontWeight: 700, marginBottom: '2px', textTransform: 'uppercase'}}>DOANH THU T3</div>
                  <div style={{fontSize: '11px', fontWeight: 800, color: '#1e293b'}}>500 triệu VNĐ</div>
                  {/* Caret */}
                  <div style={{position: 'absolute', bottom: '-5px', left: '50%', transform: 'translateX(-50%) rotate(45deg)', width: '8px', height: '8px', background: 'white', borderBottom: '1px solid #e32b4c', borderRight: '1px solid #e32b4c'}}></div>
               </div>

               {/* X axis labels */}
               <div style={{ position: 'absolute', bottom: 0, width: '100%', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8' }}>
                 <span>T1</span><span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span><span>T7</span><span>T8</span>
               </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center', marginTop: '16px', fontSize: '11px', color: '#64748b' }}>
            <div style={{width: '8px', height: '8px', borderRadius: '50%', background: '#e32b4c'}}></div> Doanh thu
          </div>
        </div>

        {/* Donut Chart */}
        <div className="chart-card">
          <div className="chart-card-title" style={{marginBottom: '20px'}}>Phân khúc khách hàng</div>
          
          {/* SVG Donut */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, marginBottom: '30px' }}>
            <svg width="140" height="140" viewBox="0 0 140 140" style={{transform: 'rotate(-90deg)'}}>
               {/* 35% Red */}
               <circle r="50" cx="70" cy="70" fill="none" stroke="#e32b4c" strokeWidth="20" strokeDasharray="314" strokeDashoffset="204" />
               {/* 45% Green */}
               <circle r="50" cx="70" cy="70" fill="none" stroke="#16a34a" strokeWidth="20" strokeDasharray="314" strokeDashoffset="172" style={{transform: 'rotate(126deg)', transformOrigin: 'center'}} />
               {/* 20% Blue */}
               <circle r="50" cx="70" cy="70" fill="none" stroke="#3b82f6" strokeWidth="20" strokeDasharray="314" strokeDashoffset="251" style={{transform: 'rotate(288deg)', transformOrigin: 'center'}} />
            </svg>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}><div style={{width: '8px', height: '8px', borderRadius: '50%', background: '#e32b4c'}}></div> Doanh nghiệp</div>
              <strong style={{color: '#1e293b'}}>35%</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}><div style={{width: '8px', height: '8px', borderRadius: '50%', background: '#16a34a'}}></div> Doanh nghiệp vừa và nhỏ</div>
              <strong style={{color: '#1e293b'}}>45%</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}><div style={{width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6'}}></div> Công ty khởi nghiệp</div>
              <strong style={{color: '#1e293b'}}>20%</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Tasks List */}
      <div className="tasks-today-card">
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
           <div className="chart-card-title">Việc cần làm hôm nay</div>
           <a href="#" className="view-all-link" style={{margin: 0}}>Xem tất cả</a>
         </div>
         
         <div className="tasks-horizontal-list">
           <div className="task-cube">
             <div className="task-cube-title">Gọi điện khách hàng Viettel Mobile</div>
             <div className="task-cube-time"><Clock size={12} /> 10h20 AM</div>
             <div className="badge-priority">Ưu tiên</div>
           </div>
           
           <div className="task-cube">
             <div className="task-cube-title">Gửi báo giá cho FPT Software</div>
             <div className="task-cube-time"><Clock size={12} /> 11:30 AM</div>
             <div className="badge-priority">Ưu tiên</div>
           </div>

           <div className="task-cube">
             <div className="task-cube-title">Họp team review pipeline Q3</div>
             <div className="task-cube-time"><Clock size={12} /> 02:00 PM</div>
           </div>

           <div className="task-cube">
             <div className="task-cube-title">Follow up deal BIDV</div>
             <div className="task-cube-time"><Clock size={12} /> 04:00 PM</div>
           </div>
         </div>
      </div>

      {/* Charts Row 2 */}
      <div className="charts-row-2">
        
        {/* Bar chart: Pipeline */}
        <div className="chart-card">
           <div className="chart-card-header" style={{ marginBottom: 0 }}>
             <div className="chart-card-title">Pipeline theo giai đoạn</div>
             <div style={{ fontSize: '12px', color: '#64748b' }}>
               Tổng: <strong style={{color: '#1e293b'}}>18.43 tỉ VNĐ</strong> &nbsp;|&nbsp; <strong style={{color: '#1e293b'}}>115</strong> deals
             </div>
           </div>

           <div className="bar-chart-area" style={{ position: 'relative', marginTop: '20px', height: '240px' }}>
             {/* Y-axis Labels */}
             <div className="bar-y-axis" style={{ position: 'absolute', left: '-10px', top: 0, bottom: '30px', width: '30px', borderRight: '1px solid #e2e8f0', paddingRight: '8px', zIndex: 10 }}>
                <span style={{ position: 'absolute', top: 0, right: '8px', transform: 'translateY(-50%)' }}>60</span>
                <span style={{ position: 'absolute', top: '25%', right: '8px', transform: 'translateY(-50%)' }}>45</span>
                <span style={{ position: 'absolute', top: '50%', right: '8px', transform: 'translateY(-50%)' }}>30</span>
                <span style={{ position: 'absolute', top: '75%', right: '8px', transform: 'translateY(-50%)' }}>15</span>
                <span style={{ position: 'absolute', bottom: 0, right: '8px', transform: 'translateY(50%)' }}>0</span>
             </div>
             
             <div style={{ flex: 1, position: 'relative', height: '100%', paddingBottom: '30px', marginLeft: '20px' }}>
                {/* Horizontal Grid lines */}
                <div style={{ position: 'absolute', top: 0, width: '100%', borderBottom: '1px dashed #e2e8f0' }}></div>
                <div style={{ position: 'absolute', top: '25%', width: '100%', borderBottom: '1px dashed #e2e8f0' }}></div>
                <div style={{ position: 'absolute', top: '50%', width: '100%', borderBottom: '1px dashed #e2e8f0' }}></div>
                <div style={{ position: 'absolute', top: '75%', width: '100%', borderBottom: '1px dashed #e2e8f0' }}></div>
                <div style={{ position: 'absolute', bottom: '30px', width: '100%', borderBottom: '1px solid #94a3b8' }}></div>

                <div style={{ position: 'absolute', top: 0, bottom: '30px', left: 0, right: 0, display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', padding: '0 10px' }}>
                  {pipelineData.map((item, index) => {
                    const heightPercent = (item.value / item.max) * 100;
                    return (
                      <div className="bar-item" key={index} style={{ height: '100%', justifyContent: 'flex-end' }}>
                         <div style={{ position: 'absolute', bottom: `${heightPercent}%`, marginBottom: '6px', fontSize: '11px', fontWeight: 700, color: '#e32b4c' }}>{item.value}</div>
                         <div className="bar-fill" style={{ height: `${heightPercent}%`, width: '100%', maxWidth: '40px' }}></div>
                         <div className="bar-label" style={{ position: 'absolute', top: '100%', paddingTop: '8px', whiteSpace: 'pre-line' }}>{item.label}</div>
                      </div>
                    );
                  })}
                </div>
             </div>
           </div>
        </div>

        {/* Vertical Tasks: Nhiệm vụ sắp tới hạn */}
        <div className="chart-card">
          <div className="chart-card-title" style={{marginBottom: '20px'}}>Nhiệm vụ sắp tới hạn</div>
          
          <div className="tasks-vertical-list">
             <div className="vertical-task-item">
               <div className="v-task-title-row">
                 <div className="v-task-title">Xử lý hồ sơ cho khách hàng Vietcombank</div>
                 <div className="badge-priority">Ưu tiên</div>
               </div>
               <div className="v-task-desc">Hoàn thành giao dịch và ký hợp đồng với đối tác báo mật công việc</div>
               <div className="v-task-due" style={{color: '#ef4444'}}>Còn 1 giờ</div>
             </div>

             <div className="vertical-task-item">
               <div className="v-task-title-row">
                 <div className="v-task-title">Xử lý hồ sơ cho khách hàng Vietcombank</div>
                 <div className="badge-priority">Ưu tiên</div>
               </div>
               <div className="v-task-desc">Hoàn thành giao dịch và ký hợp đồng với đối tác báo mật công việc</div>
               <div className="v-task-due" style={{color: '#d97706'}}>Còn 2 ngày</div>
             </div>

             <div className="vertical-task-item">
               <div className="v-task-title-row">
                 <div className="v-task-title">Xử lý hồ sơ cho khách hàng Vietcombank</div>
                 <div className="badge-priority">Ưu tiên</div>
               </div>
               <div className="v-task-desc">Hoàn thành giao dịch và ký hợp đồng với đối tác báo mật công việc</div>
               <div className="v-task-due" style={{color: '#64748b'}}>Còn 2 tuần</div>
             </div>
          </div>
          
          <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
            <a href="#" className="view-all-link" style={{color: '#334155'}}>Xem tất cả</a>
          </div>
        </div>

      </div>
    </div>
  );
};

const styles = {
  dashedLine: {
    position: 'absolute',
    width: '100%',
    height: '1px',
    borderBottom: '1px dashed #e2e8f0',
    left: '-15px', 
    width: 'calc(100% + 30px)' // Extend slightly outside item
  }
};

export default Dashboard;
