import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Router} from "@angular/router";
import {LoginComponent} from "../../login/login.component";

@Component({
  selector: 'app-new-issue',
  templateUrl: './new-issue.component.html',
  styleUrls: ['./new-issue.component.css']
})
export class NewIssueComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<NewIssueComponent>,
              @Inject(MAT_DIALOG_DATA)public data: string,
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
