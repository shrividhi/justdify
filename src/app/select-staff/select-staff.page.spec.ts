import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SelectStaffPage } from './select-staff.page';

describe('SelectStaffPage', () => {
  let component: SelectStaffPage;
  let fixture: ComponentFixture<SelectStaffPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectStaffPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectStaffPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
