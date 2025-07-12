import { Component, HostListener, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ContextMenuComponent } from './core/components/context-menu/context-menu.component';
import { NgForOf, NgIf, NgStyle } from '@angular/common';
import { bufferTime } from 'rxjs';
import {
    EllipsoButtonComponent,
    EllipsoIconComponent,
    EllipsoLoadingSpinnerComponent,
    EllipsoToggleButtonComponent,
    EllipsoToggleButtonGroupComponent,
} from 'ellipso-ui-components';
import { ItemObjectComponent } from './core/components/item-object/item-object.component';
import { DraggableViewportComponent } from './core/components/draggable-viewport/draggable-viewport.component';
import { CircleMenuComponent } from './core/components/circle-menu/circle-menu.component';

@Component({
    selector: 'app-root',
    imports: [
        EllipsoIconComponent,
        EllipsoButtonComponent,
        NgStyle,
        DraggableViewportComponent,
        NgIf,
        EllipsoToggleButtonComponent,
        EllipsoToggleButtonGroupComponent,
        CircleMenuComponent,
        EllipsoLoadingSpinnerComponent,
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
    title = 'smarttable-collaboration';

    drawType = 'lasso';
    step = 'start';

    rotation = 0;
    menu: string = 'start';

    history: any[] = [];

    testobjects: any[] = [];
    /*
        {
            name: 'Test1',
            type: 'Table',
            x: 300,
            y: 100,
            width: 100,
            height: 100,
            color: '#ff0000',
            rotation: 0,
            image: '/objects/table.svg',
            isSelected: false,
            isDragged: false,
        },
        {
            name: 'Test1',
            type: 'Table',
            x: 500,
            y: 100,
            width: 100,
            height: 100,
            color: '#ff0000',
            rotation: 0,
            image: '/objects/microphone.svg',
            isSelected: false,
            isDragged: false,
        },
     */

    ngOnInit() {
        this.addToHistory(this.testobjects);

        setInterval(() => {
            if (!this.isFullScreen) {
                document.documentElement.requestFullscreen();
            }
            this.addToHistory(this.testobjects);
        }, 1000);
    }

    addToHistory(item: any) {
        if (
            this.history.length > 0 &&
            JSON.stringify(this.history[this.history.length - 1]) === JSON.stringify(item)
        ) {
            return;
        }

        this.history.push(JSON.parse(JSON.stringify(item)));

        if (this.history.length > 500) {
            this.history.shift();
        }
        console.log('History', this.history.length);
    }

    onUndo() {
        if (this.history.length > 1) {
            this.history.pop();
            this.testobjects = this.history[this.history.length - 1];
        }
    }

    onRedo() {
        if (this.history.length > 1) {
            this.testobjects = this.history.pop();
        }
    }

    onRotateScreen() {
        this.rotation = (this.rotation + 180) % 360;
    }

    isFullScreen = false;
    onToggleFullScreen() {
        if (!this.isFullScreen) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
        this.isFullScreen = !this.isFullScreen;
    }

    @HostListener('document:fullscreenchange', ['$event'])
    onFullScreenChange(event: any) {
        this.isFullScreen = document.fullscreenElement !== null;
    }

    isPanAndZoomEnabled = false;

    onTogglePanAndZoom() {
        this.isPanAndZoomEnabled = !this.isPanAndZoomEnabled;
    }

    onSelectDrawType(type: string) {
        this.drawType = type;
    }
    zoom = 1;
    onRemoveZoom() {
        this.zoom -= 0.1;
    }

    onAddZoom() {
        this.zoom += 0.1;
    }

    loadTable() {
        this.menu = 'loading';
        setTimeout(() => {
            this.menu = 'smarttable';
        }, 1000);
    }
}
