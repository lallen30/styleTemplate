import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AddCashPage } from "./add-cash.page";

const routes: Routes = [
  {
    path: "",
    component: AddCashPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddCashPageRoutingModule {}
