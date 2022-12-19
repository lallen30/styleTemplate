import { Component, OnInit } from "@angular/core";
import { UserService } from "../user.service";
import { ActivatedRoute } from "@angular/router";
import { NavController } from "@ionic/angular";

@Component({
  selector: "app-newsdetail",
  templateUrl: "./newsdetail.page.html",
  styleUrls: ["./newsdetail.page.scss"],
})
export class NewsdetailPage implements OnInit {
  newsdata: any;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    public navCtrl: NavController
  ) {
    this.route.queryParams.subscribe((params) => {
      if (params.data) {
        this.newsdata = JSON.parse(params.data);
      }
    });
  }
  back() {
    this.navCtrl.back();
  }
  ngOnInit() {}
}
