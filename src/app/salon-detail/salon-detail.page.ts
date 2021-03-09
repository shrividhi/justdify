import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HTTP } from '@ionic-native/http/ngx';
import { environment } from 'src/environments/environment';
// import { environment } from "src/environments/environment.prod";
import { Storage } from '@ionic/storage';
import { Device } from '@ionic-native/device/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { AlertService } from '../shared/services/alert.service';
@Component({
  selector: 'app-salon-detail',
  templateUrl: './salon-detail.page.html',
  styleUrls: ['./salon-detail.page.scss'],
})
export class SalonDetailPage implements OnInit {
  salonDescription: any;
  salonId: any;
  salonDetailPage: any;
  specialists: any;
  salonImages: any;
  saloondesc: any;
  salonWebsite: any;
  token: any;
  facilities: any;
  servicesList: any;
  facilityItem: any;
  salonName: any;
  userPic: any;
  salonReviews: any;
  reviews: any[];
  reviewDate: any;
  userToken: any;
  reviewerImage: any[];
  timeslot: any;
  icon: any[];
  constructor(
    private router: Router,
    private http: HTTP,
    private route: ActivatedRoute,
    private storage: Storage,
    private device: Device,
    private iab: InAppBrowser,
    private callNumber: CallNumber,
    public alert: AlertService,
    private socialSharing: SocialSharing  ) {
      this.route.queryParams.subscribe(data => {
        this.salonDescription = JSON.parse(data.salonDetails);
        console.log('salonDescription>>>>',this.salonDescription);
        this.salonId= this.salonDescription.id;
        this.salonName= this.salonDescription.full_name;
        this.token = this.salonDescription.access_token;
        this.getSalonDetail();
      });
      this.storage.get('loginInfo').then((value)=>{
        this.userPic = value.profile_file;
        this.userToken = value.access_token;
      });
      
     }

  ngOnInit() {
  }

  goBack() {
    this.router.navigate(['/main']);
  }

  getSalonDetail(){
    let param ={
      'User[current_lat]': this.salonDescription.latitude,
      'User[current_long]': this.salonDescription.longitude,
      }
      console.log('>>>>salond psrams',JSON.stringify(param));
      
    this.http.post(environment.mainURL + "user/view-saloon?id="+ this.salonId, param, {'Content-type': 'application/json'})
      .then(result => {
        let response = JSON.parse(result.data);
          if (result['status'] == 200) {
            console.log('>>response salon detail', response);
             this.salonDetailPage = response.detail;
             this.salonReviews = response.detail.review;
             this.salonImages = response.detail.saloon_images;
             this.saloondesc = response.detail.saloon_description;
             this.timeslot = response.detail.time_slot;
             this.storage.set('salonDetail', this.salonDetailPage);
             let reviews = [];
             let reviewsTime = [];
             let date=[];
             let image= [];
             this.salonReviews.forEach(function(item) {
              reviews.push(item);
              date.push(item.updated_on);
              image.push(item.image);
            });
            this.reviews = reviews;
            this.reviewDate = date;
            this.reviewerImage = image;
             this.salonSpecialistList();
          } 
          else {
            this.alert.show('Something went wrong');
          };
       })
      .catch(error => { 
        console.log(error); 
      });
  }

  salonSpecialistList(){
    this.http.get(environment.mainURL + "user/staff-details?saloon_id=" + this.salonId, {}, {'Content-type': 'application/json'})
    .then(result => {
      let response = JSON.parse(result.data);
      if (result['status'] == 200) {
        console.log('>>>>response', response);
        this.specialists = response.list;
        console.log('>>specialists', this.specialists);
      } else {
        this.alert.show('something wentt wrong');
      }
    })
     .catch(error => { 
      console.log(error); 
    });
  }

  services(){
    this.http.get(environment.mainURL + "user/services?saloon_id="+ this.salonId, {}, {'Content-type': 'application/json'})
    .then(result => {
      let response = JSON.parse(result.data);
      if (result['status'] == 200) {
        console.log('>>>>response serviceList string',response);
        this.servicesList = response.list;
      } else {
        console.log('something wentt wrong');
      }
    })
     .catch(error => { 
      console.log(error); 
    });
  }

