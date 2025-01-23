import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemSelectMenuComponent } from './item-select-menu.component';

describe('ItemSelectMenuComponent', () => {
  let component: ItemSelectMenuComponent;
  let fixture: ComponentFixture<ItemSelectMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemSelectMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemSelectMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
