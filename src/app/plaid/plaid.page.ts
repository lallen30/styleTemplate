import { Component, OnInit } from "@angular/core";
import { UserService } from "src/app/user.service";
import { Storage } from "@ionic/storage";
import { Platform } from "@ionic/angular";
import { Router, ActivatedRoute } from "@angular/router";
import { SafariViewController } from "@ionic-native/safari-view-controller/ngx";
import {
  InAppBrowser,
  InAppBrowserOptions,
  InAppBrowserObject,
} from "@ionic-native/in-app-browser/ngx";
import { EventService } from "../event.service";
declare var Plaid;
@Component({
  selector: "app-plaid",
  templateUrl: "./plaid.page.html",
  styleUrls: ["./plaid.page.scss"],
})
export class PlaidPage implements OnInit {
  linkHandler: any;
  user: any;
  linkToken: any;
  spinner: string = "off";
  dwolla_iav_token: any = "";
  dwolla_source_verification_url: any = "";
  constructor(
    public userService: UserService,
    public storage: Storage,
    public router: Router,
    public plt: Platform,
    private iab: InAppBrowser,
    private safariViewController: SafariViewController,
    public event: EventService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.storage.get("user").then((val) => {
      if (val != null) {
        this.user = val;
        // this.plaid_getLinkToken();
        // this.get_dwolla_iav_token();
      }
    });
  }

  forceExitLink() {
    this.linkHandler.exit();
  }

  openLink() {
    this.linkHandler.open();
  }

  openLinkWithInstitution() {
    this.linkHandler.open("ins_4");
  }

  plaidInit() {
    const self = this;
    this.linkHandler = Plaid.create({
      clientName: "Plaid Walkthrough Demo",
      env: "sandbox",
      // key: '2e8bae7fb0769e04912eeea45c9b2f',
      product: ["auth", "transactions"],
      token: this.linkToken,
      // webhook: 'https://zoompay.betaplanets.com',
      selectAccount: true,
      forceIframe: true,
      onLoad: function () {
        console.log("loaded");
      },
      onSuccess: function (public_token, metadata) {
        console.log("onSuccess public_token", public_token);
        console.log("onSuccess metadata", metadata);

        self.plaid_GenrateAcessToken(public_token, metadata);
      },
      onExit: function (err, metadata) {
        if (err != null) {
          console.log(err);
        }
        console.log("onExit metadata", metadata);
        console.log(
          "onExit institution",
          metadata.institution.name,
          metadata.institution.institution_id
        );
        console.log("onExit request_id", metadata.request_id);
      },
    });
  }

  plaid_GenrateAcessToken(public_token, metadata) {
    this.userService.showLoader();
    this.storage.set("plaid_public_token", public_token);
    const option = {
      token: this.user.token,
      public_token: public_token,
      metadata: metadata,
    };
    this.userService.sendData("plaid_GenrateAcessToken", option).subscribe(
      (res) => {
        this.onboardingLink();
        this.userService.dismissLoading();
      },
      (err) => {
        this.userService.dismissLoading();
      }
    );
  }

  onboardingLink() {
    const option = {
      token: this.user.token,
    };
    this.userService.sendData("onboardingLink", option).subscribe(
      (res: any) => {
        console.log(res);
        window.open(res["account_links"].url, "_system");
        this.userService.dismissLoading();
      },
      (err) => {
        this.userService.dismissLoading();
      }
    );
  }

  plaid_getLinkToken() {
    // this.userService.showLoader();
    const option = {
      token: this.user.token,
    };
    this.userService.sendData("plaid_getLinkToken", option).subscribe((res) => {
      this.linkToken = res["link_token"];
      this.plaidInit();
    });
  }

  get_dwolla_iav_token() {
    let postdata = {
      token: this.user.token,
    };
    // this.spinner = 'on';
    this.userService.showLoader("Please wait..");
    this.userService.sendData("get_iav_token", postdata).subscribe(
      (response) => {
        // this.spinner = 'off';
        this.userService.dismissLoading();
        console.log("Response:", response);
        if (response["status"] == "ok") {
          this.dwolla_iav_token = response["iav_token"];
          console.log("dwolla_iav_token:", this.dwolla_iav_token);

          this.dwolla_source_verification_url = response["url"];
          console.log(
            "dwolla_source_verification_url:",
            this.dwolla_source_verification_url
          );
          this.add_and_verify_funding_sources();
        } else {
          this.userService.presentToast(response["msg"]);
        }
      },
      (err) => {
        console.log("err:", err);
        // this.spinner = 'off';
        this.userService.dismissLoading();
        if (err.error.error_code == "token_expired") {
          this.storage.clear();
          this.router.navigate(["/login"]);
        }
      }
    );
  }

