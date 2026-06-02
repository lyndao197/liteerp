import React, { useState } from "react";
const svgPaths = {
  p85df110: "M8.69276 12C8.82771 12 8.94939 11.9686 9.05782 11.906C9.16626 11.8434 9.25301 11.7578 9.31807 11.6494C9.38313 11.5409 9.41566 11.4193 9.41566 11.2844C9.41566 11.0916 9.34337 10.9229 9.19879 10.7783L4.31205 5.99999L9.19879 1.22169C9.34337 1.07711 9.41566 0.908433 9.41566 0.715662C9.41566 0.575902 9.38313 0.453011 9.31807 0.346987C9.25301 0.240963 9.16626 0.156626 9.05782 0.0939758C8.94939 0.0313253 8.82771 1.71661e-08 8.69276 1.71661e-08C8.49518 1.71661e-08 8.32892 0.0698795 8.19397 0.209638L2.81567 5.46505C2.73374 5.54216 2.6747 5.62529 2.63856 5.71445C2.60242 5.8036 2.58434 5.89878 2.58434 5.99999C2.58434 6.1012 2.60242 6.19638 2.63856 6.28553C2.6747 6.37469 2.73374 6.45782 2.81567 6.53493L8.19397 11.7903C8.32892 11.9301 8.49518 12 8.69276 12Z",
  p3a0be400: "M14.6667 13.3334C14.6667 14.0685 14.0685 14.6667 13.3334 14.6667H12.0001V9.7778C12.0001 9.04136 11.4032 8.44446 10.6667 8.44446H5.33334C4.5969 8.44446 4.00002 9.04136 4.00002 9.7778V14.6667H2.66668C1.93156 14.6667 1.33334 14.0685 1.33334 13.3334V2.66668C1.33334 1.93156 1.93156 1.33334 2.66668 1.33334H4.00002V4.00002C4.00002 4.73646 4.5969 5.33334 5.33334 5.33334H10.6667C11.4032 5.33334 12.0001 4.73646 12.0001 4.00002V1.66312L14.6667 4.32979V13.3334ZM5.33334 14.6667H10.6667V9.7778H5.33334V14.6667ZM5.33334 4.00002H10.6667V1.33334H5.33334V4.00002ZM15.6094 3.38712L12.613 0.390668C12.4427 0.220445 12.2294 0.105334 12.0001 0.0466668V0H11.6703H4.00002H2.66668C1.19423 0 0 1.19423 0 2.66668V13.3334C0 14.8058 1.19423 16 2.66668 16H4.00002H12.0001H13.3334C14.8058 16 16 14.8058 16 13.3334V4.32979C16 3.97645 15.8596 3.63735 15.6094 3.38712Z",
  pa30c600: "M8.00002 16C9.09675 16 10.1267 15.7913 11.0898 15.3738C12.0529 14.9562 12.9033 14.38 13.6409 13.6451C14.3786 12.9103 14.9562 12.0599 15.3738 11.094C15.7913 10.1281 16 9.09675 16 8.00002C16 6.90885 15.7899 5.88032 15.3696 4.91441C14.9493 3.94851 14.3702 3.09674 13.6326 2.35909C12.895 1.62143 12.0446 1.04384 11.0815 0.626307C10.1183 0.208769 9.0884 0 7.99167 0C6.90051 0 5.87336 0.208769 4.91024 0.626307C3.94713 1.04384 3.09674 1.62143 2.35909 2.35909C1.62143 3.09674 1.04384 3.94851 0.626307 4.91441C0.208769 5.88032 0 6.90885 0 8.00002C0 9.09675 0.21016 10.1281 0.630482 11.094C1.05081 12.0599 1.6284 12.9103 2.36326 13.6451C3.09813 14.38 3.94713 14.9562 4.91024 15.3738C5.87336 15.7913 6.90328 16 8.00002 16ZM8.00002 14.7892C7.05917 14.7892 6.17816 14.6139 5.357 14.2631C4.53585 13.9124 3.81629 13.4266 3.19834 12.8059C2.58038 12.1851 2.09743 11.4642 1.74948 10.6431C1.40154 9.82187 1.22756 8.94088 1.22756 8.00002C1.22756 7.06474 1.40154 6.18652 1.74948 5.36536C2.09743 4.5442 2.58038 3.82326 3.19834 3.20252C3.81629 2.58178 4.53446 2.09603 5.35283 1.7453C6.17121 1.39457 7.05082 1.21921 7.99167 1.21921C8.93809 1.21921 9.82045 1.39457 10.6389 1.7453C11.4572 2.09603 12.1768 2.58178 12.7975 3.20252C13.4183 3.82326 13.904 4.5442 14.2547 5.36536C14.6055 6.18652 14.7808 7.06474 14.7808 8.00002C14.7864 8.94088 14.6139 9.82187 14.2631 10.6431C13.9124 11.4642 13.4266 12.1851 12.8059 12.8059C12.1851 13.4266 11.4642 13.9124 10.6431 14.2631C9.82187 14.6139 8.94088 14.7892 8.00002 14.7892ZM9.11903 11.1399C9.01881 11.2401 8.89355 11.2902 8.74324 11.2902C8.59293 11.2902 8.46905 11.2401 8.37163 11.1399C8.27421 11.0397 8.22549 10.9172 8.22549 10.7725C8.22549 10.6166 8.27838 10.4857 8.38416 10.38L9.47811 9.31108L10.4384 8.47602L8.8518 8.53447H4.4593C4.29786 8.53447 4.16702 8.48297 4.06681 8.37998C3.9666 8.27699 3.9165 8.14756 3.9165 7.99167C3.9165 7.83022 3.9666 7.6994 4.06681 7.59919C4.16702 7.49898 4.29786 7.44887 4.4593 7.44887H8.8518L10.4384 7.50733L9.47811 6.6806L8.38416 5.595C8.27838 5.48922 8.22549 5.36118 8.22549 5.21087C8.22549 5.06612 8.27421 4.94364 8.37163 4.84344C8.46905 4.74323 8.59293 4.69312 8.74324 4.69312C8.89912 4.69312 9.02438 4.74323 9.11903 4.84344L11.8414 7.57413C11.975 7.71331 12.0418 7.85249 12.0418 7.99167C12.0418 8.13642 11.975 8.27559 11.8414 8.40921L9.11903 11.1399Z"
};

