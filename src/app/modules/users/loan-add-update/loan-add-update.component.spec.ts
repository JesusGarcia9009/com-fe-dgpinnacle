import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanAddUpdateComponent } from './loan-add-update.component';

describe('LoanAddUpdateComponent', () => {
  let component: LoanAddUpdateComponent;
  let fixture: ComponentFixture<LoanAddUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanAddUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanAddUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
