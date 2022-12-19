import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { FriendAccessModalPage } from "./friend-access-modal.page";

const routes: Routes = [
  {
    path: "",
    component: FriendAccessModalPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FriendAccessModalPageRoutingModule {}
