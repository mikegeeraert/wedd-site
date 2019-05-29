import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../authentication.service';
import {catchError, tap} from 'rxjs/internal/operators';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import {from, of} from 'rxjs';


@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {

  login: FormGroup;

  constructor(private fb: FormBuilder,
              private authService: AuthenticationService,
              private router: Router,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
    const email = new FormControl('', [Validators.required]);

    const password = new FormControl('', [Validators.required]);
    this.login = this.fb.group({
      email: email,
      password: password,
    })
  }

  onSubmit() {
    const values = this.login.value;
    this.authService.adminLogin(values.email, values.password).subscribe(
      () => {
        this.router.navigate(['admin', 'home']);
    },
      () => {
      this.snackBar.open('Your password is wrong, or your user doesn\'t exist', null, {
        duration: 2000,
        politeness: 'assertive',
      });
    });
  }

}
