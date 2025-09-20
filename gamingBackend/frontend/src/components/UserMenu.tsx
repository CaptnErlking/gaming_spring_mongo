import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AuthUser } from '../types';
import { User, LogOut, Settings, Crown } from 'lucide-react';

interface UserMenuProps {
  user: AuthUser;
}

const UserMenu: React.FC<UserMenuProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setIsOpen(false);
  };

  const handleAdminClick = () => {
    navigate('/admin/dashboard');
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* User avatar button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-bg-tertiary transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
      >
        <div className="w-8 h-8 bg-accent-primary rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-gaming-dark-950" />
        </div>
        <div className="hidden md:block text-left">
          <div className="text-sm font-medium text-text-primary">
            {user.name}
          </div>
          <div className="text-xs text-text-muted flex items-center">
            {user.role === 'ADMIN' && <Crown className="w-3 h-3 mr-1" />}
            {user.role}
          </div>
        </div>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-bg-secondary border border-border-primary rounded-lg shadow-lg z-50">
          <div className="py-2">
            {/* User info */}
            <div className="px-4 py-2 border-b border-border-primary">
              <div className="text-sm font-medium text-text-primary">
                {user.name}
              </div>
              <div className="text-xs text-text-muted">
                {user.email}
              </div>
              {user.balance !== undefined && (
                <div className="text-xs text-accent-primary font-medium mt-1">
                  Balance: ${user.balance.toFixed(2)}
                </div>
              )}
            </div>

            {/* Menu items */}
            <button
              onClick={handleProfileClick}
              className="w-full px-4 py-2 text-left text-sm text-text-primary hover:bg-bg-tertiary transition-colors flex items-center space-x-2"
            >
              <Settings className="w-4 h-4" />
              <span>Profile</span>
            </button>

            {user.role === 'ADMIN' && (
              <button
                onClick={handleAdminClick}
                className="w-full px-4 py-2 text-left text-sm text-text-primary hover:bg-bg-tertiary transition-colors flex items-center space-x-2"
              >
                <Crown className="w-4 h-4 text-accent-secondary" />
                <span>Admin Panel</span>
              </button>
            )}

            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
