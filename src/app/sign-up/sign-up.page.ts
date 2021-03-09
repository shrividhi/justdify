import { Component, OnInit } from '@angular/core';

import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { HTTP } from '@ionic-native/http/ngx';
import { environment } from 'src/environments/environment';
// import { environment } from "src/environments/environment.prod";
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from '../shared/services/alert.service';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
  public registerForm: FormGroup;
  private registerData : any;
  public showPass = false;
  public type = 'password';
  constructor(
  public formBuilder: FormBuilder,
  private http: HTTP,
  private route: ActivatedRoute,
  private router: Router,
  public alert: AlertService ) { 
    this.registerForm= formBuilder.group({
      username: ['', Validators.required],
      phoneNumber: ['',Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required]
      //is_agree: ['', Validators.required]
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

  doRegister() {
    let User ={
      'User[full_name]':this.registerForm.value.username,
      'User[email]': this.registerForm.value.email,
      'User[contact_no]':this.registerForm.value.phoneNumber,
      'User[password]': this.registerForm.value.password,
      'User[is_agree]':'1'
      }
    console.log('type of param ', typeof User, User);
    this.http.post(environment.mainURL + "user/signup", User, {'Content-type': 'application/json'})
      .then(result => {
        let response = JSON.parse(result.data);
        console.log('Register data : ',response);
        console.log('>>>>status data', response.status);
          if (result['status'] == 200) {
            if(response.status !== 400 && response.status !== "400"){
              this.alert.show('Registration done successfully');
              this.router.navigate(['/login']);
            }
            else{
              if(response.error === "Email is not a valid email address."){
                this.alert.show('Email is not a valid email address.');
              }
              else{
                if(response.error === "Email already exists."){
                  this.alert.show('Email already exists.');
                }
                else{
                  this.alert.show('Mobile no. already taken');
                }
              }
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

}
