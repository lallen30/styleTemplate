import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { ContactConfirmationPopupPageRoutingModule } from "./contact-confirmation-popup-routing.module";

import { ContactConfirmationPopupPage } from "./contact-confirmation-popup.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContactConfirmationPopupPageRoutingModule,
  ],
  declarations: [ContactConfirmationPopupPage],
})
export class ContactConfirmationPopupPageModule {}
