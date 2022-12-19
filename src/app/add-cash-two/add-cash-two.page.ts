import { Component, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";
@Component({
  selector: "app-add-cash-two",
  templateUrl: "./add-cash-two.page.html",
  styleUrls: ["./add-cash-two.page.scss"],
})
export class AddCashTwoPage implements OnInit {
  constructor(public nvCtrl: NavController) {}

  ngOnInit() {}
  back() {
    this.nvCtrl.back();
  }
}
