import { Component, Input } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/layouts/button/button.component';
import { Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent {
  @Input() currentAccountData$!: Observable<any>;

  constructor() {}
}
