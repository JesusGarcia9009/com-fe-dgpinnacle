import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LetterByLoanComponent } from './letter-by-loan.component';

describe('LetterByLoanComponent', () => {
  let component: LetterByLoanComponent;
  let fixture: ComponentFixture<LetterByLoanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LetterByLoanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LetterByLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
