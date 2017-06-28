import { Component, ViewChild } from '@angular/core';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { NavController, NavParams, LoadingController, Loading, Alert, AlertController } from 'ionic-angular';
import { SonarServices } from "../../providers/sonar-services";
import { NgForm } from '@angular/forms';
import { HomePage } from "../home/home";
import set = Reflect.set;



/*
  Generated class for the Signup page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-signup',
    templateUrl: 'signup.html'
})


export class SignupPage {
    @ViewChild('name') nameEntry;
    @ViewChild('email') emailEntry;
    @ViewChild('password') passwordEntry;

    signupStep:number;

    constructor(public navCtrl: NavController, private alertCtrl: AlertController,
        public navParams: NavParams, public services: SonarServices, public loadingCtrl: LoadingController, private speechRecognition: SpeechRecognition) {

      this.signupStep = 1;
    }

    async isSpeechSupported(): Promise<boolean> {
        const isSupported = await this.speechRecognition.isRecognitionAvailable();
        console.log(isSupported);
        return isSupported;
    }

    startListen(input: string){
      if(this.isSpeechSupported()){
        this.getPermission();
        this.speechRecognition.startListening().subscribe((data) => {
          var text = data[0];
          switch (this.signupStep){
            case 1: {
              this.account.name = text;
              break;
            }case 2: {
              this.account.email  = text;
              break;
          }case 3: {
              this.account.password = text;
              break;
          }case 5: {
             this.address.city = text;
             break;
          }case 6: {
            this.address.location = text;
            break;
          }case 7: {
            this.address.cep = text;
            break;
          }case 8:{
            this.address.number = text;
            break;
          }case 9:{
            this.address.complement = text;
            break;
          }case 10:{
            this.address.neighborhood = text;
            break;
          }
          }
        }, error => console.log(error));
      }else{

      }
    }

    async getPermission(): Promise<void> {
        try {
            const perm = await this.speechRecognition.requestPermission();
            console.log(perm);
        } catch (e) {
        }
    }



    account: { name?: string, email?: string, password?: string } = {};
    address: {
        UserId?: string, stateId?: number, city?: string,
        location?: string, cep?: string, number?: string, complement?: string, neighborhood?: string
    } = {};
    submitted = false;
    isError: boolean = true;
    ionViewDidLoad() {

    }

    alert: Alert;
    presentAlertDefault(title: string, subtitle: string, btnOk: string) {
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

    nextStep(){
      if(this.signupStep < 10) {
        this.presentLoadingDefault();
        setTimeout(() => {
          this.signupStep++;
          this.loading.dismiss();
        }, 200);
      }else{
        this.toAddress();
      }
    }

    prevStep(){
      this.presentLoadingDefault();
      setTimeout(() =>
      {
        this.signupStep--;
        this.loading.dismiss();
      }, 200);
    }

    toAddress() {
        // if(this.account.password != null) {
        this.presentLoadingDefault();
        this.services.signUp(this.account).subscribe((response: any) => {
            setTimeout(() => {

                this.services.login(this.account.email, this.account.password).subscribe(
                    (response: any) => {
                        console.log(response);
                        this.services.registerLogin(response);
                        setTimeout(() => {
                            this.loading.dismiss();
                            this.saveAddress();
                        }, 1600);

                    },
                    (err: any) => {
                        setTimeout(() => {
                            this.loading.dismiss();
                            this.presentAlertDefault("Erro", err.error_description, "Ok");
                        }, 1600);
                    }
                )
            }, 1600);
        },
            (err: any) => {
                console.log(err);
                setTimeout(() => {
                    this.loading.dismiss();
                    this.presentAlertDefault("Erro", err.error_description, "Ok");
                }, 1600);
            });
        // }else{
        //   this.isError = false;
        //   }
    }

    saveAddress() {
        this.presentLoadingDefault();
        this.address.UserId = this.services.userId;
        this.services.addAddress(this.address).subscribe((response: any) => {
            setTimeout(() => {
                this.loading.dismiss();
            }, 1600);

            setTimeout(() => {
                this.navCtrl.setRoot(HomePage);
            }, 2600);
        },
            (err: any) => {
                setTimeout(() => {
                    this.loading.dismiss();
                    this.presentAlertDefault("Erro", err.error_description, "Ok");
                }, 1600);
            });
    }
}
