import { Component } from "@angular/core";
import { UserService } from "./user.service";
import {
  Platform,
  NavController,
  MenuController,
  ModalController,
  AlertController,
} from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { Storage } from "@ionic/storage-angular";
import {
  OneSignal,
  OSNotificationPayload,
} from "@ionic-native/onesignal/ngx/index";
import { Router, NavigationExtras } from "@angular/router";
//import { SplashPage } from './splash/splash.page';
import { StripereturnPage } from "./stripereturn/stripereturn.page";
import { EventService } from "./event.service";
import { Deeplinks } from "@ionic-native/deeplinks/ngx";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent {
  readerMode$;
  appPages: { title: string; url: string; icon: string }[];
  type: string;
  res: any;
  notificationBadge: any;
  notificationBadgeready: boolean = false;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public navController: NavController,
    public storage: Storage,
    public menu: MenuController,
    private oneSignal: OneSignal,
    private router: Router,
    public model: ModalController,
    public userService: UserService,
    public event: EventService,
    public deeplinks: Deeplinks,
    public alertctrl: AlertController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform
      .ready()
      .then(() => this.storage.create())
      .then(() => {
        this.statusBar.styleDefault();
        //this.statusBar.backgroundColorByHexString("#d4aa2a");
        this.statusBar.backgroundColorByHexString("#22ee22");
        this.splashScreen.hide();

        this.oneSignal.startInit(
          "ae7e1dd2-ca8c-478b-894b-85329418ec01",
          "937618788347"
        );
        this.oneSignal.inFocusDisplaying(
          this.oneSignal.OSInFocusDisplayOption.Notification
        );
        this.oneSignal.handleNotificationReceived().subscribe((data) => {
          this.onPushReceived();
        });
        this.oneSignal
          .handleNotificationOpened()
          .subscribe((data) => this.onPushOpened(data.notification.payload));
        this.oneSignal.endInit();

        this.notificationBadge = {
          notifications: false,
          news: false,
          requests: false,
        };

        this.event.getEvent().subscribe((res) => {
          if (res["event"] == "reload_badge") {
            this.CheckNotificationBadge(res["token"]);
          }
        });

        // FIXME:  This copy-and-paste stuff violates DRY.  Logic should be simpler too.
        this.storage.get("remember_logininfo").then(
          (val) => {
            if (val != null) {
              console.log(val);
              if (val.rememberCheck) {
                this.storage.get("user").then((userInfo) => {
                  if (userInfo != null) {
                    this.CheckNotificationBadge(userInfo.token);
                    this.navController.navigateForward(["tabs/mywallet"]);
                  } else {
                    if (localStorage.getItem("firstTimeLoad") != "TRUE") {
                      localStorage.setItem("firstTimeLoad", "TRUE");
                      this.navController.navigateForward(["/welcome"]);
                    } else {
                      this.navController.navigateForward(["/home"]);
                    }
                  }
                });
              } else {
                if (localStorage.getItem("firstTimeLoad") != "TRUE") {
                  localStorage.setItem("firstTimeLoad", "TRUE");
                  this.navController.navigateForward(["/welcome"]);
                } else {
                  this.navController.navigateForward(["/home"]);
                }
              }
            } else {
              if (localStorage.getItem("firstTimeLoad") != "TRUE") {
                localStorage.setItem("firstTimeLoad", "TRUE");
                this.navController.navigateForward(["/welcome"]);
              } else {
                this.navController.navigateForward(["/login"]);
              }
            }
          },
          (err) => {
            if (localStorage.getItem("firstTimeLoad") != "TRUE") {
              localStorage.setItem("firstTimeLoad", "TRUE");
              this.navController.navigateForward(["/welcome"]);
            } else {
              this.navController.navigateForward(["/login"]);
            }
          }
        );

        //this.deepLinkSetup();
      });
  }

  deepLinkSetup() {
    console.log("this.deeplinks", this.deeplinks);
    this.deeplinks
      .routeWithNavController(this.navController, {
        "/about-us": StripereturnPage,
      })
      .subscribe(
        (match) => {
          this.navController.navigateForward(match.$link.path);
          console.log("Successfully matched route", match);
        },
        (nomatch) => {
          console.error("Got a deeplink that didn't match", nomatch);
        }
      );
  }
  //   async opensplash(){
  // const models = this.model.create({
  //   component:SplashPage
  // })
  // return (await models).present()
  //   }

  async logout() {
    this.menu.toggle();
    const alert = await this.alertctrl.create({
      header: "Logout",
      message: "are you sure ?",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: (blah) => {},
        },
        {
          text: "Logout",
          handler: () => {
            this.storage.remove("walletInfo");

            this.storage.get("user").then(
              (val) => {
                if (this.platform.is("android")) {
                  this.type = "android";
                } else {
                  this.type = "ios";
                }
                this.storage.remove("user");
                this.navController.navigateForward("home");
                this.oneSignal.getIds().then((id) => {
                  const option = {
                    device_token: id.userId,
                    token: val.token,
                    device_type: this.type,
                  };
                  this.userService
                    .sendData("deleteTokenOnLogut", option)
                    .subscribe(
                      (res) => {
                        this.userService.dismissLoading();
                        this.storage.clear();
                        localStorage.clear();
                        this.navController.navigateForward("home");
                      },
                      (err) => {
                        this.userService.dismissLoading();
                      }
                    );
                });
              },
              (err) => {
                localStorage.clear();
                this.storage.clear();
                this.router.navigate(["/login"]);
              }
            );
          },
        },
      ],
    });
    await alert.present();
  }
  private onPushReceived() {
    this.event.publishEvent({ event: "reload_badge" });
    this.event.publishEvent({ event: "update_bal" });
  }
  private onPushOpened(payload: OSNotificationPayload) {
    this.storage.get("user").then(
      (userInfo) => {
        if (userInfo != null) {
          this.event.publishEvent({ event: "update_bal" });

          let event_notification = payload.additionalData;
          if (event_notification.type == "money_request") {
            this.openreq(event_notification.data_noti);
          }
          if (event_notification.type == "money_received") {
            this.navController.navigateForward("tabs/mywallet");
          }
          if (event_notification.type == "broadcast") {
            const navigationExtras: NavigationExtras = {
              queryParams: {
                session_id: event_notification.session_id,
                url: event_notification.broadcast_url.hls,
                broadcast_id: event_notification.id,
                sender: "sender",
                broad_type: "listen",
              },
            };
            this.router.navigate(["/broadcast"], navigationExtras);
          }
        } else {
          this.storage.clear();
          this.router.navigate(["/home"]);
        }
      },
      (error) => {
        this.storage.clear();
        this.router.navigate(["/home"]);
      }
    );
  }

  CheckNotificationBadge(token) {
    this.userService
      .getData("CheckNewNotificationsDots/?type=user&token=" + token)
      .subscribe(
        (data) => {
          this.res = data;
          console.log(this.res);
          if ((this.res.status = "ok")) {
            //this.events.publish("reload", "");
            this.notificationBadge.notifications = this.res.notification;
            this.notificationBadge.requests = this.res.requests;

            this.storage.get("newsCount").then(
              (newsCount) => {
                if (newsCount != this.res.news) {
                  this.notificationBadge.news = true;
                } else {
                  this.notificationBadge.news = false;
                }
              },
              (err) => {
                this.notificationBadge.news = true;
              }
            );

            this.notificationBadgeready = true;
            // this.storage.set("newsCount",this.res.news);
          }
        },
        (err) => {
          if (err.error.error_code == "user_expire") {
            //this.router.navigate(["/login"]);
          }
        }
      );
  }

  openreq(requestInfo) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        requestInfo: JSON.stringify(requestInfo),
      },
    };
    this.navController.navigateForward(["/acceptrej"], navigationExtras);
  }
}
