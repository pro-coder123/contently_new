import {Component, OnInit} from '@angular/core';
import {ContentService} from '../content.service';
import {BookFetchService} from '../bookFetch.service';
import {Router, ActivatedRoute} from '@angular/router';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {formatDate} from '@angular/common';
import {LoginComponent} from "../login/login.component";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-publication-book',
  templateUrl: './publication-book.component.html',
  styleUrls: ['./publication-book.component.css']
})
export class PublicationBookComponent implements OnInit {

  // tslint:disable-next-line: variable-name
  public recommended_price;
  public editorPay;
  public illustratorPay;
  public book;
  public setPriceFormGroup: FormGroup;

  constructor(public contentService: ContentService,
              public bookFetch: BookFetchService,
              public router: Router,
              public dialogRef: MatDialogRef<PublicationBookComponent>,
              public dialog: MatDialog,
              public formBuilder: FormBuilder
  ) {
  }

  ngOnInit() {
    if (!localStorage.getItem('token')) {
      this.router.navigate(['/index']).then(
        () => {
          this.dialog.open(LoginComponent);
        }
      );
    }
    this.setPriceFormGroup = this.formBuilder.group({
      price : ['', Validators.required]
    });
    let cond1 = false;
    let cond2 = false;
    this.book = JSON.parse(localStorage.getItem('book'));
    console.log('hello:', this.book);

    if (this.book.editorName === null) {
      this.editorPay = 0;
      cond1 = true;
    } else {
      this.contentService.getPay(this.book.editorName)
        .subscribe(
          result => {
            console.log('pay', result);
            this.editorPay = result;
            cond1 = true;
          }
        );
    }
    if (this.book.designerName === null) {
      this.illustratorPay = 0;
      cond2 = true;
    } else {
      this.contentService.getPay(this.book.designerName)
        .subscribe(
          result => {
            this.illustratorPay = result;
            cond2 = true;
          }
        );
    }
    console.log(cond1, cond2);
    console.log(cond1 && cond2);

    console.log(cond1 && cond2);
    setTimeout(() => {
      console.log('condition: ', cond1 && cond2);
      this.contentService.recommendedPrice(this.editorPay, this.illustratorPay)
        .subscribe(
          result => {
            this.recommended_price = result;
            console.log('price result', result);
          }
        );
    }, 3000);

  }

  savePublication(price) {
    const chapters = [];
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.book.status.length; i++) {
      chapters.push(this.book.status[i].chapterName);
    }
    delete this.book.status;
    delete this.book.selectHelper;
    delete this.book.editorStatus;
    delete this.book.designerStatus;
    delete this.book.createdAt;
    this.book.publishedAt = formatDate(new Date(), 'dd/MM/yyyy', 'en');
    this.book.price = price;
    this.book.chapterName = chapters;

    console.log('Object to be saved to publication service: ', this.book);

    this.bookFetch.saveToPublication(this.book).subscribe(
      data => {
        console.log('save to publication data: ', data);
        this.bookFetch.deleteContent(this.book.id)
          .subscribe(
            data => {
              this.dialogRef.close();
              this.contentService.saveToPurchase(this.book.id, localStorage.getItem('username')).subscribe();
              if (this.book.editorName !== null) {
                this.contentService.saveToPurchase(this.book.id, this.book.editorName).subscribe();
              }
              if (this.book.designerName !== null) {
                this.contentService.saveToPurchase(this.book.id, this.book.designerName).subscribe();
              }
              this.router.navigate(['/dashboard']).then();
            }
          );
      },
      error => {
        console.log('save to publication error: ', error);
      }
    );
  }
}
