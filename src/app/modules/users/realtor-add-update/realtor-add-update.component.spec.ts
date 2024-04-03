import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RealtorAddUpdateComponent } from './realtor-add-update.component';

describe('RealtorAddUpdateComponent', () => {
  let component: RealtorAddUpdateComponent;
  let fixture: ComponentFixture<RealtorAddUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RealtorAddUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RealtorAddUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
