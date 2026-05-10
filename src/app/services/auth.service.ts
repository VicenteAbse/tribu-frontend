import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

const TOKEN_KEY = 'auth_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private token: string | null = null;

  async loadToken(): Promise<void> {
    const { value } = await Preferences.get({ key: TOKEN_KEY });
    this.token = value;
  }

  async saveToken(token: string): Promise<void> {
    this.token = token;
    await Preferences.set({ key: TOKEN_KEY, value: token });
  }

  async clearToken(): Promise<void> {
    this.token = null;
    await Preferences.remove({ key: TOKEN_KEY });
  }

  getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return this.token !== null;
  }
}
