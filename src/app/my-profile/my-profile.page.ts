import { Component, OnInit } from '@angular/core';

import { Storage } from '@ionic/storage';
import { Router, ActivatedRoute } from '@angular/router';
import { HTTP } from '@ionic-native/http/ngx';
import { environment } from 'src/environments/environment';
// import { environment } from "src/environments/environment.prod";
@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.page.html',
  styleUrls: ['./my-profile.page.scss'],
})
export class MyProfilePage implements OnInit {
  public env: any;
  userName: any;
  profileImage: any;
  UserImage: any;
  constructor(
    private router: Router,
    private http: HTTP,
    private route: ActivatedRoute,
    private storage: Storage
  ) {
    this.env = environment;
    this.storage.get('loginInfo').then((val)=>{
      this.userName = val.full_name;
      this.UserImage = val.profile_file;
      console.log('login info data', val);
      console.log('>>>user info',this.UserImage)
    });
    console.log('>>>user info',this.UserImage);
   }

  ngOnInit() {
  }

  goBack() {
    this.router.navigate(['/main']);
  }
  goToProfile(){
    this.router.navigate(['/profile']);
  }
  logout(){
    this.http.get(environment.mainURL + 'user/logout', {}, {})
      .then(result => {
            console.log('Manuall logout', result);
            this.storage.remove('loginStatus');
            this.storage.remove('loginInfo');
            this.storage.get('loginStatus').then((val) => {
              console.log(' Manuall loginStatus after logout get storage', val)
            });
            this.storage.get('loginInfo').then((val) => {
              console.log(' Manuall loginInfo after logout get storage', val)
            });
        });
        this.http.clearCookies();
        this.env.loginState = false;
        this.router.navigate(['/login']);
  }
}
