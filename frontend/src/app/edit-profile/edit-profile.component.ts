import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import {interest} from '../interest';
import {genre} from '../genre';
import {profile} from '../profile';
import {LoginService} from '../login.service';
import {Router} from '@angular/router';
import {userReg} from '../userReg';
import {MatAutocomplete, MatAutocompleteSelectedEvent, MatChipInputEvent} from '@angular/material';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Observable} from 'rxjs';
import {startWith, map} from 'rxjs/operators';
import {LoginComponent} from "../login/login.component";
import {MatDialog} from "@angular/material/dialog";


@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  public username;
  public gender;
  isLinear = false;
  public interestsBoolean = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  public genres: string[] = [];
  public allGenres: string[] = ['Horror', 'Thriller', 'Romance', 'Comedy'];

  public $profile = new profile();
  public $fictionInterest = new interest();
  public $nonFictionInterest = new interest();
  public $genre: genre;
  public updateStatus = false;
  public profileData;

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  // fruitCtrl = new FormControl();


  // @ViewChild('fruitInput', {static: false}) fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('genreInput', {static: false}) genreInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', {static: false}) matAutocomplete: MatAutocomplete;

  public fictionGenres = ['classic', 'comic', 'contemporary', 'crime', 'detective', 'fable', 'fairy tale',
    'fan fiction', 'fantasy', 'folk tale', 'historical fiction', 'horror', 'humor', 'legend', 'magical realism',
    'meta fiction', 'mystery', 'mythology', 'mythopoeia', 'picture book', 'realistic fiction', 'romance', 'science fiction',
    'short story', 'suspense', 'swashbuckler', 'tall tale', 'theoretical fiction', 'thriller', 'western'];
  public nonFictionGenres = ['essay', 'journalism', 'lab report', 'memoir', 'narrative nonfiction',
    'owner\'s manual', 'personal narrative', 'reference book', 'speech', 'textbook', 'biography'];
  public genresSelected = [];
  public genresList = [];
  public separatorKeysCodes: number[] = [ENTER, COMMA];
  public filteredGenres: Observable<string[]>;
  public genreFormControl: FormControl;
  public typeSelected: any;
  public maxDate = new Date();

  constructor(
    // tslint:disable-next-line: variable-name
    public _formBuilder: FormBuilder,
    // tslint:disable-next-line: variable-name
    public _loginService: LoginService,
    // tslint:disable-next-line: variable-name
    public _router: Router,
    public dialog: MatDialog
  ) {
    // if (!localStorage.getItem('token')) {
    //   this._router.navigate(['/index']).then();
    // }
    this.genreFormControl = new FormControl();
    if (!localStorage.getItem('token')) {
      this._router.navigate(['/index']).then(
        () => {
          this.dialog.open(LoginComponent);
        }
      );
    }
  }

  ngOnInit() {
    this.profileData = JSON.parse(localStorage.getItem('editProfile'));
    console.log(this.profileData);
    if (this.profileData) {
      console.log(this.changeDateFormat(this.profileData.dob));
      this.username = this.profileData.username;
      this.firstFormGroup = this._formBuilder.group({
        firstName: [this.profileData.firstName, Validators.required],
        lastName: [this.profileData.lastName],
        email: [this.profileData.email],
        contact: [this.profileData.phoneNumber],
        address1: [this.profileData.addressLine1],
        address2: [this.profileData.addressLine2],
        address3: [this.profileData.addressLine3],
        nationality: [this.profileData.nationality, Validators.required],
        gender: [this.profileData.gender, Validators.required],
        date: [new Date(this.changeDateFormat(this.profileData.dob)), Validators.required]
      });

      this.secondFormGroup = this._formBuilder.group({
        secondCtrl: ['', Validators.required]
      });
    } else {

      this.username = localStorage.getItem('username');
      console.log(this.username);
      this.firstFormGroup = this._formBuilder.group({
        firstName: [],
        lastName: [],
        email: [],
        contact: [],
        address1: [],
        address2: [],
        address3: [],
        nationality: ['', Validators.required],
        gender: ['', Validators.required],
        date: ['', Validators.required]
      });
      this.secondFormGroup = this._formBuilder.group({
        secondCtrl: ['', Validators.required]
      });
    }

    // this.$profile.interest = new Array();
    // this.$interest = new interest();
    // this.$interest.name = 'Novel';
    // this.$interest.genre = [];
    // console.log(this.$interest.name);
    // this.$profile.interest.push(this.$interest);

    this.filteredGenres = this.genreFormControl.valueChanges.pipe(
      startWith(null),
      // tslint:disable-next-line: no-shadowed-variable
      map((genre: string | null) => genre ? this._filter(genre) : this.genresList.slice()));
  }

  addPersonalDetails(firstname, lastname, nationality, address1, address2, address3, date, email, contact) {
    console.log('adding personal details');
    console.log(date);
    const regUser: userReg = new userReg();
    regUser.username = this.username;
    regUser.firstName = firstname;
    regUser.lastName = lastname;
    regUser.nationality = nationality;
    regUser.addressLine1 = address1;
    regUser.addressLine2 = address2;
    regUser.addressLine3 = address3;
    regUser.gender = this.gender;
    regUser.dob = date;
    regUser.email = email;
    regUser.phoneNumber = contact;

    this._loginService.updateUser(regUser).subscribe(result => {
      const returnUser = result;
      if (returnUser.id != null) {
        this.updateStatus = true;
        console.log('updated');
      }
    });

    localStorage.removeItem('editProfile');
  }

  // checkValue(event, check) {
  //   this.interestsBoolean = true;
  //   console.log(check);
  //   if (check === false) {
  //     if ((event === 'Biography' || event === 'Autobiography')) {

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
  //     if (event === 'Biography' || event === 'Autobiography') {
  //       this.$interest = new interest();
  //       this.$interest.name = event;
  //       this.$interest.genre = [];
  //       let i;
  //       for (i = 1; i < this.$profile.interest.length; ++i) {
  //         if (this.$profile.interest[i].name === event) {
  //           const remove = this.$profile.interest.splice(i, 1);
  //           console.log(remove);
  //           break;
  //         }
  //       }


  //     } else {
  //       let i;
  //       for (i = 0; i < this.$profile.interest[0].genre.length; i++) {
  //         if (this.$profile.interest[0].genre[i].name === event) {
  //           const remove = this.$profile.interest[0].genre.splice(i, 1);
  //           console.log(remove);
  //           break;
  //         }
  //       }
  //     }
  //   }
  //   console.log(this.$profile);
  // }

  saveInterests() {
    if (this.interestsBoolean) {
      this.$profile.username = this.username;
      this._loginService.saveInterests(this.$profile).subscribe();
      this._router.navigate(['/home']).then();
    }
  }

  // tslint:disable-next-line: no-shadowed-variable
  removeGenre(genre: string) {
    const index = this.genresSelected.indexOf(genre);
    if (index >= 0) {
      this.genresSelected.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent) {
    this.genresSelected.push(event.option.viewValue.toLowerCase());
    this.genreInput.nativeElement.value = '';
    this.genreFormControl.setValue(null);
  }

  add(event: MatChipInputEvent) {
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;
      // Add our fruit
      if ((value || '').trim()) {
        console.log('pushing:', value);
        this.genresSelected.push(value.trim().toLowerCase());
      }
      // Reset the input value
      if (input) {
        input.value = '';
      }
      this.genreFormControl.setValue(null);
    }
  }

  public _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    // tslint:disable-next-line: no-shadowed-variable
    return this.genresList.filter(genre => genre.toLowerCase().indexOf(filterValue) === 0);
  }

  typeChanged() {
    if (this.typeSelected === 'fiction') {
      this.genresList = this.fictionGenres;
    } else {
      this.genresList = this.nonFictionGenres;
    }
    this.filteredGenres = this.genreFormControl.valueChanges
      .pipe(
        startWith(null),
        // tslint:disable-next-line: no-shadowed-variable
        map((genre: string | null) => genre ? this._filter(genre) : this.genresList.slice()));
  }

  saveGenre() {
    this.$fictionInterest.name = 'fiction';
    this.$nonFictionInterest.name = 'nonfiction';
    this.$fictionInterest.genre = [];
    this.$nonFictionInterest.genre = [];
    for (const g of this.genresSelected) {
      if (this.fictionGenres.includes(g)) {
        this.$fictionInterest.genre.push(g);
      } else {
        this.$nonFictionInterest.genre.push(g);
      }
      this.$profile.interest = [];
      this.$profile.interest.push(this.$fictionInterest);
      this.$profile.interest.push(this.$nonFictionInterest);
    }
    console.log(this.$profile);
    if (this.interestsBoolean) {
      this.$profile.username = this.username;
      this._loginService.saveInterests(this.$profile).subscribe(
        data => {
          if (!localStorage.getItem('role')) {
            console.log('ROlE FOUND');
            localStorage.clear();
            this._router.navigate(['']).then();
          }
        }
      );

      this._router.navigate(['/home']).then();
    }

  }

  // public _filter(value: string): string[] {
  //   const filterValue = value.toLowerCase();

  //   return this.allGenres.filter(genre => genre.toLowerCase().indexOf(filterValue) === 0);
  // }
  changeDateFormat(date: string) {
    let dateArray = date.split("/");
    let temp = dateArray[0];
    dateArray[0] = dateArray[1];
    dateArray[1] = temp;

    // return dateArray.join("/");
    return dateArray[0] + "/" + dateArray[1] + "/" + dateArray[2];
  }

  getErrorPhone() {
    return this.firstFormGroup.get('contact').hasError('pattern') ? 'Not a valid phone Number' :
      this.firstFormGroup.get('contact').hasError('minLength') ? 'Must be 10 chars' :
        this.firstFormGroup.get('contact').hasError('maxLength') ? 'Not more than 10 chars' : '';
  }

  getErrorEmail() {
    return this.firstFormGroup.get('email').hasError('pattern') ? 'Not a valid email address' : '';
  }
}
