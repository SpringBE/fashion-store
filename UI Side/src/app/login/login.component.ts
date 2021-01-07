import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  sign_in;
  first_page;
  second_page;
  third_page;
  loginDetails:FormGroup;
  registrationDetails:FormGroup;
  constructor( private fb: FormBuilder ) { 
    this.loginDetails = this.fb.group({
        email: ['', Validators.required],
        password: ['', Validators.required],
      });

    this.registrationDetails = this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        phone: ['', Validators.required],
        email: ['', Validators.required],
        password:['', Validators.required],
        confirmPassword:['', Validators.required]
      });
  }

  ngOnInit(): void {
      this.sign_in = true;
      this.goTo_1page_signUp();
  }

  signUp(){
      this.sign_in = false;
  }

  signIn(){
      this.sign_in = true;
  }

  goTo_1page_signUp(){
    this.first_page = true;
    this.second_page = this.third_page = false;
  }

  goTo_2page_signUp(){
    this.second_page = true;
    this.first_page = this.third_page = false;
  }

  goTo_3page_signUp(){
    this.third_page = true;
    this.second_page = this.first_page = false;
  }
  

}
