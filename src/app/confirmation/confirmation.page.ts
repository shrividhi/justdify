import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HTTP } from '@ionic-native/http/ngx';
import { Storage } from '@ionic/storage';
import { environment } from 'src/environments/environment';
import { AlertService } from '../shared/services/alert.service';
import { LoaderService } from '../shared/services/loader.service';
// import { environment } from "src/environments/environment.prod";
@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.page.html',
  styleUrls: ['./confirmation.page.scss'],
})
export class ConfirmationPage implements OnInit {
  confirmDetails: any;
  salonbooking: any;
  serviceDetail: any;
  details: any;
  profileImage: any;
  bookedTime: any;
  bookedDate: any;
  saloonName: any;
  addresss: any;
  price: any;
  bookingDetails: any;
  currency: any;
  serviceData: any;
  bookingid: any;
  token: any;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HTTP,
    private storage: Storage,
    public loader: LoaderService,
    public alert: AlertService
  ) { 
    this.route.queryParams.subscribe(data => {
      this.bookingid = JSON.parse(data.bookingid);
      console.log('>>>>>params booking id', this.bookingid);
    });
    this.storage.get('loginInfo').then((value)=>{
      this.token = value.access_token;
      console.log('>>access token', this.token)
    });
    this.storage.get('salonDetail').then((value)=>{
      this.salonbooking = value;
      this.salonData(this.salonbooking);
    });
    this.storage.get('confirmBookData').then((val)=>{
      this.bookingDetails = val;
      this.bookingData(this.bookingDetails);
      console.log('>>>>storage get data', this.bookingDetails);
    });
  }

  ngOnInit() {
  }

  salonData(salonbooking){
    this.profileImage= salonbooking.profile_file;
    this.saloonName= salonbooking.saloon_name;
    this.addresss= salonbooking.address;  
  }

  bookingData(bookingDetails){
    this.serviceDetail = bookingDetails.services;
    this.price= bookingDetails.amount;
    this.bookedTime= bookingDetails.time;
    this.bookedDate= bookingDetails.date;
    this.currency=bookingDetails.currency;
    this.serviceData = bookingDetails.servicesDetails
    console.log('>>>booking data', this.serviceDetail, this.bookedDate);
    
  }

  cancelBooking(){
    this.http.get(environment.mainURL + "user/cancel-booking?booking_id=" +this.bookingid + "&access-token=" +this.token, {}, {})
    .then(result => {
      let response = JSON.parse(result.data);
      this.loader.show();
      if (result['status'] == 200) {
        this.loader.hide();
        console.log('>>>>response', response);
        this.alert.show('Booking Cancelled');
        this.router.navigate(['/main']);
      } else {
        this.loader.hide();
        this.alert.show('something wentt wrong');
      }
    })
     .catch(error => { 
      console.log(error); 
    });
  }

  getDirections(){
    this.router.navigate(['/googlemap'], {queryParams: {salonLocation: JSON.stringify(this.salonbooking)}});
  }

}
