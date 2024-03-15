import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOrderNoteComponent } from './list-order-note.component';

describe('ListOrderNoteComponent', () => {
  let component: ListOrderNoteComponent;
  let fixture: ComponentFixture<ListOrderNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListOrderNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOrderNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
