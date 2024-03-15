import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateUniversalgroupsComponent } from './add-update-universalgroups.component';

describe('AddUpdateUniversalgroupsComponent', () => {
  let component: AddUpdateUniversalgroupsComponent;
  let fixture: ComponentFixture<AddUpdateUniversalgroupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUpdateUniversalgroupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateUniversalgroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
