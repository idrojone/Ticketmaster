import { NgModule } from "@angular/core";
import { NgModel } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { Auth } from "./auth";
import { NoAuthGuard } from "src/app/core/guards/no-auth-guard.service";

const routes = [
    {
        path: 'login',
        component: Auth,
        canActivate: [NoAuthGuard]
    },
    {
        path: 'register',
        component: Auth,
        canActivate: [NoAuthGuard]
    }
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule] 
})

export class AuthRoutingModule { }