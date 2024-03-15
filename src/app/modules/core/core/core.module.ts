import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptorService } from './services/interceptor.service';
import { SpinnerOverlayComponent } from './features/spinner-overlay/spinner-overlay.component';



@NgModule({
  declarations: [SpinnerOverlayComponent],
  imports: [
    CommonModule,
    HttpClientModule 
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true }
  ]
})
export class CoreModule { }
