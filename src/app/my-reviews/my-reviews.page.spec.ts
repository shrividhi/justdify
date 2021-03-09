import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MyReviewsPage } from './my-reviews.page';

describe('MyReviewsPage', () => {
  let component: MyReviewsPage;
  let fixture: ComponentFixture<MyReviewsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyReviewsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MyReviewsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
