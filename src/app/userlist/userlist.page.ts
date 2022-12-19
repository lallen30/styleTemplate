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
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";
import { EventService } from "../event.service";

@Component({
  selector: "app-userlist",
  templateUrl: "./userlist.page.html",
  styleUrls: ["./userlist.page.scss"],
})
export class UserlistPage implements OnInit {
  number: any;
  user: any;
  alluser: any = [];
  id: any = "";
  loginInfo: any = [];
  page_no: any = 1;
  search_keywords: any = "";
  selected_userInfo: any = [];
  destination_url: any = "";
  verified_source_url: any = "";
  funding_source_spinner: string = "off";
  funding_sources_lists: any = [];
  spinner: any = "on";
  constructor(
    public navCtrl: NavController,
    public storage: Storage,
    public plt: Platform,
    public UserService: UserService,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public router: Router,
    public action: ActionSheetController,
    private activatedRoute: ActivatedRoute,
    public event: EventService
  ) {
    this.number = this.activatedRoute.snapshot.parent.paramMap.get("number");
  }

  ngOnInit() {}

  ionViewWillEnter() {
    this.storage.get("user").then((val) => {
      if (val != null) {
        this.user = val;
        this.loginInfo = val;

        this.get_dwolla_funding_sources();
        this.getuser();
      } else {
        this.storage.clear();
        this.router.navigate(["/login"]);
      }
    });
  }

  get_dwolla_funding_sources() {
    let sendData = {
      token: this.user.token,
    };
    this.funding_source_spinner = "on";
    this.UserService.sendData("get_funding_sources_list", sendData).subscribe(
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
          this.UserService.presentToast(res["msg"]);
        }
      },
      (err) => {
        this.funding_source_spinner = "off";
        console.log("err:", err);
        if (err.error.msg && err.error.msg != "") {
          this.UserService.presentToast(err.error.msg);
        } else {
          this.UserService.presentAlert("Something went Wrong");
        }
      }
    );
  }

  getuser() {
    let sendData = {
      token: this.user.token,
      page_no: this.page_no,
      funding_sources: true,
      search_keywords: this.search_keywords,
    };
    console.log("sendData:", sendData);
    this.spinner = "on";
    this.UserService.sendData("getAllUser", sendData).subscribe(
      (res) => {
        console.log("GetUser->res:", res);
        this.spinner = "off";
        if (res) {
          this.alluser = res["user"];
          console.log("alluser:", this.alluser);
        } else {
          this.UserService.presentAlert("Something went Wrong");
        }
      },
      (err) => {
        console.log("err:", err);
        this.spinner = "off";
        if (err.error.errormsg == "Not any resources found.") {
        } else {
          this.UserService.presentAlert("Something went Wrong");
        }
      }
    );
  }

  search() {
    this.id = "";
    this.page_no = 1;
    this.getuser();
  }

  loadMore(event) {
    this.page_no++;
    let sendData = {
      token: this.user.token,
      funding_sources: true,
      search_keywords: this.search_keywords,
      page_no: this.page_no,
    };
    console.log("SendData:", sendData);
    this.UserService.sendData("getAllUser", sendData).subscribe(
      (result) => {
        console.log("LoadMore()->result:", result);
        this.alluser = [...this.alluser, ...result["user"]];
        if (result["user"].length == 0) {
          this.page_no--;
        }
        event.target.complete();
      },
      (err) => {
        console.log("loadMore()->err:", err);
        this.page_no--;
        event.target.complete();
      }
    );
  }

  back() {
    this.navCtrl.back();
  }
  select_user(index) {
    let item = this.alluser[index];
    this.selected_userInfo = item;
    console.log("selected_userInfo:", this.selected_userInfo);

    this.destination_url = this.selected_userInfo.default_funding_source;
    console.log("destination_url:", this.destination_url);
  }

  async pay_with_dwolla() {
    console.log("FundingSources:", this.funding_sources_lists);
    let inputs = [];
    if (this.funding_sources_lists.length > 0) {
      let is_verified_source_found = false;
      this.funding_sources_lists.forEach((element) => {
        let checked: boolean = false;
        if (is_verified_source_found == false && element.status == "verified") {
          checked = true;
          is_verified_source_found = true;
        } else {
          checked = false;
        }
        let label = element.name;
        if (element.type == "balance") {
          label = element.name + "($" + element.balance.value + ")";
        }
        inputs.push({
          name: "verified_source_url",
          type: "radio",
          label: label,
          value: element.funding_source_url,
          checked: checked,
          disabled: element.status == "unverified" ? true : false,
        });
      });
    }
    const alert = await this.alertCtrl.create({
      header: "Select Source",
      inputs: inputs,
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: (res) => {
            console.log("Confirm Cancel:", res);
          },
        },
        {
          text: "Send Now",
          handler: (verified_source_url) => {
            console.log("Selected->verified_source_url:", verified_source_url);
            var audio = new Audio("assets/moneycont.wav");
            audio.play();
            let sendData = {
              token: this.user.token,
              amount: this.number,
              verified_source_url: verified_source_url,
              destination_url: this.destination_url,
              to_user_id: this.selected_userInfo.user_id,
              type: "transfer",
            };
            console.log("pay_with_dwolla()->SendData:", sendData);
            this.UserService.showLoader("Please wait..");
            this.UserService.sendData("transfer_amount", sendData).subscribe(
              (res) => {
                console.log("transfer_amount()->res:", res);
                this.UserService.dismissLoading();
                audio.pause();
                if (res["status"] == "ok") {
                  this.event.publishEvent({ event: "update_bal" });
                  this.navCtrl.navigateForward("success");
                } else {
                  this.UserService.presentToast(res["msg"]);
                }
              },
              (err) => {
                console.log("pay_with_dwolla()->err:", err);
                this.UserService.dismissLoading();
              }
            );
          },
        },
      ],
    });
    await alert.present();
  }
}
