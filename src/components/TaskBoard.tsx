import React from 'react';
import { DndContext, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import type { Task } from '../types';
import { TaskColumn } from './TaskColumn';

interface TaskBoardProps {
    tasks: Task[];
    onStatusChange: (id: string, status: Task['status']) => void;
    onDelete: (id: string) => void;
    onEdit: (task: Task) => void;
    isAdmin?: boolean;
}

export const TaskBoard: React.FC<TaskBoardProps> = ({ tasks, onStatusChange, onDelete, onEdit, isAdmin = true }) => {
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) return;

        const taskId = active.id as string;
        const newStatus = over.id as Task['status'];
        const task = tasks.find((t) => t.id === taskId);

        if (task && task.status !== newStatus) {
            onStatusChange(taskId, newStatus);
        }
    };

    const columns: { title: string; status: Task['status'] }[] = [
        { title: 'To Do', status: 'todo' },
        { title: 'In Progress', status: 'doing' },
        { title: 'Completed', status: 'done' },
    ];

    return (
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
                {columns.map((col) => (
                    <TaskColumn
                        key={col.status}
                        title={col.title}
                        status={col.status}
                        tasks={tasks.filter((t) => t.status === col.status)}
                        onStatusChange={onStatusChange}
                        onDelete={onDelete}
                        onEdit={onEdit}
                        isAdmin={isAdmin}
                    />
                ))}
            </div>
        </DndContext>
    );
};

