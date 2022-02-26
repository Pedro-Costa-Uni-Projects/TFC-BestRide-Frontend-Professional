import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RecoverAccountServiceService } from './recover-account-service.service';

@Component({
  selector: 'app-recover-account',
  templateUrl: './recover-account.page.html',
  styleUrls: ['./recover-account.page.scss'],
})
export class RecoverAccountPage implements OnInit {
  public recoverEmail: FormGroup;
  public isSubmittedEmail = false;
  public counter = 0;

  /* Password */
  public hide = true;
  public hide2 = true;

  constructor(
    private fb: FormBuilder,
    public router: Router,
    private service: RecoverAccountServiceService
  ) {}

  ngOnInit() {
    this.recoverEmail = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),
        ],
      ],
      code: [''],
      password: [
        '',
        [ Validators.pattern(
            '(?=[A-Za-z0-9@#$%^&+!=]+$)^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+!=])(?=.{8,}).*$'
          ),
        ],
      ],
      passConfirm: [''],
      
    },
    { validator: this.passwordMatchValidator }
    );
  }

  get errorControl() {
    return this.recoverEmail.controls;
  }

  public submitEmailForm() {
    this.isSubmittedEmail = true;
    if (!this.recoverEmail.valid) {
      console.log('Please provide all the required values!');
      return false;
    } else {
      this.counter++;
      console.log(this.counter);
      if (this.counter == 1) {
        console.log(this.recoverEmail.value);
        var email = this.recoverEmail.get('email').value;
        this.service.recoverAccount(email);
      } else if (this.counter == 2) {
        var code = this.recoverEmail.get('code').value;
        var pass = this.recoverEmail.get('password').value;
        this.service.codeVerification(code, pass, email);
        console.log('recover account');
      } else if (this.counter == 3) {
        console.log('done!!');
      }
    }
  }

  passwordMatchValidator(frm: FormGroup) {
    return frm.controls['password'].value === frm.controls['passConfirm'].value
      ? null
      : { mismatch: true };
  }

}
