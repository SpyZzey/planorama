import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ContextMenuComponent} from "./core/components/context-menu/context-menu.component";
import {NgForOf} from "@angular/common";

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, ContextMenuComponent, NgForOf],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
    title = 'smarttable-collaboration';
    menues: any[] = [
    ]

    onClickTable($event: MouseEvent) {
        console.log($event)
        let positionX = $event.clientX;
        let positionY = $event.clientY;

        this.menues.push({
            id: this.menues.length.toString(),
            x: positionX,
            y: positionY
        })
    }
}
