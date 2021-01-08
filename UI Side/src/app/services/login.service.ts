import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  currentUser = new BehaviorSubject<any>(null);

  constructor() { }
  
  sendUserData(user){
      this.currentUser.next(user)
  }

}
