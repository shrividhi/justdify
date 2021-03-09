import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ChatBoardPage } from './chat-board.page';

describe('ChatBoardPage', () => {
  let component: ChatBoardPage;
  let fixture: ComponentFixture<ChatBoardPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatBoardPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ChatBoardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
