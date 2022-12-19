import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { SendmoneyPage } from "./sendmoney.page";

const routes: Routes = [
  {
    path: "",
    component: SendmoneyPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SendmoneyPageRoutingModule {}
