import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-premium-modal',
  templateUrl: './premium-modal.component.html',
  styleUrls: ['./premium-modal.component.scss'],
  standalone: false
})
export class PremiumModalComponent {
  @Input() reason: 'group_limit' | 'generic' = 'generic';

  readonly features: { label: string; free: string | boolean; pro: string | boolean }[] = [
    { label: 'Grupos activos',       free: '3',           pro: 'Ilimitados' },
    { label: 'Crear grupos',         free: '✓',           pro: '✓' },
    { label: 'Chat en tiempo real',  free: '✓',           pro: '✓' },
    { label: 'Discovery de grupos',  free: '✓',           pro: '✓' },
    { label: 'Retirar likes',        free: '✓',           pro: '✓' },
    { label: 'Soporte prioritario',  free: false,         pro: true },
  ];

  constructor(private modalCtrl: ModalController) {}

  dismiss() { this.modalCtrl.dismiss(); }

  subscribe() {
    // TODO: integrar RevenueCat para abrir el sheet de pago de la tienda
    this.modalCtrl.dismiss({ action: 'subscribe' });
  }
}
