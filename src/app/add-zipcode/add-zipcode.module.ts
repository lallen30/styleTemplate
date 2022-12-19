import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { AddZipcodePageRoutingModule } from "./add-zipcode-routing.module";

import { AddZipcodePage } from "./add-zipcode.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddZipcodePageRoutingModule,
  ],
  declarations: [AddZipcodePage],
})
export class AddZipcodePageModule {}
