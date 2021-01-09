import { Component, OnInit } from '@angular/core';
import { DisplayService } from '../services/display.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cart_items: any;

  constructor(private displayServie:DisplayService) { }

  ngOnInit(): void {
      this.displayServie.allCartItems.subscribe(data=>{
          this.cart_items = data;
          console.log(this.cart_items);
      })
  }

}
