import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ShopeaseService } from '../services/shopease.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DisplayService } from '../services/display.service';
import { LoginService } from '../services/login.service';

@Component({
    selector: 'app-display',
    templateUrl: './display.component.html',
    styleUrls: ['./display.component.css']
})

export class DisplayComponent implements OnInit {
    categoryId = "";
    categories=[];
    sectionName = "";
    brandFilter: [];
    colorFilter: [];
    sizeFilter: [];
    items: any[] = [];
    cart_items=[];
    maxPrice: number;
    minPrice: number;
    detail:boolean;
    multi_image:boolean;
    imgURL = [];
    color: string;
    Size = [];
    Brand = [];
    Color = [];
    selectedsize:string;
    selectedcolor:string;
    pricedItems=[];
    selectedItem=[];
    selectedimage=[];
    cartDetails:FormGroup;
    user:any;
    constructor(private route: ActivatedRoute, 
        private shopeaseService: ShopeaseService,
        private fb: FormBuilder,
        private displayService:DisplayService,
        private loginService:LoginService) {
        this.cartDetails = this.fb.group({
            size: ['', Validators.required],
            color: ['', Validators.required],
          });
    }

    ngOnInit(): void {
        this.loginService.currentUser.subscribe(data=>{
            this.user = data;
        })

        this.route.params.subscribe(params => {
            this.sectionName = params['section'];
            if (params['category_id']) {
                this.imgURL=[];
                this.categoryId = params['category_id']
                this.get_data();
                this.get_categories();       
                this.get_items();     
            }
        });
        this.displayService.allCartItems.subscribe(data=>{
            this.cart_items = data;
            if(this.cart_items == null){
                this.cart_items = []
            }
        })

        
    }
    /*get the filters*/
    get_data() {
        this.detail=false;
        this.shopeaseService.get_filters(this.sectionName, this.categoryId).subscribe(filters => {
            console.log(filters);
            this.brandFilter = filters.filters[0].Brands.sort();
            this.colorFilter = filters.filters[0].Colors.sort();
            this.sizeFilter = filters.filters[0].Item_Size.sort();
            this.maxPrice = filters.filters[0].Maximum_Price;
            this.minPrice = filters.filters[0].Minimum_Price;
            //this.filterSelectionItems('all_items', 0);
        })
    }
    get_categories() {
        this.detail=false;
        this.shopeaseService.get_categories(this.sectionName).subscribe(categories => {
        this.categories=categories['categories'][0]['Categories']
        console.log(this.categories)
        })
    }
    get_items() {
        this.detail=false;
        this.shopeaseService.get_items(this.sectionName, this.categoryId).subscribe(item_list => {
            this.items = item_list.items[0].Categories[0].Items;
            for (var i = 0; i < this.items.length; i++) {
                let all_colors = item_list.items[0].Categories[0].Items[i].colors;
                /*if (all_colors.length > 1) {
                    for (let j = 0; j < all_colors.length; j++) {
                        this.imgURL.push(item_list.items[0].Categories[0].Items[i].item_image[0][all_colors[j]])
                        this.items.splice(i + j, 0, this.items[i]);
                    }
                    this.items.splice(i + all_colors.length, 1)
                    i = i + all_colors.length - 1
                }
                else*/
                this.imgURL.push(item_list.items[0].Categories[0].Items[i].item_image[0][all_colors[0]]);
            }
            console.log(this.items)
            console.log(this.imgURL)
        })
    }
    

