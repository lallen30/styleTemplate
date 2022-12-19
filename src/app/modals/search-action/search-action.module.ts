import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { SearchActionPageRoutingModule } from "./search-action-routing.module";

import { SearchActionPage } from "./search-action.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchActionPageRoutingModule,
  ],
  declarations: [SearchActionPage],
})
export class SearchActionPageModule {}
