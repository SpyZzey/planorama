import { Component } from '@angular/core';
import { CircleMenuComponent } from '../circle-menu/circle-menu.component';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-item-select-menu',
    imports: [CircleMenuComponent, NgIf],
    templateUrl: './item-select-menu.component.html',
    styleUrl: './item-select-menu.component.css',
})
export class ItemSelectMenuComponent {}
