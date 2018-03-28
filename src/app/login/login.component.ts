import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private loginService: LoginService,
    private router: Router
  ) { }

  username = '';
  password = '';
  successMsg = '';
  errorMsg = '';

  ngOnInit() {
  }

  submitLogin(evt): void {
    if (evt) evt.preventDefault();
    if (!this.username || !this.password) return;

    this.loginService
      .login(this.username, this.password)
      .subscribe(
        res => {
          localStorage.setItem('token', res.token);
          localStorage.setItem('id', res.id);

          this.username = '';
          this.password = '';

          this.router.navigate(['profile']);
        },
        err => this.errorMsg = err.error
      );
  }

  submitSignup(evt): void {
    if (evt) evt.preventDefault();
    if (!this.username || !this.password) return;

    this.loginService
      .signup(this.username, this.password)
      .subscribe(
        res => {
          this.username = '';
          this.password = '';
          this.successMsg = 'Account created. You can now login.';
        },
        err => this.errorMsg = err.error
      );
  }
}
