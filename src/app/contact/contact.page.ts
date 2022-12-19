import { Component, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";
import {
  UntypedFormGroup,
  Validators,
  UntypedFormControl,
} from "@angular/forms";
import { UserService } from "src/app/user.service";
import { Storage } from "@ionic/storage";
import { ModalController } from "@ionic/angular";
import { ContactConfirmationPopupPage } from "../modals/contact-confirmation-popup/contact-confirmation-popup.page";
@Component({
  selector: "app-contact",
  templateUrl: "./contact.page.html",
  styleUrls: ["./contact.page.scss"],
})
export class ContactPage implements OnInit {
  contactForm: UntypedFormGroup;
  user: any;

  constructor(
    private userService: UserService,
    public navCtrl: NavController,
    public Storage: Storage,
    public modalController: ModalController
  ) {
    this.contactForm = new UntypedFormGroup({
      name: new UntypedFormControl("", Validators.required),
      zp_cashtag: new UntypedFormControl("", Validators.required),
      phone: new UntypedFormControl("", Validators.required),
      email: new UntypedFormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"),
        ])
      ),
      message: new UntypedFormControl("", Validators.required),
    });
  }

  ngOnInit() { }
  ionViewWillEnter() {
    this.Storage.get("user").then(
      (userInfo) => {
        if (userInfo != null) {
          this.user = userInfo;
        }
      },
      (err) => {
        this.navCtrl.navigateForward(["/login"]);
      }
    );
  }
  back() {
    this.navCtrl.back();
  }
  submit(data) {
    data["token"] = this.user.token;
    this.userService.showLoader();
    this.userService.sendData("contact_us", data).subscribe(
      (res) => {
        this.contactForm.reset();
        this.userService.presentToast("Successfully submitted!");
        this.contactConfirmation();
        this.userService.dismissLoading();
      },
      (error) => {
        this.userService.presentToast(
          "Not able to submit right now. Please try after some time!"
        );
        this.userService.dismissLoading();
      }
    );
  }
  async contactConfirmation() {
    const modal = await this.modalController.create({
      component: ContactConfirmationPopupPage,
      cssClass: "search_action",
    });
    return await modal.present();
  }
}
