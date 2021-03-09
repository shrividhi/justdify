import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SalonDetailPageRoutingModule } from './salon-detail-routing.module';

import { SalonDetailPage } from './salon-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SalonDetailPageRoutingModule
  ],
  declarations: [SalonDetailPage]
})
export class SalonDetailPageModule {}
