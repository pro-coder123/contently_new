import {Component, OnInit} from '@angular/core';
import {LoginService} from '../login.service';
import {user} from '../user';
import {Router} from '@angular/router';
import {MatDialogRef} from '@angular/material';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public fail: boolean;
  public loggedInUser: any;
  public tokenObject: any;
  hide: boolean = true;

  constructor(
    public loginService: LoginService,
    public router: Router,
    public dialogRef: MatDialogRef<LoginComponent>
    ) {
  }

  ngOnInit() {
    this.fail = false;
  }

  public authenticate(username, password) {
    console.log('authenticate');
    const checkUser: user = new user();
    checkUser.username = username;
    checkUser.password = password;


    this.loginService.authenticateUser(checkUser)
      .subscribe(
        result => {
          console.log('AUTHENTICATION SUCCESSFUL', result);
          localStorage.setItem('token', result.body.authResponse);
          localStorage.setItem('role', result.body.role);
          localStorage.setItem('username', username);
          this.loginService.getUser()
            .subscribe(
              data => {
                console.log('Getting Full Name');
                localStorage.setItem('fullName', data.firstName);
                localStorage.setItem('email', data.email);
              }
            );
          this.dialogRef.close();
          if (result.body.role === 'reader/author') {
            this.router.navigate(['/home']).then();
          } else {
          this.router.navigate(['/dashboard']).then();
        }
        },
        error => {
          console.log('AUTHENTICATION UNSUCCESSFUL', error);
          this.fail = true;
        }
      );
  }
  register() {
    this.dialogRef.close();
    this.router.navigate(['/register']).then();
  }
}
