import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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

  tabIndex: number = 0;

  public subscriptions: Array<Subscription> = [];

  public allUsersListData: Array<UserModel> = [];

  public loanListData: Array<UserModel> = [];
  public realtorListData: Array<UserModel> = [];
  public clientListData: Array<UserModel> = [];
  public viewerListData: Array<UserModel> = [];

  //common
  dtOptions: DataTables.Settings = {};
  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;
  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;

  //loan
  public tblDataLoan: UserModel[] = [];
  public dtTriggerLoan: Subject<any> = new Subject();


  //realtor
  public tblDataRealtor: UserModel[] = [];
  public dtTriggerRealtor: Subject<any> = new Subject();

  //client
  public tblDataClient: UserModel[] = [];
  public dtTriggerClient: Subject<any> = new Subject();

  //viewer
  public tblDataViewer: UserModel[] = [];
  public dtTriggerViewer: Subject<any> = new Subject();

  //viewer
  public tblDataAdministrators: UserModel[] = [];
  public dtTriggerAdministrators: Subject<any> = new Subject();

  constructor(
    private userService: UserService,
    private sharedService: SharedService,
    private router: Router,
    private modalService: ModalService,
    private loadingService: LoadingService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const ver = this.route.snapshot.paramMap.get('tabIndex');
    if (ver) {
      this.tabIndex = Number(ver);
    }
    sessionStorage.setItem('title', 'Users');
    this.loadData();
  }

  loadData() {
    this.loadingService.show();
    this.subscriptions.push(this.userService.getUserList().subscribe(async data => {
      this.loadingService.hide();
      this.allUsersListData = data;

      this.initializeLoanTable();
      this.initializeRealtorTable();
      this.initializeClientTable();
      this.initializeViewerTable();
      this.initializeAdministratorsTable();
    }, async err => {
      this.loadingService.hide();
      const modalResult = await this.modalService.open({ genericType: 'error-gen' });
      if (modalResult) {
        this.loadData();
      }
    }));
  }

  async initializeLoanTable() {
    this.dtOptions = this.getDtOptions();

    this.loanListData = this.allUsersListData.filter(x => x.profileCode === "LOAN");
    this.tblDataLoan = this.loanListData;

    const dtInstance = await this.dtElement.dtInstance;
    if (dtInstance) {
      dtInstance.destroy();
    }
    this.dtTriggerLoan.next();
  }

  async initializeRealtorTable() {
    this.dtOptions = this.getDtOptions();

    this.realtorListData = this.allUsersListData.filter(x => x.profileCode === "REALTOR");
    this.tblDataRealtor = this.realtorListData;

    const dtInstance = await this.dtElement.dtInstance;
    if (dtInstance) {
      dtInstance.destroy();
    }
    this.dtTriggerRealtor.next();
  }

  async initializeClientTable() {
    this.dtOptions = this.getDtOptions();

    this.clientListData = this.allUsersListData.filter(x => x.profileCode === "CLIENT");
    this.tblDataClient = this.clientListData;

    const dtInstance = await this.dtElement.dtInstance;
    if (dtInstance) {
      dtInstance.destroy();
    }
    this.dtTriggerClient.next();
  }

  async initializeViewerTable() {
    this.dtOptions = this.getDtOptions();

    this.viewerListData = this.allUsersListData.filter(x => x.profileCode != "REALTOR" && x.profileCode != "LOAN"  && x.profileCode != "ADMINISTRATOR");
    this.tblDataViewer = this.viewerListData;

    const dtInstance = await this.dtElement.dtInstance;
    if (dtInstance) {
      dtInstance.destroy();
    }
    this.dtTriggerViewer.next();
  }

  async initializeAdministratorsTable() {
    this.dtOptions = this.getDtOptions();

    this.viewerListData = this.allUsersListData.filter(x => x.profileCode === "ADMINISTRATOR");
    this.tblDataAdministrators = this.viewerListData;

    const dtInstance = await this.dtElement.dtInstance;
    if (dtInstance) {
      dtInstance.destroy();
    }
    this.dtTriggerAdministrators.next();
  }

  redirectToEdit(user: UserModel, type: string) {
    this.userService.userSelected = user;

    if(type === 'loan'){
      this.router.navigate(['/users/add-upd-loan']);
    }else if(type === 'realtor') {
      this.router.navigate(['/users/add-upd-realtor']);
    }else if(type === 'client') {
      this.router.navigate(['/users/add-upd-client']);
    }else if(type === 'viewer') {
      this.router.navigate(['/users/add-upd-user/VIEWER']);
    } else {
      this.router.navigate(['/users/add-upd-user/ADMINISTRATOR']);
    }
    
  }

  async onDelete(userSel: UserModel) {

    const resultModal = await this.modalService.open(
      {
        title: 'Delete User',
        text: `Are you sure you want to delete the user "${userSel.name + ' ' + userSel.lastName }"?`,
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
            text: `The user "${userSel.name + ' ' + userSel.lastName}" was successfully deleted.`,
            icon: 'success',
            showCancelButton: false,
            acceptText: 'Confirm',
            confirmIdentifier: 'btn-AcceptDeleteUser',
          }
        );

        this.loadData();
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
