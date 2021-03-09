import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';

import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { HTTP } from '@ionic-native/http/ngx';
import { environment } from 'src/environments/environment';
// import { environment } from "src/environments/environment.prod";
import { Router, ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AlertService } from '../shared/services/alert.service';
import { isNull } from 'util';
import {Geolocation} from '@ionic-native/geolocation/ngx';
declare var google: any;
@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  nearBysalons: any;
  salonlist: any;
  viewSalon: any;
  categories: any;
  slideOpts = {
    initialSlide: 1,
    speed: 400
  };
  env: any;
  logindetails: any;
  userLatLong: any;
  lat: any;
  long: any;
  loginstatus: any;
  myValue: any;
  value: any;
  isPlaceSearchEnabled: boolean;
  data: any;
  searchSalon: String;
  searchPlace: String;
  currentLatLong: any = [];
  GoogleAutocomplete: google.maps.places.AutocompleteService;
  autocomplete: { input: string; };
  autocompleteItems: any[];
  location: any;
  placeid: any;
  google: any
  salonLat: any;
  salonLong: any;
  constructor(
    public formBuilder: FormBuilder,
    private http: HTTP,
    private route: ActivatedRoute,
    private router: Router,
    private storage: Storage,
    public alert: AlertService,
    public geolocation: Geolocation,
    public zone: NgZone
  ) {
    this.env = environment;
    console.log('>>>login state', this.env.loginState);
    this.storage.get('loginStatus').then((val) => {
      this.loginstatus = val;
      console.log('>>login status', val);
    });
    this.storage.get('loginInfo').then((val) => {
      this.logindetails = val;
      console.log('Login Info : ' + JSON.stringify(val));
    });

    this.topCategories();
    this.storage.get('currentLatLong').then((value) => {
      this.userLatLong = value;
      this.lat = this.userLatLong[0];
      this.long = this.userLatLong[1];
      this.ViewSalonNearBy(this.userLatLong);
      console.log('>>>this.userlatlong', this.userLatLong);

    });

    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
  }

  ngOnInit() {
    this.isPlaceSearchEnabled = false;
  }

  locateUser(){
    this.geolocation.getCurrentPosition().then((position) => {
      this.refreshLocation(position.coords);
    });
  }
  
  refreshLocation(position){
    if(!isNull(position)) {
      var pointA = new google.maps.LatLng(position.latitude, position.longitude);
      this.currentLatLong = [];
      this.currentLatLong.push(position.latitude);
      this.currentLatLong.push(position.longitude);
      this.storage.set('currentLatLong', this.currentLatLong);
      console.log('>>>>>>cureent lat long array', this.currentLatLong);      
    }
  }

  ionViewDidEnter(){
    document.addEventListener("backbutton", function (e) {
      console.log("disable back button", e)
    }, false);
  }

  ViewSalonNearBy(userLatLong) {
    console.log('>>>latlong 100', this.lat, this.long);
    let param = {
      'User[latitude]': this.lat,
      'User[longitude]': this.long,
      'User[current_lat]': '',
      'User[current_long]': '',
      'User[member]': '',
      'User[check_in_date]': ''
    }
    console.log('>>request params', JSON.stringify(param));

    this.http.post(environment.mainURL + "user/nearby-saloon", param, { 'Content-type': 'application/json' })
      .then(result => {
        let response = JSON.parse(result.data);
        if (result['status'] == 200) {
          console.log(">>>> inside nearby", response);
          this.viewSalon = response.list;
          console.log(">>>> this.viewSalon", JSON.stringify(this.viewSalon));
        }
        else {
          this.alert.show('Something went wrong');
        };
      })
      .catch(error => {
        console.log(error);
      });
  }

  viewAll() {
    this.router.navigate(['/search-result'], { queryParams: { nearbysalon: JSON.stringify(this.viewSalon) } });
  }

  searchSalons(search) {
    this.http.get(environment.mainURL + "user/search-details?search_data=" + search, {}, {})
      .then(result => {
        let response = JSON.parse(result.data);
        if (result['status'] == 200) {
          this.nearBysalons = response.list;
          console.log('>>>nearby ', response.list);
          this.router.navigate(['/search-result'], { queryParams: { nearbysalon: JSON.stringify(this.nearBysalons) } });
        }
        else {
          this.alert.show('Something went wrong');
        };
      })
      .catch(error => {
        console.log(error);
      });

    // this.router.navigate(['/search-result'],{queryParams:{nearbysalon: JSON.stringify(nearBysalons)}});
  }

  salonDetail(salon) {
    this.router.navigate(['/salon-detail'], { queryParams: { salonDetails: JSON.stringify(salon) } });
  }

  myProfile() {
    if (this.loginstatus === true) {
      this.router.navigate(['/my-profile']);
    }
    else {
      this.alert.show('Please login to continue');
      this.router.navigate(['/login']);
    }
  }

  topCategories() {
    this.http.get(environment.mainURL + "user/top-categories", {}, { 'Content-type': 'application/json' })
      .then(result => {
        let response = JSON.parse(result.data);
        if (result['status'] == 200) {
          console.log(">>>> top categories", response);
          this.categories = response['list'];
          console.log('>>>categories', this.categories);
        }
        else {
          this.alert.show('Something went wrong');
        };
      })
      .catch(error => {
        console.log(error);
      });

  }

  handleEvent(e) {
    this.isPlaceSearchEnabled = !this.isPlaceSearchEnabled;
  }

  searchData() {
    if(this.isPlaceSearchEnabled){      
      let searchedAddress = this.autocomplete.input.replace(" ", "+");
      console.log('log 209',searchedAddress);
      this.http.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${searchedAddress}&key=AIzaSyACte6V5dDNmmBeyXrhVAfF9jWGTIHUbqg`, {}, {})
      .then(result => {
        let parsedResponse = JSON.parse(result.data);
        this.salonLat = parsedResponse.results[0].geometry.location.lat;
        this.salonLong = parsedResponse.results[0].geometry.location.lng;
        this.searchSalonByLocation(this.salonLat,this.salonLong);
        console.log('log 214', parsedResponse.results[0].geometry.location.lat);
        console.log('log 215', parsedResponse.results[0].geometry.location.lng);
      })
      .catch(error => {
        console.log(error);
      });
    } else { 
      console.log(this.searchSalon);
      this.searchSalons(this.searchSalon);
    }
  }

  searchSalonByLocation(salonLat, salonLong){
    console.log('>>>latlong 224', salonLat, salonLong)
    console.log('>>>latlong 225', this.salonLat, this.salonLong);
    let param = {
      'User[latitude]': this.salonLat,
      'User[longitude]': this.salonLong,
      'User[current_lat]': '',
      'User[current_long]': '',
      'User[member]': '',
      'User[check_in_date]': ''
    }
    console.log('>>request params', JSON.stringify(param));

    this.http.post(environment.mainURL + "user/nearby-saloon", param, { 'Content-type': 'application/json' })
      .then(result => {
        let response = JSON.parse(result.data);
        console.log('239 params response ', response);
        if (result['status'] == 200) {
          this.nearBysalons = response.list;
          console.log('>>>nearby ', response.list);
          this.router.navigate(['/search-result'], { queryParams: { nearbysalon: JSON.stringify(this.nearBysalons) } }); 
        }
        else {
          this.alert.show('Something went wrong');
        };
      })
      .catch(error => {
        console.log(error);
      });
  }

  updateSearchResults(){
    if (this.autocomplete.input == '') {
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input },
    (predictions, status) => {
      this.autocompleteItems = [];
      this.zone.run(() => {
        predictions.forEach((prediction) => {
          this.autocompleteItems.push(prediction);
        });
      });
    });
  }

  selectSearchResult(item) {
    console.log(item)
    this.autocomplete.input = item.description;
    this.autocompleteItems = [];
    this.location = item
    this.placeid = this.location.place_id
    console.log('placeid'+ this.placeid)
  }
  

}
