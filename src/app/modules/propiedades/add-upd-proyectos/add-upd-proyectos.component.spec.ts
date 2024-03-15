import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdProyectosComponent } from './add-upd-proyectos.component';

describe('AddUpdProyectosComponent', () => {
  let component: AddUpdProyectosComponent;
  let fixture: ComponentFixture<AddUpdProyectosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUpdProyectosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdProyectosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
