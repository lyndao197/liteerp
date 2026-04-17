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
  { id: 1, title: 'Gọi điện xác nhận nhu cầu', assignee: 'Hung NV', source: 'Lead Công ty Viettel Post', dueDate: '2026-04-09', priority: 'high', status: 'todo' },
  { id: 2, title: 'Gửi báo giá sản phẩm CRM', assignee: 'admin', source: 'Dự án dịch vụ chăm sóc khách hàng', dueDate: '2026-04-10', priority: 'normal', status: 'processing' },
  { id: 3, title: 'Chúc mừng sinh nhật khách hàng', assignee: 'Phuong NT', source: 'Lead Khách hàng: Trần Thị B', dueDate: '2026-04-10', priority: 'normal', status: 'done' },
  { id: 4, title: 'Demo hệ thống ERP', assignee: 'Quan VM', source: 'Dự án phần mềm KnowxHub', dueDate: '2026-04-12', priority: 'normal', status: 'todo' },
  { id: 5, title: 'Tư vấn phần mềm quản lý', assignee: 'Hung NV', source: 'Lead Công ty Viettel Post', dueDate: '2026-04-10', priority: 'normal', status: 'processing' },
  { id: 6, title: 'Khảo sát quy trình nghiệp vụ', assignee: 'admin', source: 'Dự án dịch vụ chăm sóc khách hàng', dueDate: '2026-04-15', priority: 'low', status: 'todo' },
  { id: 7, title: 'Gửi tài liệu giới thiệu giải pháp', assignee: 'Phuong NT', source: 'Dự án phần mềm KnowxHub', dueDate: '2026-04-08', priority: 'low', status: 'cancelled' },
  { id: 8, title: 'Đàm phán hợp đồng cung cấp', assignee: 'Quan VM', source: 'Lead Công ty Viettel Post', dueDate: '2026-04-11', priority: 'high', status: 'todo' },
  { id: 9, title: 'Follow-up khách hàng sau demo', assignee: 'Hung NV', source: 'Dự án dịch vụ chăm sóc khách hàng', dueDate: '2026-04-13', priority: 'normal', status: 'processing' },
  { id: 10, title: 'Ký kết hợp đồng triển khai', assignee: 'admin', source: 'Dự án phần mềm KnowxHub', dueDate: '2026-04-14', priority: 'high', status: 'done' },
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
