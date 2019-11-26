import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {BookFetchService} from '../../bookFetch.service';
import {NgForm} from '@angular/forms';
import {Commit} from '../../book-create/commit';
import {formatDate} from '@angular/common';
import {Issue} from '../issue';
import {Reply} from '../reply';
import {Router} from "@angular/router";
import {LoginComponent} from "../../login/login.component";

@Component({
  selector: 'app-reply',
  templateUrl: './reply.component.html',
  styleUrls: ['./reply.component.css']
})
export class ReplyComponent implements OnInit {

  public issueFile;
  public issue: Issue;
  public issueList: Issue[];
  public replyList: Reply[];
  constructor(public dialogRef: MatDialogRef<ReplyComponent>,
              @Inject(MAT_DIALOG_DATA)public data: any,
              public bookFetch: BookFetchService,
              public router: Router,
              public dialog: MatDialog,
              ) { }

  ngOnInit() {
    if (!localStorage.getItem('token')) {
      this.router.navigate(['/index']).then(
        () => {
          this.dialog.open(LoginComponent);
        }
      );
    }
    this.issueFile = this.data.file;
    this.issueList = JSON.parse(atob(this.issueFile.content));
    this.issue = this.issueList[this.data.index];
    this.replyList = this.issue.replies;
    console.log('File: ', this.issueFile);
    console.log('Issue: ', this.issue);
    console.log('Replies: ', this.replyList);

  }

  postReply(reply: NgForm) {
    console.log(reply.value.val);
    const dateTime = formatDate(new Date(), 'dd/MM/yyyy HH:mm:ss', 'en');
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email');

    this.replyList.push(new Reply(username, dateTime, reply.value.val));
    this.issue.replies = this.replyList;
    this.issueList[this.data.index] = this.issue;
    this.issueFile.content = btoa(JSON.stringify(this.issueList));
    const commit = new Commit(dateTime, username, email, this.issueFile.sha, this.issueFile.content);

    this.bookFetch.createFile(this.issueFile.path, commit)
      .subscribe(
        data => {
          console.log('Reply Posted: ', data);
          this.issueFile = data;
          reply.resetForm();
        }
      );
  }
  ifSameUser(commentator: string) {
    return commentator === localStorage.getItem('username');
  }
}
