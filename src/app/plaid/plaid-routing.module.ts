import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { PlaidPage } from "./plaid.page";

const routes: Routes = [
  {
    path: "",
    component: PlaidPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlaidPageRoutingModule {}
