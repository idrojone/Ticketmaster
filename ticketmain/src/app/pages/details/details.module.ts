import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DetailsRoutingModule } from "./details-routing-module";
import { DetailsComponent } from "./details.component";

@NgModule({
    imports: [
        DetailsComponent,
        CommonModule,
        DetailsRoutingModule
    ]
})

export class DetailsModule { }