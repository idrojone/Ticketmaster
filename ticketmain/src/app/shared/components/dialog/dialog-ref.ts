import { OverlayRef } from '@angular/cdk/overlay';

export class ZardDialogRef<T> {
  constructor(private overlayRef: OverlayRef, private componentInstance?: T) {}

  close(result?: any): void {
    this.overlayRef.dispose();
  }

  getComponentInstance(): T | undefined {
    return this.componentInstance;
  }
}