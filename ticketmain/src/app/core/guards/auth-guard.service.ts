import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { UserService } from "../services/user.service";
import { Observable, take } from "rxjs";

export class AuthGuardService implements CanActivate {
    private router = inject(Router);
    private userService = inject(UserService);

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> {
        return this.userService.isAuth.pipe(take(1));
    }
}