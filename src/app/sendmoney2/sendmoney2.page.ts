import { Component, OnInit } from "@angular/core";
import { Storage } from "@ionic/storage";
import {
  NavController,
  LoadingController,
  AlertController,
  Platform,
} from "@ionic/angular";
import { UserService } from "../user.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Contacts } from "@ionic-native/contacts/ngx";
import { QRScanner, QRScannerStatus } from "@ionic-native/qr-scanner/ngx";
import {
  BarcodeScanner,
  BarcodeScannerOptions,
} from "@ionic-native/barcode-scanner/ngx";

@Component({
  selector: "app-sendmoney2",
  templateUrl: "./sendmoney2.page.html",
  styleUrls: ["./sendmoney2.page.scss"],
})
export class Sendmoney2Page implements OnInit {
  scanSub: any;
  encodedData = "";
  QRSCANNED_DATA: string;
  isOn = false;
  scannedData: {};
  number;
  cardid;
  useridbyqr: string;
  constructor(
    public navCtrl: NavController,
    public storage: Storage,
    public plt: Platform,
    public UserService: UserService,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public router: Router,
    public Contacts: Contacts,
    public qrScanCtrl: QRScanner,
    public barcodeCtrl: BarcodeScanner,
    private activatedRoute: ActivatedRoute
  ) {
    this.number = this.activatedRoute.snapshot.parent.paramMap.get("number");
    this.cardid = this.activatedRoute.snapshot.parent.paramMap.get("cardid");
  }

  ngOnInit() {}
  back() {
    this.navCtrl.back();
  }
  qr() {
    const options: BarcodeScannerOptions = {
      preferFrontCamera: true,
      showFlipCameraButton: true,
      showTorchButton: true,
      torchOn: false,
      prompt: "Place a barcode inside the scan area",
      resultDisplayDuration: 500,
      formats: "QR_CODE,PDF_417 ",
      orientation: "landscape",
    };

    this.barcodeCtrl
      .scan(options)
      .then((barcodeData) => {
        this.scannedData = barcodeData;
      })
      .catch((err) => {});
  }
  goToQrScan() {
    this.qrScanCtrl
      .prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          let data = document.getElementById("qrcont");
          data.classList.add("show-qr-scanner");
          const scanSub = this.qrScanCtrl.scan().subscribe((text: string) => {
            this.useridbyqr = text;
            data.classList.remove("show-qr-scanner");
            if (this.useridbyqr !== "") {
              data.classList.remove("show-qr-scanner");
              this.closeScanner();
              scanSub.unsubscribe();
              this.router.navigate([
                "/qruser",
                this.number,
                this.cardid,
                this.useridbyqr,
              ]);
            }
          });
          this.qrScanCtrl.show();
        } else if (status.denied) {
          this.qrScanCtrl.openSettings();
        } else {
        }
      })
      .catch((e: any) => {});
  }
  closeScanner() {
    this.qrScanCtrl.hide();
    this.qrScanCtrl.destroy();
  }
  pickContact() {
    this.Contacts.pickContact().then(
      (res) => {},
      (err) => {}
    );
  }
}
