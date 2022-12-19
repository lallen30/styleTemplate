import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { Sendmoney3PageRoutingModule } from "./sendmoney3-routing.module";

import { Sendmoney3Page } from "./sendmoney3.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Sendmoney3PageRoutingModule,
  ],
  declarations: [Sendmoney3Page],
})
export class Sendmoney3PageModule {}
