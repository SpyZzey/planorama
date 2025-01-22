import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportObjectsDialogComponent } from './import-objects-dialog.component';

describe('ImportObjectsDialogComponent', () => {
  let component: ImportObjectsDialogComponent;
  let fixture: ComponentFixture<ImportObjectsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportObjectsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportObjectsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
