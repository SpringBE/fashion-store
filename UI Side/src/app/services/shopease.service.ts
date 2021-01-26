import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ShopeaseService {
    baseurl = environment.baseUrl
    constructor(public http: HttpClient) { }

    get_filters(sectionName, categoryName): Observable<any> {
        let url = `${this.baseurl}get-filters/${sectionName}/${categoryName}`;
        return this.http.get(url);
    }

    get_categories(sectionName): Observable<any> {
        let url = `${this.baseurl}categories/${sectionName}`;
        return this.http.get(url);
    }

    get_items(sectionName, categoryName): Observable<any> {
        let url = `${this.baseurl}get_items/${sectionName}/${categoryName}`;
        return this.http.get(url);
    }

    get_images(sectionName, categoryName, image_name): Observable<any> {
        let url = `${this.baseurl}images/${sectionName}/${categoryName}/${image_name}`;
        return this.http.get(url);
    }

    get_filtered_items(brand,size,color,minprice,maxprice,sectionName,categoryName):Observable<any>{
        let url = `${this.baseurl}filtered-items/${brand}/${size}/${color}/${minprice}/${maxprice}/${sectionName}/${categoryName}`;
        return this.http.get(url);
    }

    user_login_validation(details){
        let url = `${this.baseurl}sign-in`;
        return this.http.post(url, details);
    }

    registration_process(details){
        let url = `${this.baseurl}sign-up`;
        return this.http.post(url, details);
    }

    save_address(details){
        let url = `${this.baseurl}save-address`;
        return this.http.post(url, details);
    }

    get_currentUser_details(email){
        let url = `${this.baseurl}get-userInfo/${email}`;
        return this.http.get(url)
    }

    update_profile(details){
        let url = `${this.baseurl}update-profile`;
        return this.http.post(url, details);
    }

    add_item(details, images){
        let url = `${this.baseurl}add-item`;
        const formData: FormData = new FormData();
        formData.append('details',JSON.stringify(details));
        for(var image of images){
            console.log(image.value)
            formData.append('images', image, image.name);
        }
        console.log(formData.getAll('images'))
        return this.http.post(url, formData);
    }

    add_cart_items(cart_items,total,date,address,email){
        let url = `${this.baseurl}add-to-cart`;
        console.log(cart_items)
        let data = {"cart_items":cart_items, "grand_total":total, "order_date":date,"address":address,"email":email}
        return this.http.post<any>(url,data);
      }

    get_order_details(email){
        let url = `${this.baseurl}order-details/${email}`
        return this.http.get(url);
    }

    delete_item(data){
        let url = `${this.baseurl}delete-item`;
        return this.http.post(url, data);
    }

    changePassword(data){
        let url = `${this.baseurl}change-password`;
        return this.http.post(url, data);
    }

    get_all_orders(){
        let url = `${this.baseurl}all-orders`;
        return this.http.get(url);
    }

    set_order(id){
        let url = `${this.baseurl}set-order-to-delivery/${id}`;
        return this.http.get(url);
    }

    search_products(pattern){
        let url = `${this.baseurl}search/${pattern}`;
        return this.http.get(url);
    }
}


