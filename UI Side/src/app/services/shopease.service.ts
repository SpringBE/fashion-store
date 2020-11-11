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

  get_filters(sectionName,categoryName): Observable<any> {
    let url = `${this.baseurl}get-filters/${sectionName}/${categoryName}`;
    return this.http.get(url);
  }
  get_categories(sectionName): Observable<any> {
    let url = `${this.baseurl}categories/${sectionName}`;
    return this.http.get(url);
  }
  get_items(sectionName,categoryName): Observable<any> {
    let url = `${this.baseurl}get_items/${sectionName}/${categoryName}`;
    return this.http.get(url);
  }
  get_images(sectionName,categoryName,image_name): Observable<any> {
    let url = `${this.baseurl}images/${sectionName}/${categoryName}/${image_name}`;
    console.log(url)
    return this.http.get(url);
  }
}
