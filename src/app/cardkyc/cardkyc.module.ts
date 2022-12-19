import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { CardkycPageRoutingModule } from "./cardkyc-routing.module";

import { CardkycPage } from "./cardkyc.page";
import { ReactiveFormsModule } from "@angular/forms";
import { BrMaskerModule } from "br-mask";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CardkycPageRoutingModule,
    ReactiveFormsModule,
    BrMaskerModule,
  ],
  declarations: [CardkycPage],
})
export class CardkycPageModule {}
