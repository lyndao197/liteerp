import React, { useState } from 'react';
import './KpiSlaBlock.css';

// --- DỮ LIỆU KPI (từ PL II - Sheet CSKH) ---
const INITIAL_KPI_DATA = [
    { id: 'total', stt: '', name: 'CHẤT LƯỢNG CHĂM SÓC KHÁCH HÀNG', isGroup: true, isTotal: true, dienGiai: '', kpisYeuCau: '', cachTinh: '', diemChuan: 100, result: { kpisDat: '', diem: '', ghiChu: '' } },
    { id: 'g1',    stt: 'I',  name: 'CHẤT LƯỢNG TỔNG ĐÀI',           isGroup: true, isTotal: false, dienGiai: '', kpisYeuCau: '', cachTinh: '', diemChuan: 60,  result: { kpisDat: '', diem: '', ghiChu: '' } },
    { id: 'r1', stt: '1', name: 'Tỷ lệ kết nối Hotline', isGroup: false, dienGiai: '=(Số lượng KH kết nối thành công + cuộc gọi nhỡ gọi lại trong 15 phút / Tổng cuộc gọi vào hàng đợi)*100%', kpisYeuCau: '100%',           cachTinh: '- Hoàn thành = 100% đạt: 40 điểm\n- Hoàn thành <100%: Điểm đạt = 40-(100%-KQ đạt)*2',                                                  diemChuan: 40, result: { kpisDat: '', diem: '', ghiChu: '' } },
    { id: 'r2', stt: '2', name: 'Năng suất cuộc gọi',                  isGroup: false, dienGiai: 'Tổng cuộc gọi nhận vào của 1 nhân viên trên 1 ca làm việc',                                        kpisYeuCau: '150 cuộc/Agent/ca', cachTinh: '- Hoàn thành ≥100% KPIs: Điểm đạt = Điểm chuẩn\n- Hoàn thành <100% KPIs: Điểm đạt * tỷ lệ hoàn thành',                             diemChuan: 15, result: { kpisDat: '', diem: '', ghiChu: '' } },
    { id: 'r3', stt: '3', name: 'Tỷ lệ tiếp cận KH call out',          isGroup: false, dienGiai: '= (Số KH tiếp nhận cuộc gọi call out / Số lượng cuộc gọi call out)',                               kpisYeuCau: '70%',            cachTinh: '- Hoàn thành ≥100% KPIs: Điểm đạt = Điểm chuẩn\n- Hoàn thành <100% KPIs: Điểm đạt * tỷ lệ hoàn thành',                             diemChuan: 5,  result: { kpisDat: '', diem: '', ghiChu: '' } },
    { id: 'g2',    stt: 'II', name: 'ĐÁNH GIÁ CHẤT LƯỢNG CHUNG',       isGroup: true, isTotal: false, dienGiai: '', kpisYeuCau: '', cachTinh: '', diemChuan: 40,  result: { kpisDat: '', diem: '', ghiChu: '' } },
    { id: 'r4', stt: '4', name: 'Tỷ lệ KH hài lòng',                   isGroup: false, dienGiai: '=(Số lượng KH hài lòng / Tổng trường hợp KH tham gia đánh giá)*100',                               kpisYeuCau: '95%',            cachTinh: '- Hoàn thành ≥100% KPIs: Điểm đạt = 10\n- Hoàn thành <95% KPIs: Điểm đạt = (KQ đạt/95%)*10',                                         diemChuan: 10, result: { kpisDat: '', diem: '', ghiChu: '' } },
    { id: 'r5', stt: '5', name: 'Vi phạm ý thức, thái độ, trách nhiệm',isGroup: false, dienGiai: 'Khiếu nại của KH/VCC đánh giá cuộc gọi và chốt do lỗi của ĐTV',                                   kpisYeuCau: '0 TH',           cachTinh: '- Trừ điểm theo số TH vi phạm\n=> Trừ 1 điểm/TH vi phạm + Bồi thường thiệt hại (nếu có)',                                           diemChuan: 5,  result: { kpisDat: '', diem: '', ghiChu: '' } },
    { id: 'r6', stt: '6', name: 'Khiếu nại / Đánh giá nghiệp vụ',      isGroup: false, dienGiai: 'Khiếu nại của KH/VCC đánh giá cuộc gọi và chốt do lỗi của ĐTV',                                   kpisYeuCau: '0 TH',           cachTinh: '- Trừ điểm theo số TH vi phạm\n=> Trừ 1 điểm/TH vi phạm',                                                                          diemChuan: 5,  result: { kpisDat: '', diem: '', ghiChu: '' } },
    { id: 'r7', stt: '7', name: 'Vi phạm bảo mật thông tin',            isGroup: false, dienGiai: 'Vi phạm bảo mật',                                                                                   kpisYeuCau: '0 TH',           cachTinh: '- Trừ điểm theo số TH vi phạm\n=> Trừ 2 điểm/1 TH vi phạm + Bồi thường thiệt hại (nếu có)',                                          diemChuan: 5,  result: { kpisDat: '', diem: '', ghiChu: '' } },
    { id: 'r8', stt: '8', name: 'Tỷ lệ thống kê cuộc gọi (phiếu ghi)', isGroup: false, dienGiai: '= Số lượng thống kê cg / Tổng cuộc gọi',                                                           kpisYeuCau: '95%',            cachTinh: '- Hoàn thành ≥100% KPIs: Điểm đạt = Điểm chuẩn\n- Hoàn thành <100% KPIs: Điểm đạt * tỷ lệ hoàn thành',                             diemChuan: 10, result: { kpisDat: '', diem: '', ghiChu: '' } },
    { id: 'r9', stt: '9', name: 'Đảm bảo thời gian làm việc / ca',      isGroup: false, dienGiai: '=(Tổng công đảm bảo thời gian làm việc theo yêu cầu / Tổng Số công thực tế vận hành)*100',         kpisYeuCau: '95%',            cachTinh: '- Hoàn thành ≥100% KPIs: Điểm đạt = Điểm chuẩn\n- Hoàn thành <100% KPIs: Điểm đạt * tỷ lệ hoàn thành',                             diemChuan: 5,  result: { kpisDat: '', diem: '', ghiChu: '' } },
];

