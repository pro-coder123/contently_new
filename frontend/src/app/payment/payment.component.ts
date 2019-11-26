import {Component, OnInit} from '@angular/core';
import {ContentService} from '../content.service';
import {Router} from '@angular/router';
import {LoginComponent} from "../login/login.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  constructor(public contentService: ContentService,
              public router: Router,
              public dialog: MatDialog,) {
  }

  public boook;
  public handler: any;
  public id;
  public price;

  public invalidFeedback: string;

  ngOnInit() {
    if (!localStorage.getItem('token')) {
      this.router.navigate(['/index']).then(
        () => {
          this.dialog.open(LoginComponent);
        }
      );
    }
    this.price = localStorage.getItem('price');
    this.loadStripe();
  }

  chargeCreditCard(num, exp, cvv) {

    const arr = exp.split('/', 2);

    (window as any).Stripe.card.createToken(
      {
        clientId: undefined,
        clientSecret: undefined,
        deviceCode: undefined,
        grantType: undefined,
        number: num,
        exp_month: arr[0],
        exp_year: arr[1],
        cvc: cvv
      }, (status, response) => {
        if (status === 200) {
          const token = response.id;
          this.chargeCard(token);
        } else {
          console.log(response.error.message);
          this.invalidFeedback = response.error.message;
        }
      });
  }


  chargeCard(token: string) {
    // tslint:disable-next-line: radix
    this.contentService.saveToPurchase(parseInt(localStorage.getItem('bookId')), localStorage.getItem('username'))
      .subscribe(
        data => {
          console.log('data from purchase service save: ', data);
          this.router.navigate(['/book-details']).then();
        },
        error => {
          console.log('error from purchase service save: ', error);
        }
      );
  }


  loadStripe() {
    if (!window.document.getElementById('stripe-script')) {
      const s = window.document.createElement('script');
      s.id = 'stripe-script';
      s.type = 'text/javascript';
      s.src = 'https://checkout.stripe.com/checkout.js';
      s.onload = () => {
        this.handler = (window as any).StripeCheckout.configure({
          key: 'pk_test_aeUUjYYcx4XNfKVW60pmHTtI',
          locale: 'auto',
          token(token: any) {
            // You can access the token ID with `token.id`.
            // Get the token ID to your server-side code for use.
            console.log(token);
            console.log('Payment Success!!');
          }
        });
      };
      window.document.body.appendChild(s);
    }
  }
}
