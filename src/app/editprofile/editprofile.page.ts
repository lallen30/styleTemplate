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
import { NavController, ActionSheetController, Platform } from "@ionic/angular";
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
import { EventService } from "../event.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-editprofile",
  templateUrl: "./editprofile.page.html",
  styleUrls: ["./editprofile.page.scss"],
})
export class EditprofilePage implements OnInit {
  @ViewChild("maap", { static: false }) mapElement: ElementRef;
  maap: any;
  latitude: any = 35.92182;
  longitude: any = -84.04926;
  mapView: boolean = false;
  drawerOptions: any;
  userprofile;
  editprofile: UntypedFormGroup;
  images: any[];
  res: any;
  user_info: any;
  type: any;
  image_data: any;
  radius = 3000;
  milesArea;
  km: number;
  states: any = [];
  user_spinner: string = "off";
  loginInfo: any = [];
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
    private geolocation: Geolocation,
    public EventService: EventService,
    public router: Router
  ) {
    this.site_domain = this.userService.getURL();
    console.log("site_domain:", this.site_domain);

    this.editprofile = new UntypedFormGroup({
      first_name: new UntypedFormControl("", Validators.required),
      last_name: new UntypedFormControl("", Validators.required),
      // phone: new FormControl("", Validators.required),
      // ssn_last_4: new FormControl(''),
      // dob: new FormControl(''),
      // zipcode: new FormControl(''),
      // city: new FormControl(''),
      // state: new FormControl(''),
      // street1: new FormControl(''),
      // street2: new FormControl(''),
    });
    // this.GetLocation();
    this.EventService.get_states().subscribe((data) => {
      // console.log(data);
      this.states = data;
    });
  }

  ngOnInit() {}

  ionViewWillEnter() {
    this.site_domain = this.userService.getURL();
    console.log("site_domain:", this.site_domain);
    this.EventService.get_states().subscribe((data) => {
      this.states = data;
    });
    this.Storage.get("user").then(
      (userInfo) => {
        if (userInfo != null) {
          this.loginInfo = userInfo;
          this.getProfile();
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

  back() {
    this.navCtrl.back();
  }

  getProfile() {
    this.user_spinner = "on";
    this.userService.showLoader();
    this.userService
      .getData("getProfile?token=" + this.loginInfo.token)
      .subscribe(
        (response) => {
          this.user_spinner = "off";
          this.userService.dismissLoading();
          if (response["status"] == "ok") {
            this.loginInfo = response["loginInfo"];
            this.Storage.set("user", this.loginInfo);

            console.log("get_profile()->LoginInfo:", this.loginInfo);
            this.image_data = this.loginInfo.user_avatar;
            this.editprofile.patchValue({
              first_name: this.loginInfo.first_name,
              last_name: this.loginInfo.last_name,
              // phone: this.loginInfo.phone,
              // street1: this.loginInfo.street1,
              // street2: this.loginInfo.street2,
              // city: this.loginInfo.city,
              // zipcode: this.loginInfo.zipcode,
              // state: this.loginInfo.state,
              // ssn_last_4: this.loginInfo.ssn_last_4,
              // dob: this.loginInfo.dob,
            });
          } else {
            this.userService.presentToast(response["msg"]);
          }
        },
        (err) => {
          this.user_spinner = "off";
          this.userService.dismissLoading();
          console.log("get_profile()->err:", err);
          if (err?.error?.error_code == "token_expired") {
            this.userService.presentToast(err?.error?.msg);
            this.Storage.clear();
            this.router.navigate(["/login"]);
          } else if (err?.error?.msg) {
            this.userService.presentToast(err?.error?.msg);
          } else {
            this.userService.presentToast(
              "Something went wrong. Try again later"
            );
          }
        }
      );
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
    this.UploadImage(this.loginInfo);
    this.image_data = resPath;
    this.ref.detectChanges();
  }
  pathForImage(img) {
    if (img === null) {
      return "";
    } else {
      let converted = (<any>window).Ionic.WebView.convertFileSrc(img);
      return this.sanitizer.bypassSecurityTrustUrl(converted);
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
      header.append("Authorization", "Bearer " + this.loginInfo.token);
      let options: FileUploadOptions = {
        fileKey: "file",
        fileName: this.loginInfo.user_id + "_featured." + ext,
        chunkedMode: false,
        mimeType: _mime_type,
        params: { token: this.loginInfo.token },
      };
      fileTransfer
        .upload(
          this.images[0].filePath,
          this.site_domain + "wp-json/mobileapi/v1/createpicture",
          options
        )
        .then(
          (data1) => {
            console.log("fileTransfer->Data1", data1);
            this.userService.dismissLoading();
          },
          (err) => {
            console.log("fileTransfer->err", err);
            this.userService.dismissLoading();
          }
        );
    }
  }
  submit(formdata) {
    this.userService.showLoader();
    formdata["token"] = this.loginInfo.token;
    console.log("formdata:", formdata);
    this.userService.sendData("updateprofile", formdata).subscribe(
      (data) => {
        this.userService.dismissLoading();
        if ((data["status"] = "ok")) {
          if (data["loginInfo"]) {
            this.loginInfo = data["loginInfo"];
            this.Storage.set("user", this.loginInfo);
          }
          this.EventService.publishEvent({
            event: "reload_profile",
            token: this.loginInfo.token,
          });
          this.navCtrl.navigateForward(["tabs/profile"]);
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
}
