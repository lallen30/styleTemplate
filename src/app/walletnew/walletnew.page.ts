import { Component, NgZone, OnInit } from "@angular/core";
import { Storage } from "@ionic/storage";
import {
  NavController,
  LoadingController,
  AlertController,
  Platform,
  ActionSheetController,
  NavParams,
} from "@ionic/angular";
import { UserService } from "../user.service";
import { NavigationExtras, Router } from "@angular/router";
import { EventService } from "../event.service";

@Component({
  selector: "app-walletnew",
  templateUrl: "./walletnew.page.html",
  styleUrls: ["./walletnew.page.scss"],
})
export class WalletnewPage implements OnInit {
  scanSub: any;
  number: String = "0";
  bankaccount;
  availablebalnc = 0;
  page: number = 1;
  user: any;
  userprofile;
  discoverable = false;
  auto_send_transaction = false;
  show_balance_information = false;
  result: any;
  cards: any;
  card_1: any;
  transactions;
  useridbyqr;
  cardid;
  refresh: any;
  readerMode$: any;
  funding_sources_lists: any = [];
  loginInfo: any = [];
  fundingsource_spinner: string = "off";
  user_spinner: string = "off";

  result_balance: any;
  walletInfo: any = [];
  wallet_spinner = "off";
  stripe_balance: any = [];
  stripe_spinner: string = "off";
  transaction_ready: boolean = false;
  stripe_accountInfo: any;
  res: any;
  account_listing: any;

  constructor(
    public navCtrl: NavController,
    public storage: Storage,
    public plt: Platform,
    public userService: UserService,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public router: Router,
    public action: ActionSheetController,
    public event: EventService,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.event.getEvent().subscribe((res) => {
      console.log("event.getEvent()->res:", res);
      this.getProfile();
      this.getWalletBalance();
      this.getProfile();
      this.get_stripe_balance();
      this.getTranHist();
      this.get_walletInfo();
      this.GetExternalAccount();
      this.availablebalnc = 0;
      this.number = "0";
    });

    this.event.getEvent().subscribe((res) => {
      if (res["event"] == "check_kyc") {
        this.checkKyc();
      }
    });
  }

  ionViewWillEnter() {
    console.log("walletInfo:", this.walletInfo);
    this.storage.get("user").then((val) => {
      if (val) {
        this.user = val;
        this.loginInfo = val;
        this.userService.SaveAutoConfiqure(this.loginInfo.token);
        this.getProfile();
        this.get_stripe_balance();
        this.getWalletBalance();
        this.getTranHist();
        this.get_walletInfo();
        this.GetExternalAccount();
        //this.event.publishEvent({ event: "reload_badge",token:this.loginInfo.token });
      } else {
        this.storage.clear();
        this.router.navigate(["/login"]);
      }
    });
    this.availablebalnc = 0;
    this.number = "0";

    this.get_walletInfo();
  }

  async GetExternalAccount() {
    //get_cards
    let data = {
      token: this.loginInfo.token,
    };
    await this.userService.sendData("get_cards", data).subscribe(
      (data) => {
        this.res = data;
        if ((this.res.status = "ok")) {
          this.account_listing = this.res;

          if (this.account_listing.debit_cards.length == 0) {
            this.presentAlertConfirm();
          } else {
            this.checkKyc();
          }
        }
        return true;
      },
      (err) => {
        this.userService.presentAlert(
          "something went wrong, please inform app admin."
        );
        return false;
      }
    );
  }

