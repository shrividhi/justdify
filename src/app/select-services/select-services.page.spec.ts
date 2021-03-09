import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SelectServicesPage } from './select-services.page';

describe('SelectServicesPage', () => {
  let component: SelectServicesPage;
  let fixture: ComponentFixture<SelectServicesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectServicesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectServicesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
