import { Component, HostListener, Input, ViewChild } from '@angular/core';
import { NgForOf, NgStyle } from '@angular/common';
import { ItemObjectComponent } from '../item-object/item-object.component';
import { ContextMenuComponent } from '../context-menu/context-menu.component';
import { Point } from '@angular/cdk/drag-drop';
import { DrawCanvasComponent } from '../draw-canvas/draw-canvas.component';

@Component({
    selector: 'app-draggable-viewport',
    imports: [NgStyle, NgForOf, ItemObjectComponent, ContextMenuComponent, DrawCanvasComponent],
    templateUrl: './draggable-viewport.component.html',
    styleUrl: './draggable-viewport.component.css',
})
export class DraggableViewportComponent {
    @Input() items: any[] = [];
    @Input() isPanAndZoomEnabled = false;
    @Input() drawType!: string;

    offsetX = 0; // Pan offset X
    offsetY = 0; // Pan offset Y
    scale = 1; // Zoom scale
    isPanning = false; // Panning state
    startX = 0; // Start X for panning
    startY = 0; // Start Y for panning

    isDragging = false; // Dragging state
    dragIndex = -1; // Dragging item index
    dragStartX = 0; // Start X for dragging
    dragStartY = 0; // Start Y for dragging

    maxZoom = 2;
    minZoom = 0.2;
    scaleFactor = 1.1;
    contextMenuOpenDelay = 500;
    holdPointers: any[] = [];

    onAddItem($event: any) {
        this.items.push({
            name: $event.item.title,
            type: 'Table',
            x: $event.menu.x,
            y: $event.menu.y,
            width: 100,
            height: 100,
            color: '#808080',
            rotation: 0,
            image: $event.item.image,
            isSelected: false,
            isDragged: false,
        });
    }
    onPanStart(event: PointerEvent) {
        this.pointers.push(event);
        this.holdPointers.push(event);

        if (!this.isPanAndZoomEnabled) {
            setTimeout(() => {
                const index = this.holdPointers.findIndex((p) => p.pointerId === event.pointerId);

                if (index !== -1) {
                    this.openContextMenu(event);
                    this.holdPointers.splice(index, 1);
                }
            }, this.contextMenuOpenDelay);

            return;
        }

        const { clientX, clientY } = this.getClientCoordinates(event);
        this.startX = clientX - this.offsetX;
        this.startY = clientY - this.offsetY;

        /*
        if (event instanceof MouseEvent || (event as TouchEvent).touches.length === 1) {
          this.isPanning = true;
          const { clientX, clientY } = this.getClientCoordinates(event);
          this.startX = clientX - this.offsetX;
          this.startY = clientY - this.offsetY;
        } else if ((event as TouchEvent).touches.length === 2) {
          this.startPinch(event as TouchEvent);
        }
         */
    }

    onPanMove(event: PointerEvent) {
        if (!this.isPanAndZoomEnabled) {
            const pointer = this.holdPointers.find((p) => p.pointerId === event.pointerId);
            if (!pointer) return;

            const { clientX, clientY } = this.getClientCoordinates(event);
            const deltaX = clientX - pointer.clientX;
            const deltaY = clientY - pointer.clientY;
            if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
                const index = this.holdPointers.findIndex((p) => p.pointerId === event.pointerId);
                this.holdPointers.splice(index, 1);
            }
            return;
        }

