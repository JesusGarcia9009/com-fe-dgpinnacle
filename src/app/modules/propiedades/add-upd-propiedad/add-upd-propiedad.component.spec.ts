import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdPropiedadComponent } from './add-upd-propiedad.component';

describe('AddUpdPropiedadComponent', () => {
  let component: AddUpdPropiedadComponent;
  let fixture: ComponentFixture<AddUpdPropiedadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUpdPropiedadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdPropiedadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
