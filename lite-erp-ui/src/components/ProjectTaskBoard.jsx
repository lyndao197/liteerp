import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Search, Plus, ArrowLeft, Filter, Settings, MoreHorizontal, User, Calendar, MessageSquare } from 'lucide-react';
import { mockStore } from '../utils/mockStore';

const STAGES = [
  'Triển khai nghiệp vụ theo Hợp đồng',
  'Thống nhất số liệu nghiệm thu',
  'Ký Biên bản nghiệm thu',
  'Thu hồi công nợ',
  'Thanh lý Hợp đồng'
];

const getDueDateStyle = (dueDate) => {
    if (!dueDate) return { color: '#64748b', borderColor: '#cbd5e1', backgroundColor: '#f8fafc' };
    if (dueDate < '2026-04-10') return { color: '#ef4444', borderColor: '#ef4444', backgroundColor: '#fef2f2' };
    if (dueDate === '2026-04-10') return { color: '#ca8a04', borderColor: '#fef08a', backgroundColor: '#fef9c3' };
    return { color: '#16a34a', borderColor: '#bbf7d0', backgroundColor: '#f0fdf4' };
};

const getInitials = (name) => {
    if (!name) return '?';
    const parts = String(name).trim().split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const createDefaultBoard = (project) => {
  const pid = project?.id || 'PRJ-TMP';
  const signedDate = new Date();
  return {
    columns: {
        todo: { id: 'todo', title: 'Mới', taskIds: [`${pid}-T1`, [`${pid}-T2`]] },
        inprogress: { id: 'inprogress', title: 'Đang triển khai', taskIds: [`${pid}-T3`, [`${pid}-T4`]] },
        done: { id: 'done', title: 'Hoàn thành', taskIds: [`${pid}-T5`] }
    },
    tasks: {
        [`${pid}-T1`]: { id: `${pid}-T1`, title: 'Kick-off dự án với khách hàng', user: project?.manager || 'admin', date: signedDate.toISOString().slice(0, 10), tag: 'Kick-off', priority: 'High' },
        [`${pid}-T2`]: { id: `${pid}-T2`, title: 'Thành lập ban triển khai & Phân công', user: project?.manager || 'admin', date: signedDate.toISOString().slice(0, 10), tag: 'Planning', priority: 'High' },
        [`${pid}-T3`]: { id: `${pid}-T3`, title: `Triển khai hợp đồng cho KH ${project?.customer}`, user: project?.manager || 'admin', date: signedDate.toISOString().slice(0, 10), tag: 'Implementation', priority: 'Medium' },
        [`${pid}-T4`]: { id: `${pid}-T4`, title: 'Thống nhất số liệu nghiệm thu đợt 1', user: project?.manager || 'admin', date: signedDate.toISOString().slice(0, 10), tag: 'Review', priority: 'Medium' },
        [`${pid}-T5`]: { id: `${pid}-T5`, title: 'Ký biên bản bàn giao tổng thể', user: project?.manager || 'admin', date: signedDate.toISOString().slice(0, 10), tag: 'Handover', priority: 'Medium' }
    },
    columnOrder: ['todo', 'inprogress', 'done']
  };
};

export default function ProjectTaskBoard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(() => mockStore.getProject(id));
  const [board, setBoard] = useState(() => mockStore.getProjectBoard(id) || createDefaultBoard(project));
  
  const contract = project?.contractId ? mockStore.getContract(project.contractId) : null;

  const handleStageClick = (newStage) => {
    const updated = mockStore.updateProjectStatus(id, newStage);
    if (updated) {
      setProject({ ...updated });
    }
  };

  if (!project) return <div>Không tìm thấy dự án</div>;

  const persistBoard = (nextBoard) => {
    setBoard(nextBoard);
    mockStore.saveProjectBoard(id, nextBoard);
  };

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const start = board.columns[source.droppableId];
    const finish = board.columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = { ...start, taskIds: newTaskIds };
      persistBoard({ ...board, columns: { ...board.columns, [newColumn.id]: newColumn } });
      return;
    }

    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = { ...start, taskIds: startTaskIds };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = { ...finish, taskIds: finishTaskIds };

    persistBoard({
      ...board,
      columns: { ...board.columns, [newStart.id]: newStart, [newFinish.id]: newFinish }
    });
  };

  const addTask = (columnId = 'todo') => {
    const title = window.prompt('Nhập tên công việc mới');
    if (!title || !title.trim()) return;
    const taskId = `${id}-T${Date.now()}`;
    const task = {
      id: taskId,
      title: title.trim(),
      user: project.manager || 'admin',
      date: new Date().toISOString().slice(0, 10),
      tag: 'Manual',
      priority: 'Medium'
    };
    const target = board.columns[columnId];
    const nextBoard = {
      ...board,
      tasks: { ...board.tasks, [taskId]: task },
      columns: {
        ...board.columns,
        [columnId]: { ...target, taskIds: [taskId, ...target.taskIds] }
      }
    };
    persistBoard(nextBoard);
  };

  return (
    <div className="contract-page-container" style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: '0', background: '#f8fafc' }}>
      <div style={{ background: 'white', padding: '16px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={() => navigate('/projects')} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '8px', borderRadius: '50%', color: '#64748b' }}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#1e293b', margin: 0 }}>{project.name}</h1>
              <div style={{ display: 'flex', gap: '6px' }}>
                 <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '12px', background: '#eff6ff', color: '#3b82f6', fontWeight: 700 }}>{project.customer}</span>
                 {contract?.serviceType && (
                   <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '12px', background: '#f5f3ff', color: '#8b5cf6', fontWeight: 700 }}>{contract.serviceType}</span>
                 )}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '6px' }}>
               <div style={{ fontSize: '12px', color: '#64748b' }}>Quản lý: <strong style={{color: '#334155'}}>{project.manager}</strong></div>
               {contract?.contractValue && (
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Giá trị HĐ: <strong style={{color: '#e32b4c'}}>{contract.contractValue} ₫</strong></div>
               )}
               <div style={{ fontSize: '12px', color: '#64748b' }}>Hạn dự án: <strong style={{color: '#334155'}}>{project.deadline}</strong></div>
            </div>
          </div>
        </div>
      </div>

      {/* Project Stage Tracker */}
      <div style={{ background: 'white', padding: '12px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'center' }}>
         <div style={{ display: 'flex', alignItems: 'center', width: '100%', maxWidth: '1200px', padding: '0 40px' }}>
            {STAGES.map((stage, idx) => {
               const isActive = project.status === stage;
               const isPassed = STAGES.indexOf(project.status) > idx;
               
               return (
                  <React.Fragment key={stage}>
                     <div 
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative', cursor: 'pointer' }}
                        onClick={() => handleStageClick(stage)}
                     >
                        <div style={{ 
                           width: '28px', 
                           height: '28px', 
                           borderRadius: '50%', 
                           background: isActive ? '#e32b4c' : (isPassed ? '#10b981' : '#f1f5f9'), 
                           color: (isActive || isPassed) ? 'white' : '#94a3b8',
                           display: 'flex', 
                           alignItems: 'center', 
                           justifyContent: 'center',
                           fontSize: '12px',
                           fontWeight: 700,
                           zIndex: 2,
                           border: isActive ? '4px solid #fecaca' : (isPassed ? 'none' : '1px solid #e2e8f0'),
                           transition: 'all 0.2s'
                        }}>
                           {isPassed ? '✓' : idx + 1}
                        </div>
                        <div style={{ 
                           marginTop: '8px', 
                           fontSize: '11px', 
                           fontWeight: isActive ? 700 : 500, 
                           color: isActive ? '#1e293b' : '#64748b',
                           textAlign: 'center',
                           maxWidth: '120px'
                        }}>
                           {stage}
                        </div>
                     </div>
                     {idx < STAGES.length - 1 && (
                        <div style={{ 
                           flex: 1, 
                           height: '2px', 
                           background: isPassed ? '#10b981' : '#f1f5f9',
                           marginTop: '-20px' 
                        }}></div>
                     )}
                  </React.Fragment>
               );
            })}
         </div>
      </div>

      {/* TOOLBAR SECTION */}
      <div className="list-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '24px', background: 'white', padding: '24px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <div className="search-group" style={{ position: 'relative', display: 'flex', gap: '24px', alignItems: 'center' }}>
            <div className="contact-search-box" style={{ width: '434px', position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#44494D' }} />
              <input type="text" placeholder="Tìm kiếm trong dự án..." style={{ padding: '10px 16px 10px 44px', borderRadius: '8px', border: '1px solid #E2E8F0', background: '#F8F8F8', fontSize: '14px', width: '100%', outline: 'none', color: '#44494D' }} />
            </div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, padding: '0 24px 24px 24px', overflowX: 'auto' }}>
        <DragDropContext onDragEnd={onDragEnd}>
          <div style={{ display: 'flex', gap: '16px', height: '100%', minWidth: 'max-content' }}>
            {board.columnOrder.filter(id => id !== 'waiting').map((columnId) => {
              const column = board.columns[columnId];
              const tasks = column.taskIds.map(taskId => board.tasks[taskId]);

              return (
                <div key={column.id} className="kanban-column" style={{ width: '320px', backgroundColor: '#f6f6f6', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0', borderRadius: '8px', width: '24px', height: '24px', color: '#545454', fontSize: '14px', fontWeight: 700 }}>{tasks.length}</div>
                      <h3 style={{ margin: 0, color: '#545454', fontSize: '14px', fontWeight: 600, textTransform: 'uppercase' }}>{column.title}</h3>
                    </div>
                  </div>

                  <Droppable droppableId={column.id}>
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} style={{ flex: 1, minHeight: '100px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {tasks.map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided) => (
                              <div
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                ref={provided.innerRef}
                                className="activity-card opp-style"
                                style={{
                                  ...provided.draggableProps.style,
                                  background: 'white',
                                  padding: '16px',
                                  borderRadius: '8px',
                                  border: '1px solid #e2e8f0',
                                  cursor: 'pointer'
                                }}
                              >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', background: '#f1f5f9', padding: '2px 8px', borderRadius: '999px' }}>
                                        #{task.id.split('-').pop()}
                                      </span>
                                   </div>
                                   <MoreHorizontal size={14} color="#cbd5e1" />
                                </div>
                                <div style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', lineHeight: '1.4', marginBottom: '16px' }}>{task.title}</div>
                                
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed #f1f5f9', paddingTop: '12px' }}>
                                   <div style={{ ...getDueDateStyle(task.date), borderRadius: '4px', padding: '2px 6px', fontSize: '10px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', border: '1px solid' }}>
                                      <Calendar size={12} /> {task.date}
                                   </div>
                                   <div className="avatar-circle" style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#8b5cf6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>
                                      {getInitials(task.user)}
                                   </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}
