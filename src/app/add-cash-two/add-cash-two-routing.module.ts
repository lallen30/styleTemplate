import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AddCashTwoPage } from "./add-cash-two.page";

const routes: Routes = [
  {
    path: "",
    component: AddCashTwoPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddCashTwoPageRoutingModule {}
