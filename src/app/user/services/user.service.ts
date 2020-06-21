import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient } from "@angular/common/http";

@Injectable()
export class UserService {

    private headers = new HttpHeaders({
      'Content-Type': 'application/json',
      // Authorization: 'Bearer' + ' ' + localStorage.getItem('userToken')
    });

    private Root_Url = "http://localhost:9000"
    constructor(
        private http:HttpClient
    ){}

    createUser(user){
      return   this.http.post(this.Root_Url + '/mbs/create_user/', user,
      {
        headers: this.headers
      });
    }
}
