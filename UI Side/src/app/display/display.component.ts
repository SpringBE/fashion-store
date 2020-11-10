import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ShopeaseService } from '../services/shopease.service';


@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css']
})

export class DisplayComponent implements OnInit {
  categoryName="mhd";
  sectionName="Men";
  brandFilter:[];
  colorFilter:[];
  sizeFilter:[];
  maxPrice:number;
  minPrice:number;
  
  constructor(private route:ActivatedRoute,private shopeaseService:ShopeaseService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      let id = params['id'];
      console.log(id);
      this.get_data();
      this.get_items();
      this.get_categories();
      });

  }
  /*get the filters*/
  get_data(){
    this.shopeaseService.get_filters(this.sectionName,this.categoryName).subscribe(filters=>{
      console.log(filters);
      this.brandFilter=filters.filters[0].Brands.sort();
      this.colorFilter=filters.filters[0].Colors.sort();
      this.sizeFilter=filters.filters[0].Item_Size.sort();
      this.maxPrice=filters.filters[0].Maximum_Price;
      this.minPrice=filters.filters[0].Minimum_price;
    })
  }
  get_items(){
    this.shopeaseService.get_items(this.sectionName,this.categoryName).subscribe(items=>{
      console.log(items);
    })
  }
  get_categories(){
    this.shopeaseService.get_categories(this.sectionName).subscribe(categories=>{
      console.log(categories);
    })
  }
}


