import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FavoriteSalonsPageRoutingModule } from './favorite-salons-routing.module';

import { FavoriteSalonsPage } from './favorite-salons.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FavoriteSalonsPageRoutingModule
  ],
  declarations: [FavoriteSalonsPage]
})
export class FavoriteSalonsPageModule {}
