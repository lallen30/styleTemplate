import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { FriendAccessPage } from "./friend-access.page";

const routes: Routes = [
  {
    path: "",
    component: FriendAccessPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FriendAccessPageRoutingModule {}
