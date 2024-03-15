import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailRecordComponent } from './detail-record.component';

describe('DetailRecordComponent', () => {
  let component: DetailRecordComponent;
  let fixture: ComponentFixture<DetailRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
