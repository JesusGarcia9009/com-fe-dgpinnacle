import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliverytypeComponent } from './deliverytype.component';

describe('DeliverytypeComponent', () => {
  let component: DeliverytypeComponent;
  let fixture: ComponentFixture<DeliverytypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliverytypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliverytypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
