import { Component, OnInit } from "@angular/core";
import { Storage } from "@ionic/storage";
import {
  NavController,
  LoadingController,
  AlertController,
  Platform,
} from "@ionic/angular";
import { UserService } from "../user.service";
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";
import { EventService } from "../event.service";
@Component({
  selector: "app-listing",
  templateUrl: "./listing.page.html",
  styleUrls: ["./listing.page.scss"],
})
export class ListingPage implements OnInit {
  requests: any = [];
  loginInfo: any = [];
  spinner: any = "off";
  constructor(
    public navCtrl: NavController,
    public storage: Storage,
    public plt: Platform,
    public UserService: UserService,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    public event: EventService
  ) { }
  ngOnInit() { }
  back() {
    this.router.navigate(["/tabs/mywallet"]);
  }
  ionViewWillEnter() {
    this.storage.get("user").then(
      (val) => {
        if (val != null) {
          this.loginInfo = val;
          this.getlist();
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
  getlist() {
    let option = {
      token: this.loginInfo.token,
    };
    this.spinner = "on";
    this.UserService.sendData("get_requests", option).subscribe(
      (response) => {
        console.log("response:", response);
        this.spinner = "off";
        if (response["status"] == "ok") {
          this.requests = response["requests"];
          console.log("requests:", this.requests);
          this.event.publishEvent({
            event: "reload_badge",
            token: this.loginInfo.token,
          });
        } else {
          this.UserService.presentToast(response["msg"]);
        }
      },
      (err) => {
        this.spinner = "off";
        if (err.error.error_code == "token_expired") {
          this.UserService.presentToast(err.error.msg);
        } else {
          this.UserService.presentToast(err.error.msg);
        }
      }
    );
  }
  accprej(status, data) {
    if (status == "accept") {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          secondUser: JSON.stringify(data),
        },
      };
      this.navCtrl.navigateForward(["/accpetmoneysend"], navigationExtras);
    } else {
      this.UserService.showLoader();
      const option = {
        token: this.loginInfo.token,
        status: status,
        request_id: data.request_id,
        requestorid: data.requestorid,
      };
      this.UserService.sendData("requestStatusUpdate", option).subscribe(
        (res) => {
          this.UserService.dismissLoading();
          this.getlist();
        },
        (err) => {
          this.UserService.dismissLoading();
          this.UserService.presentAlert("Something went wrong");
        }
      );
    }
  }
  async goto_detail_page(requestInfo) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        requestInfo: JSON.stringify(requestInfo),
      },
    };
    this.navCtrl.navigateForward(["/requestpay"], navigationExtras);
  }
  reload() {
    this.getlist();
  }

  async change_request_status(index, new_status) {
    let message = "Are you sure want?";
    if (new_status == "cancelled") {
      message = "Are you sure want to cancel?";
    }
    let item = this.requests[index];
    console.log("item:", item);
    let sendData = {
      token: this.loginInfo.token,
      request_id: item.request_id,
      amount: item.amount,
      requested_user_id: item.requested_user_id,
      new_status: new_status,
    };
    console.log("sendData:", sendData);
    const alert = await this.alertCtrl.create({
      header: "Confirmation",
      message: message,
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: (blah) => { },
        },
        {
          text: "Confirm",
          handler: () => {
            this.UserService.showLoader();
            this.UserService.sendData(
              "change_request_status",
              sendData
            ).subscribe(
              (response) => {
                console.log("response:", response);
                this.UserService.dismissLoading();
                if (response["status"] == "ok") {
                  this.UserService.presentToast(response["msg"]);
                  this.requests[index] = response["requestInfo"];
                } else {
                }
              },
              (err) => {
                console.log("Err:", err);
                this.UserService.dismissLoading();
                if (err.error.error_code == "token_expired") {
                  this.UserService.presentToast(err.error.msg);
                } else {
                  this.UserService.presentToast(err.error.msg);
                }
              }
            );
          },
        },
      ],
    });
    await alert.present();
  }
}
