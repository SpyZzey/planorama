import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import { EllipsoButtonComponent, EllipsoIconComponent } from 'ellipso-ui-components';
import { NgIf, NgStyle } from '@angular/common';

@Component({
    selector: 'app-draw-canvas',
    imports: [EllipsoButtonComponent, NgStyle, NgIf, EllipsoIconComponent],
    templateUrl: './draw-canvas.component.html',
    styleUrl: './draw-canvas.component.css',
})
export class DrawCanvasComponent implements OnChanges, AfterViewInit {
    @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;

    @Input() drawing: string | undefined | null;
    @Input() drawType: string | undefined | null;
    private ctx!: CanvasRenderingContext2D;
    private isDrawing = false;
    private lastX = 0;
    private lastY = 0;
    private isErasing = false; // Track whether eraser mode is active

    @Output() lock = new EventEmitter<any>();

    locked = false;

    ngAfterViewInit() {
        this.ctx = this.canvas.nativeElement.getContext('2d')!;
        this.setToDrawMode(); // Initialize in draw mode
        this.update();
    }

    ngOnChanges(changes: SimpleChanges) {
        this.update();
    }

    update() {
        this.onHideMenu();
        if (this.drawing) {
            this.loadDrawing(this.drawing);
        }
        if (this.drawType === 'eraser') {
            this.setToEraseMode();
        } else if (this.drawType === 'pen') {
            this.setToDrawMode();
        } else if (this.drawType === 'highlighter') {
            this.setToHighlighterMode();
        } else if (this.drawType === 'lasso') {
            this.setToLassoMode();
        }
    }

    showMenu = false;
    menuPosition = { x: 0, y: 0 };
    lastPath: { x: number; y: number }[] = [];
    onShowMenu() {
        this.showMenu = true;
        const rect = this.getBoundingPoints(this.lastPath);
        if (!rect) return;

        this.menuPosition = {
            x: (rect.highestX.x + rect.lowestX.x) / 2,
            y: rect.lowestY.y,
        };
    }

    onHideMenu() {
        this.showMenu = false;
    }

    setToLassoMode() {
        if (!this.ctx) return;

        this.isErasing = false;
        this.ctx.globalCompositeOperation = 'source-over'; // Normal drawing mode for lasso
        this.ctx.lineWidth = 2; // Dashed outline width
        this.ctx.strokeStyle = 'black'; // Outline color
        this.ctx.setLineDash([5, 5]); // Dashed pattern

        let path: { x: number; y: number }[] = [];
        this.lastPath = path;
        const drawLasso = (event: PointerEvent) => {
            if (!this.isDrawing) return;

            const { x, y } = this.getCanvasCoordinates(event);
            path.push({ x, y });

            this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
            this.ctx.beginPath();
            this.ctx.moveTo(path[0].x, path[0].y);
            for (let i = 1; i < path.length; i++) {
                this.ctx.lineTo(path[i].x, path[i].y);
            }
            this.ctx.stroke();
            this.onHideMenu();
        };

        const closeLasso = () => {
            if (path.length < 2) return;

            console.log('Lasso closed', path);

            this.isDrawing = false;

            this.ctx.lineTo(path[0].x, path[0].y); // Close the path
            this.ctx.stroke();

            // Fill the lassoed area
            this.ctx.setLineDash([]); // Remove dashed pattern for fill
            this.ctx.fillStyle = 'rgba(195,195,255,0.3)'; // Semi-transparent blue fill
            this.ctx.fill();

            this.lastPath = path;
            path = []; // Reset the path
            this.ctx.setLineDash([5, 5]); // Restore dashed pattern
            this.ctx.closePath();
            this.onShowMenu();
        };

        // Attach event listeners
        this.canvas.nativeElement.addEventListener('pointerdown', (event: PointerEvent) => {
            this.isDrawing = true;
            const { x, y } = this.getCanvasCoordinates(event);
            path.push({ x, y });
        });

        this.canvas.nativeElement.addEventListener('pointermove', drawLasso);
        this.canvas.nativeElement.addEventListener('pointerup', closeLasso);
        this.canvas.nativeElement.addEventListener('pointerleave', closeLasso);
    }

    setToHighlighterMode() {
        if (!this.ctx) return;
        this.isErasing = false;
        this.ctx.globalCompositeOperation = 'source-over'; // Highlighter mode
        this.ctx.strokeStyle = 'rgba(255, 255, 0, 0.5)'; // Semi-transparent yellow for the highlighter
        this.ctx.lineWidth = 10; // Highlighter line width
    }

    // Switch to draw mode
    setToDrawMode() {
        if (!this.ctx) return;
        this.isErasing = false;
        this.ctx.globalCompositeOperation = 'source-over'; // Normal drawing mode
        this.ctx.strokeStyle = '#000000'; // Default draw color
        this.ctx.lineWidth = 2; // Default line width
    }

    // Switch to erase mode
    setToEraseMode() {
        if (!this.ctx) return;
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
        if (this.drawType === 'lasso') return;
        this.isDrawing = false;
        this.ctx.beginPath(); // Reset the path for the next stroke
    }

    // Draw or erase as the pointer moves
    draw(event: PointerEvent) {
        if (this.drawType === 'lasso') return;
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
    @Input() size: string = '';
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    }

    saveDrawing() {}

    loadSerializedDrawing() {}

    getBoundingPoints(path: { x: number; y: number }[]) {
        if (path.length === 0) {
            return null;
        }

        // Initialize with the first point
        let highestX = path[0];
        let lowestX = path[0];
        let highestY = path[0];
        let lowestY = path[0];

        for (const point of path) {
            if (point.x > highestX.x) {
                highestX = point;
            }
            if (point.x < lowestX.x) {
                lowestX = point;
            }
            if (point.y > highestY.y) {
                highestY = point;
            }
            if (point.y < lowestY.y) {
                lowestY = point;
            }
        }

        return {
            highestX,
            lowestX,
            highestY,
            lowestY,
        };
    }

    toggleLock() {
        this.locked = !this.locked;
        this.lock.emit({
            locked: this.locked,
            boundingBox: this.getBoundingPoints(this.lastPath),
        });
    }
}
