import { Component, OnInit } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
// import { environment } from "src/environments/environment.prod";
import { Storage } from '@ionic/storage';
@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.page.html',
  styleUrls: ['./search-result.page.scss'],
})
export class SearchResultPage implements OnInit {
  listsNearBy: any;
  nearBysalonsList: any;
  nearByCity: any;
  userCity: any;
  userLatLong: any;
  lat: any;
  long: any;

  constructor(
    private http: HTTP,
    private router: Router,
    private route: ActivatedRoute,
    public storage: Storage
    ) {
    this.storage.get('loginInfo').then((val)=>{
      console.log('>>>user data logininfo', val);
      this.userCity = val.city;
      console.log('>>>user data', this.userCity);
    })  
    this.route.queryParams.subscribe(data => {
      console.log('queryParam data>>', data);
      this.nearBysalonsList = JSON.parse(data.nearbysalon);
      console.log('salonDescriptionlist data>>>>',this.nearBysalonsList);
    });
   }

   goBack() {
    this.router.navigate(['/main']);
  }

  ngOnInit() {
  }

  goToFilter(nearBysalonsList){
    this.router.navigate(['/filter'], { queryParams: {filterSalon: JSON.stringify(nearBysalonsList)}})
  }
  goToService(salonList){
    this.router.navigate(['/salon-detail'], { queryParams: {salonDetails: JSON.stringify(salonList)}})
  }
}
