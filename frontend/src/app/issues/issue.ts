import {Reply} from './reply';

export class Issue {
  public creator: string;
  public createdOn: string;
  public status: string;
  public title: string;
  public replies: Reply[];

  constructor(creator: string, createdOn: string, status: string, title: string, replies: Reply[]) {
    this.creator = creator;
    this.createdOn = createdOn;
    this.status = status;
    this.title = title;
    this.replies = replies;
  }
}
