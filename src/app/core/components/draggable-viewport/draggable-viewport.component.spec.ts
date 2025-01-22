import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DraggableViewportComponent } from './draggable-viewport.component';

describe('DraggableViewportComponent', () => {
  let component: DraggableViewportComponent;
  let fixture: ComponentFixture<DraggableViewportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DraggableViewportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DraggableViewportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
