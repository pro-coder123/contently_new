import { Component, OnInit , Input} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {BookFetchService} from '../bookFetch.service';
import {Router} from '@angular/router';


@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit {
  public search;
  public searchBooks: [];
  public noResults = false;

  constructor(
    public route: ActivatedRoute, public bookFetch: BookFetchService, public router: Router
  ) { }

  ngOnInit() {
    this.search = this.route.snapshot.paramMap.get('search');
    this.bookFetch.searchBooks(this.search)
      .subscribe(
        result => {
          this.searchBooks = result;
          console.log(this.searchBooks);
          if(this.searchBooks.length === 0){
            console.log('no results');
            this.noResults = true;
          }
        },
        error => {
          console.log('error: ', error);
        }
      );

  }

  bookDetails(id) {
    localStorage.setItem('bookId', id);
    this.router.navigate(['/book-details']).then();
  }

}
