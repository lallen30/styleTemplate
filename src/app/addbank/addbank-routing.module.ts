import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AddbankPage } from "./addbank.page";

const routes: Routes = [
  {
    path: "",
    component: AddbankPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddbankPageRoutingModule {}
