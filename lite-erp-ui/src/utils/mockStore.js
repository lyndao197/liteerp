const INITIAL_DATA = {
  columns: [
    { id: 'col-1', title: 'Mới', color: '#E32B4C', taskIds: ['VCB-1', 'VGR-2', 'VNP-7', 'BIDV-8', 'KPMG-9', 'VNM-10', 'MSN-11', 'VIN-12', 'TH-13', 'HVN-14', 'VJ-15', 'BB-16', 'HAG-17', 'HPG-18', 'MWG-19', 'PNJ-20'] },
    { id: 'col-2', title: 'Thành công', color: '#8B5CF6', taskIds: ['FSOFT-3', 'MB-4'] },
    { id: 'col-3', title: 'Không thành công', color: '#64748B', taskIds: ['TGDD-5', 'TCB-6'] }
  ],
  customers: {
    'CUS-1': {
      id: 'CUS-1', name: 'Công ty Cổ phần Sữa Việt Nam', shortName: 'Vinamilk', mst: '0300588569', type: 'Doanh nghiệp',
      classification: 'Doanh nghiệp lớn', industry: 'F&B', website: 'www.vinamilk.com.vn',
      contactName: 'Nguyễn Thu Phương', email: 'phuong.nt@vinamilk.com.vn', phone: '02839300350',
      address: '10 Tân Trào, Tân Phú, Quận 7, TP. Hồ Chí Minh', domain: 'Hàng tiêu dùng',
      projectType: 'product', source: 'Lead Conversion', status: 'Active',
      contractNo: 'HD-2026-001', signedDate: '10/01/2026', avatars: ['avatar1.png'],
      tag: 'VIP'
    },
    'CUS-2': {
      id: 'CUS-2', name: 'Ngân hàng TMCP Quân đội', shortName: 'MB Bank', mst: '0100283873', type: 'Doanh nghiệp',
      classification: 'Ngân hàng', industry: 'Tài chính', website: 'www.mbbank.com.vn',
      contactName: 'Vũ Thanh Hằng', email: 'hang.vt@mbbank.com.vn', phone: '02437674050',
      address: '21 Cát Linh, Đống Đa, Hà Nội', domain: 'Tài chính',
      projectType: 'outsourcing', source: 'Manual', status: 'Active',
      contractNo: 'HD-2026-005', signedDate: '12/01/2026', avatars: ['avatar2.png'],
      tag: 'Tiềm năng'
    },
    'CUS-3': {
      id: 'CUS-3', name: 'Tập đoàn Công nghiệp Viễn thông Quân đội - Viettel Telecom', shortName: 'Viettel Telecom', mst: '0100109106', type: 'Doanh nghiệp',
      classification: 'Tập đoàn', industry: 'Viễn thông', website: 'www.viettel.vn',
      contactName: 'Nguyễn Mạnh Hùng', email: 'contact@viettel.com.vn', phone: '02432001166',
      address: '1 Giang Văn Minh, Ba Đình, Hà Nội', domain: 'Viễn thông',
      projectType: 'outsourcing', source: 'Manual', status: 'Active',
      contractNo: '', signedDate: '', avatars: [], tag: 'VIP'
    },
    'CUS-4': {
      id: 'CUS-4', name: 'Tổng Công ty Giải pháp Doanh nghiệp Viettel', shortName: 'Viettel Solution', mst: '0108869738', type: 'Doanh nghiệp',
      classification: 'Tổng công ty', industry: 'CNTT', website: 'vds.vn',
      contactName: 'Trần Quang Hùng', email: 'contact@vds.vn', phone: '02432001166',
      address: '1 Giang Văn Minh, Ba Đình, Hà Nội', domain: 'CNTT & Phần mềm',
      projectType: 'product', source: 'Manual', status: 'Active',
      contractNo: '', signedDate: '', avatars: [], tag: 'VIP'
    },
    'CUS-5': {
      id: 'CUS-5', name: 'Tổng Công ty Bưu chính Viettel', shortName: 'Viettel Post', mst: '0106685762', type: 'Doanh nghiệp',
      classification: 'Tổng công ty', industry: 'Logistics', website: 'viettelpost.vn',
      contactName: 'Phạm Thị Lan', email: 'info@viettelpost.vn', phone: '02473001111',
      address: '1 Giang Văn Minh, Ba Đình, Hà Nội', domain: 'Logistics',
      projectType: 'outsourcing', source: 'Manual', status: 'Active',
      contractNo: '', signedDate: '', avatars: [], tag: 'Tiềm năng'
    },
    'CUS-6': {
      id: 'CUS-6', name: 'Tổng Công ty Dịch vụ số Viettel', shortName: 'Viettel Digital', mst: '0100109107', type: 'Doanh nghiệp',
      classification: 'Tổng công ty', industry: 'Viễn thông', website: 'vietteldigital.vn',
      contactName: 'Lê Minh Đức', email: 'info@vietteldigital.vn', phone: '02432001200',
      address: '1 Giang Văn Minh, Ba Đình, Hà Nội', domain: 'Viễn thông - Dịch vụ số',
      projectType: 'product', source: 'Manual', status: 'Active',
      contractNo: '', signedDate: '', avatars: [], tag: 'Tiềm năng'
    },
    'CUS-7': {
      id: 'CUS-7', name: 'Tổng Công ty Công nghệ cao Viettel', shortName: 'Viettel HighTech', mst: '0108988023', type: 'Doanh nghiệp',
      classification: 'Tổng công ty', industry: 'CNTT Phần cứng', website: 'viettelhightech.vn',
      contactName: 'Đỗ Quang Tùng', email: 'info@viettelhightech.vn', phone: '02432001300',
      address: '1 Giang Văn Minh, Ba Đình, Hà Nội', domain: 'Phần cứng & Vi điện tử',
      projectType: 'product', source: 'Manual', status: 'Active',
      contractNo: '', signedDate: '', avatars: [], tag: ''
    },
    'CUS-8': {
      id: 'CUS-8', name: 'Tổng Công ty Mạng lưới Viettel', shortName: 'Viettel Networks', mst: '0108988099', type: 'Doanh nghiệp',
      classification: 'Tổng công ty', industry: 'Viễn thông', website: 'viettelnetworks.vn',
      contactName: 'Nguyễn Văn Bình', email: 'info@viettelnetworks.vn', phone: '02432001400',
      address: '1 Giang Văn Minh, Ba Đình, Hà Nội', domain: 'Hạ tầng mạng',
      projectType: 'outsourcing', source: 'Manual', status: 'Active',
      contractNo: '', signedDate: '', avatars: [], tag: ''
    },
    'CUS-9': {
      id: 'CUS-9', name: 'Viettel Global', shortName: 'VTG', mst: '0102660144', type: 'Doanh nghiệp',
      classification: 'Tổng công ty', industry: 'Viễn thông', website: 'viettelglobal.vn',
      contactName: 'Lê Văn Cường', email: 'customer@company.com.vn', phone: '0904123456',
      address: '307514 PBA Tower, số 487-489 Điện Biên Phủ, phường 09, quận 03, HCM', domain: 'Đầu tư quốc tế',
      projectType: 'outsourcing', source: 'Manual', status: 'Active',
      contractNo: 'DA_05042021/HĐMB-VCX-FTI', signedDate: '07/05/2026', avatars: [], tag: 'VIP'
    }
  },
  customerIds: ['CUS-1', 'CUS-2', 'CUS-3', 'CUS-4', 'CUS-5', 'CUS-6', 'CUS-7', 'CUS-8', 'CUS-9'],
  contacts: {
    'CON-1': {
      id: 'CON-1', name: 'Le Van Luyen', positionId: 'P_1', position: 'Kỹ thuật', rank: 'N/A', companyId: 'CUS-1', companyName: 'Vinamilk',
      email: '', phone: '', status: 'Active', dob: '', avatars: []
    },
    'CON-3': {
      id: 'CON-3', name: 'Nguyễn Thu Phương', positionId: 'P_3', position: 'Trưởng phòng Thu mua', rank: 'Trưởng phòng', companyId: 'CUS-1', companyName: 'Vinamilk',
      email: 'phuong.nt@vinamilk.com.vn', phone: '02839300350', status: 'Active', dob: '1985-05-15', avatars: ['avatar1.png']
    },
    'CON-4': {
      id: 'CON-4', name: 'Lê Minh Hải', positionId: 'P_4', position: 'Kế toán trưởng', rank: 'Quản lý', companyId: 'CUS-1', companyName: 'Vinamilk',
      email: 'hai.lm@vinamilk.com.vn', phone: '0912345678', status: 'Active', dob: '1990-01-12', avatars: []
    },
    'CON-2': {
      id: 'CON-2', name: 'Vũ Thanh Hằng', positionId: 'P_2', position: 'Giám đốc Marketing', rank: 'Lãnh đạo', companyId: 'CUS-2', companyName: 'MB Bank',
      email: 'hang.vt@mbbank.com.vn', phone: '02437674050', status: 'Active', dob: '1988-10-20', avatars: ['avatar2.png']
    },
    'CON-5': {
      id: 'CON-5', name: 'Phạm Thị Mai', positionId: 'P_5', position: 'Quản lý dự án', rank: 'Quản lý', companyId: 'CUS-2', companyName: 'MB Bank',
      email: 'mai.pt@mbbank.com.vn', phone: '0901112223', status: 'Active', dob: '1991-03-08', avatars: []
    }
  },
  contactIds: ['CON-1', 'CON-3', 'CON-4', 'CON-2', 'CON-5'],
  contracts: {
    'CTR-2026-001': { 
        id: 'CTR-2026-001', 
        contractNo: 'HD/2026/001', 
        name: 'Hợp đồng Dịch vụ chăm sóc khách hàng', 
        customerId: 'CUS-1',
        customerName: 'Công ty Cổ phần Sữa Việt Nam',
        shortName: 'Vinamilk',
        amName: 'Nguyễn Văn A',
        promotionUnit: 'Phòng Bán hàng',
        projectType: 'Mới_xúc tiến',
        serviceType: 'Dịch vụ CC outsourcing',
        classification: 'Ngoài',
        contractStatus: 'Đang hiệu lực',
        implementationStatus: 'Đã triển khai',
        revenueStatus: 'Đã lên doanh thu',
        revenueMonth: 'Tháng 01/2026',
        contractValue: '1,500,000,000',
        unitPrice: '150,000,000',
        totalContracts: '1',
        effectiveDate: '2026-01-10',
        expiryDate: '2027-01-10',
        signedDate: '2026-01-10',
        serviceContent: 'Cung cấp nhân sự vận hành tổng đài CSKH',
        notes: 'Khách hàng VIP',
        approvalStatus: 'Hiệu lực',
        products: [
            { productId: 'PRD-001', qty: 10 },
            { productId: 'PRD-002', qty: 1 },
            { productId: 'PRD-003', qty: 5 },
            { productId: 'PRD-004', qty: 50 },
            { productId: 'PRD-005', qty: 20 }
        ]
    },
    'CTR-2026-002': { 
        id: 'CTR-2026-002', 
        contractNo: 'HD/2026/002', 
        name: 'Dự án OmniX', 
        customerId: 'CUS-2', 
        customerName: 'Viettel Solution', 
        shortName: 'VTS', 
        amName: 'Vũ Thanh Hằng', 
        promotionUnit: 'Phòng Dự án', 
        projectType: 'Mới_xúc tiến', 
        serviceType: 'Giải pháp, platform', 
        classification: 'Ngoài', 
        contractStatus: 'Đang hiệu lực', 
        implementationStatus: 'Đang triển khai', 
        revenueStatus: 'Chưa lên doanh thu', 
        revenueMonth: 'Tháng 02/2026', 
        contractValue: '2,500,000,000', 
        unitPrice: '', 
        totalContracts: '1', 
        effectiveDate: '2026-02-01', 
        expiryDate: '2027-02-01', 
        signedDate: '2026-01-20', 
        serviceContent: 'Triển khai OmniX CRM', 
        notes: '', 
        approvalStatus: 'Hiệu lực',
        products: [
            { productId: 'PRD-001', qty: 100 },
            { productId: 'PRD-002', qty: 1 },
            { productId: 'PRD-003', qty: 10 },
            { productId: 'PRD-004', qty: 5 },
            { productId: 'PRD-005', qty: 20 }
        ]
    },
    'CTR-2026-003': { id: 'CTR-2026-003', contractNo: 'HD/2026/003', name: 'Hợp đồng dự án KnowxHub', customerId: 'CUS-1', customerName: 'Viettel Post', shortName: 'VTP', amName: 'Nguyễn Văn A', promotionUnit: 'Phòng Dự án', projectType: 'Duy trì', serviceType: 'Giải pháp, platform', classification: 'Nội bộ', contractStatus: 'Đang hiệu lực', implementationStatus: 'Đã triển khai', revenueStatus: 'Đã lên doanh thu', revenueMonth: 'Tháng 01/2026', contractValue: '850,000,000', unitPrice: '', totalContracts: '1', effectiveDate: '2026-01-15', expiryDate: '2027-01-15', signedDate: '2026-01-05', serviceContent: 'Bảo trì KnowxHUB', notes: '', approvalStatus: 'Hiệu lực',
        products: [
            { productId: 'PRD-001', qty: 15 },
            { productId: 'PRD-002', qty: 1 },
            { productId: 'PRD-003', qty: 5 },
            { productId: 'PRD-004', qty: 2 },
            { productId: 'PRD-005', qty: 5 }
        ]
    },
    'CTR-2026-004': { id: 'CTR-2026-004', contractNo: 'HD/2026/004', name: 'Dịch vụ chăm sóc khách hàng', customerId: 'CUS-2', customerName: 'Viettel Telecom', shortName: 'VTT', amName: 'Vũ Thanh Hằng', promotionUnit: 'Phòng Bán hàng', projectType: 'Mới_xúc tiến', serviceType: 'Dịch vụ CC outsourcing', classification: 'Ngoài', contractStatus: 'Đang hiệu lực', implementationStatus: 'Chưa triển khai', revenueStatus: 'Chưa lên doanh thu', revenueMonth: 'Tháng 03/2026', contractValue: '3,200,000,000', unitPrice: '', totalContracts: '1', effectiveDate: '2026-03-01', expiryDate: '2028-03-01', signedDate: '2026-02-15', serviceContent: 'Tổng đài 100 seats', notes: '', approvalStatus: 'Hiệu lực',
        products: [
            { productId: 'PRD-001', qty: 25 },
            { productId: 'PRD-002', qty: 2 },
            { productId: 'PRD-003', qty: 8 },
            { productId: 'PRD-004', qty: 15 },
            { productId: 'PRD-005', qty: 10 }
        ]
    },
    'CTR-2026-005': { id: 'CTR-2026-005', contractNo: 'HD/2026/005', name: 'Dịch vụ gia tăng doanh số', customerName: 'Viettel Digital', shortName: 'VTT', amName: 'Trần B', approvalStatus: 'Hiệu lực', effectiveDate: '2026-01-01', contractValue: '1,000,000,000', signedDate: '2025-12-20',
        products: [
            { productId: 'PRD-001', qty: 20 },
            { productId: 'PRD-002', qty: 2 },
            { productId: 'PRD-003', qty: 10 },
            { productId: 'PRD-004', qty: 5 },
            { productId: 'PRD-005', qty: 10 }
        ]
    },
    'CTR-2026-006': { id: 'CTR-2026-006', contractNo: 'HD/2026/006', name: 'Dự án WorkForceX', customerName: 'Viettel Solution', shortName: 'VTS', amName: 'Lê C', approvalStatus: 'Hiệu lực', effectiveDate: '2026-02-10', contractValue: '5,000,000,000', signedDate: '2026-01-25',
        products: [
            { productId: 'PRD-001', qty: 50 },
            { productId: 'PRD-002', qty: 5 },
            { productId: 'PRD-003', qty: 15 },
            { productId: 'PRD-004', qty: 10 },
            { productId: 'PRD-005', qty: 25 }
        ]
    },
    'CTR-2026-007': { id: 'CTR-2026-007', contractNo: 'HD/2026/007', name: 'Hợp đồng dự án KnowxHub', customerName: 'Viettel Post', shortName: 'VTP', amName: 'Phạm Q', approvalStatus: 'Hiệu lực', effectiveDate: '2026-01-15', contractValue: '750,000,000', signedDate: '2026-01-10',
        products: [
            { productId: 'PRD-001', qty: 30 },
            { productId: 'PRD-002', qty: 3 },
            { productId: 'PRD-003', qty: 5 },
            { productId: 'PRD-004', qty: 8 },
            { productId: 'PRD-005', qty: 15 }
        ]
    },
    'CTR-2026-008': { id: 'CTR-2026-008', contractNo: 'HD/2026/008', name: 'Dịch vụ cho thuê nhân sự', customerName: 'Viettel Telecom', shortName: 'VTT', amName: 'Nguyễn Văn A', approvalStatus: 'Hiệu lực', effectiveDate: '2026-03-01', contractValue: '800,000,000', signedDate: '2026-02-15',
        products: [
            { productId: 'PRD-001', qty: 10 },
            { productId: 'PRD-002', qty: 1 },
            { productId: 'PRD-003', qty: 2 },
            { productId: 'PRD-004', qty: 5 },
            { productId: 'PRD-005', qty: 20 }
        ]
    },
    'CTR-2026-009': { id: 'CTR-2026-009', contractNo: 'HD/2026/009', name: 'Dự án OmniX', customerName: 'Viettel HighTech', shortName: 'VHT', amName: 'Trần B', approvalStatus: 'Hiệu lực', effectiveDate: '2026-04-01', contractValue: '400,000,000', signedDate: '2026-03-10',
        products: [
            { productId: 'PRD-001', qty: 12 },
            { productId: 'PRD-002', qty: 2 },
            { productId: 'PRD-003', qty: 4 },
            { productId: 'PRD-004', qty: 6 },
            { productId: 'PRD-005', qty: 8 }
        ]
    },
    'CTR-2026-010': { id: 'CTR-2026-010', contractNo: 'HD/2026/010', name: 'Dịch vụ chăm sóc khách hàng', customerName: 'Viettel Telecom', shortName: 'VTT', amName: 'Lê C', approvalStatus: 'Hiệu lực', effectiveDate: '2026-01-01', contractValue: '2,000,000,000', signedDate: '2025-12-25',
        products: [
            { productId: 'PRD-001', qty: 40 },
            { productId: 'PRD-002', qty: 4 },
            { productId: 'PRD-003', qty: 10 },
            { productId: 'PRD-004', qty: 20 },
            { productId: 'PRD-005', qty: 15 }
        ]
    },
    'CTR-2026-011': { id: 'CTR-2026-011', contractNo: 'HD/2026/011', name: 'Dịch vụ gia tăng doanh số', customerName: 'Viettel Solution', shortName: 'VTS', amName: 'Phạm Q', approvalStatus: 'Nháp', effectiveDate: '2026-05-01', contractValue: '600,000,000', signedDate: '2026-04-20' },
    
    // 5 records pending
    'CTR-2026-012': { id: 'CTR-2026-012', contractNo: 'HD/2026/012', name: 'Dự án OmniX', customerName: 'Viettel Telecom', shortName: 'VTT', amName: 'Nguyễn Văn A', approvalStatus: 'Chờ duyệt bản thảo', effectiveDate: '2026-06-01', contractValue: '1,200,000,000', signedDate: '', isLegalApprovedDraft: true, isManagerApprovedDraft: false },
    'CTR-2026-013': { id: 'CTR-2026-013', contractNo: 'HD/2026/013', name: 'Dịch vụ gia tăng doanh số', customerName: 'Viettel Solution', shortName: 'VTS', amName: 'Trần B', approvalStatus: 'Chờ duyệt bản thảo', effectiveDate: '2026-07-01', contractValue: '800,000,000', signedDate: '', isLegalApprovedDraft: false, isManagerApprovedDraft: true },
    'CTR-2026-014': { id: 'CTR-2026-014', contractNo: 'HD/2026/014', name: 'Dịch vụ chăm sóc khách hàng', customerName: 'Viettel Networks', shortName: 'VTN', amName: 'Lê C', approvalStatus: 'Chờ duyệt bản thảo', effectiveDate: '2026-08-01', contractValue: '350,000,000', signedDate: '', isLegalApprovedDraft: false, isManagerApprovedDraft: false },
    'CTR-2026-015': { id: 'CTR-2026-015', contractNo: 'HD/2026/015', name: 'Hợp đồng dự án KnowxHub', customerName: 'Viettel Telecom', shortName: 'VTT', amName: 'Phạm Q', approvalStatus: 'Chờ duyệt bản ký', effectiveDate: '2026-09-01', contractValue: '4,500,000,000', signedDate: '2026-08-15', isLegalApprovedSigned: true, isManagerApprovedSigned: false },
    'CTR-2026-016': { id: 'CTR-2026-016', contractNo: 'HD/2026/016', name: 'Dự án WorkForceX', customerName: 'Viettel Solution', shortName: 'VTS', amName: 'Nguyễn Văn A', approvalStatus: 'Chờ duyệt bản ký', effectiveDate: '2026-10-01', contractValue: '2,800,000,000', signedDate: '2026-09-20', isLegalApprovedSigned: false, isManagerApprovedSigned: false },
    'CTR-2026-017': { 
        id: 'CTR-2026-017', 
        contractNo: 'DA_05042021/HĐMB-VCX-FTI', 
        name: 'Hợp đồng mua bán thiết bị', 
        customerId: 'CUS-9',
        customerName: 'Viettel Global',
        shortName: 'VTG',
        amName: 'TrangNTT55',
        promotionUnit: 'Nhóm A _ P.CLKD',
        projectType: 'Mới_xúc tiến',
        serviceType: 'Thiết bị',
        classification: 'Ngoài',
        contractStatus: 'Đang hiệu lực',
        implementationStatus: 'Chưa triển khai',
        revenueStatus: 'Chưa lên doanh thu',
        products: [
            { productId: 'PRD-001', qty: 10 },
            { productId: 'PRD-002', qty: 1 },
            { productId: 'PRD-003', qty: 5 },
            { productId: 'PRD-004', qty: 2 },
            { productId: 'PRD-005', qty: 20 }
        ],
        revenueMonth: 'Tháng 05/2026',
        contractValue: '400,000,000',
        unitPrice: '',
        totalContracts: '1',
        effectiveDate: '2026-05-01',
        expiryDate: '2027-05-01',
        signedDate: '2026-05-07',
        serviceContent: 'Cung cấp thiết bị mạng',
        notes: '',
        approvalStatus: 'Hiệu lực'
    }
  },
  contractIds: ['CTR-2026-001', 'CTR-2026-002', 'CTR-2026-003', 'CTR-2026-004', 'CTR-2026-005', 'CTR-2026-006', 'CTR-2026-007', 'CTR-2026-008', 'CTR-2026-009', 'CTR-2026-010', 'CTR-2026-011', 'CTR-2026-012', 'CTR-2026-013', 'CTR-2026-014', 'CTR-2026-015', 'CTR-2026-016', 'CTR-2026-017'],
  tasks: {
    'VCB-1': {
      id: 'VCB-1', content: 'Hợp đồng dịch vụ Cloud', company: 'Vietcombank', mst: '0100112437', contactName: 'Nguyễn Văn Định', email: 'dinh.nv@vcb.com.vn',
      district: 'Quận Hoàn Kiếm', ward: 'Phường Tràng Tiền', city: 'Hà Nội', projectedService: 'Kiểm soát / Nhập liệu', assignedPartner: 'Viettel Telecom',
      date: '11/1/2026', tags: [{ text: 'Nội bộ', color: '#e0e7ff', textCol: '#3730a3' }, { text: 'Khẩn cấp', color: '#fee2e2', textCol: '#991b1b' }],
      attachments: 3, comments: 2, avatars: ['avatar1.png', 'avatar2.png'],
      revenue: '1,500,000,000 ₫', probability: '10%', salesperson: 'Trần B', status: 'Mới'
    },
    'VGR-2': {
      id: 'VGR-2', content: 'Giải pháp ERP', company: 'Vingroup', mst: '0101245486', contactName: 'Lê Minh Trí', email: 'tri.lm@vingroup.net',
      district: 'Quận Cầu Giấy', ward: 'Phường Dịch Vọng Hậu', city: 'Hà Nội', projectedService: 'Telesales', assignedPartner: 'FPT IS',
      date: '11/1/2026', tags: [{ text: 'Doanh nghiệp', color: '#dcfce7', textCol: '#166534' }],
      attachments: 0, comments: 3, avatars: ['avatar1.png', 'avatar2.png'],
      revenue: '4,000,000,000 ₫', probability: '25%', salesperson: 'Trần B', status: 'Mới'
    },
    'FSOFT-3': {
      id: 'FSOFT-3', content: 'Hệ thống CRM', company: 'FPT Software', mst: '0101778163', contactName: 'Phạm Hồng Thái', email: 'thai.ph@fsoft.com.vn',
      district: 'Quận 9', ward: 'Phường Tân Phú', city: 'TP. Hồ Chí Minh', projectedService: 'Chăm sóc khách hàng', assignedPartner: 'TMA Solutions',
      date: '12/1/2026', tags: [{ text: 'Nội bộ', color: '#e0e7ff', textCol: '#3730a3' }, { text: 'KH tiềm năng', color: '#ffedd5', textCol: '#9a3412' }],
      attachments: 1, comments: 4, avatars: ['avatar1.png', 'avatar2.png'],
      revenue: '800,000,000 ₫', probability: '90%', salesperson: 'Nguyễn Văn A', status: 'Thành công'
    },
    'MB-4': {
      id: 'MB-4', content: 'Tổng đài IP', company: 'MB Bank', mst: '0100283873', contactName: 'Vũ Thanh Hằng', email: 'hang.vt@mbbank.com.vn',
      district: 'Quận Đống Đa', ward: 'Phường Cát Linh', city: 'Hà Nội', projectedService: 'Telesales', assignedPartner: 'CMC Corp',
      date: '12/1/2026', tags: [{ text: 'Doanh nghiệp', color: '#dcfce7', textCol: '#166534' }],
      attachments: 0, comments: 1, avatars: ['avatar1.png', 'avatar2.png'],
      revenue: '250,000,000 ₫', probability: '100%', salesperson: 'Nguyễn Văn A', status: 'Thành công'
    },
    'TGDD-5': {
      id: 'TGDD-5', content: 'Marketing Automation', company: 'The Gioi Di Dong', mst: '0303288350', contactName: 'Trần Trọng Đạt', email: 'dat.tt@tgdd.vn',
      district: 'Quận 1', ward: 'Phường Bến Nghé', city: 'TP. Hồ Chí Minh', projectedService: 'Chăm sóc khách hàng', assignedPartner: 'Mat Bao',
      date: '10/1/2026', tags: [{ text: 'KH tiềm năng', color: '#ffedd5', textCol: '#9a3412' }],
      attachments: 0, comments: 3, avatars: ['avatar1.png', 'avatar2.png'],
      revenue: '120,000,000 ₫', probability: '0%', salesperson: 'Lê Thị C', status: 'Không thành công'
    },
    'TCB-6': {
      id: 'TCB-6', content: 'Call Center Solution', company: 'Techcombank', mst: '0100230800', contactName: 'Đinh Tiến Dũng', email: 'dung.dt@techcombank.com',
      district: 'Quận Hải Châu', ward: 'Phường Thạch Thang', city: 'Đà Nẵng', projectedService: 'Kiểm soát / Nhập liệu', assignedPartner: 'MobiFone',
      date: '10/1/2026', tags: [{ text: 'Doanh nghiệp', color: '#dcfce7', textCol: '#166534' }],
      attachments: 0, comments: 1, avatars: ['avatar1.png', 'avatar2.png'],
      revenue: '3,000,000,000 ₫', probability: '0%', salesperson: 'Trần B', status: 'Không thành công'
    },
    'VNP-7': {
      id: 'VNP-7', content: 'Thiết lập hạ tầng mạng', company: 'VNPT', mst: '0100684378', contactName: 'Trần Đại Nghĩa', email: 'nghia.td@vnpt.vn',
      district: 'Quận Đống Đa', ward: 'Phường Láng Hạ', city: 'Hà Nội', projectedService: 'Cho thuê máy chủ', assignedPartner: 'Viettel IDC',
      date: '15/1/2026', tags: [], attachments: 1, comments: 0, avatars: [],
      revenue: '1,200,000,000 ₫', probability: '50%', salesperson: 'Nguyễn Văn A', status: 'Mới'
    },
    'BIDV-8': {
      id: 'BIDV-8', content: 'Nâng cấp bảo mật', company: 'BIDV', mst: '0100150619', contactName: 'Lê Hoàng', email: 'hoangl@bidv.com.vn',
      district: 'Quận Hoàn Kiếm', ward: 'Phường Trần Hưng Đạo', city: 'Hà Nội', projectedService: 'Kiểm soát / Nhập liệu', assignedPartner: 'FPT IS',
      date: '16/1/2026', tags: [], attachments: 2, comments: 1, avatars: [],
      revenue: '5,000,000,000 ₫', probability: '80%', salesperson: 'Trần B', status: 'Mới'
    },
    'KPMG-9': {
      id: 'KPMG-9', content: 'Dịch vụ kế toán', company: 'KPMG Vietnam', mst: '0100112233', contactName: 'Phạm Tuấn', email: 'tuan@kpmg.vn',
      district: 'Quận 1', ward: 'Phường Bến Nghé', city: 'TP. Hồ Chí Minh', projectedService: 'Kiểm soát / Nhập liệu', assignedPartner: 'TMA Solutions',
      date: '17/1/2026', tags: [], attachments: 0, comments: 0, avatars: [],
      revenue: '500,000,000 ₫', probability: '40%', salesperson: 'Lê Thị C', status: 'Mới'
    },
    'VNM-10': {
      id: 'VNM-10', content: 'Triển khai quản trị nhân sự', company: 'Vinamilk', mst: '0300588569', contactName: 'Nguyễn Thu Phương', email: 'phuong.nt@vinamilk.com.vn',
      district: 'Quận 7', ward: 'Phường Tân Thuận Đông', city: 'TP. Hồ Chí Minh', projectedService: 'Chăm sóc khách hàng', assignedPartner: 'CMC Corp',
      date: '17/1/2026', tags: [], attachments: 0, comments: 1, avatars: [],
      revenue: '2,500,000,000 ₫', probability: '60%', salesperson: 'Nguyễn Văn A', status: 'Mới'
    },
    'MSN-11': {
      id: 'MSN-11', content: 'Nền tảng thương mại điện tử', company: 'Masan Group', mst: '0303576603', contactName: 'Lý Quốc Bảo', email: 'bao.lq@masan.vn',
      district: 'Quận 1', ward: 'Phường Bến Nghé', city: 'TP. Hồ Chí Minh', projectedService: 'Telesales', assignedPartner: 'Mat Bao',
      date: '18/1/2026', tags: [], attachments: 1, comments: 0, avatars: [],
      revenue: '1,800,000,000 ₫', probability: '30%', salesperson: 'Lê Thị C', status: 'Mới'
    },
    'VIN-12': {
      id: 'VIN-12', content: 'Giải pháp Smart City', company: 'Vinhomes', mst: '0102671977', contactName: 'Trịnh Vĩnh', email: 'vinh.t@vinhomes.vn',
      district: 'Quận Long Biên', ward: 'Phường Phúc Lợi', city: 'Hà Nội', projectedService: 'Cho thuê máy chủ', assignedPartner: 'Viettel Telecom',
      date: '18/1/2026', tags: [], attachments: 3, comments: 5, avatars: [],
      revenue: '8,000,000,000 ₫', probability: '25%', salesperson: 'Trần B', status: 'Mới'
    },
    'TH-13': {
      id: 'TH-13', content: 'Hệ thống lưu trữ Cloud', company: 'TH True Milk', mst: '0309999999', contactName: 'Đặng Vân Anh', email: 'anh.dv@th.com.vn',
      district: 'Quận Ba Đình', ward: 'Phường Liễu Giai', city: 'Hà Nội', projectedService: 'Cho thuê máy chủ', assignedPartner: 'FPT IS',
      date: '19/1/2026', tags: [], attachments: 0, comments: 0, avatars: [],
      revenue: '900,000,000 ₫', probability: '40%', salesperson: 'Lê Thị C', status: 'Mới'
    },
    'HVN-14': {
      id: 'HVN-14', content: 'Dịch vụ SMS Brandname', company: 'Vietnam Airlines', mst: '0100107506', contactName: 'Lê Thế Hùng', email: 'hung.lt@vietnamairlines.com',
      district: 'Quận Long Biên', ward: 'Phường Gia Thụy', city: 'Hà Nội', projectedService: 'Telesales', assignedPartner: 'MobiFone',
      date: '20/1/2026', tags: [], attachments: 0, comments: 2, avatars: [],
      revenue: '300,000,000 ₫', probability: '70%', salesperson: 'Nguyễn Văn A', status: 'Mới'
    },
    'VJ-15': {
      id: 'VJ-15', content: 'Nâng cấp tổng đài CSKH', company: 'Vietjet Air', mst: '0102325399', contactName: 'Hoàng Thái Tú', email: 'tu.ht@vietjetair.com',
      district: 'Quận Tân Bình', ward: 'Phường 2', city: 'TP. Hồ Chí Minh', projectedService: 'Chăm sóc khách hàng', assignedPartner: 'CMC Corp',
      date: '21/1/2026', tags: [], attachments: 1, comments: 1, avatars: [],
      revenue: '650,000,000 ₫', probability: '85%', salesperson: 'Trần B', status: 'Mới'
    },
    'BB-16': {
      id: 'BB-16', content: 'Hệ thống tracking hành lý', company: 'Bamboo Airways', mst: '0107867370', contactName: 'Bùi Tuấn Anh', email: 'anh.bt@bamboo.com',
      district: 'Quận Cầu Giấy', ward: 'Phường Dịch Vọng', city: 'Hà Nội', projectedService: 'Kiểm soát / Nhập liệu', assignedPartner: 'Viettel Telecom',
      date: '21/1/2026', tags: [], attachments: 0, comments: 0, avatars: [],
      revenue: '1,500,000,000 ₫', probability: '20%', salesperson: 'Lê Thị C', status: 'Mới'
    },
    'HAG-17': {
      id: 'HAG-17', content: 'Hệ thống nông nghiệp IOT', company: 'Hoàng Anh Gia Lai', mst: '5900189668', contactName: 'Đoàn Nguyên', email: 'nguyen.d@hagl.com.vn',
      district: 'Thành Phố Pleiku', ward: 'Phường Phù Đổng', city: 'Gia Lai', projectedService: 'Cho thuê máy chủ', assignedPartner: 'FPT IS',
      date: '22/1/2026', tags: [], attachments: 2, comments: 4, avatars: [],
      revenue: '3,200,000,000 ₫', probability: '30%', salesperson: 'Nguyễn Văn A', status: 'Mới'
    },
    'HPG-18': {
      id: 'HPG-18', content: 'Quản lý chuỗi cung ứng', company: 'Hòa Phát Group', mst: '0900189284', contactName: 'Võ Minh Quân', email: 'quan.vm@hoaphat.com.vn',
      district: 'Quận Hai Bà Trưng', ward: 'Phường Bùi Thị Xuân', city: 'Hà Nội', projectedService: 'Telesales', assignedPartner: 'TMA Solutions',
      date: '23/1/2026', tags: [], attachments: 0, comments: 1, avatars: [],
      revenue: '4,500,000,000 ₫', probability: '60%', salesperson: 'Trần B', status: 'Mới'
    },
    'MWG-19': {
      id: 'MWG-19', content: 'Omnichannel CRM', company: 'Thế Giới Di Động', mst: '0303288350', contactName: 'Nguyễn Đức Tài', email: 'tai.nd@thegioididong.com',
      district: 'Quận Thủ Đức', ward: 'Phường Linh Xuân', city: 'TP. Hồ Chí Minh', projectedService: 'Chăm sóc khách hàng', assignedPartner: 'CMC Corp',
      date: '24/1/2026', tags: [], attachments: 5, comments: 2, avatars: [],
      revenue: '5,000,000,000 ₫', probability: '45%', salesperson: 'Nguyễn Văn A', status: 'Mới'
    },
    'PNJ-20': {
      id: 'PNJ-20', content: 'Giải pháp Loyalty', company: 'PNJ', mst: '0300521758', contactName: 'Cao Ngọc Dung', email: 'dung.cn@pnj.com.vn',
      district: 'Quận Phú Nhuận', ward: 'Phường 9', city: 'TP. Hồ Chí Minh', projectedService: 'Telesales', assignedPartner: 'Mat Bao',
      date: '25/1/2026', tags: [], attachments: 1, comments: 1, avatars: [],
      revenue: '2,100,000,000 ₫', probability: '80%', salesperson: 'Lê Thị C', status: 'Mới'
    }
  },
  goals: {
    'GOAL-1': {
      id: 'GOAL-1', name: 'Mục tiêu tháng 01', category: 'Doanh thu', subCategory: 'Nội bộ', unit: '%', weight: '20',
      startDate: '2026-01-01', endDate: '2026-01-31', approvalStatus: 'Hoàn thành', actualProgress: '100'
    },
    'GOAL-2': {
      id: 'GOAL-2', name: 'Mục tiêu tháng 02', category: 'Doanh thu', subCategory: 'Ngoài', unit: '%', weight: '20',
      startDate: '2026-02-01', endDate: '2026-02-28', approvalStatus: 'Hoàn thành', actualProgress: '105'
    },
    'GOAL-3': {
      id: 'GOAL-3', name: 'Mục tiêu tháng 03 - Chờ đánh giá', category: 'Xúc tiến', subCategory: 'Tiếp xúc', unit: 'KH', weight: '15',
      startDate: '2026-03-01', endDate: '2026-03-31', approvalStatus: 'Chờ đánh giá', actualProgress: '120'
    },
    'GOAL-4': {
      id: 'GOAL-4', name: 'Mục tiêu tháng 04 - Chờ đánh giá', category: 'Doanh thu', subCategory: 'Bảo hành', unit: '%', weight: '15',
      startDate: '2026-04-01', endDate: '2026-04-30', approvalStatus: 'Chờ đánh giá', actualProgress: '90'
    },
    'GOAL-5': {
      id: 'GOAL-5', name: 'Mục tiêu tháng 05 - Chờ đánh giá', category: 'Nhiệm vụ', subCategory: 'Hỗ trợ', unit: 'Điểm', weight: '10',
      startDate: '2026-05-01', endDate: '2026-05-31', approvalStatus: 'Chờ đánh giá', actualProgress: '8'
    },
    'GOAL-6': {
      id: 'GOAL-6', name: 'Mục tiêu tháng 06 - Chờ đánh giá', category: 'Doanh thu', subCategory: 'Nội bộ', unit: '%', weight: '10',
      startDate: '2026-06-01', endDate: '2026-06-30', approvalStatus: 'Chờ đánh giá', actualProgress: '95'
    },
    'GOAL-7': {
      id: 'GOAL-7', name: 'Mục tiêu tháng 07', category: 'Doanh thu', subCategory: 'Ngoài', unit: '%', weight: '10',
      startDate: '2026-07-01', endDate: '2026-07-31', approvalStatus: 'Mới', actualProgress: ''
    },
    'GOAL-8': {
      id: 'GOAL-8', name: 'Mục tiêu tháng 08', category: 'Xúc tiến', subCategory: 'Tiềm năng', unit: 'KH', weight: '10',
      startDate: '2026-08-01', endDate: '2026-08-31', approvalStatus: 'Đang thực hiện', actualProgress: ''
    },
    'GOAL-9': {
      id: 'GOAL-9', name: 'Mục tiêu tháng 09', category: 'Doanh thu', subCategory: 'Ngoài', unit: '%', weight: '10',
      startDate: '2026-09-01', endDate: '2026-09-30', approvalStatus: 'Không hoàn thành', actualProgress: '40'
    },
    'GOAL-10': {
      id: 'GOAL-10', name: 'Mục tiêu tháng 10', category: 'Xúc tiến', subCategory: 'Tiếp xúc', unit: 'KH', weight: '10',
      startDate: '2026-10-01', endDate: '2026-10-31', approvalStatus: 'Mới', actualProgress: ''
    },
    'GOAL-11': {
      id: 'GOAL-11', name: 'Mục tiêu tháng 11', category: 'Doanh thu', subCategory: 'Dịch vụ', unit: '%', weight: '5',
      startDate: '2026-11-01', endDate: '2026-11-30', approvalStatus: 'Mới', actualProgress: ''
    },
    'GOAL-12': {
      id: 'GOAL-12', name: 'Mục tiêu tháng 12', category: 'Nhiệm vụ', subCategory: 'Khác', unit: '%', weight: '5',
      startDate: '2026-12-01', endDate: '2026-12-31', approvalStatus: 'Mới', actualProgress: ''
    }
  },
  goalIds: ['GOAL-1', 'GOAL-2', 'GOAL-3', 'GOAL-4', 'GOAL-5', 'GOAL-6', 'GOAL-7', 'GOAL-8', 'GOAL-9', 'GOAL-10', 'GOAL-11', 'GOAL-12'],
  oppColumns: [
    { id: 'opp-0', title: 'Mới', color: '#e32b4c', taskIds: ['NEW-1', 'NEW-2', 'NEW-3'] },
    { id: 'opp-1', title: 'Đang tiếp xúc', color: '#3b82f6', taskIds: ['FPT-1', 'VNPT-1'] },
    { id: 'opp-2', title: 'Đánh giá nhu cầu', color: '#6366f1', taskIds: ['MB-1'] },
    { id: 'opp-3', title: 'Đang báo giá', color: '#8b5cf6', taskIds: ['VNM-1'] },
    { id: 'opp-4', title: 'Đấu thầu', color: '#ec4899', taskIds: ['VCB-1'] },
    { id: 'opp-5', title: 'POC', color: '#f43f5e', taskIds: ['VIN-1'] },
    { id: 'opp-6', title: 'Kí hợp đồng', color: '#f97316', taskIds: ['VHM-1'] },
    { id: 'opp-7', title: 'Triển khai', color: '#eab308', taskIds: ['BAM-1'] },
    { id: 'opp-8', title: 'Thành công', color: '#22c55e', taskIds: ['TCB-1'] },
    { id: 'opp-9', title: 'Không thành công', color: '#64748b', taskIds: ['TGDD-1'] }
  ],
  oppTasks: {
    'NEW-1': { id: 'NEW-1', content: 'Giải pháp CRM Sales', company: 'Công ty StartUp ABC', mst: '0101999888', contactName: 'Nguyễn T', email: 't@startup.vn', district: 'Thanh Xuân', ward: 'Khương Đình', city: 'Hà Nội', projectedService: 'CRM', assignedPartner: 'MatBao', date: '13/04/2026', revenue: '20,000,000 ₫', probability: '5%', salesperson: 'Nguyễn Văn A', status: 'Mới', attachments: 0, avatars: [], tasks: [] },
    'NEW-2': { id: 'NEW-2', content: 'Mua license Office 365', company: 'Đại học Edu', mst: '0102111222', contactName: 'Trương K', email: 'k@edu.vn', district: 'Hai Bà Trưng', ward: 'Bách Khoa', city: 'Hà Nội', projectedService: 'License', assignedPartner: 'FPT IS', date: '14/04/2026', revenue: '150,000,000 ₫', probability: '10%', salesperson: 'Trần B', status: 'Mới', attachments: 0, avatars: [], tasks: [] },
    'NEW-3': { id: 'NEW-3', content: 'Thiết kế nhận diện thương hiệu', company: 'Công ty Đồ họa XYZ', mst: '0103444555', contactName: 'Lê Minh', email: 'minh@xyzdesign.com', district: 'Cầu Giấy', ward: 'Nghĩa Đô', city: 'Hà Nội', projectedService: 'Design', assignedPartner: 'TMA', date: '15/04/2026', revenue: '50,000,000 ₫', probability: '15%', salesperson: 'Lê V', status: 'Mới', attachments: 0, avatars: [], tasks: [] },
    'FPT-1': { id: 'FPT-1', content: 'Cơ hội dịch vụ Cloud FPT', company: 'FPT Corp', mst: '0101248141', contactName: 'Trịnh Văn A', email: 'a@fpt.com', district: 'Cầu Giấy', ward: 'Dịch Vọng', city: 'Hà Nội', projectedService: 'Cloud', assignedPartner: 'Viettel', date: '01/01/2026', revenue: '500,000,000 ₫', probability: '10%', salesperson: 'Lê V', status: 'Đang tiếp xúc', attachments: 1, avatars: [], tasks: [{ id: 't1', type: 'mail', status: 'todo', title: 'Gửi báo giá chào mừng' }, { id: 't2', type: 'phone', status: 'overdue', title: 'Gọi xác nhận nhu cầu' }] },
    'VNPT-1': { id: 'VNPT-1', content: 'Thuê chỗ đặt Server', company: 'VNPT', mst: '0100684378', contactName: 'Lý T', email: 't@vnpt.vn', district: 'Đống Đa', ward: 'Láng Hạ', city: 'Hà Nội', projectedService: 'Server', assignedPartner: 'CMC', date: '02/01/2026', revenue: '200,000,000 ₫', probability: '30%', salesperson: 'Trần B', status: 'Đang tiếp xúc', attachments: 0, avatars: [], tasks: [{ id: 't3', type: 'meeting', status: 'today', title: 'Khảo sát DC' }] },
    'MB-1': { id: 'MB-1', content: 'Dịch vụ Email Marketing', company: 'MB Bank', mst: '0100283873', contactName: 'Hằng V', email: 'hang@mb.com', district: 'Đống Đa', ward: 'Cát Linh', city: 'Hà Nội', projectedService: 'Email CRM', assignedPartner: 'MatBao', date: '03/01/2026', revenue: '50,000,000 ₫', probability: '50%', salesperson: 'Nguyễn Văn A', status: 'Đánh giá nhu cầu', attachments: 0, avatars: [], tasks: [{ id: 't4', type: 'mail', status: 'done', title: 'Gửi profile' }, { id: 't5', type: 'meeting', status: 'todo', title: 'Trình bày giải pháp' }] },
    'VNM-1': { id: 'VNM-1', content: 'Tổng đài chăm sóc KH', company: 'Vinamilk', mst: '0300588569', contactName: 'Phượng N', email: 'phuong@vnm.vn', district: 'Quận 7', ward: 'Tân Phú', city: 'TP. Hồ Chí Minh', projectedService: 'Telesales', assignedPartner: 'Viettel', date: '04/01/2026', revenue: '1,500,000,000 ₫', probability: '60%', salesperson: 'Lê Thị C', status: 'Đang báo giá', attachments: 2, avatars: [], tasks: [{ id: 't6', type: 'phone', status: 'today', title: 'Xác nhận file báo giá' }] },
    'VCB-1': { id: 'VCB-1', content: 'Nâng cấp mạng nội bộ', company: 'Vietcombank', mst: '0100112437', contactName: 'Định N', email: 'dinh@vcb.com', district: 'Hoàn Kiếm', ward: 'Tràng Tiền', city: 'Hà Nội', projectedService: 'Network', assignedPartner: 'FPT IS', date: '05/01/2026', revenue: '3,000,000,000 ₫', probability: '70%', salesperson: 'Nguyễn Văn A', status: 'Đấu thầu', attachments: 4, avatars: [], tasks: [{ id: 't7', type: 'mail', status: 'overdue', title: 'Xin duyệt chi phí Mkt' }, { id: 't8', type: 'meeting', status: 'todo', title: 'Họp hội đồng quản trị' }, { id: 't9', type: 'mail', status: 'done', title: 'Báo cáo tháng' }] },
    'VIN-1': { id: 'VIN-1', content: 'Giải pháp ERP', company: 'Vingroup', mst: '0101245486', contactName: 'Trí L', email: 'tri@vin.com', district: 'Cầu Giấy', ward: 'Dịch Vọng Hậu', city: 'Hà Nội', projectedService: 'Tích hợp', assignedPartner: 'TMA', date: '06/01/2026', revenue: '4,000,000,000 ₫', probability: '80%', salesperson: 'Trần B', status: 'POC', attachments: 1, avatars: [], tasks: [{ id: 't10', type: 'phone', status: 'todo', title: 'Feedback POC' }] },
    'VHM-1': { id: 'VHM-1', content: 'Smart Home Hub', company: 'Vinhomes', mst: '0102671977', contactName: 'Vĩnh T', email: 'vinh@vinhomes.vn', district: 'Long Biên', ward: 'Phúc Lợi', city: 'Hà Nội', projectedService: 'IOT', assignedPartner: 'CMC', date: '07/01/2026', revenue: '8,000,000,000 ₫', probability: '90%', salesperson: 'Nguyễn Văn A', status: 'Kí hợp đồng', attachments: 3, avatars: [], tasks: [{ id: 't11', type: 'meeting', status: 'done', title: 'Ký biên bản' }, { id: 't12', type: 'mail', status: 'today', title: 'Gửi bản scan PDF HD' }] },
    'BAM-1': { id: 'BAM-1', content: 'Hệ thống tracking hành lý', company: 'Bamboo Airways', mst: '0107867370', contactName: 'Tuấn B', email: 'tuan@bamboo.vn', district: 'Cầu Giấy', ward: 'Dịch Vọng', city: 'Hà Nội', projectedService: 'Tracking', assignedPartner: 'Viettel IDC', date: '08/01/2026', revenue: '1,500,000,000 ₫', probability: '95%', salesperson: 'Trần B', status: 'Triển khai', attachments: 2, avatars: [], tasks: [{ id: 't13', type: 'meeting', status: 'overdue', title: 'Golive Demo' }] },
    'TCB-1': { id: 'TCB-1', content: 'Triển khai bảo mật AWS', company: 'Techcombank', mst: '0100230800', contactName: 'Dũng Đ', email: 'dung@tcb.vn', district: 'Hải Châu', ward: 'Thạch Thang', city: 'Đà Nẵng', projectedService: 'Security', assignedPartner: 'FPT IS', date: '09/01/2026', revenue: '3,000,000,000 ₫', probability: '100%', salesperson: 'Lê V', status: 'Thành công', attachments: 5, avatars: [], tasks: [{ id: 't14', type: 'mail', status: 'done', title: 'Nghiệm thu' }] },
    'TGDD-1': { id: 'TGDD-1', content: 'CRM Sales', company: 'Thế Giới Di Động', mst: '0303288350', contactName: 'Đạt T', email: 'dat@tgdd.vn', district: 'Quận 1', ward: 'Bến Nghé', city: 'TP. Hồ Chí Minh', projectedService: 'Salesforce', assignedPartner: 'MatBao', date: '10/01/2026', revenue: '120,000,000 ₫', probability: '0%', salesperson: 'Nguyễn Văn A', status: 'Không thành công', attachments: 0, avatars: [], tasks: [] }
  },
  productGroups: {
    'PG-1': { id: 'PG-1', name: 'Dịch vụ', description: 'Các dịch vụ chăm sóc khách hàng và hỗ trợ', status: 'Active' },
    'PG-2': { id: 'PG-2', name: 'Giải pháp', description: 'Các nền tảng công nghệ và giải pháp phần mềm', status: 'Active' }
  },
  productGroupIds: ['PG-1', 'PG-2'],
  productCategories: {
    'PC-1': { id: 'PC-1', groupId: 'PG-1', name: 'Dịch vụ Tổng đài CSKH toàn trình', description: 'Contact Center Outsourcing', status: 'Active' },
    'PC-2': { id: 'PC-2', groupId: 'PG-1', name: 'Dịch vụ cho thuê nhân sự hỗ trợ', description: 'BPO', status: 'Active' },
    'PC-3': { id: 'PC-3', groupId: 'PG-1', name: 'Dịch vụ Gia tăng doanh số', description: 'Upsale', status: 'Active' },
    'PC-4': { id: 'PC-4', groupId: 'PG-1', name: 'Dịch vụ Bảo hành & sửa chữa', description: 'Warranty & Repair Services', status: 'Active' },
    'PC-5': { id: 'PC-5', groupId: 'PG-1', name: 'Dịch vụ Tư vấn trải nghiệm khách hàng', description: 'Customer Experience', status: 'Active' },
    'PC-6': { id: 'PC-6', groupId: 'PG-1', name: 'Dịch vụ khách hàng thân thiết', description: 'Loyalty', status: 'Active' },
    'PC-7': { id: 'PC-7', groupId: 'PG-1', name: 'Dịch vụ Chỉnh lý và Số hóa Văn bản', description: 'Document Processing and Digitization', status: 'Active' },
    'PC-8': { id: 'PC-8', groupId: 'PG-2', name: 'OmniX - Nền tảng Tổng đài đa kênh hợp nhất', description: 'Giải pháp tổng đài đa kênh', status: 'Active' },
    'PC-9': { id: 'PC-9', groupId: 'PG-2', name: 'CXBot - Trợ lý ảo - AI Agent', description: 'Nhân viên tổng đài AI ảo', status: 'Active' },
    'PC-10': { id: 'PC-10', groupId: 'PG-2', name: 'vCOC - Hệ thống điều hành hoạt động dịch vụ khách hàng', description: 'Hệ thống điều hành DVKH', status: 'Active' },
    'PC-11': { id: 'PC-11', groupId: 'PG-2', name: 'WorkforceX - Hệ thống quản lý nguồn lực DVKH', description: 'Hệ thống quản lý nguồn lực DVKH', status: 'Active' },
    'PC-12': { id: 'PC-12', groupId: 'PG-2', name: 'InsightCI - Nền tảng quản lý, phân tích tương tác khách hàng', description: 'Nền tảng quản lý phân tích tương tác', status: 'Active' },
    'PC-13': { id: 'PC-13', groupId: 'PG-2', name: 'KnowX Hub - Hệ thống Quản lý Tri thức', description: 'Hệ thống Quản lý Tri thức', status: 'Active' },
    'PC-14': { id: 'PC-14', groupId: 'PG-2', name: 'AI-DMS - Nền tảng quản lý tài liệu thông minh', description: 'Nền tảng quản lý tài liệu thông minh', status: 'Active' }
  },
  productCategoryIds: ['PC-1', 'PC-2', 'PC-3', 'PC-4', 'PC-5', 'PC-6', 'PC-7', 'PC-8', 'PC-9', 'PC-10', 'PC-11', 'PC-12', 'PC-13', 'PC-14'],
  products: {
    'PRD-001': { id: 'PRD-001', categoryId: 'PC-8', name: 'License OmniX User/Tháng', description: 'License sử dụng nền tảng OmniX cho 1 User', price: 500000, unit: 'license', tax: 10, status: 'Active' },
    'PRD-002': { id: 'PRD-002', categoryId: 'PC-8', name: 'Phí khởi tạo hệ thống OmniX', description: 'Phí khởi tạo 1 lần', price: 10000000, unit: 'gói', tax: 10, status: 'Active' },
    'PRD-003': { id: 'PRD-003', categoryId: 'PC-9', name: 'License CXBot', description: 'Trợ lý ảo AI', price: 2000000, unit: 'license', tax: 10, status: 'Active' },
    'PRD-004': { id: 'PRD-004', categoryId: 'PC-1', name: 'Nhân sự CSKH toàn trình', description: 'Nhân sự CSKH', price: 15000000, unit: 'người/tháng', tax: 8, status: 'Active' },
    'PRD-005': { id: 'PRD-005', categoryId: 'PC-2', name: 'Nhân sự BPO nhập liệu', description: 'Nhân sự BPO', price: 12000000, unit: 'người/tháng', tax: 8, status: 'Active' }
  },
  productIds: ['PRD-001', 'PRD-002', 'PRD-003', 'PRD-004', 'PRD-005'],
  orders: {
    'ORD-2026-001': {
        id: 'ORD-2026-001', orderNo: 'DH-2026-001', contractId: 'CTR-2026-001', customerId: 'CUS-1',
        orderStatus: 'Đã xuất hóa đơn', orderDate: '2026-01-12', totalAmount: 1500000000, discountAmount: 0, notes: 'Khách hàng VIP, triển khai sớm',
        lines: [
            { id: 1, productId: 'PRD-002', productName: 'Phí Setup hệ thống', quantity: 1, unitPrice: 10000000, discount: 0, total: 10000000 }
        ]
    },
    'ORD-2026-002': {
        id: 'ORD-2026-002', orderNo: 'DH-2026-002', contractId: 'CTR-2026-002', customerId: 'CUS-2',
        orderStatus: 'Chờ duyệt công nợ', orderDate: '2026-02-15', totalAmount: 2500000000, discountAmount: 0, notes: 'Đang setup server',
        lines: [
            { id: 2, productId: 'PRD-001', productName: 'License OmniX User/Tháng', quantity: 10, unitPrice: 500000, discount: 0, total: 5000000 }
        ]
    },
    'ORD-2026-003': {
        id: 'ORD-2026-003', orderNo: 'DH-2026-003', contractId: 'CTR-2026-003', customerId: 'CUS-1',
        orderStatus: 'Dự thảo', orderDate: '2026-03-01', totalAmount: 850000000, discountAmount: 0, notes: '', lines: []
    },
    'ORD-2026-017-001': {
        id: 'ORD-2026-017-001', orderNo: 'DH-VTG-001', contractId: 'CTR-2026-017', customerId: 'CUS-9',
        orderStatus: 'Đã xuất hóa đơn', orderDate: '2026-05-10', totalAmount: 5000000, 
        lines: [
            { productId: 'PRD-001', qty: 4 } // Đã dùng 4/10 License OmniX
        ]
    },
    'ORD-2026-017-002': {
        id: 'ORD-2026-017-002', orderNo: 'DH-VTG-002', contractId: 'CTR-2026-017', customerId: 'CUS-9',
        orderStatus: 'Đã hủy', orderDate: '2026-05-12', totalAmount: 1000000, 
        lines: [
            { productId: 'PRD-001', qty: 2 } // Đã bị từ chối -> Phải được hoàn lại hạn mức
        ]
    },
    'ORD-2026-004': {
        id: 'ORD-2026-004', orderNo: 'DH-2026-004', contractId: 'CTR-2026-004', customerId: 'CUS-2',
        orderStatus: 'Dự thảo', orderDate: '2026-03-05', totalAmount: 3200000000, discountAmount: 0, notes: '', lines: []
    },
    'ORD-2026-005': {
        id: 'ORD-2026-005', orderNo: 'DH-2026-005', contractId: 'CTR-2026-005', customerId: 'CUS-2',
        orderStatus: 'Đã xuất hóa đơn', orderDate: '2026-01-20', totalAmount: 1000000000, discountAmount: 0, notes: '', lines: []
    },
    'ORD-2026-006': {
        id: 'ORD-2026-006', orderNo: 'DH-2026-006', contractId: 'CTR-2026-006', customerId: 'CUS-2',
        orderStatus: 'Đã hủy', orderDate: '2026-02-25', totalAmount: 5000000000, discountAmount: 0, notes: 'Khách hàng dời lịch', lines: []
    },
    'ORD-2026-007': {
        id: 'ORD-2026-007', orderNo: 'DH-2026-007', contractId: 'CTR-2026-007', customerId: 'CUS-2',
        orderStatus: 'Chờ duyệt công nợ', orderDate: '2026-02-10', totalAmount: 750000000, discountAmount: 0, notes: '', lines: []
    },
    'ORD-2026-008': {
        id: 'ORD-2026-008', orderNo: 'DH-2026-008', contractId: 'CTR-2026-008', customerId: 'CUS-2',
        orderStatus: 'Đã xuất hóa đơn', orderDate: '2026-03-15', totalAmount: 800000000, discountAmount: 0, notes: '', lines: []
    },
    'ORD-2026-009': {
        id: 'ORD-2026-009', orderNo: 'DH-2026-009', contractId: 'CTR-2026-009', customerId: 'CUS-2',
        orderStatus: 'Dự thảo', orderDate: '2026-04-10', totalAmount: 400000000, discountAmount: 0, notes: '', lines: []
    },
    'ORD-2026-010': {
        id: 'ORD-2026-010', orderNo: 'DH-2026-010', contractId: 'CTR-2026-010', customerId: 'CUS-2',
        orderStatus: 'Chờ duyệt công nợ', orderDate: '2026-01-05', totalAmount: 2000000000, discountAmount: 0, notes: '', lines: []
    }
  },
  orderIds: ['ORD-2026-001', 'ORD-2026-002', 'ORD-2026-003', 'ORD-2026-004', 'ORD-2026-005', 'ORD-2026-006', 'ORD-2026-007', 'ORD-2026-008', 'ORD-2026-009', 'ORD-2026-010'],
  partners: {
    'PRT-001': { id: 'PRT-001', name: 'Công ty CP Dịch vụ Hoa Sao', shortName: 'Hoa Sao', type: 'Tổng đài', contact: 'Nguyễn Văn Sao', email: 'info@hoasao.vn', phone: '02413305678' },
    'PRT-002': { id: 'PRT-002', name: 'Công ty TNHH GEM Global', shortName: 'GEM', type: 'outsourcing', contact: 'Trần Bá Thành', email: 'info@gem.com.vn', phone: '02813001199' },
    'PRT-003': { id: 'PRT-003', name: 'Công ty CP Hoa Kim', shortName: 'Hoa Kim', type: 'Nhân sự', contact: 'Lê Thị Kim', email: 'lienhe@hoakim.vn', phone: '02432005566' },
    'PRT-004': { id: 'PRT-004', name: 'Công ty CP CNTT TMA Solutions', shortName: 'TMA', type: 'Phần mềm', contact: 'Phạm Quốc Hoà', email: 'contact@tmasolutions.vn', phone: '02838123456' },
    'PRT-005': { id: 'PRT-005', name: 'Công ty TNHH Harveynash', shortName: 'HarveyNash', type: 'Nhân sự', contact: 'David Nguyen', email: 'vietnam@harveynash.com', phone: '02439745678' },
    'PRT-006': { id: 'PRT-006', name: 'Công ty TNHH Fujinet Systems', shortName: 'Fujinet', type: 'Phần mềm', contact: 'Cao Văn Phú', email: 'info@fujinet.vn', phone: '02432889900' }
  },
  partnerIds: ['PRT-001', 'PRT-002', 'PRT-003', 'PRT-004', 'PRT-005', 'PRT-006'],
  partnerBillings: {
    'PB-2026-001': { id: 'PB-2026-001', billingNo: 'CD-2026-001', partnerId: 'PRT-001', partnerName: 'Hoa Sao', contractRef: 'CTR-2026-001', serviceDesc: 'Cầp cung cấp nhân sự CSKH thoáng đài', billingDate: '2026-01-15', amount: 800000000, status: 'Hoàn thành', month: 1, year: 2026 },
    'PB-2026-002': { id: 'PB-2026-002', billingNo: 'CD-2026-002', partnerId: 'PRT-002', partnerName: 'GEM', contractRef: 'CTR-2026-004', serviceDesc: 'Nhân sự Telesales tháng 01', billingDate: '2026-01-20', amount: 1200000000, status: 'Đang triển khai', month: 1, year: 2026 },
    'PB-2026-003': { id: 'PB-2026-003', billingNo: 'CD-2026-003', partnerId: 'PRT-003', partnerName: 'Hoa Kim', contractRef: 'CTR-2026-008', serviceDesc: 'Cho thuê nhân sự IT tháng 01', billingDate: '2026-01-25', amount: 450000000, status: 'Hoàn thành', month: 1, year: 2026 },
    'PB-2026-004': { id: 'PB-2026-004', billingNo: 'CD-2026-004', partnerId: 'PRT-001', partnerName: 'Hoa Sao', contractRef: 'CTR-2026-001', serviceDesc: 'Cấp nhân sự CSKH tháng 02', billingDate: '2026-02-15', amount: 820000000, status: 'Hoàn thành', month: 2, year: 2026 },
    'PB-2026-005': { id: 'PB-2026-005', billingNo: 'CD-2026-005', partnerId: 'PRT-002', partnerName: 'GEM', contractRef: 'CTR-2026-004', serviceDesc: 'Nhân sự Telesales tháng 02', billingDate: '2026-02-20', amount: 1250000000, status: 'Đang triển khai', month: 2, year: 2026 },
    'PB-2026-006': { id: 'PB-2026-006', billingNo: 'CD-2026-006', partnerId: 'PRT-004', partnerName: 'TMA', contractRef: 'CTR-2026-002', serviceDesc: 'Phí lập trình viên OmniX tháng 02', billingDate: '2026-02-25', amount: 380000000, status: 'Hoàn thành', month: 2, year: 2026 },
    'PB-2026-007': { id: 'PB-2026-007', billingNo: 'CD-2026-007', partnerId: 'PRT-003', partnerName: 'Hoa Kim', contractRef: 'CTR-2026-008', serviceDesc: 'Cho thuê nhân sự IT tháng 02', billingDate: '2026-02-25', amount: 460000000, status: 'Hoàn thành', month: 2, year: 2026 },
    'PB-2026-008': { id: 'PB-2026-008', billingNo: 'CD-2026-008', partnerId: 'PRT-001', partnerName: 'Hoa Sao', contractRef: 'CTR-2026-001', serviceDesc: 'Cấp nhân sự CSKH tháng 03', billingDate: '2026-03-14', amount: 850000000, status: 'Đang triển khai', month: 3, year: 2026 },
    'PB-2026-009': { id: 'PB-2026-009', billingNo: 'CD-2026-009', partnerId: 'PRT-005', partnerName: 'HarveyNash', contractRef: 'CTR-2026-006', serviceDesc: 'Cung ứng nhân lực dự án WorkForceX', billingDate: '2026-03-20', amount: 2100000000, status: 'Đang triển khai', month: 3, year: 2026 },
    'PB-2026-010': { id: 'PB-2026-010', billingNo: 'CD-2026-010', partnerId: 'PRT-006', partnerName: 'Fujinet', contractRef: 'CTR-2026-003', serviceDesc: 'Phí bảo trì KnowxHub tháng 03', billingDate: '2026-03-25', amount: 280000000, status: 'Hoàn thành', month: 3, year: 2026 },
    'PB-2026-011': { id: 'PB-2026-011', billingNo: 'CD-2026-011', partnerId: 'PRT-002', partnerName: 'GEM', contractRef: 'CTR-2026-004', serviceDesc: 'Nhân sự Telesales tháng 03', billingDate: '2026-03-28', amount: 1280000000, status: 'Đang triển khai', month: 3, year: 2026 },
    'PB-2026-012': { id: 'PB-2026-012', billingNo: 'CD-2026-012', partnerId: 'PRT-004', partnerName: 'TMA', contractRef: 'CTR-2026-002', serviceDesc: 'Phí lập trình viên OmniX tháng 03', billingDate: '2026-03-30', amount: 400000000, status: 'Đang triển khai', month: 3, year: 2026 },
    'PB-2026-013': { id: 'PB-2026-013', billingNo: 'CD-2026-013', partnerId: 'PRT-001', partnerName: 'Hoa Sao', contractRef: 'CTR-2026-010', serviceDesc: 'Cấp nhân sự CSKH Viettel Tháng 04', billingDate: '2026-04-10', amount: 870000000, status: 'Đang triển khai', month: 4, year: 2026 },
    'PB-2026-014': { id: 'PB-2026-014', billingNo: 'CD-2026-014', partnerId: 'PRT-003', partnerName: 'Hoa Kim', contractRef: 'CTR-2026-008', serviceDesc: 'Cho thuê nhân sự IT tháng 04', billingDate: '2026-04-12', amount: 470000000, status: 'Đang triển khai', month: 4, year: 2026 }
  },
  partnerBillingIds: ['PB-2026-001','PB-2026-002','PB-2026-003','PB-2026-004','PB-2026-005','PB-2026-006','PB-2026-007','PB-2026-008','PB-2026-009','PB-2026-010','PB-2026-011','PB-2026-012','PB-2026-013','PB-2026-014'],
  outboundReconciliations: {
    'OBR-2026-001': {
      id: 'OBR-2026-001', reconcNo: 'DS-2026-001',
      partnerId: 'PRT-001', partnerName: 'Hoa Sao', partnerFullName: 'Công ty CP Dịch vụ Hoa Sao',
      contractRef: 'CTR-2026-001', contractNo: 'HD/2026/001',
      month: 1, year: 2026, status: 'Đã xác nhận',
      seatTableFileName: 'bang_cong_seat_T01_2026_HoaSao.xlsx',
      seatItems: [
        { id: 1, zone: 'Hồ Chí Minh', type: 'Loại 1', totalWork: 634.5, standardSeats: 25.0, seatsPayable: 25.38 },
        { id: 2, zone: 'Hồ Chí Minh', type: 'Loại 3', totalWork: 5869.5, standardSeats: 25.0, seatsPayable: 214.78 }
      ],
      penaltyItems: [
        { id: 1, content: 'Điểm đạt 89.09 dưới ngưỡng điểm chuẩn 5.91 điểm', zone: 'Hồ Chí Minh', penaltyRate: 0.47, baseCost: 2916508880, penaltyAmount: 13707592, note: '' }
      ],
      seatPrices: [
        { id: 1, type: 'Loại 1', zone: 'Hồ Chí Minh', seatsPayable: 25.38, unitPrice: 11518000, totalPayment: 292326840 },
        { id: 2, type: 'Loại 3', zone: 'Hồ Chí Minh', seatsPayable: 214.78, unitPrice: 12218000, totalPayment: 2624182040 }
      ],
      totalSeatsPayment: 2916508880, totalPenalty: 13707592,
      totalAfterPenalty: 2902801288, vatRate: 8, vatAmount: 232224103, grandTotal: 3135025391,
      notes: '', createdDate: '2026-02-05', confirmedDate: '2026-02-10'
    },
    'OBR-2026-002': {
      id: 'OBR-2026-002', reconcNo: 'DS-2026-002',
      partnerId: 'PRT-002', partnerName: 'GEM', partnerFullName: 'Công ty TNHH GEM Global',
      contractRef: 'CTR-2026-004', contractNo: 'HD/2026/004',
      month: 1, year: 2026, status: 'Đã xác nhận',
      seatTableFileName: 'bang_cong_seat_T01_2026_GEM.xlsx',
      seatItems: [
        { id: 1, zone: 'Hà Nội', type: 'Loại 1', totalWork: 1240.0, standardSeats: 20.0, seatsPayable: 62.0 },
        { id: 2, zone: 'Hà Nội', type: 'Loại 2', totalWork: 820.0, standardSeats: 20.0, seatsPayable: 41.0 }
      ],
      penaltyItems: [],
      seatPrices: [
        { id: 1, type: 'Loại 1', zone: 'Hà Nội', seatsPayable: 62.0, unitPrice: 10500000, totalPayment: 651000000 },
        { id: 2, type: 'Loại 2', zone: 'Hà Nội', seatsPayable: 41.0, unitPrice: 9800000, totalPayment: 401800000 }
      ],
      totalSeatsPayment: 1052800000, totalPenalty: 0,
      totalAfterPenalty: 1052800000, vatRate: 8, vatAmount: 84224000, grandTotal: 1137024000,
      notes: '', createdDate: '2026-02-08', confirmedDate: '2026-02-15'
    },
    'OBR-2026-003': {
      id: 'OBR-2026-003', reconcNo: 'DS-2026-003',
      partnerId: 'PRT-003', partnerName: 'Hoa Kim', partnerFullName: 'Công ty CP Hoa Kim',
      contractRef: 'CTR-2026-008', contractNo: 'HD/2026/008',
      month: 1, year: 2026, status: 'Đã xác nhận',
      seatTableFileName: 'bang_cong_seat_T01_2026_HoaKim.xlsx',
      seatItems: [
        { id: 1, zone: 'TP.HCM', type: 'Loại 1', totalWork: 420.0, standardSeats: 15.0, seatsPayable: 28.0 }
      ],
      penaltyItems: [],
      seatPrices: [
        { id: 1, type: 'Loại 1', zone: 'TP.HCM', seatsPayable: 28.0, unitPrice: 12000000, totalPayment: 336000000 }
      ],
      totalSeatsPayment: 336000000, totalPenalty: 0,
      totalAfterPenalty: 336000000, vatRate: 8, vatAmount: 26880000, grandTotal: 362880000,
      notes: '', createdDate: '2026-02-06', confirmedDate: '2026-02-12'
    },
    'OBR-2026-004': {
      id: 'OBR-2026-004', reconcNo: 'DS-2026-004',
      partnerId: 'PRT-001', partnerName: 'Hoa Sao', partnerFullName: 'Công ty CP Dịch vụ Hoa Sao',
      contractRef: 'CTR-2026-001', contractNo: 'HD/2026/001',
      month: 2, year: 2026, status: 'Đã xác nhận',
      seatTableFileName: 'bang_cong_seat_T02_2026_HoaSao.xlsx',
      seatItems: [
        { id: 1, zone: 'Hồ Chí Minh', type: 'Loại 1', totalWork: 598.0, standardSeats: 25.0, seatsPayable: 23.92 },
        { id: 2, zone: 'Hồ Chí Minh', type: 'Loại 3', totalWork: 5680.0, standardSeats: 25.0, seatsPayable: 227.2 }
      ],
      penaltyItems: [
        { id: 1, content: 'Tỷ lệ cuộc gọi lỡ vượt ngưỡng 5%', zone: 'Hồ Chí Minh', penaltyRate: 0.3, baseCost: 2850000000, penaltyAmount: 8550000, note: '' }
      ],
      seatPrices: [
        { id: 1, type: 'Loại 1', zone: 'Hồ Chí Minh', seatsPayable: 23.92, unitPrice: 11518000, totalPayment: 275470560 },
        { id: 2, type: 'Loại 3', zone: 'Hồ Chí Minh', seatsPayable: 227.2, unitPrice: 12218000, totalPayment: 2773929600 }
      ],
      totalSeatsPayment: 3049400160, totalPenalty: 8550000,
      totalAfterPenalty: 3040850160, vatRate: 8, vatAmount: 243268013, grandTotal: 3284118173,
      notes: '', createdDate: '2026-03-05', confirmedDate: '2026-03-10'
    },
    'OBR-2026-005': {
      id: 'OBR-2026-005', reconcNo: 'DS-2026-005',
      partnerId: 'PRT-002', partnerName: 'GEM', partnerFullName: 'Công ty TNHH GEM Global',
      contractRef: 'CTR-2026-004', contractNo: 'HD/2026/004',
      month: 2, year: 2026, status: 'Điều chỉnh',
      seatTableFileName: 'bang_cong_seat_T02_2026_GEM.xlsx',
      seatItems: [
        { id: 1, zone: 'Hà Nội', type: 'Loại 1', totalWork: 1180.0, standardSeats: 20.0, seatsPayable: 59.0 },
        { id: 2, zone: 'Hà Nội', type: 'Loại 2', totalWork: 800.0, standardSeats: 20.0, seatsPayable: 40.0 }
      ],
      penaltyItems: [
        { id: 1, content: 'Chất lượng dịch vụ không đạt KPI tháng 2', zone: 'Hà Nội', penaltyRate: 1.0, baseCost: 1022500000, penaltyAmount: 10225000, note: 'Đang xem xét' }
      ],
      seatPrices: [
        { id: 1, type: 'Loại 1', zone: 'Hà Nội', seatsPayable: 59.0, unitPrice: 10500000, totalPayment: 619500000 },
        { id: 2, type: 'Loại 2', zone: 'Hà Nội', seatsPayable: 40.0, unitPrice: 9800000, totalPayment: 392000000 }
      ],
      totalSeatsPayment: 1011500000, totalPenalty: 10225000,
      totalAfterPenalty: 1001275000, vatRate: 8, vatAmount: 80102000, grandTotal: 1081377000,
      notes: 'GEM đang phản hồi về mức phạt', createdDate: '2026-03-06', confirmedDate: ''
    },
    'OBR-2026-006': {
      id: 'OBR-2026-006', reconcNo: 'DS-2026-006',
      partnerId: 'PRT-001', partnerName: 'Hoa Sao', partnerFullName: 'Công ty CP Dịch vụ Hoa Sao',
      contractRef: 'CTR-2026-001', contractNo: 'HD/2026/001',
      month: 3, year: 2026, status: 'Chờ xác nhận',
      seatTableFileName: 'bang_cong_seat_T03_2026_HoaSao.xlsx',
      seatItems: [
        { id: 1, zone: 'Hồ Chí Minh', type: 'Loại 1', totalWork: 620.0, standardSeats: 25.0, seatsPayable: 24.8 },
        { id: 2, zone: 'Hồ Chí Minh', type: 'Loại 3', totalWork: 5910.0, standardSeats: 25.0, seatsPayable: 236.4 }
      ],
      penaltyItems: [],
      seatPrices: [
        { id: 1, type: 'Loại 1', zone: 'Hồ Chí Minh', seatsPayable: 24.8, unitPrice: 11518000, totalPayment: 285646400 },
        { id: 2, type: 'Loại 3', zone: 'Hồ Chí Minh', seatsPayable: 236.4, unitPrice: 12218000, totalPayment: 2888335200 }
      ],
      totalSeatsPayment: 3173981600, totalPenalty: 0,
      totalAfterPenalty: 3173981600, vatRate: 8, vatAmount: 253918528, grandTotal: 3427900128,
      notes: '', createdDate: '2026-04-05', confirmedDate: ''
    },
    'OBR-2026-007': {
      id: 'OBR-2026-007', reconcNo: 'DS-2026-007',
      partnerId: 'PRT-005', partnerName: 'HarveyNash', partnerFullName: 'Công ty TNHH Harveynash',
      contractRef: 'CTR-2026-006', contractNo: 'HD/2026/006',
      month: 3, year: 2026, status: 'Nháp',
      seatTableFileName: '',
      seatItems: [
        { id: 1, zone: 'Hà Nội', type: 'Senior Dev', totalWork: 880.0, standardSeats: 22.0, seatsPayable: 40.0 }
      ],
      penaltyItems: [],
      seatPrices: [
        { id: 1, type: 'Senior Dev', zone: 'Hà Nội', seatsPayable: 40.0, unitPrice: 35000000, totalPayment: 1400000000 }
      ],
      totalSeatsPayment: 1400000000, totalPenalty: 0,
      totalAfterPenalty: 1400000000, vatRate: 8, vatAmount: 112000000, grandTotal: 1512000000,
      notes: '', createdDate: '2026-04-08', confirmedDate: ''
    },
    'OBR-2026-008': {
      id: 'OBR-2026-008', reconcNo: 'DS-2026-008',
      partnerId: 'PRT-002', partnerName: 'GEM', partnerFullName: 'Công ty TNHH GEM Global',
      contractRef: 'CTR-2026-004', contractNo: 'HD/2026/004',
      month: 3, year: 2026, status: 'Nháp',
      seatTableFileName: '',
      seatItems: [],
      penaltyItems: [],
      seatPrices: [],
      totalSeatsPayment: 0, totalPenalty: 0,
      totalAfterPenalty: 0, vatRate: 8, vatAmount: 0, grandTotal: 0,
      notes: '', createdDate: '2026-04-09', confirmedDate: ''
    }
  },
  outboundReconciliationIds: ['OBR-2026-001','OBR-2026-002','OBR-2026-003','OBR-2026-004','OBR-2026-005','OBR-2026-006','OBR-2026-007','OBR-2026-008'],
  inboundReconciliations: {
    'IBR-2026-001': {
      id: 'IBR-2026-001', reconcNo: 'DSKH-2026-001',
      customerId: 'CUS-3', customerName: 'Viettel Telecom', shortName: 'VTT',
      contractNo: 'HD/2026/004',
      month: 3, year: 2026, status: 'Đã xác nhận',
      kpiItems: [
        { id: 1, category: 'Tỷ lệ kết nối thành công', subCategory: 'Tổng đài 18008000_N2', target: '>= 95%', result: '99.26%', evaluation: 'Đạt' },
        { id: 2, category: 'Mức độ hài lòng Khách hàng', subCategory: 'Mức độ hài lòng kênh FO', target: '>= 85', result: '96.54%', evaluation: 'Đạt' }
      ],
      slaScore: 98,
      penaltyRate: 0, 
      seatItems: [
        { id: 1, description: 'Dịch vụ tổng đài 18008000 (N2,N3,N4,N5), 1789N3, Email', seats: 32.02, unitPrice: 15133948, total: 484589015 },
        { id: 2, description: 'Kiểm duyệt hồ sơ', seats: 2.00, unitPrice: 15133948, total: 30267896 }
      ],
      totalBeforePenalty: 514856911, penaltyAmount: 0, totalAfterPenalty: 514856911,
      vatRate: 8, vatAmount: 41188553, grandTotal: 556045464,
      notes: '', createdDate: '2026-04-05', confirmedDate: '2026-04-10'
    },
    'IBR-2026-002': {
      id: 'IBR-2026-002', reconcNo: 'DSKH-2026-002', customerId: 'CUS-4', customerName: 'Viettel Solution', shortName: 'VTS',
      contractNo: 'HD/2026/002', month: 4, year: 2026, status: 'Chờ xác nhận', slaScore: 100, penaltyRate: 0,
      seatItems: [{ id: 1, description: 'Dịch vụ ERP Cloud', seats: 10.0, unitPrice: 25000000, total: 250000000 }],
      totalBeforePenalty: 250000000, penaltyAmount: 0, totalAfterPenalty: 250000000, vatRate: 8, vatAmount: 20000000, grandTotal: 270000000,
      notes: '', createdDate: '2026-04-13', confirmedDate: ''
    },
    'IBR-2026-003': {
      id: 'IBR-2026-003', reconcNo: 'DSKH-2026-003', customerId: 'CUS-5', customerName: 'Viettel Post', shortName: 'VTP',
      contractNo: 'HD/2026/003', month: 3, year: 2026, status: 'Đã xác nhận', slaScore: 95, penaltyRate: 0.5,
      seatItems: [{ id: 1, description: 'Bảo trì hệ thống KnowxHub', seats: 1.0, unitPrice: 850000000, total: 850000000 }],
      totalBeforePenalty: 850000000, penaltyAmount: 4250000, totalAfterPenalty: 845750000, vatRate: 8, vatAmount: 67660000, grandTotal: 913410000,
      notes: '', createdDate: '2026-04-05', confirmedDate: '2026-04-08'
    },
    'IBR-2026-004': {
      id: 'IBR-2026-004', reconcNo: 'DSKH-2026-004', customerId: 'CUS-6', customerName: 'Viettel Digital', shortName: 'VDG',
      contractNo: 'HD/2026/005', month: 2, year: 2026, status: 'Đã xác nhận', slaScore: 92, penaltyRate: 1,
      seatItems: [{ id: 1, description: 'Dịch vụ Digital Marketing', seats: 5.0, unitPrice: 40000000, total: 200000000 }],
      totalBeforePenalty: 200000000, penaltyAmount: 2000000, totalAfterPenalty: 198000000, vatRate: 8, vatAmount: 15840000, grandTotal: 213840000,
      notes: '', createdDate: '2026-03-05', confirmedDate: '2026-03-12'
    },
    'IBR-2026-005': {
      id: 'IBR-2026-005', reconcNo: 'DSKH-2026-005', customerId: 'CUS-7', customerName: 'Viettel HighTech', shortName: 'VHT',
      contractNo: 'HD/2026/011', month: 3, year: 2026, status: 'Điều chỉnh', slaScore: 88, penaltyRate: 2,
      seatItems: [{ id: 1, description: 'Hỗ trợ kỹ thuật phần cứng', seats: 100.0, unitPrice: 300000, total: 30000000 }],
      totalBeforePenalty: 30000000, penaltyAmount: 600000, totalAfterPenalty: 29400000, vatRate: 8, vatAmount: 2352000, grandTotal: 31752000,
      notes: 'Khách hàng đang khiếu nại mức phạt SLA', createdDate: '2026-04-05', confirmedDate: ''
    },
    'IBR-2026-006': {
      id: 'IBR-2026-006', reconcNo: 'DSKH-2026-006', customerId: 'CUS-8', customerName: 'Viettel Networks', shortName: 'VTN',
      contractNo: 'HD/2026/014', month: 1, year: 2026, status: 'Đã xác nhận', slaScore: 99, penaltyRate: 0,
      seatItems: [{ id: 1, description: 'Thuê hạ tầng mạng', seats: 1.0, unitPrice: 350000000, total: 350000000 }],
      totalBeforePenalty: 350000000, penaltyAmount: 0, totalAfterPenalty: 350000000, vatRate: 8, vatAmount: 28000000, grandTotal: 378000000,
      notes: '', createdDate: '2026-02-05', confirmedDate: '2026-02-10'
    },
    'IBR-2026-007': {
      id: 'IBR-2026-007', reconcNo: 'DSKH-2026-007', customerId: 'CUS-3', customerName: 'Viettel Telecom', shortName: 'VTT',
      contractNo: 'HD/2026/001', month: 1, year: 2026, status: 'Đã xác nhận', slaScore: 97, penaltyRate: 0,
      seatItems: [{ id: 1, description: 'Dịch vụ CSKH Tháng 01', seats: 50.0, unitPrice: 15000000, total: 750000000 }],
      totalBeforePenalty: 750000000, penaltyAmount: 0, totalAfterPenalty: 750000000, vatRate: 8, vatAmount: 60000000, grandTotal: 810000000,
      notes: '', createdDate: '2026-02-05', confirmedDate: '2026-02-15'
    },
    'IBR-2026-008': {
      id: 'IBR-2026-008', reconcNo: 'DSKH-2026-008', customerId: 'CUS-4', customerName: 'Viettel Solution', shortName: 'VTS',
      contractNo: 'HD/2026/006', month: 2, year: 2026, status: 'Đã xác nhận', slaScore: 96, penaltyRate: 0,
      seatItems: [{ id: 1, description: 'Dự án WorkForceX Phase 1', seats: 1.0, unitPrice: 1200000000, total: 1200000000 }],
      totalBeforePenalty: 1200000000, penaltyAmount: 0, totalAfterPenalty: 1200000000, vatRate: 8, vatAmount: 96000000, grandTotal: 1296000000,
      notes: '', createdDate: '2026-03-05', confirmedDate: '2026-03-10'
    },
    'IBR-2026-009': {
      id: 'IBR-2026-009', reconcNo: 'DSKH-2026-009', customerId: 'CUS-5', customerName: 'Viettel Post', shortName: 'VTP',
      contractNo: 'HD/2026/007', month: 1, year: 2026, status: 'Đã xác nhận', slaScore: 94, penaltyRate: 1,
      seatItems: [{ id: 1, description: 'Hệ thống tracking hành lý', seats: 1.0, unitPrice: 750000000, total: 750000000 }],
      totalBeforePenalty: 750000000, penaltyAmount: 7500000, totalAfterPenalty: 742500000, vatRate: 8, vatAmount: 59400000, grandTotal: 801900000,
      notes: '', createdDate: '2026-02-05', confirmedDate: '2026-02-08'
    },
    'IBR-2026-010': {
      id: 'IBR-2026-010', reconcNo: 'DSKH-2026-010', customerId: 'CUS-3', customerName: 'Viettel Telecom', shortName: 'VTT',
      contractNo: 'HD/2026/004', month: 4, year: 2026, status: 'Nháp', slaScore: 0, penaltyRate: 0,
      seatItems: [{ id: 1, description: 'Dịch vụ tổng đài April 2026', seats: 35.0, unitPrice: 15133948, total: 529688180 }],
      totalBeforePenalty: 529688180, penaltyAmount: 0, totalAfterPenalty: 529688180, vatRate: 8, vatAmount: 42375054, grandTotal: 572063234,
      notes: 'Bản thảo cho đối soát tháng 4', createdDate: '2026-04-14', confirmedDate: ''
    }
  },
  inboundReconciliationIds: ['IBR-2026-001','IBR-2026-002','IBR-2026-003','IBR-2026-004','IBR-2026-005','IBR-2026-006','IBR-2026-007','IBR-2026-008','IBR-2026-009','IBR-2026-010'],
  users: {
    'USR-001': { id: 'USR-001', username: 'admin', fullName: 'Administrator', email: 'admin@viettel.com.vn', role: 'Quản trị hệ thống', department: 'TT Công nghệ Thông tin', status: 'Active', lastLogin: '2026-04-14 08:30' },
    'USR-002': { id: 'USR-002', username: 'hung.nv', fullName: 'Nguyễn Văn Hùng', email: 'hung.nv@viettel.com.vn', role: 'Giám đốc kinh doanh', department: 'Phòng Bán hàng', status: 'Active', lastLogin: '2026-04-14 07:15' },
    'USR-003': { id: 'USR-003', username: 'phuong.tt', fullName: 'Trần Thị Phương', email: 'phuong.tt@viettel.com.vn', role: 'Kế toán trưởng', department: 'Phòng Tài chính', status: 'Active', lastLogin: '2026-04-13 17:45' },
    'USR-004': { id: 'USR-004', username: 'thanh.le', fullName: 'Lê Văn Thanh', email: 'thanh.le@viettel.com.vn', role: 'Chuyên viên AM', department: 'Phòng Bán hàng', status: 'Inactive', lastLogin: '2026-04-10 09:00' }
  },
  userIds: ['USR-001', 'USR-002', 'USR-003', 'USR-004'],
  roles: {
    'ROL-001': { id: 'ROL-001', name: 'Quản trị hệ thống', description: 'Toàn quyền điều hành hệ thống, quản lý người dùng và tham số.', status: 'Active', userCount: 1 },
    'ROL-002': { id: 'ROL-002', name: 'Giám đốc kinh doanh', description: 'Xem toàn bộ báo cáo, phê duyệt các hợp đồng và mục tiêu lớn.', status: 'Active', userCount: 1 },
    'ROL-003': { id: 'ROL-003', name: 'Chuyên viên AM', description: 'Quản lý Lead, Cơ hội, Hợp đồng và Đơn hàng của cá nhân phụ trách.', status: 'Active', userCount: 10 },
    'ROL-004': { id: 'ROL-004', name: 'Kế toán', description: 'Quản lý đối soát, tính cước và công nợ khách hàng/đối tác.', status: 'Active', userCount: 3 }
  },
  roleIds: ['ROL-001', 'ROL-002', 'ROL-003', 'ROL-004'],
  projects: {
    'PRJ-001': { id: 'PRJ-001', name: 'Triển khai OmniX Viettel Pay', customer: 'Viettel Digital', manager: 'Nguyễn Văn A', status: 'On Track', tasks: 25, completed: 18, deadline: '2026-06-15', color: '#3b82f6' },
    'PRJ-002': { id: 'PRJ-002', name: 'Nâng cấp KnowxHUB VCB', customer: 'Vietcombank', manager: 'Trần B', status: 'At Risk', tasks: 40, completed: 12, deadline: '2026-05-20', color: '#f59e0b' },
    'PRJ-003': { id: 'PRJ-003', name: 'Dịch vụ BPO MB Bank Q3', customer: 'MB Bank', manager: 'Lê Thị C', status: 'On Track', tasks: 15, completed: 15, deadline: '2026-04-30', color: '#16a34a' },
    'PRJ-004': { id: 'PRJ-004', name: 'Setup hạ tầng Cloud Vinamilk', customer: 'Vinamilk', manager: 'admin', status: 'Off Track', tasks: 30, completed: 5, deadline: '2026-08-10', color: '#ef4444' }
  },
  projectIds: ['PRJ-001', 'PRJ-002', 'PRJ-003', 'PRJ-004'],
  projectTasks: {},
  campaigns: {
    'CMP-001': { id: 'CMP-001', name: 'Chiến dịch Email Q2/2026', type: 'Email Marketing', target: 'Khách hàng tiềm năng', status: 'Running', startDate: '2026-04-01', endDate: '2026-06-30', sentCount: 1200, openRate: '15%' },
    'CMP-002': { id: 'CMP-002', name: 'Sự kiện Offline Viettel Day', type: 'Event', target: 'Khách hàng VIP', status: 'Draft', startDate: '2026-05-15', endDate: '2026-05-15', sentCount: 0, openRate: '0%' }
  },
  campaignIds: ['CMP-001', 'CMP-002'],
  tickets: {
    'TIC-001': { id: 'TIC-001', title: 'Lỗi không login được Portal', customerName: 'Vinamilk', priority: 'High', status: 'Open', createdDate: '2026-04-13 14:20', assignedTo: 'admin' },
    'TIC-002': { id: 'TIC-002', title: 'Yêu cầu xuất lại hóa đơn T3', customerName: 'MB Bank', priority: 'Medium', status: 'In progress', createdDate: '2026-04-14 09:00', assignedTo: 'hung.nv' }
  },
  ticketIds: ['TIC-001', 'TIC-002'],
  loyaltyPrograms: {
    'LYP-001': { id: 'LYP-001', name: 'Khách hàng Thân thiết 2026', type: 'Tiered', status: 'Active', members: 1500, pointsFormula: '100,000 VND = 1 Point' },
    'LYP-002': { id: 'LYP-002', name: 'Ưu đãi Đối tác Công nghệ', type: 'Discount', status: 'Active', members: 50, pointsFormula: 'N/A' }
  },
  loyaltyProgramIds: ['LYP-001', 'LYP-002'],
  customerSurveys: {
    'SRV-001': { id: 'SRV-001', title: 'Khảo sát sau triển khai dự án OmniX', customerName: 'Vinamilk', channel: 'Email', score: 4, status: 'Đã gửi', createdDate: '2026-04-14', owner: 'Trần B' },
    'SRV-002': { id: 'SRV-002', title: 'Khảo sát mức độ hài lòng dịch vụ CSKH', customerName: 'MB Bank', channel: 'Điện thoại', score: 5, status: 'Đã phản hồi', createdDate: '2026-04-15', owner: 'Nguyễn Văn A' }
  },
  customerSurveyIds: ['SRV-001', 'SRV-002']
};

