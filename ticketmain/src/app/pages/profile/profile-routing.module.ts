import { RouterModule, Routes } from "@angular/router";
import { ProfileModule } from "./profile.module";
import { NgModule } from "@angular/core";
import { Profile } from "./profile";

const routes: Routes = [
    {
        path: '',
        component: Profile,
        resolve: {}
    },
    {
        path: ':username',
        component: Profile,
        resolve: {}
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProfileRoutingModule {}