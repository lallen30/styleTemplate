import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
} from "@angular/core";
import {
  UntypedFormGroup,
  FormBuilder,
  UntypedFormControl,
  Validators,
} from "@angular/forms";
import {
  NavController,
  ActionSheetController,
  Platform,
  AlertController,
  IonRouterOutlet,
} from "@ionic/angular";
import { UserService } from "../user.service";
import {
  Camera,
  CameraOptions,
  PictureSourceType,
} from "@ionic-native/camera/ngx/index";
import { File } from "@ionic-native/file/ngx";
import { FilePath } from "@ionic-native/file-path/ngx/index";
import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject,
} from "@ionic-native/file-transfer/ngx";
import { Storage } from "@ionic/storage";
import { DomSanitizer } from "@angular/platform-browser";
import { Geolocation } from "@ionic-native/geolocation/ngx";
// import { domain } from 'process';
declare var google;
@Component({
  selector: "app-createaccount",
  templateUrl: "./createaccount.page.html",
  styleUrls: ["./createaccount.page.scss"],
})
export class CreateaccountPage implements OnInit {
  @ViewChild("maaap", { static: false }) mapElement: ElementRef;
  maaap: any;
  latitude: any = 35.92182;
  longitude: any = -84.04926;
  mapView: boolean = false;
  drawerOptions: any;
  directionsDisplay = new google.maps.DirectionsRenderer();
  createProfileForm: UntypedFormGroup;
  images: any[];
  user: any;
  res: any;
  user_info: any;
  type: any;
  image_data: any;
  radius = 3000;
  milesArea;
  km: number;
  site_domain: any = "";
  constructor(
    public userService: UserService,
    public navCtrl: NavController,
    public filePath: FilePath,
    public ref: ChangeDetectorRef,
    public camera: Camera,
    public transfer: FileTransfer,
    public actionSheetController: ActionSheetController,
    public plt: Platform,
    public Storage: Storage,
    private sanitizer: DomSanitizer,
    public alertCtrl: AlertController,
    private geolocation: Geolocation,
    private routerOutlet: IonRouterOutlet
  ) {
    this.createProfileForm = new UntypedFormGroup({
      first_name: new UntypedFormControl("", Validators.required),
      last_name: new UntypedFormControl("", Validators.required),
      phone: new UntypedFormControl("", Validators.required),
    });
    this.GetLocation();
    this.site_domain = this.userService.getURL();
    console.log("site_domain:", this.site_domain);
  }

