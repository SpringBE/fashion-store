import { Component, OnInit } from '@angular/core';
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
    categories: any;
    brands = ['Aura', 'BST', 'Dazzler', 'Mono', 'Paradise', 'Silvera', 'Wings'];
    sizes = ['XS','S','M','L','XL','XXL','XXXL'];
    colorPage: boolean;
    descriptionPage: boolean;
    color;
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
          color:[[], Validators.required],
          image:[[], Validators.required],
          details:[[], Validators.required]
      });
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
          });
      })
    }
  
    goToAddProduct(){
      this.addProduct = this.descriptionPage = true;
      this.changePassword = this.deleteProduct = this.showOverview = false;
    }
  
    goToDeleteProduct(){
      this.deleteProduct = true;
      this.addProduct = this.changePassword = this.showOverview = false;
    }
  
    goToChangePassword(){
      this.changePassword = true;
      this.addProduct = this.deleteProduct = this.showOverview = false;
    }

    goToOverview(){
        this.showOverview = true;
        this.addProduct = this.deleteProduct = this.changePassword = false;
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
}
