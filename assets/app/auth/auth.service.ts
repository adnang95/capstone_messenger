import { User } from './user.model';
import { Http, Headers, Response } from '@angular/http';
import 'rxjs/Rx';
import { Observable } from "rxjs";

import { Injectable } from '@angular/core';
import { ErrorService } from "../errors/error.service";
// Injectable helps us inject a service into another service

@Injectable()
export class AuthService {
    constructor(private http: Http, private errorService: ErrorService){

    }

    signup(user: User) {
        const body = JSON.stringify(user);
        const headers = new Headers({'Content-Type':'application/json'});
        return this.http.post('https://meanchat-capstone.herokuapp.com/user', body, {headers: headers})
              .map((response: Response) => response.json())
              .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
              });
    }

    signin(user: User) {
        const body = JSON.stringify(user);
        const headers = new Headers({'Content-Type':'application/json'});
        return this.http.post('https://meanchat-capstone.herokuapp.com/user/signin', body, {headers: headers})
              .map((response: Response) => response.json())
              .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
              });
    }

    logout() {
        localStorage.clear();
    }

    //function for checking if the user is logged in, if the token exists in the local storage
    isLoggedIn() {
        return localStorage.getItem('token') !== null;
    }
}
