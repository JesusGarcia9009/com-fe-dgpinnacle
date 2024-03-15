import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OperationModel } from '../models/operation.model';

@Component({
  selector: 'app-detail-record',
  templateUrl: './detail-record.component.html',
  styleUrls: ['./detail-record.component.css']
})
export class DetailRecordComponent implements OnInit {

  title: string;
  currentOperation: OperationModel

  constructor(
    private dialogRef: MatDialogRef<DetailRecordComponent>,
    @Inject(MAT_DIALOG_DATA) data) {

    this.currentOperation = data.operation;
    this.title = data.title;
  }

  ngOnInit() {

  }

  save() {


    this.dialogRef.close();
  }

  close() {
    this.dialogRef.close();
  }

}
