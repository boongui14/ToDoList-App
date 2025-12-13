import React from 'react';
import { CheckCircle2, Clock, ListTodo, TrendingUp } from 'lucide-react';
import type { Task } from '../types';

interface DashboardProps {
    tasks: Task[];
}

export const Dashboard: React.FC<DashboardProps> = ({ tasks }) => {
    const todoCount = tasks.filter(t => t.status === 'todo').length;
    const doingCount = tasks.filter(t => t.status === 'doing').length;
    const doneCount = tasks.filter(t => t.status === 'done').length;
    const totalCount = tasks.length;
    const completionRate = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

    const stats = [
        { label: 'Total Tasks', value: totalCount, icon: ListTodo, color: 'bg-slate-500', bgColor: 'bg-slate-50' },
        { label: 'To Do', value: todoCount, icon: Clock, color: 'bg-amber-500', bgColor: 'bg-amber-50' },
        { label: 'In Progress', value: doingCount, icon: TrendingUp, color: 'bg-blue-500', bgColor: 'bg-blue-50' },
        { label: 'Completed', value: doneCount, icon: CheckCircle2, color: 'bg-emerald-500', bgColor: 'bg-emerald-50' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-slate-500 mt-1">Overview of your task progress</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className={`${stat.bgColor} rounded-2xl p-6 border border-slate-100`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                                <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
                            </div>
                            <div className={`${stat.color} p-3 rounded-xl`}>
                                <stat.icon size={24} className="text-white" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Completion Rate */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Completion Rate</h2>
                <div className="flex items-center gap-4">
                    <div className="flex-1 h-4 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                            style={{ width: `${completionRate}%` }}
                        />
                    </div>
                    <span className="text-2xl font-bold text-slate-900">{completionRate}%</span>
                </div>
            </div>

            {/* Recent Activity Placeholder */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Tips</h2>
                <ul className="space-y-3 text-slate-600">
                    <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        Click "My Tasks" in the sidebar to manage your tasks
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        Drag and drop tasks between columns to change status
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        Use the search bar to find tasks quickly
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        Overdue tasks are highlighted in red
                    </li>
                </ul>
            </div>
        </div>
    );
};
