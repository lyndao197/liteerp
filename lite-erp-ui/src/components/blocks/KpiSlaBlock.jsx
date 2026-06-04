import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Plus, Trash2, Download, CornerDownRight } from 'lucide-react';
import './KpiSlaBlock.css';

// ─── DỮ LIỆU KPI ────────────────────────────────────────────────────────────
// Block tổng điểm riêng (ngoài bảng)
const INIT_KPI_TOTAL = { diemChuan: 100, kpisDat: '', diem: '', ghiChu: '' };

const INITIAL_KPI_DATA = [
    // level 0 = tổng, level 1 = nhóm I/II, level 2 = chi tiết
    { id: 'total', level: 0, isGroup: true, isTotal: true, stt: '', name: 'TỔNG ĐIỂM ĐẠT', dienGiai: '', kpisYeuCau: '', cachTinh: '', diemChuan: 100, result: { kpisDat: '', diem: '', ghiChu: '' } },
    { id: 'g1',  level: 1, isGroup: true,  stt: 'I',  name: 'CHẤT LƯỢNG TỔNG ĐÀI',           dienGiai: '', kpisYeuCau: '', cachTinh: '', diemChuan: 60,  result: { kpisDat: '', diem: '', ghiChu: '' } },
    { id: 'r1',  level: 2, isGroup: false, stt: '1',  name: 'Tỷ lệ kết nối Hotline',           dienGiai: '=(Số lượng KH kết nối thành công + cuộc gọi nhỡ gọi lại trong 15 phút / Tổng cuộc gọi vào hàng đợi)*100%', kpisYeuCau: '100%',            cachTinh: '- Hoàn thành = 100% đạt: 40 điểm\n- Hoàn thành <100%: Điểm đạt = 40-(100%-KQ đạt)*2', diemChuan: 40, result: { kpisDat: '', diem: '', ghiChu: '' } },
    { id: 'r2',  level: 2, isGroup: false, stt: '2',  name: 'Năng suất cuộc gọi',              dienGiai: 'Tổng cuộc gọi nhận vào của 1 nhân viên trên 1 ca làm việc',                                                kpisYeuCau: '150 cuộc/Agent/ca', cachTinh: '- Hoàn thành ≥100%: Điểm đạt = Điểm chuẩn\n- Hoàn thành <100%: Điểm đạt * tỷ lệ hoàn thành',               diemChuan: 15, result: { kpisDat: '', diem: '', ghiChu: '' } },
    { id: 'r3',  level: 2, isGroup: false, stt: '3',  name: 'Tỷ lệ tiếp cận KH call out',      dienGiai: '= (Số KH tiếp nhận cuộc gọi call out / Số lượng cuộc gọi call out)',                                       kpisYeuCau: '70%',             cachTinh: '- Hoàn thành ≥100%: Điểm đạt = Điểm chuẩn\n- Hoàn thành <100%: Điểm đạt * tỷ lệ hoàn thành',               diemChuan: 5,  result: { kpisDat: '', diem: '', ghiChu: '' } },
    { id: 'g2',  level: 1, isGroup: true,  stt: 'II', name: 'ĐÁNH GIÁ CHẤT LƯỢNG CHUNG',      dienGiai: '', kpisYeuCau: '', cachTinh: '', diemChuan: 40,  result: { kpisDat: '', diem: '', ghiChu: '' } },
    { id: 'r4',  level: 2, isGroup: false, stt: '4',  name: 'Tỷ lệ KH hài lòng',               dienGiai: '=(Số lượng KH hài lòng / Tổng trường hợp KH tham gia đánh giá)*100',                                       kpisYeuCau: '95%',             cachTinh: '- Hoàn thành ≥100%: Điểm đạt = 10\n- Hoàn thành <95%: Điểm đạt = (KQ đạt/95%)*10',                      diemChuan: 10, result: { kpisDat: '', diem: '', ghiChu: '' } },
    { id: 'r5',  level: 2, isGroup: false, stt: '5',  name: 'Vi phạm ý thức, thái độ',         dienGiai: 'Khiếu nại của KH/VCC đánh giá cuộc gọi và chốt do lỗi ĐTV',                                               kpisYeuCau: '0 TH',            cachTinh: '- Trừ 1 điểm/TH vi phạm + Bồi thường (nếu có)',                                                             diemChuan: 5,  result: { kpisDat: '', diem: '', ghiChu: '' } },
    { id: 'r6',  level: 2, isGroup: false, stt: '6',  name: 'Khiếu nại / Đánh giá nghiệp vụ',  dienGiai: 'Khiếu nại của KH/VCC đánh giá cuộc gọi và chốt do lỗi ĐTV',                                               kpisYeuCau: '0 TH',            cachTinh: '- Trừ 1 điểm/TH vi phạm',                                                                                     diemChuan: 5,  result: { kpisDat: '', diem: '', ghiChu: '' } },
    { id: 'r7',  level: 2, isGroup: false, stt: '7',  name: 'Vi phạm bảo mật thông tin',       dienGiai: 'Vi phạm bảo mật',                                                                                          kpisYeuCau: '0 TH',            cachTinh: '- Trừ 2 điểm/1 TH vi phạm + Bồi thường (nếu có)',                                                            diemChuan: 5,  result: { kpisDat: '', diem: '', ghiChu: '' } },
    { id: 'r8',  level: 2, isGroup: false, stt: '8',  name: 'Tỷ lệ thống kê cuộc gọi',         dienGiai: '= Số lượng thống kê cg / Tổng cuộc gọi',                                                                    kpisYeuCau: '95%',             cachTinh: '- Hoàn thành ≥100%: Điểm đạt = Điểm chuẩn\n- Hoàn thành <100%: Điểm đạt * tỷ lệ hoàn thành',               diemChuan: 10, result: { kpisDat: '', diem: '', ghiChu: '' } },
    { id: 'r9',  level: 2, isGroup: false, stt: '9',  name: 'Đảm bảo thời gian làm việc / ca', dienGiai: '=(Tổng công đảm bảo thời gian làm việc / Tổng Số công thực tế vận hành)*100',                               kpisYeuCau: '95%',             cachTinh: '- Hoàn thành ≥100%: Điểm đạt = Điểm chuẩn\n- Hoàn thành <100%: Điểm đạt * tỷ lệ hoàn thành',               diemChuan: 5,  result: { kpisDat: '', diem: '', ghiChu: '' } },
];

