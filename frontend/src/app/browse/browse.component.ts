import {Component, OnInit, ViewChild, HostListener} from '@angular/core';
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {ContentService} from "../content.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.css']
})
export class BrowseComponent implements OnInit {
  public innerWidth: any;
  public pageEvent: PageEvent = new PageEvent();
  public size = 20;
  public books = [];
  public booksLoaded;
  public bookData: any;
  public noCol = 5;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  constructor(public contentService: ContentService,
              public router: Router) {
  }

  ngOnInit() {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth < 769) {
      this.noCol = 1;
    }
    this.contentService.getAllPublishedBooks()
      .subscribe(
        data => {
          console.log('all books data:', data);
          this.books = data;
          this.bookData = this.books.slice(0, 20);
          this.booksLoaded = true;
        },
        error => {
          console.log('all books error  :', error);
        }
      );
  }

  getCol() {
    console.log('cols caled');
    return this.noCol;
  }

  bookDetails(bookId: any) {
    localStorage.setItem('bookId', bookId);
    this.router.navigate(['book-details']).then();
  }

  pageChanged(event: PageEvent) {
    console.log('event: ', event);
    const start = event.pageIndex * event.pageSize;
    let end = start + event.pageSize;
    if (end > event.length) {
      end = event.length;
    }
    console.log(start, end);
    this.bookData = this.books.slice(start, end);
    console.log(this.bookData);
    return event;
  }

  getBookData() {
    return this.bookData;
  }
}
