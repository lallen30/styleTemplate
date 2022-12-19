import { Component, OnInit } from "@angular/core";
import { Storage } from "@ionic/storage";
import {
  NavController,
  LoadingController,
  AlertController,
  Platform,
  ActionSheetController,
} from "@ionic/angular";
import { UserService } from "../user.service";
import { Router } from "@angular/router";
import { EventService } from "../event.service";
import {
  InAppBrowser,
  InAppBrowserOptions,
  InAppBrowserObject,
} from "@ionic-native/in-app-browser/ngx";
import { ModalController } from "@ionic/angular";
import { LogoutPage } from "../modals/logout/logout.page";
@Component({
  selector: "app-profile",
  templateUrl: "./profile.page.html",
  styleUrls: ["./profile.page.scss"],
})
export class ProfilePage implements OnInit {
  bankaccount;
  slideOpts = {
    slidesPerView: 1.1,
    spaceBetween: 10,
  };
  showTable = false;
  discoverable = false;
  auto_send_transaction = false;
  show_balance_information = false;
  cards: any;
  availablebalnc = 0;
  number: any = 0;
  funding_sources_lists: any = [];
  dwolla_spinner: any = "off";

  dwolla_iav_token: any = "";
  dwolla_source_verification_url: any = "";
  loginInfo: any = [];
  user_spinner: string = "off";

  wallet_spinner: string = "off";
  walletInfo: any = [];
  transactions: any = [];
  constructor(
    public navCtrl: NavController,
    public storage: Storage,
    public plt: Platform,
    public userService: UserService,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public router: Router,
    public event: EventService,
    public action: ActionSheetController,
    private iab: InAppBrowser,
    public modalController: ModalController
  ) {
    // this.userService.showLoader();
  }

  ngOnInit() {
    this.event.getEvent().subscribe((res) => {
      console.log("Event->res:", res);
      if (res["event"] == "reload_profile") {
        this.getProfile();
      }
    });
  }

  ionViewWillEnter() {
    this.storage.get("user").then((val) => {
      console.log("Val:", val);
      if (val != null) {
        this.loginInfo = val;
        this.userService.SaveAutoConfiqure(this.loginInfo.token);
        this.event.publishEvent({
          event: "reload_badge",
          token: this.loginInfo.token,
        });
        this.getProfile();
      } else {
        console.log("ionViewWillEnter()->ELSE:val:", val);
        this.storage.clear();
        this.router.navigate(["/login"]);
      }
    });
  }

  addkycmsg() {
    this.presentAlert(
      "Before you send money You need to meet KYC requirements. Add KYC now?"
    );
  }
  async presentAlert(msg) {
    let alert = await this.alertCtrl.create({
      message: msg,
      buttons: [
        {
          text: "Later",
          handler: () => {},
        },
        {
          text: "Setup Now",
          handler: () => {
            this.navCtrl.navigateForward("cardkyc");
          },
        },
      ],
    });

    await alert.present();
  }

  getProfile() {
    this.user_spinner = "on";
    // this.userService.showLoader();
    this.userService
      .getData("getProfile?token=" + this.loginInfo.token)
      .subscribe(
        (response) => {
          this.user_spinner = "off";
          // this.userService.dismissLoading();
          if (response["status"] == "ok") {
            this.loginInfo = response["loginInfo"];
            this.storage.set("user", this.loginInfo);
            console.log("get_profile()->LoginInfo:", this.loginInfo);

            this.auto_send_transaction = false;
            if (this.loginInfo.setting.auto_send_transaction == true) {
              this.auto_send_transaction = true;
            }

            this.discoverable = false;
            if (this.loginInfo.setting.discoverable == true) {
              this.discoverable = true;
            }

            this.show_balance_information = false;
            if (this.loginInfo.setting.show_balance_information == true) {
              this.show_balance_information = true;
            }
          } else {
            this.userService.presentToast(response["msg"]);
          }
        },
        (err) => {
          this.user_spinner = "off";
          // this.userService.dismissLoading();
          console.log("get_profile()->err:", err);
          if (err?.error?.error_code == "token_expired") {
            this.userService.presentToast(err?.error?.msg);
            this.storage.clear();
            this.router.navigate(["/login"]);
          } else if (err?.error?.msg) {
            this.userService.presentToast(err?.error?.msg);
          } else {
            this.userService.presentToast(
              "Something went wrong. Try again later"
            );
          }
        }
      );
  }

  changevalue() {
    const option = {
      discoverable: this.discoverable,
      auto_send_transaction: this.auto_send_transaction,
      show_balance_information: this.show_balance_information,
    };
    const option2 = {
      key: option,
      token: this.loginInfo.token,
    };
    this.userService.sendData("updateUserInfo", option2).subscribe((res) => {});
  }

  showTablefn() {
    this.number = 0;
    this.showTable = true;
  }
  hideTablefn() {
    this.showTable = false;
  }

  async logout() {
    const modal = await this.modalController.create({
      component: LogoutPage,
      cssClass: "search_action",
    });
    return await modal.present();
  }
}
