import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { AuthService } from './services/auth.service';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(
    theme: ThemeService,
    private platform: Platform,
    private authService: AuthService,
    private router: Router,
  ) {
    theme.initialize();
    this.initializeApp();
  }

  private async initializeApp(): Promise<void> {
    await this.platform.ready();
    await this.authService.loadToken();
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/tabs/discovery'], { replaceUrl: true });
    }
  }
}
