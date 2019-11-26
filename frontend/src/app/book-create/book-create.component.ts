import {
  Component,
  OnInit,
  Inject,
  Output,
  EventEmitter,
  ComponentFactoryResolver,
  ViewChild,
} from '@angular/core';
import {BookFetchService} from '../bookFetch.service';
import {Router, ActivatedRoute} from '@angular/router';
import {Commit} from './commit';
import {AddNewSectionComponent} from './add-new-section/add-new-section.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {PreviewComponent} from './preview/preview.component';
import {ContentService} from '../content.service';
import {notification} from '../notification';
import {NotificationService} from '../notification.service';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {FileSaverService} from 'ngx-filesaver';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {formatDate} from '@angular/common';
import {PublicationBookComponent} from '../publication-book/publication-book.component';
import {IssuesComponent} from '../issues/issues.component';
import {Observable} from 'rxjs';
import {NgxSpinnerService} from 'ngx-spinner';
import {LoginComponent} from "../login/login.component";

@Component({
  selector: 'app-book-create',
  templateUrl: './book-create.component.html',
  styleUrls: ['./book-create.component.css']
})

export class BookCreateComponent implements OnInit {

  public isPublished = false;
  public editor: any;
  public illustrator: any;
  public bookDetails: any;
  public bookDetailsLoaded;
  public chapterStatus = [];
  public showEditButton: boolean[] = [];
  public commitList = [];
  public commitListLoaded = false;
  public brokenImage = true;
  fileName: string;
  public published: any;
  public noAutomate = false;
  @ViewChild(IssuesComponent, {static: true}) issueComponent: IssuesComponent;
  options: string[] = ['Editor1', 'Editor2', 'Editor3'];

  constructor(public bookFetch: BookFetchService,
              public spinner: NgxSpinnerService,
              public router: Router,
              public dialog: MatDialog,
              public contentService: ContentService,
              public route: ActivatedRoute,
              public fileSaverService: FileSaverService,
              public notificationService: NotificationService,
              public componentFactoryResolver: ComponentFactoryResolver) {
    this.bookDetails = JSON.parse(localStorage.getItem('book'));
  }

  ngOnInit() {
    if (!localStorage.getItem('token')) {
      this.router.navigate(['/index']).then(
        () => {
          this.dialog.open(LoginComponent);
        }
      );
    }
    if (localStorage.getItem('role') === 'editor') {
      this.chapterStatus = ['Editing Phase', 'Editing Done'];
    } else if (localStorage.getItem('role') === 'designer') {
      this.chapterStatus = ['Designing Phase', 'Designing Done'];
    } else {
      this.chapterStatus = ['Writing Phase', 'Editing Phase', 'Designing Phase', 'Finished'];
    }
    this.contentService.getBookDetails(this.bookDetails.id)
      .subscribe(
        data => {
          this.bookDetails = data;
          localStorage.setItem('book', JSON.stringify(this.bookDetails));
          console.log('book details: ', this.bookDetails);
          this.setShowEditButton();
          if (!this.bookDetails.selectHelper) {
            if (this.bookDetails.editorStatus !== 'confirmed' && this.bookDetails.designerStatus !== 'confirmed') {
              this.contentService.getRecommendedEditorsOrIllustrators('editor', this.bookDetails.genres[0]).subscribe(
                result => {
                  if(result.length === 0){
                    this.noAutomate = true;
                  }
                  this.bookDetails.editorName = result[0].name;
                  this.bookDetails.editorStatus = 'confirmed';
                  this.contentService.saveBookDetails(this.bookDetails).subscribe();
                });
              this.contentService.getRecommendedEditorsOrIllustrators('designer', this.bookDetails.genres[0]).subscribe(
                result => {
                  this.bookDetails.designerName = result[0].name;
                  this.bookDetails.designerStatus = 'confirmed';
                  this.contentService.saveBookDetails(this.bookDetails).subscribe();
                });
            }
          }
          this.bookDetailsLoaded = true;
        }
      );
  }

