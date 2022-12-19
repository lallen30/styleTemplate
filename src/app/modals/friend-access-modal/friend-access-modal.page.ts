import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
@Component({
  selector: "app-friend-access-modal",
  templateUrl: "./friend-access-modal.page.html",
  styleUrls: ["./friend-access-modal.page.scss"],
})
export class FriendAccessModalPage implements OnInit {
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
