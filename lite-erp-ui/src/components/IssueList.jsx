import React, { useState, useMemo, useEffect, useRef } from 'react';
import './IssueList.css';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Plus, 
  Download, 
  LayoutGrid, 
  List, 
  ChevronLeft, 
  ChevronRight,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Calendar,
  X,
  Trash2,
  Check,
  AlertCircle,
  MessageSquareWarning,
  Eye,
  Edit,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Settings,
  SlidersHorizontal,
  ExternalLink
} from 'lucide-react';
import { QueryBuilder } from './QueryBuilder';
import { evaluateQuery } from '../utils/filterUtils';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import * as XLSX from 'xlsx';

// Initial dataset for Phản ánh khách hàng (PAKH)
const INITIAL_ISSUES = [
  {
    id: 1,
    maKhieuNai: 'PAKH-2026-001',
    nguoiPhanAnh: 'Trần Văn Minh',
    donViPhanAnh: 'Viettel Telecom (VTT)',
    reporter: 'Lê Văn Hưng',
    createdDate: '27/08/2026',
    dueDate: '28/08/2026',
    nhanVienTiepNhan: 'Lê Văn Hưng',
    kenhTiepNhan: 'Hotline',
    ngayTiepNhan: '27/08/2026',
    gioTiepNhan: '09:30',
    mucDoUuTien: 'Critical',
    nhomSpDv: 'CC Outsourcing',
    loaiSpDv: 'FO',
    nhomPhanAnh: 'PA về hợp đồng, chính sách kinh doanh, tài chính',
    theLoai: 'Phạm vi hợp đồng',
    noiDungKhieuNai: 'Khiếu nại về phạm vi bàn giao dịch vụ FO và đối soát cước tháng 8 chưa khớp với phụ lục hợp đồng',
    capDoCanhBao: 'Cấp 1',
    thoiHanXuLy: '24h',
    ngayHenXuLy: '28/08/2026',
    hinhThucPhanHoi: 'HPC',
    sdtDiaChiPhanHoi: '0988123456 / minh.tv@vtt.vn',
    noiDungXuLy: 'Đã chuyển thông tin tới Trưởng bộ phận FO để rà soát lại phụ lục hợp đồng',
    donViXuLy: 'Trung tâm Vận hành FO',
    trangThaiPhanAnh: 'Tiếp nhận mới',
    nguoiXuLyCuoi: 'Lê Văn Hưng',
    ngayDongPhanAnh: '-',
    gioDongPhanAnh: '-',
    tienDoXuLy: 'Trong hạn',
    status: 'todo'
  },
  {
    id: 2,
    maKhieuNai: 'PAKH-2026-002',
    nguoiPhanAnh: 'Nguyễn Thị Mai',
    donViPhanAnh: 'Viettel Solutions (VTS)',
    reporter: 'Nguyễn Thị Lan',
    createdDate: '26/08/2026',
    dueDate: '28/08/2026',
    nhanVienTiepNhan: 'Nguyễn Thị Lan',
    kenhTiepNhan: 'Website',
    ngayTiepNhan: '26/08/2026',
    gioTiepNhan: '14:15',
    mucDoUuTien: 'High',
    nhomSpDv: 'CC Outsourcing',
    loaiSpDv: 'BO',
    nhomPhanAnh: 'PA về hợp đồng, chính sách kinh doanh, tài chính',
    theLoai: 'Chính sách kinh doanh',
    noiDungKhieuNai: 'Phản ánh áp dụng chính sách chiết khấu dịch vụ BO chưa cập nhật theo biểu giá mới Q3',
    capDoCanhBao: 'Cấp 2',
    thoiHanXuLy: '48h',
    ngayHenXuLy: '28/08/2026',
    hinhThucPhanHoi: 'Email',
    sdtDiaChiPhanHoi: '0912345678 / mai.nt@vts.vn',
    noiDungXuLy: 'Đang kiểm tra dữ liệu tính cước với Ban Kế hoạch Kinh doanh',
    donViXuLy: 'Phòng Chính sách Khách hàng',
    trangThaiPhanAnh: 'Đang xử lý',
    nguoiXuLyCuoi: 'Trần Minh Hải',
    ngayDongPhanAnh: '-',
    gioDongPhanAnh: '-',
    tienDoXuLy: 'Ngoài hạn',
    status: 'processing'
  },
  {
    id: 3,
    maKhieuNai: 'PAKH-2026-003',
    nguoiPhanAnh: 'Hoàng Quốc Tuấn',
    donViPhanAnh: 'Viettel Cyber Security (VCS)',
    reporter: 'Trần Minh Hải',
    createdDate: '25/08/2026',
    dueDate: '28/08/2026',
    nhanVienTiepNhan: 'Trần Minh Hải',
    kenhTiepNhan: 'Zalo OA',
    ngayTiepNhan: '25/08/2026',
    gioTiepNhan: '10:45',
    mucDoUuTien: 'Medium',
    nhomSpDv: 'CC Outsourcing',
    loaiSpDv: 'Toàn trình',
    nhomPhanAnh: 'PA về hợp đồng, chính sách kinh doanh, tài chính',
    theLoai: 'Khác',
    noiDungKhieuNai: 'Khách hàng gửi yêu cầu hủy phản ánh do đã tự thỏa thuận với bộ phận kinh doanh',
    capDoCanhBao: 'Cấp 3',
    thoiHanXuLy: '72h',
    ngayHenXuLy: '28/08/2026',
    hinhThucPhanHoi: 'Văn bản',
    sdtDiaChiPhanHoi: '0977654321 / tuan.hq@vcs.vn',
    noiDungXuLy: 'Xác nhận khách hàng rút phản ánh khiếu nại, lưu hồ sơ',
    donViXuLy: 'Bộ phận CSKH Toàn trình',
    trangThaiPhanAnh: 'Hủy phản ánh',
    nguoiXuLyCuoi: 'Trần Minh Hải',
    ngayDongPhanAnh: '26/08/2026',
    gioDongPhanAnh: '11:00',
    tienDoXuLy: '-',
    status: 'cancelled'
  },
  {
    id: 4,
    maKhieuNai: 'PAKH-2026-004',
    nguoiPhanAnh: 'Phạm Thu Hằng',
    donViPhanAnh: 'Viettel Post (VTP)',
    reporter: 'Lê Văn Hưng',
    createdDate: '24/08/2026',
    dueDate: '25/08/2026',
    nhanVienTiepNhan: 'Lê Văn Hưng',
    kenhTiepNhan: 'Email',
    ngayTiepNhan: '24/08/2026',
    gioTiepNhan: '08:20',
    mucDoUuTien: 'Critical',
    nhomSpDv: 'CC Outsourcing',
    loaiSpDv: 'FO',
    nhomPhanAnh: 'PA về kỹ thuật, hạ tầng trạm',
    theLoai: 'Phạm vi hợp đồng',
    noiDungKhieuNai: 'Sự cố kết nối hệ thống tổng đài kéo dài quá thời gian cam kết trong SLA hợp đồng',
    capDoCanhBao: 'Cấp 1',
    thoiHanXuLy: '24h',
    ngayHenXuLy: '25/08/2026',
    hinhThucPhanHoi: 'HPC',
    sdtDiaChiPhanHoi: '0903112233 / hang.pt@vtt.vn',
    noiDungXuLy: 'Đã hoàn tất đo kiểm và gửi biên bản khắc phục sự cố cho đại diện VTP',
    donViXuLy: 'Trung tâm Vận hành FO',
    trangThaiPhanAnh: 'Đã hoàn thành',
    nguoiXuLyCuoi: 'Nguyễn Văn Nam',
    ngayDongPhanAnh: '25/08/2026',
    gioDongPhanAnh: '09:15',
    tienDoXuLy: 'Trong hạn',
    status: 'done'
  },
  {
    id: 5,
    maKhieuNai: 'PAKH-2026-005',
    nguoiPhanAnh: 'Đặng Đình Huy',
    donViPhanAnh: 'Viettel High Tech (VHT)',
    reporter: 'Nguyễn Thị Lan',
    createdDate: '27/08/2026',
    dueDate: '29/08/2026',
    nhanVienTiepNhan: 'Nguyễn Thị Lan',
    kenhTiepNhan: 'Cổng Portal',
    ngayTiepNhan: '27/08/2026',
    gioTiepNhan: '11:10',
    mucDoUuTien: 'High',
    nhomSpDv: 'Phần mềm ERP',
    loaiSpDv: 'SaaS',
    nhomPhanAnh: 'Chức năng hệ thống',
    theLoai: 'Lỗi phát sinh',
    noiDungKhieuNai: 'Gặp lỗi đồng bộ dữ liệu hóa đơn điện tử khi xuất báo cáo cuối tháng',
    capDoCanhBao: 'Cấp 2',
    thoiHanXuLy: '48h',
    ngayHenXuLy: '29/08/2026',
    hinhThucPhanHoi: 'Email',
    sdtDiaChiPhanHoi: '0934567890 / huy.dd@vht.vn',
    noiDungXuLy: 'Đội ngũ kỹ thuật đang kiểm tra API gateway và cấp patch hotfix',
    donViXuLy: 'Ban Kỹ thuật Phần mềm',
    trangThaiPhanAnh: 'Đang xử lý',
    nguoiXuLyCuoi: 'Phạm Đức Long',
    ngayDongPhanAnh: '-',
    gioDongPhanAnh: '-',
    tienDoXuLy: 'Trong hạn',
    status: 'processing'
  }
];

