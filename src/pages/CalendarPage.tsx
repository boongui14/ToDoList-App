import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO, getDay } from 'date-fns';
import type { Task } from '../types';

interface CalendarPageProps {
    tasks: Task[];
}

export const CalendarPage: React.FC<CalendarPageProps> = ({ tasks }) => {
    const today = new Date();
    const monthStart = startOfMonth(today);
    const monthEnd = endOfMonth(today);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // Get day of week offset for first day of month (0 = Sunday)
    const startDayOffset = getDay(monthStart);

    const getTasksForDay = (date: Date) => {
        return tasks.filter(task => {
            try {
                return isSameDay(parseISO(task.dueDate), date);
            } catch {
                return false;
            }
        });
    };

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Calendar</h1>
                <p className="text-slate-500 mt-1">View your tasks by due date</p>
            </div>

            {/* Month Header */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-6">{format(today, 'MMMM yyyy')}</h2>

                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-2 mb-2">
                    {dayNames.map(day => (
                        <div key={day} className="text-center text-sm font-medium text-slate-500 py-2">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2">
                    {/* Empty cells for offset */}
                    {Array.from({ length: startDayOffset }).map((_, i) => (
                        <div key={`empty-${i}`} className="aspect-square" />
                    ))}

                    {/* Day cells */}
                    {days.map(day => {
                        const dayTasks = getTasksForDay(day);
                        const isToday = isSameDay(day, today);

                        return (
                            <div
                                key={day.toISOString()}
                                className={`aspect-square rounded-lg border p-1 flex flex-col ${isToday
                                    ? 'border-primary bg-primary/5'
                                    : 'border-slate-100 hover:border-slate-200'
                                    }`}
                            >
                                <span className={`text-xs font-medium ${isToday ? 'text-primary' : 'text-slate-600'
                                    }`}>
                                    {format(day, 'd')}
                                </span>
                                {dayTasks.length > 0 && (
                                    <div className="flex-1 flex items-end">
                                        <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                                            {dayTasks.length}
                                        </span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Today's Tasks */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Today's Tasks</h2>
                {getTasksForDay(today).length > 0 ? (
                    <ul className="space-y-3">
                        {getTasksForDay(today).map(task => (
                            <li key={task.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                <div className={`w-2 h-2 rounded-full ${task.status === 'done' ? 'bg-emerald-500' :
                                    task.status === 'doing' ? 'bg-blue-500' : 'bg-slate-400'
                                    }`} />
                                <span className="text-slate-700">{task.title}</span>
                                <span className={`ml-auto text-xs font-medium px-2 py-1 rounded ${task.status === 'done' ? 'bg-emerald-100 text-emerald-700' :
                                    task.status === 'doing' ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-700'
                                    }`}>
                                    {task.status === 'todo' ? 'To Do' : task.status === 'doing' ? 'In Progress' : 'Completed'}
                                </span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-slate-500">No tasks due today</p>
                )}
            </div>
        </div>
    );
};
