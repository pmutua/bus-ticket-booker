import { LocationService } from './../services/location.service';
import { Component, OnInit } from '@angular/core';
import { SelectBusService } from '../services/selectBus.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Journey_Route } from '../models/route.model';


import * as moment from 'moment';

@Component({
  selector: '.select-bus',
  templateUrl: './select-bus.component.html',
  styleUrls: ['./select-bus.component.css']
})
export class SelectBusComponent implements OnInit {
// ={
//   1109001:'comilla',
//   1109002:'Chittagong',
//   1109003:'Sylet',
//   1109004:'Barisal'
// }

pnumber=1;

places: Location[] = [];

matatus: any;

departureLocationName: string;
destinationLocationName: string;


destinationList: any;

  constructor(
    private BusService:SelectBusService,
    private locationService: LocationService,
    private router:Router
  ) {
  //  this.places[0] = new Location()
   }

  ngOnInit() {
    this.getLocations();

    // console.log(this.places)

  }



  SearchBus(form: NgForm) {

    // console.log(form.value)
    let leaving_from = form.value.leaving_from;

    let going_to = form.value.going_to;

    // console.log(going_to



    //
    let destination;


    this.places.filter(item=>{
      if(item.id ==form.value.going_to){
        destination=going_to;
      }
    })

    let date = form.value.depart_date;


    // const date = moment(form.value.depart_date).tz('Africa/Nairobi').format();
    // const date = c.toISOString();
    // console.log(date)

    let route:Journey_Route = {
      leaving_from: leaving_from,
      going_to: going_to,
      date:date,
      departureLocationName: leaving_from,
      destinationLocationName: going_to
    }

    // console.log(route)
    localStorage.setItem("route", JSON.stringify(route))
    // let routeId = form.value.going_to;

    const payload = {
      leavingFrom: leaving_from,
      goingTo: going_to,
      departureDate: date
    }

    this.BusService.getAllMatatusByRoute(payload);

    this.router.navigate(['search']);
  }

  onSelectLeavingFrom(e){

    const leavingfrom = e.target.value;

    this.departureLocationName = leavingfrom;

    this.locationService.getLocationName(leavingfrom).subscribe(
      res => {
        this.destinationList = res.data;
      }
    );


}

onSelectGoingTo(e){

  this.destinationLocationName = e.target.value;

  // console.log(goingTo)
  // this.locationService.getLocationName(goingTo).subscribe(
  //   res => {
  //     // console.log(res)
  //     this.destinationLocationName = res.name;
  //   }
  // );


}

getLocations() {
  this.locationService.getAllLocations().subscribe(
    res => {
      this.places = res;
    }
  );
}


}
export class Location {
  id: number;
  name: string;
}
