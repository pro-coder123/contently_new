import {Component, Inject, OnInit, } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {LoginComponent} from "../../login/login.component";

@Component({
  selector: 'app-add-new-section',
  templateUrl: './add-new-section.component.html',
  styleUrls: ['./add-new-section.component.css']
})
export class AddNewSectionComponent implements OnInit {

  constructor(
              public dialogRef: MatDialogRef<AddNewSectionComponent>,
              @Inject(MAT_DIALOG_DATA)public data: String,
              public router: Router,
              public dialog: MatDialog,) { }

  ngOnInit() {
    if (!localStorage.getItem('token')) {
      this.router.navigate(['/index']).then(
        () => {
          this.dialog.open(LoginComponent);
        }
      );
    }
  }
}
