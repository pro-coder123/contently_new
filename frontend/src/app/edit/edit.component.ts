import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, FormGroup} from '@angular/forms';
import {BookFetchService} from '../bookFetch.service';
import {Book} from '../book-create/book';
import {Commit} from '../book-create/commit';
import {formatDate} from '@angular/common';
import {LoginComponent} from "../login/login.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  public book: Book;
  public fileName: string;
  public editorForm: FormGroup;
  public editorStyle = {
    height: '400px',
    backgroundColor: 'white',
  };

  constructor(public router: Router,
              public bookFetch: BookFetchService,
              public route: ActivatedRoute,
              public dialog: MatDialog,
  ) {
    if (!localStorage.getItem('token')) {
      this.router.navigate(['/index']).then(
        () => {
          this.dialog.open(LoginComponent);
        }
      );
    }
    this.route.params.subscribe(params => {
      // tslint:disable-next-line: no-string-literal
      this.fileName = params['fileName'];
    });
  }

  ngOnInit() {
    this.editorForm = new FormGroup({
      editor: new FormControl()
    });
    console.log('editing filename: ', this.fileName);
    this.bookFetch.getGit(JSON.parse(localStorage.getItem('book')).id, this.fileName)
      .subscribe(
        data => {
          this.book = new Book(data.name, data.sha, atob(data.content));
          console.log(this.book);
          this.editorForm = new FormGroup({
            editor: new FormControl(this.book.content)
          });
        }
      );

  }

  onSubmit() {
    console.log(this.editorForm.get('editor').value);
    const content = btoa(this.editorForm.get('editor').value);
    const commit = new Commit(formatDate(new Date(), 'dd/MM/yyyy HH:mm:ss', 'en'),
      localStorage.getItem('fullName'), localStorage.getItem('email'), this.book.sha, content);
    this.bookFetch.createFile(this.fileName, commit)
      .subscribe(
        data => {
          console.log(data);
          this.router.navigate(['content-layout']).then();
        },
        error => {
          console.log(error);
        }
      );
  }

  back() {
    this.router.navigate(['content-layout']).then();
  }
}

