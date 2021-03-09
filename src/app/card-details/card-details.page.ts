import { Component, OnInit } from '@angular/core';

import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HTTP } from '@ionic-native/http/ngx';
import { Storage } from '@ionic/storage';
import { Stripe } from '@ionic-native/stripe/ngx';
import { environment } from 'src/environments/environment';
// import { environment } from "src/environments/environment.prod";
import { LoaderService } from '../shared/services/loader.service';
import { AlertService } from '../shared/services/alert.service';
@Component({
  selector: 'app-card-details',
  templateUrl: './card-details.page.html',
  styleUrls: ['./card-details.page.scss'],
})
export class CardDetailsPage implements OnInit {
  public cardForm: FormGroup;
  currency: 'EUR';
  currencyIcon: '€';
  paymentAmount: string;
  stripe_key = 'pk_test_Wv4ArsOZFSR3lNsiCrQmLMP200PTrwy0zB';
  cardDetails: any = {};
  finalBookingData: any;
  token: any;
  customerService: any[];
  user: any;
  saloonId: any;
  saloonaddress: any;
  saloonname: any;
  profilePicture: any;
  selectedDate: any;
  date: any;
  selectedServices: any;
  total: any;
  staffid: any;
  time: any;
  serviceDetails: any[];
  bookingId: any;
  constructor(private router: Router,
    public formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private http: HTTP,
    private stripe: Stripe,
    private storage: Storage,
    public loader: LoaderService,
    public alert: AlertService) {
      
      this.cardForm= formBuilder.group({
        name: ['', Validators.required],
        number: ['', Validators.required],
        month: ['', Validators.required],
        year: ['', Validators.required],
        cvv: ['', Validators.required],

      });
      this.storage.get('loginInfo').then((val)=>{
        this.token = val.access_token;
        this.user = val.id;
        console.log('this.user: ', this.token);
      });

      this.storage.get('timeSelected').then((value)=>{
        this.time= value;
      });
      this.storage.get('salonDetail').then((val)=>{
        this.saloonId = val.id;
        this.saloonaddress = val.address;
        this.saloonname = val.saloon_name;
        this.profilePicture= val.profile_file;
      });
      this.storage.get('selectedDate').then((val)=>{
        this.date = val;
      });
      this.storage.get('selectedServices').then((val) => {
        this.selectedServices = val;
        let services = [];
        let serviceData=[];
        this.selectedServices.forEach(function(item) {
          services.push(item.id);
        });
        this.selectedServices.forEach(function(item) {
          serviceData.push(item);
        });
        this.customerService = services;
        this.serviceDetails= serviceData;
      });

      this.storage.get('price').then((val) => {
        this.total = val;
      });
      this.storage.get('staffSelection').then((val) =>{
        this.staffid = val.id;
      });
     }

  ngOnInit() {
  }
  goBack() {
    this.router.navigate(['/main']);
  }
  // payWithStripe() {
  //   this.stripe.setPublishableKey(this.stripe_key);

  //   this.cardDetails = {
  //     number: this.cardForm.value.number,
  //     expMonth: this.cardForm.value.month,
  //     expYear: this.cardForm.value.year,
  //     cvc: this.cardForm.value.cvv
  //   }

  //   this.stripe.createCardToken(this.cardDetails)
  //     .then(token => {
  //       console.log(token.id);
  //       // this.makePayment(token.id);
  //     })
  //     .catch(error => console.error(error));
  // }

  makePayment() {
    console.log('>>>token here sent');
    let param ={
      'number': this.cardForm.value.number,
      'exp_month': this.cardForm.value.month,
      'exp_year': this.cardForm.value.year,
      'cvc': this.cardForm.value.cvv,
      'name': this.cardForm.value.name,
      'services': this.customerService,
      'staff_id':  this.staffid,
      'saloon_id':  this.saloonId,
      'customer_id':  this.user,
      'date': this.date ,
      'time': this.time ,
      'amount':  this.total,
      'currency':  'INR',
      'servicesDetails': this.serviceDetails
        }
    
    this.storage.set('confirmBookData', param);
    this.loader.show();
    this.http.post(environment.mainURL + "user/stripe-payment?access_token=" + this.token, param, {'Content-type': 'application/json'})
      .then(result => {
         if (result['status'] == 200) {
          let response = JSON.parse(result.data);
          console.log('>>>stripe payment res', result);
          this.bookingId= response.bookingId;
          console.log('>>>booking id',this.bookingId );
          this.alert.show('Payment successful');
          this.router.navigate(['/confirmation'], { queryParams: {bookingid: JSON.stringify(this.bookingId)}});
          this.loader.hide();
          this.alert.show('Booking confirmed');
          } 
          else {
            this.loader.hide();
            this.alert.show('Payment not successful');
          };
      })
      .catch(error => { 
        this.loader.hide();
        console.log(error); 
        this.alert.show('Invalid card details');
      });
  }
}
