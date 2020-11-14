import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ShopeaseService } from '../services/shopease.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation:ViewEncapsulation.None
})
export class HomeComponent implements OnInit {
  men_categories:any[] = []
  women_categories:any[] = []
  boys_categories:any[] = []
  girls_categories:any[] = []

  constructor(private shopEaseService:ShopeaseService) { }

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

  onTabClick(event){
    console.log(event['tab']['textLabel']);
  }
}