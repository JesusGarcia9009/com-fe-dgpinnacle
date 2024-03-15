import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReverseBillsComponent } from './reverse-bills.component';

describe('ReverseBillsComponent', () => {
  let component: ReverseBillsComponent;
  let fixture: ComponentFixture<ReverseBillsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReverseBillsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReverseBillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
