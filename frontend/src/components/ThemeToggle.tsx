import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-bg-tertiary transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 text-text-secondary hover:text-accent-primary transition-colors" />
      ) : (
        <Sun className="w-5 h-5 text-text-secondary hover:text-accent-primary transition-colors" />
      )}
    </button>
  );
};

export default ThemeToggle;
