import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { ShopeaseService } from '../services/shopease.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  edit:boolean;
  profile:boolean;
  address:boolean;
  wishlist:boolean;
  orders:boolean;
  addressForm:FormGroup;
  addAddress:boolean;
  user:any;
  editProfileForm:FormGroup;
  constructor(private route: ActivatedRoute,
    private fb: FormBuilder,
    private shopEaseService:ShopeaseService,
    private _snackBar: MatSnackBar,
    private loginService: LoginService,
    private router: Router) {

    this.addressForm = this.fb.group({
        name: ['', Validators.required],
        phone:['', Validators.required],
        address:['', Validators.required],
        city:['', Validators.required],
        state:['', Validators.required],
        pincode:['', Validators.required],
        addressType:['', Validators.required]
    });

    this.editProfileForm = this.fb.group({
        name: [''],
        phone:[''],
        email:[''],
        gender:[''],
        dob:[''],
        location:[''],
        alt_phone:['']
    });

   }

  ngOnInit(): void {
    this.loginService.currentUser.subscribe(data=>{
        this.route.params.subscribe(params => {
            this.user = data;
            if(params['id'] == 'profile' && this.user){
                console.log(this.user);
                this.goToProfile();
            }
            else if(params['id'] == 'address' && this.user){
                this.goToAdress();
            }
            else if(params['id'] == 'wishlist' && this.user){
                this.goToWishlist();
            }
            else if(params['id'] == 'orders' && this.user){
                this.goToOrders();
            }
            else if(params['id'] == 'edit-profile' && this.user){
                this.edit_profile_info();
            }
        });
    })
  }

  goToProfile(){
    this.profile = true;
    this.edit = this.address = this.wishlist = this.orders = this.addAddress =  false;
  }

  goToAdress(){
    this.address = true;
    this.edit = this.profile = this.wishlist = this.orders = this.addAddress = false;
  }

  goToWishlist(){
    this.wishlist = true;
    this.edit = this.address = this.profile = this.orders = this.addAddress = false;
  }

  goToOrders(){
    this.orders = true;
    this.edit = this.address = this.profile = this.wishlist = this.addAddress = false ;
  }

  edit_profile_info(){
      this.edit = true;
      this.orders = this.address = this.profile = this.wishlist = this.addAddress = false ;
      this.editProfileForm.setValue({
        name:this.user[0].name,
        phone:this.user[0].phone,
        email:this.user[0].email,
        gender:this.user[0].gender,
        location:this.user[0].location,
        dob:this.user[0].dob,
        alt_phone:this.user[0].alt_phone
      });
  }

  goToAddAddress(){
      this.addAddress = true;
      this.edit = this.orders = this.profile = this.wishlist = this.address = false;
  }

  submit_address_info(){
      let address_Data = {
          "email":this.user[0]['email'],
          "address":this.addressForm.value
      }
      this.shopEaseService.save_address(address_Data).subscribe(data=>{
          console.log(data);
          if(data['saved']){
            this._snackBar.open("Address is saved successfully", "", {
                duration: 2000,
            });
            this.shopEaseService.get_currentUser_details(this.user[0].email).subscribe(data=>{
                this.user = data['details'];
                console.log(this.user)
            })
            this.goToAdress();
          }
          else{
            this._snackBar.open("Something went wrong", "Please try again..", {
                duration: 2000,
            });
          }
      })
  }

  save_profile(){
      this.shopEaseService.update_profile(this.editProfileForm.value).subscribe(data=>{
          console.log(data);
          if(data['updated']){
            this._snackBar.open("Profile is Updated", "", {
                duration: 2000,
            });
            this.shopEaseService.get_currentUser_details(this.user[0].email).subscribe(data=>{
                this.user = data['details'];
                console.log(this.user);
            })
            this.goToProfile();
            this.loginService.sendUserData(this.user);
          }
      })
  }

  log_out(){
      this.user = null;
      this.loginService.sendUserData(this.user);
      this.router.navigate(['/home'])
  }
}
