import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillOrderNoteComponent } from './bill-order-note.component';

describe('BillOrderNoteComponent', () => {
  let component: BillOrderNoteComponent;
  let fixture: ComponentFixture<BillOrderNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillOrderNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillOrderNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
