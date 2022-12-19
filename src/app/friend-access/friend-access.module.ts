import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { FriendAccessPageRoutingModule } from "./friend-access-routing.module";

import { FriendAccessPage } from "./friend-access.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FriendAccessPageRoutingModule,
  ],
  declarations: [FriendAccessPage],
})
export class FriendAccessPageModule {}
