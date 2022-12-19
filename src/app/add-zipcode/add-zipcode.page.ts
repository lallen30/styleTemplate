import { Component, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";
import { ModalController, AlertController } from "@ionic/angular";
import { UserService } from "src/app/user.service";
import { FormGroup, Validators, FormControl } from "@angular/forms";
import { NavigationExtras, ActivatedRoute } from "@angular/router";
@Component({
  selector: "app-add-zipcode",
  templateUrl: "./add-zipcode.page.html",
  styleUrls: ["./add-zipcode.page.scss"],
})
export class AddZipcodePage implements OnInit {
  loginInfo: any = [];
  zipcode: any = "";
  validate_spinner = "";
  validatation_msg = "";
  is_available: string = "no";

  constructor(
    public navCtrl: NavController,
    public route: ActivatedRoute,
    public UserService: UserService,
    public modalController: ModalController,
    private alertCtrl: AlertController
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
        if (this.loginInfo.zipcode != "") {
          this.zipcode = this.loginInfo.zipcode;
        }
      }
    });
  }

  ngOnInit() {}

  ionViewWillEnter() {}

  back() {
    this.navCtrl.back();
  }

  save_zipcode() {
    if (this.zipcode == "") {
      this.UserService.presentToast("Please enter zipcode.");
      return false;
    }
    let sendData = {
      zipcode: this.zipcode,
      signup_step5_add_zipcode: "done",
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
          this.UserService.set_loginInfo_in_storage(this.loginInfo);
          this.navCtrl.navigateForward(["/tabs/mywallet"], navigationExtras);
          this.presentAlertmsg();
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

  async presentAlertmsg() {
    let alert = await this.alertCtrl.create({
      message:
        "Zoom Pay is only to be used for sending and receiving money for personal use.  No coverage for purchases of goods or services or payments is covered.",
      buttons: [
        {
          text: "Ok",
          handler: () => {},
        },
      ],
    });

    await alert.present();
  }
}
