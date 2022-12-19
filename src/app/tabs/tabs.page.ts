import { Component } from "@angular/core";
import { MenuController, NavController } from "@ionic/angular";
import { EventService } from "../event.service";

@Component({
  selector: "app-tabs",
  templateUrl: "tabs.page.html",
  styleUrls: ["tabs.page.scss"],
})
export class TabsPage {
  constructor(
    public menuCtrl: MenuController,
    public event: EventService,
    public nav: NavController
  ) {}
  toggleMenu() {
    this.menuCtrl.toggle();
  }
  changes() {
    this.event.publishEvent("qrband");
  }
  gotoQR() {
    this.nav.navigateForward("qrscanner");
  }
}
