import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { AddFundsPageRoutingModule } from "./add-funds-routing.module";
import { AddFundsPage } from "./add-funds.page";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, AddFundsPageRoutingModule],
  declarations: [AddFundsPage],
})
export class AddFundsPageModule {}
