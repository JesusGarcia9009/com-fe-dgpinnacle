import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateInventoryreasonComponent } from './add-update-inventoryreason.component';

describe('AddUpdateInventoryreasonComponent', () => {
  let component: AddUpdateInventoryreasonComponent;
  let fixture: ComponentFixture<AddUpdateInventoryreasonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUpdateInventoryreasonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateInventoryreasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
