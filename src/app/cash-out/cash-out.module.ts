import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { CashOutPageRoutingModule } from "./cash-out-routing.module";

import { CashOutPage } from "./cash-out.page";
import { BrMaskerModule } from "br-mask";
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BrMaskerModule,
    CashOutPageRoutingModule,
  ],
  declarations: [CashOutPage],
})
export class CashOutPageModule {}
