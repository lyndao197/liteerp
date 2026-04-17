/* eslint-disable react-hooks/purity */
/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Trash2, X, MessageSquare, ArrowDownToLine, FileEdit, FileText, Sliders, ChevronUp, ChevronDown, Smile, Paperclip, Maximize2, Activity } from 'lucide-react';
import './LeadForm.css';
import { mockStore } from '../utils/mockStore';

// --- MOCK DATA ---

const EMPLOYEES = ['Trần B (Bạn)', 'Nguyễn Văn A', 'Lê Thị C'];

const PROVINCES = [{ id: 'HN', name: 'Hà Nội' }, { id: 'HCM', name: 'TP. Hồ Chí Minh' }];
const DISTRICTS = {
  'HN': [{ id: 'CG', name: 'Quận Cầu Giấy' }, { id: 'NTL', name: 'Quận Nam Từ Liêm' }],
  'HCM': [{ id: 'Q1', name: 'Quận 1' }, { id: 'TB', name: 'Quận Tân Bình' }]
};
const WARDS = {
  'CG': [{ id: 'DH', name: 'Phường Dịch Vọng Hậu' }, { id: 'MD', name: 'Phường Mai Dịch' }],
  'NTL': [{ id: 'MD1', name: 'Phường Mỹ Đình 1' }],
  'Q1': [{ id: 'BN', name: 'Phường Bến Nghé' }],
  'TB': [{ id: 'P2', name: 'Phường 2' }]
};

const SERVICE_OPTIONS_BY_PROJECT = {
  solution: ['KnowxHUB', 'OmniX', 'WorkForceX', 'AgentMate', 'CXBot'],
  service: ['Chăm sóc khách hàng', 'Tổng đài viên', 'Cho thuê nhân sự']
};

const createEmptyServiceLine = () => ({
  id: Date.now() + Math.random(),
  projectCategory: '',
  service: '',
  description: ''
});

const INITIAL_POSITIONS = [{ id: 'TĐ', name: 'Trưởng Đài' }, { id: 'GD', name: 'Giám Đốc' }];
const INITIAL_PARTNERS = [
  { id: 'PN1', name: 'Azure Interior', phone: '+58 212 6...', email: 'vauxoo@yourcompany', city: 'Fremont', country: 'United States', level: 'Silver' },
  { id: 'PN2', name: 'Gemini Furniture', phone: '+1 312 34...', email: 'john.b@tech.info', city: 'Fairfield', country: 'United States', level: 'Silver' },
  { id: 'PN3', name: 'Lumber Inc', phone: '(828)-316...', email: 'lumber@example.com', city: 'Stockton', country: 'United States', level: 'Gold' },
  { id: 'PN4', name: 'Ready Mat', phone: '(803)-873...', email: 'info@deltapc.com', city: 'Tracy', country: 'United States', level: 'Bronze' },
  { id: 'PN5', name: 'The Jackson Group', phone: '(334)-502...', email: 'jackson@group.com', city: 'Tracy', country: 'United States', level: 'Gold' },
  { id: 'PN6', name: 'Wood Corner', phone: '(623)-853...', email: 'bhu@ic.example.com', city: 'Turlock', country: 'United States', level: 'Gold' },
];

const INITIAL_CONTACTS_DB = [
  { id: 'CT1', name: 'Nguyễn Văn Định', phone: '0901234567', email: 'dinh.nv@vcb.com.vn', positionId: 'TĐ', active: true },
  { id: 'CT2', name: 'Lê Minh Trí', phone: '0987654321', email: 'tri.lm@vingroup.net', positionId: 'GD', active: true },
  { id: 'CT3', name: 'Phạm Hồng Thái', phone: '0912345678', email: 'thai.ph@fsoft.com.vn', positionId: 'GD', active: false }
];

const INITIAL_FORM_STATE = {
  leadName: '', probability: 10,
  projectType: '',
  projectedService: '',
  contactDate: new Date().toISOString().split('T')[0],
  issueMonth: '',
  addressDetail: '', province: '', district: '', ward: '',
  logicLeadLost: false,
};

