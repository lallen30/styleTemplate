import { Component, Input, OnInit, ChangeDetectorRef } from "@angular/core";
import { Storage } from "@ionic/storage";
import {
  NavController,
  LoadingController,
  AlertController,
  Platform,
  ModalController,
} from "@ionic/angular";
import { EventService } from "../../event.service";
import { UserService } from "../../user.service";
import { Router, ActivatedRoute } from "@angular/router";
import { ReqmoneyuserlistPage } from "../../reqmoneyuserlist/reqmoneyuserlist.page";
import { ConfirmsendPage } from "../../modals/confirmsend/confirmsend.page";
@Component({
  selector: "app-requestpay",
  templateUrl: "./requestpay.page.html",
  styleUrls: ["./requestpay.page.scss"],
})
export class RequestpayPage implements OnInit {
  availablebalnc = 0;
  @Input() number: any = 0;
  loginInfo: any = [];
  action_type: any = "send";
  wallletInfo: any = [];
  funding_sources_lists: any = [];

  destination_source_url: any = "";
  verified_source_url: any = "";

  walletInfo: any = [];

  cards: any = [];
  card_spinner: string = "off";
  card_id: any = "";
  to_user_id: any;
  description: any;
  ready: boolean = false;
  is_issue: false;
  selected_user: any = [];
  wallet_balance: any = "";
  payment_sources: any = "stripe";

  request_id: any;
  constructor(
    public navCtrl: NavController,
    public storage: Storage,
    public plt: Platform,
    public UserService: UserService,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public router: Router,
    public event: EventService,
    private activatedRoute: ActivatedRoute,
    public changeDetectorRef: ChangeDetectorRef,
    private modalController: ModalController
  ) {
    this.action_type = "send";
    this.activatedRoute.queryParams.subscribe((queryParams) => {
      const obj = JSON.parse(queryParams["requestInfo"]);
      if (
        obj &&
        obj["request_id"] &&
        obj["request_id"] != null &&
        obj["request_id"] != undefined
      ) {
        this.number = obj["amount"];
        console.log("queryParams:", obj["otherUserInfo"]);
        this.selected_user = obj["otherUserInfo"];
        this.description = obj["description"];
        this.request_id = obj["request_id"];
        //this.description=obj['']
      }
    });
  }

  ngOnInit() {
    this.event.getEvent().subscribe((handler) => {
      // console.log("getEvent->handler:", handler);
      if (handler.wallet_balance == "updated") {
        this.storage.get("wallet_balance").then((walletBalance) => {
          if (walletBalance != null) {
            this.wallet_balance = walletBalance;
          }
        });
      }
    });
  }

  back() {
    this.router.navigate(["/listing"]);
  }

  cut() {
    this.number = this.number.substring(0, this.number.length - 1);
  }

  ionViewWillEnter() {
    this.card_id = "";
    this.storage.get("user").then((val) => {
      if (val != null) {
        this.loginInfo = val;
        this.getcard();
        this.getWalletBalance();
      } else {
        this.storage.clear();
        this.router.navigate(["/login"]);
      }
    });
  }

  change_payment_sources(e) {
    console.log("cards:", this.cards);
    console.log("change_payment_sources:", e);
    if (e.detail.value == "wallet") {
      this.payment_sources = "wallet";
      this.card_id = "";
    } else {
      this.card_id = e.detail.value;
      this.payment_sources = "stripe";
    }
    console.log("payment_sources:", this.payment_sources);
    console.log("card_id:", this.card_id);
  }
  getWalletBalance() {
    let sendData = {
      token: this.loginInfo.token,
    };
    this.UserService.sendData("getWalletBalance", sendData).subscribe(
      (response) => {
        console.log("get_wallet_balance->response:", response);
        if (response) {
          if (response["wallet_balance"]) {
            this.wallet_balance = response["wallet_balance"];
            console.log("wallet_balance:", this.wallet_balance);
            this.storage.set("wallet_balance", this.wallet_balance);
            this.event.publishEvent({ wallet_balance: "updated" });
          }
        } else {
          this.UserService.presentAlert("Something went Wrong");
        }
      },
      (err) => {
        this.ready = true;
        console.log("err:", err);
        this.UserService.presentAlert(err.error.msg);
      }
    );
  }

