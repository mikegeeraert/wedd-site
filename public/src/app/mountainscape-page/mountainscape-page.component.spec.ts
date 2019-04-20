import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MountainscapePageComponent } from './mountainscape-page.component';

describe('MountainscapePageComponent', () => {
  let component: MountainscapePageComponent;
  let fixture: ComponentFixture<MountainscapePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MountainscapePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MountainscapePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
