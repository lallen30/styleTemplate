import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { CreditcardPageRoutingModule } from "./creditcard-routing.module";

import { CreditcardPage } from "./creditcard.page";
import { ReactiveFormsModule } from "@angular/forms";
import { BrMaskerModule } from "br-mask";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreditcardPageRoutingModule,
    ReactiveFormsModule,
    BrMaskerModule,
  ],
  declarations: [CreditcardPage],
})
export class CreditcardPageModule {}
