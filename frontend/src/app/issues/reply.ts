export class Reply {
  public commentator: string;
  public repliedOn: string;
  public message: string;

  constructor(commentator: string, repliedOn: string, message: string) {
    this.commentator = commentator;
    this.repliedOn = repliedOn;
    this.message = message;
  }
}
