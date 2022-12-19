import { Component, OnInit } from "@angular/core";
import { AlertController, NavController } from "@ionic/angular";
import {
  UntypedFormGroup,
  Validators,
  UntypedFormControl,
} from "@angular/forms";
import { UserService } from "src/app/user.service";
import { Storage } from "@ionic/storage";

@Component({
  selector: "app-forgotpassword",
  templateUrl: "./forgotpassword.page.html",
  styleUrls: ["./forgotpassword.page.scss"],
})
export class ForgotpasswordPage implements OnInit {
  loginForm: UntypedFormGroup;
  loginForm1: UntypedFormGroup;
  loginForm2: UntypedFormGroup;
  passwordType = "password";
  CpasswordType = "password";
  getemailfromlocal;
  email;
  stepone: boolean = true;
  stepone1: boolean = false;
  stepone2: boolean = false;

  constructor(
    public userService: UserService,
    public navCtrl: NavController,
    public storage: Storage,
    public alertCtrl: AlertController
  ) {
    this.getemailfromlocal = localStorage.getItem("localemail");
    this.loginForm = new UntypedFormGroup({
      email: new UntypedFormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"),
        ])
      ),
    });
    this.loginForm1 = new UntypedFormGroup({
      password: new UntypedFormControl(
        "",
        Validators.compose([Validators.required])
      ),
    });
    this.loginForm2 = new UntypedFormGroup({
      password: new UntypedFormControl(
        "",
        Validators.compose([Validators.minLength(5), Validators.required])
      ),
      cpassword: new UntypedFormControl(
        "",
        Validators.compose([Validators.minLength(5), Validators.required])
      ),
    });
  }

  ngOnInit() {}

  hideShowPassword() {
    this.passwordType = this.passwordType === "text" ? "password" : "text";
  }

  hideShowcPassword() {
    this.CpasswordType = this.CpasswordType === "text" ? "password" : "text";
  }

  SendEmailservice() {
    this.userService.showLoader();
    this.userService.sendData("forgotPassword", this.loginForm.value).subscribe(
      (res) => {
        if (res["status"] == "error") {
          this.userService.presentToast(res["errormsg"]);
        } else {
          localStorage.setItem("localemail", this.loginForm.value.email);
          this.getemailfromlocal = this.loginForm.value.email;
          this.stepone = false;
          this.stepone1 = true;
          this.userService.presentToast("OTP send to your email Successfully!");
          this.userService.dismissLoading();
        }
      },
      (error) => {
        this.userService.presentToast(error.error.errormsg);
        this.userService.dismissLoading();
      }
    );
  }

  SendOtp() {
    this.userService.showLoader();
    this.userService
      .sendData("validateOTP", {
        otp: this.loginForm1.value.password,
        email: this.getemailfromlocal,
      })
      .subscribe(
        (res) => {
          if (res["status"] == "error") {
            this.userService.presentToast(res["errormsg"]);
          } else {
            this.stepone1 = false;
            this.stepone2 = true;
            this.userService.presentToast(
              "OTP send to your email Successfully!"
            );
            this.userService.dismissLoading();
          }
        },
        (error) => {
          this.userService.presentToast(error.error.errormsg);
          this.userService.dismissLoading();
        }
      );
  }

  passwordsent() {
    if (this.loginForm2.value.password != this.loginForm2.value.cpassword) {
      this.userService.presentToast(
        "Password and confirm password should match."
      );
      return false;
    }
    this.userService.showLoader();
    this.userService
      .sendData("updatePassword", {
        password: this.loginForm2.value.password,
        email: this.getemailfromlocal,
      })
      .subscribe(
        (res) => {
          this.userService.dismissLoading();
          if (res["status"] == "error") {
            this.userService.presentToast(res["errormsg"]);
          } else {
            this.stepone2 = true;
            this.userService.presentToast("Password reset Successfully!");
            this.navCtrl.navigateForward(["/login"]);
            this.userService.dismissLoading();
          }
        },
        (error) => {
          this.userService.presentToast(error.error.errormsg);
          this.userService.dismissLoading();
        }
      );
  }
}
