import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Home, 
  Gamepad2, 
  ShoppingBag, 
  CreditCard, 
  History, 
  User,
  Crown,
  X
} from 'lucide-react';

interface SidebarProps {
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const { user, isAdmin } = useAuth();
  const location = useLocation();

  const userNavItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/games', label: 'Games', icon: Gamepad2 },
    { path: '/products', label: 'Products', icon: ShoppingBag },
    { path: '/recharge', label: 'Recharge', icon: CreditCard },
    { path: '/transactions', label: 'Transactions', icon: History },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  const adminNavItems = [
    { path: '/admin/dashboard', label: 'Admin Dashboard', icon: Crown },
    { path: '/admin/games', label: 'Manage Games', icon: Gamepad2 },
    { path: '/admin/products', label: 'Manage Products', icon: ShoppingBag },
    { path: '/admin/members', label: 'Manage Members', icon: User },
    { path: '/admin/transactions', label: 'All Transactions', icon: History },
  ];

  const navItems = isAdmin ? adminNavItems : userNavItems;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border-primary">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Gamepad2 className="w-8 h-8 text-accent-primary" />
            <span className="text-xl font-bold gaming-text-gradient">
              Gaming Club
            </span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-lg hover:bg-bg-tertiary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                isActive
                  ? 'bg-accent-primary/20 text-accent-primary border border-accent-primary/30'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border-primary">
        <div className="text-xs text-text-muted text-center">
          <div>Welcome, {user?.name}</div>
          <div className="flex items-center justify-center mt-1">
            {isAdmin && <Crown className="w-3 h-3 mr-1 text-accent-secondary" />}
            <span className="capitalize">{user?.role?.toLowerCase()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
