import { Component, OnInit } from '@angular/core';
import { BookingService } from '../services/booking.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.css']
})
export class PrintComponent implements OnInit {
createTicket;
  constructor(
    private BookingService:BookingService,
    private route:Router
  ) { }

  ngOnInit() {

    this.BookingService.cast.subscribe(
      res=>{
        this.createTicket = res;

        console.log("print stuff here")
        console.log(this.createTicket)
      })
    if(!this.createTicket){
      this.route.navigate([''])
    }


  }

}
