import {Component, HostListener, ViewChild} from '@angular/core';
import {NgForOf, NgStyle} from "@angular/common";

@Component({
    selector: 'app-draggable-viewport',
    imports: [
        NgStyle,
        NgForOf
    ],
    templateUrl: './draggable-viewport.component.html',
    styleUrl: './draggable-viewport.component.css'
})
export class DraggableViewportComponent {

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

    items = [
        { x: 100, y: 100, label: 'Item 1' },
        { x: 300, y: 200, label: 'Item 2' },
        { x: 500, y: 400, label: 'Item 3' },
    ];

    onPanStart(event: MouseEvent | TouchEvent) {
        this.pointers.push(event);

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

    onPanMove(event: MouseEvent | TouchEvent) {
        if (this.pointers.length === 1) {
            const { clientX, clientY } = this.getClientCoordinates(event);
            this.offsetX = clientX - this.startX;
            this.offsetY = clientY - this.startY;
        } else if (this.pointers.length === 2) {
            this.handlePinch(event);
        }
    }

    startDistance = -1;

    pointers: any[] = [];
    prevDistance = -1;
    prevMiddleX = -1;
    prevMiddleY = -1;
    handlePinch(event: any) {
        const index = this.pointers.findIndex(
            (cachedEv) => cachedEv.pointerId === event.pointerId,
        );
        this.pointers[index] = event;

        const [pointer1, pointer2] = this.pointers;
        const currentDistance = this.getDistance(pointer1, pointer2);
        const pointer1Position = this.getClientCoordinates(pointer1);
        const pointer2Position = this.getClientCoordinates(pointer2);

        // Zoom around middleX and middleY / the center of  the pinch
        const middleX = (pointer1Position.clientX + pointer2Position.clientX) / 2;
        const middleY = (pointer1Position.clientY + pointer2Position.clientY) / 2;

        if(this.prevDistance === -1) this.prevDistance = currentDistance;
        if(this.prevMiddleX === -1) this.prevMiddleX = middleX;
        if(this.prevMiddleY === -1) this.prevMiddleY = middleY;

        const diff = currentDistance/this.prevDistance;

        const potentialZoom = this.scale * diff;

        if(diff === 0) return;
        if(potentialZoom < this.minZoom || potentialZoom > this.maxZoom) return;
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
    onPanEnd(event: MouseEvent | TouchEvent) {
        this.pointers = this.pointers.filter(p => p !== event);

        this.removeEvent(event);
        if(this.pointers.length < 2) {
            this.prevDistance = -1;
            this.prevMiddleX = -1;
            this.prevMiddleY = -1;
        }
    }
    removeEvent(event: any) {
        // Remove this event from the target's cache
        const index = this.pointers.findIndex(
            (cachedEv: any) => cachedEv.pointerId === event.pointerId,
        );
        this.pointers.splice(index, 1);
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


}
