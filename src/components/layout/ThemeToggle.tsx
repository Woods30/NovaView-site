import { Moon, Sun } from 'lucide-react';
import { useTheme } from '~/components/theme-provider';
import { useT } from '~/i18n/useT';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const t = useT();
  const isDark = theme === 'dark';
  return (
    <button
      type="button"
      aria-label={isDark ? t('theme.switch_to_light') : t('theme.switch_to_dark')}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface text-fg hover:border-fg transition-colors"
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}