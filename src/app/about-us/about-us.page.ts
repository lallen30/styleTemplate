import { Component, OnInit } from "@angular/core";
import { NavController, Platform } from "@ionic/angular";
import { UserService } from "../user.service";
@Component({
  selector: "app-about-us",
  templateUrl: "./about-us.page.html",
  styleUrls: ["./about-us.page.scss"],
})
export class AboutUsPage implements OnInit {
  aboutus_content: any = "";
  spinner: string = "off";
  pageData: any = [];
  constructor(public nvctrl: NavController, public userService: UserService) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.get_aboutus();
  }

  get_aboutus() {
    this.spinner = "on";
    this.userService.sendData("get_aboutus", {}).subscribe(
      (response) => {
        console.log("response:", response);
        this.spinner = "off";
        if (response["status"] == "ok") {
          this.pageData = response["pageData"];
          console.log("pageData:", this.pageData);
          this.aboutus_content = response["aboutus_content"];
        }
      },
      (err) => {
        console.log("err:", err);
        this.spinner = "off";
      }
    );
  }

  back() {
    this.nvctrl.back();
  }
}
