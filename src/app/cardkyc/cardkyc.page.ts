import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
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
import { Router } from "@angular/router";
import { Stripe } from "@ionic-native/stripe/ngx";

@Component({
  selector: "app-cardkyc",
  templateUrl: "./cardkyc.page.html",
  styleUrls: ["./cardkyc.page.scss"],
})
export class CardkycPage implements OnInit {
  images: any[];
  setting;
  kycdetail: UntypedFormGroup;
  user: any;
  image_data: any;
  type: any;
  image_data1: any;
  images1: any[];
  type1: any;
  imagefrontadd = false;
  imagebackadd: boolean = false;

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
    public router: Router,
    private stripe: Stripe
  ) {}
  ionViewWillEnter() {
    this.Storage.get("user").then(
      (val) => {
        if (val != null) {
          this.user = val;
          this.GetSetting();
        } else {
          this.Storage.clear();
          this.router.navigate(["/login"]);
        }
      },
      (err) => {
        this.Storage.clear();
        this.router.navigate(["/login"]);
      }
    );
  }
  ngOnInit() {
    this.kycdetail = new UntypedFormGroup({
      date_of_birth: new UntypedFormControl(
        "",
        Validators.compose([Validators.required])
      ),
      business_website: new UntypedFormControl("https://instacash.com"),
      phone: new UntypedFormControl(
        "",
        Validators.compose([Validators.required])
      ),
      pin_ssn: new UntypedFormControl(
        "",
        Validators.compose([Validators.required])
      ),
      routing_number: new UntypedFormControl(
        "",
        Validators.compose([Validators.required])
      ),
      account_number: new UntypedFormControl(
        "",
        Validators.compose([Validators.required])
      ),
      account_holder_name: new UntypedFormControl(
        "",
        Validators.compose([Validators.required])
      ),
      city: new UntypedFormControl(
        "",
        Validators.compose([Validators.required])
      ),
      zipcode: new UntypedFormControl(
        "",
        Validators.compose([Validators.required])
      ),
      state_code: new UntypedFormControl(
        "",
        Validators.compose([Validators.required])
      ),
      address1: new UntypedFormControl(
        "",
        Validators.compose([Validators.required])
      ),
      address2: new UntypedFormControl(""),
      mcc: new UntypedFormControl(
        "",
        Validators.compose([Validators.required])
      ),
    });
  }
  back() {
    this.navCtrl.back();
  }
  async selectImage(type) {
    this.images = [];
    this.type = type;
    const actionSheet = await this.actionSheetController.create({
      header: "Select Image source",
      buttons: [
        {
          text: "Load image from Library",
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          },
        },
        {
          text: "capture image using Camera",
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
    this.UploadImage();
    this.image_data = resPath;
    this.imagefrontadd = true;
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
  UploadImage() {
    if (this.images) {
      let _mime_type = "image/jpeg";
      const fileTransfer: FileTransferObject = this.transfer.create();
      let header: Headers = new Headers();
      header.append("Authorization", "Bearer " + this.user.token);
      let options: FileUploadOptions = {
        fileKey: "file",
        fileName: this.user.user_id + "_featured.jpeg",
        chunkedMode: false,
        mimeType: _mime_type,
        params: { token: this.user.token, type: this.type },
      };
      let domain = this.userService.getURL();
      console.log("domain:", domain);
      fileTransfer
        .upload(
          this.images[0].filePath,
          domain + "wp-json/mobileapi/v1/addKycImage",
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
  async selectImage1(type) {
    this.images1 = [];
    this.type1 = type;
    const actionSheet = await this.actionSheetController.create({
      header: "Select Image source",
      buttons: [
        {
          text: "Load image from Library",
          handler: () => {
            this.takePicture1(this.camera.PictureSourceType.PHOTOLIBRARY);
          },
        },
        {
          text: "capture image using Camera",
          handler: () => {
            this.takePicture1(this.camera.PictureSourceType.CAMERA);
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
  takePicture1(sourceType: PictureSourceType) {
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
          this.copyFileToLocalDir1(
            correctPath,
            currentName,
            this.createFileName1(ext)
          );
        });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf("/") + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf("/") + 1);
        let smext = currentName.split(".").pop();
        let ext = smext.toLowerCase();
        this.copyFileToLocalDir1(
          correctPath,
          currentName,
          this.createFileName1(ext)
        );
      }
    });
  }
  createFileName1(ext) {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + "." + ext;
    return newFileName;
  }

  copyFileToLocalDir1(namePath, currentName, newFileName) {
    var file = new File();
    file.copyFile(namePath, currentName, file.dataDirectory, newFileName).then(
      (success) => {
        this.updateStoredImages1(newFileName);
      },
      (error) => {
        this.userService.presentToast("Error while storing file.");
      }
    );
  }

  updateStoredImages1(name) {
    var file = new File();
    let filePath = file.dataDirectory + name;
    let resPath = this.pathForImage1(filePath);

    let newEntry = {
      name: name,
      path: resPath,
      filePath: filePath,
    };

    this.images1.push(newEntry);
    this.UploadImage1();
    this.image_data1 = resPath;
    this.imagebackadd = true;
    this.ref.detectChanges();
  }
  getImgContent1() {
    return this.sanitizer.bypassSecurityTrustUrl(this.image_data1);
  }
  pathForImage1(img) {
    if (img === null) {
      return "";
    } else {
      let converted = (<any>window).Ionic.WebView.convertFileSrc(img);
      return converted;
    }
  }
  UploadImage1() {
    if (this.images1) {
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
      header.append("Authorization", "Bearer " + this.user.token);
      let options: FileUploadOptions = {
        fileKey: "file",
        fileName: this.user.user_id + "_featured." + ext,
        chunkedMode: false,
        mimeType: _mime_type,
        params: { token: this.user.token, type: this.type1 },
      };
      let domain = this.userService.getURL();
      console.log("domain:", domain);
      fileTransfer
        .upload(
          this.images1[0].filePath,
          domain + "wp-json/mobileapi/v1/addKycImage",
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
  GetSetting() {
    this.userService.getData("GetSetting").subscribe((res) => {
      this.setting = res;
    });
  }
  submit(data) {
    this.userService.showLoader();
    console.log(
      "this.setting.publishable_key res",
      this.setting.publishable_key
    );
    this.stripe
      .setPublishableKey(this.setting.publishable_key)
      .then((res) => {
        console.log("setPublishableKey res", res);
      })
      .catch((err) => {
        console.log("setPublishableKey", err);
      });
    var bankAccount = {
      routing_number: data.routing_number,
      account_number: data.account_number,
      account_holder_name: data.account_holder_name,
      account_holder_type: "individual",
      currency: "USD",
      country: "US",
    };
    console.log("bankAccount", bankAccount);
    this.stripe.createBankAccountToken(bankAccount).then(
      (res) => {
        console.log("stripe->createBankAccountToken->res:", res);
        data["token"] = this.user.token;
        data["stripeToken"] = res["id"];
        this.userService.sendData("verify_kyc_callback", data).subscribe(
          (res) => {
            console.log("res", res);
            if (res["status"] == "ok") {
              this.userService.dismissLoading();
              this.navCtrl.navigateForward("tabs/profile");
            } else {
              this.userService.dismissLoading();
              this.userService.presentAlert("Something went Wrong");
            }
          },
          (err) => {
            console.log("err2", err);
            this.userService.dismissLoading();
            let msg = "Something went wrong. Try again";
            if (err?.error?.errormsg) {
              this.userService.presentAlert(err.error.errormsg);
            } else if (err?.error?.msg) {
              this.userService.presentAlert(err.error.msg);
            } else {
              this.userService.presentAlert(msg);
            }
          }
        );
      },
      (err) => {
        console.log("err1", err);
        this.userService.dismissLoading();
        this.userService.presentAlert(err + "or Wrong");
      }
    );
  }
  cutimage1() {
    this.imagefrontadd = false;
    this.images = [];
  }
  cutimage2() {
    this.imagebackadd = false;
    this.images1 = [];
  }
}
