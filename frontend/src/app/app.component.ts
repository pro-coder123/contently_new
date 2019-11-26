import {Component, HostListener, OnInit} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Observable} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';
import {LoginComponent} from './login/login.component';
import {AuthService} from './auth.service';
import {Router} from '@angular/router';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import {MatSnackBar} from '@angular/material';
import {notification} from './notification';
import {NotificationService} from './notification.service';
import {ContentService} from './content.service';
import {environment} from "../environments/environment";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'contently';
  public showNavigationBarLinks = true;
  public TABLET = 768;
  public loggedIn = false;
  public serverUrl = environment.socketUrl;
  public stompClient;
  public notificationList: any;
  public notificationCount;
  public notificationStatusList: notification[] = [];
  public notificationLoaded;
  public book: any;
  public searchValue;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(public breakpointObserver: BreakpointObserver,
              public dialog: MatDialog,
              public authService: AuthService,
              public router: Router,
              public snackBar: MatSnackBar,
              public notificationService: NotificationService,
              public contentService: ContentService) {
    this.showNavigationBarLinks = window.innerWidth > this.TABLET;

  }

  ngOnInit() {
    if (this.authService.isLoggedIn === true) {
      console.log('LOGGED IN');
      this.loggedIn = true;
    }
    this.notificationLoaded = false;
    this.getNotifications();
  }

  @HostListener('window:resize', [])
  onWindowsResize() {
    this.showNavigationBarLinks = window.innerWidth > this.TABLET;
  }

  search(searchValue) {
    this.searchValue = searchValue;
    console.log(this.searchValue);
    this.router.navigate(['/index'])
      .then( () =>
        this.router.navigate(['/search', this.searchValue])
      );

  }


  loadStripe() {
    if (!window.document.getElementById('stripe-script')) {
      const s = window.document.createElement('script');
      s.id = 'stripe-script';
      s.type = 'text/javascript';
      s.src = 'https://checkout.stripe.com/checkout.js';
      window.document.body.appendChild(s);
    }
  }

  onLogin() {
    console.log('Login');
    const dialogRef = this.dialog.open(LoginComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  onLogout() {
    console.log('LOGGED OUT');
    localStorage.clear();
    this.router.navigate(['/index']).then();
  }

  ifToken() {
    if (localStorage.getItem('token')) {
      return true;
    } else {
      return false;
    }
  }

  initializeWebSocketConnection() {
    const ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);
    const that = this;
    this.stompClient.connect({}, (frame) => {
      that.stompClient.subscribe('/user/' + localStorage.getItem('username') + '/notif', (message) => {
        if (message.body) {
          console.log('New Notification');
          this.snackBar.open(message.body, 'close', {
            duration: 2000,
          });
          // tslint:disable-next-line: no-unused-expression
          this.ngOnInit();
        }
      });
    });
  }


  getNotifications() {
    this.notificationService.getNotification(localStorage.getItem('username')).subscribe(
        result => {
          this.notificationList = result;
          this.notificationCount = 0;
          // tslint:disable-next-line: prefer-const
          for (let n of this.notificationList) {
            if (n.status === true) {
              this.notificationCount = this.notificationCount + 1;
            }
          }
          this.notificationLoaded = true;
          // console.log('New Notifications : ', this.notificationCount);
        });
  }
  getNotificationLoaded(): boolean{
    return this.notificationLoaded;
  }

  removeNewNotifications() {
    if(!this.getNotificationLoaded()){
      return;
    }
    // tslint:disable-next-line: prefer-const
    for (let n of this.notificationList) {
      // console.log(n.status);
      if ( n.status === true) {
        this.notificationStatusList.push(n);
      }
    }
    this.notificationService.updateNotifications(this.notificationStatusList).subscribe(this.ngOnInit);
  }

  isAuthor() {
    // tslint:disable-next-line: triple-equals
    if (localStorage.getItem('role') == 'reader/author') {
      return true;
    } else {
      return false;
    }
  }

  // tslint:disable-next-line: no-shadowed-variable
  acceptRequest( notification , index) {
      this.contentService.getBookDetails(notification.bookId).subscribe(
      result => {
      this.book = result;
      // tslint:disable-next-line: max-line-length
      this.sendNotification(notification.sender, notification.bookId, localStorage.getItem('username') + ' has accepted your request to edit your book  ' + this.book.title);
      if (localStorage.getItem('role') === 'editor') {
        this.book.editorStatus = 'confirmed';
      } else {
        this.book.designerStatus = 'confirmed';
      }
      console.log('UPDATED BOOK : ', this.book);
      this.contentService.saveBookDetails(this.book).subscribe();
      });
      this.notificationService.deleteNotification(notification.id).subscribe(
      (result) => this.ngOnInit(),
      (error) => this.ngOnInit()
    );
  }

  // tslint:disable-next-line: no-shadowed-variable
  deleteRequest(notification , index) {
    // tslint:disable-next-line: max-line-length
    this.sendNotification(notification.sender, notification.bookId, localStorage.getItem('username') + ' has rejected your request to edit your book of id : ' + this.book.title);
    this.contentService.getBookDetails(notification.bookId).subscribe(
      result => {
        this.book = result;
        if (localStorage.getItem('role') === 'editor') {
          this.book.editorStatus = 'rejected';
        } else {
          this.book.designerStatus = 'rejected';
        }
        console.log('UPDATED BOOK : ', this.book);
        this.contentService.saveBookDetails(this.book).subscribe();
      });
    this.notificationService.deleteNotification(notification.id).subscribe(
      (result) => this.ngOnInit(),
      (error) => this.ngOnInit()
    );
  }

  sendNotification(receiver, bookId, message) {
    const newNotification: notification = new notification();
    newNotification.sender = localStorage.getItem('username');
    newNotification.receiver = receiver;
    newNotification.message = message;
    newNotification.bookId = bookId;
    newNotification.status = true;
    this.notificationService.sendNotification(newNotification).subscribe();
  }


  ifNotifications() {
    if (this.notificationList) {
    if (Object.keys(this.notificationList).length === 0) {
      return true;
    } else {
      return false;
    }
  }
}


}
