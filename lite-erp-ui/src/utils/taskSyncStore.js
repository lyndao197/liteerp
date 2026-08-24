const PERSONAL_TASKS_KEY = 'ha_personal_tasks_v1';
const TEAM_TASKS_KEY = 'ha_team_tasks_v1';
export const TASKS_UPDATED_EVENT = 'ha-tasks-updated';
export const DEPARTMENT_OPTIONS = [
  'Phòng Dịch vụ khách hàng',
  'Phòng Công nghệ',
  'Phòng Vận hành',
  'Phòng Kinh doanh',
];
export const EMPLOYEE_OPTIONS = ['Hung NV', 'Quan VM', 'Phuong NT', 'admin'];
export const SOURCE_OPTIONS = [
  'Dự án dịch vụ chăm sóc khách hàng',
  'Dự án phần mềm KnowxHub',
  'Lead Công ty Viettel Post',
];

const DEFAULT_PERSONAL_TASKS = [
  { 
    id: 1, 
    title: 'Gọi điện xác nhận nhu cầu', 
    assignee: 'Hung NV', 
    reporter: 'Hung NV', 
    partnerName: 'Ngân hàng TMCP An Bình (ABBank)',
    partnerTax: 'MST: 0363217355',
    source: 'Lead Công ty Viettel Post', 
    createdDate: '07/04/2026', 
    dueDate: '07/05/2026', 
    priority: 'high', 
    activityType: 'call',
    isDaily: true,
    status: 'todo' 
  },
  { 
    id: 2, 
    title: 'Demo hệ thống ERP', 
    assignee: 'Quan VM', 
    reporter: 'Quan VM', 
    dealCode: 'DEAL-2026-00010',
    source: 'Dự án phần mềm KnowxHub', 
    createdDate: '08/04/2026', 
    dueDate: '05/05/2026', 
    priority: 'low', 
    activityType: 'meeting',
    isDaily: true,
    status: 'todo' 
  },
  { 
    id: 3, 
    title: 'Gửi mail đàm phán hợp đồng', 
    assignee: 'Hải DT', 
    reporter: 'Hải DT', 
    dealCode: 'DEAL-2026-00009',
    source: 'Lead Công ty Viettel Post', 
    createdDate: '09/01/2026', 
    dueDate: '07/05/2026', 
    priority: 'high', 
    activityType: 'email',
    isDaily: true,
    status: 'todo' 
  },
  { 
    id: 4, 
    title: 'Gửi báo giá sản phẩm CRM', 
    assignee: 'Lan PT', 
    reporter: 'Lan PT', 
    partnerName: 'Ngân hàng TMCP An Bình (ABBank)',
    partnerTax: 'MST: 0363217355',
    source: 'Dự án dịch vụ chăm sóc khách hàng', 
    createdDate: '10/02/2026', 
    dueDate: '07/05/2026', 
    priority: 'low', 
    activityType: 'email',
    isDaily: true,
    status: 'processing' 
  },
  { 
    id: 5, 
    title: 'Tư vấn phần mềm quản lý', 
    assignee: 'Trang LT', 
    reporter: 'Trang LT', 
    dealCode: 'DEAL-2026-00008',
    source: 'Lead Công ty Viettel Post', 
    createdDate: '11/03/2026', 
    dueDate: '07/05/2026', 
    priority: 'normal', 
    activityType: 'call',
    isDaily: true,
    status: 'processing' 
  },
  { 
    id: 6, 
    title: 'Gửi tài liệu giới thiệu giải pháp', 
    assignee: 'Quang BV', 
    reporter: 'Quang BV', 
    partnerName: 'Ngân hàng TMCP An Bình (ABBank)',
    partnerTax: 'MST: 0363217355',
    source: 'Dự án phần mềm KnowxHub', 
    createdDate: '12/03/2026', 
    dueDate: '05/05/2026', 
    priority: 'normal', 
    activityType: 'email',
    isDaily: true,
    status: 'cancelled' 
  },
  { 
    id: 7, 
    title: 'Chúc mừng sinh nhật khách hàng', 
    assignee: 'Phuong NT', 
    reporter: 'Phuong NT', 
    partnerName: 'Ngân hàng TMCP An Bình (ABBank)',
    partnerTax: 'MST: 0363217355',
    source: 'Lead Khách hàng: Trần Thị B', 
    createdDate: '13/02/2026', 
    dueDate: '07/05/2026', 
    priority: 'high', 
    activityType: 'call',
    isDaily: true,
    status: 'done' 
  },
  { 
    id: 8, 
    title: 'Ký kết hợp đồng triển khai', 
    assignee: 'admin', 
    reporter: 'admin', 
    dealCode: 'DEAL-2026-00005',
    source: 'Dự án phần mềm KnowxHub', 
    createdDate: '14/01/2026', 
    dueDate: '07/05/2026', 
    priority: 'low', 
    activityType: 'meeting',
    isDaily: true,
    status: 'done' 
  },
];

