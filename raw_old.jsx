/* eslint-disable react-hooks/purity */
/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Trash2, X, MessageSquare, ArrowDownToLine, FileEdit, FileText, Sliders, ChevronUp, ChevronDown, Smile, Paperclip, Maximize2, Activity } from 'lucide-react';
import './LeadForm.css';
import { mockStore } from '../utils/mockStore';

// --- MOCK DATA ---

const EMPLOYEES = ['Trß║ºn B (Bß║ín)', 'Nguyß╗àn V─ân A', 'L├¬ Thß╗ï C'];

const PROVINCES = [{ id: 'HN', name: 'H├á Nß╗Öi' }, { id: 'HCM', name: 'TP. Hß╗ô Ch├¡ Minh' }];
const DISTRICTS = {
  'HN': [{ id: 'CG', name: 'Quß║¡n Cß║ºu Giß║Ñy' }, { id: 'NTL', name: 'Quß║¡n Nam Tß╗½ Li├¬m' }],
  'HCM': [{ id: 'Q1', name: 'Quß║¡n 1' }, { id: 'TB', name: 'Quß║¡n T├ón B├¼nh' }]
};
const WARDS = {
  'CG': [{ id: 'DH', name: 'Ph╞░ß╗¥ng Dß╗ïch Vß╗ìng Hß║¡u' }, { id: 'MD', name: 'Ph╞░ß╗¥ng Mai Dß╗ïch' }],
  'NTL': [{ id: 'MD1', name: 'Ph╞░ß╗¥ng Mß╗╣ ─É├¼nh 1' }],
  'Q1': [{ id: 'BN', name: 'Ph╞░ß╗¥ng Bß║┐n Ngh├⌐' }],
  'TB': [{ id: 'P2', name: 'Ph╞░ß╗¥ng 2' }]
};

const SERVICE_VARIANTS = {
  'outsourcing': ['Dß╗ïch vß╗Ñ kiß╗âm so├ít hß╗ô s╞í KHCN', 'Dß╗ïch vß╗Ñ kiß╗âm so├ít hß╗ô s╞í KHDN', 'Dß╗ïch vß╗Ñ nhß║¡p liß╗çu'],
  'telesales': ['Telesales Inbound', 'Telesales Outbound'],
  'cskh': ['CSKH ─Éa k├¬nh', 'CSKH Ti├¬u chuß║⌐n']
};

const INITIAL_POSITIONS = [{ id: 'T─É', name: 'Tr╞░ß╗ƒng ─É├ái' }, { id: 'GD', name: 'Gi├ím ─Éß╗æc' }];
const INITIAL_PARTNERS = [
  { id: 'PN1', name: 'Azure Interior', phone: '+58 212 6...', email: 'vauxoo@yourcompany', city: 'Fremont', country: 'United States', level: 'Silver' },
  { id: 'PN2', name: 'Gemini Furniture', phone: '+1 312 34...', email: 'john.b@tech.info', city: 'Fairfield', country: 'United States', level: 'Silver' },
  { id: 'PN3', name: 'Lumber Inc', phone: '(828)-316...', email: 'lumber@example.com', city: 'Stockton', country: 'United States', level: 'Gold' },
  { id: 'PN4', name: 'Ready Mat', phone: '(803)-873...', email: 'info@deltapc.com', city: 'Tracy', country: 'United States', level: 'Bronze' },
  { id: 'PN5', name: 'The Jackson Group', phone: '(334)-502...', email: 'jackson@group.com', city: 'Tracy', country: 'United States', level: 'Gold' },
  { id: 'PN6', name: 'Wood Corner', phone: '(623)-853...', email: 'bhu@ic.example.com', city: 'Turlock', country: 'United States', level: 'Gold' },
];

const INITIAL_CONTACTS_DB = [
  { id: 'CT1', name: 'Nguyß╗àn V─ân ─Éß╗ïnh', phone: '0901234567', email: 'dinh.nv@vcb.com.vn', positionId: 'T─É', active: true },
  { id: 'CT2', name: 'L├¬ Minh Tr├¡', phone: '0987654321', email: 'tri.lm@vingroup.net', positionId: 'GD', active: true },
  { id: 'CT3', name: 'Phß║ím Hß╗ông Th├íi', phone: '0912345678', email: 'thai.ph@fsoft.com.vn', positionId: 'GD', active: false }
];

const INITIAL_FORM_STATE = {
  leadName: '', probability: 10,
  projectType: '',
  projectedService: '',
  contactDate: new Date().toISOString().split('T')[0],
  issueMonth: '',
  addressDetail: '', province: '', district: '', ward: '',
  logicLeadLost: false,
  leadTag: '',
};

