import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReverseOrderNoteComponent } from './reverse-order-note.component';

describe('ReverseOrderNoteComponent', () => {
  let component: ReverseOrderNoteComponent;
  let fixture: ComponentFixture<ReverseOrderNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReverseOrderNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReverseOrderNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
