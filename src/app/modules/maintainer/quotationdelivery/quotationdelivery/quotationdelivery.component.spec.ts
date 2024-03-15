import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationdeliveryComponent } from './quotationdelivery.component';

describe('QuotationdeliveryComponent', () => {
  let component: QuotationdeliveryComponent;
  let fixture: ComponentFixture<QuotationdeliveryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuotationdeliveryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotationdeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
