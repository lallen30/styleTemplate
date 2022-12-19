import { Component, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";
import { FormGroup, Validators, FormControl } from "@angular/forms";
import { UserService } from "src/app/user.service";
import { Storage } from "@ionic/storage";
import { NavigationExtras } from "@angular/router";
import { EventService } from "../event.service";

@Component({
  selector: "app-newsfeed",
  templateUrl: "./newsfeed.page.html",
  styleUrls: ["./newsfeed.page.scss"],
})
export class NewsfeedPage implements OnInit {
  user: any;
  loginInfo: any = [];
  newsData: any;
  stringsearch: any = "";
  categoryList: any = [];
  allfeedCategory: any = [];
  page: number = 1;
  news_spinner: string = "off";
  constructor(
    private userService: UserService,
    public navCtrl: NavController,
    public storage: Storage,
    public event: EventService
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
        this.getnews();
      } else {
        this.userService.presentToast("Token is expired. Please login again.");
        this.navCtrl.navigateForward(["/login"]);
      }
    });
  }

  getnews() {
    setTimeout(() => {
      this.news_spinner = "on";
      this.userService
        .getData("getnews_list?token=" + this.user.token + "&category")
        .subscribe(
          (res) => {
            this.news_spinner = "off";
            if (res["status_code"] == 200) {
              this.newsData = res["listing"];
              this.storage.set("newsCount", this.newsData.length);
              this.categoryList = [];
              this.categoryList = res["terms"];
              this.event.publishEvent({
                event: "reload_badge",
                token: this.loginInfo.token,
              });
            }
          },
          (err) => {
            console.log("err:", err);
            this.news_spinner = "off";
            this.userService.presentToast("Something went wrong!");
          }
        );
    }, 400);
  }

  singleNews(data) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        data: JSON.stringify(data),
      },
    };
    this.navCtrl.navigateForward(["/newsdetail"], navigationExtras);
  }

  // search(){
  //     this.userService.getData('getNewsList?token='+this.user.token+'&string='+this.stringsearch).subscribe(res =>{
  //     },err =>{

  //     })
  // }

  loadMore(event) {
    this.page++;
    this.getnews();
  }

  reload() {
    this.getnews();
  }
}
