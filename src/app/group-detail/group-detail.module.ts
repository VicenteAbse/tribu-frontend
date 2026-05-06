import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { GroupDetailPageRoutingModule } from './group-detail-routing.module';
import { GroupDetailPage } from './group-detail.page';

@NgModule({
  declarations: [GroupDetailPage],
  imports: [
    CommonModule,
    IonicModule,
    GroupDetailPageRoutingModule
  ]
})
export class GroupDetailPageModule {}
