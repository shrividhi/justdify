import { Component, OnInit } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { environment } from 'src/environments/environment';
// import { environment } from "src/environments/environment.prod";
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from '../shared/services/alert.service';
@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.page.html',
  styleUrls: ['./terms-and-conditions.page.scss'],
})
export class TermsAndConditionsPage implements OnInit {
  terms: any;
  desc: any;

  constructor(
    private http: HTTP,
    private route: ActivatedRoute,
    private router: Router,
    public alert: AlertService
  ) {
      this.getTermsCondition(); 
  }

  ngOnInit() {}

  goBack(){
    this.router.navigate(['/main']);
  }

  getTermsCondition(){
    this.http.get(environment.mainURL + "user/page?type_id=2", {}, {'Content-type': 'application/json'})
    .then(result => {
      let response = JSON.parse(result.data);
      if (result['status'] == 200) {
        console.log('>>>>response', response.detail);
        this.desc = response['detail'].description;
        this.terms = this.desc.replace(/<\/?[^>]+>/gi, "");
        console.log('>>>>this.terms', this.terms.replace(/<\/?[^>]+>/gi, ""));
      } else {
        this.alert.show('something wentt wrong');
      }
    })
     .catch(error => { 
      console.log(error); 
    });
  }
  

}
