import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import {SonarServices} from "../providers/sonar-services";
import {DefaultPage} from "../pages/default/default";
import { IonicStorageModule } from '@ionic/storage';
import {SignupPage} from "../pages/signup/signup";
import {AddAddressPage} from "../pages/add-address/add-address";
import {MyAddressListPage} from "../pages/my-address-list/my-address-list";
import { RoutesPage } from "../pages/routes/routes";
import { ModalAutocompleteItems } from '../pages/modal-autocomplete-items/modal-autocomplete-items';
import { LocationTracker } from '../providers/location-tracker';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { Geolocation } from '@ionic-native/geolocation';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { AndroidPermissions } from "@ionic-native/android-permissions"
import { StepByStepRoutePage } from "../pages/step-by-step-route/step-by-step-route";



@NgModule({
  declarations: [
    MyApp,
    HomePage,
    DefaultPage,
    SignupPage,
    AddAddressPage,
      MyAddressListPage,
      RoutesPage,
      ModalAutocompleteItems,
      StepByStepRoutePage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    DefaultPage,
    SignupPage,
    AddAddressPage,
    MyAddressListPage,
      RoutesPage,
      ModalAutocompleteItems,
      StepByStepRoutePage
  ],
  providers: [
      SonarServices,
      SpeechRecognition,
      LocationTracker,
      Geolocation,
      TextToSpeech,
    AndroidPermissions,
      BackgroundGeolocation
  ]
})
export class AppModule {}
