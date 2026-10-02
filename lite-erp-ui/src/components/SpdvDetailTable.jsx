import React, { useMemo } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { SPDV_CATEGORIES, SPDV_STRUCTURE_TABLE_DATA, getSpdvBarComparisonData } from '../data/revenueSpdvData';
import './SpdvDetailTable.css';

const SPDV_COLOR_MAP = {
  gppm: '#1f3d6d',
  htcntt: '#2e6aa6',
  dvs: '#5993cd',
  tvth: '#e59a68',
  vhbt: '#98d593',
  dtk: '#b8c2cc'
};

export default function SpdvDetailTable({
  selectedYear = '2026',
  selectedMonth = 'Tháng 8',
  activeChartKey = 'spdv_bar_month',
  chartTitle = '',
  searchQuery = '',
  statusFilter = 'all'
}) {
  const monthNum = parseInt(selectedMonth?.match(/\d+/)?.[0] || '8', 10);
  const quarterNum = Math.ceil(monthNum / 3);
  const quarterRoman = `${quarterNum}`;
  const quarterStartMonth = (quarterNum - 1) * 3 + 1;
  const quarterCumText = quarterStartMonth === monthNum
    ? `T${quarterStartMonth}`
    : `T${quarterStartMonth}-T${monthNum}`;

  // Check if viewing structure table (Biểu đồ 16 & 17) or comparison table (Biểu đồ 18)
  const isStructure = useMemo(() => {
    const key = (activeChartKey || '').toLowerCase();
    const title = (chartTitle || '').toLowerCase();
    return (
      key === 'spdv_structure' ||
      key === 'chart16' ||
      key === 'chart17' ||
      key.startsWith('spdv_th_') ||
      key.startsWith('spdv_kh_') ||
      title.includes('cơ cấu')
    );
  }, [activeChartKey, chartTitle]);

  const formatSpdvNum = (val) => {
    if (val === null || val === undefined) return '—';
    if (typeof val === 'string') return val;
    return Number(val).toLocaleString('vi-VN', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    });
  };

  // Get bar comparison data for Biểu đồ 18 (Month, Quarter, Year)
  const barData = getSpdvBarComparisonData(selectedYear, selectedMonth);

  // 3-Period Integrated Data for Biểu đồ 18 (Tích hợp số liệu 3 hình: Tháng, Quý, Năm)
  const integratedBarRows = useMemo(() => {
    const monthItems = barData.monthItems || [];
    const quarterItems = barData.quarterItems || [];
    const yearItems = barData.yearItems || [];

    return SPDV_CATEGORIES.map((cat, idx) => {
      const m = monthItems.find((it) => it.id === cat.id) || {};
      const q = quarterItems.find((it) => it.id === cat.id) || {};
      const y = yearItems.find((it) => it.id === cat.id) || {};

      const mTh = Number(m.th ?? 0);
      const mKh = Number(m.kh ?? 0);
      const mDiff = Number((mTh - mKh).toFixed(1));
      const mRate = m.rate || (mKh > 0 ? ((mTh / mKh) * 100).toFixed(1).replace('.', ',') + '%' : '0%');
      const mIsPass = m.isRatePositive !== undefined ? m.isRatePositive : (mKh > 0 && mTh >= mKh);

      const qTh = Number(q.th ?? 0);
      const qKh = Number(q.kh ?? 0);
      const qDiff = Number((qTh - qKh).toFixed(1));
      const qRate = q.rate || (qKh > 0 ? ((qTh / qKh) * 100).toFixed(1).replace('.', ',') + '%' : '0%');
      const qIsPass = q.isRatePositive !== undefined ? q.isRatePositive : (qKh > 0 && qTh >= qKh);

      const yTh = Number(y.th ?? 0);
      const yKh = Number(y.kh ?? 0);
      const yDiff = Number((yTh - yKh).toFixed(1));
      const yRate = y.rate || (yKh > 0 ? ((yTh / yKh) * 100).toFixed(1).replace('.', ',') + '%' : '0%');
      const yIsPass = y.isRatePositive !== undefined ? y.isRatePositive : (yKh > 0 && yTh >= yKh);

      return {
        id: cat.id,
        stt: idx + 1,
        name: cat.name,
        color: cat.color,
        month: { th: mTh, kh: mKh, diff: mDiff, rate: mRate, isPass: mIsPass },
        quarter: { th: qTh, kh: qKh, diff: qDiff, rate: qRate, isPass: qIsPass },
        year: { th: yTh, kh: yKh, diff: yDiff, rate: yRate, isPass: yIsPass }
      };
    });
  }, [barData]);

  // Filtering for integrated Biểu đồ 18
  const filteredIntegratedRows = useMemo(() => {
    return integratedBarRows.filter((item) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase().trim();
        if (!item.name.toLowerCase().includes(q)) return false;
      }
      if (statusFilter === 'pass' && !item.year.isPass) return false;
      if (statusFilter === 'fail' && item.year.isPass) return false;
      return true;
    });
  }, [integratedBarRows, searchQuery, statusFilter]);

  // Integrated totals for Biểu đồ 18
  const integratedTotals = useMemo(() => {
    const monthItems = barData.monthItems || [];
    const quarterItems = barData.quarterItems || [];
    const yearItems = barData.yearItems || [];

    const mTotalTh = monthItems.reduce((acc, it) => acc + (Number(it.th) || 0), 0);
    const mTotalKh = monthItems.reduce((acc, it) => acc + (Number(it.kh) || 0), 0);
    const mTotalDiff = Number((mTotalTh - mTotalKh).toFixed(1));
    const mTotalRate = mTotalKh > 0 ? (mTotalTh / mTotalKh) * 100 : 0;

    const qTotalTh = quarterItems.reduce((acc, it) => acc + (Number(it.th) || 0), 0);
    const qTotalKh = quarterItems.reduce((acc, it) => acc + (Number(it.kh) || 0), 0);
    const qTotalDiff = Number((qTotalTh - qTotalKh).toFixed(1));
    const qTotalRate = qTotalKh > 0 ? (qTotalTh / qTotalKh) * 100 : 0;

    const yTotalTh = yearItems.reduce((acc, it) => acc + (Number(it.th) || 0), 0);
    const yTotalKh = yearItems.reduce((acc, it) => acc + (Number(it.kh) || 0), 0);
    const yTotalDiff = Number((yTotalTh - yTotalKh).toFixed(1));
    const yTotalRate = yTotalKh > 0 ? (yTotalTh / yTotalKh) * 100 : 0;

    return {
      month: {
        th: mTotalTh,
        kh: mTotalKh,
        diff: mTotalDiff,
        rate: mTotalRate.toFixed(1).replace('.', ',') + '%',
        isPass: mTotalRate >= 100
      },
      quarter: {
        th: qTotalTh,
        kh: qTotalKh,
        diff: qTotalDiff,
        rate: qTotalRate.toFixed(1).replace('.', ',') + '%',
        isPass: qTotalRate >= 100
      },
      year: {
        th: yTotalTh,
        kh: yTotalKh,
        diff: yTotalDiff,
        rate: yTotalRate.toFixed(1).replace('.', ',') + '%',
        isPass: yTotalRate >= 100
      }
    };
  }, [barData]);

  // 3-Period Structure Table Data (Biểu đồ 16 & 17)
  const structureData = SPDV_STRUCTURE_TABLE_DATA[selectedYear] || SPDV_STRUCTURE_TABLE_DATA['2026'];
  const monthHeader = `Tháng ${monthNum}/${selectedYear}`;
  const quarterHeader = `Quý ${quarterRoman}/${selectedYear} (lũy kế ${quarterCumText})`;
  const yearHeader = `Năm ${selectedYear} (lũy kế ${monthNum}T)`;

  const filteredStructureRows = useMemo(() => {
    const rows = structureData.rows || [];
    return rows.filter((r) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase().trim();
        if (!r.name.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [structureData, searchQuery]);

  return (
    <div className="spdv-detail-table-card">
      {/* Top Header with title and controls */}
      <div className="spdv-detail-header-wrap">
        <div className="spdv-header-title-box">
          <h3 className="spdv-detail-title">
            {isStructure
              ? `Cơ cấu doanh thu theo nhóm SPDV`
              : `Biểu đồ 18. Doanh thu 6 nhóm SPDV so với KH – Năm ${selectedYear}`}
          </h3>
          <span className="spdv-detail-unit">
            {isStructure ? '(Đơn vị: Triệu đồng)' : '(Đơn vị: Tỷ đồng)'}
          </span>
        </div>
      </div>

      {/* TABLE VIEW */}
      {!isStructure ? (
        /* ===================================================================== */
        /* BẢNG TỔNG HỢP BIỂU ĐỒ 18 TÍCH HỢP 3 HÌNH: THÁNG, QUÝ, NĂM             */
        /* ===================================================================== */
        <div className="spdv-detail-table-wrap">
          <table className="spdv-matrix-table">
            <thead>
              <tr className="spdv-th-top-row">
                <th rowSpan={2} style={{ width: '45px', textAlign: 'center' }}>STT</th>
                <th rowSpan={2} className="spdv-th-name">Nhóm SPDV</th>
                <th colSpan={4} className="spdv-th-period-group spdv-col-period-month">
                  {monthHeader}
                </th>
                <th colSpan={4} className="spdv-th-period-group spdv-col-period-quarter">
                  {quarterHeader}
                </th>
                <th colSpan={4} className="spdv-th-period-group spdv-col-period-year">
                  {yearHeader}
                </th>
              </tr>
              <tr className="spdv-th-sub-row">
                {/* Tháng */}
                <th className="spdv-th-col spdv-th-th spdv-border-left">TH T{monthNum}/{selectedYear}</th>
                <th className="spdv-th-col spdv-th-kh">KH T{monthNum}/{selectedYear}</th>
                <th className="spdv-th-col spdv-th-th">+/- so KH</th>
                <th className="spdv-th-col spdv-th-rate" style={{ textAlign: 'center' }}>% HTKH</th>

                {/* Quý */}
                <th className="spdv-th-col spdv-th-th spdv-border-left">Ước TH Q{quarterRoman}/{selectedYear}</th>
                <th className="spdv-th-col spdv-th-kh">KH Q{quarterRoman}/{selectedYear}</th>
                <th className="spdv-th-col spdv-th-th">+/- so KH</th>
                <th className="spdv-th-col spdv-th-rate" style={{ textAlign: 'center' }}>% HTKH</th>

                {/* Năm */}
                <th className="spdv-th-col spdv-th-th spdv-border-left">Ước TH Năm {selectedYear}</th>
                <th className="spdv-th-col spdv-th-kh">KH Năm {selectedYear}</th>
                <th className="spdv-th-col spdv-th-th">+/- so KH</th>
                <th className="spdv-th-col spdv-th-rate" style={{ textAlign: 'center' }}>% HTKH</th>
              </tr>
            </thead>
            <tbody>
              {filteredIntegratedRows.length > 0 ? (
                filteredIntegratedRows.map((row) => (
                  <tr key={row.id} className="spdv-row">
                    <td style={{ textAlign: 'center', fontWeight: '600', color: '#64748b' }}>
                      {row.stt}
                    </td>
                    <td className="spdv-td-name">
                      <span className="spdv-dot" style={{ backgroundColor: row.color }}></span>
                      <span className="spdv-name-label">{row.name}</span>
                    </td>

                    {/* Tháng */}
                    <td className="spdv-td-num spdv-border-left font-bold" style={{ color: '#0f172a' }}>
                      {formatSpdvNum(row.month?.th)}
                    </td>
                    <td className="spdv-td-num font-semibold" style={{ color: '#334155' }}>
                      {formatSpdvNum(row.month?.kh)}
                    </td>
                    <td className={`spdv-td-num font-bold ${row.month?.diff >= 0 ? 'text-green' : 'text-red'}`}>
                      {row.month?.diff >= 0 ? `+${formatSpdvNum(row.month?.diff)}` : formatSpdvNum(row.month?.diff)}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`spdv-rate-pill ${row.month?.isPass ? 'rate-pass' : 'rate-fail'}`}>
                        {row.month?.rate}
                      </span>
                    </td>

                    {/* Quý */}
                    <td className="spdv-td-num spdv-border-left font-bold" style={{ color: '#0f172a' }}>
                      {formatSpdvNum(row.quarter?.th)}
                    </td>
                    <td className="spdv-td-num font-semibold" style={{ color: '#334155' }}>
                      {formatSpdvNum(row.quarter?.kh)}
                    </td>
                    <td className={`spdv-td-num font-bold ${row.quarter?.diff >= 0 ? 'text-green' : 'text-red'}`}>
                      {row.quarter?.diff >= 0 ? `+${formatSpdvNum(row.quarter?.diff)}` : formatSpdvNum(row.quarter?.diff)}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`spdv-rate-pill ${row.quarter?.isPass ? 'rate-pass' : 'rate-fail'}`}>
                        {row.quarter?.rate}
                      </span>
                    </td>

                    {/* Năm */}
                    <td className="spdv-td-num spdv-border-left font-bold" style={{ color: '#0f172a' }}>
                      {formatSpdvNum(row.year?.th)}
                    </td>
                    <td className="spdv-td-num font-semibold" style={{ color: '#334155' }}>
                      {formatSpdvNum(row.year?.kh)}
                    </td>
                    <td className={`spdv-td-num font-bold ${row.year?.diff >= 0 ? 'text-green' : 'text-red'}`}>
                      {row.year?.diff >= 0 ? `+${formatSpdvNum(row.year?.diff)}` : formatSpdvNum(row.year?.diff)}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`spdv-rate-pill ${row.year?.isPass ? 'rate-pass' : 'rate-fail'}`}>
                        {row.year?.rate}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={14} className="spdv-no-data-cell">
                    Không tìm thấy dữ liệu nhóm SPDV phù hợp với điều kiện lọc
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr className="spdv-tr-total">
                <td style={{ textAlign: 'center', fontWeight: '800' }}>Σ</td>
                <td className="spdv-td-name font-bold">
                  Tổng doanh thu 6 nhóm SPDV
                </td>

                {/* Tháng */}
                <td className="spdv-td-num font-extrabold spdv-border-left" style={{ color: '#0f172a' }}>
                  {formatSpdvNum(integratedTotals.month.th)}
                </td>
                <td className="spdv-td-num font-extrabold" style={{ color: '#1e293b' }}>
                  {formatSpdvNum(integratedTotals.month.kh)}
                </td>
                <td className={`spdv-td-num font-extrabold ${integratedTotals.month.diff >= 0 ? 'text-green' : 'text-red'}`}>
                  {integratedTotals.month.diff >= 0 ? `+${formatSpdvNum(integratedTotals.month.diff)}` : formatSpdvNum(integratedTotals.month.diff)}
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span className={`spdv-rate-pill spdv-rate-pill-total ${integratedTotals.month.isPass ? 'rate-pass' : 'rate-fail'}`}>
                    {integratedTotals.month.rate}
                  </span>
                </td>

                {/* Quý */}
                <td className="spdv-td-num font-extrabold spdv-border-left" style={{ color: '#0f172a' }}>
                  {formatSpdvNum(integratedTotals.quarter.th)}
                </td>
                <td className="spdv-td-num font-extrabold" style={{ color: '#1e293b' }}>
                  {formatSpdvNum(integratedTotals.quarter.kh)}
                </td>
                <td className={`spdv-td-num font-extrabold ${integratedTotals.quarter.diff >= 0 ? 'text-green' : 'text-red'}`}>
                  {integratedTotals.quarter.diff >= 0 ? `+${formatSpdvNum(integratedTotals.quarter.diff)}` : formatSpdvNum(integratedTotals.quarter.diff)}
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span className={`spdv-rate-pill spdv-rate-pill-total ${integratedTotals.quarter.isPass ? 'rate-pass' : 'rate-fail'}`}>
                    {integratedTotals.quarter.rate}
                  </span>
                </td>

                {/* Năm */}
                <td className="spdv-td-num font-extrabold spdv-border-left" style={{ color: '#0f172a' }}>
                  {formatSpdvNum(integratedTotals.year.th)}
                </td>
                <td className="spdv-td-num font-extrabold" style={{ color: '#1e293b' }}>
                  {formatSpdvNum(integratedTotals.year.kh)}
                </td>
                <td className={`spdv-td-num font-extrabold ${integratedTotals.year.diff >= 0 ? 'text-green' : 'text-red'}`}>
                  {integratedTotals.year.diff >= 0 ? `+${formatSpdvNum(integratedTotals.year.diff)}` : formatSpdvNum(integratedTotals.year.diff)}
                </td>
                <td style={{ textAlign: 'center' }}>
                  <span className={`spdv-rate-pill spdv-rate-pill-total ${integratedTotals.year.isPass ? 'rate-pass' : 'rate-fail'}`}>
                    {integratedTotals.year.rate}
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      ) : (
        /* ===================================================================== */
        /* BẢNG TỔNG HỢP CƠ CẤU 3 KỲ (CÓ CỘT KH, TH VÀ TỶ TRỌNG TH)             */
        /* ===================================================================== */
        <div className="spdv-detail-table-wrap">
          <table className="spdv-matrix-table">
            <thead>
              <tr className="spdv-th-top-row">
                <th rowSpan={2} className="spdv-th-name">Nhóm SPDV</th>
                <th colSpan={4} className="spdv-th-period-group spdv-col-period-month">
                  {monthHeader}
                </th>
                <th colSpan={4} className="spdv-th-period-group spdv-col-period-quarter">
                  {quarterHeader}
                </th>
                <th colSpan={4} className="spdv-th-period-group spdv-col-period-year">
                  {yearHeader}
                </th>
              </tr>
              <tr className="spdv-th-sub-row">
                {/* Tháng */}
                <th className="spdv-th-col spdv-th-th spdv-border-left">TH T{monthNum}/{selectedYear}</th>
                <th className="spdv-th-col spdv-th-share">Tỷ trọng TH</th>
                <th className="spdv-th-col spdv-th-kh">KH T{monthNum}/{selectedYear}</th>
                <th className="spdv-th-col spdv-th-share">Tỷ trọng KH</th>

                {/* Quý */}
                <th className="spdv-th-col spdv-th-th spdv-border-left">TH Q{quarterRoman}/{selectedYear}</th>
                <th className="spdv-th-col spdv-th-share">Tỷ trọng TH</th>
                <th className="spdv-th-col spdv-th-kh">KH Q{quarterRoman}/{selectedYear}</th>
                <th className="spdv-th-col spdv-th-share">Tỷ trọng KH</th>

                {/* Năm */}
                <th className="spdv-th-col spdv-th-th spdv-border-left">TH Năm {selectedYear}</th>
                <th className="spdv-th-col spdv-th-share">Tỷ trọng TH</th>
                <th className="spdv-th-col spdv-th-kh">KH Năm {selectedYear}</th>
                <th className="spdv-th-col spdv-th-share">Tỷ trọng KH</th>
              </tr>
            </thead>
            <tbody>
              {filteredStructureRows.length > 0 ? (
                filteredStructureRows.map((row) => (
                  <tr key={row.id} className="spdv-row">
                    <td className="spdv-td-name">
                      <span className="spdv-dot" style={{ backgroundColor: row.color }}></span>
                      <span className="spdv-name-label">{row.name}</span>
                    </td>

                    {/* Tháng */}
                    <td className="spdv-td-num spdv-border-left font-bold" style={{ color: '#0f172a' }}>
                      {formatSpdvNum(row.month?.th)}
                    </td>
                    <td className="spdv-td-share">{row.month?.thShare}</td>
                    <td className="spdv-td-num font-semibold" style={{ color: '#334155' }}>
                      {formatSpdvNum(row.month?.kh)}
                    </td>
                    <td className="spdv-td-share">{row.month?.khShare}</td>

                    {/* Quý */}
                    <td className="spdv-td-num spdv-border-left font-bold" style={{ color: '#0f172a' }}>
                      {formatSpdvNum(row.quarter?.th)}
                    </td>
                    <td className="spdv-td-share">{row.quarter?.thShare}</td>
                    <td className="spdv-td-num font-semibold" style={{ color: '#334155' }}>
                      {formatSpdvNum(row.quarter?.kh)}
                    </td>
                    <td className="spdv-td-share">{row.quarter?.khShare}</td>

                    {/* Năm */}
                    <td className="spdv-td-num spdv-border-left font-bold" style={{ color: '#0f172a' }}>
                      {formatSpdvNum(row.year?.th)}
                    </td>
                    <td className="spdv-td-share">{row.year?.thShare}</td>
                    <td className="spdv-td-num font-semibold" style={{ color: '#334155' }}>
                      {formatSpdvNum(row.year?.kh)}
                    </td>
                    <td className="spdv-td-share">{row.year?.khShare}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={13} className="spdv-no-data-cell">
                    Không tìm thấy dữ liệu nhóm SPDV phù hợp với điều kiện lọc
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr className="spdv-tr-total">
                <td className="spdv-td-name font-bold">
                  {structureData.total?.name || 'Tổng doanh thu'}
                </td>

                {/* Tháng */}
                <td className="spdv-td-num font-bold spdv-border-left" style={{ color: '#0f172a' }}>
                  {formatSpdvNum(structureData.total?.month?.th)}
                </td>
                <td className="spdv-td-share font-bold">{structureData.total?.month?.thShare}</td>
                <td className="spdv-td-num font-bold" style={{ color: '#1e293b' }}>
                  {formatSpdvNum(structureData.total?.month?.kh)}
                </td>
                <td className="spdv-td-share font-bold">{structureData.total?.month?.khShare}</td>

                {/* Quý */}
                <td className="spdv-td-num font-bold spdv-border-left" style={{ color: '#0f172a' }}>
                  {formatSpdvNum(structureData.total?.quarter?.th)}
                </td>
                <td className="spdv-td-share font-bold">{structureData.total?.quarter?.thShare}</td>
                <td className="spdv-td-num font-bold" style={{ color: '#1e293b' }}>
                  {formatSpdvNum(structureData.total?.quarter?.kh)}
                </td>
                <td className="spdv-td-share font-bold">{structureData.total?.quarter?.khShare}</td>

                {/* Năm */}
                <td className="spdv-td-num font-bold spdv-border-left" style={{ color: '#0f172a' }}>
                  {formatSpdvNum(structureData.total?.year?.th)}
                </td>
                <td className="spdv-td-share font-bold">{structureData.total?.year?.thShare}</td>
                <td className="spdv-td-num font-bold" style={{ color: '#1e293b' }}>
                  {formatSpdvNum(structureData.total?.year?.kh)}
                </td>
                <td className="spdv-td-share font-bold">{structureData.total?.year?.khShare}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}
