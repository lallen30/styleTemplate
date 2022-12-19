import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { StripeKycPageRoutingModule } from "./stripe-kyc-routing.module";

import { StripeKycPage } from "./stripe-kyc.page";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, StripeKycPageRoutingModule],
  declarations: [StripeKycPage],
})
export class StripeKycPageModule {}
