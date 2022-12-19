import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { SearchActionPage } from "./search-action.page";

const routes: Routes = [
  {
    path: "",
    component: SearchActionPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchActionPageRoutingModule {}
