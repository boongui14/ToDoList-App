import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import type { Task } from '../types';
import { TaskCard } from './TaskCard';

interface TaskColumnProps {
    title: string;
    status: Task['status'];
    tasks: Task[];
    onStatusChange: (id: string, status: Task['status']) => void;
    onDelete: (id: string) => void;
    onEdit: (task: Task) => void;
    isAdmin?: boolean;
}

const columnStyles = {
    todo: 'bg-slate-50/50 border-slate-100',
    doing: 'bg-blue-50/30 border-blue-100',
    done: 'bg-emerald-50/30 border-emerald-100',
};

const headerColors = {
    todo: 'bg-slate-200 text-slate-700',
    doing: 'bg-blue-100 text-blue-700',
    done: 'bg-emerald-100 text-emerald-700',
};

export const TaskColumn: React.FC<TaskColumnProps> = ({
    title,
    status,
    tasks,
    onStatusChange,
    onDelete,
    onEdit,
    isAdmin = true
}) => {
    const { setNodeRef, isOver } = useDroppable({
        id: status,
    });

    return (
        <div
            ref={setNodeRef}
            className={`flex flex-col h-full rounded-2xl border ${columnStyles[status]} p-4 min-w-[300px] transition-colors ${isOver ? 'bg-slate-100 ring-2 ring-primary/20' : ''
                }`}
        >
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <h2 className="font-bold text-slate-700">{title}</h2>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${headerColors[status]}`}>
                        {tasks.length}
                    </span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
                {tasks.map((task) => (
                    <TaskCard
                        key={task.id}
                        task={task}
                        onStatusChange={onStatusChange}
                        onDelete={onDelete}
                        onEdit={onEdit}
                        isAdmin={isAdmin}
                    />
                ))}
            </div>
        </div>
    );
};

