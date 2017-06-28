import { Injectable, NgZone } from '@angular/core';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import {SonarServices} from "../providers/sonar-services";
import 'rxjs/add/operator/filter';
declare var google: any;

@Injectable()
export class LocationTracker {

    public watch: any;
    public lat: number = 0;
    public routeDefined:boolean = false;
    public lng: number = 0;
    public route: any = new Array();
    public i:number = 0;
    public instruction:string = "Aguarde...";

    constructor(
        public zone: NgZone,
        public backgroundGeolocation: BackgroundGeolocation,
        public geolocation: Geolocation,
        public services: SonarServices,
        public tts: TextToSpeech
        ) {

    }

        async speak(text:string){
          try{
            if(this.instruction != text) {
              await this.tts.speak({text: text, locale: "pt-BR"});
            }
          }catch(e){
            console.log(e);
          }

        }

      strip(html)
      {
        var tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
      }

        startTracking(req:any) {
          var lastStep = { lat:'', lng:''}
        // Background Tracking

        this.zone.run(() => {

          //i.distance.value = Math.round(((i.distance.value * 100) / 34));
        });

        let config = {
            desiredAccuracy: 0,
            stationaryRadius: 1,
            distanceFilter: 0,
            debug: false,
            interval: 2000
        };

        this.backgroundGeolocation.configure(config).subscribe((location) => {

          console.log('BackgroundGeolocation:  ' + location.latitude + ',' + location.longitude);

        }, (err) => {
          console.log(err);
        });

          // Turn ON the background-geolocation system.
          this.backgroundGeolocation.start();



        //Foreground Tracking

        let options = {
            frequency: 10000,
            enableHighAccuracy: true
        };

        this.watch = this.geolocation.watchPosition(options).filter((p: any) => p.code === undefined).subscribe((position: Geoposition) => {

          console.log(position);

          // Run update inside of Angular's zone
          this.zone.run(() => {
            this.lat = position.coords.latitude;
            this.lng = position.coords.longitude;
          });
            if(this.routeDefined == false) {
              this.zone.run(() => {
                req.OriginLat = this.lat;
                req.OriginLng = this.lng;

                this.services.getRoute(req).subscribe((response: any) => {
                    this.route = response;
                    console.log(response);
                    if (this.route.Steps.length > 0) {
                      this.routeDefined = true;
                      this.speak(this.strip(this.route.Steps[1].Instructions));
                      this.instruction = this.strip(this.route.Steps[1].Instructions);
                      if (this.route.Steps[1].Mode == 2) {
                        setTimeout(() => {
                          let passos = Math.floor(this.route.Steps[1].Distance / 0.34);
                          this.speak("Após isso, andar aproximadamente" + passos + "passos.");
                        }, 9000);
                      }
                    } else {

                    }

                  },
                  (err: any) => {

                  });
              });
            }


          if(this.routeDefined == true) {
            console.log("defined");
            for (var i of this.route.Steps) {
              if (i.Mode == 2 && i.SubStep == false) {
              }else{
                console.log(i);
                var distance = this.getDistanceFromLatLonInKm(this.lat, this.lng, i.StartLatitude, i.StartLongitude);
                if (distance <= 0.01 && this.instruction != this.strip(i.Instructions)) {
                  this.zone.run(() => {
                    this.speak(this.strip(i.Instructions));
                  });

                  if (i.Mode == 2) {
                    setTimeout(() => {
                      let passos = Math.floor(i.Distance / 0.34);
                      this.zone.run(() => {
                        this.speak("Após isso, andar aproximadamente" + passos + "passos.");
                      });
                    }, 7000);
                  }

                  this.instruction = this.strip(i.Instructions);
                }
                }
              }
            }
          });
    }

    stopTracking() {

        console.log('stopTracking');

        this.backgroundGeolocation.finish();
        this.route = new Array();
        this.instruction = "Aguarde...";
        this.routeDefined = false;
        this.watch.unsubscribe();

    }

  getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2):number {

    // let from = new google.maps.LatLng(lat1, lon1);
    // let to = new google.maps.LatLng(lat2, lon2);
    // console.log(to);
    // let dist = google.maps.geometry.spherical.computeDistanceBetween(from, to);
    // return dist.toFixed(1);
  var R = 6371; // Radius of the earth in km
  var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
  var dLon = this.deg2rad(lon2-lon1);
  var a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c; // Distance in km
  return d;
  }

  deg2rad(deg) {
  return deg * (Math.PI/180)
  }

}
