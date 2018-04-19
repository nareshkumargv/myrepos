import { Component, OnInit, OnDestroy } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { DialogModule, InputTextModule, PasswordModule, ButtonModule } from 'primeng/primeng';

import { Subscription } from 'rxjs/Subscription';

import { ClientService } from '../services/cntservice.service';

import { IUser } from '../classes/user';
import { ILoginStatus } from '../classes/loginStatus';
import { IAuthentication } from '../classes/authentication';
import { UserService } from '../services/user.service';
import { LoginService } from '../services/login.service';

@Component({
    selector: 'fetchclient',
    templateUrl:'./fetchclient.component.html'
})

export class FetchClientComponent implements OnInit, OnDestroy {
    UserSubscription: Subscription;
    LoginSubscription: Subscription;  
    pageTitle: string = 'Current User';
    user: IUser;
    errorMessage: string;
    ownername: any;

    public cntList: ClientData[];

    constructor(public http: Http, private _router: Router,
        private _userService: UserService,
        private _loginService: LoginService,
        private _clientService: ClientService,
        public fb: FormBuilder)
    {
        this.getClients();
       
    }

    ngOnInit(): void {
        this.user = {
            userName: "[Not Logged In]",
            isLoggedIn: false
        }

        // Subscribe to the UserSubscription Service
        this.UserSubscription = this._userService.getCurrentUser().subscribe(
            user => {
                this.user = user;
                this.ownername = user;
                console.log(this.ownername); 
            },
            error => {
                this.errorMessage = <any>error;
                alert(this.errorMessage);
            });
       

        // Subscribe to the LoginSubscription Service
        this.LoginSubscription = this._loginService.getVisbility().subscribe(
            (visibility: boolean) => {
                if (visibility == false) {
                    // If the Login Dialog is closed
                    // the user may be logged in
                    this.getCurrentUser();
                }
            });

        this.getClientbyID(this.ownername);
    }

    getCurrentUser() {
        // Call the service
        this._userService.getCurrentUser().subscribe(
            user => {
                this.user = user;
                              
            },
            error => {
                this.errorMessage = <any>error;
                alert(this.errorMessage);
            });

    }

    getClients() {
        this._clientService.getClients().subscribe(
            data => this.cntList = data
        )
    } 

    getClientbyID(ownername: any) {
        console.log(ownername);  
    //    var ans = confirm("Do you want to customer with Id: " + ownername);
    //    if (ans) {
    //        this._clientService.getClientById(ownername).subscribe(
    //            data => this.cntList = data
    //        )
    //    }
    //    //this._clientService.getClients().subscribe(
    //    //    data => this.cntList = data
    //    //)
    } 

    delete(cid:any) {
        var ans = confirm("Do you want to delete customer with Id: " + cid);
        if (ans) {
            this._clientService.deleteClient(cid).subscribe((data) => {
                this.getClients();
            }, error => console.error(error))   
        }
    }

    ngOnDestroy(): void { }

}

interface ClientData {
    id: number;
    clientname: string;
    ownername: string;
    ldescription: string;
    estdate: string;
    workexp: number;
    address: string;
    state: string;
    city: string;
    location: string;
    zipcode: string;
    contact1: number;
    contact2: number;
    starttime: string;
    closetime: string;
    emps: number;
    websiteurl: string;
    emailaddress: string;
}