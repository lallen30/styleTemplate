import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { Storage } from "@ionic/storage";
import {
  NavController,
  LoadingController,
  AlertController,
  Platform,
} from "@ionic/angular";
import { UserService } from "../user.service";
import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup, Validators, FormControl } from "@angular/forms";

@Component({
  selector: "app-add-funds",
  templateUrl: "./add-funds.page.html",
  styleUrls: ["./add-funds.page.scss"],
})
export class AddFundsPage implements OnInit {
  availablebalnc = 0;
  number: any;
  user: any;

  loginInfo: any = [];
  wallletInfo: any = [];
  dwolla_spinner: string = "off";
  funding_sources_lists: any = [];

  destination_source_url: any = "";
  verified_source_url: any = "";

  walletInfo: any = [];
  constructor(
    public navCtrl: NavController,
    public storage: Storage,
    public plt: Platform,
    public UserService: UserService,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    public changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {}
  back() {
    this.navCtrl.back();
  }
  cut() {
    this.number = this.number.substring(0, this.number.length - 1);
  }
  ionViewWillEnter() {
    this.storage.get("user").then((val) => {
      if (val != null) {
        this.loginInfo = val;
        this.user = val;
        this.get_dwolla_funding_sources();
      } else {
        this.storage.clear();
        this.router.navigate(["/login"]);
      }
    });
  }

  get_dwolla_funding_sources() {
    let sendData = {
      token: this.loginInfo.token,
    };
    this.dwolla_spinner = "on";
    this.UserService.sendData("get_funding_sources_list", sendData).subscribe(
      (res) => {
        this.dwolla_spinner = "off";
        console.log("res:", res);
        if (res["status"] == "success") {
          let funding_sources_lists = res["funding_sources_lists"];
          funding_sources_lists.forEach((element) => {
            if (element["type"] == "balance") {
              this.wallletInfo = element;
              console.log("wallletInfo:", this.wallletInfo);
            } else {
              this.funding_sources_lists.push(element);
            }
          });
          console.log("funding_sources_lists:", this.funding_sources_lists);
          this.changeDetectorRef.detectChanges();
        } else {
          this.UserService.presentToast(res["msg"]);
        }
      },
      (err) => {
        this.dwolla_spinner = "off";
        console.log("err:", err);
        if (err?.error?.error_code == "token_expired") {
          this.storage.clear();
          this.router.navigate(["/login"]);
          this.UserService.presentToast(err.error.msg);
        } else {
          this.UserService.presentToast("Something went Wrong");
        }
      }
    );
  }

  pressing_number_paid(val) {
    if (this.number == undefined) {
      this.number = val;
    } else {
      this.number = this.number + val;
    }
  }

  add_wallet() {
    if (!this.wallletInfo.funding_source_url) {
      this.UserService.presentToast(
        "To enable wallet functionality, Please complete your KYC requirements."
      );
      return false;
    }
    if (this.number > 0) {
      if (this.verified_source_url == "") {
        this.UserService.presentToast("Please select a funding source.");
        return false;
      }
      let sendData = {
        token: this.loginInfo.token,
        amount: this.number,
        type: "wallet",
        verified_source_url: this.verified_source_url,
        destination_url: this.wallletInfo.funding_source_url,
        to_user_id: 0,
      };
      console.log("sendData:", sendData);
      this.UserService.showLoader("Adding funds..");
      this.UserService.sendData("transfer_amount", sendData).subscribe(
        (response) => {
          // this.UserService.sendData('add_funds_in_dwolla_wallet', sendData).subscribe((response) => {
          console.log("response:", response);
          this.UserService.dismissLoading();
          if (response["status"] == "ok") {
            if (response["walletInfo"]) {
              this.walletInfo = response["walletInfo"];
              this.storage.set("walletInfo", this.walletInfo);
            }
            this.UserService.presentToast(response["msg"]);
            this.back();
          } else {
            this.UserService.presentToast(response["msg"]);
          }
        },
        (err) => {
          console.log("err:", err);
          this.UserService.dismissLoading();
          this.UserService.presentToast(err.error.msg);
        }
      );
    } else {
      this.UserService.presentToast("Please enter amount.");
    }
  }
}
