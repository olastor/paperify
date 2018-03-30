import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './shared/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(
    public userService: UserService,
    private router: Router
  ) {

  }

  logout(): void {
    this.userService.logout()
      .subscribe(() => this.router.navigate(['/']));
  }
}
