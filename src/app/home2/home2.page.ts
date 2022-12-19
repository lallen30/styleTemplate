import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { Storage } from "@ionic/storage";
import {
  NavController,
  LoadingController,
  AlertController,
  Platform,
  ModalController,
} from "@ionic/angular";

import { UserService } from "../user.service";
import { Router, ActivatedRoute } from "@angular/router";
import { EventService } from "../event.service";
@Component({
  selector: "app-home2",
  templateUrl: "./home2.page.html",
  styleUrls: ["./home2.page.scss"],
})
export class Home2Page implements OnInit {
  loginInfo: any;
  ready: boolean = false;
  result: any;
  wallet_balance: any = 0;
  stripe_ready: boolean = false;
  stripe_balance: any;
  login_ready: boolean = false;
  stripe_accountInfo: any;

  cashoutAllow: boolean = false;
  constructor(
    public navCtrl: NavController,
    public storage: Storage,
    public plt: Platform,
    public UserService: UserService,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    public changeDetectorRef: ChangeDetectorRef,
    private modalController: ModalController,
    public event: EventService
  ) {
    this.cashoutAllow = false;
  }

  ngOnInit() {
    this.event.getEvent().subscribe((handler) => {
      // console.log("getEvent->handler:", handler);
      if (handler.wallet_balance == "updated") {
        this.storage.get("wallet_balance").then((walletBalance) => {
          if (walletBalance != null) {
            this.wallet_balance = walletBalance;
          }
        });
      }
    });
  }

  checkKyc() {
    let sendData = {
      token: this.loginInfo.token,
    };
    this.UserService.GetSetting(sendData).subscribe(
      (response) => {
        this.stripe_accountInfo = response["stripe_accountInfo"];
        if (!this.stripe_accountInfo.payouts_enabled) {
          this.cashoutAllow = false;
          this.presentKYCAlertConfirm();
        } else {
          this.cashoutAllow = true;
        }
      },
      (err) => {}
    );
  }

  async presentKYCAlertConfirm() {
    const alert = await this.alertCtrl.create({
      header: "Alert!",
      message:
        "Federal Regulation requires identification.  Please setup KYC information to be able to setup an account.  All account information is secured by Stripe.",
      buttons: [
        {
          text: "Ok",
          handler: () => {
            this.router.navigate(["/tabs/stripe-kyc"]);
          },
        },
      ],
    });

    await alert.present();
  }

  back() {
    this.router.navigate(["/tabs/home2"]);
  }

  ionViewWillEnter() {
    this.storage.get("user").then((val) => {
      if (val != null) {
        this.loginInfo = val;
        this.getWalletBalance();
        this.get_stripe_balance();
        this.getProfile();
        this.checkKyc();
        // this.event.publishEvent({ event: "reload_badge",token:this.loginInfo.token });
      } else {
        this.storage.clear();
        this.router.navigate(["/login"]);
      }
    });
  }

  getProfile() {
    // this.userService.showLoader();
    this.UserService.getData(
      "getProfile?token=" + this.loginInfo.token
    ).subscribe(
      (response) => {
        if (response["status"] == "ok") {
          this.login_ready = true;
          this.loginInfo = response["loginInfo"];
        } else {
          this.UserService.presentToast(response["msg"]);
        }
      },
      (err) => {
        this.login_ready = true;
        console.log("get_profile()->err:", err);
        if (err?.error?.error_code == "token_expired") {
          this.UserService.presentToast(err?.error?.msg);
          this.storage.clear();
          this.router.navigate(["/login"]);
        } else if (err?.error?.msg) {
          this.UserService.presentToast(err?.error?.msg);
        } else {
          this.UserService.presentToast(
            "Something went wrong. Try again later"
          );
        }
      }
    );
  }

  async get_stripe_balance() {
    let sendData = {
      token: this.loginInfo.token,
    };
    this.stripe_ready = false;
    this.UserService.sendData("get_stripe_balance", sendData).subscribe(
      (response) => {
        console.log("response:", response);
        this.stripe_ready = true;
        if (response["status"] == "ok") {
          this.stripe_balance = response["balance"];
          console.log("stripe_balance:", this.stripe_balance);
        } else {
        }
      },
      (err) => {
        console.log("err:", err);
        this.stripe_ready = true;
      }
    );
  }

  async getWalletBalance() {
    this.UserService.sendData("getWalletBalance", {
      token: this.loginInfo.token,
    }).subscribe(
      (response) => {
        console.log("response:", response);
        this.ready = true;
        if (response) {
          this.result = response;
          if (response["wallet_balance"]) {
            this.wallet_balance = response["wallet_balance"];
            this.storage.set("wallet_balance", response["wallet_balance"]);
            this.event.publishEvent({ wallet_balance: "updated" });
          }
        } else {
          this.UserService.presentAlert("Something went Wrong");
        }
      },
      (err) => {
        this.ready = true;
        console.log("err:", err);
        this.UserService.presentAlert(err.error.msg);
      }
    );
  }
}
