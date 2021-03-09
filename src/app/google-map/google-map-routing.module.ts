import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GoogleMapComponent } from './google-map.component';

const routes: Routes = [
  {
    path: '',
    component: GoogleMapComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GoogleMapRoutingModule {}
