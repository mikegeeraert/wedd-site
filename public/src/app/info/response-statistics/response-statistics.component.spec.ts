import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponseStatisticsComponent } from './response-statistics.component';

describe('ResponseStatisticsComponent', () => {
  let component: ResponseStatisticsComponent;
  let fixture: ComponentFixture<ResponseStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResponseStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponseStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
