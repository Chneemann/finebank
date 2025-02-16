import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-manometer',
  standalone: true,
  imports: [],
  templateUrl: './manometer.component.html',
  styleUrl: './manometer.component.scss',
})
export class ManometerComponent {
  @Input() maxValue = 0;
  @Input() currentValue = 0;

  // Calculate the percentage based on the current value
  getPercentage(): number {
    return Math.round((this.currentValue / this.maxValue) * 100);
  }

  // Calculate the total circumference of the semicircle
  get dashArray(): string {
    const totalCircumference = 2 * Math.PI * 80;
    const halfCircumference = totalCircumference * 0.5;
    return `${halfCircumference} ${halfCircumference}`;
  }

  // Calculate the Dashoffset to show the progress
  calculateDashOffset(): number {
    const percentage = this.currentValue / this.maxValue;
    const totalCircumference = 2 * Math.PI * 80;
    const halfCircumference = totalCircumference * 0.5;
    const fillLength = halfCircumference * percentage;
    return halfCircumference - fillLength;
  }

  getMaxValueAbbreviated(): string {
    if (this.maxValue >= 1000) {
      return this.maxValue / 1000 + 'k';
    } else {
      return this.maxValue.toString();
    }
  }
}
