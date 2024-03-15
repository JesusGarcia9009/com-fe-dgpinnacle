import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteExternoComponent } from './cliente-externo.component';

describe('ClienteExternoComponent', () => {
  let component: ClienteExternoComponent;
  let fixture: ComponentFixture<ClienteExternoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClienteExternoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClienteExternoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
