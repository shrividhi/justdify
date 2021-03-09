import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SalonDetailPage } from './salon-detail.page';

const routes: Routes = [
  {
    path: '',
    component: SalonDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalonDetailPageRoutingModule {}
