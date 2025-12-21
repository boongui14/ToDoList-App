export type TaskStatus = 'todo' | 'doing' | 'done';
export type Priority = 'low' | 'medium' | 'high';

// Sub-task interface for checklist items within a task
export interface SubTask {
    id: string;
    title: string;
    completed: boolean;
    order?: number; // Optional for backward compatibility with existing data
}

// Staff member interface for task assignment
export interface StaffMember {
    id: string;
    name: string;
    avatar?: string;
}

// Available staff members (mock data)
export const STAFF_MEMBERS: StaffMember[] = [
    { id: '1', name: 'John Doe', avatar: '👨‍💼' },
    { id: '2', name: 'Jane Smith', avatar: '👩‍💻' },
    { id: '3', name: 'Bob Johnson', avatar: '👨‍🔧' },
    { id: '4', name: 'Alice Williams', avatar: '👩‍🎨' },
    { id: '5', name: 'Charlie Brown', avatar: '👨‍🎓' },
];

export interface Task {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    priority: Priority;
    tags: string[];
    dueDate: string; // ISO string
    createdAt: number;
    subTasks: SubTask[];
    assignee: StaffMember | null;
}

export type CreateTaskInput = Omit<Task, 'id' | 'createdAt'>;

// User profile settings
export interface UserProfile {
    name: string;
    email: string;
    avatar: string;
}

// Appearance settings
export type ThemeColor = 'blue' | 'purple' | 'green' | 'orange' | 'pink';
export type FontSize = 'small' | 'medium' | 'large';

export interface AppearanceSettings {
    darkMode: boolean;
    themeColor: ThemeColor;
    fontSize: FontSize;
}

// Notification settings
export interface NotificationSettings {
    dueDateReminders: boolean;
    weeklySummary: boolean;
    emailNotifications: boolean;
    taskAssignmentAlerts: boolean;
    pushNotifications: boolean;
}

// Combined user settings
export interface UserSettings {
    profile: UserProfile;
    appearance: AppearanceSettings;
    notifications: NotificationSettings;
}
