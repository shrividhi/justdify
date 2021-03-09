import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { HTTP } from '@ionic-native/http/ngx';
import { environment } from 'src/environments/environment';
// import { environment } from "src/environments/environment.prod";
import { Router, ActivatedRoute } from '@angular/router';
import { LoaderService } from '../shared/services/loader.service';
import { AlertService } from '../shared/services/alert.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.page.html',
  styleUrls: ['./contact-us.page.scss'],
})
export class ContactUsPage implements OnInit {
  public contactForm: FormGroup;
  constructor( 
    public formBuilder: FormBuilder,
    private http: HTTP,
    private route: ActivatedRoute,
    private router: Router,
    public alert: AlertService,
    public loader: LoaderService ) { 
      this.contactForm= formBuilder.group({
        name: ['', Validators.required],
        email: ['', Validators.required],
        mobile: ['', Validators.required],
        message: ['', Validators.required],

      });
    }

  ngOnInit() {
  }

  goBack() {
    this.router.navigate(['/main']);
  }
  contactUs(){
    console.log('Contact');
    let param ={
      'ContactForm[email]': this.contactForm.value.email,
      'ContactForm[message]': this.contactForm.value.message,
    }
    console.log('type of param ', typeof param, param);
    this.loader.show();
    this.http.post(environment.mainURL + "user/contact", param, {'Content-type': 'application/json'})
      .then(result => {
        console.log('Login data here :', result);
        let response = JSON.parse(result.data);
          if (result['status'] == 200) {
            this.loader.hide();
            this.alert.show('Sent successfully');                
          } 
          else {
            this.alert.show('Something went wrong');
          };
       })
       
      .catch(error => { 
        console.log(error); 
      });
      this.contactForm.reset();
  }


}
