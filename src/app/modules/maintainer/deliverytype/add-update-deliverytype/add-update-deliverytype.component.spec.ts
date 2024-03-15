import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateDeliverytypeComponent } from './add-update-deliverytype.component';

describe('AddUpdateDeliverytypeComponent', () => {
  let component: AddUpdateDeliverytypeComponent;
  let fixture: ComponentFixture<AddUpdateDeliverytypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUpdateDeliverytypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateDeliverytypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
