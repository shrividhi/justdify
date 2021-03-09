import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HTTP } from '@ionic-native/http/ngx';
import { environment } from 'src/environments/environment';
// import { environment } from "src/environments/environment.prod";
import { Storage } from '@ionic/storage';
import { AlertService } from '../shared/services/alert.service';

@Component({
  selector: 'app-favorite-salons',
  templateUrl: './favorite-salons.page.html',
  styleUrls: ['./favorite-salons.page.scss'],
})
export class FavoriteSalonsPage implements OnInit {
  favorite: any;
  UserInfo: any;
  token: any;
  favoriteLists: any;

  constructor(
    private router: Router,
    public alert: AlertService,
    private http: HTTP,  private storage: Storage){}

  ngOnInit() {
  }

  ionViewDidEnter(){
    this.storage.get('loginInfo').then((val) => {
      this.UserInfo = val;
      console.log('>>>user info',this.UserInfo)
     if (val != null && val != undefined) {
        this.token = this.UserInfo.access_token;
        console.log('>>>>>access token here', this.token);
      }
      this.favoriteSalon();
    });
  }

  favoriteSalon(){
    this.http.get(environment.mainURL + "user/favourite-list?access_token=" +this.token, {}, {'Content-type': 'application/json'})
    .then(result => {
      let response = JSON.parse(result.data);
      if (result['status'] == 200) {
         console.log(">>>> inside nearby", response);
        this.favoriteLists = response['list'];
        console.log(">>>> this.salons", this.favoriteLists);
      } else {
        this.alert.show('something wentt wrong');
      }
    })
     .catch(error => { 
      console.log(error); 
    });;
  }

  bookSaloon(favoriteList){
    this.router.navigate(['/salon-detail'], { queryParams: {salonDetails: JSON.stringify(favoriteList)}})
  }
  goToSalonDetail(){
    this.router.navigate(['/salon-detail'])
  }

  goBack(){
    this.router.navigate(['/my-profile']);
  }
}
