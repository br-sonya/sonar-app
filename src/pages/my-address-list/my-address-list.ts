import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Loading, Alert, AlertController} from 'ionic-angular';
import {SonarServices} from "../../providers/sonar-services";

/*
  Generated class for the MyAddressList page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-my-address-list',
  templateUrl: 'my-address-list.html'
})
export class MyAddressListPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public services: SonarServices,
              private alertCtrl: AlertController, public loadingCtrl: LoadingController) {}
  list: any = Array();
  alert: Alert;
  presentAlertDefault(title:string, subtitle:string, btnOk:string){
    this.alert = this.alertCtrl.create({
      title: title,
      subTitle: subtitle,
      buttons: [
        {
          text: 'Ok',
          role: 'ok',
          handler: () => {
            this.alert.dismiss();
          }
        }
      ]
    });
    this.alert.present();
  }

  loading: Loading;
  presentLoadingDefault() {
    this.loading = this.loadingCtrl.create({
      content: 'Aguarde...'
    });

    this.loading.present();
  }


  ionViewDidLoad() {
    this.presentLoadingDefault();
    this.services.getAllAddresses().subscribe((res:any) => {
      console.log(res);
      this.list = res;
        setTimeout(() => {
          this.loading.dismiss();
        }, 1600);
    },
      (err) => {
        setTimeout(() => {
          this.loading.dismiss();
        }, 1600);

        setTimeout(() => {
          this.loading.dismiss();
        }, 100);

      });
  }

}
