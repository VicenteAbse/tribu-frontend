import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'group-detail/:id',
    loadChildren: () => import('./group-detail/group-detail.module').then(m => m.GroupDetailPageModule)
  },
  {
    path: 'group-chat/:id',
    loadChildren: () => import('./group-chat/group-chat.module').then(m => m.GroupChatPageModule)
  },
  {
    path: 'create-group',
    loadChildren: () => import('./create-group/create-group.module').then(m => m.CreateGroupPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
