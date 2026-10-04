import React, { useState, useMemo, useEffect } from 'react';
import { X, Check, FileSpreadsheet, Download, Layers, CheckSquare, Square, Filter } from 'lucide-react';
import './ExportChartExcelModal.css';

export const REPORT_BRANCH_META = {
  month: { id: 'month', name: 'Phân tích theo tháng', code: 'Nhóm 1' },
  quarter: { id: 'quarter', name: 'Phân tích theo quý', code: 'Nhóm 2' },
  year: { id: 'year', name: 'Phân tích theo năm', code: 'Nhóm 3' },
  trend: { id: 'trend', name: 'Xu hướng theo thời gian', code: 'Nhóm 4' },
  spdv: { id: 'spdv', name: 'Theo nhóm SPDV', code: 'Nhóm 5' },
  unit: { id: 'unit', name: 'Theo đơn vị thực hiện', code: 'Nhóm 6' },
  plan_progress: { id: 'plan_progress', name: 'Chuyển dịch doanh thu', code: 'Nhóm 7' },
  debt: { id: 'debt', name: 'Báo cáo công nợ', code: 'Nhóm 8' }
};

export function getExportChartList({
  selectedYear = '2026',
  selectedMonth = 'Tháng 8',
  selectedQuarter = 'Quý III',
  selectedCumulativeMonth = 'Lũy kế 8 tháng'
}) {
  const monthNum = parseInt(selectedMonth.match(/\d+/)?.[0] || '8', 10);
  const shortMonth = `T${monthNum}`;
  const prevMonthNum = monthNum === 1 ? 12 : monthNum - 1;
  const prevShortMonth = `T${prevMonthNum}`;
  const lastYear = (parseInt(selectedYear, 10) - 1).toString();
  const nextMonthNum = monthNum === 12 ? 1 : monthNum + 1;
  const nextShortMonth = `T${nextMonthNum}`;
  const quarterNum = Math.ceil(monthNum / 3);
  const quarterRoman = `${quarterNum}`;
  const qNum = (selectedQuarter?.includes('4') || selectedQuarter?.includes('IV')) ? 4
    : (selectedQuarter?.includes('3') || selectedQuarter?.includes('III')) ? 3
    : (selectedQuarter?.includes('2') || selectedQuarter?.includes('II')) ? 2
    : 1;
  const prevQNum = qNum === 1 ? 4 : qNum - 1;
  const prevQName = `Quý ${prevQNum}`;
  const prevQYear = qNum === 1 ? (parseInt(selectedYear, 10) - 1).toString() : selectedYear;
  const nextQNum = qNum === 4 ? 1 : qNum + 1;
  const nextQName = `Quý ${nextQNum}`;
  const nextQYear = qNum === 4 ? (parseInt(selectedYear, 10) + 1).toString() : selectedYear;

  return [
    // NHÓM 1: THEO THÁNG
    {
      key: 'c1',
      branchId: 'month',
      chartNumber: 'Biểu đồ 1',
      title: `Biểu đồ 1. Kết quả ${shortMonth}/${selectedYear} so với kế hoạch ${shortMonth}/${selectedYear}`,
      desc: `So sánh thực hiện và kế hoạch tháng ${shortMonth}, đánh giá tỷ lệ hoàn thành`,
      period: `${selectedMonth}/${selectedYear}`
    },
    {
      key: 'c2',
      branchId: 'month',
      chartNumber: 'Biểu đồ 2',
      title: `Biểu đồ 2. Kết quả ${shortMonth}/${selectedYear} so với kết quả ${prevShortMonth}`,
      desc: `So sánh thực hiện tháng ${shortMonth} với tháng trước (${prevShortMonth}), tỷ lệ tăng trưởng MoM`,
      period: `${selectedMonth} vs ${prevShortMonth}`
    },
    {
      key: 'c3',
      branchId: 'month',
      chartNumber: 'Biểu đồ 3',
      title: `Biểu đồ 3. Kết quả ${shortMonth}/${selectedYear} so với cùng kỳ ${shortMonth}/${lastYear}`,
      desc: `So sánh kết quả tháng ${shortMonth} so với cùng kỳ năm trước (${lastYear}), tăng trưởng YoY`,
      period: `${shortMonth}/${selectedYear} vs ${shortMonth}/${lastYear}`
    },
    {
      key: 'c4',
      branchId: 'month',
      chartNumber: 'Biểu đồ 4',
      title: `Biểu đồ 4. Kết quả ${shortMonth}/${selectedYear} so với kế hoạch ${nextShortMonth}`,
      desc: `So sánh thực hiện tháng hiện tại với kế hoạch tháng tiếp theo (${nextShortMonth})`,
      period: `${selectedMonth} vs ${nextShortMonth}`
    },

    // NHÓM 2: THEO QUÝ
    {
      key: 'c5',
      branchId: 'quarter',
      chartNumber: 'Biểu đồ 5',
      title: `Biểu đồ 5. Lũy kế ${selectedQuarter}/${selectedYear} so với kế hoạch ${selectedQuarter}/${selectedYear}`,
      desc: `Đánh giá tiến độ lũy kế quý so với chỉ tiêu kế hoạch quý`,
      period: `${selectedQuarter}/${selectedYear}`
    },
    {
      key: 'c6',
      branchId: 'quarter',
      chartNumber: 'Biểu đồ 6',
      title: `Biểu đồ 6. Ước kết quả ${selectedQuarter}/${selectedYear} so với kế hoạch ${selectedQuarter}/${selectedYear}`,
      desc: `Ước tính cả quý so với kế hoạch được giao của quý`,
      period: `${selectedQuarter}/${selectedYear}`
    },
    {
      key: 'c7',
      branchId: 'quarter',
      chartNumber: 'Biểu đồ 7',
      title: `Biểu đồ 7. Ước kết quả ${selectedQuarter}/${selectedYear} so với kết quả ${prevQName}/${prevQYear}`,
      desc: `Tăng trưởng ước thực hiện quý hiện tại so với kết quả quý liền trước (QoQ)`,
      period: `${selectedQuarter} vs ${prevQName}`
    },
    {
      key: 'c8',
      branchId: 'quarter',
      chartNumber: 'Biểu đồ 8',
      title: `Biểu đồ 8. Ước kết quả ${selectedQuarter}/${selectedYear} so với kết quả ${selectedQuarter}/${lastYear}`,
      desc: `Tăng trưởng ước thực hiện quý hiện tại so với cùng kỳ năm ${lastYear}`,
      period: `${selectedQuarter}/${selectedYear} vs ${selectedQuarter}/${lastYear}`
    },
    {
      key: 'c9',
      branchId: 'quarter',
      chartNumber: 'Biểu đồ 9',
      title: `Biểu đồ 9. Ước kết quả ${selectedQuarter}/${selectedYear} so với kế hoạch ${nextQName}/${nextQYear}`,
      desc: `So sánh ước thực hiện quý hiện tại với kế hoạch quý kế tiếp`,
      period: `${selectedQuarter} vs ${nextQName}`
    },

    // NHÓM 3: THEO NĂM
    {
      key: 'c10',
      branchId: 'year',
      chartNumber: 'Biểu đồ 10',
      title: `Biểu đồ 10. Lũy kế ${selectedYear} so với kế hoạch lũy kế ${selectedYear}`,
      desc: `Đánh giá hoàn thành tiến độ lũy kế (${selectedCumulativeMonth}) so với kế hoạch lũy kế tương ứng`,
      period: `${selectedCumulativeMonth} năm ${selectedYear}`
    },
    {
      key: 'c11',
      branchId: 'year',
      chartNumber: 'Biểu đồ 11',
      title: `Biểu đồ 11. Lũy kế ${selectedYear} so với kế hoạch cả năm ${selectedYear}`,
      desc: `Mức độ hoàn thành kế hoạch năm tính đến kỳ lũy kế hiện tại`,
      period: `Năm ${selectedYear}`
    },
    {
      key: 'c12',
      branchId: 'year',
      chartNumber: 'Biểu đồ 12',
      title: `Biểu đồ 12. Ước kết quả ${selectedYear} so với kế hoạch ${selectedYear}`,
      desc: `Dự báo kết quả cả năm so với chỉ tiêu kế hoạch năm được giao`,
      period: `Ước cả năm ${selectedYear}`
    },
    {
      key: 'c13',
      branchId: 'year',
      chartNumber: 'Biểu đồ 13',
      title: `Biểu đồ 13. Ước kết quả ${selectedYear} so với kết quả ${lastYear}`,
      desc: `So sánh ước thực hiện cả năm với kết quả thực hiện năm trước (${lastYear})`,
      period: `Năm ${selectedYear} vs ${lastYear}`
    },

    // NHÓM 4: XU HƯỚNG
    {
      key: 'c14',
      branchId: 'trend',
      chartNumber: 'Biểu đồ 14',
      title: `Biểu đồ 14. Xu hướng doanh thu theo từng tháng năm ${selectedYear} so với năm ${lastYear}`,
      desc: `Xu hướng 12 tháng doanh thu thực tế so với cùng kỳ năm trước, tỷ lệ tăng trưởng YoY`,
      period: `12 Tháng năm ${selectedYear}`
    },
    {
      key: 'c14_plan',
      branchId: 'trend',
      chartNumber: 'Biểu đồ 15',
      title: `Biểu đồ 15. Xu hướng doanh thu theo từng tháng năm ${selectedYear} so với kế hoạch năm ${selectedYear}`,
      desc: `So sánh doanh thu từng tháng với kế hoạch tháng trong năm ${selectedYear}`,
      period: `12 Tháng năm ${selectedYear}`
    },

    // NHÓM 5: SPDV
    {
      key: 'c16_m',
      branchId: 'spdv',
      chartNumber: 'Biểu đồ 16 (Tháng)',
      title: `Biểu đồ 16. Cơ cấu doanh thu thực hiện tháng ${monthNum}/${selectedYear} theo nhóm SPDV`,
      desc: `Cơ cấu tỷ trọng % và giá trị doanh thu thực hiện 6 nhóm SPDV trong Tháng ${monthNum}/${selectedYear}`,
      period: `Tháng ${monthNum}/${selectedYear}`
    },
    {
      key: 'c17_m',
      branchId: 'spdv',
      chartNumber: 'Biểu đồ 17 (Tháng)',
      title: `Biểu đồ 17. Cơ cấu doanh thu kế hoạch tháng ${monthNum}/${selectedYear} theo nhóm SPDV`,
      desc: `Cơ cấu tỷ trọng % và giá trị doanh thu kế hoạch 6 nhóm SPDV trong Tháng ${monthNum}/${selectedYear}`,
      period: `Tháng ${monthNum}/${selectedYear}`
    },
    {
      key: 'c16_q',
      branchId: 'spdv',
      chartNumber: 'Biểu đồ 16 (Quý)',
      title: `Biểu đồ 16. Cơ cấu doanh thu thực hiện Quý ${quarterRoman}/${selectedYear} theo nhóm SPDV`,
      desc: `Cơ cấu tỷ trọng % và giá trị doanh thu thực hiện 6 nhóm SPDV trong Quý ${quarterRoman}/${selectedYear}`,
      period: `Quý ${quarterRoman}/${selectedYear}`
    },
    {
      key: 'c17_q',
      branchId: 'spdv',
      chartNumber: 'Biểu đồ 17 (Quý)',
      title: `Biểu đồ 17. Cơ cấu doanh thu kế hoạch Quý ${quarterRoman}/${selectedYear} theo nhóm SPDV`,
      desc: `Cơ cấu tỷ trọng % và giá trị doanh thu kế hoạch 6 nhóm SPDV trong Quý ${quarterRoman}/${selectedYear}`,
      period: `Quý ${quarterRoman}/${selectedYear}`
    },
    {
      key: 'c16_y',
      branchId: 'spdv',
      chartNumber: 'Biểu đồ 16 (Năm)',
      title: `Biểu đồ 16. Cơ cấu doanh thu thực hiện năm ${selectedYear} theo nhóm SPDV`,
      desc: `Cơ cấu tỷ trọng % và giá trị doanh thu thực hiện 6 nhóm SPDV cả Năm ${selectedYear}`,
      period: `Năm ${selectedYear}`
    },
    {
      key: 'c17_y',
      branchId: 'spdv',
      chartNumber: 'Biểu đồ 17 (Năm)',
      title: `Biểu đồ 17. Cơ cấu doanh thu kế hoạch năm ${selectedYear} theo nhóm SPDV`,
      desc: `Cơ cấu tỷ trọng % và giá trị doanh thu kế hoạch 6 nhóm SPDV cả Năm ${selectedYear}`,
      period: `Năm ${selectedYear}`
    },
    {
      key: 'c18_m',
      branchId: 'spdv',
      chartNumber: 'Biểu đồ 18 (Tháng)',
      title: `Biểu đồ 18. Thực hiện Tháng ${monthNum}/${selectedYear} so với kế hoạch Tháng ${monthNum}/${selectedYear} theo nhóm SPDV`,
      desc: `So sánh thực hiện và kế hoạch doanh thu của 6 nhóm SPDV trong Tháng ${monthNum}/${selectedYear}`,
      period: `Tháng ${monthNum}/${selectedYear}`
    },
    {
      key: 'c18_q',
      branchId: 'spdv',
      chartNumber: 'Biểu đồ 18 (Quý)',
      title: `Biểu đồ 18. Ước thực hiện Quý ${quarterRoman}/${selectedYear} so với kế hoạch Quý ${quarterRoman}/${selectedYear} theo nhóm SPDV`,
      desc: `So sánh ước thực hiện và kế hoạch doanh thu của 6 nhóm SPDV trong Quý ${quarterRoman}/${selectedYear}`,
      period: `Quý ${quarterRoman}/${selectedYear}`
    },
    {
      key: 'c18_y',
      branchId: 'spdv',
      chartNumber: 'Biểu đồ 18 (Năm)',
      title: `Biểu đồ 18. Ước thực hiện Năm ${selectedYear} so với kế hoạch Năm ${selectedYear} theo nhóm SPDV`,
      desc: `So sánh ước thực hiện cả năm và kế hoạch doanh thu của 6 nhóm SPDV cả Năm ${selectedYear}`,
      period: `Năm ${selectedYear}`
    },
    {
      key: 'c19_spdv',
      branchId: 'spdv',
      chartNumber: 'Biểu đồ 19',
      title: `Biểu đồ 19. Thực hiện năm ${selectedYear} so với cùng kỳ năm ${lastYear} theo nhóm SPDV`,
      desc: `So sánh thực hiện 6 nhóm SPDV với cùng kỳ năm trước cho cả 3 kỳ: Tháng, Quý, Lũy kế (số %: % delta)`,
      period: `Tháng, Quý, Lũy kế ${selectedYear}`
    },
    {
      key: 'c20_spdv',
      branchId: 'spdv',
      chartNumber: 'Biểu đồ 20',
      title: `Biểu đồ 20. Thực hiện so với kỳ trước theo nhóm SPDV`,
      desc: `So sánh thực hiện 6 nhóm SPDV với kỳ trước cho cả 3 kỳ: Tháng, Quý, Lũy kế (số %: % delta)`,
      period: `Tháng, Quý, Lũy kế ${selectedYear}`
    },

    // NHÓM 6: ĐƠN VỊ THỰC HIỆN
    {
      key: 'c21',
      branchId: 'unit',
      chartNumber: 'Biểu đồ 21',
      title: `Biểu đồ 21. Cơ cấu doanh thu TH theo từng đơn vị (Tháng, Quý, Năm)`,
      desc: `Cơ cấu tỷ trọng % và giá trị thực hiện theo từng đơn vị, chi nhánh, công ty con`,
      period: `Tháng, Quý, Năm ${selectedYear}`
    },
    {
      key: 'c22',
      branchId: 'unit',
      chartNumber: 'Biểu đồ 22',
      title: `Biểu đồ 22. Doanh thu thực hiện / ước TH theo đơn vị so với KH – Năm ${selectedYear}`,
      desc: `Bảng tích hợp so sánh TH, KH, +/- so KH, % HTKH theo đơn vị cả 3 kỳ (Tháng, Quý, Năm)`,
      period: `Ma trận 3 kỳ năm ${selectedYear}`
    },
    {
      key: 'c23_unit',
      branchId: 'unit',
      chartNumber: 'Biểu đồ 23',
      title: `Biểu đồ 23. Doanh thu thực hiện / ước TH theo đơn vị so với kỳ trước`,
      desc: `So sánh thực hiện theo đơn vị với kỳ trước cho cả 3 kỳ: Tháng, Quý, Năm (số %: % delta)`,
      period: `Tháng, Quý, Năm ${selectedYear}`
    },

    // NHÓM 7: CHUYỂN DỊCH DOANH THU
    {
      key: 'c23_24',
      branchId: 'plan_progress',
      chartNumber: 'Biểu đồ 23-24',
      title: `Cơ cấu doanh thu TH nội bộ và doanh thu ngoài Tập đoàn`,
      desc: `Cơ cấu và tỷ lệ hoàn thành kế hoạch doanh thu nội bộ vs ngoài Tập đoàn`,
      period: `Tháng, Quý, Năm ${selectedYear}`
    },
    {
      key: 'c25_26',
      branchId: 'plan_progress',
      chartNumber: 'Biểu đồ 25-26',
      title: `Cơ cấu doanh thu trong nước và doanh thu quốc tế`,
      desc: `Cơ cấu chuyển dịch doanh thu thị trường trong nước vs nước ngoài`,
      period: `Tháng, Quý, Năm ${selectedYear}`
    },

    // NHÓM 8: CÔNG NỢ
    {
      key: 'debt_aging',
      branchId: 'debt',
      chartNumber: 'Biểu đồ 27',
      title: `Biểu đồ 27. Phân tích tuổi nợ (AR Aging)`,
      desc: `Báo cáo số dư công nợ theo các dải tuổi nợ (trong hạn, 1-30 ngày, 31-90 ngày,...)`,
      period: `${selectedMonth}/${selectedYear}`
    },
    {
      key: 'debt_group',
      branchId: 'debt',
      chartNumber: 'Biểu đồ 28',
      title: `Biểu đồ 28. Công nợ theo nhóm đối tượng khách hàng`,
      desc: `Phân loại công nợ theo khối Khách hàng lớn, Doanh nghiệp SME, Cơ quan chính phủ`,
      period: `${selectedMonth}/${selectedYear}`
    },
    {
      key: 'debt_recovery',
      branchId: 'debt',
      chartNumber: 'Biểu đồ 29',
      title: `Biểu đồ 29. Tiến độ thu hồi công nợ từng tháng`,
      desc: `Tỷ lệ thu hồi nợ thực tế so với kế hoạch thu nợ hàng tháng`,
      period: `Năm ${selectedYear}`
    },
    {
      key: 'debt_top',
      branchId: 'debt',
      chartNumber: 'Biểu đồ 30',
      title: `Biểu đồ 30. Top 10 khách hàng có số dư nợ lớn nhất`,
      desc: `Danh sách các khách hàng nợ lớn, phân tích nợ trong hạn và quá hạn`,
      period: `Kỳ ${selectedMonth}/${selectedYear}`
    }
  ];
}

export default function ExportChartExcelModal({
  isOpen,
  onClose,
  currentBranch = 'unit',
  selectedYear = '2026',
  selectedMonth = 'Tháng 8',
  selectedQuarter = 'Quý III',
  selectedCumulativeMonth = 'Lũy kế 8 tháng',
  onExport
}) {
  const [activeTab, setActiveTab] = useState('current'); // 'current' | 'all' | specific branchId
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [isExporting, setIsExporting] = useState(false);
  const [includeVisualCharts, setIncludeVisualCharts] = useState(true);

  // Generate full chart catalogue
  const allCharts = useMemo(() => {
    return getExportChartList({
      selectedYear,
      selectedMonth,
      selectedQuarter,
      selectedCumulativeMonth
    });
  }, [selectedYear, selectedMonth, selectedQuarter, selectedCumulativeMonth]);

  // Charts for current branch
  const currentBranchCharts = useMemo(() => {
    return allCharts.filter((c) => c.branchId === currentBranch);
  }, [allCharts, currentBranch]);

  // When modal opens, pre-select all charts of current branch
  useEffect(() => {
    if (isOpen) {
      setActiveTab('current');
      const defaultKeys = allCharts.filter((c) => c.branchId === currentBranch).map((c) => c.key);
      setSelectedKeys(defaultKeys);
      setIsExporting(false);
    }
  }, [isOpen, currentBranch, allCharts]);

  // Visible charts based on activeTab
  const visibleCharts = useMemo(() => {
    if (activeTab === 'current') return currentBranchCharts;
    if (activeTab === 'all') return allCharts;
    return allCharts.filter((c) => c.branchId === activeTab);
  }, [activeTab, currentBranchCharts, allCharts]);

  // Group visible charts by branch
  const groupedCharts = useMemo(() => {
    const map = {};
    visibleCharts.forEach((c) => {
      if (!map[c.branchId]) {
        map[c.branchId] = {
          meta: REPORT_BRANCH_META[c.branchId] || { id: c.branchId, name: c.branchId, code: '' },
          items: []
        };
      }
      map[c.branchId].items.push(c);
    });
    return Object.values(map);
  }, [visibleCharts]);

  // Check if all visible charts are selected
  const isAllVisibleSelected = useMemo(() => {
    if (visibleCharts.length === 0) return false;
    return visibleCharts.every((c) => selectedKeys.includes(c.key));
  }, [visibleCharts, selectedKeys]);

  const handleToggleSelectAll = () => {
    if (isAllVisibleSelected) {
      // Unselect visible charts
      const visibleKeySet = new Set(visibleCharts.map((c) => c.key));
      setSelectedKeys((prev) => prev.filter((k) => !visibleKeySet.has(k)));
    } else {
      // Select all visible charts
      const newKeys = new Set(selectedKeys);
      visibleCharts.forEach((c) => newKeys.add(c.key));
      setSelectedKeys(Array.from(newKeys));
    }
  };

  const handleToggleChart = (chartKey) => {
    setSelectedKeys((prev) =>
      prev.includes(chartKey) ? prev.filter((k) => k !== chartKey) : [...prev, chartKey]
    );
  };

  const handleConfirmExport = async () => {
    if (selectedKeys.length === 0) return;
    setIsExporting(true);
    try {
      if (onExport) {
        await onExport({
          selectedKeys,
          includeVisualCharts,
          activeTab,
          selectedCharts: allCharts.filter((c) => selectedKeys.includes(c.key))
        });
      }
      onClose();
    } catch (err) {
      console.error('Error during excel export:', err);
    } finally {
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;

  const currentBranchName = REPORT_BRANCH_META[currentBranch]?.name || 'Nhóm hiện tại';
  const selectedVisibleCount = visibleCharts.filter((c) => selectedKeys.includes(c.key)).length;

  return (
    <div className="ece-modal-overlay" onClick={onClose}>
      <div className="ece-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="ece-modal-header">
          <h3 className="ece-modal-title">Xuất Excel</h3>
          <button type="button" className="ece-btn-close" onClick={onClose} aria-label="Đóng">
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="ece-modal-body">
          {/* Navigation / Filter Tabs if multiple branches */}
          {currentBranch && (
            <div className="ece-scope-pills">
              <button
                type="button"
                className={`ece-scope-pill ${activeTab === 'current' ? 'active' : ''}`}
                onClick={() => setActiveTab('current')}
              >
                {currentBranchName}
              </button>
              <button
                type="button"
                className={`ece-scope-pill ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                Tất cả các nhóm
              </button>
            </div>
          )}

          {/* Quick Select All Banner */}
          <div className="ece-select-all-banner" onClick={handleToggleSelectAll}>
            <div className={`ece-checkbox-custom ${isAllVisibleSelected ? 'checked' : ''}`}>
              {isAllVisibleSelected && <Check size={13} strokeWidth={3} />}
            </div>
            <div className="ece-select-all-info">
              <div className="ece-select-all-title">Chọn tất cả các biểu đồ</div>
              <div className="ece-select-all-sub">
                {selectedVisibleCount} / {visibleCharts.length} biểu đồ được chọn
              </div>
            </div>
          </div>

          {/* Charts List Container (Single column list) */}
          <div className="ece-charts-scroll-area">
            {groupedCharts.map((group) => (
              <div key={group.meta.id} className="ece-chart-group-section">
                {activeTab === 'all' && (
                  <div className="ece-group-section-header">
                    <span className="ece-group-badge">{group.meta.code}</span>
                    <span className="ece-group-title">{group.meta.name}</span>
                  </div>
                )}

                <div className="ece-chart-list">
                  {group.items.map((chart) => {
                    const isChecked = selectedKeys.includes(chart.key);
                    const cleanTitle = (chart.title || '')
                      .replace(/^Biểu đồ\s*(\d+[a-zA-Z]?|\d+\s*[–-]\s*\d+)(\s*\([^\)]+\))?\s*[\.:\-]\s*/i, '')
                      .trim();
                    return (
                      <div
                        key={chart.key}
                        className={`ece-chart-row ${isChecked ? 'selected' : ''}`}
                        onClick={() => handleToggleChart(chart.key)}
                        title={cleanTitle}
                      >
                        <div className={`ece-checkbox-custom ${isChecked ? 'checked' : ''}`}>
                          {isChecked && <Check size={13} strokeWidth={3} />}
                        </div>
                        <span className="ece-chart-row-title">{cleanTitle}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Export Visual Options */}
          <div className="ece-export-options-box">
            <label className="ece-option-label" onClick={() => setIncludeVisualCharts(!includeVisualCharts)}>
              <div className={`ece-checkbox-custom small ${includeVisualCharts ? 'checked' : ''}`}>
                {includeVisualCharts && <Check size={11} strokeWidth={3} />}
              </div>
              <span className="ece-option-text">
                Kèm hình ảnh biểu đồ trong file Excel
              </span>
            </label>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="ece-modal-footer">
          <button
            type="button"
            className="ece-btn-cancel"
            onClick={onClose}
            disabled={isExporting}
          >
            Hủy
          </button>

          <button
            type="button"
            className="ece-btn-export-submit"
            onClick={handleConfirmExport}
            disabled={selectedKeys.length === 0 || isExporting}
          >
            {isExporting ? 'Đang xuất dữ liệu...' : 'Xuất dữ liệu'}
          </button>
        </div>
      </div>
    </div>
  );
}
