import { Component, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";
import { ModalController } from "@ionic/angular";
import { UserService } from "src/app/user.service";
import { NavigationExtras, ActivatedRoute } from "@angular/router";
import { FriendAccessModalPage } from "../modals/friend-access-modal/friend-access-modal.page";
@Component({
  selector: "app-friend-access",
  templateUrl: "./friend-access.page.html",
  styleUrls: ["./friend-access.page.scss"],
})
export class FriendAccessPage implements OnInit {
  loginInfo: any = [];
  login_user_id: any = "";
  friendAccess: any;
  constructor(
    public navCtrl: NavController,
    public route: ActivatedRoute,
    public UserService: UserService,
    public modalController: ModalController
  ) {
    this.route.params.subscribe((params) => {
      console.log("params:", params);
      if (
        params &&
        params["user_id"] &&
        params["user_id"] != null &&
        params["user_id"] != undefined
      ) {
        this.login_user_id = JSON.parse(params["user_id"]);
        console.log("params->login_user_id:", this.login_user_id);
      }
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
  async accessModal() {
    const modal = await this.modalController.create({
      component: FriendAccessModalPage,
      cssClass: "search_action",
    });
    return await modal.present();
  }

  allowFriend(value) {
    this.goto_next_page(value);
  }

  goto_next_page(friendAccess) {
    let sendData = {
      token: this.loginInfo.token,
      login_user_id: this.login_user_id,
      friendAccess: friendAccess,
      signup_step2_friend_access: "done", // or 'done' for complete
    };
    console.log("sendData:", sendData);
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
          this.navCtrl.navigateForward(["add-name"], navigationExtras);
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
