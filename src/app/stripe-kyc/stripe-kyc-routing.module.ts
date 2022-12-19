import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { StripeKycPage } from "./stripe-kyc.page";

const routes: Routes = [
  {
    path: "",
    component: StripeKycPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StripeKycPageRoutingModule {}
