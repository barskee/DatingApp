import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import {map} from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl; 
  private currentUserSource = new ReplaySubject<User>(1); //storuje jeden obiekt mozna wpsiac więcej 
  currentUser$ = this.currentUserSource.asObservable(); 

  constructor(private http: HttpClient) { }
  login(model: any){
    return this.http.post<User>(this.baseUrl + 'account/login', model).pipe(
      map((response: User) => {
        const user = response; 
        if(user){
          this.setCurrentUser(user); 
        }
      })
    )
  }

  setCurrentUser(user: User)
  {
      user.roles = [];
      const roles = this.getDecodedToken(user.token).role; 
      //jesli uzytkownik ma wicej niz jedną rolę, przyjdzie w tokenie jako array, ale jeśli ma tylko jedną, przyjdzie jako zwykły string 
      //trzeba dorobic logikę do odczytu takiej sytuacji 
      Array.isArray(roles) ? user.roles = roles: user.roles.push(roles); 
      
      localStorage.setItem('user', JSON.stringify(user));
      this.currentUserSource.next(user); 
  }

  register(model:any){
    return this.http.post(this.baseUrl + 'account/register', model).pipe(
      map((user: User) =>{
        if(user){
          this.setCurrentUser(user); 
        }
      })
    )
  }

  logout(){
    localStorage.removeItem('user');
    this.currentUserSource.next(null); 
  }

  getDecodedToken(token){
    return JSON.parse(atob(token.split('.')[1])); 

  }
}
