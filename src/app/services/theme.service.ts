import { Injectable } from '@angular/core';

export type ThemeOption = 'dark' | 'light' | 'system';

const STORAGE_KEY = 'trivy_theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private current: ThemeOption = 'dark';

  initialize() {
    const saved = localStorage.getItem(STORAGE_KEY) as ThemeOption | null;
    this.apply(saved ?? 'dark');
  }

  get theme(): ThemeOption {
    return this.current;
  }

  get label(): string {
    if (this.current === 'light') return 'Claro';
    if (this.current === 'system') return 'Sistema';
    return 'Oscuro';
  }

  setTheme(option: ThemeOption) {
    localStorage.setItem(STORAGE_KEY, option);
    this.apply(option);
  }

  private apply(option: ThemeOption) {
    this.current = option;
    const body = document.body;

    if (option === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.applyDark(prefersDark);
    } else {
      this.applyDark(option === 'dark');
    }
  }

  private applyDark(dark: boolean) {
    const body = document.body;
    if (dark) {
      body.classList.add('ion-palette-dark');
      body.classList.remove('light-theme');
    } else {
      body.classList.remove('ion-palette-dark');
      body.classList.add('light-theme');
    }
  }
}
