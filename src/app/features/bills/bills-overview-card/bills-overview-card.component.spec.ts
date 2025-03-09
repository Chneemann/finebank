import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillsOverviewCardComponent } from './bills-overview-card.component';

describe('BillsOverviewCardComponent', () => {
  let component: BillsOverviewCardComponent;
  let fixture: ComponentFixture<BillsOverviewCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillsOverviewCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillsOverviewCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
