import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdTopologiaComponent } from './add-upd-topologia.component';

describe('AddUpdTopologiaComponent', () => {
  let component: AddUpdTopologiaComponent;
  let fixture: ComponentFixture<AddUpdTopologiaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUpdTopologiaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdTopologiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
