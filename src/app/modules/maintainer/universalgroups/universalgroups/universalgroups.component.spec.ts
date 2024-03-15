import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UniversalgroupsComponent } from './universalgroups.component';

describe('UniversalgroupsComponent', () => {
  let component: UniversalgroupsComponent;
  let fixture: ComponentFixture<UniversalgroupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UniversalgroupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UniversalgroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
