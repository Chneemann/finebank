import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceOverviewCardComponent } from './balance-overview-card.component';

describe('BalanceOverviewCardComponent', () => {
  let component: BalanceOverviewCardComponent;
  let fixture: ComponentFixture<BalanceOverviewCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BalanceOverviewCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BalanceOverviewCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
