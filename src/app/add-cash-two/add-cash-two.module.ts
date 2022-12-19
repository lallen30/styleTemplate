import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { AddCashTwoPageRoutingModule } from "./add-cash-two-routing.module";

import { AddCashTwoPage } from "./add-cash-two.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddCashTwoPageRoutingModule,
  ],
  declarations: [AddCashTwoPage],
})
export class AddCashTwoPageModule {}
