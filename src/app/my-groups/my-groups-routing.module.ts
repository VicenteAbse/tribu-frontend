import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyGroupsPage } from './my-groups.page';

const routes: Routes = [
  { path: '', component: MyGroupsPage }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyGroupsPageRoutingModule {}
