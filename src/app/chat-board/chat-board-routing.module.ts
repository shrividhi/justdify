import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChatBoardPage } from './chat-board.page';

const routes: Routes = [
  {
    path: '',
    component: ChatBoardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatBoardPageRoutingModule {}
