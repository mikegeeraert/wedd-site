import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StepPlusOnesComponent } from './step-plus-ones.component';

describe('StepPlusOnesComponent', () => {
  let component: StepPlusOnesComponent;
  let fixture: ComponentFixture<StepPlusOnesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StepPlusOnesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StepPlusOnesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
