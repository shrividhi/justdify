import { Component, OnInit } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { Router,ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
// import { environment } from "src/environments/environment.prod";
import { FormGroup, FormArray, FormControl, FormBuilder } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { AlertService } from '../shared/services/alert.service';
@Component({
  selector: 'app-select-services',
  templateUrl: './select-services.page.html',
  styleUrls: ['./select-services.page.scss'],
})
export class SelectServicesPage implements OnInit {
  services: any;
  serviceList: any;
  salonId: any;
  providerSubServices: any;
  item: any;
  subservices: any;
  selectedServices = [];
  total: any;
  price= [];
  salonContainer: any =[];
  constructor( 
    private http: HTTP,
    private router: Router,
    private route: ActivatedRoute,
    public fb: FormBuilder,
    public storage: Storage,
    public alert: AlertService
  ) { 
    this.route.queryParams.subscribe(data => {
      this.serviceList = JSON.parse(data.salonService);
      this.salonId = this.serviceList.id;
      this.getServices();
    });
  }
  ngOnInit() {
  }
  goBack() {
    this.router.navigate(['/salon-detail']);
  }
  getServices(){
    this.http.get(environment.mainURL + "user/services?saloon_id="+ this.salonId, {}, {'Content-type': 'application/json'})
    .then(result => {
      let response = JSON.parse(result.data);
      if (result['status'] == 200) {
          this.services = response.list;
          console.log('>>>>response this.services',this.services);
          this.storage.set('services', this.services);
      } else {
        this.alert.show('something wentt wrong');
      }
    })
     .catch(error => { 
      console.log(error); 
    });
  }

  getSubServices(serviceId){
    let param ={
      'User[current_lat]': this.serviceList.latitude,
      'User[current_long]': this.serviceList.longitude,
      }
    this.http.post(environment.mainURL + "user/get-sub-services?saloon_id=" + this.salonId + "&service_id=" + serviceId , param, {'Content-type': 'application/json'})
      .then(result => {
        let response = JSON.parse(result.data);
          if (result['status'] == 200) {
            console.log('>>>>>subservice list here', response);
            this.subservices = response.list;
            this.storage.set('subServices', this.subservices);
          } 
          else {
            this.alert.show('Something went wrong');
          };
       })
      .catch(error => { 
        console.log(error); 
      });
  }


  orderSelect(event, itemKey) {
    if (event.target.checked) {
      if(this.selectedServices.includes(itemKey) == false){
        this.selectedServices.push(itemKey);
        this.price.push(itemKey['price']);
        this.storage.set('selectedServices', this.selectedServices);
        // this.salonContainer.push({"services" : this.selectedServices});
        // this.storage.set('salon-container', this.salonContainer);
      }
    }
    else {
        var index = this.selectedServices.indexOf(itemKey);
        if (index > -1) {
          this.selectedServices.splice(index, 1);
          this.storage.set('selectedServices', this.selectedServices)
          this.price.splice(index, 1);
          console.log('??seerrvice splice', this.selectedServices, this.price);
        }
      }
    var price = this.price.map(Number);
    this.total = this.price.reduce(function(a, b){
      return parseInt(a) + parseInt(b);
    }, 0);
    console.log('>>>>>total',this.total);
    this.storage.set('price', this.total);
    // this.storage.get('salon-container').then((value)=>{
    //   console.log('>>>select-services page:118',value);
    //   this.salonContainer = value;
    //   this.salonContainer.push({"amount" : this.total});
    //   this.storage.set('salon-container', this.salonContainer);
    // });
   
  }
 
  goToStaff(serviceList){
    this.router.navigate(['/select-staff'], { queryParams: {selectedService: JSON.stringify(serviceList)}});
  }

  
}
