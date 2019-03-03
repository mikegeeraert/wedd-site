import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StepPreferencesComponent } from './step-preferences.component';

describe('StepPreferencesComponent', () => {
  let component: StepPreferencesComponent;
  let fixture: ComponentFixture<StepPreferencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StepPreferencesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StepPreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
