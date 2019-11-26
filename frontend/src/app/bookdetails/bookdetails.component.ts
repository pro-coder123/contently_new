import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ContentService } from '../content.service';
import { BookFetchService } from '../bookFetch.service';
import { FileSaverService } from 'ngx-filesaver';
import { PreviewComponent } from "../book-create/preview/preview.component";
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-bookdetails',
  templateUrl: './bookdetails.component.html',
  styleUrls: ['./bookdetails.component.css']
})
export class BookdetailsComponent implements OnInit {
  public hasPurchased;
  public bookId;
  public bookDetails: any;
  public bookDetailsLoaded;
  public chapterDetailsLoaded;
  public releaseNext;
  public chapterIndex;
  public lastChapter;

  constructor(
    public dialog: MatDialog,
    public route: ActivatedRoute,
    public contentService: ContentService,
    public bookFetch: BookFetchService,
    public fileSaverService: FileSaverService,
    public router: Router
  ) {
  }

  ngOnInit() {
    this.contentService.getBookDetailPage(localStorage.getItem('bookId'))
      .subscribe(
        result => {
          this.bookDetails = result;
          console.log('book-details: ', this.bookDetails);
          if (!localStorage.getItem('token')) {
            this.bookDetailsLoaded = true;
            return;
          }
          this.contentService.getChapterFromProfile(localStorage.getItem('username'), localStorage.getItem('bookId'))
            .subscribe(
              data => {
                console.log('Chapter data: ', data);
                this.releaseNext = data.releaseNext;
                if (data.chapterIndex === result.chapterName.length - 1) {
                  this.lastChapter = true;
                  console.log('last chapter');
                }
                this.chapterIndex = data.chapterIndex;
                this.bookDetailsLoaded = true;
                this.chapterDetailsLoaded = true;
              },
              error => {
                console.log('Chapter error: ', error);
              }
            );
        },
        error => {
          console.log('error', error);
        }
      );
    if (!localStorage.getItem('token')) {
      return;
    }
    this.contentService.getPurchaseStatus(localStorage.getItem('bookId'))
      .subscribe(
        data => {
          console.log('IsPurchased data:', data);
          this.hasPurchased = data;
          // this.hasPurchased = false;
        },
        error => {
          console.log('IsPurchased error', error);
        }
      );
  }

  getHasPurchased(): boolean {
    return this.hasPurchased;
  }

  getReleaseNext(): boolean {
    return this.releaseNext;
  }

  getLastChapter(): boolean {
    return this.lastChapter;
  }

  downloadPdf() {
    // const bookId = 'sample';
    const bookId = localStorage.getItem('bookId');
    const fileName = bookId;
    const fileType = this.fileSaverService.genType(fileName);
    console.log('book id is ' + bookId);
    this.bookFetch.getFromAws(fileName)
      .subscribe(
        data => {
          const blob = new Blob([data], { type: fileType });
          this.fileSaverService.save(blob, fileName + '.pdf');
        }
      );
  }

  goToPayment() {
    if (!localStorage.getItem('token')) {
      const dialogRef = this.dialog.open(LoginComponent);

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
    } else {
      localStorage.setItem('price', this.bookDetails.price);
      this.router.navigate(['/pay']).then();
    }

  }

  preview() {
    this.bookFetch.getGit(this.bookDetails.id, this.bookDetails.chapterName[this.chapterIndex])
      .subscribe(
        data => {
          const dialogRef = this.dialog.open(
            PreviewComponent,
            {
              data: atob(data.content),
              height: '80%',
              width: '80%'
            }
          );
        }
      );
  }

  requestNext() {
    this.contentService.requestChapterFromProfile(localStorage.getItem('username'), localStorage.getItem('bookId'))
      .subscribe(
        data => {
          console.log('Chapter data: ', data);
          this.releaseNext = data.releaseNext;
        },
        error => {
          console.log('Chapter error: ', error);
        }
      );
  }
}
