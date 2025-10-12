import { RouterModule, Routes } from "@angular/router";
import { AuthGuardService } from "src/app/core/guards/auth-guard.service";
import { Settings } from "./settings";
import { NgModule } from "@angular/core";

const routes: Routes = [
    {
        path:  '',
        component: Settings,
        canActivate: [AuthGuardService]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class SettingsRoutingModule {}