import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatBoardPageRoutingModule } from './chat-board-routing.module';

import { ChatBoardPage } from './chat-board.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatBoardPageRoutingModule
  ],
  declarations: [ChatBoardPage]
})
export class ChatBoardPageModule {}
