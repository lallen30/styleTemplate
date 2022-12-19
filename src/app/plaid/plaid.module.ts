import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { PlaidPageRoutingModule } from "./plaid-routing.module";

import { PlaidPage } from "./plaid.page";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, PlaidPageRoutingModule],
  declarations: [PlaidPage],
})
export class PlaidPageModule {}
