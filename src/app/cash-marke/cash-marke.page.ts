import { Component, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";
import { ModalController } from "@ionic/angular";
import { UserService } from "src/app/user.service";
import { FormGroup, Validators, FormControl } from "@angular/forms";
import { NavigationExtras, ActivatedRoute } from "@angular/router";
@Component({
  selector: "app-cash-marke",
  templateUrl: "./cash-marke.page.html",
  styleUrls: ["./cash-marke.page.scss"],
})
export class CashMarkePage implements OnInit {
  loginInfo: any = [];
  zoompay_marker: any = "";
  validate_spinner = "";
  validatation_msg = "";
  is_available: string = "no";

  constructor(
    public navCtrl: NavController,
    public route: ActivatedRoute,
    public UserService: UserService,
    public modalController: ModalController
  ) {
    this.route.queryParams.subscribe((queryParams) => {
      console.log("queryParams:", queryParams);
      if (
        queryParams &&
        queryParams["loginInfo"] &&
        queryParams["loginInfo"] != null &&
        queryParams["loginInfo"] != undefined
      ) {
        this.loginInfo = JSON.parse(queryParams["loginInfo"]);
        console.log("queryParams->loginInfo:", this.loginInfo);
        this.zoompay_marker = "ZP-" + this.loginInfo.user_id;
        this.validate_zoompay_marker();
      }
    });
  }

  ngOnInit() {}

  ionViewWillEnter() {}

  back() {
    this.navCtrl.back();
  }

  validate_zoompay_marker() {
    console.log("zoompay_marker:", this.zoompay_marker);
    // console.log("this.zoompay_marker.length:", this.zoompay_marker.length);
    let sendData = {
      zoompay_marker: this.zoompay_marker,
      signup_step4_zoompay_marker: "pending",
    };
    if (this.loginInfo["token"]) {
      sendData["token"] = this.loginInfo.token;
    } else if (this.loginInfo["user_id"]) {
      sendData["login_user_id"] = this.loginInfo.user_id;
    }
    console.log("SendData:", sendData);
    this.validate_spinner = "on";
    this.UserService.sendData("validate_zoompay_marker", sendData).subscribe(
      (response) => {
        console.log("response:", response);
        this.validate_spinner = "off";
        if (response["status"] == "ok") {
          this.validatation_msg = response["msg"];
          this.is_available = response["is_available"];
          // this.loginInfo = response['loginInfo'];
          // let navigationExtras: NavigationExtras = {
          //     queryParams: {
          //         loginInfo : JSON.stringify(this.loginInfo),
          //     }
          // };
          // this.navCtrl.navigateForward(['cash-marke'], navigationExtras);
        } else {
          this.UserService.presentToast(response["msg"]);
        }
      },
      (err) => {
        console.log("Err:", err);
        this.validate_spinner = "off";
        if (err.error.msg) {
          this.UserService.presentToast(err.error.msg);
        } else {
          this.UserService.presentToast("Something went wrong. Try again");
        }
      }
    );
  }

  save_zoompay_marker() {
    let sendData = {
      token: this.loginInfo.token,
      zoompay_marker: this.zoompay_marker,
      signup_step4_zoompay_marker: "done",
    };
    if (this.loginInfo["token"]) {
      sendData["token"] = this.loginInfo.token;
    } else if (this.loginInfo["user_id"]) {
      sendData["login_user_id"] = this.loginInfo.user_id;
    }
    console.log("SendData:", sendData);
    this.UserService.showLoader("Please wait..");
    this.UserService.sendData("updateProfile", sendData).subscribe(
      (response) => {
        console.log("response:", response);
        this.UserService.dismissLoading();
        if (response["status"] == "ok") {
          this.loginInfo = response["loginInfo"];
          let navigationExtras: NavigationExtras = {
            queryParams: {
              loginInfo: JSON.stringify(this.loginInfo),
            },
          };
          this.navCtrl.navigateForward(["add-zipcode"], navigationExtras);
        } else {
          this.UserService.presentToast(response["msg"]);
        }
      },
      (err) => {
        console.log("Err:", err);
        this.UserService.dismissLoading();
        if (err.error.msg) {
          this.UserService.presentToast(err.error.msg);
        } else {
          this.UserService.presentToast("Something went wrong. Try again");
        }
      }
    );
  }
}
