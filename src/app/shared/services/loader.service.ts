// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class LoaderService {

//   constructor() { }
// }
import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  public loading: any;
  public isLoading = false;
  constructor(public loadingCtrl: LoadingController, public translate: TranslateService) { }

  
  async show() {
    this.isLoading = true;
    var loderText;
    this.translate.get('Please wait').subscribe(res => {
      loderText = res;
    });

    return this.loadingCtrl.create({
      spinner: 'bubbles',
      message: loderText,
      // animated: false,
    }).then(a => {
      a.present().then(() => {
        console.log('presented');
        if (!this.isLoading) {
          a.dismiss().then(() => console.log('abort presenting'));
        }
      });
    });
  }
  async hide() {
    this.isLoading = false;
    return this.loadingCtrl.dismiss().then(() => console.log('dismissed'));
  }




}