    filterSelectionItems(filterType, value) {
        this.detail=false;
        let min_price = this.minPrice
        let max_price = this.maxPrice

        if (filterType === 'brand') {
            if (this.Brand.includes(value)) {
                console.log("hello")
                this.Brand.forEach((item, index) => {
                    if (item == value) this.Brand.splice(index, 1);
                })
            }
            else {
                this.Brand.push(value)
            }
        }

        else if (filterType === 'size') {
            if (this.Size.includes(value)) {
                this.Size.forEach((item, index) => {
                    if (item == value) this.Size.splice(index, 1);
                })
            }
            else {
                this.Size.push(value)
            }
        }

        else if (filterType === 'color') {
            if (this.Color.includes(value)) {
                this.Color.forEach((item, index) => {
                    if (item == value) this.Color.splice(index, 1);
                })
            }
            else {
                this.Color.push(value)
            }
        }
        else if(filterType ==='price')
        {
            var s=(<HTMLInputElement>document.getElementById("minprice")).value
            var l=(<HTMLInputElement>document.getElementById("maxprice")).value
            if(!isNaN(parseInt(s))){
                min_price = parseInt(s)
            }

            if(!isNaN(parseInt(l))){
                max_price = parseInt(l)
            }
        }

        let filter_brand = this.Brand
        let filter_size = this.Size
        let filter_color = this.Color

        if (this.Brand.length == 0)
            filter_brand = this.brandFilter

        if (this.Size.length == 0)
            filter_size = this.sizeFilter

        if (this.Color.length == 0)
            filter_color = this.colorFilter

        this.shopeaseService.get_filtered_items(filter_brand, filter_size, filter_color,min_price,max_price, this.sectionName, this.categoryId).subscribe(data => {
            this.items = []
            this.imgURL = []
            let i = 0;
            for (let item of data['filtered_items']) {
                let all_colors = item['filtered_items'].colors;
                if (all_colors.length > 1 && this.Color.length > 0) {
                    for (let j = 0; j < all_colors.length; j++) {
                        if (filter_color.includes(all_colors[j])) {
                            this.imgURL.push(item['filtered_items'].item_image[0][all_colors[j]])
                            this.items.splice(i + j, 0,item['filtered_items']);
                        }
                    }
                    i = i + all_colors.length - 1
                }
                else {
                    this.items.push(item['filtered_items'])
                    this.imgURL.push(item['filtered_items'].item_image[0][all_colors[0]]);
                    i += 1
                }
            }
            console.log(this.items)
            console.log(this.imgURL);
        })
    }
    product_detail(id){
        this.selectedimage=[];
        this.selectedItem=[];
        this.detail=true;
        for(var i=0;i<this.items.length;i++)
        {
            if(id==this.items[i]['item_id'])
            {
                this.selectedItem.push(this.items[i])
            }
        }
        console.log(this.selectedItem)
        var n=this.selectedItem[0].colors.length
        if(n>1){
            this.multi_image=true;
            for(var i=0;i<n;i++){
                this.selectedimage.push(this.selectedItem[0].item_image[0][this.selectedItem[0].colors[i]])}
        }
        else{
            this.multi_image=false;
            this.selectedimage=this.selectedItem[0].item_image[0][this.selectedItem[0].colors[0]]
        }
        console.log(this.selectedimage)
    }
   
    go_back(){
        this.detail=false;
        this.cartDetails.reset();
    }
    cart_details(choice,element)
    {
        let current_item={"item_id":"",
        "item_name":"",
        "item_brand":"",
        "item_price":"",
        "item_color":"",
        "item_size":"",
        "item_image":""};
        if(choice=='size')
            this.selectedsize=element;
        else if(choice=='color')
            this.selectedcolor=element;
        else if(choice=='cart'){
            current_item["item_id"]=element;
            current_item["item_name"]=this.selectedItem[0].item_name;
            current_item["item_brand"]=this.selectedItem[0].item_brand;
            current_item["item_price"]=this.selectedItem[0].item_price;
            current_item["item_color"]=this.selectedcolor;
            current_item["item_size"]=this.selectedsize;
            current_item["item_image"]=this.selectedItem[0].item_image[0][this.selectedcolor];
            this.cart_items.push(current_item)
            console.log(this.cart_items)   
            this.displayService.sendCartItemData(this.cart_items);
        }
    }

    delete_item(item){
        console.log(item);
        
    }
}