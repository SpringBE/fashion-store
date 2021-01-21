import { Component, OnInit } from '@angular/core';
import { MatDialog,MatDialogRef } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { LoginService } from '../services/login.service';
import { ShopeaseService } from '../services/shopease.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  men_categories:any[] = []
  women_categories:any[] = []
  boys_categories:any[] = []
  girls_categories:any[] = []
  user:any;

  constructor(public dialogRef:MatDialog,
    private shopEaseService:ShopeaseService,
    private loginService:LoginService,
    private router:Router) { }

  ngOnInit(): void {
    this.shopEaseService.get_categories('Men').subscribe(data=>{
        this.men_categories = data['categories'][0]['Categories']
    })

    this.loginService.currentUser.subscribe(data=>{
        this.user = data;
    })

    this.shopEaseService.get_categories('Women').subscribe(data=>{
        this.women_categories = data['categories'][0]['Categories']
    })

    this.shopEaseService.get_categories('Boys').subscribe(data=>{
        this.boys_categories = data['categories'][0]['Categories']
    })

    this.shopEaseService.get_categories('Girls').subscribe(data=>{
        this.girls_categories = data['categories'][0]['Categories']
    })
  }

  login_popUp(){
    const popUp = this.dialogRef.open(LoginComponent, {
      width: '350px',
      height: '535px',
      disableClose: true,
    });
   popUp.afterClosed().subscribe((result) => {
    });
  }
  log_out(){
    this.user = null;
    this.loginService.sendUserData(this.user);
    this.router.navigate(['/home'])
    let element=document.getElementById('dc');
    element.setAttribute('style','display:none;')
}

}
