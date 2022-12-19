import { Component, OnInit, NgZone, ChangeDetectorRef } from "@angular/core";
import { Storage } from "@ionic/storage";
import {
  NavController,
  LoadingController,
  AlertController,
  Platform,
  ActionSheetController,
} from "@ionic/angular";
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";
import { Validators, FormGroup, FormControl } from "@angular/forms";
import {
  InAppBrowser,
  InAppBrowserOptions,
  InAppBrowserObject,
} from "@ionic-native/in-app-browser/ngx";
import { Stripe } from "@ionic-native/stripe/ngx";
import { Location } from "@angular/common";
import { UserService } from "../user.service";
import { EventService } from "../event.service";
import { isNgTemplate } from "@angular/compiler";
@Component({
  selector: "app-financial-settings",
  templateUrl: "./financial-settings.page.html",
  styleUrls: ["./financial-settings.page.scss"],
})
export class FinancialSettingsPage implements OnInit {
  loginInfo: any = [];
  payment_method: any = "";
  stripe_keys: any = [];
  is_spinner: string = "off";
  stripe_account_id: string = "";
  setting_spinner: string = "on";
  bank_spinner: string = "off";

  countries: any = [];
  stripe_accountInfo: any = [];
  kyc_url: string = "";

  payouts_enabled: boolean = false;
  charges_enabled: boolean = false;

  dwolla_iav_token: any = "";
  dwolla_source_verification_url: any = "";

  funding_sources_lists: any = [];
  dwolla_spinner: any = "off";

  card_spinner: string = "off";
  credit_cards: any = [];
  debit_cards: any = [];
  default_funding_source: any = "";
  res: any;
  ready: any = false;
  account_listing: any = [];
  constructor(
    public route: ActivatedRoute,
    public navCtrl: NavController,
    public storage: Storage,
    public router: Router,
    public plt: Platform,
    private stripe: Stripe,
    private location: Location,
    public userService: UserService,
    public loadingCtrl: LoadingController,
    public actionCtrl: ActionSheetController,
    public alertCtrl: AlertController,
    // public navParams: NavParams,
    private iab: InAppBrowser,
    public zone: NgZone,
    public event: EventService,
    public changeDetectorRef: ChangeDetectorRef
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
        this.GetExternalAccount();
      }
    });
  }

  ngOnInit() {
    this.event.getEvent().subscribe((res) => {
      console.log("Event->res:", res);
      if (res["funding_source_added"] == true) {
        //this.get_dwolla_funding_sources();
      }
    });
  }

  async delete_card(index: any, card_type: any) {
    console.log("card_type:", card_type);
    console.log("index:", index);
    let row: any[];
    let card_id = "";
    if (card_type == "credit_card") {
      let row = this.credit_cards[index];
      card_id = row.id;
    } else {
      let row = this.debit_cards[index];
      card_id = row.id;
    }
    console.log("row:", row);
    console.log("card_id:", card_id);
    const alert = await this.alertCtrl.create({
      header: "Confirmation",
      // subHeader: 'Subtitle',
      cssClass: "alertCancel",
      message: "Are you sure want to remove?",
      buttons: [
        {
          text: "Remove",
          handler: () => {
            let sendData = {
              token: this.loginInfo.token,
              card_id: card_id,
              card_type: card_type,
            };
            console.log("Delete Card:", sendData);
            this.userService.showLoader();
            this.userService.delete_stripe_card(sendData).subscribe(
              (response) => {
                this.userService.dismissLoading();
                if (response["status"] == "ok") {
                  this.userService.presentToast(response["msg"]);
                  if (card_type == "credit_card") {
                    this.credit_cards.splice(index, 1);
                  } else {
                    this.debit_cards.splice(index, 1);
                  }
                } else {
                  this.userService.presentAlert(response["msg"]);
                }
                this.changeDetectorRef.detectChanges();
              },
              (err) => {
                console.log("err:", err);
                this.userService.dismissLoading();
                this.userService.presentAlert(err.error.msg);
                if (err.error.error_code == "token_expired") {
                  this.storage.clear();
                  this.router.navigate(["/login"]);
                }
                this.changeDetectorRef.detectChanges();
              }
            );
          },
        },
        {
          text: "Cancel",
          role: "cancel",
          handler: () => {},
        },
      ],
    });
    await alert.present();
  }

  goto_edit_page(item: any) {
    console.log("item:", item);
    let navigationExtras: NavigationExtras = {
      queryParams: {
        cardInfo: JSON.stringify(item),
      },
    };
    this.navCtrl.navigateForward(["/edit-card"], navigationExtras);
  }

  async choose_card_type(type) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        card_type: type,
      },
    };
    this.navCtrl.navigateForward(["creditcard/" + type]);
  }

  goToAddBank() {
    this.navCtrl.navigateForward(["addbank"]);
  }
  //cardkyc

  async GetExternalAccount() {
    //get_cards
    let data = {
      token: this.loginInfo.token,
    };
    await this.userService.sendData("get_cards", data).subscribe(
      (data) => {
        this.res = data;
        if ((this.res.status = "ok")) {
          this.ready = true;
          this.account_listing = this.res;
        }
        return true;
      },
      (err) => {
        this.ready = true;
        this.userService.presentAlert(
          "something went wrong, please inform app admin."
        );
        return false;
      }
    );
  }

  change_payment_method(ev) {
    console.log("Is Value: ", ev.detail.value);
  }

  back() {
    this.navCtrl.back();
  }
}
