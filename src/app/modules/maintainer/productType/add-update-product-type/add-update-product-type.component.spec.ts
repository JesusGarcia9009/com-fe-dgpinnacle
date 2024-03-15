import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateProductTypeComponent } from './add-update-product-type.component';

describe('AddUpdateProductTypeComponent', () => {
  let component: AddUpdateProductTypeComponent;
  let fixture: ComponentFixture<AddUpdateProductTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUpdateProductTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateProductTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
