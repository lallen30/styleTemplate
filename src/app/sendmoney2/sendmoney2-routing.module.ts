import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { Sendmoney2Page } from "./sendmoney2.page";

const routes: Routes = [
  {
    path: "",
    component: Sendmoney2Page,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Sendmoney2PageRoutingModule {}
