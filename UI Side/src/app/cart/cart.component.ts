import { Component, OnInit } from '@angular/core';
import { DisplayService } from '../services/display.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cart_items:any=[];
  grand_total=0;
  user:any;
  constructor(private displayServie:DisplayService,private _snackBar: MatSnackBar,private loginService:LoginService) { }

  ngOnInit(): void {
    
      this.displayServie.allCartItems.subscribe(data=>{
      this.cart_items = data;
      console.log(this.cart_items);
      this.calc_total();
     
      })
      this.loginService.currentUser.subscribe(data=>{
        this.user = data;
        console.log(this.user)
    })   
    }
    calc_total(){
      this.grand_total = 0
      this.cart_items.forEach(element=>{
        this.grand_total += element.item_price * element.item_quantity;
        
    })
    
  }
}
