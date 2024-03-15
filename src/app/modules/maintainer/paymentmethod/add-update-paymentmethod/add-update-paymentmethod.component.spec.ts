import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdatePaymentmethodComponent } from './add-update-paymentmethod.component';

describe('AddUpdatePaymentmethodComponent', () => {
  let component: AddUpdatePaymentmethodComponent;
  let fixture: ComponentFixture<AddUpdatePaymentmethodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUpdatePaymentmethodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdatePaymentmethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
