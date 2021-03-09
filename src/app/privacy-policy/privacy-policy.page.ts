import { Component, OnInit } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { environment } from 'src/environments/environment';
// import { environment } from "src/environments/environment.prod";
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from '../shared/services/alert.service';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.page.html',
  styleUrls: ['./privacy-policy.page.scss'],
})
export class PrivacyPolicyPage implements OnInit {
  policy: any;

  constructor(
    private http: HTTP,
    private route: ActivatedRoute,
    private router: Router,
    public alert: AlertService
  ) {
    this.getPrivacyPolicy();
   }

  ngOnInit() {
  }

  getPrivacyPolicy(){
    this.http.get(environment.mainURL + "user/page?type_id=1", {}, {'Content-type': 'application/json'})
    .then(result => {
      let response = JSON.parse(result.data);
      if (result['status'] == 200) {
        console.log('>>>>response', response);
        this.policy = response['detail'].description;
        console.log('>>>>this.terms', this.policy);
      } else {
        this.alert.show('something wentt wrong');
      }
    })
     .catch(error => { 
      console.log(error); 
    });
  }
  

}
