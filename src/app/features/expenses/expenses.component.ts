import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreakdownComponent } from './breakdown/breakdown.component';
import { MonthYearPickerComponent } from '../../shared/components/month-year-picker/month-year-picker.component';

@Component({
  selector: 'app-expenses',
  imports: [CommonModule, BreakdownComponent, MonthYearPickerComponent],
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.scss',
})
export class ExpensesComponent {
  constructor() {}
}
