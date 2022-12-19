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
  selector: "app-creditcard",
  templateUrl: "./creditcard.page.html",
  styleUrls: ["./creditcard.page.scss"],
})
export class CreditcardPage implements OnInit {
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
      name: new UntypedFormControl(
        "",
        Validators.compose([Validators.required, Validators.minLength(2)])
      ),
      number: new UntypedFormControl(""),
      expire_date: new UntypedFormControl(""),
      cvc: new UntypedFormControl(
        "",
        Validators.compose([Validators.required, Validators.minLength(3)])
      ),
    });
  }

  ngOnInit() {
    this.card_type = this.route.snapshot.paramMap.get("card_type");
  }
  back() {
    this.navCtrl.back();
  }
  ionViewWillEnter() {
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
    let card_details = card.expire_date.split("/");
    this.stripe.setPublishableKey(this.stripe_keys.publishable_key);
    let card_new = {
      name: card.name,
      number: card.number,
      expMonth: card_details[0],
      expYear: card_details[1],
      cvc: card.cvc,
      currency: "USD",
    };
    this.UserService.showLoader();
    this.stripe
      .createCardToken(card_new)
      .then((token) => {
        let sendData = {
          token: this.user.token,
          card_type: this.card_type,
          stripeToken: token.id,
        };
        this.UserService.add_card(sendData).subscribe(
          (res) => {
            this.event.publishEvent({ event: "fetch_card" });
            this.cardres = res;
            this.UserService.dismissLoading();
            if (this.cardres.status == "ok") {
              this.card_form.reset();
              if (this.card_type == "debit_card") {
                this.event.publishEvent({
                  event: "check_kyc",
                  token: this.loginInfo.token,
                });
              }
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
