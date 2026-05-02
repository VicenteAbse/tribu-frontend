import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { DiscoveryPageRoutingModule } from './discovery-routing.module';
import { DiscoveryPage } from './discovery.page';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [DiscoveryPage],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    DiscoveryPageRoutingModule
  ]
})
export class DiscoveryPageModule {}
