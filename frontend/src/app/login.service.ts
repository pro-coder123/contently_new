import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {user} from './user';
import {userReg} from './userReg';
import {profile} from './profile';
import {Observable} from 'rxjs';
import {environment} from '../environments/environment';




@Injectable({
  providedIn: 'root'
})
export class LoginService {
  public role: string;

  constructor(private http: HttpClient) {
  }

  authenticateUser(checkUser: user): Observable<HttpResponse<any>> {
    const postUrl = `${environment.backBaseUrl}user-management/api/v1/user/login`;
    return this.http.post(postUrl, checkUser, {observe: 'response'});
  }

  registerUser(regUser: userReg): any {
    const postUrl = `${environment.backBaseUrl}user-management/api/v1/user/register`;
    return this.http.post(postUrl, regUser);
  }

  updateUser(regUser: userReg): any {
    const header = {
        Authorization: 'Batman ' + localStorage.getItem('token')
      };
    const httpOptions = {
        headers: header
      };
    const postUrl = `${environment.backBaseUrl}user-management/api/v1/user/update`;
    return this.http.put(postUrl, regUser, httpOptions);
  }

  saveInterests(saveProfile: profile): any {
    const header = {
      Authorization: 'Batman ' + localStorage.getItem('token')
    };
    const httpOptions = {
      headers: header
    };
    const postUrl = `${environment.backBaseUrl}profile-service/api/v1/profile/update`;
    return this.http.put(postUrl, saveProfile, httpOptions);
  }

  getUser(): Observable<any> {
    const header = {
      Authorization: 'Batman ' + localStorage.getItem('token')
    };
    const httpOptions = {
      headers: header
    };
    const postUrl = `${environment.backBaseUrl}user-management/api/v1/user/${localStorage.getItem('username')}`;
    return this.http.get(postUrl, httpOptions);
  }
}
