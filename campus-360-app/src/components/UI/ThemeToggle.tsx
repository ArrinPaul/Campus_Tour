/**
 * Theme Toggle Component
 * Switch between light, dark, and system themes
 */

import { motion } from 'framer-motion';
import { useThemeStore, type ThemeMode } from '../../hooks/useThemeStore';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
  compact?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  showLabel = false,
  compact = false,
}) => {
  const { mode, resolvedTheme, toggleTheme, setMode } = useThemeStore();

  const themeOptions: { mode: ThemeMode; icon: React.ReactNode; label: string }[] = [
    {
      mode: 'light',
      label: 'Light',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
    },
    {
      mode: 'dark',
      label: 'Dark',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      ),
    },
    {
      mode: 'system',
      label: 'System',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
    },
  ];

  const currentIcon = themeOptions.find((t) => t.mode === mode)?.icon;

  // Compact button - just toggle
  if (compact) {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleTheme}
        className={`p-2 bg-white/10 dark:bg-white/10 light:bg-black/10 hover:bg-white/20 backdrop-blur-md rounded-full transition-colors ${className}`}
        aria-label={`Current theme: ${mode}. Click to change.`}
        title={`Theme: ${mode} (${resolvedTheme})`}
      >
        <span className="text-white dark:text-white light:text-slate-900">{currentIcon}</span>
      </motion.button>
    );
  }

  // Full toggle with options
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {showLabel && (
        <span className="text-sm text-white/70 dark:text-white/70 light:text-slate-700">Theme</span>
      )}
      <div className="flex bg-white/10 dark:bg-white/10 light:bg-black/5 backdrop-blur-md rounded-lg p-1">
        {themeOptions.map((option) => (
          <motion.button
            key={option.mode}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMode(option.mode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-all ${
              mode === option.mode
                ? 'bg-white/20 dark:bg-white/20 light:bg-black/10 text-white dark:text-white light:text-slate-900'
                : 'text-white/60 dark:text-white/60 light:text-slate-600 hover:text-white dark:hover:text-white light:hover:text-slate-900'
            }`}
            aria-label={`Set theme to ${option.label}`}
            aria-pressed={mode === option.mode}
          >
            {option.icon}
            <span className="hidden sm:inline">{option.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

interface ThemeToggleButtonProps {
  onClick?: () => void;
  className?: string;
}

export const ThemeToggleButton: React.FC<ThemeToggleButtonProps> = ({
  onClick,
  className = '',
}) => {
  const { mode, toggleTheme } = useThemeStore();

  const handleClick = () => {
    toggleTheme();
    onClick?.();
  };

  const getIcon = () => {
    switch (mode) {
      case 'light':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        );
      case 'dark':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        );
      case 'system':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        );
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className={`p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full transition-colors ${className}`}
      aria-label={`Theme: ${mode}. Click to toggle.`}
      title={`Theme: ${mode}`}
    >
      <span className="text-white">{getIcon()}</span>
    </motion.button>
  );
};

export default ThemeToggle;
