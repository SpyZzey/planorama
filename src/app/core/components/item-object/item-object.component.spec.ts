import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemObjectComponent } from './item-object.component';

describe('TableObjectComponent', () => {
  let component: ItemObjectComponent;
  let fixture: ComponentFixture<ItemObjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemObjectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemObjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
