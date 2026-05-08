import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ReportProblemPageRoutingModule } from './report-problem-routing.module';
import { ReportProblemPage } from './report-problem.page';

@NgModule({
  declarations: [ReportProblemPage],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    ReportProblemPageRoutingModule
  ]
})
export class ReportProblemPageModule {}
