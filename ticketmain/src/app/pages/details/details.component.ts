import { Component, OnInit } from "@angular/core";


@Component({
    selector: 'app-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.css'],
    standalone: true
})

export class DetailsComponent  implements OnInit {
   ngOnInit() {
        console.log('DetailsComponent initialized');
   }
}