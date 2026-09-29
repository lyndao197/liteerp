import React from 'react';
import { HelpCircle, X, Info } from 'lucide-react';
import { ABBREVIATION_LIST } from '../utils/reportAbbreviations';

export default function AbbreviationsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  // Group items by category
  const groups = {
    'Chỉ số thực hiện & Kế hoạch': ABBREVIATION_LIST.filter(i => i.group === 'Chỉ số thực hiện & Kế hoạch'),
    'Chỉ tiêu tài chính & Nghiệp vụ': ABBREVIATION_LIST.filter(i => i.group === 'Chỉ tiêu tài chính & Nghiệp vụ'),
    'Kỳ thời gian': ABBREVIATION_LIST.filter(i => i.group === 'Kỳ thời gian')
  };

  return (
    <div className="abbr-modal-overlay" onClick={onClose}>
      <div className="abbr-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="abbr-modal-header">
          <div className="abbr-modal-title-wrap">
            <div className="abbr-modal-icon">
              <HelpCircle size={20} />
            </div>
            <div>
              <h3 className="abbr-modal-title">Bảng giải thích các chữ viết tắt</h3>
              <p className="abbr-modal-subtitle">Quy ước ký hiệu và thuật ngữ trên các biểu đồ báo cáo doanh thu</p>
            </div>
          </div>
          <button className="abbr-modal-close-btn" onClick={onClose} title="Đóng">
            <X size={18} />
          </button>
        </div>

        <div className="abbr-modal-body">
          {Object.entries(groups).map(([groupName, items]) => (
            <div key={groupName} className="abbr-group-section">
              <h4 className="abbr-group-title">{groupName}</h4>
              <div className="abbr-grid">
                {items.map((item) => (
                  <div key={item.abbr} className="abbr-card">
                    <div className="abbr-badge-row">
                      <span className="abbr-badge">{item.abbr}</span>
                      <span className="abbr-full-name">{item.full}</span>
                    </div>
                    <p className="abbr-desc">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="abbr-tip-box">
            <Info size={16} className="abbr-tip-icon" />
            <div>
              <strong>Mẹo hữu ích:</strong> Bạn có thể <em>rê chuột (hover)</em> trực tiếp vào bất kỳ mục chú thích màu (Legend), nhãn trục hoặc cột/thanh biểu đồ để xem thông tin diễn giải nhanh ngay tại chỗ.
            </div>
          </div>
        </div>

        <div className="abbr-modal-footer">
          <button className="abbr-btn-close-primary" onClick={onClose}>
            Đã hiểu
          </button>
        </div>
      </div>
    </div>
  );
}
