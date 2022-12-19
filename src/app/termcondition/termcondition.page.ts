import { Component, OnInit } from "@angular/core";
import { UserService } from "../user.service";
import { ActivatedRoute } from "@angular/router";
import { NavController } from "@ionic/angular";
import { Storage } from "@ionic/storage";

@Component({
  selector: "app-termcondition",
  templateUrl: "./termcondition.page.html",
  styleUrls: ["./termcondition.page.scss"],
})
export class TermconditionPage implements OnInit {
  user;
  data;
  constructor(
    private userService: UserService,
    public navCtrl: NavController,
    public storage: Storage
  ) {
    this.userService.showLoader();
  }

  ngOnInit() {}
  back() {
    this.navCtrl.back();
  }
  ionViewWillEnter() {
    this.storage.get("user").then(
      (userInfo) => {
        this.user = userInfo;
        this.getTermPage();
      },
      (err) => {
        this.navCtrl.navigateForward(["/login"]);
      }
    );
  }
  getTermPage() {
    this.userService.getData("getTermPage").subscribe(
      (res) => {
        this.userService.dismissLoading();
        if (res["status"] == 200) {
          this.data = res["term_page"][0].post_content;
        }
      },
      (error) => {
        this.userService.dismissLoading();
        this.userService.presentToast("Something went wrong!");
      }
    );
  }
}
