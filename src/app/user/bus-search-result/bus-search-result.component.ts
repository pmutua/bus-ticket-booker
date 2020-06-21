import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { SelectBusService } from '../services/selectBus.service';
import { Subscription } from 'rxjs';
import { Bus } from '../models/bus.model';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Router } from '@angular/router';

@Component({
  selector: 'search-result-info',
  templateUrl: './bus-search-result.component.html',
  styleUrls: ['./bus-search-result.component.css']
})
export class BusSearchResultComponent implements OnInit {
  subscription: Subscription;
  buses: Bus[] = [];
  modalRef: BsModalRef;
  route: any;

  payload =  new Object();




  constructor(
    private BusService: SelectBusService,
    private modalService: BsModalService,
    private router: Router
  ) { }

  ngOnInit() {
    this.route = JSON.parse(localStorage.getItem("route"));
    if (!this.route) {
      this.router.navigate([''])
    }

    // console.log(this.route)
    this.payload = {
      leavingFrom: this.route['leaving_from'],
      goingTo: this.route['going_to'],
      departureDate: this.route['date']
    };

    // console.log(this.route);
    // this.subscription = this.BusService.castId.subscribe(

    //   res =>{
    //     console.log(res)
    //     this.getAllMatatus(res);
    //   }

    // );

    this.getAllMatatus();

  }

  // getAllBus(res){
  //   let bus=new Object();
  //   this.BusService.getBus(res)
  //   .subscribe(
  //     res=>{
  //       for(let key in res){
  //         bus=res[key];
  //         bus['$key']=key;


  //      this.buses.push(bus as Bus);


  //       }
  //     }
  //   )





  // }

  getAllMatatus() {
    // console.log(res)
    let bus = new Object();

    this.BusService.getAllMatatusByRoute(this.payload).subscribe(
      res => {
        // console.log("check")
        // console.log(res)
        if (res.success ===true ) {
          const data = res.data;
          for (let key in data) {
            bus = JSON.parse(data[key]);
            // bus['matatuId'] = key;
            this.buses.push(bus as Bus);
            // console.log("show buses")
            // console.log(this.buses)
          }

        }


      }
    );
  }


  openModal(template: TemplateRef<any>, bus) {

    console.log(template)

    // localStorage.getItem("route")
    this.modalRef = this.modalService.show(template);
    // let journey={
    //   route:this.route,
    //   bus_info:bus,
    //   seats:
    // }

  }
  closeModal() {
    this.modalRef.hide();
  }



  // ngOnDestroy() {
  //   this.subscription.unsubscribe();
  // }

}
