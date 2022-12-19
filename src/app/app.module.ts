
import { NgModule, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicStorageModule } from '@ionic/storage-angular';
import { Drivers } from '@ionic/storage';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { HttpClientModule } from '@angular/common/http';
import { Camera } from '@ionic-native/camera/ngx/index';
import { File } from '@ionic-native/file/ngx';
import { FilePath } from '@ionic-native/file-path/ngx/index';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx/index';
import { Stripe } from '@ionic-native/stripe/ngx';
import { OneSignal } from '@ionic-native/onesignal/ngx/index';
import { Contacts } from '@ionic-native/contacts/ngx';
import { QRScanner } from '@ionic-native/qr-scanner/ngx';
import { Globalization } from '@ionic-native/globalization/ngx/index';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Network } from '@ionic-native/network/ngx/index';
import { NFC } from '@ionic-native/nfc/ngx/index';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { SafariViewController } from '@ionic-native/safari-view-controller/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { BrMaskerModule } from 'br-mask';
import { ReqmoneyuserlistPageModule } from './reqmoneyuserlist/reqmoneyuserlist.module';
import { ConfirmsendPageModule } from './modals/confirmsend/confirmsend.module';
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrMaskerModule,
        BrowserModule,
        IonicModule.forRoot({
            swipeBackEnabled: false,
            animated: false,
            mode: 'md'
        }),
        IonicStorageModule.forRoot({
           driverOrder: [CordovaSQLiteDriver._driver, Drivers.IndexedDB]
        }),
        AppRoutingModule,
        HttpClientModule,
        ReqmoneyuserlistPageModule,
        ConfirmsendPageModule,
        ReactiveFormsModule,
    ],
    providers: [
        StatusBar,
        NFC,
        SplashScreen,
        Storage,
        NativeStorage,
        Camera,
        File,
        FilePath,
        FileTransfer,
        FileChooser,
        Stripe,
        Globalization,
        Contacts,
        OneSignal,
        QRScanner,
        BarcodeScanner,
        Geolocation,
        Network,
        Deeplinks,
        SafariViewController,
        InAppBrowser,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
