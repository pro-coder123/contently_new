import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../environments/environment';
import {Observable} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class ContentService {
  // httpOptions = {
  //   headers: new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     Authorization: 'Batman ' + localStorage.getItem('token')
  //   })
  // };

  constructor(private http: HttpClient) {
  }

  // used to update item inside content
  saveContent(content) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Batman ' + localStorage.getItem('token')
      })
    };
    const postUrl = environment.backBaseUrl + 'content-service/api/v1/update';
    return this.http.put(postUrl, content, httpOptions);
  }

  getRecommendedEditorsOrIllustrators(role, genre): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Batman ' + localStorage.getItem('token')
      })
    };
    const postUrl = `${environment.backBaseUrl}recommendation-service/api/v1/${role}/${genre}`;
    return this.http.get(postUrl, httpOptions);
  }

  updateEditorOrIllustratorStatus(id, role, status) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Batman ' + localStorage.getItem('token')
      })
    };
    const postUrl = `${environment.backBaseUrl}content-service/api/v1/content/${id}/${role}/${status}`;
    return this.http.put(postUrl, httpOptions);
  }

  getEditorsOrIllustrators(role) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Batman ' + localStorage.getItem('token')
      })
    };
    const postUrl = `${environment.backBaseUrl}profile-service/api/v1/profile/role/${role}`;
    return this.http.get(postUrl, httpOptions);
  }

  // used get details of one content by id
  getBookDetails(id) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Batman ' + localStorage.getItem('token')
      })
    };
    const postUrl = `${environment.backBaseUrl}content-service/api/v1/content/id/${id}`;
    return this.http.get(postUrl, httpOptions);
  }

  getPurchaseStatus(id) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Batman ' + localStorage.getItem('token')
      })
    };
    const postUrl = `${environment.backBaseUrl}purchasing-service/api/v1/book/${id}/${localStorage.getItem('username')}`;
    return this.http.get(postUrl, httpOptions);
  }

  // used to get all contents of 'username'
  getBooks() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Batman ' + localStorage.getItem('token')
      })
    };
    const postUrl = `${environment.backBaseUrl}content-service/api/v1/contents/${localStorage.getItem('username')}`;
    return this.http.get(postUrl, httpOptions);
  }

  // used to save new content
  saveBooks(jsonObj) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Batman ' + localStorage.getItem('token')
      })
    };
    const postUrl = `${environment.backBaseUrl}content-service/api/v1/content`;
    return this.http.post(postUrl, jsonObj, httpOptions);
  }

  recommendedPrice(editorPay, illustratorPay) {
    const book = JSON.parse(localStorage.getItem('book'));
    const myObject = {
      genre: book.genres[0],
      editorPay,
      illustratorPay,
      base: 50,
      noOfWords: +localStorage.getItem('wordCount')
    };
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Batman ' + localStorage.getItem('token')
      })
    };
    const postUrl = `${environment.backBaseUrl}recommendation-service/api/v1/priceRec`;
    return this.http.post(postUrl, myObject, httpOptions);
  }

  getPay(editorName) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Batman ' + localStorage.getItem('token')
      })
    };
    const postUrl = `${environment.backBaseUrl}profile-service/api/v1/profile/username/${editorName}`;
    return this.http.get(postUrl, httpOptions);
  }

  getBookDetailPage(id): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
        // Authorization: 'Batman ' + localStorage.getItem('token')
      })
    };
    const postUrl = `${environment.backBaseUrl}publication-service/api/v1/book/id/${id}`;
    return this.http.get(postUrl, httpOptions);
  }

  saveBookDetails(book) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Batman ' + localStorage.getItem('token')
      })
    };
    const postUrl = `${environment.backBaseUrl}content-service/api/v1/update`;
    return this.http.put(postUrl, book, httpOptions);
  }

  saveToPurchase(bookId: number, username: string): Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Batman ' + localStorage.getItem('token')
      })
    };
    const postUrl = `${environment.backBaseUrl}purchasing-service/api/v1/save`;
    const jsonObject = {
      book_id: bookId,
      username
    };
    return this.http.post(postUrl, jsonObject, httpOptions);
  }

  getChapterFromProfile(username, bookId): Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Batman ' + localStorage.getItem('token')
      })
    };
    const postUrl = `${environment.backBaseUrl}profile-service/api/v1/profile/chapter/${username}/${bookId}`;
    return this.http.get(postUrl, httpOptions);
  }

  requestChapterFromProfile(username, bookId): Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Batman ' + localStorage.getItem('token')
      })
    };
    const postUrl = `${environment.backBaseUrl}profile-service/api/v1/profile/release/${username}/${bookId}`;
    return this.http.post(postUrl, {},  httpOptions);
  }

  getPurchasedBooks() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Batman ' + localStorage.getItem('token')
      })
    };
    const postUrl = `${environment.backBaseUrl}purchasing-service/api/v1/user/${localStorage.getItem('username')}`;
    return this.http.get(postUrl, httpOptions);
  }

  getPublishedBooks() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Batman ' + localStorage.getItem('token')
      })
    };
   
    const postUrl = `${environment.backBaseUrl}publication-service/api/v1/name/${localStorage.getItem('username')}`;
    return this.http.get(postUrl, httpOptions);
  }
  getAllPublishedBooks(): Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Batman ' + localStorage.getItem('token')
      })
    };
    const postUrl = `${environment.backBaseUrl}publication-service/api/v1/publications`;
    return this.http.get(postUrl, httpOptions);
  }
}