  getParams = function (url) {
    var params = {};
    var parser = document.createElement("a");
    parser.href = url;
    var query = parser.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      params[pair[0]] = decodeURIComponent(pair[1]);
    }
    return params;
  };

  add_and_verify_funding_sources() {
    let options: InAppBrowserOptions = {
      statusbar: {
        color: "#51688F",
      },
      title: {
        color: "#ffffff",
        staticText: "Verify Funding Sources",
        showPageTitle: false,
      },
      closeButton: {
        wwwImage: "assets/close.png",
        align: "right",
        event: "closePressed",
      },
      backButton: {
        wwwImage: "assets/back.png",
        align: "left",
        //event: 'closePressed'
      },
      backButtonCanClose: true,
      location: "no",
      footercolor: "#c7fedc",
      hidenavigationbuttons: "yes",
      hideurlbar: "yes",
      toolbarcolor: "#c7fedc",
      //hidden: 'yes',
      clearcache: "yes",
      clearsessioncache: "yes",
    };
    const b: InAppBrowserObject = this.iab.create(
      this.dwolla_source_verification_url,
      "_blank",
      options
    );
    let orderPlaced = false;
    b.on("loadstart").subscribe((res) => {
      console.log("loadstart->res:", res);
      console.log("loadstart->res->URL:", res.url);
      if (res.url.indexOf("success") != -1) {
        let params = this.getParams(res.url);
        console.log("success->params:", params);
        console.log("funding_source_id:", params["funding_source_id"]);

        orderPlaced = true;
        b.close();
        if (params["funding_source_id"] && params["funding_source_id"] != "") {
          let msg = params["msg"];
          let funding_source_id = params["funding_source_id"];
          console.log("funding_source_id:", funding_source_id);
          if (
            params["msg"] &&
            params["msg"] != "" &&
            params["msg"] != null &&
            params["msg"] != undefined
          ) {
            this.userService.presentToast(params["msg"]);
          } else {
            this.userService.presentToast("Thank you");
          }
          this.event.publishEvent({ funding_source_added: true });
          this.router.navigate(["tabs/profile"]);
        } else {
          this.user.presentAlert("Sorry, something went wrong.");
        }
      } else if (res.url.indexOf("error") != -1) {
        let params = this.getParams(res.url);
        console.log("error->params:", params);
        if (
          params["msg"] &&
          params["msg"] != "" &&
          params["msg"] != null &&
          params["msg"] != undefined
        ) {
          this.userService.presentToast(params["msg"]);
        } else {
          this.userService.presentToast(
            "Something went wrong. Please try again."
          );
        }
        b.close();
      }
    });
    b.on("loadstop").subscribe((res) => {
      console.log("loadstop");
    });

    b.on("exit").subscribe((res) => {});

    // console.log("dwolla_source_verification_url:", this.dwolla_source_verification_url);
    // if(this.plt.is('cordova')){
    //     this.safariViewController.isAvailable().then((available: boolean) => {
    //         if (available) {
    //             let sendData = {
    //                 url: this.dwolla_source_verification_url,
    //                 hidden: false,
    //                 animated: false,
    //                 transition: 'curl',
    //                 enterReaderModeIfAvailable: true,
    //                 tintColor: '#ff0000'
    //             };
    //             this.safariViewController.show(sendData).subscribe((result: any) => {
    //                 if (result.event === 'opened'){
    //                     console.log('Opened:', result);
    //                 }else if (result.event === 'loaded'){
    //                     console.log('Loaded:', result);
    //                 }else if (result.event === 'closed') {
    //                     console.log('Closed:', result);
    //                 }
    //             },(err: any) => {
    //                 console.log("err:", err)
    //             });
    //         } else {
    //             const browser = this.iab.create(this.dwolla_source_verification_url, '_blank');
    //         }
    //     });
    // }else{
    //     const browser = this.iab.create(this.dwolla_source_verification_url, '_blank');
    // }
  }
}
