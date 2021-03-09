import { Component, OnInit } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { Router, ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';
import { environment } from 'src/environments/environment';
import { AlertService } from '../shared/services/alert.service';
// import { environment } from "src/environments/environment.prod";
@Component({
  selector: 'app-chat-board',
  templateUrl: './chat-board.page.html',
  styleUrls: ['./chat-board.page.scss'],
})
export class ChatBoardPage implements OnInit {
  userMessages: any;
  token: any;
  fromUserId: any;
  toUserId: any;
  chatMessages: any;
  myMessagesId: any[];
  intervalTime: any;
  constructor(
    private http: HTTP,
    private route: ActivatedRoute,
    private router: Router, 
    private storage: Storage,
    public alert: AlertService
  ) {
    this.route.queryParams.subscribe(data => {
      this.userMessages = JSON.parse(data.chatData);
      this.fromUserId= this.userMessages.from_id;
      console.log('>>>>userMessages', this.userMessages);
     });
    this.storage.get('loginInfo').then((val)=>{
      this.token = val.access_token;
      this.toUserId = val.id;
      console.log('>>>>>user to id', this.toUserId);
      this.getMessages();
    });

    this.intervalTime = setInterval(() => { 
      this.getMessages(); // Now the "this" still references the component
   }, 1000);
  }

  ngOnInit() {
  }

  goBack(){
    this.router.navigate(['/chat']);
  }
  ngOnDestroy(){
    clearInterval(this.intervalTime);
  }

  getMessages(){
    console.log('>>>get messages');
    this.http.get(environment.mainURL + "message/get-message?last_id=" + this.toUserId + "&id=" + this.fromUserId + "&page=0&access_token=" +this.token, {}, {})
    .then(result => {
      let response = JSON.parse(result.data);
      if (result['status'] == 200) {
        let messages =[];
        this.chatMessages = response.list;
        console.log('messages here', this.chatMessages);
        this.chatMessages.forEach(function(item) {
          messages.push(item.from_user_id);
        });
        this.myMessagesId= messages;
        console.log('>>>>>>>>.my messages', this.myMessagesId);
      } else {
        this.alert.show('something wentt wrong');
      }
    })
     .catch(error => { 
      console.log(error); 
    });
  }

  sendMessage(message){

    let param = {
      'Chatmessage[message]': message,
      'Chatmessage[to_user_id]': this.fromUserId
    }
    this.http.post(environment.mainURL + "message/send-message?access_token=" +this.token, param, {'Content-type': 'application/json'})
    .then(result => {
      let response = JSON.parse(result.data);
      if (result['status'] == 200) {
        console.log('>>>>response chat list', response);
      } else {
        this.alert.show('something wentt wrong');
      }
    })
     .catch(error => { 
      console.log(error); 
    });
  }


  getNewMessages(){
    this.http.get(environment.mainURL + "message/get-new-messages?id=" +this.fromUserId +"&page=0&access_token=" +this.token, {}, {})
    .then(result => {
      let response = JSON.parse(result.data);
      if (result['status'] == 200) {
        console.log('>>>>response chat list', response);
      } else {
        this.alert.show('something wentt wrong');
      }
    })
     .catch(error => { 
      console.log(error); 
    });
  }

}
