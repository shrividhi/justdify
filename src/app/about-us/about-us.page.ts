import { Component, OnInit } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { environment } from 'src/environments/environment';
// import { environment } from "src/environments/environment.prod";
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from '../shared/services/alert.service';
@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.page.html',
  styleUrls: ['./about-us.page.scss'],
})
export class AboutUsPage implements OnInit {
  about: any;

  constructor(
    private http: HTTP,
    private route: ActivatedRoute,
    private router: Router,
    public alert: AlertService
  ) {
    this.getAboutUs();
   }

  ngOnInit() {
  }

  goBack(){
    this.router.navigate(['/main']);
  }
  getAboutUs(){
    this.http.get(environment.mainURL + "user/page?type_id=4", {}, {'Content-type': 'application/json'})
    .then(result => {
      let response = JSON.parse(result.data);
      if (result['status'] == 200) {
        console.log('>>>>response', response);
        this.about = response['detail'].description;
        console.log('>>>>this.terms', this.about);
      } else {
        this.alert.show('something wentt wrong');
      }
    })
     .catch(error => { 
      console.log(error); 
    });
  }

}
