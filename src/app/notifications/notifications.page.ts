import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import {
  FormGroup,
  Validators,
  FormBuilder,
  FormArray,
  FormControl,
} from "@angular/forms";
import { Routes, RouterModule, ActivatedRoute } from "@angular/router";
import { UserService } from "../user.service";
import {
  AlertController,
  LoadingController,
  NavController,
  Platform,
  MenuController,
} from "@ionic/angular";
import { Storage } from "@ionic/storage";
import { Location } from "@angular/common";
import { NavigationExtras } from "@angular/router";
import { EventService } from "../event.service";

@Component({
  selector: "app-notifications",
  templateUrl: "./notifications.page.html",
  styleUrls: ["./notifications.page.scss"],
})
export class NotificationsPage implements OnInit {
  user: any;
  res: any;
  ready: boolean = false;
  notifications: any = [];

  isChecked: boolean = false;
  selectedNotification: any = [];
  selectedAll: boolean = false;
  isClearNoti: boolean = true;
  isClearAllNoti: boolean = false;

  constructor(
    public menuCtrl: MenuController,
    public alertCtrl: AlertController,
    public allServicesService: UserService,
    public loadingCtrl: LoadingController,
    public router: Router,
    public route: ActivatedRoute,
    public navCtrl: NavController,
    public location: Location,
    public storage: Storage,
    public event: EventService,
    public nvctrl: NavController
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.storage.get("user").then(
      (userInfo) => {
        if (userInfo != null) {
          this.user = userInfo;
          this.GetMyNotifications();
          this.allServicesService.SaveAutoConfiqure(this.user.token);
        } else {
          this.router.navigate(["/login"]);
        }
      },
      (err) => {
        this.router.navigate(["/login"]);
      }
    );
  }

  GetMyNotifications() {
    this.allServicesService
      .getData("GetMyNotifications/?type=user&token=" + this.user.token)
      .subscribe(
        (data) => {
          this.res = data;
          console.log(this.res);
          if ((this.res.status = "ok")) {
            this.ready = true;
            this.notifications = this.res.notifications;
            this.event.publishEvent({
              event: "reload_badge",
              token: this.user.token,
            });
            //this.events.publish("reload", "");
          }
        },
        (err) => {
          this.ready = true;
          if (err.error.error_code == "user_expire") {
            this.router.navigate(["/login"]);
          }
          this.allServicesService.presentAlert(err.error.errormsg);
        }
      );
  }

  clear_notifications() {
    this.isChecked = true;
    this.isClearNoti = false;
    this.isClearAllNoti = true;
  }

  checkAll() {
    if (this.selectedAll == false) {
      this.selectedAll = true;
      this.notifications.forEach((data) => {
        let indx;
        indx = this.selectedNotification.indexOf(data.id);
        if (indx > -1) {
          // this.selectedNotification.splice(indx, 1);
        } else {
          this.selectedNotification.push(data.id);
        }
      });
      console.log("selectedNotification: ", this.selectedNotification);
    } else {
      this.selectedAll = false;
      this.selectedNotification = [];
      console.log("selectedNotification: ", this.selectedNotification);
    }
  }

  chooseNotificaion(notification) {
    let i = 0;
    let indx;
    indx = this.selectedNotification.indexOf(notification.id);
    if (indx > -1) {
      this.selectedNotification.splice(indx, 1);
    } else {
      this.selectedNotification.push(notification.id);
    }
    console.log("selectedNotification: ", this.selectedNotification);
  }

  cancelNotification() {
    this.isChecked = false;
    this.isClearNoti = true;
    this.isClearAllNoti = false;
    this.selectedNotification = [];
    this.selectedAll = false;
  }

  async delete_notification_confirm() {
    // console.log("notification_id : ",notification_id);
    if (this.selectedNotification.length > 0) {
      const alert = await this.alertCtrl.create({
        header: "Delete notification(s) ?",
        message: "Are you sure?",
        buttons: [
          {
            text: "No",
            role: "cancel",
            cssClass: "secondary",
            handler: (blah) => {
              console.log("Confirm Cancel: blah");
            },
          },
          {
            text: "Yes",
            handler: () => {
              console.log("Confirm Okay");
              let sendData = {
                selectedNotification: this.selectedNotification,
                token: this.user.token,
              };
              this.allServicesService.showLoader("Deleting..");
              this.allServicesService
                .sendData("delete_notifications", sendData)
                .subscribe(
                  (data) => {
                    this.res = data;

                    if ((this.res.status = "ok")) {
                      this.isChecked = false;
                      this.isClearNoti = true;
                      this.isClearAllNoti = false;
                      this.selectedNotification = [];
                      this.selectedAll = false;
                      this.allServicesService.dismissLoading();
                      this.allServicesService.presentAlert(this.res.msg);
                      this.GetMyNotifications();
                    }
                  },
                  (err) => {
                    this.ready = true;
                    if (err.error.error_code == "user_expire") {
                      this.router.navigate(["/login"]);
                    }
                    this.allServicesService.presentAlert(err.error.errormsg);
                  }
                );
            },
          },
        ],
      });

      await alert.present();
    } else {
      this.allServicesService.presentToast("Please select notifications");
    }
  }

  goto_page(notification) {
    // [routerLink]="['/booking2/'+notification.post_id]"
    console.log("goto_page : notification", notification);

    if (notification.type == "msg_push") {
    }

    if (
      notification.type == "appointment_complete" ||
      notification.type == "appointment_start" ||
      notification.type == "appointment_request"
    ) {
      this.router.navigate(["/booking2/" + notification.post_id]);
    }
  }

  back() {
    this.nvctrl.back();
  }
}