  isSelectHelper(): boolean {
    return this.bookDetails.selectHelper;
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.bookDetails.status, event.previousIndex, event.currentIndex);
    localStorage.setItem('book', JSON.stringify(this.bookDetails));
    console.log('drop: ', event.previousIndex, event.currentIndex);
    this.contentService.saveContent(this.bookDetails)
      .subscribe(
        data => {
          console.log('index changed data: ', data);
          this.setShowEditButton();
          // this.ngOnInit();
        },
        error => {
          console.log('index changed error: ', error);
        }
      );
    console.log('status: ', this.bookDetails.status);

  }

  ifAuthor(): boolean {
    return localStorage.getItem('role') === 'reader/author';
  }

  editFile(fileName: string) {
    console.log('editFile(): ', fileName);
    this.bookDetails.plagarismCheckDone = false;
    this.bookDetails.plagarised = false;
    this.contentService.saveContent(this.bookDetails)
      .subscribe(
        () => {
          this.router.navigate(['/edit/' + fileName]).then();
        }
      );
  }

  openIssuesComponent(fileName: string) {
    this.fileName = fileName;
    console.log(fileName);
    localStorage.setItem('fileName', fileName);
    this.issueComponent.fileName = this.fileName;
    this.issueComponent.ngOnInit();
  }

  addNewSection() {
    console.log('Add new Section');
    const dialogRef = this.dialog.open(AddNewSectionComponent);

    dialogRef.afterClosed().subscribe(
      result => {
        if (result === undefined) {
          return;
        }
        console.log('New Section Name: ', result);
        const commit = new Commit(formatDate(new Date(), 'dd/MM/yyyy HH:mm:ss', 'en') + ' - Created',
          localStorage.getItem('fullName'), localStorage.getItem('email'), '', '');
        this.bookFetch.createFile(result, commit)
          .subscribe(
            data => {
              console.log(data);
              if (this.bookDetails.status === null) {
                this.bookDetails.status = [];
              }
              this.bookDetails.status.push(
                {
                  chapterName: result,
                  status: 'Writing Phase',
                }
              );
              this.setShowEditButton();
              localStorage.setItem('book', JSON.stringify(this.bookDetails));
              console.log(this.bookDetails);
              this.bookFetch.createFile('chat-files/' + result, commit)
                .subscribe(
                  data2 => {
                    console.log('chat-file created: ', data2);
                  }
                );
              this.contentService.saveContent(this.bookDetails)
                .subscribe(
                  data2 => {
                    console.log('Update Content data2: ', data2);
                  },
                  error2 => {
                    console.log('Update Content error2: ', error2);
                  }
                );
            },
            error => {
              console.log(error);
            }
          );
      });
  }

  preview(sectionName: string) {
    console.log('section name', sectionName);
    this.bookFetch.getGit(this.bookDetails.id, sectionName)
      .subscribe(
        data => {
          console.log(data);
          const content = atob(data.content);
          const dialogRef = this.dialog.open(
            PreviewComponent,
            {
              data: content,
              height: '80%',
              width: '80%'
            }
          );
        },
      );
  }

  commits(filename: any) {
    this.commitList = [];
    this.commitListLoaded = false;
    this.bookFetch.getCommit(this.bookDetails.id, filename)
      .subscribe(
        data => {
          console.log('commits data: ', data);
          this.commitList = data;
          this.commitListLoaded = true;
        },
        error => {
          console.log('commits error: ', error);
          this.commitListLoaded = false;
        }
      );
  }

  singleCommit(filename: any, sha: any) {
    this.bookFetch.getSingleCommit(this.bookDetails.id, filename, sha)
      .subscribe(
        data => {
          console.log('single commits data: ', atob(data.content));
          const dialogRef = this.dialog.open(
            PreviewComponent,
            {
              data: atob(data.content),
              height: '80%',
              width: '80%'
            }
          );
        },
        error => {
          console.log('single commits error: ', error);
        }
      );
  }

  public _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  openSelectEditorDialog(): void {
    // tslint:disable-next-line: no-use-before-declare
    const dialogRef = this.dialog.open(SelectEditorDialog, {
      width: '40%',
      autoFocus: false,
      maxHeight: '90vh',
      height: '60%',
      data: {
        genre: this.bookDetails.genres
      }
    });

    dialogRef.afterClosed().subscribe(result => {
    });

    const dialogSubmitSubscription = dialogRef.componentInstance.selectEditorEvent.subscribe(
      (result: any) => {
        this.editor = result;
        this.bookDetails.editorName = this.editor;
        this.bookDetails.editorStatus = 'pending';
        this.contentService.saveBookDetails(this.bookDetails).subscribe();
        localStorage.setItem('book', JSON.stringify(this.bookDetails));
        // tslint:disable-next-line: max-line-length
        this.sendNotification(this.editor, this.bookDetails.id, localStorage.getItem('username') + ' has requested you to edit ' + this.bookDetails.title + '.');
        dialogSubmitSubscription.unsubscribe();
      }
    );

  }


  openSelectIllustratorDialog(): void {
    // tslint:disable-next-line: no-use-before-declare
    const dialogRef = this.dialog.open(SelectIllustratorDialog, {
      width: '40%',
      autoFocus: false,
      maxHeight: '90vh',
      height: '60%',
      data: {
        genre: this.bookDetails.genres
      }
    });

    dialogRef.afterClosed().subscribe(result => {
    });

    const dialogSubmitSubscription = dialogRef.componentInstance.selectIllustratorEvent.subscribe(
      (result: any) => {
        this.illustrator = result;
        this.bookDetails.designerName = this.illustrator;
        this.bookDetails.designerStatus = 'pending';
        this.contentService.saveBookDetails(this.bookDetails).subscribe();
        localStorage.setItem('book', JSON.stringify(this.bookDetails));
        // tslint:disable-next-line: max-line-length
        this.sendNotification(this.illustrator, this.bookDetails.id, localStorage.getItem('username') + ' has requested you to illustrate ' + this.bookDetails.title + '.');
        dialogSubmitSubscription.unsubscribe();
      }
    );
  }

  // openSetStatusDialog(): void {
  //   const dialogRef = this.dialog.open(SetStatusDialog, {
  //     width: '50%',
  //     autoFocus: false,
  //     maxHeight: '90vh',
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //   });

  //   const dialogSubmitSubscription =
  //     dialogRef.componentInstance.chapterStatusEvent.subscribe((result: any[]) => {
  //       console.log(result);
  //       this.chapterStatus = result;
  //       dialogSubmitSubscription.unsubscribe();
  //     });
  // }

  setShowEditButton() {
    if (this.bookDetails.status === null) {
      return;
    }
    for (let i = 0; i < this.bookDetails.status.length; i++) {
      const chapter = this.bookDetails.status[i].chapterName;
      const status = this.bookDetails.status[i].status;
      let cond = false;
      // author
      if (localStorage.getItem('role') === 'reader/author') {
        if (status === 'Writing Phase' || status === 'Editing Done' || status === 'Designing Done' || status === 'Finished') {
          cond = true;
        }
      }
      // editor
      if (localStorage.getItem('role') === 'editor') {
        if (status === 'Editing Phase') {
          cond = true;
        }
      }
      // illustrator
      if (localStorage.getItem('role') === 'designer') {
        if (status === 'Designing Phase') {
          cond = true;
        }
      }
      console.log(chapter, status, cond);
      this.showEditButton[i] = cond;
    }
  }

  getShowEditButton(index: number) {
    // console.log('returning: ', this.bookDetails.status[index].chapterName, this.showEditButton[index]);
    return this.showEditButton[index];
  }

  changeChapterStatus(status: string, i: number) {
    console.log(status, i);
    this.bookDetails.status[i].status = status;
    console.log('status changed to :', this.bookDetails.status[i].status);
    localStorage.setItem('book', JSON.stringify(this.bookDetails));
    this.contentService.saveContent(this.bookDetails)
      .subscribe(
        data => {
          console.log('status changed data: ', data);
          this.setShowEditButton();
        },
        error => {
          console.log('status changed error: ', error);
        }
      );
  }

  // getBookDetails(id) {
  //   console.log('fetching book details');
  //   this.contentService.getBookDetails(id).subscribe(
  //     result => {
  //       this.bookDetails = result;
  //       this.chapterNames = Array.from(this.bookDetails.status.keys());
  //       console.log(this.chapterNames);
  //     }
  //   );
  // }

  onPublish() {
    const dialogRef = this.dialog.open(PublicationBookComponent, {
      width: '50%',
      data: {
        book: this.bookDetails
      }
    });
    dialogRef.afterClosed().subscribe(
      () => {
        console.log('closed');
        this.router.navigate(['dashboard']).then();
      });
  }

  isPublish(): boolean {
    const flag = this.bookDetails.plagarismCheckDone && !this.bookDetails.plagarised && this.brokenImage;
    if (this.bookDetails.status === undefined) {
      return false;
    }
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.bookDetails.status.length; i++) {
      if (this.bookDetails.status[i].status !== 'Finished') {
        return false;
      }
    }
    return flag;
  }

  sendNotification(receiver: string, bookId: number, message: string | string) {
    const newNotification: notification = new notification();
    newNotification.sender = localStorage.getItem('username');
    newNotification.bookId = bookId;
    newNotification.receiver = receiver;
    newNotification.message = message;
    newNotification.status = true;
    this.notificationService.sendNotification(newNotification).subscribe();
  }

  uploadFile(file: File) {
    this.bookDetails.plagarismCheckDone = false;
    this.bookDetails.plagarised = true;
    this.contentService.saveContent(this.bookDetails)
      .subscribe(
        data2 => {
          console.log('update content: ', data2);
          this.bookFetch.uploadToAws(file, this.bookDetails.id)
            .subscribe(
              data => {
                console.log('plagiarism checking data', data);
              }
            );
        }
      );

    //   if (data === 'Success') {
    //     const dialogRef = this.dialog.open(PublicationBookComponent, {
    //       width: '50%',
    //       data: {
    //         book: this.bookDetails
    //       }
    //     });
    //     dialogRef.afterClosed().subscribe(
    //       () => {
    //         console.log('closed');
    //         this.spinner.hide().then();
    //         // tslint:disable-next-line: no-string-literal
    //         this.router.navigate['dashboard'].then();
    //       });
    //   } else {
    //     const dialogRef = this.dialog.open(FailureComponent, {
    //       width: '50%',
    //       data: {
    //         book: this.bookDetails
    //       }
    //     });
    //     this.spinner.hide();
    //   }
    // }, err => {
    //   const dialogRef = this.dialog.open(FailureComponent, {
    //     width: '50%',
    //     data: {
    //       book: this.bookDetails
    //     }
    //   });
    //   this.spinner.hide();
  }

  onSelectFile(event: { target: { files: { name: any; }[]; }; }) {
    // event.target.files[0].name = this.bookDetails.title;
    if (event.target.files && event.target.files[0]) {
      this.bookFetch.uploadToAwsImage(event.target.files[0], this.bookDetails.id + '.jpg')
        .subscribe(data => {
          console.log(data);
        });
    }
  }

  compileFile() {
    const fileName = `save.html`;
    const len = this.bookDetails.status.length;
    let count = 0;
    const fileType = this.fileSaverService.genType(fileName);
    let txtBlob: BlobPart;
    const htmlContent = [];
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.bookDetails.status.length; i++) {
      htmlContent.push({
        chapterName: this.bookDetails.status[i].chapterName,
        content: ''
      });
    }
    console.log(htmlContent);
    for (let i = 0; i < len; i++) {
      this.bookFetch.getGit(this.bookDetails.id, this.bookDetails.status[i].chapterName)
        .subscribe(
          data => {
            htmlContent[i].content = atob(data.content);
            count++;
            if (count === len) {
              let combined = '';
              for (let j = 0; j < len; j++) {
                combined += '<div>' + htmlContent[j].content + '</div>';
              }
              console.log(combined);
              txtBlob = new Blob([combined], {type: fileType});
              const file = new File([txtBlob], this.bookDetails.id);
              console.log(file);
              this.uploadFile(file);
            }
          }
        );
    }

  }

  coverImage() {
    console.log('broken image');
    this.brokenImage = false;
  }

  getBrokenImage() {
    return this.brokenImage;
  }
}

