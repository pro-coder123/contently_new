import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Router} from "@angular/router";


@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<PreviewComponent>,
              @Inject(MAT_DIALOG_DATA)public data,
              public router: Router) {
  }

  ngOnInit() {
    console.log(this.data);
    document.getElementById('preview').innerHTML = this.data;
  }

}
