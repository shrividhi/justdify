import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import { isNull } from 'util';
import { Storage } from '@ionic/storage';
declare var google: any;
@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss'],
})
export class GoogleMapComponent implements OnInit {
  public long: any; //longitude
  public lati: any; //latitude
  salonLoc: any;
  @ViewChild('Map', {static:true}) mapElement: ElementRef;
    map: any;
    mapOptions: any;
    markerOptions: any = {position: null, map: null, title: null};
    marker: any;
    apiKey: any = 'AIzaSyACte6V5dDNmmBeyXrhVAfF9jWGTIHUbqg'; /*Your API Key*/
  currentLatLong: any = [];
  
  constructor(
    private route: ActivatedRoute,
    private router: Router, 
    public geolocation: Geolocation,
    public storage: Storage) 
    { 
      this.route.queryParams.subscribe(data => {
        console.log('queryParam data>>', data);
        this.salonLoc = JSON.parse(data.salonLocation);
        console.log('salonLocation>>>>',this.salonLoc);
      });
        //use the current geolocation 
        this.geolocation.getCurrentPosition().then((position) => {
          this.ionViewDidEnter(position.coords);
        });
      
   }
   goBack(){
    this.router.navigate(['/salon-detail']);
   }
   
   ionViewDidEnter(position){
          if(!isNull(position)) {
            var pointA = new google.maps.LatLng(position.latitude, position.longitude);
            this.currentLatLong.push(position.latitude);
            this.currentLatLong.push(position.longitude);
            this.storage.set('currentLatLong', this.currentLatLong );
            console.log('>>>>>>cureent lat long array', this.currentLatLong);
            
          }
          var pointB = new google.maps.LatLng(this.salonLoc.latitude, this.salonLoc.longitude); 
          
          // /*Map options*/
          this.mapOptions = {
              center: pointA,
              zoom: 20,
              mapTypeControl: true
          };
          this.map = new google.maps.Map(this.mapElement.nativeElement, this.mapOptions);
          var directionsService = new google.maps.DirectionsService;
          var directionsDisplay = new google.maps.DirectionsRenderer({
            map: this.map
          }),
          markerA = new google.maps.Marker({
            position: pointA,
            title: "point A",
            label: "Your location",
            map: this.map
          }),
          markerB = new google.maps.Marker({
            position: pointB,
            title: "point B",
            label: this.salonLoc.saloon_name,
            map: this.map
          });
        console.log('>>>calculateAndDisplayRoute',directionsService, directionsDisplay, pointA, pointB);        
        this.calculateAndDisplayRoute(directionsService, directionsDisplay, pointA, pointB);
   }
  ngOnInit(){}

  calculateAndDisplayRoute(directionsService, directionsDisplay, pointA, pointB) {
    console.log('>>>>Entered calculateAndDisplayRoute>>>>');
    directionsService.route({
      origin: pointA,
      destination: pointB,
      travelMode: google.maps.TravelMode.DRIVING
    }, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }


}
