import { TokenService } from "../token.service";
import { Injectable } from "@angular/core";
import { User } from "./user";
import jwt_decode from 'jwt-decode';
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class UserService {
    private userSubject = new BehaviorSubject<User>({});

    constructor(private tokenService: TokenService){
        if(this.tokenService.haveToken()){
            this.decodeJWT();
        }
    }

    private decodeJWT(){
        const token = this.tokenService.returnToken();
        const user = jwt_decode(token) as User;
        this.userSubject.next(user);
    }
    returnUser(){
        return this.userSubject.asObservable();
    }

    savToken(token: string){
        this.tokenService.saveToken(token);
        this.decodeJWT();
    }

    logout(){
        this.tokenService.deleteToken();
        this.userSubject.next({});
    }

    isLogged(){
        return this.tokenService.haveToken();
    }
} 