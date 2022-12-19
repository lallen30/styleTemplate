import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { BrMaskerModule } from "br-mask";
import { FinancialSettingsPageRoutingModule } from "./financial-settings-routing.module";

import { FinancialSettingsPage } from "./financial-settings.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    BrMaskerModule,
    FinancialSettingsPageRoutingModule,
  ],
  declarations: [FinancialSettingsPage],
})
export class FinancialSettingsPageModule {}
