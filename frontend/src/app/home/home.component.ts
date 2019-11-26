import {Component, OnInit} from '@angular/core';
import {BookFetchService} from '../bookFetch.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public bookVar: [];
  constructor(
    // tslint:disable-next-line: variable-name
    public _bookFetch: BookFetchService,
    public router: Router) {
  }

  ngOnInit() {
    this._bookFetch.getRecommendation()
    .subscribe(data => {console.log(data) ; this.bookVar = data; });
  }

  bookDetails(id) {
    localStorage.setItem('bookId', id);
    this.router.navigate(['/book-details']);
  }
}
