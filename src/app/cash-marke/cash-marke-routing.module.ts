import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { CashMarkePage } from "./cash-marke.page";

const routes: Routes = [
  {
    path: "",
    component: CashMarkePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CashMarkePageRoutingModule {}
