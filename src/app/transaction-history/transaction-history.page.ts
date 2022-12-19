import { Component, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";
import { FormGroup, Validators, FormControl } from "@angular/forms";
import { UserService } from "src/app/user.service";
import { Storage } from "@ionic/storage";
import { NavigationExtras } from "@angular/router";

@Component({
  selector: "app-transaction-history",
  templateUrl: "./transaction-history.page.html",
  styleUrls: ["./transaction-history.page.scss"],
})
export class TransactionHistoryPage implements OnInit {
  user: any;
  loginInfo: any = [];
  transactions: any = [];
  page: number = 1;
  refresh: any;
  transaction_spinner: string = "off";

  funding_source_spinner: string = "off";
  funding_sources_lists: any = [];
  verified_source_url: any = "";
  constructor(
    private userService: UserService,
    public navCtrl: NavController,
    public storage: Storage
  ) {
    // this.userService.showLoader();
  }

  ngOnInit() {}

  back() {
    this.navCtrl.back();
  }

  ionViewWillEnter() {
    this.page = 1;
    this.storage.get("user").then((userInfo) => {
      if (userInfo != null) {
        this.user = userInfo;
        this.loginInfo = userInfo;
        console.log("loginInfo:", this.loginInfo);

        this.get_dwolla_funding_sources();
        this.get_dwolla_transactions();
      } else {
        this.userService.presentToast("Token is expired. Please login again.");
        this.navCtrl.navigateForward(["/login"]);
      }
    });
  }

  get_dwolla_transactions(loadMore_event: any = null) {
    let sendData = {
      token: this.loginInfo.token,
      page_no: this.page,
    };
    this.transaction_spinner = "on";
    this.userService.sendData("dwolla_transactions", sendData).subscribe(
      (response) => {
        console.log("response:", response);
        this.transaction_spinner = "off";
        if (loadMore_event) {
          loadMore_event.target.complete();
        }
        if (response["status"] == "success") {
          if (response["transactions"] && response["transactions"] != null) {
            this.transactions = [
              ...this.transactions,
              ...response["transactions"],
            ];
          } else {
            this.page--;
          }
          this.transactions = response["transactions"];
          console.log("transactions:", this.transactions);
        } else {
          this.userService.presentToast(response["msg"]);
        }
      },
      (err) => {
        this.transaction_spinner = "off";
        console.log("err:", err);
        if (err.error.error_code == "token_expired") {
          this.userService.presentToast("Token is expired. Please login again");
        } else if (err.error.msg) {
          this.userService.presentToast(err.error.msg);
        } else {
          this.userService.presentToast("Something went wrong. Try again.");
        }
      }
    );
  }

  loadMore(event) {
    this.page++;
    this.get_dwolla_transactions(event);
  }

  gotoHist(index) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        transactionInfo: JSON.stringify(this.transactions[index]),
      },
    };
    this.navCtrl.navigateForward(["/transaction-details"], navigationExtras);
  }

  reload() {
    this.get_dwolla_transactions();
  }

  get_dwolla_funding_sources() {
    let sendData = {
      token: this.user.token,
    };
    this.funding_source_spinner = "on";
    this.userService.sendData("get_funding_sources_list", sendData).subscribe(
      (res) => {
        this.funding_source_spinner = "off";
        console.log("res:", res);
        if (res["status"] == "success") {
          this.funding_sources_lists = res["funding_sources_lists"];
          console.log("funding_sources_lists:", this.funding_sources_lists);
          if (this.funding_sources_lists.length > 0) {
            this.verified_source_url =
              this.funding_sources_lists[0].funding_source_url;
            console.log("verified_source_url:", this.verified_source_url);
          }
        } else {
          this.userService.presentToast(res["msg"]);
        }
      },
      (err) => {
        this.funding_source_spinner = "off";
        console.log("err:", err);
        if (err.error.msg && err.error.msg != "") {
          this.userService.presentToast(err.error.msg);
        } else {
          this.userService.presentAlert("Something went Wrong");
        }
      }
    );
  }
}