  checkKyc() {
    let sendData = {
      token: this.loginInfo.token,
    };
    this.userService.GetSetting(sendData).subscribe(
      (response) => {
        this.stripe_accountInfo = response["stripe_accountInfo"];
        if (!this.stripe_accountInfo.payouts_enabled) {
          this.presentKYCAlertConfirm();
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

  async presentAlertConfirm() {
    const alert = await this.alertCtrl.create({
      header: "Alert!",
      message:
        "Zoom Pay requires the use of a debit card for deposits and withdrawals.",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: (blah) => {
            console.log("Confirm Cancel: blah");
          },
        },
        {
          text: "Ok",
          handler: () => {
            this.router.navigate(["/creditcard/debit_card"]);
          },
        },
      ],
    });

    await alert.present();
  }

  get_stripe_balance() {
    let sendData = {
      token: this.loginInfo.token,
    };
    this.stripe_spinner = "on";
    this.userService.sendData("get_stripe_balance", sendData).subscribe(
      (response) => {
        console.log("response:", response);
        this.stripe_spinner = "off";
        if (response["status"] == "ok") {
          this.stripe_balance = response["balance"];
          console.log("stripe_balance:", this.stripe_balance);
        } else {
        }
      },
      (err) => {
        console.log("err:", err);
        this.stripe_spinner = "off";
      }
    );
  }
  get_walletInfo() {
    this.storage.get("walletInfo").then((walletInfo) => {
      if (walletInfo != null) {
        this.walletInfo = walletInfo;
        console.log("walletInfo:", this.walletInfo);
      }
    });
  }

  ionRefresh(ev) {
    this.refresh = ev.target;
    this.reload();
  }

  reload() {
    this.page = 1;
    // this.userService.showLoader();
    this.getProfile();
    this.getWalletBalance();
    this.getTranHist();
    this.get_stripe_balance();
    this.availablebalnc = 0;
    this.number = "0";
    setTimeout(() => {
      if (this.refresh) {
        this.refresh.complete();
      }
    }, 1000);
  }

  getTranHist() {
    this.userService
      .getData(
        "transactionHistory?token=" + this.user.token + "&page_no=" + this.page
      )
      .subscribe(
        (res) => {
          if (res) {
            this.transaction_ready = true;
            this.availablebalnc = res["wallet_balance"];
            this.transactions = res["transactions"];
          } else {
            this.transaction_ready = true;
            this.userService.presentAlert("Something went Wrong");
          }
        },
        (err) => {
          this.transaction_ready = true;
          if (err.error.errormsg == "Not any resources found.") {
          } else {
            this.userService.presentAlert("Something went Wrong");
          }
        }
      );
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
  loadMore(event) {
    this.page++;
    this.userService
      .getData(
        "transactionHistory?token=" + this.user.token + "&page_no=" + this.page
      )
      .subscribe(
        (res) => {
          if (res["status"] == "ok") {
            event.target.complete();
            if (res["transactions"] != null) {
              this.transactions = [
                ...this.transactions,
                ...res["transactions"],
              ];
            } else {
              this.page--;
            }
          } else {
            this.userService.presentAlert("Something went wrong");
            event.target.complete();
          }
        },
        (err) => {
          this.page--;
          event.target.complete();
          this.userService.dismissLoading();
          this.userService.presentAlert("Something went Wrong");
        }
      );
  }

  goto_numberpad(action_type) {
    // Send-> /userlist/:number/:cardid
    // Request-> /reqmoneyuserlist/:number
    let navigationExtras: NavigationExtras = {
      queryParams: {
        action_type: action_type,
      },
    };
    this.navCtrl.navigateForward(["/numberpad"], navigationExtras);
  }

  getWalletBalance() {
    this.wallet_spinner = "on";
    this.userService
      .sendData("getWalletBalance", {
        token: this.loginInfo.token,
      })
      .subscribe(
        (response) => {
          this.wallet_spinner = "off";
          console.log("response:", response);
          if (response) {
            this.result_balance = response;
          } else {
            this.userService.presentAlert("Something went Wrong");
          }
        },
        (err) => {
          this.wallet_spinner = "off";
          console.log("err:", err);
          if (err.error_code == "user_expire") {
            this.storage.clear();
            this.router.navigate(["/login"]);
            this.userService.presentToast(
              "Token is expired. Please login again."
            );
          } else {
            this.userService.presentAlert(err.error.msg);
          }
        }
      );
  }

  goToActivity(tran) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        transaction: JSON.stringify(tran),
      },
    };
    this.navCtrl.navigateForward(["/selected-activity"], navigationExtras);
  }
}