// --- MAIN COMPONENT ---
const OpportunityForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // TABS
  const [activeNotebookTab, setActiveNotebookTab] = useState('internal_notes');
  const [activeChatterTab, setActiveChatterTab] = useState('log_note');

  // FORM DATA (Flatten basic fields for easy tracking)
  const [formData, setFormData] = useState({ ...INITIAL_FORM_STATE });
  const [selectedExpectedServices, setSelectedExpectedServices] = useState([]);
  const [snapshotData, setSnapshotData] = useState({ ...INITIAL_FORM_STATE });

  // COMPLEX DATA LISTS
  const [serviceDetails, setServiceDetails] = useState([]);
  const [snapshotServices, setSnapshotServices] = useState([]);

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
  const [activityTypes, setActivityTypes] = useState(['Email', 'Gß╗ìi ─æiß╗çn', 'Hß╗Öi hß╗ìp', 'Viß╗çc cß║ºn l├ám']);
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
  const projectTypeRef = useRef(null);
  const clientRef = useRef(null);
  const domainRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [lostReason, setLostReason] = useState('');
  const [lostDesc, setLostDesc] = useState('');

  const [leadStatus, setLeadStatus] = useState('Mß╗¢i');
  const isAdvancedStage = leadStatus !== '─Éang tiß║┐p x├║c' && leadStatus !== 'Mß╗¢i';
  const isDisabled = leadStatus !== 'Mß╗¢i';
  const [pakdCount, setPakdCount] = useState(0);
  const [quoteCount, setQuoteCount] = useState(0);
  const [attachmentFiles, setAttachmentFiles] = useState([]);
  const [newAttachmentType, setNewAttachmentType] = useState('B├ío gi├í');

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
    const headers = ['Opportunity ID', 'T├¬n Opportunity', 'T├¬n kh├ích h├áng', 'MST', 'Contact Name', 'Email'];
    const rows = processedSimilarOpps.map(opp => {
      return [opp.id, `"${opp.content}"`, `"${opp.company}"`, opp.mst, opp.contactName || '', opp.email || ''];
    });

    let csvContent = "data:text/csv;charset=utf-8,\uFEFF" + headers.join(",") + "\\n" + rows.map(e => e.join(",")).join("\\n");
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
      case 'Mß╗¢i': return ['─Éang tiß║┐p x├║c', 'Thß║Ñt bß║íi'];
      case '─Éang tiß║┐p x├║c': return ['─É├ính gi├í nhu cß║ºu', 'Thß║Ñt bß║íi'];
      case '─É├ính gi├í nhu cß║ºu': return ['─Éang b├ío gi├í', 'Thß║Ñt bß║íi'];
      case '─Éang b├ío gi├í': return ['─Éß║Ñu thß║ºu', 'POC', 'Th├ánh c├┤ng', 'Thß║Ñt bß║íi'];
      case '─Éß║Ñu thß║ºu': return ['Th├ánh c├┤ng', 'Thß║Ñt bß║íi'];
      case 'POC': return ['Th├ánh c├┤ng', 'Thß║Ñt bß║íi'];
      case 'Th├ánh c├┤ng': return ['Thß║Ñt bß║íi'];
      case 'Thß║Ñt bß║íi': return [];
      default: return ['Thß║Ñt bß║íi'];
    }
  };

  // LOAD EXISTING LEAD
  useEffect(() => {
    if (id) {
      const task = mockStore.getOpp(id);
      if (task) {
        setFormData(prev => ({
          ...prev,
          leadName: task.content || '',
          projectedService: task.projectedService === 'Kiß╗âm so├ít / Nhß║¡p liß╗çu' ? 'outsourcing' :
            task.projectedService === 'Ch─âm s├│c kh├ích h├áng' ? 'cskh' :
              task.projectedService === 'Telesales' ? 'telesales' : '',
          probability: parseInt(task.probability) || 0,
        }));
        setSelectedClient({ id: 'dummy', name: task.company, type: task.tags?.find(t => t.text === 'Doanh nghiß╗çp') ? 'Doanh nghiß╗çp' : 'Nß╗Öi bß╗Ö', mst: task.mst, phone: '', addr: '', domain: '' });
        setClientSearch(task.company || '');
        setClientAbbr(task.id ? task.id.split('-')[0] : '');
        setMstValue(task.mst || '');
        setLeadStatus(task.status || '─Éang tiß║┐p x├║c');
        const count = parseInt(task.attachments) || 0;
        setAttachmentFiles(Array(count).fill().map((_, i) => ({
          id: i,
          name: `T├ái liß╗çu ${i + 1}.pdf`,
          type: 'Kh├íc'
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
    // Variant reset if service changes
    if (field === 'projectedService') {
      if (serviceDetails.length > 0) {
        setServiceDetails(serviceDetails.map(s => ({ ...s, variant: '' })));
      }
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
    const trProjectedService = selectedExpectedServices.length > 0 ? 'yes' : '';

    if (!trLeadName) newErrors.leadName = 'Vui l├▓ng nhß║¡p t├¬n Opportunity';
    if (!trClientAbbr) newErrors.clientAbbr = 'Vui l├▓ng nhß║¡p t├¬n viß║┐t tß║»t';
    if (!trClientSearch) newErrors.clientSearch = 'Vui l├▓ng nhß║¡p t├¬n ─æß║ºy ─æß╗º kh├ích h├áng';
    if (!trDomain) newErrors.domain = 'Vui l├▓ng nhß║¡p l─⌐nh vß╗▒c';

    if (isAdvancedStage) {
      if (!formData.projectType) newErrors.projectType = 'Vui l├▓ng chß╗ìn loß║íi dß╗▒ ├ín';
      if (!trProjectedService) newErrors.projectedService = 'Vui l├▓ng chß╗ìn dß╗ïch vß╗Ñ dß╗▒ kiß║┐n';
      if (!mstValue.trim()) newErrors.mst = 'Vui l├▓ng nhß║¡p M├ú sß╗æ thuß║┐';
      if (!classificationValue) newErrors.classification = 'Vui l├▓ng chß╗ìn ph├ón loß║íi';
    }

    if (contacts.length > 0) {
      contacts.forEach(c => {
        if (c.phone) {
          const rawPhone = c.phone.replace(/[^0-9]/g, '');
          if (rawPhone.length > 15) newErrors.contactPhone = 'Sß╗æ ─æiß╗çn thoß║íi kh├┤ng qu├í 15 k├╜ tß╗▒.';
        }
        if (c.email) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(c.email) || c.email.length > 318) newErrors.contactEmail = 'Email ch╞░a ─æ├║ng ─æß╗ïnh dß║íng hoß║╖c qu├í d├ái.';
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
        changes.push(`─É├ú ─æß╗òi [${key}]: tß╗½ '${snapshotData[key]}' th├ánh '${formData[key]}'`);
      }
    });

    if (!id) {
      addChatterMessage('log', 'Hß╗ç', 'Tß║ío mß╗¢i th├ánh c├┤ng lead/opportunity', 'vß╗½a xong', '#dcfce7');
    } else if (changes.length > 0) {
      const logText = `Cß║¡p nhß║¡t th├┤ng tin th├ánh c├┤ng:
` + changes.map(c => `- ${c}`).join('\\n');
      addChatterMessage('log', 'Hß╗ç', logText, 'vß╗½a xong', '#fef3c7');
    }

    // New Snapshot
    setSnapshotData({ ...formData });
    setSnapshotContacts([...contacts]);
    setSnapshotServices([...serviceDetails]);

    // Save to global Mock Store
    const isNew = !id || id === 'new';
    const finalStatus = isNew ? 'Mß╗¢i' : leadStatus;
    const newId = (id && id !== 'new') ? id : mockStore.getNextOppId(clientAbbr || 'OPP');

    const mappedService = formData.projectedService === 'outsourcing' ? 'Kiß╗âm so├ít / Nhß║¡p liß╗çu' :
      formData.projectedService === 'telesales' ? 'Telesales' :
        formData.projectedService === 'cskh' ? 'Ch─âm s├│c kh├ích h├áng' : '';

    const leadData = {
      id: newId,
      content: formData.leadName,
      company: clientSearch,
      mst: mstValue,
      projectedService: mappedService,
      probability: `${formData.probability}%`,
      status: finalStatus,
      tags: selectedClient?.type === 'Doanh nghiß╗çp' ? [{ text: 'Doanh nghiß╗çp', color: '#dcfce7', textCol: '#166534' }] : [{ text: 'Nß╗Öi bß╗Ö', color: '#e0e7ff', textCol: '#3730a3' }],
      revenue: '0 Γé½',
      salesperson: 'Trß║ºn B',
      date: new Date().toLocaleDateString('vi-VN'),
      attachments: attachmentFiles.length,
      comments: 0,
      avatars: [],
      activity: null,
      chatterMessages: chatterMessages
    };

    mockStore.saveOpp(newId, leadData);

    showToast(`─É├ú l╞░u dß╗» liß╗çu Opportunity ${isNew ? 'mß╗¢i ' : ''}th├ánh c├┤ng!`, 'success');
    if (isNew) {
      navigate(`/opportunity/edit/${newId}`, { replace: true });
    }
  };

  const revertChanges = () => {
    setFormData({ ...snapshotData });
    setContacts([...snapshotContacts]);
    setServiceDetails([...snapshotServices]);
    showToast('─É├ú phß╗Ñc hß╗ôi dß╗» liß╗çu ban ─æß║ºu!', 'success');
  };

  // -------------------------
  // LOST / RESTORE LOGIC
  // -------------------------
  const handleLostConfirm = () => {
    setLeadStatus('Thß║Ñt bß║íi');
    if (id) mockStore.updateOppStatus(id, 'Thß║Ñt bß║íi');
    addChatterMessage('log', 'Hß╗ç', `─É├ính dß║Ñu nh├ún: THß║ñT Bß║áI
L├╜ do: ${lostReason}
M├┤ tß║ú: ${lostDesc}`, 'just now', '#fee2e2');
    closeSearchModal();
  };

  const handleRestore = () => {
    setLeadStatus('─Éang tiß║┐p x├║c');
    if (id) mockStore.updateOppStatus(id, '─Éang tiß║┐p x├║c');
    addChatterMessage('log', 'Hß╗ç', '─É├ú kh├┤i phß╗Ñc Opportunity vß╗ü ─Éang tiß║┐p x├║c', 'just now', '#dcfce7');
  };

  const handleStatusChange = (newStatus) => {
    if (leadStatus === '─Éang tiß║┐p x├║c' && newStatus === '─É├ính gi├í nhu cß║ºu') {
      if (!mstValue.trim() || !formData.projectType || selectedExpectedServices.length === 0) {
        showToast('Vui l├▓ng ─æiß╗ün Loß║íi dß╗▒ ├ín, Dß╗ïch vß╗Ñ dß╗▒ kiß║┐n v├á MST khi chuyß╗ân sang ─É├ính gi├í nhu cß║ºu!', 'error');
        return;
      }
    }

    if (leadStatus === '─É├ính gi├í nhu cß║ºu' && newStatus === '─Éang b├ío gi├í' && attachmentFiles.length === 0) {
      showToast('Y├¬u cß║ºu upload tß╗æi thiß╗âu 1 t├ái liß╗çu ß╗ƒ phß║ºn Th├┤ng tin chung tr╞░ß╗¢c khi chuyß╗ân sang ─Éang b├ío gi├í.', 'error');
      return;
    }

    if (newStatus === 'Th├ánh c├┤ng') {
      const matchingCustomers = mockStore.getAllCustomers().filter(c => c.mst === mstValue);
      if (matchingCustomers.length > 0) {
        setCustomerMatchData(matchingCustomers[0]);
        openSearchModal('customer_compare');
        return;
      } else {
        mockStore.addCustomer({
          name: clientSearch, shortName: clientAbbr, mst: mstValue, type: selectedClient?.type || 'Doanh nghiß╗çp',
          contactName: contacts.length > 0 ? contacts[0].name : '', email: contacts.length > 0 ? contacts[0].email : '',
          phone: contacts.length > 0 ? contacts[0].phone : '', address: `${formData.ward || ''}, ${formData.district || ''}, ${formData.province || ''}`,
          domain: domainValue, projectType: formData.projectType, source: 'Opportunity', status: 'Active'
        });
        showToast('─É├ú tß╗▒ ─æß╗Öng tß║ío mß╗¢i Kh├ích h├áng do kh├┤ng ph├ít hiß╗çn tr├╣ng MST.', 'success');
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
    addChatterMessage('log', 'Hß╗ç', `Chuyß╗ân trß║íng th├íi sang: ${newStatus}`, 'just now', '#e0e7ff');
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

  const addServiceLine = () => setServiceDetails([...serviceDetails, { id: Date.now(), variant: '', qty: 1, price: '' }]);
  const removeService = (id) => setServiceDetails(serviceDetails.filter(s => s.id !== id));
  const updateService = (id, field, val) => setServiceDetails(serviceDetails.map(s => s.id === id ? { ...s, [field]: val } : s));

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
    return sum === 0 ? '0 Γé½' : sum.toLocaleString('vi-VN') + ' Γé½';
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
    addChatterMessage('log', 'Bß║ín', chatterInput, 'vß╗½a xong', '#fef3c7');
    setChatterInput('');
  };

  const createActivity = () => {
    openSearchModal('activity');
  };

  const markActivityDone = (id) => {
    const act = activities.find(a => a.id === id);
    setActivities(activities.filter(a => a.id !== id));
    addChatterMessage('log', 'Bß║ín', `Hoß║ít ─æß╗Öng ho├án tß║Ñt (Done): ${act?.title}`, 'vß╗½a xong', '#dcfce7');
  };

  // Helpers mappings
  const availableVariants = formData.projectedService ? (SERVICE_VARIANTS[formData.projectedService] || []) : [];
  const distOptions = formData.province ? (DISTRICTS[formData.province] || []) : [];
  const wardOptions = formData.district ? (WARDS[formData.district] || []) : [];

  if (viewingSimilarOpps) {
    return (
      <div className="lead-form-container" style={{ backgroundColor: '#f8fafc', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button className="btn btn-secondary" onClick={() => setViewingSimilarOpps(false)} style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '4px' }}>
              <span style={{ fontSize: '16px' }}>≡ƒöÖ</span> Quay lß║íi
            </button>
            <h3 style={{ margin: 0, fontSize: '16px', color: '#1e293b' }}>Danh s├ích lead/opportunity chung MST ({mstValue}): {similarOpps.length} thß║╗</h3>
          </div>
          <div></div>
        </div>

        <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ position: 'relative', width: '320px', display: 'flex' }}>
            <svg style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input type="text" placeholder="T├¼m kiß║┐m tß╗▒ do..." style={{ width: '100%', padding: '10px 16px 10px 44px', border: '1px solid #cbd5e1', borderRadius: '12px', fontSize: '15px', color: '#64748b', outline: 'none', background: 'white' }} value={similarSearchInput} onChange={e => setSimilarSearchInput(e.target.value)} />
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
                    { key: 'content', label: 'T├¬n Opportunity' },
                    { key: 'company', label: 'T├¬n kh├ích h├áng' },
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
                  <tr><td colSpan="7" style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>Kh├┤ng c├│ lead/opportunity t╞░╞íng ─æß╗ông n├áo.</td></tr>
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
          <span style={{ color: toast.type === 'error' ? '#ef4444' : '#22c55e', fontWeight: 'bold' }}>{toast.type === 'error' ? '!' : 'Γ£ô'}</span>
          <span style={{ color: '#0f172a', fontSize: '14px', fontWeight: 500 }}>{toast.message}</span>
        </div>
      )}

      {/* HEADER */}
      {/* HEADER */}
      <div className="lead-form-header" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="breadcrumb">
          <span className="breadcrumb-item" onClick={() => navigate('/opportunity')}>Danh s├ích Lead/Opportunity</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{id && id !== 'new' ? id : 'Mß╗¢i'}</span>
        </div>
        <div className="header-actions" style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
           {leadStatus !== 'Thß║Ñt bß║íi' && id && id !== 'new' && <button className="btn btn-danger" style={{padding: '6px 16px', fontSize: '13px', backgroundColor: '#e32b4c', borderColor: '#e32b4c', color: 'white'}} onClick={() => openSearchModal('lost_reason')}>Thß║Ñt bß║íi</button>}
           
           <div style={{width: '1px', height: '20px', background: '#cbd5e1', margin: '0 4px'}}></div>

           {leadStatus === 'Mß╗¢i' && (
             <button className="btn btn-secondary" style={{padding: '6px 10px', backgroundColor: 'white', color: '#475569', display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1'}} onClick={() => {
                if (window.confirm('Bß║ín c├│ chß║»c chß║»n muß╗æn x├│a bß║ún ghi n├áy?')) {
                  mockStore.deleteOpp(id);
                  navigate('/opportunity');
                }
             }} title="X├│a">
               <Trash2 size={16} />
             </button>
           )}
           {leadStatus === 'Mß╗¢i' && (
             <button className="btn btn-primary" style={{padding: '6px 16px', fontSize: '13px', backgroundColor: '#e32b4c', borderColor: '#e32b4c', color: 'white'}} onClick={commitSave}>L╞░u</button>
           )}
        </div>
      </div>

      <div className="form-chatter-wrapper">

        <div className="lead-form-sheet sheet-inner-wrapper">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div className="oe_button_box" style={{ marginBottom: 0 }}>
              {/* N├║t PAKD ─æ├ú bß╗ï ß║⌐n ho├án to├án theo y├¬u cß║ºu */}
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
              {['Mß╗¢i', '─Éang tiß║┐p x├║c', '─É├ính gi├í nhu cß║ºu', '─Éang b├ío gi├í', '─Éß║Ñu thß║ºu', 'POC', 'Th├ánh c├┤ng', 'Thß║Ñt bß║íi'].map((st) => {
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

          {leadStatus === 'Thß║Ñt bß║íi' && (
            <div className="ribbon-wrapper">
              <div className="ribbon">THß║ñT Bß║áI</div>
            </div>
          )}
          {leadStatus === 'Th├ánh c├┤ng' && (
            <div className="ribbon-wrapper">
              <div className="ribbon" style={{ background: '#10B981' }}>TH├ÇNH C├öNG</div>
            </div>
          )}

          <fieldset disabled={isDisabled} style={{ border: 'none', margin: 0, padding: 0 }}>
            <div className="sheet-title-section">
              <div className="oe_title">
                <label>T├¬n Lead/Opportunity <span style={{ color: 'red' }}>*</span></label>
                <input type="text" ref={nameRef} className={`title-input ${errors.leadName ? 'has-error' : ''}`} placeholder="e.g. N├óng cß║Ñp hß╗ç thß╗æng ERP" value={formData.leadName} onChange={e => { hf('leadName', e.target.value); setErrors(p => ({ ...p, leadName: false })) }} style={{ borderColor: errors.leadName ? 'red' : undefined }} />
                {errors.leadName && <small style={{ color: 'red', fontWeight: 500 }}>Tr╞░ß╗¥ng n├áy l├á bß║»t buß╗Öc</small>}
              </div>
              <div className="probability-box">
                <label>Probability (%)</label>
                <input type="number" className="prob-input" value={formData.probability} onChange={e => hf('probability', e.target.value)} />
              </div>
            </div>

            <div className="form-blocks-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* L COLUMN */}
              <div className="form-card" style={{ width: "100%" }}>
                <div className="column-title-modern" style={{ margin: '0 0 12px 0', padding: '0 0 8px 0', lineHeight: 1 }}>Th├┤ng tin chung</div>
                {id && (
                  <div className="form-group">
                    <label className="form-label">ID</label>
                    <input type="text" className="form-control" readOnly value={id} />
                  </div>
                )}

                <div className="form-group" style={{ alignItems: 'flex-start' }}>
                  <label className="form-label" style={{ marginTop: '6px' }}>Loß║íi dß╗▒ ├ín {isAdvancedStage && <span style={{ color: 'red' }}>*</span>}</label>
                  <div style={{ flex: 1 }}>
                    <select ref={projectTypeRef} className="form-control" style={{ borderColor: errors.projectType ? 'red' : undefined, width: '100%' }} value={formData.projectType} onChange={e => { hf('projectType', e.target.value); setSelectedExpectedServices([]); setErrors(p => ({ ...p, projectType: false })) }}>
                      <option value="">-- Chß╗ìn loß║íi --</option>
                      <option value="service">Dß╗ïch vß╗Ñ</option>
                      <option value="solution">Giß║úi ph├íp</option>
                    </select>
                    {errors.projectType && <small style={{ color: 'red', display: 'block', marginTop: '4px', fontWeight: 500 }}>Tr╞░ß╗¥ng n├áy l├á bß║»t buß╗Öc</small>}
                  </div>
                </div>

                <div className="form-group" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                  <label className="form-label" style={{ width: '100%', marginBottom: '8px' }}>Dß╗ïch vß╗Ñ dß╗▒ kiß║┐n {isAdvancedStage && <span style={{ color: 'red' }}>*</span>}</label>
                  
                  <div style={{ width: '100%', display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <select className="form-control" style={{ flex: 1, borderColor: errors.projectedService ? 'red' : undefined }} value="" onChange={e => {
                      const val = e.target.value;
                      if (val && !selectedExpectedServices.some(s => s.name === val)) {
                        setSelectedExpectedServices([...selectedExpectedServices, { id: Date.now(), name: val, description: '' }]);
                        setErrors(p => ({ ...p, projectedService: false }));
                      }
                    }}>
                      <option value="">-- Chß╗ìn dß╗ïch vß╗Ñ ─æß╗â th├¬m --</option>
                      {formData.projectType === 'service' && ['Customer Experience (CX)', 'BPO', 'Loyalty', 'Contact Center Outsourcing', 'Upsale', 'Warranty & Repair Services'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      {formData.projectType === 'solution' && ['OmniX', 'KnowX Hub', 'WorkforceX', 'CXBot', 'vCOC', 'InsightCI'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                  {errors.projectedService && <small style={{ color: 'red', display: 'block', marginBottom: '8px', fontWeight: 500 }}>Tr╞░ß╗¥ng n├áy l├á bß║»t buß╗Öc</small>}
                  
                  {selectedExpectedServices.length > 0 && (
                    <div style={{ width: '100%', border: '1px solid #e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                        <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                          <tr>
                            <th style={{ padding: '8px', textAlign: 'left', fontWeight: 600 }}>T├¬n dß╗ïch vß╗Ñ</th>
                            <th style={{ padding: '8px', textAlign: 'left', fontWeight: 600 }}>Giß║úi ph├íp VCX</th>
                            <th style={{ padding: '8px', textAlign: 'left', fontWeight: 600 }}>M├┤ tß║ú th├¬m</th>
                            <th style={{ padding: '8px', textAlign: 'center', width: '40px' }}></th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedExpectedServices.map(srv => (
                            <tr style={{ borderBottom: '1px solid #f1f5f9' }} key={srv.id}>
                              <td style={{ padding: '8px', fontWeight: 500, color: '#334155' }}>{srv.name}</td>
                              <td style={{ padding: '4px 8px' }}>
                                <input type="text" className="form-control" style={{ width: '100%', border: '1px solid #cbd5e1', padding: '4px 8px', borderRadius: '4px' }} placeholder="Nhß║¡p giß║úi ph├íp..." value={srv.vcxSolution || ''} onChange={e => setSelectedExpectedServices(prev => prev.map(s => s.id === srv.id ? { ...s, vcxSolution: e.target.value } : s))} />
                              </td>
                              <td style={{ padding: '4px 8px' }}>
                                <input type="text" className="form-control" style={{ width: '100%', border: '1px solid #cbd5e1', padding: '4px 8px', borderRadius: '4px' }} placeholder="Nhß║¡p m├┤ tß║ú..." value={srv.description} onChange={e => setSelectedExpectedServices(prev => prev.map(s => s.id === srv.id ? { ...s, description: e.target.value } : s))} />
                              </td>
                              <td style={{ padding: '8px', textAlign: 'center' }}>
                                <button className="icon-btn" onClick={() => setSelectedExpectedServices(prev => prev.filter(s => s.id !== srv.id))}><Trash2 size={16} /></button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>


                <div className="form-group">
                  <label className="form-label">Doanh thu dß╗▒ kiß║┐n</label>
                  <input type="text" className="form-control" placeholder="0 Γé½" />
                </div>
                <div className="form-group">
                  <label className="form-label">─Éß╗Ö ╞░u ti├¬n</label>
                  <select className="form-control" value={formData.priority || '1'} onChange={e => hf('priority', e.target.value)}>
                    <option value="1">Γ¡É Thß║Ñp</option>
                    <option value="2">Γ¡ÉΓ¡É Trung b├¼nh</option>
                    <option value="3">Γ¡ÉΓ¡ÉΓ¡É Cao</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Tag Lead</label>
                  <select className="form-control" value={formData.leadTag || ''} onChange={e => hf('leadTag', e.target.value)}>
                    <option value="">-- Chß╗ìn tag --</option>
                    <option value="Lead mß╗¢i">Lead mß╗¢i</option>
                    <option value="Lead ─æang quan t├óm">Lead ─æang quan t├óm</option>
                    <option value="Lead tiß╗üm n─âng">Lead tiß╗üm n─âng</option>
                    <option value="Lead lß║ính">Lead lß║ính</option>
                  </select>
                </div>
                <div className="form-group" style={{ border: 'none' }}>
                  <label className="form-label" style={{ width: '100px', minWidth: '100px', fontSize: '13px' }}>Loß║íi t├ái liß╗çu</label>
                  <select className="form-control" style={{ flex: 1, fontSize: '13px' }} value={newAttachmentType} onChange={e => setNewAttachmentType(e.target.value)}>
                    <option value="B├ío gi├í">B├ío gi├í</option>
                    <option value="Hß╗úp ─æß╗ông">Hß╗úp ─æß╗ông</option>
                    <option value="T├ái liß╗çu kß╗╣ thuß║¡t">T├ái liß╗çu kß╗╣ thuß║¡t</option>
                    <option value="Kh├íc">Kh├íc</option>
                  </select>
                </div>
                <div className="form-group" style={{ border: 'none', marginTop: '12px' }}>
                  <label className="form-label" style={{ width: '100px', minWidth: '100px', fontSize: '13px' }}>Tß║úi l├¬n</label>
                  <label className="btn btn-secondary" style={{ cursor: 'pointer', padding: '4px 10px', fontSize: '12px' }}>
                    Chß╗ìn File
                    <input type="file" multiple style={{ display: 'none' }} onChange={(e) => {
                      const files = Array.from(e.target.files);
                      let hasError = false;
                      const newAtts = files.map(f => {
                        if (f.size > 20 * 1024 * 1024) hasError = true;
                        return {
                          id: Date.now() + Math.random(),
                          name: f.name,
                          type: newAttachmentType,
                          size: f.size
                        };
                      });
                      if (hasError) {
                        // Assuming showToast is available in scope
                        if (typeof showToast === 'function') showToast('Mß╗Öt sß╗æ file v╞░ß╗út qu├í dung l╞░ß╗úng tß╗æi ─æa 20MB.', 'error');
                      } else {
                        if (newAtts.length > 0) setAttachmentFiles([...attachmentFiles, ...newAtts]);
                      }
                      e.target.value = '';
                    }} />
                  </label>
                </div>
                {attachmentFiles.length > 0 && (
                  <div style={{ border: '1px solid #e2e8f0', borderRadius: '4px', overflow: 'hidden', marginTop: '8px' }}>
                    <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse' }}>
                      <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        <tr>
                          <th style={{ padding: '6px 8px', textAlign: 'left', fontWeight: 600 }}>Loß║íi</th>
                          <th style={{ padding: '6px 8px', textAlign: 'left', fontWeight: 600 }}>T├¬n tß╗çp</th>
                          <th style={{ padding: '6px 8px', textAlign: 'center', width: '40px' }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {attachmentFiles.map(file => (
                          <tr key={file.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '6px 8px' }}>
                              <span style={{ background: '#e2e8f0', padding: '2px 6px', borderRadius: '4px', fontSize: '11px' }}>{file.type}</span>
                            </td>
                            <td style={{ padding: '6px 8px', color: '#2563eb' }}>{file.name}</td>
                            <td style={{ padding: '6px 8px', textAlign: 'center' }}>
                              <button title="X├│a" style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 0 }} onClick={() => setAttachmentFiles(prev => prev.filter(f => f.id !== file.id))}>
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* R COLUMN */}
              <div className="form-card" style={{ width: "100%" }}>
                <div className="column-title-modern" style={{ margin: '0 0 12px 0', padding: '0 0 8px 0', lineHeight: 1 }}>Th├┤ng tin kh├ích h├áng</div>

                <div className="form-group" style={{ alignItems: 'flex-start' }}>
                  <label className="form-label" style={{ marginTop: '6px' }}>T├¬n kh├ích h├áng <span style={{ color: 'red' }}>*</span></label>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div className="autocomplete-container">
                      <input
                        ref={clientRef}
                        type="text"
                        className="form-control"
                        placeholder="T├¬n ─æß║ºy ─æß╗º *"
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
                            <div className="dropdown-item" style={{ color: '#94a3b8' }}>Kh├┤ng t├¼m thß║Ñy. Nhß║¡p th├┤ng tin thß╗º c├┤ng.</div>
                          )}
                        </div>
                      )}
                    </div>
                    {errors.clientSearch && <small style={{ color: 'red', fontWeight: 500 }}>Vui l├▓ng nhß║¡p t├¬n ─æß║ºy ─æß╗º kh├ích h├áng</small>}
                  </div>
                </div>

                <div className="form-group" style={{ alignItems: 'flex-start' }}>
                  <label className="form-label" style={{ marginTop: '6px' }}>T├¬n viß║┐t tß║»t KH <span style={{ color: 'red' }}>*</span></label>
                  <div style={{ flex: 1 }}>
                    <input type="text" className={`form-control focus-ring ${errors.clientAbbr ? 'has-error' : ''}`} style={{ borderColor: errors.clientAbbr ? 'red' : undefined, width: '100%' }} value={clientAbbr} onChange={e => { setClientAbbr(e.target.value); setErrors(p => ({ ...p, clientAbbr: false })) }} />
                    {errors.clientAbbr && <small style={{ color: 'red', display: 'block', marginTop: '4px', fontWeight: 500 }}>{errors.clientAbbr}</small>}
                  </div>
                </div>

                <div className="form-group" style={{ alignItems: 'flex-start' }}>
                  <label className="form-label" style={{ marginTop: '6px' }}>MST</label>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <input type="text" ref={mstRef} className="form-control" style={{ borderColor: errors.mstValue ? 'red' : undefined, width: '100%', paddingRight: !mstValue ? '28px' : '12px' }} placeholder="M├ú sß╗æ thuß║┐" value={mstValue} onChange={(e) => { setMstValue(e.target.value); setErrors(p => ({ ...p, mstValue: false })) }} />
                      {!mstValue && (
                        <span style={{ color: '#e32b4c', fontWeight: 'bold', marginLeft: '-20px', cursor: 'help', fontSize: '14px', zIndex: 10 }} title="Vui l├▓ng nhß║¡p m├ú sß╗æ thuß║┐ ─æß╗â biß║┐t c├│ bao nhi├¬u opportunity t╞░╞íng ─æß╗ông">!</span>
                      )}
                    </div>
                    {errors.mstValue && <small style={{ color: 'red', display: 'block', marginTop: '4px', fontWeight: 500 }}>Tr╞░ß╗¥ng n├áy l├á bß║»t buß╗Öc khi chuyß╗ân trß║íng th├íi</small>}
                  </div>
                </div>

                <div className="form-group" style={{ alignItems: 'flex-start' }}>
                  <label className="form-label" style={{ marginTop: '6px' }}>Ph├ón loß║íi {isAdvancedStage && <span style={{ color: 'red' }}>*</span>}</label>
                  <div style={{ flex: 1 }}>
                    <select className={`form-control ${errors.classification ? 'has-error' : ''}`} style={{ width: '100%', borderColor: errors.classification ? 'red' : undefined }} value={classificationValue} onChange={e => { setClassificationValue(e.target.value); setErrors(p => ({ ...p, classification: false })) }}>
                      <option value="">-- Chß╗ìn ph├ón loß║íi --</option>
                      <option value="Doanh nghiß╗çp">Doanh nghiß╗çp</option>
                      <option value="Nß╗Öi bß╗Ö">Nß╗Öi bß╗Ö</option>
                    </select>
                  </div>
                </div>

                <div className="form-group" style={{ alignItems: 'flex-start' }}>
                  <label className="form-label" style={{ marginTop: '6px' }}>L─⌐nh vß╗▒c <span style={{ color: 'red' }}>*</span></label>
                  <div style={{ flex: 1 }}>
                    <select ref={domainRef} className="form-control" style={{ borderColor: errors.domainValue ? 'red' : undefined, width: '100%' }} value={domainValue} onChange={e => { setDomainValue(e.target.value); setErrors(p => ({ ...p, domainValue: false })) }}>
                      <option value="">-- Chß╗ìn l─⌐nh vß╗▒c --</option>
                      <option value="Bß║Ñt ─æß╗Öng sß║ún">Bß║Ñt ─æß╗Öng sß║ún</option>
                      <option value="T├ái ch├¡nh">T├ái ch├¡nh</option>
                      <option value="CNTT / Viß╗àn th├┤ng">CNTT / Viß╗àn th├┤ng</option>
                      <option value="F&B">F&B</option>
                    </select>
                    {errors.domainValue && <small style={{ color: 'red', display: 'block', marginTop: '4px', fontWeight: 500 }}>Tr╞░ß╗¥ng n├áy l├á bß║»t buß╗Öc</small>}
                  </div>
                </div>

                {/* CUSTOM ADDRESS */}
                <div className="form-group" style={{ alignItems: 'flex-start' }}>
                  <label className="form-label" style={{ paddingTop: '6px' }}>─Éß╗ïa chß╗ë</label>
                  <div className="address-grid">
                    <input type="text" className="form-control" style={{ width: '100%' }} placeholder="─Éß╗ïa chß╗ë chi tiß║┐t (nh├á, ng├╡...)" value={formData.addressDetail} onChange={e => hf('addressDetail', e.target.value)} />
                    <div className="address-location-row">
                      <select className="form-control" value={formData.province} onChange={e => hf('province', e.target.value)}>
                        <option value="">Tß╗ënh/TP</option>
                        {PROVINCES.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                      <select className="form-control" value={formData.district} onChange={e => hf('district', e.target.value)} disabled={!formData.province}>
                        <option value="">Quß║¡n/Huyß╗çn</option>
                        {distOptions.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                      </select>
                      <select className="form-control" value={formData.ward} onChange={e => hf('ward', e.target.value)} disabled={!formData.district}>
                        <option value="">Ph╞░ß╗¥ng/X├ú</option>
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
                    <option value="">-- Chß╗ìn tag --</option>
                    <option value="doanhnghiep">Doanh nghiß╗çp</option>
                    <option value="noibo">Nß╗Öi bß╗Ö</option>
                    <option value="vip">Kh├ích h├áng VIP</option>
                    <option value="tiemnang">Kh├ích h├áng Tiß╗üm n─âng</option>
                  </select>
                </div>

                {/* TH├öNG TIN LI├èN Hß╗å */}
                {/* TH├öNG TIN LI├èN Hß╗å */}
                <div className="contact-info-list" style={{ marginTop: '16px' }}>
                  <label className="form-label" style={{ width: '100%', marginBottom: '8px', display: 'block' }}>Li├¬n hß╗ç kh├ích h├áng</label>
                  <div className="contact-info-box" style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'visible' }}>
                    <div className="contact-item" style={{ fontWeight: 600, borderBottom: '2px solid #e2e8f0', padding: '12px 16px', background: '#f8fafc', margin: 0 }}>
                      <span>T├¬n</span><span>S─ÉT</span><span>Email</span><span>Vß╗ï tr├¡</span><span style={{ textAlign: 'center' }}>TT</span><span></span>
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
                                placeholder="-- T├¬n li├¬n hß╗ç --"
                                value={contact.name || ''}
                                onChange={(e) => {
                                  updateContact(contact.id, 'name', e.target.value);
                                  updateContact(contact.id, 'showDropdown', true);
                                }}
                                onFocus={() => updateContact(contact.id, 'showDropdown', true)}
                                onBlur={() => setTimeout(() => updateContact(contact.id, 'showDropdown', false), 200)}
                              />
                              <span style={{ position: 'absolute', right: '4px', pointerEvents: 'none', color: '#64748b', fontSize: '10px' }}>Γû╝</span>
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
                                    + Tß║ío mß╗¢i "{contact.name}"
                                  </div>
                                )}
                                <div className="dropdown-item" style={{ color: '#64748b', fontWeight: 500, borderTop: '1px solid #f1f5f9' }} onMouseDown={(e) => {
                                  e.preventDefault();
                                  updateContact(contact.id, 'showDropdown', false);
                                  openSearchModal('contact_search', contact.id);
                                }}>
                                  T├¼m kiß║┐m...
                                </div>
                              </div>
                            )}
                          </div>
                          <input type="text" style={{ border: 'none', outline: 'none', width: '100%', background: 'transparent' }} value={contact.phone} onChange={e => updateContact(contact.id, 'phone', e.target.value)} placeholder="S─ÉT..." />
                          <input type="text" style={{ border: 'none', outline: 'none', width: '100%', background: 'transparent' }} value={contact.email} onChange={e => updateContact(contact.id, 'email', e.target.value)} placeholder="Email..." />

                          <div style={{ position: 'relative' }}>
                            <select className="form-control" style={{ width: '100%', padding: '2px', fontSize: '12px' }} value={contact.positionId} onChange={(e) => {
                              if (e.target.value === 'SEARCH_MORE') {
                                openSearchModal('position', contact.id);
                              } else updateContact(contact.id, 'positionId', e.target.value);
                            }}>
                              <option value="">-- Chß╗ìn --</option>
                              {positionsData.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                              <option value="SEARCH_MORE" className="dropdown-action-item">T├¼m kiß║┐m...</option>
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
                  <div className="add-line-btn" onClick={addContactLine} style={{ marginTop: '8px', marginBottom: '8px' }}>Th├¬m li├¬n hß╗ç</div>
                  <div style={{ width: '100%', height: '1px', backgroundColor: '#e2e8f0', marginTop: '8px' }}></div>
                </div>
              </div>
            </div>

            {/* TH├öNG TIN TH├èM */}
            <div className="form-card" style={{ width: '100%', marginBottom: '16px' }}>
              <div className="column-title-modern">Th├┤ng tin th├¬m</div>
              <div className="extra-info-grid">
                <div style={{ width: "100%" }}>
                  <div className="form-group">
                    <label className="form-label">Ng├áy bß║»t ─æß║ºu tiß║┐p x├║c</label>
                    <input type="date" className="form-control" value={formData.contactDate} onChange={e => hf('contactDate', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Th├íng dß╗▒ kiß║┐n ph├ít h├ánh HSMT</label>
                    <input type="month" className="form-control" value={formData.issueMonth} onChange={e => hf('issueMonth', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Th├íng dß╗▒ kiß║┐n k├¡ hß╗úp ─æß╗ông</label>
                    <input type="month" className="form-control" value={formData.contractMonth || ''} onChange={e => hf('contractMonth', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">─Éß║ºu mß╗æi nghiß╗çp vß╗Ñ VCX</label>
                    <select className="form-control">
                      <option value="">-- Chß╗ìn ─æß║ºu mß╗æi --</option>
                      <option value="op1">Vß║¡n h├ánh nh├│m A</option>
                    </select>
                  </div>
                </div>

                <div style={{ width: "100%" }}>
                  <div className="form-group">
                    <label className="form-label">Nguß╗ôn tiß║┐p cß║¡n</label>
                    <select className="form-control" value={sourceValue} onChange={e => setSourceValue(e.target.value)}>
                      <option value="">-- Chß╗ìn nguß╗ôn --</option>
                      <option value="marketing">Marketing</option>
                      <option value="referral">Giß╗¢i thiß╗çu</option>
                      <option value="landing">Landing page</option>
                      <option value="self">Tß╗▒ tiß║┐p cß║¡n</option>
                    </select>
                  </div>
                  {sourceValue === 'referral' && (
                    <div className="form-group">
                      <label className="form-label">Giß╗¢i thiß╗çu bß╗ƒi</label>
                      <input type="text" className="form-control" placeholder="T├¬n ng╞░ß╗¥i / ─æ╞ín vß╗ï giß╗¢i thiß╗çu..." value={referredBy} onChange={e => setReferredBy(e.target.value)} />
                    </div>
                  )}
                  {sourceValue === 'marketing' && (
                    <div className="form-group">
                      <label className="form-label">Chiß║┐n dß╗ïch (Campaign)</label>
                      <input type="text" className="form-control" placeholder="T├¬n chiß║┐n dß╗ïch marketing..." value={campaignValue} onChange={e => setCampaignValue(e.target.value)} />
                    </div>
                  )}

                  <div className="form-group">
                    <label className="form-label">Sale person</label>
                    <input type="text" className="form-control" readOnly value="Trß║ºn B (Bß║ín)" />
                  </div>

                  <div className="form-group">
                    <label className="form-label">─É╞ín vß╗ï x├║c tiß║┐n</label>
                    <select className="form-control">
                      <option value="">-- Chß╗ìn ─æ╞ín vß╗ï --</option>
                      <option value="b2b">Ph├▓ng b├ín h├áng B2B</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Assign partner</label>
                    <select className="form-control" value={formData.partnerId} onChange={(e) => {
                      if (e.target.value === 'SEARCH_MORE') openSearchModal('partner');
                      else hf('partnerId', e.target.value);
                    }}>
                      <option value="">-- Trß╗æng --</option>
                      {partnersData.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                      <option value="SEARCH_MORE" className="dropdown-action-item">T├¼m kiß║┐m...</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* KH├ô KH─éN & ─Éß╗Ç XUß║ñT */}
            <div className="form-card" style={{ width: '100%', marginBottom: '16px' }}>
              <div className="column-title-modern">Kh├│ kh─ân, ─æß╗ü xuß║Ñt</div>
              <div className="extra-info-grid" style={{ paddingBottom: '16px' }}>
                <div style={{ width: "100%" }}>
                  <div className="form-group" style={{ flexDirection: 'column', alignItems: 'flex-start', borderBottom: 'none' }}>
                    <label className="form-label" style={{ marginBottom: '8px', width: '100%' }}>Kh├│ kh─ân</label>
                    <textarea className="textarea-control" placeholder="Nhß║¡p c├íc kh├│ kh─ân gß║╖p phß║úi..." style={{ minHeight: '80px', width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '4px', outline: 'none' }} value={formData.difficulties || ''} onChange={e => hf('difficulties', e.target.value)}></textarea>
                  </div>
                </div>
                <div style={{ width: "100%" }}>
                  <div className="form-group" style={{ flexDirection: 'column', alignItems: 'flex-start', borderBottom: 'none' }}>
                    <label className="form-label" style={{ marginBottom: '8px', width: '100%' }}>─Éß╗ü xuß║Ñt</label>
                    <textarea className="textarea-control" placeholder="Nhß║¡p ─æß╗ü xuß║Ñt xß╗¡ l├╜..." style={{ minHeight: '80px', width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '4px', outline: 'none' }} value={formData.proposals || ''} onChange={e => hf('proposals', e.target.value)}></textarea>
                  </div>
                </div>
              </div>
            </div>

            {/* GHI CH├Ü Nß╗ÿI Bß╗ÿ */}
            <div className="form-card" style={{ width: '100%', marginBottom: '16px' }}>
              <div className="column-title-modern">Ghi ch├║ nß╗Öi bß╗Ö</div>
              <div className="form-group" style={{ borderBottom: 'none' }}>
                <textarea className="textarea-control" placeholder="Viß║┐t mß╗Öt ghi ch├║ nß╗Öi bß╗Ö..." style={{ minHeight: '80px' }}></textarea>
              </div>
            </div>
          </fieldset>
        </div>

      </div>

      {/* POPUP MODAL T├îM KIß║╛M Tß║áO NHANH */}
      {modalState.open && (
        <div className="modal-overlay">
          <div className={`modal-content ${modalState.type === 'partner' ? 'modal-partner' : ''}`}>
            <div className="modal-header">
              <div className="modal-title">
                {modalState.type === 'position' ? 'T├¼m kiß║┐m & Ph├ón quyß╗ün (Vß╗ï tr├¡)'
                  : modalState.type === 'activity' ? 'Hoß║ít ─æß╗Öng'
                    : 'Search: Assigned Partner'}
              </div>
              <button className="modal-close" onClick={closeSearchModal}><X size={20} /></button>
            </div>

            {modalState.type === 'lost_reason' ? (
              <div className="modal-body" style={{ padding: '16px' }}>
                <div className="form-group" style={{ flexDirection: 'column', alignItems: 'flex-start', border: 'none' }}>
                  <label className="form-label" style={{ marginBottom: '8px' }}>L├╜ do Lost</label>
                  <select className="form-control" style={{ width: '100%' }} value={lostReason} onChange={e => setLostReason(e.target.value)}>
                    <option value="">-- Chß╗ìn l├╜ do --</option>
                    <option value="Gi├í qu├í ─æß║»t">Gi├í qu├í ─æß║»t</option>
                    <option value="Kh├┤ng ─æß╗º t├¡nh n─âng">Kh├┤ng ─æß╗º t├¡nh n─âng</option>
                    <option value="Kh├ích h├áng ─æß╗òi ├╜">Kh├ích h├áng ─æß╗òi ├╜</option>
                  </select>
                </div>
                <div className="form-group" style={{ flexDirection: 'column', alignItems: 'flex-start', marginTop: '12px', border: 'none' }}>
                  <label className="form-label" style={{ marginBottom: '8px' }}>M├┤ tß║ú chi tiß║┐t</label>
                  <textarea className="form-control" style={{ width: '100%', minHeight: '80px', padding: '8px' }} value={lostDesc} onChange={e => setLostDesc(e.target.value)}></textarea>
                </div>
                <div className="modal-footer" style={{ marginTop: '16px', justifyContent: 'flex-end', display: 'flex', gap: '8px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                  <button className="btn btn-primary" onClick={handleLostConfirm} disabled={!lostReason}>X├íc nhß║¡n Lost</button>
                  <button className="btn btn-secondary" onClick={closeSearchModal}>Hß╗ºy</button>
                </div>
              </div>
            ) : modalState.type === 'activity' ? (
              <div className="modal-body" style={{ padding: '16px' }}>
                <div className="form-group" style={{ alignItems: 'flex-start', border: 'none' }}>
                  <label className="form-label" style={{ width: '120px', minWidth: '120px' }}>Loß║íi hoß║ít ─æß╗Öng</label>
                  <div style={{ flex: 1, display: 'flex', gap: '8px' }}>
                    <select className="form-control" style={{ flex: 1 }} id="actType">
                      {activityTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <button className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '12px', whiteSpace: 'nowrap' }} onClick={() => {
                      const name = newActTypeName.trim() || prompt('Nhß║¡p t├¬n loß║íi hoß║ít ─æß╗Öng mß╗¢i:');
                      if (name && !activityTypes.includes(name)) {
                        setActivityTypes(prev => [...prev, name]);
                      }
                    }}>+ Tß║ío nhanh</button>
                  </div>
                </div>
                <div className="form-group" style={{ alignItems: 'flex-start', marginTop: '12px', border: 'none' }}>
                  <label className="form-label" style={{ width: '120px', minWidth: '120px' }}>Ng├áy hß║┐t hß║ín</label>
                  <input type="date" className="form-control" style={{ flex: 1 }} id="actDate" defaultValue={new Date().toISOString().split('T')[0]} />
                </div>
                <div className="form-group" style={{ alignItems: 'flex-start', marginTop: '12px', border: 'none' }}>
                  <label className="form-label" style={{ width: '120px', minWidth: '120px' }}>T├│m tß║»t</label>
                  <input type="text" className="form-control" style={{ flex: 1 }} id="actSummary" placeholder="e.g. Discuss proposal" />
                </div>
                <div className="modal-footer" style={{ marginTop: '24px', justifyContent: 'flex-end', display: 'flex', gap: '8px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                  <button className="btn btn-primary" onClick={() => {
                    const summary = document.getElementById('actSummary').value || document.getElementById('actType').value;
                    const date = document.getElementById('actDate').value;
                    setActivities(prev => [...prev, { id: Date.now(), title: summary, type: document.getElementById('actType').value, date, done: false }]);
                    addChatterMessage('log', 'Hß╗ç', `─É├ú l├¬n lß╗ïch hoß║ít ─æß╗Öng: ${summary} (Hß║ín: ${date})`, 'vß╗½a xong', 'white');
                    closeSearchModal();
                  }}>L├¬n lß╗ïch & ─É├│ng</button>
                  <button className="btn btn-secondary" onClick={closeSearchModal}>Hß╗ºy</button>
                </div>
              </div>
            ) : modalState.type === 'partner' ? (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="odoo-search-bar">
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #71717a', borderRadius: '4px', padding: '4px 8px', width: '300px' }}>
                    <span style={{ color: '#71717a', marginRight: '8px' }}>≡ƒöì</span>
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
                  Ph├ít hiß╗çn Kh├ích h├áng c├│ chung MST (<strong>{mstValue}</strong>) ─æ├ú tß╗ôn tß║íi trong hß╗ç thß╗æng. Vui l├▓ng ─æß╗æi chiß║┐u v├á cß║¡p nhß║¡t th├┤ng tin nß║┐u cß║ºn tr╞░ß╗¢c khi chuyß╗ân sang trß║íng th├íi Th├ánh c├┤ng.
                </div>
                <div style={{ display: 'flex', gap: '24px' }}>
                  <div style={{ flex: 1, background: '#f8fafc', padding: '12px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                    <h4 style={{ marginTop: 0, marginBottom: '12px', borderBottom: '1px solid #cbd5e1', paddingBottom: '8px', color: '#475569' }}>Dß╗» liß╗çu c┼⌐ (Kho)</h4>
                    <div style={{ fontSize: '13px', lineHeight: '1.6' }}>
                      <div><strong>T├¬n KH:</strong> {customerMatchData.name}</div>
                      <div><strong>Viß║┐t tß║»t:</strong> {customerMatchData.shortName}</div>
                      <div><strong>S─ÉT:</strong> {customerMatchData.phone}</div>
                      <div><strong>Email:</strong> {customerMatchData.email}</div>
                      <div><strong>─Éß╗ïa chß╗ë:</strong> {customerMatchData.address}</div>
                      <div><strong>L─⌐nh vß╗▒c:</strong> {customerMatchData.domain}</div>
                    </div>
                  </div>
                  <div style={{ flex: 1, background: '#fff', padding: '12px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                    <h4 style={{ marginTop: 0, marginBottom: '12px', borderBottom: '1px solid #cbd5e1', paddingBottom: '8px', color: '#2563eb' }}>Dß╗» liß╗çu ─æang nhß║¡p</h4>
                    <div style={{ fontSize: '13px', lineHeight: '1.6' }}>
                      <div><strong>T├¬n KH:</strong> {clientSearch}</div>
                      <div><strong>Viß║┐t tß║»t:</strong> {clientAbbr}</div>
                      <div><strong>S─ÉT:</strong> {contacts.length > 0 ? contacts[0].phone : ''}</div>
                      <div><strong>Email:</strong> {contacts.length > 0 ? contacts[0].email : ''}</div>
                      <div><strong>─Éß╗ïa chß╗ë:</strong> {`${formData.ward || ''}, ${formData.district || ''}, ${formData.province || ''}`.replace(/^,\s*|,\s*$/g, '')}</div>
                      <div><strong>L─⌐nh vß╗▒c:</strong> {domainValue}</div>
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
                    setLeadStatus('Th├ánh c├┤ng');
                    if (id) mockStore.updateOppStatus(id, 'Th├ánh c├┤ng');
                    alert('─É├ú cß║¡p nhß║¡t dß╗» liß╗çu Kh├ích h├áng hiß╗çn tß║íi v├á chuyß╗ân trß║íng th├íi Th├ánh c├┤ng!');
                    closeSearchModal();
                  }}>L╞░u ─É├¿ Dß╗» Liß╗çu</button>
                  <button className="btn btn-secondary" onClick={() => {
                    setLeadStatus('Th├ánh c├┤ng');
                    if (id) mockStore.updateOppStatus(id, 'Th├ánh c├┤ng');
                    closeSearchModal();
                  }}>Bß╗Å qua (Giß╗» Dß╗» liß╗çu c┼⌐)</button>
                </div>
              </div>
            ) : modalState.type === 'contact_search' ? (
              <div className="modal-body" style={{ padding: '16px' }}>
                <div style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
                  <input type="text" className="form-control" style={{ flex: 1 }} placeholder="T├¼m theo t├¬n..." value={modalState.searchInput} onChange={(e) => setModalState({ ...modalState, searchInput: e.target.value })} autoFocus />
                  <button className="btn btn-primary" style={{ padding: '4px 12px' }} onClick={confirmModalCreate}>+ Tß║ío mß╗¢i</button>
                </div>
                <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '4px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                      <tr>
                        <th style={{ padding: '8px', textAlign: 'left', borderRight: '1px solid #e2e8f0' }}>T├¬n li├¬n hß╗ç</th>
                        <th style={{ padding: '8px', textAlign: 'left', borderRight: '1px solid #e2e8f0' }}>S─ÉT</th>
                        <th style={{ padding: '8px', textAlign: 'left', borderRight: '1px solid #e2e8f0' }}>Email</th>
                        <th style={{ padding: '8px', textAlign: 'left' }}>Vß╗ï tr├¡</th>
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
                        <tr><td colSpan="4" style={{ padding: '16px', textAlign: 'center', color: '#94a3b8' }}>Kh├┤ng t├¼m thß║Ñy li├¬n hß╗ç n├áo.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="modal-footer" style={{ marginTop: '16px', borderTop: '1px solid #e2e8f0', paddingTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button className="btn btn-secondary" onClick={closeSearchModal}>─É├│ng</button>
                </div>
              </div>
            ) : (
              <div className="modal-body">
                <input type="text" className="form-control" style={{ width: '100%', padding: '10px', fontSize: '14px', border: '1px solid #cbd5e1', borderRadius: '4px' }} placeholder="Nhß║¡p t├¬n ─æß╗â t├¼m kiß║┐m hoß║╖c tß║ío mß╗¢i..." value={modalState.searchInput} onChange={(e) => setModalState({ ...modalState, searchInput: e.target.value })} autoFocus />

                <div style={{ marginTop: '12px', maxHeight: '150px', overflowY: 'auto' }}>
                  {positionsData.filter(d => d.name.toLowerCase().includes(modalState.searchInput.toLowerCase())).map(item => (
                    <div key={item.id} className="dropdown-item" onClick={() => handleSelectModalItem(item.id)}>{item.name}</div>
                  ))}

                  {modalState.searchInput && (
                    <div className="dropdown-item" style={{ color: '#2563eb', fontStyle: 'italic' }} onClick={confirmModalCreate}>
                      + Tß║ío mß╗¢i "{modalState.searchInput}"
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
          <div className={`notebook-tab ${activeChatterTab === 'log_note' ? 'active' : ''}`} onClick={() => setActiveChatterTab('log_note')} style={{padding: '10px 20px', cursor: 'pointer', borderBottom: activeChatterTab === 'log_note' ? '2px solid #e32b4c' : 'none', color: activeChatterTab === 'log_note' ? '#e32b4c' : '#64748b', fontWeight: activeChatterTab === 'log_note' ? 600 : 400}}>Ghi ch├║</div>
          <div className={`notebook-tab ${activeChatterTab === 'activity' ? 'active' : ''}`} onClick={() => setActiveChatterTab('activity')} style={{padding: '10px 20px', cursor: 'pointer', borderBottom: activeChatterTab === 'activity' ? '2px solid #e32b4c' : 'none', color: activeChatterTab === 'activity' ? '#e32b4c' : '#64748b', fontWeight: activeChatterTab === 'activity' ? 600 : 400}}>Hoß║ít ─æß╗Öng</div>
          <div className={`notebook-tab ${activeChatterTab === 'history' ? 'active' : ''}`} onClick={() => setActiveChatterTab('history')} style={{padding: '10px 20px', cursor: 'pointer', borderBottom: activeChatterTab === 'history' ? '2px solid #e32b4c' : 'none', color: activeChatterTab === 'history' ? '#e32b4c' : '#64748b', fontWeight: activeChatterTab === 'history' ? 600 : 400}}>Lß╗ïch sß╗¡ hoß║ít ─æß╗Öng</div>
        </div>

        <div className="notebook-content" style={{padding: '20px 0'}}>
            <div className="chatter-in-tab">
              {activeChatterTab === 'activity' ? (
                <div className="activity-tab">
                    <div className="activity-list" style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                        <div style={{marginBottom: '16px'}}>
                            <button className="btn btn-primary" onClick={createActivity}>+ L├¬n lß╗ïch hoß║ít ─æß╗Öng</button>
                        </div>
                        {activities.length > 0 ? activities.map(act => (
                            <div key={act.id} className="activity-item" style={{display: 'flex', gap: '12px', padding: '12px', background: '#fff', borderRadius: '6px', border: '1px solid #e2e8f0', borderLeft: `4px solid ${act.done ? '#10b981' : '#3b82f6'}`}}>
                                <div style={{flex: 1}}>
                                    <div style={{fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px'}}>
                                        {act.title} ({act.type})
                                        <span style={{fontSize: '11px', padding: '2px 8px', borderRadius: '100px', background: act.done ? '#dcfce7' : '#dbeafe', color: act.done ? '#166534' : '#1e40af'}}>{act.done ? 'Done' : 'Theo kß║┐ hoß║ích'}</span>
                                    </div>
                                    <div style={{fontSize: '12px', color: '#64748b', marginTop: '4px'}}>Hß║ín: {act.date}</div>
                                </div>
                                {!act.done && (
                                    <div style={{display: 'flex', alignItems: 'center'}}>
                                        <button className="btn btn-secondary" style={{padding: '4px 8px', fontSize: '12px'}} onClick={() => markActivityDone(act.id)}>Xong</button>
                                    </div>
                                )}
                            </div>
                        )) : (
                            <div style={{textAlign: 'center', padding: '40px', color: '#64748b', background: '#f8fafc', borderRadius: '12px'}}>
                                Ch╞░a c├│ hoß║ít ─æß╗Öng n├áo ─æ╞░ß╗úc ghi nhß║¡n. Nhß║Ñn "L├¬n lß╗ïch hoß║ít ─æß╗Öng" ─æß╗â tß║ío mß╗¢i.
                            </div>
                        )}
                    </div>
                </div>
              ) : activeChatterTab === 'log_note' ? (
                <>
                  <div style={{display: 'flex', gap: '12px', marginBottom: '24px'}}>
                    <div className="message-avatar" style={{width: '36px', height: '36px', backgroundColor: '#64748b'}}>U</div>
                    <div style={{flex: 1}}>
                        <div className="chatter-input-box" style={{border: '1px solid #e2e8f0', borderRadius: '4px', background: '#fff'}}>
                            <textarea className="chatter-textarea" style={{width: '100%', border: 'none', padding: '10px', minHeight: '80px', resize: 'vertical', fontSize: '14px', outline: 'none'}} placeholder="Ghi ch├║ nß╗Öi bß╗Ö..." value={chatterInput} onChange={handleChatterChange} ref={textareaRef}></textarea>
                            <div className="chatter-input-toolbar" style={{display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#f8fafc', borderTop: '1px solid #f1f5f9'}}>
                                <div className="chatter-toolbar-left" style={{display: 'flex', gap: '14px', color: '#64748b'}}>
                                    <Smile size={18} style={{cursor: 'pointer'}} />
                                    <Paperclip size={18} style={{cursor: 'pointer'}} />
                                </div>
                                <div className="chatter-toolbar-right"><Maximize2 size={16} style={{color: '#64748b', cursor: 'pointer'}} /></div>
                            </div>
                        </div>
                        <button className="btn btn-primary" style={{marginTop: '10px', backgroundColor: '#e32b4c', color: '#fff', padding: '6px 16px', borderRadius: '4px', fontWeight: 600}} onClick={postNote}>Gß╗¡i</button>
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
                      <div style={{textAlign: 'center', color: '#94a3b8', fontStyle: 'italic'}}>Ch╞░a c├│ ghi ch├║ n├áo</div>
                    )}
                  </div>
                </>
              ) : (
                <div className="history-table-wrapper" style={{background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden'}}>
                  <table style={{width: '100%', borderCollapse: 'collapse', fontSize: '13px'}}>
                    <thead>
                      <tr style={{background: '#f8fafc', borderBottom: '1px solid #e2e8f0'}}>
                        <th style={{textAlign: 'left', padding: '12px', color: '#64748b', fontWeight: 600}}>Ng╞░ß╗¥i thao t├íc</th>
                        <th style={{textAlign: 'left', padding: '12px', color: '#64748b', fontWeight: 600}}>Thß╗¥i gian</th>
                        <th style={{textAlign: 'left', padding: '12px', color: '#64748b', fontWeight: 600}}>Hoß║ít ─æß╗Öng / Thay ─æß╗òi</th>
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
                        <tr><td colSpan="3" style={{textAlign: 'center', padding: '30px', color: '#94a3b8'}}>Ch╞░a c├│ bß║ún ghi lß╗ïch sß╗¡</td></tr>
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
