import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLetterEncompassComponent } from './add-letter-encompass.component';

describe('AddLetterEncompassComponent', () => {
  let component: AddLetterEncompassComponent;
  let fixture: ComponentFixture<AddLetterEncompassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddLetterEncompassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLetterEncompassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
