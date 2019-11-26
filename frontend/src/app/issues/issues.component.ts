import {Component, Input, OnInit, ViewContainerRef} from '@angular/core';
import {NewIssueComponent} from './new-issue/new-issue.component';
import {formatDate} from '@angular/common';
import {Commit} from '../book-create/commit';
import {ReplyComponent} from './reply/reply.component';
import {BookFetchService} from '../bookFetch.service';
import {MatDialog} from '@angular/material/dialog';
import {Issue} from './issue';
import {Router} from "@angular/router";
import {LoginComponent} from "../login/login.component";

@Component({
  selector: 'app-issues',
  templateUrl: './issues.component.html',
  styleUrls: ['./issues.component.css']
})
export class IssuesComponent implements OnInit {

  public issueFile: any;
  public issueList: Issue[] = [];
  public issuesLoaded = false;
  public replyDrawer = false;
  @Input() fileName: string;
  constructor(public bookFetch: BookFetchService,
              public dialog: MatDialog,
              public viewContainerRef: ViewContainerRef,
              public router: Router) { }

  ngOnInit() {
    if (!localStorage.getItem('token')) {
      this.router.navigate(['/index']).then(
        () => {
          this.dialog.open(LoginComponent);
        }
      );
    }
    console.log('Filename in Issue:', this.fileName);
    this.loadIssues();
  }

  loadIssues() {
    this.issuesLoaded = false;
    this.bookFetch.getGit(JSON.parse(localStorage.getItem('book')).id,
      'chat-files/' + this.fileName)
      .subscribe(
        data => {
          this.issueFile = data;
          if (atob(data.content) !== '') {
            this.issueList = JSON.parse(atob(data.content));
          }
          this.issuesLoaded = true;
          console.log('Issues: ', data);
          console.log('Issue List: ', this.issueList);
        }
      );
  }

  newIssue() {
    const dialogRef = this.dialog.open(NewIssueComponent);
    dialogRef.afterClosed().subscribe(
      result => {
        if (result === undefined) {
          return;
        }
        const issue = new Issue(
          localStorage.getItem('username'), formatDate(new Date(), 'dd/MM/yyyy HH:mm:ss', 'en'),
          'open', result, []);
        console.log('Issues: ', this.issueList);
        this.issueList.push(issue);
        console.log('Issues: ', this.issueList);
        const commit = new Commit(formatDate(new Date(), 'dd/MM/yyyy HH:mm:ss', 'en'),
          localStorage.getItem('username'), localStorage.getItem('email'), this.issueFile.sha, btoa(JSON.stringify(this.issueList)));
        console.log('commit: ', commit);
        this.bookFetch.createFile('chat-files/' + this.fileName, commit)
          .subscribe(
            data => {
              console.log('Issue created data: ', data);
              this.loadIssues();
            }
          );
      }
    );
  }

  replyToIssue(i: number) {
    console.log('Reply to issue: ', i);
    this.dialog.open(ReplyComponent,
      {
        data: {
          file: this.issueFile,
          index: i
        },
        height: '80%',
        width: '80%'
      });
  }

  closeIssue(i: number) {
    console.log('Close issue: ', i);
    this.issueList[i].status = 'closed';
    const commit = new Commit(formatDate(new Date(), 'dd/MM/yyyy HH:mm:ss', 'en'),
      localStorage.getItem('username'), localStorage.getItem('email'), this.issueFile.sha, btoa(JSON.stringify(this.issueList)));
    console.log('commit: ', commit);
    this.bookFetch.createFile('chat-files/' + this.fileName, commit)
      .subscribe(
        data => {
          console.log('Issue closed data: ', data);
          this.loadIssues();
        }
      );
  }

}
