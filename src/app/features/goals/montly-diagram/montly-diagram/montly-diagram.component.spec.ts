import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MontlyDiagramComponent } from './montly-diagram.component';

describe('MontlyDiagramComponent', () => {
  let component: MontlyDiagramComponent;
  let fixture: ComponentFixture<MontlyDiagramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MontlyDiagramComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MontlyDiagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
