import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosMainComponent } from './usuarios-main.component';

describe('UsuariosMainComponent', () => {
  let component: UsuariosMainComponent;
  let fixture: ComponentFixture<UsuariosMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsuariosMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuariosMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
