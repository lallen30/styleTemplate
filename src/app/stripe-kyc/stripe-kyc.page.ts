import { Component, OnInit, NgZone } from "@angular/core";
import { Storage } from "@ionic/storage";
import {
  NavController,
  LoadingController,
  AlertController,
  Platform,
  ModalController,
} from "@ionic/angular";
import { Router, ActivatedRoute } from "@angular/router";
import { Validators, FormGroup, FormControl } from "@angular/forms";
import {
  InAppBrowser,
  InAppBrowserOptions,
  InAppBrowserObject,
} from "@ionic-native/in-app-browser/ngx";
import { Stripe } from "@ionic-native/stripe/ngx";
import { Location } from "@angular/common";
import { UserService } from "src/app/user.service";
import { environment } from '../../environments/environment';

let Url = `https://${environment.server}/`;

// import { NavParams, MenuController, ModalController } from '@ionic/angular';
@Component({
  selector: "app-stripe-kyc",
  templateUrl: "./stripe-kyc.page.html",
  styleUrls: ["./stripe-kyc.page.scss"],
})
export class StripeKycPage implements OnInit {
  loginInfo: any = [];
  payment_method: any = "";
  stripe_keys: any = [];
  is_spinner: string = "off";
  stripe_account_id: string = "";
  setting_spinner: string = "on";

  countries: any = [];
  stripe_accountInfo: any = [];
  kyc_url: string = "";

  payouts_enabled: boolean = false;
  charges_enabled: boolean = false;

  isStripeaccount: boolean = false;
  account_listing: any;
  res: any;
  constructor(
    public route: ActivatedRoute,
    public navCtrl: NavController,
    public storage: Storage,
    public router: Router,
    public plt: Platform,
    private stripe: Stripe,
    private location: Location,
    public UserService: UserService,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public modelCtrl: ModalController,
    // public navParams: NavParams,
    private iab: InAppBrowser,
    public zone: NgZone
  ) {
    this.storage.get("countries").then((response) => {
      this.countries = response;
    });
  }

  ionViewWillEnter() {
    this.storage.get("user").then((val) => {
      if (val != null) {
        this.loginInfo = val;
        console.log("loginInfo:", this.loginInfo);
        this.get_settings();
      }
    });
  }

  ngOnInit() { }

  change_payment_method(ev) {
    console.log("Is Value: ", ev.detail.value);
  }

  get_settings() {
    let sendData = {
      token: this.loginInfo.token,
    };
    this.setting_spinner = "on";
    this.UserService.GetSetting(sendData).subscribe(
      (response) => {
        console.log("response:", response);
        this.setting_spinner = "off";
        this.stripe_keys = {
          publishable_key: response["publishable_key"],
          secret_key: response["secret_key"],
        };
        console.log("StripeKeys:", this.stripe_keys);

        this.payment_method = "debit-credit-cards";
        this.stripe_account_id = response["stripe_account_id"];
        console.log("stripe_account_id:", this.stripe_account_id);

        this.stripe_accountInfo = response["stripe_accountInfo"];
        this.isStripeaccount = response["account_added"];
        this.payouts_enabled = this.stripe_accountInfo.payouts_enabled;
        this.charges_enabled = this.stripe_accountInfo.charges_enabled;

        if (this.stripe_accountInfo.payouts_enabled) {
          this.GetExternalAccount();
        }

        this.kyc_url = response["kyc_url"];
      },
      (err) => {
        console.log("err:", err);
        this.setting_spinner = "off";
        if (err.error.error_code == "token_expired") {
          this.storage.clear();
          this.router.navigate(["/signin"]);
        } else {
          this.UserService.presentAlert(
            "something went wrong, please try again later."
          );
        }
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
          this.account_listing = this.res;

          if (this.account_listing.bank_account.length == 0) {
            this.presentAlertConfirm();
          }
        }
        return true;
      },
      (err) => {
        this.UserService.presentAlert(
          "something went wrong, please inform app admin."
        );
        return false;
      }
    );
  }

  async presentAlertConfirm() {
    const alert = await this.alertCtrl.create({
      header: "Alert!",
      message: "For lower fees, please connect a bank account.",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: (blah) => {
            this.router.navigate(["/tabs/mywallet"]);
          },
        },
        {
          text: "Ok",
          handler: () => {
            this.router.navigate(["/addbank"]);
          },
        },
      ],
    });

    await alert.present();
  }

  back() {
    this.navCtrl.back();
  }

  async get_confirmation_for_kyc() {
    const alert = await this.alertCtrl.create({
      header: "Update KYC",
      // subHeader: 'Subtitle',
      cssClass: "alertCancel",
      message:
        '<img src="assets/question.png" class="question" /> <img src="assets/w-check.png" /> <img src="assets/w-cancel.png"/>',
      buttons: [
        {
          text: "",
          handler: () => {
            let url =
              Url + "/stripe-connect/connect.php";
            this.update_kyc(url);
          },
        },
        {
          text: "",
          role: "cancel",
          handler: () => {
            this.router.navigate(["/financial-settings"]);
          },
        },
      ],
    });
    await alert.present();
  }

  GotoAddCard() {
    this.router.navigate(["/financial-settings"]);
  }

  update_kyc(url) {
    let options: InAppBrowserOptions = {
      statusbar: {
        color: "#51688F",
      },
      title: {
        color: "#ffffff",
        staticText: "Place Your Order",
        showPageTitle: false,
      },
      closeButton: {
        wwwImage: "assets/close.png",
        align: "right",
        event: "closePressed",
      },
      backButton: {
        wwwImage: "assets/back.png",
        align: "left",
        //event     : 'closePressed'
      },
      backButtonCanClose: true,
      location: "no",
      footercolor: "#c7fedc",
      hidenavigationbuttons: "yes",
      hideurlbar: "yes",
      toolbarcolor: "#c7fedc",
      //hidden            : 'yes',
      clearcache: "yes",
      clearsessioncache: "yes",
    };
    const b: InAppBrowserObject = this.iab.create(url, "_blank", options);
    let orderPlaced = false;
    b.on("loadstart").subscribe((res) => {
      this.zone.run(() => {
        console.log("res1:", res);
        console.log("res2:", JSON.stringify(res));
        if (res.url.indexOf("thankyou") != -1) {
          b.close();
          console.log("Thank You Matched.");
          console.log("res.url:", JSON.stringify(res.url));

          let p = this.getParams(res.url);
          console.log("p:", JSON.stringify(p));

          orderPlaced = true;
          this.get_settings();
        } else {
          console.log("thankyou_not_match");
        }
      });
    });
    b.on("loadstop").subscribe((res) => {
      console.log("loadstop:", res);
      this.get_settings();
    });
    b.on("exit").subscribe((res) => {
      console.log("exit:", res);
      this.get_settings();
    });
  }

  getParams = function (url) {
    var params = {};
    var parser = document.createElement("a");
    parser.href = url;
    var query = parser.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      params[pair[0]] = decodeURIComponent(pair[1]);
    }
    return params;
  };
}
