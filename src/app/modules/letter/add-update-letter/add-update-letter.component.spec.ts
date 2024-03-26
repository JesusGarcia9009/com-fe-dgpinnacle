import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateLetterComponent } from './add-update-letter.component';

describe('AddUpdateLetterComponent', () => {
  let component: AddUpdateLetterComponent;
  let fixture: ComponentFixture<AddUpdateLetterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUpdateLetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
