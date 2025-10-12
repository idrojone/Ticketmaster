import { NgModule } from "@angular/core";
import { SettingsRoutingModule } from "./settings-routing.module";
import { Settings } from "./settings";

@NgModule({
    imports: [
        SettingsRoutingModule,
        Settings,
    ]
})

export class SettingsModule { }