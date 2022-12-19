import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';
import { NavController} from '@ionic/angular';
@Component({
  selector: 'app-privacypolicy',
  templateUrl: './privacypolicy.page.html',
  styleUrls: ['./privacypolicy.page.scss'],
})
export class PrivacypolicyPage implements OnInit {
  user
  data
  constructor(
    private userService: UserService,
    public navCtrl:NavController,
    public storage:Storage,
  ) {
    this.userService.showLoader()
   }

  ngOnInit() {
  }
  back(){
    this.navCtrl.back()
  }
  ionViewWillEnter(){
    this.storage.get('user').then(userInfo => {
        this.user = userInfo;
        this.getPrivacyPage()
    }, err => {
      this.navCtrl.navigateForward(['/login']);
    });
  }
  getPrivacyPage(){
    this.userService.getData('getPrivacyPage').subscribe(res=>{
      this.userService.dismissLoading();
      if(res['status'] == 200){
        this.data = res['privacy_page'][0].post_content
      }
    }, error=>{
      this.userService.dismissLoading();
      this.userService.presentToast("Something went wrong!");
    });
}
}
