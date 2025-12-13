import React, { useState } from 'react';
import { X, Calendar, Tag, Plus, Trash2, User, ListChecks } from 'lucide-react';
import type { CreateTaskInput, TaskStatus, SubTask, Priority } from '../types';

interface AddTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (task: CreateTaskInput) => void;
}

const AVAILABLE_TAGS = ['Design', 'Dev', 'Meeting', 'Personal', 'Urgent'];

export const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose, onAdd }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<TaskStatus>('todo');
    const [priority, setPriority] = useState<Priority>('medium');
    const [dueDate, setDueDate] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [newTag, setNewTag] = useState('');

    const [subTasks, setSubTasks] = useState<SubTask[]>([]);
    const [newSubTaskTitle, setNewSubTaskTitle] = useState('');
    const [assigneeName, setAssigneeName] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd({
            title,
            description,
            status,
            priority,
            dueDate: dueDate || new Date().toISOString(),
            tags: selectedTags,
            subTasks,
            assignee: assigneeName.trim() ? { id: crypto.randomUUID(), name: assigneeName.trim(), avatar: '👤' } : null,
        });
        onClose();
        // Reset form
        setTitle('');
        setDescription('');
        setStatus('todo');
        setPriority('medium');

        setDueDate('');
        setSelectedTags([]);
        setSubTasks([]);
        setNewSubTaskTitle('');
        setAssigneeName('');
    };

    const handleAddTag = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && newTag.trim()) {
            e.preventDefault();
            const tagToAdd = newTag.trim();
            if (!selectedTags.includes(tagToAdd)) {
                setSelectedTags(prev => [...prev, tagToAdd]);
            }
            setNewTag('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setSelectedTags(prev => prev.filter(tag => tag !== tagToRemove));
    };

    const toggleAvailableTag = (tag: string) => {
        if (selectedTags.includes(tag)) {
            removeTag(tag);
        } else {
            setSelectedTags(prev => [...prev, tag]);
        }
    };


    const addSubTask = () => {
        if (newSubTaskTitle.trim()) {
            const newSubTask: SubTask = {
                id: crypto.randomUUID(),
                title: newSubTaskTitle.trim(),
                completed: false,
            };
            setSubTasks(prev => [...prev, newSubTask]);
            setNewSubTaskTitle('');
        }
    };

    const removeSubTask = (id: string) => {
        setSubTasks(prev => prev.filter(st => st.id !== id));
    };

    const handleSubTaskKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addSubTask();
        }
    };



    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl transform transition-all max-h-[90vh] overflow-hidden flex flex-col">
                <div className="flex justify-between items-center p-6 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900">New Task</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            placeholder="What needs to be done?"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none h-24"
                            placeholder="Add some details..."
                        />
                    </div>

                    {/* Sub-tasks Section */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-1.5">
                            <ListChecks size={16} />
                            Sub-tasks
                        </label>
                        <div className="space-y-2">
                            {subTasks.map(subTask => (
                                <div key={subTask.id} className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg group">
                                    <span className="flex-1 text-sm text-slate-700">{subTask.title}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeSubTask(subTask.id)}
                                        className="text-slate-400 hover:text-danger opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={newSubTaskTitle}
                                    onChange={(e) => setNewSubTaskTitle(e.target.value)}
                                    onKeyDown={handleSubTaskKeyDown}
                                    className="flex-1 px-3 py-2 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                                    placeholder="Add a sub-task..."
                                />
                                <button
                                    type="button"
                                    onClick={addSubTask}
                                    className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                                >
                                    <Plus size={18} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Assignee Section */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1.5">
                            <User size={16} />
                            Assign To
                        </label>
                        <input
                            type="text"
                            value={assigneeName}
                            onChange={(e) => setAssigneeName(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            placeholder="Enter staff name..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value as Priority)}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white"
                            >
                                <option value="low">Low Priority</option>
                                <option value="medium">Medium Priority</option>
                                <option value="high">High Priority</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white"
                            >
                                <option value="todo">To Do</option>
                                <option value="doing">In Progress</option>
                                <option value="done">Completed</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>

                            <div className="relative">
                                <input
                                    type="date"
                                    required
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                                <Calendar size={16} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Tags</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {AVAILABLE_TAGS.map(tag => (
                                <button
                                    key={tag}
                                    type="button"
                                    onClick={() => toggleAvailableTag(tag)}
                                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${selectedTags.includes(tag)
                                        ? 'bg-primary text-white'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                >
                                    <Tag size={14} />
                                    {tag}
                                </button>
                            ))}
                        </div>

                        <div className="flex flex-wrap gap-2 mb-2">
                            {selectedTags.filter(t => !AVAILABLE_TAGS.includes(t)).map(tag => (
                                <span
                                    key={tag}
                                    className="px-3 py-1.5 rounded-full text-sm font-medium bg-primary text-white flex items-center gap-1.5"
                                >
                                    <Tag size={14} />
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => removeTag(tag)}
                                        className="hover:text-red-200"
                                    >
                                        <X size={14} />
                                    </button>
                                </span>
                            ))}
                        </div>

                        <div className="relative">
                            <input
                                type="text"
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                onKeyDown={handleAddTag}
                                placeholder="Type custom tag & press Enter..."
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
                            />
                            <Tag size={16} className="absolute right-3 top-2.5 text-slate-400 pointer-events-none" />
                        </div>

                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-blue-600 shadow-lg shadow-blue-500/30 transition-all"
                        >
                            Create Task
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