  getcard() {
    this.UserService.sendData("get_cards", {
      token: this.loginInfo.token,
    }).subscribe(
      (response) => {
        console.log("response:", response);
        this.ready = true;
        if (response) {
          this.cards = response["credit_cards"];
        } else {
          this.UserService.presentAlert("Something went Wrong");
        }
      },
      (err) => {
        this.ready = true;
        console.log("err:", err);
        if (err.error.errormsg == "Not any resources found.") {
        } else {
          this.UserService.presentAlert("Something went Wrong");
        }
      }
    );
  }

  async Preview() {
    let componentProps = {
      amount: this.number,
      payment_sources: this.payment_sources,
      user: this.selected_user,
      description: this.description,
      action_type: this.action_type,
    };

    if (this.action_type == "send") {
      if (this.payment_sources != "wallet") {
        if (this.card_id == "") {
          if (this.cards.length == 0) {
            this.UserService.presentToast(
              "In order to send money please add card."
            );
            return false;
          } else {
            this.UserService.presentToast("Please select a card.");
            return false;
          }
        }
        componentProps["card"] = this.cards[this.card_id];
      } else {
        if (this.wallet_balance < this.number) {
          this.UserService.presentToast(
            "You don't have enough funds in your wallet. Please add some funds in wallet."
          );
          return false;
        }
      }
    }

    console.log("componentProps:", componentProps);
    const modal = await this.modalController.create({
      component: ConfirmsendPage,
      componentProps: {
        amount: this.number,
        payment_sources: this.payment_sources,
        user: this.selected_user,
        description: this.description,
        action_type: this.action_type,
      },
      cssClass: "",
    });
    modal.onDidDismiss().then((data) => {
      console.log("data:", data);
      let dataC = data["data"]; // Here's your selected user!
      if (dataC.confirm) {
        if (this.action_type == "send") {
          this.ProcessSend(dataC.pin, dataC.amountObj);
        }
      }
      console.log(dataC);
    });
    return await modal.present();
  }

  ProcessSend(pin, amountObj) {
    if (this.payment_sources == "stripe") {
      let sendData = {
        token: this.loginInfo.token,
        receiver: this.selected_user.user_id,
        amount: amountObj,
        description: this.description,
        payment_sources: this.payment_sources,
        card_id: this.cards[this.card_id].id,
        request_id: this.request_id,
        pin: pin,
      };
      console.log("sendData:", sendData);
      this.UserService.showLoader("Please wait..");
      this.UserService.sendData("sendMoney", sendData).subscribe(
        (response) => {
          console.log("response:", response);
          this.UserService.dismissLoading();
          let res: any = response;
          if (res) {
            this.UserService.presentAlert(res.msg);
            this.router.navigate(["/tabs/mywallet"]);
          } else {
            this.UserService.presentAlert("Something went Wrong");
          }
        },
        (err) => {
          console.log("err:", err);
          this.UserService.dismissLoading();
          this.ready = true;
          this.UserService.presentAlert(err.error.errormsg);
        }
      );
    } else {
      let sendData1 = {
        token: this.loginInfo.token,
        amount: this.number,
        payment_sources: this.payment_sources,
        description: this.description,
        receiver: this.selected_user.user_id,
        request_id: this.request_id,
        pin: pin,
      };
      console.log("sendData:", sendData1);
      this.UserService.showLoader("Please wait..");
      this.UserService.sendData("sendMoneyFromWallet", sendData1).subscribe(
        (response) => {
          // this.updatereq()
          console.log("response:", response);
          if (response) {
            if (response["sender_wallet_balance"]) {
              let wallet_balance = response["sender_wallet_balance"];
              console.log("wallet_balance:", wallet_balance);
              this.storage.set("wallet_balance", wallet_balance);
              this.event.publishEvent({ wallet_balance: "updated" });
            }
            this.UserService.dismissLoading();
            this.UserService.presentAlert(response["msg"]);
            this.router.navigate(["/tabs/mywallet"]);
          }
        },
        (err) => {
          this.UserService.dismissLoading();
          console.log("err:", err);
        }
      );
    }
  }
}
