import { Component, OnInit } from "@angular/core";
import { UserService } from "../user.service";
import { NavController } from "@ionic/angular";
import {
  UntypedFormGroup,
  Validators,
  UntypedFormControl,
} from "@angular/forms";
import { NavigationExtras } from "@angular/router";
import {
  InAppBrowser,
  InAppBrowserOptions,
  InAppBrowserObject,
} from "@ionic-native/in-app-browser/ngx";
@Component({
  selector: "app-register",
  templateUrl: "./register.page.html",
  styleUrls: ["./register.page.scss"],
})
export class RegisterPage implements OnInit {
  registerForm: UntypedFormGroup;
  passwordType = "password";
  termuse;
  privacy;
  dwolla_tos_url = "https://www.dwolla.com/legal/tos/";
  dwolla_privacy_url = "https://www.dwolla.com/legal/privacy/";
  constructor(
    public navCtrl: NavController,
    public userService: UserService,
    private iab: InAppBrowser
  ) {
    this.registerForm = new UntypedFormGroup({
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
      accept_terms_conditions: new UntypedFormControl(
        false,
        Validators.compose([Validators.required])
      ),
    });
  }

  ngOnInit() {}
  goto(url) {
    this.navCtrl.navigateForward(url);
  }
  termcon(ev) {
    let check = ev.target.checked;
    if (check == false) {
      this.termuse = true;
    } else {
      this.termuse = false;
    }
  }
  privacypol(ev) {
    let check = ev.target.checked;
    if (check == false) {
      this.privacy = true;
    } else {
      this.privacy = false;
    }
  }
  openVerify() {
    let sendData = this.registerForm.value;
    sendData["signup_step1_email_otp"] = "pending";
    console.log("sendData:", sendData);
    if (this.registerForm.value.accept_terms_conditions == false) {
      this.userService.presentToast("Please accept terms & conditions.");
      return false;
    }
    this.userService.showLoader();
    this.userService.sendData("verifyemail_and_send_otp", sendData).subscribe(
      (res) => {
        this.userService.dismissLoading();
        console.log("res:", res);
        if (res["status"] == "ok") {
          this.userService.presentToast(res["msg"]);
          let navigationExtras: NavigationExtras = {
            queryParams: {
              registerData: JSON.stringify(this.registerForm.value),
              otp: res["otp"],
            },
          };
          this.navCtrl.navigateForward(["/verifyemail"], navigationExtras);
        } else {
          this.userService.presentToast(res["msg"]);
        }
      },
      (err) => {
        console.log("err:", err);
        this.userService.presentToast(err.error.msg);
        this.userService.dismissLoading();
      }
    );
  }
  hideShowPassword() {
    this.passwordType = this.passwordType === "text" ? "password" : "text";
  }

  open_url(type: any) {
    let url = "";
    if (type == "dwolla_privacy") {
      url = this.dwolla_privacy_url;
    } else {
      url = this.dwolla_tos_url;
    }
    console.log("URL:", url);
    let options: InAppBrowserOptions = {
      statusbar: {
        //color: "#51688F",
      },
      title: {
        //color: "#ffffff",
        staticText: "Verify Funding Sources",
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
        //event: 'closePressed'
      },
      backButtonCanClose: true,
      location: "no",
      footercolor: "#c7fedc",
      hidenavigationbuttons: "yes",
      hideurlbar: "yes",
      //toolbarcolor: "#c7fedc",
      //hidden: 'yes',
      clearcache: "yes",
      clearsessioncache: "yes",
    };
    const b: InAppBrowserObject = this.iab.create(url, "_blank", options);
    let orderPlaced = false;
    b.on("loadstart").subscribe((res) => {
      console.log("loadstart->res:", res);
    });
    b.on("loadstop").subscribe((res) => {
      console.log("loadstop->res:", res);
    });

    b.on("exit").subscribe((res) => {
      console.log("exit->res:", res);
    });
  }
}
