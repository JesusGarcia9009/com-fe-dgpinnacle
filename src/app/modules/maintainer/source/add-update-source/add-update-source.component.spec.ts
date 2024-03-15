import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateSourceComponent } from './add-update-source.component';

describe('AddUpdateSourceComponent', () => {
  let component: AddUpdateSourceComponent;
  let fixture: ComponentFixture<AddUpdateSourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUpdateSourceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
