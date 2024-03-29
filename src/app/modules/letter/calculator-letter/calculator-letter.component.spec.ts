import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculatorLetterComponent } from './calculator-letter.component';

describe('CalculatorLetterComponent', () => {
  let component: CalculatorLetterComponent;
  let fixture: ComponentFixture<CalculatorLetterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalculatorLetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculatorLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
