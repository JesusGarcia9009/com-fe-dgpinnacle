import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateModelComponent } from './add-update-model.component';

describe('AddUpdateModelComponent', () => {
  let component: AddUpdateModelComponent;
  let fixture: ComponentFixture<AddUpdateModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUpdateModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