function ChevronBackward() {
  return (
    <div className="relative shrink-0 size-[12px]">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_1_787)">
          <path d="M8.69276 12C8.82771 12 8.94939 11.9686 9.05782 11.906C9.16626 11.8434 9.25301 11.7578 9.31807 11.6494C9.38313 11.5409 9.41566 11.4193 9.41566 11.2844C9.41566 11.0916 9.34337 10.9229 9.19879 10.7783L4.31205 5.99999L9.19879 1.22169C9.34337 1.07711 9.41566 0.908433 9.41566 0.715662C9.41566 0.575902 9.38313 0.453011 9.31807 0.346987C9.25301 0.240963 9.16626 0.156626 9.05782 0.0939758C8.94939 0.0313253 8.82771 1.71661e-08 8.69276 1.71661e-08C8.49518 1.71661e-08 8.32892 0.0698795 8.19397 0.209638L2.81567 5.46505C2.73374 5.54216 2.6747 5.62529 2.63856 5.71445C2.60242 5.8036 2.58434 5.89878 2.58434 5.99999C2.58434 6.1012 2.60242 6.19638 2.63856 6.28553C2.6747 6.37469 2.73374 6.45782 2.81567 6.53493L8.19397 11.7903C8.32892 11.9301 8.49518 12 8.69276 12Z" fill="#81878F" />
        </g>
        <defs>
          <clipPath id="clip0_1_787">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function SaveIcon() {
  return (
    <div className="relative shrink-0 size-4">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_1_774)">
          <path clipRule="evenodd" d="M14.6667 13.3334C14.6667 14.0685 14.0685 14.6667 13.3334 14.6667H12.0001V9.7778C12.0001 9.04136 11.4032 8.44446 10.6667 8.44446H5.33334C4.5969 8.44446 4.00002 9.04136 4.00002 9.7778V14.6667H2.66668C1.93156 14.6667 1.33334 14.0685 1.33334 13.3334V2.66668C1.33334 1.93156 1.93156 1.33334 2.66668 1.33334H4.00002V4.00002C4.00002 4.73646 4.5969 5.33334 5.33334 5.33334H10.6667C11.4032 5.33334 12.0001 4.73646 12.0001 4.00002V1.66312L14.6667 4.32979V13.3334ZM5.33334 14.6667H10.6667V9.7778H5.33334V14.6667ZM5.33334 4.00002H10.6667V1.33334H5.33334V4.00002ZM15.6094 3.38712L12.613 0.390668C12.4427 0.220445 12.2294 0.105334 12.0001 0.0466668V0H11.6703H4.00002H2.66668C1.19423 0 0 1.19423 0 2.66668V13.3334C0 14.8058 1.19423 16 2.66668 16H4.00002H12.0001H13.3334C14.8058 16 16 14.8058 16 13.3334V4.32979C16 3.97645 15.8596 3.63735 15.6094 3.38712Z" fill="#ED0029" fillRule="evenodd" />
        </g>
        <defs>
          <clipPath id="clip0_1_774">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function ArrowForwardCircle() {
  return (
    <div className="relative shrink-0 size-4">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_1_781)">
          <path clipRule="evenodd" d="M8.00002 16C9.09675 16 10.1267 15.7913 11.0898 15.3738C12.0529 14.9562 12.9033 14.38 13.6409 13.6451C14.3786 12.9103 14.9562 12.0599 15.3738 11.094C15.7913 10.1281 16 9.09675 16 8.00002C16 6.90885 15.7899 5.88032 15.3696 4.91441C14.9493 3.94851 14.3702 3.09674 13.6326 2.35909C12.895 1.62143 12.0446 1.04384 11.0815 0.626307C10.1183 0.208769 9.0884 0 7.99167 0C6.90051 0 5.87336 0.208769 4.91024 0.626307C3.94713 1.04384 3.09674 1.62143 2.35909 2.35909C1.62143 3.09674 1.04384 3.94851 0.626307 4.91441C0.208769 5.88032 0 6.90885 0 8.00002C0 9.09675 0.21016 10.1281 0.630482 11.094C1.05081 12.0599 1.6284 12.9103 2.36326 13.6451C3.09813 14.38 3.94713 14.9562 4.91024 15.3738C5.87336 15.7913 6.90328 16 8.00002 16ZM8.00002 14.7892C7.05917 14.7892 6.17816 14.6139 5.357 14.2631C4.53585 13.9124 3.81629 13.4266 3.19834 12.8059C2.58038 12.1851 2.09743 11.4642 1.74948 10.6431C1.40154 9.82187 1.22756 8.94088 1.22756 8.00002C1.22756 7.06474 1.40154 6.18652 1.74948 5.36536C2.09743 4.5442 2.58038 3.82326 3.19834 3.20252C3.81629 2.58178 4.53446 2.09603 5.35283 1.7453C6.17121 1.39457 7.05082 1.21921 7.99167 1.21921C8.93809 1.21921 9.82045 1.39457 10.6389 1.7453C11.4572 2.09603 12.1768 2.58178 12.7975 3.20252C13.4183 3.82326 13.904 4.5442 14.2547 5.36536C14.6055 6.18652 14.7808 7.06474 14.7808 8.00002C14.7864 8.94088 14.6139 9.82187 14.2631 10.6431C13.9124 11.4642 13.4266 12.1851 12.8059 12.8059C12.1851 13.4266 11.4642 13.9124 10.6431 14.2631C9.82187 14.6139 8.94088 14.7892 8.00002 14.7892ZM9.11903 11.1399C9.01881 11.2401 8.89355 11.2902 8.74324 11.2902C8.59293 11.2902 8.46905 11.2401 8.37163 11.1399C8.27421 11.0397 8.22549 10.9172 8.22549 10.7725C8.22549 10.6166 8.27838 10.4857 8.38416 10.38L9.47811 9.31108L10.4384 8.47602L8.8518 8.53447H4.4593C4.29786 8.53447 4.16702 8.48297 4.06681 8.37998C3.9666 8.27699 3.9165 8.14756 3.9165 7.99167C3.9165 7.83022 3.9666 7.6994 4.06681 7.59919C4.16702 7.49898 4.29786 7.44887 4.4593 7.44887H8.8518L10.4384 7.50733L9.47811 6.6806L8.38416 5.595C8.27838 5.48922 8.22549 5.36118 8.22549 5.21087C8.22549 5.06612 8.27421 4.94364 8.37163 4.84344C8.46905 4.74323 8.59293 4.69312 8.74324 4.69312C8.89912 4.69312 9.02438 4.74323 9.11903 4.84344L11.8414 7.57413C11.975 7.71331 12.0418 7.85249 12.0418 7.99167C12.0418 8.13642 11.975 8.27559 11.8414 8.40921L9.11903 11.1399Z" fill="white" fillRule="evenodd" />
        </g>
        <defs>
          <clipPath id="clip0_1_781">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

export function Header({ formData, updateStatus, validateForm, isEdit, navigate, setShowRejectModal, handleApproveDraft, handleApproveSigned, uploadedFile }) {
  return (
    <div className="bg-white px-6 py-3 flex items-center justify-between border-b border-gray-200">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate("/contracts")} className="h-[34px] rounded border border-[#efeded] flex items-center gap-1.5 px-3 hover:bg-gray-50 bg-white">
          <ChevronBackward />
          <span className="font-medium text-xs text-[#494949]">Trở về</span>
        </button>
        <div className="relative">
          <select className="h-[34px] px-3 pr-10 border border-[#efeded] rounded focus:outline-none focus:border-[#ed0029] text-xs appearance-none bg-white min-w-[200px]">
            <option>Template hợp đồng</option>
            <option>Template 1</option>
            <option>Template 2</option>
            <option>Template 3</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <button className="bg-white h-[34px] rounded border border-[#efeded] flex items-center gap-1.5 px-3 hover:bg-gray-50">
          <span className="font-medium text-xs text-[#494949]">Lịch sử hoạt động</span>
        </button>

        {(!formData.approvalStatus || formData.approvalStatus === "Nháp") && (
          <>
            <button onClick={() => updateStatus("Nháp")} className="bg-white h-[34px] rounded border border-[#ed0029] flex items-center gap-1.5 px-3 hover:bg-red-50">
              <SaveIcon />
              <span className="font-medium text-xs text-[#ed0029]">Lưu nháp</span>
            </button>
            <button onClick={() => { if (validateForm()) updateStatus("Chờ duyệt bản thảo"); }} className="bg-[#ed0029] h-[34px] rounded border border-[#ed0029] flex items-center gap-1.5 px-3 hover:bg-[#d40025]">
              <span className="font-medium text-xs text-white">Gửi phê duyệt bản thảo</span>
              <ArrowForwardCircle />
            </button>
          </>
        )}

        {formData.approvalStatus === "Chờ duyệt bản thảo" && (
          <>
            <button onClick={() => setShowRejectModal(true)} className="bg-white h-[34px] rounded border border-[#64748B] flex items-center gap-1.5 px-3 hover:bg-gray-50">
              <span className="font-medium text-xs text-[#64748B]">Từ chối</span>
            </button>
            {!formData.isLegalApprovedDraft && (
              <button onClick={() => handleApproveDraft("Legal")} className="bg-[#3b82f6] h-[34px] rounded flex items-center gap-1.5 px-3 hover:bg-blue-600 text-white font-medium text-xs">
                PC duyệt bản thảo
              </button>
            )}
            {formData.isLegalApprovedDraft && (
              <div className="flex items-center gap-1 text-green-500 font-semibold text-sm px-2">
                PC Đã duyệt
              </div>
            )}
            {!formData.isManagerApprovedDraft && (
              <button onClick={() => handleApproveDraft("Manager")} className="bg-[#f59e0b] h-[34px] rounded flex items-center gap-1.5 px-3 hover:bg-yellow-600 text-white font-medium text-xs">
                TP duyệt bản thảo
              </button>
            )}
            {formData.isManagerApprovedDraft && (
              <div className="flex items-center gap-1 text-green-500 font-semibold text-sm px-2">
                TP Đã duyệt
              </div>
            )}
          </>
        )}

        {formData.approvalStatus === "Chờ Upload" && (
          <button
            className={`h-[34px] rounded flex items-center gap-1.5 px-3 font-medium text-xs text-white ${uploadedFile ? 'bg-[#e32b4c] hover:bg-[#d40025] cursor-pointer' : 'bg-[#cbd5e1] cursor-not-allowed'}`}
            onClick={() => { if (uploadedFile) updateStatus("Chờ duyệt bản ký"); }}
            disabled={!uploadedFile}
          >
            Gửi duyệt bản ký
          </button>
        )}

        {formData.approvalStatus === "Chờ duyệt bản ký" && (
          <>
            <button onClick={() => setShowRejectModal(true)} className="bg-white h-[34px] rounded border border-[#64748B] flex items-center gap-1.5 px-3 hover:bg-gray-50">
              <span className="font-medium text-xs text-[#64748B]">Từ chối</span>
            </button>
            {!formData.isLegalApprovedSigned && (
              <button onClick={() => handleApproveSigned("Legal")} className="bg-[#3b82f6] h-[34px] rounded flex items-center gap-1.5 px-3 hover:bg-blue-600 text-white font-medium text-xs">
                PC duyệt bản ký
              </button>
            )}
            {formData.isLegalApprovedSigned && (
              <div className="flex items-center gap-1 text-green-500 font-semibold text-sm px-2">
                PC Đã duyệt
              </div>
            )}
            {!formData.isManagerApprovedSigned && (
              <button onClick={() => handleApproveSigned("Manager")} className="bg-[#f59e0b] h-[34px] rounded flex items-center gap-1.5 px-3 hover:bg-yellow-600 text-white font-medium text-xs">
                TP duyệt bản ký
              </button>
            )}
            {formData.isManagerApprovedSigned && (
              <div className="flex items-center gap-1 text-green-500 font-semibold text-sm px-2">
                TP Đã duyệt
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function FormField({ label, value, onChange, type = "text", required = false, options, readOnly = false }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[#494949]">
        {label}{required && <span className="text-red-500">*</span>}
      </label>
      {type === "file" ? (
        <input
          type="file"
          onChange={(e) => onChange && onChange(e.target.files[0])}
          disabled={readOnly}
          className="w-full px-3 py-2 border border-[#efeded] rounded focus:outline-none focus:border-[#ed0029] text-sm file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:bg-[#ed0029] file:text-white hover:file:bg-[#d40025]"
        />
      ) : type === "textarea" ? (
        <textarea
          value={value || ""}
          onChange={(e) => onChange && onChange(e.target.value)}
          disabled={readOnly}
          rows={3}
          className="w-full px-3 py-2 border border-[#efeded] rounded focus:outline-none focus:border-[#ed0029] text-sm resize-none"
        />
      ) : type === "select" ? (
        <div className="relative">
          <select
            value={value || ""}
            onChange={(e) => onChange && onChange(e.target.value)}
            disabled={readOnly}
            className="w-full px-3 py-2 pr-10 border border-[#efeded] rounded focus:outline-none focus:border-[#ed0029] text-sm appearance-none bg-white"
          >
            <option value="">{value || "-- Chọn --"}</option>
            {options?.map((opt, idx) => {
              if (typeof opt === 'object') {
                return <option key={idx} value={opt.value}>{opt.label}</option>;
              }
              return <option key={idx} value={opt}>{opt}</option>;
            })}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      ) : (
        <input
          type={type}
          value={value || ""}
          onChange={(e) => onChange && onChange(e.target.value)}
          disabled={readOnly}
          className="w-full px-3 py-2 border border-[#efeded] rounded focus:outline-none focus:border-[#ed0029] text-sm"
        />
      )}
    </div>
  );
}

function ProductTable({ expanded }) {
  if (!expanded) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#494949]">
          Sản phẩm <span className="text-gray-500 font-normal">(mở rộng để xem chi tiết)</span>
        </label>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[#494949]">Sản phẩm</label>
      <div className="border border-[#efeded] rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left font-medium text-[#494949] border-b border-r border-gray-200">Logi dự án</th>
              <th className="px-3 py-2 text-left font-medium text-[#494949] border-b border-r border-gray-200">Nhóm dịch vụ</th>
              <th className="px-3 py-2 text-left font-medium text-[#494949] border-b border-r border-gray-200">Tên dịch vụ</th>
              <th className="px-3 py-2 text-left font-medium text-[#494949] border-b border-r border-gray-200">SL</th>
              <th className="px-3 py-2 text-left font-medium text-[#494949] border-b border-r border-gray-200">Đơn vị</th>
              <th className="px-3 py-2 text-left font-medium text-[#494949] border-b border-r border-gray-200">Đơn giá</th>
              <th className="px-3 py-2 text-left font-medium text-[#494949] border-b border-r border-gray-200">Thuế (%)</th>
              <th className="px-3 py-2 text-left font-medium text-[#494949] border-b border-gray-200">Mô tả thêm</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-200 bg-white">
              <td className="px-3 py-2 border-r border-gray-200"><select className="w-full border-0 bg-transparent text-sm"><option>--</option></select></td>
              <td className="px-3 py-2 border-r border-gray-200"><select className="w-full border-0 bg-transparent text-sm"><option>--</option></select></td>
              <td className="px-3 py-2 border-r border-gray-200"><select className="w-full border-0 bg-transparent text-sm"><option>--</option></select></td>
              <td className="px-3 py-2 border-r border-gray-200"><input type="number" className="w-full border-0 bg-transparent text-sm" /></td>
              <td className="px-3 py-2 border-r border-gray-200"><select className="w-full border-0 bg-transparent text-sm"><option>--</option></select></td>
              <td className="px-3 py-2 border-r border-gray-200"><input type="text" className="w-full border-0 bg-transparent text-sm" /></td>
              <td className="px-3 py-2 border-r border-gray-200"><input type="number" placeholder="0" className="w-full border-0 bg-transparent text-sm" /></td>
              <td className="px-3 py-2"><input type="text" className="w-full border-0 bg-transparent text-sm" /></td>
            </tr>
          </tbody>
        </table>
      </div>
      <button className="text-sm text-[#ed0029] font-medium hover:underline">+ Thêm dòng</button>
    </div>
  );
}

function CostTable() {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[#494949]">Chi phí</label>
      <div className="border border-[#efeded] rounded overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left font-medium text-[#494949] border-b border-r border-gray-200">Tên chi phí</th>
              <th className="px-3 py-2 text-left font-medium text-[#494949] border-b border-gray-200">Số tiền</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-200 bg-white">
              <td className="px-3 py-2 border-r border-gray-200">
                <input type="text" placeholder="Nhập tên chi phí" className="w-full border-0 focus:outline-none text-sm" />
              </td>
              <td className="px-3 py-2">
                <input type="number" placeholder="0" className="w-full border-0 focus:outline-none text-sm" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <button className="text-sm text-[#ed0029] font-medium hover:underline">+ Thêm dòng</button>
    </div>
  );
}

function CommissionTable() {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[#494949]">Chia hoa hồng</label>
      <div className="border border-[#efeded] rounded overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left font-medium text-[#494949] border-b border-r border-gray-200">Người nhận</th>
              <th className="px-3 py-2 text-left font-medium text-[#494949] border-b border-r border-gray-200">Phòng ban</th>
              <th className="px-3 py-2 text-left font-medium text-[#494949] border-b border-gray-200">Tỷ lệ (%)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-200 bg-white">
              <td className="px-3 py-2 border-r border-gray-200">
                <select className="w-full border-0 focus:outline-none text-sm bg-transparent"><option>-- Chọn người nhận --</option></select>
              </td>
              <td className="px-3 py-2 border-r border-gray-200">
                <select className="w-full border-0 focus:outline-none text-sm bg-transparent"><option>-- Chọn phòng ban --</option></select>
              </td>
              <td className="px-3 py-2">
                <input type="number" placeholder="0" className="w-full border-0 focus:outline-none text-sm" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SectionHeader({ title }) {
  return (
    <div className="py-3 border-b border-gray-200 mb-4">
      <h3 className="font-semibold text-sm text-[#494949]">{title}</h3>
    </div>
  );
}

function DocumentAttachment({ expanded }) {
  if (!expanded) {
    return (
      <div className="mt-4">
        <p className="text-sm text-gray-500">(mở rộng để xem chi tiết)</p>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#ed0029] transition-colors cursor-pointer bg-white shadow-sm">
        <div className="flex flex-col items-center gap-2">
          <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-sm text-gray-600">Drag and drop or Browse your file</p>
        </div>
      </div>
      <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-[#494949] w-16">No</th>
              <th className="px-4 py-3 text-left font-medium text-[#494949]">Tài liệu</th>
              <th className="px-4 py-3 text-left font-medium text-[#494949]">Loại tài liệu</th>
              <th className="px-4 py-3 text-left font-medium text-[#494949]">Nội dung tài liệu</th>
              <th className="px-4 py-3 text-left font-medium text-[#494949]">Ngày tạo</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-200 hover:bg-gray-50 bg-white">
              <td className="px-4 py-3 text-gray-600">01</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 18h12V6h-4V2H4v16zm-2 1V0h10l4 4v15H2v-1z"/>
                  </svg>
                  <a href="#" className="text-blue-600 hover:underline">Tailieugia.pdf</a>
                </div>
              </td>
              <td className="px-4 py-3">
                <select className="w-full border-0 focus:outline-none text-sm appearance-none pr-6 text-gray-600 bg-transparent"><option>Báo giá</option></select>
              </td>
              <td className="px-4 py-3 text-gray-600">Tài liệu về giá sản phẩm</td>
              <td className="px-4 py-3 text-gray-500">02/09/2026 by Author</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function ContractInfoForm({ expanded, formData, updateField, customers, handleCustomerChange, handleEffectiveDateChange, isReadOnly }) {
  const customerOptions = [
    { value: "", label: "Chọn khách hàng" },
    ...customers.map(c => ({ value: c.id, label: c.name }))
  ];

  return (
    <div className="p-6 space-y-6">
      {/* A. THÔNG TIN CHUNG */}
      <div>
        <h2 className="font-semibold text-base text-[#494949] mb-4">A. THÔNG TIN CHUNG</h2>
        <div className="mb-6">
          <SectionHeader title="1. Thông tin chung" />
          <div className="space-y-4">
            <FormField label="Số hợp đồng" value={formData.contractNo} onChange={(v) => updateField('contractNo', v)} readOnly={isReadOnly} required />
            <FormField label="Tên hợp đồng" value={formData.name} onChange={(v) => updateField('name', v)} readOnly={isReadOnly} required />
            <FormField label="Loại hợp đồng" value={formData.classification} onChange={(v) => updateField('classification', v)} type="select" options={["Dịch vụ", "Mua bán", "Cho thuê", "Khác"]} readOnly={isReadOnly} required />
            <FormField label="Căn cứ" value={formData.serviceContent} onChange={(v) => updateField('serviceContent', v)} type="textarea" readOnly={isReadOnly} />
            <ProductTable expanded={expanded} />

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Loại tiền mua" value="VND" type="select" options={["VND", "USD", "EUR", "JPY"]} readOnly={isReadOnly} required />
              <FormField label="Tỉ giá mua" value="1" type="number" readOnly={isReadOnly} required />
            </div>

            <FormField label="Tổng giá bán trước thuế" value={formData.contractValue} onChange={(v) => updateField('contractValue', v)} type="number" readOnly={isReadOnly} required />
            <FormField label="Số ngày công nợ" value="30" type="number" readOnly={isReadOnly} />
          </div>
        </div>

        <div className="mb-6">
          <SectionHeader title="2. Bên A" />
          <div className="space-y-4">
            <FormField label="Khách hàng" value={formData.customerId} onChange={(v) => handleCustomerChange(v)} type="select" options={customerOptions} readOnly={isReadOnly} required />
            <FormField label="Đại diện bên mua" value={formData.customerRep || ""} onChange={(v) => updateField('customerRep', v)} readOnly={isReadOnly} />
            <FormField label="Chức vụ" value={formData.customerPosition || ""} onChange={(v) => updateField('customerPosition', v)} readOnly={isReadOnly} />
            <FormField label="Email" value={formData.customerEmail || ""} type="email" readOnly={isReadOnly} />
            <FormField label="Số điện thoại" value={formData.customerPhone || ""} readOnly={isReadOnly} />
            <FormField label="Địa chỉ hóa đơn" value="071000 - PBA Tower, số 487-489 Điện Biên Phủ, phường 09, quận 03, HCM" readOnly={isReadOnly} />
            <FormField label="Địa chỉ giao hàng" value="071000 - PBA Tower, số 487-489 Điện Biên Phủ, phường 09, quận 03, HCM" readOnly={isReadOnly} />
          </div>
        </div>

        <div className="mb-6">
          <SectionHeader title="3. Bên B" />
          <div className="space-y-4">
            <FormField label="Công ty" value="Viettel MTV" type="select" options={["Viettel MTV", "Công ty A", "Công ty B"]} required readOnly={isReadOnly} />
            <FormField label="Người phụ trách" value={formData.amName} onChange={(v) => updateField('amName', v)} type="select" options={["TrangNTT111", "NguyenVA", "TranTB"]} readOnly={isReadOnly} />
          </div>
        </div>

        <div className="mb-6">
          <SectionHeader title="4. Tài liệu đính kèm" />
          <DocumentAttachment expanded={expanded} />
        </div>

        <div className="mb-6">
          <SectionHeader title="5. Điều khoản" />
          <div className="space-y-4">
            <FormField label="Điều khoản thanh toán" value="" type="textarea" readOnly={isReadOnly} />
            <FormField label="Phương thức thanh toán" value="Chuyển khoản" type="select" options={["Chuyển khoản", "Tiền mặt"]} readOnly={isReadOnly} />
          </div>
        </div>

        <div className="mb-6">
          <SectionHeader title="6. Thời gian" />
          <div className="space-y-4">
            <FormField label="Ngày ký" value={formData.signedDate} onChange={(v) => updateField('signedDate', v)} type="date" readOnly={isReadOnly} required />
            <FormField label="Ngày hiệu lực" value={formData.effectiveDate} onChange={(v) => handleEffectiveDateChange(v)} type="date" readOnly={isReadOnly} required />
            <FormField label="Ngày hết hạn" value={formData.expiryDate} onChange={(v) => updateField('expiryDate', v)} type="date" readOnly={isReadOnly} required />
          </div>
        </div>
      </div>

      {/* B. THÔNG TIN QUẢN LÝ */}
      <div>
        <h2 className="font-semibold text-base text-[#494949] mb-4">B. THÔNG TIN QUẢN LÝ</h2>
        <div className="space-y-4">
          <FormField label="Phân loại" value="CNTT" type="select" options={["CNTT", "Khác"]} readOnly={isReadOnly} />
          <FormField label="Tình trạng triển khai" value={formData.implementationStatus} onChange={(v) => updateField('implementationStatus', v)} type="select" options={["Chưa triển khai", "Đang triển khai", "Hoàn thành"]} readOnly={isReadOnly} />
          <FormField label="Tình trạng doanh thu" value={formData.revenueStatus} onChange={(v) => updateField('revenueStatus', v)} type="select" options={["Chưa lên doanh thu", "Đã ghi nhận"]} readOnly={isReadOnly} />
          <FormField label="Tháng ghi nhận hợp đồng" value={formData.revenueMonth} type="text" readOnly={true} />
          <CostTable />
          <CommissionTable />
        </div>
      </div>

      {/* C. LỢI NHUẬN DỰ KIẾN */}
      <div>
        <h2 className="font-semibold text-base text-[#494949] mb-4">C. LỢI NHUẬN DỰ KIẾN</h2>
        <div className="mb-6">
          <h3 className="font-semibold text-sm text-[#494949] mb-3">1. LỢI NHUẬN GỘP</h3>
          <div className="space-y-4">
            <FormField label="1.1 Lợi nhuận gộp" value="60,000,000" type="number" readOnly={isReadOnly} />
          </div>
        </div>
      </div>
    </div>
  );
}
