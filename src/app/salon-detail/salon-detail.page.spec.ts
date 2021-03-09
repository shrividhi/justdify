import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SalonDetailPage } from './salon-detail.page';

describe('SalonDetailPage', () => {
  let component: SalonDetailPage;
  let fixture: ComponentFixture<SalonDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalonDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SalonDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
