import { Component, OnInit } from '@angular/core';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { HTTP } from '@ionic-native/http/ngx';
import { environment } from 'src/environments/environment';
// import { environment } from "src/environments/environment.prod";
import { Router, ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Device } from '@ionic-native/device/ngx';
import { Platform,NavController} from '@ionic/angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { LoaderService } from "src/app/shared/services/loader.service";
import { AlertService } from '../shared/services/alert.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
 public loginForm: FormGroup;
 public env: any;
 public loginData: any;
 public showPass = false;
 public type = 'password';
 public uniqueID: any;
  loadingController: any;
  token: any;
  responseDetail: any;
  constructor(
    public formBuilder: FormBuilder,
    private http: HTTP,
    private route: ActivatedRoute,
    private router: Router,
    private storage: Storage,
    private device: Device,
    private platform: Platform,
    private fb: Facebook,
    private googlePlus: GooglePlus,
    public loader: LoaderService,
    public alert: AlertService) { 
      this.env = environment;
      this.loginForm= formBuilder.group({
        email: ['', Validators.required],
        password: ['', Validators.required]
      });
      this.platform.ready().then(() => {
        if (this.device.platform === 'browser') {
          console.log('Device UUID is not supported on browser platform');
        } else {
          this.uniqueID = this.device.uuid;
          console.log('Device UUID is in login: ' + this.device.uuid);
        }
      });
    }

  ngOnInit() {
  }
  
  showPassword() {
    console.log('>>>inside showpassword')
    this.showPass = !this.showPass;
    if (this.showPass) {
      console.log('>>>this.showPass');
        this.type = 'text';
    } else {
      console.log('>>>this.!!!!showPass');
        this.type = 'password';
    }
  }

  doLogin(){
    this.loader.show();
    console.log('>>>Entered Login page');

    let param ={
      'LoginForm[username]': this.loginForm.value.email,
      'LoginForm[password]': this.loginForm.value.password,
      'LoginForm[device_token]': this.uniqueID,
      'LoginForm[device_type]':'1',
      'LoginForm[device_name]':'1'
      }
    console.log('type of param ', typeof param, JSON.stringify(param));
    this.http.post(environment.mainURL + "user/login", param, {'Content-type': 'application/json'})
      .then(result => {
        this.loader.hide();
        let response = JSON.parse(result.data);
          if (result['status'] == 200) {
            if(response.status !== "400" && response.status !== 400){
              this.env.loginState = true;
              this.storage.set('loginStatus', true);
              this.responseDetail= response.user_detail;
              this.storage.set('loginInfo', this.responseDetail);
              this.router.navigate(['/main']);
            }
              else{
                this.alert.show("Login credentials wrong");
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

  skipLogin(){
    this.storage.set('loginStatus', false);
    this.router.navigate(['/main']);
  }

  regWithFb() {
    this.fb.login(['public_profile', 'user_photos', 'email']).then((res: FacebookLoginResponse) => {
      console.log("fb login",res);
    }).catch((e) => {
      console.log('Error logging into Facebook', e);
    });
  }
  
//   async regWithFb(){
//     console.log("Logged in with Facebook");
//     this.fb.login(["public_profile", "email"])
//     .then(response =>{
//       console.log("Login data 117 :  ", response);
//          this.alert.show(">>>>logineed it ")
//         let userId = response.authResponse.userID;
//         this.fb.api('me?fields=id,name,email,first_name,picture.width(720).height(720).as(picture_large)', [])
//         .then(profile =>{
//             console.log("Login with Facebook profileprofileprofile :  ", profile);
//                 // var param = {
//                 //     social_type: '2',
//                 //     social_id: response.authResponse.accessToken,
//                 //     email: profile['email'],
//                 //     name: profile['name'],
//                 //     image_url: profile['picture_large']['data']['url'],
//                 //     device_type: '2',
//                 // };
//                 var param = {
//                   'User[email]': profile.email,
//                   'User[userId]': profile.userId,
//                   'User[provider]': 'Google',
//                   'LoginForm[device_token]': this.uniqueID,
//                   'LoginForm[device_type]':'1',
//                   'LoginForm[device_name]':'1',
//                   'img_url':''
//                 }
//                 this.storage.set('loginType', 'fb');
//                 console.log('params login with facebook', param);
//                 this.http.post(environment.mainURL + "user/social-login", param, {})
//                     .then(result => {
//                         let response = JSON.parse(result.data);
//                         console.log('Facebook Login data : ' + JSON.stringify(result));
//                         // if (result['status'] == 200) {
//                         //     if (response['status'] == true) {
//                         //         this.storage.set('loginInfo', response);
//                         //         this.storage.set('loginStatus', true);
//                         //         this.storage.get('loginInfo').then((val) => {
//                         //             console.log('Login Info : ' + JSON.stringify(val));
//                         //         });
//                         //          this.router.navigate(['/home']);
//                         //     } else {
//                         //         this.alert.show(">>>>>>>>error111");
//                         //     }
//                         // } else {
//                         //     // this.alert.show(result['message']);
//                         // }
//                     })
//     }, error =>{
//         console.log(">>error 159", error);
//     });

//   })
// }

  // async regWithFb(){
	// 	//the permissions your facebook app needs from the user
  //   const permissions = ["public_profile", "email"];
  //   console.log('>>>user facebook permissions 119', permissions);
	// 	this.fb.login(permissions)
	// 	.then(response =>{
  //     console.log('>>>user facebook response 122', response);
	// 		let userId = response.authResponse.userID;

	// 		//Getting name and gender properties
	// 		this.fb.api("/me?fields=name,email", permissions)
	// 		.then(user =>{
  //       console.log('>>>user facebook 127', user);
        
	// 			user.picture = "https://graph.facebook.com/" + userId + "/picture?type=large";
	// 			//now we have the users info, let's save it in the NativeStorage
	// 			this.storage.set('facebook_user',
	// 			{
	// 				name: user.name,
	// 				email: user.email,
	// 				picture: user.picture
	// 			})
	// 			.then(() =>{
	// 				this.router.navigate(["/user"]);
	// 			}, error =>{
	// 				console.log("error139", error);
	// 			})
	// 		})
	// 	}, error =>{
	// 		console.log("error144", error);
	// 	});
	// }
 

   doGoogleLogin(){
    this.googlePlus.login({})
    .then(user =>{
      console.log('>>>google plus response', user);
      var param = {
          'User[email]': user.email,
          'User[userId]': user.userId,
          'User[provider]': 'Google',
          'LoginForm[device_token]': this.uniqueID,
          'LoginForm[device_type]':'1',
          'LoginForm[device_name]':'1',
          'img_url':''
        }
        console.log('>>>>params sent here', param);
        this.http.post(environment.mainURL + "user/social-login", param, {'Content-type': 'application/json'})
       .then(result => {
        this.storage.set('loginType', 'google');
        let response = JSON.parse(result.data);
        console.log('user/social-login data: ', response);
          if (result['status'] == 200) {
            this.alert.show('Logged In Successfully');
            console.log('>>>>logged in data 186', response);
            this.responseDetail = response;
            this.env.loginState = true;
            this.storage.set('loginStatus', true);
            this.storage.set('loginInfo',this.responseDetail).then(() =>{
              this.router.navigate(["/main"]);
            }, error =>{
              console.log(error);
            })
            this.storage.get('loginInfo').then((val) =>{
              console.log('>>>getting logininfo', val)
            });
          }  
          else {
            this.alert.show('Something went wrong');
          };
       })
      .catch(error => { 
        console.log(error); 
      });
     
    }, err =>{
      console.log(err)
    });
  }
}
