import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccommodationsChartComponent } from './accommodations-chart.component';

describe('AccommodationsChartComponent', () => {
  let component: AccommodationsChartComponent;
  let fixture: ComponentFixture<AccommodationsChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccommodationsChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccommodationsChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
