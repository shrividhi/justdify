import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HTTP } from '@ionic-native/http/ngx';
import { environment } from 'src/environments/environment';
// import { environment } from "src/environments/environment.prod";
import { Storage } from '@ionic/storage';
import { AlertService } from '../shared/services/alert.service';

@Component({
  selector: 'app-my-reviews',
  templateUrl: './my-reviews.page.html',
  styleUrls: ['./my-reviews.page.scss'],
})
export class MyReviewsPage implements OnInit {
  reviews: any;
  UserInfo: any;
  token: any;
  reviewLists: any;

  constructor(
    private router: Router,
    private http: HTTP,
    private storage: Storage,
    public alert: AlertService
  ) {  
   }

  ngOnInit() {
  }
  ionViewDidEnter(){
    this.storage.get('loginInfo').then((val) => {
      this.UserInfo = val;
      console.log('>>>user info',this.UserInfo)
    if (val != null && val != undefined) {
        this.token = this.UserInfo.access_token;
        console.log('>>>>>access token here',val.access_token);
     }
     this.getReviews();
    });
  }

  goBack(){
    this.router.navigate(['/my-profile']);
  }

  getReviews(){
    console.log('>>>>this.token here,', this.token);
    this.http.get(environment.mainURL + "user/my-review?access_token=" +this.token, {}, {'Content-type': 'application/json'})
    .then(result => {
      let response = JSON.parse(result.data);
      if (result['status'] == 200) {
        console.log(">>>> inside review", response);
        this.reviewLists = response['list'];
        console.log(">>>> reviewlist", this.reviewLists);
      } else {
        this.alert.show('something wentt wrong');
      }
    })
     .catch(error => { 
      console.log(error); 
    });
  }
}