  goToService(salonDescription){
    this.router.navigate(['/select-services'], { queryParams: {salonService: JSON.stringify(salonDescription)}});
  }

  getFacilities(){
    let facilityArr = [];
    this.http.get(environment.mainURL + "user/get-facility?saloon_id="+ this.salonId +"&access-token=" + this.token , {}, {'Content-type': 'application/json'})
    .then(result => {
      let response = JSON.parse(result.data);
      if (result['status'] == 200) {
        console.log('>>>>response about', response);
        this.facilities = response.list;
        response['list'].forEach(function(item) {
          facilityArr.push(item);
      });
       this.facilityItem = facilityArr;
       console.log('>>>>facility array here', this.facilityItem);
       
      } else {
        this.alert.show('something wentt wrong');
      }
    })
     .catch(error => { 
      console.log(error); 
    });
  }
  
  openWebsite(){
    console.log('>>>>inappbrowser', this.salonDescription.saloon_link);
    window.open(this.salonDescription.saloon_link, '_system');
    window.addEventListener("load",function() {
      console.log('>>inside window.open');      
      setTimeout(function(){
         window.scrollTo(0, 1);
      }, 0);
    });
  }

  salonDirection(){
    this.router.navigate(['/googlemap'], {queryParams: {salonLocation: JSON.stringify(this.salonDescription)}});
  }

  callSalon(){
    this.callNumber.callNumber(this.salonDescription.contact_no, true)
  .then(res => console.log('Launched dialer!', res))
  .catch(err => console.log('Error launching dialer', err));
  }

  shareSalon(){
    
    this.http.get(environment.mainURL + 'user/share-link?saloon_id='+ this.salonId, {}, {'Content-type': 'application/json'})
      .then(result => {
        let response = JSON.parse(result.data);
        console.log('response data : ', response);
        console.log('share data : ' + JSON.stringify(result));
        if (result['status'] == 200) {
          var options = {
            message:  "Check salon details"+ response.details.saloon_name, // not supported on some apps (Facebook, Instagram)
            subject: 'Check Justdify Saloon Link', // fi. for email
            files: ['', ''], // an array of filenames either locally or remotely
            url: response.details.url,
            chooserTitle: 'Pick an app'};

            var onSuccess = function(result) {
              console.log("Shared to app: " + result.app); // On Android result.app since plugin version 5.4.0 this is no longer empty. On iOS it's empty when sharing is cancelled (result.completed=false)
           };
           
           var onError = function(msg) {
             console.log("Sharing failed with message: " + msg);
           };
           window['plugins'].socialsharing.shareWithOptions(options, onSuccess, onError);
        }else {
          this.alert.show('something wentt wrong');
        }
      })
      .catch(error => {
        console.log('error data : ' + JSON.stringify(error));

      }); 
  }

  favoriteSaloon(){
    this.http.get(environment.mainURL + "user/favourite-unfavourite?saloon_id=" +this.salonId + "&access_token=" +this.token, {}, {'Content-type': 'application/json'})
      .then(result => {
        let response = JSON.parse(result.data);
        console.log('>>>>Response favorite', response);
          if (result['status'] == 200) {
            if(response.favourite_state === 1)
            {
               console.log('favorite salon');
               this.alert.show('Salon added to favorites');
            }
            else
            {
              console.log('Problem adding to favorites');
            }
          } 
          else {
            this.alert.show('Something went wrong');
          };
       })
      .catch(error => { 
        console.log(error); 
      });
  }

  postReview(review){
    console.log('>>>Entered salon detail page');
    let param ={
      'review': review
      }
    this.http.post(environment.mainURL + "user/review?access_token="+ this.userToken + "&saloon_id=" + this.salonId, param, {'Content-type': 'application/json'})
      .then(result => {
        let response = JSON.parse(result.data);
          if (result['status'] == 200) {
            console.log('>>response salon detail', response);
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
