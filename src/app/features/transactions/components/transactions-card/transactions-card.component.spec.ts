import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionsCardComponent } from './transactions-card.component';

describe('TransactionsCardComponent', () => {
  let component: TransactionsCardComponent;
  let fixture: ComponentFixture<TransactionsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionsCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
