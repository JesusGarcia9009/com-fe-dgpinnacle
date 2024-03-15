import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaTopologiaComponent } from './lista-topologia.component';

describe('ListaTopologiaComponent', () => {
  let component: ListaTopologiaComponent;
  let fixture: ComponentFixture<ListaTopologiaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaTopologiaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaTopologiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
