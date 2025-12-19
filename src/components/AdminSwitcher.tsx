import React, { useState } from 'react';
import { Lock, Unlock, ShieldCheck, Eye } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { LoginModal } from './LoginModal';

export const AdminSwitcher: React.FC = () => {
    const { isAdmin, login, logout } = useAuth();
    const [showLoginModal, setShowLoginModal] = useState(false);

    const handleClick = () => {
        if (isAdmin) {
            logout();
        } else {
            setShowLoginModal(true);
        }
    };

    return (
        <>
            <button
                onClick={handleClick}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 ${isAdmin
                        ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                title={isAdmin ? 'Click to logout' : 'Click to login as admin'}
            >
                {isAdmin ? (
                    <>
                        <ShieldCheck size={18} />
                        <span className="text-sm font-medium">Admin</span>
                        <Unlock size={14} className="ml-1 opacity-60" />
                    </>
                ) : (
                    <>
                        <Eye size={18} />
                        <span className="text-sm font-medium">Viewer</span>
                        <Lock size={14} className="ml-1 opacity-60" />
                    </>
                )}
            </button>

            <LoginModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                onLogin={login}
            />
        </>
    );
};
