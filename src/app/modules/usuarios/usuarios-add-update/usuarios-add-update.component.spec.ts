import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosAddUpdateComponent } from './usuarios-add-update.component';

describe('UsuariosAddUpdateComponent', () => {
  let component: UsuariosAddUpdateComponent;
  let fixture: ComponentFixture<UsuariosAddUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsuariosAddUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuariosAddUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
