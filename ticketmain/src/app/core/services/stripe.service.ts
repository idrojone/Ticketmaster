// import { inject } from "@angular/core";
// import { ApiService } from "./api.service";
// import { Stripe, loadStripe } from "stripe";

// export class StripeService {
     
//     private apiService = inject(ApiService);
//     private stripe: Stripe;

//     constructor() {
//         this.stripe = await loadStripe('');
//     }
    
//     async pay() {
//         const response = await fetch('http://localhost:3000/pay' , {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//         })

//         const { clientSecret } = await response.json();

//         const result = await this.stripe.confirmCardPayment(clientSecret, {
//             payment_method: {
//                 card: this.cardElement,
//             },
//         });
//     }
    
// }