import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientAddUpdateComponent } from './client-add-update.component';

describe('ClientAddUpdateComponent', () => {
  let component: ClientAddUpdateComponent;
  let fixture: ComponentFixture<ClientAddUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientAddUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientAddUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
