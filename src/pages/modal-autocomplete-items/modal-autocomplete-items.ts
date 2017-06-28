import { Component, OnInit } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

declare var google: any;

@Component({
    selector: 'page-modal-autocomplete-items',
    templateUrl: 'modal-autocomplete-items.html'
})
export class ModalAutocompleteItems implements OnInit {

    autocompleteItems: any;
    autocomplete: any;
    acService: any;
    placesService: any;

    constructor(public viewCtrl: ViewController, public params: NavParams ) {

    }

    ngOnInit() {
        this.acService = new google.maps.places.AutocompleteService();
        this.autocompleteItems = [];
        this.autocomplete = {
            query: ''
        };

        this.autocomplete.query = this.params.get("text");
        this.updateSearch();
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    chooseItem(item: any) {
        this.viewCtrl.dismiss(item);
    }

    updateSearch() {
        if (this.autocomplete.query == '') {
            this.autocompleteItems = [];
            return;
        }
        let self = this;
        let config = {
            types: ['geocode'], // other types available in the API: 'establishment', 'regions', and 'cities'
            input: this.autocomplete.query,
            componentRestrictions: { country: 'BR' }
        }
        this.acService.getQueryPredictions(config, function (predictions, status) {
            self.autocompleteItems = [];
            try {
                predictions.forEach(function (prediction) {
                    self.autocompleteItems.push(prediction);
                });
            } catch (e) {

            }
        });
    }

}
