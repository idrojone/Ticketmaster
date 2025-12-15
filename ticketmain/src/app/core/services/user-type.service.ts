import { BehaviorSubject, Observable } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class UserTypeService {
    private userTypeService = new BehaviorSubject<string | null>(null);
    
    public userType$ : Observable<string | null> = this.userTypeService.asObservable();

    setUserType(userType: string ) {
        this.userTypeService.next(userType);
    }

    clearUserType() {
        this.userTypeService.next(null);
    }

    getUserType(): string | null {
        return this.userTypeService.value;
    }

}