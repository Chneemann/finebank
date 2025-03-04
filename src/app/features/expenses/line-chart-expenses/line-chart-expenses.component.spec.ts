import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineChartExpensesComponent } from './line-chart-expenses.component';

describe('LineChartExpensesComponent', () => {
  let component: LineChartExpensesComponent;
  let fixture: ComponentFixture<LineChartExpensesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LineChartExpensesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LineChartExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
