import {Component, Input} from '@angular/core';

@Component({
    selector: 'app-item-object',
    imports: [],
    templateUrl: './item-object.component.html',
    styleUrl: './item-object.component.css'
})
export class ItemObjectComponent {
    @Input() object: any;




}
