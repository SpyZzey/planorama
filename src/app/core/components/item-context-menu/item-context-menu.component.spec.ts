import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemContextMenuComponent } from './item-context-menu.component';

describe('ItemContextMenuComponent', () => {
  let component: ItemContextMenuComponent;
  let fixture: ComponentFixture<ItemContextMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemContextMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemContextMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
