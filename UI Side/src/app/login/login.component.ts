import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ShopeaseService } from '../services/shopease.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';

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
    loginDetails: FormGroup;
    registrationDetails: FormGroup;
    fieldTextType: boolean = false;
    constructor(private fb: FormBuilder,
        private shoEaseService: ShopeaseService,
        private _snackBar: MatSnackBar,
        public dialogRef: MatDialogRef<LoginComponent>) {

        this.loginDetails = this.fb.group({
            email: ['', [Validators.required,
            Validators.email]],
            password: ['', [Validators.required,
            Validators.minLength(6)]],
        });

        this.registrationDetails = this.fb.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            phone: ['', [Validators.required,
            Validators.pattern("[0-9]{10}")]],
            email: ['', [Validators.required,
            Validators.email]],
            password: ['', [Validators.required,
            Validators.minLength(6)]],
            confirmPassword: ['', [Validators.required,
            Validators.minLength(6)]]
        });
    }

    ngOnInit(): void {
        this.sign_in = true;
        this.goTo_1page_signUp();
    }

    signUp() {
        this.sign_in = false;
    }

    signIn() {
        this.sign_in = true;
    }

    goTo_1page_signUp() {
        this.first_page = true;
        this.second_page = this.third_page = false;
    }

    goTo_2page_signUp() {
        this.second_page = true;
        this.first_page = this.third_page = false;
    }

    goTo_3page_signUp() {
        this.third_page = true;
        this.second_page = this.first_page = false;
    }

    user_login() {
        this.shoEaseService.user_login_validation(this.loginDetails.value).subscribe(data => {
            if (data['flag']) {
                this.dialogRef.close();
                this._snackBar.open("Successfull Login", " ", {
                    duration: 2000,
                });
                this.loginDetails.reset();
            }
            else {
                this._snackBar.open("Login was Unsuccessfull", "Try again..", {
                    duration: 2000,
                });
            }
        })
    }

    register_to_shopEase() {
        if (this.registrationDetails.value.password != this.registrationDetails.value.confirmPassword) {
            this._snackBar.open("Please Re enter the password correctly", "", {
                duration: 2000,
            });
        }
        else {
            this.shoEaseService.registration_process(this.registrationDetails.value).subscribe(data => {
                if (data['emailExist']) {
                    this._snackBar.open("Email Already Exists", "", {
                        duration: 2000,
                    });
                    this.goTo_2page_signUp();
                }
                else {
                    if (data['addRecord']) {
                        this.dialogRef.close();
                        this._snackBar.open("Successfull Registration", " ", {
                            duration: 2000,
                        });
                        this.registrationDetails.reset();
                    }
                    else{
                        this._snackBar.open("Something went wrong", "Please try again..", {
                            duration: 2000,
                        });
                        this.goTo_1page_signUp();
                    }
                }
            })
        }
    }
}
