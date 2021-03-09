import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HTTP } from '@ionic-native/http/ngx';
import { Calendar } from '@ionic-native/calendar/ngx';
import { environment } from 'src/environments/environment';
// import { environment } from "src/environments/environment.prod";
import { Storage } from '@ionic/storage';
import { AlertService } from '../shared/services/alert.service';
@Component({
  selector: 'app-select-time',
  templateUrl: './select-time.page.html',
  styleUrls: ['./select-time.page.scss'],
})
export class SelectTimePage implements OnInit {
  staffSelection: any;
  minDate: string;
  selectedDate: string;
  salonId: any;
  timings: any;
  timings1: any;
  salonContainer: any=[];
  dateString: string;
  alterteredstringdate: any;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HTTP,
    private calendar: Calendar,
    private storage: Storage,
    public alert: AlertService
  ) {
    this.route.queryParams.subscribe(data => {
      this.staffSelection = JSON.parse(data.selectedStaff);
      this.storage.set('staffSelection', this.staffSelection);
      this.salonId = this.staffSelection.id;
      this.selectTimeSLot();
    });
    this.minDate = new Date().toISOString();
    this.selectedDate = new Date().toISOString();
   }

  ngOnInit() {
  }

  updateMyDate($event) {
    console.log('>>>>>>>>ionc change value', $event); // --> wil contains $event.day.value, $event.month.value and $event.year.value
    this.dateString = $event.substring(0, 10);
    this.storage.set('selectedDate', this.dateString);
    
  }
  goBack() {
    this.router.navigate(['/select-staff']);
  }
  selectTimeSLot(){
    this.http.get(environment.mainURL + "user/weekly-time?saloon_id=" + this.salonId,{} , {'Content-type': 'application/json'})
    .then(result => {
      let response = JSON.parse(result.data);
      if (result['status'] == 200) {
        this.timings= response['list'];
        this.storage.set('selectTime', this.timings);
        console.log('>>>>>this.timingss here', this.timings);
        }
         else {
          this.alert.show('something wentt wrong');
      }
    })
     .catch(error => { 
      console.log(error); 
    });
    
  }

  reviewOrder(selectedTime){
    this.router.navigate(['/review-order'], { queryParams: {timeSeletion: JSON.stringify(selectedTime)}});
  }

}
