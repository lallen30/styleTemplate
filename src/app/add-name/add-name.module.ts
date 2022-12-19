import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";
import { ReactiveFormsModule } from "@angular/forms";
import { AddNamePageRoutingModule } from "./add-name-routing.module";

import { AddNamePage } from "./add-name.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    AddNamePageRoutingModule,
  ],
  declarations: [AddNamePage],
})
export class AddNamePageModule {}
