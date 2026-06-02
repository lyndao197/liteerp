import React, { useState, useEffect } from "react";
import { DocumentEditor } from "@onlyoffice/document-editor-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FileText,
  User,
  Calendar,
  DollarSign,
  Activity,
  ChevronLeft,
  Save,
  Briefcase,
  CheckCircle2,
  XCircle,
  Send,
  History,
  Lock,
  Smile,
  Paperclip,
  Maximize2,
} from "lucide-react";
import { mockStore } from "../utils/mockStore";

import ContractInfoForm, { Header } from "./ContractInfoForm";

const INITIAL_FORM_STATE = {
  contractNo: "",
  name: "",
  customerId: "",
  customerName: "",
  shortName: "",
  amName: "",
  promotionUnit: "",
  projectType: "Mới_xúc tiến",
  serviceType: "Dịch vụ CC outsourcing",
  classification: "Ngoài",
  contractStatus: "Đang hiệu lực",
  implementationStatus: "Chưa triển khai",
  revenueStatus: "Chưa lên doanh thu",
  revenueMonth: "",
  contractValue: "",
  unitPrice: "",
  totalContracts: "1",
  effectiveDate: "",
  expiryDate: "",
  signedDate: new Date().toISOString().split("T")[0],
  serviceContent: "",
  notes: "",
  approvalStatus: "Nháp",
  isLegalApprovedDraft: false,
  isManagerApprovedDraft: false,
  isLegalApprovedSigned: false,
  isManagerApprovedSigned: false,
};

function ContractForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [customers, setCustomers] = useState([]);
  const [isEdit, setIsEdit] = useState(false);

  // Validation & Modal State
  const [formErrors, setFormErrors] = useState({});
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectData, setRejectData] = useState({ reason: "", description: "" });

  const [chatterMessages, setChatterMessages] = useState([]);
  const [chatterInput, setChatterInput] = useState("");
  const [activeNotebookTab, setActiveNotebookTab] = useState("notes");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    const allCustomers = mockStore.getAllCustomers();
    setCustomers(allCustomers);

    if (id) {
      const existing = mockStore.getContract(id);
      if (existing) {
        setFormData(existing);
        setChatterMessages(existing.chatterMessages || []);
        setIsEdit(true);
      }
    } else {
      // Auto-generate Contract No for NEW only
      const nextNo = mockStore.getNextContractNo();
      setFormData((prev) => ({ ...prev, contractNo: nextNo }));
    }
  }, [id]);

  const handleCustomerChange = (customerId) => {
    if (!customerId) {
      setFormData((prev) => ({
        ...prev,
        customerId: "",
        customerName: "",
        shortName: "",
        classification: "Ngoài",
      }));
      return;
    }
    const customer = customers.find((c) => c.id === customerId);
    if (customer) {
      setFormData((prev) => ({
        ...prev,
        customerId: customer.id,
        customerName: customer.name,
        shortName: customer.shortName || "",
        classification: customer.type === "Doanh nghiệp" ? "Ngoài" : "Nội bộ",
      }));
    }
  };

  const handleEffectiveDateChange = (date) => {
    if (!date) {
      setFormData((prev) => ({ ...prev, effectiveDate: "", revenueMonth: "" }));
      return;
    }
    const d = new Date(date);
    if (
      isNaN(d.getTime()) ||
      d.getFullYear() < 1900 ||
      d.getFullYear() > 2100
    ) {
      setFormData((prev) => ({
        ...prev,
        effectiveDate: date,
        revenueMonth: "Ngày không lệ",
      }));
      return;
    }
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    setFormData((prev) => ({
      ...prev,
      effectiveDate: date,
      revenueMonth: `Tháng ${month}/${year}`,
    }));
  };

  const validateForm = () => {
    const requiredFields = [
      { key: "customerId", label: "Khách hàng" },
      { key: "amName", label: "AM phụ trách" },
      { key: "contractNo", label: "Số Hợp đồng" },
      { key: "name", label: "Tên Hợp đồng" },
      { key: "effectiveDate", label: "Ngày hiệu lực" },
      { key: "contractValue", label: "Giá trị HĐ (chưa VAT)" },
    ];
    let errors = {};
    let firstErrorKey = null;

    requiredFields.forEach((field) => {
      if (!formData[field.key]) {
        errors[field.key] = `Vui lòng nhập ${field.label}`;
        if (!firstErrorKey) firstErrorKey = field.key;
      }
    });

    setFormErrors(errors);

    if (firstErrorKey) {
      const el = document.getElementById(firstErrorKey);
      if (el) {
        el.focus();
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return false;
    }
    return true;
  };

  const handleSendApproval = () => {
    if (validateForm()) {
      updateStatus("Chờ duyệt");
    }
  };

  const confirmReject = () => {
    if (!rejectData.reason) {
      alert("Vui lòng chọn lý do từ chối");
      return;
    }

    const contractId = isEdit ? id : mockStore.getNextContractId();
    const updatedData = {
      ...formData,
      id: contractId,
      approvalStatus: "Nháp",
      isLegalApprovedDraft: false,
      isManagerApprovedDraft: false,
      isLegalApprovedSigned: false,
      isManagerApprovedSigned: false,
      rejectReason: rejectData.reason,
      rejectDescription: rejectData.description,
      chatterMessages,
    };
    mockStore.saveContract(contractId, updatedData);
    setFormData(updatedData);
    setShowRejectModal(false);
    alert(`Đã từ chối! Hợp đồng được trả về trạng thái Nháp.`);
  };

  const updateStatus = (newStatus) => {
    const contractId = isEdit ? id : mockStore.getNextContractId();
    const updatedData = {
      ...formData,
      id: contractId,
      approvalStatus: newStatus,
      chatterMessages,
    };

    mockStore.saveContract(contractId, updatedData);
    setFormData(updatedData);

    if (newStatus === "Hiệu lực") {
      mockStore.createProjectFromContract(contractId, updatedData);
      alert(`Đã cập nhật trạng thái: ${newStatus}`);
      navigate("/contracts");
    } else if (!isEdit) {
      setIsEdit(true);
      navigate(`/contract/edit/${contractId}`, { replace: true });
    }
  };

  const handleApproveDraft = (type) => {
    let updatedFlags = {};
    if (type === "Legal") updatedFlags.isLegalApprovedDraft = true;
    if (type === "Manager") updatedFlags.isManagerApprovedDraft = true;

    const isLegal =
      updatedFlags.isLegalApprovedDraft || formData.isLegalApprovedDraft;
    const isManager =
      updatedFlags.isManagerApprovedDraft || formData.isManagerApprovedDraft;

    const contractId = isEdit ? id : mockStore.getNextContractId();
    let updatedData = {
      ...formData,
      ...updatedFlags,
      id: contractId,
      chatterMessages,
    };

    if (isLegal && isManager) {
      updatedData.approvalStatus = "Chờ Upload";
    }

    mockStore.saveContract(contractId, updatedData);
    setFormData(updatedData);

    if (isLegal && isManager) {
      alert(
        "Bản thảo đã được duyệt bởi cả Pháp chế và Trưởng phòng. Bạn có thể Upload file trình ký.",
      );
    }
  };

  const handleApproveSigned = (type) => {
    let updatedFlags = {};
    if (type === "Legal") updatedFlags.isLegalApprovedSigned = true;
    if (type === "Manager") updatedFlags.isManagerApprovedSigned = true;

    const isLegal =
      updatedFlags.isLegalApprovedSigned || formData.isLegalApprovedSigned;
    const isManager =
      updatedFlags.isManagerApprovedSigned || formData.isManagerApprovedSigned;

    const contractId = isEdit ? id : mockStore.getNextContractId();
    let updatedData = {
      ...formData,
      ...updatedFlags,
      id: contractId,
      chatterMessages,
    };

    if (isLegal && isManager) {
      updatedData.approvalStatus = "Hiệu lực";
    }

    mockStore.saveContract(contractId, updatedData);
    setFormData(updatedData);

    if (isLegal && isManager) {
      alert(
        "Bản ký đã được duyệt bởi cả Pháp chế và Trưởng phòng. Hợp đồng có hiệu lực!",
      );
      navigate("/contracts");
    }
  };

  const postNote = () => {
    if (!chatterInput.trim()) return;
    const newMsg = {
      id: Date.now(),
      type: "note",
      author: "Phạm Quang Mạnh",
      text: chatterInput,
      time: "vừa xong",
      avatar:
        "https://api.dicebear.com/7.x/personas/svg?seed=Felix&backgroundColor=b6e3f4",
    };
    const newMessages = [newMsg, ...chatterMessages];
    setChatterMessages(newMessages);
    setChatterInput("");

    if (isEdit) {
      const existing = mockStore.getContract(id);
      if (existing) {
        existing.chatterMessages = newMessages;
        mockStore.saveContract(id, existing);
      }
    }
  };

  const isReadOnly =
    formData.approvalStatus !== "Nháp" && !!formData.approvalStatus;

  
  // ONLYOFFICE Form Mapping logic
  const onDocumentReady = (event) => {
    console.log("Document is loaded via API.");
    try {
      const editorInstance = window.DocEditor.instances["onlyoffice-editor"];
      if (editorInstance) {
        const connector = editorInstance.createConnector();
        connector.executeMethod("GetForms", [], function (forms) {
          console.log("Found forms in document:", forms);
          // Set form data using React state formData
          const mappedData = [
            { key: "Tên khách hàng", value: formData.customerName || "" },
            { key: "Giá trị hợp đồng", value: formData.contractValue || "" },
            { key: "Đại diện", value: formData.customerRep || "" },
            { key: "Chức vụ", value: formData.customerPosition || "" }
          ];
          connector.executeMethod("SetFormsData", [mappedData]);
        });
      }
    } catch (e) {
      console.error("Lỗi kết nối Document Editor:", e);
    }
  };

  return (
    <div className="size-full flex flex-col bg-[#f9f9f9]" style={{ height: '100%', overflow: 'hidden' }}>
      <Header
        formData={formData}
        updateStatus={updateStatus}
        validateForm={validateForm}
        isEdit={isEdit}
        navigate={navigate}
        setShowRejectModal={setShowRejectModal}
        handleApproveDraft={handleApproveDraft}
        handleApproveSigned={handleApproveSigned}
        uploadedFile={uploadedFile}
      />

      {/* Main Content: OnlyOffice + Contract Info */}
      <div className="flex-1 flex overflow-hidden">
        {/* OnlyOffice - Left side */}
        <div className={`${isExpanded ? 'w-[45%]' : 'w-[65%]'} bg-white border-r border-gray-200 transition-all duration-300`}>
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
        <div className={`${isExpanded ? 'w-[55%]' : 'w-[35%]'} bg-white overflow-y-auto relative transition-all duration-300`}>
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
