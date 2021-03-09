import { Injectable } from '@angular/core';
import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';

import { TranslateService } from '@ngx-translate/core';
@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(public alertController: AlertController, public translate: TranslateService) { }


  async show(message) {


    var text1, text2;
    this.translate.get('ok').subscribe(res => {
      text1 = res;
    });
    this.translate.get('Info').subscribe(res => {
      text2 = res;
    });
    const alert = await this.alertController.create({
      header: text2,
      // subHeader: 'Subtitle',
      message: message,
      buttons: [text1]
    });

    await alert.present();
  }


}



