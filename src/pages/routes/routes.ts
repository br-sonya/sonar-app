import { Component, OnInit } from '@angular/core';
import { NavController, ModalController, NavParams } from 'ionic-angular';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { ModalAutocompleteItems } from "../modal-autocomplete-items/modal-autocomplete-items";
import { StepByStepRoutePage } from "../step-by-step-route/step-by-step-route";
import { Geolocation } from '@ionic-native/geolocation';
import { SpeechRecognition } from '@ionic-native/speech-recognition';


declare var google: any;

/*
  Generated class for the Routes page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-routes',
  templateUrl: 'routes.html'
})
export class RoutesPage implements OnInit {

    constructor(public navCtrl: NavController, public navParams: NavParams, public speechRecognition : SpeechRecognition, public modalCtrl: ModalController, public http: Http, public geolocation: Geolocation) {
    }
  address: any = {
      place: '',
      lat: '',
      lng: '',
      set: false,
  };
  placesService: any;
  map: any;
  placedetails: any;
  atualLat: number;
  atualLng: number;

  ngOnInit() {
      this.initMap();
      this.initPlacedetails();
  }

  ionViewDidLoad() {
      console.log('ionViewDidLoad RoutesPage');
      this.geolocation.getCurrentPosition().then((resp) => {
          this.atualLat = resp.coords.latitude;
          this.atualLng = resp.coords.longitude;

      }).catch((error) => {
          console.log('Error getting location', error);
      });
  }

  showModal(value:string = "") {
      // reset
      this.reset();
      // show modal|
      let modal = this.modalCtrl.create(ModalAutocompleteItems, {text: value});

      modal.onDidDismiss(data => {
          if (data) {
              this.address.place = data.description;
              // get details
              this.getPlaceDetail(data.place_id);
          }
      })
      modal.present();
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
        this.address.place = text;
        this.showModal(text);
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

  private reset() {
      this.initPlacedetails();
      this.address.place = '';
      this.address.set = false;
  }

  private getPlaceDetail(place_id: string): void {
      var self = this;
      var request = {
          placeId: place_id
      };
      this.placesService = new google.maps.places.PlacesService(this.map);
      this.placesService.getDetails(request, callback);
      function callback(place, status) {
          if (status == google.maps.places.PlacesServiceStatus.OK) {
              console.log('page > getPlaceDetail > place > ', place);
              // set full address
              self.placedetails.address = place.formatted_address;
              self.placedetails.lat = place.geometry.location.lat();
              self.placedetails.lng = place.geometry.location.lng();
              for (var i = 0; i < place.address_components.length; i++) {
                  let addressType = place.address_components[i].types[0];
                  let values = {
                      short_name: place.address_components[i]['short_name'],
                      long_name: place.address_components[i]['long_name']
                  }
                  if (self.placedetails.components[addressType]) {
                      self.placedetails.components[addressType].set = true;
                      self.placedetails.components[addressType].short = place.address_components[i]['short_name'];
                      self.placedetails.components[addressType].long = place.address_components[i]['long_name'];
                  }
              }
              // set place in map
              self.map.setCenter(place.geometry.location);
              // populate
              self.address.set = true;
              console.log('page > getPlaceDetail > details > ', self.placedetails);
          } else {
              console.log('page > getPlaceDetail > status > ', status);
          }
      }
  }

  private initMap() {
      var point = { lat: -34.603684, lng: -58.381559 };
      let divMap = (<HTMLInputElement>document.getElementById('map'));
      this.map = new google.maps.Map(divMap, {
          center: point,
          zoom: 15,
          disableDefaultUI: true,
          draggable: false,
          zoomControl: true
      });
  }

  private initPlacedetails() {
      this.placedetails = {
          address: '',
          lat: '',
          lng: '',
          components: {
              route: { set: false, short: '', long: '' },                           // calle
              street_number: { set: false, short: '', long: '' },                   // numero
              sublocality_level_1: { set: false, short: '', long: '' },             // barrio
              locality: { set: false, short: '', long: '' },                        // localidad, ciudad
              administrative_area_level_2: { set: false, short: '', long: '' },     // zona/comuna/partido
              administrative_area_level_1: { set: false, short: '', long: '' },     // estado/provincia
              country: { set: false, short: '', long: '' },                         // pais
              postal_code: { set: false, short: '', long: '' },                     // codigo postal
              postal_code_suffix: { set: false, short: '', long: '' },              // codigo postal - sufijo
          }
      };
  }

  private StartNavigation() {
          // resp.coords.latitude
          // resp.coords.longitude

          let request = {
              OriginLat: this.atualLat,
              OriginLng: this.atualLng,
              DestinationLat: this.placedetails.lat,
              DestinationLng: this.placedetails.lng,
              DepartureTime: "10/06/2017 10:00"
          };

          this.navCtrl.push(StepByStepRoutePage, { req: request });

  }

}
