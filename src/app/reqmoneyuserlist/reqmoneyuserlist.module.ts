import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { ReqmoneyuserlistPageRoutingModule } from "./reqmoneyuserlist-routing.module";

import { ReqmoneyuserlistPage } from "./reqmoneyuserlist.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReqmoneyuserlistPageRoutingModule,
  ],
  declarations: [ReqmoneyuserlistPage],
})
export class ReqmoneyuserlistPageModule {}
