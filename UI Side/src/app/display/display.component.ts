import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ShopeaseService } from '../services/shopease.service';

@Component({
    selector: 'app-display',
    templateUrl: './display.component.html',
    styleUrls: ['./display.component.css']
})

export class DisplayComponent implements OnInit {
    categoryId = "";
    category_name=[];
    categories=[];
    sectionName = "";
    brandFilter: [];
    colorFilter: [];
    sizeFilter: [];
    items: any[] = [];
    maxPrice: number;
    minPrice: number;
    imagePath: any;
    imgURL = [];
    color: string;
    Size = [];
    Brand = [];
    Color = [];

    constructor(private route: ActivatedRoute, private shopeaseService: ShopeaseService) {
    }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.sectionName = params['section'];
            if (params['category_id']) {
                this.categoryId = params['category_id']
            }
        });

        this.get_data();
        this.get_items();
        this.get_categories();
    }
    /*get the filters*/
    get_data() {
        this.shopeaseService.get_filters(this.sectionName, this.categoryId).subscribe(filters => {
            console.log(filters);
            this.brandFilter = filters.filters[0].Brands.sort();
            this.colorFilter = filters.filters[0].Colors.sort();
            this.sizeFilter = filters.filters[0].Item_Size.sort();
            this.maxPrice = filters.filters[0].Maximum_Price;
            this.minPrice = filters.filters[0].Minimum_price;
        })
    }

    get_items() {
        this.shopeaseService.get_items(this.sectionName, this.categoryId).subscribe(item_list => {
            this.items = item_list.items[0].Categories[0].Items;
            for (var i = 0; i < this.items.length; i++) {
                let all_colors = item_list.items[0].Categories[0].Items[i].colors;
                if (all_colors.length > 1) {
                    for (let j = 0; j < all_colors.length; j++) {
                        this.imgURL.push(item_list.items[0].Categories[0].Items[i].item_image[0][all_colors[j]])
                        this.items.splice(i + j, 0, this.items[i]);
                    }
                    this.items.splice(i + all_colors.length, 1)
                    i = i + all_colors.length - 1
                }
                else
                    this.imgURL.push(item_list.items[0].Categories[0].Items[i].item_image[0][all_colors[0]]);
            }
            console.log(this.items)
            console.log(this.imgURL)
        })
    }

    get_categories() {
        this.shopeaseService.get_categories(this.sectionName).subscribe(categories => {
        this.categories=categories['categories'][0]['Categories']
        for(var i=0;i<this.categories.length;i++){
            this.category_name[i]=this.categories[i]['category_name']
        }
        console.log(this.category_name)
        })
    }

    filterSelectionItems(filterType, value) {
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

        let filter_brand = this.Brand
        let filter_size = this.Size
        let filter_color = this.Color

        if (this.Brand.length == 0)
            filter_brand = this.brandFilter

        if (this.Size.length == 0)
            filter_size = this.sizeFilter

        if (this.Color.length == 0)
            filter_color = this.colorFilter

        this.shopeaseService.get_filtered_items(filter_brand, filter_size, filter_color, this.sectionName, this.categoryId).subscribe(data => {
            this.items = []
            this.imgURL = []
            for (let item of data['filtered_items']) {
                let i = this.items.length - 1
                let all_colors = item['filtered_items'].colors;
                if (all_colors.length > 1) {
                    for (let j = 0; j < all_colors.length; j++) {
                        if (filter_color.includes(all_colors[j])) {
                            this.imgURL.push(item['filtered_items'].item_image[0][all_colors[j]])
                            this.items.splice(i + j, 0, this.items[i]);
                        }
                    }
                    i = i + all_colors.length - 1
                }
                else {
                    this.items.push(item['filtered_items'])
                    this.imgURL.push(item['filtered_items'].item_image[0][all_colors[0]]);

                }
            }
            console.log(this.items)
            console.log(this.imgURL);
        })
    }

}
