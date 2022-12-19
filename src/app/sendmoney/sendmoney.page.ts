import { Component, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";
@Component({
  selector: "app-sendmoney",
  templateUrl: "./sendmoney.page.html",
  styleUrls: ["./sendmoney.page.scss"],
})
export class SendmoneyPage implements OnInit {
  constructor(public nvctrl: NavController) {}

  ngOnInit() {}
  back() {
    this.nvctrl.back();
  }
}
