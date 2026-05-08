import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportProblemPage } from './report-problem.page';

const routes: Routes = [
  { path: '', component: ReportProblemPage }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportProblemPageRoutingModule {}
