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
  selector: "app-cash-out",
  templateUrl: "./cash-out.page.html",
  styleUrls: ["./cash-out.page.scss"],
})
export class CashOutPage implements OnInit {
  loginInfo: any;
  ready: boolean = false;
  result: any;
  wallet_balance: any = 0;
  stripe_ready: boolean = false;
  stripe_balance: any;
  pin: any;
  profile: any;
  res: any;
  account_listing: any;
  account_ready: boolean = false;

  type: any = "wallet";
  amount: any;
  amount2: any;
  external_account: any;
  settingReady: boolean;
  withdrawal_fees: any;
  showloading: boolean = false;
  fees_amount: any = { amount: 0, fee: 0, total: 0, adminfees: 0 };
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
  ) {}

  ngOnInit() {
    this.type = "wallet";
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

  back() {
    this.router.navigate(["/tabs/home2"]);
  }

  ionViewWillEnter() {
    this.storage.get("user").then((val) => {
      if (val != null) {
        this.loginInfo = val;
        this.UserService.SaveAutoConfiqure(this.loginInfo.token);
        this.getProfile();
      } else {
        this.storage.clear();
        this.router.navigate(["/login"]);
      }
    });
  }

  getProfile() {
    this.UserService.showLoader();
    this.UserService.getData(
      "getProfile?token=" + this.loginInfo.token
    ).subscribe(
      (response) => {
        this.UserService.dismissLoading();
        console.log("response:", response);
        if (response["status"] == "ok") {
          this.getWalletBalance();
          this.get_stripe_balance();
          this.GetExternalAccount();
          this.profile = response["loginInfo"];
          console.log("profile:", this.profile);
        } else {
          this.UserService.presentToast(response["msg"]);
        }
      },
      (err) => {
        this.UserService.dismissLoading();
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

  reload(type) {
    if (type == "wallet") {
      this.ready = false;
      this.getWalletBalance();
    }

    if (type == "stripe") {
      this.stripe_ready = false;
      this.get_stripe_balance();
    }
  }

  async get_stripe_balance() {
    let sendData = {
      token: this.loginInfo.token,
    };
    this.stripe_ready = false;
    this.UserService.sendData("get_stripe_balance", sendData).subscribe(
      (response) => {
        this.stripe_ready = true;
        if (response["status"] == "ok") {
          this.stripe_balance = response["balance"];
        } else {
        }
      },
      (err) => {
        this.stripe_ready = true;
      }
    );
  }

  async GetExternalAccount() {
    //get_cards
    let data = {
      token: this.loginInfo.token,
    };
    await this.UserService.sendData("get_cards", data).subscribe(
      (data) => {
        this.res = data;
        if ((this.res.status = "ok")) {
          this.account_ready = true;
          this.account_listing = this.res;
        }
        return true;
      },
      (err) => {
        this.ready = true;
        this.UserService.presentAlert(
          "something went wrong, please inform app admin."
        );
        return false;
      }
    );
  }

  async getWalletBalance() {
    this.UserService.sendData("getWalletBalance", {
      token: this.loginInfo.token,
    }).subscribe(
      (response) => {
        this.ready = true;
        if (response) {
          this.result = response;
          if (response["wallet_balance"]) {
            this.wallet_balance = response["wallet_balance"];
            this.storage.set("wallet_balance", response["wallet_balance"]);
          }
        } else {
          this.UserService.presentAlert("Something went Wrong");
        }
      },
      (err) => {
        this.ready = true;
        this.UserService.presentAlert(err.error.msg);
      }
    );
  }

  async generateTransfer() {
    if (this.profile.is_pin == "1") {
      if (this.profile.pin != this.pin) {
        this.UserService.presentAlert("Please enter valid PIN");
        return false;
      }
    }

    if (this.type == "wallet") {
      await this.transferWallet();
    }

    if (this.type == "account") {
      this.transferAccount();
    }
  }

  async transferWallet() {
    this.UserService.showLoader("generating payout..");
    let data = {
      token: this.loginInfo.token,
      //amount:this.amount.replace(/[^\d.-]/g, ''),
      amount: this.fees_amount,
      external_account: this.external_account,
      pin: this.pin,
    };
    await this.UserService.sendData("walletToBank", data).subscribe(
      (data) => {
        this.res = data;
        if ((this.res.status = "ok")) {
          this.UserService.dismissLoading();
          this.UserService.presentAlert(this.res.msg);
          this.router.navigate(["/tabs/mywallet"]);
        }
        return true;
      },
      (err) => {
        this.ready = true;
        this.UserService.dismissLoading();
        if (err.error.error_code == "payout_error") {
          this.UserService.presentAlert(err.error.msg);
        } else {
          this.UserService.presentAlert(
            "something went wrong, please inform app admin."
          );
        }

        return false;
      }
    );
  }

  async transferAccount() {
    this.UserService.showLoader("generating payout..");
    let data = {
      token: this.loginInfo.token,
      amount: this.amount.replace(/[^\d.-]/g, ""),
      external_account: this.external_account,
      pin: this.pin,
    };
    await this.UserService.sendData("accountToBank", data).subscribe(
      (data) => {
        this.res = data;
        if ((this.res.status = "ok")) {
          this.UserService.dismissLoading();
          this.UserService.presentAlert(this.res.msg);
          this.router.navigate(["/tabs/mywallet"]);
        }
        return true;
      },
      (err) => {
        this.ready = true;
        this.UserService.dismissLoading();
        if (err.error.error_code == "payout_error") {
          this.UserService.presentAlert(err.error.msg);
        } else {
          this.UserService.presentAlert(
            "something went wrong, please inform app admin."
          );
        }

        return false;
      }
    );
  }

  onAmountChange(e) {
    if (typeof this.amount != "undefined") {
      console.log(e);
      this.amount2 = this.amount.replace(/[^\d.-]/g, "");
      this.GetSetting();
    }
  }

  GetSetting() {
    this.settingReady = false;
    this.showloading = true;
    this.UserService.GetSetting({ token: this.loginInfo?.token }).subscribe(
      (res) => {
        console.log("Get_setting->Res:", res);

        this.withdrawal_fees = res["withdrawal_fees"];
        this.fees_amount = this.calcFee(this.amount2, "USD");
        this.settingReady = true;
      }
    );
  }

  calcFee(amount, currency) {
    var amount_b = parseFloat(amount);
    var adminFeesPersent = this.withdrawal_fees;
    var total = 0;
    var admin_fees = 0;
    var fee = 0;
    admin_fees = (amount_b / 100) * adminFeesPersent;
    total = amount_b + admin_fees;

    return {
      amount: amount_b,
      fee: fee.toFixed(2),
      total: total.toFixed(2),
      admin_fees: admin_fees.toFixed(2),
    };
  }
}
