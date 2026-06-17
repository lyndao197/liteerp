import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, ChevronDown, Plus, Copy, Trash2, Upload, Download, FileText } from 'lucide-react';
import { mockStore } from '../utils/mockStore';

/* ─── constants ─────────────────────────────────────────── */
const MENU_OPTIONS = [
  'Quản lý hợp đồng', 'Quản lý đơn hàng', 'Quản lý khách hàng',
  'Quản lý nghiệm thu', 'Tính cước', 'Quản lý hóa đơn',
  'Quản lý dự án', 'Quản trị hệ thống',
];
const SPDV_OPTIONS = [
  'Dịch vụ viễn thông', 'Dịch vụ CNTT', 'Giải pháp doanh nghiệp',
  'Phần mềm ERP', 'Dịch vụ bảo trì', 'Hạ tầng mạng',
  'Cloud Services', 'Thiết bị đầu cuối',
];
const DONVI_OPTIONS = [
  'Viettel Telecom', 'Viettel Solution', 'Viettel Post',
  'Viettel Digital', 'Viettel HighTech', 'Phòng Kinh doanh',
  'Phòng Kỹ thuật', 'Phòng Tài chính',
];
const LOAI_CHUNG_TU_OPTIONS = [
  'Hợp đồng', 'Phụ lục hợp đồng', 'Biên bản nghiệm thu',
  'Hóa đơn', 'Phiếu đặt hàng', 'Báo giá',
  'Đề nghị mua hàng', 'Biên bản bàn giao', 'Tờ trình', 'Công văn',
];

const EMPTY = {
  menu: '', spdv: [], donViApDung: [],
  loaiChungTu: '', trangThai: 'Hiệu lực', cauHinhTruong: [],
  tepMauName: '',
};

let _fid = 1;
const makeField = () => ({ _fid: _fid++, tenTruong: '', tenHienThi: '', stt: '', trangThai: true });

/* ─── Toggle ─────────────────────────────────────────────── */
function Toggle({ value, onChange }) {
  return (
    <div onClick={() => onChange(!value)} style={{
      width: '38px', height: '22px', borderRadius: '11px',
      background: value ? '#16a34a' : '#d1d5db',
      position: 'relative', cursor: 'pointer', transition: 'background .2s',
      display: 'inline-block', flexShrink: 0,
    }}>
      <div style={{
        width: '16px', height: '16px', borderRadius: '50%', background: '#fff',
        position: 'absolute', top: '3px', left: value ? '19px' : '3px',
        transition: 'left .18s', boxShadow: '0 1px 3px rgba(0,0,0,.2)',
      }} />
    </div>
  );
}

