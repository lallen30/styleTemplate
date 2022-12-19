import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { FriendAccessModalPageRoutingModule } from "./friend-access-modal-routing.module";

import { FriendAccessModalPage } from "./friend-access-modal.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FriendAccessModalPageRoutingModule,
  ],
  declarations: [FriendAccessModalPage],
})
export class FriendAccessModalPageModule {}
