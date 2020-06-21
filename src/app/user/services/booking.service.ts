import { Journey_Route } from './../models/route.model';
import { Injectable } from "@angular/core";
import { Journey } from "../models/journey.model";
import {HttpHeaders,  HttpClient } from "@angular/common/http";
import { UserService } from "./user.service";
import { User } from "../models/user.model";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";

@Injectable()

export class BookingService {

    journey_info= new BehaviorSubject('')
    cast= this.journey_info.asObservable();
    private USerId;
    private Root_Url = "http://localhost:9000"

    reqUser: any;
    reqTicket: any;
    ticketNo: any;


    private headers = new HttpHeaders({
      'Content-Type': 'application/json',
      // Authorization: 'Bearer' + ' ' + localStorage.getItem('userToken')
    });
    constructor(
        private http: HttpClient,
        private UserService: UserService,
        private router: Router
    ) { }

    // userBooking(jourey:Journey) {
    //     this.http.post(this.Root_Url+'user_booking',jourey)
    // }

    async seatBooking(journey: Journey, user) {

        const busID = journey.bus.matatuId;
        let booking = new Object();
        let key = new Date(journey.journey_route.date).getTime();

        await this.createUserID(user).subscribe(
            res => {
                this.reqUser = res;
                // console.log(this.reqUser)
                user = Object(this.reqUser.data);

                let  description = '';
                journey.seats.forEach(element => {
                    description += element + ',' + ' ';

                });

                booking = {
                    route_id: journey.bus.route_id,
                    matatu_id: busID,
                    user_id: user.id,
                    no_of_seats: journey.seats.length,
                    seats: journey.seats,
                    description: description,
                    // time: key
                };

                const payload = JSON.stringify(booking);

                this.createBooking(payload);
            });

    }





    // private async createBookingDate(journey: Journey, key, booking, busID) {

    //     await this.create(journey, key, busID, booking)
    //     // await this.createBooking(booking, key,busID)

    // }

    // private async  create(journey: Journey, key, busID, booking) {
    //     let location = journey.journey_route.leaving_from + ' to ' + journey.journey_route.going_to;
    //     this.http.post(this.Root_Url + 'booking/' + key + '/' + busID + '.json', {

    //         bus: {
    //             location: location,
    //             name: journey.bus.name,
    //             coach_type: journey.bus.coach_type,
    //             nfareame: journey.bus.fare,
    //             time: journey.bus.time,
    //             seat: journey.bus.seat
    //         }
    //     })
    //         .subscribe(res => {
    //             this.createBooking(booking, key, busID);
    //         },
    //             error => console.log(error))
    // }

    // private CheckBusID(busID, key, booking, journey) {
    //     let busidArray = [];
    //     this.http.get(this.Root_Url + 'booking/' + key + '.json')
    //         .subscribe(res => {
    //             for (let key in res) {
    //                 busidArray.push(key)
    //             }
    //             if (busidArray.indexOf(String(busID)) > -1) {
    //                 this.createBooking(booking, key, busID);
    //             }
    //             else {
    //                 this.create(journey, key, busID, booking);
    //             }
    //         });
    // }

    // private async chekBookingDate_BusInfo(key, journey, booking, busID) {

    //     console.log("---------------------------")


    //     console.log(key)
    //     console.log(journey)
    //     console.log(booking)
    //     console.log(busID)


    //     let keys = [];
    //     console.log(keys)
    //     this.http.get(this.Root_Url + '/mbs/book_seat/')
    //         .subscribe(
    //             res => {
    //                 for (let key in res) {
    //                     keys.push(key)
    //                 }
    //                 if (keys.indexOf(String(key)) > -1) {
    //                     this.CheckBusID(busID, key, booking, journey)
    //                 }
    //                 else {
    //                     this.createBooking(journey, key, booking, busID);
    //                 }
    //             }
    //         );
    // }

    private createBooking(booking) {

        // console.log(booking)
        this.http.post(this.Root_Url + '/booking/', booking,    {
          headers: this.headers
        })
            .subscribe(res => {

                this.createPrintView(res);
            },

                err => console.log(err));


    }

    private createUserID(user) {
        localStorage.setItem("user",JSON.stringify(user))
        return this.UserService.createUser(user)

    }


    createPrintView (res){
        console.log('ready to print res')

        let journey= JSON.parse(localStorage.getItem("journey"));
        let user= JSON.parse(localStorage.getItem("user"));

        let Ticket= {
            ticketId: res.data,
            journey:journey,
            user:user
        }
        this.getJourneyInfo(Ticket);
        this.router.navigate(['print']);
    }

    getJourneyInfo(Ticket){

        console.log(Ticket)
        this.journey_info.next(Ticket);
        localStorage.removeItem("journey");
        localStorage.removeItem("route");
        localStorage.removeItem("user");
    }


}



