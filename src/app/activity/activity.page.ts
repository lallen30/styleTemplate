import { Component, NgZone, OnInit } from "@angular/core";
import { Storage } from "@ionic/storage";
import {
  NavController,
  LoadingController,
  AlertController,
  Platform,
  ActionSheetController,
  NavParams,
} from "@ionic/angular";
import { UserService } from "../user.service";
import { NavigationExtras, Router } from "@angular/router";
import { EventService } from "../event.service";
@Component({
  selector: "app-activity",
  templateUrl: "./activity.page.html",
  styleUrls: ["./activity.page.scss"],
})
export class ActivityPage implements OnInit {
  user: any;
  transaction_ready: any;
  transactions: any = [];
  page: any = 1;
  constructor(
    public nvctrl: NavController,
    public navCtrl: NavController,
    public storage: Storage,
    public plt: Platform,
    public userService: UserService,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public router: Router,
    public action: ActionSheetController,
    public event: EventService,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.storage.get("user").then((val) => {
      if (val) {
        this.user = val;
        this.getTranHist();
      } else {
        this.storage.clear();
        this.router.navigate(["/login"]);
      }
    });
  }
  back() {
    this.nvctrl.back();
  }

  ionViewWillEnter() {}

  getTranHist() {
    this.page = 1;
    this.userService
      .getData(
        "transactionHistory?token=" + this.user.token + "&page_no=" + this.page
      )
      .subscribe(
        (res) => {
          if (res) {
            this.transaction_ready = true;
            this.transactions = res["transactions"];
          } else {
            this.transaction_ready = true;
            this.userService.presentAlert("Something went Wrong");
          }
        },
        (err) => {
          this.transaction_ready = true;
          if (err.error.errormsg == "Not any resources found.") {
          } else {
            this.userService.presentAlert("Something went Wrong");
          }
        }
      );
  }

  loadMore(event) {
    this.page++;
    this.userService
      .getData(
        "transactionHistory?token=" + this.user.token + "&page_no=" + this.page
      )
      .subscribe(
        (res) => {
          if (res["status"] == "ok") {
            event.target.complete();
            if (res["transactions"] != null) {
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

  goToActivity(tran) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        transaction: JSON.stringify(tran),
      },
    };
    this.navCtrl.navigateForward(["/selected-activity"], navigationExtras);
  }
}
