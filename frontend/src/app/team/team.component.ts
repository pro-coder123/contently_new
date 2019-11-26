import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {

  constructor() { }
  public members: Member[] = [];
  ngOnInit() {
    this.members.push(new Member('Avinash Kumar Prasad', 'avinash.k.prasad@cgi.com', '9563153062', 'https://convertedbooks.s3.ap-south-1.amazonaws.com/avinash.jpg'));
    this.members.push(new Member('Prakhar Bajpai', 'prakhar.bajpai@cgi.com', '8574393622', 'https://convertedbooks.s3.ap-south-1.amazonaws.com/IMG_20191123_113233.jpg'));
    this.members.push(new Member('Adityan A', 'adityan.a@cgi.com', '9995245409', 'https://convertedbooks.s3.ap-south-1.amazonaws.com/adityan.jpg'));
    this.members.push(new Member('Varun Mukundhan', 'varun.mukundhan@cgi.com', '8939530620', 'https://convertedbooks.s3.ap-south-1.amazonaws.com/varun.jpg'));
    this.members.push(new Member('Shivani Sajjan', 'shivani.sajjan@cgi.com', '8552802816', 'https://convertedbooks.s3.ap-south-1.amazonaws.com/shivani.jpg'));
    this.members.push(new Member('Utkarsh Sinh', 'utkarsh.sinh@cgi.com', '9587125159', 'https://convertedbooks.s3.ap-south-1.amazonaws.com/utkarsh.jpg'));
  }

}
export class Member {
  name: string;
  email: string;
  contactNumber: string;
  avatar: string;

  constructor(name: string, email: string, contactNumber: string, avatar: string) {
    this.name = name;
    this.email = email;
    this.contactNumber = contactNumber;
    this.avatar = avatar;
  }
}
