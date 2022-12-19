import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { SelectedActivityPage } from "./selected-activity.page";

const routes: Routes = [
  {
    path: "",
    component: SelectedActivityPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectedActivityPageRoutingModule {}
