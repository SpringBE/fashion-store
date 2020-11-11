import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ShopeaseService } from '../services/shopease.service';
import { DomSanitizer } from '@angular/platform-browser';

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
  items:[];
  maxPrice:number;
  minPrice:number;
  imagePath: any;
  imgURL=[];
  color:string;
  
  constructor(private route:ActivatedRoute,private shopeaseService:ShopeaseService,private sanitizer: DomSanitizer) { 
 { }}

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
    this.shopeaseService.get_items(this.sectionName,this.categoryName).subscribe(item_list=>{
      this.items=item_list.items[0].Categories[0].Items;
      console.log(this.items)
      for(var i=0;i<this.items.length;i++){
      this.color=item_list.items[0].Categories[0].Items[i].colors[0];
      this.imgURL.push(item_list.items[0].Categories[0].Items[i].item_image[0][this.color]);}
      this.shopeaseService.get_images(this.sectionName,this.categoryName,this.imgURL[i])
    })
  }
  get_categories(){
    this.shopeaseService.get_categories(this.sectionName).subscribe(categories=>{
      console.log(categories);
    })
  }
}


