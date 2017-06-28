import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import {Observable} from 'rxjs/Rx';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Storage } from '@ionic/storage';

/*
  Generated class for the SonarServices provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class SonarServices {

  url:string = "https://evosonar.azurewebsites.net";
  access_token: "";
  token_type: "";
  userId: "";
  name: "";
  HAS_LOGGED_IN = 'hasLoggedIn';
  HAS_SEEN_LOGIN= 'hasSeenLogin';


  constructor(public http: Http, public storage: Storage) {

  }

  login(email:string, password:string) : Observable<any>{

    var headers:any = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("ZUMO-API-VERSION", "2.0.0");
    var data_result: any = null;
    return this.http.post(this.url + "/.auth/login", { Email: email, Password: password }, { headers: headers })
        .map((res:Response) => {
          if(res.status < 200 || res.status >= 300) {
            throw new Error('This request has failed ' + res.status);
          }
          else {
            return res.json();
          }
        }, (error:any) => {});
  }

  signUp(body: any): Observable<any>{
      //body.userId = this.userId;
    var headers:any = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Accept", "application/json");
    headers.append("ZUMO-API-VERSION", "2.0.0");
    var data_result:any = null;
    return this.http.post(this.url + "/tables/user", body, {headers : headers})
      .map((res:Response) => {
        if(res.status < 200 || res.status >= 300) {
          throw new Error('This request has failed ' + res.status);
        }
        // If everything went fine, return the response
        else {
          res;
        }
      });
  }

  getAllAddresses() : Observable<any>{
    var headers:any = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Accept", "application/json");
    headers.append("X-ZUMO-AUTH", this.access_token);
    headers.append("ZUMO-API-VERSION", "2.0.0");
    var data_result:any = null;
    return this.http.get(this.url + "/tables/address?userId=" + this.userId, {headers : headers})
      .map((res:Response) => {
        if(res.status < 200 || res.status >= 300) {
          throw new Error('This request has failed ' + res.status);
        }
        // If everything went fine, return the response
        else {
          return res.json();
        }
      });
  }

  registerLogin(response){
    this.HAS_LOGGED_IN = "true";
    this.access_token = response.authenticationToken;
    this.storage.set("access_token", this.access_token);
    this.name = response.name;
    this.userId = response.user.userId;
    this.storage.set("userId", this.userId);
    this.token_type = response.token_type;
    this.storage.set("token_type", this.token_type);
  }

  getLoginInfo() {
    this.storage.ready().then(() => {
      this.storage.get("access_token").then((val) => {
        this.access_token = val;
        this.HAS_LOGGED_IN = "true";
      });
      this.storage.get("token_type").then((val) => {
        this.token_type = val;
      });

      this.storage.get("userId").then((val) => {
        this.userId = val;
      });
    });
  }

  addAddress(body): Observable<any> {
      var headers: any = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append("Accept", "application/json");
      headers.append("X-ZUMO-AUTH", this.access_token);
    headers.append("ZUMO-API-VERSION", "2.0.0");

    var data_result: any = null;
      return this.http.post(this.url + "/tables/address", body, { headers: headers })
          .map((res: Response) => {
              if (res.status < 200 || res.status >= 300) {
                  throw new Error('This request has failed ' + res.status);
              }
              // If everything went fine, return the response
              else {
                  res;
              }
          });
  }

    getRoute(body) : Observable<any> {
        var headers:any = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Accept", "application/json");
      headers.append("ZUMO-API-VERSION", "2.0.0");

      var data_result:any = null;
        return this.http.post(this.url + "/api/route", body, { headers: headers })
            .map((res: Response) => {
                if (res.status < 200 || res.status >= 300) {
                    throw new Error('This request has failed ' + res.status);
                }
                // If everything went fine, return the response
                else {
                    return res.json();
                }
            });
  }
}
