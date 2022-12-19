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
  selector: "app-add-cash",
  templateUrl: "./add-cash.page.html",
  styleUrls: ["./add-cash.page.scss"],
})
export class AddCashPage implements OnInit {
  availablebalnc = 0;
  number: any = 0;
  loginInfo: any = [];
  action_type: any = "send";
  wallletInfo: any = [];
  funding_sources_lists: any = [];

  destination_source_url: any = "";
  verified_source_url: any = "";

  walletInfo: any = [];

  cards: any = [];
  card_spinner: string = "off";
  card_id: any = "";
  to_user_id: any;
  description: any;
  ready: boolean = false;
  is_issue: false;
  selected_user: any = [];
  amount: any;
  other_amount: any;
  paidAmount: any;
  // fees_amount: any;
  otherclick: boolean = false;
  fees_amount: any = { amount: 0, fee: 0, total: 0, adminfees: 0 };
  add_to_wallet_fees: any;
  amount2: any = 0;
  settingReady: boolean = false;
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

  ngOnInit() {}

  back() {
    this.router.navigate(["/tabs/home2"]);
  }

  cut() {
    this.number = this.number.substring(0, this.number.length - 1);
  }

  ionViewWillEnter() {
    this.card_id = "";
    this.GetSetting();
    this.storage.get("user").then((val) => {
      if (val != null) {
        this.loginInfo = val;
        this.UserService.SaveAutoConfiqure(this.loginInfo.token);
        this.amount = 50;

        this.getcard();
      } else {
        this.storage.clear();
        this.router.navigate(["/login"]);
      }
    });
  }

  addAmount(amount) {
    this.otherclick = false;
    this.other_amount = 0;
    this.amount = amount;
    this.paidAmount = amount;

    this.fees_amount = this.calcFee(this.paidAmount, "USD");
    console.log(this.fees_amount);
  }

  focusOtherfield(e) {
    this.otherclick = true;
    this.amount = 0;
    let other_amount = 0;
    if (typeof this.other_amount != "undefined") {
      other_amount = this.other_amount.replace(/[^\d.-]/g, "");
    }

    if (other_amount < 1 || typeof other_amount == "undefined") {
      this.fees_amount = { amount: 0, fee: 0, total: 0 };
    }
  }

  GetSetting() {
    this.UserService.GetSetting({ token: this.loginInfo?.token }).subscribe(
      (res) => {
        console.log("Get_setting->Res:", res);

        this.add_to_wallet_fees = res["add_to_wallet_fees"];
        this.fees_amount = this.calcFee(this.amount, "USD");
        this.settingReady = true;
      }
    );
  }

  amountAdd() {
    if (this.otherclick) {
      let other_amount = 0;
      if (typeof this.other_amount != "undefined") {
        other_amount = this.other_amount.replace(/[^\d.-]/g, "");
      }
      if (other_amount > 0) {
        this.amount = 0;
        this.paidAmount = other_amount;
        this.fees_amount = this.calcFee(this.paidAmount, "USD");
        console.log(this.fees_amount);
      } else {
        this.fees_amount = { amount: 0, fee: 0, total: 0 };
      }
    }
  }

  getcard() {
    this.UserService.sendData("get_cards", {
      token: this.loginInfo.token,
    }).subscribe(
      (response) => {
        console.log("response:", response);
        this.ready = true;
        if (response) {
          this.cards = response["credit_cards"];
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

  calcFee(amount, currency) {
    var amount_b = parseFloat(amount);
    var FIXED_FEE = 0.3;
    var PERCENTAGE_FEE = 0.029;
    var adminFeesPersent = this.add_to_wallet_fees;
    var admin_fees = (parseFloat(amount) / 100) * adminFeesPersent;

    var total = (amount_b + FIXED_FEE) / (1 - PERCENTAGE_FEE);

    var newTotal = total + admin_fees;

    var fee = total - amount_b;
    return {
      amount: amount_b,
      fee: fee.toFixed(2),
      total: newTotal.toFixed(2),
      admin_fees: admin_fees.toFixed(2),
    };
  }

  addWallet() {
    this.UserService.showLoader("please wait ...");
    let sendData = {
      token: this.loginInfo.token,
      amount: this.fees_amount.amount,
      card_id: this.card_id,
      fees: this.fees_amount.fee,
      total: this.fees_amount.total,
      amountObj: this.fees_amount,
    };
    console.log("sendData:", sendData);
    this.UserService.sendData("addWallet", sendData).subscribe(
      (response) => {
        console.log("response:", response);
        this.UserService.dismissLoading();
        let res: any = response;
        if (res) {
          if (res["wallet_balance"]) {
            let wallet_balance = res["wallet_balance"];
            console.log("addWallet->wallet_balance:", wallet_balance);
            this.storage.set("wallet_balance", wallet_balance);
            this.event.publishEvent({ wallet_balance: "updated" });
          }
          this.UserService.presentAlert(res.msg);
          this.router.navigate(["/tabs/home2"]);
        } else {
          this.UserService.presentAlert("Something went Wrong");
        }
      },
      (err) => {
        this.UserService.dismissLoading();
        console.log("err:", err);
        this.UserService.presentAlert(err.error.msg);
      }
    );
  }

  onAmountChange(e) {
    if (typeof this.other_amount != "undefined") {
      this.amount2 = this.other_amount.replace(/[^\d.-]/g, "");
    }
  }
}