// --- MOCK DATA SLA (Thứ tự chuẩn từ file Excel) ---
const INITIAL_SLA_DATA = [
    // TỔNG ĐIỂM
    {
        id: 's_total', index: '', isGroup: true, isTotal: true,
        name: 'TỔNG ĐIỂM:',
        requirement: '',
        method: '',
        target: 'Điểm tối đa: 100\n- Từ 95-100 điểm: Không trừ phí\n- Từ 90 - <95 điểm: Trừ 0.2% phí thanh toán/01 điểm trừ dưới ngưỡng 95 điểm\n- Từ 80 - <90 điểm: Trừ 0.3% chi phí thanh toán/01 điểm trừ dưới ngưỡng 95 điểm\n- Từ 70 - <80 điểm: Trừ 0.5% chi phí thanh toán/01 điểm trừ dưới ngưỡng 95 điểm\n- Từ 65 - <70 điểm: Trừ 1% chi phí thanh toán/01 điểm trừ dưới ngưỡng 95 điểm\n- Dưới 65 điểm: Trừ 8% chi phí thanh toán/hợp đồng',
        evaluations: { weight: '100%', score: '86', note: '' }
    },
    // NHÓM A
    {
        id: 's_a', index: 'A', isGroup: true,
        name: 'ĐẢM BẢO CÁC CHỈ TIÊU KPI VỀ CHẤT LƯỢNG PHỤC VỤ KHÁCH HÀNG',
        requirement: '', method: '',
        target: '70',
        evaluations: { weight: '70%', score: '70', note: '' }
    },
    {
        id: 's_a1', index: '1', isGroup: false,
        name: 'Số lượng các chỉ tiêu KPI đạt trong kỳ đánh giá',
        requirement: 'VCX tổ chức thực hiện, điều hành đảm bảo các KPI về CLPV theo phụ lục II',
        method: 'Số chỉ tiêu KPI đạt /tổng số KPI đánh giá trong tháng',
        target: '- KPI đạt >= 95% => Điểm = 100% Quỹ điểm.\n- 95% > KPI đạt >= 85% => Điểm = 80%*Quỹ điểm.\n- 85% > KPI đạt >= 75% => Điểm = 70%*Quỹ điểm.\n- 75% > KPI đạt >= 65% => Điểm = 60%*Quỹ điểm.\n- 65% > KPI đạt >= 50% => Điểm = 50%*Quỹ điểm.\n- 50% > KPI đạt => Điểm = 10%*Quỹ điểm.',
        evaluations: { weight: '', score: '56', note: '86.8' }
    },
    // NHÓM B
    {
        id: 's_b', index: 'B', isGroup: true,
        name: 'CAM KẾT VỀ BẢO MẬT THÔNG TIN, CƠ SỞ DỮ LIỆU KHÁCH HÀNG',
        requirement: '', method: '',
        target: '20',
        evaluations: { weight: '20%', score: '20', note: '' }
    },
    {
        id: 's_b1', index: '1', isGroup: false,
        name: 'Bảo mật về thông tin, cơ sở dữ liệu của VCC',
        requirement: '- VCX cam kết về việc bảo mật các tài liệu về sản phẩm dịch vụ, cơ sở dữ liệu Khách hàng, phản ánh khách hàng của VCC.\n- Không sử dụng thông tin, tài liệu, CSDL của VCC cho các mục đích khác ngoài phạm vi của thỏa thuận nếu chưa có sự trao đổi và đồng ý của VCC.',
        method: 'Theo thực tế phát sinh',
        target: '- Không vi phạm => Điểm = 100% quỹ điểm.\n- Trừ 0,5 điểm/1 lần vi phạm',
        evaluations: { weight: '', score: '20', note: '' }
    },
    // NHÓM C
    {
        id: 's_c', index: 'C', isGroup: true,
        name: 'CÔNG TÁC PHỐI HỢP GIỮA VCX VÀ VCC',
        requirement: '', method: '',
        target: '10',
        evaluations: { weight: '10%', score: '10', note: '' }
    },
    {
        id: 's_c1', index: '1', isGroup: false,
        name: 'Thông báo kịp thời khi có sự cố phát sinh đối với các SPDV của VCC',
        requirement: '- Thông báo cho đầu mối CSKH của VCC trong vòng 30 phút ngay sau khi có sự cố hoặc nghi ngờ có sự cố phát sinh đối với các sản phẩm, dịch vụ của VCC.\n- Đầu mối nhận thông tin:\n+ Hotline: 18009377/Group zalo: DVKH - VCC\n+ Email: huyenptt16, huyendtn5',
        method: '',
        target: '- Trừ 01 điểm/1 lần vi phạm thông báo sự cố phát sinh theo quy định.',
        evaluations: { weight: '', score: '', note: '' }
    },
    {
        id: 's_c2', index: '2', isGroup: false,
        name: 'Báo cáo chất lượng giải đáp Tổng đài, tình hình tiếp nhận cuộc gọi theo tuần/tháng.',
        requirement: '+ Thời gian gửi: đối với báo cáo tuần: trước 12h thứ 3 hàng tuần; đối với báo cáo tháng: trước 12 ngày 03 tháng N+1\n+ Nội dung báo cáo: chất lượng giải đáp tại các kênh, tồn tại, hạn chế, biện pháp khắc phục',
        method: '',
        target: '- Trừ 0,1 điểm/1 lần không gửi báo cáo theo quy định',
        evaluations: { weight: '', score: '', note: '' }
    },
    {
        id: 's_c3', index: '3', isGroup: false,
        name: 'Công tác đảm bảo seats cho CSKH',
        requirement: 'Trừ trên tổng điểm khi có vi phạm: Trừ 1điểm/1% seats thiếu so với hợp đồng hoặc theo yêu cầu của VCC\nVới ngày Lễ Tết: Trừ 2 điểm/1 seats thiếu ngày Lễ so với yêu cầu',
        method: '',
        target: 'Trừ trên tổng điểm khi có vi phạm: Trừ 1điểm/1% seats thiếu so với hợp đồng hoặc theo yêu cầu của VCC\nVới ngày Lễ Tết: Trừ 2 điểm/1 seats thiếu ngày Lễ so với yêu cầu',
        evaluations: { weight: '', score: '', note: '' }
    },
    {
        id: 's_c4', index: '4', isGroup: false,
        name: 'Các sự vụ/trường hợp khác',
        requirement: '- Là những trường hợp phát sinh khác.',
        method: '',
        target: '- Cộng/Trừ điểm trên tổng điểm (theo mức độ ảnh hưởng thực tế trong công tác phối hợp hoặc mức độ lỗi phát hiện trong quá trình kiểm soát điều hành)',
        evaluations: { weight: '', score: '', note: '' }
    }
];

