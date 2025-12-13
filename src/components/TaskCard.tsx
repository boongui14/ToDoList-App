import React from 'react';
import { Calendar, Pencil, Trash2, AlertCircle, ListChecks } from 'lucide-react';
import { format, isPast, parseISO, startOfDay } from 'date-fns';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import type { Task } from '../types';

interface TaskCardProps {
    task: Task;
    onStatusChange: (id: string, status: Task['status']) => void;
    onDelete: (id: string) => void;
    onEdit: (task: Task) => void;
}

const statusColors = {
    todo: 'bg-slate-500',
    doing: 'bg-primary',
    done: 'bg-success',
};

const tagColors: Record<string, string> = {
    'Design': 'bg-pink-100 text-pink-700',
    'Dev': 'bg-blue-100 text-blue-700',
    'Meeting': 'bg-amber-100 text-amber-700',
    'Personal': 'bg-emerald-100 text-emerald-700',
    'Urgent': 'bg-red-100 text-red-700',
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, onDelete, onStatusChange, onEdit }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: task.id,
        data: { task },
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab',
    };

    // Check if task is overdue (past due date and not done)
    const isOverdue = task.status !== 'done' && isPast(startOfDay(parseISO(task.dueDate))) &&
        startOfDay(parseISO(task.dueDate)).getTime() < startOfDay(new Date()).getTime();

    // Calculate sub-tasks progress
    const subTasks = task.subTasks || [];
    const completedSubTasks = subTasks.filter(st => st.completed).length;
    const totalSubTasks = subTasks.length;
    const subTaskProgress = totalSubTasks > 0 ? (completedSubTasks / totalSubTasks) * 100 : 0;

    const priorityColors = {
        low: 'bg-blue-50 text-blue-700 border-blue-200',
        medium: 'bg-amber-50 text-amber-700 border-amber-200',
        high: 'bg-red-50 text-red-700 border-red-200',
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={`group bg-white rounded-2xl p-4 shadow-card hover:shadow-float transition-all duration-300 border relative overflow-hidden touch-none ${isOverdue ? 'border-red-300 bg-red-50/30' : 'border-transparent hover:border-slate-100'
                }`}
        >
            {/* Status Indicator Strip */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${isOverdue ? 'bg-red-500' : statusColors[task.status]}`} />

            <div className="flex justify-between items-start mb-2 pl-2">
                <div className="flex flex-wrap gap-2">
                    {isOverdue && (
                        <span className="px-2 py-1 rounded-md text-xs font-medium bg-red-100 text-red-700 flex items-center gap-1">
                            <AlertCircle size={12} />
                            Overdue
                        </span>
                    )}
                    {task.priority && (
                        <span className={`px-2 py-1 rounded-md text-xs font-medium border ${priorityColors[task.priority] || priorityColors.medium}`}>
                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </span>
                    )}
                    {task.tags.map((tag) => (

                        <span
                            key={tag}
                            className={`px-2 py-1 rounded-md text-xs font-medium ${tagColors[tag] || 'bg-slate-100 text-slate-600'
                                }`}
                        >
                            {tag}
                        </span>
                    ))}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={() => onEdit(task)}
                        className="text-slate-400 hover:text-primary p-1 rounded hover:bg-slate-50"
                        title="Edit task"
                    >
                        <Pencil size={16} />
                    </button>
                    <button
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={() => onDelete(task.id)}
                        className="text-slate-400 hover:text-danger p-1 rounded hover:bg-slate-50"
                        title="Delete task"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            <div className="pl-2">
                <h3 className="font-semibold text-slate-900 mb-1 leading-tight">{task.title}</h3>
                <p className="text-sm text-slate-500 mb-3 line-clamp-2">{task.description}</p>

                {/* Sub-tasks Progress */}
                {totalSubTasks > 0 && (
                    <div className="mb-3">
                        <div className="flex items-center gap-2 mb-1">
                            <ListChecks size={14} className="text-slate-400" />
                            <span className="text-xs font-medium text-slate-500">
                                {completedSubTasks}/{totalSubTasks} sub-tasks
                            </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-primary to-blue-400 rounded-full transition-all duration-300"
                                style={{ width: `${subTaskProgress}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Assignee */}
                {task.assignee && (
                    <div className="flex items-center gap-1.5 mb-3">
                        <span className="text-lg">{task.assignee.avatar}</span>
                        <span className="text-xs font-medium text-slate-600">{task.assignee.name}</span>
                    </div>
                )}

                <div className="flex items-center justify-between mt-2">
                    <div className={`flex items-center text-xs font-medium ${isOverdue ? 'text-red-500' : 'text-slate-400'}`}>
                        <Calendar size={14} className="mr-1.5" />
                        {format(new Date(task.dueDate), 'MMM d, yyyy')}
                    </div>

                    <select
                        value={task.status}
                        onPointerDown={(e) => e.stopPropagation()}
                        onChange={(e) => onStatusChange(task.id, e.target.value as Task['status'])}
                        className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-slate-600 outline-none focus:border-primary cursor-pointer hover:bg-slate-100"
                    >
                        <option value="todo">To Do</option>
                        <option value="doing">In Progress</option>
                        <option value="done">Completed</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

