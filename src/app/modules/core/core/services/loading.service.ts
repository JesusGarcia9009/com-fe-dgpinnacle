import { Injectable } from '@angular/core';
import { OverlayRef, Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { SpinnerOverlayComponent } from '../features/spinner-overlay/spinner-overlay.component';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private overlayRef: OverlayRef = null;

  constructor(private overlay: Overlay) {}
  public show() {

    if (!this.overlayRef) {

      this.overlayRef = this.overlay.create();
    }

    const spinnerOverlayPortal = new ComponentPortal(SpinnerOverlayComponent);
    const component = this.overlayRef.attach(spinnerOverlayPortal); // Attach ComponentPortal to PortalHost
  }

  public hide() {
    if (!!this.overlayRef) {
      this.overlayRef.detach();
    }
  }
}
