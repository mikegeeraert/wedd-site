import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {

  form: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    // this.form = this.fb.group({email: })
  }

}
