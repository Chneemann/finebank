import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalsOverlayComponent } from './goals-overlay.component';

describe('GoalsOverlayComponent', () => {
  let component: GoalsOverlayComponent;
  let fixture: ComponentFixture<GoalsOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoalsOverlayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoalsOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
