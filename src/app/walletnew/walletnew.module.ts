import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { WalletnewPageRoutingModule } from "./walletnew-routing.module";

import { WalletnewPage } from "./walletnew.page";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, WalletnewPageRoutingModule],
  declarations: [WalletnewPage],
})
export class WalletnewPageModule {}