export interface Card {
  name: string;
}

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'select-editor-dialog',
  templateUrl: 'select-editor-dialog.html',
  styleUrls: ['./book-create.component.css']
})
// tslint:disable-next-line: component-class-suffix
export class SelectEditorDialog implements OnInit {

  @Output() selectEditorEvent = new EventEmitter<any>();
  public editorList;
  public editorListFiltered;
  public allEditorList;
  public allEditorListFiltered;
  public searchTerm;

  constructor(
    public dialogRef: MatDialogRef<SelectEditorDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public contentService: ContentService) {
  }

  ngOnInit(): void {
    this.getRecommendedEditors();
    this.getAllEditors();
    console.log(this.data.genre[0]);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  selectEditor(editor: string) {
    console.log('Selected Editor : ' + editor);
    this.selectEditorEvent.emit(editor);
    this.dialogRef.close();
  }

  getRecommendedEditors() {
    console.log('Fetching Editors');
    this.contentService.getRecommendedEditorsOrIllustrators('editor', this.data.genre[0]).subscribe(
      result => {
        this.editorList = result;
        this.editorListFiltered = this.editorList;
      });
  }

  getAllEditors() {
    console.log('Fetching All Editors');
    this.contentService.getEditorsOrIllustrators('editor').subscribe(
      result => {
        this.allEditorList = result;
        console.log(this.allEditorList);
        this.allEditorListFiltered = this.allEditorList;
      });
  }

  search() {
    const term = this.searchTerm;
    console.log(term);
    // tslint:disable-next-line: max-line-length
    // tslint:disable-next-line: only-arrow-functions
    this.editorListFiltered = this.editorList.filter(function (tag: { name: { toLowerCase: () => { indexOf: (arg0: any) => number; }; }; }) {
      return tag.name.toLowerCase().indexOf(term) >= 0;
    });
    // tslint:disable-next-line: only-arrow-functions
    this.allEditorListFiltered = this.allEditorList.filter(function (tag: { toLowerCase: () => { indexOf: (arg0: any) => number; }; }) {
      return tag.toLowerCase().indexOf(term) >= 0;
    });
  }
}


@Component({
  // tslint:disable-next-line: component-selector
  selector: 'select-illustrator-dialog',
  templateUrl: 'select-illustrator-dialog.html',
  styleUrls: ['./book-create.component.css']
})
// tslint:disable-next-line: component-class-suffix
export class SelectIllustratorDialog implements OnInit {
  public illustratorList;
  public illustratorListFiltered: any;
  public searchTerm: any;
  public allIllustratorList;
  public allIllustratorListFiltered;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  obs: Observable<any>;
  // dataSource: MatTableDataSource<Card>;
  @Output() selectIllustratorEvent = new EventEmitter<any>();

