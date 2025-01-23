import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawNotesComponent } from './draw-notes.component';

describe('DrawNotesComponent', () => {
  let component: DrawNotesComponent;
  let fixture: ComponentFixture<DrawNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrawNotesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrawNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
