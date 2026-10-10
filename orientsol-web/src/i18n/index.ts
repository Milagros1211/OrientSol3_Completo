import type { SupportedLocale, Translations } from './types';
import { es } from './locales/es';
import { en } from './locales/en';

const STORAGE_KEY = 'orientsol_language';

const dictionaries: Record<SupportedLocale, Translations> = {
  es,
  en,
};

type Listener = (locale: SupportedLocale) => void;

class I18nManager {
  private currentLocale: SupportedLocale = 'es';
  private listeners: Set<Listener> = new Set();

  constructor() {
    this.initLocale();
  }

  private initLocale() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as SupportedLocale | null;
      if (saved && (saved === 'es' || saved === 'en')) {
        this.currentLocale = saved;
        return;
      }
    } catch {}

    // Fallback to browser language
    if (typeof navigator !== 'undefined' && navigator.language) {
      if (navigator.language.toLowerCase().startsWith('en')) {
        this.currentLocale = 'en';
        return;
      }
    }
    this.currentLocale = 'es';
  }

  public getLocale(): SupportedLocale {
    return this.currentLocale;
  }

  public setLocale(locale: SupportedLocale): void {
    if (this.currentLocale === locale) return;
    this.currentLocale = locale;
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch {}
    document.documentElement.lang = locale;
    this.notify();
  }

  public get t(): Translations {
    return dictionaries[this.currentLocale];
  }

  /**
   * Helper to format a string with template placeholders like {name}
   */
  public format(template: string, params: Record<string, string | number>): string {
    return template.replace(/\{(\w+)\}/g, (_, key) => {
      return params[key] !== undefined ? String(params[key]) : `{${key}}`;
    });
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    for (const listener of this.listeners) {
      try {
        listener(this.currentLocale);
      } catch (err) {
        console.error('[i18n] Listener error:', err);
      }
    }
  }
}

export const i18n = new I18nManager();
export type { SupportedLocale, Translations };
