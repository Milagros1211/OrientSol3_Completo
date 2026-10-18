export type AppTheme = 'light' | 'dark';

const THEME_STORAGE_KEY = 'orientsol_theme';

class ThemeManager {
  private currentTheme: AppTheme = 'light';
  private listeners: Array<(theme: AppTheme) => void> = [];

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'dark' || saved === 'light') {
        this.currentTheme = saved;
      } else {
        // Default to light as requested by user
        this.currentTheme = 'light';
      }
      this.applyTheme(this.currentTheme);
    }
  }

  public getTheme(): AppTheme {
    return this.currentTheme;
  }

  public isDark(): boolean {
    return this.currentTheme === 'dark';
  }

  public setTheme(theme: AppTheme): void {
    this.currentTheme = theme;
    if (typeof window !== 'undefined') {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
      this.applyTheme(theme);
      this.listeners.forEach((fn) => fn(theme));
      window.dispatchEvent(new CustomEvent('orientsol-theme-changed', { detail: { theme } }));
    }
  }

  public toggleTheme(): AppTheme {
    const nextTheme: AppTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(nextTheme);
    return nextTheme;
  }

  public subscribe(listener: (theme: AppTheme) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private applyTheme(theme: AppTheme): void {
    if (typeof document === 'undefined') return;
    const doc = document.documentElement;
    const body = document.body;
    doc.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      doc.classList.add('theme-dark');
      doc.classList.remove('theme-light');
      body?.classList.add('theme-dark');
      body?.classList.remove('theme-light');
    } else {
      doc.classList.add('theme-light');
      doc.classList.remove('theme-dark');
      body?.classList.add('theme-light');
      body?.classList.remove('theme-dark');
    }
    // Propagate theme attribute to any active modal backdrops
    document.querySelectorAll('.modal-backdrop').forEach((modal) => {
      modal.setAttribute('data-theme', theme);
    });
  }
}

export const themeManager = new ThemeManager();
