import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';
import { ProfilePage } from './profile.page';

@NgModule({
  declarations: [ProfilePage],
  imports: [
    CommonModule,
    IonicModule,
    ProfilePageRoutingModule
  ]
})
export class ProfilePageModule {}
