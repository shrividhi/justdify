import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { HTTP } from '@ionic-native/http/ngx';
import { environment } from 'src/environments/environment';
// import { environment } from "src/environments/environment.prod";
import { ActionSheetController, Platform } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Storage } from '@ionic/storage';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { FilePath } from '@ionic-native/file-path/ngx';
import { LoaderService } from '../shared/services/loader.service';
import { AlertService } from '../shared/services/alert.service';
import { File, FileEntry, DirectoryEntry } from '@ionic-native/File/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';


@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
  providers: [File]
})
export class EditProfilePage implements OnInit {
 public profileForm: FormGroup;
 public sendImage: any;
 private UserInfo: any;
  imageURI:any;
  imageFileName:any;
  token: any;
  userId: any;
  displayimage: any; 
  profilePicture: any;
  viewImage: any;
  url: string;
  image;
  imageData;
  userImageData: any;
  UserImage: any;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private http: HTTP,
    private platform: Platform,
    private route: ActivatedRoute,
    public actionSheetController: ActionSheetController,
    private camera: Camera,
    private storage: Storage,
    public alert: AlertService,
    private loader: LoaderService,
    private filePath: FilePath,
    private fileTransfer: FileTransferObject,
     private transfer: FileTransfer,
      private file: File
  )
     {     
      this.profileForm = formBuilder.group({
        username: ['', Validators.required],
        email: ['', Validators.required],
        mobile: ['', Validators.required]
      })
     }

  ngOnInit() {
  }
  
  ionViewDidEnter(){
    this.storage.get('loginInfo').then((val) => {
      console.log('Login Info : ' + JSON.stringify(val));
      this.UserInfo = val.detail;
      console.log('>>>user info',this.UserInfo)
      if (val != null && val != undefined) {
        this.token = this.UserInfo.access_token;
        this.userId= this.UserInfo.id;
        this.UserImage = this.UserInfo.profile_file;
        this.profileForm.get('username').setValue(this.UserInfo.full_name);
        this.profileForm.get('email').setValue(this.UserInfo.email);
        this.profileForm.get('mobile').setValue(this.UserInfo.contact_no);
      }
    });
    // this.storage.get('userImage').then((val) => {
    //   this.UserImage = val;
    //   console.log('>>>user info',this.UserImage)
    // });
  }

  goBack(){
    this.router.navigate(['/main'])
  }

  async presentActionSheet() {
    let actionSheet = await this.actionSheetController.create({
      header: 'Select Media',
      buttons: [
        {
          text: 'Select from gallery',
          handler: () => {
            this.openPhotoGallery();
          }
        },
        {
          text: 'Capture a photo',
          handler: () => {
         this.capturePicture();
          }
          },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  openPhotoGallery() {
    const options: CameraOptions = {
      quality: 80,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 100,
      targetHeight: 120,
      allowEdit: true,
    }

    this.camera.getPicture(options).then((imageData) => {
      this.sendImage = imageData;
      console.log('>>this.send Image 127', this.sendImage);
      console.log('imgae data 128', imageData);
      this.sendFile();
    }).catch(error => { 
      console.log('>>>Error her 216',error); 
    });

  }

  capturePicture() {
    const options: CameraOptions = {
      quality: 80,
      sourceType: this.camera.PictureSourceType.CAMERA,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 100,
      targetHeight: 120,
      allowEdit: true,
    }
    this.camera.getPicture(options).then((imageData) => {
      this.sendImage = imageData;
      console.log('>>this.send Image 147', this.sendImage);
      console.log('imgae data 48', imageData);
        
      this.sendFile();

    }).catch(error => { 
      console.log('>>>error 240', error); 
    });
  }

  sendFile() {
    const fileTransfer: FileTransferObject = this.transfer.create();
    let options: FileUploadOptions = {
      fileKey: 'User[profile_file]',
      fileName: 'name.jpg',
      chunkedMode: false,
      mimeType: 'image/jpeg',
      headers: {},
    }
    
    fileTransfer.upload(this.sendImage, environment.mainURL + "user/update-profile?access_token=" +this.token, options)
      .then((data) => {
        console.log('>>>>type of image', this.sendImage);
        this.loader.hide();
        let response = JSON.parse(data['response']);
        console.log('File Response : ',JSON.stringify(data));
        this.viewImage = response.detail.profile_file;
        this.storage.set('userImage', this.viewImage);
        this.alert.show('Updated Successfully');
      })
      .catch(error => { 
        console.log('>>>>error265', error); 
      });
  }
  
   updateProfile(){
    let param ={
      'User[full_name]': this.profileForm.value.username,
      'User[contact_no]': this.profileForm.value.mobile,
      'User[date_of_birth]': ''
      }
    console.log('type of param ', typeof param, param, this.token);
    this.loader.show();
    this.http.post(environment.mainURL + "user/update?access_token=" +this.token, param, {'Content-type': 'application/json'})
      .then(result => {
        this.loader.hide();
        console.log('>>>>>profile data', JSON.stringify(result))
        let response = JSON.parse(result.data);
          if (result['status'] == 200) {
            this.alert.show('Profile Updated');
            var userData = response.detail;
            this.storage.set('loginInfo', userData);
            console.log("response userdata", userData);
            this.router.navigate(['/main']);
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
