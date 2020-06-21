import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
} from "@angular/core";
import { Seat } from "../models/seat.model";
import { Journey } from "../models/journey.model";
import { Journey_Route } from "../models/route.model";
import { Router } from "@angular/router";
import { Bus } from "../models/bus.model";
import { SelectBusService } from "../services/selectBus.service";
import { Subscription } from "rxjs";

@Component({
  selector: "select-seat",
  templateUrl: "./select-seat.component.html",
  styleUrls: ["./select-seat.component.css"],
})
export class SelectSeatComponent implements OnInit, OnDestroy {
  @Input("bus") bus: Bus;
  @Output("closeModal") closeModal = new EventEmitter();
  showSeatList: Seat[] = [];
  total = 0;
  fillupSeat = [];
  alert = false;

  resp: any;
  subscription: Subscription;
  constructor(private route: Router, private BusService: SelectBusService) {}

  ngOnInit() {
    this.getbookSeat();
    console.log("bus here");
    console.log(this.bus);
  }

  Seat(e) {
    let seats = [];
    seats = this.showSeatList.map((iteam) => {

      return iteam.seatNo;
    });

    let id = document.getElementById(e);

    if (this.fillupSeat.indexOf(String(e)) < 0 && seats.indexOf(e) < 0) {
      if (this.showSeatList.length != 4) {
        id.innerHTML = `<img src="../assets/img/fseat.png" alt="">`;

        let seat = {
          seatNo: e,
          fare: this.bus.fare,
          seatClass: "economy",
        };
        this.totalFare(seat.fare);
        this.showList(seat);
      } else {
        this.alert = true;
      }
    }
  }

  showList(seat) {
    this.showSeatList.push(seat);
  }

  totalFare(fare) {
    this.total += fare;
  }

  confirmJourney() {
    let route: Journey_Route = JSON.parse(localStorage.getItem("route"));

    console.log("print route here");

    console.log(route);

    let seats = [];
    seats = this.showSeatList.map((iteam) => {
      return iteam.seatNo;
    });

    let journey: Journey = {
      bus: this.bus,
      seats: seats,
      fare: Number(this.total),
      journey_route: route,
    };

    localStorage.setItem("journey", JSON.stringify(journey));
    this.route.navigate(["user-form"]);
    this.closeModal.emit();
  }

  getbookSeat() {
    let route: Journey_Route = JSON.parse(localStorage.getItem("route"));
    let busid = this.bus.matatuId;
    // let key = String(new Date(route.date).getTime());
    console.log(busid);
    this.subscription = this.BusService.getFillupseat(busid).subscribe(
      res => {
        this.resp = res;
        console.log("get items");
        // console.log(resp)

        this.resp.data.seats.forEach(element => {
            if (element.is_available === false) {
              this.fillupSeat.push(element.seat_no);
              this.changeSeatColor(element.seat_no);

            }

          // console.log(element);
        });
        // for (let i in this.resp.data.seats){
        //   console.log(i)
        //   // console.log()
        //     this.fillupSeat.push(i["seat_no"]);
        //     this.changeSeatColor(i["seat_no"]);
        // }
      }
    );
  }

  changeSeatColor(seatNo) {

    console.log(seatNo)
    let id = document.getElementById(seatNo);
    id.innerHTML = `  <img src="../assets/img/bookseat.png">`;
    id.removeEventListener("click", this.Seat);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
