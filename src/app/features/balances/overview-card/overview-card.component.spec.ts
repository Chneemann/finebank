import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewCardBalancesComponent } from './overview-card.component';

describe('OverviewCardBalancesComponent', () => {
  let component: OverviewCardBalancesComponent;
  let fixture: ComponentFixture<OverviewCardBalancesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverviewCardBalancesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OverviewCardBalancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
