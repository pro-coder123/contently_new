import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Commit} from './book-create/commit';
import {environment} from '../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class BookFetchService {

  constructor(private http: HttpClient) {
  }

  // github authorization header
  private headers = {
    Authorization: 'Token 38082b67020bce12020e9587f5b0cae858228b0d'
  };


  // httpOption for github api request
  private httpOptions = {
    headers: this.headers
  };

  createRepo(repoName: string, description: string) {
    const postObject: any = {
      name: repoName,
      description,
      private: true,
      auto_init: true
    };
    console.log('Creating repo: ', repoName);
    return this.http.post<any>(environment.gitBaseUrl + 'user/repos', postObject, this.httpOptions);
  }

  // creates/modifies file: fileName
  createFile(fileName: string, commit: Commit): Observable<any> {
    console.log('create/modify: ', commit);
    const repoName = JSON.parse(localStorage.getItem('book')).id;
    return this.http.put<any>(environment.gitBaseUrl + 'repos/contently-books/' +
      repoName + '/contents/' + fileName, commit, this.httpOptions);
  }

  // get contents of the file : fileName
  getGit(repoName, fileName): Observable<any> {
    console.log('get contents of file: ', fileName);
    return this.http.get<any>(environment.gitBaseUrl + 'repos/contently-books/' +
      repoName + '/contents/' + fileName, this.httpOptions);
  }

  // get list of commits
  getCommit(repoName, fileName): Observable<any> {
    console.log('getCommit(): ', repoName, fileName);
    return this.http.get<any>(environment.gitBaseUrl + 'repos/contently-books/' +
      repoName + '/commits', {
      headers: this.headers,
      params: {
        path: fileName
      }
    });
  }


  searchBooks(searchValue): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.get<any>(environment.backBaseUrl + 'publication-service/api/v1/publications/search/' + searchValue, httpOptions);
  }

  // get single commit content
  getSingleCommit(repoName, fileName, sha) {
    console.log('getCommit(): ', repoName, fileName, sha);
    return this.http.get<any>(environment.gitBaseUrl + 'repos/contently-books/' +
      repoName + '/contents/' + fileName, {
      headers: this.headers,
      params: {
        ref: sha
      }
    });
  }

  // returns all the files in specified github repository
  // getAllFiles(): Observable<any> {
  //   console.log('getAllFiles(): ');
  //   return this.http.get<any>(environment.gitBaseUrl + 'repos/contently-books/' +
  //     this.repository + "/contents", this.httpOptions);
  //
  // }

  getRecommendation(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
        // Authorization: 'Batman ' + localStorage.getItem('token')
      })
    };
    console.log('recommending..');
    return this.http.get<any>(environment.backBaseUrl + 'recommendation-service/api/v1/books/trending', httpOptions);
  }

  saveToPublication(bookDetails): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Batman ' + localStorage.getItem('token')
      })
    };

    console.log('saving to publication' + bookDetails);
    return this.http.post<any>(environment.backBaseUrl + 'publication-service/api/v1/save', bookDetails, httpOptions);

  }

  deleteContent(id) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Batman ' + localStorage.getItem('token')
      })
    };
    const postUrl = `${environment.backBaseUrl}content-service/api/v1/delete/${id}`;
    return this.http.delete<any>(postUrl, httpOptions);
  }

  getRecommendedBooks(username) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Batman ' + localStorage.getItem('token')
      })
    };
    const postUrl = `${environment.backBaseUrl}recommendation-service/api/v1/books/recommendation/${username}`;
    return this.http.get<any>(postUrl, httpOptions);

  }

  uploadToAwsImage(file, id): Observable<any> {

    console.log('save to aws called');

    const testData = new FormData();
    testData.append('file', file);
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Batman ' + localStorage.getItem('token')
      })
    };
    return this.http.post(environment.backBaseUrl + 's3storage-service/api/v1/file/' + id, testData, httpOptions);
  }

  uploadToAws(file, id): Observable<any> {

    console.log('save to aws called');

    const testData = new FormData();
    testData.append('file', file);
    console.log('After');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Batman ' + localStorage.getItem('token')
      })
    };

    return this.http.post(environment.backBaseUrl + 's3storage-service/api/v1/text/' + id, testData, {
      responseType: 'text',
      headers: {
        Authorization: 'Batman ' + localStorage.getItem('token')
      },
    });
  }

  getFromAws(id): Observable<any> {
    console.log('get from aws called');
    return this.http.get(`${environment.backBaseUrl}s3storage-service/api/v1/file/${id}`,
      {
        responseType: 'blob',
        headers: {
          Authorization: 'Batman ' + localStorage.getItem('token'),
          accept: 'application/pdf'
        },
      }
    );
  }
}
