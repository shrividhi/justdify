import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FavoriteSalonsPage } from './favorite-salons.page';

const routes: Routes = [
  {
    path: '',
    component: FavoriteSalonsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FavoriteSalonsPageRoutingModule {}
