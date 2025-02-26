import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionsOverviewCardComponent } from './transactions-overview-card.component';

describe('TransactionsOverviewCardComponent', () => {
  let component: TransactionsOverviewCardComponent;
  let fixture: ComponentFixture<TransactionsOverviewCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionsOverviewCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionsOverviewCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