const STATUS_STEPS = [
    { id: 'moi_tao', label: 'Mới tạo' },
    { id: 'gui_kh', label: 'Gửi KH Confirm' },
    { id: 'cho_kh', label: 'Chờ KH Confirm' },
    { id: 'kh_duyet', label: 'KH đã confirm' }
];

export default function KpiSlaBlock({ isReadOnly: globalReadOnly = false }) {
    const [activeTab, setActiveTab] = useState('SLA');
    
    // --- STATE ---
    const [kpiData, setKpiData] = useState(INITIAL_KPI_DATA);
    const [slaData, setSlaData] = useState(INITIAL_SLA_DATA);
    
    // Trạng thái chung của toàn bộ form nghiệm thu
    const [currentStatusId, setCurrentStatusId] = useState('moi_tao');

    // --- HANDLERS ---
    const handleEvalChange = (tab, rowId, field, value) => {
        if (currentStatusId !== 'moi_tao') return;

        if (tab === 'SLA') {
            setSlaData(prev => prev.map(row =>
                row.id === rowId ? { ...row, evaluations: { ...row.evaluations, [field]: value } } : row
            ));
        }
    };

    const handleKpiChange = (rowId, field, value) => {
        if (currentStatusId !== 'moi_tao') return;
        setKpiData(prev => prev.map(row =>
            row.id === rowId
                ? { ...row, result: { ...row.result, [field]: value } }
                : row
        ));
    };

    const handleNextStatus = () => {
        const currentIndex = STATUS_STEPS.findIndex(s => s.id === currentStatusId);
        if (currentIndex < STATUS_STEPS.length - 1) {
            setCurrentStatusId(STATUS_STEPS[currentIndex + 1].id);
        }
    };

    // --- RENDER HELPERS ---
    const renderStatusBar = () => {
        const currentIndex = STATUS_STEPS.findIndex(s => s.id === currentStatusId);
        
        // Xác định nhãn của button tương ứng với trạng thái
        let actionBtnText = '';
        if (currentStatusId === 'moi_tao') actionBtnText = 'Gửi KH Confirm';
        else if (currentStatusId === 'gui_kh') actionBtnText = 'Xác nhận Đã gửi';
        else if (currentStatusId === 'cho_kh') actionBtnText = 'KH Đã Confirm';

        return (
            <div className="status-bar-container">
                <div className="status-steps-wrapper">
                    <div className="status-steps">
                        {STATUS_STEPS.map((step, index) => {
                            const isActive = index === currentIndex;
                            const isCompleted = index < currentIndex;
                            
                            let circleClass = 'status-circle';
                            if (isActive) circleClass += ' active';
                            else if (isCompleted) circleClass += ' completed';

                            return (
                                <React.Fragment key={step.id}>
                                    <div className="status-step-item">
                                        <div className={circleClass}>{index + 1}</div>
                                        <div className={`status-label ${isActive ? 'active-label' : ''}`}>{step.label}</div>
                                    </div>
                                    {index < STATUS_STEPS.length - 1 && (
                                        <div className={`status-line ${isCompleted ? 'completed-line' : ''}`}></div>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>
                
                {/* Button Action */}
                {!globalReadOnly && actionBtnText && (
                    <div className="status-action-box">
                        <button className="btn-status-action" onClick={handleNextStatus}>
                            {actionBtnText}
                        </button>
                    </div>
                )}
            </div>
        );
    };

    const renderKpiTable = () => {
        const isLocked = currentStatusId !== 'moi_tao';
        const LEFT = { stt: 0, name: 40, dienGiai: 290, kpisYeuCau: 490, cachTinh: 690, diemChuan: 890 };

        return (
            <div className="tab-content">
                <div className="kpi-table-container">
                    <table className="kpi-block-table" style={{ minWidth: '1100px' }}>
                        <thead>
                            <tr>
                                <th colSpan="6" className="freeze-col"
                                    style={{ background: '#e2e8f0', textAlign: 'center', left: LEFT.stt }}>
                                    CHỈ TIÊU KPI GỐC (TỪ HỢP ĐỒNG)
                                </th>
                                <th colSpan="3"
                                    style={{ background: '#e2e8f0', textAlign: 'center', borderLeft: '2px solid #94a3b8' }}>
                                    KẾT QUẢ NGHIỆM THU
                                </th>
                            </tr>
                            <tr>
                                <th className="freeze-col" style={{ width: 40,  left: LEFT.stt,        textAlign: 'center' }}>STT</th>
                                <th className="freeze-col" style={{ width: 250, left: LEFT.name,       minWidth: 250 }}>NỘI DUNG ĐÁNH GIÁ</th>
                                <th className="freeze-col" style={{ width: 200, left: LEFT.dienGiai,   minWidth: 200 }}>DIỄN GIẢI / THÔNG TIN</th>
                                <th className="freeze-col" style={{ width: 200, left: LEFT.kpisYeuCau, minWidth: 200 }}>KPIs YÊU CẦU</th>
                                <th className="freeze-col" style={{ width: 200, left: LEFT.cachTinh,   minWidth: 200 }}>CÁCH THỨC TÍNH ĐIỂM</th>
                                <th className="freeze-col" style={{ width: 80,  left: LEFT.diemChuan,  textAlign: 'center', borderRight: '2px solid #94a3b8' }}>ĐIỂM CHUẨN</th>
                                <th style={{ width: 140, textAlign: 'center', borderLeft: '2px solid #94a3b8' }}>KPIs đạt được</th>
                                <th style={{ width: 80,  textAlign: 'center' }}>Điểm</th>
                                <th style={{ width: 160, textAlign: 'center' }}>Ghi chú</th>
                            </tr>
                        </thead>
                        <tbody>
                            {kpiData.map(row => {
                                const isTotal = row.isTotal;
                                const isGrp   = row.isGroup;
                                const fw      = (isTotal || isGrp) ? 'bold' : 'normal';
                                const bgCell  = isTotal ? '#f1f5f9' : isGrp ? '#f8fafc' : '#fff';

                                return (
                                    <tr key={row.id} style={{ background: bgCell, fontWeight: fw }}>
                                        <td className="freeze-col" style={{ left: LEFT.stt,        textAlign: 'center', background: bgCell }}>{row.stt}</td>
                                        <td className="freeze-col" style={{ left: LEFT.name,       background: bgCell, fontWeight: fw }}>{row.name}</td>
                                        <td className="freeze-col" style={{ left: LEFT.dienGiai,   background: bgCell, whiteSpace: 'pre-wrap', fontSize: 12 }}>{row.dienGiai}</td>
                                        <td className="freeze-col" style={{ left: LEFT.kpisYeuCau, background: bgCell, textAlign: 'center' }}>{row.kpisYeuCau}</td>
                                        <td className="freeze-col" style={{ left: LEFT.cachTinh,   background: bgCell, whiteSpace: 'pre-wrap', fontSize: 12 }}>{row.cachTinh}</td>
                                        <td className="freeze-col" style={{ left: LEFT.diemChuan,  background: bgCell, textAlign: 'center', fontWeight: 'bold', borderRight: '2px solid #94a3b8' }}>{row.diemChuan}</td>

                                        {/* KẾT QUẢ NGHIỆM THU — 1 cột duy nhất */}
                                        <td style={{ borderLeft: '2px solid #94a3b8', background: bgCell }}>
                                            <input className={`cell-input ${!isLocked ? 'editable' : ''}`}
                                                value={row.result.kpisDat}
                                                onChange={e => handleKpiChange(row.id, 'kpisDat', e.target.value)}
                                                readOnly={isLocked}
                                                style={{ textAlign: 'center', fontWeight: fw }} />
                                        </td>
                                        <td style={{ background: bgCell }}>
                                            <input className={`cell-input ${!isLocked ? 'editable' : ''}`}
                                                value={row.result.diem}
                                                onChange={e => handleKpiChange(row.id, 'diem', e.target.value)}
                                                readOnly={isLocked}
                                                style={{ textAlign: 'center', fontWeight: fw, color: isTotal ? '#dc2626' : 'inherit' }} />
                                        </td>
                                        <td style={{ background: bgCell }}>
                                            <input className={`cell-input ${!isLocked ? 'editable' : ''}`}
                                                value={row.result.ghiChu}
                                                onChange={e => handleKpiChange(row.id, 'ghiChu', e.target.value)}
                                                readOnly={isLocked}
                                                style={{ fontSize: 12 }} />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    const renderSlaTable = () => {
        const isLocked = currentStatusId !== 'moi_tao';

        return (
            <div className="tab-content">
                <div className="kpi-table-container">
                    <table className="kpi-block-table">
                        <thead>
                            <tr>
                                <th colSpan="5" className="freeze-col" style={{ background: '#e2e8f0', textAlign: 'center' }}>THÔNG TIN CHỈ TIÊU SLA GỐC (TỪ HỢP ĐỒNG)</th>
                                <th colSpan="3" style={{ background: '#e2e8f0', textAlign: 'center' }}>KẾT QUẢ NGHIỆM THU</th>
                            </tr>
                            <tr>
                                <th className="freeze-col" style={{ width: '40px', minWidth: '40px', left: 0 }}>TT</th>
                                <th className="freeze-col" style={{ width: '250px', minWidth: '250px', left: '40px' }}>TÊN CHỈ TIÊU</th>
                                <th className="freeze-col" style={{ width: '200px', minWidth: '200px', left: '290px' }}>YÊU CẦU</th>
                                <th className="freeze-col" style={{ width: '200px', minWidth: '200px', left: '490px' }}>PHƯƠNG PHÁP XÁC ĐỊNH</th>
                                <th className="freeze-col" style={{ width: '280px', minWidth: '280px', left: '690px' }}>NGƯỠNG (ĐẠT)</th>

                                <th style={{ width: '60px', textAlign: 'center' }}>Tỷ trọng</th><th style={{ width: '60px', textAlign: 'center' }}>Điểm đạt</th><th style={{ width: '100px', textAlign: 'center' }}>GHI CHÚ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {slaData.map(row => {
                                const isTotal = row.isTotal;
                                const rowBg = isTotal ? '#fff' : row.isGroup ? '#fff' : '#fff'; 
                                const rowFw = (row.isGroup || isTotal) ? 'bold' : 'normal';
                                return (
                                    <tr key={row.id} style={{ background: rowBg, fontWeight: rowFw }}>
                                        <td className="freeze-col" style={{ left: 0, textAlign: 'center' }}>{row.index}</td>
                                        <td className="freeze-col" style={{ left: '40px', color: isTotal ? '#000' : 'inherit' }}>{row.name}</td>
                                        <td className="freeze-col" style={{ left: '290px', whiteSpace: 'pre-wrap' }}>{row.requirement}</td>
                                        <td className="freeze-col" style={{ left: '490px', whiteSpace: 'pre-wrap' }}>{row.method}</td>
                                        <td className="freeze-col" style={{ left: '690px', whiteSpace: 'pre-wrap', fontSize: isTotal ? '12px' : '13px' }}>{row.target}</td>

                                        {/* KẾT QUẢ */}
                                        <td>
                                            <input className={`cell-input ${!isLocked ? 'editable' : ''}`} value={row.evaluations.weight || ''} onChange={(e) => handleEvalChange('SLA', row.id, 'weight', e.target.value)} readOnly={isLocked} style={{ textAlign: 'center', fontWeight: isTotal ? 'bold' : 'normal' }} />
                                        </td>
                                        <td>
                                            <input className={`cell-input ${!isLocked ? 'editable' : ''}`} value={row.evaluations.score || ''} onChange={(e) => handleEvalChange('SLA', row.id, 'score', e.target.value)} readOnly={isLocked} style={{ textAlign: 'center', fontWeight: isTotal ? 'bold' : 'normal', color: isTotal ? 'red' : 'inherit' }} />
                                        </td>
                                        <td>
                                            <input className={`cell-input ${!isLocked ? 'editable' : ''}`} value={row.evaluations.note || ''} onChange={(e) => handleEvalChange('SLA', row.id, 'note', e.target.value)} readOnly={isLocked} />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    return (
        <div className="kpi-block-container">
            {renderStatusBar()}

            <div className="kpi-block-header">
                <div className="kpi-block-tabs">
                    <button className={`kpi-tab-btn kpi ${activeTab === 'KPI' ? 'active' : ''}`} onClick={() => setActiveTab('KPI')}>
                        📊 KPI
                    </button>
                    <button className={`kpi-tab-btn sla ${activeTab === 'SLA' ? 'active' : ''}`} onClick={() => setActiveTab('SLA')}>
                        ⏱️ SLA
                    </button>
                </div>
            </div>

            {activeTab === 'KPI' ? renderKpiTable() : renderSlaTable()}
        </div>
    );
}
