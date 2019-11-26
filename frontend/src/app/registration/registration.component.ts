import {Component, OnInit} from '@angular/core';
import {LoginService} from '../login.service';
import {userReg} from '../userReg';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {FormGroup, FormBuilder, Validators, FormControl, FormGroupDirective, NgForm} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlattener, MatTreeFlatDataSource, MatSnackBar} from '@angular/material';
import {profile} from '../profile';
import {interest} from '../interest';
import {genre} from '../genre';
import {user} from '../user';
import {Router} from '@angular/router';

interface FoodNode {
  name: string;
  children?: FoodNode[];
}

const TREE_DATA: FoodNode[] = [
  {
    name: 'Novel',
    children: [
      {name: 'Thriller'},
      {name: 'Horror'},
      {name: 'Romance'},
    ]
  }, {
    name: 'Biography'
  }, {
    name: 'Autobiography'
  }
];

/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

export class MyErrorStateMatcher implements ErrorStateMatcher {

  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

    return (invalidCtrl || invalidParent);
  }
}

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  public interestsBoolean = true;
  public registerv = false;
  public $profile = new profile();

  public $interest: interest;
  public $genre: genre;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  checkusername: string;
  matcher = new MyErrorStateMatcher();
  public remove;
  public gender = 'Female';
  public usernameAlreadyExists = false;
  // tslint:disable-next-line: max-line-length
  emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  MOBILE_PATTERN:RegExp = /^[6-9]\d{9}$/;

  public _transformer = (node: FoodNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
    };
  };

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
    this._transformer, node => node.level, node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(
    public _loginService: LoginService,
    public _formBuilder: FormBuilder,
    public _router: Router,
    public _snackBar: MatSnackBar
  ) {
    this.dataSource.data = TREE_DATA;

  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  ngOnInit() {
    this.registerv = false;
    this.firstFormGroup = this._formBuilder.group({
      email: ['', [Validators.pattern(this.emailregex), Validators.required]],
      username: ['', [Validators.pattern(/^[A-Za-z0-9]+(?:[_-][A-Za-z0-9]+)*$/), Validators.required]],
      contact: ['', [Validators.pattern(this.MOBILE_PATTERN),Validators.minLength(10), Validators.maxLength(10), Validators.required]],
      password: ['', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]],
      confirmPassword: [''],
    }, {validator: this.checkPasswords});


    // this.$profile.interest = new Array();
    // this.$interest = new interest();
    // this.$interest.name = "Novel";
    // this.$interest.genre = [];
    // console.log(this.$interest.name);
    // this.$profile.interest.push(this.$interest);
  }

  public returnUser: any;

  public register(username, password) {
    console.log(username);
    if (username === '' || password === '') {
      this._snackBar.open("Fill Your Details", "close", {
        duration: 2000,
      });
    } else {
    const regUser: userReg = new userReg();
    regUser.username = username;
    regUser.password = password;
    this._loginService.registerUser(regUser).subscribe(result => {
      this.returnUser = result;
      if (this.returnUser.id != null) {
        this.registerv = true;
        localStorage.setItem('username', username);
        const newUser: user = new user();
        newUser.username = username;
        newUser.password = password;
        this._loginService.authenticateUser(newUser).subscribe(
          // tslint:disable-next-line: no-shadowed-variable
          result => {
            localStorage.setItem('token', result.body.authResponse);
            this._router.navigate(['edit-profile']).then();
          }
        );
      }
   },
   (error) => {
     if(error.error == "Username Already Exists"){
       console.log(error.error);
       this.usernameAlreadyExists = true;
       this._snackBar.open("Username Already Exists", "close", {
        duration: 2000,
      });
     }

   }
   );
  }
  }

  public addPersonalDetails(username, password, email, contact, firstname, lastname, nationality, address1, address2, address3, date) {
    console.log(date);
    const regUser: userReg = new userReg();
    regUser.username = username;
    regUser.password = password;
    regUser.email = email;
    regUser.phoneNumber = contact;
    regUser.firstName = firstname;
    regUser.lastName = lastname;
    regUser.nationality = nationality;
    regUser.addressLine1 = address1;
    regUser.addressLine2 = address2;
    regUser.addressLine3 = address3;
    regUser.gender = this.gender;
    regUser.dob = date;
    this._loginService.updateUser(regUser).subscribe(result => {
      this.returnUser = result;
      if (this.returnUser.id != null) {
        this.registerv = true;
      }
    });

  }

  // checkValue(event, check) {
  //   this.interestsBoolean = true;
  //   console.log(check);
  //   if (check == false) {
  //     if ((event == "Biography" || event == "Autobiography")) {

  //       this.$interest = new interest();
  //       this.$interest.name = event;
  //       this.$interest.genre = [];
  //       console.log(this.$interest.name);
  //       this.$profile.interest.push(this.$interest);

  //     } else {

  //       this.$genre = new genre();
  //       this.$genre.name = event;
  //       this.$profile.interest[0].genre.push(this.$genre);

  //     }
  //   } else {
  //     if (event == "Biography" || event == "Autobiography") {
  //       this.$interest = new interest();
  //       this.$interest.name = event;
  //       this.$interest.genre = [];
  //       let i;
  //       for (i = 1; i < this.$profile.interest.length; ++i) {
  //         if (this.$profile.interest[i].name == event) {
  //           this.remove = this.$profile.interest.splice(i, 1);
  //           console.log(this.remove);
  //           break;
  //         }
  //       }

  //     } else {
  //       let i;
  //       for (i = 0; i < this.$profile.interest[0].genre.length; i++) {
  //         if (this.$profile.interest[0].genre[i].name == event) {
  //           this.remove = this.$profile.interest[0].genre.splice(i, 1);
  //           console.log(this.remove);
  //           break;
  //         }
  //       }
  //     }
  //   }
  //   console.log(this.$profile);
  // }

  saveInterests(username) {
    if (this.interestsBoolean) {
      this.$profile.username = username;
      this._loginService.saveInterests(this.$profile).subscribe();
      this._router.navigate(['/index']).then();
    }

  }

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    let pass = group.controls.password.value;
    let confirmPass = group.controls.confirmPassword.value;
    return pass === confirmPass ? null : {notSame: true};
  }

  getErrorPhone() {
    return this.firstFormGroup.get('contact').hasError('pattern') ? 'Not a valid phone Number' :
      this.firstFormGroup.get('contact').hasError('minLength') ? 'Must be 10 chars' :
      this.firstFormGroup.get('contact').hasError('maxLength') ? 'Not more than 10 chars' : '';
  }

  getErrorEmail() {
    return this.firstFormGroup.get('email').hasError('pattern') ? 'Not a valid email address' : '';
  }

  // getUsernameAlreadyExists(){
  //   if (this.usernameAlreadyExists) {
  //     return 'Username Already Exists';
  //   } else {
  //     return null;
  //   }
  // }

}
