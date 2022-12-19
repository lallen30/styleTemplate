import { Component, OnInit } from "@angular/core";

import { NavController, Platform, AlertController } from "@ionic/angular";
import { UserService } from "../user.service";
import { Storage } from "@ionic/storage";
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";
import {
  UntypedFormGroup,
  Validators,
  UntypedFormControl,
} from "@angular/forms";
@Component({
  selector: "app-setting",
  templateUrl: "./setting.page.html",
  styleUrls: ["./setting.page.scss"],
})
export class SettingPage implements OnInit {
  settingform: UntypedFormGroup;
  is_pin: boolean = false;
  user: any = [];
  profile: any = [];
  already_pin: boolean = false;
  is_load: boolean = true;
  Frvalue: boolean = false;
  constructor(
    public navCtrl: NavController,
    public storage: Storage,
    public userService: UserService,
    public router: Router,
    public plt: Platform,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.settingform = new UntypedFormGroup({
      is_pin: new UntypedFormControl(false, Validators.required),
      friendAccess: new UntypedFormControl(false),
      pin: new UntypedFormControl(
        "",
        Validators.compose([Validators.maxLength(4), Validators.required])
      ),
      oldpin: new UntypedFormControl(""),
      confirm_pin: new UntypedFormControl(
        false,
        Validators.compose([Validators.maxLength(4), Validators.required])
      ),
    });
  }
  back() {
    this.navCtrl.back();
  }

  Change(event) {
    if (event.detail.checked) {
      this.is_pin = true;
    } else {
      this.is_pin = false;
      if (this.already_pin) {
        this.presentAlertPrompt();
      } else {
        let formData = this.settingform.value;
        if (formData.pin == "") {
          return false;
        }

        let sendData = {
          is_pin: 0,
          pin: "",
          is_validate: false,
          token: this.user.token,
        };

        this.UpdateSetting(sendData);
      }
    }
  }

  async presentAlertPrompt() {
    const alert = await this.alertController.create({
      cssClass: "my-custom-class",
      header: "Pin Confirm !",
      inputs: [
        {
          name: "pin",
          type: "number",
          placeholder: "Enter your Pin",
        },
      ],
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: () => {
            console.log("Confirm Cancel");
          },
        },
        {
          text: "Submit",
          handler: (data) => {
            console.log(data);
            let sendData = {
              is_pin: 0,
              is_validate: true,
              pin: data.pin,
              oldpin: data.oldpin,
              token: this.user.token,
            };
            this.UpdateSetting(sendData);
          },
        },
      ],
    });

    await alert.present();
  }

  friendAccessChange(event) {
    if (this.profile.friendAccess == "yes") {
      this.Frvalue = true;
    } else {
      this.Frvalue = false;
    }
    if (event.detail.checked !== this.Frvalue) {
      if (event.detail.checked == true) {
        let sendData = {
          friendAccess: "yes",
          token: this.user.token,
        };

        this.UpdateFriendAccessSetting(sendData);
      } else {
        let sendData = {
          friendAccess: "no",
          token: this.user.token,
        };
        this.UpdateFriendAccessSetting(sendData);
      }
    }
  }

  ionViewWillEnter() {
    console.log("API Calling");
    this.storage.get("user").then(
      (val) => {
        if (val != null) {
          this.user = val;
          this.getProfile(true);
          this.userService.SaveAutoConfiqure(this.user.token);
        } else {
          this.storage.clear();
          this.router.navigate(["/login"]);
        }
      },
      (err) => {
        this.storage.clear();
        this.router.navigate(["/login"]);
      }
    );
  }

  submit() {
    let sendData = this.settingform.value;
    sendData.token = this.user.token;
    sendData.is_validate = false;
    if (sendData.pin === sendData.confirm_pin) {
      sendData.is_pin = 1;
      this.UpdateSetting(sendData);
    } else {
      this.userService.presentAlert("Pin and confirm pin should be same");
      return false;
    }
  }

  UpdateSetting(sendData) {
    this.userService.showLoader();
    this.userService.sendData("saveSetting", sendData).subscribe(
      (res) => {
        let result: any = res;
        this.userService.dismissLoading();
        if (result.status === "ok") {
          this.getProfile(false);
          this.userService.presentAlert(result.msg);
        } else {
          this.userService.presentAlert("Something went Wrong");
        }
      },
      (err) => {
        this.userService.dismissLoading();
        if (err.error.error_code == "pin_error") {
          this.settingform.patchValue({
            is_pin: this.profile.is_pin,
          });
          this.getProfile(false);
          this.userService.presentAlert(err.error.msg);
        }
      }
    );
  }

  UpdateFriendAccessSetting(sendData) {
    // if(this.is_load){
    //   this.is_load=false;
    //    return false;
    // }
    this.userService.showLoader();
    this.userService.sendData("saveSettingfriendAccess", sendData).subscribe(
      (res) => {
        let result: any = res;
        this.userService.dismissLoading();
        if (result.status === "ok") {
          this.getProfile(false);
          this.userService.presentAlert(result.msg);
        } else {
          this.userService.presentAlert("Something went Wrong");
        }
      },
      (err) => {
        this.userService.dismissLoading();
        if (err.error.error_code == "pin_error") {
          this.settingform.patchValue({
            is_pin: this.profile.is_pin,
          });
          this.getProfile(false);
          this.userService.presentAlert(err.error.msg);
        }
      }
    );
  }

  getProfile(is_loading) {
    if (is_loading) {
      this.userService.showLoader();
    }
    this.is_load = true;
    this.userService.getData("getProfile?token=" + this.user.token).subscribe(
      (response) => {
        if (is_loading) {
          this.userService.dismissLoading();
        }
        if (response["status"] == "ok") {
          this.profile = response["loginInfo"];
          if (this.profile.is_pin == 1) {
            this.is_pin = true;
            this.already_pin = true;
            this.settingform.patchValue({
              is_pin: this.profile.is_pin,
            });
          } else {
            this.already_pin = false;
          }

          if (this.profile.friendAccess == "yes") {
            this.settingform.patchValue({
              friendAccess: true,
            });
          } else {
            this.settingform.patchValue({
              friendAccess: false,
            });
          }
        } else {
          this.userService.presentToast(response["msg"]);
        }
      },
      (err) => {
        if (is_loading) {
          this.userService.dismissLoading();
        }
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

  pinGenerate() {
    this.userService.showLoader();
    let sendData = {
      token: this.user.token,
    };
    this.userService.sendData("pinResetToken", sendData).subscribe(
      (res) => {
        let result: any = res;
        this.userService.dismissLoading();
        if (result.status === "ok") {
          this.userService.presentAlert(result.msg);
        } else {
          this.userService.presentAlert("Something went Wrong");
        }
      },
      (err) => {
        this.userService.dismissLoading();
        if (err.error.error_code == "pin_error") {
          this.settingform.patchValue({
            is_pin: this.profile.is_pin,
          });
          this.userService.presentAlert(err.error.msg);
        }
      }
    );
  }
}
