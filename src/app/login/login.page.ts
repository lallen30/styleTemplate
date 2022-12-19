import { Component, OnInit } from "@angular/core";
import { AlertController, NavController } from "@ionic/angular";
import {
  UntypedFormGroup,
  Validators,
  UntypedFormControl,
} from "@angular/forms";
import { UserService } from "src/app/user.service";
import { Storage } from "@ionic/storage";
import { NavigationExtras } from "@angular/router";
import { EventService } from "../event.service";
@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit {
  loginForm: UntypedFormGroup;
  passwordType = "password";
  loginInfo: any = [];
  rememberCheck: boolean = false;
  constructor(
    public userService: UserService,
    public navCtrl: NavController,
    public storage: Storage,
    public event: EventService,
    public alertCtrl: AlertController
  ) {
    this.loginForm = new UntypedFormGroup({
      email: new UntypedFormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"),
        ])
      ),
      password: new UntypedFormControl(
        "",
        Validators.compose([Validators.minLength(5), Validators.required])
      ),
    });
  }

  ngOnInit() {}

  ionViewWillEnter() {
    this.storage.get("remember_logininfo").then((val) => {
      if (val != null) {
        console.log(val);
        this.loginForm.controls["email"].setValue(val.email);
        this.loginForm.controls["password"].setValue(val.password);
        this.rememberCheck = val.rememberCheck;
      }
    });
  }

  hideShowPassword() {
    this.passwordType = this.passwordType === "text" ? "password" : "text";
  }
  signIn() {
    this.userService.showLoader();
    this.userService.auth("token", this.loginForm.value).subscribe(
      (res) => {
        console.log("res:", res);
        this.userService.dismissLoading();
        if (res["status"] == "ok") {
          if (res["loginInfo"]) {
            this.loginInfo = res["loginInfo"];
            console.log("loginInfo:", this.loginInfo);
            if (this.rememberCheck) {
              let login = {
                email: this.loginForm.value.email,
                password: this.loginForm.value.password,
                rememberCheck: this.rememberCheck,
              };
              this.userService.set_rememberlogin_storage(login);
            } else {
              this.storage.remove("remember_logininfo");
            }

            if (this.loginInfo.signup_step2_friend_access == "") {
              let navigationExtras: NavigationExtras = {
                queryParams: {
                  loginInfo: JSON.stringify(this.loginInfo),
                },
              };
              this.navCtrl.navigateForward(
                ["friend-access/" + this.loginInfo.user_id],
                navigationExtras
              );
            } else if (
              this.loginInfo.signup_step3_name == "" ||
              this.loginInfo.signup_step3_name == "pending"
            ) {
              let navigationExtras: NavigationExtras = {
                queryParams: {
                  loginInfo: JSON.stringify(this.loginInfo),
                },
              };
              this.navCtrl.navigateForward(["add-name"], navigationExtras);
            } else if (
              this.loginInfo.zoompay_marker == "" ||
              this.loginInfo.signup_step4_zoompay_marker == "" ||
              this.loginInfo.signup_step4_zoompay_marker == "pending"
            ) {
              let navigationExtras: NavigationExtras = {
                queryParams: {
                  loginInfo: JSON.stringify(this.loginInfo),
                },
              };
              this.navCtrl.navigateForward(["cash-marke"], navigationExtras);
            } else if (
              this.loginInfo.zipcode == "" ||
              this.loginInfo.signup_step5_add_zipcode == "" ||
              this.loginInfo.signup_step5_add_zipcode == "pending"
            ) {
              let navigationExtras: NavigationExtras = {
                queryParams: {
                  loginInfo: JSON.stringify(this.loginInfo),
                },
              };
              this.navCtrl.navigateForward(["add-zipcode"], navigationExtras);
            } else {
              this.userService.set_loginInfo_in_storage(this.loginInfo);
              this.event.publishEvent({
                event: "reload_badge",
                token: this.loginInfo.token,
              });
              this.navCtrl.navigateForward(["/tabs/mywallet"]);
              this.presentAlertmsg();
            }

            // if(res['user_create_profile_flag'] == "0"){
            //   this.navCtrl.navigateForward("createaccount")
            // }else{
            //   if(res['kyc_status'] == '0'){
            //     // this.presentAlert('Please setup your bank account information to send or receive money.')
            //     }
            //
          } else {
            this.userService.presentToast("Login fail. Try again");
          }
        } else {
          this.userService.presentToast(res["msg"]);
        }
      },
      (err) => {
        console.log("err:", err);
        this.userService.presentToast(err.error.message);
        this.userService.dismissLoading();
      }
    );
  }
  async presentAlert(msg) {
    let alert = await this.alertCtrl.create({
      message: msg,
      buttons: [
        {
          text: "Setup Now",
          handler: () => {
            this.navCtrl.navigateForward("cardkyc");
          },
        },
        {
          text: "Later",
          handler: () => {},
        },
      ],
    });

    await alert.present();
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