const PAKH_COLUMNS = [
  { key: 'maKhieuNai', label: 'Mã khiếu nại', width: '130px', defaultVisible: true },
  { key: 'trangThaiPhanAnh', label: 'Trạng thái phản ánh', width: '160px', defaultVisible: true },
  { key: 'tienDoXuLy', label: 'Tiến độ xử lý', width: '140px', defaultVisible: true },
  { key: 'nguoiPhanAnh', label: 'Người phản ánh', width: '150px', defaultVisible: true },
  { key: 'donViPhanAnh', label: 'Đơn vị phản ánh', width: '180px', defaultVisible: true },
  { key: 'nhanVienTiepNhan', label: 'Nhân viên tiếp nhận', width: '160px', defaultVisible: true },
  { key: 'kenhTiepNhan', label: 'Kênh tiếp nhận', width: '130px', defaultVisible: true },
  { key: 'ngayTiepNhan', label: 'Ngày tiếp nhận', width: '130px', defaultVisible: true },
  { key: 'gioTiepNhan', label: 'Giờ tiếp nhận', width: '110px', defaultVisible: false },
  { key: 'mucDoUuTien', label: 'Mức độ ưu tiên', width: '140px', defaultVisible: true },
  { key: 'nhomSpDv', label: 'Nhóm SP/DV', width: '160px', defaultVisible: true },
  { key: 'loaiSpDv', label: 'Loại SP/DV', width: '120px', defaultVisible: true },
  { key: 'nhomPhanAnh', label: 'Nhóm phản ánh', width: '220px', defaultVisible: true },
  { key: 'theLoai', label: 'Thể loại', width: '150px', defaultVisible: true },
  { key: 'noiDungKhieuNai', label: 'Nội dung khiếu nại', width: '250px', defaultVisible: true },
  { key: 'capDoCanhBao', label: 'Cấp độ cảnh báo', width: '140px', defaultVisible: true },
  { key: 'thoiHanXuLy', label: 'Thời hạn xử lý', width: '120px', defaultVisible: true },
  { key: 'ngayHenXuLy', label: 'Ngày hẹn xử lý', width: '130px', defaultVisible: true },
  { key: 'hinhThucPhanHoi', label: 'Hình thức phản hồi', width: '150px', defaultVisible: true },
  { key: 'sdtDiaChiPhanHoi', label: 'SĐT/Địa chỉ phản hồi', width: '180px', defaultVisible: true },
  { key: 'noiDungXuLy', label: 'Nội dung xử lý', width: '240px', defaultVisible: true },
  { key: 'donViXuLy', label: 'Đơn vị xử lý', width: '180px', defaultVisible: true },
  { key: 'nguoiXuLyCuoi', label: 'Người xử lý cuối', width: '160px', defaultVisible: false },
  { key: 'ngayDongPhanAnh', label: 'Ngày đóng phản ánh', width: '140px', defaultVisible: false },
  { key: 'gioDongPhanAnh', label: 'Giờ đóng phản ánh', width: '120px', defaultVisible: false }
];

const PAKH_EXPORT_COLUMNS = PAKH_COLUMNS;

