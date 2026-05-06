import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { GroupAdminPageRoutingModule } from './group-admin-routing.module';
import { GroupAdminPage } from './group-admin.page';

@NgModule({
  declarations: [GroupAdminPage],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    GroupAdminPageRoutingModule
  ]
})
export class GroupAdminPageModule {}
