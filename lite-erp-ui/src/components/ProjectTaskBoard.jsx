import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Search, Plus, ArrowLeft, Filter, Settings, MoreHorizontal, User, Calendar, MessageSquare } from 'lucide-react';
import { mockStore } from '../utils/mockStore';

const INITIAL_BOARD = {
  columns: {
    'todo': { id: 'todo', title: 'Mới', taskIds: ['t1', 't2'] },
    'inprogress': { id: 'inprogress', title: 'Đang triển khai', taskIds: ['t3'] },
    'waiting': { id: 'waiting', title: 'Chế độ chờ/Phản hồi', taskIds: ['t4'] },
    'done': { id: 'done', title: 'Hoàn thành', taskIds: ['t5'] }
  },
  tasks: {
    't1': { id: 't1', title: 'Khảo sát hạ tầng mạng tại site', user: 'Hung NV', date: '25/04', tag: 'Survey', priority: 'High' },
    't2': { id: 't2', title: 'Thiết kế sơ đồ logic hệ thống', user: 'admin', date: '28/04', tag: 'Design', priority: 'Medium' },
    't3': { id: 't3', title: 'Cấu hình VPS và Firewall', user: 'Quan VM', date: '20/04', tag: 'Implementation', priority: 'High' },
    't4': { id: 't4', title: 'Đợi khách hàng bàn giao tài khoản admin', user: 'Phuong NT', date: '18/04', tag: 'External', priority: 'Low' },
    't5': { id: 't5', title: 'Họp kick-off dự án', user: 'Nguyen Van A', date: '10/04', tag: 'Management', priority: 'High' }
  },
  columnOrder: ['todo', 'inprogress', 'waiting', 'done']
};

export default function ProjectTaskBoard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = mockStore.getProject(id);
  const [board, setBoard] = useState(INITIAL_BOARD);

  if (!project) return <div>Không tìm thấy dự án</div>;

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
      setBoard({ ...board, columns: { ...board.columns, [newColumn.id]: newColumn } });
      return;
    }

    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = { ...start, taskIds: startTaskIds };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = { ...finish, taskIds: finishTaskIds };

    setBoard({
      ...board,
      columns: { ...board.columns, [newStart.id]: newStart, [newFinish.id]: newFinish }
    });
  };

  return (
    <div className="contract-page-container" style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: '0', background: '#f8fafc' }}>
      <div style={{ background: 'white', padding: '16px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={() => navigate('/projects')} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '8px', borderRadius: '50%', color: '#64748b' }}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '18px', fontWeight: 800, color: '#1e293b', margin: 0 }}>{project.name}</h1>
              <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '12px', background: '#eff6ff', color: '#3b82f6', fontWeight: 700 }}>{project.customer}</span>
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>Quản lý: <strong>{project.manager}</strong> • Hạn: {project.deadline}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
           <button className="btn-primary" style={{ padding: '8px 16px' }}><Plus size={16} /> Nhiệm vụ mới</button>
           <button className="btn-outline-brand" style={{ padding: '8px', width: '38px' }}><Filter size={18} /></button>
           <button className="btn-outline-brand" style={{ padding: '8px', width: '38px' }}><Settings size={18} /></button>
        </div>
      </div>

      <div style={{ flex: 1, padding: '24px', overflowX: 'auto' }}>
        <DragDropContext onDragEnd={onDragEnd}>
          <div style={{ display: 'flex', gap: '24px', height: '100%', minWidth: 'max-content' }}>
            {board.columnOrder.map((columnId) => {
              const column = board.columns[columnId];
              const tasks = column.taskIds.map(taskId => board.tasks[taskId]);

              return (
                <div key={column.id} style={{ width: '280px', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {column.title} <span style={{ marginLeft: '6px', color: '#94a3b8', fontWeight: 400 }}>{tasks.length}</span>
                    </h3>
                    <Plus size={16} color="#94a3b8" style={{ cursor: 'pointer' }} />
                  </div>

                  <Droppable droppableId={column.id}>
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} style={{ flex: 1, minHeight: '100px' }}>
                        {tasks.map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided) => (
                              <div
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                ref={provided.innerRef}
                                style={{
                                  ...provided.draggableProps.style,
                                  background: 'white',
                                  padding: '16px',
                                  borderRadius: '8px',
                                  border: '1px solid #e2e8f0',
                                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                                  marginBottom: '12px',
                                  userSelect: 'none'
                                }}
                              >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                   <span style={{ fontSize: '11px', fontWeight: 700, color: '#3b82f6', background: '#eff6ff', padding: '2px 6px', borderRadius: '4px' }}>{task.tag}</span>
                                   <MoreHorizontal size={14} color="#cbd5e1" />
                                </div>
                                <div style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', lineHeight: '1.4', marginBottom: '16px' }}>{task.title}</div>
                                
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 700 }}>{task.user.charAt(0)}</div>
                                      <div style={{ fontSize: '11px', color: '#64748b' }}>{task.date}</div>
                                   </div>
                                   <div style={{ display: 'flex', gap: '4px' }}>
                                      <MessageSquare size={12} color="#cbd5e1" />
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
