import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
@Component({
  selector: "app-contact-confirmation-popup",
  templateUrl: "./contact-confirmation-popup.page.html",
  styleUrls: ["./contact-confirmation-popup.page.scss"],
})
export class ContactConfirmationPopupPage implements OnInit {
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
