import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateQuotationdeliveryComponent } from './add-update-quotationdelivery.component';

describe('AddUpdateQuotationdeliveryComponent', () => {
  let component: AddUpdateQuotationdeliveryComponent;
  let fixture: ComponentFixture<AddUpdateQuotationdeliveryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUpdateQuotationdeliveryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateQuotationdeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
