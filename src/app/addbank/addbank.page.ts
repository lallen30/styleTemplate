import { Component, OnInit } from "@angular/core";
import { Storage } from "@ionic/storage";
import {
  NavController,
  LoadingController,
  AlertController,
  Platform,
} from "@ionic/angular";
import { UserService } from "../user.service";
import { EventService } from "../event.service";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import {
  Validators,
  UntypedFormGroup,
  UntypedFormControl,
} from "@angular/forms";
import { Stripe } from "@ionic-native/stripe/ngx";

@Component({
  selector: "app-addbank",
  templateUrl: "./addbank.page.html",
  styleUrls: ["./addbank.page.scss"],
})
export class AddbankPage implements OnInit {
  slideOpts = {
    slidesPerView: 1.1,
    spaceBetween: 10,
  };
  card_form: UntypedFormGroup;
  user: any;
  cardres;
  loginInfo: any = [];
  stripe_keys: any = [];
  card_type: string = "credit_card";
  constructor(
    public route: ActivatedRoute,
    public navCtrl: NavController,
    public storage: Storage,
    public router: Router,
    public plt: Platform,
    private stripe: Stripe,
    public UserService: UserService,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public event: EventService
  ) {
    this.card_form = new UntypedFormGroup({
      account_holder_name: new UntypedFormControl(
        "",
        Validators.compose([Validators.required])
      ),
      routing_number: new UntypedFormControl(
        "",
        Validators.compose([Validators.required])
      ),
      account_number: new UntypedFormControl(
        "",
        Validators.compose([Validators.required])
      ),
    });
  }

  ngOnInit() {}
  back() {
    this.navCtrl.back();
  }
  ionViewWillEnter() {
    this.route.queryParams.subscribe((params) => {
      console.log("params:", params);
      if (params && params.card_type) {
        this.card_type = params.card_type;
      }
    });
    console.log("card_type:", this.card_type);

    this.storage.get("user").then((val) => {
      if (val != null) {
        this.user = val;
        this.loginInfo = val;
        console.log("loginInfo:", this.loginInfo);
        this.GetSetting();
      } else {
        this.storage.clear();
        this.router.navigate(["/login"]);
      }
    });
  }
  GetSetting() {
    this.UserService.GetSetting({ token: this.loginInfo?.token }).subscribe(
      (res) => {
        console.log("Get_setting->Res:", res);
        if (res["stripe_keys"]) {
          this.stripe_keys = res["stripe_keys"];
          console.log("stripe_keys:", this.stripe_keys);
        }
      }
    );
  }
  CreatePayment(card) {
    this.stripe.setPublishableKey(this.stripe_keys.publishable_key);
    let card_new = {
      routing_number: card.routing_number,
      account_number: card.account_number,
      account_holder_name: card.account_holder_name,
      currency: "USD",
      country: "US",
    };
    this.UserService.showLoader();
    this.stripe
      .createBankAccountToken(card_new)
      .then((token) => {
        let sendData = {
          token: this.user.token,
          card_type: "debit_card",
          stripeToken: token["id"],
        };
        this.UserService.add_card(sendData).subscribe(
          (res) => {
            this.event.publishEvent({ event: "fetch_card" });
            this.cardres = res;
            this.UserService.dismissLoading();
            if (this.cardres.status == "ok") {
              this.card_form.reset();
              this.event.publishEvent({
                event: "check_kyc",
                token: this.loginInfo.token,
              });
              this.navCtrl.navigateForward("financial-settings");
            }
          },
          (err) => {
            let msg = err.error.msg;
            if (msg == "") {
              this.UserService.presentAlert(
                "something went wrong, please try again later."
              );
            } else {
              this.UserService.presentAlert(msg);
            }
            this.UserService.dismissLoading();
            if (err.error.error_code == "user_not_found") {
              this.router.navigate(["/login"]);
            }
          }
        );
      })
      .catch((error) => {
        this.UserService.presentAlert(error);
        this.UserService.dismissLoading();
      });
  }
}
