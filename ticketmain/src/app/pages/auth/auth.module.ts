import { NgModule } from "@angular/core";
import { Auth } from "./auth";
import { AuthRoutingModule } from "./auth-routing.module";
import { NoAuthGuard } from "src/app/core/guards/no-auth-guard.service";


@NgModule({
    imports: [
        AuthRoutingModule,
        Auth
    ],
    providers: [
        NoAuthGuard
    ]

})
export class AuthModule { }