import { Component, ElementRef, Input, OnChanges, ViewChild } from '@angular/core';
import { EllipsoButtonComponent, EllipsoIconComponent } from 'ellipso-ui-components';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-draw-notes',
    imports: [EllipsoButtonComponent, EllipsoIconComponent, NgIf],
    templateUrl: './draw-notes.component.html',
    styleUrl: './draw-notes.component.css',
})
export class DrawNotesComponent implements OnChanges {
    @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;

    @Input() drawing: string | undefined | null;
    @Input() size!: string;
    private ctx!: CanvasRenderingContext2D;
    private isDrawing = false;
    private lastX = 0;
    private lastY = 0;
    private isErasing = false; // Track whether eraser mode is active

    ngAfterViewInit() {
        this.ctx = this.canvas.nativeElement.getContext('2d')!;
        this.setToDrawMode(); // Initialize in draw mode
    }

    ngOnChanges() {
        if (this.drawing) {
            this.loadDrawing(this.drawing);
        }
    }

    // Switch to draw mode
    setToDrawMode() {
        this.isErasing = false;
        this.ctx.globalCompositeOperation = 'source-over'; // Normal drawing mode
        this.ctx.strokeStyle = '#000000'; // Default draw color
        this.ctx.lineWidth = 2; // Default line width
    }

    // Switch to erase mode
    setToEraseMode() {
        this.isErasing = true;
        this.ctx.globalCompositeOperation = 'destination-out'; // Erase mode
        this.ctx.lineWidth = 30; // Eraser size (can be adjusted)
    }

    // Start drawing or erasing
    startDrawing(event: PointerEvent) {
        this.isDrawing = true;
        const { x, y } = this.getCanvasCoordinates(event);
        this.lastX = x;
        this.lastY = y;
    }

    // Stop drawing or erasing
    stopDrawing() {
        this.isDrawing = false;
        this.ctx.beginPath(); // Reset the path for the next stroke
    }

    // Draw or erase as the pointer moves
    draw(event: PointerEvent) {
        if (!this.isDrawing) return;

        const { x, y } = this.getCanvasCoordinates(event);
        this.ctx.beginPath();
        this.ctx.moveTo(this.lastX, this.lastY);
        this.ctx.lineTo(x, y);
        this.ctx.stroke();

        this.lastX = x;
        this.lastY = y;
    }

    // Get canvas coordinates relative to the canvas element
    private getCanvasCoordinates(event: PointerEvent) {
        const rect = this.canvas.nativeElement.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        };
    }

    // Serialize the drawing as a Base64 string
    serializeDrawing(): string {
        return this.canvas.nativeElement.toDataURL('image/png');
    }

    // Load a serialized drawing into the canvas
    loadDrawing(dataUrl: string) {
        const img = new Image();
        img.onload = () => {
            this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
            this.ctx.drawImage(img, 0, 0);
        };
        img.src = dataUrl;
    }

    // Clear the canvas
    @Input() hideTools!: boolean;
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    }

    saveDrawing() {}

    loadSerializedDrawing() {}
}
