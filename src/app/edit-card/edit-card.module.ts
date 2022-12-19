import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { EditCardPageRoutingModule } from "./edit-card-routing.module";

import { EditCardPage } from "./edit-card.page";
import { ReactiveFormsModule } from "@angular/forms";
import { BrMaskerModule } from "br-mask";
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditCardPageRoutingModule,
    ReactiveFormsModule,
    BrMaskerModule,
  ],
  declarations: [EditCardPage],
})
export class EditCardPageModule {}
