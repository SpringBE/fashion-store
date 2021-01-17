import { Component, OnInit } from '@angular/core';
import { DisplayService } from '../services/display.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginService } from '../services/login.service';
import { ShopeaseService } from '../services/shopease.service';
import { formatDate } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cart_items:any=[];
  grand_total=0;
  user:any;
  date="";
  dateFormat: string;
  addresses=[];
  email="";
  selectedAddress="";
  addressDetails:FormGroup;
  constructor(private displayServie:DisplayService,private fb: FormBuilder,private shopeaseService:ShopeaseService,private _snackBar: MatSnackBar,private loginService:LoginService) { 
  this.addressDetails = this.fb.group({
    address: ['', Validators.required]
  });
}
  ngOnInit(): void {
    
      this.displayServie.allCartItems.subscribe(data=>{
      this.cart_items = data;
      this.calc_total();
     
      })
      this.loginService.currentUser.subscribe(data=>{
        this.user = data;
        this.addresses=this.user[0]['addresses']
        this.email=this.user[0]['email'];
    })   
    }
    calc_total(){
      this.grand_total = 0;
        this.cart_items.forEach(element=>{
        this.grand_total += element.item_price * element.item_quantity;}  
      )
    }
    clear_all(){
      this.grand_total=0;
      this.cart_items=[];
  }

  set_order(choice,element){
    if (choice=='address')
    {
      this.selectedAddress=element
    }
    else if(choice=='done'){
    let now = new Date();
    this.dateFormat = formatDate(now, 'dd-MM-yyyy hh:mm:ss a', 'en-IND', '+0530');
    for(var i=0;i<10;i++){
    this.date+=this.dateFormat[i];}
    console.log(this.dateFormat);
    console.log(this.selectedAddress);
    console.log(this.cart_items);
    console.log(this.email);
    console.log(this.grand_total)
    this.shopeaseService.add_cart_items(this.cart_items,this.grand_total,this.dateFormat,this.selectedAddress,this.email).subscribe(data=>{
    })
    this._snackBar.open("Your order has been placed successfully", " ", {
      duration: 5000,
  });
  }
  }
}
