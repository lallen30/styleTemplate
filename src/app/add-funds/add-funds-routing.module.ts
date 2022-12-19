import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AddFundsPage } from "./add-funds.page";

const routes: Routes = [
  {
    path: "",
    component: AddFundsPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddFundsPageRoutingModule {}
