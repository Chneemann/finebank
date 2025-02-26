import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalsOverviewCardComponent } from './goals-overview-card.component';

describe('GoalsOverviewCardComponent', () => {
  let component: GoalsOverviewCardComponent;
  let fixture: ComponentFixture<GoalsOverviewCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoalsOverviewCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoalsOverviewCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
