import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from './ThemeToggle';
import UserMenu from './UserMenu';
import { Menu, Gamepad2 } from 'lucide-react';

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { user } = useAuth();

  return (
    <nav className="bg-bg-secondary border-b border-border-primary px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-bg-tertiary transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Gamepad2 className="w-8 h-8 text-accent-primary" />
            <span className="text-xl font-bold gaming-text-gradient">
              Gaming Club
            </span>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Theme toggle */}
          <ThemeToggle />

          {/* User menu */}
          {user && <UserMenu user={user} />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
