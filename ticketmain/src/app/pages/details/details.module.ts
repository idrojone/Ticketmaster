import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DetailsRoutingModule } from "./details-routing-module";
import { DetailsComponent } from "./details.component";
import { DetailsResolver } from "./details-resolver.service";


@NgModule({
    imports: [
        CommonModule,
        DetailsRoutingModule,
        DetailsComponent
    ],
})

export class DetailsModule { }