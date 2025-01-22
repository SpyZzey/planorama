import {Component, HostListener} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ContextMenuComponent} from "./core/components/context-menu/context-menu.component";
import {NgForOf, NgStyle} from "@angular/common";
import {bufferTime} from "rxjs";
import {EllipsoButtonComponent, EllipsoIconComponent} from "ellipso-ui-components";
import {ItemObjectComponent} from "./core/components/item-object/item-object.component";
import {DraggableViewportComponent} from "./core/components/draggable-viewport/draggable-viewport.component";

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, ContextMenuComponent, NgForOf, EllipsoIconComponent, EllipsoButtonComponent, NgStyle, ItemObjectComponent, DraggableViewportComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
    title = 'smarttable-collaboration';

    rotation = 0;

    testobjects: any[] = [
        {
            name: 'Test1',
            type: 'Table',
            x: 300,
            y: 100,
            width: 100,
            height: 100,
            color: 'red',
            rotation: 40,
            image: 'https://placehold.co/60x100'
        }
    ]

    menues: any[] = [
    ]

    onClickTable($event: MouseEvent) {
        if($event.target !== $event.currentTarget) {
            return;
        }
        let positionX = $event.clientX;
        let positionY = $event.clientY;

        this.menues.push({
            id: this.menues.length.toString(),
            x: positionX,
            y: positionY
        })
    }

    protected readonly bufferTime = bufferTime;

    onRotateScreen() {
        this.rotation = (this.rotation + 180) % 360;
    }

    isFullScreen = false;
    onToggleFullScreen() {
        if (!this.isFullScreen) {
            document.documentElement.requestFullscreen();
        }
        else {
            document.exitFullscreen();
        }
        this.isFullScreen = !this.isFullScreen;
    }

    @HostListener('document:fullscreenchange', ['$event'])
    onFullScreenChange(event: any) {
        this.isFullScreen = document.fullscreenElement !== null;
    }
}
