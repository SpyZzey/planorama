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
    EllipsoAvatarComponent,
    EllipsoButtonComponent,
    EllipsoColorPickerComponent,
    EllipsoIconComponent,
} from 'ellipso-ui-components';
import { NgForOf, NgIf } from '@angular/common';
import { DrawNotesComponent } from '../draw-notes/draw-notes.component';
import { CircleMenuComponent } from '../circle-menu/circle-menu.component';

@Component({
    selector: 'app-item-context-menu',
    imports: [
        EllipsoButtonComponent,
        EllipsoIconComponent,
        EllipsoColorPickerComponent,
        NgIf,
        DrawNotesComponent,
        NgForOf,
        EllipsoAvatarComponent,
        CircleMenuComponent,
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
    innerMenuSections = [
        {
            title: 'John Doe',
            visible: true,
            image: '/avatars/avatar1.png',
        },
        {
            title: 'Jane Doe',
            visible: true,
            image: '/avatars/avatar2.png',
        },
        {
            title: 'John Doe',
            visible: true,
            image: '/avatars/avatar3.png',
        },
        {
            title: 'Jane Doe',
            visible: true,
            image: '/avatars/avatar4.png',
        },
        {
            title: 'John Doe',
            visible: true,
            image: '/avatars/avatar5.png',
        },
        {
            title: 'Jane Doe',
            visible: true,
            image: '/avatars/avatar6.png',
        },
    ];

    ngOnChanges(changes: SimpleChanges) {
        if (changes['item']) {
            this.color = Color.fromHEX(this.item.color);
        }
    }

    changeSubmenu(submenu: string) {
        this.submenu = submenu;
        console.log(this.item);
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

    removeTask(task: any) {
        this.item.tTasks = this.item.tTasks.filter((t: any) => t !== task);
    }

    responsibilities: any[] = [];
    drawingObj: any = {
        drawing: '',
    };

    selectResponsibility($event: number) {
        const user = this.innerMenuSections[$event];
        this.responsibilities.push(JSON.parse(JSON.stringify(user)));
        user.image = '/avatars/avatar' + ($event + 1) + '_selected.png';
    }

    addTask(drawing: string) {
        this.item.tTasks.push({
            image: drawing,
            responsibility: JSON.parse(JSON.stringify(this.responsibilities)),
        });
        this.closeMenu();
    }

    onAddResponsibility(drawing: string) {
        this.drawingObj.drawing = drawing;
        this.submenu = 'add-task-responsibility';
    }
}
