export class Book {
    public name: string;
    // public description: string;
    // public id:Number;
    // public show:Boolean;
    public sha: string;
    public content: string;


  constructor(name: string, sha: string, content: string) {
    this.name = name;
    this.sha = sha;
    this.content = content;
  }
  }
