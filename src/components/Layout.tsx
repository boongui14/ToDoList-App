import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Calendar, Settings, Menu, X } from 'lucide-react';

interface LayoutProps {
    children: React.ReactNode;
}

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: CheckSquare, label: 'My Tasks', path: '/tasks' },
    { icon: Calendar, label: 'Calendar', path: '/calendar' },
    { icon: Settings, label: 'Settings', path: '/settings' },
];

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="flex h-screen bg-background overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-white/80 backdrop-blur-md border-r border-slate-200 hidden md:flex flex-col">
                <div className="p-6">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        TaskFlow
                    </h1>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    {navItems.map((item) => (
                        <NavItem
                            key={item.path}
                            icon={<item.icon size={20} />}
                            label={item.label}
                            path={item.path}
                            active={location.pathname === item.path}
                        />
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-200">
                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-medium text-sm">
                            JD
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">John Doe</p>
                            <p className="text-xs text-slate-500 truncate">john@example.com</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center px-4 z-50">
                <button
                    className="p-2 hover:bg-slate-100 rounded-lg"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? (
                        <X size={24} className="text-slate-600" />
                    ) : (
                        <Menu size={24} className="text-slate-600" />
                    )}
                </button>
                <span className="ml-4 font-bold text-lg">TaskFlow</span>
            </div>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div className="md:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
            )}

            {/* Mobile Sidebar */}
            <aside className={`md:hidden fixed top-16 left-0 bottom-0 w-64 bg-white z-40 transform transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                <nav className="px-4 py-4 space-y-2">
                    {navItems.map((item) => (
                        <NavItem
                            key={item.path}
                            icon={<item.icon size={20} />}
                            label={item.label}
                            path={item.path}
                            active={location.pathname === item.path}
                            onClick={() => setMobileMenuOpen(false)}
                        />
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto pt-16 md:pt-0">
                <div className="max-w-7xl mx-auto p-4 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    path: string;
    active?: boolean;
    onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, path, active = false, onClick }) => (
    <Link
        to={path}
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${active
            ? 'bg-primary/10 text-primary font-medium'
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
    >
        {icon}
        <span>{label}</span>
    </Link>
);