  ngOnInit() {}
  GetLocation() {
    setTimeout(() => {
      this.initMap();
    }, 500);
    this.geolocation
      .getCurrentPosition()
      .then((resp) => {
        this.latitude = resp.coords.latitude;
        this.longitude = resp.coords.longitude;
        this.maaap.setCenter(
          new google.maps.LatLng(this.latitude, this.longitude)
        );
      })
      .catch((error) => {
        this.maaap.setCenter(
          new google.maps.LatLng(this.latitude, this.longitude)
        );
      });
  }
  async initMap() {
    this.maaap = new google.maps.Map(document.getElementById("maaap"), {
      zoom: 12,
      disableDefaultUI: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      scrollwheel: false,
      center: {
        lat: this.latitude,
        lng: this.longitude,
      },
    });
    this.directionsDisplay.setMap(this.maaap);
    google.maps.event.addListener(this.maaap, "idle", () => {
      this.latitude = this.maaap.getBounds().getCenter().lat();
      this.longitude = this.maaap.getBounds().getCenter().lng();
    });
    this.addMarker();
  }
  addMarker() {
    let marker = new google.maps.Marker({
      map: this.maaap,
      animation: google.maps.Animation.DROP,
      position: this.maaap.getCenter(),
    });
    this.km = this.radius / 1609.344;
    this.milesArea = (this.km / 1.609344).toFixed(2) + " Miles";
    let infoWindow = new google.maps.InfoWindow({});
    google.maps.event.addListener(marker, "click", () => {
      infoWindow.setContent(this.milesArea);
      infoWindow.open(this.maaap, marker);
    });
    //   let circle = new google.maps.Circle( {
    //     map           : this.maaap,
    //     center        : new google.maps.LatLng( this.latitude, this.longitude ),
    //     radius        : this.radius,
    //     strokeColor   : '#ea4435',
    //     strokeOpacity : 1,
    //     strokeWeight  : 2,
    //     fillColor     : '#f6e3de',
    //     fillOpacity   : 0.3,
    //     editable: true,
    // } )
    //   google.maps.event.addListener(circle, 'radius_changed', function () {
    //     this.km = circle.radius/1609.344
    //     this.milesArea = (this.km/1.609344).toFixed(2)+' Miles'
    //   infoWindow.setContent(this.milesArea);
    // })
  }
  ionViewWillEnter() {
    this.site_domain = this.userService.getURL();
    console.log("site_domain:", this.site_domain);

    this.routerOutlet.swipeGesture = false;
    this.Storage.get("user").then(
      (userInfo) => {
        if (userInfo != null) {
          this.user = userInfo;
        }
      },
      (err) => {
        this.navCtrl.navigateForward(["/login"]);
      }
    );
  }
  async selectImage(type) {
    this.images = [];
    this.type = type;
    const actionSheet = await this.actionSheetController.create({
      header: "Select Image source",
      buttons: [
        {
          text: "Image From Library",
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          },
        },
        {
          text: "Image From Camera",
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          },
        },
        {
          text: "Cancel",
          role: "cancel",
        },
      ],
    });
    await actionSheet.present();
  }
  takePicture(sourceType: PictureSourceType) {
    var options: CameraOptions = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true,
    };

    this.camera.getPicture(options).then((imagePath) => {
      if (
        this.plt.is("android") &&
        sourceType === this.camera.PictureSourceType.PHOTOLIBRARY
      ) {
        this.filePath.resolveNativePath(imagePath).then((filePath) => {
          let correctPath = filePath.substr(0, filePath.lastIndexOf("/") + 1);
          let currentName = imagePath.substring(
            imagePath.lastIndexOf("/") + 1,
            imagePath.lastIndexOf("?")
          );
          let smext = currentName.split(".").pop();
          let ext = smext.toLowerCase();
          this.copyFileToLocalDir(
            correctPath,
            currentName,
            this.createFileName(ext)
          );
        });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf("/") + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf("/") + 1);
        let smext = currentName.split(".").pop();
        let ext = smext.toLowerCase();
        this.copyFileToLocalDir(
          correctPath,
          currentName,
          this.createFileName(ext)
        );
      }
    });
  }
  createFileName(ext) {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + "." + ext;
    return newFileName;
  }

  copyFileToLocalDir(namePath, currentName, newFileName) {
    var file = new File();
    file.copyFile(namePath, currentName, file.dataDirectory, newFileName).then(
      (success) => {
        this.updateStoredImages(newFileName);
      },
      (error) => {
        this.userService.presentToast("Error while storing file.");
      }
    );
  }

  updateStoredImages(name) {
    var file = new File();
    let filePath = file.dataDirectory + name;
    let resPath = this.pathForImage(filePath);

    let newEntry = {
      name: name,
      path: resPath,
      filePath: filePath,
    };

    this.images.push(newEntry);
    this.UploadImage(this.user);
    this.image_data = resPath;
    this.ref.detectChanges();
  }
  getImgContent() {
    return this.sanitizer.bypassSecurityTrustUrl(this.image_data);
  }
  pathForImage(img) {
    if (img === null) {
      return "";
    } else {
      let converted = (<any>window).Ionic.WebView.convertFileSrc(img);
      return converted;
    }
  }
  UploadImage(user) {
    if (this.images.length > 0) {
      let _mime_type = "image/jpeg";

      let smext = this.images[0].name.split(".").pop();
      let ext = smext.toLowerCase();

      if (ext == "png") {
        _mime_type = "image/png";
      }

      if (ext == "jpeg") {
        _mime_type = "image/jpeg";
      }

      if (ext == "mov") {
        _mime_type = "video/quicktime";
      }

      if (ext == "mp4") {
        _mime_type = "video/mp4";
      }

      if (ext == "jpg") {
        _mime_type = "image/jpeg";
      }

      const fileTransfer: FileTransferObject = this.transfer.create();
      let header: Headers = new Headers();
      header.append("Authorization", "Bearer " + user.token);
      let options: FileUploadOptions = {
        fileKey: "file",
        fileName: user.user_id + "_featured." + ext,
        chunkedMode: false,
        mimeType: _mime_type,
        params: { token: this.user.token },
      };

      fileTransfer
        .upload(
          this.images[0].filePath,
          this.site_domain + "wp-json/mobileapi/v1/createpicture",
          options
        )
        .then(
          (data1) => {},
          (err) => {
            this.userService.dismissLoading();
          }
        );
    }
  }
  submit(formdata) {
    this.userService.showLoader();
    formdata["token"] = this.user.token;
    this.userService.sendData("create_profile", formdata).subscribe(
      (data) => {
        if ((data["status"] = "ok")) {
          this.userService.dismissLoading();
          // if(this.user['kyc_status'] == '0'){
          //   this.presentAlert('Please setup your bank account information to send or receive money.')
          //   }
          this.navCtrl.navigateForward(["tabs/mywallet"]);
        }
      },
      (err) => {
        this.userService.dismissLoading();
        if (err.error.error_code == "user_expire") {
          this.navCtrl.navigateForward(["login"]);
        }
        this.userService.presentAlert(err.error.errormsg);
      }
    );
  }
  async presentAlert(msg) {
    let alert = await this.alertCtrl.create({
      message: msg,
      buttons: [
        {
          text: "Setup Now",
          handler: () => {
            this.navCtrl.navigateForward("cardkyc");
          },
        },
        {
          text: "Later",
          handler: () => {},
        },
      ],
    });

    await alert.present();
  }
}
