import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineChartStatisticComponent } from './line-chart-statistic.component';

describe('LineChartStatisticComponent', () => {
  let component: LineChartStatisticComponent;
  let fixture: ComponentFixture<LineChartStatisticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LineChartStatisticComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LineChartStatisticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
