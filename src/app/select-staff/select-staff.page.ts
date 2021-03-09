import { Component, OnInit } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { Router,ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
// import { environment } from "src/environments/environment.prod";
import { Storage } from '@ionic/storage';
import { AlertService } from '../shared/services/alert.service';
@Component({
  selector: 'app-select-staff',
  templateUrl: './select-staff.page.html',
  styleUrls: ['./select-staff.page.scss'],
})
export class SelectStaffPage implements OnInit {
  staff: any;
  serviceSelection: any;
  saloon_id: any;
  salonContainer: any =[];

  constructor(
    private http: HTTP,
    private router: Router,
    private route: ActivatedRoute,
    private storage: Storage,
    public alert: AlertService
  ) {
    this.route.queryParams.subscribe(data => {
      console.log('queryParam data>>', data);
      this.serviceSelection = JSON.parse(data.selectedService);
      this.storage.set('serviceSelection', this.serviceSelection);
      this.saloon_id= this.serviceSelection.id;
      this.selectStaffList();
    });
   }

  ngOnInit() {
  }

  goBack() {
    this.router.navigate(['/select-services']);
  }
  selectStaffList(){
    this.http.get(environment.mainURL + "user/staff-details?saloon_id="+ this.saloon_id, {}, {'Content-type': 'application/json'})
    .then(result => {
      let response = JSON.parse(result.data);
      if (result['status'] == 200) {
        console.log('>>>>response', response);
        this.staff = response.list;
        this.storage.set('staff', this.staff);
        console.log('>>specialists', this.staff);
      } else {
        this.alert.show('something wentt wrong');
      }
    })
     .catch(error => { 
      console.log(error); 
    });
  }

  goToSelectTime(staffmember){
    this.router.navigate(['/select-time'], { queryParams: {selectedStaff: JSON.stringify(staffmember)}});
  }

}
