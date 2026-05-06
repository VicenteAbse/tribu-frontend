import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GroupChatPage } from './group-chat.page';

const routes: Routes = [
  { path: '', component: GroupChatPage }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupChatPageRoutingModule {}
