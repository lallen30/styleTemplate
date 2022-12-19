import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { WalletnewPage } from "./walletnew.page";

const routes: Routes = [
  {
    path: "",
    component: WalletnewPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WalletnewPageRoutingModule {}
