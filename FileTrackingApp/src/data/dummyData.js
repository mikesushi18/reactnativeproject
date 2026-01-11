export const users = [
  { id: '1', name: 'Admin User', email: 'admin@test.com', role: 'admin', password: 'admin123', department: 'Administration' },
  { id: '2', name: 'Semi Admin', email: 'semiadmin@test.com', role: 'semi_admin', password: 'semi123', department: 'Finance' },
  { id: '3', name: 'Juan Dela Cruz', email: 'juan@test.com', role: 'user', password: 'juan123', department: 'Sales' },
  { id: '4', name: 'Maria Santos', email: 'maria@test.com', role: 'user', password: 'maria123', department: 'Finance' },
];

export const files = [
  {
    id: '1',
    fileName: 'Report_Q1.pdf',
    fileType: 'pdf',
    uploadedBy: '3',
    uploadedByName: 'Juan Dela Cruz',
    recipientId: '1',
    recipientName: 'Admin User',
    folderId: 's_reports',
    status: 'pending',
    description: 'Q1 Sales Report',
    createdAt: '2024-12-01',
  },
  {
    id: '2',
    fileName: 'Invoice_123.xlsx',
    fileType: 'excel',
    uploadedBy: '4',
    uploadedByName: 'Maria Santos',
    recipientId: '2',
    recipientName: 'Semi Admin',
    folderId: 'f_invoices',
    status: 'completed',
    description: 'Invoice for November',
    createdAt: '2024-12-01',
  },
  {
    id: '3',
    fileName: 'Memo_HR.docx',
    fileType: 'word',
    uploadedBy: '3',
    uploadedByName: 'Juan Dela Cruz',
    recipientId: '1',
    recipientName: 'Admin User',
    folderId: 'a_policies',
    status: 'received',
    description: 'HR Policy Update',
    createdAt: '2024-11-30',
  },
];

export const folders = [
  { id: 'f_invoices', name: 'Invoices', department: 'Finance' },
  { id: 'f_payroll', name: 'Payroll', department: 'Finance' },
  { id: 's_reports', name: 'Reports', department: 'Sales' },
  { id: 's_proposals', name: 'Proposals', department: 'Sales' },
  { id: 'a_policies', name: 'Policies', department: 'Administration' },
  { id: 'a_archive', name: 'Archive', department: 'Administration' },
];
