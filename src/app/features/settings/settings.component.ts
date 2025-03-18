import { Component } from '@angular/core';
import { HeadlineComponent } from '../../shared/components/layouts/headline/headline.component';

@Component({
  selector: 'app-settings',
  imports: [HeadlineComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {}
