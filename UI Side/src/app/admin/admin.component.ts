import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { ShopeaseService } from '../services/shopease.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
    user:any;
    addProductForm:FormGroup;
    addProduct:boolean;
    deleteProduct:boolean;
    changePassword:boolean;
    showOverview:boolean;
    showOrders:boolean;
    categories: any;
    brands = ['Aura', 'BST', 'Dazzler', 'Mono', 'Paradise', 'Silvera', 'Wings'];
    sizes = ['XS','S','M','L','XL','XXL','XXXL'];
    colorPage: boolean;
    descriptionPage: boolean;
    message: string;
    images:any = [];
    colors:any = [];
    elements = 1;
    selected_section: any = 'Men';
    change_password:FormGroup;
    typeOfOrders: any = 'Total Orders';
    all_orders: any;
    deliveredOrders: any = [];
    UndeliveredOrders: any = [];
    constructor(private route: ActivatedRoute,
      private fb: FormBuilder,
      private shopEaseService:ShopeaseService,
      private _snackBar: MatSnackBar,
      private loginService: LoginService,
      private router: Router) {
  
      this.addProductForm = this.fb.group({
          name: ['', Validators.required],
          section:['', Validators.required],
          category:['', Validators.required],
          price:['', Validators.required],
          brand:['', Validators.required],
          qty:['', Validators.required],
          size:[[], Validators.required],
          colors:[[], Validators.required],
          images:[[], Validators.required],
          details:[[], Validators.required]
      });

      this.change_password = this.fb.group({
          currentPassword:['', Validators.required],
          setPassword:['', Validators.required],
          reEnterPassword:['', Validators.required]
      })
     }
  
    ngOnInit(): void {
      this.loginService.currentUser.subscribe(data=>{
          this.route.params.subscribe(params => {
              this.user = data;
              if(params['id'] == 'overview' && this.user){
                  this.goToOverview();
              }
              else if(params['id'] == 'add-product' && this.user){
                  console.log(this.user);
                  this.goToAddProduct();
              }
              else if(params['id'] == 'delete-product' && this.user){
                  this.goToDeleteProduct();
              }
              else if(params['id'] == 'change-password' && this.user){
                  this.goToChangePassword();
              }
              else if(params['id'] == 'orders' && this.user){
                  this.goToOrders();
                  this.getAllOrders();
              }
          });
      })
    }
  
    goToAddProduct(){
      this.addProduct = this.descriptionPage = true;
      this.changePassword = this.deleteProduct = this.showOverview = this.showOrders = false;
    }
  
    goToDeleteProduct(){
      this.deleteProduct = true;
      this.addProduct = this.changePassword = this.showOverview = this.showOrders = false;
      this.shopEaseService.get_categories("Men").subscribe(data=>{
        this.categories = data['categories'][0]['Categories'];
        console.log(this.categories);
    })
    }
  
    goToChangePassword(){
      this.changePassword = true;
      this.addProduct = this.deleteProduct = this.showOverview = this.showOrders = false;
    }

    goToOverview(){
        this.showOverview = true;
        this.addProduct = this.deleteProduct = this.changePassword = this.showOrders = false;
    }

    goToOrders(){
        this.showOrders = true;
        this.addProduct = this.deleteProduct = this.changePassword = this.showOverview =  false;
    }
    
    get_categories(){
        console.log(this.addProductForm.value);
        this.shopEaseService.get_categories(this.addProductForm.value.section).subscribe(data=>{
            this.categories = data['categories'][0]['Categories'];
            console.log(this.categories);
        })
    }

    log_out(){
        this.user = null;
        this.loginService.sendUserData(this.user);
        this.router.navigate(['/home'])
    }

    goToColorPage(){
        this.colorPage = true;
        this.descriptionPage = false;
    }

    goToDescriptionPage(){
        this.descriptionPage = true;
        this.colorPage = false;
    }

    remove_colorImg(i){
        this.colors.splice(i, 1);
        this.images.splice(i, 1);
        var input1 = document.getElementById('file'+i);
        input1.parentNode.removeChild(input1);
        var input2 = document.getElementById('color'+i)
        input2.parentNode.removeChild(input2);
        var input3 = document.getElementById('button'+i);
        input3.parentNode.removeChild(input3);
    }

    submitProduct(){
        this.addProductForm.patchValue({
            colors:this.colors,
            images:this.images
        })
        console.log(this.addProductForm.value)
        this.shopEaseService.add_item(this.addProductForm.value, this.addProductForm.value.images).subscribe(data=>{
            console.log(data);
        })
    }

    image_upload(file, i){
        this.images[i] = file.item(0);
        console.log(this.images)
    }

    addProductInterface(){
        this.elements += 1
    }

    counter(i){
        return new Array(i)
    }

    onTabClickDelete(event){
        this.selected_section = event['tab']['textLabel']
        this.shopEaseService.get_categories(this.selected_section).subscribe(data=>{
            this.categories = data['categories'][0]['Categories'];
            console.log(this.categories);
        })
    }

    onTabClickOrders(event){
        this.typeOfOrders = event['tab']['textLabel'];
    }

    save_password(){
        console.log(this.change_password.value)
        if(this.user[0].password == this.change_password.value.currentPassword){
            if(this.change_password.value.reEnterPassword == this.change_password.value.setPassword){
                let data = {"email":this.user[0].email, "password":this.change_password.value.setPassword};
                this.shopEaseService.changePassword(data).subscribe(data=>{
                    if(data['isSet']){
                        this._snackBar.open("Password changed successfully", "", {
                            duration: 2000,
                        });
                        this.shopEaseService.get_currentUser_details(this.user[0].email).subscribe(data=>{
                            this.user = data['details'];
                            console.log(this.user);
                            this.loginService.sendUserData(data['details']);
                        })
                        this.change_password.reset();
                        this.router.navigate(['/admin/overview'])
                    }
                    else{
                        this._snackBar.open("Something went wrong", "Please try again..", {
                            duration: 2000,
                        });
                    }
                })
            }
            else{
                this._snackBar.open("Re enter the password correctly", "", {
                    duration: 2000,
                });
            }
        }
        else{
            this._snackBar.open("Invalid Password", "Please try again..", {
                duration: 2000,
            });
        }
    }
    getAllOrders(){
        this.all_orders = this.deliveredOrders = this.UndeliveredOrders = [];
        this.shopEaseService.get_all_orders().subscribe(data=>{
            this.all_orders = data['orders'];
            console.log(this.all_orders)
            this.all_orders.forEach(element => {
                if(element.delivered){
                    this.deliveredOrders.push(element)
                }
                else{
                    this.UndeliveredOrders.push(element)
                }
            });
            console.log(this.deliveredOrders);
            console.log(this.UndeliveredOrders);
        });
    }

    set_delivery(i){
        this.shopEaseService.set_order(this.all_orders[i].order_id).subscribe(data=>{
            if(data['isSet']){
                this._snackBar.open("Order is set to delivery", "", {
                    duration: 2000,
                });
                this.getAllOrders();
            }
            else{
                this._snackBar.open("Something went wrong", "Please try again..", {
                    duration: 2000,
                });
            }
        })
    }
}

