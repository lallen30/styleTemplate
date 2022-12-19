import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { Sendmoney3Page } from "./sendmoney3.page";

const routes: Routes = [
  {
    path: "",
    component: Sendmoney3Page,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Sendmoney3PageRoutingModule {}
