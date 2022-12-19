import { Component, OnInit } from "@angular/core";
import { Storage } from "@ionic/storage";
import {
  NavController,
  LoadingController,
  AlertController,
  Platform,
  ActionSheetController,
} from "@ionic/angular";
import { UserService } from "../user.service";
import { Router } from "@angular/router";
import { EventService } from "../event.service";
@Component({
  selector: "app-mywallet",
  templateUrl: "./mywallet.page.html",
  styleUrls: ["./mywallet.page.scss"],
})
export class MywalletPage implements OnInit {
  slideOpts = {
    slidesPerView: 2.2,
    spaceBetween: 10,
  };
  availablebalnc = 0;
  page: number = 1;
  transactions: any = [];
  user_spinner: string = "off";
  loginInfo: any = [];
  wallet_spinner: string = "off";
  walletInfo: any = [];
  ready: boolean = false;
  result: any;

  ready_balance: boolean = false;
  result_bal: any;
  constructor(
    public navCtrl: NavController,
    public storage: Storage,
    public plt: Platform,
    public userService: UserService,
    public loadingCtrl: LoadingController,
    public alertCtrresultl: AlertController,
    public router: Router,
    public action: ActionSheetController,
    public event: EventService
  ) { }

  ngOnInit() {
    this.event.getEvent().subscribe((res) => {
      if (res["walletInfo"] == true) {
        this.get_walletInfo();
      }
    });
  }

  ionViewWillEnter() {
    this.storage.get("user").then((val) => {
      if (val != null) {
        this.loginInfo = val;
        console.log("loginInfo:", this.loginInfo);
        this.event.publishEvent({
          event: "reload_badge",
          token: this.loginInfo.token,
        });
        this.get_wallet_histories();
      } else {
        this.storage.clear();
        this.router.navigate(["/login"]);
      }
    });
    this.get_walletInfo();
  }

  get_walletInfo() {
    this.storage.get("walletInfo").then((walletInfo) => {
      if (walletInfo != null) {
        this.walletInfo = walletInfo;
        console.log("walletInfo:", this.walletInfo);
      }
    });
  }

  get_wallet_histories() {
    let sendData = {
      token: this.loginInfo.token,
    };
    console.log("SendData:", sendData);
    this.wallet_spinner = "on";
    this.userService.sendData("get_wallet_histories", sendData).subscribe(
      (response) => {
        console.log("response:", response);
        this.wallet_spinner = "off";
        if (response["status"] == "ok") {
          this.transactions = response["transactions"];
          console.log("transactions:", this.transactions);
        } else {
          this.userService.presentToast(response["msg"]);
        }
      },
      (err) => {
        console.log("err:", err);
        this.wallet_spinner = "off";
        this.userService.presentToast(err.error.msg);
        if (err.error.error_code == "token_expired") {
          this.storage.clear();
          this.router.navigate(["/login"]);
        }
      }
    );
  }

  reload() { }

  back() {
    this.navCtrl.back();
  }

  loadMore(event) {
    this.page++;
    this.userService
      .getData(
        "transactionHistory?token=" +
        this.loginInfo.token +
        "&page_no=" +
        this.page
      )
      .subscribe(
        (res) => {
          if (res["status"] == "ok") {
            event.target.complete();
            if (!res["transactions"]) {
              this.transactions = [
                ...this.transactions,
                ...res["transactions"],
              ];
            } else {
              this.page--;
            }
          } else {
            this.userService.presentAlert("Something went wrong");
            event.target.complete();
          }
        },
        (err) => {
          this.page--;
          event.target.complete();
          this.userService.dismissLoading();
          this.userService.presentAlert("Something went Wrong");
        }
      );
  }

  getWalletBalance() {
    this.userService
      .sendData("getWalletBalance", {
        token: this.loginInfo.token,
      })
      .subscribe(
        (response) => {
          console.log("response:", response);
          this.ready = true;
          if (response) {
            this.result = response;
          } else {
            this.userService.presentAlert("Something went Wrong");
          }
        },
        (err) => {
          this.ready = true;
          console.log("err:", err);
          this.userService.presentAlert(err.error.msg);
        }
      );
  }
}
