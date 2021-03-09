import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { HTTP } from '@ionic-native/http/ngx';
import { environment } from 'src/environments/environment';
// import { environment } from "src/environments/environment.prod";
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from '../shared/services/alert.service';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  public  forgotForm : FormGroup;
  message: any;
  constructor(
    public formBuilder: FormBuilder,
    private http: HTTP,
    private route: ActivatedRoute,
    private router: Router,
    public alert: AlertService,
  ) { 
    this.forgotForm = formBuilder.group({
      email: ['',Validators.required]
    })
   }

  ngOnInit() {
  }
  
  doForgot() {
    var param = {
      'User[email]': this.forgotForm.value.email
      };
    this.http.post(environment.mainURL + "user/recover", param,  {'Content-type': 'application/json'})
      .then(result => {
        let response = JSON.parse(result.data);
        console.log('Forgot response data : ' + JSON.stringify(result));
        if (result['status'] == 200) {
          if(response.status !== "400" && response.status !== 400){
            this.alert.show('Password reset link sent to your email');
            this.router.navigate(['/login']);
          }
            else{
              this.alert.show("Email not registered");
            }   
         
        } 
        else {
          this.alert.show('something went wrong')
        }
      })
      .catch(error => {
        console.log('error data : ' + JSON.stringify(error));
      });

  }
}
