import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrinkRequestChartComponent } from './drink-request-chart.component';

describe('DrinkRequestChartComponent', () => {
  let component: DrinkRequestChartComponent;
  let fixture: ComponentFixture<DrinkRequestChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrinkRequestChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrinkRequestChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
