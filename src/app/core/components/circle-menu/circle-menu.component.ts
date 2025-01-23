import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { NgForOf, NgIf, NgStyle } from '@angular/common';
import { EllipsoIconComponent } from 'ellipso-ui-components';

@Component({
    selector: 'app-circle-menu',
    imports: [NgIf, NgForOf, NgStyle, EllipsoIconComponent],
    templateUrl: './circle-menu.component.html',
    styleUrl: './circle-menu.component.css',
})
export class CircleMenuComponent implements OnChanges {
    @Input() sections: any[] = [
        { label: 'Section 1', color: 'red' },
        { label: 'Section 2', color: 'blue' },
        { label: 'Section 3', color: 'green' },
        { label: 'Section 4', color: 'yellow' },
        { label: 'Section 5', color: 'purple' },
    ];
    @Input() numberOfSections = 5; // Number of sections
    @Input() size = 200; // Size of the circle
    @Input() outerRadius = 80; // Outer radius of the donut
    @Input() innerRadius = 0; // Inner radius (hole size)
    @Input() centerX = 100; // Center X of the circle
    @Input() centerY = 100; // Center Y of the circle
    @Input() hoveredSection: number | null = null; // Track which section is hovered
    @Output() sectionSelected = new EventEmitter<number>(); // Emit event when a section is selected

    ngOnChanges() {
        this.numberOfSections = this.sections.length;
    }

    // Function to calculate path data for each section
    calculatePath(sectionIndex: number): string {
        const anglePerSection = (2 * Math.PI) / this.numberOfSections;
        const startAngle = sectionIndex * anglePerSection;
        const endAngle = startAngle + anglePerSection;

        // Outer arc start and end points
        const outerStartX = this.centerX + this.outerRadius * Math.cos(startAngle);
        const outerStartY = this.centerY + this.outerRadius * Math.sin(startAngle);
        const outerEndX = this.centerX + this.outerRadius * Math.cos(endAngle);
        const outerEndY = this.centerY + this.outerRadius * Math.sin(endAngle);

        // Inner arc start and end points
        const innerStartX = this.centerX + this.innerRadius * Math.cos(endAngle);
        const innerStartY = this.centerY + this.innerRadius * Math.sin(endAngle);
        const innerEndX = this.centerX + this.innerRadius * Math.cos(startAngle);
        const innerEndY = this.centerY + this.innerRadius * Math.sin(startAngle);

        // Large-arc flag
        const largeArcFlag = anglePerSection > Math.PI ? 1 : 0;

        return `
      M ${outerStartX},${outerStartY} 
      A ${this.outerRadius},${this.outerRadius} 0 ${largeArcFlag},1 ${outerEndX},${outerEndY} 
      L ${innerStartX},${innerStartY} 
      A ${this.innerRadius},${this.innerRadius} 0 ${largeArcFlag},0 ${innerEndX},${innerEndY} 
      Z
    `;
    }
    // Track hovered section
    onHover(sectionIndex: number): void {
        this.hoveredSection = sectionIndex;
    }

    // Reset hover state
    onLeave(): void {
        this.hoveredSection = null;
    }

    onClick(sectionIndex: number) {
        this.sectionSelected.emit(sectionIndex);
    }
    calculateImagePosition(sectionIndex: number): { x: number; y: number } {
        const anglePerSection = (2 * Math.PI) / this.sections.length;
        const startAngle = sectionIndex * anglePerSection;
        const endAngle = startAngle + anglePerSection;

        // Calculate the midpoint angle of the section
        const midAngle = startAngle + (endAngle - startAngle) / 2;

        // Distance from the center where the image should be placed (halfway between inner and outer radius)
        const imageRadius = (this.outerRadius + this.innerRadius) / 2 + 6;

        // Calculate image position
        const x = this.centerX + imageRadius * Math.cos(midAngle) - 20; // Offset for 50px width
        const y = this.centerY + imageRadius * Math.sin(midAngle) - 20; // Offset for 50px height

        return { x, y };
    }
}
