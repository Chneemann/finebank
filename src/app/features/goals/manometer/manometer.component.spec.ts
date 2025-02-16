import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManometerComponent } from './manometer.component';

describe('ManometerComponent', () => {
  let component: ManometerComponent;
  let fixture: ComponentFixture<ManometerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManometerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManometerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