const DEFAULT_TEAM_TASKS = [
  { id: 101, title: 'Chuẩn hóa quy trình hỗ trợ khách hàng quý 2', department: 'Phòng Dịch vụ khách hàng', assignee: '', dueDate: '2026-04-20', priority: 'high', source: 'Dự án dịch vụ chăm sóc khách hàng', status: 'todo', subTasks: [] },
  { id: 102, title: 'Thiết lập backlog tính năng module ticket', department: 'Phòng Công nghệ', assignee: 'Quan VM', dueDate: '2026-04-18', priority: 'normal', source: 'Dự án phần mềm KnowxHub', status: 'processing', subTasks: [] },
  { id: 103, title: 'Rà soát SLA khách hàng doanh nghiệp', department: 'Phòng Vận hành', assignee: 'Phuong NT', dueDate: '2026-04-12', priority: 'normal', source: 'Lead Công ty Viettel Post', status: 'done', subTasks: [] },
];

function readJsonArray(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function writeJsonArray(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function notifyTasksUpdated() {
  window.dispatchEvent(new Event(TASKS_UPDATED_EVENT));
}

export function loadPersonalTasks() {
  return readJsonArray(PERSONAL_TASKS_KEY, DEFAULT_PERSONAL_TASKS);
}

export function savePersonalTasks(tasks) {
  writeJsonArray(PERSONAL_TASKS_KEY, tasks);
}

export function loadTeamTasks() {
  return readJsonArray(TEAM_TASKS_KEY, DEFAULT_TEAM_TASKS).map((task) => ({
    ...task,
    subTasks: Array.isArray(task.subTasks) ? task.subTasks : [],
  }));
}

export function saveTeamTasks(tasks) {
  writeJsonArray(TEAM_TASKS_KEY, tasks);
}

function mapTeamToPersonalTask(teamTask) {
  return {
    id: 100000 + Number(teamTask.id),
    teamTaskId: teamTask.id,
    title: teamTask.title,
    assignee: teamTask.assignee,
    source: teamTask.source,
    dueDate: teamTask.dueDate,
    priority: teamTask.priority,
    status: teamTask.status,
  };
}

export function syncTeamTaskToPersonal(teamTask) {
  const current = loadPersonalTasks();
  const withoutCurrent = current.filter((item) => item.teamTaskId !== teamTask.id);

  if (!teamTask.assignee) {
    savePersonalTasks(withoutCurrent);
    notifyTasksUpdated();
    return;
  }

  const next = [mapTeamToPersonalTask(teamTask), ...withoutCurrent];
  savePersonalTasks(next);
  notifyTasksUpdated();
}

export function createTeamTask(taskInput) {
  const current = loadTeamTasks();
  const nextId = current.reduce((max, item) => Math.max(max, Number(item.id) || 0), 100) + 1;
  const newTask = {
    id: nextId,
    title: taskInput.title || '',
    department: taskInput.department || '',
    assignee: taskInput.assignee || '',
    dueDate: taskInput.dueDate || '',
    priority: taskInput.priority || 'normal',
    source: taskInput.source || '',
    status: taskInput.status || 'todo',
    description: taskInput.description || '',
    subTasks: Array.isArray(taskInput.subTasks) ? taskInput.subTasks : [],
  };
  const next = [newTask, ...current];
  saveTeamTasks(next);
  notifyTasksUpdated();
  return newTask;
}

export function findTeamTaskById(taskId) {
  const id = Number(taskId);
  return loadTeamTasks().find((task) => Number(task.id) === id) || null;
}

export function updateTeamTaskById(taskId, updater) {
  const id = Number(taskId);
  const current = loadTeamTasks();
  let updated = null;
  const next = current.map((task) => {
    if (Number(task.id) !== id) return task;
    const candidate = typeof updater === 'function' ? updater(task) : { ...task, ...updater };
    updated = { ...task, ...candidate, id: task.id };
    return updated;
  });
  saveTeamTasks(next);
  notifyTasksUpdated();
  return updated;
}
