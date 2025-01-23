import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    inject,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
} from '@angular/core';
import {
    Color,
    EllipsoButtonComponent,
    EllipsoColorPickerComponent,
    EllipsoIconComponent,
} from 'ellipso-ui-components';
import { NgIf } from '@angular/common';
import { DrawNotesComponent } from '../draw-notes/draw-notes.component';

@Component({
    selector: 'app-item-context-menu',
    imports: [
        EllipsoButtonComponent,
        EllipsoIconComponent,
        EllipsoColorPickerComponent,
        NgIf,
        DrawNotesComponent,
    ],
    templateUrl: './item-context-menu.component.html',
    styleUrl: './item-context-menu.component.css',
})
export class ItemContextMenuComponent implements OnChanges {
    @Input() item: any;
    @Output() closed: EventEmitter<any> = new EventEmitter();
    @Output() delete: EventEmitter<any> = new EventEmitter();
    @Output() duplicate: EventEmitter<any> = new EventEmitter();
    @Output() colorChanged: EventEmitter<any> = new EventEmitter();
    color = Color.fromHEX('#000000');
    submenu: string = 'main';

    ngOnChanges(changes: SimpleChanges) {
        if (changes['item']) {
            this.color = Color.fromHEX(this.item.color);
        }
    }

    changeSubmenu(submenu: string) {
        this.submenu = submenu;
    }

    applyColor() {
        this.item.color = this.color.toHEX();
        this.colorChanged.emit(this.color);
        this.closeMenu();
    }

    deleteItem() {
        this.delete.emit();
        this.closeMenu();
    }

    saveDrawing(s: string) {
        this.item.drawing = s;
        this.closeMenu();
    }

    closeMenu() {
        this.closed.emit();
    }

    onDuplicate() {
        this.duplicate.emit();
        this.closeMenu();
    }
}