// ─── DỮ LIỆU SLA ────────────────────────────────────────────────────────────

// Block tổng điểm riêng (ngoài bảng) cho SLA
// Cột ngưỡng đạt: mỗi mức là 1 dòng riêng (editable, thêm/xóa độc lập)
const INIT_SLA_TOTAL = {
    diemChuan: 100, weight: '100%', score: '', note: '',
    targets: [
        'Điểm tối đa: 100',
        'Từ 95-100 điểm: Không trừ phí',
        'Từ 90-<95 điểm: Trừ 0.2%/điểm dưới 95',
        'Từ 80-<90 điểm: Trừ 0.3%/điểm dưới 95',
        'Từ 70-<80 điểm: Trừ 0.5%/điểm dưới 95',
        'Từ 65-<70 điểm: Trừ 1%/điểm dưới 95',
        'Dưới 65 điểm: Trừ 8% phí/hợp đồng',
    ],
};

const INITIAL_SLA_DATA = [
    // level 0 = tổng, level 1 = nhóm A/B/C, level 2 = chi tiết
    { id: 's_total', level: 0, isGroup: true, isTotal: true, index: '', name: 'TỔNG ĐIỂM:', requirement: '', method: '', target: 'Điểm tối đa: 100\n- Từ 95-100 điểm: Không trừ phí\n- Từ 90-<95 điểm: Trừ 0.2%/điểm dưới 95\n- Từ 80-<90 điểm: Trừ 0.3%/điểm dưới 95\n- Từ 70-<80 điểm: Trừ 0.5%/điểm dưới 95\n- Từ 65-<70 điểm: Trừ 1%/điểm dưới 95\n- Dưới 65 điểm: Trừ 8% phí/hợp đồng', evaluations: { weight: '100%', score: '', note: '' } },
    { id: 's_a',  level: 1, isGroup: true,  index: 'A', name: 'ĐẢM BẢO CÁC CHỈ TIÊU KPI VỀ CHẤT LƯỢNG PHỤC VỤ KHÁCH HÀNG', requirement: '', method: '', target: '70', evaluations: { weight: '70%', score: '', note: '' } },
    { id: 's_a1', level: 2, isGroup: false, index: '1', name: 'Số lượng các chỉ tiêu KPI đạt trong kỳ đánh giá', requirement: 'VCX đảm bảo các KPI về CLPV theo phụ lục II', method: 'Số chỉ tiêu KPI đạt / tổng số KPI đánh giá trong tháng', target: '- KPI đạt >= 95% => 100% Quỹ điểm\n- 85-95%: 80% Quỹ điểm\n- 75-85%: 70% Quỹ điểm\n- 65-75%: 60% Quỹ điểm\n- 50-65%: 50% Quỹ điểm\n- <50%: 10% Quỹ điểm', evaluations: { weight: '', score: '', note: '' } },
    { id: 's_b',  level: 1, isGroup: true,  index: 'B', name: 'CAM KẾT VỀ BẢO MẬT THÔNG TIN, CƠ SỞ DỮ LIỆU KHÁCH HÀNG', requirement: '', method: '', target: '20', evaluations: { weight: '20%', score: '', note: '' } },
    { id: 's_b1', level: 2, isGroup: false, index: '1', name: 'Bảo mật về thông tin, cơ sở dữ liệu của VCC', requirement: '- VCX cam kết bảo mật tài liệu, CSDL Khách hàng.\n- Không sử dụng thông tin ngoài phạm vi thỏa thuận.', method: 'Theo thực tế phát sinh', target: '- Không vi phạm: 100% quỹ điểm\n- Trừ 0,5 điểm/1 lần vi phạm', evaluations: { weight: '', score: '', note: '' } },
    { id: 's_c',  level: 1, isGroup: true,  index: 'C', name: 'CÔNG TÁC PHỐI HỢP GIỮA VCX VÀ VCC', requirement: '', method: '', target: '10', evaluations: { weight: '10%', score: '', note: '' } },
    { id: 's_c1', level: 2, isGroup: false, index: '1', name: 'Thông báo kịp thời khi có sự cố phát sinh', requirement: '- Thông báo trong vòng 30 phút khi có sự cố.\n- Hotline: 18009377 / Zalo: DVKH - VCC', method: '', target: '- Trừ 01 điểm/1 lần vi phạm', evaluations: { weight: '', score: '', note: '' } },
    { id: 's_c2', level: 2, isGroup: false, index: '2', name: 'Báo cáo chất lượng giải đáp Tổng đài theo tuần/tháng', requirement: '+ Báo cáo tuần: trước 12h thứ 3 hàng tuần\n+ Báo cáo tháng: trước 12h ngày 03 tháng N+1', method: '', target: '- Trừ 0,1 điểm/1 lần không gửi', evaluations: { weight: '', score: '', note: '' } },
    { id: 's_c3', level: 2, isGroup: false, index: '3', name: 'Công tác đảm bảo seats cho CSKH', requirement: 'Trừ 1điểm/1% seats thiếu so với hợp đồng\nVới ngày Lễ Tết: Trừ 2 điểm/1 seats thiếu', method: '', target: 'Trừ 1điểm/1% seats thiếu', evaluations: { weight: '', score: '', note: '' } },
    { id: 's_c4', level: 2, isGroup: false, index: '4', name: 'Các sự vụ/trường hợp khác', requirement: '- Là những trường hợp phát sinh khác.', method: '', target: '- Cộng/Trừ điểm theo mức độ ảnh hưởng thực tế', evaluations: { weight: '', score: '', note: '' } },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
// Cây phân cấp chỉ cho phép 2 level: nhóm (level 1) + chỉ tiêu chi tiết (level 2)
const MAX_LEVEL = 2;

const newKpiRow = (level) => ({
    id: `kpi_${Date.now()}_${Math.random()}`, level, isGroup: level === 1,
    stt: '', name: '', dienGiai: '', kpisYeuCau: '', cachTinh: '', diemChuan: '',
    result: { kpisDat: '', diem: '', ghiChu: '' }
});

const newSlaRow = (level) => ({
    id: `sla_${Date.now()}_${Math.random()}`, level, isGroup: level === 1,
    index: '', name: '', requirement: '', method: '', target: '',
    evaluations: { weight: '', score: '', note: '' }
});

const INDENT = 20; // px per level

// ─── COMPONENT ───────────────────────────────────────────────────────────────
export default function KpiSlaBlock() {
    const [activeTab, setActiveTab] = useState('SLA');
    const [kpiData, setKpiData]     = useState(INITIAL_KPI_DATA);
    const [slaData, setSlaData]     = useState(INITIAL_SLA_DATA);
    const [kpiTotal, setKpiTotal]   = useState(INIT_KPI_TOTAL);
    const [slaTotal, setSlaTotal]   = useState(INIT_SLA_TOTAL);

    // ── KPI handlers ──
    const updateKpi = (id, field, val) =>
        setKpiData(p => p.map(r => r.id === id ? { ...r, [field]: val } : r));

    const updateKpiResult = (id, field, val) =>
        setKpiData(p => p.map(r => r.id === id ? { ...r, result: { ...r.result, [field]: val } } : r));

    const insertAfter = (list, idx, newRow) => {
        const next = [...list];
        next.splice(idx + 1, 0, newRow);
        return next;
    };

    const handleAddSibling = (idx, list, setter, makeRow) => {
        const level = list[idx].level;
        // skip past all children
        let insertIdx = idx + 1;
        while (insertIdx < list.length && list[insertIdx].level > level) insertIdx++;
        const next = [...list];
        next.splice(insertIdx, 0, makeRow(level));
        setter(next);
    };

    const handleAddChild = (idx, list, setter, makeRow) => {
        const level = list[idx].level;
        if (level >= MAX_LEVEL) return; // chỉ cho phép tối đa 2 level
        setter(insertAfter(list, idx, makeRow(level + 1)));
    };

    const handleDelete = (id, setter) =>
        setter(p => p.filter(r => r.id !== id));

    // ── SLA handlers ──
    const updateSla = (id, field, val) =>
        setSlaData(p => p.map(r => r.id === id ? { ...r, [field]: val } : r));
    const updateSlaEval = (id, field, val) =>
        setSlaData(p => p.map(r => r.id === id ? { ...r, evaluations: { ...r.evaluations, [field]: val } } : r));

    // ── Export Excel ──
    const handleExport = () => {
        const wb = XLSX.utils.book_new();

        const kpiRows = [
            [`TỔNG ĐIỂM KPI — Điểm chuẩn: ${kpiTotal.diemChuan} | Điểm đạt: ${kpiTotal.diemDat}`],
            [],
            ['STT', 'NỘI DUNG', 'DIỄN GIẢI', 'KPIs YÊU CẦU', 'CÁCH TÍNH', 'ĐIỂM CHUẨN', 'KPIs ĐẠT', 'ĐIỂM', 'GHI CHÚ'],
            ...kpiData.map(r => [
                '  '.repeat(r.level) + r.stt, r.name, r.dienGiai,
                r.kpisYeuCau, r.cachTinh, r.diemChuan,
                r.result.kpisDat, r.result.diem, r.result.ghiChu
            ]),
            [], ['ĐẠI DIỆN BÊN A', '', '', '', 'ĐẠI DIỆN BÊN B'],
            ['', '', '', '', ''], ['(Ký, ghi rõ họ tên)', '', '', '', '(Ký, ghi rõ họ tên)'],
        ];
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(kpiRows), 'KPI');

        const slaRows = [
            [`TỔNG ĐIỂM SLA — Điểm chuẩn: ${slaTotal.diemChuan} | Điểm đạt: ${slaTotal.diemDat}`],
            [`Ngưỡng: ${(slaTotal.targets || []).join(' | ')}`],
            [],
            ['TT', 'TÊN CHỈ TIÊU', 'YÊU CẦU', 'PHƯƠNG PHÁP', 'NGƯỠNG', 'TỶ TRỌNG', 'ĐIỂM ĐẠT', 'GHI CHÚ'],
            ...slaData.map(r => [
                '  '.repeat(r.level) + r.index, r.name,
                r.requirement, r.method, r.target,
                r.evaluations.weight, r.evaluations.score, r.evaluations.note
            ]),
            [], ['ĐẠI DIỆN BÊN A', '', '', '', 'ĐẠI DIỆN BÊN B'],
            ['', '', '', '', ''], ['(Ký, ghi rõ họ tên)', '', '', '', '(Ký, ghi rõ họ tên)'],
        ];
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(slaRows), 'SLA');

        XLSX.writeFile(wb, 'Tong_hop_KPI_SLA.xlsx');
    };

    // ─── BLOCK TỔNG ĐIỂM RIÊNG ──────────────────────────────────────────────
    const renderTotalBlock = (total, setTotal, label) => (
        <div style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #94a3b8' }}>
            {/* Header block */}
            <div style={{ padding: '10px 24px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid #e2e8f0' }}>
                <span style={{ fontWeight: 'bold', fontSize: 13, color: '#1e293b' }}>🏆 BLOCK TỔNG ĐIỂM {label}</span>
                <span style={{ fontSize: 11, color: '#94a3b8', fontStyle: 'italic' }}>(nhập riêng, không liên kết bảng bên dưới)</span>
            </div>
            {/* Nội dung block — giống 1 dòng bảng */}
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 80px 140px 80px 160px', gap: 0, alignItems: 'center', padding: '0 24px' }}>
                <div style={{ padding: '8px 0', fontWeight: 'bold', fontSize: 13, color: '#1e293b' }}>TỔNG ĐIỂM {label}:</div>
                {label === 'SLA' ? (
                    <div style={{ padding: '6px 8px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <div style={{ fontSize: 11, color: '#64748b' }}>Ngưỡng đạt</div>
                        {(total.targets || []).map((line, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <span style={{ color: '#94a3b8', fontSize: 12, flexShrink: 0 }}>•</span>
                                <input
                                    className="cell-input editable"
                                    value={line}
                                    onChange={e => setTotal(p => ({ ...p, targets: p.targets.map((t, idx) => idx === i ? e.target.value : t) }))}
                                    style={{ flex: 1, fontSize: 12 }}
                                />
                                <button
                                    title="Xóa mức ngưỡng"
                                    onClick={() => setTotal(p => ({ ...p, targets: p.targets.filter((_, idx) => idx !== i) }))}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 2, flexShrink: 0 }}
                                    onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                                    onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
                                ><Trash2 size={13} /></button>
                            </div>
                        ))}
                        <button
                            onClick={() => setTotal(p => ({ ...p, targets: [...(p.targets || []), ''] }))}
                            style={{ display: 'flex', alignItems: 'center', gap: 4, alignSelf: 'flex-start', marginTop: 2, padding: '3px 8px', border: '1px dashed #94a3b8', borderRadius: 4, background: '#fff', color: '#475569', cursor: 'pointer', fontSize: 11 }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = '#3b82f6'}
                            onMouseLeave={e => e.currentTarget.style.borderColor = '#94a3b8'}
                        ><Plus size={12} /> Thêm mức ngưỡng</button>
                    </div>
                ) : (
                    <div />
                )}
                {/* Điểm chuẩn */}
                <div style={{ textAlign: 'center', borderLeft: '1px solid #e2e8f0', padding: '0 8px' }}>
                    <div style={{ fontSize: 11, color: '#64748b', marginBottom: 2 }}>Điểm chuẩn</div>
                    <input className="cell-input editable" value={total.diemChuan} onChange={e => setTotal(p => ({ ...p, diemChuan: e.target.value }))} style={{ textAlign: 'center', fontWeight: 'bold', width: '100%' }} />
                </div>
                {/* KPIs đạt được */}
                <div style={{ borderLeft: '2px solid #94a3b8', padding: '0 8px', textAlign: 'center' }}>
                    <div style={{ fontSize: 11, color: '#64748b', marginBottom: 2 }}>KPIs đạt được</div>
                    <input className="cell-input editable" value={total.kpisDat || ''} onChange={e => setTotal(p => ({ ...p, kpisDat: e.target.value }))} style={{ textAlign: 'center', width: '100%' }} />
                </div>
                {/* Điểm */}
                <div style={{ borderLeft: '1px solid #e2e8f0', padding: '0 8px', textAlign: 'center' }}>
                    <div style={{ fontSize: 11, color: '#64748b', marginBottom: 2 }}>Điểm đạt</div>
                    <input className="cell-input editable" value={total.diem || ''} onChange={e => setTotal(p => ({ ...p, diem: e.target.value }))} style={{ textAlign: 'center', fontWeight: 'bold', color: '#dc2626', width: '100%' }} />
                </div>
                {/* Ghi chú */}
                <div style={{ borderLeft: '1px solid #e2e8f0', padding: '0 8px' }}>
                    <div style={{ fontSize: 11, color: '#64748b', marginBottom: 2 }}>Ghi chú</div>
                    <input className="cell-input editable" value={total.ghiChu || ''} onChange={e => setTotal(p => ({ ...p, ghiChu: e.target.value }))} style={{ width: '100%', fontSize: 12 }} />
                </div>
            </div>
        </div>
    );

    // ─── ACTION BUTTONS (thêm cùng cấp / thêm cấp con) ──────────────────────
    const RowActions = ({ idx, list, setter, makeRow, canDelete, id, level }) => (
        <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <button
                title="Thêm dòng cùng cấp"
                onClick={() => handleAddSibling(idx, list, setter, makeRow)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 3, borderRadius: 3 }}
                onMouseEnter={e => e.currentTarget.style.color = '#3b82f6'}
                onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
            ><Plus size={13} /></button>
            {level < MAX_LEVEL && (
                <button
                    title="Thêm dòng cấp con"
                    onClick={() => handleAddChild(idx, list, setter, makeRow)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 3, borderRadius: 3 }}
                    onMouseEnter={e => e.currentTarget.style.color = '#8b5cf6'}
                    onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
                ><CornerDownRight size={13} /></button>
            )}
            {canDelete && (
                <button
                    title="Xóa dòng"
                    onClick={() => handleDelete(id, setter)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 3, borderRadius: 3 }}
                    onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                    onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
                ><Trash2 size={13} /></button>
            )}
        </div>
    );

    // ─── KPI TABLE ──────────────────────────────────────────────────────────
    const renderKpiTable = () => {
        const L = { stt: 0, name: 40, dienGiai: 290, kpisYeuCau: 490, cachTinh: 690, diemChuan: 890 };
        return (
            <div className="tab-content">
                {renderTotalBlock(kpiTotal, setKpiTotal, 'KPI')}
                <div className="kpi-table-container">
                    <table className="kpi-block-table" style={{ minWidth: '1250px' }}>
                        <thead>
                            <tr>
                                <th colSpan="6" className="freeze-col" style={{ background: '#e2e8f0', textAlign: 'center', left: 0 }}>CHỈ TIÊU KPI GỐC (TỪ HỢP ĐỒNG)</th>
                                <th colSpan="3" style={{ background: '#e2e8f0', textAlign: 'center', borderLeft: '2px solid #94a3b8' }}>KẾT QUẢ NGHIỆM THU</th>
                                <th style={{ background: '#e2e8f0', width: 80 }}></th>
                            </tr>
                            <tr>
                                <th className="freeze-col" style={{ width: 40,  left: L.stt        }}>STT</th>
                                <th className="freeze-col" style={{ width: 250, left: L.name,  minWidth: 250 }}>NỘI DUNG ĐÁNH GIÁ</th>
                                <th className="freeze-col" style={{ width: 200, left: L.dienGiai,  minWidth: 200 }}>DIỄN GIẢI / THÔNG TIN</th>
                                <th className="freeze-col" style={{ width: 200, left: L.kpisYeuCau, minWidth: 200 }}>KPIs YÊU CẦU</th>
                                <th className="freeze-col" style={{ width: 200, left: L.cachTinh,  minWidth: 200 }}>CÁCH THỨC TÍNH ĐIỂM</th>
                                <th className="freeze-col" style={{ width: 80,  left: L.diemChuan, textAlign: 'center', borderRight: '2px solid #94a3b8' }}>ĐIỂM CHUẨN</th>
                                <th style={{ width: 140, textAlign: 'center', borderLeft: '2px solid #94a3b8' }}>KPIs đạt được</th>
                                <th style={{ width: 80,  textAlign: 'center' }}>Điểm</th>
                                <th style={{ width: 160, textAlign: 'center' }}>Ghi chú</th>
                                <th style={{ width: 80 }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {kpiData.map((row, idx) => {
                                const fw  = (row.isGroup || row.isTotal) ? 'bold' : 'normal';
                                const bg  = row.isTotal ? '#f1f5f9' : row.isGroup ? '#f8fafc' : '#fff';
                                const pad = row.level * INDENT;
                                const canDelete = !row.isTotal && !row.isGroup;
                                return (
                                    <tr key={row.id} style={{ background: bg, fontWeight: fw }}>
                                        <td className="freeze-col" style={{ left: L.stt, textAlign: 'center', background: bg }}>
                                            <input className="cell-input editable" value={row.stt} onChange={e => updateKpi(row.id, 'stt', e.target.value)} style={{ textAlign: 'center', width: 36 }} />
                                        </td>
                                        <td className="freeze-col" style={{ left: L.name, background: bg }}>
                                            <div style={{ paddingLeft: pad, display: 'flex', alignItems: 'center', gap: 4 }}>
                                                {row.level > 0 && <CornerDownRight size={12} style={{ color: '#94a3b8', flexShrink: 0 }} />}
                                                <input className="cell-input editable" value={row.name} onChange={e => updateKpi(row.id, 'name', e.target.value)} style={{ fontWeight: fw }} />
                                            </div>
                                        </td>
                                        <td className="freeze-col" style={{ left: L.dienGiai, background: bg }}>
                                            <textarea className="cell-input editable" value={row.dienGiai} onChange={e => updateKpi(row.id, 'dienGiai', e.target.value)} rows={2} style={{ fontSize: 12, resize: 'vertical' }} />
                                        </td>
                                        <td className="freeze-col" style={{ left: L.kpisYeuCau, background: bg }}>
                                            <input className="cell-input editable" value={row.kpisYeuCau} onChange={e => updateKpi(row.id, 'kpisYeuCau', e.target.value)} style={{ textAlign: 'center' }} />
                                        </td>
                                        <td className="freeze-col" style={{ left: L.cachTinh, background: bg }}>
                                            <textarea className="cell-input editable" value={row.cachTinh} onChange={e => updateKpi(row.id, 'cachTinh', e.target.value)} rows={2} style={{ fontSize: 12, resize: 'vertical' }} />
                                        </td>
                                        <td className="freeze-col" style={{ left: L.diemChuan, background: bg, textAlign: 'center', borderRight: '2px solid #94a3b8' }}>
                                            <input className="cell-input editable" value={row.diemChuan} onChange={e => updateKpi(row.id, 'diemChuan', e.target.value)} style={{ textAlign: 'center', width: 60, fontWeight: fw }} />
                                        </td>
                                        <td style={{ borderLeft: '2px solid #94a3b8', background: bg }}>
                                            <input className="cell-input editable" value={row.result.kpisDat} onChange={e => updateKpiResult(row.id, 'kpisDat', e.target.value)} style={{ textAlign: 'center' }} />
                                        </td>
                                        <td style={{ background: bg }}>
                                            <input className="cell-input editable" value={row.result.diem} onChange={e => updateKpiResult(row.id, 'diem', e.target.value)} style={{ textAlign: 'center', fontWeight: fw }} />
                                        </td>
                                        <td style={{ background: bg }}>
                                            <input className="cell-input editable" value={row.result.ghiChu} onChange={e => updateKpiResult(row.id, 'ghiChu', e.target.value)} style={{ fontSize: 12 }} />
                                        </td>
                                        <td style={{ background: bg, verticalAlign: 'middle' }}>
                                            {!row.isTotal && <RowActions idx={idx} list={kpiData} setter={setKpiData} makeRow={newKpiRow} canDelete={canDelete} id={row.id} level={row.level} />}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <div style={{ padding: '10px 16px' }}>
                    <button onClick={() => setKpiData(p => [...p, newKpiRow(1)])}
                        style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', border: '1px dashed #94a3b8', borderRadius: 6, background: '#fff', color: '#475569', cursor: 'pointer', fontSize: 13 }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = '#3b82f6'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = '#94a3b8'}>
                        <Plus size={14} /> Thêm nhóm
                    </button>
                </div>
            </div>
        );
    };

    // ─── SLA TABLE ──────────────────────────────────────────────────────────
    const renderSlaTable = () => (
        <div className="tab-content">
            {renderTotalBlock(slaTotal, setSlaTotal, 'SLA')}
            <div className="kpi-table-container">
                <table className="kpi-block-table">
                    <thead>
                        <tr>
                            <th colSpan="5" className="freeze-col" style={{ background: '#e2e8f0', textAlign: 'center' }}>THÔNG TIN CHỈ TIÊU SLA GỐC (TỪ HỢP ĐỒNG)</th>
                            <th colSpan="3" style={{ background: '#e2e8f0', textAlign: 'center' }}>KẾT QUẢ NGHIỆM THU</th>
                            <th style={{ background: '#e2e8f0', width: 80 }}></th>
                        </tr>
                        <tr>
                            <th className="freeze-col" style={{ width: 40,  minWidth: 40,  left: 0   }}>TT</th>
                            <th className="freeze-col" style={{ width: 250, minWidth: 250, left: 40  }}>TÊN CHỈ TIÊU</th>
                            <th className="freeze-col" style={{ width: 200, minWidth: 200, left: 290 }}>YÊU CẦU</th>
                            <th className="freeze-col" style={{ width: 200, minWidth: 200, left: 490 }}>PHƯƠNG PHÁP XÁC ĐỊNH</th>
                            <th className="freeze-col" style={{ width: 280, minWidth: 280, left: 690 }}>NGƯỠNG (ĐẠT)</th>
                            <th style={{ width: 70,  textAlign: 'center' }}>Tỷ trọng</th>
                            <th style={{ width: 70,  textAlign: 'center' }}>Điểm đạt</th>
                            <th style={{ width: 120, textAlign: 'center' }}>Ghi chú</th>
                            <th style={{ width: 80 }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {slaData.map((row, idx) => {
                            const fw  = (row.isGroup || row.isTotal) ? 'bold' : 'normal';
                            const bg  = row.isTotal ? '#f1f5f9' : row.isGroup ? '#f8fafc' : '#fff';
                            const pad = row.level * INDENT;
                            const canDelete = !row.isTotal && !row.isGroup;
                            return (
                                <tr key={row.id} style={{ background: bg, fontWeight: fw }}>
                                    <td className="freeze-col" style={{ left: 0, textAlign: 'center', background: bg }}>
                                        <input className="cell-input editable" value={row.index} onChange={e => updateSla(row.id, 'index', e.target.value)} style={{ textAlign: 'center', width: 36 }} />
                                    </td>
                                    <td className="freeze-col" style={{ left: 40, background: bg }}>
                                        <div style={{ paddingLeft: pad, display: 'flex', alignItems: 'center', gap: 4 }}>
                                            {row.level > 0 && <CornerDownRight size={12} style={{ color: '#94a3b8', flexShrink: 0 }} />}
                                            <input className="cell-input editable" value={row.name} onChange={e => updateSla(row.id, 'name', e.target.value)} style={{ fontWeight: fw }} />
                                        </div>
                                    </td>
                                    <td className="freeze-col" style={{ left: 290, background: bg }}>
                                        <textarea className="cell-input editable" value={row.requirement} onChange={e => updateSla(row.id, 'requirement', e.target.value)} rows={2} style={{ fontSize: 12, resize: 'vertical' }} />
                                    </td>
                                    <td className="freeze-col" style={{ left: 490, background: bg }}>
                                        <textarea className="cell-input editable" value={row.method} onChange={e => updateSla(row.id, 'method', e.target.value)} rows={2} style={{ fontSize: 12, resize: 'vertical' }} />
                                    </td>
                                    <td className="freeze-col" style={{ left: 690, background: bg }}>
                                        <textarea className="cell-input editable" value={row.target} onChange={e => updateSla(row.id, 'target', e.target.value)} rows={2} style={{ fontSize: 12, resize: 'vertical' }} />
                                    </td>
                                    <td style={{ background: bg }}>
                                        <input className="cell-input editable" value={row.evaluations.weight || ''} onChange={e => updateSlaEval(row.id, 'weight', e.target.value)} style={{ textAlign: 'center', fontWeight: fw }} />
                                    </td>
                                    <td style={{ background: bg }}>
                                        <input className="cell-input editable" value={row.evaluations.score || ''} onChange={e => updateSlaEval(row.id, 'score', e.target.value)} style={{ textAlign: 'center', fontWeight: fw }} />
                                    </td>
                                    <td style={{ background: bg }}>
                                        <input className="cell-input editable" value={row.evaluations.note || ''} onChange={e => updateSlaEval(row.id, 'note', e.target.value)} />
                                    </td>
                                    <td style={{ background: bg, verticalAlign: 'middle' }}>
                                        {!row.isTotal && <RowActions idx={idx} list={slaData} setter={setSlaData} makeRow={newSlaRow} canDelete={canDelete} id={row.id} level={row.level} />}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <div style={{ padding: '10px 16px' }}>
                <button onClick={() => setSlaData(p => [...p, newSlaRow(1)])}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', border: '1px dashed #94a3b8', borderRadius: 6, background: '#fff', color: '#475569', cursor: 'pointer', fontSize: 13 }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = '#3b82f6'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = '#94a3b8'}>
                    <Plus size={14} /> Thêm nhóm
                </button>
            </div>
        </div>
    );

    // ─── CHỮ KÝ ─────────────────────────────────────────────────────────────
    const renderSignature = () => (
        <div style={{ padding: '32px 48px', borderTop: '1px solid #e2e8f0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
            {['ĐẠI DIỆN BÊN A', 'ĐẠI DIỆN BÊN B'].map(label => (
                <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 80 }}>
                    <div style={{ fontWeight: 'bold', fontSize: 13, color: '#1e293b' }}>{label}</div>
                    <div style={{ width: '60%', borderBottom: '1px solid #475569', paddingBottom: 4, textAlign: 'center', fontSize: 12, color: '#94a3b8', fontStyle: 'italic' }}>
                        (Ký, ghi rõ họ tên)
                    </div>
                </div>
            ))}
        </div>
    );

    // ─── RENDER ──────────────────────────────────────────────────────────────
    return (
        <div className="kpi-block-container">
            {/* Tabs + Export */}
            <div className="kpi-block-header">
                <div className="kpi-block-tabs">
                    <button className={`kpi-tab-btn kpi ${activeTab === 'KPI' ? 'active' : ''}`} onClick={() => setActiveTab('KPI')}>📊 KPI</button>
                    <button className={`kpi-tab-btn sla ${activeTab === 'SLA' ? 'active' : ''}`} onClick={() => setActiveTab('SLA')}>⏱️ SLA</button>
                </div>
                <button onClick={handleExport}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', backgroundColor: '#16a34a', color: '#fff', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#15803d'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#16a34a'}>
                    <Download size={14} /> Xuất Excel
                </button>
            </div>

            {/* Chú thích thêm dòng */}
            <div style={{ padding: '6px 24px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: 11, color: '#94a3b8', display: 'flex', gap: 16 }}>
                <span><Plus size={11} style={{ verticalAlign: 'middle' }} /> Thêm cùng cấp</span>
                <span><CornerDownRight size={11} style={{ verticalAlign: 'middle' }} /> Thêm cấp con</span>
                <span><Trash2 size={11} style={{ verticalAlign: 'middle' }} /> Xóa dòng</span>
            </div>

            {activeTab === 'KPI' ? renderKpiTable() : renderSlaTable()}
            {renderSignature()}
        </div>
    );
}
