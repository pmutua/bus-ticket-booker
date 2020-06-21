
import { Injectable } from "@angular/core";

import { Bus } from "../models/bus.model";
import {BehaviorSubject} from 'rxjs'
import { environment } from '../../../environments/environment';

import { Observable, Subject } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Form, NgForm, FormGroup } from '@angular/forms';
import { tap } from 'rxjs/operators';

@Injectable()

export class SelectBusService {
    private Root_url = "http://localhost:9000";

    private headers = new HttpHeaders({
        'Content-Type': 'application/json',
        // 'Authorization': 'Bearer' + ' ' + localStorage.getItem('userToken')
      });



    private routeId= new Subject<any> ();

    castId=this.routeId.asObservable();

    private listeners = new Subject<any>();

    get refreshNeeded() {
      return this.listeners;
    }


    constructor(
        private http: HttpClient,
    ) { }


    getAllMatatusByRoute(payload: any) {
        console.log(payload)
        const extra_url = `leavingFrom=${payload['leavingFrom']}&goingTo=${payload['goingTo']}&departureDate=${payload['departureDate']}`
        // console.log(extra_url)
        return this.http.get<any>(`${environment.apiUrl}/api/mbs/get_matatus_by_route/?`+ extra_url, {
          headers: this.headers
        })

          .pipe(
            tap(() => {
              this.listeners.next();
            })
          );
      }

    getBus(routeId) {
       return this.http.get(this.Root_url + 'buses/'+routeId+'.json');
    }

    getRoueId(routeId){
        this.routeId.next(routeId)
    }


    getFillupseat(key: number) {

       return  this.http.get(this.Root_url + '/matatu/' + `${key}` + '/');
    }

    getRoute(key){
        return  this.http.get(this.Root_url+'routes/'+key+'.json')
    }

    listen(): Observable<any> {
        return this.listeners.asObservable();
      }

      filter(filterBy: string) {
        this.listeners.next(filterBy);
      }

}
