import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { StripereturnPage } from "./stripereturn.page";

const routes: Routes = [
  {
    path: "",
    component: StripereturnPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StripereturnPageRoutingModule {}
