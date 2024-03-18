import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LetterListComponent } from './letter-list.component';

describe('LetterListComponent', () => {
  let component: LetterListComponent;
  let fixture: ComponentFixture<LetterListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LetterListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LetterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