  constructor(
    public dialogRef: MatDialogRef<SelectIllustratorDialog>,
    // tslint:disable-next-line: ban-types
    @Inject(MAT_DIALOG_DATA) public data: any,
    public contentService: ContentService,
    // public changeDetectorRef: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.getRecommendedIllustrators();
    this.getAllIllustrators();
    console.log(this.data);
    // this.changeDetectorRef.detectChanges();
    // this.dataSource.paginator = this.paginator;
    // this.obs = this.dataSource.connect();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  selectIllustrator(illustrator: any) {
    console.log(illustrator);
    this.selectIllustratorEvent.emit(illustrator);
    this.dialogRef.close();
  }

  getRecommendedIllustrators() {
    console.log('Fetching Illustrators');
    this.contentService.getRecommendedEditorsOrIllustrators('illustrator', this.data.genre[0]).subscribe(
      result => {
        this.illustratorList = result;
        this.illustratorListFiltered = this.illustratorList;
        // this.dataSource =  new MatTableDataSource<Card>(this.allIllustratorListFiltered);
        // this.dataSource.paginator = this.paginator;
        // this.obs = this.dataSource.connect();
      });
  }

  getAllIllustrators() {
    console.log('Fetching All Illustrators');
    this.contentService.getEditorsOrIllustrators('designer').subscribe(
      result => {
        this.allIllustratorList = result;
        this.allIllustratorListFiltered = this.allIllustratorList;
      });
  }

  search(): void {
    const term = this.searchTerm;
    // tslint:disable-next-line: only-arrow-functions
    this.illustratorListFiltered = this.illustratorList.filter(function (tag) {
      return tag.name.toLowerCase().indexOf(term) >= 0;
    });
    // tslint:disable-next-line: only-arrow-functions
    this.allIllustratorListFiltered = this.allIllustratorList.filter(function (tag) {
      return tag.toLowerCase().indexOf(term) >= 0;
    });
  }


}
