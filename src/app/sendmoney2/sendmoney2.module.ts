import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { Sendmoney2PageRoutingModule } from "./sendmoney2-routing.module";

import { Sendmoney2Page } from "./sendmoney2.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Sendmoney2PageRoutingModule,
  ],
  declarations: [Sendmoney2Page],
})
export class Sendmoney2PageModule {}
