import { NgxMaskModule } from 'ngx-mask';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PrincipalComponent } from './principal/principal.component';
import { LetterComponent } from './letter/letter.component';
import { LetterByLoanComponent } from './letter-by-loan/letter-by-loan.component';
import { RouterModule } from '@angular/router';
import { MastersPagesRoutes } from './letter.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/app.module';
import { CoreModule } from '../core/core/core.module';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from '../shared/shared.module';
import { LetterListComponent } from './letter-list/letter-list.component';



@NgModule({
  declarations: [ PrincipalComponent, LetterComponent, LetterByLoanComponent, LetterListComponent ],
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
