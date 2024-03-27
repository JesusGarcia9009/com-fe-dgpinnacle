import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRealtorComponent } from './list-realtor.component';

describe('ListRealtorComponent', () => {
  let component: ListRealtorComponent;
  let fixture: ComponentFixture<ListRealtorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListRealtorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListRealtorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
