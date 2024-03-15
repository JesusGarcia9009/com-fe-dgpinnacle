import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryreasonComponent } from './inventoryreason.component';

describe('InventoryreasonComponent', () => {
  let component: InventoryreasonComponent;
  let fixture: ComponentFixture<InventoryreasonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryreasonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryreasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
