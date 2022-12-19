import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
@Component({
  selector: "app-search-action",
  templateUrl: "./search-action.page.html",
  styleUrls: ["./search-action.page.scss"],
})
export class SearchActionPage implements OnInit {
  constructor(public modalController: ModalController) {}

  ngOnInit() {}
  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      dismissed: true,
    });
  }
}
