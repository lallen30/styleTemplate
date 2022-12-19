import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AddZipcodePage } from "./add-zipcode.page";

const routes: Routes = [
  {
    path: "",
    component: AddZipcodePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddZipcodePageRoutingModule {}
