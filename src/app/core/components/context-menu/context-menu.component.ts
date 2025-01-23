import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIf, NgStyle } from '@angular/common';
import { EllipsoButtonComponent, EllipsoIconComponent } from 'ellipso-ui-components';
import { CircleMenuComponent } from '../circle-menu/circle-menu.component';

@Component({
    selector: 'app-context-menu',
    imports: [NgStyle, EllipsoIconComponent, EllipsoButtonComponent, NgIf, CircleMenuComponent],
    templateUrl: './context-menu.component.html',
    styleUrl: './context-menu.component.css',
})
export class ContextMenuComponent {
    @Input() menu: any;
    @Output() closed = new EventEmitter<any>();
    @Output() addItem = new EventEmitter<any>();

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
            title: 'Beer',
            visible: true,
            image: '/objects/beer.svg',
        },
        {
            title: 'Disco',
            visible: true,
            image: '/objects/disco-ball.svg',
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
            image: '/objects/table.svg',
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
    ];

    submenu = 'main';

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
}
