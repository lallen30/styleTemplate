import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { RequestpayPageRoutingModule } from "./requestpay-routing.module";

import { RequestpayPage } from "./requestpay.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RequestpayPageRoutingModule,
  ],
  declarations: [RequestpayPage],
})
export class RequestpayPageModule {}
