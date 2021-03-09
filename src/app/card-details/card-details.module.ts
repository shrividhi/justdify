import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { CardDetailsPageRoutingModule } from './card-details-routing.module';

import { CardDetailsPage } from './card-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CardDetailsPageRoutingModule
  ],
  declarations: [CardDetailsPage]
})
export class CardDetailsPageModule {}
