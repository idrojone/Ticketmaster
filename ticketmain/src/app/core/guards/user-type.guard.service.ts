import { inject, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from "@angular/router";
import {JwtService } from "../services/jwt.service";
import { jwtDecode } from 'jwt-decode';
import { UserTypeService } from 'src/app/core/services/user-type.service';



@Injectable({ providedIn: 'root' })
export class UserTypeGuard implements CanActivate {
    private jwtService = inject(JwtService);
    private router = inject(Router);

    private userTypeService = inject(UserTypeService);

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const token = this.jwtService.getAccessToken();

        if(token) {
            try {
                const decodedToken: any = jwtDecode(token);
                console.log('Decoded token:', decodedToken);
                const userType = decodedToken.role;

                const isAdmin = this.userTypeService.getUserType() === 'admin';
                const isEmpresa = this.userTypeService.getUserType() === 'empresa';

                console.log(userType, isAdmin);

                if(userType === 'admin' && isAdmin) {
                    console.log('User is admin, access granted.');
                    return true;
                } else if (userType === 'empresa' && isEmpresa) {
                    console.log('User is empresa, access granted.');
                    return true;
                } else {
                    this.router.navigateByUrl('/auth/login');
                    return false;
                }
            } catch (error) {
                console.error('Error decoding token:', error);
                this.router.navigateByUrl('/auth/login');
                return false;
            }
        }

        // No token found
        console.log('No token found');
        this.router.navigateByUrl('/auth/login');
        return false;
    }

}