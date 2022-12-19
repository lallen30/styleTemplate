import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { SendmoneyPageRoutingModule } from "./sendmoney-routing.module";

import { SendmoneyPage } from "./sendmoney.page";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, SendmoneyPageRoutingModule],
  declarations: [SendmoneyPage],
})
export class SendmoneyPageModule {}
