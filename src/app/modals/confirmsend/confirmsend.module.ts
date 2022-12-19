import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { ConfirmsendPageRoutingModule } from "./confirmsend-routing.module";
import { BrMaskerModule } from "br-mask";
import { ConfirmsendPage } from "./confirmsend.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BrMaskerModule,
    ConfirmsendPageRoutingModule,
  ],
  declarations: [ConfirmsendPage],
})
export class ConfirmsendPageModule {}
