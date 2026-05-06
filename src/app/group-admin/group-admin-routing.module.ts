import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GroupAdminPage } from './group-admin.page';

const routes: Routes = [
  { path: '', component: GroupAdminPage }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupAdminPageRoutingModule {}
