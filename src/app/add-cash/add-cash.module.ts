import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { AddCashPageRoutingModule } from "./add-cash-routing.module";

import { AddCashPage } from "./add-cash.page";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, AddCashPageRoutingModule],
  declarations: [AddCashPage],
})
export class AddCashPageModule {}
