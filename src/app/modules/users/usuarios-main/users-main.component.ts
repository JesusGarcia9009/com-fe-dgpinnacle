import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subscription, Subject } from 'rxjs';
import { LoadingService } from '../../core/core/services/loading.service';
import { ModalService } from '../../core/core/services/modal.service';
import { SharedService } from '../../shared/shared.service';
import { UserModel } from '../model/user.model';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-users-main',
  templateUrl: './users-main.component.html',
  styleUrls: ['./users-main.component.css']
})
export class UsersMainComponent implements OnInit, OnDestroy {

  public subscriptions: Array<Subscription> = [];
  public dataTable: DataTableModel;
  public userListData: Array<UserModel> = [];
  dtOptions: DataTables.Settings = {};
  public tblData: UserModel[] = [];
  public dtTrigger: Subject<any> = new Subject();

  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;
  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;

  constructor(
    private userService: UserService,
    private sharedService: SharedService,
    private router: Router,
    private modalService: ModalService,
    private loadingService: LoadingService
  ) { }

  ngOnInit(): void {
    sessionStorage.setItem('title', 'Users');
    this.initializeTable();
  }

  initializeTable() {
    this.loadingService.show();
    this.dtOptions = this.getDtOptions();

    this.subscriptions.push(this.userService.getUserList().subscribe(async data => {
      this.loadingService.hide();
      this.tblData = data;
      this.userListData = data;

      const dtInstance = await this.dtElement.dtInstance;
      if (dtInstance) {
        dtInstance.destroy();
      }
      this.dtTrigger.next();
    }, async err => {
      this.loadingService.hide();
      const modalResult = await this.modalService.open({ genericType: 'error-gen' });
      if (modalResult) {
        this.initializeTable();
      }
    }));

  }

  redirectToEdit(user: UserModel) {
    this.userService.userSelected = user;
    this.router.navigate(['/users/add-upd-user']);
  }

  async onDelete(userSel: UserModel) {

    const resultModal = await this.modalService.open(
      {
        title: 'Delete User',
        text: `Are you sure you want to delete the user "${userSel.names} ${userSel.middleName} ${userSel.lastName}"?`,
        icon: 'warning',
        showCancelButton: true,
        acceptText: 'Confirm',
        confirmIdentifier: 'btn-AcceptDeleteUser',
        cancelText: 'Cancel',
        cancelIdentifier: 'cancel',
      }
    );
    if (resultModal) {
      this.loadingService.show();

      this.subscriptions.push(this.userService.deleteUser(userSel).subscribe(async result => {
        this.loadingService.hide();
        const resultModal = await this.modalService.open(
          {
            title: 'User Deleted',
            text: `The user "${userSel.names} ${userSel.middleName} ${userSel.lastName}" was successfully deleted.`,
            icon: 'success',
            showCancelButton: false,
            acceptText: 'Confirm',
            confirmIdentifier: 'btn-AcceptDeleteUser',
          }
        );

        this.initializeTable();

      }, async err => {
        this.loadingService.hide();
        const modalResult = await this.modalService.open({ genericType: 'error-gen' });
        if (modalResult) {
          this.onDelete(userSel);
        }
      }));

    }
  }

  getDtOptions() {
    const defaultConf = this.sharedService.getDefaultDataTableConfig();
    return {
      pagingType: "full_numbers",
      lengthMenu: [
        [10, 25, 50, -1],
        [10, 25, 50, "All"]
      ],
      aoColumns: [
        null,
        null,
        null,
        null,
        null,
        null,
        { "bSortable": false }
      ],
      responsive: false,
      ...defaultConf
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(
      (subscription) => subscription.unsubscribe());
  }
}
