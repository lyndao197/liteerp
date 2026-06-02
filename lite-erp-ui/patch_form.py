import re

with open('src/components/ContractForm.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the start of the return statement in the ContractForm function
match = re.search(r'  return \(\n    <div\n      className="contract-form-container', content)
if match:
    start_idx = match.start()
    
    new_return = """  return (
    <div className="size-full flex flex-col bg-[#f9f9f9]" style={{ height: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <div className="bg-[#f9f9f9] px-8 py-4 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/contracts")} className="h-[38px] rounded border border-[#efeded] flex items-center gap-2 px-3 py-2 hover:bg-gray-50">
            <ChevronLeft size={16} className="text-[#81878F]" />
            <span className="font-semibold text-sm text-[#494949]">Trở về</span>
          </button>
          <div className="relative">
            <span className="font-semibold text-lg text-[#0f172a]">
              {isEdit ? formData.contractNo || "Hợp đồng" : "Mới"}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          {(!formData.approvalStatus || formData.approvalStatus === "Nháp") && (
            <>
              <button onClick={() => updateStatus("Nháp")} className="bg-white h-[38px] rounded border border-[#ed0029] flex items-center gap-2 px-3 py-2 hover:bg-red-50">
                <Save size={16} className="text-[#ed0029]" />
                <span className="font-semibold text-sm text-[#ed0029]">Lưu nháp</span>
              </button>
              <button onClick={() => { if (validateForm()) updateStatus("Chờ duyệt bản thảo"); }} className="bg-[#ed0029] h-[38px] rounded border border-[#ed0029] flex items-center gap-2 px-3 py-2 hover:bg-[#d40025]">
                <span className="font-semibold text-sm text-white">Gửi phê duyệt bản thảo</span>
                <Send size={16} className="text-white" />
              </button>
            </>
          )}

          {formData.approvalStatus === "Chờ duyệt bản thảo" && (
            <>
              <button onClick={() => setShowRejectModal(true)} className="bg-white h-[38px] rounded border border-[#64748B] flex items-center gap-2 px-3 py-2 hover:bg-gray-50">
                <XCircle size={16} className="text-[#64748B]" />
                <span className="font-semibold text-sm text-[#64748B]">Từ chối</span>
              </button>
              {!formData.isLegalApprovedDraft && (
                <button onClick={() => handleApproveDraft("Legal")} className="bg-[#3b82f6] h-[38px] rounded flex items-center gap-2 px-3 py-2 hover:bg-blue-600 text-white font-semibold text-sm">
                  PC duyệt bản thảo
                </button>
              )}
              {formData.isLegalApprovedDraft && (
                <div className="flex items-center gap-1 text-green-500 font-semibold text-sm px-2">
                  <CheckCircle2 size={16} /> PC Đã duyệt
                </div>
              )}
              {!formData.isManagerApprovedDraft && (
                <button onClick={() => handleApproveDraft("Manager")} className="bg-[#f59e0b] h-[38px] rounded flex items-center gap-2 px-3 py-2 hover:bg-yellow-600 text-white font-semibold text-sm">
                  TP duyệt bản thảo
                </button>
              )}
              {formData.isManagerApprovedDraft && (
                <div className="flex items-center gap-1 text-green-500 font-semibold text-sm px-2">
                  <CheckCircle2 size={16} /> TP Đã duyệt
                </div>
              )}
            </>
          )}

          {formData.approvalStatus === "Chờ Upload" && (
            <button
              className={`h-[38px] rounded flex items-center gap-2 px-3 py-2 font-semibold text-sm text-white ${uploadedFile ? 'bg-[#e32b4c] hover:bg-[#d40025] cursor-pointer' : 'bg-[#cbd5e1] cursor-not-allowed'}`}
              onClick={() => { if (uploadedFile) updateStatus("Chờ duyệt bản ký"); }}
              disabled={!uploadedFile}
            >
              Gửi duyệt bản ký
            </button>
          )}

          {formData.approvalStatus === "Chờ duyệt bản ký" && (
            <>
              <button onClick={() => setShowRejectModal(true)} className="bg-white h-[38px] rounded border border-[#64748B] flex items-center gap-2 px-3 py-2 hover:bg-gray-50">
                <XCircle size={16} className="text-[#64748B]" />
                <span className="font-semibold text-sm text-[#64748B]">Từ chối</span>
              </button>
              {!formData.isLegalApprovedSigned && (
                <button onClick={() => handleApproveSigned("Legal")} className="bg-[#3b82f6] h-[38px] rounded flex items-center gap-2 px-3 py-2 hover:bg-blue-600 text-white font-semibold text-sm">
                  PC duyệt bản ký
                </button>
              )}
              {formData.isLegalApprovedSigned && (
                <div className="flex items-center gap-1 text-green-500 font-semibold text-sm px-2">
                  <CheckCircle2 size={16} /> PC Đã duyệt
                </div>
              )}
              {!formData.isManagerApprovedSigned && (
                <button onClick={() => handleApproveSigned("Manager")} className="bg-[#f59e0b] h-[38px] rounded flex items-center gap-2 px-3 py-2 hover:bg-yellow-600 text-white font-semibold text-sm">
                  TP duyệt bản ký
                </button>
              )}
              {formData.isManagerApprovedSigned && (
                <div className="flex items-center gap-1 text-green-500 font-semibold text-sm px-2">
                  <CheckCircle2 size={16} /> TP Đã duyệt
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Main Content: OnlyOffice + Contract Info */}
      <div className="flex-1 flex overflow-hidden">
        {/* OnlyOffice - Left side */}
        <div className={`${isExpanded ? 'w-[40%]' : 'w-[70%]'} bg-white border-r border-gray-200 transition-all duration-300`}>
          <div className="size-full flex flex-col">
            <div style={{ flex: 1, width: "100%" }}>
              <DocumentEditor
                id="onlyoffice-editor"
                documentServerUrl="http://localhost:8080/"
                config={{
                  document: {
                    fileType: "docx",
                    key: `contract-${id || "new"}-${Date.now()}`,
                    title: "Hop_dong_mau.docx",
                    url: "http://localhost:5173/mau_hop_dong.docx",
                  },
                  documentType: "word",
                  editorConfig: {
                    mode: "edit",
                    lang: "vi",
                    user: {
                      id: "erp-user",
                      name: "ERP User",
                    },
                    customization: {
                      forcesave: false,
                    }
                  },
                }}
                events_onDocumentReady={onDocumentReady}
              />
            </div>
          </div>
        </div>

        {/* Contract Information Form - Right side */}
        <div className={`${isExpanded ? 'w-[60%]' : 'w-[30%]'} bg-white overflow-y-auto relative transition-all duration-300`}>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="absolute top-4 right-4 z-10 p-2 bg-white border border-gray-200 rounded hover:bg-gray-50 shadow-sm"
            title={isExpanded ? "Thu gọn" : "Mở rộng"}
          >
            <svg className={`w-5 h-5 text-[#494949] transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          <ContractInfoForm 
            expanded={isExpanded} 
            formData={formData} 
            updateField={updateField} 
            customers={customers} 
            handleCustomerChange={handleCustomerChange} 
            handleEffectiveDateChange={handleEffectiveDateChange}
            isReadOnly={isReadOnly}
          />
        </div>
      </div>

      {/* REJECT MODAL */}
      {showRejectModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '10vh', zIndex: 1000 }}>
          <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', width: '500px', maxWidth: '90vw', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a' }}>Từ chối phê duyệt</h3>
              <button
                onClick={() => setShowRejectModal(false)}
                style={{ border: 'none', background: 'transparent', fontSize: '20px', cursor: 'pointer', color: '#64748b' }}
              >×</button>
            </div>

            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', fontWeight: 600, color: '#475569' }}>Lý do từ chối <span style={{ color: 'red' }}>*</span></label>
                <select
                  value={rejectData.reason}
                  onChange={e => setRejectData({ ...rejectData, reason: e.target.value })}
                  style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '14px' }}
                >
                  <option value="">Chọn lý do...</option>
                  <option value="Thông tin khách hàng sai">Thông tin khách hàng sai</option>
                  <option value="Giá trị HĐ không hợp lệ">Giá trị HĐ không hợp lệ</option>
                  <option value="Chưa đủ điều kiện phê duyệt">Chưa đủ điều kiện phê duyệt</option>
                  <option value="Lý do khác">Lý do khác</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', fontWeight: 600, color: '#475569' }}>Mô tả thêm</label>
                <textarea
                  rows="3"
                  value={rejectData.description}
                  onChange={e => setRejectData({ ...rejectData, description: e.target.value })}
                  placeholder="Nhập chi tiết về lỗi hoặc yêu cầu bổ sung..."
                  style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '14px', resize: 'vertical' }}
                />
              </div>
            </div>

            <div style={{ padding: '16px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-start', gap: '8px' }}>
              <button style={{ padding: '8px 16px', borderRadius: '4px', border: '1px solid #cbd5e1', background: 'white', color: '#475569', cursor: 'pointer', fontWeight: 500, fontSize: '13px' }} onClick={() => setShowRejectModal(false)}>Hủy bỏ</button>
              <button style={{ padding: '8px 16px', borderRadius: '4px', border: 'none', background: '#ef4444', color: 'white', cursor: 'pointer', fontWeight: 500, fontSize: '13px' }} onClick={confirmReject}>Xác nhận từ chối</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ContractForm;
"""
    
    new_content = content[:start_idx] + new_return
    with open('src/components/ContractForm.jsx', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("ContractForm.jsx updated successfully!")
else:
    print("Could not find return block")
