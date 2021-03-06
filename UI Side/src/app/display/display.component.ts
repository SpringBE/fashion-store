import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ShopeaseService } from '../services/shopease.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DisplayService } from '../services/display.service';
import {LoginService } from '../services/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    quantity:number;
    selectedsize:string;
    selectedcolor:string;
    selectedquantity:string;
    pricedItems=[];
    selectedItem=[];
    selectedimage=[];
    cartDetails:FormGroup;
    user:any;
    wishList_items: any;
    isSearchTrue:boolean;
    search_selected_id: any;
    constructor(private route: ActivatedRoute, 
        private shopeaseService: ShopeaseService,
        private fb: FormBuilder,
        private displayService:DisplayService,private _snackBar: MatSnackBar,private loginService: LoginService) {
        this.cartDetails = this.fb.group({
            size: ['', Validators.required],
            color: ['', Validators.required]
          });
    }

    ngOnInit(): void {
        this.loginService.currentUser.subscribe(data=>{
            this.user = data;
        })

        this.route.params.subscribe(params => {
            this.sectionName = params['section'];
            console.log(params)
            if(params['search'] == "true"){
                this.detail = true;
                this.isSearchTrue = true;
                this.search_selected_id = params['item_id']
            }
            else{
                this.isSearchTrue = false;
            }
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
        if(!this.isSearchTrue){
            this.detail=false;
        }
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
        if(!this.isSearchTrue){
            this.detail=false;
        }
        this.shopeaseService.get_categories(this.sectionName).subscribe(categories => {
        this.categories=categories['categories'][0]['Categories']
        console.log(this.categories)
        })
    }
    get_items() {
        if(!this.isSearchTrue){
            this.detail=false;
            console.log("Detail page")
        }
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
            if(this.isSearchTrue){
                this.product_detail(this.search_selected_id);
                console.log("Yes");
                console.log(this.selectedItem);
            }
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
                console.log(id);
            }
        }
        console.log(this.selectedItem)
        console.log(this.categoryId)
        this.quantity=this.selectedItem[0].item_qty;
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
        "prev_item_qty":"",
        "item_color":"",
        "item_quantity":"",
        "item_size":"",
        "item_image":"",
        "item_section":"",
        "item_category":""};
        if(choice=='size')
            this.selectedsize=element;
        else if(choice=='color')
            this.selectedcolor=element;
        else if(choice=='quantity')
            this.selectedquantity=(<HTMLInputElement>document.getElementById("quantity")).value
        else if(choice=='cart'){
            current_item["item_id"]=element;
            current_item["item_name"]=this.selectedItem[0].item_name;
            current_item["item_brand"]=this.selectedItem[0].item_brand;
            current_item["item_price"]=this.selectedItem[0].item_price;
            current_item["prev_item_qty"]=this.selectedItem[0].item_qty;
            current_item["item_color"]=this.selectedcolor;
            current_item["item_quantity"]=this.selectedquantity;
            current_item["item_size"]=this.selectedsize;
            current_item["item_image"]=this.selectedItem[0].item_image[0][this.selectedcolor];
            current_item["item_section"]=this.sectionName;
            current_item["item_category"]=this.categoryId;
            console.log(this.categories)
            this.categories.forEach(element=>{
                    if(this.categoryId == element.category_id){
                        current_item['item_category'] = element.category_name;
                    }
            })
            this.cart_items.push(current_item)
            console.log(this.cart_items)   
            this.displayService.sendCartItemData(this.cart_items);
            this._snackBar.open("Item Added Successfully", " ", {
                duration: 2000,
            });
        }
    }

    delete_item(item){
        let data = {"category_id":this.categoryId, "section_name":this.sectionName, "item_id":item.item_id}
        this.shopeaseService.delete_item(data).subscribe(result=>{
            if(result['deleted']){
                this._snackBar.open("Item Deleted Successfully", " ", {
                    duration: 2000,
                });
                this.get_items();
            }
            else{
                this._snackBar.open("Something went wrong", "Please try again...", {
                    duration: 2000,
                });
            }
        })
    }

    wishlist_item(item){
        this.wishList_items.push(item)
        console.log(this.wishlist_item);
    }
}