import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HTTP } from '@ionic-native/http/ngx';
import { environment } from 'src/environments/environment';
// import { environment } from "src/environments/environment.prod";
import { Storage } from '@ionic/storage';
import { AlertService } from '../shared/services/alert.service';

@Component({
  selector: 'app-my-appointment',
  templateUrl: './my-appointment.page.html',
  styleUrls: ['./my-appointment.page.scss'],
})
export class MyAppointmentPage implements OnInit {
  UserInfo: any;
  token: any;
  longitude: any;
  latitude: any;
  appointmentLists: any;
  userLat: any;
  userLong: any;
  userLatLong: any;

  constructor(
    private router: Router,
    private http: HTTP,
    private route: ActivatedRoute,
    private storage: Storage,
    public alert: AlertService ) { 
      this.storage.get('loginInfo').then((val) => {
        console.log('Login Info : ' + JSON.stringify(val));
        this.UserInfo = val;
        console.log('>>>user info',this.UserInfo)
        if (val != null && val != undefined) {
          this.token = this.UserInfo.access_token;
          console.log('>>>>Aceess token', this.token);
        }
      });  
    }

  ngOnInit() {
  }
 
  ionViewDidEnter(){
   
    this.storage.get('currentLatLong').then((value)=>
    {
      this.userLatLong = value;
      this.getAppointment(this.userLatLong);
      console.log('>>>this.userlatlong', this.userLatLong);
      
    });
  }
  goBack(){
    this.router.navigate(['/my-profile']);
  }

  getAppointment(latLong){
    console.log('>>>this.token ', this.token, latLong);
    this.userLat = this.userLatLong[0];
    this.userLong = this.userLatLong[1];
    let param ={
      'User[current_lat]': this.userLat,
      'User[current_long]': this.userLong,
      }
    console.log('type of param here in appointment ', typeof param, param);
    this.http.post(environment.mainURL + "user/my-booking?booking_state=1&access_token=" +this.token, param, {'Content-type': 'application/json'})
      .then(result => {
        console.log('my booking here :', result);
        let response = JSON.parse(result.data);
        console.log('my appointments' + JSON.stringify(result));
          if (result['status'] == 200) {
            console.log(">>>> inside nearby", response);
            this.appointmentLists = response['list'];
            console.log(">>>> this.salons", this.appointmentLists);
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
