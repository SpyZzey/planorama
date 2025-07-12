import { AfterViewInit, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { NgForOf, NgIf, NgStyle } from '@angular/common';
import {
    EllipsoAvatarComponent,
    EllipsoButtonComponent,
    EllipsoCheckboxComponent,
    EllipsoIconComponent,
} from 'ellipso-ui-components';
import { CircleMenuComponent } from '../circle-menu/circle-menu.component';

@Component({
    selector: 'app-context-menu',
    imports: [
        NgStyle,
        EllipsoIconComponent,
        EllipsoButtonComponent,
        NgIf,
        CircleMenuComponent,
        EllipsoCheckboxComponent,
        EllipsoAvatarComponent,
        NgForOf,
    ],
    templateUrl: './context-menu.component.html',
    styleUrl: './context-menu.component.css',
})
export class ContextMenuComponent implements OnChanges, AfterViewInit {
    @Input() menu: any;
    @Output() closed = new EventEmitter<any>();
    @Output() addItem = new EventEmitter<any>();
    @Output() showDrawCanvas = new EventEmitter<any>();
    @Input() allItems: any[] = [];

    isSubSectionSelected = false;
    innerMenuSections = [
        {
            title: 'Furniture',
            visible: true,
            image: '/objects/chair.svg',
        },
        {
            title: 'Pictures',
            visible: true,
            image: '/objects/picture.svg',
        },
        {
            title: 'Disco',
            visible: true,
            image: '/objects/disco-ball.svg',
        },
        {
            title: 'Tables',
            visible: true,
            image: '/objects/table.svg',
        },
        {
            title: 'Room Divider',
            visible: true,
            image: '/objects/roomdivider.svg',
        },
        {
            title: 'Rack',
            visible: true,
            image: '/objects/rack.svg',
        },
    ];
    outerMenuSections = [
        {
            title: 'Chair',
            visibleAt: 0,
            visible: false,
            image: '/objects/chair.svg',
        },
        {
            title: 'Table',
            visibleAt: 0,
            visible: false,
            image: '/objects/stool.svg',
        },
        {
            title: 'Picture',
            visibleAt: 1,
            visible: false,
            image: '/objects/picture.svg',
        },
        {
            title: 'Painting',
            visibleAt: 1,
            visible: false,
            image: '/objects/painting.svg',
        },
        {
            title: 'Alcohol',
            visibleAt: 2,
            visible: false,
            image: '/objects/alcohol.svg',
        },
        {
            title: 'Beers',
            visibleAt: 2,
            visible: false,
            image: '/objects/beer.svg',
        },
        {
            title: 'Microphone',
            visibleAt: 3,
            visible: false,
            image: '/objects/microphone.svg',
        },
        {
            title: 'DiscoBall',
            visibleAt: 3,
            visible: false,
            image: '/objects/disco-ball.svg',
        },
        {
            title: 'Microphone',
            visibleAt: 3,
            visible: false,
            image: '/objects/microphone.svg',
        },
        {
            title: 'DiscoBall',
            visibleAt: 3,
            visible: false,
            image: '/objects/disco-ball.svg',
        },
        {
            title: 'Microphone',
            visibleAt: 3,
            visible: false,
            image: '/objects/microphone.svg',
        },
        {
            title: 'DiscoBall',
            visibleAt: 3,
            visible: false,
            image: '/objects/disco-ball.svg',
        },
    ];

    submenu: string = 'main';
    tTasks: any[] = [];

    ngAfterViewInit() {
        this.updateTasks();
    }

    ngOnChanges() {
        this.updateTasks();
    }

    updateTasks() {
        this.tTasks = [];
        this.allItems.forEach((item) => {
            this.tTasks.push(...item.tTasks);
        });
        console.log(this.tTasks);
        console.log(this.allItems);
    }
    closeMenu($event?: any) {
        $event?.stopPropagation();
        $event?.preventDefault();
        this.closed.emit();
    }
    selectSubmenu(submenu: string) {
        this.submenu = submenu;
    }

    selectSection($event: any) {
        this.outerMenuSections.forEach((section) => {
            section.visible = section.visibleAt === $event;
        });
        this.isSubSectionSelected = true;
    }

    selectItem($event: number) {
        this.addItem.emit({
            item: this.outerMenuSections[$event],
            menu: this.menu,
        });
        this.closeMenu();
    }

    onShowDrawCanvas() {
        this.showDrawCanvas.emit();
        this.closeMenu();
    }

    removeTask(task: any) {}
}
