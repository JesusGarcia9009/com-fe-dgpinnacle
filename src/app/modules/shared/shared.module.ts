import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmptyStateComponent } from './widgets/empty-state/empty-state.component';
import { DecimalNumberDirective } from './directives/decimal-number.directive';
import { RutFormaterDirective } from './directives/rut-format.directive';
import { RutFormatPipe } from './pipes/rut-format.pipe';
import { ToUpperCaseDirective } from './directives/to-uppercase.directive';
import { DatePickerFormatDirective } from './directives/custom-date-format.directive';




@NgModule({
  declarations: [EmptyStateComponent, DecimalNumberDirective,RutFormaterDirective, RutFormatPipe, ToUpperCaseDirective, DatePickerFormatDirective],
  imports: [
    CommonModule
  ],
  exports: [EmptyStateComponent,DecimalNumberDirective, RutFormaterDirective, RutFormatPipe, ToUpperCaseDirective, DatePickerFormatDirective]
})
export class SharedModule { }
