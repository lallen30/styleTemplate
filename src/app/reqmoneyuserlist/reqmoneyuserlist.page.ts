import {
  Component,
  NgZone,
  OnInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from "@angular/core";
import { Storage } from "@ionic/storage";
import {
  NavController,
  LoadingController,
  ModalController,
  AlertController,
  Platform,
} from "@ionic/angular";
import { UserService } from "../user.service";
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";

@Component({
  selector: "app-reqmoneyuserlist",
  templateUrl: "./reqmoneyuserlist.page.html",
  styleUrls: ["./reqmoneyuserlist.page.scss"],
  // changeDetection:ChangeDetectionStrategy.OnPush,
})
export class ReqmoneyuserlistPage implements OnInit {
  amount: any = 0;
  user: any;
  alluser_listing: any = [];
  selected_user_id: any = "";
  search_keywords: any = "";
  ready: boolean = false;
  test: [1, 2, 3, 4, 5];
  page_no: number = 1;
  constructor(
    public navCtrl: NavController,
    public storage: Storage,
    public plt: Platform,
    public userService: UserService,
    public router: Router,
    private modalctrl: ModalController,
    private ngzone: NgZone,
    private ref: ChangeDetectorRef
  ) {
    // this.amount = this.activatedRoute.snapshot.parent.paramMap.get('number');
    // console.log("amount:", this.amount);

    // this.cardid = this.activatedRoute.snapshot.parent.paramMap.get('cardid');
    // console.log("cardid:", this.cardid);
    this.ready = false;
  }

  ngOnInit() {}

  back() {
    this.modalctrl.dismiss();
  }
  select_user(user) {
    this.modalctrl.dismiss({
      user,
    });
  }

  ionViewWillEnter() {
    console.log("API Calling");
    this.page_no = 1;
    this.storage.get("user").then(
      (val) => {
        if (val != null) {
          this.user = val;
          this.search_keywords = "";
          this.getuser();
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

  getuser() {
    this.ready = false;
    let sendData = {
      token: this.user.token,
      funding_sources: true,
      page_no: this.page_no,
      search_keywords: this.search_keywords,
    };
    this.userService.sendData("getAllUser", sendData).subscribe(
      (res) => {
        this.ready = true;
        this.ref.detectChanges();
        let result: any = res;
        if (result.status === "ok") {
          this.alluser_listing = res["users"];
          console.log("res_usersss:", this.alluser_listing.length);
        } else {
          this.userService.presentAlert("Something went Wrong");
        }
      },
      (err) => {
        this.ready = true;
        if (err.error.errormsg == "Not any resources found.") {
        } else {
          this.userService.presentAlert("Something went Wrong");
        }
      }
    );
  }

  doInfinite(event) {
    this.page_no++;
    let sendData = {
      token: this.user.token,
      funding_sources: true,
      page_no: this.page_no,
      search_keywords: this.search_keywords,
    };
    this.userService.sendData("getAllUser", sendData).subscribe(
      (res) => {
        this.ready = true;
        this.ref.detectChanges();
        let result: any = res;
        if (result.status === "ok") {
          this.alluser_listing = [...this.alluser_listing, ...res["users"]];
          if (res["users"].length == 0) {
            this.page_no--;
          }
        }
        event.target.complete();
      },
      (err) => {
        this.ready = true;
        event.target.complete();
        if (err.error.errormsg == "Not any resources found.") {
        } else {
          this.userService.presentAlert("Something went Wrong");
        }
      }
    );
  }

  clear() {
    this.search_keywords = "";
    this.getuser();
  }

  search(q: string, event) {
    if (event && event.key === "Enter") {
      console.log(q);
      this.search_keywords = q;
      this.getuser();
    }
  }
}
