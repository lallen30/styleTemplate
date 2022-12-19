import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { CardkycPage } from "./cardkyc.page";

const routes: Routes = [
  {
    path: "",
    component: CardkycPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CardkycPageRoutingModule {}
