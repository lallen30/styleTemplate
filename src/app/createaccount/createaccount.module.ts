import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { CreateaccountPageRoutingModule } from "./createaccount-routing.module";

import { CreateaccountPage } from "./createaccount.page";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateaccountPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [CreateaccountPage],
})
export class CreateaccountPageModule {}
