import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { UserService } from '../user.service';
import { Storage } from '@ionic/storage';
@Component({
  selector: 'app-selected-activity',
  templateUrl: './selected-activity.page.html',
  styleUrls: ['./selected-activity.page.scss'],
})
export class SelectedActivityPage implements OnInit {
  transaction: any;
  user: any;
  result: any;
  account_info: any;
  constructor(public router: Router, public storage: Storage, public userService: UserService, public nvctrl: NavController, private activatedRoute: ActivatedRoute,) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((queryParams) => {
      console.log("queryParams:", queryParams);
      if (
        queryParams &&
        queryParams["transaction"] &&
        queryParams["transaction"] != null &&
        queryParams["transaction"] != undefined
      ) {
        this.transaction = JSON.parse(queryParams["transaction"]);

        console.log("queryParams->transaction:", this.transaction);
      }
    });
  }
  back() {
    this.nvctrl.back()
  }

  ionViewWillEnter() {
    this.storage.get('user').then((val) => {
      if (val) {
        this.user = val;
        if (this.transaction.externalaccount_id) {
          this.getAccountInfo("getExternalaccountInfo", this.transaction.externalaccount_id, this.transaction.text_type, this.transaction.user_id)
        } else {
          if (this.transaction.card_id) {
            this.getAccountInfo("getCardInfo", this.transaction.card_id, this.transaction.text_type, this.transaction.user_id)
          }
        }
      } else {
        this.storage.clear();
        this.router.navigate(['/login']);
      }
    });
  }

  getAccountInfo(endpoint, externalaccount_id, text_type, sender_id) {
    this.userService.getData(endpoint + "/?token=" + this.user.token + "&externalaccount_id=" + externalaccount_id + "&text_type=" + text_type + "&sender_id=" + sender_id).subscribe((response) => {
      if (response) {
        this.result = response;
        this.account_info = this.result.account_info
      } else {
        this.userService.presentAlert("Something went Wrong");
      }
    },
      (err) => {
        console.log("err:", err);
        if (err.error_code == "user_expire") {
          this.storage.clear();
          this.router.navigate(['/login']);
          this.userService.presentToast("Token is expired. Please login again.");
        } else {
          this.userService.presentAlert(err.error.msg);
        }

      }
    );
  }

}
