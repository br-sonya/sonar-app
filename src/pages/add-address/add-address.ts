import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, LoadingController, Loading, Alert, AlertController} from 'ionic-angular';
import {SonarServices} from "../../providers/sonar-services";
import {HomePage} from "../home/home";
import {DefaultPage} from "../default/default";
/*
  Generated class for the AddAddress page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-add-address',
  templateUrl: 'add-address.html'
})
export class AddAddressPage {
  constructor(public navCtrl: NavController, private alertCtrl: AlertController,  public navParams: NavParams, public services: SonarServices, public loadingCtrl: LoadingController) {}
  address: {UserId?: string, stateId?: number, city?: string,
    location?: string, cep?: string, number?: string, complement?: string, neighborhood?: string} = {};
  ionViewDidLoad() {
    console.log('ionViewDidLoad AddAddressPage');
  }

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

  saveAddress(){
    this.presentLoadingDefault();
    this.address.UserId = this.services.userId;
    this.services.addAddress(this.address).subscribe((response:any) => {
        setTimeout(() => {
          this.loading.dismiss();
        }, 1600);

        setTimeout(() => {
          this.navCtrl.pop();
        }, 2600);
      },
      (err:any) => {
        setTimeout(() => {
          this.loading.dismiss();
          this.presentAlertDefault("Erro", err.error_description, "Ok");
        }, 1600);
      });
  }

}
