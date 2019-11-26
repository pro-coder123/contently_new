import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {LoginService} from '../login.service';
import {ContentService} from '../content.service';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import $ from 'jquery';
import {MatSnackBar} from '@angular/material/snack-bar';
import {bool} from 'aws-sdk/clients/signer';
import {environment} from '../../environments/environment';
import {LoginComponent} from "../login/login.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public profileData;
  public contentsList;
  public booksList = [];
  public profileLoaded = false;
  public contentsLoaded = false;
  public booksLoaded = false;
  public serverUrl = environment.backBaseUrl + 'socket';
  public stompClient;
  public publishedList;
  public purchaseList;
  public completePurchaseList = [];

  constructor(
    public router: Router,
    public login: LoginService,
    // tslint:disable-next-line: variable-name
    public _snackBar: MatSnackBar,
    public contentService: ContentService,
    public dialog: MatDialog,) {
    if (!localStorage.getItem('token')) {
      this.router.navigate(['/index']).then(
        () => {
          this.dialog.open(LoginComponent);
        }
      );
    }
    this.initializeWebSocketConnection();
  }

  initializeWebSocketConnection() {
    const ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    const that = this;
    this.stompClient.connect({}, (frame) => {
      that.stompClient.subscribe('/user/' + localStorage.getItem('username') + '/notif', (message) => {
        if (message.body) {
          this._snackBar.open(message.body, 'close', {
            duration: 3000,
          });

        }
      });
    });
  }

  ngOnInit() {
    this.login.getUser()
      .subscribe(
        data => {
          console.log('Profile data: ', data);
          this.profileData = data;
          this.profileLoaded = true;
        },
        error => {
          console.log('Profile error: ', error);
        }
      );
    this.contentService.getBooks()
      .subscribe(
        data => {
          console.log('Content All Books data: ', data);
          this.contentsList = data;
          this.contentsLoaded = true;
          // // this chunk has to removed after publication service is ready
          // console.log(this.contentsList[0]);
          // this.booksList.push(
          //   {
          //     this.contentsList[0],
          //     noOfPurchases: 23,
          //   }
          // );
          // console.log('books', this.booksList[0]);
        },
        error => {
          console.log('Content All Books error: ', error);
        }
      );

    this.getPublishedBooks();
    this.getPurchasedBooks();
  }

  edit(i: number) {
    console.log(this.contentsList[i]);
    localStorage.setItem('book', JSON.stringify(this.contentsList[i]));
    this.router.navigate(['content-layout']).then();
  }

  ifAuthor(): boolean {
    return localStorage.getItem('role') === 'reader/author';
  }

  editProfile() {
    localStorage.setItem('editProfile', JSON.stringify(this.profileData));
    this.router.navigate(['edit-profile']).then();
  }
  ifConfirmed(status: string): boolean {
    return status === 'confirmed';
  }

  getPublishedBooks() {
    this.contentService.getPublishedBooks().subscribe(
      result => {
        this.publishedList = result;
        console.log(result);
      }
    );
  }

  getPurchasedBooks() {
    this.contentService.getPurchasedBooks().subscribe(
      result => {
        this.purchaseList = result;
        for(let p of this.purchaseList){
          this.contentService.getBookDetailPage(p.book_id).subscribe(
            // tslint:disable-next-line: no-shadowed-variable
            result => this.completePurchaseList.push(result)
          )
        }
      }
    );
  }

  goToBook(id) {
    localStorage.setItem('bookId', id);
    this.router.navigate(['/book-details']).then();
  }

}
