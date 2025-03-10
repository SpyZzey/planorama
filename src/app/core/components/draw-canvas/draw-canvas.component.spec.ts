import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawCanvasComponent } from './draw-canvas.component';

describe('DrawCanvasComponent', () => {
  let component: DrawCanvasComponent;
  let fixture: ComponentFixture<DrawCanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrawCanvasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrawCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
