import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BookFetchService } from '../bookFetch.service';
import { FormControl, NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContentService } from '../content.service';
import { formatDate } from '@angular/common';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { LoginComponent } from "../login/login.component";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-content-layout',
  templateUrl: './content-layout.component.html',
  styleUrls: ['./content-layout.component.css']
})

export class ContentLayoutComponent implements OnInit {
  visible = true;
  selectable = true;
  fruitCtrl = new FormControl();


  @ViewChild('fruitInput', { static: false }) fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;

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
  newContentFormGroup: FormGroup;

  @ViewChild('genreInput', { static: false }) genreInput: ElementRef<HTMLInputElement>;

  constructor(public http: HttpClient,
    public router: Router,
    public bookFetch: BookFetchService,
    public contentService: ContentService,
    public dialog: MatDialog,
    public _formBuilder: FormBuilder,
    public _snackBar: MatSnackBar) {

    this.genreFormControl = new FormControl();
  }

  ngOnInit() {
    if (!localStorage.getItem('token')) {
      this.router.navigate(['/index']).then(
        () => {
          this.dialog.open(LoginComponent);
        }
      );
    }

    this.newContentFormGroup = this._formBuilder.group({
      title: ['', [Validators.required]],
      genre: ['', [Validators.required]]
    });
    this.filteredGenres = this.fruitCtrl.valueChanges.pipe(
      startWith(null),
      map((genre: string | null) => genre ? this._filter(genre) : this.genresList.slice()));
  }

  onSubmit(input: NgForm) {
    if (input.value.title != null && input.value.type != null && this.genresSelected != null && input.value.selectHelper != null) {
      const jsonObj: any = {
        title: input.value.title,
        description: input.value.desc,
        authorName: localStorage.getItem('username'),
        typeName: input.value.type,
        genres: this.genresSelected,
        createdAt: formatDate(new Date(), 'dd/MM/yyyy HH:mm:ss', 'en'),
        selectHelper: input.value.selectHelper
      };
      localStorage.setItem('selectHelper', input.value.selectHelper);
      console.log('json', jsonObj);
      this.contentService.saveBooks(jsonObj)
        .subscribe(
          data => {
            console.log('Save book data:', data);
            const temp: any = data;
            this.bookFetch.createRepo(temp.id, temp.description)
              .subscribe(
                data2 => {
                  console.log('Create Repo data: ', data2);
                  localStorage.setItem('book', JSON.stringify(data));
                  this.router.navigate(['content-layout']).then();
                },
                error2 => {
                  console.log('Create Repo error', error2);
                }
              );
          },
          error => {
            console.log('Save book error:', error);
          }
        );
    } else {
      this._snackBar.open("Please Make Sure You Filled All The Details", "close", {
        duration: 2000,
      });
    }
  }

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
        map((genre: string | null) => genre ? this._filter(genre) : this.genresList.slice()));
  }

}
