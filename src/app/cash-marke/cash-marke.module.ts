import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { BrMaskerModule } from "br-mask";
import { IonicModule } from "@ionic/angular";

import { CashMarkePageRoutingModule } from "./cash-marke-routing.module";

import { CashMarkePage } from "./cash-marke.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BrMaskerModule,
    CashMarkePageRoutingModule,
  ],
  declarations: [CashMarkePage],
})
export class CashMarkePageModule {}
