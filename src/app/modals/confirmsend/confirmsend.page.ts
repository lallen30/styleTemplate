import { Component, OnInit, Input } from "@angular/core";
import { ModalController, NavParams } from "@ionic/angular";
import { UserService } from "../../user.service";
import { Storage } from "@ionic/storage";
import { EventService } from "../../event.service";
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";
@Component({
  selector: "app-confirmsend",
  templateUrl: "./confirmsend.page.html",
  styleUrls: ["./confirmsend.page.scss"],
})
export class ConfirmsendPage implements OnInit {
  @Input() amount: string;
  @Input() card;
  @Input() user;
  @Input() description;
  @Input() action_type;
  @Input() payment_sources;
  profile: any;
  pin: number;
  loginInfo: any = [];
  wallet_balance: any = "";
  transfer_to_user_fees: any;
  fees_amount: any = { amount: 0, fee: 0, total: 0, adminfees: 0 };
  settingReady: any;
  constructor(
    public modalctrl: ModalController,
    public storage: Storage,
    public userService: UserService,
    public router: Router,
    public event: EventService,
    private navParams: NavParams
  ) {
    this.storage.get("wallet_balance").then((walletBalance) => {
      if (walletBalance != null) {
        this.wallet_balance = walletBalance;
      }
    });
    this.amount = this.navParams.data.amount;
    console.log("amount:", this.amount);

    this.card = this.navParams.data.card;
    console.log("card:", this.card);

    this.user = this.navParams.data.user;
    console.log("user:", this.user);

    this.description = this.navParams.data.description;
    console.log("description:", this.description);

    this.action_type = this.navParams.data.action_type;
    console.log("action_type:", this.action_type);

    this.payment_sources = this.navParams.data.payment_sources;
    console.log("payment_sources:", this.payment_sources);
  }

  GetSetting() {
    this.userService
      .GetSetting({ token: this.loginInfo?.token })
      .subscribe((res) => {
        console.log("Get_setting->Res:", res);

        this.transfer_to_user_fees = res["transfer_to_user_fees"];
        this.fees_amount = this.calcFee(this.amount, "USD");
        this.settingReady = true;
      });
  }

  calcFee(amount, currency) {
    var amount_b = parseFloat(amount);
    var FIXED_FEE = 0.3;
    var PERCENTAGE_FEE = 0.029;
    var adminFeesPersent = this.transfer_to_user_fees;
    var total = 0;
    var admin_fees = 0;
    var fee = 0;

    if (this.payment_sources == "stripe") {
      total = (amount_b + FIXED_FEE) / (1 - PERCENTAGE_FEE);
      admin_fees = (amount_b / 100) * adminFeesPersent;
      fee = total - amount_b;
      total = total + admin_fees;
    } else {
      admin_fees = (amount_b / 100) * adminFeesPersent;
      total = amount_b + admin_fees;
    }

    return {
      amount: amount_b,
      fee: fee.toFixed(2),
      total: total.toFixed(2),
      admin_fees: admin_fees.toFixed(2),
    };
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
  back() {
    this.modalctrl.dismiss({
      confirm: false,
      pin: "",
      action_type: this.action_type,
    });
  }

  confirmTransaction() {
    console.log("profile:", this.profile);
    console.log("action_type:", this.action_type);
    let amountData = this.calcFee(this.amount, "USD");
    this.modalctrl.dismiss({
      confirm: true,
      pin: this.pin,
      action_type: this.action_type,
      amountObj: amountData,
    });
  }

  ionViewWillEnter() {
    this.payment_sources = this.navParams.data.payment_sources;
    console.log("payment_sources:", this.payment_sources);
    this.GetSetting();
    this.storage.get("wallet_balance").then((walletBalance) => {
      if (walletBalance != null) {
        this.wallet_balance = walletBalance;
      }
    });
    this.payment_sources = this.navParams.data.payment_sources;
    this.storage.get("user").then(
      (val) => {
        if (val != null) {
          this.loginInfo = val;
          this.getProfile();
        } else {
          this.storage.clear();
        }
      },
      (err) => {
        this.storage.clear();
      }
    );
  }

  getProfile() {
    this.userService.showLoader();
    this.userService
      .getData("getProfile?token=" + this.loginInfo.token)
      .subscribe(
        (response) => {
          this.userService.dismissLoading();
          console.log("response:", response);
          if (response["status"] == "ok") {
            this.profile = response["loginInfo"];
            console.log("profile:", this.profile);
          } else {
            this.userService.presentToast(response["msg"]);
          }
        },
        (err) => {
          this.userService.dismissLoading();
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
}