const STORE_KEY = 'liteErpDataStore_v7';

export const mockStore = {
  getStore: () => {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) {
      localStorage.setItem(STORE_KEY, JSON.stringify(INITIAL_DATA));
      return INITIAL_DATA;
    }
    const store = JSON.parse(raw);
    
    let migrated = false;
    // MIGRATION: Fix status strings (Legacy English -> Vietnamese)
    const statusMigrationMap = {
      'New': 'Mới',
      'Converted': 'Thành công',
      'Lost': 'Không thành công',
      'Thua': 'Không thành công'
    };

    if (store.tasks) {
      Object.keys(store.tasks).forEach(id => {
        const t = store.tasks[id];
        if (statusMigrationMap[t.status]) {
          t.status = statusMigrationMap[t.status];
          migrated = true;
        }
      });
    }
    if (store.oppTasks) {
      Object.keys(store.oppTasks).forEach(id => {
        const o = store.oppTasks[id];
        if (statusMigrationMap[o.status]) {
          o.status = statusMigrationMap[o.status];
          migrated = true;
        }
      });
    }
    if (store.columns) {
      store.columns.forEach(col => {
        if (statusMigrationMap[col.title]) {
          col.title = statusMigrationMap[col.title];
          migrated = true;
        }
      });
    }
    if (store.oppColumns) {
      store.oppColumns.forEach(col => {
        if (statusMigrationMap[col.title]) {
          col.title = statusMigrationMap[col.title];
          migrated = true;
        }
      });
    }

    if (migrated) {
      localStorage.setItem(STORE_KEY, JSON.stringify(store));
    }
    
    // Resilience: ensure new keys from INITIAL_DATA are present
    if (!store.customers) store.customers = INITIAL_DATA.customers;
    
    // Deep Merge for Customer fields (to handle new columns like classification, industry, tag)
    Object.keys(INITIAL_DATA.customers).forEach(id => {
      if (store.customers[id]) {
        store.customers[id] = { ...INITIAL_DATA.customers[id], ...store.customers[id] };
        // If the store version has '---' or empty string for these new fields, prioritize INITIAL_DATA for demo
        const fieldsToOverwrite = ['classification', 'industry', 'website', 'tag'];
        fieldsToOverwrite.forEach(f => {
          if (!store.customers[id][f] || store.customers[id][f] === '---') {
            store.customers[id][f] = INITIAL_DATA.customers[id][f];
          }
        });
      } else {
        store.customers[id] = INITIAL_DATA.customers[id];
      }
    });

    // Always ensure all INITIAL_DATA customerIds are present (handles new customers added to INITIAL_DATA)
    if (!store.customerIds) store.customerIds = INITIAL_DATA.customerIds;
    else {
      INITIAL_DATA.customerIds.forEach(id => {
        if (!store.customerIds.includes(id)) store.customerIds.push(id);
      });
    }
    if (!store.contacts) store.contacts = INITIAL_DATA.contacts;
    if (!store.contactIds) store.contactIds = INITIAL_DATA.contactIds;
    if (!store.contracts) store.contracts = INITIAL_DATA.contracts || {};
    if (!store.contractIds) store.contractIds = INITIAL_DATA.contractIds || [];
    
    // Auto-inject mock contracts if missing to ensure testing data always loads
    Object.keys(INITIAL_DATA.contracts).forEach(cId => {
      if (!store.contracts[cId] || cId !== 'CTR-2026-001') {
        store.contracts[cId] = INITIAL_DATA.contracts[cId];
        if (!store.contractIds.includes(cId)) {
           store.contractIds.push(cId);
        }
      }
    });

    if (!store.tasks) store.tasks = INITIAL_DATA.tasks || {};
    if (!store.goals) store.goals = INITIAL_DATA.goals || {};
    if (!store.goalIds) store.goalIds = INITIAL_DATA.goalIds || [];
    
    // Force inject all mock goals to ensure environment consistency
    Object.keys(INITIAL_DATA.goals || {}).forEach(gId => {
       store.goals[gId] = INITIAL_DATA.goals[gId];
       if (!store.goalIds.includes(gId)) {
          store.goalIds.push(gId);
       }
    });
    
    // Inject products and force add mock products
    if (!store.products) store.products = INITIAL_DATA.products || {};
    if (!store.productIds) store.productIds = INITIAL_DATA.productIds || [];
    Object.keys(INITIAL_DATA.products || {}).forEach(pId => {
      if (!store.products[pId]) {
        store.products[pId] = INITIAL_DATA.products[pId];
        if (!store.productIds.includes(pId)) store.productIds.push(pId);
      }
    });
    
    if (!store.orders) store.orders = INITIAL_DATA.orders || {};
    if (!store.orderIds) store.orderIds = INITIAL_DATA.orderIds || [];
    // Inject partners and partner billings
    if (!store.partners) store.partners = INITIAL_DATA.partners || {};
    if (!store.partnerIds) store.partnerIds = INITIAL_DATA.partnerIds || [];
    if (!store.partnerBillings) store.partnerBillings = INITIAL_DATA.partnerBillings || {};
    if (!store.partnerBillingIds) store.partnerBillingIds = INITIAL_DATA.partnerBillingIds || [];
    // Always inject new partner billings
    Object.keys(INITIAL_DATA.partnerBillings || {}).forEach(pbId => {
      if (!store.partnerBillings[pbId]) {
        store.partnerBillings[pbId] = INITIAL_DATA.partnerBillings[pbId];
        if (!store.partnerBillingIds.includes(pbId)) store.partnerBillingIds.push(pbId);
      }
    });
    // Inject outbound reconciliations
    if (!store.outboundReconciliations) store.outboundReconciliations = INITIAL_DATA.outboundReconciliations || {};
    if (!store.outboundReconciliationIds) store.outboundReconciliationIds = INITIAL_DATA.outboundReconciliationIds || [];
    Object.keys(INITIAL_DATA.outboundReconciliations || {}).forEach(rId => {
      if (!store.outboundReconciliations[rId]) {
        store.outboundReconciliations[rId] = INITIAL_DATA.outboundReconciliations[rId];
        if (!store.outboundReconciliationIds.includes(rId)) store.outboundReconciliationIds.push(rId);
      }
    });
    
    // Inject inbound reconciliations
    if (!store.inboundReconciliations) store.inboundReconciliations = INITIAL_DATA.inboundReconciliations || {};
    if (!store.inboundReconciliationIds) store.inboundReconciliationIds = INITIAL_DATA.inboundReconciliationIds || [];
    Object.keys(INITIAL_DATA.inboundReconciliations || {}).forEach(rId => {
      if (!store.inboundReconciliations[rId]) {
        store.inboundReconciliations[rId] = INITIAL_DATA.inboundReconciliations[rId];
        if (!store.inboundReconciliationIds.includes(rId)) store.inboundReconciliationIds.push(rId);
      }
    });
    
    // Inject mock data for opportunity pipelines
    if (!store.oppColumns || store.oppColumns.length === 0) store.oppColumns = INITIAL_DATA.oppColumns;
    if (!store.oppTasks || Object.keys(store.oppTasks).length === 0) store.oppTasks = INITIAL_DATA.oppTasks;
    
    // Resilience for contracts
    const contractKeys = Object.keys(store.contracts);
    contractKeys.forEach((id, index) => {
      const currentYear = new Date().getFullYear();
      const contractNo = `HD-${currentYear}-${String(index + 1).padStart(5, '0')}`;
      store.contracts[id].contractNo = contractNo;
      
      const dealId = `DEAL-${currentYear}-${String(index + 1).padStart(5, '0')}`;
      if (!store.contracts[id].leadOppId || !store.contracts[id].leadOppId.startsWith('DEAL-')) {
          store.contracts[id].leadOppId = dealId;
      }
      
      if (!store.contracts[id].createdBy) store.contracts[id].createdBy = 'admin';
      if (!store.contracts[id].createdDate) store.contracts[id].createdDate = '2026-01-01';

      if (index % 2 === 0) {
        if (!store.contracts[id].effectiveDate) store.contracts[id].effectiveDate = `2026-01-${String((index % 28) + 1).padStart(2, '0')}`;
      } else {
        store.contracts[id].effectiveDate = '';
        store.contracts[id].signedDate = '';
      }
      
      store.contracts[id].approvalStatus = store.contracts[id].effectiveDate ? 'Hiệu lực' : 'Mới';
    });

    // Resilience for goals
    Object.keys(store.goals).forEach(id => {
      if (!store.goals[id].approvalStatus) {
         store.goals[id].approvalStatus = store.goals[id].status === 'Inactive' ? 'Hoàn thành' : 'Mới';
      }
      if (store.goals[id].actualProgress === undefined) {
         store.goals[id].actualProgress = '';
      }
    });

    // --- NEW MODULES DATA INJECTION ---
    if (!store.users) store.users = INITIAL_DATA.users || {};
    if (!store.userIds) store.userIds = INITIAL_DATA.userIds || [];
    if (!store.roles) store.roles = INITIAL_DATA.roles || {};
    if (!store.roleIds) store.roleIds = INITIAL_DATA.roleIds || [];
    
    if (!store.campaigns) store.campaigns = INITIAL_DATA.campaigns || {};
    if (!store.campaignIds) store.campaignIds = INITIAL_DATA.campaignIds || [];
    if (!store.tickets) store.tickets = INITIAL_DATA.tickets || {};
    if (!store.ticketIds) store.ticketIds = INITIAL_DATA.ticketIds || [];
    if (!store.loyaltyPrograms) store.loyaltyPrograms = INITIAL_DATA.loyaltyPrograms || {};
    if (!store.loyaltyProgramIds) store.loyaltyProgramIds = INITIAL_DATA.loyaltyProgramIds || [];
    if (!store.customerSurveys) store.customerSurveys = INITIAL_DATA.customerSurveys || {};
    if (!store.customerSurveyIds) store.customerSurveyIds = INITIAL_DATA.customerSurveyIds || [];
    
    if (!store.productGroups) store.productGroups = INITIAL_DATA.productGroups || {};
    if (!store.productGroupIds) store.productGroupIds = INITIAL_DATA.productGroupIds || [];
    if (!store.productCategories) store.productCategories = INITIAL_DATA.productCategories || {};
    if (!store.productCategoryIds) store.productCategoryIds = INITIAL_DATA.productCategoryIds || [];
    if (!store.productIds) store.productIds = INITIAL_DATA.productIds || [];
    
    if (!store.projects) store.projects = INITIAL_DATA.projects || {};
    if (!store.projectIds) store.projectIds = INITIAL_DATA.projectIds || [];
    if (!store.projectTasks) store.projectTasks = INITIAL_DATA.projectTasks || {};

    if (!store.acceptancePhases) store.acceptancePhases = {};
    if (!store.acceptancePhaseIds) store.acceptancePhaseIds = [];

    return store;
  },
  
  saveStore: (data) => {
    localStorage.setItem(STORE_KEY, JSON.stringify(data));
  },

  getLead: (id) => {
    const store = mockStore.getStore();
    return store.tasks[id];
  },

  saveLead: (id, taskData) => {
    const store = mockStore.getStore();
    store.tasks[id] = taskData;
    
    // Ensure task is in the proper column
    const colStatusMap = {
      'New': 'col-1',
      'Converted': 'col-2',
      'Lost': 'col-3'
    };
    
    const targetColId = colStatusMap[taskData.status] || 'col-1';
    
    // Remove from other columns if it exists
    store.columns.forEach(col => {
      col.taskIds = col.taskIds.filter(taskId => taskId !== id);
    });
    
    // Add to target column
    const targetCol = store.columns.find(c => c.id === targetColId);
    if (targetCol) {
      // Put at top of New column
      targetCol.taskIds.unshift(id);
    }

    mockStore.saveStore(store);
  },

  updateLeadStatus: (id, newStatus) => {
    const store = mockStore.getStore();
    if (!store.tasks[id]) return;
    
    store.tasks[id].status = newStatus;
    
    const colStatusMap = {
      'New': 'col-1',
      'Converted': 'col-2',
      'Lost': 'col-3'
    };
    
    const targetColId = colStatusMap[newStatus];
    
    // Remove from all
    store.columns.forEach(col => {
      col.taskIds = col.taskIds.filter(taskId => taskId !== id);
    });
    
    // Add to target column
    if (targetColId) {
      const targetCol = store.columns.find(c => c.id === targetColId);
      if (targetCol) {
        targetCol.taskIds.push(id);
      }
    }
    
    mockStore.saveStore(store);
  },

  getNextLeadId: (prefix) => {
    const store = mockStore.getStore();
    const allIds = Object.keys(store.tasks);
    const prefixUpper = prefix.toUpperCase();
    let maxNum = 0;
    allIds.forEach(taskId => {
      const parts = taskId.split('-');
      if (parts[0] === prefixUpper) {
        const num = parseInt(parts[1], 10);
        if (!isNaN(num) && num > maxNum) maxNum = num;
      }
    });
    return `${prefixUpper}-${maxNum + 1}`;
  },

  getAllCustomers: () => {
    const store = mockStore.getStore();
    return (store.customerIds || []).map(id => store.customers[id]).filter(Boolean);
  },

  getCustomer: (id) => {
    const store = mockStore.getStore();
    return store.customers[id];
  },

  saveCustomer: (id, customerData) => {
    const store = mockStore.getStore();
    if (!store.customers[id]) {
      store.customerIds.unshift(id);
    }
    store.customers[id] = customerData;
    mockStore.saveStore(store);
  },

  deleteCustomer: (id) => {
    const store = mockStore.getStore();
    if (store.customers[id]) {
      delete store.customers[id];
      store.customerIds = store.customerIds.filter(cId => cId !== id);
      mockStore.saveStore(store);
    }
  },

  deleteMultipleCustomers: (ids) => {
    const store = mockStore.getStore();
    ids.forEach(id => {
      if (store.customers[id]) {
        delete store.customers[id];
      }
    });
    store.customerIds = store.customerIds.filter(cId => !ids.includes(cId));
    mockStore.saveStore(store);
  },

  getAllContacts: () => {
    const store = mockStore.getStore();
    return (store.contactIds || []).map(id => store.contacts[id]).filter(Boolean);
  },

  getContact: (id) => {
    const store = mockStore.getStore();
    return store.contacts[id];
  },

  getAllContracts: () => {
    const store = mockStore.getStore();
    return (store.contractIds || []).map(id => store.contracts[id]).filter(Boolean);
  },

  getContract: (id) => {
    const store = mockStore.getStore();
    return store.contracts[id];
  },

  getAcceptancePhases: (parentAcceptanceId) => {
    const store = mockStore.getStore();
    if (!store.acceptancePhases) return [];
    return Object.values(store.acceptancePhases)
      .filter(p => p.parentAcceptanceId === parentAcceptanceId);
  },

  createAcceptancePhase: (parentAcceptanceId, phaseData) => {
    const store = mockStore.getStore();
    if (!store.acceptancePhases) store.acceptancePhases = {};
    if (!store.acceptancePhaseIds) store.acceptancePhaseIds = [];
    
    const phaseId = `PHASE-${Date.now()}`;
    const newPhase = {
      id: phaseId,
      parentAcceptanceId,
      status: 'Bản nháp',
      ...phaseData
    };
    
    store.acceptancePhases[phaseId] = newPhase;
    store.acceptancePhaseIds.unshift(phaseId);
    
    mockStore.recalculateParentTotals(store, parentAcceptanceId);
    mockStore.saveStore(store);
    return newPhase;
  },

  updateAcceptancePhase: (phaseId, phaseData) => {
    const store = mockStore.getStore();
    if (!store.acceptancePhases || !store.acceptancePhases[phaseId]) return null;
    
    const parentId = store.acceptancePhases[phaseId].parentAcceptanceId;
    store.acceptancePhases[phaseId] = {
      ...store.acceptancePhases[phaseId],
      ...phaseData
    };
    
    mockStore.recalculateParentTotals(store, parentId);
    mockStore.saveStore(store);
    return store.acceptancePhases[phaseId];
  },

  deleteAcceptancePhase: (phaseId) => {
    const store = mockStore.getStore();
    if (!store.acceptancePhases || !store.acceptancePhases[phaseId]) return;
    
    const parentId = store.acceptancePhases[phaseId].parentAcceptanceId;
    delete store.acceptancePhases[phaseId];
    store.acceptancePhaseIds = store.acceptancePhaseIds.filter(id => id !== phaseId);
    
    mockStore.recalculateParentTotals(store, parentId);
    mockStore.saveStore(store);
  },

  recalculateParentTotals: (store, parentId) => {
    const phases = Object.values(store.acceptancePhases || {})
      .filter(p => p.parentAcceptanceId === parentId);
      
    let totalValue = 0;
    let totalPenalty = 0;
    
    phases.forEach(p => {
      const val = parseFloat(String(p.value || '0').replace(/[^0-9.-]/g, ''));
      const pen = parseFloat(String(p.penalty || '0').replace(/[^0-9.-]/g, ''));
      totalValue += isNaN(val) ? 0 : val;
      totalPenalty += isNaN(pen) ? 0 : pen;
    });
    
    const netTotal = totalValue - totalPenalty;
    
    if (store.contracts && store.contracts[parentId]) {
      const formatNum = (num) => new Intl.NumberFormat('en-US').format(num);
      store.contracts[parentId].cumulativeValue = formatNum(totalValue);
      store.contracts[parentId].totalPenalty = formatNum(totalPenalty);
      store.contracts[parentId].netTotal = formatNum(netTotal);
    }
  },

  saveContract: (id, contractData) => {
    const store = mockStore.getStore();
    if (!store.contracts[id]) {
      store.contractIds.unshift(id);
    }
    store.contracts[id] = contractData;
    mockStore.saveStore(store);
  },

  getNextContractId: () => {
    const store = mockStore.getStore();
    const ids = store.contractIds || [];
    let maxNum = 0;
    ids.forEach(id => {
      const parts = id.split('-');
      const num = parseInt(parts[parts.length - 1], 10);
      if (!isNaN(num) && num > maxNum) maxNum = num;
    });
    return `CTR-2026-${(maxNum + 1).toString().padStart(3, '0')}`;
  },

  saveContact: (id, contactData) => {
    const store = mockStore.getStore();
    const isNew = !store.contacts[id];
    if (isNew) {
        store.contactIds.unshift(id);
    }
    // Automatically update company names for display consistency
    if (contactData.companyId) {
        const company = store.customers[contactData.companyId];
        if (company) contactData.companyName = company.name;
    }
    
    contactData.chatterMessages = contactData.chatterMessages || (store.contacts[id]?.chatterMessages || []);
    contactData.chatterMessages.push({
      id: Date.now() + Math.random(),
      type: 'log',
      author: 'Hệ thống',
      text: isNew ? 'Tạo mới liên hệ khách hàng' : 'Cập nhật thông tin liên hệ',
      time: new Date().toLocaleString('vi-VN'),
      color: '#fef3c7'
    });

    store.contacts[id] = contactData;
    mockStore.saveStore(store);
  },

  updateContactStatus: (id, status) => {
    const store = mockStore.getStore();
    if (store.contacts[id]) {
      const oldStatus = store.contacts[id].status;
      store.contacts[id].status = status;
      store.contacts[id].chatterMessages = store.contacts[id].chatterMessages || [];
      store.contacts[id].chatterMessages.push({
        id: Date.now() + Math.random(),
        type: 'log',
        author: 'Hệ thống',
        text: `Đã chuyển trạng thái từ ${oldStatus || 'N/A'} sang ${status}`,
        time: new Date().toLocaleString('vi-VN'),
        color: '#fef3c7'
      });
      mockStore.saveStore(store);
    }
  },

  getNextContactId: () => {
    const store = mockStore.getStore();
    const allIds = store.contactIds || [];
    let maxNum = 0;
    allIds.forEach(id => {
      const parts = id.split('-');
      const num = parseInt(parts[1], 10);
      if (!isNaN(num) && num > maxNum) maxNum = num;
    });
    return `CON-${maxNum + 1}`;
  },

  updateContactStatus: (id, status) => {
    const store = mockStore.getStore();
    if (store.contacts[id]) {
        store.contacts[id].status = status;
        mockStore.saveStore(store);
    }
  },

  getContactsByCompany: (companyId, status = null) => {
    const store = mockStore.getStore();
    const all = mockStore.getAllContacts();
    return all.filter(c => {
        const matchComp = c.companyId === companyId;
        const matchStatus = status ? c.status === status : true;
        return matchComp && matchStatus;
    });
  },

  getNextCustomerId: () => {
    const store = mockStore.getStore();
    const allIds = store.customerIds;
    const year = new Date().getFullYear();
    const prefix = `VCX${year}`;
    let maxNum = 0;
    allIds.forEach(id => {
      if (id.startsWith(prefix)) {
        const numStr = id.slice(prefix.length);
        const num = parseInt(numStr, 10);
        if (!isNaN(num) && num > maxNum) maxNum = num;
      }
    });
    return `${prefix}${(maxNum + 1).toString().padStart(5, '0')}`;
  },

  addCustomer: (customerData) => {
    const newId = mockStore.getNextCustomerId();
    customerData.id = newId;
    mockStore.saveCustomer(newId, customerData);
    return newId;
  },

  updateCustomer: (id, customerData) => {
    mockStore.saveCustomer(id, customerData);
  },

  convertToCustomer: (leadId, contractNo, signedDate) => {
    const store = mockStore.getStore();
    const lead = store.tasks[leadId];
    if (!lead) return null;

    const customerId = mockStore.getNextCustomerId();
    const newCustomer = {
      id: customerId,
      name: lead.company,
      shortName: lead.company, // Fallback
      mst: lead.mst,
      type: lead.tags?.find(t => t.text === 'Doanh nghiệp') ? 'Doanh nghiệp' : 'Nội bộ',
      contactName: lead.contactName,
      email: lead.email,
      phone: lead.phone || '',
      address: `${lead.ward || ''}, ${lead.district || ''}, ${lead.city || ''}`,
      domain: lead.projectedService,
      projectType: lead.projectType || 'outsourcing',
      source: 'Lead Conversion',
      status: 'Active',
      contractNo: contractNo || `HD-${new Date().getFullYear()}-${customerId.split('-')[1].padStart(3, '0')}`,
      signedDate: signedDate || new Date().toLocaleDateString('vi-VN'),
      avatars: lead.avatars || [],
      leadId: leadId
    };

    store.customers[customerId] = newCustomer;
    store.customerIds.unshift(customerId);
    
    // Update lead status
    lead.status = 'Thành công';
    lead.convertedCustomerId = customerId;

    // Update column
    store.columns.forEach(col => {
      col.taskIds = col.taskIds.filter(id => id !== leadId);
    });
    const convertedCol = store.columns.find(c => c.id === 'col-2');
    if (convertedCol) {
      convertedCol.taskIds.unshift(leadId);
    }

    mockStore.saveStore(store);
    return customerId;
  },

  // --- CONTRACT METHODS ---
  getAllContracts: () => {
    const store = mockStore.getStore();
    return (store.contractIds || []).map(id => store.contracts[id]).filter(Boolean);
  },

  getContract: (id) => {
    const store = mockStore.getStore();
    return store.contracts[id];
  },

  saveContract: (id, contractData) => {
    const store = mockStore.getStore();
    if (!store.contracts[id]) {
      store.contractIds.unshift(id);
    }
    store.contracts[id] = contractData;
    mockStore.saveStore(store);
  },

  updateContractApprovalStatus: (id, status) => {
    const store = mockStore.getStore();
    if (store.contracts[id]) {
      store.contracts[id].approvalStatus = status;
      mockStore.saveStore(store);
    }
  },

  getNextContractId: () => {
    const store = mockStore.getStore();
    const allIds = store.contractIds || [];
    let maxNum = 0;
    allIds.forEach(id => {
      const parts = id.split('-');
      const num = parseInt(parts[2], 10);
      if (!isNaN(num) && num > maxNum) maxNum = num;
    });
    return `CTR-${new Date().getFullYear()}-${(maxNum + 1).toString().padStart(3, '0')}`;
  },

  getNextContractNo: () => {
    const store = mockStore.getStore();
    const allIds = store.contractIds || [];
    let maxNum = 0;
    allIds.forEach(id => {
      const contract = store.contracts[id];
      if (contract && contract.contractNo) {
        const parts = contract.contractNo.split('/');
        const num = parseInt(parts[2], 10);
        if (!isNaN(num) && num > maxNum) maxNum = num;
      }
    });
    return `HD/${new Date().getFullYear()}/${(maxNum + 1).toString().padStart(3, '0')}`;
  },

  // --- GOAL METHODS ---
  getAllGoals: () => {
    const store = mockStore.getStore();
    return (store.goalIds || []).map(id => store.goals[id]).filter(Boolean);
  },
  getGoal: (id) => {
    const store = mockStore.getStore();
    return store.goals[id];
  },
  saveGoal: (id, goalData) => {
    const store = mockStore.getStore();
    if (!store.goals[id]) {
      store.goalIds.unshift(id);
    }
    store.goals[id] = goalData;
    mockStore.saveStore(store);
  },
  getNextGoalId: () => {
    const store = mockStore.getStore();
    const allIds = store.goalIds || [];
    let maxNum = 0;
    allIds.forEach(id => {
      const parts = id.split('-');
      const num = parseInt(parts[1], 10);
      if (!isNaN(num) && num > maxNum) maxNum = num;
    });
    return `GOAL-${maxNum + 1}`;
  },

  // --- OPPORTUNITY PIPELINE METHODS ---
  getOpp: (id) => {
    const store = mockStore.getStore();
    return store.oppTasks[id];
  },
  saveOpp: (id, taskData) => {
    const store = mockStore.getStore();
    store.oppTasks[id] = taskData;
    mockStore.saveStore(store);
  },
  updateOppStatus: (id, status) => {
    const store = mockStore.getStore();
    if (store.oppTasks && store.oppTasks[id]) {
      store.oppTasks[id].status = status;
      mockStore.saveStore(store);
    }
  },
  getNextOppId: (prefix) => {
    const store = mockStore.getStore();
    const allIds = Object.keys(store.oppTasks || {});
    const prefixUpper = (prefix || 'OPP').toUpperCase();
    let maxNum = 0;
    allIds.forEach(taskId => {
      const parts = taskId.split('-');
      if (parts[0] === prefixUpper) {
        const num = parseInt(parts[1], 10);
        if (!isNaN(num) && num > maxNum) maxNum = num;
      }
    });
    return `${prefixUpper}-${maxNum + 1}`;
  },

  // --- ORDER METHODS ---
  getAllOrders: () => {
    const store = mockStore.getStore();
    return (store.orderIds || []).map(id => store.orders[id]).filter(Boolean);
  },

  getOrder: (id) => {
    const store = mockStore.getStore();
    return store.orders[id];
  },

  saveOrder: (id, orderData) => {
    const store = mockStore.getStore();
    if (!store.orders[id]) {
      store.orderIds.unshift(id);
    }
    store.orders[id] = orderData;
    mockStore.saveStore(store);
  },

  getNextOrderId: () => {
    const store = mockStore.getStore();
    const allIds = store.orderIds || [];
    let maxNum = 0;
    allIds.forEach(id => {
      const parts = id.split('-');
      const num = parseInt(parts[2], 10);
      if (!isNaN(num) && num > maxNum) maxNum = num;
    });
    return `ORD-${new Date().getFullYear()}-${(maxNum + 1).toString().padStart(3, '0')}`;
  },

  getNextOrderNo: () => {
    const store = mockStore.getStore();
    const allIds = store.orderIds || [];
    let maxNum = 0;
    allIds.forEach(id => {
      const order = store.orders[id];
      if (order && order.orderNo) {
        const parts = order.orderNo.split('-');
        const num = parseInt(parts[2], 10);
        if (!isNaN(num) && num > maxNum) maxNum = num;
      }
    });
    return `DH-${new Date().getFullYear()}-${(maxNum + 1).toString().padStart(3, '0')}`;
  },

  // --- PRODUCT & SERVICE METHODS ---
  getAllProductGroups: () => {
    const store = mockStore.getStore();
    return (store.productGroupIds || []).map(id => store.productGroups[id]).filter(Boolean);
  },
  saveProductGroup: (id, data) => {
    const store = mockStore.getStore();
    if (!store.productGroups[id]) store.productGroupIds.push(id);
    store.productGroups[id] = data;
    mockStore.saveStore(store);
  },
  getNextProductGroupId: () => {
    const store = mockStore.getStore();
    const ids = store.productGroupIds || [];
    let max = 0;
    ids.forEach(id => {
      const n = parseInt(id.split('-')[1], 10);
      if (n > max) max = n;
    });
    return `PG-${max + 1}`;
  },
  
  getAllProductCategories: () => {
    const store = mockStore.getStore();
    return (store.productCategoryIds || []).map(id => store.productCategories[id]).filter(Boolean);
  },
  saveProductCategory: (id, data) => {
    const store = mockStore.getStore();
    if (!store.productCategories[id]) store.productCategoryIds.push(id);
    store.productCategories[id] = data;
    mockStore.saveStore(store);
  },
  getNextProductCategoryId: () => {
    const store = mockStore.getStore();
    const ids = store.productCategoryIds || [];
    let max = 0;
    ids.forEach(id => {
      const n = parseInt(id.split('-')[1], 10);
      if (n > max) max = n;
    });
    return `PC-${max + 1}`;
  },

  getAllProducts: () => {
    const store = mockStore.getStore();
    return (store.productIds || []).map(id => store.products[id]).filter(Boolean);
  },
  getProduct: (id) => {
    const store = mockStore.getStore();
    return store.products[id];
  },
  saveProduct: (id, productData) => {
    const store = mockStore.getStore();
    if (!store.products[id]) store.productIds.push(id);
    store.products[id] = productData;
    mockStore.saveStore(store);
  },
  deleteProductEntity: (type, id) => {
    const store = mockStore.getStore();
    if (type === 'group') {
      delete store.productGroups[id];
      store.productGroupIds = store.productGroupIds.filter(i => i !== id);
    } else if (type === 'category') {
      delete store.productCategories[id];
      store.productCategoryIds = store.productCategoryIds.filter(i => i !== id);
    } else if (type === 'product') {
      delete store.products[id];
      store.productIds = store.productIds.filter(i => i !== id);
    }
    mockStore.saveStore(store);
  },
  toggleProductStatus: (id) => {
    const store = mockStore.getStore();
    if (store.products[id]) {
      store.products[id].status = store.products[id].status === 'Active' ? 'Inactive' : 'Active';
      mockStore.saveStore(store);
    }
  },
  getNextProductId: () => {
    const store = mockStore.getStore();
    const ids = store.productIds || [];
    let max = 0;
    ids.forEach(id => {
      const n = parseInt(id.split('-')[1], 10);
      if (n > max) max = n;
    });
    return `PRD-${(max + 1).toString().padStart(3, '0')}`;
  },

  // --- PARTNER & PARTNER BILLING METHODS ---
  getAllPartners: () => {
    const store = mockStore.getStore();
    return (store.partnerIds || []).map(id => store.partners[id]).filter(Boolean);
  },

  getAllPartnerBillings: () => {
    const store = mockStore.getStore();
    return (store.partnerBillingIds || []).map(id => store.partnerBillings[id]).filter(Boolean);
  },

  // --- OUTBOUND RECONCILIATION METHODS ---
  getAllOutboundReconciliations: () => {
    const store = mockStore.getStore();
    return (store.outboundReconciliationIds || []).map(id => store.outboundReconciliations[id]).filter(Boolean);
  },

  getOutboundReconciliation: (id) => {
    const store = mockStore.getStore();
    return store.outboundReconciliations[id];
  },

  saveOutboundReconciliation: (id, data) => {
    const store = mockStore.getStore();
    if (!store.outboundReconciliations[id]) {
      store.outboundReconciliationIds.unshift(id);
    }
    store.outboundReconciliations[id] = data;
    mockStore.saveStore(store);
  },

  getNextOutboundReconciliationId: () => {
    const store = mockStore.getStore();
    const allIds = store.outboundReconciliationIds || [];
    let maxNum = 0;
    allIds.forEach(id => {
      const parts = id.split('-');
      const num = parseInt(parts[2], 10);
      if (!isNaN(num) && num > maxNum) maxNum = num;
    });
    return `OBR-${new Date().getFullYear()}-${(maxNum + 1).toString().padStart(3, '0')}`;
  },

  getNextOutboundReconciliationNo: () => {
    const store = mockStore.getStore();
    const allIds = store.outboundReconciliationIds || [];
    let maxNum = 0;
    allIds.forEach(id => {
      const rec = store.outboundReconciliations[id];
      if (rec && rec.reconcNo) {
        const parts = rec.reconcNo.split('-');
        const num = parseInt(parts[2], 10);
        if (!isNaN(num) && num > maxNum) maxNum = num;
      }
    });
    return `DS-${new Date().getFullYear()}-${(maxNum + 1).toString().padStart(3, '0')}`;
  },

  // --- INBOUND RECONCILIATION METHODS ---
  getAllInboundReconciliations: () => {
    const store = mockStore.getStore();
    return (store.inboundReconciliationIds || []).map(id => store.inboundReconciliations[id]).filter(Boolean);
  },

  getInboundReconciliation: (id) => {
    const store = mockStore.getStore();
    return store.inboundReconciliations[id];
  },

  saveInboundReconciliation: (id, data) => {
    const store = mockStore.getStore();
    if (!store.inboundReconciliations[id]) {
      store.inboundReconciliationIds.unshift(id);
    }
    store.inboundReconciliations[id] = data;
    mockStore.saveStore(store);
  },

  getNextInboundReconciliationId: () => {
    const store = mockStore.getStore();
    const allIds = store.inboundReconciliationIds || [];
    let maxNum = 0;
    allIds.forEach(id => {
      const parts = id.split('-');
      const num = parseInt(parts[2], 10);
      if (!isNaN(num) && num > maxNum) maxNum = num;
    });
    return `IBR-${new Date().getFullYear()}-${(maxNum + 1).toString().padStart(3, '0')}`;
  },

  getNextInboundReconciliationNo: () => {
    const store = mockStore.getStore();
    const allIds = store.inboundReconciliationIds || [];
    let maxNum = 0;
    allIds.forEach(id => {
      const rec = store.inboundReconciliations[id];
      if (rec && rec.reconcNo) {
        const parts = rec.reconcNo.split('-');
        const num = parseInt(parts[2], 10);
        if (!isNaN(num) && num > maxNum) maxNum = num;
      }
    });
    return `DSKH-${new Date().getFullYear()}-${(maxNum + 1).toString().padStart(3, '0')}`;
  },

  // --- USER METHODS ---
  getAllUsers: () => {
    const store = mockStore.getStore();
    return (store.userIds || []).map(id => store.users[id]).filter(Boolean);
  },
  getUser: (id) => {
    const store = mockStore.getStore();
    return store.users[id];
  },
  saveUser: (id, userData) => {
    const store = mockStore.getStore();
    if (!store.users[id]) store.userIds.push(id);
    store.users[id] = userData;
    mockStore.saveStore(store);
  },
  toggleUserStatus: (id) => {
    const store = mockStore.getStore();
    if (store.users[id]) {
      store.users[id].status = store.users[id].status === 'Active' ? 'Inactive' : 'Active';
      mockStore.saveStore(store);
    }
  },
  getNextUserId: () => {
    const store = mockStore.getStore();
    const ids = store.userIds || [];
    let max = 0;
    ids.forEach(id => {
      const n = parseInt(id.split('-')[1], 10);
      if (n > max) max = n;
    });
    return `USR-${(max + 1).toString().padStart(3, '0')}`;
  },

  // --- ROLE METHODS ---
  getAllRoles: () => {
    const store = mockStore.getStore();
    return (store.roleIds || []).map(id => store.roles[id]).filter(Boolean);
  },
  getRole: (id) => {
    const store = mockStore.getStore();
    return store.roles[id];
  },
  saveRole: (id, roleData) => {
    const store = mockStore.getStore();
    if (!store.roles[id]) store.roleIds.push(id);
    store.roles[id] = roleData;
    mockStore.saveStore(store);
  },
  toggleRoleStatus: (id) => {
    const store = mockStore.getStore();
    if (store.roles[id]) {
      store.roles[id].status = store.roles[id].status === 'Active' ? 'Inactive' : 'Active';
      mockStore.saveStore(store);
    }
  },
  getNextRoleId: () => {
    const store = mockStore.getStore();
    const ids = store.roleIds || [];
    let max = 0;
    ids.forEach(id => {
      const n = parseInt(id.split('-')[1], 10);
      if (n > max) max = n;
    });
    return `ROL-${(max + 1).toString().padStart(3, '0')}`;
  },

  // --- MARKETING METHODS ---
  getAllCampaigns: () => {
    const store = mockStore.getStore();
    return (store.campaignIds || []).map(id => store.campaigns[id]).filter(Boolean);
  },
  saveCampaign: (id, data) => {
    const store = mockStore.getStore();
    if (!store.campaigns[id]) store.campaignIds.push(id);
    store.campaigns[id] = data;
    mockStore.saveStore(store);
  },

  // --- SERVICE METHODS ---
  getAllTickets: () => {
    const store = mockStore.getStore();
    return (store.ticketIds || []).map(id => store.tickets[id]).filter(Boolean);
  },
  saveTicket: (id, data) => {
    const store = mockStore.getStore();
    if (!store.tickets[id]) store.ticketIds.push(id);
    store.tickets[id] = data;
    mockStore.saveStore(store);
  },
  deleteTicket: (id) => {
    const store = mockStore.getStore();
    if (store.tickets[id]) {
      delete store.tickets[id];
      store.ticketIds = (store.ticketIds || []).filter((ticketId) => ticketId !== id);
      mockStore.saveStore(store);
    }
  },
  getNextTicketId: () => {
    const store = mockStore.getStore();
    let max = 0;
    (store.ticketIds || []).forEach((id) => {
      const n = parseInt(String(id).split('-')[1], 10);
      if (!Number.isNaN(n) && n > max) max = n;
    });
    return `TIC-${String(max + 1).padStart(3, '0')}`;
  },

  // --- LOYALTY METHODS ---
  getAllLoyaltyPrograms: () => {
    const store = mockStore.getStore();
    return (store.loyaltyProgramIds || []).map(id => store.loyaltyPrograms[id]).filter(Boolean);
  },
  saveLoyaltyProgram: (id, data) => {
    const store = mockStore.getStore();
    if (!store.loyaltyPrograms[id]) store.loyaltyProgramIds.push(id);
    store.loyaltyPrograms[id] = data;
    mockStore.saveStore(store);
  },

  // --- CUSTOMER SURVEY METHODS ---
  getAllCustomerSurveys: () => {
    const store = mockStore.getStore();
    return (store.customerSurveyIds || []).map((id) => store.customerSurveys[id]).filter(Boolean);
  },
  saveCustomerSurvey: (id, data) => {
    const store = mockStore.getStore();
    if (!store.customerSurveys[id]) store.customerSurveyIds.push(id);
    store.customerSurveys[id] = data;
    mockStore.saveStore(store);
  },
  deleteCustomerSurvey: (id) => {
    const store = mockStore.getStore();
    if (store.customerSurveys[id]) {
      delete store.customerSurveys[id];
      store.customerSurveyIds = (store.customerSurveyIds || []).filter((surveyId) => surveyId !== id);
      mockStore.saveStore(store);
    }
  },
  getNextCustomerSurveyId: () => {
    const store = mockStore.getStore();
    let max = 0;
    (store.customerSurveyIds || []).forEach((id) => {
      const n = parseInt(String(id).split('-')[1], 10);
      if (!Number.isNaN(n) && n > max) max = n;
    });
    return `SRV-${String(max + 1).padStart(3, '0')}`;
  },

  // --- PROJECT METHODS ---
  getAllProjects: () => {
    const store = mockStore.getStore();
    return (store.projectIds || []).map(id => store.projects[id]).filter(Boolean);
  },
  getProject: (id) => {
    const store = mockStore.getStore();
    return store.projects[id];
  },
  getProjectBoard: (projectId) => {
    const store = mockStore.getStore();
    return store.projectTasks[projectId] || null;
  },
  saveProjectBoard: (projectId, boardData) => {
    const store = mockStore.getStore();
    store.projectTasks[projectId] = boardData;

    const project = store.projects[projectId];
    if (project) {
      const allTasks = Object.values(boardData.tasks || {});
      const totalTasks = allTasks.length;
      const doneIds = (boardData.columns?.done?.taskIds || []);
      const completedTasks = doneIds.length;
      const progressPct = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

      project.tasks = totalTasks;
      project.completed = completedTasks;
      project.progress = progressPct;
      project.status = progressPct >= 100 ? 'On Track' : progressPct >= 50 ? 'At Risk' : 'Off Track';

      if (project.contractId && store.contracts[project.contractId]) {
        if (progressPct >= 100) {
          store.contracts[project.contractId].implementationStatus = 'Đã triển khai';
        } else if (progressPct > 0) {
          store.contracts[project.contractId].implementationStatus = 'Đang triển khai';
        } else {
          store.contracts[project.contractId].implementationStatus = 'Chưa triển khai';
        }
      }
    }
    mockStore.saveStore(store);
  },
  getNextProjectId: () => {
    const store = mockStore.getStore();
    let max = 0;
    (store.projectIds || []).forEach((id) => {
      const n = parseInt(String(id).split('-')[1], 10);
      if (!Number.isNaN(n) && n > max) max = n;
    });
    return `PRJ-${String(max + 1).padStart(3, '0')}`;
  },
  createProjectFromContract: (contractId, contractData) => {
    const store = mockStore.getStore();
    const existed = Object.values(store.projects || {}).find((project) => project.contractId === contractId);
    if (existed) return existed;

    const projectId = mockStore.getNextProjectId();
    const signedDate = contractData?.signedDate ? new Date(contractData.signedDate) : new Date();
    const deadline = new Date(signedDate.getTime());
    deadline.setDate(deadline.getDate() + 60);

    const project = {
      id: projectId,
      contractId,
      name: contractData?.name ? `Triển khai ${contractData.name}` : `Triển khai hợp đồng ${contractId}`,
      customer: contractData?.customerName || contractData?.shortName || 'Khách hàng',
      manager: contractData?.amName || 'admin',
      status: 'Triển khai nghiệp vụ theo Hợp đồng',
      tasks: 5,
      completed: 0,
      deadline: deadline.toISOString().slice(0, 10),
      color: '#3b82f6',
      progress: 0
    };

    const board = {
      columns: {
        todo: { id: 'todo', title: 'Mới', taskIds: [`${projectId}-T1`, `${projectId}-T2`] },
        inprogress: { id: 'inprogress', title: 'Đang triển khai', taskIds: [`${projectId}-T3`, `${projectId}-T4`] },
        waiting: { id: 'waiting', title: 'Chế độ chờ/Phản hồi', taskIds: [] },
        done: { id: 'done', title: 'Hoàn thành', taskIds: [`${projectId}-T5`] }
      },
      tasks: {
        [`${projectId}-T1`]: { id: `${projectId}-T1`, title: 'Kick-off dự án với khách hàng', user: project.manager, date: signedDate.toISOString().slice(0, 10), tag: 'Kick-off', priority: 'High' },
        [`${projectId}-T2`]: { id: `${projectId}-T2`, title: 'Thành lập ban triển khai & Phân công', user: project.manager, date: signedDate.toISOString().slice(0, 10), tag: 'Planning', priority: 'High' },
        [`${projectId}-T3`]: { id: `${projectId}-T3`, title: `Triển khai hợp đồng cho KH ${project.customer}`, user: project.manager, date: signedDate.toISOString().slice(0, 10), tag: 'Implementation', priority: 'Medium' },
        [`${projectId}-T4`]: { id: `${projectId}-T4`, title: 'Thống nhất số liệu nghiệm thu đợt 1', user: project.manager, date: signedDate.toISOString().slice(0, 10), tag: 'Review', priority: 'Medium' },
        [`${projectId}-T5`]: { id: `${projectId}-T5`, title: 'Ký biên bản bàn giao tổng thể', user: project.manager, date: signedDate.toISOString().slice(0, 10), tag: 'Handover', priority: 'Medium' }
      },
      columnOrder: ['todo', 'inprogress', 'waiting', 'done']
    };

    if (!store.projects[projectId]) {
      store.projectIds.unshift(projectId);
    }
    store.projects[projectId] = project;
    store.projectTasks[projectId] = board;
    if (store.contracts[contractId]) {
      store.contracts[contractId].implementationStatus = 'Đang triển khai';
    }
    mockStore.saveStore(store);
    return project;
  },
  syncProjectsFromActiveContracts: () => {
    const store = mockStore.getStore();
    const activeContracts = (store.contractIds || [])
      .map((id) => store.contracts[id])
      .filter((contract) => contract && contract.approvalStatus === 'Hiệu lực');

    let created = 0;
    activeContracts.forEach((contract) => {
      const existing = Object.values(store.projects || {}).find((project) => project.contractId === contract.id);
      if (!existing) {
        mockStore.createProjectFromContract(contract.id, contract);
        created += 1;
      }
    });
    return created;
  },
  updateProjectStatus: (projectId, newStatus) => {
    const store = mockStore.getStore();
    if (store.projects[projectId]) {
      store.projects[projectId].status = newStatus;
      mockStore.saveStore(store);
      return store.projects[projectId];
    }
    return null;
  },
  getRemainingQty: (contractId, productId, excludeOrderId = null) => {
    const store = mockStore.getStore();
    const contract = store.contracts[contractId];
    if (!contract || !contract.products) return 0;
    
    const contractProduct = contract.products.find(p => p.productId === productId);
    if (!contractProduct) return 0;

    const totalContractQty = contractProduct.qty;
    
    // Tính tổng đã đặt từ các đơn hàng (không phải Từ chối/Hủy). Dự thảo cũng giữ chỗ!
    const validOrders = Object.values(store.orders || {}).filter(o => 
      o.contractId === contractId && 
      !['Bị từ chối', 'Đã hủy'].includes(o.orderStatus) &&
      o.id !== excludeOrderId
    );

    let orderedQty = 0;
    validOrders.forEach(order => {
      const line = (order.lines || []).find(l => l.productId === productId);
      if (line) orderedQty += (line.qty || line.quantity || 0);
    });

    return Math.max(0, totalContractQty - orderedQty);
  },
  saveOrder: (orderData) => {
    const store = mockStore.getStore();
    if (!store.orders) store.orders = {};
    if (!store.orderIds) store.orderIds = [];

    const isNew = !orderData.id;
    let orderId = orderData.id;
    let orderNo = orderData.orderNo;

    if (isNew) {
      // Find max order number
      let max = 0;
      store.orderIds.forEach(id => {
        const parts = id.split('-');
        if (parts.length >= 3) {
          const num = parseInt(parts[2], 10);
          if (!isNaN(num) && num > max) max = num;
        }
      });
      orderId = `ORD-2026-${String(max + 1).padStart(3, '0')}`;
      orderNo = `DH-2026-${String(max + 1).padStart(3, '0')}`;
    }

    const existingOrder = store.orders[orderId] || {};
    const savedOrder = {
      ...existingOrder,
      ...orderData,
      id: orderId,
      orderNo: orderNo || existingOrder.orderNo || `DH-2026-${orderId.slice(-3)}`,
      orderDate: orderData.orderDate || existingOrder.orderDate || new Date().toISOString().slice(0, 10),
      orderStatus: orderData.orderStatus || existingOrder.orderStatus || 'Dự thảo',
      kpiLines: orderData.kpiLines || existingOrder.kpiLines || [],
      productivityLines: orderData.productivityLines || existingOrder.productivityLines || []
    };

    if (isNew) {
      store.orderIds.unshift(orderId);
    }
    store.orders[orderId] = savedOrder;
    mockStore.saveStore(store);
    return savedOrder;
  },

  // ===== ACCEPTANCE PHASES =====
  getAcceptancePhases: (parentAcceptanceId) => {
    const store = mockStore.getStore();
    if (!store.acceptancePhases) return [];
    return Object.values(store.acceptancePhases)
      .filter(p => p.parentAcceptanceId === parentAcceptanceId);
  },

  createAcceptancePhase: (parentAcceptanceId, phaseData) => {
    const store = mockStore.getStore();
    if (!store.acceptancePhases) store.acceptancePhases = {};
    if (!store.acceptancePhaseIds) store.acceptancePhaseIds = [];

    const phaseId = `PHASE-${Date.now()}`;
    const newPhase = {
      id: phaseId,
      parentAcceptanceId,
      status: 'Bản nháp',
      ...phaseData
    };

    store.acceptancePhases[phaseId] = newPhase;
    store.acceptancePhaseIds.unshift(phaseId);

    mockStore.recalculateParentTotals(store, parentAcceptanceId);
    mockStore.saveStore(store);
    return newPhase;
  },

  updateAcceptancePhase: (phaseId, phaseData) => {
    const store = mockStore.getStore();
    if (!store.acceptancePhases || !store.acceptancePhases[phaseId]) return null;

    const parentId = store.acceptancePhases[phaseId].parentAcceptanceId;
    store.acceptancePhases[phaseId] = {
      ...store.acceptancePhases[phaseId],
      ...phaseData
    };

    mockStore.recalculateParentTotals(store, parentId);
    mockStore.saveStore(store);
    return store.acceptancePhases[phaseId];
  },

  deleteAcceptancePhase: (phaseId) => {
    const store = mockStore.getStore();
    if (!store.acceptancePhases || !store.acceptancePhases[phaseId]) return;

    const parentId = store.acceptancePhases[phaseId].parentAcceptanceId;
    delete store.acceptancePhases[phaseId];
    store.acceptancePhaseIds = (store.acceptancePhaseIds || []).filter(id => id !== phaseId);

    mockStore.recalculateParentTotals(store, parentId);
    mockStore.saveStore(store);
  },

  recalculateParentTotals: (store, parentId) => {
    const phases = Object.values(store.acceptancePhases || {})
      .filter(p => p.parentAcceptanceId === parentId);

    let totalValue = 0;
    let totalPenalty = 0;

    phases.forEach(p => {
      const val = parseFloat(String(p.value || '0').replace(/[^0-9.-]/g, ''));
      const pen = parseFloat(String(p.penalty || '0').replace(/[^0-9.-]/g, ''));
      totalValue += isNaN(val) ? 0 : val;
      totalPenalty += isNaN(pen) ? 0 : pen;
    });

    if (store.contracts && store.contracts[parentId]) {
      store.contracts[parentId].totalAcceptedValue = totalValue;
      store.contracts[parentId].totalPenalty = totalPenalty;
      store.contracts[parentId].netAcceptedValue = totalValue - totalPenalty;
    }
  }
};


