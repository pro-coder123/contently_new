import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";
import {HomeComponent} from './home/home.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {RegistrationComponent} from './registration/registration.component';
import {EditComponent} from "./edit/edit.component";
import {BookdetailsComponent} from "./bookdetails/bookdetails.component";
import {ContentLayoutComponent} from './content-layout/content-layout.component';
import {BookCreateComponent} from './book-create/book-create.component';
import {PageAfterLoginComponent} from './page-after-login/page-after-login.component';
import {EditProfileComponent} from './edit-profile/edit-profile.component';
import {PaymentComponent} from './payment/payment.component';
import {SearchResultsComponent} from './search-results/search-results.component';
import {TeamComponent} from "./team/team.component";

const routes: Routes = [
  {path: '', redirectTo: '/index', pathMatch: 'full'},
  {path: 'index', component: HomeComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'register', component: RegistrationComponent},
  {path: 'edit/:fileName', component: EditComponent},
  {path: 'book-details', component: BookdetailsComponent},
  {path: 'create-content', component: ContentLayoutComponent},
  {path: 'content-layout', component: BookCreateComponent},
  {path: 'home', component: PageAfterLoginComponent},
  {path: 'edit-profile', component: EditProfileComponent},
  {path: 'pay', component: PaymentComponent},
  {path: 'search/:search', component: SearchResultsComponent},
  {path: 'team', component: TeamComponent},
  {path: '**', component: HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

export const routingComponents = [HomeComponent, DashboardComponent, RegistrationComponent, SearchResultsComponent];
