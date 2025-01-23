import {
    AfterViewInit,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import { NgForOf, NgIf, NgStyle } from '@angular/common';
import { ItemContextMenuComponent } from '../item-context-menu/item-context-menu.component';
import { Color, EllipsoIconComponent } from 'ellipso-ui-components';

@Component({
    selector: 'app-item-object',
    imports: [NgIf, ItemContextMenuComponent, NgStyle, EllipsoIconComponent, NgForOf],
    templateUrl: './item-object.component.html',
    styleUrl: './item-object.component.css',
})
export class ItemObjectComponent implements AfterViewInit, OnChanges {
    @ViewChild('itemObject') itemObject: any;
    @Input() item: any;
    @Output() hold: EventEmitter<any> = new EventEmitter();
    @Output() move: EventEmitter<any> = new EventEmitter();
    @Output() release: EventEmitter<any> = new EventEmitter();
    @Output() delete: EventEmitter<any> = new EventEmitter();
    @Output() duplicate: EventEmitter<any> = new EventEmitter();
    color = Color.fromHEX('#000000');
    hue = 0;
    saturation = 0;
    lightness = 0;

    ngOnChanges(changes: SimpleChanges) {
        if (changes['item']) {
            this.recolor();
        }
    }
    recolor() {
        this.color = Color.fromHEX(this.item.color);
        const hsl = this.color.toHSLArray();
        this.hue = hsl[0];
        this.saturation = hsl[1];
        this.lightness = hsl[2];
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.item.width = this.itemObject.nativeElement.offsetWidth;
            this.item.height = this.itemObject.nativeElement.offsetHeight;
            console.log(this.item.width, this.item.height);
        }, 500);
    }

    onSelectItem() {
        this.item.isSelected = true;
    }

    onUnselectItem() {
        this.item.isSelected = false;
    }
    private isResizing = false;
    private currentHandle: string | null = null;
    private startX = 0;
    private startY = 0;
    private startWidth = 0;
    private startHeight = 0;
    private startLeft = 0;
    private startTop = 0;

    onResizeStart(event: PointerEvent, handle: string) {
        event.preventDefault();
        console.log('RESIZE START', handle);

        this.isResizing = true;
        this.currentHandle = handle;

        this.startX = event.clientX;
        this.startY = event.clientY;
        this.startWidth = this.item.width;
        this.startHeight = this.item.height;
        this.startLeft = this.item.x;
        this.startTop = this.item.y;

        // Add a pointer capture to ensure tracking outside the element
        (event.target as HTMLElement).setPointerCapture(event.pointerId);
    }

    @ViewChild('objectImage') objectImage: any;
    onResizeMove(event: PointerEvent, handle: string) {
        if (!this.isResizing || this.currentHandle !== handle) {
            return;
        }

        const dx = event.clientX - this.startX;
        const dy = event.clientY - this.startY;

        const minWidth = 25; // Minimum width
        const minHeight = 25; // Minimum height

        // Convert movement into rotated space
        const angleRad = (this.item.rotation || 0) * (Math.PI / 180); // Convert degrees to radians
        const cosAngle = Math.cos(angleRad);
        const sinAngle = Math.sin(angleRad);

        // Rotated movement
        const rotatedDx = cosAngle * dx + sinAngle * dy;
        const rotatedDy = -sinAngle * dx + cosAngle * dy;

        // Handle resizing based on the handle position
        let newWidth = this.item.width;
        let newHeight = this.item.height;
        let deltaX = 0;
        let deltaY = 0;

        switch (handle) {
            case 'nw': // Top-left corner
                newWidth = this.startWidth - rotatedDx;
                newHeight = this.startHeight - rotatedDy;
                if (newWidth >= minWidth) {
                    deltaX = rotatedDx * cosAngle - rotatedDy * sinAngle;
                } else {
                    newWidth = minWidth;
                }
                if (newHeight >= minHeight) {
                    deltaY = rotatedDx * sinAngle + rotatedDy * cosAngle;
                } else {
                    newHeight = minHeight;
                }
                break;

            case 'ne': // Top-right corner
                newWidth = this.startWidth + rotatedDx;
                newHeight = this.startHeight - rotatedDy;
                if (newWidth < minWidth) {
                    newWidth = minWidth;
                }
                if (newHeight >= minHeight) {
                    deltaY = rotatedDx * sinAngle + rotatedDy * cosAngle;
                } else {
                    newHeight = minHeight;
                }
                break;

            case 'sw': // Bottom-left corner
                newWidth = this.startWidth - rotatedDx;
                newHeight = this.startHeight + rotatedDy;
                if (newWidth >= minWidth) {
                    deltaX = rotatedDx * cosAngle - rotatedDy * sinAngle;
                } else {
                    newWidth = minWidth;
                }
                if (newHeight < minHeight) {
                    newHeight = minHeight;
                }
                break;

            case 'se': // Bottom-right corner
                newWidth = this.startWidth + rotatedDx;
                newHeight = this.startHeight + rotatedDy;
                if (newWidth < minWidth) {
                    newWidth = minWidth;
                }
                if (newHeight < minHeight) {
                    newHeight = minHeight;
                }
                break;
        }

        // Update object dimensions
        this.item.width = newWidth;
        this.item.height = newHeight;

        // Update object position (adjust for the resized corner)
        if (handle === 'nw' || handle === 'sw') {
            this.item.x = this.startLeft + deltaX;
        }
        if (handle === 'nw' || handle === 'ne') {
            this.item.y = this.startTop + deltaY;
        }
    }
    onResizeEnd(event: PointerEvent) {
        this.isResizing = false;
        this.currentHandle = null;

        // Release pointer capture
        (event.target as HTMLElement).releasePointerCapture(event.pointerId);
    }

    private isRotating = false;
    private centerX = 0;
    private centerY = 0;

    onRotateStart(event: PointerEvent) {
        event.preventDefault();

        console.log('ROTATE START');
        this.isRotating = true;

        // Calculate the center of the element
        const rect = this.itemObject.nativeElement.getBoundingClientRect();
        this.centerX = rect.left + rect.width / 2;
        this.centerY = rect.top + rect.height / 2;

        // Add pointer capture
        (event.target as HTMLElement).setPointerCapture(event.pointerId);
    }

    onRotateMove(event: PointerEvent) {
        if (!this.isRotating) return;

        const angle = Math.atan2(event.clientY - this.centerY, event.clientX - this.centerX);
        this.item.rotation = (angle * 180) / Math.PI - 90; // Convert radians to degrees
    }

    onRotateEnd(event: PointerEvent) {
        this.isRotating = false;

        // Release pointer capture
        (event.target as HTMLElement).releasePointerCapture(event.pointerId);
    }

    onColorChange($event: any) {
        this.color = $event;
        this.item.color = this.color.toHEX();
        this.recolor();
    }

    onDeleteItem() {
        this.delete.emit(this.item);
    }
}
