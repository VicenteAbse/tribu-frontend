import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { CreateGroupPageRoutingModule } from './create-group-routing.module';
import { CreateGroupPage } from './create-group.page';

@NgModule({
  declarations: [CreateGroupPage],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    CreateGroupPageRoutingModule
  ]
})
export class CreateGroupPageModule {}
