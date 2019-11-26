export class Commit {
  public message = 'Custom commit msg';
  public committer: any = {
    name: String,
    email: String
  };
  sha: string;
  content: string;

  constructor(message: string,
              // tslint:disable-next-line: ban-types
              committerName: String,
              // tslint:disable-next-line: ban-types
              committerEmail: String,
              sha: string,
              content: string) {
    this.message = message;
    this.committer = {
      name: committerName,
      email: committerEmail
    };
    this.sha = sha;
    this.content = content;
  }

}
