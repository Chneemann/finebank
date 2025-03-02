import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  @Input() buttonText: string = '';
  @Input() buttonSize: string = 'large';
  @Input() buttonIcon: string = '';
  @Input() buttonFilled: boolean = true;
  @Input() disabled: boolean = false;
  @Output() buttonClick = new EventEmitter<void>();

  getButtonClasses(): string[] {
    let classes = [this.buttonSize];
    classes.push(this.buttonFilled ? 'filled' : 'outlined');
    return classes;
  }

  handleClick(event: Event) {
    if (!this.disabled) {
      this.buttonClick.emit();
    }
  }
}
