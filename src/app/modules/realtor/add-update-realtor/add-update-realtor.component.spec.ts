import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateRealtorComponent } from './add-update-realtor.component';

describe('AddUpdateRealtorComponent', () => {
  let component: AddUpdateRealtorComponent;
  let fixture: ComponentFixture<AddUpdateRealtorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUpdateRealtorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateRealtorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
