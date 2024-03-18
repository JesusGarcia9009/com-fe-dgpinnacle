import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersAddUpdateComponent } from './users-add-update.component';

describe('UsersAddUpdateComponent', () => {
  let component: UsersAddUpdateComponent;
  let fixture: ComponentFixture<UsersAddUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersAddUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersAddUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
