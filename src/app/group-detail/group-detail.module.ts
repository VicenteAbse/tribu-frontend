import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { GroupDetailPageRoutingModule } from './group-detail-routing.module';
import { GroupDetailPage } from './group-detail.page';
import { UserProfileModalModule } from '../user-profile-modal/user-profile-modal.module';

@NgModule({
  declarations: [GroupDetailPage],
  imports: [
    CommonModule,
    IonicModule,
    GroupDetailPageRoutingModule,
    UserProfileModalModule
  ]
})
export class GroupDetailPageModule {}
