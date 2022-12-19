import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { AddbankPageRoutingModule } from "./addbank-routing.module";

import { AddbankPage } from "./addbank.page";
import { ReactiveFormsModule } from "@angular/forms";
import { BrMaskerModule } from "br-mask";
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    BrMaskerModule,
    AddbankPageRoutingModule,
  ],
  declarations: [AddbankPage],
})
export class AddbankPageModule {}
