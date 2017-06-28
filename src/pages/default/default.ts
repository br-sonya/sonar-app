import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {SonarServices} from "../../providers/sonar-services";
import {Storage} from '@ionic/storage';
import {HomePage} from "../home/home";
import {AddAddressPage} from "../add-address/add-address";
import {MyAddressListPage} from "../my-address-list/my-address-list";
import { RoutesPage } from "../routes/routes";
import { AndroidPermissions } from "@ionic-native/android-permissions"

/*
  Generated class for the Default page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-default',
  templateUrl: 'default.html'
})
export class DefaultPage {

  isVisitor:boolean = true;
  constructor(public navCtrl: NavController, permissions: AndroidPermissions, public navParams: NavParams, public services: SonarServices, public storage: Storage) {

    permissions.checkPermission(permissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
      success => console.log('Permission granted'),
      err => () => {
        permissions.requestPermissions(permissions.PERMISSION.ACCESS_FINE_LOCATION);
        permissions.requestPermissions(permissions.PERMISSION.ACCESS_COARSE_LOCATION);
      }
    );
    }

  ionViewDidLoad() {
    if(this.services.userId != null){
      this.isVisitor = false;
    }
  }

  MyAddresses(){
    this.navCtrl.push(MyAddressListPage);
  }

  OpenRoutes() {
      this.navCtrl.push(RoutesPage);
  }

  AddAddress(){
    this.navCtrl.push(AddAddressPage);
  }

  Exit(){
    this.storage.clear();
    this.navCtrl.setRoot(HomePage);
  }

}
