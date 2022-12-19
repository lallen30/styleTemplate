import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { SettingPageRoutingModule } from "./setting-routing.module";
import { ReactiveFormsModule } from "@angular/forms";
import { SettingPage } from "./setting.page";
import { BrMaskerModule } from "br-mask";
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SettingPageRoutingModule,
    ReactiveFormsModule,
    BrMaskerModule,
  ],
  declarations: [SettingPage],
})
export class SettingPageModule {}
