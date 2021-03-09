import { Component } from '@angular/core';
import { Device } from '@ionic-native/device/ngx';
import { Platform,NavController} from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { environment } from "../environments/environment";
// import { environment } from "../environments/environment.prod";
import { Storage } from '@ionic/storage';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import { isNull } from 'util';
import { HTTP } from '@ionic-native/http/ngx';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { LoaderService } from './shared/services/loader.service';
declare var google: any;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public env: any;
  public appPages = [
    {
      title: 'About Us',
      url: '/aboutUs',
    },
    {
      title: 'Gents Service',
      url: 'search-result'
    },
    {
      title: ' Ladies Service',
      url: '/search-result'
    },
    {
      title: 'Book an Appointment',
      url: '/salon-detail'
    },
    {
      title: 'Partner',
      url: ''
    },
    {
      title: 'Contact Us',
      url: '/contactUs'
    },
    {
      title: 'Privacy Policy',
      url: '/privacy'
    },
    {
      title: 'Terms and Conditions',
      url: '/terms'
    }
  ]; 
  loginInfo: any;
  profileImage: any;
  profileName: any;
  token: string;
  uniqueID: any;
  UserImage: any;
  currentLatLong: any = [];
  constructor(
    public navCtrl: NavController,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    public storage: Storage,
    private device: Device,
    public http: HTTP,
    public loader: LoaderService,
    public geolocation: Geolocation,
    private fb: Facebook,
    private googlePlus: GooglePlus,
    
  ) {
   this.env = environment;
    this.initializeApp();
    
  }
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      if (this.device.platform === 'browser') {
        console.log('Device UUID is not supported on browser platform');
      } else {
        this.uniqueID = this.device.uuid;
        console.log('Device UUID is: ' + this.device.uuid);
      }
      this.storage.get('loginStatus').then((val) => {
        if (val != null && val != false && val != undefined) {
          this.env.loginState = true;
          this.router.navigate(['/main']);
          this.storage.get('loginInfo').then((value)=>{
            this.loginInfo = value;
            console.log('>>>login at component', this.loginInfo);
            this.profileName= this.loginInfo.full_name;
            this.token = this.loginInfo.access_token;
              this.UserImage = this.loginInfo.profile_file;
            console.log('Login info 105', value, this.token);
          })
        } else {
          this.env.loginState = false;
        }
      });
      this.geolocation.getCurrentPosition().then((position) => {
        this.ionViewDidEnter(position.coords);
      });
    });
  }
  ionViewDidEnter(position){
    if(!isNull(position)) {
      var pointA = new google.maps.LatLng(position.latitude, position.longitude);
      this.currentLatLong.push(position.latitude);
      this.currentLatLong.push(position.longitude);
      this.storage.set('currentLatLong', this.currentLatLong );
      console.log('>>>>>>cureent lat long array', this.currentLatLong);      
    }
  }

  logOut(){
    this.loader.show();
    console.log('>>>this.token', this.token);
    this.http.get(environment.mainURL + 'user/logout?access_token=' +this.token, {}, {})
      .then(result => {
        this.loader.hide();

        this.storage.get('loginType').then((val) => {
          console.log('loginType : ', val);
          if (val == 'google') {
            this.googlePlus.logout();
            // this.storage.clear()
            this.storage.remove('loginStatus');
            this.storage.remove('loginInfo');
            this.storage.remove('loginType');
            console.log('logout google Done');
          } else if (val == 'fb') {
            console.log('logout fb Done');
            this.fb.logout();
            // this.storage.clear()
            this.storage.remove('loginStatus');
            this.storage.remove('loginInfo');
            this.storage.remove('loginType');
          } else {
            console.log('Manuall logout');
            //this.storage.clear()
            this.storage.remove('loginStatus');
            this.storage.remove('loginInfo');
            this.storage.remove('loginType');
           
          }
          this.storage.get('loginStatus').then((val) => {
            console.log(' Manuall loginStatus after logout get storage', val)
          });
          this.storage.get('loginInfo').then((val) => {
            console.log(' Manuall loginInfo after logout get storage', val)
          });
          this.storage.get('loginType').then((val) => {
            console.log(' Manuall loginType after logout get storage', val)
          });
        });
            this.storage.remove('loginStatus');
            this.storage.remove('loginInfo');
            this.storage.remove('this.token');
            this.env.loginState = false;
            this.router.navigate(['/login']);
        })
        .catch(error => { 
          console.log(error); 
        }); 
  }

  goToProfile(){
    this.router.navigate(['/profile']);
  }
}
