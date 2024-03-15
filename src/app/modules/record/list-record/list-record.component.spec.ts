import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRecordComponent } from './list-record.component';

describe('ListRecordComponent', () => {
  let component: ListRecordComponent;
  let fixture: ComponentFixture<ListRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