        if (this.pointers.length === 1) {
            const { clientX, clientY } = this.getClientCoordinates(event);
            this.offsetX = clientX - this.startX;
            this.offsetY = clientY - this.startY;
        } else if (this.pointers.length === 2) {
            this.handlePinch(event);
        }
    }
    menues: any[] = [];
    @ViewChild('viewport') viewport: any;

    openContextMenu($event: PointerEvent) {
        const { clientX, clientY } = this.getClientCoordinates($event);
        const viewportRect = this.viewport.nativeElement.getBoundingClientRect();

        this.menues.push({
            id: this.menues.length.toString(),
            x: clientX - viewportRect.left,
            y: clientY - viewportRect.top,
        });
    }
    onPanEnd(event: PointerEvent) {
        this.removeEvent(this.holdPointers, event);
        this.removeEvent(this.pointers, event);

        if (this.pointers.length < 2) {
            this.prevDistance = -1;
            this.prevMiddleX = -1;
            this.prevMiddleY = -1;
        }
    }

    startDistance = -1;

    pointers: any[] = [];
    prevDistance = -1;
    prevMiddleX = -1;
    prevMiddleY = -1;
    handlePinch(event: any) {
        const index = this.pointers.findIndex((cachedEv) => cachedEv.pointerId === event.pointerId);
        this.pointers[index] = event;

        const [pointer1, pointer2] = this.pointers;
        const currentDistance = this.getDistance(pointer1, pointer2);
        const pointer1Position = this.getClientCoordinates(pointer1);
        const pointer2Position = this.getClientCoordinates(pointer2);

        // Zoom around middleX and middleY / the center of  the pinch
        const middleX = (pointer1Position.clientX + pointer2Position.clientX) / 2;
        const middleY = (pointer1Position.clientY + pointer2Position.clientY) / 2;

        if (this.prevDistance === -1) this.prevDistance = currentDistance;
        if (this.prevMiddleX === -1) this.prevMiddleX = middleX;
        if (this.prevMiddleY === -1) this.prevMiddleY = middleY;

        const diff = currentDistance / this.prevDistance;

        const potentialZoom = this.scale * diff;

        if (diff === 0) return;
        if (potentialZoom < this.minZoom || potentialZoom > this.maxZoom) return;
        // Update the scale
        this.scale = potentialZoom;

        // Calculate the difference in midpoint positions (for panning)
        const deltaX = middleX - this.prevMiddleX;
        const deltaY = middleY - this.prevMiddleY;

        // Adjust offsets for zoom and panning
        this.offsetX += deltaX; // Pan horizontally
        this.offsetY += deltaY; // Pan vertically
        this.offsetX -= (middleX - this.offsetX) * (diff - 1); // Adjust for zooming
        this.offsetY -= (middleY - this.offsetY) * (diff - 1); // Adjust for zooming

        // Update previous values
        this.prevDistance = currentDistance;
        this.prevMiddleX = middleX;
        this.prevMiddleY = middleY;
    }
    removeEvent(pointers: any[], event: any) {
        // Remove this event from the target's cache
        const index = pointers.findIndex((cachedEv: any) => cachedEv.pointerId === event.pointerId);
        pointers.splice(index, 1);
    }

    private getDistance(touch1: Touch, touch2: Touch): number {
        const dx = touch2.clientX - touch1.clientX;
        const dy = touch2.clientY - touch1.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }
    private getClientCoordinates(event: MouseEvent | TouchEvent) {
        if (event instanceof MouseEvent) {
            return { clientX: event.clientX, clientY: event.clientY };
        } else {
            const touch = event.touches[0] || event.changedTouches[0];
            return { clientX: touch.clientX, clientY: touch.clientY };
        }
    }

    onTouchStart(event: TouchEvent, index: number): void {
        event.stopPropagation();
        const touch = event.changedTouches[0];
        const item = this.items[index];

        if (!item.isSelected) return;
        // Bind the touch to the specific item if it isn't already being dragged
        if (!item.activeTouchId) {
            item.activeTouchId = touch.identifier;
            item.startClientX = touch.clientX;
            item.startClientY = touch.clientY;
            item.startOffsetX = item.x;
            item.startOffsetY = item.y;
            item.isDragged = true;
        }
    }

    onTouchMove(event: TouchEvent, index: number): void {
        const touch = Array.from(event.changedTouches).find(
            (t) => t.identifier === this.items[index].activeTouchId,
        );

        // If this touch corresponds to the item's active touch, move the item
        if (touch) {
            const item = this.items[index];
            const deltaX = (touch.clientX - item.startClientX) / this.scale;
            const deltaY = (touch.clientY - item.startClientY) / this.scale;

            item.x = item.startOffsetX + deltaX; // Adjust to center the drag
            item.y = item.startOffsetY + deltaY;
        }
    }

    onTouchEnd(event: TouchEvent, index: number): void {
        const touch = Array.from(event.changedTouches).find(
            (t) => t.identifier === this.items[index].activeTouchId,
        );

        // If this touch corresponds to the item's active touch, release it
        if (touch) {
            const item = this.items[index];
            item.activeTouchId = null;
            item.isDragged = false;
        }
    }

    dragItemStartX = 0;
    dragItemStartY = 0;
    onDragStart(event: MouseEvent | TouchEvent, index: number) {
        event.stopPropagation();
        this.isDragging = true;
        this.dragIndex = index;
        const { clientX, clientY } = this.getClientCoordinates(event);
        this.dragStartX = clientX;
        this.dragStartY = clientY;

        this.dragItemStartX = this.items[index].x;
        this.dragItemStartY = this.items[index].y;
    }

    @HostListener('document:mousemove', ['$event'])
    @HostListener('document:touchmove', ['$event'])
    onDragMove(event: MouseEvent | TouchEvent) {
        if (!this.isDragging) return;
        console.log('drag');
        const { clientX, clientY } = this.getClientCoordinates(event);

        const deltaX = (clientX - this.dragStartX) / this.scale;
        const deltaY = (clientY - this.dragStartY) / this.scale;

        this.items[this.dragIndex].x = this.dragItemStartX + deltaX;
        this.items[this.dragIndex].y = this.dragItemStartY + deltaY;
    }

    @HostListener('document:mouseup', ['$event'])
    @HostListener('document:touchend', ['$event'])
    onDragEnd() {
        this.isDragging = false;
        this.dragIndex = -1;
    }

    onDeleteItem(i: number) {
        this.items.splice(i, 1);
    }

    removeContextMenu(i: number) {
        this.menues.splice(i, 1);
    }

    onDuplicateItem(i: number) {
        const item = this.items[i];
        let newItem = JSON.parse(JSON.stringify(item));

        this.items.push({
            ...newItem,
            x: newItem.x + 10,
            y: newItem.y + 10,
        });
    }
}
