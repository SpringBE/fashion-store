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
}
