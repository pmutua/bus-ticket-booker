import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

import { Observable, Subject } from 'rxjs';

import { Form, NgForm, FormGroup } from '@angular/forms';
import { tap } from 'rxjs/operators';


@Injectable()
export class LocationService {

  permitData: any;

  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    // 'Authorization': 'Bearer' + ' ' + localStorage.getItem('userToken')
  });

  // private header2 = new HttpHeaders({
  //   'Content-Type': 'application/json',
  //   'Authorization': 'Bearer' + localStorage.getItem('userToken')
  // });

  private listeners = new Subject<any>();

  get refreshNeeded() {
    return this.listeners;
  }

  constructor(public http: HttpClient) { }

  getLocationName(name: string) {
    return this.http.get<any>(`${environment.apiUrl}/api/mbs/routes/?q=`+ name, {
      headers: this.headers
    })

      .pipe(
        tap(() => {
          this.listeners.next();
        })
      );
  }

  getAllLocations() {
    return this.http.get<any>(`${environment.apiUrl}/api/mbs/locations/`, {
      headers: this.headers
    })

      .pipe(
        tap(() => {
          this.listeners.next();
        })
      );
  }


  private handleError(err) {
    throw err;
  }


  listen(): Observable<any> {
    return this.listeners.asObservable();
  }

  filter(filterBy: string) {
    this.listeners.next(filterBy);
  }




}
