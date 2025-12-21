import { useState, useMemo, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Plus, Search, ArrowUpDown, Lock } from 'lucide-react';
import { Layout } from './components/Layout';
import { TaskBoard } from './components/TaskBoard';
import { AddTaskModal } from './components/AddTaskModal';
import { EditTaskModal } from './components/EditTaskModal';
import { LoginModal } from './components/LoginModal';
import { useTasks } from './hooks/useTasks';
import { useAuth } from './hooks/useAuth';
import { useSettings } from './hooks/useSettings';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import { Dashboard } from './pages/Dashboard';
import { CalendarPage } from './pages/CalendarPage';
import { SettingsPage } from './pages/SettingsPage';
import type { Task } from './types';

type SortBy = 'dueDate' | 'createdAt' | 'title';
type SortOrder = 'asc' | 'desc';

function TasksPage() {
  const { tasks, addTask, updateTask, updateTaskStatus, deleteTask } = useTasks();
  const { isAdmin, login } = useAuth();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('dueDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const sortedAndFilteredTasks = useMemo(() => {
    // First filter
    let result = tasks.filter(task =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Then sort
    result = [...result].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'dueDate':
          comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          break;
        case 'createdAt':
          comparison = a.createdAt - b.createdAt;
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [tasks, searchQuery, sortBy, sortOrder]);

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  const handleSaveEdit = (id: string, data: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
    updateTask(id, data);
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const handleAddTaskClick = () => {
    if (isAdmin) {
      setIsAddModalOpen(true);
    } else {
      setShowLoginModal(true);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Tasks</h1>
          <p className="text-slate-500 mt-1">Manage your tasks efficiently</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          {/* Search */}
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white"
            />
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="px-3 py-2.5 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white text-sm font-medium text-slate-600"
            >
              <option value="dueDate">Due Date</option>
              <option value="createdAt">Created</option>
              <option value="title">Title</option>
            </select>
            <button
              onClick={toggleSortOrder}
              className={`p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all ${sortOrder === 'desc' ? 'bg-slate-100' : ''
                }`}
              title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            >
              <ArrowUpDown size={20} className={`text-slate-500 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''
                }`} />
            </button>
          </div>

          {/* Add Task Button */}
          <button
            onClick={handleAddTaskClick}
            className={`flex items-center gap-2 px-4 py-2.5 font-medium rounded-xl shadow-lg transition-all active:scale-95 whitespace-nowrap ${isAdmin
              ? 'bg-primary text-white hover:bg-blue-600 shadow-blue-500/30'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 shadow-slate-200/50'
              }`}
          >
            {isAdmin ? <Plus size={20} /> : <Lock size={18} />}
            Add Task
          </button>
        </div>
      </div>

      {/* Board */}
      <TaskBoard
        tasks={sortedAndFilteredTasks}
        onStatusChange={updateTaskStatus}
        onDelete={deleteTask}
        onEdit={handleEditTask}
        isAdmin={isAdmin}
      />

      {/* Add Modal */}
      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={addTask}
      />

      {/* Edit Modal */}
      <EditTaskModal
        isOpen={editingTask !== null}
        task={editingTask}
        onClose={() => setEditingTask(null)}
        onSave={handleSaveEdit}
        isAdmin={isAdmin}
      />

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={login}
      />
    </div>
  );
}

function AppContent() {
  const { tasks } = useTasks();
  const { settings } = useSettings();

  // Apply Appearance Settings
  useEffect(() => {
    const root = document.documentElement;
    const { darkMode, themeColor, fontSize } = settings.appearance;

    // Dark Mode
    if (darkMode) {
      root.style.setProperty('--color-background', '#0f172a');
      root.style.setProperty('--color-surface', '#1e293b');
      // For text colors, we might need more comprehensive dark mode variables
      // But for now, let's swap the main backgrounds and ensure text is readable
      document.body.classList.add('dark');
      document.body.style.color = '#f8fafc';
    } else {
      root.style.setProperty('--color-background', '#F8F9FA');
      root.style.setProperty('--color-surface', '#FFFFFF');
      document.body.classList.remove('dark');
      document.body.style.color = '#0f172a';
    }

    // Theme Color
    const themeParams: Record<string, string> = {
      blue: '#3B82F6',
      purple: '#8B5CF6',
      green: '#10B981',
      orange: '#F97316',
      pink: '#EC4899',
    };
    root.style.setProperty('--color-primary', themeParams[themeColor] || themeParams.blue);

    // Font Size
    const fontSizeMap = {
      small: '14px',
      medium: '16px',
      large: '18px',
    };
    root.style.fontSize = fontSizeMap[fontSize];

  }, [settings.appearance]);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard tasks={tasks} />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/calendar" element={<CalendarPage tasks={tasks} />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;
