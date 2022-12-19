import { Component, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";
import { ModalController } from "@ionic/angular";
import { UserService } from "src/app/user.service";
import {
  UntypedFormGroup,
  Validators,
  UntypedFormControl,
} from "@angular/forms";
import { NavigationExtras, ActivatedRoute } from "@angular/router";
@Component({
  selector: "app-add-name",
  templateUrl: "./add-name.page.html",
  styleUrls: ["./add-name.page.scss"],
})
export class AddNamePage implements OnInit {
  loginInfo: any = [];
  signupStep3NameForm: UntypedFormGroup;
  constructor(
    public navCtrl: NavController,
    public route: ActivatedRoute,
    public UserService: UserService,
    public modalController: ModalController
  ) {
    this.signupStep3NameForm = new UntypedFormGroup({
      first_name: new UntypedFormControl(
        "",
        Validators.compose([Validators.minLength(1), Validators.required])
      ),
      last_name: new UntypedFormControl(""),
    });
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
      }
    });
  }

  ngOnInit() {}
  back() {
    this.navCtrl.back();
  }

  submit_step3(formData: any) {
    let sendData = {
      first_name: formData["first_name"],
      last_name: formData["last_name"],
      signup_step3_name: "done",
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
          this.navCtrl.navigateForward(["cash-marke"], navigationExtras);
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
