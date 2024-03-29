import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { LetterModel } from '../models/letter.model';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { ModalService } from '../../core/core/services/modal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from '../../core/core/services/loading.service';
import { MatDialog } from '@angular/material/dialog';
import { LetterService } from '../services/letter.service';
import { Subject, Subscription, zip } from 'rxjs';
import { ClientModel } from '../models/client.model';
import { SharedService } from '../../shared/shared.service';
import { DataTableDirective } from 'angular-datatables';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

export interface Client {
  name: string;
}

@Component({
  selector: 'app-calculator-letter',
  templateUrl: './calculator-letter.component.html',
  styleUrls: ['./calculator-letter.component.css']
})
export class CalculatorLetterComponent implements OnInit, OnDestroy {

  public formTitle: string = 'Calculator.';
  public isReadOnly: boolean;
  public element: LetterModel;
  public subscriptions: Array<Subscription> = [];


  public state: string;
  public maxpay: number;


  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  clients: Client[] = [];

  
  public registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private letterService: LetterService,
    private modalService: ModalService,
    private router: Router,
    private loadingService: LoadingService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private sharedService: SharedService,
  ) { }

  ngOnInit(): void {

    const ver = this.route.snapshot.paramMap.get('ver');
    if (ver) {
      this.isReadOnly = true;
    }
    this.element = this.letterService.elementSelected;
    this.initForm();

    if (this.element) {
      
      this.registerForm.patchValue(this.element);

      this.element.clients.forEach(element => {
        this.clients.push({name: element.name + ' ' + element.lastName});
      });
    } else {
      sessionStorage.setItem('title', this.formTitle);
    }
  }

  get registerFormControls() { return this.registerForm.controls; }

  async initForm() {

    if (this.isReadOnly) {
      this.registerForm = this.fb.group({
        active: [{ value: null, disabled: true }, []],
        deleted: [{ value: null, disabled: true }, []],
        hoa: [{ value: null, disabled: true }, []],
        insurance: [{ value: null, disabled: true }, []],
        interest: [{ value: null, disabled: true }, []],
        loanAmount: [{ value: null, disabled: true }, []],
        loanTerm: [{ value: null, disabled: true }, []],
        loanType: [{ value: null, disabled: true }, []],
        location: [{ value: null, disabled: true }, []],
        ltv: [{ value: null, disabled: true }, []],
        maxPay: [{ value: null, disabled: true }, []],
        mi: [{ value: null, disabled: true }, []],
        price: [{ value: null, disabled: true }, []],
        taxes: [{ value: null, disabled: true }, []]
      }
      );

    } else {
      this.registerForm = this.fb.group({
        active: ['', []],
        deleted: ['', []],
        hoa: ['', [Validators.required]],
        insurance: ['', [Validators.required]],
        interest: ['', [Validators.required]],
        loanAmount: ['', [Validators.required]],
        loanTerm: ['', [Validators.required, Validators.min(1)]],
        loanType: ['', [Validators.required]],
        location: ['', [Validators.required]],
        ltv: ['', [Validators.required]],
        maxPay: ['', [Validators.required]],
        mi: ['', [Validators.required]],
        price: ['', [Validators.required]],
        taxes: ['', [Validators.required]]
      }
      );
    }
  }

  goBack() {
    this.letterService.elementSelected = null;
    this.router.navigate(['letters/list']);
  }

  async onCalculateSubmit() {
    const letterConfig: LetterModel = this.registerForm.value;


    let loanAmount = 0;
    const MI = (letterConfig.price * (letterConfig.ltv / 100) * (letterConfig.mi / 100)) / 12;

    if (letterConfig.loanType === "FHA") {
      loanAmount = letterConfig.price * ((letterConfig.ltv / 100) + 0.0175);
    }

    if (letterConfig.loanType === "Conventional") {
      loanAmount = letterConfig.price * (letterConfig.ltv / 100);
    }

    loanAmount = Math.ceil(loanAmount);

    const primaryPay = this.calculateMonthlyPayment(letterConfig.loanAmount, letterConfig.loanTerm, letterConfig.interest);
    let maxPay = this.maxPaid(primaryPay, letterConfig.taxes, letterConfig.insurance, letterConfig.hoa, MI);

    maxPay = Math.ceil(maxPay);


    if (maxPay <= letterConfig.maxPay) {
      this.state = 'Aproved';
      this.maxpay = maxPay;
    } else {
      this.state = 'Not Approved';
      this.maxpay = null;
    }

  }

  public calculateMonthlyPayment(loanAmount: number, termInMonths: number, interestRate: number): number {
    // Convert interest rate into a decimal
    // eg. 6.5% = 0.065
    interestRate /= 100.0;

    // Monthly interest rate
    // is the yearly rate divided by 12
    const monthlyRate = interestRate / 12.0;

    // Calculate the monthly payment
    // Typically this formula is provided so
    // we won't go into the details
    const monthlyPayment = -((loanAmount) * ((monthlyRate * (Math.pow(1 + monthlyRate, termInMonths)))
      / (1 - Math.pow(1 + monthlyRate, termInMonths))));

    return monthlyPayment;
  }

  public maxPaid(primaryPay: number, taxes: number, insurance: number, hoa: number, mi: number): number {
    const maxPay = primaryPay + taxes + insurance + hoa + mi;
    return maxPay;
  }

  ngOnDestroy() {
    this.letterService.elementSelected = null;
    this.subscriptions.forEach(
      (subscription) => subscription.unsubscribe());
  }



  //////////////////////////////////////////


  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our client
    if ((value || '').trim()) {
      this.clients.push({ name: value.trim() });
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(client: Client): void {
    const index = this.clients.indexOf(client);

    if (index >= 0) {
      this.clients.splice(index, 1);
    }
  }



}
