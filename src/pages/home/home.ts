import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { NavController } from 'ionic-angular';
import {SonarServices} from "../../providers/sonar-services";
import {DefaultPage} from "../default/default";
import { Storage } from '@ionic/storage';
import {SignupPage} from "../signup/signup";
import {SpeechRecognition} from "@ionic-native/speech-recognition";


@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  login: {email?: string, password?: string} = {};
  submitted = false;
  constructor(public navCtrl: NavController, public services: SonarServices,
  public storage: Storage, private speechRecognition: SpeechRecognition) {
    console.log(this.services.HAS_LOGGED_IN);
    services.getLoginInfo();
    this.storage.ready().then(() => {
      this.storage.get("access_token").then(data => {
        this.services.access_token = data;
      }, error => { });
      this.storage.get("userId").then(data => {
        if(data != null){
          this.services.userId = data;
          this.navCtrl.setRoot(DefaultPage);
        }
      }, error => { });
    });
  }

  async getPermission(): Promise<void> {
    try {
      const perm = await this.speechRecognition.requestPermission();
      console.log(perm);
    } catch (e) {
    }
  }

  async isSpeechSupported(): Promise<boolean> {
    const isSupported = await this.speechRecognition.isRecognitionAvailable();
    console.log(isSupported);
    return isSupported;
  }
  startListen(input: number){
    if(this.isSpeechSupported()){
      this.getPermission();
      this.speechRecognition.startListening().subscribe((data) => {
        var text = data[0];
        switch (input){
          case 1: {
            this.login.email = text;
            break;
          }case 2: {
          this.login.password = text;
          break;
        }
        }
      }, error => console.log(error));
    }else{

    }
  }

  onContinue(){
    this.navCtrl.push(DefaultPage);
  }

  onLogin(form: NgForm) {
    this.submitted = true;
    if (form.valid) {
      console.log(this.login);
      this.services.login(this.login.email, this.login.password).subscribe(
        (response:any) => {
          console.log(response.access_token);
          this.services.registerLogin(response);
          this.navCtrl.setRoot(DefaultPage);
        },
        err => {
          console.log(err);
        }
      );
    }
  }

  onSignup() {
    this.navCtrl.push(SignupPage);
  }

}
