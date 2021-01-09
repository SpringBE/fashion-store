import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DisplayService {
 allCartItems = new BehaviorSubject<any>(null);
  constructor() { }

  sendCartItemData(data){
      this.allCartItems.next(data);
  }
}
