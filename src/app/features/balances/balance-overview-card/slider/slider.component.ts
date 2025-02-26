import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-slider',
  imports: [CommonModule],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.scss',
})
export class SliderComponent {
  @Input() totalSlides = 0;
  @Input() currentIndex = 0;
  @Input() changeSlide!: (index: number) => void;

  nextSlide() {
    if (this.currentIndex < this.totalSlides - 1) {
      this.changeSlide(this.currentIndex + 1);
    }
  }

  prevSlide() {
    if (this.currentIndex > 0) {
      this.changeSlide(this.currentIndex - 1);
    }
  }
}
