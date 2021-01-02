import { Component, OnInit } from '@angular/core';
import { MatDialog,MatDialogRef } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { ShopeaseService } from '../services/shopease.service';

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

  constructor(public dialogRef:MatDialog,
    private shopEaseService:ShopeaseService) { }

  ngOnInit(): void {
    this.shopEaseService.get_categories('Men').subscribe(data=>{
        this.men_categories = data['categories'][0]['Categories']
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
      height: '525px',
      disableClose: true,
    });
   popUp.afterClosed().subscribe((result) => {
    });
  }

}
