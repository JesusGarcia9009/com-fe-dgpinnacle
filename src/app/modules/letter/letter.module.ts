import { NgxMaskModule } from 'ngx-mask';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MastersPagesRoutes } from './letter.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/app.module';
import { CoreModule } from '../core/core/core.module';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from '../shared/shared.module';
import { LetterListComponent } from './letter-list/letter-list.component';
import { AddUpdateLetterComponent } from './add-update-letter/add-update-letter.component';
import { AddLetterEncompassComponent } from './add-letter-encompass/add-letter-encompass.component';
import { CalculatorLetterComponent } from './calculator-letter/calculator-letter.component';



@NgModule({
  declarations: [ LetterListComponent, AddUpdateLetterComponent, AddLetterEncompassComponent, CalculatorLetterComponent ],
  providers: [ DatePipe ],
  imports: [
    CommonModule,
    RouterModule.forChild(MastersPagesRoutes),
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    CoreModule,
    DataTablesModule,
    SharedModule,
    NgxMaskModule.forRoot()
  ]
})
export class LetterModule { }
