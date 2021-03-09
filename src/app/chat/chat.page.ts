import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HTTP } from '@ionic-native/http/ngx';
import { Storage } from '@ionic/storage';
import { Device } from '@ionic-native/device/ngx';
import { environment } from 'src/environments/environment';
import { AlertService } from '../shared/services/alert.service';
// import { environment } from "src/environments/environment.prod";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  userData: any;
  userInfo: any;
  token: any;
  chatsList: any;

  constructor(
    private http: HTTP,
    private route: ActivatedRoute,
    private router: Router,
    private storage: Storage,
    public alert:AlertService
  ) { 
    this.storage.get('loginInfo').then((val)=>{
      this.userInfo = val;
      this.token = val.access_token;
      console.log('>>>>>token userInfo', this.userInfo, this.token);
      this.chatList();
    });
  }

  ngOnInit() {
  }

  goBack(){
    this.router.navigate(['/main']);
  }

  chatList(){
    console.log('>>>this.token', this.token);
    this.http.get(environment.mainURL + "message/list?search=&page=0&access_token=" +this.token, {}, {'Content-type': 'application/json'})
    .then(result => {
      let response = JSON.parse(result.data);
      if (result['status'] == 200) {
        console.log('>>>>response chat list', response);
        this.chatsList= response.list;
        console.log('>>>chatlist', this.chatsList);
        
      } else {
        this.alert.show('something wentt wrong');
      }
    })
     .catch(error => { 
      console.log(error); 
    });
  }

  searchChat(key){
    console.log('>>>this.token', this.token);
    this.http.get(environment.mainURL + "message/list?search=" + key + "&page=0&access_token=" +this.token, {}, {'Content-type': 'application/json'})
    .then(result => {
      let response = JSON.parse(result.data);
      if (result['status'] == 200) {
        console.log('>>>>response chat list', response);
        this.chatsList= response.list;
        console.log('>>>chatlist', this.chatsList);
        
      } else {
        this.alert.show('something wentt wrong');
      }
    })
     .catch(error => { 
      console.log(error); 
    });
  }

  goToChat(chatUser){
    this.router.navigate(['/chat-board'], {queryParams: {chatData: JSON.stringify(chatUser)}})
  }


  
}
