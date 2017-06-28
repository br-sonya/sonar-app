import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {SonarServices} from "../../providers/sonar-services";

import { LocationTracker } from '../../providers/location-tracker';

@Component({
  selector: 'page-step-by-step-route',
  templateUrl: 'step-by-step-route.html'
})
export class StepByStepRoutePage {
    req: any;
    constructor(public navCtrl: NavController, public navParams: NavParams, public locationTracker: LocationTracker, public services: SonarServices) {
      this.req = navParams.get("req");

      this.locationTracker.startTracking(this.req);

    }

  strip(html)
  {
    var tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }
  ionViewDidLoad() {
  }

  start() {
  }

  stop() {
      this.locationTracker.stopTracking();
      this.navCtrl.pop();
  }

}