// Custom Multi-Select with blank default & placeholder
function MultiSelect({ options = [], selected = [], onChange, placeholder = 'Chọn...' }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const safeSelected = Array.isArray(selected) ? selected : [];
  const normalizedOptions = (options || []).map(opt => 
    typeof opt === 'object' ? opt : { value: opt, label: opt }
  );

  const handleToggleItem = (val, e) => {
    e.stopPropagation();
    let currentSelected = [...safeSelected];
    if (currentSelected.includes(val)) {
      currentSelected = currentSelected.filter(v => v !== val);
    } else {
      currentSelected.push(val);
    }
    onChange(currentSelected);
  };

  const displayText = useMemo(() => {
    if (safeSelected.length === 0) {
      return placeholder;
    }
    if (safeSelected.length === 1) {
      const found = normalizedOptions.find(o => o.value === safeSelected[0]);
      return found ? found.label : safeSelected[0];
    }
    return `${safeSelected.length} đã chọn`;
  }, [safeSelected, normalizedOptions, placeholder]);

  const isPlaceholder = safeSelected.length === 0;

  return (
    <div className="ab-adv-multiselect-container" ref={dropdownRef} onClick={(e) => e.stopPropagation()}>
      <div 
        className={`ab-adv-multiselect-trigger ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          color: isPlaceholder ? '#94a3b8' : '#1e293b'
        }}
      >
        <span className="ab-adv-multiselect-label">{displayText}</span>
        <ChevronDown size={15} color="#94a3b8" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} />
      </div>

      {isOpen && (
        <div className="ab-adv-multiselect-dropdown" onClick={e => e.stopPropagation()}>
          {normalizedOptions.map(opt => {
            const isChecked = safeSelected.includes(opt.value);
            return (
              <label 
                key={opt.value}
                className="ab-adv-multiselect-item"
                onClick={(e) => handleToggleItem(opt.value, e)}
              >
                <input 
                  type="checkbox"
                  className="ab-filter-checkbox"
                  checked={isChecked}
                  onChange={() => {}}
                />
                <span>{opt.label}</span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function IssueList() {
  const navigate = useNavigate();
  const [issues, setIssues] = useState(() => {
    try {
      const stored = localStorage.getItem('ha_pakh_issues');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed.map(item => ({
            ...item,
            gioTiepNhan: item.gioTiepNhan || '09:00',
            nguoiXuLyCuoi: item.nguoiXuLyCuoi || item.reporter || 'Lê Văn Hưng',
            ngayDongPhanAnh: item.ngayDongPhanAnh || (item.trangThaiPhanAnh === 'Đã hoàn thành' || item.trangThaiPhanAnh === 'Hủy phản ánh' ? '26/08/2026' : '-'),
            gioDongPhanAnh: item.gioDongPhanAnh || (item.trangThaiPhanAnh === 'Đã hoàn thành' || item.trangThaiPhanAnh === 'Hủy phản ánh' ? '11:00' : '-')
          }));
        }
      }
      localStorage.setItem('ha_pakh_issues', JSON.stringify(INITIAL_ISSUES));
      return INITIAL_ISSUES;
    } catch {
      return INITIAL_ISSUES;
    }
  });

  useEffect(() => {
    const handleUpdate = () => {
      try {
        const stored = localStorage.getItem('ha_pakh_issues');
        if (stored) setIssues(JSON.parse(stored));
      } catch (e) {
        console.error(e);
      }
    };
    window.addEventListener('ha_pakh_updated', handleUpdate);
    return () => window.removeEventListener('ha_pakh_updated', handleUpdate);
  }, []);
  const [viewMode, setViewMode] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdvSearchExpanded, setIsAdvSearchExpanded] = useState(false);
  
  const initialSearchFilters = {
    keyword: '',
    nguoiPhanAnh: '',
    mucDoUuTien: [],
    ngayTiepNhan: '',
    nhomSpDv: [],
    tenSpDv: [],
    capDoCanhBao: [],
    trangThaiPhanAnh: [],
    tienDoXuLy: []
  };
  const [searchFilters, setSearchFilters] = useState(initialSearchFilters);

  const uniqueNhomSpList = useMemo(() => {
    const list = Array.from(new Set(issues.map(i => i.nhomSpDv).filter(Boolean)));
    return list.length > 0 ? list : ['CC Outsourcing', 'Phần mềm ERP', 'Hạ tầng Cloud', 'An ninh mạng'];
  }, [issues]);

  const uniqueTenSpList = useMemo(() => {
    const list = Array.from(new Set(issues.map(i => i.tenSpDv || i.loaiSpDv).filter(Boolean)));
    return list.length > 0 ? list : ['FO', 'BO', 'Toàn trình', 'SaaS', 'On-Premise'];
  }, [issues]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [visibleColumns, setVisibleColumns] = useState(() => {
    try {
      const stored = localStorage.getItem('ha_pakh_visible_cols_v2');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const allColKeys = PAKH_COLUMNS.map(c => c.key);
          const valid = allColKeys.filter(k => parsed.includes(k));
          if (valid.length > 0) return valid;
        }
      }
      return PAKH_COLUMNS.filter(c => c.defaultVisible !== false).map(c => c.key);
    } catch {
      return PAKH_COLUMNS.filter(c => c.defaultVisible !== false).map(c => c.key);
    }
  });
  const [showColConfigModal, setShowColConfigModal] = useState(false);
  const [colConfigPos, setColConfigPos] = useState({ top: 150, right: 20 });
  const [columnFilters, setColumnFilters] = useState({});
  const [activeFilterCol, setActiveFilterCol] = useState(null);
  const [filterSearchTerm, setFilterSearchTerm] = useState('');

  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterPriority, setFilterPriority] = useState('ALL');

  const [exportSelectedCols, setExportSelectedCols] = useState([
    'maKhieuNai', 'nguoiPhanAnh', 'donViPhanAnh', 'nhanVienTiepNhan',
    'mucDoUuTien', 'nhomSpDv', 'noiDungKhieuNai', 'trangThaiPhanAnh', 'tienDoXuLy'
  ]);

  // New Issue Form State
  const [newIssue, setNewIssue] = useState({
    maKhieuNai: `PAKH-2026-00${issues.length + 1}`,
    nguoiPhanAnh: '',
    donViPhanAnh: '',
    nhanVienTiepNhan: 'Lê Văn Hưng',
    kenhTiepNhan: 'Hotline',
    ngayTiepNhan: new Date().toLocaleDateString('vi-VN'),
    gioTiepNhan: '09:00',
    mucDoUuTien: 'High',
    nhomSpDv: 'CC Outsourcing',
    loaiSpDv: 'FO',
    nhomPhanAnh: 'PA về hợp đồng, chính sách kinh doanh, tài chính',
    theLoai: 'Phạm vi hợp đồng',
    noiDungKhieuNai: '',
    capDoCanhBao: 'Cấp 1',
    thoiHanXuLy: '24h',
    ngayHenXuLy: '',
    hinhThucPhanHoi: 'HPC',
    sdtDiaChiPhanHoi: '',
    noiDungXuLy: '',
    donViXuLy: 'Trung tâm Vận hành FO',
    trangThaiPhanAnh: 'Tiếp nhận mới',
    nguoiXuLyCuoi: 'Lê Văn Hưng',
    ngayDongPhanAnh: '-',
    gioDongPhanAnh: '-',
    tienDoXuLy: 'Trong hạn',
    status: 'todo'
  });

  // KPI Metrics Calculation
  const metrics = useMemo(() => {
    const total = issues.length;
    const newItems = issues.filter(i => i.trangThaiPhanAnh === 'Tiếp nhận mới').length;
    const processing = issues.filter(i => i.trangThaiPhanAnh === 'Đang xử lý').length;
    const overdue = issues.filter(i => i.tienDoXuLy === 'Ngoài hạn').length;
    const completed = issues.filter(i => i.trangThaiPhanAnh === 'Đã hoàn thành').length;
    return { total, newItems, processing, overdue, completed };
  }, [issues]);

  // Filtering & Sorting
  const filteredData = useMemo(() => {
    let result = [...issues];

    // General keyword search
    const q = (searchFilters.keyword || searchTerm).trim().toLowerCase();
    if (q) {
      result = result.filter(item => 
        (item.maKhieuNai && item.maKhieuNai.toLowerCase().includes(q)) ||
        (item.nguoiPhanAnh && item.nguoiPhanAnh.toLowerCase().includes(q)) ||
        (item.donViPhanAnh && item.donViPhanAnh.toLowerCase().includes(q)) ||
        (item.noiDungKhieuNai && item.noiDungKhieuNai.toLowerCase().includes(q)) ||
        (item.nhanVienTiepNhan && item.nhanVienTiepNhan.toLowerCase().includes(q))
      );
    }

    // 1. Người phản ánh (Text substring match)
    if (searchFilters.nguoiPhanAnh.trim()) {
      const v = searchFilters.nguoiPhanAnh.trim().toLowerCase();
      result = result.filter(item => item.nguoiPhanAnh && item.nguoiPhanAnh.toLowerCase().includes(v));
    }

    // 2. Ngày tiếp nhận (Date match)
    if (searchFilters.ngayTiepNhan) {
      const parts = searchFilters.ngayTiepNhan.split('-');
      const ddmmyyyy = parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : '';
      result = result.filter(item => 
        item.ngayTiepNhan && (
          item.ngayTiepNhan.includes(searchFilters.ngayTiepNhan) ||
          (ddmmyyyy && item.ngayTiepNhan.includes(ddmmyyyy))
        )
      );
    }

    // Multiselect dropdown columns helper (blank = match all)
    const matchMulti = (selectedVals, itemVal) => {
      if (!selectedVals || selectedVals.length === 0) return true;
      return selectedVals.includes(itemVal);
    };

    result = result.filter(item => {
      // 3. Mức độ ưu tiên
      if (!matchMulti(searchFilters.mucDoUuTien, item.mucDoUuTien)) return false;
      // 4. Nhóm SPDV
      if (!matchMulti(searchFilters.nhomSpDv, item.nhomSpDv)) return false;
      // 5. Tên SPDV
      if (!matchMulti(searchFilters.tenSpDv, item.tenSpDv || item.loaiSpDv)) return false;
      // 6. Cấp độ cảnh báo
      if (!matchMulti(searchFilters.capDoCanhBao, item.capDoCanhBao)) return false;
      // 7. Trạng thái phản ánh
      if (!matchMulti(searchFilters.trangThaiPhanAnh, item.trangThaiPhanAnh)) return false;
      // 8. Tiến độ xử lý
      if (!matchMulti(searchFilters.tienDoXuLy, item.tienDoXuLy)) return false;
      return true;
    });

    // Column-level popover filters
    Object.entries(columnFilters).forEach(([colKey, selectedList]) => {
      if (selectedList && selectedList.length > 0) {
        result = result.filter(item => {
          let val = item[colKey];
          if (colKey === 'nhanVienTiepNhan') val = item.nhanVienTiepNhan || item.reporter;
          return selectedList.includes(String(val || ''));
        });
      }
    });

    if (sortConfig.key) {
      result.sort((a, b) => {
        const valA = a[sortConfig.key] || '';
        const valB = b[sortConfig.key] || '';
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [issues, searchTerm, searchFilters, columnFilters, sortConfig]);

  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    else if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = null;
      key = null;
    }
    setSortConfig({ key, direction });
  };

  const handleToggleExportCol = (key) => {
    setExportSelectedCols(prev => 
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const handleExecuteExport = () => {
    if (exportSelectedCols.length === 0) {
      alert('Vui lòng chọn ít nhất 1 trường để xuất dữ liệu!');
      return;
    }

    const exportData = filteredData.map(item => {
      const row = {};
      PAKH_EXPORT_COLUMNS.forEach(col => {
        if (exportSelectedCols.includes(col.key)) {
          row[col.label] = item[col.key] || '';
        }
      });
      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Phan_Anh_Khach_Hang");
    XLSX.writeFile(workbook, "Danh_sach_Phan_anh_khach_hang.xlsx");
    setShowExportModal(false);
  };

  const handleCreateIssue = (e) => {
    e.preventDefault();
    if (!newIssue.nguoiPhanAnh || !newIssue.noiDungKhieuNai) {
      alert('Vui lòng điền Người phản ánh và Nội dung khiếu nại!');
      return;
    }
    const createdItem = {
      ...newIssue,
      id: Date.now(),
      createdDate: new Date().toLocaleDateString('vi-VN'),
      dueDate: newIssue.ngayHenXuLy || '29/08/2026'
    };
    setIssues([createdItem, ...issues]);
    setShowAddModal(false);
    setNewIssue({
      maKhieuNai: `PAKH-2026-00${issues.length + 2}`,
      nguoiPhanAnh: '',
      donViPhanAnh: '',
      nhanVienTiepNhan: 'Lê Văn Hưng',
      kenhTiepNhan: 'Hotline',
      ngayTiepNhan: new Date().toLocaleDateString('vi-VN'),
      gioTiepNhan: '09:00',
      mucDoUuTien: 'High',
      nhomSpDv: 'CC Outsourcing',
      loaiSpDv: 'FO',
      nhomPhanAnh: 'PA về hợp đồng, chính sách kinh doanh, tài chính',
      theLoai: 'Phạm vi hợp đồng',
      noiDungKhieuNai: '',
      capDoCanhBao: 'Cấp 1',
      thoiHanXuLy: '24h',
      ngayHenXuLy: '',
      hinhThucPhanHoi: 'HPC',
      sdtDiaChiPhanHoi: '',
      donViXuLy: 'Trung tâm Vận hành FO',
      trangThaiPhanAnh: 'Tiếp nhận mới',
      tienDoXuLy: 'Trong hạn',
      status: 'todo'
    });
  };

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const statusMap = {
      'todo': 'Tiếp nhận mới',
      'processing': 'Đang xử lý',
      'done': 'Đã hoàn thành',
      'cancelled': 'Hủy phản ánh'
    };

    const updated = [...issues];
    const idx = updated.findIndex(i => i.id.toString() === draggableId.toString());
    if (idx !== -1) {
      updated[idx].status = destination.droppableId;
      updated[idx].trangThaiPhanAnh = statusMap[destination.droppableId] || updated[idx].trangThaiPhanAnh;
      setIssues(updated);
    }
  };

  const renderPakhPriority = (priority) => {
    if (priority === 'Critical') return <span className="ab-pakh-badge badge-critical">Critical</span>;
    if (priority === 'High') return <span className="ab-pakh-badge badge-high">High</span>;
    if (priority === 'Medium') return <span className="ab-pakh-badge badge-medium">Medium</span>;
    return <span className="ab-pakh-badge badge-low">{priority || 'Low'}</span>;
  };

  const renderPakhWarningLevel = (level) => {
    if (level === 'Cấp 1') return <span className="ab-pakh-badge badge-warn-1">Cấp 1</span>;
    if (level === 'Cấp 2') return <span className="ab-pakh-badge badge-warn-2">Cấp 2</span>;
    if (level === 'Cấp 3') return <span className="ab-pakh-badge badge-warn-3">Cấp 3</span>;
    return <span>{level || '-'}</span>;
  };

  const renderPakhStatus = (status) => {
    if (status === 'Tiếp nhận mới') return <span className="ab-pakh-badge badge-status-new">Tiếp nhận mới</span>;
    if (status === 'Đang xử lý') return <span className="ab-pakh-badge badge-status-proc">Đang xử lý</span>;
    if (status === 'Xử lý xong' || status === 'Đã hoàn thành' || status === 'Đã xử lý') return <span className="ab-pakh-badge badge-status-done">Xử lý xong</span>;
    if (status === 'Đóng') return <span className="ab-pakh-badge badge-status-cancel">Đóng</span>;
    if (status === 'Hủy phản ánh') return <span className="ab-pakh-badge badge-status-cancel" style={{ background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5' }}>Hủy phản ánh</span>;
    return <span className="ab-pakh-badge">{status || '-'}</span>;
  };

  const renderPakhProgress = (progress) => {
    if (progress === 'Trong hạn') return <span className="ab-pakh-badge badge-ontime">Trong hạn</span>;
    if (progress === 'Ngoài hạn') return <span className="ab-pakh-badge badge-overdue">Ngoài hạn</span>;
    return <span>{progress || '-'}</span>;
  };

  const handleColumnFilterToggle = (colKey, val) => {
    setColumnFilters(prev => {
      const current = prev[colKey] || [];
      const updated = current.includes(val) 
        ? current.filter(v => v !== val)
        : [...current, val];
      return { ...prev, [colKey]: updated };
    });
  };

  const handleColumnFilterClear = (colKey) => {
    setColumnFilters(prev => ({ ...prev, [colKey]: [] }));
  };

  const handleColumnFilterSelectAll = (colKey, allVals) => {
    setColumnFilters(prev => ({ ...prev, [colKey]: allVals }));
  };

  const renderFilterPopup = (colKey, colLabel) => {
    const rawOptions = Array.from(new Set(issues.map(item => {
      if (colKey === 'nhanVienTiepNhan') return item.nhanVienTiepNhan || item.reporter || '';
      return String(item[colKey] || '');
    }).filter(Boolean)));

    const filteredOptions = filterSearchTerm.trim() 
      ? rawOptions.filter(o => o.toLowerCase().includes(filterSearchTerm.toLowerCase()))
      : rawOptions;

    const selectedList = columnFilters[colKey] || [];

    return (
      <div 
        className="ab-filter-card-popup"
        onClick={(e) => e.stopPropagation()}
        style={{ minWidth: '220px', zIndex: 120 }}
      >
        <div className="ab-filter-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Lọc: <strong>{colLabel}</strong></span>
          <button 
            type="button" 
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '13px' }}
            onClick={() => setActiveFilterCol(null)}
          >
            ✕
          </button>
        </div>

        {rawOptions.length > 5 && (
          <div style={{ padding: '8px 12px 0 12px' }}>
            <input 
              type="text" 
              className="ab-search-field" 
              style={{ height: '30px', fontSize: '12px' }}
              placeholder="Tìm kiếm giá trị..."
              value={filterSearchTerm}
              onChange={(e) => setFilterSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
        )}

        <div style={{ padding: '6px 12px', display: 'flex', justifyContent: 'space-between', fontSize: '11px', borderBottom: '1px solid #f1f5f9' }}>
          <button 
            type="button" 
            style={{ background: 'none', border: 'none', color: '#ee0033', cursor: 'pointer', padding: 0, fontWeight: 600 }}
            onClick={() => handleColumnFilterSelectAll(colKey, rawOptions)}
          >
            Chọn tất cả ({rawOptions.length})
          </button>
          <button 
            type="button" 
            style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 0 }}
            onClick={() => handleColumnFilterClear(colKey)}
          >
            Bỏ chọn
          </button>
        </div>

        <div className="ab-filter-card-body" style={{ maxHeight: '200px', overflowY: 'auto' }}>
          {filteredOptions.map(opt => {
            const isChecked = selectedList.includes(opt);
            return (
              <label 
                key={opt}
                className="ab-filter-option-item"
                onClick={() => handleColumnFilterToggle(colKey, opt)}
              >
                <input 
                  type="checkbox"
                  className="ab-filter-checkbox"
                  checked={isChecked}
                  onChange={() => {}}
                />
                <span style={{ fontSize: '12.5px' }}>{opt}</span>
              </label>
            );
          })}
          {filteredOptions.length === 0 && (
            <div style={{ fontSize: '12px', color: '#94a3b8', padding: '8px', textAlign: 'center' }}>
              Không có dữ liệu
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderCellContent = (item, colKey) => {
    switch (colKey) {
      case 'maKhieuNai':
        return <span className="ab-task-id">{item.maKhieuNai}</span>;
      case 'nguoiPhanAnh':
        return <span style={{ fontWeight: 600, color: '#0f172a' }}>{item.nguoiPhanAnh}</span>;
      case 'donViPhanAnh':
        return <span style={{ fontWeight: 600, color: '#ee0033' }}>{item.donViPhanAnh}</span>;
      case 'nhanVienTiepNhan':
        return item.nhanVienTiepNhan || item.reporter || '-';
      case 'mucDoUuTien':
        return renderPakhPriority(item.mucDoUuTien);
      case 'loaiSpDv':
        return <span style={{ fontWeight: 600, color: '#2563eb' }}>{item.loaiSpDv}</span>;
      case 'theLoai':
        return item.theLoai || '-';
      case 'nhomPhanAnh':
        return <span className="ab-cell-truncate" title={item.nhomPhanAnh}>{item.nhomPhanAnh}</span>;
      case 'noiDungKhieuNai':
        return <span className="ab-cell-truncate" title={item.noiDungKhieuNai}>{item.noiDungKhieuNai}</span>;
      case 'noiDungXuLy':
        return <span className="ab-cell-truncate" title={item.noiDungXuLy}>{item.noiDungXuLy}</span>;
      case 'capDoCanhBao':
        return renderPakhWarningLevel(item.capDoCanhBao);
      case 'trangThaiPhanAnh':
        return renderPakhStatus(item.trangThaiPhanAnh);
      case 'tienDoXuLy':
        return renderPakhProgress(item.tienDoXuLy);
      case 'nguoiXuLyCuoi':
        return <span style={{ fontWeight: 500, color: '#334155' }}>{item.nguoiXuLyCuoi || '-'}</span>;
      case 'gioTiepNhan':
        return item.gioTiepNhan || '-';
      case 'ngayDongPhanAnh':
        return item.ngayDongPhanAnh || '-';
      case 'gioDongPhanAnh':
        return item.gioDongPhanAnh || '-';
      default:
        return item[colKey] || '-';
    }
  };

  return (
    <div className="ab-page-container" onClick={() => setActiveFilterCol(null)}>
      <div className="ab-inner-content">
        
        {/* PAGE TITLE */}
        <div style={{ marginBottom: '20px' }}>
          <h1 className="ab-page-title" style={{ margin: 0 }}>Phản ánh khách hàng</h1>
          <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '13px' }}>
            Quản trị và theo dõi toàn trình tiến độ tiếp nhận, xử lý khiếu nại phản ánh của khách hàng (PAKH)
          </p>
        </div>

        {/* 4 KPI METRIC CARDS */}
        <div className="ab-metrics-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          <div className="ab-metric-card" style={{ borderLeft: '4px solid #3b82f6' }}>
            <span className="ab-metric-label">TỔNG SỐ PHẢN ÁNH</span>
            <span className="ab-metric-value" style={{ color: '#1e293b' }}>{metrics.total}</span>
          </div>
          <div className="ab-metric-card" style={{ borderLeft: '4px solid #f59e0b' }}>
            <span className="ab-metric-label">TIẾP NHẬN MỚI</span>
            <span className="ab-metric-value" style={{ color: '#f59e0b' }}>{metrics.newItems}</span>
          </div>
          <div className="ab-metric-card" style={{ borderLeft: '4px solid #0284c7' }}>
            <span className="ab-metric-label">ĐANG XỬ LÝ</span>
            <span className="ab-metric-value" style={{ color: '#0284c7' }}>{metrics.processing}</span>
          </div>
          <div className="ab-metric-card" style={{ borderLeft: '4px solid #ef4444' }}>
            <span className="ab-metric-label">QUÁ HẠN / TRỄ HẠN</span>
            <span className="ab-metric-value" style={{ color: '#ef4444' }}>{metrics.overdue}</span>
          </div>
        </div>

        {/* MAIN CARD CONTAINER */}
        <div className="ab-main-card">
          
          {/* TOOLBAR & ADVANCED SEARCH */}
          <div className="ab-toolbar" style={{ marginBottom: isAdvSearchExpanded ? '12px' : '20px' }}>
            
            {/* Left: Search & Advanced Filter Toggle */}
            <div className="ab-toolbar-left">
              <div className="ab-search-box">
                <Search size={16} color="#94a3b8" />
                <input 
                  type="text" 
                  className="ab-search-input"
                  placeholder="Tìm kiếm ..." 
                  value={searchFilters.keyword}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, keyword: e.target.value }))}
                />
              </div>

              <button 
                type="button" 
                className={`ab-btn-advanced-filter ${isAdvSearchExpanded ? 'active' : ''}`}
                onClick={() => setIsAdvSearchExpanded(!isAdvSearchExpanded)}
              >
                <Filter size={15} />
                <span>Tìm kiếm nâng cao</span>
                {isAdvSearchExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </div>

            {/* Right: Actions & View Toggle */}
            <div className="ab-toolbar-right">
              {selectedRows.length > 0 && (
                <button 
                  type="button" 
                  className="ab-btn-outline-red"
                  style={{ borderColor: '#ef4444', color: '#ef4444' }}
                  onClick={() => {
                    if (window.confirm(`Xóa ${selectedRows.length} phản ánh đã chọn?`)) {
                      setIssues(prev => {
                        const updated = prev.filter(a => !selectedRows.includes(a.id));
                        localStorage.setItem('ha_pakh_issues', JSON.stringify(updated));
                        return updated;
                      });
                      setSelectedRows([]);
                    }
                  }}
                >
                  <Trash2 size={15} />
                  <span>Xóa ({selectedRows.length})</span>
                </button>
              )}

              <button 
                type="button" 
                className="ab-btn-outline-red"
                onClick={() => navigate('/pakh/new')}
              >
                <Plus size={16} />
                <span>Tạo PAKH</span>
              </button>

              <button 
                type="button" 
                className="ab-btn-outline-red"
                onClick={() => setShowExportModal(true)}
              >
                <Download size={15} />
                <span>Xuất Excel</span>
              </button>

              <div className="ab-view-toggle">
                <button 
                  type="button" 
                  className={`ab-view-btn ${viewMode === 'kanban' ? 'active' : ''}`}
                  onClick={() => setViewMode('kanban')}
                  title="Giao diện Kanban"
                >
                  <LayoutGrid size={16} />
                </button>
                <button 
                  type="button" 
                  className={`ab-view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                  title="Giao diện Danh sách"
                >
                  <List size={16} />
                </button>
              </div>
            </div>

          </div>

          {/* INLINE ADVANCED SEARCH PANEL (EXACT 8 FIELDS) */}
          {isAdvSearchExpanded && (
            <div className="ab-inline-search-panel">
              <div className="ab-search-grid">
                
                {/* 1. Người phản ánh */}
                <div className="ab-search-item">
                  <label className="ab-search-item-label">Người phản ánh</label>
                  <div className="ab-search-field-with-icon">
                    <input 
                      type="text" 
                      className="ab-search-field"
                      placeholder="Chọn hoặc nhập người phản ánh..." 
                      value={searchFilters.nguoiPhanAnh}
                      onChange={(e) => setSearchFilters(prev => ({ ...prev, nguoiPhanAnh: e.target.value }))}
                      autoFocus
                    />
                    <Search size={15} className="ab-search-field-icon" />
                  </div>
                </div>

                {/* 2. Mức độ ưu tiên */}
                <div className="ab-search-item">
                  <label className="ab-search-item-label">Mức độ ưu tiên</label>
                  <MultiSelect 
                    options={[
                      { value: 'Critical', label: 'Critical (Khẩn cấp)' },
                      { value: 'High', label: 'High (Cao)' },
                      { value: 'Medium', label: 'Medium (Trung bình)' },
                      { value: 'Low', label: 'Low (Thấp)' }
                    ]}
                    selected={searchFilters.mucDoUuTien}
                    onChange={(vals) => setSearchFilters(prev => ({ ...prev, mucDoUuTien: vals }))}
                    placeholder="Chọn mức độ..."
                  />
                </div>

                {/* 3. Ngày tiếp nhận */}
                <div className="ab-search-item">
                  <label className="ab-search-item-label">Ngày tiếp nhận</label>
                  <input 
                    type="date" 
                    className="ab-search-field"
                    value={searchFilters.ngayTiepNhan}
                    onChange={(e) => setSearchFilters(prev => ({ ...prev, ngayTiepNhan: e.target.value }))}
                  />
                </div>

                {/* 4. Nhóm SPDV */}
                <div className="ab-search-item">
                  <label className="ab-search-item-label">Nhóm SPDV</label>
                  <MultiSelect 
                    options={uniqueNhomSpList}
                    selected={searchFilters.nhomSpDv}
                    onChange={(vals) => setSearchFilters(prev => ({ ...prev, nhomSpDv: vals }))}
                    placeholder="Chọn nhóm SPDV..."
                  />
                </div>

                {/* 5. Tên SPDV */}
                <div className="ab-search-item">
                  <label className="ab-search-item-label">Tên SPDV</label>
                  <MultiSelect 
                    options={uniqueTenSpList}
                    selected={searchFilters.tenSpDv}
                    onChange={(vals) => setSearchFilters(prev => ({ ...prev, tenSpDv: vals }))}
                    placeholder="Chọn tên SPDV..."
                  />
                </div>

                {/* 6. Cấp độ cảnh báo */}
                <div className="ab-search-item">
                  <label className="ab-search-item-label">Cấp độ cảnh báo</label>
                  <MultiSelect 
                    options={[
                      { value: 'Cấp 1', label: 'Cấp 1' },
                      { value: 'Cấp 2', label: 'Cấp 2' },
                      { value: 'Cấp 3', label: 'Cấp 3' }
                    ]}
                    selected={searchFilters.capDoCanhBao}
                    onChange={(vals) => setSearchFilters(prev => ({ ...prev, capDoCanhBao: vals }))}
                    placeholder="Chọn cấp độ..."
                  />
                </div>

                {/* 7. Trạng thái phản ánh */}
                <div className="ab-search-item">
                  <label className="ab-search-item-label">Trạng thái phản ánh</label>
                  <MultiSelect 
                    options={[
                      { value: 'Tiếp nhận mới', label: 'Tiếp nhận mới' },
                      { value: 'Đang xử lý', label: 'Đang xử lý' },
                      { value: 'Xử lý xong', label: 'Xử lý xong' },
                      { value: 'Đóng', label: 'Đóng' },
                      { value: 'Hủy phản ánh', label: 'Hủy phản ánh' }
                    ]}
                    selected={searchFilters.trangThaiPhanAnh}
                    onChange={(vals) => setSearchFilters(prev => ({ ...prev, trangThaiPhanAnh: vals }))}
                    placeholder="Chọn trạng thái..."
                  />
                </div>

                {/* 8. Tiến độ xử lý */}
                <div className="ab-search-item">
                  <label className="ab-search-item-label">Tiến độ xử lý</label>
                  <MultiSelect 
                    options={[
                      { value: 'Trong hạn', label: 'Trong hạn' },
                      { value: 'Ngoài hạn', label: 'Ngoài hạn' }
                    ]}
                    selected={searchFilters.tienDoXuLy}
                    onChange={(vals) => setSearchFilters(prev => ({ ...prev, tienDoXuLy: vals }))}
                    placeholder="Chọn tiến độ..."
                  />
                </div>

              </div>

              {/* Panel Footer */}
              <div className="ab-search-panel-footer" style={{ justifyContent: 'flex-end' }}>
                <button 
                  type="button" 
                  className="ab-btn-collapse-red"
                  onClick={() => setIsAdvSearchExpanded(false)}
                >
                  <Filter size={14} />
                  <span>Thu gọn</span>
                  <ChevronUp size={16} />
                </button>
              </div>
            </div>
          )}

          {/* VIEW: LIST TABLE */}
          {viewMode === 'list' ? (
            <>
              <div className="ab-table-container">
                <table className="ab-table">
                  <thead>
                    <tr>
                      <th style={{ width: '40px', textAlign: 'center' }}>
                        <input 
                          type="checkbox" 
                          className="ab-checkbox"
                          checked={paginatedData.length > 0 && selectedRows.length === paginatedData.length}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedRows(paginatedData.map(t => t.id));
                            else setSelectedRows([]);
                          }}
                        />
                      </th>

                      {/* DYNAMIC COLUMNS WITH SORTING & FILTER */}
                      {PAKH_COLUMNS.filter(col => visibleColumns.includes(col.key)).map(col => {
                        const isSorted = sortConfig.key === col.key;
                        const isFiltered = (columnFilters[col.key] && columnFilters[col.key].length > 0);
                        const isPopupOpen = activeFilterCol === col.key;

                        let thClass = 'ab-th-cell';
                        if (col.sticky === 'status') thClass += ' ab-th-sticky-status';
                        else if (col.sticky === 'progress') thClass += ' ab-th-sticky-progress';

                        return (
                          <th key={col.key} className={thClass} style={{ minWidth: col.width }}>
                            <div className="ab-th-content">
                              <span 
                                className="ab-th-title" 
                                onClick={() => handleSort(col.key)}
                                title="Bấm để sắp xếp"
                              >
                                {col.label}
                              </span>

                              <div className="ab-th-actions">
                                <button
                                  type="button"
                                  className={`ab-sort-btn ${isSorted ? 'active' : ''}`}
                                  title="Sắp xếp"
                                  onClick={() => handleSort(col.key)}
                                >
                                  <svg width="8" height="13" viewBox="0 0 8 13" fill="none" style={{ display: 'block' }}>
                                    <path 
                                      d="M4 0.5L7.5 4.5H0.5L4 0.5Z" 
                                      fill={isSorted && sortConfig.direction === 'asc' ? '#ee0033' : '#94a3b8'} 
                                    />
                                    <path 
                                      d="M4 12.5L0.5 8.5H7.5L4 12.5Z" 
                                      fill={isSorted && sortConfig.direction === 'desc' ? '#ee0033' : '#94a3b8'} 
                                    />
                                  </svg>
                                </button>

                                <button 
                                  type="button"
                                  className={`ab-filter-trigger ${isFiltered || isPopupOpen ? 'active' : ''}`}
                                  title="Lọc cột này"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveFilterCol(isPopupOpen ? null : col.key);
                                    setFilterSearchTerm('');
                                  }}
                                >
                                  <Filter size={13} strokeWidth={2.2} />
                                </button>
                              </div>
                            </div>

                            {/* FILTER POPOVER */}
                            {isPopupOpen && renderFilterPopup(col.key, col.label)}
                          </th>
                        );
                      })}

                      {/* COLUMN CONFIGURATION HEADER CELL (AT THE END OF TABLE) */}
                      <th className="ab-th-config">
                        <button 
                          type="button" 
                          className="ab-btn-col-settings"
                          title="Cấu hình cột hiển thị"
                          onClick={(e) => {
                            e.stopPropagation();
                            const rect = e.currentTarget.getBoundingClientRect();
                            setColConfigPos({
                              top: rect.bottom + 6,
                              right: Math.max(16, window.innerWidth - rect.right)
                            });
                            setShowColConfigModal(prev => !prev);
                          }}
                        >
                          <SlidersHorizontal size={17} strokeWidth={2} />
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.map((item) => (
                      <tr 
                        key={item.id}
                        className={selectedRows.includes(item.id) ? 'row-selected' : ''}
                        onClick={() => navigate(`/pakh/edit/${item.id}`)}
                        style={{ cursor: 'pointer' }}
                      >
                        <td style={{ textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                          <input 
                            type="checkbox" 
                            className="ab-checkbox"
                            checked={selectedRows.includes(item.id)}
                            onChange={(e) => {
                              if (e.target.checked) setSelectedRows([...selectedRows, item.id]);
                              else setSelectedRows(selectedRows.filter(id => id !== item.id));
                            }}
                          />
                        </td>

                        {/* DYNAMIC CELLS FOR VISIBLE COLUMNS */}
                        {PAKH_COLUMNS.filter(col => visibleColumns.includes(col.key)).map(col => {
                          let tdClass = '';
                          if (col.sticky === 'status') tdClass = 'ab-td-sticky-status';
                          else if (col.sticky === 'progress') tdClass = 'ab-td-sticky-progress';

                          return (
                            <td key={col.key} className={tdClass}>
                              {renderCellContent(item, col.key)}
                            </td>
                          );
                        })}

                        {/* COLUMN CONFIG END CELL */}
                        <td className="ab-td-config"></td>
                      </tr>
                    ))}
                    {paginatedData.length === 0 && (
                      <tr>
                        <td colSpan={visibleColumns.length + 2} style={{ textAlign: 'center', padding: '36px', color: '#94a3b8' }}>
                          Không tìm thấy phản ánh nào phù hợp.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION FOOTER */}
              <div className="ab-pagination-footer">
                <div className="ab-pagination-info">
                  Hiển thị {paginatedData.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}-{Math.min(currentPage * pageSize, filteredData.length)} trong số {filteredData.length} phản ánh
                </div>
                <div className="ab-pagination-controls">
                  <span className="ab-pagination-range">Trang {currentPage} / {Math.ceil(filteredData.length / pageSize) || 1}</span>
                  <button 
                    type="button" 
                    className={`ab-page-arrow-btn ${currentPage > 1 ? 'active-red' : 'disabled-gray'}`}
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    title="Trang trước"
                    disabled={currentPage <= 1}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button 
                    type="button" 
                    className={`ab-page-arrow-btn ${currentPage * pageSize < filteredData.length ? 'active-red' : 'disabled-gray'}`}
                    onClick={() => setCurrentPage(p => p + 1)}
                    title="Trang tiếp theo"
                    disabled={currentPage * pageSize >= filteredData.length}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* VIEW: KANBAN BOARD */
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="ab-kanban-board">
                {['todo', 'processing', 'done', 'cancelled'].map((colId) => {
                  const colConfig = {
                    'todo': { title: 'Tiếp nhận mới', color: '#f59e0b' },
                    'processing': { title: 'Đang xử lý', color: '#0284c7' },
                    'done': { title: 'Xử lý xong', color: '#10b981' },
                    'cancelled': { title: 'Đóng', color: '#64748b' }
                  }[colId];

                  const itemsInCol = filteredData.filter(i => (i.status || 'todo') === colId);

                  return (
                    <div key={colId} className="ab-kanban-column">
                      <div className="ab-kanban-column-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: colConfig.color }}></span>
                          <span className="ab-kanban-col-title">{colConfig.title}</span>
                        </div>
                        <span className="ab-kanban-count-badge">{itemsInCol.length}</span>
                      </div>

                      <Droppable droppableId={colId}>
                        {(provided, snapshot) => (
                          <div 
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`ab-kanban-items ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                            style={{ minHeight: '350px' }}
                          >
                            {itemsInCol.map((item, index) => (
                              <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                                {(providedDrag) => (
                                  <div
                                    ref={providedDrag.innerRef}
                                    {...providedDrag.draggableProps}
                                    {...providedDrag.dragHandleProps}
                                    className="ab-kanban-card"
                                    onClick={() => setSelectedIssue(item)}
                                  >
                                    <div className="ab-card-header">
                                      <span className="ab-task-id">{item.maKhieuNai}</span>
                                      {renderPakhPriority(item.mucDoUuTien)}
                                    </div>
                                    <h4 className="ab-card-title">{item.nguoiPhanAnh} - {item.donViPhanAnh}</h4>
                                    <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 8px 0', lineHeight: 1.4 }}>
                                      {item.noiDungKhieuNai ? (item.noiDungKhieuNai.length > 80 ? item.noiDungKhieuNai.substring(0, 80) + '...' : item.noiDungKhieuNai) : ''}
                                    </p>
                                    <div className="ab-card-footer" style={{ borderTop: '1px solid #f1f5f9', paddingTop: '8px', marginTop: '6px' }}>
                                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>Hạn: {item.ngayHenXuLy || item.dueDate}</span>
                                      {renderPakhProgress(item.tienDoXuLy)}
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  );
                })}
              </div>
            </DragDropContext>
          )}

        </div>
      </div>



      {/* DETAIL MODAL */}
      {selectedIssue && (
        <div className="ab-adv-filter-modal-overlay" onClick={() => setSelectedIssue(null)}>
          <div 
            className="ab-adv-filter-modal" 
            style={{ width: '680px', maxWidth: '95%' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="ab-adv-filter-header">
              <h3 className="ab-adv-filter-title">Chi tiết Phản ánh: {selectedIssue.maKhieuNai}</h3>
              <button 
                type="button" 
                className="ab-adv-filter-close-btn"
                onClick={() => setSelectedIssue(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="ab-adv-filter-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label className="ab-adv-filter-label">Người phản ánh</label>
                <p style={{ fontWeight: 600, margin: '2px 0 10px 0' }}>{selectedIssue.nguoiPhanAnh}</p>
              </div>
              <div>
                <label className="ab-adv-filter-label">Đơn vị phản ánh</label>
                <p style={{ fontWeight: 600, color: '#ee0033', margin: '2px 0 10px 0' }}>{selectedIssue.donViPhanAnh}</p>
              </div>
              <div>
                <label className="ab-adv-filter-label">Nhân viên tiếp nhận</label>
                <p style={{ margin: '2px 0 10px 0' }}>{selectedIssue.nhanVienTiepNhan}</p>
              </div>
              <div>
                <label className="ab-adv-filter-label">Kênh tiếp nhận</label>
                <p style={{ margin: '2px 0 10px 0' }}>{selectedIssue.kenhTiepNhan}</p>
              </div>
              <div>
                <label className="ab-adv-filter-label">Mức độ ưu tiên</label>
                <div>{renderPakhPriority(selectedIssue.mucDoUuTien)}</div>
              </div>
              <div>
                <label className="ab-adv-filter-label">Trạng thái</label>
                <div>{renderPakhStatus(selectedIssue.trangThaiPhanAnh)}</div>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="ab-adv-filter-label">Nội dung khiếu nại</label>
                <div style={{ padding: '10px 12px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '13px' }}>
                  {selectedIssue.noiDungKhieuNai}
                </div>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="ab-adv-filter-label">Nội dung xử lý</label>
                <div style={{ padding: '10px 12px', background: '#f0fdf4', borderRadius: '6px', border: '1px solid #bbf7d0', fontSize: '13px', color: '#166534' }}>
                  {selectedIssue.noiDungXuLy || 'Chưa có nội dung xử lý'}
                </div>
              </div>
              <div>
                <label className="ab-adv-filter-label">Đơn vị xử lý</label>
                <p style={{ margin: '2px 0 10px 0' }}>{selectedIssue.donViXuLy}</p>
              </div>
              <div>
                <label className="ab-adv-filter-label">Tiến độ xử lý</label>
                <div>{renderPakhProgress(selectedIssue.tienDoXuLy)}</div>
              </div>
            </div>

            <div className="ab-adv-filter-footer">
              <button 
                type="button" 
                className="ab-adv-filter-btn-apply"
                onClick={() => setSelectedIssue(null)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD NEW ISSUE MODAL */}
      {showAddModal && (
        <div className="ab-adv-filter-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div 
            className="ab-adv-filter-modal" 
            style={{ width: '740px', maxWidth: '95%', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="ab-adv-filter-header">
              <h3 className="ab-adv-filter-title">Tạo PAKH mới</h3>
              <button 
                type="button" 
                className="ab-adv-filter-close-btn"
                onClick={() => setShowAddModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateIssue}>
              <div className="ab-adv-filter-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label className="ab-adv-filter-label">Mã khiếu nại</label>
                  <input 
                    type="text" 
                    className="ab-search-input"
                    style={{ width: '100%', height: '36px', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '0 10px' }}
                    value={newIssue.maKhieuNai} 
                    disabled 
                  />
                </div>
                <div>
                  <label className="ab-adv-filter-label">Người phản ánh *</label>
                  <input 
                    type="text" 
                    className="ab-search-input"
                    placeholder="VD: Trần Văn Minh"
                    style={{ width: '100%', height: '36px', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '0 10px' }}
                    value={newIssue.nguoiPhanAnh} 
                    onChange={e => setNewIssue({ ...newIssue, nguoiPhanAnh: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="ab-adv-filter-label">Đơn vị phản ánh</label>
                  <input 
                    type="text" 
                    className="ab-search-input"
                    placeholder="VD: Viettel Telecom"
                    style={{ width: '100%', height: '36px', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '0 10px' }}
                    value={newIssue.donViPhanAnh} 
                    onChange={e => setNewIssue({ ...newIssue, donViPhanAnh: e.target.value })}
                  />
                </div>
                <div>
                  <label className="ab-adv-filter-label">Kênh tiếp nhận</label>
                  <select 
                    style={{ width: '100%', height: '36px', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '0 10px' }}
                    value={newIssue.kenhTiepNhan}
                    onChange={e => setNewIssue({ ...newIssue, kenhTiepNhan: e.target.value })}
                  >
                    <option value="Hotline">Hotline</option>
                    <option value="Email">Email</option>
                    <option value="Website">Website</option>
                    <option value="Zalo OA">Zalo OA</option>
                    <option value="Cổng Portal">Cổng Portal</option>
                  </select>
                </div>
                <div>
                  <label className="ab-adv-filter-label">Mức độ ưu tiên</label>
                  <select 
                    style={{ width: '100%', height: '36px', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '0 10px' }}
                    value={newIssue.mucDoUuTien}
                    onChange={e => setNewIssue({ ...newIssue, mucDoUuTien: e.target.value })}
                  >
                    <option value="Critical">Critical (Khẩn cấp)</option>
                    <option value="High">High (Cao)</option>
                    <option value="Medium">Medium (Trung bình)</option>
                    <option value="Low">Low (Thấp)</option>
                  </select>
                </div>
                <div>
                  <label className="ab-adv-filter-label">Cấp độ cảnh báo</label>
                  <select 
                    style={{ width: '100%', height: '36px', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '0 10px' }}
                    value={newIssue.capDoCanhBao}
                    onChange={e => setNewIssue({ ...newIssue, capDoCanhBao: e.target.value })}
                  >
                    <option value="Cấp 1">Cấp 1</option>
                    <option value="Cấp 2">Cấp 2</option>
                    <option value="Cấp 3">Cấp 3</option>
                  </select>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="ab-adv-filter-label">Nội dung khiếu nại / phản ánh *</label>
                  <textarea 
                    rows={3}
                    placeholder="Mô tả chi tiết khiếu nại..."
                    style={{ width: '100%', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '8px 10px', fontSize: '13px' }}
                    value={newIssue.noiDungKhieuNai}
                    onChange={e => setNewIssue({ ...newIssue, noiDungKhieuNai: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="ab-adv-filter-label">SĐT / Email liên hệ</label>
                  <input 
                    type="text" 
                    className="ab-search-input"
                    placeholder="0988... / email@..."
                    style={{ width: '100%', height: '36px', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '0 10px' }}
                    value={newIssue.sdtDiaChiPhanHoi} 
                    onChange={e => setNewIssue({ ...newIssue, sdtDiaChiPhanHoi: e.target.value })}
                  />
                </div>
                <div>
                  <label className="ab-adv-filter-label">Ngày hẹn xử lý</label>
                  <input 
                    type="date" 
                    style={{ width: '100%', height: '36px', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '0 10px' }}
                    value={newIssue.ngayHenXuLy} 
                    onChange={e => setNewIssue({ ...newIssue, ngayHenXuLy: e.target.value })}
                  />
                </div>
                <div>
                  <label className="ab-adv-filter-label">Đơn vị xử lý</label>
                  <input 
                    type="text" 
                    className="ab-search-input"
                    placeholder="Trung tâm Vận hành..."
                    style={{ width: '100%', height: '36px', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '0 10px' }}
                    value={newIssue.donViXuLy} 
                    onChange={e => setNewIssue({ ...newIssue, donViXuLy: e.target.value })}
                  />
                </div>
                <div>
                  <label className="ab-adv-filter-label">Trạng thái phản ánh</label>
                  <select 
                    style={{ width: '100%', height: '36px', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '0 10px' }}
                    value={newIssue.trangThaiPhanAnh}
                    onChange={e => setNewIssue({ ...newIssue, trangThaiPhanAnh: e.target.value })}
                  >
                    <option value="Tiếp nhận mới">Tiếp nhận mới</option>
                    <option value="Đang xử lý">Đang xử lý</option>
                    <option value="Đã hoàn thành">Đã hoàn thành</option>
                    <option value="Hủy phản ánh">Hủy phản ánh</option>
                  </select>
                </div>
              </div>

              <div className="ab-adv-filter-footer">
                <button 
                  type="button" 
                  className="ab-adv-filter-btn-reset"
                  onClick={() => setShowAddModal(false)}
                >
                  Hủy bỏ
                </button>
                <button 
                  type="submit" 
                  className="ab-adv-filter-btn-apply"
                  style={{ backgroundColor: '#ee0033' }}
                >
                  Tạo PAKH
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EXPORT EXCEL MODAL */}
      {showExportModal && (
        <div className="ab-export-modal-overlay" onClick={() => setShowExportModal(false)}>
          <div 
            className="ab-export-modal" 
            style={{ width: '600px', maxWidth: '95%' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="ab-export-modal-header">
              <h3 className="ab-export-modal-title">Xuất dữ liệu Phản ánh khách hàng ra Excel</h3>
              <button 
                type="button" 
                className="ab-export-close-btn"
                onClick={() => setShowExportModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="ab-export-modal-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>
                  Chọn các trường dữ liệu cần xuất:
                </span>
                <button 
                  type="button" 
                  style={{ background: 'none', border: 'none', color: '#ee0033', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                  onClick={() => {
                    if (exportSelectedCols.length === PAKH_EXPORT_COLUMNS.length) {
                      setExportSelectedCols([]);
                    } else {
                      setExportSelectedCols(PAKH_EXPORT_COLUMNS.map(c => c.key));
                    }
                  }}
                >
                  {exportSelectedCols.length === PAKH_EXPORT_COLUMNS.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', maxHeight: '300px', overflowY: 'auto', padding: '4px' }}>
                {PAKH_EXPORT_COLUMNS.map(col => (
                  <label 
                    key={col.key}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155', cursor: 'pointer' }}
                    onClick={() => handleToggleExportCol(col.key)}
                  >
                    <input 
                      type="checkbox" 
                      className="ab-filter-checkbox"
                      checked={exportSelectedCols.includes(col.key)}
                      onChange={() => {}}
                    />
                    <span>{col.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="ab-export-modal-footer">
              <button 
                type="button" 
                className="ab-export-btn-cancel"
                onClick={() => setShowExportModal(false)}
              >
                Hủy
              </button>
              <button 
                type="button" 
                className="ab-export-btn-submit"
                style={{ backgroundColor: '#ee0033' }}
                onClick={handleExecuteExport}
              >
                Xuất file Excel (.xlsx)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COLUMN CONFIGURATION POPOVER */}
      {showColConfigModal && (
        <div 
          style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'transparent' }}
          onClick={() => setShowColConfigModal(false)}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'fixed',
              top: `${colConfigPos.top}px`,
              right: `${colConfigPos.right}px`,
              width: '240px',
              maxHeight: '440px',
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              boxShadow: '0 12px 30px -4px rgba(0, 0, 0, 0.2), 0 4px 12px -2px rgba(0, 0, 0, 0.08)',
              border: '1px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            <div style={{ padding: '16px 20px 12px 20px', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
                Hiển thị cột
              </div>
            </div>

            <div 
              style={{ 
                padding: '16px 20px', 
                overflowY: 'auto', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '16px' 
              }}
            >
              {PAKH_COLUMNS.map(col => {
                const isChecked = visibleColumns.includes(col.key);

                return (
                  <div 
                    key={col.key}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      cursor: 'pointer',
                      userSelect: 'none'
                    }}
                    onClick={() => {
                      setVisibleColumns(prev => {
                        let updated;
                        if (prev.includes(col.key)) {
                          if (prev.length <= 1) return prev;
                          updated = prev.filter(k => k !== col.key);
                        } else {
                          updated = PAKH_COLUMNS.map(c => c.key).filter(k => prev.includes(k) || k === col.key);
                        }
                        localStorage.setItem('ha_pakh_visible_cols_v2', JSON.stringify(updated));
                        return updated;
                      });
                    }}
                  >
                    <div 
                      style={{
                        width: '19px',
                        height: '19px',
                        borderRadius: '3px',
                        backgroundColor: isChecked ? '#ee0033' : '#ffffff',
                        border: isChecked ? '2px solid #ee0033' : '2px solid #334155',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        transition: 'all 0.12s ease'
                      }}
                    >
                      {isChecked && <Check size={13} color="#ffffff" strokeWidth={3.5} />}
                    </div>
                    <span style={{ fontSize: '15px', color: '#1e293b', fontWeight: 500, lineHeight: 1.3 }}>
                      {col.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
