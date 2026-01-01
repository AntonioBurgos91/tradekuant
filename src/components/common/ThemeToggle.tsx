'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/lib/theme';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  variant?: 'default' | 'compact';
  className?: string;
}

export function ThemeToggle({ variant = 'default', className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'relative flex items-center justify-center rounded-lg transition-all duration-200',
        variant === 'compact'
          ? 'h-9 w-9 hover:bg-secondary'
          : 'h-10 w-10 border border-border/50 bg-secondary/50 hover:bg-secondary hover:border-border',
        className
      )}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <Sun
        className={cn(
          'h-4 w-4 transition-all duration-300',
          theme === 'dark'
            ? 'rotate-90 scale-0 opacity-0'
            : 'rotate-0 scale-100 opacity-100 text-amber-500'
        )}
      />
      <Moon
        className={cn(
          'absolute h-4 w-4 transition-all duration-300',
          theme === 'dark'
            ? 'rotate-0 scale-100 opacity-100 text-primary'
            : '-rotate-90 scale-0 opacity-0'
        )}
      />
    </button>
  );
}
