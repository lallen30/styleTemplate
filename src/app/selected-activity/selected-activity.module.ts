import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { SelectedActivityPageRoutingModule } from "./selected-activity-routing.module";

import { SelectedActivityPage } from "./selected-activity.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectedActivityPageRoutingModule,
  ],
  declarations: [SelectedActivityPage],
})
export class SelectedActivityPageModule {}
