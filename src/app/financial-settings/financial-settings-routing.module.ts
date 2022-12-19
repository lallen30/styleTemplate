import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { FinancialSettingsPage } from "./financial-settings.page";

const routes: Routes = [
  {
    path: "",
    component: FinancialSettingsPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinancialSettingsPageRoutingModule {}
