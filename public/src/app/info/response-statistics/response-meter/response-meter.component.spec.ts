import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponseMeterComponent } from './response-meter.component';

describe('ResponseMeterComponent', () => {
  let component: ResponseMeterComponent;
  let fixture: ComponentFixture<ResponseMeterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResponseMeterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponseMeterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
