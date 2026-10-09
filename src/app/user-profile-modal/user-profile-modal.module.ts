import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { UserProfileModalComponent } from './user-profile-modal.component';

@NgModule({
  declarations: [UserProfileModalComponent],
  imports: [CommonModule, IonicModule],
  exports: [UserProfileModalComponent]
})
export class UserProfileModalModule {}
