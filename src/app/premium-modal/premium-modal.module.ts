import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PremiumModalComponent } from './premium-modal.component';

@NgModule({
  declarations: [PremiumModalComponent],
  imports: [CommonModule, IonicModule],
  exports: [PremiumModalComponent]
})
export class PremiumModalModule {}