// --- MAIN COMPONENT ---
const OpportunityForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // TABS
  const [activeChatterTab, setActiveChatterTab] = useState('log_note');

  // FORM DATA (Flatten basic fields for easy tracking)
  const [formData, setFormData] = useState({ ...INITIAL_FORM_STATE });
  const [snapshotData, setSnapshotData] = useState({ ...INITIAL_FORM_STATE });

  // COMPLEX DATA LISTS
  const [serviceDetails, setServiceDetails] = useState([createEmptyServiceLine()]);
  const [snapshotServices, setSnapshotServices] = useState([createEmptyServiceLine()]);

  const [contacts, setContacts] = useState([]);
  const [snapshotContacts, setSnapshotContacts] = useState([]);

  // RELATIONAL DATA (Positions & Partners)
  const [positionsData, setPositionsData] = useState([...INITIAL_POSITIONS]);
  const [partnersData, setPartnersData] = useState([...INITIAL_PARTNERS]);
  const [contactsDbData, setContactsDbData] = useState([...INITIAL_CONTACTS_DB]);

  // UI STATE
  const [clientAbbr, setClientAbbr] = useState('');
  const [clientSearch, setClientSearch] = useState('');
  const [showClientSuggest, setShowClientSuggest] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [mstValue, setMstValue] = useState('');
  const [classificationValue, setClassificationValue] = useState('');
  const [domainValue, setDomainValue] = useState('');
  const [sourceValue, setSourceValue] = useState('');
  const [referredBy, setReferredBy] = useState('');
  const [campaignValue, setCampaignValue] = useState('');
  const [activityTypes, setActivityTypes] = useState(['Email', 'Gọi điện', 'Hội họp', 'Việc cần làm']);
  const [newActTypeName, setNewActTypeName] = useState('');

  // CHATTER LOGS & ACTIVITIES
  const [chatterMessages, setChatterMessages] = useState([]);
  const [activities, setActivities] = useState([]);
  const [chatterInput, setChatterInput] = useState('');
  const [showMention, setShowMention] = useState(false);
  const [mentionPos, setMentionPos] = useState({ top: 0, left: 0 });
  const textareaRef = useRef(null);

  // MODALS & TOAST STATE
  const [modalState, setModalState] = useState({ open: false, type: '', contactId: null, searchInput: '' });
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 2000);
  };

  // VALIDATION & PIPELINE STATE
  const nameRef = useRef(null);
  const serviceRef = useRef(null);
  const mstRef = useRef(null);
  const clientRef = useRef(null);
  const domainRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [lostReason, setLostReason] = useState('');
  const [lostDesc, setLostDesc] = useState('');

  const [leadStatus, setLeadStatus] = useState('Mới');
  const isAdvancedStage = leadStatus !== 'Đang tiếp xúc' && leadStatus !== 'Mới';
  const isDisabled = leadStatus !== 'Mới';
  const [pakdCount, setPakdCount] = useState(0);
  const [quoteCount, setQuoteCount] = useState(0);
  const [attachmentFiles, setAttachmentFiles] = useState([]);

  const [customerMatchData, setCustomerMatchData] = useState(null);
  const [similarOpps, setSimilarOpps] = useState([]);
  const [viewingSimilarOpps, setViewingSimilarOpps] = useState(false);
  const [similarSearchInput, setSimilarSearchInput] = useState('');
  const [similarSortConfig, setSimilarSortConfig] = useState({ key: null, direction: null });
  const [similarPageSize, setSimilarPageSize] = useState(10);
  const [similarCurrentPage, setSimilarCurrentPage] = useState(1);
  const [similarSelectedRows, setSimilarSelectedRows] = useState([]);

  const processedSimilarOpps = useMemo(() => {
    let result = [...similarOpps];
    if (similarSearchInput) {
      const lowerSearch = similarSearchInput.toLowerCase();
      result = result.filter(item => Object.values(item).some(val => String(val).toLowerCase().includes(lowerSearch)));
    }
    if (similarSortConfig.key) {
      result.sort((a, b) => {
        const valA = a[similarSortConfig.key] || '';
        const valB = b[similarSortConfig.key] || '';
        if (valA < valB) return similarSortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return similarSortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [similarOpps, similarSearchInput, similarSortConfig]);

  const similarTotalItems = processedSimilarOpps.length;
  const similarTotalPages = Math.ceil(similarTotalItems / similarPageSize);
  const similarSafeCurrentPage = Math.min(Math.max(1, similarCurrentPage), similarTotalPages || 1);
  const paginatedSimilarOpps = processedSimilarOpps.slice((similarSafeCurrentPage - 1) * similarPageSize, similarSafeCurrentPage * similarPageSize);

  const handleSimilarSort = (key) => {
    let direction = 'asc';
    if (similarSortConfig.key === key && similarSortConfig.direction === 'asc') direction = 'desc';
    else if (similarSortConfig.key === key && similarSortConfig.direction === 'desc') {
      direction = null; key = null;
    }
    setSimilarSortConfig({ key, direction });
  };

  const exportToExcel = () => {
    // Generate simple CSV
    const headers = ['Opportunity ID', 'Tên Opportunity', 'Tên khách hàng', 'MST', 'Contact Name', 'Email'];
    const rows = processedSimilarOpps.map(opp => {
      return [opp.id, `"${opp.content}"`, `"${opp.company}"`, opp.mst, opp.contactName || '', opp.email || ''];
    });

    let csvContent = "data:text/csv;charset=utf-8,\uFEFF" + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Danh_sach_Opp_Tuong_dong_${mstValue}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getAllowedTransitions = (currentStatus) => {
    switch (currentStatus) {
      case 'Mới': return ['Đang tiếp xúc', 'Không thành công'];
      case 'Đang tiếp xúc': return ['Đánh giá nhu cầu', 'Không thành công'];
      case 'Đánh giá nhu cầu': return ['Đang báo giá', 'Không thành công'];
      case 'Đang báo giá': return ['Đấu thầu', 'POC', 'Không thành công'];
      case 'Đấu thầu': return ['Kí hợp đồng', 'Không thành công'];
      case 'POC': return ['Kí hợp đồng', 'Không thành công'];
      case 'Kí hợp đồng': return ['Không thành công'];
      default: return [];
    }
  };

  // LOAD EXISTING LEAD
  useEffect(() => {
    if (id) {
      const task = mockStore.getOpp(id);
      if (task) {
        const mappedService = task.projectedService === 'Kiểm soát / Nhập liệu' ? 'service'
          : task.projectedService === 'Chăm sóc khách hàng' ? 'service'
            : task.projectedService === 'Telesales' ? 'service'
              : 'solution';
        setFormData(prev => ({
          ...prev,
          leadName: task.content || '',
          probability: parseInt(task.probability) || 0,
        }));
        setServiceDetails([{
          id: Date.now() + Math.random(),
          projectCategory: mappedService,
          service: task.projectedService || '',
          description: ''
        }]);
        setSnapshotServices([{
          id: Date.now() + Math.random(),
          projectCategory: mappedService,
          service: task.projectedService || '',
          description: ''
        }]);
        setSelectedClient({ id: 'dummy', name: task.company, type: task.tags?.find(t => t.text === 'Doanh nghiệp') ? 'Doanh nghiệp' : 'Nội bộ', mst: task.mst, phone: '', addr: '', domain: '' });
        setClientSearch(task.company || '');
        setClientAbbr(task.id ? task.id.split('-')[0] : '');
        setMstValue(task.mst || '');
        setLeadStatus(task.status || 'Đang tiếp xúc');
        const count = parseInt(task.attachments) || 0;
        setAttachmentFiles(Array(count).fill().map((_, i) => ({
          id: i,
          name: `Tài liệu ${i + 1}.pdf`,
          type: 'Khác'
        })));

        // Similar opps update
        const store = mockStore.getStore();
        if (task.mst) {
          const allOpps = Object.values(store.oppTasks);
          const matches = allOpps.filter(o => o.mst === task.mst && o.id !== id);
          setSimilarOpps(matches);
        }
      }
    }
  }, [id, mstValue]);

  // -------------------------
  // HANDLE BASIC FORM DATA
  // -------------------------
  const hf = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
    // Address cascade reset
    if (field === 'province') {
      setFormData(prev => ({ ...prev, district: '', ward: '' }));
    }
    if (field === 'district') {
      setFormData(prev => ({ ...prev, ward: '' }));
    }
  };

  // -------------------------
  // SAVE, TRACKING & REVERT
  // -------------------------
  const commitSave = () => {
    let newErrors = {};
    const trLeadName = (formData.leadName || '').trim();
    const trClientAbbr = (clientAbbr || '').trim();
    const trClientSearch = (clientSearch || '').trim();
    const trDomain = (domainValue || '').trim();

    if (!trLeadName) newErrors.leadName = 'Vui lòng nhập tên Opportunity';
    if (!trClientAbbr) newErrors.clientAbbr = 'Vui lòng nhập tên viết tắt';
    if (!trClientSearch) newErrors.clientSearch = 'Vui lòng nhập tên đầy đủ khách hàng';
    if (!trDomain) newErrors.domain = 'Vui lòng nhập lĩnh vực';

    if (isAdvancedStage) {
      const hasValidServiceLine = serviceDetails.some(line => line.projectCategory && line.service);
      if (!hasValidServiceLine) newErrors.serviceDetails = 'Vui lòng nhập ít nhất 1 dịch vụ hợp lệ';
      if (!mstValue.trim()) newErrors.mst = 'Vui lòng nhập Mã số thuế';
      if (!classificationValue) newErrors.classification = 'Vui lòng chọn phân loại';
    }

    if (contacts.length > 0) {
      contacts.forEach(c => {
        if (c.phone) {
          const rawPhone = c.phone.replace(/[^0-9]/g, '');
          if (rawPhone.length > 15) newErrors.contactPhone = 'Số điện thoại không quá 15 ký tự.';
        }
        if (c.email) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(c.email) || c.email.length > 318) newErrors.contactEmail = 'Email chưa đúng định dạng hoặc quá dài.';
        }
      });
    }

    if (Object.keys(newErrors).length > 0) {
      if (newErrors.leadName) nameRef.current?.focus();
      else if (newErrors.clientSearch) clientRef.current?.focus();
      else if (newErrors.domainValue) domainRef.current?.focus();
      return;
    }

    const changes = [];

    // Compare Form Data
    Object.keys(formData).forEach(key => {
      if (formData[key] !== snapshotData[key]) {
        changes.push(`Đã đổi [${key}]: từ '${snapshotData[key]}' thành '${formData[key]}'`);
      }
    });

    if (!id) {
      addChatterMessage('log', 'Hệ', 'Tạo mới thành công lead/opportunity', 'vừa xong', '#dcfce7');
    } else if (changes.length > 0) {
      const logText = `Cập nhật thông tin thành công:\n` + changes.map(c => `- ${c}`).join('\n');
      addChatterMessage('log', 'Hệ', logText, 'vừa xong', '#fef3c7');
    }

    // New Snapshot
    setSnapshotData({ ...formData });
    setSnapshotContacts([...contacts]);
    setSnapshotServices([...serviceDetails]);

    // Save to global Mock Store
    const isNew = !id || id === 'new';
    const finalStatus = isNew ? 'Mới' : leadStatus;
    const newId = (id && id !== 'new') ? id : mockStore.getNextOppId(clientAbbr || 'OPP');

    const mappedService = serviceDetails.find((line) => line.service)?.service || '';

    const leadData = {
      id: newId,
      content: formData.leadName,
      company: clientSearch,
      mst: mstValue,
      projectedService: mappedService,
      probability: `${formData.probability}%`,
      status: finalStatus,
      tags: selectedClient?.type === 'Doanh nghiệp' ? [{ text: 'Doanh nghiệp', color: '#dcfce7', textCol: '#166534' }] : [{ text: 'Nội bộ', color: '#e0e7ff', textCol: '#3730a3' }],
      revenue: '0 ₫',
      salesperson: 'Trần B',
      date: new Date().toLocaleDateString('vi-VN'),
      attachments: attachmentFiles.length,
      comments: 0,
      avatars: [],
      activity: null,
      chatterMessages: chatterMessages
    };

    mockStore.saveOpp(newId, leadData);

    showToast(`Đã lưu dữ liệu Opportunity ${isNew ? 'mới ' : ''}thành công!`, 'success');
    if (isNew) {
      navigate(`/opportunity/edit/${newId}`, { replace: true });
    }
  };

  const revertChanges = () => {
    setFormData({ ...snapshotData });
    setContacts([...snapshotContacts]);
    setServiceDetails([...snapshotServices]);
    showToast('Đã phục hồi dữ liệu ban đầu!', 'success');
  };

  // -------------------------
  // LOST / RESTORE LOGIC
  // -------------------------
  const handleLostConfirm = () => {
    setLeadStatus('Không thành công');
    if (id) mockStore.updateOppStatus(id, 'Không thành công');
    addChatterMessage('log', 'Hệ', `Đánh dấu nhãn: KHÔNG THÀNH CÔNG\nLý do: ${lostReason}\nMô tả: ${lostDesc}`, 'just now', '#fee2e2');
    closeSearchModal();
  };

  const handleRestore = () => {
    setLeadStatus('Đang tiếp xúc');
    if (id) mockStore.updateOppStatus(id, 'Đang tiếp xúc');
    addChatterMessage('log', 'Hệ', 'Đã khôi phục Opportunity về Đang tiếp xúc', 'just now', '#dcfce7');
  };

  const handleStatusChange = (newStatus) => {
    if (leadStatus === 'Đang tiếp xúc' && newStatus === 'Đánh giá nhu cầu') {
      const hasValidServiceLine = serviceDetails.some(line => line.projectCategory && line.service);
      if (!mstValue.trim() || !hasValidServiceLine) {
        showToast('Vui lòng điền Dịch vụ (Loại dự án + Dịch vụ) và MST khi chuyển sang Đánh giá nhu cầu!', 'error');
        return;
      }
    }

    if (leadStatus === 'Đánh giá nhu cầu' && newStatus === 'Đang báo giá' && attachmentFiles.length === 0) {
      showToast('Yêu cầu upload tối thiểu 1 tài liệu ở phần Thông tin chung trước khi chuyển sang Đang báo giá.', 'error');
      return;
    }

    if (newStatus === 'Thành công') {
      const matchingCustomers = mockStore.getAllCustomers().filter(c => c.mst === mstValue);
      if (matchingCustomers.length > 0) {
        setCustomerMatchData(matchingCustomers[0]);
        openSearchModal('customer_compare');
        return;
      } else {
        mockStore.addCustomer({
          name: clientSearch, shortName: clientAbbr, mst: mstValue, type: selectedClient?.type || 'Doanh nghiệp',
          contactName: contacts.length > 0 ? contacts[0].name : '', email: contacts.length > 0 ? contacts[0].email : '',
          phone: contacts.length > 0 ? contacts[0].phone : '', address: `${formData.ward || ''}, ${formData.district || ''}, ${formData.province || ''}`,
          domain: domainValue, projectType: formData.projectType, source: 'Opportunity', status: 'Active'
        });
        showToast('Đã tự động tạo mới Khách hàng do không phát hiện trùng MST.', 'success');
      }
    }
    setLeadStatus(newStatus);
    if (id) {
      mockStore.updateOppStatus(id, newStatus);
      // Also update the store item for attachments in case they just added it without saving
      const store = mockStore.getStore();
      if (store.oppTasks[id]) {
        store.oppTasks[id].attachments = attachmentFiles.length;
        mockStore.saveStore(store);
      }
    }
    addChatterMessage('log', 'Hệ', `Chuyển trạng thái sang: ${newStatus}`, 'just now', '#e0e7ff');
  };

  // -------------------------
  // LIST HANDLERS
  // -------------------------
  const toggleContactStatus = (id) => {
    setContacts(contacts.map(c => c.id === id ? { ...c, active: !c.active } : c));
  };
  const addContactLine = () => setContacts([...contacts, { id: Date.now(), name: '', phone: '', email: '', positionId: '', active: true }]);
  const removeContact = (id) => setContacts(contacts.filter(c => c.id !== id));
  const updateContact = (id, field, val) => setContacts(contacts.map(c => c.id === id ? { ...c, [field]: val } : c));

  const addServiceLine = () => {
    setServiceDetails([...serviceDetails, createEmptyServiceLine()]);
    setErrors((prev) => ({ ...prev, serviceDetails: false }));
  };
  const removeService = (id) => setServiceDetails(serviceDetails.filter(s => s.id !== id));
  const updateService = (id, field, val) => {
    if (field === 'projectCategory' || field === 'service') {
      setErrors((prev) => ({ ...prev, serviceDetails: false }));
    }
    setServiceDetails(
      serviceDetails.map(s => {
        if (s.id !== id) return s;
        if (field === 'projectCategory') {
          return { ...s, projectCategory: val, service: '' };
        }
        return { ...s, [field]: val };
      })
    );
  };

  // -------------------------
  // CUSTOM AUTOCOMPLETE / ODOO SELECT POPUP
  // -------------------------
  const openSearchModal = (type, contactId = null) => {
    setModalState({ open: true, type, contactId, searchInput: '' });
  };
  const closeSearchModal = () => setModalState({ open: false, type: '', contactId: null, searchInput: '' });

  const parseCurrencyStr = (str) => {
    if (!str) return 0;
    return parseInt(String(str).replace(/[^0-9]/g, ''), 10) || 0;
  };

  const handlePriceBlur = (id, val) => {
    const num = parseCurrencyStr(val);
    updateService(id, 'price', num ? num.toLocaleString('en-US') : '');
  };

  const handlePriceFocus = (e) => {
    const val = e.target.value;
    e.target.value = parseCurrencyStr(val) || '';
  };

  const calcTotalAmount = () => {
    let sum = 0;
    for (let s of serviceDetails) {
      sum += (parseInt(s.qty) || 0) * parseCurrencyStr(s.price);
    }
    return sum === 0 ? '0 ₫' : sum.toLocaleString('vi-VN') + ' ₫';
  };

  const confirmModalCreate = () => {
    const { type, contactId, searchInput } = modalState;
    if (!searchInput.trim()) return;

    if (type === 'position') {
      const newPos = { id: `P_${Date.now()}`, name: searchInput };
      setPositionsData([...positionsData, newPos]);
      if (contactId) updateContact(contactId, 'positionId', newPos.id);
      closeSearchModal();
    } else if (type === 'partner') {
      const newPartner = { id: `PN_${Date.now()}`, name: searchInput };
      setPartnersData([...partnersData, newPartner]);
      hf('partnerId', newPartner.id); // Assuming partnerId is in form
      closeSearchModal();
    } else if (type === 'contact_search') {
      const newCt = { id: `CT_${Date.now()}`, name: searchInput, phone: '', email: '', positionId: '', active: true };
      setContactsDbData([...contactsDbData, newCt]);
      if (contactId) {
        updateContact(contactId, 'contactDbId', newCt.id);
        updateContact(contactId, 'name', newCt.name);
        updateContact(contactId, 'phone', newCt.phone);
        updateContact(contactId, 'email', newCt.email);
        updateContact(contactId, 'positionId', newCt.positionId);
        updateContact(contactId, 'active', newCt.active);
      }
      closeSearchModal();
    }
  };

  const handleSelectModalItem = (id) => {
    const { type, contactId } = modalState;
    if (type === 'position' && contactId) updateContact(contactId, 'positionId', id);
    if (type === 'partner') hf('partnerId', id);
    if (type === 'contact_search' && contactId) {
      const cDb = contactsDbData.find(c => c.id === id);
      if (cDb) {
        updateContact(contactId, 'contactDbId', cDb.id);
        updateContact(contactId, 'name', cDb.name);
        updateContact(contactId, 'phone', cDb.phone || '');
        updateContact(contactId, 'email', cDb.email || '');
        updateContact(contactId, 'positionId', cDb.positionId || '');
        updateContact(contactId, 'active', cDb.active !== undefined ? cDb.active : true);
      }
    }
    closeSearchModal();
  };

  // -------------------------
  // CLIENT SELECT PIPELINE
  // -------------------------
  const selectClient = (cli) => {
    setSelectedClient(cli);
    setClientAbbr(cli.shortName || cli.id);
    setClientSearch(cli.name);
    setMstValue(cli.mst || '');
    setClassificationValue(cli.classification || '');
    setDomainValue(cli.industry || cli.domain || '');
    hf('addressDetail', cli.address || cli.addr || '');
    if (contacts.length === 0 && cli.phone) {
      setContacts([{ id: Date.now(), name: cli.contactName || cli.name, phone: cli.phone, email: cli.email || '', positionId: '', active: true }]);
    }
    setShowClientSuggest(false);
  };
  const filteredClients = mockStore.getAllCustomers().filter(c =>
    c.name.toLowerCase().includes(clientSearch.toLowerCase()) || (c.mst && c.mst.includes(clientSearch))
  );

  // -------------------------
  // CHATTER (Mention + Activities)
  // -------------------------
  const handleChatterChange = (e) => {
    const val = e.target.value;
    setChatterInput(val);
    const words = val.slice(0, e.target.selectionStart).split(' ');
    const lastWord = words[words.length - 1];
    if (lastWord.startsWith('@')) {
      setShowMention(true);
      setMentionPos({ top: 40, left: 20 + (lastWord.length * 5) });
    } else { setShowMention(false); }
  };

  const insertMention = (emp) => {
    const textBefore = chatterInput.slice(0, textareaRef.current.selectionStart);
    const textAfter = chatterInput.slice(textareaRef.current.selectionStart);
    const words = textBefore.split(' ');
    words.pop();
    const newTextBefore = words.length > 0 ? words.join(' ') + ` @${emp} ` : `@${emp} `;
    setChatterInput(newTextBefore + textAfter);
    setShowMention(false);
    textareaRef.current.focus();
  };

  const addChatterMessage = (type, author, text, time, bg) => {
    setChatterMessages(prev => [{ id: Date.now(), type, author, text, time, bg }, ...prev]);
  };

  const postNote = () => {
    if (!chatterInput) return;
    addChatterMessage('log', 'Bạn', chatterInput, 'vừa xong', '#fef3c7');
    setChatterInput('');
  };

  const createActivity = () => {
    openSearchModal('activity');
  };

  const markActivityDone = (id) => {
    const act = activities.find(a => a.id === id);
    setActivities(activities.filter(a => a.id !== id));
    addChatterMessage('log', 'Bạn', `Hoạt động hoàn tất (Done): ${act?.title}`, 'vừa xong', '#dcfce7');
  };

  const handleAttachmentUpload = (e) => {
    const files = Array.from(e.target.files || []);
    let hasError = false;
    const newAtts = files.map((f) => {
      if (f.size > 20 * 1024 * 1024) hasError = true;
      return {
        id: Date.now() + Math.random(),
        name: f.name,
        type: 'Tài liệu kỹ thuật',
        description: '',
        uploadedAt: new Date().toLocaleDateString('vi-VN'),
        size: f.size
      };
    });
    if (hasError) {
      if (typeof showToast === 'function') showToast('Một số file vượt quá dung lượng tối đa 20MB.', 'error');
    } else if (newAtts.length > 0) {
      setAttachmentFiles((prev) => [...prev, ...newAtts]);
    }
    e.target.value = '';
  };

  // Helpers mappings
  const availableVariants = [];
  const distOptions = formData.province ? (DISTRICTS[formData.province] || []) : [];
  const wardOptions = formData.district ? (WARDS[formData.district] || []) : [];

  if (viewingSimilarOpps) {
    return (
      <div className="lead-form-container" style={{ backgroundColor: '#f8fafc', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button className="btn btn-secondary" onClick={() => setViewingSimilarOpps(false)} style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '4px' }}>
              <span style={{ fontSize: '16px' }}>🔙</span> Quay lại
            </button>
            <h3 style={{ margin: 0, fontSize: '16px', color: '#1e293b' }}>Danh sách lead/opportunity chung MST ({mstValue}): {similarOpps.length} thẻ</h3>
          </div>
          <div></div>
        </div>

        <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ position: 'relative', width: '320px', display: 'flex' }}>
            <svg style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input type="text" placeholder="Tìm kiếm tự do..." style={{ width: '100%', padding: '10px 16px 10px 44px', border: '1px solid #cbd5e1', borderRadius: '12px', fontSize: '15px', color: '#64748b', outline: 'none', background: 'white' }} value={similarSearchInput} onChange={e => setSimilarSearchInput(e.target.value)} />
          </div>
          <div style={{ fontSize: '14px', color: '#475569', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div className="pagination-controls" style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: '#64748b' }}>
              <select value={similarPageSize} onChange={e => { setSimilarPageSize(Number(e.target.value)); setSimilarCurrentPage(1); }} className="page-size-select" style={{ border: '1px solid transparent', background: 'transparent', outline: 'none', color: '#64748b', cursor: 'pointer', padding: '2px 4px', borderRadius: '4px' }}>
                <option value={5}>5 items</option>
                <option value={10}>10 items</option>
                <option value={30}>30 items</option>
                <option value={50}>50 items</option>
                <option value={100}>100 items</option>
                <option value={200}>200 items</option>
              </select>
              <span>{similarTotalItems > 0 ? (similarSafeCurrentPage - 1) * similarPageSize + 1 : 0}-{Math.min(similarSafeCurrentPage * similarPageSize, similarTotalItems)} / {similarTotalItems}</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setSimilarCurrentPage(p => p - 1)} disabled={similarSafeCurrentPage === 1} style={{ border: 'none', background: 'transparent', cursor: similarSafeCurrentPage === 1 ? 'default' : 'pointer', opacity: similarSafeCurrentPage === 1 ? 0.3 : 1, padding: 0 }}>
                  &lt;
                </button>
                <button onClick={() => setSimilarCurrentPage(p => p + 1)} disabled={similarSafeCurrentPage >= similarTotalPages} style={{ border: 'none', background: 'transparent', cursor: similarSafeCurrentPage >= similarTotalPages ? 'default' : 'pointer', opacity: similarSafeCurrentPage >= similarTotalPages ? 0.3 : 1, padding: 0 }}>
                  &gt;
                </button>
              </div>
            </div>
            <button onClick={exportToExcel} style={{ background: 'white', border: '1px solid #cbd5e1', color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, padding: '6px 12px', borderRadius: '12px', fontSize: '14px' }}>
              <ArrowDownToLine size={16} /> Export
            </button>
            <span style={{ cursor: 'pointer' }}><Sliders size={18} /></span>
          </div>
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
          <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <table className="list-view-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px', whiteSpace: 'nowrap' }}>
              <thead>
                <tr>
                  <th style={{ position: 'sticky', top: 0, zIndex: 6, backgroundColor: '#f8fafc', padding: '12px 16px', fontWeight: 600, borderRight: '1px solid #f1f5f9', borderBottom: '1px solid #cbd5e1', width: '40px', textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={paginatedSimilarOpps.length > 0 && similarSelectedRows.length === paginatedSimilarOpps.length}
                      onChange={(e) => {
                        if (e.target.checked) setSimilarSelectedRows(paginatedSimilarOpps.map(t => t.id));
                        else setSimilarSelectedRows([]);
                      }}
                    />
                  </th>
                  {[
                    { key: 'id', label: 'Opportunity ID' },
                    { key: 'content', label: 'Tên Opportunity' },
                    { key: 'company', label: 'Tên khách hàng' },
                    { key: 'mst', label: 'MST' },
                    { key: 'contactName', label: 'Contact Name' },
                    { key: 'email', label: 'Email' }
                  ].map(col => (
                    <th key={col.key} style={{ position: 'sticky', top: 0, zIndex: 5, backgroundColor: '#f8fafc', padding: '12px 16px', fontWeight: 600, borderRight: '1px solid #f1f5f9', borderBottom: '1px solid #cbd5e1', color: '#475569' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', flex: 1 }} onClick={() => handleSimilarSort(col.key)}>
                          {col.label}
                          <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '6px', color: similarSortConfig.key === col.key ? '#0f172a' : '#cbd5e1' }}>
                            <ChevronUp size={12} style={{ marginBottom: '-4px', opacity: similarSortConfig.key === col.key && similarSortConfig.direction === 'desc' ? 0.3 : 1 }} />
                            <ChevronDown size={12} style={{ opacity: similarSortConfig.key === col.key && similarSortConfig.direction === 'asc' ? 0.3 : 1 }} />
                          </div>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedSimilarOpps.map(opp => (
                  <tr key={opp.id} style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer', transition: 'background-color 0.2s', backgroundColor: similarSelectedRows.includes(opp.id) ? '#f8fafc' : 'transparent' }} onClick={() => { setViewingSimilarOpps(false); navigate(`/opportunity/edit/${opp.id}`); }} className="list-row-hover">
                    <td style={{ padding: '12px 16px', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
                      <input type="checkbox" checked={similarSelectedRows.includes(opp.id)} onChange={(e) => {
                        if (e.target.checked) setSimilarSelectedRows([...similarSelectedRows, opp.id]);
                        else setSimilarSelectedRows(similarSelectedRows.filter(id => id !== opp.id));
                      }} />
                    </td>
                    <td style={{ padding: '12px 16px', color: '#2563eb', fontWeight: 500 }}>{opp.id}</td>
                    <td style={{ padding: '12px 16px', color: '#1e293b', fontWeight: 500 }}>{opp.content}</td>
                    <td style={{ padding: '12px 16px', color: '#475569' }}>{opp.company}</td>
                    <td style={{ padding: '12px 16px', color: '#475569' }}>{opp.mst}</td>
                    <td style={{ padding: '12px 16px', color: '#475569' }}>{opp.contactName || ''}</td>
                    <td style={{ padding: '12px 16px', color: '#475569' }}>{opp.email || ''}</td>
                  </tr>
                ))}
                {paginatedSimilarOpps.length === 0 && (
                  <tr><td colSpan="7" style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>Không có lead/opportunity tương đồng nào.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lead-form-container">
      {/* TOAST MESSAGE */}
      {toast.show && (
        <div style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 9999, padding: '12px 24px', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', background: toast.type === 'error' ? '#fef2f2' : '#f0fdf4', border: `1px solid ${toast.type === 'error' ? '#fecaca' : '#bbf7d0'}`, display: 'flex', alignItems: 'center', gap: '8px', animation: 'slideIn 0.3s ease-out' }}>
          <span style={{ color: toast.type === 'error' ? '#ef4444' : '#22c55e', fontWeight: 'bold' }}>{toast.type === 'error' ? '!' : '✓'}</span>
          <span style={{ color: '#0f172a', fontSize: '14px', fontWeight: 500 }}>{toast.message}</span>
        </div>
      )}

      {/* HEADER */}
      {/* HEADER */}
      <div className="lead-form-header" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="breadcrumb">
          <span className="breadcrumb-item" onClick={() => navigate('/opportunity')}>Danh sách Lead/Opportunity</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{id && id !== 'new' ? id : 'Mới'}</span>
        </div>
        <div className="header-actions" style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
           {leadStatus !== 'Không thành công' && id && id !== 'new' && <button className="btn btn-danger" style={{padding: '6px 16px', fontSize: '13px', backgroundColor: '#e32b4c', borderColor: '#e32b4c', color: 'white'}} onClick={() => openSearchModal('lost_reason')}>Không thành công</button>}
           
           <div style={{width: '1px', height: '20px', background: '#cbd5e1', margin: '0 4px'}}></div>

           {leadStatus === 'Mới' && (
             <button className="btn btn-secondary" style={{padding: '6px 10px', backgroundColor: 'white', color: '#475569', display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1'}} onClick={() => {
                if (window.confirm('Bạn có chắc chắn muốn xóa bản ghi này?')) {
                  mockStore.deleteOpp(id);
                  navigate('/opportunity');
                }
             }} title="Xóa">
               <Trash2 size={16} />
             </button>
           )}
           {leadStatus === 'Mới' && (
             <button className="btn btn-primary" style={{padding: '6px 16px', fontSize: '13px', backgroundColor: '#e32b4c', borderColor: '#e32b4c', color: 'white'}} onClick={commitSave}>Lưu</button>
           )}
        </div>
      </div>

      <div className="form-chatter-wrapper">

        <div className="lead-form-sheet sheet-inner-wrapper">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div className="oe_button_box" style={{ marginBottom: 0 }}>
              {/* Nút PAKD đã bị ẩn hoàn toàn theo yêu cầu */}
              {id && pakdCount > 0 && (
                <div className="stat_button" style={{ justifyContent: 'center', minWidth: '140px' }}>
                  <div style={{ color: '#714B67' }}><FileEdit size={22} /></div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div className="stat_text" style={{ textAlign: 'center' }}>PAKD</div>
                    <div className="stat_value" style={{ textAlign: 'center' }}>{pakdCount}</div>
                  </div>
                </div>
              )}
            </div>

            <div className="statusbar" style={{ background: 'transparent', margin: 0, gap: '4px' }}>
              {['Mới', 'Đang tiếp xúc', 'Đánh giá nhu cầu', 'Đang báo giá', 'Đấu thầu', 'POC', 'Kí hợp đồng'].map((st) => {
                const isCurrent = leadStatus === st;
                const isAllowed = getAllowedTransitions(leadStatus).includes(st);
                return (
                  <div
                    key={st}
                    className="statusbar-item"
                    style={{
                      padding: '8px 12px',
                      borderRadius: '4px',
                      fontWeight: 500,
                      fontSize: '13px',
                      userSelect: 'none',
                      whiteSpace: 'nowrap',
                      backgroundColor: isCurrent ? '#E32B4C' : (isAllowed ? '#F1F5F9' : '#F8FAFC'),
                      color: isCurrent ? 'white' : (isAllowed ? '#475569' : '#94A3B8'),
                      border: isAllowed && !isCurrent ? '1px solid #E32B4C' : '1px solid transparent',
                      cursor: isAllowed ? 'pointer' : (isCurrent ? 'default' : 'not-allowed')
                    }}
                    onClick={() => {
                      if (isAllowed) handleStatusChange(st);
                    }}
                  >
                    {st}
                  </div>
                )
              })}
            </div>
          </div>

          {leadStatus === 'Không thành công' && (
            <div className="ribbon-wrapper">
              <div className="ribbon">KHÔNG THÀNH CÔNG</div>
            </div>
          )}

          <fieldset disabled={isDisabled} style={{ border: 'none', margin: 0, padding: 0 }}>
            <div className="sheet-title-section">
              <div className="oe_title">
                <label>Tên Lead/Opportunity <span style={{ color: 'red' }}>*</span></label>
                <input type="text" ref={nameRef} className={`title-input ${errors.leadName ? 'has-error' : ''}`} placeholder="Nhập tên lead" value={formData.leadName} onChange={e => { hf('leadName', e.target.value); setErrors(p => ({ ...p, leadName: false })) }} style={{ borderColor: errors.leadName ? 'red' : undefined }} />
                {errors.leadName && <small style={{ color: 'red', fontWeight: 500 }}>Trường này là bắt buộc</small>}
              </div>
              <div className="probability-box">
                <label>Probability (%)</label>
                <input type="number" className="prob-input" value={formData.probability} onChange={e => hf('probability', e.target.value)} />
              </div>
            </div>

            <div className="sheet-main-content" style={{ alignItems: 'stretch' }}>
              {/* L COLUMN */}
              <div className="form-column">
                <div className="column-title" style={{ margin: '0 0 12px 0', padding: '0 0 8px 0', lineHeight: 1 }}>Thông tin chung</div>
                {id && (
                  <div className="form-group">
                    <label className="form-label">ID</label>
                    <input type="text" className="form-control" readOnly value={id} />
                  </div>
                )}
                {/* DỊCH VỤ CHI TIẾT */}
                <div className="form-group" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                  <label className="form-label" style={{ width: '100%', marginBottom: '8px' }}>Dịch vụ chi tiết</label>
                  <div className="service-row-header">
                    <span>Loại dự án</span>
                    <span>Dịch vụ</span>
                    <span>Mô tả sản phẩm</span>
                    <span></span>
                  </div>
                  <div className="service-rows">
                    {serviceDetails.map(srv => (
                      <div className="service-row" key={srv.id}>
                        <select
                          className="form-control"
                          value={srv.projectCategory}
                          onChange={e => updateService(srv.id, 'projectCategory', e.target.value)}
                        >
                          <option value="">-- Chọn loại dự án --</option>
                          <option value="solution">Giải pháp</option>
                          <option value="service">Dịch vụ</option>
                        </select>
                        <select
                          className="form-control"
                          value={srv.service}
                          onChange={e => updateService(srv.id, 'service', e.target.value)}
                          disabled={!srv.projectCategory}
                        >
                          <option value="">-- Chọn dịch vụ --</option>
                          {(SERVICE_OPTIONS_BY_PROJECT[srv.projectCategory] || []).map(item => (
                            <option key={item} value={item}>{item}</option>
                          ))}
                        </select>
                        <input
                          type="text"
                          className="form-control"
                          value={srv.description}
                          onChange={e => updateService(srv.id, 'description', e.target.value)}
                          placeholder="Nhập mô tả sản phẩm"
                        />
                        <button type="button" className="icon-btn" onClick={() => removeService(srv.id)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                  {errors.serviceDetails && <small style={{ color: 'red', display: 'block', marginTop: '4px', fontWeight: 500 }}>Vui lòng thêm ít nhất 1 dòng dịch vụ hợp lệ</small>}
                  <div className="add-line-btn" onClick={addServiceLine}>Thêm dịch vụ</div>
                </div>
                <div className="form-group">
                  <label className="form-label">Doanh thu dự kiến</label>
                  <input type="text" className="form-control" placeholder="0 ₫" />
                </div>
                <div className="form-group">
                  <label className="form-label">Độ ưu tiên</label>
                  <select className="form-control" value={formData.priority || '1'} onChange={e => hf('priority', e.target.value)}>
                    <option value="1">⭐ Thấp</option>
                    <option value="2">⭐⭐ Trung bình</option>
                    <option value="3">⭐⭐⭐ Cao</option>
                  </select>
                </div>
              </div>

              {/* R COLUMN */}
              <div className="form-column">
                <div className="column-title" style={{ margin: '0 0 12px 0', padding: '0 0 8px 0', lineHeight: 1 }}>Thông tin khách hàng</div>

                <div className="form-group" style={{ alignItems: 'flex-start' }}>
                  <label className="form-label" style={{ marginTop: '6px' }}>Tên khách hàng <span style={{ color: 'red' }}>*</span></label>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div className="autocomplete-container">
                      <input
                        ref={clientRef}
                        type="text"
                        className="form-control"
                        placeholder="Tên đầy đủ *"
                        style={{ borderColor: errors.clientSearch ? 'red' : undefined, width: '100%' }}
                        value={clientSearch}
                        onChange={e => { setClientSearch(e.target.value); setShowClientSuggest(true); setErrors(p => ({ ...p, clientSearch: false })); }}
                        onFocus={() => setShowClientSuggest(true)}
                        onBlur={() => setTimeout(() => setShowClientSuggest(false), 200)}
                      />
                      {showClientSuggest && clientSearch && (
                        <div className="dropdown-menu">
                          {filteredClients.length > 0 ? filteredClients.map(c => (
                            <div key={c.id} className="dropdown-item" onClick={() => selectClient(c)}>
                              <strong>[{c.id}] {c.name}</strong><br />
                              <small style={{ color: '#64748b' }}>MST: {c.mst}</small>
                            </div>
                          )) : (
                            <div className="dropdown-item" style={{ color: '#94a3b8' }}>Không tìm thấy. Nhập thông tin thủ công.</div>
                          )}
                        </div>
                      )}
                    </div>
                    {errors.clientSearch && <small style={{ color: 'red', fontWeight: 500 }}>Vui lòng nhập tên đầy đủ khách hàng</small>}
                  </div>
                </div>

                <div className="form-group" style={{ alignItems: 'flex-start' }}>
                  <label className="form-label" style={{ marginTop: '6px' }}>Tên viết tắt KH <span style={{ color: 'red' }}>*</span></label>
                  <div style={{ flex: 1 }}>
                    <input type="text" className={`form-control focus-ring ${errors.clientAbbr ? 'has-error' : ''}`} style={{ borderColor: errors.clientAbbr ? 'red' : undefined, width: '100%' }} value={clientAbbr} onChange={e => { setClientAbbr(e.target.value); setErrors(p => ({ ...p, clientAbbr: false })) }} />
                    {errors.clientAbbr && <small style={{ color: 'red', display: 'block', marginTop: '4px', fontWeight: 500 }}>{errors.clientAbbr}</small>}
                  </div>
                </div>

                <div className="form-group" style={{ alignItems: 'flex-start' }}>
                  <label className="form-label" style={{ marginTop: '6px' }}>MST</label>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <input type="text" ref={mstRef} className="form-control" style={{ borderColor: errors.mstValue ? 'red' : undefined, width: '100%', paddingRight: !mstValue ? '28px' : '12px' }} placeholder="Mã số thuế" value={mstValue} onChange={(e) => { setMstValue(e.target.value); setErrors(p => ({ ...p, mstValue: false })) }} />
                      {!mstValue && (
                        <span style={{ color: '#e32b4c', fontWeight: 'bold', marginLeft: '-20px', cursor: 'help', fontSize: '14px', zIndex: 10 }} title="Vui lòng nhập mã số thuế để biết có bao nhiêu opportunity tương đồng">!</span>
                      )}
                    </div>
                    {errors.mstValue && <small style={{ color: 'red', display: 'block', marginTop: '4px', fontWeight: 500 }}>Trường này là bắt buộc khi chuyển trạng thái</small>}
                  </div>
                </div>

                <div className="form-group" style={{ alignItems: 'flex-start' }}>
                  <label className="form-label" style={{ marginTop: '6px' }}>Phân loại {isAdvancedStage && <span style={{ color: 'red' }}>*</span>}</label>
                  <div style={{ flex: 1 }}>
                    <select className={`form-control ${errors.classification ? 'has-error' : ''}`} style={{ width: '100%', borderColor: errors.classification ? 'red' : undefined }} value={classificationValue} onChange={e => { setClassificationValue(e.target.value); setErrors(p => ({ ...p, classification: false })) }}>
                      <option value="">-- Chọn phân loại --</option>
                      <option value="Doanh nghiệp">Doanh nghiệp</option>
                      <option value="Nội bộ">Nội bộ</option>
                    </select>
                  </div>
                </div>

                <div className="form-group" style={{ alignItems: 'flex-start' }}>
                  <label className="form-label" style={{ marginTop: '6px' }}>Lĩnh vực <span style={{ color: 'red' }}>*</span></label>
                  <div style={{ flex: 1 }}>
                    <select ref={domainRef} className="form-control" style={{ borderColor: errors.domainValue ? 'red' : undefined, width: '100%' }} value={domainValue} onChange={e => { setDomainValue(e.target.value); setErrors(p => ({ ...p, domainValue: false })) }}>
                      <option value="">-- Chọn lĩnh vực --</option>
                      <option value="Bất động sản">Bất động sản</option>
                      <option value="Tài chính">Tài chính</option>
                      <option value="CNTT / Viễn thông">CNTT / Viễn thông</option>
                      <option value="F&B">F&B</option>
                    </select>
                    {errors.domainValue && <small style={{ color: 'red', display: 'block', marginTop: '4px', fontWeight: 500 }}>Trường này là bắt buộc</small>}
                  </div>
                </div>

                {/* CUSTOM ADDRESS */}
                <div className="form-group" style={{ alignItems: 'flex-start' }}>
                  <label className="form-label" style={{ paddingTop: '6px' }}>Địa chỉ</label>
                  <div className="address-grid">
                    <input type="text" className="form-control" style={{ width: '100%' }} placeholder="Địa chỉ chi tiết (nhà, ngõ...)" value={formData.addressDetail} onChange={e => hf('addressDetail', e.target.value)} />
                    <div className="address-location-row">
                      <select className="form-control" value={formData.province} onChange={e => hf('province', e.target.value)}>
                        <option value="">Tỉnh/TP</option>
                        {PROVINCES.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                      <select className="form-control" value={formData.district} onChange={e => hf('district', e.target.value)} disabled={!formData.province}>
                        <option value="">Quận/Huyện</option>
                        {distOptions.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                      </select>
                      <select className="form-control" value={formData.ward} onChange={e => hf('ward', e.target.value)} disabled={!formData.district}>
                        <option value="">Phường/Xã</option>
                        {wardOptions.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Website</label>
                  <input type="text" className="form-control" placeholder="https://" />
                </div>

                <div className="form-group">
                  <label className="form-label">Tag</label>
                  <select className="form-control">
                    <option value="">-- Chọn tag --</option>
                    <option value="doanhnghiep">Doanh nghiệp</option>
                    <option value="noibo">Nội bộ</option>
                    <option value="vip">Khách hàng VIP</option>
                    <option value="tiemnang">Khách hàng Tiềm năng</option>
                  </select>
                </div>

                {/* THÔNG TIN LIÊN HỆ */}
                {/* THÔNG TIN LIÊN HỆ */}
                <div className="contact-info-list" style={{ marginTop: '16px' }}>
                  <label className="form-label" style={{ width: '100%', marginBottom: '8px', display: 'block' }}>Liên hệ khách hàng</label>
                  <div className="contact-info-box" style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'visible' }}>
                    <div className="contact-item" style={{ fontWeight: 600, borderBottom: '2px solid #e2e8f0', padding: '12px 16px', background: '#f8fafc', margin: 0 }}>
                      <span>Tên</span><span>SĐT</span><span>Email</span><span>Vị trí</span><span style={{ textAlign: 'center' }}>TT</span><span></span>
                    </div>
                    <div style={{ padding: '0 16px', overflow: 'visible' }}>
                      {contacts.map((contact) => (
                        <div className="contact-item" key={contact.id} style={{ padding: '12px 0' }}>
                          <div style={{ position: 'relative', width: '100%' }}>
                            <div style={{ display: 'flex', alignItems: 'center', width: '100%', position: 'relative' }}>
                              <input
                                type="text"
                                className="form-control"
                                style={{ border: 'none', outline: 'none', width: '100%', background: 'transparent', padding: '4px 20px 4px 4px', fontSize: '13px', cursor: 'pointer' }}
                                placeholder="-- Tên liên hệ --"
                                value={contact.name || ''}
                                onChange={(e) => {
                                  updateContact(contact.id, 'name', e.target.value);
                                  updateContact(contact.id, 'showDropdown', true);
                                }}
                                onFocus={() => updateContact(contact.id, 'showDropdown', true)}
                                onBlur={() => setTimeout(() => updateContact(contact.id, 'showDropdown', false), 200)}
                              />
                              <span style={{ position: 'absolute', right: '4px', pointerEvents: 'none', color: '#64748b', fontSize: '10px' }}>▼</span>
                            </div>
                            {contact.showDropdown && (
                              <div className="dropdown-menu" style={{ top: '100%', left: 0, right: 0, width: '100%', minWidth: '150px', zIndex: 1000 }}>
                                {contactsDbData.filter(c => c.name.toLowerCase().includes((contact.name || '').toLowerCase())).map(c => (
                                  <div key={c.id} className="dropdown-item" onMouseDown={(e) => {
                                    e.preventDefault();
                                    updateContact(contact.id, 'name', c.name);
                                    updateContact(contact.id, 'phone', c.phone || '');
                                    updateContact(contact.id, 'email', c.email || '');
                                    updateContact(contact.id, 'contactDbId', c.id);
                                    updateContact(contact.id, 'positionId', c.positionId || '');
                                    updateContact(contact.id, 'active', c.active !== undefined ? c.active : true);
                                    updateContact(contact.id, 'showDropdown', false);
                                  }}>
                                    {c.name}
                                  </div>
                                ))}
                                {(contact.name || '').trim() !== '' && !contactsDbData.some(c => c.name.toLowerCase() === (contact.name || '').toLowerCase()) && (
                                  <div className="dropdown-item" style={{ color: '#2563eb', fontStyle: 'italic' }} onMouseDown={(e) => {
                                    e.preventDefault();
                                    const newCt = { id: `CT_${Date.now()}`, name: contact.name, phone: '', email: '', positionId: '', active: true };
                                    setContactsDbData([...contactsDbData, newCt]);
                                    updateContact(contact.id, 'contactDbId', newCt.id);
                                    updateContact(contact.id, 'showDropdown', false);
                                  }}>
                                    + Tạo mới "{contact.name}"
                                  </div>
                                )}
                                <div className="dropdown-item" style={{ color: '#64748b', fontWeight: 500, borderTop: '1px solid #f1f5f9' }} onMouseDown={(e) => {
                                  e.preventDefault();
                                  updateContact(contact.id, 'showDropdown', false);
                                  openSearchModal('contact_search', contact.id);
                                }}>
                                  Tìm kiếm...
                                </div>
                              </div>
                            )}
                          </div>
                          <input type="text" style={{ border: 'none', outline: 'none', width: '100%', background: 'transparent' }} value={contact.phone} onChange={e => updateContact(contact.id, 'phone', e.target.value)} placeholder="SĐT..." />
                          <input type="text" style={{ border: 'none', outline: 'none', width: '100%', background: 'transparent' }} value={contact.email} onChange={e => updateContact(contact.id, 'email', e.target.value)} placeholder="Email..." />

                          <div style={{ position: 'relative' }}>
                            <select className="form-control" style={{ width: '100%', padding: '2px', fontSize: '12px' }} value={contact.positionId} onChange={(e) => {
                              if (e.target.value === 'SEARCH_MORE') {
                                openSearchModal('position', contact.id);
                              } else updateContact(contact.id, 'positionId', e.target.value);
                            }}>
                              <option value="">-- Chọn --</option>
                              {positionsData.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                              <option value="SEARCH_MORE" className="dropdown-action-item">Tìm kiếm...</option>
                            </select>
                          </div>

                          <span className={`status-badge ${contact.active ? 'status-active' : 'status-inactive'}`} onClick={() => toggleContactStatus(contact.id)}>
                            {contact.active ? 'Act' : 'Ina'}
                          </span>
                          <button className="icon-btn" onClick={() => removeContact(contact.id)}><Trash2 size={16} /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="add-line-btn" onClick={addContactLine} style={{ marginTop: '8px', marginBottom: '8px' }}>Thêm liên hệ</div>
                  <div style={{ width: '100%', height: '1px', backgroundColor: '#e2e8f0', marginTop: '8px' }}></div>
                </div>
              </div>
            </div>

            <div className="notebook">
              <div className="section-header" style={{ marginBottom: '12px' }}>
                <h2 className="section-title" style={{ fontSize: '18px' }}>Tài liệu</h2>
              </div>
              <div className="notebook-content">
                <label
                  htmlFor="opportunity-doc-upload"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '130px',
                    border: '1px dashed #cbd5e1',
                    borderRadius: '8px',
                    background: '#fafafa',
                    cursor: 'pointer',
                    marginBottom: '16px'
                  }}
                >
                  <ArrowDownToLine size={34} color="#0f3a66" />
                  <div style={{ marginTop: '10px', fontSize: '30px', fontWeight: 600, color: '#1f2937' }}>Drag and drop or Browse your file</div>
                  <div style={{ marginTop: '4px', fontSize: '13px', color: '#64748b' }}>Tối đa 20MB mỗi file</div>
                </label>
                <input id="opportunity-doc-upload" type="file" multiple style={{ display: 'none' }} onChange={handleAttachmentUpload} />
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                    <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                      <tr>
                        <th style={{ padding: '12px', textAlign: 'left', width: '56px' }}>No</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Tài liệu</th>
                        <th style={{ padding: '12px', textAlign: 'left', width: '220px' }}>Loại chứng từ</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Nội dung tài liệu</th>
                        <th style={{ padding: '12px', textAlign: 'left', width: '180px' }}>Thời điểm tải lên</th>
                        <th style={{ padding: '12px', textAlign: 'center', width: '70px' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attachmentFiles.length === 0 ? (
                        <tr>
                          <td colSpan="6" style={{ textAlign: 'center', color: '#94a3b8', padding: '30px 12px' }}>
                            Chưa có tài liệu nào được tải lên
                          </td>
                        </tr>
                      ) : (
                        attachmentFiles.map((file, index) => (
                          <tr key={file.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '10px 12px' }}>{index + 1}</td>
                            <td style={{ padding: '10px 12px', color: '#2563eb' }}>{file.name}</td>
                            <td style={{ padding: '10px 12px' }}>
                              <select
                                className="form-control"
                                value={file.type || 'Tài liệu kỹ thuật'}
                                onChange={(e) => setAttachmentFiles((prev) => prev.map((f) => (f.id === file.id ? { ...f, type: e.target.value } : f)))}
                              >
                                <option value="Báo giá">Báo giá</option>
                                <option value="Hợp đồng">Hợp đồng</option>
                                <option value="Tài liệu kỹ thuật">Tài liệu kỹ thuật</option>
                                <option value="Khác">Khác</option>
                              </select>
                            </td>
                            <td style={{ padding: '10px 12px' }}>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Nhập nội dung tài liệu..."
                                value={file.description || ''}
                                onChange={(e) => setAttachmentFiles((prev) => prev.map((f) => (f.id === file.id ? { ...f, description: e.target.value } : f)))}
                              />
                            </td>
                            <td style={{ padding: '10px 12px', color: '#64748b' }}>{file.uploadedAt || '-'}</td>
                            <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                              <button title="Xóa" style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 0 }} onClick={() => setAttachmentFiles((prev) => prev.filter((f) => f.id !== file.id))}>
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="notebook">
              <div className="section-header" style={{ marginBottom: '12px' }}>
                <h2 className="section-title" style={{ fontSize: '18px' }}>Thông tin thêm</h2>
              </div>
              <div className="notebook-content">
                <div className="extra-info-grid">
                  <div className="form-column">
                    <div className="column-title" style={{ fontSize: '14px', border: 'none', margin: '0 0 8px 0', padding: 0, color: '#64748b' }}>Mốc thời gian & Khác</div>
                    <div className="form-group">
                      <label className="form-label">Ngày bắt đầu tiếp xúc</label>
                      <input type="date" className="form-control" value={formData.contactDate} onChange={e => hf('contactDate', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Tháng phát hành</label>
                      <input type="month" className="form-control" value={formData.issueMonth} onChange={e => hf('issueMonth', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Tháng ký hợp đồng</label>
                      <input type="month" className="form-control" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Đầu mối nghiệp vụ VCX</label>
                      <select className="form-control">
                        <option value="">-- Chọn đầu mối --</option>
                        <option value="op1">Vận hành nhóm A</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-column">
                    <div className="column-title" style={{ fontSize: '14px', border: 'none', margin: '0 0 8px 0', padding: 0, color: '#64748b' }}>Sales & Marketing</div>
                    <div className="form-group">
                      <label className="form-label">Nguồn tiếp cận</label>
                      <select className="form-control" value={sourceValue} onChange={e => setSourceValue(e.target.value)}>
                        <option value="">-- Chọn nguồn --</option>
                        <option value="marketing">Marketing</option>
                        <option value="referral">Giới thiệu</option>
                        <option value="landing">Landing page</option>
                        <option value="self">Tự tiếp cận</option>
                      </select>
                    </div>
                    {sourceValue === 'referral' && (
                      <div className="form-group">
                        <label className="form-label">Giới thiệu bởi</label>
                        <input type="text" className="form-control" placeholder="Tên người / đơn vị giới thiệu..." value={referredBy} onChange={e => setReferredBy(e.target.value)} />
                      </div>
                    )}
                    {sourceValue === 'marketing' && (
                      <div className="form-group">
                        <label className="form-label">Chiến dịch (Campaign)</label>
                        <input type="text" className="form-control" placeholder="Tên chiến dịch marketing..." value={campaignValue} onChange={e => setCampaignValue(e.target.value)} />
                      </div>
                    )}

                    <div className="form-group">
                      <label className="form-label">Sale person</label>
                      <input type="text" className="form-control" readOnly value="Trần B (Bạn)" />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Đơn vị xúc tiến</label>
                      <select className="form-control">
                        <option value="">-- Chọn đơn vị --</option>
                        <option value="b2b">Phòng bán hàng B2B</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Assign partner</label>
                      <select className="form-control" value={formData.partnerId} onChange={(e) => {
                        if (e.target.value === 'SEARCH_MORE') openSearchModal('partner');
                        else hf('partnerId', e.target.value);
                      }}>
                        <option value="">-- Trống --</option>
                        {partnersData.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        <option value="SEARCH_MORE" className="dropdown-action-item">Tìm kiếm...</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </fieldset>
        </div>

      </div>

      {/* POPUP MODAL TÌM KIẾM TẠO NHANH */}
      {modalState.open && (
        <div className="modal-overlay">
          <div className={`modal-content ${modalState.type === 'partner' ? 'modal-partner' : ''}`}>
            <div className="modal-header">
              <div className="modal-title">
                {modalState.type === 'position' ? 'Tìm kiếm & Phân quyền (Vị trí)'
                  : modalState.type === 'activity' ? 'Hoạt động'
                    : 'Search: Assigned Partner'}
              </div>
              <button className="modal-close" onClick={closeSearchModal}><X size={20} /></button>
            </div>

            {modalState.type === 'lost_reason' ? (
              <div className="modal-body" style={{ padding: '16px' }}>
                <div className="form-group" style={{ flexDirection: 'column', alignItems: 'flex-start', border: 'none' }}>
                  <label className="form-label" style={{ marginBottom: '8px' }}>Lý do Lost</label>
                  <select className="form-control" style={{ width: '100%' }} value={lostReason} onChange={e => setLostReason(e.target.value)}>
                    <option value="">-- Chọn lý do --</option>
                    <option value="Giá quá đắt">Giá quá đắt</option>
                    <option value="Không đủ tính năng">Không đủ tính năng</option>
                    <option value="Khách hàng đổi ý">Khách hàng đổi ý</option>
                  </select>
                </div>
                <div className="form-group" style={{ flexDirection: 'column', alignItems: 'flex-start', marginTop: '12px', border: 'none' }}>
                  <label className="form-label" style={{ marginBottom: '8px' }}>Mô tả chi tiết</label>
                  <textarea className="form-control" style={{ width: '100%', minHeight: '80px', padding: '8px' }} value={lostDesc} onChange={e => setLostDesc(e.target.value)}></textarea>
                </div>
                <div className="modal-footer" style={{ marginTop: '16px', justifyContent: 'flex-end', display: 'flex', gap: '8px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                  <button className="btn btn-primary" onClick={handleLostConfirm} disabled={!lostReason}>Xác nhận Lost</button>
                  <button className="btn btn-secondary" onClick={closeSearchModal}>Hủy</button>
                </div>
              </div>
            ) : modalState.type === 'activity' ? (
              <div className="modal-body" style={{ padding: '16px' }}>
                <div className="form-group" style={{ alignItems: 'flex-start', border: 'none' }}>
                  <label className="form-label" style={{ width: '120px', minWidth: '120px' }}>Loại hoạt động</label>
                  <div style={{ flex: 1, display: 'flex', gap: '8px' }}>
                    <select className="form-control" style={{ flex: 1 }} id="actType">
                      {activityTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <button className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '12px', whiteSpace: 'nowrap' }} onClick={() => {
                      const name = newActTypeName.trim() || prompt('Nhập tên loại hoạt động mới:');
                      if (name && !activityTypes.includes(name)) {
                        setActivityTypes(prev => [...prev, name]);
                      }
                    }}>+ Tạo nhanh</button>
                  </div>
                </div>
                <div className="form-group" style={{ alignItems: 'flex-start', marginTop: '12px', border: 'none' }}>
                  <label className="form-label" style={{ width: '120px', minWidth: '120px' }}>Ngày hết hạn</label>
                  <input type="date" className="form-control" style={{ flex: 1 }} id="actDate" defaultValue={new Date().toISOString().split('T')[0]} />
                </div>
                <div className="form-group" style={{ alignItems: 'flex-start', marginTop: '12px', border: 'none' }}>
                  <label className="form-label" style={{ width: '120px', minWidth: '120px' }}>Tóm tắt</label>
                  <input type="text" className="form-control" style={{ flex: 1 }} id="actSummary" placeholder="e.g. Discuss proposal" />
                </div>
                <div className="modal-footer" style={{ marginTop: '24px', justifyContent: 'flex-end', display: 'flex', gap: '8px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                  <button className="btn btn-primary" onClick={() => {
                    const summary = document.getElementById('actSummary').value || document.getElementById('actType').value;
                    const date = document.getElementById('actDate').value;
                    setActivities(prev => [...prev, { id: Date.now(), title: summary, type: document.getElementById('actType').value, date, done: false }]);
                    addChatterMessage('log', 'Hệ', `Đã lên lịch hoạt động: ${summary} (Hạn: ${date})`, 'vừa xong', 'white');
                    closeSearchModal();
                  }}>Lên lịch & Đóng</button>
                  <button className="btn btn-secondary" onClick={closeSearchModal}>Hủy</button>
                </div>
              </div>
            ) : modalState.type === 'partner' ? (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="odoo-search-bar">
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #71717a', borderRadius: '4px', padding: '4px 8px', width: '300px' }}>
                    <span style={{ color: '#71717a', marginRight: '8px' }}>🔍</span>
                    <input type="text" style={{ border: 'none', outline: 'none', flex: 1, fontSize: '13px' }} placeholder="Search..." value={modalState.searchInput} onChange={(e) => setModalState({ ...modalState, searchInput: e.target.value })} autoFocus />
                  </div>
                  <div style={{ fontSize: '13px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    1-6 / 6
                    <button style={{ border: 'none', background: '#f1f5f9', padding: '4px 8px', cursor: 'pointer', color: '#64748b' }}>&lt;</button>
                    <button style={{ border: 'none', background: '#f1f5f9', padding: '4px 8px', cursor: 'pointer', color: '#64748b' }}>&gt;</button>
                  </div>
                </div>
                <div className="partner-table-wrapper">
                  <table className="odoo-table">
                    <thead>
                      <tr>
                        <th>Name</th><th>Phone</th><th>Email</th><th>Salesperson</th><th>City</th><th>Country</th><th>Partner Level</th>
                      </tr>
                    </thead>
                    <tbody>
                      {partnersData.filter(d => d.name.toLowerCase().includes(modalState.searchInput.toLowerCase())).map(item => (
                        <tr key={item.id} onClick={() => handleSelectModalItem(item.id)}>
                          <td>{item.name}</td><td>{item.phone}</td><td>{item.email}</td><td></td><td>{item.city}</td><td>{item.country}</td><td>{item.level}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="modal-footer" style={{ justifyContent: 'flex-start', padding: '12px 16px', background: 'white' }}>
                  <button className="btn" style={{ backgroundColor: '#714B67', color: 'white', padding: '6px 16px', border: '1px solid #714B67' }}>New</button>
                  <button className="btn btn-secondary" onClick={closeSearchModal} style={{ padding: '6px 16px' }}>Close</button>
                </div>
              </div>
            ) : modalState.type === 'customer_compare' && customerMatchData ? (
              <div className="modal-body" style={{ padding: '16px', minWidth: '600px' }}>
                <div style={{ background: '#fef2f2', padding: '12px', color: '#991b1b', borderRadius: '4px', marginBottom: '16px', fontSize: '13px' }}>
                  Phát hiện Khách hàng có chung MST (<strong>{mstValue}</strong>) đã tồn tại trong hệ thống. Vui lòng đối chiếu và cập nhật thông tin nếu cần trước khi chuyển sang trạng thái Thành công.
                </div>
                <div style={{ display: 'flex', gap: '24px' }}>
                  <div style={{ flex: 1, background: '#f8fafc', padding: '12px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                    <h4 style={{ marginTop: 0, marginBottom: '12px', borderBottom: '1px solid #cbd5e1', paddingBottom: '8px', color: '#475569' }}>Dữ liệu cũ (Kho)</h4>
                    <div style={{ fontSize: '13px', lineHeight: '1.6' }}>
                      <div><strong>Tên KH:</strong> {customerMatchData.name}</div>
                      <div><strong>Viết tắt:</strong> {customerMatchData.shortName}</div>
                      <div><strong>SĐT:</strong> {customerMatchData.phone}</div>
                      <div><strong>Email:</strong> {customerMatchData.email}</div>
                      <div><strong>Địa chỉ:</strong> {customerMatchData.address}</div>
                      <div><strong>Lĩnh vực:</strong> {customerMatchData.domain}</div>
                    </div>
                  </div>
                  <div style={{ flex: 1, background: '#fff', padding: '12px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                    <h4 style={{ marginTop: 0, marginBottom: '12px', borderBottom: '1px solid #cbd5e1', paddingBottom: '8px', color: '#2563eb' }}>Dữ liệu đang nhập</h4>
                    <div style={{ fontSize: '13px', lineHeight: '1.6' }}>
                      <div><strong>Tên KH:</strong> {clientSearch}</div>
                      <div><strong>Viết tắt:</strong> {clientAbbr}</div>
                      <div><strong>SĐT:</strong> {contacts.length > 0 ? contacts[0].phone : ''}</div>
                      <div><strong>Email:</strong> {contacts.length > 0 ? contacts[0].email : ''}</div>
                      <div><strong>Địa chỉ:</strong> {`${formData.ward || ''}, ${formData.district || ''}, ${formData.province || ''}`.replace(/^,\s*|,\s*$/g, '')}</div>
                      <div><strong>Lĩnh vực:</strong> {domainValue}</div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer" style={{ marginTop: '24px', justifyContent: 'flex-end', display: 'flex', gap: '8px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                  <button className="btn btn-primary" onClick={() => {
                    const updatedData = {
                      ...customerMatchData,
                      name: clientSearch || customerMatchData.name,
                      shortName: clientAbbr || customerMatchData.shortName,
                      phone: contacts.length > 0 ? contacts[0].phone : customerMatchData.phone,
                      email: contacts.length > 0 ? contacts[0].email : customerMatchData.email,
                      address: `${formData.ward || ''}, ${formData.district || ''}, ${formData.province || ''}`.replace(/^,\s*|,\s*$/g, ''),
                      domain: domainValue || customerMatchData.domain
                    };
                    mockStore.updateCustomer(customerMatchData.id, updatedData);
                    setLeadStatus('Thành công');
                    if (id) mockStore.updateOppStatus(id, 'Thành công');
                    alert('Đã cập nhật dữ liệu Khách hàng hiện tại và chuyển trạng thái Thành công!');
                    closeSearchModal();
                  }}>Lưu Đè Dữ Liệu</button>
                  <button className="btn btn-secondary" onClick={() => {
                    setLeadStatus('Thành công');
                    if (id) mockStore.updateOppStatus(id, 'Thành công');
                    closeSearchModal();
                  }}>Bỏ qua (Giữ Dữ liệu cũ)</button>
                </div>
              </div>
            ) : modalState.type === 'contact_search' ? (
              <div className="modal-body" style={{ padding: '16px' }}>
                <div style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
                  <input type="text" className="form-control" style={{ flex: 1 }} placeholder="Tìm theo tên..." value={modalState.searchInput} onChange={(e) => setModalState({ ...modalState, searchInput: e.target.value })} autoFocus />
                  <button className="btn btn-primary" style={{ padding: '4px 12px' }} onClick={confirmModalCreate}>+ Tạo mới</button>
                </div>
                <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '4px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                      <tr>
                        <th style={{ padding: '8px', textAlign: 'left', borderRight: '1px solid #e2e8f0' }}>Tên liên hệ</th>
                        <th style={{ padding: '8px', textAlign: 'left', borderRight: '1px solid #e2e8f0' }}>SĐT</th>
                        <th style={{ padding: '8px', textAlign: 'left', borderRight: '1px solid #e2e8f0' }}>Email</th>
                        <th style={{ padding: '8px', textAlign: 'left' }}>Vị trí</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contactsDbData.filter(c => c.name.toLowerCase().includes(modalState.searchInput.toLowerCase())).map(c => (
                        <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }} className="dropdown-item" onClick={() => handleSelectModalItem(c.id)}>
                          <td style={{ padding: '8px', borderRight: '1px solid #e2e8f0' }}>{c.name}</td>
                          <td style={{ padding: '8px', borderRight: '1px solid #e2e8f0' }}>{c.phone}</td>
                          <td style={{ padding: '8px', borderRight: '1px solid #e2e8f0' }}>{c.email}</td>
                          <td style={{ padding: '8px' }}>{positionsData.find(p => p.id === c.positionId)?.name || c.positionId}</td>
                        </tr>
                      ))}
                      {contactsDbData.filter(c => c.name.toLowerCase().includes(modalState.searchInput.toLowerCase())).length === 0 && (
                        <tr><td colSpan="4" style={{ padding: '16px', textAlign: 'center', color: '#94a3b8' }}>Không tìm thấy liên hệ nào.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="modal-footer" style={{ marginTop: '16px', borderTop: '1px solid #e2e8f0', paddingTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button className="btn btn-secondary" onClick={closeSearchModal}>Đóng</button>
                </div>
              </div>
            ) : (
              <div className="modal-body">
                <input type="text" className="form-control" style={{ width: '100%', padding: '10px', fontSize: '14px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="Nhập tên để tìm kiếm hoặc tạo mới..." value={modalState.searchInput} onChange={(e) => setModalState({ ...modalState, searchInput: e.target.value })} autoFocus />

                <div style={{ marginTop: '12px', maxHeight: '150px', overflowY: 'auto' }}>
                  {positionsData.filter(d => d.name.toLowerCase().includes(modalState.searchInput.toLowerCase())).map(item => (
                    <div key={item.id} className="dropdown-item" onClick={() => handleSelectModalItem(item.id)}>{item.name}</div>
                  ))}

                  {modalState.searchInput && (
                    <div className="dropdown-item" style={{ color: '#2563eb', fontStyle: 'italic' }} onClick={confirmModalCreate}>
                      + Tạo mới "{modalState.searchInput}"
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CHATTER SECTION */}
      <div id="chatter" className="notebook" style={{marginTop: '40px', borderTop: '1px solid #e2e8f0', background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', margin: '24px auto', maxWidth: '1100px'}}>
        <div className="notebook-tabs" style={{display: 'flex', gap: '2px', borderBottom: '1px solid #e2e8f0'}}>
          <div className={`notebook-tab ${activeChatterTab === 'log_note' ? 'active' : ''}`} onClick={() => setActiveChatterTab('log_note')} style={{padding: '10px 20px', cursor: 'pointer', borderBottom: activeChatterTab === 'log_note' ? '2px solid #e32b4c' : 'none', color: activeChatterTab === 'log_note' ? '#e32b4c' : '#64748b', fontWeight: activeChatterTab === 'log_note' ? 600 : 400}}>Ghi chú</div>
          <div className={`notebook-tab ${activeChatterTab === 'history' ? 'active' : ''}`} onClick={() => setActiveChatterTab('history')} style={{padding: '10px 20px', cursor: 'pointer', borderBottom: activeChatterTab === 'history' ? '2px solid #e32b4c' : 'none', color: activeChatterTab === 'history' ? '#e32b4c' : '#64748b', fontWeight: activeChatterTab === 'history' ? 600 : 400}}>Lịch sử hoạt động</div>
        </div>

        <div className="notebook-content" style={{padding: '20px 0'}}>
            <div className="chatter-in-tab">
              {activeChatterTab === 'log_note' ? (
                <>
                  <div style={{display: 'flex', gap: '12px', marginBottom: '24px'}}>
                    <div className="message-avatar" style={{width: '36px', height: '36px', backgroundColor: '#64748b'}}>U</div>
                    <div style={{flex: 1}}>
                        <div className="chatter-input-box" style={{border: '1px solid #e2e8f0', borderRadius: '4px', background: '#fff'}}>
                            <textarea className="chatter-textarea" style={{width: '100%', border: 'none', padding: '10px', minHeight: '80px', resize: 'vertical', fontSize: '14px', outline: 'none'}} placeholder="Ghi chú nội bộ..." value={chatterInput} onChange={handleChatterChange} ref={textareaRef}></textarea>
                            <div className="chatter-input-toolbar" style={{display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#f8fafc', borderTop: '1px solid #f1f5f9'}}>
                                <div className="chatter-toolbar-left" style={{display: 'flex', gap: '14px', color: '#64748b'}}>
                                    <Smile size={18} style={{cursor: 'pointer'}} />
                                    <Paperclip size={18} style={{cursor: 'pointer'}} />
                                </div>
                                <div className="chatter-toolbar-right"><Maximize2 size={16} style={{color: '#64748b', cursor: 'pointer'}} /></div>
                            </div>
                        </div>
                        <button className="btn btn-primary" style={{marginTop: '10px', backgroundColor: '#e32b4c', color: '#fff', padding: '6px 16px', borderRadius: '4px', fontWeight: 600}} onClick={postNote}>Gửi</button>
                    </div>
                  </div>
                  
                  <div className="chatter-messages" style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                    {chatterMessages.filter(msg => msg.type === 'log' && msg.bg === '#fef3c7').map(msg => (
                      <div key={msg.id} className="message-item" style={{display: 'flex', gap: '12px'}}>
                        <div className="message-avatar" style={{width: '32px', height: '32px', backgroundColor: '#94a3b8'}}>{msg.author[0]}</div>
                        <div className="message-content-wrapper">
                          <div className="message-meta">
                              <strong>{msg.author}</strong> - {msg.time}
                          </div>
                          <div className="message-body log-note-body">
                            {msg.text}
                          </div>
                        </div>
                      </div>
                    ))}
                    {chatterMessages.filter(msg => msg.type === 'log' && msg.bg === '#fef3c7').length === 0 && (
                      <div style={{textAlign: 'center', color: '#94a3b8', fontStyle: 'italic'}}>Chưa có ghi chú nào</div>
                    )}
                  </div>
                </>
              ) : (
                <div className="history-table-wrapper" style={{background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden'}}>
                  <table style={{width: '100%', borderCollapse: 'collapse', fontSize: '13px'}}>
                    <thead>
                      <tr style={{background: '#f8fafc', borderBottom: '1px solid #e2e8f0'}}>
                        <th style={{textAlign: 'left', padding: '12px', color: '#64748b', fontWeight: 600}}>Người thao tác</th>
                        <th style={{textAlign: 'left', padding: '12px', color: '#64748b', fontWeight: 600}}>Thời gian</th>
                        <th style={{textAlign: 'left', padding: '12px', color: '#64748b', fontWeight: 600}}>Hoạt động / Thay đổi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {chatterMessages.filter(msg => msg.type === 'log' && msg.bg !== '#fef3c7').map(msg => (
                        <tr key={msg.id} style={{borderBottom: '1px solid #f1f5f9'}}>
                          <td style={{padding: '12px', fontWeight: 500, color: '#1e293b'}}>{msg.author}</td>
                          <td style={{padding: '12px', color: '#94a3b8'}}>{msg.time}</td>
                          <td style={{padding: '12px', color: '#475569'}}>{msg.text}</td>
                        </tr>
                      ))}
                      {chatterMessages.filter(msg => msg.type === 'log' && msg.bg !== '#fef3c7').length === 0 && (
                        <tr><td colSpan="3" style={{textAlign: 'center', padding: '30px', color: '#94a3b8'}}>Chưa có bản ghi lịch sử</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default OpportunityForm;
