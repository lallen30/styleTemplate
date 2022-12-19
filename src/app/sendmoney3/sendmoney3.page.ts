import { Component, OnInit } from "@angular/core";
import { Storage } from "@ionic/storage";
import {
  NavController,
  LoadingController,
  AlertController,
  Platform,
} from "@ionic/angular";
import { UserService } from "../user.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-sendmoney3",
  templateUrl: "./sendmoney3.page.html",
  styleUrls: ["./sendmoney3.page.scss"],
})
export class Sendmoney3Page implements OnInit {
  user: any;

  constructor(
    public navCtrl: NavController,
    public storage: Storage,
    public plt: Platform,
    public UserService: UserService,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public router: Router
  ) {}
  ionViewWillEnter() {
    this.storage.get("user").then(
      (val) => {
        if (val != null) {
          this.user = val;
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
  ngOnInit() {}
}