/* ─── MultiSelect ────────────────────────────────────────── */
function MultiSelect({ value = [], options, onChange, placeholder }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef();

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const toggle = (opt) =>
    onChange(value.includes(opt) ? value.filter(v => v !== opt) : [...value, opt]);

  const filtered = options.filter(o => o.toLowerCase().includes(search.toLowerCase()));

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', flexWrap: 'wrap', gap: '4px', alignItems: 'center',
          padding: '6px 32px 6px 10px', border: '1px solid #e2e8f0', borderRadius: '8px',
          cursor: 'pointer', minHeight: '40px', background: '#fff', position: 'relative',
        }}
      >
        {value.length === 0
          ? <span style={{ color: '#9ca3af', fontSize: '14px' }}>{placeholder}</span>
          : value.map(v => (
            <span key={v} style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', padding: '2px 8px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '4px', fontSize: '12px', color: '#1d4ed8' }}>
              {v}
              <span onMouseDown={e => { e.stopPropagation(); toggle(v); }}
                style={{ cursor: 'pointer', color: '#93c5fd', fontWeight: 700, lineHeight: 1 }}>×</span>
            </span>
          ))
        }
        <ChevronDown size={14} color="#9ca3af" style={{ position: 'absolute', right: '10px', top: '50%', transform: `translateY(-50%) rotate(${open ? 180 : 0}deg)`, transition: 'transform .15s' }} />
      </div>
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 200, background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 6px 20px rgba(0,0,0,.1)', maxHeight: '220px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '8px' }}>
            <input autoFocus value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Tìm kiếm..." onClick={e => e.stopPropagation()}
              style={{ width: '100%', padding: '5px 8px', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {filtered.length === 0
              ? <div style={{ padding: '10px 12px', fontSize: '12px', color: '#9ca3af' }}>Không tìm thấy</div>
              : filtered.map(opt => {
                const checked = value.includes(opt);
                return (
                  <div key={opt} onMouseDown={e => { e.preventDefault(); toggle(opt); }}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 12px', cursor: 'pointer', fontSize: '13px', color: '#374151', background: checked ? '#f0f9ff' : '#fff' }}
                    onMouseEnter={e => { if (!checked) e.currentTarget.style.background = '#f9fafb'; }}
                    onMouseLeave={e => { if (!checked) e.currentTarget.style.background = checked ? '#f0f9ff' : '#fff'; }}
                  >
                    <input type="checkbox" checked={checked} readOnly style={{ cursor: 'pointer', accentColor: '#2563eb' }} />
                    {opt}
                  </div>
                );
              })
            }
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Main Form ──────────────────────────────────────────── */
export default function ConfigFileForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm]       = useState({ ...EMPTY });
  const [dlOpen, setDlOpen]   = useState(false);
  const [errors, setErrors]   = useState({});
  const [tepMauFile, setTepMauFile] = useState(null);
  const tepMauRef = useRef();

  useEffect(() => {
    if (isEdit) {
      const ex = mockStore.getConfigFile(id);
      if (ex) {
        setForm({
          menu:           ex.menu        || '',
          spdv:           ex.spdv        || [],
          donViApDung:    ex.donViApDung || [],
          loaiChungTu:    ex.loaiChungTu || '',
          trangThai:      ex.trangThai   || ex.status || 'Hiệu lực',
          cauHinhTruong:  (ex.cauHinhTruong || []).map(f => ({ ...f, _fid: f._fid || _fid++ })),
          tepMauName:     ex.tepMauName  || '',
        });
      }
    }
  }, [id, isEdit]);

  const hf = (field, val) => {
    setForm(prev => ({ ...prev, [field]: val }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.menu) e.menu = 'Vui lòng chọn menu';
    return Object.keys(e).length ? e : null;
  };

  const handleExportBien = () => {
    const rows = form.cauHinhTruong.filter(f => f.trangThai);
    if (!rows.length) { alert('Chưa có biến nào được cấu hình.'); return; }
    const lines = ['STT\tTên trường\tTên hiển thị\tSố TT', ...rows.map(f => `${f.stt}\t${f.tenTruong}\t${f.tenHienThi}\t${f.stt}`)];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'danh_sach_bien.txt'; a.click();
    URL.revokeObjectURL(url);
  };

  const handleSave = () => {
    const e = validate();
    if (e) { setErrors(e); return; }
    const saveId = isEdit ? id : mockStore.getNextConfigFileId();
    const autoName = [form.loaiChungTu, form.menu].filter(Boolean).join(' - ') || saveId;
    mockStore.saveConfigFile(saveId, {
      id: saveId, code: saveId,
      name: autoName, tenMau: autoName,
      menu: form.menu, spdv: form.spdv,
      donViApDung: form.donViApDung,
      loaiChungTu: form.loaiChungTu,
      trangThai: form.trangThai,
      status: form.trangThai,
      cauHinhTruong: form.cauHinhTruong,
      tepMauName: tepMauFile?.name || form.tepMauName || '',
      type: 'Hệ thống', group: 'Cấu hình', dataType: 'Text', value: '', unit: '', description: '',
      createdDate: isEdit ? (mockStore.getConfigFile(id)?.createdDate || new Date().toISOString().slice(0, 10)) : new Date().toISOString().slice(0, 10),
      createdBy: 'admin',
    });
    navigate('/config-files');
  };

  /* custom field ops */
  const addField    = () => hf('cauHinhTruong', [...form.cauHinhTruong, makeField()]);
  const updateField = (fid, key, val) =>
    hf('cauHinhTruong', form.cauHinhTruong.map(f => f._fid === fid ? { ...f, [key]: val } : f));
  const copyField   = (f) => hf('cauHinhTruong', [...form.cauHinhTruong, { ...f, _fid: _fid++ }]);
  const deleteField = (fid) => hf('cauHinhTruong', form.cauHinhTruong.filter(f => f._fid !== fid));

  /* style helpers */
  const lbl = { fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px', display: 'block' };
  const inp = (err) => ({
    width: '100%', padding: '9px 12px', border: `1px solid ${err ? '#fca5a5' : '#e2e8f0'}`,
    borderRadius: '8px', fontSize: '14px', color: '#1e293b',
    background: err ? '#fff5f5' : '#fff', outline: 'none', boxSizing: 'border-box',
  });
  const th = { padding: '10px 14px', textAlign: 'left', fontWeight: '600', fontSize: '12px', color: '#475569', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' };
  const td = { padding: '8px 14px', borderBottom: '1px solid #f1f5f9', verticalAlign: 'middle' };
  const fi = { width: '100%', padding: '6px 9px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13px', color: '#374151', outline: 'none', boxSizing: 'border-box' };

  return (
    <div className="contract-page-container">

      {/* ── Header ── */}
      <div className="contract-page-header">
        <div className="contract-header-left">
          <button onClick={() => navigate('/config-files')} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '13px', marginBottom: '6px', padding: 0 }}>
            <ArrowLeft size={15} /> Quay lại danh sách
          </button>
          <h1 style={{ margin: 0 }}>{isEdit ? 'Chỉnh sửa cấu hình file' : 'Tạo mới cấu hình file'}</h1>
        </div>
        <div className="contract-header-right" style={{ gap: '10px' }}>
          <button onClick={handleExportBien} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', border: '1px solid #2563eb', borderRadius: '8px', background: '#eff6ff', color: '#2563eb', fontSize: '14px', cursor: 'pointer', fontWeight: '500' }}>
            <Download size={15} /> Xuất danh sách biến
          </button>
          <button onClick={() => navigate('/config-files')} style={{ padding: '9px 18px', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#fff', color: '#374151', fontSize: '14px', cursor: 'pointer', fontWeight: '500' }}>
            Hủy
          </button>
          <button onClick={handleSave} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Save size={16} /> {isEdit ? 'Lưu thay đổi' : 'Tạo cấu hình'}
          </button>
        </div>
      </div>

      {/* ── Main form card ── */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

          {/* Menu */}
          <div>
            <label style={lbl}>Menu <span style={{ color: '#EE0033' }}>*</span></label>
            <div style={{ position: 'relative' }}>
              <select value={form.menu} onChange={e => hf('menu', e.target.value)}
                style={{ ...inp(errors.menu), paddingRight: '32px', appearance: 'none', cursor: 'pointer' }}>
                <option value="">-- Chọn menu --</option>
                {MENU_OPTIONS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <ChevronDown size={14} color="#9ca3af" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            </div>
            {errors.menu && <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#dc2626' }}>{errors.menu}</p>}
          </div>

          {/* Tệp mẫu */}
          <div>
            <label style={lbl}>Tệp mẫu</label>
            <div
              onClick={() => tepMauRef.current?.click()}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', border: '1px dashed #cbd5e1', borderRadius: '8px', cursor: 'pointer', background: '#f8fafc', minHeight: '40px' }}
              onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
              onMouseLeave={e => e.currentTarget.style.background = '#f8fafc'}
            >
              <FileText size={16} color="#64748b" />
              <span style={{ fontSize: '13px', color: tepMauFile?.name || form.tepMauName ? '#1e293b' : '#94a3b8', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {tepMauFile?.name || form.tepMauName || 'Tải lên tệp mẫu (PDF, Word, Excel)…'}
              </span>
              <Upload size={14} color="#94a3b8" />
            </div>
            <input ref={tepMauRef} type="file" accept=".pdf,.doc,.docx,.xls,.xlsx"
              style={{ display: 'none' }}
              onChange={e => { const f = e.target.files?.[0]; if (f) setTepMauFile(f); }} />
            <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#94a3b8' }}>Định dạng: PDF, Word (.doc/.docx), Excel (.xls/.xlsx)</p>
          </div>

          {/* SPDV */}
          <div>
            <label style={lbl}>SPDV</label>
            <MultiSelect value={form.spdv} options={SPDV_OPTIONS}
              onChange={v => hf('spdv', v)} placeholder="Chọn sản phẩm / dịch vụ..." />
          </div>

          {/* Đơn vị áp dụng */}
          <div>
            <label style={lbl}>Đơn vị áp dụng</label>
            <MultiSelect value={form.donViApDung} options={DONVI_OPTIONS}
              onChange={v => hf('donViApDung', v)} placeholder="Chọn đơn vị áp dụng..." />
          </div>

          {/* Loại chứng từ */}
          <div>
            <label style={lbl}>Loại chứng từ</label>
            <div style={{ position: 'relative' }}>
              <select value={form.loaiChungTu} onChange={e => hf('loaiChungTu', e.target.value)}
                style={{ ...inp(false), paddingRight: '32px', appearance: 'none', cursor: 'pointer' }}>
                <option value="">-- Chọn loại chứng từ --</option>
                {LOAI_CHUNG_TU_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
              <ChevronDown size={14} color="#9ca3af" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            </div>
          </div>

          {/* Trạng thái */}
          <div>
            <label style={lbl}>Trạng thái</label>
            <div style={{ display: 'flex', gap: '20px', paddingTop: '10px' }}>
              {['Hiệu lực', 'Không hiệu lực'].map(s => (
                <label key={s} style={{ display: 'flex', alignItems: 'center', gap: '7px', cursor: 'pointer', fontSize: '14px', color: '#374151' }}>
                  <input type="radio" name="trangThai" value={s}
                    checked={form.trangThai === s} onChange={() => hf('trangThai', s)}
                    style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#EE0033' }} />
                  {s}
                </label>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── DL tự định nghĩa section ── */}
      <div style={{ marginTop: '16px', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>

        {/* Clickable header */}
        <div
          onClick={() => setDlOpen(o => !o)}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', cursor: 'pointer', userSelect: 'none', background: dlOpen ? '#f8fafc' : '#fff', borderBottom: dlOpen ? '1px solid #e2e8f0' : 'none' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b' }}>DL TỰ ĐỊNH NGHĨA</span>
            {form.cauHinhTruong.length > 0 && (
              <span style={{ padding: '2px 9px', background: '#dbeafe', color: '#1d4ed8', borderRadius: '10px', fontSize: '12px', fontWeight: '600' }}>
                {form.cauHinhTruong.length} trường
              </span>
            )}
          </div>
          <ChevronDown size={18} color="#94a3b8"
            style={{ transform: dlOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />
        </div>

        {/* Expanded content */}
        {dlOpen && (
          <div style={{ padding: '16px 24px' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', minWidth: '640px' }}>
                <thead>
                  <tr>
                    <th style={{ ...th, width: '48px', textAlign: 'center' }}>STT</th>
                    <th style={th}>Tên trường</th>
                    <th style={th}>Tên hiển thị</th>
                    <th style={{ ...th, width: '130px' }}>Số TT hiển thị</th>
                    <th style={{ ...th, width: '100px', textAlign: 'center' }}>Trạng thái</th>
                    <th style={{ ...th, width: '80px', textAlign: 'center' }}>Tác vụ</th>
                  </tr>
                </thead>
                <tbody>
                  {form.cauHinhTruong.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: '28px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
                        Chưa có trường nào. Nhấn "+ Thêm trường" để bắt đầu.
                      </td>
                    </tr>
                  ) : form.cauHinhTruong.map((f, idx) => (
                    <tr key={f._fid}
                      onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                      onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                    >
                      <td style={{ ...td, textAlign: 'center', color: '#64748b' }}>{idx + 1}</td>
                      <td style={td}>
                        <input value={f.tenTruong} onChange={e => updateField(f._fid, 'tenTruong', e.target.value)}
                          placeholder="vd: so_hop_dong" style={fi} />
                      </td>
                      <td style={td}>
                        <input value={f.tenHienThi} onChange={e => updateField(f._fid, 'tenHienThi', e.target.value)}
                          placeholder="vd: Số hợp đồng" style={fi} />
                      </td>
                      <td style={td}>
                        <input value={f.stt} type="number" min="1"
                          onChange={e => updateField(f._fid, 'stt', e.target.value)}
                          placeholder="1" style={fi} />
                      </td>
                      <td style={{ ...td, textAlign: 'center' }}>
                        <Toggle value={f.trangThai} onChange={v => updateField(f._fid, 'trangThai', v)} />
                      </td>
                      <td style={{ ...td, textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                          <button onClick={() => copyField(f)} title="Sao chép"
                            style={{ padding: '4px 5px', background: '#f1f5f9', border: 'none', borderRadius: '5px', cursor: 'pointer', color: '#64748b', lineHeight: 1 }}
                            onMouseEnter={e => e.currentTarget.style.color = '#1e293b'}
                            onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
                          ><Copy size={13} /></button>
                          <button onClick={() => deleteField(f._fid)} title="Xóa"
                            style={{ padding: '4px 5px', background: '#fee2e2', border: 'none', borderRadius: '5px', cursor: 'pointer', color: '#dc2626', lineHeight: 1 }}
                          ><Trash2 size={13} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button onClick={addField} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px', background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontSize: '13px', fontWeight: '600', padding: '4px 0' }}>
              <Plus size={14} /> Thêm trường
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
