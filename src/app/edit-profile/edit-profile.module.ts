import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { EditProfilePageRoutingModule } from './edit-profile-routing.module';
import { EditProfilePage } from './edit-profile.page';

@NgModule({
  declarations: [EditProfilePage],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    EditProfilePageRoutingModule
  ]
})
export class EditProfilePageModule {}
