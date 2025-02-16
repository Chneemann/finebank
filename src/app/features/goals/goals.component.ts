import { Component } from '@angular/core';
import { ButtonComponent } from '../../shared/components/layouts/button/button.component';
import { ManometerComponent } from './manometer/manometer.component';

@Component({
  selector: 'app-goals',
  standalone: true,
  imports: [ButtonComponent, ManometerComponent],
  templateUrl: './goals.component.html',
  styleUrl: './goals.component.scss',
})
export class GoalsComponent {}
