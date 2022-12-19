import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { StripereturnPageRoutingModule } from "./stripereturn-routing.module";

import { StripereturnPage } from "./stripereturn.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StripereturnPageRoutingModule,
  ],
  declarations: [StripereturnPage],
})
export class StripereturnPageModule {}
