import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { ConfirmsendPage } from "./confirmsend.page";

const routes: Routes = [
  {
    path: "",
    component: ConfirmsendPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfirmsendPageRoutingModule {}
