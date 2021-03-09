import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GoogleMapRoutingModule } from './google-map-routing.module';

import { GoogleMapComponent } from './google-map.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GoogleMapRoutingModule
  ],
  declarations: [GoogleMapComponent]
})
export class GoogleMapModule {}