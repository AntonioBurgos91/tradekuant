'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage, languages, Language } from '@/lib/i18n';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const languageList: { code: Language; name: string; flag: string }[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
];

interface LanguageSwitcherProps {
  variant?: 'default' | 'compact';
  className?: string;
}

export function LanguageSwitcher({
  variant = 'default',
  className,
}: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = languageList.find((l) => l.code === language) || languageList[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleSelect = (code: Language) => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={cn('relative', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 rounded-lg border border-border/50 bg-card/50 transition-all hover:border-border hover:bg-card',
          variant === 'default' ? 'px-3 py-2' : 'p-2',
          isOpen && 'border-primary/30 bg-card'
        )}
        aria-label="Select language"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <Globe className="h-4 w-4 text-muted-foreground" />
        {variant === 'default' && (
          <>
            <span className="text-sm font-medium">{currentLang.flag}</span>
            <span className="hidden text-sm sm:inline">{currentLang.name}</span>
            <ChevronDown
              className={cn(
                'h-3 w-3 text-muted-foreground transition-transform',
                isOpen && 'rotate-180'
              )}
            />
          </>
        )}
        {variant === 'compact' && (
          <span className="text-sm">{currentLang.flag}</span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="absolute right-0 top-full z-50 mt-2 min-w-[180px] overflow-hidden rounded-xl border border-border/50 bg-card shadow-xl shadow-black/20"
          role="listbox"
          aria-label="Available languages"
        >
          <div className="p-1">
            {languageList.map((lang) => {
              const isSelected = language === lang.code;
              const isRTL = languages[lang.code].dir === 'rtl';

              return (
                <button
                  key={lang.code}
                  onClick={() => handleSelect(lang.code)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors',
                    isSelected
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground hover:bg-secondary',
                    isRTL && 'flex-row-reverse text-right'
                  )}
                  role="option"
                  aria-selected={isSelected}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span className="flex-1 font-medium">{lang.name}</span>
                  {isSelected && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer hint */}
          <div className="border-t border-border/50 px-3 py-2">
            <p className="text-xs text-muted-foreground">
              {language === 'ar' ? 'تغيير اللغة' :
               language === 'zh' ? '更改语言' :
               language === 'de' ? 'Sprache ändern' :
               language === 'fr' ? 'Changer de langue' :
               language === 'en' ? 'Change language' :
               'Cambiar idioma'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
