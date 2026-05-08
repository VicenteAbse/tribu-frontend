import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ChangePasswordPageRoutingModule } from './change-password-routing.module';
import { ChangePasswordPage } from './change-password.page';

@NgModule({
  declarations: [ChangePasswordPage],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    ChangePasswordPageRoutingModule
  ]
})
export class ChangePasswordPageModule {}
