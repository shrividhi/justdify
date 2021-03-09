import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { Router,ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
// import { environment } from "src/environments/environment.prod";
import { Storage } from '@ionic/storage';
import { IonicRatingModule } from 'ionic4-rating';
import { AlertService } from '../shared/services/alert.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.page.html',
  styleUrls: ['./filter.page.scss'],
})
export class FilterPage implements OnInit {
  services: any;
  sortby: any;
  position;
  resetFilter: boolean = false;
  selectedArray: any = [];
  token: any;
  allServices: any;
  selectedItems: any = [];
  rating: any = [];
  selectedRadioGroup:any;
  radio_list = [
     {
      id: 1,
      name: 'radio_list',
      value: 1,
      text: 'Ladies',
      disabled: false,
      checked: false,
    },
    {
      id: 2,
      name: 'radio_list',
      value: 2,
      text: 'Both',
      disabled: false,
      checked: true,
    },
     {
      id: 3,
      name: 'radio_list',
      value: 3,
      text: 'Men',
      disabled: false,
      checked: false,
    },
  ];
  mainObject: any[];
  filterData: any;
  filtersalons: any;
  constructor(        
    private http: HTTP,
    private router: Router,
    private route: ActivatedRoute,
    public storage: Storage,
    public alert:AlertService
  ) {
     this.route.queryParams.subscribe(data => {
      console.log('queryParam data for filters>>', data);
      this.filtersalons = JSON.parse(data.filterSalon);
      console.log('queryParam data query param filter>>', this.filtersalons);
    });
    this.storage.get('loginInfo').then((val)=>{
      this.token = val.access_token;
      this.getAllServices();
      console.log('>>>>val services ', this.token);
    });
    
   }

  ngOnInit() {
  }

  getAllServices(){
    console.log('>>>inside services');
    
    this.http.get(environment.mainURL + "user/all-services?access_token=" + this.token, {}, {})
    .then(result => {
      let response = JSON.parse(result.data);
        if (result['status'] == 200) {
         console.log(">>>> inside nearby", response);
         this.allServices = response.details;
         let services = [];
         let indexServices=[];
         this.allServices.forEach(function(item) {
            services.push(item.subServiceName);
            console.log('>>>item here54',services);
          });
          this.mainObject = services;
          console.log('>>>all services97', JSON.stringify(this.mainObject));
        } 
        else {
          this.alert.show('Something went wrong');
        };
     })
    .catch(error => { 
      console.log(error); 
    });
  }

  keys(obj){
    return Object.keys(obj);
    console.log('>>object keys', Object);
  } 

  rangeChanged(event){
    this.position = event;
      console.log("Position2: ", this.position);
  }

  radioGroupChange(event) {
    console.log("radioGroupChange",event.detail.value);
    this.selectedRadioGroup = parseInt(event.detail.value);
  }

  onRateChange(event) {
    this.rating = event;
    console.log('Your rate:', event);
  }
  
  checkValue(event, value) {
    console.log("event detail key: ",value);
    console.log("checkbox check value: " + event.target.checked);
    // this.selectedItems = new Array();
    if(event.target.checked) {
      this.selectedItems.push(parseInt(event.detail.value));
      console.log('>>>this sselected items here', this.selectedItems);
    }
    else {
      var index = this.selectedItems.indexOf(parseInt(event.detail.value));
      if (index > -1) {
        this.selectedItems.splice(index, 1);
        console.log('??selectedArray splice', this.selectedItems);
      }
    }
    console.log('!!!!final array', this.selectedItems);
  }

  orderSelect(event, key) {
    console.log("checkbox : " + event.target.checked);
    if (event.target.checked) {
        this.selectedArray.push(parseInt(key));
        console.log('selectedArray push', this.selectedArray);
    }
    else {
        var index = this.selectedArray.indexOf(parseInt(key));
        if (index > -1) {
          this.selectedArray.splice(index, 1);
          console.log('??selectedArray splice', this.selectedArray);
        }
    }
    console.log('>>>Selecterd array here', typeof this.selectedArray);
       
  }

  applyFilter() {
    this.resetFilter = false;
   var param = {
        'User[For]': this.selectedRadioGroup,
        'User[avg_rating]': this.rating,
        'User[services]': this.selectedArray,
        'User[distance]': this.position,
        'User[time]':''
    }
    console.log('>>>reuest params', JSON.stringify(param));
    this.http.post(environment.mainURL + "user/search-filter?access_token=" +this.token, param, {'Content-type': 'application/json'})
      .then(result => {
        let response = JSON.parse(result.data);
          if (result['status'] == 200) {
            console.log('>>>rexponse log 181', response);
           this.filterData= response.list;
           console.log('>>resonse filterdtaa', this.filterData);
           this.router.navigate(['/search-result'], { queryParams: {nearbysalon: JSON.stringify(this.filterData)}});
           console.log('this.selectedArray!!!!!!!!!!!', this.filterData);
          } 
          else {
            this.alert.show('Something went wrong');
          };
       })
      .catch(error => { 
        console.log(error); 
      });
  }
 
}
