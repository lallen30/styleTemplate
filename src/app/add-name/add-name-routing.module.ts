import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AddNamePage } from "./add-name.page";

const routes: Routes = [
  {
    path: "",
    component: AddNamePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddNamePageRoutingModule {}
