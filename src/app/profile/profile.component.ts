import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  profile: any;

  constructor(
    private userService: UserService,
    private router: Router) {
  }

  ngOnInit() {
    this.userService.getProfile()
      .subscribe(
        res => this.profile = res,
        err => this.router.navigate(['/login'])
      );
  }

}
