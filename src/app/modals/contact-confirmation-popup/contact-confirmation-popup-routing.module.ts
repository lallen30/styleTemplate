import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { ContactConfirmationPopupPage } from "./contact-confirmation-popup.page";

const routes: Routes = [
  {
    path: "",
    component: ContactConfirmationPopupPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContactConfirmationPopupPageRoutingModule {}
