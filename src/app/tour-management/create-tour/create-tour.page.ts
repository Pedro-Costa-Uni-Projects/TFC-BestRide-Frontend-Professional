import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { TourServiceService } from '../tour-service.service';
import { ModalController, NavParams } from '@ionic/angular';
import { PointInterest } from '../create-tour-point/PointInterest';
import { CreateTourPointPage } from '../create-tour-point/create-tour-point.page';
import { NavigationExtras, Router } from '@angular/router';
@Component({
  selector: 'app-create-tour',
  templateUrl: './create-tour.page.html',
  styleUrls: ['./create-tour.page.scss'],
})
export class CreateTourPage implements OnInit {
  ionicForm: FormGroup;
  public isSubmitted = false;
  public ipoints_arr: Array<PointInterest> = [];
  public interest_points = false;

  constructor(
    public formBuilder: FormBuilder,
    private geocoder: NativeGeocoder,
    private tour_svc: TourServiceService,
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private router: Router
  ) {}

  ngOnInit() {
    this.ionicForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      photo: [''],
    });
  }

  ionViewDidEnter() {}

  image: any;
  loadImageFromDevice(event) {
    const file = event.target.files[0];

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      // note using fat arrow function here if we intend to point at current Class context.

      this.image = reader.result;
    };
  }

  public submitForm() {
    this.isSubmitted = true;
    if (!this.ionicForm.valid) {
      console.log('Please provide all the required values!');
      return false;
    } else {
      console.log(this.ionicForm.value);
      this.modalCtrl.dismiss();
      let navigationExtras: NavigationExtras = {
        queryParams: {
          data: this.ionicForm.value,
        },
      };
      const data = this.ionicForm.value;
      this.router.navigate(['/finish-tour'], navigationExtras);
    }
  }

  get errorControl() {
    return this.ionicForm.controls;
  }

  async openInterestPoint() {
    const modal = await this.modalCtrl.create({
      component: CreateTourPointPage,
    });

    // get Interest Point
    modal.onDidDismiss().then((data) => {
      console.log(data['data'].address);
      this.ipoints_arr.push({
        name: data['data'].name,
        address: data['data'].address,
      });
    });
    return await modal.present();
  }

  public close() {
    this.modalCtrl.dismiss();
  }
}