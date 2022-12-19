import { Component, OnInit } from "@angular/core";
import { UserService } from "../user.service";
import { NavController } from "@ionic/angular";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-verifyemail",
  templateUrl: "./verifyemail.page.html",
  styleUrls: ["./verifyemail.page.scss"],
})
export class VerifyemailPage implements OnInit {
  otp = 0;
  o1;
  o2;
  o3;
  o4;
  sendData: any = [];
  sent_opt: any = "";
  constructor(
    public route: ActivatedRoute,
    public userService: UserService,
    public navCtrl: NavController
  ) {
    this.route.queryParams.subscribe((params) => {
      console.log("params:", params);
      if (params["registerData"]) {
        this.sendData = JSON.parse(params["registerData"]);
        console.log("sendData:", this.sendData);
      }
      if (params["otp"]) {
        this.sent_opt = params["otp"];
        console.log("sent_opt:", this.sent_opt);
      }
    });
  }

  ngOnInit() {}
  back() {
    this.navCtrl.back();
  }
  submit() {
    if (this.sent_opt && this.sendData.email && this.sendData.password) {
      if (parseInt(this.o1) == parseInt(this.sent_opt)) {
        let sendData = this.sendData;
        sendData["user_otp"] = this.o1;
        sendData["sent_opt"] = this.sent_opt;
        sendData["signup_step1_email_otp"] = "done";

        console.log("sendData:", sendData);
        this.userService.showLoader();
        this.userService.sendData("register", sendData).subscribe(
          (res) => {
            let result: any = res;
            if (result) {
              console.log(res);
              this.userService.dismissLoading();
              //this.userService.presentToast("Your email is verified now.You can Sign in!")
              this.navCtrl.navigateForward("friend-access/" + result.user_id);
            }
          },
          (error) => {
            this.userService.dismissLoading();
            this.userService.presentToast(
              "Not able to submit right now. Please try after some time!"
            );
          }
        );
      } else {
        this.userService.presentToast("OTP does not match. Please try again");
      }
    } else {
      this.userService.presentToast("Please go back and try again.");
    }
  }
}
