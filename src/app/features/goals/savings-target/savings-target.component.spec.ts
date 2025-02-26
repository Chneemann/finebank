import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavingsTargetComponent } from './savings-target.component';

describe('SavingsTargetComponent', () => {
  let component: SavingsTargetComponent;
  let fixture: ComponentFixture<SavingsTargetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SavingsTargetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SavingsTargetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
