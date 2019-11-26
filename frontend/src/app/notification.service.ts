import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http: HttpClient) {
  }

  sendNotification(notification) {
    const header = {
      Authorization: 'Batman ' + localStorage.getItem('token')
    };
    const httpOptions = {
      headers: header
    };
    const postUrl = `${environment.backBaseUrl}notification/api/send`;
    return this.http.post(postUrl, notification, httpOptions);

  }

  getNotification(username) {
    const header = {
      Authorization: 'Batman ' + localStorage.getItem('token')
    };
    const httpOptions = {
      headers: header
    };
    const postUrl = `${environment.backBaseUrl}notification/api/${username}`;
    return this.http.get(postUrl, httpOptions);

  }

  deleteNotification(id) {
    const header = {
      Authorization: 'Batman ' + localStorage.getItem('token')
    };
    const httpOptions = {
      headers: header
    };
    const postUrl = `${environment.backBaseUrl}notification/api/delete/${id}`;
    return this.http.delete(postUrl, httpOptions);

  }

  updateNotifications(list) {
    const header = {
      Authorization: 'Batman ' + localStorage.getItem('token')
    };
    const httpOptions = {
      headers: header
    };
    const postUrl = `${environment.backBaseUrl}notification/api/update`;
    return this.http.put(postUrl, list, httpOptions);

  }
}
