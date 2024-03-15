import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBillsComponent } from './list-bills.component';

describe('ListBillsComponent', () => {
  let component: ListBillsComponent;
  let fixture: ComponentFixture<ListBillsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListBillsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListBillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
