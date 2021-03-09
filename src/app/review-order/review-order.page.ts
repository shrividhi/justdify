import { Component, OnInit } from '@angular/core';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal/ngx';
import { Router, ActivatedRoute } from '@angular/router';
import { HTTP } from '@ionic-native/http/ngx';
import { Storage } from '@ionic/storage';
import { Stripe } from '@ionic-native/stripe/ngx';
import { environment } from 'src/environments/environment';
// import { environment } from "src/environments/environment.prod";
import { HttpParams } from '@angular/common/http';
import { LoaderService } from "src/app/shared/services/loader.service";
import { AlertService } from '../shared/services/alert.service';
@Component({
  selector: 'app-review-order',
  templateUrl: './review-order.page.html',
  styleUrls: ['./review-order.page.scss'],
})
export class ReviewOrderPage implements OnInit {
  currency: 'EUR';
  currencyIcon: '€';
  paymentAmount: string;
  saloonaddress: any;
  subservice: any;
  service: any;
  selectedDate: any;
  saloonname: any;
  subserviceDuration: any;
  subservicePrice: any;
  saloonId: any;
  total: any;
  staffid: any;
  user: any;
  profilePicture: any;
  customerService: any[];
  salonDetails: any;
  object: any;
  selectedServices: any;
  date: any;
  time: any;
  serviceDetails: any[];
  token: any;
  bookingId: any;
  loginstatus: any;
  // salonContainer: any=[];
  constructor(private payPal: PayPal,
    private router: Router,
    private route: ActivatedRoute,
    private http: HTTP,
    private stripe: Stripe,
    private storage: Storage,
    public loader: LoaderService, 
    public alert: AlertService) { 
    this.route.queryParams.subscribe(data => {
      this.time = JSON.parse(data.timeSeletion);
      this.storage.set('timeSelected', this.time);
    });
    
    this.storage.get('loginStatus').then((val) => {
      this.loginstatus = val;
      console.log('>>login status', val);
    });

    this.storage.get('loginInfo').then((val)=>{
      this.user = val.id;
      this.token = val.access_token;
    });
    this.storage.get('salonDetail').then((val)=>{
      this.salonDetails= val;
      this.saloonId = val.id;
      this.saloonaddress = val.address;
      this.saloonname = val.saloon_name;
      this.profilePicture= val.profile_file;
    });
    this.storage.get('selectedDate').then((val)=>{
      this.date = val;
      console.log('>>>Date factor', this.date)
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
 
  goBack() {
    this.router.navigate(['/select-time']);
  }
  
  ngOnInit() {
  }

  confirm(){
    if(this.loginstatus === true){
      let param = {
        'services': this.customerService ,
        'saloon_id':  this.saloonId,
        'staff_id':  this.staffid,
        'customer_id':  this.user,
        'date': this.date ,
        'time': this.time ,
        'amount':  this.total,
        'currency':  'EUR',
        'servicesDetails': this.serviceDetails
        }
        console.log('>>>>rsquet param 109', param);
        this.storage.set('confirmBookData', param);
        this.http.post(environment.mainURL + "user/place-booking?&access_token=" +this.token, param, {'Content-type': 'application/json'})
          .then(result => {
            this.loader.show();
            console.log('>>>response data:106', result.data);
              if (result['status'] == 200) {
                let response = JSON.parse(result.data);
                console.log('>>>>result.data result',response );
                this.loader.hide();
                this.bookingId= response.bookingId;
                console.log('>>>booking id',this.bookingId );
                this.router.navigate(['/confirmation'], { queryParams: {bookingid: JSON.stringify(this.bookingId)}});
                this.alert.show('Booking confirmed');
              } 
              else {
                this.alert.show('Booking not confirmed');
              };
          })
          .catch(error => { 
            console.log(error); 
            this.alert.show('Something went wrong');
          });
    }
    else{
      this.alert.show('Please login to continue');
      this.router.navigate(['/login']);
    }
   
      
  }

  payWithPaypal() {
    if(this.loginstatus === true){
        this.paymentAmount = this.total;
        console.log("Pay ????");
        this.payPal.init({
          PayPalEnvironmentProduction: 'YOUR_PRODUCTION_CLIENT_ID',
          PayPalEnvironmentSandbox: 'AW0E3heCAu014snqDZqCTzZrc6X0fe2fGdoZcZUEKiGvGYUa2jV-Xkwyd_rdMTmU5N6C8RTcfapZa_3M'
        }).then(() => {
          // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
          this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({
            // Only needed if you get an "Internal Service Error" after PayPal login!
            //payPalShippingAddressOption: 2 // PayPalShippingAddressOptionPayPal
          })).then(() => {
            console.log('paypal started');
            let payment = new PayPalPayment(this.paymentAmount, 'EUR', 'Description', 'sale');
            this.payPal.renderSinglePaymentUI(payment).then((res) => {
              console.log('paypal res', res);
            let paypalResponse = res;
            this.confirmPayment(paypalResponse);
              console.log('>>>process going onnnnn');
              this.loader.show();
            }, (err) => {
              console.log('Error or render dialog closed without being successful', err);
            });
          }, () => {
            console.log('Error in configuration');
          });
        }, () => {
          this.alert.show('Something went wrong');
          console.log('Error in initialization, maybe PayPal isnt supported or something else');
        });
    }
    else{
      this.alert.show('Please login to continue');
      this.router.navigate(['/login']);
    } 
  }

  confirmPayment(paypal){
    console.log('paypal confirmation here', paypal);
     let param ={
            'services': this.customerService ,
            'staff_id':  this.staffid,
            'saloon_id':  this.saloonId,
            'customer_id':  this.user,
            'date': this.date ,
            'time': this.time ,
            'amount':  this.total,
            'currency':  'EUR',
            'paypaldetails': paypal,
            'servicesDetails': this.serviceDetails

            }
          
          this.storage.set('confirmBookData', param);
          console.log('>>>paypal params sent', JSON.stringify(param));
          this.http.post(environment.mainURL + "user/pay-pal", param, {'Content-type': 'application/json'})
          .then(result => {
            this.loader.show();
            console.log('>>>response data', result.data);
              if (result['status'] == 200) {
                let response = JSON.parse(result.data);
                console.log('>>>rsponse here', response);
                this.alert.show('Payment successful');
                this.bookingId= response.bookingId;
                console.log('>>>booking id',this.bookingId );
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
            this.alert.show('Wrong Credentials');
          });
  }

  payByCard(){
    if(this.loginstatus === true){
      this.router.navigate(['/card-details']);
    }
    else{
      this.alert.show('Please login to continue');
      this.router.navigate(['/login']);
    }
  }


}
