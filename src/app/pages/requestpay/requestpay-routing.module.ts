import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { RequestpayPage } from "./requestpay.page";

const routes: Routes = [
  {
    path: "",
    component: RequestpayPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestpayPageRoutingModule {}
