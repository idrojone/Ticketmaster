import { Injectable, TemplateRef, Type, ViewContainerRef, inject, Injector } from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import { ZardDialogComponent, ZardDialogOptions } from './dialog.component';
import { ZardDialogRef } from './dialog-ref';

@Injectable({
  providedIn: 'root'
})
export class ZardDialogService {
  private overlay = inject(Overlay);

  open<T, U>(options: ZardDialogOptions<T, U>): ZardDialogRef<any> {
    const overlayConfig: OverlayConfig = {
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-dark-backdrop',
      positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
      scrollStrategy: this.overlay.scrollStrategies.block(),
    };

    const overlayRef: OverlayRef = this.overlay.create(overlayConfig);
    
    // Create injector with the options
    const injector = Injector.create({
      providers: [
        { provide: ZardDialogOptions, useValue: options },
        { provide: OverlayRef, useValue: overlayRef }
      ]
    });

    const dialogPortal = new ComponentPortal(ZardDialogComponent, options.zViewContainerRef, injector);
    const dialogComponent = overlayRef.attach(dialogPortal);

    const dialogRef = new ZardDialogRef<any>(overlayRef, dialogComponent.instance);
    dialogComponent.instance.dialogRef = dialogRef;

    // Handle backdrop click
    if (options.zMaskClosable !== false) {
      overlayRef.backdropClick().subscribe(() => {
        dialogRef.close();
      });
    }

    return dialogRef;
  }
}